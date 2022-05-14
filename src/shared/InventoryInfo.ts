export interface InventoryFormat {
	Swords: Map<string, Model | Tool | "">;
	Elixirs: Map<string, Model | Tool | "">;
	Pets: Map<string, Model | Tool | "">;
}

export const INITIAL_INVENTORY = {
	Swords: new Map<string, Model | Tool | "">(),
	Elixirs: new Map<string, Model | Tool | "">(),
	Pets: new Map<string, Model | Tool | "">(),
};

export interface EquippedFormat {
	Swords: string;
	Elixirs: string;
	Pets: string;
}

export const INITIAL_EQUIPPED = {
	Swords: "Default",
	Elixirs: "Health",
	Pets: "Dog",
};
