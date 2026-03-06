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

    // Write the new message to a temp file
    fs.writeFileSync(msgFile, newMessage, 'utf8')

    // Script that rewrites the rebase todo: marks our target sha as 'reword'
    const seqEditorScript = `
const fs = require('fs')
const file = process.argv[1]
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

    // Script that replaces the commit message editor
    const msgEditor = path.join(tmpDir, 'gs-msg-editor.js')
    const msgEditorScript = `
const fs = require('fs')
const file = process.argv[1]
fs.writeFileSync(file, fs.readFileSync('${msgFile.replace(/\\/g, '\\\\')}', 'utf8'), 'utf8')
`
    fs.writeFileSync(msgEditor, msgEditorScript, 'utf8')

    await currentRepo.env({
      ...process.env,
      GIT_SEQUENCE_EDITOR: `node "${seqEditor}"`,
      GIT_EDITOR: `node "${msgEditor}"`,
    }).raw(['rebase', '--interactive', `${sha}^`])

    return { success: true }
  } catch (err) {
    // If rebase left repo in a bad state, abort it
    try { await currentRepo.raw(['rebase', '--abort']) } catch {}
    return { success: false, error: err.message }
  }
})

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})