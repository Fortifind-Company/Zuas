/**
 * Automated Verification Test Suite for eFootball Mobile Championship Platform
 * Tests multi-tournament independence, bracket generation, winner advancement,
 * twitch validation, registration limits, duplicate protection,
 * match screenshot evidence verification, H2H statistics, and group stage engine.
 */

import assert from 'assert';
import {
  extractTwitchChannel,
  isValidTwitchChannel,
  getTwitchEmbedUrl,
} from '../src/lib/twitch';
import {
  generateSingleEliminationBracket,
  advanceBracketWinner,
} from '../src/lib/bracketGenerator';
import {
  generateGroupStageAndMatches,
  recalculateGroupStandings,
} from '../src/lib/groupStageGenerator';
import {
  getTournaments,
  createTournament,
  duplicateTournament,
  createRegistration,
  getRegistrations,
  generateBracket,
  updateMatchScore,
  updateMatchStream,
  getMatches,
  getProfileById,
  getHeadToHead,
  submitMatchEvidence,
  getMatchEvidence,
  reviewMatchEvidence,
  generateGroupStage,
  getTournamentGroups,
} from '../src/lib/db';

console.log('🚀 Running eFootball Mobile Platform Verification Test Suite...\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ FAIL: ${name}`);
    console.error(error);
    testsFailed++;
  }
}

// 1. Twitch Channel Extraction & Validation
test('Twitch URL and Channel Parsing', () => {
  assert.strictEqual(extractTwitchChannel('kingpro_gh'), 'kingpro_gh');
  assert.strictEqual(extractTwitchChannel('https://www.twitch.tv/kingpro_gh'), 'kingpro_gh');
  assert.strictEqual(extractTwitchChannel('http://twitch.tv/DarkX_2025'), 'darkx_2025');
  assert.strictEqual(extractTwitchChannel('invalid channel with spaces!'), null);
  assert.strictEqual(isValidTwitchChannel('kingpro_gh'), true);
  assert.strictEqual(isValidTwitchChannel(''), false);
});

// 2. Twitch Embed URL with Safe Parent Domains
test('Twitch Embed Parent Domains', () => {
  const url = getTwitchEmbedUrl('kingpro_gh', ['zuas.vercel.app', 'localhost:3000']);
  assert.ok(url.includes('channel=kingpro_gh'), 'Should contain channel parameter');
  assert.ok(url.includes('parent=localhost'), 'Should contain localhost parent');
  assert.ok(url.includes('parent=zuas.vercel.app'), 'Should contain production parent');
});

// 3. Single Elimination Bracket Generation & Byes
test('Single Elimination Bracket Generation (8 Participants)', () => {
  const participants = Array.from({ length: 8 }).map((_, i) => ({
    id: `part_${i + 1}`,
    tournamentId: 'test_t1',
    profileId: `prof_${i + 1}`,
    displayName: `Player ${i + 1}`,
    inGameId: `ID_${i + 1}`,
    platform: 'Android' as const,
    seed: i + 1,
    status: 'ACTIVE' as const,
  }));

  const matches = generateSingleEliminationBracket('test_t1', participants, new Date().toISOString());
  // 8 participants -> 4 in round 1, 2 in round 2, 1 in final = 7 total matches
  assert.strictEqual(matches.length, 7, '8 participants should produce 7 matches');
  const round1 = matches.filter(m => m.round === 1);
  assert.strictEqual(round1.length, 4, 'Round 1 should have 4 matches');
  const finalMatch = matches.find(m => m.isFinal);
  assert.ok(finalMatch, 'Should have a grand final');
});

// 4. Bracket Winner Advancement
test('Bracket Winner Advancement to Next Round', () => {
  const participants = Array.from({ length: 4 }).map((_, i) => ({
    id: `p_${i + 1}`,
    tournamentId: 'test_t2',
    profileId: `prof_${i + 1}`,
    displayName: `P${i + 1}`,
    inGameId: `ID_${i + 1}`,
    platform: 'iOS' as const,
    seed: i + 1,
    status: 'ACTIVE' as const,
  }));

  const matches = generateSingleEliminationBracket('test_t2', participants, new Date().toISOString());
  const match1 = matches.find(m => m.round === 1 && m.matchNumber === 1);
  assert.ok(match1, 'Match 1 should exist');

  // Advance participant 1 as winner
  const updated = advanceBracketWinner(matches, match1.id, match1.participant1Id!, 3, 1);
  const updatedMatch1 = updated.find(m => m.id === match1.id);
  assert.strictEqual(updatedMatch1?.status, 'COMPLETED');
  assert.strictEqual(updatedMatch1?.participant1Score, 3);
  assert.strictEqual(updatedMatch1?.winnerId, match1.participant1Id);

  // Check that final match slot was populated
  const finalMatch = updated.find(m => m.id === match1.nextMatchId);
  assert.strictEqual(finalMatch?.participant1Id, match1.participant1Id);
});

