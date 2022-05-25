import Rodux from "@rbxts/rodux";

export interface ODSState {
	globalDonationsData: (string | number)[][];
	globalKillData: (string | number)[][];
	globalWinsData: (string | number)[][];
	monthlyDonationsData: (string | number)[][];
	monthlyKillData: (string | number)[][];
	monthlyWinsData: (string | number)[][];
}

interface Action {
	type: string;
	payload?: {
		globalDonationsData: (string | number)[][];
		globalKillData: (string | number)[][];
		globalWinsData: (string | number)[][];
		monthlyDonationsData: (string | number)[][];
		monthlyKillData: (string | number)[][];
		monthlyWinsData: (string | number)[][];
	};
}

export const ODSReducer = Rodux.createReducer(
	{
		globalDonationsData: [] as (string | number)[][],
		globalKillData: [] as (string | number)[][],
		globalWinsData: [] as (string | number)[][],
		monthlyDonationsData: [] as (string | number)[][],
		monthlyKillData: [] as (string | number)[][],
		monthlyWinsData: [] as (string | number)[][],
	},
	{
		fetchODSData: (state: ODSState, action: Action) => {
			const newState = state;
			if (action.payload) {
				newState.globalDonationsData = action.payload.globalDonationsData;
				newState.globalKillData = action.payload.globalKillData;
				newState.globalWinsData = action.payload.globalWinsData;
				newState.monthlyDonationsData = action.payload.monthlyDonationsData;
				newState.monthlyKillData = action.payload.monthlyKillData;
				newState.monthlyWinsData = action.payload.monthlyWinsData;
			}
			return newState;
		},
	},
);
