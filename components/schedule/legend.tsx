'use client';

import { ClipboardList } from 'lucide-react';

export function Legend() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border-b border-primary/10 px-4 md:px-6 py-3 md:py-4 flex-shrink-0 overflow-x-auto scrollbar-thin">
      <div className="flex items-center gap-4 md:gap-6 lg:gap-8 min-w-max">
        <span className="font-bold text-primary text-xs md:text-sm lg:text-base whitespace-nowrap flex items-center gap-1.5 md:gap-2">
          <ClipboardList className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
          Легенда:
        </span>
        
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-md lecture-bg shadow-sm" />
          <span className="text-xs md:text-sm lg:text-base text-foreground/80 font-medium">Лекция</span>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-md seminar-bg shadow-sm" />
          <span className="text-xs md:text-sm lg:text-base text-foreground/80 font-medium">Семинарно упражнение</span>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-md lab-bg shadow-sm" />
          <span className="text-xs md:text-sm lg:text-base text-foreground/80 font-medium">Лабораторно упражнение</span>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-md makeup-bg shadow-sm" />
          <span className="text-xs md:text-sm lg:text-base text-foreground/80 font-medium">Отработване</span>
        </div>
        
        <div className="h-5 md:h-6 lg:h-7 w-px bg-border" />
        
        <div className="flex items-center gap-1.5 md:gap-2 text-foreground/80">
          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded" style={{ backgroundColor: '#85daff' }} />
          <span className="text-xs md:text-sm lg:text-base font-medium">Нечетна седмица</span>
        </div>
        
        <div className="flex items-center gap-1.5 md:gap-2 text-foreground/80">
          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded" style={{ backgroundColor: '#ff9ec6' }} />
          <span className="text-xs md:text-sm lg:text-base font-medium">Четна седмица</span>
        </div>
      </div>
    </div>
  );
}
