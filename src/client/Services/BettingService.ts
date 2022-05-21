import { KnitClient as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Store from "../Rodux/Store";
const BettingService = Knit.GetService("BettingService");
const BettingClient = {
	PlaceBet: (gold: number, choice: Player | string) => {
		return BettingService.PlaceBet(gold, choice);
	},
	FetchBettingInfo: (choices: Player[] | string[], mode: string) => {
		Store.dispatch({
			type: "updateBettingInfo",
			payload: { choices: choices, mode: mode, toggle: true },
		});
	},
	CloseBetting: () => {
		Store.dispatch({ type: "setBettingToggle", payload: { toggle: false } });
	},
	init: () => {
		BettingService.CloseBetting.Connect(BettingClient.CloseBetting);
		BettingService.FetchBettingInfo.Connect((participants: Player[], mode: string) => {
			BettingClient.FetchBettingInfo(participants, mode);
		});
	},
};

export default BettingClient;
