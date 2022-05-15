import Rodux from "@rbxts/rodux";
import { INITIAL_SETTINGS, SETTINGS_FORMAT } from "shared/SettingsInfo";

export interface settingsState {
	settings: SETTINGS_FORMAT;
	toggle: boolean;
}

interface Action {
	type: string;
	payload?: { settings: SETTINGS_FORMAT; toggle: boolean };
}

export const settingsReducer = Rodux.createReducer(
	{ settings: INITIAL_SETTINGS, toggle: false },
	{
		updateSettings: (state: settingsState, action: Action) => {
			const newState = state;
			if (action.payload) {
				newState.settings = action.payload.settings;
			}
			return newState;
		},

		setSettingsToggle: (state: settingsState, action: Action) => {
			const newState = state;
			if (action.payload) {
				newState.toggle = action.payload.toggle;
			}

			return newState;
		},

		toggleSettings: (state: settingsState) => {
			const newState = { toggle: !state.toggle, settings: state.settings };
			return newState;
		},
	},
);
