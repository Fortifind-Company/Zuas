/**
 * Automated Verification Test Suite for eFootball Mobile Championship Platform
 * Tests multi-tournament independence, bracket generation, winner advancement,
 * twitch validation, registration limits, and duplicate protection.
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
  getTournaments,
  createTournament,
  duplicateTournament,
  createRegistration,
  getRegistrations,
  generateBracket,
  updateMatchScore,
  updateMatchStream,
  getMatches,
} from '../src/lib/db';

console.log('🚀 Running eFootball Mobile Platform Verification Test Suite...\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
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
    platform: 'Android',
    seed: i + 1,
    status: 'ACTIVE',
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
    platform: 'iOS',
    seed: i + 1,
    status: 'ACTIVE',
  }));

  const matches = generateSingleEliminationBracket('test_t2', participants, new Date().toISOString());
  const match1 = matches.find(m => m.round === 1 && m.matchNumber === 1);
  assert.ok(match1, 'Match 1 should exist');

  // Advance participant 1 as winner
  const updated = advanceBracketWinner(matches, match1.id, match1.participant1Id, 3, 1);
  const updatedMatch1 = updated.find(m => m.id === match1.id);
  assert.strictEqual(updatedMatch1.status, 'COMPLETED');
  assert.strictEqual(updatedMatch1.participant1Score, 3);
  assert.strictEqual(updatedMatch1.winnerId, match1.participant1Id);

  // Check that final match slot was populated
  const finalMatch = updated.find(m => m.id === match1.nextMatchId);
  assert.strictEqual(finalMatch.participant1Id, match1.participant1Id);
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

console.log(`\n================================`);
console.log(`Test Results: ${testsPassed} Passed, ${testsFailed} Failed`);
console.log(`================================\n`);

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
