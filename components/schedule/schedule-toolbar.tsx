"use client";

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAKEUP_STYLE, SEMINAR_STYLE, LAB_STYLE, LECTURE_STYLE } from './event-block';

interface ScheduleToolbarProps {
  onAddEvent: () => void;
}

export function ScheduleToolbar({ onAddEvent }: ScheduleToolbarProps) {
  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border-b border-primary/10 rounded-t-lg flex flex-row items-center justify-between px-4 py-2 flex-shrink-0" style={{ minHeight: '36px' }}>
      {/* LEFT SIDE: Legend Items */}
      <div className="flex flex-row items-center gap-6 flex-wrap">
        {/* Lecture */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md shadow-sm flex-shrink-0 border border-black/10" style={LECTURE_STYLE} />
          <span className="text-[clamp(9px,1vw,13px)] text-foreground/80 font-semibold whitespace-nowrap">Лекция</span>
        </div>

        {/* Seminar */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md shadow-sm flex-shrink-0 border border-black/10" style={SEMINAR_STYLE} />
          <span className="text-[clamp(9px,1vw,13px)] text-foreground/80 font-semibold whitespace-nowrap">Семинарно упражнение</span>
        </div>

        {/* Lab */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md shadow-sm flex-shrink-0 border-2 border-slate-300" style={{ backgroundColor: '#E3D0FF' }} />
          <span className="text-[clamp(9px,1vw,13px)] text-foreground/80 font-semibold whitespace-nowrap">Лабораторно упражнение</span>
        </div>

        {/* Makeup */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-md shadow-sm flex-shrink-0 border border-black/10" style={MAKEUP_STYLE} />
          <span className="text-[clamp(9px,1vw,13px)] text-foreground/80 font-semibold whitespace-nowrap">Отработване</span>
        </div>

        {/* Separator */}
        <div className="h-5 w-px bg-slate-300 mx-1 flex-shrink-0" />

        {/* Odd Week */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded flex-shrink-0 border-2 border-blue-400/50 shadow-sm" style={{ backgroundColor: '#85daff' }} />
          <span className="text-[clamp(9px,1vw,13px)] text-foreground/80 font-semibold whitespace-nowrap">Нечетна седмица</span>
        </div>

        {/* Even Week */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded flex-shrink-0 border-2 border-pink-400/50 shadow-sm" style={{ backgroundColor: '#ff9ec6' }} />
          <span className="text-[clamp(9px,1vw,13px)] text-foreground/80 font-semibold whitespace-nowrap">Четна седмица</span>
        </div>
      </div>

      {/* RIGHT SIDE: Add Event Button */}
      <Button
        onClick={onAddEvent}
        size="sm"
        className="h-7 px-2 text-[clamp(9px,1vw,13px)] bg-primary hover:bg-primary/90 whitespace-nowrap flex-shrink-0 ml-3 font-semibold"
      >
        <Plus className="w-3 h-3 mr-1" />
        Добави
      </Button>
    </div>
  );
}
