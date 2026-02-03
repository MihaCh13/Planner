'use client';

import type { ScheduleEvent } from '@/lib/schedule-types';
import { CONTROL_FORMS, PROJECT_TYPES, SUBGROUP_LABELS, SUBJECT_TYPE_LABELS } from '@/lib/schedule-types';
import { cn } from '@/lib/utils';

interface EventBlockProps {
  event: ScheduleEvent;
  isCompact?: boolean;
  isDiagonal?: boolean;
  showWeekBadge?: boolean;
  onClick: () => void;
}

export function EventBlock({ 
  event, 
  isCompact = false, 
  isDiagonal = false,
  showWeekBadge = false,
  onClick 
}: EventBlockProps) {
  const isMakeup = event.event_type === 'makeup';
  
  // Background class based on subject type (not generic odd/even colors)
  const bgClass = isMakeup 
    ? 'makeup-bg makeup-hatched'
    : event.subject_type === 'lecture' 
      ? 'lecture-bg' 
      : event.subject_type === 'seminar' 
        ? 'seminar-bg' 
        : 'lab-bg';

  const showControl = event.control_form !== 'none' && event.subject_type === 'lecture';
  const showProject = event.project_type !== 'none' && event.subject_type === 'lecture';
  const showSubgroup = event.subgroup !== 'none' && (event.subject_type === 'seminar' || event.subject_type === 'lab');
  
  // Show week badge in grid layouts or when explicitly requested
  const displayWeekBadge = showWeekBadge && event.week_cycle !== 'every';

  return (
    <div
      className={cn(
        'event-block', 
        bgClass, 
        isCompact && 'compact',
        isDiagonal && 'diagonal'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-0 z-10 gap-0.5 overflow-hidden">
        {/* Subject Name - LARGE & BOLD */}
        <div className={cn(
          "font-bold text-slate-900 break-words tracking-tight hyphens-auto leading-tight",
          isCompact || isDiagonal
            ? "text-[11px] line-clamp-2" 
            : "text-[16px] line-clamp-3"
        )}
        style={{ wordBreak: 'break-word' }}
        >
          {event.subject_name}
        </div>
        
        {/* For makeup events: show session type */}
        {isMakeup && (
          <div className={cn(
            "font-semibold text-slate-700",
            isCompact || isDiagonal ? "text-[9px]" : "text-[11px]"
          )}>
            {SUBJECT_TYPE_LABELS[event.subject_type]}
          </div>
        )}
        
        {/* Room Number - normal weight */}
        {!isDiagonal && (
          <div className={cn(
            "font-normal text-slate-600",
            isCompact ? "text-[10px]" : "text-[13px]"
          )}>
            {event.room || '-'}
          </div>
        )}
        
        {/* Control Form - italic in parentheses */}
        {showControl && !isCompact && !isDiagonal && (
          <div className="font-medium text-slate-500 text-[12px] italic">
            ({CONTROL_FORMS[event.control_form]})
          </div>
        )}
      </div>

      {/* TAGS AREA - Bottom row with strict positioning */}
      <div className={cn(
        "absolute left-1 right-1 flex justify-between items-end pointer-events-none z-20",
        isDiagonal ? "bottom-0.5" : "bottom-1.5"
      )}>
        {/* LEFT: Subgroup tag or Week Badge */}
        <div className="flex gap-1">
          {showSubgroup && (
            <span className={cn("glassy-badge", isDiagonal && "mini")}>
              {SUBGROUP_LABELS[event.subgroup]}
            </span>
          )}
          {displayWeekBadge && (
            <span className={cn(
              "week-indicator-badge",
              event.week_cycle === 'odd' ? 'odd' : 'even',
              isDiagonal && "mini"
            )}>
              {event.week_cycle === 'odd' ? 'Н' : 'Ч'}
            </span>
          )}
        </div>
        
        {/* RIGHT: Project tag or Group number for makeup */}
        <div className="flex gap-1">
          {showProject && (
            <span className={cn("glassy-badge", isDiagonal && "mini")}>
              {PROJECT_TYPES[event.project_type]}
            </span>
          )}
          {isMakeup && event.group_number && (
            <span className={cn("glassy-badge makeup-badge", isDiagonal && "mini")}>
              Гр. {event.group_number}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