// 5. Multi-Tournament Independence
test('Multi-Tournament Independence & Isolation', () => {
  const t1 = createTournament({
    name: 'Ghana Season Alpha',
    edition: 'Alpha Cup',
    maxParticipants: 8,
    status: 'REGISTRATION_OPEN',
  });

  const t2 = createTournament({
    name: 'Ghana Season Beta',
    edition: 'Beta Cup',
    maxParticipants: 16,
    status: 'REGISTRATION_OPEN',
  });

  assert.notStrictEqual(t1.id, t2.id, 'Tournaments must have unique IDs');
  assert.notStrictEqual(t1.slug, t2.slug, 'Tournaments must have unique slugs');

  // Register player in t1
  const reg1 = createRegistration({
    tournamentId: t1.id,
    fullName: 'Test Player One',
    displayName: 'TagAlpha',
    phone: '+233 24 999 1111',
    email: 'alpha@test.com',
    platform: 'Android',
    inGameId: 'ID-ALPHA',
  });

  // Verify player is registered in t1 but NOT in t2
  const t1Regs = getRegistrations(t1.id);
  const t2Regs = getRegistrations(t2.id);

  assert.ok(t1Regs.some(r => r.displayName === 'TagAlpha'), 'Player should be in t1');
  assert.ok(!t2Regs.some(r => r.displayName === 'TagAlpha'), 'Player must NOT bleed into t2');
});

// 6. Duplicate Registration Protection
test('Prevent Duplicate Registrations in Same Tournament', () => {
  const t = createTournament({
    name: 'Duplicate Check Cup',
    status: 'REGISTRATION_OPEN',
  });

  createRegistration({
    tournamentId: t.id,
    fullName: 'Kofi Duplicate',
    displayName: 'KofiDupe',
    phone: '+233 24 888 8888',
    email: 'dupe@test.com',
    platform: 'iOS',
    inGameId: 'ID-DUPE-1',
  });

  assert.throws(() => {
    createRegistration({
      tournamentId: t.id,
      fullName: 'Kofi Duplicate',
      displayName: 'KofiDupe',
      phone: '+233 24 888 8888',
      email: 'dupe@test.com',
      platform: 'iOS',
      inGameId: 'ID-DUPE-1',
    });
  }, /already registered/);
});

// 7. Tournament Duplication Clean Slate
test('Tournament Duplication Starts with Clean Participant Slate', () => {
  const source = createTournament({
    name: 'Template Source Cup',
    prizePoolGhc: 750,
    rules: 'Custom rules here.',
    status: 'REGISTRATION_OPEN',
  });

  createRegistration({
    tournamentId: source.id,
    fullName: 'Old Player',
    displayName: 'OldTag',
    phone: '+233 24 777 7777',
    email: 'old@test.com',
    platform: 'Android',
    inGameId: 'ID-OLD',
  });

  const duplicate = duplicateTournament(source.id, 'Template Source Cup (Copy)');
  assert.strictEqual(duplicate.rules, source.rules);
  assert.strictEqual(duplicate.prizePoolGhc, source.prizePoolGhc);

  const duplicateRegs = getRegistrations(duplicate.id);
  assert.strictEqual(duplicateRegs.length, 0, 'New duplicated tournament must start with 0 participants');
});

// 8. Feature 1: Screenshot Evidence & Referee Review
test('Feature 1: Match Screenshot Evidence Submission & 1-Click Referee Approval', () => {
  const t = createTournament({
    name: 'Evidence Test Cup',
    status: 'REGISTRATION_OPEN',
  });

  createRegistration({
    tournamentId: t.id,
    fullName: 'Kofi Striker',
    displayName: 'KofiStriker',
    phone: '+233 20 111 2222',
    email: 'kofi@striker.com',
    platform: 'Android',
    inGameId: 'GH-STR-1',
  });

  createRegistration({
    tournamentId: t.id,
    fullName: 'Kwame Winger',
    displayName: 'KwameWinger',
    phone: '+233 20 333 4444',
    email: 'kwame@winger.com',
    platform: 'iOS',
    inGameId: 'GH-WIN-2',
  });

  const bracket = generateBracket(t.id);
  assert.ok(bracket.length > 0, 'Bracket should have generated matches');
  const targetMatch = bracket[0];

  // Submit Evidence
  const ev = submitMatchEvidence({
    matchId: targetMatch.id,
    submittedBy: 'KofiStriker',
    participantIndex: 1,
    reportedScore1: 3,
    reportedScore2: 1,
    screenshotUrl: 'data:image/png;base64,mockimagedata',
    notes: 'Clean full-time match',
  });

  assert.strictEqual(ev.status, 'PENDING');
  assert.strictEqual(ev.reportedScore1, 3);
  assert.strictEqual(ev.reportedScore2, 1);

  // Referee Review & Approval
  const reviewResult = reviewMatchEvidence(ev.id, 'APPROVED', 'Head Referee');
  assert.strictEqual(reviewResult.evidence.status, 'APPROVED');

  // Verify match was updated automatically
  const updatedMatches = getMatches(t.id);
  const matchAfterApproval = updatedMatches.find(m => m.id === targetMatch.id);
  assert.strictEqual(matchAfterApproval?.status, 'COMPLETED');
  assert.strictEqual(matchAfterApproval?.participant1Score, 3);
  assert.strictEqual(matchAfterApproval?.participant2Score, 1);
});

