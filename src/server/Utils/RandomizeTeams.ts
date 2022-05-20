import { RESERVED_TEAMS } from "./ReservedTeams";
import { Players, Teams } from "@rbxts/services";

const shuffleTable = (t: Player[]) => {
	const iterations = t.size();
	let j;

	for (let i = iterations; i > 2; i--) {
		j = math.random() * i;
		const temp = t[i];
		t[i] = t[j];
		t[j] = temp;
	}
	return t;
};

export const randomizeTeams = () => {
	if (Teams.GetChildren().size() > 1) {
		let list: Player[] = [];
		const P = Players.GetPlayers();
		P.forEach((player: Player) => {
			if (RESERVED_TEAMS.includes(player.TeamColor)) {
				list.push(player);
			}
		});

		const teamList: Team[] = [];
		const teams = Teams.GetTeams();
		teams.forEach((team) => {
			if (!RESERVED_TEAMS.includes(team.TeamColor)) {
				teamList.push(team);
			}
		});

		const numPerTeam = list.size() / teamList.size();

		math.randomseed(os.time());
		list = shuffleTable(list);
		let num = 0;
		teamList.forEach((team) => {
			for (let i = 0; i < numPerTeam; i++) {
				list[num].TeamColor = team.TeamColor;
				num += 1;
			}
		});
	}
};
