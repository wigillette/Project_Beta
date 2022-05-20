import { KnitClient as Knit } from "@rbxts/knit";
import { playerResult } from "client/Rodux/Reducers/ResultsReducer";
import { matchState } from "client/Rodux/Reducers/MatchReducer";
import Store from "../Rodux/Store";
const MatchService = Knit.GetService("MatchService");
const ResultsClient = {
	UpdateMatchResults: (goldEarned: number, playerResults: playerResult[]) => {
		Store.dispatch({
			type: "updateResultsInfo",
			payload: { goldEarned: goldEarned, playerResults: playerResults, toggle: true },
		});
	},
	InitializeMatchPanel: (initialTime: number, modeName: string, mapName: string, aliveCounter: number) => {
		Store.dispatch({
			type: "updateMatchInfo",
			payload: {
				initialTime: initialTime,
				modeName: modeName,
				mapName: mapName,
				aliveCounter: aliveCounter,
			},
		});
	},
	updateAliveCounter: (aliveCounter: number) => {
		Store.dispatch({
			type: "updateAliveCounter",
			payload: { aliveCounter: aliveCounter },
		});
	},
	init: () => {
		MatchService.InitialMatchPanel.Connect(
			(initialTime: number, modeName: string, mapName: string, aliveCounter: number) => {
				ResultsClient.InitializeMatchPanel(initialTime, modeName, mapName, aliveCounter);
			},
		);
		MatchService.UpdateMatchResults.Connect((goldEarned: number, playerResults: playerResult[]) => {
			ResultsClient.UpdateMatchResults(goldEarned, playerResults);
		});
		MatchService.UpdateAliveCounter.Connect((aliveCounter: number) => {
			ResultsClient.updateAliveCounter(aliveCounter);
		});
	},
};

export default ResultsClient;
