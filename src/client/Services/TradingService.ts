import { KnitClient as Knit } from "@rbxts/knit";
import store from "client/Rodux/Store";
const TradingService = Knit.GetService("TradingService");

const TradingClient = {
	EndTrade() {
		store.dispatch({
			type: "endTrade",
		});
	},
	UpdateSelection(player1Selected: string[], player2Selected: string[]) {
		store.dispatch({
			type: "updateSelection",
			payload: { player1Selected: player1Selected, player2Selected: player2Selected },
		});
	},
	StartTrade(player1Inventory: string[], player2Inventory: string[]) {
		store.dispatch({
			type: "startTrade",
			payload: { player1Inventory: player1Inventory, player2Inventory: player2Inventory },
		});
	},
	UpdateRequests(playerRequests: Player[]) {
		store.dispatch({
			type: "updateRequests",
			payload: { requests: playerRequests },
		});
	},
	UpdatePlayers(playerList: Player[]) {
		store.dispatch({
			type: "updateTradePlayers",
			payload: { playerList: playerList },
		});
	},
	UpdateConfirmation(p2Confirmation: boolean) {
		store.dispatch({
			type: "updateConfirmation",
			payload: { player2Confirmation: p2Confirmation },
		});
	},

	init() {
		TradingService.TradeEnded.Connect(() => {
			TradingClient.EndTrade();
		});
		TradingService.SelectedChanged.Connect((player1Selected: string[], player2Selected: string[]) => {
			TradingClient.UpdateSelection(player1Selected, player2Selected);
		});
		TradingService.TradeStarted.Connect((player1Inventory: string[], player2Inventory: string[]) => {
			TradingClient.StartTrade(player1Inventory, player2Inventory);
		});
		TradingService.RequestsChanged.Connect((playerRequests: Player[]) => {
			TradingClient.UpdateRequests(playerRequests);
		});
		TradingService.PlayersChanged.Connect((playerList: Player[]) => {
			TradingClient.UpdatePlayers(playerList);
		});
		TradingService.ConfirmationsChanged.Connect((player1Confirmation: boolean, player2Confirmation: boolean) => {
			TradingClient.UpdateConfirmation(player2Confirmation);
		});
		print("Trading Service Initialized | Client");
	},
};

export default TradingClient;
