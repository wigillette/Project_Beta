export const CAP_FORMULA = (level: number) => {
	return (level * 3 - 2) * 75;
};

export const INITIAL_STATS = {
	Level: 1,
	Experience: 0,
	ExpCap: CAP_FORMULA(1),
};

export interface PROFILE_FORMAT {
	Level: number;
	Experience: number;
	ExpCap: number;
}
