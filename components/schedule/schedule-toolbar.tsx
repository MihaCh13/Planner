'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScheduleToolbarProps {
  onAddEvent: () => void;
}

export function ScheduleToolbar({ onAddEvent }: ScheduleToolbarProps) {
  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border-b border-primary/10 rounded-t-lg flex flex-row items-center justify-between px-4 h-14 flex-shrink-0 overflow-x-auto scrollbar-hide">
      {/* LEFT SIDE: Legend Items */}
      <div className="flex flex-row items-center gap-5 min-w-max">
        {/* Lecture */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md lecture-bg shadow-sm" />
          <span className="text-sm text-foreground/80 font-semibold whitespace-nowrap">Лекция</span>
        </div>

        {/* Seminar */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md seminar-bg shadow-sm" />
          <span className="text-sm text-foreground/80 font-semibold whitespace-nowrap">Семинарно упражнение</span>
        </div>

        {/* Lab */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md lab-bg shadow-sm" />
          <span className="text-sm text-foreground/80 font-semibold whitespace-nowrap">Лабораторно упражнение</span>
        </div>

        {/* Makeup */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded-md makeup-bg shadow-sm" />
          <span className="text-sm text-foreground/80 font-semibold whitespace-nowrap">Отработване</span>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-300 mx-1" />

        {/* Odd Week */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: '#85daff' }} />
          <span className="text-sm text-foreground/80 font-semibold whitespace-nowrap">Нечетна</span>
        </div>

        {/* Even Week */}
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded" style={{ backgroundColor: '#ff9ec6' }} />
          <span className="text-sm text-foreground/80 font-semibold whitespace-nowrap">Четна</span>
        </div>
      </div>

      {/* SEPARATOR */}
      <div className="h-7 w-px bg-slate-300 mx-2 flex-shrink-0" />

      {/* RIGHT SIDE: Add Event Button */}
      <Button
        onClick={onAddEvent}
        size="sm"
        className="h-8 px-3 text-sm bg-primary hover:bg-primary/90 whitespace-nowrap flex-shrink-0"
      >
        <Plus className="w-4 h-4 mr-1" />
        Добави
      </Button>
    </div>
  );
}
