import { KnitServer } from "@rbxts/knit";
import { ReplicatedStorage, Teams } from "@rbxts/services";
import { randomizeTeams } from "server/Utils/RandomizeTeams";
import ObjectUtils from "@rbxts/object-utils";

export interface leaderFormat {
	Red: Player | undefined;
	Blue: Player | undefined;
}

const leaders: leaderFormat = { Red: undefined, Blue: undefined };
const instances = ReplicatedStorage.WaitForChild("Instances");
const crown = instances.WaitForChild("Crown") as BillboardGui;
const PTLProperties = {
	TEAMS: [new BrickColor("Bright red"), new BrickColor("Bright blue")],
	TEAM_NAMES: ["Red", "Blue"],
	TIME_LIMIT: 180,
	OUTSCORE: 1000,
	teamPlayers: (participants: Player[]) => {
		const matchService = KnitServer.GetService("MatchService");

		randomizeTeams(participants);
		leaders.Red = undefined;
		leaders.Blue = undefined;

		wait(1);
		PTLProperties.TEAM_NAMES.forEach((teamName) => {
			const team = Teams.FindFirstChild(teamName) as Team;
			if (team) {
				const teamPlayers = team.GetPlayers();
				print(teamPlayers);
				if (teamPlayers.size() > 0) {
					leaders[team.Name as keyof typeof leaders] =
						teamPlayers[math.floor(math.random() * teamPlayers.size())];
				}
			}
		});

		ObjectUtils.values(leaders).forEach((leader) => {
			if (leader) {
				const charLoadedConnection = leader.CharacterAdded.Connect((char) => {
					if (char) {
						const head = char.FindFirstChild("Head");
						if (head) {
							spawn(() => {
								const newCrown = crown.Clone();
								newCrown.Parent = head;
							});
						}
						const humanoid = char.FindFirstChildOfClass("Humanoid");
						if (humanoid) {
							const diedConnection = humanoid.Died.Connect(() => {
								if (leader) {
									matchService.RemoveWeapon(leader);
									leader.TeamColor = new BrickColor("White");
									leader.LoadCharacter();
								}
								diedConnection.Disconnect();
							});
						}
					}
					charLoadedConnection.Disconnect();
				});
			}
		});

		participants.forEach((player: Player) => {
			matchService.GiveWeapon(player, true);
			pcall(() => {
				player.LoadCharacter();
			});
		});
	},
	init: (teams: Team[], participants: Player[]) => {
		print("Loading PTL..");

		const matchService = KnitServer.GetService("MatchService");
		PTLProperties.teamPlayers(participants);
		matchService.StartTimer(
			PTLProperties.TIME_LIMIT,
			teams,
			(aliveCounter: number) => {
				let toReturn = undefined;
				const isAlive = { Blue: true, Red: true };
				teams.forEach((team) => {
					if (team.Name in leaders && team.Name in isAlive) {
						const teamLeader = leaders[team.Name as keyof typeof leaders];
						isAlive[team.Name as keyof typeof isAlive] =
							teamLeader !== undefined && teamLeader.TeamColor !== new BrickColor("White");
					}
				});

				if (isAlive.Blue && isAlive.Red) {
					toReturn = "None";
				} else if (isAlive.Blue && !isAlive.Red) {
					toReturn = "Blue";
				} else if (isAlive.Red && !isAlive.Blue) {
					toReturn = "Red";
				}

				return toReturn;
			},
			participants,
			leaders,
		);
	},
};

export default PTLProperties;
