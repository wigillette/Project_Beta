import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import SnackbarService from "./SnackbarService";
import ObjectUtils from "@rbxts/object-utils";
import { modes, maps } from "shared/GameInfo";

declare global {
	interface KnitServices {
		VotingService: typeof VotingService;
	}
}

interface voteFormat {
	Map: string;
	Mode: string;
}

export const VotingService = Knit.CreateService({
	Name: "VotingService",

	// Server-exposed Signals/Fields
	PlayerVotes: new Map<Player, voteFormat>(),
	ChosenMaps: [] as string[],
	ChosenModes: [] as string[],

	Client: {
		PushChosen: new RemoteSignal<(maps: string[], modes: string[]) => void>(),
		CloseVoting: new RemoteSignal<() => void>(),
		CastVote(Player: Player, Votes: voteFormat) {
			this.Server.CastVote(Player, Votes);
		},
	},

	ResetVotes() {
		this.PlayerVotes.clear();
	},

	CastVote(player: Player, votes: voteFormat) {
		if (!this.PlayerVotes.has(player)) {
			if (this.ChosenMaps.includes(votes.Map) && this.ChosenModes.includes(votes.Mode)) {
				this.PlayerVotes.set(player, votes);
				SnackbarService.PushPlayer(player, `Successfully voted for ${votes.Map} and ${votes.Mode}`);
			} else {
				SnackbarService.PushPlayer(player, "Invalid vote!");
			}
		} else {
			SnackbarService.PushPlayer(player, "You have already voted!");
		}
	},

	SelectChosen(participants: Player[]) {
		while (this.ChosenMaps.size() !== 3) {
			const randomChoice = maps[math.floor(math.random() * maps.size())];
			if (randomChoice) {
				if (!this.ChosenMaps.includes(randomChoice.Name)) {
					this.ChosenMaps.push(randomChoice.Name);
				}
			}
		}
		while (this.ChosenModes.size() !== 3) {
			const randomChoice = modes[math.floor(math.random() * modes.size())];
			if (!this.ChosenModes.includes(randomChoice)) {
				this.ChosenModes.push(randomChoice);
			}
		}

		participants.forEach((participant: Player) => {
			this.Client.PushChosen.Fire(participant, this.ChosenMaps, this.ChosenModes);
		});
	},

	TotalVotes() {
		const modeTotals = new Map<string, number>();
		const mapTotals = new Map<string, number>();
		modes.forEach((modeName) => {
			if (!modeTotals.has(modeName)) {
				modeTotals.set(modeName, 0);
			}
		});

		maps.forEach((map) => {
			if (map.IsA("Model")) {
				if (!mapTotals.has(map.Name)) {
					mapTotals.set(map.Name, 0);
				}
			}
		});

		this.PlayerVotes.forEach((vote) => {
			const formerModeValue = modeTotals.get(vote.Mode);
			if (formerModeValue !== undefined) {
				modeTotals.set(vote.Mode, formerModeValue + 1);
			}

			const formerMapValue = mapTotals.get(vote.Map);
			if (formerMapValue !== undefined) {
				mapTotals.set(vote.Map, formerMapValue + 1);
			}
		});

		let chosenMode = undefined;
		let chosenMap = undefined;
		let chosenMapVotes = 0;
		let chosenModeVotes = 0;
		ObjectUtils.entries(modeTotals).forEach((vote) => {
			if (vote[1] > chosenModeVotes) {
				chosenMode = vote[0];
				chosenModeVotes = vote[1];
			}
		});

		ObjectUtils.entries(mapTotals).forEach((vote) => {
			if (vote[1] > chosenMapVotes) {
				chosenMap = vote[0];
				chosenMapVotes = vote[1];
			}
		});

		this.ResetVotes();

		return [chosenMap, chosenMode];
	},

	KnitInit() {
		print("Voting Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerVotes.delete(player));
	},
});
