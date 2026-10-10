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
} from './types';
import { generateSingleEliminationBracket, advanceBracketWinner } from './bracketGenerator';
import { extractTwitchChannel } from './twitch';

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
    registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    timezone: 'Africa/Accra (GMT)',
    rules: '1. All matches played on eFootball Mobile (Online Friend Match). 2. Standard 10-minute match duration with Extra Time and PKs enabled. 3. Standard authentic clubs only; no unauthorized game modifications. 4. Screenshots of final scoreline must be uploaded or verified via referee broadcast.',
    sponsorInfo: 'Supported by Ghanaian Esports Community & Local Gaming Hubs. 1st Place: GH₵450 + Trophy; 2nd Place: GH₵250; 3rd Place: GH₵100.',
    isLiveArenaEnabled: true,
    status: 'LIVE',
    isFeatured: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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
    prizePoolGhc: 500,
    isDefault: true,
    createdAt: new Date().toISOString(),
  };

  // Seed profiles and participants
  const playerNames = [
    { name: 'Kofi Asare', nick: 'KingPro GH', platform: 'Android' as const, id: 'user_1' },
    { name: 'Samuel Doe', nick: 'DarkX', platform: 'iOS' as const, id: 'user_2' },
    { name: 'Nana Yaw', nick: 'NanaEsports', platform: 'Android' as const, id: 'user_3' },
    { name: 'Kwame Tetteh', nick: 'FootyStar', platform: 'iOS' as const, id: 'user_4' },
    { name: 'Eric Mensah', nick: 'ProLegend', platform: 'Android' as const, id: 'user_5' },
    { name: 'Daniel Osei', nick: 'KwekuBall', platform: 'Android' as const, id: 'user_6' },
    { name: 'Michael Boateng', nick: 'Samurai', platform: 'iOS' as const, id: 'user_7' },
    { name: 'Joseph Annan', nick: 'JayFlex', platform: 'Android' as const, id: 'user_8' },
    { name: 'Prince Quaye', nick: 'BlackStar_Gamer', platform: 'Android' as const, id: 'user_9' },
    { name: 'Emmanuel Frimpong', nick: 'AccraStriker', platform: 'iOS' as const, id: 'user_10' },
    { name: 'Bernard Badu', nick: 'TemaSniper', platform: 'Android' as const, id: 'user_11' },
    { name: 'George Adom', nick: 'KumasiKicker', platform: 'iOS' as const, id: 'user_12' },
    { name: 'Isaac Owusu', nick: 'CapeCoastPro', platform: 'Android' as const, id: 'user_13' },
    { name: 'Richmond Arthur', nick: 'TakoradiAce', platform: 'iOS' as const, id: 'user_14' },
    { name: 'Godwin Agyeman', nick: 'GoldCoastKing', platform: 'Android' as const, id: 'user_15' },
    { name: 'David Nortey', nick: 'KasoaChamp', platform: 'Android' as const, id: 'user_16' },
  ];

  const profiles: PlayerProfile[] = playerNames.map((p, idx) => ({
    id: p.id,
    fullName: p.name,
    displayName: p.nick,
    email: `${p.nick.toLowerCase().replace(/[^a-z0-9]/g, '')}@efootballgh.org`,
    phone: `+233 24 123 450${idx}`,
    platform: p.platform,
    inGameId: `GH-EF-${9000 + idx}`,
    avatarUrl: `/avatars/avatar-${(idx % 6) + 1}.png`,
    bio: `Passionate eFootball Mobile competitor representing ${idx % 2 === 0 ? 'Accra' : 'Kumasi'}, Ghana.`,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    stats: {
      tournamentsPlayed: 2,
      matchesPlayed: 8,
      matchesWon: 5 + (idx % 3),
      matchesLost: 3 - (idx % 2),
      championships: idx === 0 ? 1 : 0,
    },
  }));

  const registrations: TournamentRegistration[] = profiles.map((p) => ({
    id: `reg_${initialTournamentId}_${p.id}`,
    tournamentId: initialTournamentId,
    profileId: p.id,
    fullName: p.fullName,
    displayName: p.displayName,
    phone: p.phone,
    email: p.email,
    platform: p.platform,
    inGameId: p.inGameId,
    status: 'APPROVED',
    registeredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: 'Chief Administrator (Accra Esports League)',
    notes: 'Verified player ID and valid phone contact.',
  }));

  const participants: TournamentParticipant[] = profiles.map((p, idx) => ({
    id: `part_${initialTournamentId}_${p.id}`,
    tournamentId: initialTournamentId,
    profileId: p.id,
    displayName: p.displayName,
    inGameId: p.inGameId,
    platform: p.platform,
    seed: idx + 1,
    status: 'ACTIVE',
  }));

  // Generate bracket matches
  const matches = generateSingleEliminationBracket(
    initialTournamentId,
    participants,
    initialTournament.startDate
  );

  // Mark Quarter Final matches with realistic sample data from reference
  const qf1 = matches.find(m => m.round === 2 && m.matchNumber === 9);
  if (qf1) {
    qf1.participant1Name = 'KingPro GH';
    qf1.participant2Name = 'DarkX';
    qf1.participant1Score = 2;
    qf1.participant2Score = 1;
    qf1.status = 'LIVE';
    qf1.twitchChannel = 'kingpro_gh';
    qf1.twitchUrl = 'https://twitch.tv/kingpro_gh';
    qf1.streamStatus = 'LIVE';
    qf1.streamVerifiedAt = new Date().toISOString();
  }

  const qf2 = matches.find(m => m.round === 2 && m.matchNumber === 10);
  if (qf2) {
    qf2.participant1Name = 'NanaEsports';
    qf2.participant2Name = 'FootyStar';
    qf2.participant1Score = 0;
    qf2.participant2Score = 0;
    qf2.status = 'LIVE';
    qf2.twitchChannel = 'nanaesports_live';
    qf2.twitchUrl = 'https://twitch.tv/nanaesports_live';
    qf2.streamStatus = 'LIVE';
    qf2.streamVerifiedAt = new Date().toISOString();
  }

  const announcements: Announcement[] = [
    {
      id: 'ann_1',
      tournamentId: initialTournamentId,
      title: 'Quarter Finals Underway in Live Arena!',
      content: 'Quarter Finals Match 1 (KingPro GH vs DarkX) is now officially streaming live. Check the Live Arena page to watch directly.',
      category: 'STREAM',
      isPinned: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ann_2',
      tournamentId: initialTournamentId,
      title: 'Fair Play & Disconnection Policy Reminder',
      content: 'In the event of an in-game disconnection, the current scoreline is preserved and the remaining time is replayed. All participants must record their match clips or stream via Twitch.',
      category: 'URGENT',
      isPinned: false,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
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
      id: 'log_init',
      action: 'PLATFORM_INITIALIZED',
      entityType: 'SETTINGS',
      entityId: 'global',
      details: 'Initialized platform database and configured Ghana Season 1 tournament.',
      performedBy: 'System Administrator',
      performedAt: new Date().toISOString(),
    },
    {
      id: 'log_bracket',
      action: 'BRACKET_GENERATED',
      entityType: 'BRACKET',
      entityId: initialTournamentId,
      tournamentId: initialTournamentId,
      details: 'Generated 16-player single-elimination tournament bracket with confirmed Ghanaian players.',
      performedBy: 'Admin Kofi',
      performedAt: new Date().toISOString(),
    },
  ];

  return {
    tournaments: [initialTournament],
    templates: [initialTemplate],
    profiles,
    registrations,
    participants,
    matches,
    announcements,
    settings,
    auditLogs,
  };
}

export function readDb(): DatabaseSchema {
  ensureDbDirectory();
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    writeDb(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading database file, reinitializing with fresh state:', error);
    const initial = getInitialData();
    writeDb(initial);
    return initial;
  }
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
