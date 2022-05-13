export interface InventoryFormat {
	Swords: Map<string, Model | Tool | "">;
}

export const INITIAL_INVENTORY = {
	Swords: new Map<string, Model | Tool | "">(),
};

export interface EquippedFormat {
	Swords: string;
}

export const INITIAL_EQUIPPED = {
	Swords: "Default",
};
