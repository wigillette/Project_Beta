import { KnitServer } from "@rbxts/knit";

const JuggernautProperties = {
	TEAMS: [new BrickColor("Bright red"), new BrickColor("Bright blue")],
	TEAM_NAMES: ["Juggernaut", "Survivors"],
	TIME_LIMIT: 120,
	OUTSCORE: 1,
	HEALTH_PER_PLAYER: 100,
	teamPlayers: (participants: Player[]) => {
		const matchService = KnitServer.GetService("MatchService");

		let randomJuggernaut = participants[math.floor(math.random() * participants.size())];
		// Just being precautious in case a player leaves or something
		while (!randomJuggernaut) {
			randomJuggernaut = participants[math.floor(math.random() * participants.size())];
		}
		pcall(() => {
			randomJuggernaut.TeamColor = JuggernautProperties.TEAMS[0];
			const charLoadedConnection = randomJuggernaut.CharacterAdded.Connect((char) => {
				wait(0.5);
				if (char) {
					const humanoid = char.FindFirstChildOfClass("Humanoid");

					if (humanoid) {
						const juggernautHealth = JuggernautProperties.HEALTH_PER_PLAYER * (participants.size() - 1);
						humanoid.MaxHealth = juggernautHealth;
						humanoid.Health = juggernautHealth;
					}
				}
				charLoadedConnection.Disconnect();
			});
		});

		participants.forEach((player: Player) => {
			if (randomJuggernaut !== player) {
				pcall(() => {
					player.TeamColor = JuggernautProperties.TEAMS[1];
				});
			}
			matchService.GiveWeapon(player, true);
			pcall(() => {
				player.LoadCharacter();
			});
		});
	},
	init: (teams: Team[], participants: Player[]) => {
		print("Loading Juggernaut..");

		const matchService = KnitServer.GetService("MatchService");
		JuggernautProperties.teamPlayers(participants);
		matchService.StartTimer(
			JuggernautProperties.TIME_LIMIT,
			teams,
			(aliveCounter: number) => {
				let toReturn = undefined;
				teams.forEach((team) => {
					if (team.GetPlayers().size() !== 0) {
						toReturn = team.Name;
					}
				});

				return toReturn;
			},
			participants,
		);
	},
};

export default JuggernautProperties;
