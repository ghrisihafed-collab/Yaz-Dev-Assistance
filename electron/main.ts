import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDB, dbOps } from './database';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow: BrowserWindow | null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Check if we are in dev mode
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
};

app.whenReady().then(() => {
  initDB(); // Initialize Database
  
  // IPC Handlers
  ipcMain.handle('get-tasks', () => dbOps.getTasks());
  ipcMain.handle('add-task', (_, task) => dbOps.addTask(task.title, task.priority));
  ipcMain.handle('toggle-task', (_, { id, completed }) => dbOps.toggleTask(id, completed));
  ipcMain.handle('delete-task', (_, id) => dbOps.deleteTask(id));

  ipcMain.handle('get-settings', () => dbOps.getSettings());
  ipcMain.handle('save-setting', (_, { key, value }) => dbOps.saveSetting(key, value));

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
