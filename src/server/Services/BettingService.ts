import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { GoldService } from "./GoldService";
import SnackbarService from "./SnackbarService";
import ObjectUtils from "@rbxts/object-utils";

declare global {
	interface KnitServices {
		BettingService: typeof BettingService;
	}
}

export const BettingService = Knit.CreateService({
	Name: "BettingService",

	// Server-exposed Signals/Fields
	PlayerBets: new Map<Player, { Gold: number; Choice: Player | string }>(),

	Client: {
		CloseBetting: new RemoteSignal<() => void>(),
		FetchBettingInfo: new RemoteSignal<(participants: Player[], mode: string) => void>(),
		PlaceBet(Player: Player, Gold: number, Choice: Player | string) {
			return this.Server.PlaceBet(Player, Gold, Choice);
		},
	},

	ResetBets() {
		this.PlayerBets.clear();
	},

	FetchBettingInfo(participants: Player[], mode: string) {
		participants.forEach((participant: Player) => {
			this.Client.FetchBettingInfo.Fire(participant, participants, mode);
		});
	},

	PlaceBet(player: Player, BetAmt: number, Choice: Player | string) {
		let success = false;
		if (BetAmt > 0) {
			if (Choice !== "") {
				const gold = GoldService.GetGold(player);
				if (gold >= BetAmt) {
					GoldService.AddGold(player, -BetAmt);
					this.PlayerBets.set(player, { Gold: BetAmt, Choice: Choice });
					SnackbarService.PushPlayer(
						player,
						`Successfully placed bet on ${
							(typeIs(Choice, "Instance") && (Choice as Instance).Name) || Choice
						} for ${BetAmt} gold!`,
					);
					success = true;
				} else {
					SnackbarService.PushPlayer(player, "Bet amount is too high!");
				}
			} else {
				SnackbarService.PushPlayer(player, "No player selected.");
			}
		} else {
			SnackbarService.PushPlayer(player, "Bet amount is too low!");
		}
		return success;
	},

	AwardBets(Winner: Player | string) {
		ObjectUtils.entries(this.PlayerBets).forEach((entry) => {
			const player = entry[0];
			const betInfo = entry[1];
			if (betInfo.Choice === Winner) {
				const receivedGold = math.round(betInfo.Gold * 1.5);
				GoldService.AddGold(player, receivedGold);
				SnackbarService.PushPlayer(player, `Received ${receivedGold} for a successful bet!`);
			}
		});
	},

	KnitInit() {
		print("Betting Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerBets.delete(player));
	},
});
