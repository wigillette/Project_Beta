import Rodux from "@rbxts/rodux";

export interface ODSState {
	globalDonationsData: (string | number)[][];
	globalKillData: (string | number)[][];
	globalWinsData: (string | number)[][];
	monthlyDonationsData: (string | number)[][];
	monthlyKillData: (string | number)[][];
	monthlyWinsData: (string | number)[][];
	donationsPageNumber: number;
	winsPageNumber: number;
	killsPageNumber: number;
	donationsCategory: string;
	winsCategory: string;
	killsCategory: string;
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
		donationsPageNumber: number;
		winsPageNumber: number;
		killsPageNumber: number;
		donationsCategory: string;
		winsCategory: string;
		killsCategory: string;
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
		donationsPageNumber: 0,
		winsPageNumber: 0,
		killsPageNumber: 0,
		donationsCategory: "Global",
		killsCategory: "Global",
		winsCategory: "Global",
	},
	{
		fetchODSData: (state: ODSState, action: Action) => {
			const newState = { ...state };
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
		switchODSCategory: (state: ODSState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.donationsCategory = action.payload.donationsCategory || state.donationsCategory;
				newState.killsCategory = action.payload.killsCategory || state.killsCategory;
				newState.winsCategory = action.payload.winsCategory || state.winsCategory;
			}

			return newState;
		},
		switchODSPage: (state: ODSState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				if (action.payload.donationsPageNumber !== undefined) {
					newState.donationsPageNumber = action.payload.donationsPageNumber;
				}
				if (action.payload.killsPageNumber !== undefined) {
					newState.killsPageNumber = action.payload.killsPageNumber;
				}
				if (action.payload.winsPageNumber !== undefined) {
					newState.winsPageNumber = action.payload.winsPageNumber;
				}
			}

			return newState;
		},
	},
);
