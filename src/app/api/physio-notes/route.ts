import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { validatePhysioNoteInput } from '../../../lib/validators';
import { calculateRiskScore, toRiskFlag } from '../../../lib/risk-scoring';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validatePhysioNoteInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid physio note data', details: validation.errors },
        { status: 400 }
      );
    }

    const noteData = body;
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        demoMode: true,
        message: 'Physio note validated (Demo Mode)',
        data: noteData,
      });
    }

    const { data: insertedNote, error: insertError } = await supabase
      .from('PhysioNote')
      .insert({
        athlete_id: noteData.athlete_id,
        physio_id: noteData.physio_id,
        team_id: noteData.team_id,
        date: noteData.date,
        status: noteData.status,
        note: noteData.note,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to insert physio note', details: insertError.message },
        { status: 500 }
      );
    }

    // Recalculate athlete risk score with updated physio status
    const { data: athleteCheckIns } = await supabase
      .from('CheckIn')
      .select('*')
      .eq('athlete_id', noteData.athlete_id);

    const { data: athletePhysioNotes } = await supabase
      .from('PhysioNote')
      .select('*')
      .eq('athlete_id', noteData.athlete_id);

    const calcResult = calculateRiskScore({
      athleteId: noteData.athlete_id,
      teamId: noteData.team_id,
      checkIns: athleteCheckIns || [],
      physioNotes: athletePhysioNotes || [],
    });

    const newRiskFlag = toRiskFlag(calcResult);

    await supabase.from('RiskFlag').upsert({
      athlete_id: noteData.athlete_id,
      team_id: noteData.team_id,
      level: newRiskFlag.level,
      reason: newRiskFlag.reason,
      computed_at: newRiskFlag.computed_at,
    });

    return NextResponse.json({
      success: true,
      physioNote: insertedNote,
      riskFlag: newRiskFlag,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    );
  }
}
