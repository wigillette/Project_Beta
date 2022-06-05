import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import Object from "@rbxts/object-utils";
import { Players, ReplicatedStorage, SoundService, TweenService, Workspace } from "@rbxts/services";
import { InventoryService } from "./InventoryService";
import { ProfileService } from "./ProfileService";
import SnackbarService from "./SnackbarService";

declare global {
	interface KnitServices {
		TradingService: typeof TradingService;
	}
}

const TradingService = Knit.CreateService({
	Name: "TradingService",
	TradingConnections: [] as Player[][],
	EligiblePlayers: [] as Player[],
	ItemSelections: new Map<Player, string[]>(),

	Client: {
		SelectedChanged: new RemoteSignal<(player1Selected: string[], player2Selected: string[]) => void>(),
		TradeStarted: new RemoteSignal<(player1Inventory: string[], player2Inventory: string[]) => void>(),
		TradeEnded: new RemoteSignal<() => void>(),
		PlayersChanged: new RemoteSignal<(players: Player[]) => void>(),
		AddPlayer(client: Player) {
			this.Server.AddPlayer(client);
		},
		RemovePlayer(client: Player) {
			this.Server.RemovePlayer(client);
		},
		UpdateSelectedItems(client: Player, clientSelected: string[]) {
			this.Server.UpdateSelectedItems(client, clientSelected);
		},
		InitiateTrade(client: Player, player2: Player) {
			this.Server.InitiateTrade(client, player2);
		},
		EndTrade(client: Player) {
			this.Server.EndTrade(client);
		},
		AcceptTrade(client: Player) {
			this.Server.AcceptTrade(client);
		},
	},

	AddPlayer(client: Player) {
		if (!this.EligiblePlayers.includes(client)) {
			this.EligiblePlayers.push(client);
			this.Client.PlayersChanged.FireAll(this.EligiblePlayers);
		}
	},

	RemovePlayer(client: Player) {
		const playerIndex = this.EligiblePlayers.indexOf(client);
		if (playerIndex !== -1) {
			this.EligiblePlayers.remove(playerIndex);
			this.Client.PlayersChanged.FireAll(this.EligiblePlayers);
		}
	},

	GetPlayer2(client: Player) {
		const eligibleConnections = this.TradingConnections.filter((tradeConnection) => {
			return tradeConnection[0] === client || tradeConnection[1] === client;
		});
		const currentConnection = eligibleConnections[0];
		let toReturn = undefined;
		if (currentConnection) {
			toReturn = (currentConnection[0] === client && currentConnection[1]) || currentConnection[0];
		}
		return toReturn;
	},

	UpdateSelectedItems(client: Player, clientSelection: string[]) {
		const player2 = this.GetPlayer2(client);
		if (player2) {
			let player2Selection = this.ItemSelections.get(player2);
			if (!player2Selection) {
				this.ItemSelections.set(player2, []);
				player2Selection = [];
			}
			this.ItemSelections.set(client, clientSelection);

			this.Client.SelectedChanged.Fire(player2, clientSelection, player2Selection);
		}
	},

	InitiateTrade(player1: Player, player2: Player) {
		const entry1 = [player1, player2];
		const entry2 = [player2, player1];
		if (
			!this.TradingConnections.includes(entry1) &&
			!this.TradingConnections.includes(entry2) &&
			this.EligiblePlayers.includes(player1) &&
			this.EligiblePlayers.includes(player2)
		) {
			this.TradingConnections.push(entry1);
			const player1Inventory = InventoryService.FetchInventory(player1).Swords;
			const player2Inventory = InventoryService.FetchInventory(player2).Swords;
			if (player1) {
				this.Client.TradeStarted.Fire(player1, Object.keys(player1Inventory), Object.keys(player2Inventory));
			} else {
				this.EndTrade(player1);
			}

			if (player2) {
				this.Client.TradeStarted.Fire(player2, Object.keys(player1Inventory), Object.keys(player2Inventory));
			} else {
				this.EndTrade(player1);
			}
		}
	},

	EndTrade(player1: Player) {
		const player2 = this.GetPlayer2(player1);
		if (player2) {
			const entry1 = [player1, player2];
			const entry2 = [player2, player1];
			const connection1 = this.TradingConnections.indexOf(entry1);
			const connection2 = this.TradingConnections.indexOf(entry2);

			const selectionEntry1 = this.ItemSelections.get(player1);
			const selectionEntry2 = this.ItemSelections.get(player2);

			if (!selectionEntry1) {
				this.ItemSelections.set(player1, []);
			} else {
				selectionEntry1.clear();
			}

			if (!selectionEntry2) {
				this.ItemSelections.set(player2, []);
			} else {
				selectionEntry2.clear();
			}

			if (connection1 !== -1) {
				this.TradingConnections.remove(connection1);
			} else if (connection2 !== -1) {
				this.TradingConnections.remove(connection2);
			}
			if (player1) {
				this.Client.TradeEnded.Fire(player1);
			}
			if (player2) {
				this.Client.TradeEnded.Fire(player2);
			}
		}
	},

	AcceptTrade(client: Player) {
		const player2 = this.GetPlayer2(client);
		if (player2) {
			const player1Selection = this.ItemSelections.get(client);
			const player2Selection = this.ItemSelections.get(player2);
			if (player1Selection && player2Selection) {
				const player1Profile = ProfileService.GetProfile(client);
				const player2Profile = ProfileService.GetProfile(player2);
				if (player1Profile.Level >= 15 && player2Profile.Level >= 15) {
					const player1Inventory = InventoryService.FetchInventory(client).Swords;
					const player2Inventory = InventoryService.FetchInventory(player2).Swords;
					let player1HasItems = true;
					let player2HasItems = true;
					player1Selection.forEach((item) => {
						player1HasItems = player1HasItems && player1Inventory.has(item);
					});
					player2Selection.forEach((item) => {
						player2HasItems = player2HasItems && player2Inventory.has(item);
					});

					if (player1HasItems && player2HasItems) {
						player2Selection.forEach((item) => {
							InventoryService.AddToInventory(client, item, "Swords");
							InventoryService.RemoveFromInventory(player2, item, "Swords", false);
						});
						player1Selection.forEach((item) => {
							InventoryService.AddToInventory(player2, item, "Swords");
							InventoryService.RemoveFromInventory(client, item, "Swords", false);
						});

						InventoryService.Client.InventoryChanged.Fire(client, InventoryService.FetchInventory(client));
						InventoryService.Client.InventoryChanged.Fire(
							player2,
							InventoryService.FetchInventory(player2),
						);

						SnackbarService.PushPlayer(client, "Trade successful!");
						SnackbarService.PushPlayer(player2, "Trade successful!");
						this.EndTrade(client);
					} else {
						SnackbarService.PushPlayer(client, "One or more players do not own the selected items!");
						SnackbarService.PushPlayer(player2, "One or more players do not own the selected items!");
					}
				} else {
					SnackbarService.PushPlayer(client, "One or more players do not meet the level requirement!");
					SnackbarService.PushPlayer(player2, "One or more players do not meet the level requirement!");
				}
			}
		}
	},

	KnitInit() {
		Players.PlayerRemoving.Connect((client: Player) => {
			this.RemovePlayer(client);
			this.EndTrade(client);
		});
		print("Trading Service Initialized | Server");
	},
});

export default TradingService;
