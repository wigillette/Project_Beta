import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { TwitterCodes } from "../Utils/TwitterCodes";
import SnackbarService from "./SnackbarService";

declare global {
	interface KnitServices {
		TwitterService: typeof TwitterService;
	}
}

export const TwitterService = Knit.CreateService({
	Name: "TwitterService",

	// Server-exposed Signals/Fields
	PlayerCodes: new Map<Player, string[]>(),

	Client: {
		RedeemCode(Player: Player, Code: string) {
			this.Server.RedeemCode(Player, Code);
		},
	},

	RedeemCode(Player: Player, Code: string) {
		// Check if the player has redeemed the code
		const redeemedCodes = this.GetCodes(Player);
		if (!redeemedCodes.includes(Code.lower())) {
			// Run the twitter code function
			if (Code.lower() in TwitterCodes) {
				const response = TwitterCodes[Code.lower() as keyof typeof TwitterCodes](Player);
				// Update the database with the redeemed codes
				redeemedCodes.push(Code.lower());
				this.UpdateCodes(Player, redeemedCodes);
				// Send a notification to the client that the code was successfully redeemed
				SnackbarService.PushPlayer(Player, response);
			} else {
				SnackbarService.PushPlayer(Player, `${Code} is invalid!`);
			}
		} else {
			SnackbarService.PushPlayer(Player, `Already redeemed ${Code}!`);
		}
	},

	GetCodes(Player: Player) {
		const codes = this.PlayerCodes.get(Player);
		return codes ?? [];
	},

	UpdateCodes(Player: Player, Codes: string[]) {
		const ProfileStore = Database("RedeemedCodes", Player);
		ProfileStore.Set(Codes);
	},

	InitData(Player: Player, Codes: string[]) {
		this.PlayerCodes.set(Player, Codes);
	},

	KnitInit() {
		print("Twitter Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerCodes.delete(player));
	},
});
