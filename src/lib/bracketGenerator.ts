import { TournamentMatch, TournamentParticipant } from './types';

export function getRoundName(roundNumber: number, totalRounds: number): string {
  const roundFromEnd = totalRounds - roundNumber;
  switch (roundFromEnd) {
    case 0:
      return 'Grand Final';
    case 1:
      return 'Semi Finals';
    case 2:
      return 'Quarter Finals';
    case 3:
      return 'Round of 16';
    case 4:
      return 'Round of 32';
    default:
      return `Round ${roundNumber}`;
  }
}

/**
 * Generate a single elimination bracket from confirmed tournament participants.
 */
export function generateSingleEliminationBracket(
  tournamentId: string,
  participants: TournamentParticipant[],
  startDate: string
): TournamentMatch[] {
  const count = participants.length;
  if (count < 2) {
    throw new Error('At least 2 participants required to generate a tournament bracket.');
  }

  // Calculate bracket size as next power of 2 (e.g., 4, 8, 16, 32)
  let bracketSize = 2;
  while (bracketSize < count) {
    bracketSize *= 2;
  }

  const totalRounds = Math.log2(bracketSize);
  const matches: TournamentMatch[] = [];

  // Sort participants by seed
  const sorted = [...participants].sort((a, b) => a.seed - b.seed);

  // Generate match IDs in advance so we can link rounds
  let matchCounter = 1;
  const matchesByRound: Record<number, TournamentMatch[]> = {};

  for (let r = 1; r <= totalRounds; r++) {
    const roundMatchesCount = bracketSize / Math.pow(2, r);
    matchesByRound[r] = [];

    for (let m = 0; m < roundMatchesCount; m++) {
      const matchId = `match_${tournamentId}_r${r}_m${m + 1}`;
      const isFinal = r === totalRounds;

      // Base scheduled time with offsets
      const matchDate = new Date(startDate || Date.now());
      matchDate.setHours(matchDate.getHours() + (r - 1) * 2 + m * 0.5);

      const match: TournamentMatch = {
        id: matchId,
        tournamentId,
        round: r,
        roundName: getRoundName(r, totalRounds),
        matchNumber: matchCounter++,
        participant1Id: null,
        participant2Id: null,
        participant1Name: undefined,
        participant2Name: undefined,
        participant1Score: 0,
        participant2Score: 0,
        status: 'SCHEDULED',
        scheduledTime: matchDate.toISOString(),
        streamStatus: 'NONE',
        winnerId: null,
        nextMatchId: null,
        isFinal,
      };

      matchesByRound[r].push(match);
    }
  }

  // Link matches to next rounds
  for (let r = 1; r < totalRounds; r++) {
    const currentRoundMatches = matchesByRound[r];
    const nextRoundMatches = matchesByRound[r + 1];

    for (let m = 0; m < currentRoundMatches.length; m++) {
      const nextMatchIndex = Math.floor(m / 2);
      if (nextRoundMatches[nextMatchIndex]) {
        currentRoundMatches[m].nextMatchId = nextRoundMatches[nextMatchIndex].id;
      }
    }
  }

  // Assign Round 1 participants based on standard esports tournament seeding
  const round1Matches = matchesByRound[1];
  for (let i = 0; i < round1Matches.length; i++) {
    // In bracketSize seed pairing: match i pairs seed (i + 1) with seed (bracketSize - i)
    const p1Index = i;
    const p2Index = bracketSize - 1 - i;

    const p1 = sorted[p1Index] || null;
    const p2 = sorted[p2Index] || null;

    if (p1) {
      round1Matches[i].participant1Id = p1.id;
      round1Matches[i].participant1Name = p1.displayName;
    }

    if (p2) {
      round1Matches[i].participant2Id = p2.id;
      round1Matches[i].participant2Name = p2.displayName;
    } else if (p1 && !p2) {
      // Automatic Bye: If no opponent, p1 automatically wins Round 1
      round1Matches[i].winnerId = p1.id;
      round1Matches[i].status = 'COMPLETED';
      round1Matches[i].participant1Score = 1;
      round1Matches[i].participant2Score = 0;

      // Populate into next round
      const nextMatch = matchesByRound[2]?.find(m => m.id === round1Matches[i].nextMatchId);
      if (nextMatch) {
        if (i % 2 === 0) {
          nextMatch.participant1Id = p1.id;
          nextMatch.participant1Name = p1.displayName;
        } else {
          nextMatch.participant2Id = p1.id;
          nextMatch.participant2Name = p1.displayName;
        }
      }
    }
  }

  // Flatten all matches
  for (let r = 1; r <= totalRounds; r++) {
    matches.push(...matchesByRound[r]);
  }

  return matches;
}

/**
 * Advances a winner in single elimination bracket
 */
export function advanceBracketWinner(
  matches: TournamentMatch[],
  matchId: string,
  winnerId: string,
  score1: number,
  score2: number
): TournamentMatch[] {
  const updatedMatches = matches.map(m => ({ ...m }));
  const targetMatch = updatedMatches.find(m => m.id === matchId);
  if (!targetMatch) {
    throw new Error(`Match ${matchId} not found.`);
  }

  if (targetMatch.participant1Id !== winnerId && targetMatch.participant2Id !== winnerId) {
    throw new Error('Winner must be one of the match participants.');
  }

  targetMatch.participant1Score = score1;
  targetMatch.participant2Score = score2;
  targetMatch.winnerId = winnerId;
  targetMatch.status = 'COMPLETED';

  // If there is a next match, advance winner
  if (targetMatch.nextMatchId) {
    const nextMatch = updatedMatches.find(m => m.id === targetMatch.nextMatchId);
    if (nextMatch) {
      const winnerName =
        winnerId === targetMatch.participant1Id
          ? targetMatch.participant1Name
          : targetMatch.participant2Name;

      // Determine slot based on current match index
      const roundMatches = updatedMatches.filter(m => m.round === targetMatch.round);
      const matchIndex = roundMatches.findIndex(m => m.id === targetMatch.id);

      if (matchIndex % 2 === 0) {
        nextMatch.participant1Id = winnerId;
        nextMatch.participant1Name = winnerName;
      } else {
        nextMatch.participant2Id = winnerId;
        nextMatch.participant2Name = winnerName;
      }
    }
  }

  return updatedMatches;
}