// 9. Feature 3: Player Profile & Head-to-Head Stats
test('Feature 3: Player Profile & Head-to-Head Rivalry Analysis', () => {
  const prof = getProfileById('KofiStriker');
  assert.ok(prof, 'Profile should be retrievable by display name');
  assert.strictEqual(prof.displayName, 'KofiStriker');

  const h2h = getHeadToHead('KofiStriker', 'KwameWinger');
  assert.ok(h2h, 'H2H stats object should be generated');
  assert.strictEqual(h2h.player1.name, 'KofiStriker');
  assert.strictEqual(h2h.player2.name, 'KwameWinger');
  assert.ok(h2h.totalMatches >= 1, 'Should reflect the completed match');
});

// 10. Feature 4: Group Stage Engine & Standings Calculator
test('Feature 4: Group Stage Round-Robin Fixtures & Live Standings Calculation', () => {
  const participants = [
    { id: 'p1', tournamentId: 'group_t', profileId: 'prof_1', displayName: 'Player 1', inGameId: 'ID1', platform: 'Android' as const, seed: 1, status: 'ACTIVE' as const },
    { id: 'p2', tournamentId: 'group_t', profileId: 'prof_2', displayName: 'Player 2', inGameId: 'ID2', platform: 'Android' as const, seed: 2, status: 'ACTIVE' as const },
    { id: 'p3', tournamentId: 'group_t', profileId: 'prof_3', displayName: 'Player 3', inGameId: 'ID3', platform: 'iOS' as const, seed: 3, status: 'ACTIVE' as const },
    { id: 'p4', tournamentId: 'group_t', profileId: 'prof_4', displayName: 'Player 4', inGameId: 'ID4', platform: 'iOS' as const, seed: 4, status: 'ACTIVE' as const },
  ];

  const { groups, matches } = generateGroupStageAndMatches('group_t', participants, new Date().toISOString(), 4);
  assert.strictEqual(groups.length, 1, '4 players should produce 1 group');
  assert.strictEqual(groups[0].standings.length, 4, 'Group should have 4 players in standings');
  // In a 4-player round robin: 4 * 3 / 2 = 6 fixtures
  assert.strictEqual(matches.length, 6, '4 players in round-robin should have 6 matches');

  // Simulate a match result
  const match1 = matches[0];
  match1.status = 'COMPLETED';
  match1.participant1Score = 2;
  match1.participant2Score = 0;

  // Recalculate standings
  const updatedStandings = recalculateGroupStandings(groups[0], matches);
  const p1Standing = updatedStandings.find(s => s.participantId === match1.participant1Id);
  const p2Standing = updatedStandings.find(s => s.participantId === match1.participant2Id);

  assert.strictEqual(p1Standing?.points, 3, 'Winner should receive 3 points');
  assert.strictEqual(p1Standing?.won, 1);
  assert.strictEqual(p1Standing?.goalDifference, 2);
  assert.strictEqual(p2Standing?.points, 0, 'Loser should have 0 points');
  assert.strictEqual(p2Standing?.goalDifference, -2);
});

// 11. Feature 5: User Authentication & RBAC
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken, hasRequiredRole } from '../src/lib/auth';
import { getUserByEmail, createUser } from '../src/lib/db';

test('Feature 5: User Authentication & RBAC Session Validation', () => {
  const { salt, hash } = hashPassword('GhanaPro2026!');
  assert.strictEqual(verifyPassword('GhanaPro2026!', salt, hash), true, 'Valid password must verify');
  assert.strictEqual(verifyPassword('WrongPass', salt, hash), false, 'Wrong password must be rejected');

  const testUser = {
    id: 'user_test_runner',
    email: 'testrunner@zuas.gh',
    username: 'testrunner',
    displayName: 'Test Runner',
    role: 'REFEREE' as const,
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };

  const session = createSessionToken(testUser);
  assert.ok(session.token.includes('.'), 'Session token must be HMAC-signed');
  
  const verified = verifySessionToken(session.token);
  assert.ok(verified, 'Session token must verify successfully');
  assert.strictEqual(verified?.userId, testUser.id);
  assert.strictEqual(verified?.role, 'REFEREE');

  // RBAC checks
  assert.strictEqual(hasRequiredRole('ADMIN', ['REFEREE']), true, 'Admin always has access');
  assert.strictEqual(hasRequiredRole('REFEREE', ['REFEREE']), true, 'Referee has referee access');
  assert.strictEqual(hasRequiredRole('PLAYER', ['REFEREE', 'ADMIN']), false, 'Player denied from referee/admin endpoints');
});

