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

// =====================================================
// STYLE OBJECTS - PASTEL COLORS FOR LEGEND
// =====================================================

export const MAKEUP_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(255, 219, 248, 0.85)', // Pink
  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 20px)',
  border: '1px solid rgba(255, 219, 248, 1)'
};

export const SEMINAR_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(164, 255, 241, 0.85)', // Teal/Cyan
  border: '1px solid #2DD4BF'
};

export const LAB_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(227, 208, 255, 0.85)', // Purple/Lavender
  border: '1px solid #CEBDE6'
};

export const LECTURE_STYLE: React.CSSProperties = {
  backgroundColor: 'rgba(211, 255, 215, 0.85)', // Green
  backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 60%)',
  border: '1px solid #86EFAC',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(255,255,255,0.45)'
};

// Helper: Get the correct style object based on event type
const getEventStyle = (isMakeup: boolean, subjectType: string): React.CSSProperties | undefined => {
  if (isMakeup) return MAKEUP_STYLE;
  switch (subjectType) {
    case 'lecture': return LECTURE_STYLE;
    case 'seminar': return SEMINAR_STYLE;
    case 'lab': return LAB_STYLE;
    default: return undefined;
  }
};

// =====================================================
// DIAGONAL LAYOUT COMPONENT - MOVED GROUP BADGE
// =====================================================

