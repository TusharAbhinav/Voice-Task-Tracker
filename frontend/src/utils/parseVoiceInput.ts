import { addDays, addWeeks, addMonths, setHours, setMinutes } from 'date-fns';
import type { TaskPriority, TaskStatus } from '../types/task';

interface ParsedTask {
  title: string;
  priority: TaskPriority;
  dueDate?: Date;
  status: TaskStatus;
}

export function parseVoiceInput(transcript: string): ParsedTask {
  const lowerTranscript = transcript.toLowerCase();

  const title = extractTitle(transcript, lowerTranscript);
  const priority = extractPriority(lowerTranscript);
  const dueDate = extractDueDate(lowerTranscript);
  const status = extractStatus(lowerTranscript);

  return {
    title,
    priority,
    dueDate,
    status,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractTitle(original: string, _lower: string): string {
  const patterns = [
    /(?:create|add|make|new)\s+(?:a\s+)?(?:task\s+)?(?:to\s+)?(.+?)(?:\s+by\s+|\s+due\s+|\s+priority|\s+urgent|\s+high|\s+medium|\s+low|$)/i,
    /(?:remind\s+me\s+to\s+)(.+?)(?:\s+by\s+|\s+due\s+|\s+priority|\s+urgent|\s+high|\s+medium|\s+low|$)/i,
    /(?:need\s+to\s+|have\s+to\s+|should\s+)(.+?)(?:\s+by\s+|\s+due\s+|\s+priority|\s+urgent|\s+high|\s+medium|\s+low|$)/i,
  ];

  for (const pattern of patterns) {
    const match = original.match(pattern);
    if (match && match[1]) {
      let title = match[1].trim();

      title = title.replace(/\s+(it'?s|that'?s)\s+(high|low|medium|urgent)\s+priority/gi, '');
      title = title.replace(/\s+priority$/gi, '');
      title = title.replace(/^(task\s+to\s+|task\s+)/gi, '');

      return title.charAt(0).toUpperCase() + title.slice(1);
    }
  }

  let cleaned = original.replace(/^(create|add|make|new)\s+(a\s+)?(task\s+)?(to\s+)?/i, '');
  cleaned = cleaned.replace(/\s+(high|low|medium|urgent)\s+priority/gi, '');
  cleaned = cleaned.replace(/\s+by\s+(tomorrow|today|tonight|monday|tuesday|wednesday|thursday|friday|saturday|sunday).*/gi, '');

  return cleaned.trim().charAt(0).toUpperCase() + cleaned.trim().slice(1) || 'New Task';
}

function extractPriority(lower: string): TaskPriority {
  if (/(urgent|critical|asap)/i.test(lower)) {
    return 'urgent';
  }
  if (/(high priority|important|high)/i.test(lower)) {
    return 'high';
  }
  if (/(low priority|low)/i.test(lower)) {
    return 'low';
  }
  return 'medium';
}

function extractDueDate(lower: string): Date | undefined {
  const now = new Date();

  if (/\btoday\b/.test(lower)) {
    if (/evening|tonight/.test(lower)) {
      return setHours(setMinutes(now, 0), 18);
    }
    if (/morning/.test(lower)) {
      return setHours(setMinutes(now, 0), 9);
    }
    if (/afternoon/.test(lower)) {
      return setHours(setMinutes(now, 0), 14);
    }
    return setHours(setMinutes(now, 0), 17);
  }

  if (/\btomorrow\b/.test(lower)) {
    const tomorrow = addDays(now, 1);
    if (/evening/.test(lower)) {
      return setHours(setMinutes(tomorrow, 0), 18);
    }
    if (/morning/.test(lower)) {
      return setHours(setMinutes(tomorrow, 0), 9);
    }
    if (/afternoon/.test(lower)) {
      return setHours(setMinutes(tomorrow, 0), 14);
    }
    return setHours(setMinutes(tomorrow, 0), 17);
  }

  const inDaysMatch = lower.match(/in (\d+) days?/);
  if (inDaysMatch) {
    return addDays(now, parseInt(inDaysMatch[1]));
  }

  const inWeeksMatch = lower.match(/in (\d+) weeks?/);
  if (inWeeksMatch) {
    return addWeeks(now, parseInt(inWeeksMatch[1]));
  }

  const inMonthsMatch = lower.match(/in (\d+) months?/);
  if (inMonthsMatch) {
    return addMonths(now, parseInt(inMonthsMatch[1]));
  }

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const nextDayMatch = lower.match(/\b(next|this)?\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/);
  if (nextDayMatch) {
    const targetDay = dayNames.indexOf(nextDayMatch[2]);
    const currentDay = now.getDay();
    let daysToAdd = targetDay - currentDay;

    if (daysToAdd <= 0 || nextDayMatch[1] === 'next') {
      daysToAdd += 7;
    }

    return addDays(now, daysToAdd);
  }

  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];

  for (let i = 0; i < monthNames.length; i++) {
    const monthPattern = new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s+${monthNames[i]}`, 'i');
    const match = lower.match(monthPattern);
    if (match) {
      const day = parseInt(match[1]);
      const year = now.getFullYear();
      return new Date(year, i, day);
    }
  }

  return undefined;
}

function extractStatus(lower: string): TaskStatus {
  if (/(in progress|working on|started)/i.test(lower)) {
    return 'in_progress';
  }
  if (/(done|completed|finished)/i.test(lower)) {
    return 'done';
  }
  return 'todo';
}
