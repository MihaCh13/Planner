"use client";

import { ClipboardList, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAKEUP_STYLE, SEMINAR_STYLE, LAB_STYLE, LECTURE_STYLE } from './event-block';

interface LegendProps {
  onAddEvent: () => void;
}

export function Legend({ onAddEvent }: LegendProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-primary/10 px-4 md:px-6 py-2 flex-shrink-0 overflow-x-auto scrollbar-thin">
      <div className="flex items-center justify-between gap-4 md:gap-6 min-w-max">
        {/* Legend Items */}
        <div className="flex items-center gap-4 md:gap-6 lg:gap-8">
          <span className="font-bold text-primary text-xs md:text-sm whitespace-nowrap flex items-center gap-1.5 md:gap-2">
            <ClipboardList className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Легенда:
          </span>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-md shadow-sm" style={LECTURE_STYLE} />
            <span className="text-xs md:text-sm text-foreground/80 font-medium">Лекция</span>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-md shadow-sm" style={SEMINAR_STYLE} />
            <span className="text-xs md:text-sm text-foreground/80 font-medium">Семинарно</span>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-md shadow-sm" style={{ backgroundColor: '#E3D0FF', border: '1px solid #CEBDE6' }} />
            <span className="text-xs md:text-sm text-foreground/80 font-medium">Лабораторно</span>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-md shadow-sm" style={MAKEUP_STYLE} />
            <span className="text-xs md:text-sm text-foreground/80 font-medium">Отработване</span>
          </div>
          
          <div className="h-5 md:h-6 w-px bg-border" />
          
          <div className="flex items-center gap-1.5 md:gap-2 text-foreground/80">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded" style={{ backgroundColor: '#85daff' }} />
            <span className="text-xs md:text-sm font-medium">Нечетна</span>
          </div>
          
          <div className="flex items-center gap-1.5 md:gap-2 text-foreground/80">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded" style={{ backgroundColor: '#ff9ec6' }} />
            <span className="text-xs md:text-sm font-medium">Четна</span>
          </div>
        </div>

        {/* Add Event Button - Right aligned */}
        <Button 
          onClick={onAddEvent}
          size="sm"
          className="ml-auto h-8 px-3 text-xs bg-primary hover:bg-primary/90"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Добави
        </Button>
      </div>
    </div>
  );
}
