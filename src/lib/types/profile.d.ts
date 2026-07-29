export interface UserProfile {
	name: string;
	username: string;
	joinedDate: string;
	avatarUrl?: string;
	languageFlag?: string; // Flag icon code or URL
	followingCount: number;
	followersCount: number;
	stats: {
		dayStreak: number;
		totalXp: number;
		currentLeague: string;
		top3Finishes: number;
	};
	recentAchievements: {
		id: string;
		title: string;
		progress: string; // e.g. "4/7"
		icon: string;
		unlocked: boolean;
	}[];
}
