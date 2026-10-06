import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Kanban,
  List,
  Calendar,
  User,
  Clock,
  AlertCircle,
  Tag,
  CheckCircle2,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { Task } from '../types/index.ts';

export function TasksPage() {
  const { activeBusiness, currentUser } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as Task['status'],
    priority: 'medium' as Task['priority'],
    assignedToName: currentUser?.name || 'Administrator',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    labels: 'Operations, CRM'
  });

  const loadTasks = () => {
    if (!activeBusiness) return;
    setLoading(true);
    api.tasks.list(activeBusiness.id)
      .then(res => setTasks(res.tasks))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
  }, [activeBusiness?.id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness || !newTask.title) return;

    try {
      const created = await api.tasks.create(activeBusiness.id, {
        ...newTask,
        labels: newTask.labels.split(',').map(s => s.trim()).filter(Boolean)
      });
      setTasks(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      setNewTask({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedToName: currentUser?.name || 'Administrator',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        labels: 'Operations, CRM'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const updateTaskStatus = (taskId: string, nextStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: nextStatus } : t));
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded uppercase">Urgent</span>;
      case 'high':
        return <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase">High</span>;
      case 'medium':
        return <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 rounded uppercase">Medium</span>;
      case 'low':
        return <span className="text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded uppercase">Low</span>;
    }
  };

  const columns: { id: Task['status']; label: string; count: number }[] = [
    { id: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length },
    { id: 'in_progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Business Task Management</h1>
          <p className="text-xs text-slate-400">
            Sprint coordination, inventory audits, and financial reconciliation workflows
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col min-h-[500px]">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{col.label}</h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-lg bg-slate-900 border border-slate-800/90 shadow-sm hover:border-slate-700 transition-colors text-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="font-semibold text-slate-100 leading-snug">{t.title}</h4>
                          {getPriorityBadge(t.priority)}
                        </div>
                        {t.description && (
                          <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{t.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {t.labels.map((lbl, idx) => (
                            <span key={idx} className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800/80">
                              #{lbl}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{t.assignedToName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px]">{t.dueDate}</span>
                          {/* Next status trigger */}
                          {col.id !== 'completed' && (
                            <button
                              onClick={() => updateTaskStatus(t.id, col.id === 'todo' ? 'in_progress' : 'completed')}
                              title="Move to next stage"
                              className="p-1 hover:text-indigo-400 text-slate-500 rounded"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Task Details</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assignee</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 pr-5 text-right">Quick Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-5">
                    <div className="font-semibold text-slate-200">{t.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{t.description}</div>
                  </td>
                  <td className="p-3.5">{getPriorityBadge(t.priority)}</td>
                  <td className="p-3.5 font-mono text-[11px] capitalize">{t.status.replace('_', ' ')}</td>
                  <td className="p-3.5 text-slate-300">{t.assignedToName}</td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{t.dueDate}</td>
                  <td className="p-3.5 pr-5 text-right">
                    <select
                      value={t.status}
                      onChange={(e) => updateTaskStatus(t.id, e.target.value as any)}
                      className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-200 focus:outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Create Business Task</h3>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit supplier SLA for sensor hub delivery"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Actionable steps or deliverables required..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newTask.assignedToName}
                    onChange={(e) => setNewTask({ ...newTask, assignedToName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Labels (comma separated)</label>
                <input
                  type="text"
                  value={newTask.labels}
                  onChange={(e) => setNewTask({ ...newTask, labels: e.target.value })}
                  placeholder="e.g. Finance, Invoices, Compliance"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
