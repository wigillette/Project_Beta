import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import Object from "@rbxts/object-utils";
import { Players, TweenService, Workspace } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import SnackbarService from "./SnackbarService";

declare global {
	interface KnitServices {
		ObbyChestService: typeof ObbyChestService;
	}
}

export interface chestInfo {
	Halfway: boolean;
	Full: boolean;
}

export const INITIAL_CHEST = {
	Halfway: false,
	Full: false,
};

const CHEST_VALUES = {
	Halfway: 300,
	Full: 300,
};

const ObbyChestService = Knit.CreateService({
	Name: "ObbyChestService",

	ChestData: new Map<Player, chestInfo>(),

	Client: {
		HideChest: new RemoteSignal<(chestType: string) => void>(),
		ClaimChest(client: Player, chestType: string) {
			this.Server.ClaimChest(client, chestType);
		},
	},

	ClaimChest(client: Player, chestType: string) {
		const playerChestInfo = this.ChestData.get(client);
		const goldService = Knit.GetService("GoldService");

		if (playerChestInfo && chestType in playerChestInfo && chestType in CHEST_VALUES) {
			const alreadyClaimed = playerChestInfo[chestType as keyof typeof playerChestInfo];
			if (!alreadyClaimed) {
				const goldValue = CHEST_VALUES[chestType as keyof typeof CHEST_VALUES];

				this.Client.HideChest.Fire(client, chestType);

				const newInfo = { ...playerChestInfo };
				newInfo[chestType as keyof typeof newInfo] = true;
				this.ChestData.set(client, newInfo);

				const chestStore = Database("ObbyChest", client);
				chestStore.Set(newInfo);

				goldService.AddGold(client, goldValue);
				SnackbarService.PushPlayer(
					client,
					`You have earned ${goldValue} gold for reaching the ${chestType} chest!`,
				);
			}
		}
	},

	SetChest(client: Player, chestData: chestInfo) {
		if (!this.ChestData.has(client)) {
			this.ChestData.set(client, chestData);
			Object.entries(chestData).forEach((chestInfo) => {
				if (chestInfo[1]) {
					this.Client.HideChest.Fire(client, chestInfo[0]);
				}
			});
		}
	},

	KnitInit() {
		Players.PlayerRemoving.Connect((player) => {
			this.ChestData.delete(player);
		});
		print("Obby Chest Service Initialized | Server");
	},
});

export default ObbyChestService;
