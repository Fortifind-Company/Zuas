import { writeDb } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth';

const adminPass = hashPassword('AdminPass2026!');
const refPass = hashPassword('RefPass2026!');

const cleanState = {
  tournaments: [
    {
      id: 'tourn_ghana_season_1',
      slug: 'efootball-mobile-ghana-championship-s1',
      name: 'eFootball Mobile Ghana Championship',
      edition: 'Season 1 — Accra Cup',
      description: 'The premier competitive online tournament for eFootball Mobile players in Ghana. Compete against the best mobile tacticians for esports glory, verified national rankings, and sponsor-supported rewards.',
      bannerUrl: '/images/hero-banner.jpg',
      gameTitle: 'eFootball 2025 Mobile',
      gamePlatform: 'Android & iOS',
      region: 'Ghana 🇬🇭',
      format: 'SINGLE_ELIMINATION' as const,
      maxParticipants: 16,
      entryFee: 'Free Entry',
      prizePoolGhc: 800,
      registrationDeadline: '2026-10-19T23:59:59.000Z',
      startDate: '2026-10-20T12:00:00.000Z',
      endDate: '2026-10-22T20:00:00.000Z',
      timezone: 'Africa/Accra (GMT)',
      rules: '1. All matches played on eFootball Mobile (Online Friend Match). 2. Standard 10-minute match duration with Extra Time and PKs enabled. 3. Standard authentic clubs only; no unauthorized game modifications. 4. Screenshots of final scoreline must be uploaded or verified via referee broadcast.',
      sponsorInfo: 'Supported by Ghanaian Esports Community & Local Gaming Hubs. 1st Place: GH₵450 + Trophy; 2nd Place: GH₵250; 3rd Place: GH₵100.',
      isLiveArenaEnabled: true,
      status: 'REGISTRATION_OPEN' as const,
      isFeatured: true,
      createdAt: '2026-10-12T12:00:00.000Z',
      updatedAt: '2026-10-12T12:00:00.000Z'
    }
  ],
  templates: [
    {
      id: 'tpl_knockout_16',
      name: '16-Player Single Elimination Cup',
      description: 'Standard 4-round bracket with 10-minute matches and extra time.',
      format: 'SINGLE_ELIMINATION' as const,
      maxParticipants: 16,
      gameTitle: 'eFootball 2025 Mobile',
      gamePlatform: 'Android & iOS',
      rules: 'Standard 10-minute friend match with extra time & penalties.',
      prizePoolGhc: 800,
      isDefault: true,
      createdAt: '2026-10-12T12:00:00.000Z'
    }
  ],
  profiles: [],
  registrations: [],
  participants: [],
  matches: [],
  announcements: [
    {
      id: 'ann_live_1',
      tournamentId: 'tourn_ghana_season_1',
      title: 'Registration Officially Open for Season 1 — Accra Cup',
      content: 'The eFootball Mobile Ghana Championship Season 1 registrations are now open. Cross-play between Android and iOS is fully supported. Register your gamer tag to secure a seed in the 16-player single-elimination bracket.',
      category: 'GENERAL' as const,
      isPinned: true,
      createdAt: '2026-10-12T12:00:00.000Z'
    }
  ],
  settings: {
    platformName: 'Zuas eFootball Mobile Championship',
    contactEmail: 'tournaments@zuas.gh',
    whatsappSupport: '+233 24 123 4567',
    activeSeason: 'Season 1',
    maintenanceMode: false,
    allowRegistrations: true,
    requireScreenshotEvidence: true,
    autoAdvanceWinners: true
  },
  auditLogs: [
    {
      id: 'log_live_init',
      action: 'PLATFORM_LIVE_INITIALIZED',
      entityType: 'SETTINGS' as const,
      entityId: 'global',
      details: 'Platform initialized for live tournament operations. All test fixtures cleared.',
      performedBy: 'System Administrator',
      performedAt: '2026-10-12T12:00:00.000Z'
    }
  ],
  groups: [],
  evidence: [],
  users: [
    {
      id: 'user_admin',
      email: 'admin@zuas.gh',
      username: 'admin',
      displayName: 'Chief Tournament Admin',
      role: 'ADMIN' as const,
      passwordHash: adminPass.hash,
      salt: adminPass.salt,
      phone: '+233241000001',
      createdAt: '2026-10-12T12:00:00.000Z'
    },
    {
      id: 'user_referee',
      email: 'referee@zuas.gh',
      username: 'referee',
      displayName: 'Lead Match Official',
      role: 'REFEREE' as const,
      passwordHash: refPass.hash,
      salt: refPass.salt,
      phone: '+233241000002',
      createdAt: '2026-10-12T12:00:00.000Z'
    }
  ],
  payments: [],
  notifications: [
    {
      id: 'notif_welcome',
      userId: 'ALL',
      title: 'Season 1 Registrations Live',
      message: 'Welcome to eFootball Championship Ghana. Registrations are open now.',
      type: 'ANNOUNCEMENT' as const,
      linkUrl: '/register',
      read: false,
      createdAt: '2026-10-12T12:00:00.000Z'
    }
  ],
  rankings: []
};

writeDb(cleanState);
console.log('RESET_SUCCESS: Database is now 100% clean with 0 matches and 0 test participants.');
