import { KnitClient as Knit } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Store from "../Rodux/Store";

interface voteFormat {
	Map: string;
	Mode: string;
}

const VotingService = Knit.GetService("VotingService");
const VotingClient = {
	CastVote: (votes: voteFormat) => {
		VotingService.CastVote(votes);
	},
	PushChosen: (maps: string[], modes: string[]) => {
		Store.dispatch({ type: "updateVotingOptions", payload: { maps: maps, modes: modes, toggle: true } });
	},
	CloseVoting: () => {
		Store.dispatch({ type: "setVotingToggle", payload: { toggle: false } });
	},
	init: () => {
		VotingService.PushChosen.Connect((maps: string[], modes: string[]) => {
			VotingClient.PushChosen(maps, modes);
		});
		VotingService.CloseVoting.Connect(VotingClient.CloseVoting);
	},
};

export default VotingClient;
