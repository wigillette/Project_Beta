import { KnitServer as Knit } from "@rbxts/knit";
import { NPCInteractions } from "../../shared/InteractionData";

declare global {
	interface KnitServices {
		InteractionService: typeof InteractionService;
	}
}

const InteractionService = Knit.CreateService({
	Name: "InteractionService",

	Client: {
		// Handles client-server communication; OnServerEvent
		GetInteractions() {
			return this.Server.GetInteractions();
		},
	},

	// Get People Function: returns InteractionData from the server
	GetInteractions() {
		return NPCInteractions;
	},

	// Initialize on service startup
	KnitInit() {
		print("Interaction Service Initialized | Server");
	},
});

export = InteractionService;
