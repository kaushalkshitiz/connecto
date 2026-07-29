// =============================================================================
// Athlete Risk Intelligence Platform
// Rule-Based Risk Scoring Engine (Section 3.5 of spec.md)
// =============================================================================
//
// RULES ENFORCED:
// - "Watch": 7-day soreness avg >= 4, OR 7-day sleep avg < 6 hrs, OR no check-in for 4+ days.
// - "High": 2+ Watch conditions together, OR active injury note + any Watch condition.
// - "Low": No Watch conditions triggered and no acute risk combinations.
// - Always return human-readable reasons explaining WHY an athlete is flagged.
// - NEVER use ML or AI for risk scoring; business logic is 100% deterministic and explainable.
// =============================================================================

import {
  CheckIn,
  RiskCalculationInput,
  RiskCalculationResult,
  RiskFlag,
  RiskLevel,
} from '../types';

/**
 * Helper to calculate days between two YYYY-MM-DD date strings
 */
export function getDaysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1 + 'T00:00:00Z');
  const d2 = new Date(dateStr2 + 'T00:00:00Z');
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Filter check-ins to only those within the last N days (inclusive of reference date)
 */
export function getRecentCheckIns(
  checkIns: CheckIn[],
  days: number,
  referenceDateStr: string = new Date().toISOString().slice(0, 10)
): CheckIn[] {
  return checkIns
    .filter((ci) => {
      const diff = getDaysBetween(ci.date, referenceDateStr);
      return diff <= days;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * Calculate 7-day sleep and soreness averages
 */
export function calculateSevenDayAverages(
  checkIns: CheckIn[],
  referenceDateStr: string = new Date().toISOString().slice(0, 10)
): {
  sleepAvg: number | null;
  sorenessAvg: number | null;
  moodAvg: number | null;
  recentCheckIns: CheckIn[];
} {
  const recent = getRecentCheckIns(checkIns, 7, referenceDateStr);

  if (recent.length === 0) {
    return {
      sleepAvg: null,
      sorenessAvg: null,
      moodAvg: null,
      recentCheckIns: [],
    };
  }

  const totalSleep = recent.reduce((sum, ci) => sum + Number(ci.sleep_hours), 0);
  const totalSoreness = recent.reduce((sum, ci) => sum + Number(ci.soreness), 0);
  const totalMood = recent.reduce((sum, ci) => sum + Number(ci.mood), 0);

  return {
    sleepAvg: Number((totalSleep / recent.length).toFixed(1)),
    sorenessAvg: Number((totalSoreness / recent.length).toFixed(1)),
    moodAvg: Number((totalMood / recent.length).toFixed(1)),
    recentCheckIns: recent,
  };
}

/**
 * Calculate the number of days since the athlete's most recent check-in
 */
export function calculateDaysSinceLastCheckIn(
  checkIns: CheckIn[],
  referenceDateStr: string = new Date().toISOString().slice(0, 10)
): number {
  if (checkIns.length === 0) {
    return 999; // Never checked in
  }

  // Sort descending by date
  const sorted = [...checkIns].sort((a, b) => (a.date > b.date ? -1 : 1));
  const latestDate = sorted[0].date;

  return getDaysBetween(latestDate, referenceDateStr);
}

/**
 * CORE ALGORITHM: Rule-based risk scoring matching Section 3.5 of spec.md
 */
export function calculateRiskScore(input: RiskCalculationInput): RiskCalculationResult {
  const referenceDate = input.referenceDate || new Date().toISOString().slice(0, 10);

  const { sleepAvg, sorenessAvg } = calculateSevenDayAverages(
    input.checkIns,
    referenceDate
  );

  const daysSinceLastCheckIn = calculateDaysSinceLastCheckIn(
    input.checkIns,
    referenceDate
  );

  // 1. Evaluate Watch conditions (§3.5)
  const lowSleep = sleepAvg !== null && sleepAvg < 6.0;
  const highSoreness = sorenessAvg !== null && sorenessAvg >= 4.0;
  const missingCheckIns = daysSinceLastCheckIn >= 4;

  const watchConditionCount =
    (lowSleep ? 1 : 0) +
    (highSoreness ? 1 : 0) +
    (missingCheckIns ? 1 : 0);

  // 2. Check for active injury note in PhysioNotes (§3.5)
  const activeInjuries = input.physioNotes.filter(
    (pn) => pn.status.toLowerCase() === 'active'
  );
  const hasActiveInjury = activeInjuries.length > 0;

  // 3. Determine Risk Level (§3.5)
  // High: 2+ Watch conditions together, OR active injury note + any Watch condition
  let level: RiskLevel = 'low';
  if (watchConditionCount >= 2 || (hasActiveInjury && watchConditionCount >= 1)) {
    level = 'high';
  } else if (watchConditionCount >= 1) {
    level = 'watch';
  }

  // 4. Generate human-readable explanation reasons (§3.5 Always show why an athlete is flagged)
  const reasons: string[] = [];

  if (lowSleep) {
    reasons.push(
      `7-day sleep average (${sleepAvg} hrs) is below critical threshold (< 6.0 hrs)`
    );
  }

  if (highSoreness) {
    reasons.push(
      `7-day soreness average (${sorenessAvg} / 5.0) exceeds Watch threshold (>= 4.0)`
    );
  }

  if (missingCheckIns) {
    if (daysSinceLastCheckIn === 999) {
      reasons.push(`No self-report check-ins have been submitted yet`);
    } else {
      reasons.push(
        `No check-in submitted for ${daysSinceLastCheckIn} consecutive days (>= 4 days)`
      );
    }
  }

  if (hasActiveInjury) {
    const injurySummary = activeInjuries
      .map((i) => i.note.slice(0, 60))
      .join('; ');
    if (level === 'high') {
      reasons.push(
        `Active injury note present (${injurySummary}...) combined with Watch indicators`
      );
    } else {
      reasons.push(`Active injury note recorded: ${injurySummary}...`);
    }
  }

  if (reasons.length === 0) {
    if (sleepAvg !== null && sorenessAvg !== null) {
      reasons.push(
        `All training load and recovery indicators within normal range (7-day sleep: ${sleepAvg} hrs; soreness: ${sorenessAvg})`
      );
    } else {
      reasons.push(`All training load and recovery indicators within normal range`);
    }
  }

  return {
    athleteId: input.athleteId,
    teamId: input.teamId,
    level,
    reasons,
    watchConditions: {
      lowSleep,
      highSoreness,
      missingCheckIns,
    },
    hasActiveInjury,
    computedAt: new Date().toISOString(),
    sevenDayAvgSleep: sleepAvg,
    sevenDayAvgSoreness: sorenessAvg,
    daysSinceLastCheckIn,
  };
}

/**
 * Convert a RiskCalculationResult into a database-ready RiskFlag object
 */
export function toRiskFlag(result: RiskCalculationResult): RiskFlag {
  return {
    id: crypto.randomUUID(),
    athlete_id: result.athleteId,
    team_id: result.teamId,
    level: result.level,
    reason: result.reasons.join(' • '),
    computed_at: result.computedAt,
  };
}
