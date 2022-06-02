import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		ChatService: typeof ChatService;
	}
}

const ChatService = Knit.CreateService({
	Name: "ChatService",
	HelpfulTips: [
		"Invite your friends to receive an additional five coins!",
		"Guilds and Swordlink sponsored tournaments are coming soon.",
		"Those level 15 and higher have a 10% chance of receiving an arena ticket every round.",
		"Join our communications server on the Swordlink game page to become involved in our community!",
		"When you reach level ten, you can craft five swords of the same rarity to receive a sword of the next tier rarity.",
		"To enter the practice arena, set your settings to 'Not Playing'.",
		"There are many badges that people can earn while playing. People receive coins when they earn badges.",
		"Want a break from sword fighting? Take a crack at the obby in the lobby. Those who reach the half way point receive 150 coins, and those who reach the top receive 300 coins. Be sure to set your settings to 'Not Playing'.",
		"If you encounter any bugs, please contact a Swordlink moderator or owner.",
		"Want to spice up your Swordlink experience? Take a look at our gamepasses by clicking on the book icon at the bottom right corner of the screen.",
	],
	TipIndex: 0,

	Client: {
		PostFeedback: new RemoteSignal<(Message: string, Color?: Color3) => void>(),
	},

	PostFeedback(player: Player, msg: string, color?: Color3) {
		this.Client.PostFeedback.Fire(player, msg, color);
	},

	PostAllFeedback(msg: string, color?: Color3) {
		this.Client.PostFeedback.FireAll(msg, color);
	},

	DisplayTips() {
		spawn(() => {
			while (Players.GetPlayers().size() <= 0) {
				wait(0.05);
			}
			while (Players.GetPlayers().size() > 0) {
				const randomTip = this.HelpfulTips[this.TipIndex % this.HelpfulTips.size()];
				this.PostAllFeedback(randomTip, Color3.fromRGB(185, 196, 177));
				this.TipIndex += 1;
				wait(90);
			}
		});
	},

	KnitInit() {
		Players.PlayerAdded.Connect((player) => this.PostAllFeedback(`${player.Name} has joined the server!`));
		Players.PlayerRemoving.Connect((player) => this.PostAllFeedback(`${player.Name} has left the server!`));
		this.DisplayTips();
		print("Chat Service Initialized | Server");
	},
});

export default ChatService;
