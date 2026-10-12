import { NextRequest, NextResponse } from 'next/server';
import {
  getNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/db';
import { verifySessionToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('zuas_session')?.value;
  const session = token ? verifySessionToken(token) : null;
  const userId = session?.userId;

  const notifications = getNotifications(userId);
  return NextResponse.json({ success: true, data: notifications });
}

export async function POST(req: NextRequest) {
  try {
    const { userId, title, message, type, linkUrl } = await req.json();

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required.' },
        { status: 400 }
      );
    }

    const notification = createNotification({
      userId: userId || 'ALL',
      title,
      message,
      type: type || 'ANNOUNCEMENT',
      linkUrl: linkUrl || '',
      read: false,
    });

    return NextResponse.json({ success: true, data: notification });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get('zuas_session')?.value;
    const session = token ? verifySessionToken(token) : null;
    const userId = session?.userId || 'ALL';

    const { id, markAll } = await req.json();

    if (markAll) {
      markAllNotificationsAsRead(userId);
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Notification ID required.' }, { status: 400 });
    }

    const success = markNotificationAsRead(id, userId);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
