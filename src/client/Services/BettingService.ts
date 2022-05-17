import { KnitClient as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Store from "../Rodux/Store";
const BettingService = Knit.GetService("BettingService");
const BettingClient = {
	PlaceBet: (gold: number, choice: Player | string) => {
		return BettingService.PlaceBet(gold, choice);
	},
	FetchBettingInfo: (choices: Player[] | string[], mode: string) => {
		Store.dispatch({ type: "updateBettingInfo", payload: { choices: choices, mode: mode } });
	},
	init: () => {
		BettingClient.FetchBettingInfo(Players.GetPlayers(), "FFA");
	},
};

export default BettingClient;
