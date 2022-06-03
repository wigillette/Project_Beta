import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { DataStoreService, Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { InventoryService } from "./InventoryService";
import { gamepassesAwarded, GoldService } from "./GoldService";
import { InventoryFormat, INITIAL_INVENTORY, INITIAL_EQUIPPED, EquippedFormat } from "../../shared/InventoryInfo";
import { INITIAL_STATS, PROFILE_FORMAT } from "../../shared/LevelInfo";
import { INITIAL_SETTINGS, SETTINGS_FORMAT } from "../../shared/SettingsInfo";
import { ProfileService } from "./ProfileService";
import { TwitterService } from "./TwitterService";
import { SettingsService } from "./SettingsService";
import { DailyRewardService } from "./DailyRewardService";
import SessionService from "./SessionService";
import { INITIAL_DR, DR_FORMAT } from "../../shared/DailyRewardInfo";
import ObbyChestService, { chestInfo, INITIAL_CHEST } from "./ObbyChestService";
import ArenaTicketService from "./ArenaTicketService";

declare global {
	interface KnitServices {
		DatabaseService: typeof DatabaseService;
	}
}

interface ODSEntryFormat {
	UserId: number;
	Stat: string;
	Amount: number;
	Overwrite: boolean;
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
		UpdateSortingData: new RemoteSignal<(sortingTables: SortingFormat) => void>(),
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
	GlobalDeaths: DataStoreService.GetOrderedDataStore("GlobalDeaths"),
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

	ResetStats(player: Player) {
		print(`Resetting ${player.Name}'s stats!`);
		this.AppendPendingEntry(player.UserId, "Kills", 0, true);
		this.AppendPendingEntry(player.UserId, "Deaths", 0, true);
		SessionService.ResetStats(player);
	},

	SaveODSStat(userId: number, stat: string, amt: number, overwrite: boolean) {
		print(`Attempting to push pending entry | ${userId} | ${stat} | ${amt}`);
		if (`Global${stat}` in this) {
			const globalItem = this[`Global${stat}` as keyof typeof this] as OrderedDataStore;
			const response = pcall(() => {
				if (!overwrite) {
					globalItem.IncrementAsync(tostring(userId), amt);
				} else {
					globalItem.SetAsync(tostring(userId), amt);
				}
			});
			if (response[0]) {
				print(
					`Successfully added ${amt} ${stat} to ${Players.GetNameFromUserIdAsync(
						userId,
					)}'s global data entry!`,
				);
			} else {
				print(`Error adding ${amt} ${stat} to ${Players.GetNameFromUserIdAsync(userId)}'s global data entry!`);
			}
		}
		if (`Monthly${stat}` in this) {
			const monthlyItem = this[`Monthly${stat}` as keyof typeof this] as OrderedDataStore;
			const response = pcall(() => {
				if (!overwrite) {
					monthlyItem.IncrementAsync(tostring(userId), amt);
				} else {
					monthlyItem.SetAsync(tostring(userId), amt);
				}
			});
			if (response[0]) {
				print(
					`Successfully added ${amt} ${stat} to ${Players.GetNameFromUserIdAsync(
						userId,
					)}'s monthly data entry!`,
				);
			} else {
				print(`Error adding ${amt} ${stat} to ${Players.GetNameFromUserIdAsync(userId)}'s monthly data entry!`);
			}
		}
	},

	AppendPendingEntry(userId: number, stat: string, amount: number, overwrite: boolean) {
		if (this.FindExistingEntry(userId, stat) === undefined) {
			print(`Pending Entry | ${userId} | ${stat} | ${amount}`);
			this.PendingEntries.push({ UserId: userId, Stat: stat, Amount: amount, Overwrite: overwrite });
		} else if (!overwrite) {
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
		while (Players.GetPlayers().size() <= 0) {
			wait(0.05);
		}
		let listeningIterations = 0;
		while (Players.GetPlayers().size() > 0) {
			if (this.PendingEntries.size() > 0) {
				this.PendingEntries.forEach((entry, index) => {
					if (entry.UserId !== undefined && entry.Stat !== undefined && entry.Amount !== undefined) {
						this.SaveODSStat(entry.UserId, entry.Stat, entry.Amount, entry.Overwrite);
						this.PendingEntries.remove(index);
						wait(6);
					}
				});
			}

			wait(20);
			listeningIterations += 1;
			if (listeningIterations % 6 === 0) {
				spawn(() => {
					this.InitSortingTables();
					this.Client.UpdateSortingData.FireAll(this.GetAllSortingData());
				});
			}
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
		const Gold = GoldStore.GetAsync(0)
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

		const OCStore = Database("ObbyChest", Player);
		const OC = OCStore.GetAsync(INITIAL_CHEST)
			.then((ocInfo) => {
				ObbyChestService.SetChest(Player, ocInfo as chestInfo);
			})
			.catch((err) => {
				print(err);
				print(`Failed to load ${Player.Name}'s Obby Chest Info`);
			});

		const GAStore = Database("GamepassesAwarded", Player);
		const GA = GAStore.GetAsync({ StarterUp: false })
			.then((gaInfo) => {
				GoldService.UpdateGamepassesAwarded(Player, gaInfo as gamepassesAwarded);
			})
			.catch((err) => {
				print(err);
				print(`Failed to load ${Player.Name}'s Gamepasses Awarded Info`);
			});

		const ATStore = Database("ArenaTickets", Player);
		const AT = ATStore.GetAsync(0)
			.then((atInfo) => {
				ArenaTicketService.InitData(Player, atInfo as number);
			})
			.catch((err) => {
				print(err);
				print(`Failed to load ${Player.Name}'s Arena Tickets Info`);
			});

		let globalKills = this.GlobalKills.GetAsync(tostring(Player.UserId));
		if (globalKills === undefined) {
			globalKills = 0;
		}
		let globalDeaths = this.GlobalDeaths.GetAsync(tostring(Player.UserId));
		if (globalDeaths === undefined) {
			globalDeaths = 0;
		}
		let globalWins = this.GlobalWins.GetAsync(tostring(Player.UserId));
		if (globalWins === undefined) {
			globalWins = 0;
		}
		SessionService.InitData(Player, globalKills, globalDeaths, globalWins);
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
			"ObbyChest",
			"ArenaTickets",
			"Guild",
			"GamepassesAwarded",
		);
		Players.PlayerAdded.Connect((player) => {
			this.LoadData(player);
		});

		Players.PlayerRemoving.Connect((player) => {
			this.SaveData(player);
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
