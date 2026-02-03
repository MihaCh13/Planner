'use client';

import type { ScheduleEvent } from '@/lib/schedule-types';
import { CONTROL_FORMS, PROJECT_TYPES, SUBGROUP_LABELS } from '@/lib/schedule-types';
import { cn } from '@/lib/utils';

// Abbreviations for makeup events
const MAKEUP_ABBREVIATIONS: Record<string, string> = {
  lecture: '(Л)',
  seminar: '(СУ)',
  lab: '(ЛУ)'
};

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
      {/* Main content area - Order: Subject Name > Room > Group */}
      <div className={cn(
        "flex-1 flex flex-col min-h-0 z-10 gap-0.5 overflow-hidden",
        isDiagonal && event.week_cycle === 'even' && "justify-end"
      )}>
        {/* Subject Name - LARGE & BOLD (Top) */}
        <div className={cn(
          "text-slate-900 break-words tracking-tight hyphens-auto leading-tight overflow-hidden text-ellipsis",
          isCompact 
            ? "text-[11px] font-bold line-clamp-2"
            : isDiagonal 
              ? "text-[14px] font-extrabold line-clamp-2"
              : "text-[16px] font-bold line-clamp-3"
        )}
        style={{ wordBreak: 'break-word' }}
        >
          {event.subject_name}
        </div>
        
        {/* Room Number */}
        <div className={cn(
          "font-semibold text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap",
          isCompact ? "text-[10px]" : isDiagonal ? "text-[12px]" : "text-[13px]"
        )}>
          {event.room || '-'}
        </div>
        
        {/* For makeup events: show abbreviated session type and group */}
        {isMakeup && (
          <div className={cn(
            "font-bold text-slate-700 overflow-hidden text-ellipsis whitespace-nowrap",
            isCompact ? "text-[10px]" : isDiagonal ? "text-[12px]" : "text-[12px]"
          )}>
            {MAKEUP_ABBREVIATIONS[event.subject_type] || ''}
            {event.group_number && ` Гр. ${event.group_number}`}
          </div>
        )}
        
        {/* Control Form - italic in parentheses */}
        {showControl && !isCompact && !isDiagonal && (
          <div className="font-medium text-slate-500 text-[12px] italic">
            ({CONTROL_FORMS[event.control_form]})
          </div>
        )}
      </div>

      {/* TAGS AREA - Bottom row with strict positioning (hidden in diagonal mode) */}
      {!isDiagonal && (
      <div className={cn(
        "absolute left-1 right-1 flex justify-between items-end pointer-events-none z-20",
        "bottom-1.5"
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
            <span className={cn("glassy-badge project-badge", isDiagonal && "mini")}>
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
      )}
    </div>
  );
}
