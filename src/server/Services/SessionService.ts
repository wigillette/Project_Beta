import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";

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

	Client: {
		GetUserStats(client: Player, player?: Player) {
			return this.Server.GetUserStats(client, player);
		},
	},

	IncrementStat(player: Player, stat: string, amount: number) {
		const userStats = this.PlayerStats.get(player);
		if (userStats && stat in userStats) {
			const newStats = { ...userStats };
			newStats[stat as keyof typeof userStats] += amount;
			this.PlayerStats.set(player, newStats);
		}
	},

	ResetStats(client: Player) {
		const oldStats = this.PlayerStats.get(client);
		const wins = (oldStats !== undefined && oldStats.Wins) || 0;
		this.PlayerStats.set(client, { Kills: 0, Deaths: 0, Wins: wins });
	},

	GetUserStats(client: Player, player?: Player) {
		let profile = undefined;
		if (player) {
			profile = this.PlayerStats.get(player);
		} else {
			profile = this.PlayerStats.get(client);
		}
		return profile;
	},

	KnitInit() {
		Players.PlayerAdded.Connect((player) => {
			this.PlayerStats.set(player, initialSession);
		});
		Players.PlayerRemoving.Connect((player) => {
			this.PlayerStats.delete(player);
		});
		print("Session Service Initialized | Server");
	},
});

export default SessionService;
