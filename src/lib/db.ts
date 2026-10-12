import fs from 'fs';
import path from 'path';
import {
  Tournament,
  TournamentTemplate,
  PlayerProfile,
  TournamentRegistration,
  TournamentParticipant,
  TournamentMatch,
  Announcement,
  GlobalSettings,
  AdminAuditLog,
  MatchEvidence,
  TournamentGroup,
  HeadToHeadStats,
  User,
  PaymentTransaction,
  Notification,
  PlayerRanking,
} from './types';
import { generateSingleEliminationBracket, advanceBracketWinner } from './bracketGenerator';
import { generateGroupStageAndMatches, recalculateGroupStandings } from './groupStageGenerator';
import { extractTwitchChannel } from './twitch';
import { computeMatchElo, getRankTier, BASE_ELO } from './elo';
import { hashPassword } from './auth';

interface DatabaseSchema {
  tournaments: Tournament[];
  templates: TournamentTemplate[];
  profiles: PlayerProfile[];
  registrations: TournamentRegistration[];
  participants: TournamentParticipant[];
  matches: TournamentMatch[];
  announcements: Announcement[];
  settings: GlobalSettings;
  auditLogs: AdminAuditLog[];
  groups: TournamentGroup[];
  evidence: MatchEvidence[];
  users: User[];
  payments: PaymentTransaction[];
  notifications: Notification[];
  rankings: PlayerRanking[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function ensureDbDirectory(): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function getInitialData(): DatabaseSchema {
  const initialTournamentId = 'tourn_ghana_season_1';
  const initialTournamentSlug = 'efootball-mobile-ghana-championship-s1';

  const initialTournament: Tournament = {
    id: initialTournamentId,
    slug: initialTournamentSlug,
    name: 'eFootball Mobile Ghana Championship',
    edition: 'Season 1 — Accra Cup',
    description: 'The premier competitive online tournament for eFootball Mobile players in Ghana. Compete against the best mobile tacticians for esports glory, verified national rankings, and sponsor-supported rewards.',
    bannerUrl: '/images/hero-banner.jpg',
    gameTitle: 'eFootball 2025 Mobile',
    gamePlatform: 'Android & iOS',
    region: 'Ghana 🇬🇭',
    format: 'SINGLE_ELIMINATION',
    maxParticipants: 16,
    entryFee: 'Free Entry',
    prizePoolGhc: 800,
    registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    timezone: 'Africa/Accra (GMT)',
    rules: '1. All matches played on eFootball Mobile (Online Friend Match). 2. Standard 10-minute match duration with Extra Time and PKs enabled. 3. Standard authentic clubs only; no unauthorized game modifications. 4. Screenshots of final scoreline must be uploaded or verified via referee broadcast.',
    sponsorInfo: 'Supported by Ghanaian Esports Community & Local Gaming Hubs. 1st Place: GH₵450 + Trophy; 2nd Place: GH₵250; 3rd Place: GH₵100.',
    isLiveArenaEnabled: true,
    status: 'REGISTRATION_OPEN',
    isFeatured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const initialTemplate: TournamentTemplate = {
    id: 'template_standard_16',
    name: 'Standard eFootball 16-Player Cup',
    description: 'Standard 16-player single elimination bracket for eFootball mobile with 10-min match settings.',
    format: 'SINGLE_ELIMINATION',
    maxParticipants: 16,
    gameTitle: 'eFootball 2025 Mobile',
    gamePlatform: 'Android & iOS',
    rules: initialTournament.rules,
    prizePoolGhc: 800,
    isDefault: true,
    createdAt: new Date().toISOString(),
  };

  const adminPass = hashPassword('AdminPass2026!');
  const refPass = hashPassword('RefPass2026!');

  const initialUsers: User[] = [
    {
      id: 'user_admin',
      email: 'admin@zuas.gh',
      username: 'admin',
      displayName: 'Chief Tournament Admin',
      role: 'ADMIN',
      passwordHash: adminPass.hash,
      salt: adminPass.salt,
      phone: '+233241000001',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user_referee',
      email: 'referee@zuas.gh',
      username: 'referee',
      displayName: 'Lead Match Official',
      role: 'REFEREE',
      passwordHash: refPass.hash,
      salt: refPass.salt,
      phone: '+233241000002',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop',
      createdAt: new Date().toISOString(),
    },
  ];

  const announcements: Announcement[] = [
    {
      id: 'ann_live_1',
      tournamentId: initialTournamentId,
      title: 'Registration Officially Open for Season 1 — Accra Cup',
      content: 'The eFootball Mobile Ghana Championship Season 1 registrations are now open. Cross-play between Android and iOS is fully supported. Register your gamer tag to secure a seed in the 16-player single-elimination bracket.',
      category: 'GENERAL',
      isPinned: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ann_live_2',
      tournamentId: initialTournamentId,
      title: 'Official Match Rules & Fair Play Guidelines',
      content: 'All matches must be played in eFootball Mobile Online Friend Match with standard authentic squads. Disconnections must be reported immediately with full-time screenshot evidence.',
      category: 'URGENT',
      isPinned: false,
      createdAt: new Date().toISOString(),
    },
  ];

  const settings: GlobalSettings = {
    platformName: 'eFootball Mobile Championship Ghana',
    defaultTimezone: 'Africa/Accra (GMT)',
    twitchParentDomains: ['localhost', '127.0.0.1', 'zuas.vercel.app'],
    contactEmail: 'tournaments@efootballghana.org',
    contactWhatsapp: '+233 24 000 0000',
    rulesDisclaimer: 'Free to enter esports platform for Ghanaian players. Konami eFootball Mobile is a registered trademark of Konami Digital Entertainment. This community competition is independent and organizer-operated.',
    updatedAt: new Date().toISOString(),
  };

  const auditLogs: AdminAuditLog[] = [
    {
      id: `log_${Date.now()}`,
      action: 'PLATFORM_LIVE_INITIALIZED',
      entityType: 'SETTINGS',
      entityId: 'global',
      details: 'Platform initialized for live tournament operations. All mock data cleared.',
      performedBy: 'System Administrator',
      performedAt: new Date().toISOString(),
    },
  ];

  return {
    tournaments: [initialTournament],
    templates: [initialTemplate],
    profiles: [],
    registrations: [],
    participants: [],
    matches: [],
    announcements,
    settings,
    auditLogs,
    groups: [],
    evidence: [],
    users: initialUsers,
    payments: [],
    notifications: [
      {
        id: 'notif_welcome',
        userId: 'ALL',
        title: 'Season 1 Registrations Live',
        message: 'Welcome to eFootball Championship Ghana. Registrations are open now.',
        type: 'ANNOUNCEMENT',
        linkUrl: '/register',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ],
    rankings: [],
  };
}

export function readDb(): DatabaseSchema {
  ensureDbDirectory();
  let db: DatabaseSchema;
  if (!fs.existsSync(DB_FILE)) {
    db = getInitialData();
    writeDb(db);
    return db;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(raw);
  } catch (error) {
    console.error('Error reading database file, reinitializing with fresh state:', error);
    db = getInitialData();
    writeDb(db);
    return db;
  }

  // Ensure newer collections exist
  let modified = false;
  const initial = getInitialData();
  if (!db.users || db.users.length === 0) {
    db.users = initial.users;
    modified = true;
  }
  if (!db.payments) {
    db.payments = [];
    modified = true;
  }
  if (!db.notifications || db.notifications.length === 0) {
    db.notifications = initial.notifications;
    modified = true;
  }
  if (!db.rankings || db.rankings.length === 0) {
    db.rankings = initial.rankings;
    modified = true;
  }
  if (!db.groups) {
    db.groups = [];
    modified = true;
  }
  if (!db.evidence) {
    db.evidence = [];
    modified = true;
  }
  if (modified) {
    writeDb(db);
  }

  return db;
}

export function writeDb(data: DatabaseSchema): void {
  ensureDbDirectory();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------- TOURNAMENTS ----------------
export function getTournaments(): Tournament[] {
  return readDb().tournaments;
}

export function getFeaturedTournament(): Tournament {
  const db = readDb();
  const featured = db.tournaments.find(t => t.isFeatured && t.status !== 'ARCHIVED');
  if (featured) return featured;
  const active = db.tournaments.find(t => t.status === 'LIVE' || t.status === 'REGISTRATION_OPEN');
  return active || db.tournaments[0];
}

export function getTournamentBySlug(slug: string): Tournament | null {
  const db = readDb();
  return db.tournaments.find(t => t.slug === slug || t.id === slug) || null;
}

export function getTournamentById(id: string): Tournament | null {
  const db = readDb();
  return db.tournaments.find(t => t.id === id) || null;
}

export function createTournament(data: Partial<Tournament> & { name: string }): Tournament {
  const db = readDb();
  const id = `tourn_${Date.now()}`;
  const slug = (data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) + `-${Math.floor(Math.random() * 1000)}`;

  const newTournament: Tournament = {
    id,
    slug,
    name: data.name,
    edition: data.edition || '2025 Open Series',
    description: data.description || 'Competitive eFootball Mobile Tournament in Ghana.',
    bannerUrl: data.bannerUrl || '/images/hero-banner.jpg',
    gameTitle: data.gameTitle || 'eFootball 2025 Mobile',
    gamePlatform: data.gamePlatform || 'Android & iOS',
    region: data.region || 'Ghana 🇬🇭',
    format: data.format || 'SINGLE_ELIMINATION',
    maxParticipants: data.maxParticipants || 16,
    entryFee: 'Free Entry',
    prizePoolGhc: data.prizePoolGhc || 0,
    registrationDeadline: data.registrationDeadline || new Date(Date.now() + 7 * 86400000).toISOString(),
    startDate: data.startDate || new Date(Date.now() + 8 * 86400000).toISOString(),
    endDate: data.endDate || new Date(Date.now() + 10 * 86400000).toISOString(),
    timezone: data.timezone || 'Africa/Accra (GMT)',
    rules: data.rules || 'Standard rules apply.',
    sponsorInfo: data.sponsorInfo || 'Non-cash awards / Sponsor supported.',
    isLiveArenaEnabled: data.isLiveArenaEnabled ?? true,
    status: data.status || 'DRAFT',
    isFeatured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.tournaments.push(newTournament);

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'TOURNAMENT_CREATED',
    entityType: 'TOURNAMENT',
    entityId: id,
    tournamentId: id,
    details: `Created new tournament "${newTournament.name}" in status ${newTournament.status}`,
    performedBy: 'Administrator',
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return newTournament;
}

export function updateTournament(id: string, updates: Partial<Tournament>): Tournament {
  const db = readDb();
  const index = db.tournaments.findIndex(t => t.id === id);
  if (index === -1) throw new Error(`Tournament ${id} not found.`);

  const old = db.tournaments[index];
  const updated: Tournament = {
    ...old,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  db.tournaments[index] = updated;

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'TOURNAMENT_UPDATED',
    entityType: 'TOURNAMENT',
    entityId: id,
    tournamentId: id,
    details: `Updated tournament properties: ${Object.keys(updates).join(', ')}`,
    performedBy: 'Administrator',
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return updated;
}

export function duplicateTournament(id: string, newName?: string): Tournament {
  const db = readDb();
  const source = db.tournaments.find(t => t.id === id);
  if (!source) throw new Error(`Source tournament ${id} not found.`);

  const duplicated = createTournament({
    name: newName || `${source.name} (Copy)`,
    edition: `${source.edition} (Next Edition)`,
    description: source.description,
    bannerUrl: source.bannerUrl,
    gameTitle: source.gameTitle,
    gamePlatform: source.gamePlatform,
    region: source.region,
    format: source.format,
    maxParticipants: source.maxParticipants,
    prizePoolGhc: source.prizePoolGhc,
    rules: source.rules,
    sponsorInfo: source.sponsorInfo,
    isLiveArenaEnabled: source.isLiveArenaEnabled,
    status: 'DRAFT', // Clean participant list, no previous results copied!
  });

  return duplicated;
}

// ---------------- TEMPLATES ----------------
export function getTemplates(): TournamentTemplate[] {
  return readDb().templates;
}

export function createTemplate(data: Omit<TournamentTemplate, 'id' | 'createdAt'>): TournamentTemplate {
  const db = readDb();
  const newTemplate: TournamentTemplate = {
    id: `template_${Date.now()}`,
    name: data.name,
    description: data.description,
    format: data.format,
    maxParticipants: data.maxParticipants,
    gameTitle: data.gameTitle,
    gamePlatform: data.gamePlatform,
    rules: data.rules,
    prizePoolGhc: data.prizePoolGhc,
    isDefault: data.isDefault || false,
    createdAt: new Date().toISOString(),
  };

  if (newTemplate.isDefault) {
    db.templates.forEach(t => (t.isDefault = false));
  }

  db.templates.push(newTemplate);
  writeDb(db);
  return newTemplate;
}

export function createTournamentFromTemplate(templateId: string, overrides: { name: string; edition?: string }): Tournament {
  const db = readDb();
  const template = db.templates.find(t => t.id === templateId);
  if (!template) throw new Error(`Template ${templateId} not found.`);

  return createTournament({
    name: overrides.name,
    edition: overrides.edition || 'New Tournament Edition',
    description: template.description,
    gameTitle: template.gameTitle,
    gamePlatform: template.gamePlatform,
    format: template.format,
    maxParticipants: template.maxParticipants,
    rules: template.rules,
    prizePoolGhc: template.prizePoolGhc,
    status: 'DRAFT',
  });
}

// ---------------- REGISTRATIONS & PLAYERS ----------------
export function getRegistrations(tournamentId?: string): TournamentRegistration[] {
  const db = readDb();
  if (tournamentId) {
    return db.registrations.filter(r => r.tournamentId === tournamentId);
  }
  return db.registrations;
}

export function createRegistration(data: {
  tournamentId: string;
  fullName: string;
  displayName: string;
  phone: string;
  email: string;
  platform: 'Android' | 'iOS';
  inGameId: string;
}): { registration: TournamentRegistration; profile: PlayerProfile } {
  const db = readDb();
  const tournament = db.tournaments.find(t => t.id === data.tournamentId);
  if (!tournament) throw new Error('Tournament not found.');

  if (tournament.status !== 'REGISTRATION_OPEN' && tournament.status !== 'LIVE') {
    throw new Error('Registration is currently closed for this tournament.');
  }

  const currentApprovedCount = db.registrations.filter(
    r => r.tournamentId === data.tournamentId && r.status === 'APPROVED'
  ).length;

  if (currentApprovedCount >= tournament.maxParticipants) {
    throw new Error('Tournament participant capacity has been reached.');
  }

  // Prevent duplicate registration in the same tournament
  const existing = db.registrations.find(
    r =>
      r.tournamentId === data.tournamentId &&
      (r.email.toLowerCase() === data.email.toLowerCase() ||
        r.displayName.toLowerCase() === data.displayName.toLowerCase() ||
        r.inGameId.toLowerCase() === data.inGameId.toLowerCase())
  );
  if (existing) {
    throw new Error('You have already registered for this tournament.');
  }

  // Look up or create reusable player profile
  let profile = db.profiles.find(
    p => p.email.toLowerCase() === data.email.toLowerCase() || p.phone === data.phone
  );

  if (!profile) {
    profile = {
      id: `profile_${Date.now()}`,
      fullName: data.fullName,
      displayName: data.displayName,
      email: data.email,
      phone: data.phone,
      platform: data.platform,
      inGameId: data.inGameId,
      createdAt: new Date().toISOString(),
      stats: {
        tournamentsPlayed: 1,
        matchesPlayed: 0,
        matchesWon: 0,
        matchesLost: 0,
        championships: 0,
      },
    };
    db.profiles.push(profile);
  } else {
    profile.stats.tournamentsPlayed += 1;
  }

  const registration: TournamentRegistration = {
    id: `reg_${data.tournamentId}_${profile.id}`,
    tournamentId: data.tournamentId,
    profileId: profile.id,
    fullName: data.fullName,
    displayName: data.displayName,
    phone: data.phone,
    email: data.email,
    platform: data.platform,
    inGameId: data.inGameId,
    status: 'APPROVED', // Fast approval or pending
    registeredAt: new Date().toISOString(),
  };

  db.registrations.push(registration);

  // Add to participants if approved
  const participant: TournamentParticipant = {
    id: `part_${data.tournamentId}_${profile.id}`,
    tournamentId: data.tournamentId,
    profileId: profile.id,
    displayName: data.displayName,
    inGameId: data.inGameId,
    platform: data.platform,
    seed: currentApprovedCount + 1,
    status: 'ACTIVE',
  };
  db.participants.push(participant);

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'PLAYER_REGISTERED',
    entityType: 'REGISTRATION',
    entityId: registration.id,
    tournamentId: data.tournamentId,
    details: `Player ${data.displayName} (${data.platform}) registered for ${tournament.name}`,
    performedBy: 'User (Self)',
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return { registration, profile };
}

export function updateRegistrationStatus(
  registrationId: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  notes?: string
): TournamentRegistration {
  const db = readDb();
  const reg = db.registrations.find(r => r.id === registrationId);
  if (!reg) throw new Error('Registration not found.');

  reg.status = status;
  reg.notes = notes || reg.notes;
  reg.reviewedAt = new Date().toISOString();
  reg.reviewedBy = 'Administrator';

  // If approved and not in participants list, add
  if (status === 'APPROVED') {
    const exists = db.participants.find(
      p => p.tournamentId === reg.tournamentId && p.profileId === reg.profileId
    );
    if (!exists) {
      const currentParticipants = db.participants.filter(p => p.tournamentId === reg.tournamentId);
      db.participants.push({
        id: `part_${reg.tournamentId}_${reg.profileId}`,
        tournamentId: reg.tournamentId,
        profileId: reg.profileId,
        displayName: reg.displayName,
        inGameId: reg.inGameId,
        platform: reg.platform,
        seed: currentParticipants.length + 1,
        status: 'ACTIVE',
      });
    }
  } else if (status === 'REJECTED') {
    // Remove from participants if previously there
    db.participants = db.participants.filter(
      p => !(p.tournamentId === reg.tournamentId && p.profileId === reg.profileId)
    );
  }

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: `REGISTRATION_${status}`,
    entityType: 'REGISTRATION',
    entityId: reg.id,
    tournamentId: reg.tournamentId,
    details: `Updated registration for ${reg.displayName} to ${status}`,
    performedBy: 'Administrator',
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return reg;
}

// ---------------- BRACKETS & MATCHES ----------------
export function getMatches(tournamentId?: string): TournamentMatch[] {
  const db = readDb();
  if (tournamentId) {
    return db.matches.filter(m => m.tournamentId === tournamentId);
  }
  return db.matches;
}

export function getMatchById(id: string): TournamentMatch | null {
  const db = readDb();
  return db.matches.find(m => m.id === id) || null;
}

export function generateBracket(tournamentId: string): TournamentMatch[] {
  const db = readDb();
  const tournament = db.tournaments.find(t => t.id === tournamentId);
  if (!tournament) throw new Error('Tournament not found.');

  const participants = db.participants.filter(p => p.tournamentId === tournamentId);
  if (participants.length < 2) {
    throw new Error('Need at least 2 confirmed participants to generate a bracket.');
  }

  const matches = generateSingleEliminationBracket(tournamentId, participants, tournament.startDate);

  // Clear existing matches for this tournament and insert new ones
  db.matches = db.matches.filter(m => m.tournamentId !== tournamentId);
  db.matches.push(...matches);

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'BRACKET_GENERATED',
    entityType: 'BRACKET',
    entityId: tournamentId,
    tournamentId,
    details: `Generated ${matches.length} matches for tournament ${tournament.name}`,
    performedBy: 'Administrator',
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return matches;
}

export function updateMatchScore(
  matchId: string,
  winnerId: string,
  score1: number,
  score2: number
): TournamentMatch {
  const db = readDb();
  const targetMatch = db.matches.find(m => m.id === matchId);
  if (!targetMatch) throw new Error('Match not found.');

  const tournamentMatches = db.matches.filter(m => m.tournamentId === targetMatch.tournamentId);
  const updatedTournamentMatches = advanceBracketWinner(
    tournamentMatches,
    matchId,
    winnerId,
    score1,
    score2
  );

  // Replace in db
  db.matches = db.matches.map(m => {
    const updated = updatedTournamentMatches.find(u => u.id === m.id);
    return updated || m;
  });

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'MATCH_SCORE_UPDATED',
    entityType: 'MATCH',
    entityId: matchId,
    tournamentId: targetMatch.tournamentId,
    details: `Updated score ${score1}-${score2}. Winner ID: ${winnerId}`,
    performedBy: 'Administrator',
    performedAt: new Date().toISOString(),
  });

  // Automatically update Elo ratings and national rankings for participants
  if (targetMatch.participant1Id && targetMatch.participant2Id) {
    const loserId = winnerId === targetMatch.participant1Id ? targetMatch.participant2Id : targetMatch.participant1Id;
    updatePlayerEloRatings(winnerId, loserId);
  }

  writeDb(db);
  return db.matches.find(m => m.id === matchId)!;
}

export function updateMatchStream(
  matchId: string,
  rawChannelOrUrl: string,
  streamStatus: 'NONE' | 'CONFIGURED' | 'LIVE' | 'ENDED' | 'UNAVAILABLE'
): TournamentMatch {
  const db = readDb();
  const match = db.matches.find(m => m.id === matchId);
  if (!match) throw new Error('Match not found.');

  const cleanChannel = extractTwitchChannel(rawChannelOrUrl);

  match.twitchChannel = cleanChannel || undefined;
  match.twitchUrl = cleanChannel ? `https://twitch.tv/${cleanChannel}` : undefined;
  match.streamStatus = streamStatus;
  match.streamVerifiedAt = new Date().toISOString();

  // If stream is marked LIVE, also update match status to LIVE
  if (streamStatus === 'LIVE' && match.status === 'SCHEDULED') {
    match.status = 'LIVE';
  }

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'STREAM_UPDATED',
    entityType: 'STREAM',
    entityId: matchId,
    tournamentId: match.tournamentId,
    details: `Assigned channel "${cleanChannel || 'None'}", status: ${streamStatus}`,
    performedBy: 'Administrator',
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return match;
}

// ---------------- ANNOUNCEMENTS, PROFILES, AUDIT & SETTINGS ----------------
export function getAnnouncements(tournamentId?: string): Announcement[] {
  const db = readDb();
  if (tournamentId) {
    return db.announcements.filter(a => a.tournamentId === tournamentId);
  }
  return db.announcements;
}

export function createAnnouncement(data: Omit<Announcement, 'id' | 'createdAt'>): Announcement {
  const db = readDb();
  const ann: Announcement = {
    id: `ann_${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };
  db.announcements.unshift(ann);
  writeDb(db);
  return ann;
}

export function getProfiles(): PlayerProfile[] {
  return readDb().profiles;
}

export function getProfileById(id: string): (PlayerProfile & { matches: TournamentMatch[] }) | null {
  const db = readDb();
  const profile = db.profiles.find(p => p.id === id || p.displayName.toLowerCase() === id.toLowerCase());
  if (!profile) return null;

  // Find all matches featuring this player
  const matches = db.matches.filter(
    m => m.participant1Name === profile.displayName || m.participant2Name === profile.displayName
  );

  return {
    ...profile,
    matches,
  };
}

export function getHeadToHead(player1Name: string, player2Name: string): HeadToHeadStats {
  const db = readDb();
  const p1Lower = player1Name.toLowerCase();
  const p2Lower = player2Name.toLowerCase();

  const directMatches = db.matches.filter(m => {
    const p1 = m.participant1Name?.toLowerCase();
    const p2 = m.participant2Name?.toLowerCase();
    return (
      (p1 === p1Lower && p2 === p2Lower) ||
      (p1 === p2Lower && p2 === p1Lower)
    );
  });

  let p1Wins = 0;
  let p2Wins = 0;
  let draws = 0;

  for (const m of directMatches) {
    if (m.status !== 'COMPLETED') continue;
    if (m.participant1Score === m.participant2Score) {
      draws++;
    } else {
      const p1IsFirst = m.participant1Name?.toLowerCase() === p1Lower;
      const p1Won = p1IsFirst ? m.participant1Score > m.participant2Score : m.participant2Score > m.participant1Score;
      if (p1Won) p1Wins++;
      else p2Wins++;
    }
  }

  return {
    player1: { id: player1Name, name: player1Name, wins: p1Wins },
    player2: { id: player2Name, name: player2Name, wins: p2Wins },
    draws,
    totalMatches: directMatches.length,
    recentMatches: directMatches.slice(0, 5),
  };
}

// ---------------- MATCH EVIDENCE / SCREENSHOT VERIFICATION ----------------
export function submitMatchEvidence(data: {
  matchId: string;
  submittedBy: string;
  participantIndex: 1 | 2;
  reportedScore1: number;
  reportedScore2: number;
  screenshotUrl: string;
  notes?: string;
}): MatchEvidence {
  const db = readDb();
  if (!db.evidence) db.evidence = [];

  const match = db.matches.find(m => m.id === data.matchId);
  if (!match) throw new Error('Match not found.');

  const evidenceItem: MatchEvidence = {
    id: `ev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    matchId: data.matchId,
    tournamentId: match.tournamentId,
    submittedBy: data.submittedBy,
    participantIndex: data.participantIndex,
    reportedScore1: Number(data.reportedScore1),
    reportedScore2: Number(data.reportedScore2),
    screenshotUrl: data.screenshotUrl,
    notes: data.notes,
    status: 'PENDING',
    submittedAt: new Date().toISOString(),
  };

  db.evidence.unshift(evidenceItem);

  // Link to match evidence array
  if (!match.evidence) match.evidence = [];
  match.evidence.unshift(evidenceItem);

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'MATCH_EVIDENCE_SUBMITTED',
    entityType: 'MATCH',
    entityId: match.id,
    tournamentId: match.tournamentId,
    details: `${data.submittedBy} reported score ${data.reportedScore1}-${data.reportedScore2} with screenshot proof.`,
    performedBy: data.submittedBy,
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return evidenceItem;
}

export function getMatchEvidence(matchId?: string): MatchEvidence[] {
  const db = readDb();
  if (!db.evidence) return [];
  if (matchId) {
    return db.evidence.filter(e => e.matchId === matchId);
  }
  return db.evidence;
}

export function reviewMatchEvidence(
  evidenceId: string,
  decision: 'APPROVED' | 'REJECTED',
  reviewedBy: string = 'Administrator'
): { evidence: MatchEvidence; match?: TournamentMatch } {
  const db = readDb();
  if (!db.evidence) db.evidence = [];

  const item = db.evidence.find(e => e.id === evidenceId);
  if (!item) throw new Error('Evidence record not found.');

  item.status = decision;
  item.reviewedAt = new Date().toISOString();
  item.reviewedBy = reviewedBy;

  writeDb(db);

  let match: TournamentMatch | undefined;

  if (decision === 'APPROVED') {
    const freshDb = readDb();
    const targetMatch = freshDb.matches.find(m => m.id === item.matchId);
    if (targetMatch) {
      const winnerId =
        item.reportedScore1 > item.reportedScore2
          ? targetMatch.participant1Id
          : targetMatch.participant2Id;

      if (winnerId) {
        match = updateMatchScore(targetMatch.id, winnerId, item.reportedScore1, item.reportedScore2);
      }
    }
  }

  return { evidence: item, match };
}

// ---------------- GROUP STAGE & STANDINGS ----------------
export function getTournamentGroups(tournamentId: string): TournamentGroup[] {
  const db = readDb();
  if (!db.groups) return [];
  const groups = db.groups.filter(g => g.tournamentId === tournamentId);
  // Recalculate standings live
  return groups.map(g => ({
    ...g,
    standings: recalculateGroupStandings(g, db.matches),
  }));
}

export function generateGroupStage(tournamentId: string): { groups: TournamentGroup[]; matches: TournamentMatch[] } {
  const db = readDb();
  const tournament = db.tournaments.find(t => t.id === tournamentId);
  if (!tournament) throw new Error('Tournament not found.');

  const participants = db.participants.filter(p => p.tournamentId === tournamentId);
  if (participants.length < 4) {
    throw new Error('At least 4 participants required for Group Stage.');
  }

  const { groups, matches } = generateGroupStageAndMatches(
    tournamentId,
    participants,
    tournament.startDate
  );

  if (!db.groups) db.groups = [];
  db.groups = db.groups.filter(g => g.tournamentId !== tournamentId);
  db.groups.push(...groups);

  db.matches = db.matches.filter(m => m.tournamentId !== tournamentId);
  db.matches.push(...matches);

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'GROUP_STAGE_GENERATED',
    entityType: 'BRACKET',
    entityId: tournamentId,
    tournamentId,
    details: `Generated ${groups.length} groups and ${matches.length} fixtures for tournament ${tournament.name}`,
    performedBy: 'Administrator',
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return { groups, matches };
}

export function getAuditLogs(): AdminAuditLog[] {
  return readDb().auditLogs;
}

export function getSettings(): GlobalSettings {
  return readDb().settings;
}

export function updateSettings(updates: Partial<GlobalSettings>): GlobalSettings {
  const db = readDb();
  db.settings = {
    ...db.settings,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  return db.settings;
}

// ---------------- USERS & AUTH ----------------
export function getUsers(): User[] {
  return readDb().users;
}

export function getUserById(id: string): User | null {
  return readDb().users.find(u => u.id === id) || null;
}

export function getUserByEmail(email: string): User | null {
  return readDb().users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const db = readDb();
  if (db.users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    throw new Error('User with this email already exists.');
  }
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'USER_REGISTERED',
    entityType: 'AUTH',
    entityId: newUser.id,
    details: `User registered: ${newUser.displayName} (${newUser.email}, role: ${newUser.role})`,
    performedBy: newUser.displayName,
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User {
  const db = readDb();
  const user = db.users.find(u => u.id === id);
  if (!user) throw new Error('User not found.');
  Object.assign(user, updates);
  writeDb(db);
  return user;
}

// ---------------- PAYMENTS ----------------
export function getPayments(): PaymentTransaction[] {
  return readDb().payments;
}

export function getPaymentByReference(reference: string): PaymentTransaction | null {
  return readDb().payments.find(p => p.reference === reference) || null;
}

export function createPayment(data: Omit<PaymentTransaction, 'id' | 'createdAt'>): PaymentTransaction {
  const db = readDb();
  const newPayment: PaymentTransaction = {
    ...data,
    id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  db.payments.unshift(newPayment);

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'PAYMENT_INITIALIZED',
    entityType: 'PAYMENT',
    entityId: newPayment.id,
    tournamentId: newPayment.tournamentId,
    details: `Payment reference ${newPayment.reference} created for GH₵${newPayment.amountGhc} via ${newPayment.provider}`,
    performedBy: newPayment.customerEmail,
    performedAt: new Date().toISOString(),
  });

  writeDb(db);
  return newPayment;
}

export function updatePaymentStatus(
  reference: string,
  status: 'SUCCESS' | 'FAILED',
  paidAt?: string
): PaymentTransaction {
  const db = readDb();
  const payment = db.payments.find(p => p.reference === reference);
  if (!payment) throw new Error('Payment not found.');

  payment.status = status;
  if (paidAt) payment.paidAt = paidAt;

  db.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: `PAYMENT_${status}`,
    entityType: 'PAYMENT',
    entityId: payment.id,
    tournamentId: payment.tournamentId,
    details: `Payment reference ${payment.reference} updated to ${status}`,
    performedBy: 'System / Gateway',
    performedAt: new Date().toISOString(),
  });

  // If payment succeeded, automatically verify and approve registration if pending
  if (status === 'SUCCESS') {
    const reg = db.registrations.find(
      r => r.tournamentId === payment.tournamentId && r.email.toLowerCase() === payment.customerEmail.toLowerCase()
    );
    if (reg && reg.status === 'PENDING') {
      reg.status = 'APPROVED';
      reg.reviewedAt = new Date().toISOString();
      reg.reviewedBy = 'Payment System (Automated)';
    }
  }

  writeDb(db);
  return payment;
}

// ---------------- NOTIFICATIONS ----------------
export function getNotifications(userId?: string): Notification[] {
  const db = readDb();
  if (userId) {
    return db.notifications.filter(n => n.userId === userId || n.userId === 'ALL');
  }
  return db.notifications;
}

export function createNotification(data: Omit<Notification, 'id' | 'createdAt'>): Notification {
  const db = readDb();
  const notification: Notification = {
    ...data,
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  db.notifications.unshift(notification);
  writeDb(db);
  return notification;
}

export function markNotificationAsRead(id: string, userId: string): boolean {
  const db = readDb();
  const notif = db.notifications.find(n => n.id === id && (n.userId === userId || n.userId === 'ALL'));
  if (notif) {
    notif.read = true;
    writeDb(db);
    return true;
  }
  return false;
}

export function markAllNotificationsAsRead(userId: string): boolean {
  const db = readDb();
  db.notifications.forEach(n => {
    if (n.userId === userId || n.userId === 'ALL') {
      n.read = true;
    }
  });
  writeDb(db);
  return true;
}

// ---------------- RANKINGS & ELO ----------------
export function getRankings(): PlayerRanking[] {
  const db = readDb();
  return [...db.rankings].sort((a, b) => b.elo - a.elo).map((rank, index) => ({
    ...rank,
    nationalRank: index + 1,
  }));
}

export function getPlayerRanking(playerId: string): PlayerRanking | null {
  const allRanked = getRankings();
  return allRanked.find(r => r.playerId === playerId) || null;
}

export function updatePlayerEloRatings(
  winnerParticipantId: string,
  loserParticipantId: string,
  isDraw: boolean = false
): { winnerRank: PlayerRanking; loserRank: PlayerRanking } | null {
  const db = readDb();
  const winnerPart = db.participants.find(p => p.id === winnerParticipantId);
  const loserPart = db.participants.find(p => p.id === loserParticipantId);

  if (!winnerPart || !loserPart) return null;

  let winnerRank = db.rankings.find(r => r.playerId === winnerPart.profileId);
  let loserRank = db.rankings.find(r => r.playerId === loserPart.profileId);

  if (!winnerRank) {
    winnerRank = {
      playerId: winnerPart.profileId,
      displayName: winnerPart.displayName,
      efootballId: winnerPart.inGameId,
      platform: winnerPart.platform,
      elo: BASE_ELO,
      peakElo: BASE_ELO,
      rankTier: getRankTier(BASE_ELO),
      nationalRank: db.rankings.length + 1,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      winRatePct: 0,
    };
    db.rankings.push(winnerRank);
  }

  if (!loserRank) {
    loserRank = {
      playerId: loserPart.profileId,
      displayName: loserPart.displayName,
      efootballId: loserPart.inGameId,
      platform: loserPart.platform,
      elo: BASE_ELO,
      peakElo: BASE_ELO,
      rankTier: getRankTier(BASE_ELO),
      nationalRank: db.rankings.length + 1,
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      winRatePct: 0,
    };
    db.rankings.push(loserRank);
  }

  const resultScore = isDraw ? 0.5 : 1;
  const { newRatingA, newRatingB } = computeMatchElo(winnerRank.elo, loserRank.elo, resultScore);

  winnerRank.elo = newRatingA;
  winnerRank.peakElo = Math.max(winnerRank.peakElo, newRatingA);
  winnerRank.rankTier = getRankTier(newRatingA);
  winnerRank.matchesPlayed += 1;
  if (!isDraw) winnerRank.matchesWon += 1;
  winnerRank.winRatePct = Math.round((winnerRank.matchesWon / winnerRank.matchesPlayed) * 100);

  loserRank.elo = newRatingB;
  loserRank.rankTier = getRankTier(newRatingB);
  loserRank.matchesPlayed += 1;
  if (!isDraw) loserRank.matchesLost += 1;
  loserRank.winRatePct = Math.round((loserRank.matchesWon / loserRank.matchesPlayed) * 100);

  db.rankings.sort((a, b) => b.elo - a.elo);
  db.rankings.forEach((r, idx) => {
    r.nationalRank = idx + 1;
  });

  writeDb(db);
  return { winnerRank, loserRank };
}
