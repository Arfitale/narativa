export interface Badge {
	id: string;
	title: string;
	description: string;
	category: 'writing' | 'reading' | 'community' | 'streak';
	points: number;
	unlocked: boolean;
	unlockedAt?: string;
	progress?: {
		current: number;
		max: number;
	};
	icon: string; // Icon identifier or name
}

export interface UserAchievementSummary {
	totalPoints: number;
	currentTier: string;
	nextTier: string;
	pointsToNextTier: number;
	tierProgressPercent: number;
	unlockedCount: number;
	totalBadgesCount: number;
}
