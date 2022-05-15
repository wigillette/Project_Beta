import { GoldService } from "server/Services/GoldService";

export const TwitterCodes = {
	alpha: (player: Player) => {
		GoldService.AddGold(player, 100);
		return "You have received 100 gold!";
	},
};
