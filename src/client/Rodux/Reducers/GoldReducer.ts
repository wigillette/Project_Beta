import Rodux from "@rbxts/rodux";

export interface goldState {
	Gold: number;
	items: itemsFormat;
	toggle: boolean;
	currentTab: "products" | "gamepasses";
}

export interface productFormat {
	Name: string;
	PriceInRobux: number;
	Description?: string;
	IconImageAssetId: number;
	ProductId?: number;
	AssetId?: number;
}

export interface itemsFormat {
	products: productFormat[];
	gamepasses: [number, AssetProductInfo][];
}

interface Action {
	type: string;
	payload?: { Gold: number; items: itemsFormat; tabName: string };
}

const initialProducts = {
	products: [] as productFormat[],
	gamepasses: [] as [number, AssetProductInfo][],
};

export const goldReducer = Rodux.createReducer(
	{ Gold: 0, toggle: false, items: initialProducts, currentTab: "products" as keyof typeof initialProducts },
	{
		updateGold: (state: goldState, action: Action) => {
			const newState: goldState = {
				Gold: 0,
				items: state.items,
				toggle: state.toggle,
				currentTab: state.currentTab,
			};
			if (action.payload) {
				newState.Gold = action.payload.Gold;
			}
			return newState;
		},
		toggleProducts: (state: goldState) => {
			return {
				Gold: state.Gold,
				items: state.items,
				toggle: !state.toggle,
				currentTab: state.currentTab as keyof typeof initialProducts,
			};
		},
		switchGoldTab: (state: goldState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				if (action.payload.tabName in initialProducts) {
					newState.currentTab = action.payload.tabName as keyof typeof initialProducts;
				}
			}
			return newState;
		},
		fetchProducts: (state: goldState, action: Action) => {
			const newState: goldState = state;
			newState.currentTab = newState.currentTab as keyof typeof initialProducts;
			if (action.payload) {
				newState.items = action.payload.items;
			}
			return newState;
		},
	},
);
