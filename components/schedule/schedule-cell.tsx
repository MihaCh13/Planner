'use client';

import type { ScheduleEvent } from '@/lib/schedule-types';
import { EventBlock } from './event-block';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleCellProps {
  events: ScheduleEvent[];
  onCellClick: () => void;
  onEventClick: (event: ScheduleEvent) => void;
  rowSpan?: number;
  height?: number;
}

export function ScheduleCell({ 
  events, 
  onCellClick, 
  onEventClick,
  rowSpan = 1,
  height = 100
}: ScheduleCellProps) {
  // Separate events by week cycle
  const oddWeekEvents = events.filter(e => e.week_cycle === 'odd');
  const evenWeekEvents = events.filter(e => e.week_cycle === 'even');
  const everyWeekEvents = events.filter(e => e.week_cycle === 'every');

  const isEmpty = events.length === 0;
  const totalEventCount = events.length;

  // Render empty cell
  if (isEmpty) {
    return (
      <td 
        className={cn("schedule-cell empty-cell border border-border")}
        style={{ height: `${height}px` }}
        rowSpan={rowSpan}
        onClick={onCellClick}
      >
        <div className="h-full flex items-center justify-center text-muted-foreground/40 text-sm font-medium cursor-pointer hover:text-muted-foreground/60 transition-colors">
          <Plus className="w-5 h-5" />
        </div>
      </td>
    );
  }

  // Case C: Single "Every Week" Event - FULL Block
  if (everyWeekEvents.length === 1 && oddWeekEvents.length === 0 && evenWeekEvents.length === 0) {
    return (
      <td 
        className="schedule-cell border border-border p-0"
        style={{ height: `${height}px` }}
        rowSpan={rowSpan}
      >
        <div className="h-full w-full">
          <EventBlock 
            event={everyWeekEvents[0]} 
            onClick={() => onEventClick(everyWeekEvents[0])} 
          />
        </div>
      </td>
    );
  }

  // Multiple "every week" events - use grid
  if (everyWeekEvents.length > 1 && oddWeekEvents.length === 0 && evenWeekEvents.length === 0) {
    return (
      <td 
        className="schedule-cell border border-border p-0"
        style={{ height: `${height}px` }}
        rowSpan={rowSpan}
      >
        <div className="grid-2x2">
          {everyWeekEvents.slice(0, 4).map((event, idx) => (
            <div key={event.id} className={cn("grid-quadrant", `q${idx + 1}`)}>
              <EventBlock 
                event={event} 
                isCompact
                onClick={() => onEventClick(event)} 
              />
            </div>
          ))}
        </div>
      </td>
    );
  }

  // Case A: 3 or more events - Use 2x2 GRID Layout
  if (totalEventCount >= 3) {
    // Combine all events and take up to 4
    const allEvents = [...oddWeekEvents, ...evenWeekEvents, ...everyWeekEvents].slice(0, 4);
    
    return (
      <td 
        className="schedule-cell border border-border p-0"
        style={{ height: `${height}px` }}
        rowSpan={rowSpan}
      >
        <div className="grid-2x2">
          {allEvents.map((event, idx) => (
            <div key={event.id} className={cn("grid-quadrant", `q${idx + 1}`)}>
              <EventBlock 
                event={event} 
                isCompact
                showWeekBadge
                onClick={() => onEventClick(event)} 
              />
            </div>
          ))}
          {/* Fill empty quadrants if less than 4 events */}
          {allEvents.length < 4 && Array.from({ length: 4 - allEvents.length }).map((_, idx) => (
            <div 
              key={`empty-${idx}`} 
              className={cn("grid-quadrant empty", `q${allEvents.length + idx + 1}`)}
            />
          ))}
        </div>
      </td>
    );
  }

  // Case B: Odd/Even Week Split (1 or 2 events) - Use DIAGONAL Layout
  const hasOdd = oddWeekEvents.length > 0;
  const hasEven = evenWeekEvents.length > 0;

  if ((hasOdd || hasEven) && totalEventCount <= 2) {
    return (
      <td 
        className="schedule-cell border border-border p-0"
        style={{ height: `${height}px` }}
        rowSpan={rowSpan}
      >
        <div className="diagonal-container">
          {/* ODD Week Triangle - Top-Left */}
          <div className="diagonal-odd">
            {hasOdd ? (
              <div className="diagonal-event-wrapper">
                <EventBlock 
                  event={oddWeekEvents[0]} 
                  isCompact
                  isDiagonal
                  onClick={() => onEventClick(oddWeekEvents[0])} 
                />
              </div>
            ) : (
              <div className="diagonal-empty" />
            )}
            {/* ODD Week Badge - Top-Left */}
            <div className="week-badge odd-badge">Нечетна</div>
          </div>
          
          {/* EVEN Week Triangle - Bottom-Right */}
          <div className="diagonal-even">
            {hasEven ? (
              <div className="diagonal-event-wrapper">
                <EventBlock 
                  event={evenWeekEvents[0]} 
                  isCompact
                  isDiagonal
                  onClick={() => onEventClick(evenWeekEvents[0])} 
                />
              </div>
            ) : (
              <div className="diagonal-empty" />
            )}
            {/* EVEN Week Badge - Bottom-Right */}
            <div className="week-badge even-badge">Четна</div>
          </div>
        </div>
      </td>
    );
  }

  // Fallback: render all events in a flex column
  return (
    <td 
      className="schedule-cell border border-border p-1"
      style={{ height: `${height}px` }}
      rowSpan={rowSpan}
    >
      <div className="h-full flex flex-col gap-1 overflow-hidden">
        {events.map((event) => (
          <EventBlock 
            key={event.id} 
            event={event} 
            isCompact
            showWeekBadge
            onClick={() => onEventClick(event)} 
          />
        ))}
      </div>
    </td>
  );
}
