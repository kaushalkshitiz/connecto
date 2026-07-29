import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server';
import { validateObservationInput } from '../../../lib/validators';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = validateObservationInput(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Invalid observation data', details: validation.errors },
        { status: 400 }
      );
    }

    const obsData = body;
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({
        success: true,
        demoMode: true,
        message: 'Observation validated (Demo Mode)',
        data: obsData,
      });
    }

    const { data: insertedObs, error: insertError } = await supabase
      .from('CoachObservation')
      .insert({
        athlete_id: obsData.athlete_id,
        coach_id: obsData.coach_id,
        team_id: obsData.team_id,
        date: obsData.date,
        note: obsData.note,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to insert observation', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      observation: insertedObs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message },
      { status: 500 }
    );
  }
}