function DiagonalLayout({
  event,
  isMakeup,
  isCompact,
  groupLabel
}: {
  event: ScheduleEvent;
  isMakeup: boolean;
  isCompact: boolean;
  groupLabel: string | null;
}) {
  const showControl = event.control_form !== 'none' && event.subject_type === 'lecture';
  const makeupAbbr = isMakeup ? MAKEUP_ABBREVIATIONS[event.subject_type] : null;

  return (
    <>
      {/* TEXT CONTENT CONTAINER - Tight spacing for diagonal/grid view */}
      <div
        className={cn(
          "absolute w-full h-full z-10 flex flex-col gap-0 pointer-events-none hyphens-auto",
          event.week_cycle === 'odd'
            ? 'top-0 left-0 items-start justify-start pt-[28px] pl-1.5 pr-1'
            : 'bottom-0 right-0 items-end justify-end pb-[28px] pr-1.5 pl-1'
        )}
      >
        <div className={cn(
          "text-slate-900 font-bold leading-[1.1] line-clamp-2 break-words text-[clamp(9px,7cqw,13px)]",
          event.week_cycle === 'even' && 'text-right'
        )}>
          {event.subject_name}{makeupAbbr && ` ${makeupAbbr}`}
        </div>

        <div className={cn(
          "text-slate-700 font-medium leading-[1.1] text-[clamp(7px,5cqw,11px)]",
          event.week_cycle === 'even' && 'text-right'
        )}>
          {event.room || '-'}
        </div>

        {groupLabel && (
          <div className={cn(
            "mt-0.5",
            event.week_cycle === 'even' ? "flex justify-end w-full" : "flex justify-start w-full"
          )}>
            <div className="glassy-badge mini">
              {groupLabel}
            </div>
          </div>
        )}

        {showControl && (
          <div className={cn(
            "text-slate-500 italic leading-[1.1] text-[clamp(6px,4cqw,9px)] mt-0.5",
            event.week_cycle === 'even' && 'text-right'
          )}>
            ({CONTROL_FORMS[event.control_form]})
          </div>
        )}
      </div>

      {/* DiagonalLayout: content-only. Badges are hoisted by EventBlock. */}
    </>
  );
}

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
  const showControl = event.control_form !== 'none' && event.subject_type === 'lecture';
  const showProject = event.project_type !== 'none' && event.subject_type === 'lecture';
  const showSubgroup = event.subgroup !== 'none' && (event.subject_type === 'seminar' || event.subject_type === 'lab');
  const displayWeekBadge = showWeekBadge && event.week_cycle !== 'every';

  // Prepare group label (Subgroup A/B or Group X)
  const groupLabel = event.subgroup !== 'none' 
    ? SUBGROUP_LABELS[event.subgroup] 
    : (event.group_number ? `Група ${event.group_number}` : null);

  // Makeup abbreviation for EventBlock scope
  const makeupAbbr = isMakeup ? MAKEUP_ABBREVIATIONS[event.subject_type] : null;

  return (
    <div
      className={cn(
        'event-block', 
        isCompact && 'compact',
        isDiagonal && 'diagonal'
      )}
      style={getEventStyle(isMakeup, event.subject_type)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* =========================================================
          BRANCH 1: DIAGONAL SPLIT VIEW
          ========================================================= */}
      {isDiagonal ? (
        <DiagonalLayout
          event={event}
          isMakeup={isMakeup}
          isCompact={isCompact}
          groupLabel={groupLabel}
        />
      ) : (
        <div className={cn(
          "flex-1 flex flex-col min-h-0 w-full max-w-full z-10 gap-0 overflow-hidden",
          // Compact/Grid: align to start, Full: center and distribute space
          isCompact ? 'justify-start' : 'justify-center',
          // Reserve space for badges using Safe Zone padding
          isCompact && event.week_cycle === 'odd' && 'pt-[22px]',
          isCompact && event.week_cycle === 'even' && 'pb-[22px]',
          event.week_cycle === 'even' && isCompact && 'justify-end'
        )}>

          {isMakeup ? (
            /* --- MAKEUP LAYOUT: Subject + Room + Group (Full view only) --- */
            <div className="flex flex-col w-full max-w-full overflow-hidden gap-0.5 hyphens-auto">
              {/* ROW 1: Subject Name + Type Abbreviation (Grid: tight leading, Full: large fluid) */}
              <div className={cn(
                "text-slate-900 font-bold break-words whitespace-normal w-full max-w-full overflow-hidden",
                isCompact ? "leading-[1.1] text-[clamp(9px,5cqw,12px)] line-clamp-2" : "leading-relaxed text-[clamp(11px,1.2vw,16px)] line-clamp-3"
              )}> 
                {event.subject_name} {MAKEUP_ABBREVIATIONS[event.subject_type]}
              </div>
              {/* ROW 2: Room (Explicit Block) */}
              <div className={cn(
                "block w-full max-w-full overflow-hidden font-semibold text-slate-700 whitespace-normal break-words",
                isCompact ? "text-[clamp(8px,4cqw,11px)]" : "text-[clamp(9px,1vw,13px)]"
              )}>
                {event.room || '-'}
              </div>
              {/* ROW 3: Group Badge (Full View Only - Not Grid) */}
              {!isCompact && groupLabel && (
                <div className="block mt-0.5">
                  <div className="glassy-badge mini w-fit text-[clamp(7px,4cqw,9px)]">
                    {groupLabel}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* --- STANDARD LAYOUT --- */
            <div className="flex flex-col w-full max-w-full overflow-hidden justify-center hyphens-auto gap-0.5">
              {/* ROW 1: Subject (Grid: tight leading, Full: large fluid) */}
              <div className={cn(
                "text-slate-900 font-bold break-words whitespace-normal max-w-full overflow-hidden",
                isCompact ? "leading-[1.1] text-[clamp(9px,5cqw,12px)] line-clamp-2" : "leading-relaxed text-[clamp(11px,1.2vw,16px)] line-clamp-3"
              )}>
                {event.subject_name}
              </div>
              {/* ROW 2: Room */}
              <div className={cn(
                "font-semibold text-slate-700 overflow-hidden break-words whitespace-normal max-w-full",
                isCompact ? "text-[clamp(8px,4cqw,11px)]" : "text-[clamp(9px,1vw,13px)]"
              )}>
                {event.room || '-'}
              </div>
              {/* ROW 3: Control Form */}
              {showControl && !isCompact && (
                <div className="font-medium text-slate-500 text-[clamp(8px,0.9vw,12px)] italic max-w-full overflow-hidden mt-0.5">
                  ({CONTROL_FORMS[event.control_form]})
                </div>
              )}
            </div>
          )}

          {/* --- CORNER BADGES (For Grid/Compact View) - SAME LOGIC AS DIAGONAL --- */}
          {/* ODD WEEK CORNER (Top-Left) */}
          {isCompact && event.week_cycle === 'odd' && (displayWeekBadge || groupLabel) && (
            <div className="absolute top-1 left-1 flex flex-row items-center gap-2 z-20 pointer-events-none">
              {displayWeekBadge && (
                <div className="week-badge odd-badge relative z-30">
                  НЕЧ
                </div>
              )}
              {groupLabel && (
                <div className="glassy-badge mini relative z-20">
                  {groupLabel}
                </div>
              )}
            </div>
          )}

          {/* EVEN WEEK CORNER (Bottom-Right) */}
          {isCompact && event.week_cycle === 'even' && (displayWeekBadge || groupLabel) && (
            <div className="absolute bottom-1 right-1 flex flex-row items-center gap-2 z-20 pointer-events-none">
              {groupLabel && (
                <div className="glassy-badge mini relative z-20">
                  {groupLabel}
                </div>
              )}
              {displayWeekBadge && (
                <div className="week-badge even-badge relative z-30">
                  ЧЕТ
                </div>
              )}
            </div>
          )}

          {/* --- BOTTOM TAGS (For Full View Only - Non-Compact) --- */}
          {!isCompact && (
            <div className="absolute left-1 right-1 flex justify-between items-end pointer-events-none z-20 bottom-1 gap-1">
              <div className="flex gap-0.5">
                {!isMakeup && showSubgroup && (
                  <span className="glassy-badge mini">
                    {SUBGROUP_LABELS[event.subgroup]}
                  </span>
                )}
              </div>
              <div className="flex gap-0.5">
                {!isMakeup && showProject && (
                  <span className="glassy-badge mini project-badge">
                    {PROJECT_TYPES[event.project_type]}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
