import { RankTier, PlayerRanking, TournamentMatch } from './types';

/**
 * Competitive Elo rating calculation for eFootball Mobile Ghana Circuit
 */

export const BASE_ELO = 1200;
export const DEFAULT_K_FACTOR = 32;

/**
 * Maps Elo numerical rating to National Rank Tier
 */
export function getRankTier(elo: number): RankTier {
  if (elo >= 1800) return 'GRANDMASTER';
  if (elo >= 1600) return 'MASTER';
  if (elo >= 1450) return 'DIAMOND';
  if (elo >= 1300) return 'GOLD';
  if (elo >= 1150) return 'SILVER';
  return 'BRONZE';
}

/**
 * Get visual badge colors and styling for Rank Tier
 */
export function getTierBadgeStyle(tier: RankTier): { label: string; bg: string; text: string; border: string; icon: string } {
  switch (tier) {
    case 'GRANDMASTER':
      return { label: 'Grandmaster', bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/30', icon: '👑' };
    case 'MASTER':
      return { label: 'Master', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', icon: '💎' };
    case 'DIAMOND':
      return { label: 'Diamond', bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30', icon: '🥇' };
    case 'GOLD':
      return { label: 'Gold', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🥈' };
    case 'SILVER':
      return { label: 'Silver', bg: 'bg-zinc-400/10', text: 'text-zinc-300', border: 'border-zinc-400/30', icon: '🥉' };
    case 'BRONZE':
    default:
      return { label: 'Bronze', bg: 'bg-orange-900/10', text: 'text-orange-400', border: 'border-orange-900/30', icon: '🛡️' };
  }
}

/**
 * Calculate expected score using the standard logistic curve:
 * E_a = 1 / (1 + 10^((R_b - R_a) / 400))
 */
export function calculateExpectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Computes new ratings for Player A and Player B after a match outcome.
 * actualScoreA: 1 for Win, 0.5 for Draw, 0 for Loss.
 */
export function computeMatchElo(
  ratingA: number,
  ratingB: number,
  actualScoreA: 1 | 0.5 | 0,
  kFactor: number = DEFAULT_K_FACTOR
): { newRatingA: number; newRatingB: number; deltaA: number; deltaB: number } {
  const expectedA = calculateExpectedScore(ratingA, ratingB);
  const expectedB = 1 - expectedA;

  const actualScoreB = (1 - actualScoreA) as 1 | 0.5 | 0;

  const deltaA = Math.round(kFactor * (actualScoreA - expectedA));
  const deltaB = Math.round(kFactor * (actualScoreB - expectedB));

  return {
    newRatingA: Math.max(800, ratingA + deltaA),
    newRatingB: Math.max(800, ratingB + deltaB),
    deltaA,
    deltaB,
  };
}
