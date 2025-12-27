import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  getTasks: () => ipcRenderer.invoke('get-tasks'),
  addTask: (title: string, priority: string) => ipcRenderer.invoke('add-task', { title, priority }),
  toggleTask: (id: number, completed: boolean) => ipcRenderer.invoke('toggle-task', { id, completed }),
  deleteTask: (id: number) => ipcRenderer.invoke('delete-task', id),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSetting: (key: string, value: string) => ipcRenderer.invoke('save-setting', { key, value }),
});
