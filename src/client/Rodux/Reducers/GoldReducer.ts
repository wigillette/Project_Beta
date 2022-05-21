import Rodux from "@rbxts/rodux";

export interface goldState {
	Gold: number;
	products: productFormat[];
	toggle: boolean;
}

export interface productFormat {
	Name: string;
	PriceInRobux: number;
	Description: string;
	IconImageAssetId: number;
	ProductId: number;
}

interface Action {
	type: string;
	payload?: { Gold: number; products: productFormat[] };
}

export const goldReducer = Rodux.createReducer(
	{ Gold: 500, toggle: false, products: [] as productFormat[] },
	{
		updateGold: (state: goldState, action: Action) => {
			const newState: goldState = { Gold: 500, products: state.products, toggle: state.toggle };
			if (action.payload) {
				newState.Gold = action.payload.Gold;
			}
			return newState;
		},
		toggleProducts: (state: goldState) => {
			return { Gold: state.Gold, products: state.products, toggle: !state.toggle };
		},
		fetchProducts: (state: goldState, action: Action) => {
			const newState: goldState = state;
			if (action.payload) {
				newState.products = action.payload.products;
			}
			return newState;
		},
	},
);
