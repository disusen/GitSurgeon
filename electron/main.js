const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const simpleGit = require('simple-git')

const isDev = process.env.NODE_ENV === 'development'

const fs = require('fs')
const os = require('os')

let currentRepo = null

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'GitSurgeon',
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// Open folder picker and return selected path
ipcMain.handle('dialog:openFolder', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })
  if (result.canceled || result.filePaths.length === 0) return null
  return result.filePaths[0]
})

// Open a git repo at the given path
ipcMain.handle('git:openRepo', async (_, repoPath) => {
  try {
    const git = simpleGit(repoPath)
    const isRepo = await git.checkIsRepo()
    if (!isRepo) return { success: false, error: 'Not a git repository.' }

    currentRepo = git
    const branch = await git.revparse(['--abbrev-ref', 'HEAD'])
    return { success: true, branch: branch.trim() }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Get commits from HEAD
ipcMain.handle('git:getCommits', async (_, limit = 100) => {
  if (!currentRepo) return { success: false, error: 'No repo open.' }

  try {
    const log = await currentRepo.log({ maxCount: limit })
    return { success: true, commits: log.all }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Amend the most recent commit message
ipcMain.handle('git:amendMessage', async (_, newMessage) => {
  if (!currentRepo) return { success: false, error: 'No repo open.' }
  try {
    await currentRepo.raw(['commit', '--amend', '-m', newMessage])
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Undo the most recent commit, keeping changes staged
ipcMain.handle('git:undoCommit', async () => {
  if (!currentRepo) return { success: false, error: 'No repo open.' }
  try {
    await currentRepo.raw(['reset', '--soft', 'HEAD~1'])
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

// Reword any commit's message
ipcMain.handle('git:rewordCommit', async (_, sha, newMessage) => {
  if (!currentRepo) return { success: false, error: 'No repo open.' }

  try {
    const tmpDir = os.tmpdir()
    const seqEditor = path.join(tmpDir, 'gs-seq-editor.js')
    const msgFile = path.join(tmpDir, 'gs-commit-msg.txt')

    fs.writeFileSync(msgFile, newMessage, 'utf8')

    const seqEditorScript = `
const fs = require('fs')
const file = process.argv[2]
const lines = fs.readFileSync(file, 'utf8').split('\\n')
const rewritten = lines.map(line => {
  if (line.startsWith('pick') && line.includes('${sha.slice(0, 7)}')) {
    return line.replace(/^pick/, 'reword')
  }
  return line
})
fs.writeFileSync(file, rewritten.join('\\n'), 'utf8')
`
    fs.writeFileSync(seqEditor, seqEditorScript, 'utf8')

    const msgEditor = path.join(tmpDir, 'gs-msg-editor.js')
    const msgEditorScript = `
const fs = require('fs')
const file = process.argv[2]
fs.writeFileSync(file, fs.readFileSync('${msgFile.replace(/\\/g, '\\\\')}', 'utf8'), 'utf8')
`
    fs.writeFileSync(msgEditor, msgEditorScript, 'utf8')

    // Check if this is the root commit (no parent)
    let rebaseTarget
    try {
      await currentRepo.raw(['rev-parse', '--verify', `${sha}^`])
      rebaseTarget = `${sha}^`
    } catch {
      rebaseTarget = '--root'
    }

    await currentRepo.env({
      ...process.env,
      GIT_SEQUENCE_EDITOR: `node "${seqEditor}"`,
      GIT_EDITOR: `node "${msgEditor}"`,
    }).raw(['rebase', '--interactive', rebaseTarget])

    return { success: true }
  } catch (err) {
    try { await currentRepo.raw(['rebase', '--abort']) } catch {}
    return { success: false, error: err.message }
  }
})

// Squash a contiguous range of commits into one
ipcMain.handle('git:squashCommits', async (_, shas, newMessage) => {
  if (!currentRepo) return { success: false, error: 'No repo open.' }

  try {
    const tmpDir = os.tmpdir()
    const seqEditor = path.join(tmpDir, 'gs-seq-editor.js')
    const msgFile = path.join(tmpDir, 'gs-commit-msg.txt')

    fs.writeFileSync(msgFile, newMessage, 'utf8')

    const seqEditorScript = `
const fs = require('fs')
const file = process.argv[2]
const shas = ${JSON.stringify(shas.map(s => s.slice(0, 7)))}
const content = fs.readFileSync(file, 'utf8')
let first = true
const lines = content.split('\\n')
const rewritten = lines.map(line => {
  const match = shas.find(sha => line.startsWith('pick') && line.includes(sha))
  if (match) {
    if (first) { first = false; return line }
    return line.replace(/^pick/, 'squash')
  }
  return line
})
fs.writeFileSync(file, rewritten.join('\\n'), 'utf8')
`
    fs.writeFileSync(seqEditor, seqEditorScript, 'utf8')

    const msgEditor = path.join(tmpDir, 'gs-msg-editor.js')
    const msgEditorScript = `
const fs = require('fs')
const file = process.argv[2]
fs.writeFileSync(file, fs.readFileSync('${msgFile.replace(/\\/g, '\\\\')}', 'utf8'), 'utf8')
`
    fs.writeFileSync(msgEditor, msgEditorScript, 'utf8')

    const oldest = shas[shas.length - 1]
    await currentRepo.env({
      ...process.env,
      GIT_SEQUENCE_EDITOR: `node "${seqEditor}"`,
      GIT_EDITOR: `node "${msgEditor}"`,
    }).raw(['rebase', '--interactive', `${oldest}^`])

    return { success: true }
  } catch (err) {
    try { await currentRepo.raw(['rebase', '--abort']) } catch {}
    return { success: false, error: err.message }
  }
})

// Force push current branch to remote
ipcMain.handle('git:forcePush', async () => {
  if (!currentRepo) return { success: false, error: 'No repo open.' }
  try {
    const branch = await currentRepo.revparse(['--abbrev-ref', 'HEAD'])
    await currentRepo.raw(['push', '--force-with-lease', 'origin', branch.trim()])
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})