// 12. Feature 6: Paystack & Mobile Money Gateway
import { generatePaymentReference, initializePayment, verifyPayment } from '../src/lib/payments';
import { createPayment, getPaymentByReference, updatePaymentStatus } from '../src/lib/db';

test('Feature 6: Ghana Mobile Money & Paystack Payment Engine', async () => {
  const ref = generatePaymentReference();
  assert.ok(ref.startsWith('ZUAS-'), 'Reference should have ZUAS prefix');

  const payment = createPayment({
    reference: ref,
    tournamentId: 'tourn_ghana_season_1',
    amountGhc: 50,
    currency: 'GHS',
    provider: 'MTN_MOMO',
    customerEmail: 'player@zuas.gh',
    customerPhone: '0241234567',
    status: 'PENDING',
  });

  assert.strictEqual(payment.status, 'PENDING');
  const fetched = getPaymentByReference(ref);
  assert.strictEqual(fetched?.amountGhc, 50);

  const updated = updatePaymentStatus(ref, 'SUCCESS');
  assert.strictEqual(updated.status, 'SUCCESS', 'Payment status must be marked SUCCESS upon settlement');
});

// 13. Feature 7: Notifications & WhatsApp Alert Dispatcher
import { formatGhanaPhone, createMatchCallWhatsAppMessage, getWhatsAppDirectUrl } from '../src/lib/notifications';
import { createNotification, getNotifications, markNotificationAsRead } from '../src/lib/db';

test('Feature 7: Automated Notifications & WhatsApp Match Dispatcher', () => {
  const phone = formatGhanaPhone('0241234567');
  assert.strictEqual(phone, '233241234567', 'Ghana phone must be formatted to E.164');

  const message = createMatchCallWhatsAppMessage('KingPro GH', 'Quarter-Finals', '16:00 GMT', 'https://zuas.gh/matches/m_1');
  assert.ok(message.includes('MATCH CALL'), 'Message must contain MATCH CALL');
  assert.ok(message.includes('Quarter-Finals'));

  const url = getWhatsAppDirectUrl('0241234567', message);
  assert.ok(url.startsWith('https://wa.me/233241234567?text='), 'Must produce valid wa.me URL');

  // In-app notifications
  const notif = createNotification({
    userId: 'user_player',
    title: 'Match Scheduled',
    message: 'Your QF fixture is scheduled.',
    type: 'MATCH_ALERT',
    read: false,
  });

  assert.strictEqual(notif.read, false);
  const markRes = markNotificationAsRead(notif.id, 'user_player');
  assert.strictEqual(markRes, true);
});

// 14. Feature 8: National Elo Rating Engine
import { computeMatchElo, getRankTier, BASE_ELO } from '../src/lib/elo';
import { getRankings, updatePlayerEloRatings } from '../src/lib/db';

test('Feature 8: National Elo Rating Engine & Dynamic Ladder', () => {
  assert.strictEqual(getRankTier(1850), 'GRANDMASTER');
  assert.strictEqual(getRankTier(1620), 'MASTER');
  assert.strictEqual(getRankTier(1480), 'DIAMOND');
  assert.strictEqual(getRankTier(1350), 'GOLD');
  assert.strictEqual(getRankTier(1200), 'SILVER');
  assert.strictEqual(getRankTier(1000), 'BRONZE');

  // Compute head to head outcome
  const { newRatingA, newRatingB, deltaA, deltaB } = computeMatchElo(1400, 1400, 1);
  assert.strictEqual(deltaA > 0, true, 'Winner must gain Elo');
  assert.strictEqual(deltaB < 0, true, 'Loser must lose Elo');
  assert.strictEqual(newRatingA, 1416, 'At equal rating, K=32 win yields +16');
  assert.strictEqual(newRatingB, 1384, 'At equal rating, K=32 loss yields -16');

  const rankings = getRankings();
  assert.ok(rankings.length > 0, 'Rankings ladder must have ranked players');
  assert.strictEqual(rankings[0].nationalRank, 1, 'Top player must have rank #1');
  assert.ok(rankings[0].elo >= rankings[1].elo, 'Ladder must be sorted descending by Elo');
});

console.log(`\n================================`);
console.log(`Test Results: ${testsPassed} Passed, ${testsFailed} Failed`);
console.log(`================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
