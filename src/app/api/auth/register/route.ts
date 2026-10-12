import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { hashPassword, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, displayName, platform, efootballId, phone } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { success: false, error: 'Email, password, and display name are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existing = getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const { salt, hash } = hashPassword(password);

    const newUser = createUser({
      email: email.trim().toLowerCase(),
      username: (username || displayName).toLowerCase().replace(/[^a-z0-9_]/g, ''),
      displayName: displayName.trim(),
      role: 'PLAYER',
      passwordHash: hash,
      salt,
      platform: platform || 'Android',
      efootballId: efootballId?.trim(),
      phone: phone?.trim(),
    });

    const session = createSessionToken(newUser);

    const response = NextResponse.json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
        platform: newUser.platform,
        efootballId: newUser.efootballId,
        token: session.token,
      },
    });

    response.cookies.set('zuas_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
