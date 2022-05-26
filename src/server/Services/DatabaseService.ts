import { KnitServer as Knit } from "@rbxts/knit";
import { DataStoreService, Players } from "@rbxts/services";
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

interface ODSEntryFormat {
	UserId: number;
	Stat: string;
	Amount: number;
}

interface SortingFormat {
	GlobalDonations: (string | number)[][];
	MonthlyDonations: (string | number)[][];
	GlobalWins: (string | number)[][];
	MonthlyWins: (string | number)[][];
	GlobalKills: (string | number)[][];
	MonthlyKills: (string | number)[][];
}

const DatabaseService = Knit.CreateService({
	Name: "DatabaseService",

	Client: {
		GetAllSortingData(Player: Player) {
			return this.Server.GetAllSortingData();
		},
	},

	GlobalWins: DataStoreService.GetOrderedDataStore("GlobalWins"),
	MonthlyWins: DataStoreService.GetOrderedDataStore(`MonthlyWins${math.floor(os.time() / 2629743) + 1}`),
	GlobalDonations: DataStoreService.GetOrderedDataStore("GlobalDonations"),
	MonthlyDonations: DataStoreService.GetOrderedDataStore(`MonthlyDonations${math.floor(os.time() / 2629743) + 1}`),
	GlobalKills: DataStoreService.GetOrderedDataStore("GlobalKills"),
	MonthlyKills: DataStoreService.GetOrderedDataStore(`MonthlyKills${math.floor(os.time() / 2629743) + 1}`),
	PendingEntries: [] as ODSEntryFormat[],
	SortingTables: {
		GlobalDonations: [],
		MonthlyDonations: [],
		GlobalWins: [],
		MonthlyWins: [],
		GlobalKills: [],
		MonthlyKills: [],
	} as SortingFormat,

	CreateSortingTable(sortedTable: DataStorePages) {
		const ds = [] as (string | number)[][];
		let currPage;
		let finished = false;
		for (let i = 0; i < 4 && !finished; i++) {
			currPage = sortedTable.GetCurrentPage();
			currPage.forEach((entry) => {
				ds.push([entry.key, entry.value as number]);
			});

			if (sortedTable.IsFinished) {
				finished = true;
			} else {
				sortedTable.AdvanceToNextPageAsync();
			}
		}

		return ds;
	},

	GetSortingData(cat: string) {
		let toReturn = undefined;
		if (cat in this.SortingTables) {
			toReturn = this.SortingTables[cat as keyof typeof this.SortingTables];
		}

		return toReturn;
	},

	GetAllSortingData() {
		return this.SortingTables;
	},

	InitSortingTables() {
		this.SortingTables.GlobalDonations = this.CreateSortingTable(this.GlobalDonations.GetSortedAsync(false, 6));
		this.SortingTables.MonthlyDonations = this.CreateSortingTable(this.MonthlyDonations.GetSortedAsync(false, 6));
		this.SortingTables.GlobalWins = this.CreateSortingTable(this.GlobalWins.GetSortedAsync(false, 6));
		this.SortingTables.MonthlyWins = this.CreateSortingTable(this.MonthlyWins.GetSortedAsync(false, 6));
		this.SortingTables.GlobalKills = this.CreateSortingTable(this.GlobalKills.GetSortedAsync(false, 6));
		this.SortingTables.MonthlyKills = this.CreateSortingTable(this.MonthlyKills.GetSortedAsync(false, 6));
	},

	SaveODSStat(userId: number, stat: string, amt: number) {
		if (`Global${stat}` in this && `Monthly${stat}` in this) {
			const globalItem = this[`Global${stat}` as keyof typeof this] as OrderedDataStore;
			const monthlyItem = this[`Monthly${stat}` as keyof typeof this] as OrderedDataStore;
			const response = pcall(() => {
				globalItem.IncrementAsync(tostring(userId), amt);
				monthlyItem.IncrementAsync(tostring(userId), amt);
			});

			if (response[0]) {
				print(`Successfully added ${amt} ${stat} to ${Players.GetNameFromUserIdAsync(userId)}'s data entry!`);
			} else {
				print(`Error adding ${amt} ${stat} to ${Players.GetNameFromUserIdAsync(userId)}'s data entry!`);
			}
		}
	},

	AppendPendingEntry(userId: number, stat: string, amount: number) {
		if (!this.FindExistingEntry(userId, stat)) {
			print(`Appending entry for ${Players.GetNameFromUserIdAsync(userId)}, ${amount} ${stat}`);
			this.PendingEntries.push({ UserId: userId, Stat: stat, Amount: amount });
		} else {
			this.IncrementEntry(userId, stat, amount);
		}
	},

	FindExistingEntry(userId: number, stat: string) {
		let foundEntry = false;
		let toReturn: ODSEntryFormat | undefined = undefined;
		this.PendingEntries.forEach((entry) => {
			if (!foundEntry && entry.UserId === userId && entry.Stat === stat) {
				toReturn = entry;
				foundEntry = true;
			}
		});

		return toReturn;
	},

	IncrementEntry(userId: number, stat: string, increment: number) {
		const existingEntry = this.FindExistingEntry(userId, stat);

		if (existingEntry !== undefined) {
			(existingEntry as ODSEntryFormat).Amount += increment;
		}
	},

	InitializePendingListener() {
		while (Players.GetPlayers().size() > 0) {
			if (this.PendingEntries.size() > 0) {
				this.PendingEntries.forEach((entry, index) => {
					if (entry.UserId !== undefined && entry.Stat !== undefined && entry.Amount) {
						this.SaveODSStat(entry.UserId, entry.Stat, entry.Amount);
						this.PendingEntries.remove(index);
						wait(6);
					}
				});
			}

			wait(30);
		}
	},

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
		coroutine.wrap(() => {
			this.InitSortingTables();
		})();
		coroutine.wrap(() => {
			this.InitializePendingListener();
		})();
		print("Database Service Initialized | Server");
	},
});

export default DatabaseService;
