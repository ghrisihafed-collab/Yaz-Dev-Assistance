export interface Task {
  id: number;
  title: string;
  completed: number; // SQLite uses 0/1 for booleans
  priority: 'normal' | 'high' | 'urgent';
  created_at?: string;
}

export interface Setting {
  key: string;
  value: string;
}

declare global {
  interface Window {
    electronAPI: {
      platform: string;
      getTasks: () => Promise<Task[]>;
      addTask: (title: string, priority: string) => Promise<Task>;
      toggleTask: (id: number, completed: boolean) => Promise<boolean>;
      deleteTask: (id: number) => Promise<boolean>;
      getSettings: () => Promise<Setting[]>;
      saveSetting: (key: string, value: string) => Promise<boolean>;
    };
  }
}
