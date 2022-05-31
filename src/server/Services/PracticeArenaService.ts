import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { InventoryService } from "./InventoryService";
import MatchService from "./MatchService";

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

	SetUpEnterListener() {
		this.ArenaEnter.Touched.Connect((hit) => {
			const character = hit.Parent;
			if (character) {
				const humanoid = character.FindFirstChildOfClass("Humanoid");
				if (humanoid) {
					const player = Players.GetPlayerFromCharacter(character);
					if (player && player.TeamColor === new BrickColor("White")) {
						const isPlaying = MatchService.CanAccess(player)[0];
						if (!isPlaying) {
							pcall(() => {
								player.TeamColor = new BrickColor("Ghost grey");
								player.LoadCharacter();
							});
						}
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
					if (player && player.TeamColor === new BrickColor("Ghost grey")) {
						const isPlaying = MatchService.CanAccess(player)[0];
						if (!isPlaying) {
							pcall(() => {
								player.TeamColor = new BrickColor("White");
								player.LoadCharacter();
							});
						}
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
