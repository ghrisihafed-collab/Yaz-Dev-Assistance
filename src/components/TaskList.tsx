import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Check } from 'lucide-react';
import { clsx } from 'clsx';
import { Task } from '../types';

export const TaskList: React.FC = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await window.electronAPI.getTasks();
    setTasks(loadedTasks);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    await window.electronAPI.addTask(newTask, 'normal');
    setNewTask('');
    loadTasks();
  };

  const handleToggle = async (task: Task) => {
    // Optimistic update
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, completed: t.completed ? 0 : 1 } : t
    );
    setTasks(updatedTasks);
    
    await window.electronAPI.toggleTask(task.id, !task.completed);
  };

  const handleDelete = async (id: number) => {
    setTasks(tasks.filter(t => t.id !== id)); // Optimistic
    await window.electronAPI.deleteTask(id);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span className="text-blue-600">📝</span> {t('tasks.title')}
      </h3>

      {/* Input Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 mb-8">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={t('tasks.placeholder')}
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <button 
          type="submit"
          disabled={!newTask.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">{t('tasks.add_new')}</span>
        </button>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-100">
            <p>{t('tasks.no_tasks')}</p>
          </div>
        )}

        {tasks.map((task) => (
          <div 
            key={task.id}
            className={clsx(
              "group flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md",
              task.completed 
                ? "bg-gray-50 border-gray-100 opacity-75" 
                : "bg-white border-gray-100 hover:border-blue-200"
            )}
          >
            <button
              onClick={() => handleToggle(task)}
              className={clsx(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                task.completed 
                  ? "bg-green-500 border-green-500 text-white" 
                  : "border-gray-300 hover:border-blue-500"
              )}
            >
              {task.completed ? <Check size={14} strokeWidth={3} /> : null}
            </button>
            
            <span className={clsx(
              "flex-1 text-lg transition-all",
              task.completed ? "text-gray-400 line-through" : "text-gray-700"
            )}>
              {task.title}
            </span>

            <button
              onClick={() => handleDelete(task.id)}
              className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 hover:bg-red-50 rounded-lg"
              title="Delete"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
