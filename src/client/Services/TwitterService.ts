import { KnitClient as Knit } from "@rbxts/knit";
import Store from "client/Rodux/Store";
const TwitterService = Knit.GetService("TwitterService");

const TwitterClient = {
	RedeemCode: (Code: string) => {
		TwitterService.RedeemCode(Code);
	},
	SetToggle: (state: boolean) => {
		Store.dispatch({ type: "setTwitterToggle", payload: state });
	},
};

export default TwitterClient;
