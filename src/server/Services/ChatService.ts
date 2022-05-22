import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		ChatService: typeof ChatService;
	}
}

const ChatService = Knit.CreateService({
	Name: "ChatService",

	Client: {
		PostFeedback: new RemoteSignal<(Message: string, Color?: Color3) => void>(),
	},

	PostFeedback(player: Player, msg: string, color?: Color3) {
		this.Client.PostFeedback.Fire(player, msg, color);
	},

	PostAllFeedback(msg: string, color?: Color3) {
		this.Client.PostFeedback.FireAll(msg, color);
	},

	KnitInit() {
		Players.PlayerAdded.Connect((player) => this.PostAllFeedback(`${player.Name} has joined the server!`));
		Players.PlayerRemoving.Connect((player) => this.PostAllFeedback(`${player.Name} has left the server!`));
		print("Chat Service Initialized | Server");
	},
});

export default ChatService;
