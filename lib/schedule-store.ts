'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScheduleEvent } from './schedule-types';
import { generateId } from './schedule-types';

export interface CalendarConfig {
  winterSemester: { start: string; end: string };
  winterRegularSession: { start: string; end: string };
  winterRetakeSession: { start: string; end: string };
  summerSemester: { start: string; end: string };
  summerRegularSession: { start: string; end: string };
  annualRetakeSession: { start: string; end: string };
  liquidationSession: { start: string; end: string };
}

interface ScheduleStore {
  events: ScheduleEvent[];
  addEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<ScheduleEvent>) => void;
  deleteEvent: (id: string) => void;
  semester: 'winter' | 'summer';
  setSemester: (semester: 'winter' | 'summer') => void;
  calendarConfig: CalendarConfig | null;
  academicYear: string;
  setAcademicYear: (year: string) => void;
  setCalendarConfig: (config: CalendarConfig) => void;
  clearCalendarConfig: () => void;
  holidays: string[];
  addHoliday: (date: string) => void;
  removeHoliday: (date: string) => void;
  vacations: string[];
  addVacation: (date: string) => void;
  removeVacation: (date: string) => void;
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set) => ({
      events: [
        // Temporary test events to verify styles
        {
          id: 'test-lecture-a',
          subject_name: 'Тест Лекция',
          subject_type: 'lecture',
          room: 'T101',
          day: 'monday',
          start_time: '09:30',
          end_time: '11:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        },
        {
          id: 'test-lab-b',
          subject_name: 'Тест Лаб',
          subject_type: 'lab',
          room: 'L202',
          day: 'tuesday',
          start_time: '11:30',
          end_time: '13:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        },
        {
          id: 'test-seminar-c',
          subject_name: 'Тест Семинар',
          subject_type: 'seminar',
          room: 'S303',
          day: 'wednesday',
          start_time: '13:45',
          end_time: '15:30',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        },
        {
          id: 'test-makeup-d',
          subject_name: 'Тест Отработване',
          subject_type: 'lecture',
          room: 'M404',
          day: 'thursday',
          start_time: '07:30',
          end_time: '09:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'makeup'
        },
        // MONDAY
        {
          id: 'm1',
          subject_name: 'Компютърни системи',
          subject_type: 'lecture',
          room: '1151',
          day: 'monday',
          start_time: '10:30',
          end_time: '13:15',
          control_form: 'exam',
          project_type: 'none',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        },
        {
          id: 'm2',
          subject_name: 'Сигнали и системи',
          subject_type: 'lecture',
          room: '1153',
          day: 'monday',
          start_time: '13:45',
          end_time: '16:30',
          control_form: 'exam',
          project_type: 'coursework',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        },
        {
          id: 'm3',
          subject_name: 'Бази данни',
          subject_type: 'lab',
          room: '2108 Б',
          day: 'monday',
          start_time: '16:45',
          end_time: '19:30',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'A',
          week_cycle: 'every',
          event_type: 'regular'
        },
        // TUESDAY
        {
          id: 't1',
          subject_name: 'Сигнали и системи',
          subject_type: 'lab',
          room: '1256',
          day: 'tuesday',
          start_time: '07:30',
          end_time: '10:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'A',
          week_cycle: 'odd',
          event_type: 'regular'
        },
        {
          id: 't2',
          subject_name: 'Сигнали и системи',
          subject_type: 'lab',
          room: '1256',
          day: 'tuesday',
          start_time: '07:30',
          end_time: '10:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'B',
          week_cycle: 'even',
          event_type: 'regular'
        },
        {
          id: 't3',
          subject_name: 'Основи на мрежовите технологии',
          subject_type: 'lecture',
          room: '2030',
          day: 'tuesday',
          start_time: '10:30',
          end_time: '13:15',
          control_form: 'exam',
          project_type: 'coursework',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        },
        {
          id: 't4',
          subject_name: 'Измервания в ИКТ',
          subject_type: 'lecture',
          room: '1154',
          day: 'tuesday',
          start_time: '13:45',
          end_time: '16:30',
          control_form: 'continuous',
          project_type: 'none',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        },
        {
          id: 't5',
          subject_name: 'Бази данни',
          subject_type: 'lab',
          room: '2108 Б',
          day: 'tuesday',
          start_time: '16:45',
          end_time: '19:30',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'B',
          week_cycle: 'every',
          event_type: 'regular'
        },
        // WEDNESDAY
        {
          id: 'w1',
          subject_name: 'Компютърни системи',
          subject_type: 'lab',
          room: '1212',
          day: 'wednesday',
          start_time: '07:30',
          end_time: '10:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'A',
          week_cycle: 'odd',
          event_type: 'regular'
        },
        {
          id: 'w2',
          subject_name: 'Основи на мрежовите технологии',
          subject_type: 'lab',
          room: '2108 Б',
          day: 'wednesday',
          start_time: '07:30',
          end_time: '10:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'A',
          week_cycle: 'even',
          event_type: 'regular'
        },
        {
          id: 'w3',
          subject_name: 'Основи на мрежовите технологии',
          subject_type: 'lab',
          room: '2108 В',
          day: 'wednesday',
          start_time: '07:30',
          end_time: '10:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'B',
          week_cycle: 'odd',
          event_type: 'regular'
        },
        {
          id: 'w4',
          subject_name: 'Компютърни системи',
          subject_type: 'lab',
          room: '1212',
          day: 'wednesday',
          start_time: '07:30',
          end_time: '10:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'B',
          week_cycle: 'even',
          event_type: 'regular'
        },
        {
          id: 'w5',
          subject_name: 'Бази данни',
          subject_type: 'lecture',
          room: '1153',
          day: 'wednesday',
          start_time: '10:30',
          end_time: '13:15',
          control_form: 'continuous',
          project_type: 'course-project',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        },
        // THURSDAY
        {
          id: 'th1',
          subject_name: 'Измервания в ИКТ',
          subject_type: 'lab',
          room: '1264',
          day: 'thursday',
          start_time: '10:30',
          end_time: '13:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'A',
          week_cycle: 'odd',
          event_type: 'regular'
        },
        {
          id: 'th2',
          subject_name: 'Измервания в ИКТ',
          subject_type: 'lab',
          room: '1264',
          day: 'thursday',
          start_time: '10:30',
          end_time: '13:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'B',
          week_cycle: 'even',
          event_type: 'regular'
        },
        // FRIDAY
        {
          id: 'f1',
          subject_name: 'Сигнали и системи',
          subject_type: 'seminar',
          room: '3605',
          day: 'friday',
          start_time: '07:30',
          end_time: '10:15',
          control_form: 'none',
          project_type: 'none',
          subgroup: 'none',
          week_cycle: 'every',
          event_type: 'regular'
        }
      ],
      addEvent: (event) =>
        set((state) => ({
          events: [...state.events, { ...event, id: generateId() }],
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((evt) =>
            evt.id === id ? { ...evt, ...updatedEvent } : evt
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((evt) => evt.id !== id),
        })),
      semester: 'winter',
      setSemester: (semester) => set({ semester }),
      academicYear: '2025/2026',
      setAcademicYear: (year) => set({ academicYear: year }),
      vacations: ['2025-12-22', '2025-12-23', '2025-12-24', '2025-12-25', '2025-12-26', '2025-12-27', '2025-12-28', '2025-12-29', '2025-12-30', '2025-12-31', '2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04'],
      calendarConfig: {
        winterSemester: { start: '2025-09-23', end: '2025-12-20' },
        winterRegularSession: { start: '2026-01-05', end: '2026-01-24' },
        winterRetakeSession: { start: '2026-01-26', end: '2026-02-07' },
        summerSemester: { start: '2026-02-09', end: '2026-05-09' },
        summerRegularSession: { start: '2026-05-11', end: '2026-05-30' },
        annualRetakeSession: { start: '2026-06-01', end: '2026-06-20' },
        liquidationSession: { start: '2025-09-15', end: '2025-09-20' },
      },
      setCalendarConfig: (config) => set({ calendarConfig: config }),
      clearCalendarConfig: () => set({ calendarConfig: null }),
      holidays: [],
      addHoliday: (date) => set((state) => ({ 
        holidays: state.holidays.includes(date) ? state.holidays : [...state.holidays, date] 
      })),
      removeHoliday: (date) => set((state) => ({ 
        holidays: state.holidays.filter(d => d !== date) 
      })),
      addVacation: (date) => set((state) => ({ 
        vacations: state.vacations.includes(date) ? state.vacations : [...state.vacations, date] 
      })),
      removeVacation: (date) => set((state) => ({ 
        vacations: state.vacations.filter(d => d !== date) 
      })),
    }),
    {
      name: 'schedule-storage',
      version: 3,
      migrate: (persistedState: unknown, version: number) => {
        // Handle migration from older versions to version 3
        if (version < 3) {
          const state = (persistedState as any) || {};
          return {
            events: state.events || [],
            semester: state.semester || 'winter',
            academicYear: state.academicYear || '2025/2026',
            calendarConfig: state.calendarConfig || null,
            holidays: state.holidays || [],
            vacations: state.vacations || [
              '2025-12-22', '2025-12-23', '2025-12-24', '2025-12-25', '2025-12-26', 
              '2025-12-27', '2025-12-28', '2025-12-29', '2025-12-30', '2025-12-31', 
              '2026-01-01', '2026-01-02', '2026-01-03', '2026-01-04'
            ],
          };
        }
        return persistedState as ScheduleStore;
      },
    }
  )
);
