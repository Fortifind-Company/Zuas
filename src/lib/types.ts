export type TournamentStatus =
  | 'DRAFT'
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'READY'
  | 'LIVE'
  | 'COMPLETED'
  | 'ARCHIVED';

export type TournamentFormat = 'SINGLE_ELIMINATION' | 'DOUBLE_ELIMINATION' | 'ROUND_ROBIN' | 'GROUP_STAGE_KNOCKOUT';

export type PlayerPlatform = 'Android' | 'iOS';

export type StreamStatus = 'NONE' | 'CONFIGURED' | 'LIVE' | 'ENDED' | 'UNAVAILABLE';

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'DISPUTED';

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MatchEvidence {
  id: string;
  matchId: string;
  tournamentId: string;
  submittedBy: string; // Player display name or ID
  participantIndex: 1 | 2;
  reportedScore1: number;
  reportedScore2: number;
  screenshotUrl: string; // Base64 or image URL
  notes?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface GroupStanding {
  participantId: string;
  displayName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface TournamentGroup {
  id: string;
  tournamentId: string;
  name: string; // e.g. "Group A"
  standings: GroupStanding[];
}

export interface HeadToHeadStats {
  player1: { id: string; name: string; wins: number };
  player2: { id: string; name: string; wins: number };
  draws: number;
  totalMatches: number;
  recentMatches: TournamentMatch[];
}

export interface Tournament {
  id: string;
  slug: string;
  name: string;
  edition: string;
  description: string;
  bannerUrl: string;
  gameTitle: string;
  gamePlatform: string;
  region: string;
  format: TournamentFormat;
  maxParticipants: number;
  entryFee: string; // e.g. "Free Entry"
  prizePoolGhc: number;
  registrationDeadline: string;
  startDate: string;
  endDate: string;
  timezone: string;
  rules: string;
  sponsorInfo: string;
  isLiveArenaEnabled: boolean;
  status: TournamentStatus;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentTemplate {
  id: string;
  name: string;
  description: string;
  format: TournamentFormat;
  maxParticipants: number;
  gameTitle: string;
  gamePlatform: string;
  rules: string;
  prizePoolGhc: number;
  isDefault: boolean;
  createdAt: string;
}

export interface PlayerProfile {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  platform: PlayerPlatform;
  inGameId: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  stats: {
    tournamentsPlayed: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    championships: number;
  };
}

export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  profileId: string;
  fullName: string;
  displayName: string;
  phone: string;
  email: string;
  platform: PlayerPlatform;
  inGameId: string;
  status: RegistrationStatus;
  registeredAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
}

export interface TournamentParticipant {
  id: string;
  tournamentId: string;
  profileId: string;
  displayName: string;
  inGameId: string;
  platform: PlayerPlatform;
  seed: number;
  status: 'ACTIVE' | 'ELIMINATED' | 'WINNER';
}

export interface TournamentMatch {
  id: string;
  tournamentId: string;
  round: number; // 1 = Round of 16, 2 = QF, 3 = SF, 4 = Final
  roundName: string;
  matchNumber: number;
  participant1Id?: string | null;
  participant2Id?: string | null;
  participant1Name?: string;
  participant2Name?: string;
  participant1Score: number;
  participant2Score: number;
  status: MatchStatus;
  scheduledTime: string;
  twitchChannel?: string;
  twitchUrl?: string;
  streamStatus: StreamStatus;
  streamVerifiedAt?: string;
  winnerId?: string | null;
  nextMatchId?: string | null;
  isFinal?: boolean;
  stageType?: 'GROUP' | 'KNOCKOUT';
  groupId?: string;
  evidence?: MatchEvidence[];
}

export interface Announcement {
  id: string;
  tournamentId: string;
  title: string;
  content: string;
  category: 'URGENT' | 'SCHEDULE' | 'GENERAL' | 'STREAM';
  isPinned: boolean;
  createdAt: string;
}

export interface GlobalSettings {
  platformName: string;
  defaultTimezone: string;
  twitchParentDomains: string[]; // e.g. ["localhost", "127.0.0.1", "zuas.vercel.app"]
  contactEmail: string;
  contactWhatsapp: string;
  rulesDisclaimer: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  entityType: 'TOURNAMENT' | 'REGISTRATION' | 'MATCH' | 'STREAM' | 'BRACKET' | 'SETTINGS';
  entityId: string;
  tournamentId?: string;
  details: string;
  performedBy: string;
  performedAt: string;
}
