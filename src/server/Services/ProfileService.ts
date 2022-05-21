import { KnitServer as Knit, Signal, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";
import Database from "@rbxts/datastore2";
import { CAP_FORMULA, INITIAL_STATS, PROFILE_FORMAT } from "shared/LevelInfo";

declare global {
	interface KnitServices {
		ProfileService: typeof ProfileService;
	}
}

export const ProfileService = Knit.CreateService({
	Name: "ProfileService",

	// Server-exposed Signals/Fields
	PlayerProfiles: new Map<Player, PROFILE_FORMAT>(),

	Client: {
		ProfileChanged: new RemoteSignal<(Profile: PROFILE_FORMAT) => void>(),
		GetProfile(Player: Player) {
			return this.Server.GetProfile(Player);
		},
	},

	IncrementExp(Player: Player, Amount: number) {
		if (Amount > 0) {
			print(`Adding ${Amount} experience to ${Player.Name} | Server`);
			const profile = this.GetProfile(Player);
			const currentCap = profile.ExpCap;
			// Increment current exp
			let newExp = profile.Experience + Amount;
			let newLevel = profile.Level;
			// Carry over user's experience and increment level
			if (newExp >= currentCap) {
				newLevel += 1;
				newExp -= currentCap;
			}

			const newProfile: PROFILE_FORMAT = {
				ExpCap: CAP_FORMULA(newLevel),
				Experience: newExp,
				Level: newLevel,
			};

			this.PlayerProfiles.set(Player, newProfile);
			this.Client.ProfileChanged.Fire(Player, newProfile);
			this.UpdateProfile(Player, newProfile);
		}
	},

	GetProfile(Player: Player) {
		const profile = this.PlayerProfiles.get(Player);
		return profile ?? INITIAL_STATS;
	},

	UpdateProfile(Player: Player, Profile: PROFILE_FORMAT) {
		const ProfileStore = Database("Profile", Player);
		ProfileStore.Set(Profile);
	},

	InitData(Player: Player, Profile: PROFILE_FORMAT) {
		this.PlayerProfiles.set(Player, Profile);
		this.Client.ProfileChanged.Fire(Player, Profile);
	},

	KnitInit() {
		print("Profile Service Initialized | Server");
		Players.PlayerRemoving.Connect((player) => this.PlayerProfiles.delete(player));
	},
});
