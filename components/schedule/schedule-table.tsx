'use client';

import React from 'react';
import { cn } from "@/lib/utils"

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

  // Odd/Even Week Coloring Logic
  const getWeekType = (date: Date): 'odd' | 'even' | null => {
    const calendarConfig = useScheduleStore.getState().calendarConfig;
    if (!calendarConfig) return null;

    const winterStart = new Date(calendarConfig.winterSemester.start);
    const summerStart = new Date(calendarConfig.summerSemester.start);
    
    let referenceDate: Date | null = null;
    
    if (date >= winterStart && date <= new Date(calendarConfig.winterSemester.end)) {
      referenceDate = winterStart;
    } else if (date >= summerStart && date <= new Date(calendarConfig.summerSemester.end)) {
      referenceDate = summerStart;
    }

    if (!referenceDate) return null;

    const diffInDays = Math.floor((date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    const weekNumber = Math.floor(diffInDays / 7) + 1;
    return weekNumber % 2 === 1 ? 'odd' : 'even';
  };

  const isVacation = (date: Date): boolean => {
    const vacations = useScheduleStore.getState().vacations;
    const dateStr = date.toISOString().split('T')[0];
    return vacations.includes(dateStr);
  };

  const isSession = (date: Date): string | null => {
    const config = useScheduleStore.getState().calendarConfig;
    if (!config) return null;
    
    const d = date.toISOString().split('T')[0];
    if (d >= config.winterRegularSession.start && d <= config.winterRegularSession.end) return 'winter-regular';
    if (d >= config.winterRetakeSession.start && d <= config.winterRetakeSession.end) return 'winter-retake';
    if (d >= config.summerRegularSession.start && d <= config.summerRegularSession.end) return 'summer-regular';
    if (d >= config.annualRetakeSession.start && d <= config.annualRetakeSession.end) return 'annual-retake';
    if (d >= config.liquidationSession.start && d <= config.liquidationSession.end) return 'liquidation';
    return null;
  };

  return (
    <div className="schedule-table-wrapper flex flex-col">
      <ScheduleToolbar onAddEvent={onAddEvent} />
      <div className="schedule-table-grid">
        {/* HEADER ROW */}
        <div className="schedule-header-time">Час</div>
        {DAYS.map((day) => (
          <div key={`header-${day}`} className="schedule-header-day">
            {DAY_NAMES[day]}
          </div>
        ))}

        {/* CONTENT ROWS - Time slots and events */}
        {TIME_SLOTS.map((slot, slotIdx) => {
          if (slot.lunch) {
            // LUNCH BREAK ROW - Merged cell spanning all day columns
            return (
              <React.Fragment key={`lunch-${slotIdx}`}>
                <div className="schedule-lunch-label">
                  {slot.start}–{slot.end}
                </div>
                <div
                  className={"col-span-5 flex flex-row items-center justify-center gap-3 text-stone-900 bg-gradient-to-r from-[#ffbeb8]/40 to-[#ffd294]/40 backdrop-blur-md shadow-sm p-2 font-bold"}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Обедна почивка</span>
                </div>
              </React.Fragment>
            );
          }

          // CONTENT ROW - Time slot with events
          return (
            <React.Fragment key={`slot-${slotIdx}`}>
              <div className="schedule-time-label">
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
