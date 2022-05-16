import { KnitServer as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { InventoryService } from "./InventoryService";
import { GoldService } from "./GoldService";
import { InventoryFormat, INITIAL_INVENTORY, INITIAL_EQUIPPED, EquippedFormat } from "../../shared/InventoryInfo";
import { INITIAL_STATS, PROFILE_FORMAT } from "../../shared/LevelInfo";
import { INITIAL_SETTINGS, SETTINGS_FORMAT } from "../../shared/SettingsInfo";
import { ProfileService } from "./ProfileService";
import { TwitterService } from "./TwitterService";
import { SettingsService } from "./SettingsService";
import { DailyRewardService } from "./DailyRewardService";
import { INITIAL_DR, DR_FORMAT } from "../../shared/DailyRewardInfo";

declare global {
	interface KnitServices {
		DatabaseService: typeof DatabaseService;
	}
}

const DatabaseService = Knit.CreateService({
	Name: "DatabaseService",

	LoadData(Player: Player) {
		print(`Attempting to load ${Player.Name}'s data`);
		const InventoryStore = Database("Inventory", Player);
		const Inventory = InventoryStore.GetAsync(INITIAL_INVENTORY)
			.then((inventory) => {
				const EquippedItemsStore = Database("Equipped", Player);
				const EquippedItems = EquippedItemsStore.GetAsync(INITIAL_EQUIPPED)
					.then((equippedItems) => {
						InventoryService.InitData(
							Player,
							inventory as InventoryFormat,
							equippedItems as EquippedFormat,
						);
					})
					.catch((err) => {
						print(`Failed to load ${Player.Name}'s equipped items.`);
					});
			})
			.catch((err) => {
				print(`Failed to load ${Player.Name}'s inventory.`);
			});

		const GoldStore = Database("Gold", Player);
		const Gold = GoldStore.GetAsync(500)
			.then((gold) => {
				GoldService.InitData(Player, gold as number);
				print(`Successfully loaded ${Player.Name}'s Gold`);
			})
			.catch((err) => {
				print(`Failed to load ${Player.Name}'s Gold.`);
			});

		const ProfileStore = Database("Profile", Player);
		const Profile = ProfileStore.GetAsync(INITIAL_STATS)
			.then((profile) => {
				ProfileService.InitData(Player, profile as PROFILE_FORMAT);
				print(`Successfully loaded ${Player.Name}'s Profile.`);
			})
			.catch((err) => {
				print(`Failed to load ${Player.Name}'s Profile.`);
			});

		const TwitterStore = Database("RedeemedCodes", Player);
		const Codes = ProfileStore.GetAsync([])
			.then((codes) => {
				TwitterService.InitData(Player, codes as string[]);
				print(`Successfully loaded ${Player.Name}'s Redeemed Codes.`);
			})
			.catch((err) => {
				print(`Failed to load ${Player.Name}'s Redeemed Codes.`);
			});

		const SettingsStore = Database("Settings", Player);
		const Settings = SettingsStore.GetAsync(INITIAL_SETTINGS)
			.then((savedSettings) => {
				SettingsService.InitData(Player, savedSettings as SETTINGS_FORMAT);
			})
			.catch((err) => {
				print(`Failed to load ${Player.Name}'s Settings.`);
			});

		const DRStore = Database("DailyReward", Player);
		const DR = DRStore.GetAsync(INITIAL_DR)
			.then((drInfo) => {
				DailyRewardService.InitData(Player, drInfo as DR_FORMAT);
			})
			.catch((err) => {
				print(err);
				print(`Failed to load ${Player.Name}'s Daily Reward Info.`);
			});
	},

	SaveData(Player: Player) {
		print(`Attempting to save ${Player.Name}'s data`);
		Database.SaveAllAsync(Player)
			.then(() => {
				print(`Successfully saved ${Player.Name}'s Data!`);
			})
			.catch((err) => {
				print(`Failed to save ${Player.Name}'s Data`);
				print(err);
			});
	},

	KnitInit() {
		Database.Combine(
			"UserData",
			"Inventory",
			"Equipped",
			"Gold",
			"Profile",
			"RedeemedCodes",
			"Settings",
			"DailyReward",
		);
		Players.PlayerAdded.Connect((player) => {
			this.LoadData(player);
		});
		print("Database Service Initialized | Server");
	},
});

export default DatabaseService;
