import Rodux from "@rbxts/rodux";

interface Action {
	type: string;
	payload?: {
		player1Selected: string[];
		player2Selected: string[];
		player1Inventory: Map<string, number>;
		player2Inventory: Map<string, number>;
		requests: Player[];
		playerList: Player[];
		player2Confirmation: boolean;
		player2: Player | undefined;
	};
}

export interface tradingState {
	player1Selected: string[];
	player2Selected: string[];
	player1Inventory: Map<string, number>;
	player2Inventory: Map<string, number>;
	requests: Player[];
	playerList: Player[];
	requestsToggle: boolean;
	tradingToggle: boolean;
	player2Confirmation: boolean;
	player2: Player | undefined;
}

export const tradingReducer = Rodux.createReducer(
	{
		player1Selected: [] as string[],
		player2Selected: [] as string[],
		player1Inventory: new Map<string, number>(),
		player2Inventory: new Map<string, number>(),
		requests: [] as Player[],
		playerList: [] as Player[],
		requestsToggle: false,
		tradingToggle: false,
		player2Confirmation: false,
		player2: undefined as Player | undefined,
	},
	{
		startTrade: (state: tradingState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.player1Inventory = action.payload.player1Inventory;
				newState.player2Inventory = action.payload.player2Inventory;
				newState.requestsToggle = false;
				newState.tradingToggle = true;
				newState.player2 = action.payload.player2;
			}
			return newState;
		},
		endTrade: (state: tradingState, action: Action) => {
			const newState = { ...state };
			newState.requestsToggle = true;
			newState.tradingToggle = false;
			newState.player1Selected = [];
			newState.player2Selected = [];
			newState.player1Inventory = new Map<string, number>();
			newState.player2Inventory = new Map<string, number>();
			return newState;
		},
		updateRequests: (state: tradingState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.requests = action.payload.requests;
			}
			return newState;
		},
		updateTradePlayers: (state: tradingState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.playerList = action.payload.playerList;
			}
			return newState;
		},
		updateSelection: (state: tradingState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.player1Selected = action.payload.player1Selected;
				newState.player2Selected = action.payload.player2Selected;
			}
			return newState;
		},
		toggleRequests: (state: tradingState, action: Action) => {
			const newState = { ...state };
			if (newState.tradingToggle) {
				newState.tradingToggle = false;
				newState.requestsToggle = false;
			} else {
				newState.requestsToggle = !newState.requestsToggle;
			}
			return newState;
		},
		updateConfirmation: (state: tradingState, action: Action) => {
			const newState = { ...state };
			if (action.payload) {
				newState.player2Confirmation = action.payload.player2Confirmation;
			}
			return newState;
		},
	},
);
