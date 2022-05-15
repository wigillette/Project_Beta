export const INITIAL_SETTINGS = {
	ReducedParts: false,
	Music: false,
	Hitbox: false,
	Material: false,
};

export interface SETTINGS_FORMAT {
	ReducedParts: boolean;
	Music: boolean;
	Hitbox: boolean;
	Material: boolean;
}

export const SETTINGS_FUNCTIONS = {
	ReducedParts: (player: Player) => {
		print("Activating reduced Parts");
	},
	Music: (player: Player) => {
		print("Activating music");
	},
	Hitbox: (player: Player) => {
		print("Activating hitbox");
	},
	Material: (player: Player) => {
		print("Activating Material");
	},
};
