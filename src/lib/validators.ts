// =============================================================================
// Athlete Risk Intelligence Platform
// Data Validators (Input validation for check-ins, observations, and physio logs)
// =============================================================================

import { PhysioStatus } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate Athlete Check-In submission
 */
export function validateCheckInInput(data: {
  sleep_hours?: unknown;
  soreness?: unknown;
  mood?: unknown;
  rpe?: unknown;
  note?: unknown;
  date?: unknown;
}): ValidationResult {
  const errors: string[] = [];

  // Sleep hours (0 to 24)
  if (data.sleep_hours === undefined || data.sleep_hours === null) {
    errors.push('Sleep hours is required.');
  } else {
    const sleep = Number(data.sleep_hours);
    if (isNaN(sleep) || sleep < 0 || sleep > 24) {
      errors.push('Sleep hours must be a number between 0 and 24.');
    }
  }

  // Soreness (1 to 5)
  if (data.soreness === undefined || data.soreness === null) {
    errors.push('Soreness rating is required.');
  } else {
    const soreness = Number(data.soreness);
    if (isNaN(soreness) || !Number.isInteger(soreness) || soreness < 1 || soreness > 5) {
      errors.push('Soreness must be an integer between 1 and 5.');
    }
  }

  // Mood (1 to 5)
  if (data.mood === undefined || data.mood === null) {
    errors.push('Mood/stress rating is required.');
  } else {
    const mood = Number(data.mood);
    if (isNaN(mood) || !Number.isInteger(mood) || mood < 1 || mood > 5) {
      errors.push('Mood rating must be an integer between 1 and 5.');
    }
  }

  // RPE (optional, 1 to 10)
  if (data.rpe !== undefined && data.rpe !== null && data.rpe !== '') {
    const rpe = Number(data.rpe);
    if (isNaN(rpe) || !Number.isInteger(rpe) || rpe < 1 || rpe > 10) {
      errors.push('RPE must be an integer between 1 and 10.');
    }
  }

  // Note (optional string max 1000 chars)
  if (data.note !== undefined && data.note !== null) {
    if (typeof data.note !== 'string') {
      errors.push('Note must be text.');
    } else if (data.note.length > 1000) {
      errors.push('Note must be 1000 characters or fewer.');
    }
  }

  // Date (optional YYYY-MM-DD)
  if (data.date !== undefined && data.date !== null && data.date !== '') {
    if (typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      errors.push('Date must be in YYYY-MM-DD format.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Coach Observation input
 */
export function validateObservationInput(data: {
  note?: unknown;
  date?: unknown;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.note || typeof data.note !== 'string' || data.note.trim().length === 0) {
    errors.push('Observation note cannot be empty.');
  } else if (data.note.length > 2000) {
    errors.push('Observation note cannot exceed 2000 characters.');
  }

  if (data.date !== undefined && data.date !== null && data.date !== '') {
    if (typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      errors.push('Date must be in YYYY-MM-DD format.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Physio Note input
 */
export function validatePhysioNoteInput(data: {
  status?: unknown;
  note?: unknown;
  date?: unknown;
}): ValidationResult {
  const errors: string[] = [];

  const validStatuses: PhysioStatus[] = ['active', 'recovering', 'cleared'];
  if (!data.status || typeof data.status !== 'string' || !validStatuses.includes(data.status.toLowerCase() as PhysioStatus)) {
    errors.push("Status must be one of: 'active', 'recovering', 'cleared'.");
  }

  if (!data.note || typeof data.note !== 'string' || data.note.trim().length === 0) {
    errors.push('Physio note cannot be empty.');
  } else if (data.note.length > 3000) {
    errors.push('Physio note cannot exceed 3000 characters.');
  }

  if (data.date !== undefined && data.date !== null && data.date !== '') {
    if (typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
      errors.push('Date must be in YYYY-MM-DD format.');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
