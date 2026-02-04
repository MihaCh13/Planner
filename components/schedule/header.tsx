'use client';

import { useState, useMemo } from 'react';
import { useScheduleStore } from '@/lib/schedule-store';
import { CalendarConfigModal } from './calendar-config-modal';

interface HeaderProps {
  onAddEvent: () => void;
}

export function Header({ onAddEvent }: HeaderProps) {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const { calendarConfig, semester } = useScheduleStore();

  // Calculate academic year from calendar config
  const academicYear = useMemo(() => {
    if (!calendarConfig) return null;
    
    try {
      const winterStart = calendarConfig.winterSemester.start 
        ? new Date(calendarConfig.winterSemester.start) 
        : null;
      const summerEnd = calendarConfig.summerSemester.end 
        ? new Date(calendarConfig.summerSemester.end) 
        : null;
      
      if (winterStart && summerEnd) {
        const startYear = winterStart.getFullYear();
        const endYear = summerEnd.getFullYear();
        return `${startYear}/${endYear}`;
      }
      
      if (winterStart) {
        return `${winterStart.getFullYear()}/${winterStart.getFullYear() + 1}`;
      }
      
      if (summerEnd) {
        return `${summerEnd.getFullYear() - 1}/${summerEnd.getFullYear()}`;
      }
    } catch {
      return null;
    }
    
    return null;
  }, [calendarConfig]);

  return (
    <>
      <div className="h-0 flex-shrink-0" />
      <CalendarConfigModal 
        isOpen={isCalendarModalOpen} 
        onClose={() => setIsCalendarModalOpen(false)} 
      />
    </>
  );
}
