import { KnitClient as Knit } from "@rbxts/knit";
import Store from "client/Rodux/Store";
import { SETTINGS_FORMAT, SETTINGS_FUNCTIONS } from "shared/SettingsInfo";
import ObjectUtils from "@rbxts/object-utils";
import { Players } from "@rbxts/services";

const SettingsService = Knit.GetService("SettingsService");

const SettingsClient = {
	SettingsChanged: (Settings: SETTINGS_FORMAT) => {
		Store.dispatch({
			type: "updateSettings",
			payload: Settings,
		});
		ObjectUtils.entries(Settings).forEach((setting) => {
			if (setting[1]) {
				// Activate the setting function
				SETTINGS_FUNCTIONS[setting[0] as keyof typeof SETTINGS_FUNCTIONS](Players.LocalPlayer);
			}
		});
	},
	SetToggle: (state: boolean) => {
		Store.dispatch({ type: "setSettingsToggle", payload: state });
	},
	ChangeSetting: (setting: string, state: boolean) => {
		SettingsService.ChangeSetting(setting, state);
	},
	init: () => {
		const initialSettings = SettingsService.GetSettings();
		SettingsClient.SettingsChanged(initialSettings);
		SettingsService.SettingsChanged.Connect(SettingsClient.SettingsChanged);
		print("Settings Service Initialized | Client");
	},
};

export default SettingsClient;
