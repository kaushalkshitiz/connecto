'use client';

// =============================================================================
// AI Athlete Growth Platform
// Tasks & Training Management Page (/dashboard/tasks)
// =============================================================================

import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { TaskAssignModal } from '../../../components/forms/TaskAssignModal';
import { TaskProofModal } from '../../../components/forms/TaskProofModal';
import { TaskCard } from '../../../components/ui/TaskCard';
import { canEditTrainingPlans } from '../../../lib/rbac';
import { TaskStatus, TrainingTask } from '../../../types';
import {
  CheckCircle2,
  CheckSquare,
  Clock,
  Filter,
  Plus,
  Search,
  ShieldCheck,
} from 'lucide-react';

export default function TasksPage() {
  const {
    tasks,
    activeUser,
    activeRole,
    users,
    updateTaskStatus,
  } = useDemo();

  const isCoach = canEditTrainingPlans(activeRole);

  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedProofTask, setSelectedProofTask] = useState<TrainingTask | null>(
    null
  );

  // Filter tasks based on role, search, status, and category
  const visibleTasks = tasks.filter((t) => {
    const belongsToUser = isCoach || t.athlete_id === activeUser.id;
    if (!belongsToUser) return false;

    if (filterCategory !== 'All' && t.category !== filterCategory) return false;
    if (filterStatus !== 'All' && t.status !== filterStatus) return false;
    if (searchQuery) {
      const matchTitle = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchInst = t.instructions
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchTitle || matchInst;
    }
    return true;
  });

  const categories = ['All', 'Sprint Drills', 'Strength', 'Recovery', 'Video Analysis', 'Endurance'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isCoach ? 'Training & Workout Task Management' : 'My Today’s Training Tasks'}
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isCoach
              ? 'Assign structured workouts, video reviews, and rehab drills to athletes with proof verification.'
              : 'Complete your assigned training sessions, recovery protocols, and upload completion proof.'}
          </p>
        </div>

        {isCoach && (
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            <Plus size={16} />
            <span>Assign New Task</span>
          </button>
        )}
      </div>

      {/* Analytics Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Assigned
            </span>
            <Clock size={16} className="text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {visibleTasks.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Active in training cycle
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completed Tasks
            </span>
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {visibleTasks.filter((t) => t.status === 'Completed').length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Verified proof submitted
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending / In Progress
            </span>
            <ShieldCheck size={16} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {
              visibleTasks.filter(
                (t) => t.status === 'Pending' || t.status === 'In Progress'
              ).length
            }
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Requires completion
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
            <Filter size={14} />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-blue-900 text-white shadow-sm dark:bg-emerald-600'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="rounded-xl border border-slate-300 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      {visibleTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <CheckSquare className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            No training tasks found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {isCoach
              ? 'Click "Assign New Task" to create a task for your athletes.'
              : 'You have completed all assigned training tasks for today!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleTasks.map((t) => {
            const athlete = users.find((u) => u.id === t.athlete_id);
            return (
              <TaskCard
                key={t.id}
                task={t}
                athleteName={athlete?.name}
                isCoachView={isCoach}
                onStatusChange={(id, status) => updateTaskStatus(id, status)}
                onUploadProof={(task) => setSelectedProofTask(task)}
              />
            );
          })}
        </div>
      )}

      {/* Assign Task Modal */}
      <TaskAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
      />

      {/* Proof Upload Modal */}
      <TaskProofModal
        isOpen={!!selectedProofTask}
        onClose={() => setSelectedProofTask(null)}
        task={selectedProofTask}
      />
    </div>
  );
}
