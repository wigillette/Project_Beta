import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { GoldService } from "./GoldService";

declare global {
	interface KnitServices {
		FriendService: typeof FriendService;
	}
}

const FriendService = Knit.CreateService({
	Name: "FriendService",

	FriendRewards: new Map<Player, number[]>(),

	GetFriends(client: Player) {
		const chatService = Knit.GetService("ChatService");

		Players.GetPlayers().forEach((player: Player) => {
			const playerRewards = this.FriendRewards.get(player) || ([] as number[]);
			if (!this.FriendRewards.has(player)) {
				this.FriendRewards.set(player, [] as number[]);
			}

			if (client.IsFriendsWith(player.UserId) && !playerRewards.includes(client.UserId)) {
				playerRewards.push(client.UserId);
				this.FriendRewards.set(player, playerRewards);
				GoldService.AddGold(player, 5);
				chatService.PostFeedback(
					player,
					`You have received five coins since your friend ${client.Name} joined the game!`,
				);
			}
		});
	},

	KnitInit() {
		Players.PlayerAdded.Connect((client: Player) => {
			this.GetFriends(client);
		});
		print("Friend Service Initialized | Server");
	},
});

export default FriendService;
