import { NextResponse } from 'next/server';
import { getTemplates, createTemplate, createTournamentFromTemplate } from '@/lib/db';

export async function GET() {
  try {
    const templates = getTemplates();
    return NextResponse.json({ success: true, data: templates });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === 'CREATE_TOURNAMENT') {
      const { templateId, name, edition } = body;
      const tournament = createTournamentFromTemplate(templateId, { name, edition });
      return NextResponse.json({ success: true, data: tournament }, { status: 201 });
    }

    const template = createTemplate(body);
    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
