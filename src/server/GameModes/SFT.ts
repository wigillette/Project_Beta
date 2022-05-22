import { KnitServer } from "@rbxts/knit";
import { ReplicatedStorage, Teams } from "@rbxts/services";
import { randomizeTeams } from "server/Utils/RandomizeTeams";
import ObjectUtils from "@rbxts/object-utils";

export interface leaderFormat {
	Red: Player | undefined;
	Blue: Player | undefined;
}

const objectValues = ReplicatedStorage.WaitForChild("ObjectValues");
const status = objectValues.WaitForChild("Status") as StringValue;
const timer = objectValues.WaitForChild("Timer") as IntValue;
const SFTProperties = {
	TEAMS: [new BrickColor("Bright red"), new BrickColor("Bright blue")],
	TEAM_NAMES: ["Red", "Blue"],
	TIME_LIMIT: 60,
	OUTSCORE: 1,
	teamPlayers: (participants: Player[]) => {
		const fighters = [...participants];
		const matchService = KnitServer.GetService("MatchService");

		while (fighters.size() >= 2) {
			const randomP1Index = math.floor(math.random() * fighters.size());
			const P1 = fighters[randomP1Index];
			fighters.remove(randomP1Index);

			const randomP2Index = math.floor(math.random() * fighters.size());
			const P2 = fighters[randomP2Index];
			fighters.remove(randomP2Index);

			if (P1 && P2) {
				status.Value = `${P1.Name} vs. ${P2.Name}`;
				pcall(() => {
					matchService.GiveWeapon(P1, true);
					P1.TeamColor = SFTProperties.TEAMS[0];
					P1.LoadCharacter();

					matchService.GiveWeapon(P2, true);
					P2.TeamColor = SFTProperties.TEAMS[1];
					P2.LoadCharacter();
				});

				let endReason = 0;

				for (let i = SFTProperties.TIME_LIMIT; i > 0 && endReason === 0; i--) {
					timer.Value = i;
					wait(1);

					const P1Character = P1.Character;
					if (P1 && P1.Parent) {
						if (P1Character) {
							const humanoid = P1Character.FindFirstChildOfClass("Humanoid");
							if ((humanoid && humanoid.Health <= 0) || P1.TeamColor === new BrickColor("White")) {
								endReason = 1;
							}
						} else {
							endReason = 1;
						}
					} else {
						endReason = 1;
					}

					const P2Character = P2.Character;
					if (P2 && P2.Parent) {
						if (P2Character) {
							const humanoid = P2Character.FindFirstChildOfClass("Humanoid");
							if ((humanoid && humanoid.Health <= 0) || P2.TeamColor === new BrickColor("White")) {
								if (endReason === 1) {
									endReason = 3;
								} else {
									endReason = 2;
								}
							}
						} else {
							if (endReason === 1) {
								endReason = 3;
							} else {
								endReason = 2;
							}
						}
					} else {
						if (endReason === 1) {
							endReason = 3;
						} else {
							endReason = 2;
						}
					}
				}

				if (P1 && P2) {
					pcall(() => {
						matchService.RemoveWeapon(P1);
						matchService.RemoveWeapon(P2);
						P1.TeamColor = new BrickColor("White");
						P2.TeamColor = new BrickColor("White");
						P1.LoadCharacter();
						P2.LoadCharacter();
					});
					switch (endReason) {
						case 0:
							status.Value = "No one won!";
							break;
						case 1:
							status.Value = `${P2.Name} won!`;
							fighters.push(P2);
							break;
						case 2:
							status.Value = `${P1.Name} won!`;
							fighters.push(P1);
							break;
						case 3:
							status.Value = "Both players lost!";
							break;
					}
				}

				wait(3);
			}
		}
		let winner: Player | string = "None";
		if (fighters.size() === 1) {
			winner = fighters[0];
			status.Value = `${winner.Name} has won the tournament!`;
		}
		wait(3);
		matchService.ResetMatch(participants);
		matchService.DisplayResults(winner, participants, []);
	},
	init: (teams: Team[], participants: Player[]) => {
		print("Loading SFT..");

		SFTProperties.teamPlayers(participants);
	},
};

export default SFTProperties;
