import { ReplicatedStorage } from "@rbxts/services";

export interface InventoryFormat {
	Swords: Map<string, Model | Tool | "">;
	Elixirs: Map<string, Model | Tool | "">;
	Pets: Map<string, Model | Tool | "">;
}

const swordInitial = new Map<string, Model | Tool | "">();
const modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder");
swordInitial.set("Default", modelsFolder.WaitForChild("Default") as Model);

export const INITIAL_INVENTORY = {
	Swords: swordInitial,
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
	Elixirs: "",
	Pets: "",
};
