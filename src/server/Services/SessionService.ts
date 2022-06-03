import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import { BADGE_FUNCTIONS } from "shared/Badges";

declare global {
	interface KnitServices {
		SessionService: typeof SessionService;
	}
}

interface sessionFormat {
	Kills: number;
	Deaths: number;
	Wins: number;
}

const initialSession: sessionFormat = {
	Kills: 0,
	Deaths: 0,
	Wins: 0,
};

const SessionService = Knit.CreateService({
	Name: "SessionService",

	PlayerStats: new Map<Player, sessionFormat>(),
	PlayerGlobalStats: new Map<Player, sessionFormat>(),

	Client: {
		GetUserStats(client: Player, player?: Player) {
			return this.Server.GetUserStats(client, player);
		},
	},

	IncrementStat(player: Player, stat: string, amount: number) {
		const userStats = this.PlayerStats.get(player);
		const userGlobalStats = this.PlayerGlobalStats.get(player);
		if (userStats && stat in userStats && userGlobalStats && stat in userGlobalStats) {
			const newStats = { ...userStats };
			newStats[stat as keyof typeof userStats] += amount;
			const newGlobalStats = { ...userGlobalStats };
			newGlobalStats[stat as keyof typeof userGlobalStats] += amount;
			this.PlayerStats.set(player, newStats);
			this.PlayerGlobalStats.set(player, newGlobalStats);

			// Check for badges
			if (stat === "Kills") {
				BADGE_FUNCTIONS.CheckForKillBadges(player, newGlobalStats.Kills);
			} else if (stat === "Wins") {
				BADGE_FUNCTIONS.CheckForWinBadges(player, newGlobalStats.Wins);
			}
		}
	},

	ResetStats(client: Player) {
		const oldStats = this.PlayerStats.get(client);
		const wins = (oldStats !== undefined && oldStats.Wins) || 0;
		this.PlayerStats.set(client, { Kills: 0, Deaths: 0, Wins: wins });
	},

	GetUserStats(client: Player, player?: Player) {
		let profile = undefined;
		let globalProfile = undefined;
		if (player) {
			profile = this.PlayerStats.get(player);
			globalProfile = this.PlayerGlobalStats.get(player);
		} else {
			profile = this.PlayerStats.get(client);
			globalProfile = this.PlayerGlobalStats.get(client);
		}
		return [profile, globalProfile];
	},

	InitData(client: Player, kills: number, deaths: number, wins: number) {
		this.PlayerGlobalStats.set(client, { Kills: kills, Deaths: deaths, Wins: wins });
	},

	KnitInit() {
		Players.PlayerAdded.Connect((player) => {
			this.PlayerStats.set(player, initialSession);
		});
		Players.PlayerRemoving.Connect((player) => {
			this.PlayerStats.delete(player);
			this.PlayerGlobalStats.delete(player);
		});
		print("Session Service Initialized | Server");
	},
});

export default SessionService;
