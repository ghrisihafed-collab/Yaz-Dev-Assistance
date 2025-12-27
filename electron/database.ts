import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = process.env.NODE_ENV === 'development'
  ? './user_data.db' 
  : path.join(app.getPath('userData'), 'user_data.db');

const db = new Database(dbPath, { verbose: console.log });
db.pragma('journal_mode = WAL');

// Initialize Database Schema
export function initDB() {
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      priority TEXT DEFAULT 'normal'
    );
  `;
  
  const createSettingsTable = `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `;
  
  db.exec(createTasksTable);
  db.exec(createSettingsTable);
}

// Database Operations
export const dbOps = {
  getTasks: () => {
    const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
    return stmt.all();
  },

  addTask: (title: string, priority: string = 'normal') => {
    const stmt = db.prepare('INSERT INTO tasks (title, priority) VALUES (?, ?)');
    const info = stmt.run(title, priority);
    return { id: info.lastInsertRowid, title, completed: 0, priority };
  },

  toggleTask: (id: number, completed: boolean) => {
    const stmt = db.prepare('UPDATE tasks SET completed = ? WHERE id = ?');
    stmt.run(completed ? 1 : 0, id);
    return true;
  },

  deleteTask: (id: number) => {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
    return true;
  },

  // Settings Operations
  getSettings: () => {
    const stmt = db.prepare('SELECT * FROM settings');
    return stmt.all();
  },

  saveSetting: (key: string, value: string) => {
    const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?');
    stmt.run(key, value, value);
    return true;
  }
};
