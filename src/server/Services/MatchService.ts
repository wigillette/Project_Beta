import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
interface playerResult {
	Player: Player;
	Kills: number;
	Deaths: number;
}
declare global {
	interface KnitServices {
		MatchService: typeof MatchService;
	}
}

const MatchService = Knit.CreateService({
	Name: "MatchService",

	Client: {
		// Handles client-server communication; OnServerEvent
		UpdateMatchResults: new RemoteSignal<
			(expEarned: number, goldEarned: number, playerResults: playerResult[]) => void
		>(),
	},

	// Push a notification to a single client
	PushResults(client: Player, expEarned: number, goldEarned: number, playerResults: playerResult[]) {
		this.Client.UpdateMatchResults.Fire(client, expEarned, goldEarned, playerResults);
	},

	// Initialize on service startup
	KnitInit() {
		print("Snackbar Service Initialized | Server");
	},
});

export = MatchService;
