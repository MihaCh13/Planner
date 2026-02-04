'use client';

import { useState } from 'react';
import { SidebarCalendar } from '@/components/schedule/sidebar-calendar';
import { ScheduleTable } from '@/components/schedule/schedule-table';
import { EventModal } from '@/components/schedule/event-modal';
import type { ScheduleEvent } from '@/lib/schedule-types';

export default function SchedulePlanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [defaultDay, setDefaultDay] = useState<string>('');
  const [defaultStartTime, setDefaultStartTime] = useState<string>('');
  const [defaultEndTime, setDefaultEndTime] = useState<string>('');

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setDefaultDay('');
    setDefaultStartTime('');
    setDefaultEndTime('');
    setIsModalOpen(true);
  };

  const handleCellClick = (day: string, startTime: string, endTime: string) => {
    setSelectedEvent(null);
    setDefaultDay(day);
    setDefaultStartTime(startTime);
    setDefaultEndTime(endTime);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-background via-blue-50/30 to-primary/5">
      {/* Main Content: Calendar Sidebar + Schedule Table */}
      <div className="flex flex-1 gap-4 px-4 md:px-6 py-3 overflow-hidden min-w-0">
        <SidebarCalendar />
        <div className="flex-1 min-w-0 overflow-hidden">
          <ScheduleTable 
            onCellClick={handleCellClick}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
        defaultDay={defaultDay}
        defaultStartTime={defaultStartTime}
        defaultEndTime={defaultEndTime}
      />
    </div>
  );
}
