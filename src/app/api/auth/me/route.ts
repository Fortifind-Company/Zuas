import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/auth';
import { getUserById } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const tokenFromCookie = req.cookies.get('zuas_session')?.value;
    const authHeader = req.headers.get('authorization');
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    const user = getUserById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        platform: user.platform,
        efootballId: user.efootballId,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, user: null }, { status: 200 });
  }
}
