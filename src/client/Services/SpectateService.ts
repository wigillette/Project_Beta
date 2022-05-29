import { KnitClient as Knit } from "@rbxts/knit";
import Store from "../Rodux/Store";
const MatchService = Knit.GetService("MatchService");
const SpectateClient = {
	SpectateChanged: (participants: Player[]) => {
		Store.dispatch({
			type: "updateParticipants",
			payload: { participants: participants },
		});
	},
	init: () => {
		MatchService.GetParticipants.Connect(SpectateClient.SpectateChanged);
		print("Spectate Service Initialized | Client");
	},
};

export default SpectateClient;
