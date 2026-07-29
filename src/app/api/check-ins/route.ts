import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { validateCheckInInput } from '../../../lib/validators';
import { calculateRiskScore, toRiskFlag } from '../../../lib/risk-scoring';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateCheckInInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid check-in data', details: validation.errors },
        { status: 400 }
      );
    }

    const checkInData = body;
    const supabase = await createClient();

    if (!supabase) {
      // Demo mode fallback response
      return NextResponse.json({
        success: true,
        demoMode: true,
        message: 'Check-in validated successfully (Demo Mode)',
        data: checkInData,
      });
    }

    // Insert CheckIn record into database
    const { data: insertedCheckIn, error: insertError } = await supabase
      .from('CheckIn')
      .insert({
        athlete_id: checkInData.athlete_id,
        team_id: checkInData.team_id,
        date: checkInData.date,
        sleep_hours: checkInData.sleep_hours,
        soreness: checkInData.soreness,
        mood: checkInData.mood,
        rpe: checkInData.rpe || null,
        note: checkInData.note || null,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to insert check-in record', details: insertError.message },
        { status: 500 }
      );
    }

    // Fetch athlete's past 14 days check-ins and active physio notes to re-evaluate risk score
    const { data: athleteCheckIns } = await supabase
      .from('CheckIn')
      .select('*')
      .eq('athlete_id', checkInData.athlete_id);

    const { data: athletePhysioNotes } = await supabase
      .from('PhysioNote')
      .select('*')
      .eq('athlete_id', checkInData.athlete_id);

    const calcResult = calculateRiskScore({
      athleteId: checkInData.athlete_id,
      teamId: checkInData.team_id,
      checkIns: athleteCheckIns || [],
      physioNotes: athletePhysioNotes || [],
    });

    const newRiskFlag = toRiskFlag(calcResult);

    // Upsert RiskFlag record in database
    await supabase.from('RiskFlag').upsert({
      athlete_id: checkInData.athlete_id,
      team_id: checkInData.team_id,
      level: newRiskFlag.level,
      reason: newRiskFlag.reason,
      computed_at: newRiskFlag.computed_at,
    });

    return NextResponse.json({
      success: true,
      checkIn: insertedCheckIn,
      riskFlag: newRiskFlag,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    );
  }
}
