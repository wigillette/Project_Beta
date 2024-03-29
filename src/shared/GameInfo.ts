import { ReplicatedStorage } from "@rbxts/services";

export const modes = ["FFA", "Teamswap", "Ghosts", "TDM", "Streak", "SFT", "PTL", "Juggernaut"];
export const modeDescriptions = {
	FFA: "Players will fight to the death with five lives.",
	TDM: "Players will be sorted into teams and battle to the death with five lives.",
	SFT: "Players will be sorted into a bracket and face off against one another to see who comes out on top.",
	Teamswap: "Players will switch to the opposing team upon death. The round ends when all players are on one team.",
	Streak: "Players will duel for 3.5 minutes in a FFA. The person with the greatest overall kill streak wins.",
	PTL: "A leader will be randomly chosen on each team. Players must kill the opposing team's leader.",
	Ghosts: "A quarter of the participants are chosen as ghosts. Ghosts are invisible but have a shadow that appears every few seconds. Kill the opposing team to win!",
	Juggernaut: "A team must kill a random player that has a significant amount of health.",
};
export const modeObjectives = {
	FFA: "Kill the surrounding players!",
	TDM: "Defeat the opposing team. Each player has five lives.",
	Teamswap: "Swap everyone on the opposing team to your team!",
	Streak: "Compete to hold the highest killstreak!",
	PTL: "Defeat the opposing team's leader!",
	Ghosts: "Defeat the opposing team!",
	Juggernaut: "Defeat the player with extra health!",
};

export const maps = ReplicatedStorage.WaitForChild("Maps").GetChildren();
