import { KnitClient as Knit } from "@rbxts/knit";
import { playerResult } from "client/Rodux/Reducers/ResultsReducer";
import Store from "../Rodux/Store";
const MatchService = Knit.GetService("MatchService");
const ResultsClient = {
	UpdateMatchResults: (goldEarned: number, playerResults: playerResult[], winner: string) => {
		Store.dispatch({
			type: "updateResultsInfo",
			payload: { goldEarned: goldEarned, playerResults: playerResults, toggle: true, winner: winner },
		});
	},
	InitializeMatchPanel: (modeName: string, mapName: string, aliveCounter: number) => {
		Store.dispatch({
			type: "updateMatchInfo",
			payload: {
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
	hideMatchResults: () => {
		Store.dispatch({
			type: "setResultsToggle",
			payload: { toggle: false },
		});
	},
	init: () => {
		MatchService.InitialMatchPanel.Connect((modeName: string, mapName: string, aliveCounter: number) => {
			ResultsClient.InitializeMatchPanel(modeName, mapName, aliveCounter);
		});
		MatchService.UpdateMatchResults.Connect((goldEarned: number, playerResults: playerResult[], winner: string) => {
			ResultsClient.UpdateMatchResults(goldEarned, playerResults, winner);
		});
		MatchService.UpdateAliveCounter.Connect((aliveCounter: number) => {
			ResultsClient.updateAliveCounter(aliveCounter);
		});
		MatchService.HideMatchResults.Connect(() => {
			ResultsClient.hideMatchResults();
		});
	},
};

export default ResultsClient;
