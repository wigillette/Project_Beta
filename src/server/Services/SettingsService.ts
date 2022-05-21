import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { TwitterCodes } from "../Utils/TwitterCodes";
import SnackbarService from "./SnackbarService";
import { INITIAL_SETTINGS, SETTINGS_FORMAT } from "shared/SettingsInfo";
import MatchService from "./MatchService";

declare global {
	interface KnitServices {
		SettingsService: typeof SettingsService;
	}
}

export const SettingsService = Knit.CreateService({
	Name: "SettingsService",

	// Server-exposed Signals/Fields
	PlayerSettings: new Map<Player, SETTINGS_FORMAT>(),

	Client: {
		SettingsChanged: new RemoteSignal<(Settings: SETTINGS_FORMAT) => void>(),
		ChangeSetting(Player: Player, setting: string, value: boolean) {
			this.Server.ChangeSetting(Player, setting, value);
		},
		GetSettings(Player: Player) {
			return this.Server.GetSettings(Player);
		},
	},

	ChangeSetting(Player: Player, Setting: string, Value: boolean) {
		const userSettings = this.GetSettings(Player);
		if (Setting in userSettings) {
			userSettings[Setting as keyof typeof userSettings] = Value;
			if (Setting === "Playing") {
				MatchService.SetPlaying(Player, Value);
			}

			// Update the UI and change the map, update database
			this.PlayerSettings.set(Player, userSettings);
			this.Client.SettingsChanged.Fire(Player, userSettings);
			this.UpdateSettings(Player, userSettings);

			// Push a notification
			SnackbarService.PushPlayer(Player, `${Value ? "Enabled" : "Disabled"} ${Setting}`);
		}
	},

	UpdateSettings(Player: Player, Settings: SETTINGS_FORMAT) {
		const SettingsStore = Database("Settings", Player);
		SettingsStore.Set(Settings);
	},

	GetSettings(Player: Player) {
		const settings = this.PlayerSettings.get(Player);
		return settings ?? INITIAL_SETTINGS;
	},

	InitData(Player: Player, Settings: SETTINGS_FORMAT) {
		this.PlayerSettings.set(Player, Settings);
	},

	KnitInit() {
		print("Twitter Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerSettings.delete(player));
	},
});
