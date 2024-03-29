import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { InventoryService } from "./InventoryService";
import MatchService from "./MatchService";
import SnackbarService from "./SnackbarService";

declare global {
	interface KnitServices {
		PracticeArenaService: typeof PracticeArenaService;
	}
}

const PracticeArenaService = Knit.CreateService({
	Name: "PracticeArenaService",
	ArenaEnter: Workspace.WaitForChild("Location2", 10) as Part,
	ArenaLeave: Workspace.WaitForChild("Location3", 10) as Part,
	SwordGiver: Workspace.WaitForChild("PracticeArena", 10) as Part,
	Debounces: new Map<Player, boolean>(),

	SetUpEnterListener() {
		this.ArenaEnter.Touched.Connect((hit) => {
			const character = hit.Parent;
			if (character) {
				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid) {
					const player = Players.GetPlayerFromCharacter(character);
					if (player && player.TeamColor === new BrickColor("White") && !this.Debounces.get(player)) {
						const isPlaying = MatchService.CanAccess(player)[0];
						this.Debounces.set(player, true);
						if (isPlaying === false) {
							pcall(() => {
								player.TeamColor = new BrickColor("Ghost grey");
								player.LoadCharacter();
							});
						} else {
							SnackbarService.PushPlayer(player, "Must have playing disabled");
						}

						wait(0.2);
						this.Debounces.set(player, false);
					}
				}
			}
		});
	},
	SetUpLeaveListener() {
		this.ArenaLeave.Touched.Connect((hit) => {
			const character = hit.Parent;
			if (character) {
				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid) {
					const player = Players.GetPlayerFromCharacter(character);
					if (player && player.TeamColor === new BrickColor("Ghost grey") && !this.Debounces.get(player)) {
						const isPlaying = MatchService.CanAccess(player)[0];
						this.Debounces.set(player, true);
						if (isPlaying === false) {
							pcall(() => {
								player.TeamColor = new BrickColor("White");
								player.LoadCharacter();
							});
						} else {
							SnackbarService.PushPlayer(player, "Must have playing disabled");
						}

						wait(0.2);
						this.Debounces.set(player, false);
					}
				}
			}
		});
	},

	SetUpArenaWeapons() {
		this.SwordGiver.Touched.Connect((hit) => {
			const character = hit.Parent;
			if (character) {
				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid) {
					const player = Players.GetPlayerFromCharacter(character);
					if (player && player.TeamColor === new BrickColor("Ghost grey")) {
						const equipped = InventoryService.FetchEquipped(player);
						if (equipped) {
							const sword = equipped.Swords;
							if (
								sword !== undefined &&
								!player.WaitForChild("Backpack").FindFirstChild(sword) &&
								!character.FindFirstChild(sword)
							) {
								const modelsFolder = ReplicatedStorage.FindFirstChild("ModelsFolder");
								if (modelsFolder) {
									const swordModel = modelsFolder.FindFirstChild(sword) as Tool;
									if (swordModel) {
										swordModel.Clone().Parent = player.WaitForChild("Backpack", 10);
									}
								}
							}
						}
					}
				}
			}
		});
	},

	KnitInit() {
		this.SetUpEnterListener();
		this.SetUpLeaveListener();
		this.SetUpArenaWeapons();
		print("Practice Arena Initialized | Server");
	},
});

export default PracticeArenaService;
