const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const simpleGit = require('simple-git')

const isDev = process.env.NODE_ENV === 'development'

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

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})