import { TournamentParticipant, TournamentMatch, TournamentGroup, GroupStanding } from './types';

/**
 * Generate Groups and Round-Robin fixtures for Group Stage + Knockout format
 */
export function generateGroupStageAndMatches(
  tournamentId: string,
  participants: TournamentParticipant[],
  startDate: string
): { groups: TournamentGroup[]; matches: TournamentMatch[] } {
  const count = participants.length;
  if (count < 4) {
    throw new Error('At least 4 participants required for Group Stage.');
  }

  // 16+ participants -> 4 groups, 8-15 -> 2 groups, 4-7 -> 1 group
  const numGroups = count >= 16 ? 4 : count >= 8 ? 2 : 1;
  const groupNames = ['Group A', 'Group B', 'Group C', 'Group D'].slice(0, numGroups);
  const groups: TournamentGroup[] = [];

  // Seed / distribute participants across groups
  const sorted = [...participants].sort((a, b) => a.seed - b.seed);
  const participantsByGroup: Record<number, TournamentParticipant[]> = {};

  for (let g = 0; g < numGroups; g++) {
    participantsByGroup[g] = [];
  }

  // Snake or round-robin pot distribution
  sorted.forEach((p, index) => {
    const groupIdx = index % numGroups;
    participantsByGroup[groupIdx].push(p);
  });

  const matches: TournamentMatch[] = [];
  let matchNumber = 1;

  for (let g = 0; g < numGroups; g++) {
    const groupParticipants = participantsByGroup[g];
    const groupName = groupNames[g];
    const groupId = `group_${tournamentId}_${g + 1}`;

    const standings: GroupStanding[] = groupParticipants.map(p => ({
      participantId: p.id,
      displayName: p.displayName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    }));

    groups.push({
      id: groupId,
      tournamentId,
      name: groupName,
      standings,
    });

    // Generate round-robin match fixtures within group
    for (let i = 0; i < groupParticipants.length; i++) {
      for (let j = i + 1; j < groupParticipants.length; j++) {
        const p1 = groupParticipants[i];
        const p2 = groupParticipants[j];

        const matchDate = new Date(startDate || Date.now());
        matchDate.setHours(matchDate.getHours() + (matchNumber - 1) * 0.5);

        matches.push({
          id: `match_grp_${tournamentId}_${groupId}_m${matchNumber}`,
          tournamentId,
          round: 1,
          roundName: `${groupName} · Matchday`,
          matchNumber: matchNumber++,
          participant1Id: p1.id,
          participant2Id: p2.id,
          participant1Name: p1.displayName,
          participant2Name: p2.displayName,
          participant1Score: 0,
          participant2Score: 0,
          status: 'SCHEDULED',
          scheduledTime: matchDate.toISOString(),
          streamStatus: 'NONE',
          stageType: 'GROUP',
          groupId,
        });
      }
    }
  }

  return { groups, matches };
}

/**
 * Re-computes group standings from completed matches
 */
export function recalculateGroupStandings(
  group: TournamentGroup,
  matches: TournamentMatch[]
): GroupStanding[] {
  const standingsMap: Record<string, GroupStanding> = {};

  group.standings.forEach(s => {
    standingsMap[s.participantId] = {
      participantId: s.participantId,
      displayName: s.displayName,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
    };
  });

  const groupMatches = matches.filter(m => m.groupId === group.id && m.status === 'COMPLETED');

  for (const match of groupMatches) {
    if (!match.participant1Id || !match.participant2Id) continue;
    const s1 = standingsMap[match.participant1Id];
    const s2 = standingsMap[match.participant2Id];
    if (!s1 || !s2) continue;

    s1.played += 1;
    s2.played += 1;
    s1.goalsFor += match.participant1Score;
    s1.goalsAgainst += match.participant2Score;
    s2.goalsFor += match.participant2Score;
    s2.goalsAgainst += match.participant1Score;

    if (match.participant1Score > match.participant2Score) {
      s1.won += 1;
      s1.points += 3;
      s2.lost += 1;
    } else if (match.participant1Score < match.participant2Score) {
      s2.won += 1;
      s2.points += 3;
      s1.lost += 1;
    } else {
      s1.drawn += 1;
      s2.drawn += 1;
      s1.points += 1;
      s2.points += 1;
    }

    s1.goalDifference = s1.goalsFor - s1.goalsAgainst;
    s2.goalDifference = s2.goalsFor - s2.goalsAgainst;
  }

  // Sort by Points DESC, Goal Difference DESC, Goals For DESC
  return Object.values(standingsMap).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}
