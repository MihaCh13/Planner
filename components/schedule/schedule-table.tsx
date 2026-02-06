'use client';

import React from 'react';

import { useMemo } from 'react';
import { TIME_SLOTS, DAYS, DAY_NAMES, getSlotIndex, getSlotCountBetween } from '@/lib/schedule-types';
import type { ScheduleEvent } from '@/lib/schedule-types';
import { useScheduleStore } from '@/lib/schedule-store';
import { ScheduleCell } from './schedule-cell';
import { ScheduleToolbar } from './schedule-toolbar';
import { UtensilsCrossed } from 'lucide-react';

interface ScheduleTableProps {
  onCellClick: (day: string, startTime: string, endTime: string) => void;
  onEventClick: (event: ScheduleEvent) => void;
  onAddEvent: () => void;
}

export function ScheduleTable({ onCellClick, onEventClick, onAddEvent }: ScheduleTableProps) {
  const events = useScheduleStore((state) => state.events);

  // Group events by day and start slot
  const eventGrid = useMemo(() => {
    const grid: Record<string, Record<number, ScheduleEvent[]>> = {};
    
    DAYS.forEach((day) => {
      grid[day] = {};
      TIME_SLOTS.forEach((_, idx) => {
        grid[day][idx] = [];
      });
    });

    events.forEach((event) => {
      const startIdx = getSlotIndex(event.start_time);
      if (startIdx !== -1 && grid[event.day]) {
        grid[event.day][startIdx].push(event);
      }
    });

    return grid;
  }, [events]);

  // Track which cells are covered by rowspan
  const occupiedCells = useMemo(() => {
    const occupied: Record<string, Set<number>> = {};
    DAYS.forEach((day) => {
      occupied[day] = new Set();
    });

    events.forEach((event) => {
      const startIdx = getSlotIndex(event.start_time);
      const slotCount = getSlotCountBetween(event.start_time, event.end_time);
      
      if (startIdx !== -1) {
        let coveredSlots = 0;
        for (let i = startIdx + 1; i < TIME_SLOTS.length && coveredSlots < slotCount - 1; i++) {
          if (!TIME_SLOTS[i].lunch) {
            occupied[event.day].add(i);
            coveredSlots++;
          } else {
            // Skip lunch row in occupied calculation but don't count it
            occupied[event.day].add(i);
          }
        }
      }
    });

    return occupied;
  }, [events]);

  // Calculate rowspan for events
  const getRowSpan = (day: string, slotIdx: number): number => {
    const cellEvents = eventGrid[day]?.[slotIdx] || [];
    if (cellEvents.length === 0) return 1;

    let maxSlotCount = 1;
    cellEvents.forEach((event) => {
      const slotCount = getSlotCountBetween(event.start_time, event.end_time);
      if (slotCount > maxSlotCount) maxSlotCount = slotCount;
    });

    // Account for lunch break
    const lunchIdx = TIME_SLOTS.findIndex(s => s.lunch);
    let rowSpan = maxSlotCount;
    
    // If span would cross lunch, add 1 for the lunch row
    const endIdx = slotIdx + maxSlotCount - 1;
    if (slotIdx < lunchIdx && endIdx >= lunchIdx) {
      rowSpan += 1;
    }
    
    return Math.max(1, rowSpan);
  };

  

  return (
    <div className="schedule-table-wrapper flex flex-col h-full overflow-hidden">
      <ScheduleToolbar onAddEvent={onAddEvent} />
      <div className="schedule-table-grid">
        {/* HEADER ROW */}
        <div
          className="schedule-header-time"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 248, 169, 0.9) 0%, rgba(255, 228, 189, 0.9) 100%)',
            color: '#444',
            borderBottom: '3px solid rgba(0,0,0,0.1)'
          }}
        >Час</div>
        {DAYS.map((day) => (
          <div
            key={`header-${day}`}
            className="schedule-header-day"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 248, 169, 0.9) 0%, rgba(255, 228, 189, 0.9) 100%)',
              color: '#444',
              borderBottom: '2px solid rgba(0,0,0,0.05)'
            }}
          >
            {DAY_NAMES[day]}
          </div>
        ))}

        {/* CONTENT ROWS - Time slots and events */}
        {TIME_SLOTS.map((slot, slotIdx) => {
          if (slot.lunch) {
            // LUNCH BREAK ROW - Merged cell spanning all day columns
            return (
              <React.Fragment key={`lunch-${slotIdx}`}>
                <div className="schedule-lunch-label" style={{ borderBottom: '3px solid rgba(0,0,0,0.1)' }}>
                  {slot.start}–{slot.end}
                </div>
                <div
                  className="col-span-5 flex flex-row items-center justify-center gap-3 p-2 font-bold text-stone-900/90 bg-gradient-to-r from-[#FFC2A9]/80 to-[#FEEBAE]/80 backdrop-blur-md border border-white/30 border-t-2 border-white/70 border-b-[3px] border-stone-900/10 ring-1 ring-white/10 shadow-lg"
                >
                  <UtensilsCrossed className="w-6 h-6" />
                  <span>Обедна почивка</span>
                </div>
              </React.Fragment>
            );
          }

          // CONTENT ROW - Time slot with events
          return (
            <React.Fragment key={`slot-${slotIdx}`}>
              <div className="schedule-time-label" style={{ borderBottom: '3px solid rgba(0,0,0,0.1)' }}>
                {slot.start}–{slot.end}
              </div>
              {DAYS.map((day) => {
                // Skip if this cell is covered by a rowspan from above
                if (occupiedCells[day].has(slotIdx)) {
                  return null;
                }

                const cellEvents = eventGrid[day]?.[slotIdx] || [];
                const rowSpan = getRowSpan(day, slotIdx);

                return (
                  <ScheduleCell
                    key={`${day}-${slotIdx}`}
                    events={cellEvents}
                    rowSpan={rowSpan}
                    onCellClick={() => onCellClick(day, slot.start, slot.end)}
                    onEventClick={onEventClick}
                    gridRow={rowSpan}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
