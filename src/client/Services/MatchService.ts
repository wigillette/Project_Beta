import { KnitClient as Knit } from "@rbxts/knit";
import { playerResult } from "client/Rodux/Reducers/ResultsReducer";
import Store from "../Rodux/Store";
const MatchService = Knit.GetService("MatchService");
const ResultsClient = {
	UpdateMatchResults: (expEarned: number, goldEarned: number, playerResults: playerResult[]) => {
		Store.dispatch({
			type: "updateResultsInfo",
			payload: { expEarned: expEarned, goldEarned: goldEarned, playerResults: playerResults },
		});
	},
	init: () => {
		MatchService.UpdateMatchResults.Connect(
			(expEarned: number, goldEarned: number, playerResults: playerResult[]) => {
				ResultsClient.UpdateMatchResults(expEarned, goldEarned, playerResults);
			},
		);
	},
};

export default ResultsClient;
