import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";

declare global {
	interface KnitServices {
		SnackbarService: typeof SnackbarService;
	}
}

const SnackbarService = Knit.CreateService({
	Name: "SnackbarService",

	Client: {
		// Handles client-server communication; OnServerEvent
		PushNotification: new RemoteSignal<(Alert: string) => void>(),
	},

	// Push a notification to everyone
	PushAll(Alert: string) {
		this.Client.PushNotification.FireAll(Alert);
	},

	// Push a notification to a single client
	PushPlayer(client: Player, Alert: string) {
		this.Client.PushNotification.Fire(client, Alert);
	},

	// Initialize on service startup
	KnitInit() {
		coroutine.wrap(() => {
			wait(4);
			this.PushAll("Ben Douglas ;)");
			wait(2);
			this.PushAll("Tom Boccuto :/");
			wait(2);
			this.PushAll("Jake Kosa ^_^");
			wait(2);
			this.PushAll("Will Gillette <_>");
		})();
	},
});

export = SnackbarService;
