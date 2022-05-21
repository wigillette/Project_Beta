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

export const randomizeTeams = (participants: Player[]) => {
	if (Teams.GetChildren().size() > 1) {
		const teamList: Team[] = [];
		const teams = Teams.GetTeams();
		teams.forEach((team) => {
			if (!RESERVED_TEAMS.includes(team.TeamColor)) {
				teamList.push(team);
			}
		});

		const numPerTeam = participants.size() / teamList.size();

		math.randomseed(os.time());
		const shuffledParticipants = shuffleTable(participants);
		let num = 0;
		teamList.forEach((team) => {
			for (let i = 0; i < numPerTeam; i++) {
				if (shuffledParticipants[num]) {
					shuffledParticipants[num].TeamColor = team.TeamColor;
				}
				num += 1;
			}
		});
	}
};
