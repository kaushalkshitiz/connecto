'use client';

// =============================================================================
// Athlete Risk Intelligence Platform
// Demo Context & Role Switcher Provider
// =============================================================================

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getInitialDemoState } from '../lib/demo-data';
import { calculateRiskScore, toRiskFlag } from '../lib/risk-scoring';
import {
  CheckIn,
  CoachObservation,
  PhysioNote,
  RiskFlag,
  Team,
  TeamMembership,
  User,
  UserRole,
} from '../types';

interface DemoContextType {
  isDemoMode: boolean;
  team: Team;
  users: User[];
  memberships: TeamMembership[];
  checkIns: CheckIn[];
  observations: CoachObservation[];
  physioNotes: PhysioNote[];
  riskFlags: RiskFlag[];
  activeUser: User;
  activeRole: UserRole;
  switchUser: (userId: string) => void;
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'created_at'>) => void;
  addObservation: (obs: Omit<CoachObservation, 'id' | 'created_at'>) => void;
  addPhysioNote: (note: Omit<PhysioNote, 'id' | 'created_at'>) => void;
  reassignAthleteCoach: (athleteId: string, newCoachId: string | null) => void;
  resetDemoData: () => void;
  getAthleteRiskSummary: (athleteId: string) => {
    athlete: User;
    currentRisk: RiskFlag;
    latestCheckIn: CheckIn | null;
    sevenDayAvgSleep: number | null;
    sevenDayAvgSoreness: number | null;
    sevenDayAvgMood: number | null;
    daysSinceLastCheckIn: number;
    activeInjuryNotes: PhysioNote[];
    recentObservations: CoachObservation[];
    recentCheckIns: CheckIn[];
  };
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'athlete_risk_platform_demo_state_v1';

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const initialState = getInitialDemoState();

  const [team, setTeam] = useState<Team>(initialState.team);
  const [users, setUsers] = useState<User[]>(initialState.users);
  const [memberships, setMemberships] = useState<TeamMembership[]>(
    initialState.memberships
  );
  const [checkIns, setCheckIns] = useState<CheckIn[]>(initialState.checkIns);
  const [observations, setObservations] = useState<CoachObservation[]>(
    initialState.observations
  );
  const [physioNotes, setPhysioNotes] = useState<PhysioNote[]>(
    initialState.physioNotes
  );
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>(initialState.riskFlags);

  // Default active user is Coach Marcus Vance (id: '00000000-0000-4000-8000-000000000002')
  const [activeUserId, setActiveUserId] = useState<string>(
    '00000000-0000-4000-8000-000000000002'
  );

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.team && parsed.users) {
          setTeam(parsed.team);
          setUsers(parsed.users);
          setMemberships(parsed.memberships);
          setCheckIns(parsed.checkIns);
          setObservations(parsed.observations);
          setPhysioNotes(parsed.physioNotes);
          setRiskFlags(parsed.riskFlags);
          if (parsed.activeUserId) {
            setActiveUserId(parsed.activeUserId);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load demo state from localStorage', e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          team,
          users,
          memberships,
          checkIns,
          observations,
          physioNotes,
          riskFlags,
          activeUserId,
        })
      );
    } catch (e) {
      console.error('Failed to save demo state to localStorage', e);
    }
  }, [
    team,
    users,
    memberships,
    checkIns,
    observations,
    physioNotes,
    riskFlags,
    activeUserId,
  ]);

  const activeUser =
    users.find((u) => u.id === activeUserId) || users[1]; // Fallback to Coach Marcus

  const activeMembership = memberships.find(
    (m) => m.user_id === activeUser.id && m.team_id === team.id
  );
  const activeRole: UserRole = activeMembership?.role || 'coach';

  const switchUser = (userId: string) => {
    setActiveUserId(userId);
  };

  /**
   * Helper to recalculate and update an athlete's RiskFlag
   */
  const recalculateAthleteRisk = (
    athleteId: string,
    updatedCheckIns: CheckIn[],
    updatedPhysioNotes: PhysioNote[]
  ) => {
    const calc = calculateRiskScore({
      athleteId,
      teamId: team.id,
      checkIns: updatedCheckIns.filter((c) => c.athlete_id === athleteId),
      physioNotes: updatedPhysioNotes.filter((p) => p.athlete_id === athleteId),
    });

    const newFlag = toRiskFlag(calc);

    setRiskFlags((prev) => {
      const filtered = prev.filter((rf) => rf.athlete_id !== athleteId);
      return [newFlag, ...filtered];
    });
  };

  const addCheckIn = (newCiData: Omit<CheckIn, 'id' | 'created_at'>) => {
    const newCi: CheckIn = {
      ...newCiData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };

    const updatedCheckIns = [newCi, ...checkIns];
    setCheckIns(updatedCheckIns);
    recalculateAthleteRisk(newCi.athlete_id, updatedCheckIns, physioNotes);
  };

  const addObservation = (
    newObsData: Omit<CoachObservation, 'id' | 'created_at'>
  ) => {
    const coach = users.find((u) => u.id === newObsData.coach_id);
    const newObs: CoachObservation = {
      ...newObsData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      coach_name: coach ? coach.name : undefined,
    };
    setObservations((prev) => [newObs, ...prev]);
  };

  const addPhysioNote = (
    newPnData: Omit<PhysioNote, 'id' | 'created_at'>
  ) => {
    const physio = users.find((u) => u.id === newPnData.physio_id);
    const newPn: PhysioNote = {
      ...newPnData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      physio_name: physio ? physio.name : undefined,
    };

    const updatedPhysioNotes = [newPn, ...physioNotes];
    setPhysioNotes(updatedPhysioNotes);
    recalculateAthleteRisk(newPn.athlete_id, checkIns, updatedPhysioNotes);
  };

  /**
   * Reassign athlete between coaches (demonstrating ON DELETE SET NULL / zero data loss)
   */
  const reassignAthleteCoach = (athleteId: string, newCoachId: string | null) => {
    // In our MVP schema, coach observations retain their coach_id with ON DELETE SET NULL.
    // If we reassign an athlete, existing observations remain intact!
    setObservations((prev) =>
      prev.map((obs) => {
        if (obs.athlete_id === athleteId && newCoachId === null) {
          // If coach is removed/unassigned, set coach_id to null without deleting data
          return { ...obs, coach_id: null, coach_name: 'Former Coach (Unassigned)' };
        }
        return obs;
      })
    );
  };

  const resetDemoData = () => {
    const fresh = getInitialDemoState();
    setTeam(fresh.team);
    setUsers(fresh.users);
    setMemberships(fresh.memberships);
    setCheckIns(fresh.checkIns);
    setObservations(fresh.observations);
    setPhysioNotes(fresh.physioNotes);
    setRiskFlags(fresh.riskFlags);
    setActiveUserId('00000000-0000-4000-8000-000000000002'); // Coach Marcus
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const getAthleteRiskSummary = (athleteId: string) => {
    const athlete = users.find((u) => u.id === athleteId) || users[0];
    const currentRisk =
      riskFlags.find((rf) => rf.athlete_id === athleteId) || {
        id: 'default',
        athlete_id: athleteId,
        team_id: team.id,
        level: 'low',
        reason: 'Normal training and recovery metrics',
        computed_at: new Date().toISOString(),
      };

    const athleteCheckIns = checkIns
      .filter((c) => c.athlete_id === athleteId)
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    const latestCheckIn = athleteCheckIns.length > 0 ? athleteCheckIns[0] : null;

    const athletePhysioNotes = physioNotes
      .filter((p) => p.athlete_id === athleteId)
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    const activeInjuryNotes = athletePhysioNotes.filter(
      (pn) => pn.status.toLowerCase() === 'active'
    );

    const athleteObservations = observations
      .filter((o) => o.athlete_id === athleteId)
      .sort((a, b) => (a.date > b.date ? -1 : 1));

    const calcResult = calculateRiskScore({
      athleteId,
      teamId: team.id,
      checkIns: athleteCheckIns,
      physioNotes: athletePhysioNotes,
    });

    return {
      athlete,
      currentRisk,
      latestCheckIn,
      sevenDayAvgSleep: calcResult.sevenDayAvgSleep,
      sevenDayAvgSoreness: calcResult.sevenDayAvgSoreness,
      sevenDayAvgMood:
        athleteCheckIns.length > 0
          ? Number(
              (
                athleteCheckIns
                  .slice(0, 7)
                  .reduce((sum, ci) => sum + Number(ci.mood), 0) /
                Math.min(athleteCheckIns.length, 7)
              ).toFixed(1)
            )
          : null,
      daysSinceLastCheckIn: calcResult.daysSinceLastCheckIn,
      activeInjuryNotes,
      recentObservations: athleteObservations,
      recentCheckIns: athleteCheckIns.slice(0, 14), // Last 14 for charts
    };
  };

  return (
    <DemoContext.Provider
      value={{
        isDemoMode: true,
        team,
        users,
        memberships,
        checkIns,
        observations,
        physioNotes,
        riskFlags,
        activeUser,
        activeRole,
        switchUser,
        addCheckIn,
        addObservation,
        addPhysioNote,
        reassignAthleteCoach,
        resetDemoData,
        getAthleteRiskSummary,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
