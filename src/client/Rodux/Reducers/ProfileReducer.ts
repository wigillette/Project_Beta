import Rodux from "@rbxts/rodux";
import { PROFILE_FORMAT, INITIAL_STATS } from "shared/LevelInfo";

interface Action {
	type: string;
	payload?: PROFILE_FORMAT;
}

export const profileReducer = Rodux.createReducer(INITIAL_STATS, {
	fetchExp: (state: PROFILE_FORMAT, action: Action) => {
		const newState: PROFILE_FORMAT = { Experience: state.Experience, ExpCap: state.ExpCap, Level: state.Level };
		if (action.payload) {
			newState.Experience = action.payload.Experience;
			newState.ExpCap = action.payload.ExpCap;
			newState.Level = action.payload.Level;
		}
		return newState;
	},
});
