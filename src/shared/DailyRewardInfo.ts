export const INITIAL_DR = {
	Streak: 0,
	PreviouslyClaimed: os.time() - 168000,
	TimeRemaining: 0,
};

export interface DR_FORMAT {
	Streak: number;
	PreviouslyClaimed: number;
	TimeRemaining: number;
}

export const REWARD_VALUES = {
	1: 50,
	2: 100,
	3: 150,
	4: 200,
};
