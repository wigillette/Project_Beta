import Rodux from "@rbxts/rodux";
import { PROFILE_FORMAT, INITIAL_STATS } from "shared/LevelInfo";

interface Action {
	type: string;
	payload?: PROFILE_FORMAT;
}

export interface profileState {
	Level: number;
	Experience: number;
	ExpCap: number;
	Visible: boolean;
}

export const profileReducer = Rodux.createReducer(
	{ ...INITIAL_STATS, Visible: true },
	{
		fetchExp: (state: profileState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.Experience = action.payload.Experience;
				newState.ExpCap = action.payload.ExpCap;
				newState.Level = action.payload.Level;
			}
			return newState;
		},
		toggleMenu: (state: profileState) => {
			const newState = { ...state };
			newState.Visible = !newState.Visible;

			return newState;
		},
	},
);
