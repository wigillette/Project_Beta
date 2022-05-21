import { Players, ReplicatedStorage, SoundService, Workspace } from "@rbxts/services";
import ObjectUtils from "@rbxts/object-utils";

export const INITIAL_SETTINGS = {
	ReducedParts: false,
	Music: true,
	Hitbox: false,
	Material: false,
	Playing: true,
	Packages: true,
};

export interface SETTINGS_FORMAT {
	ReducedParts: boolean;
	Music: boolean;
	Hitbox: boolean;
	Material: boolean;
	Playing: boolean;
	Packages: boolean;
}

const partCache = new Map<BasePart | Part | WedgePart | MeshPart, Enum.Material>();
const extraPartsFolder = ReplicatedStorage.WaitForChild("ExtraParts");
const instances = ReplicatedStorage.WaitForChild("Instances");
const hitboxConnections = new Map<Player, RBXScriptConnection>();
let playerAddedConnection: RBXScriptConnection | undefined = undefined;

const fillPartCache = () => {
	const descendants = Workspace.GetDescendants();
	descendants.forEach((descendant) => {
		if (
			descendant.IsA("BasePart") ||
			descendant.IsA("Part") ||
			descendant.IsA("WedgePart") ||
			descendant.IsA("MeshPart")
		) {
			if (!partCache.get(descendant)) {
				partCache.set(descendant, descendant.Material);
			}
		}
	});
};

const displayExtraParts = () => {
	if (!Workspace.FindFirstChild("ExtraParts")) {
		const newFolder = extraPartsFolder.Clone();
		newFolder.Parent = Workspace;
	}
};

const hideExtraParts = () => {
	const extraParts = Workspace.FindFirstChild("ExtraParts");
	if (extraParts) {
		extraParts.Destroy();
	}
};

const activateMusic = (activate: boolean) => {
	const songs = SoundService.GetDescendants();
	songs.forEach((song) => {
		if (song.IsA("Sound")) {
			song.Volume = (activate && 0.5) || 0;
		}
	});
};

const applyHitBox = (player: Player) => {
	const hitbox = instances.FindFirstChild("Hitbox") as SelectionBox;
	if (player && hitbox) {
		const backpackChildren = player.WaitForChild("Backpack").GetChildren();
		if (backpackChildren.size() > 0) {
			backpackChildren.forEach((child) => {
				if (child.IsA("Tool")) {
					const handle = child.FindFirstChild("Handle");
					if (handle) {
						const clone = hitbox.Clone();
						clone.Parent = child;
						clone.Adornee = handle;
					}
				}
			});
		}
		const character = player.Character;
		if (character) {
			character.GetChildren().forEach((child) => {
				if (child.IsA("Tool")) {
					const handle = child.FindFirstChild("Handle");
					if (handle) {
						const clone = hitbox.Clone();
						clone.Parent = child;
						clone.Adornee = handle;
					}
				}
			});
		}
	}
};

export const SETTINGS_FUNCTIONS = {
	ReducedParts: (activate: boolean) => {
		if (!activate) {
			displayExtraParts();
		} else {
			hideExtraParts();
		}
	},
	Music: (activate: boolean) => {
		activateMusic(activate);
	},
	Hitbox: (activate: boolean) => {
		if (activate) {
			playerAddedConnection = Players.PlayerAdded.Connect((player) => {
				hitboxConnections.set(
					player,
					player.CharacterAdded.Connect((char) => {
						spawn(() => {
							applyHitBox(player);
						});
					}),
				);
			});
		} else {
			if (playerAddedConnection) {
				playerAddedConnection.Disconnect();
				playerAddedConnection = undefined;
			}
			hitboxConnections.forEach((connection) => {
				connection.Disconnect();
			});
			hitboxConnections.clear();
		}
	},
	Material: (activate: boolean) => {
		fillPartCache();
		if (!activate) {
			ObjectUtils.entries(partCache).forEach((partEntry) => {
				if (partEntry[0]) {
					partEntry[0].Material = partEntry[1];
				}
			});
		} else {
			ObjectUtils.entries(partCache).forEach((partEntry) => {
				if (partEntry[0]) {
					partEntry[0].Material = Enum.Material.SmoothPlastic;
				}
			});
		}
	},
	Packages: (activate: boolean) => {
		print("Updating packages...");
	},
};
