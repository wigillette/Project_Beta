import Object from "@rbxts/object-utils";

export interface InventoryFormat {
	Swords: Map<string, number>;
	Elixirs: Map<string, number>;
	Pets: Map<string, number>;
}

const swordInitial = new Map<string, number>();
swordInitial.set("Default", 1);

export const INITIAL_INVENTORY = {
	Swords: swordInitial,
	Elixirs: new Map<string, number>(),
	Pets: new Map<string, number>(),
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

export const flattenInventory = (inventory: Map<string, number>) => {
	const items: string[] = [];

	Object.entries(inventory).forEach((item) => {
		for (let i = 0; i < item[1]; i++) {
			items.push(item[0]);
		}
	});

	return items;
};

export const hasSelectedMax = (selected: string[], item: string, inventory: Map<string, number>) => {
	const multiplicity = inventory.get(item);
	let selectedMax = true;
	if (multiplicity !== undefined) {
		const swordsSelected = selected.filter((selection) => {
			return selection === item;
		});
		selectedMax = swordsSelected.size() >= multiplicity;
	}
	return selectedMax;
};
