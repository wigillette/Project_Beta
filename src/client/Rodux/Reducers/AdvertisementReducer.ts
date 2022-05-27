import Rodux from "@rbxts/rodux";
import { GroupService, Players } from "@rbxts/services";

interface boardInfo {
	groupInfo: GroupInfo;
	isClaimed: boolean;
}

interface Action {
	type: string;
	payload?: { groupInfo: GroupInfo; isClaimed: boolean; boardKey: number };
}

export interface advertisementBoardState {
	1: boardInfo;
	2: boardInfo;
	3: boardInfo;
	4: boardInfo;
	5: boardInfo;
	6: boardInfo;
}

const swordlinkGroup = GroupService.GetGroupInfoAsync(5255599);

const initialBoardEntry: boardInfo = {
	groupInfo: swordlinkGroup,
	isClaimed: false,
};

export const advertisementReducer = Rodux.createReducer(
	{
		1: initialBoardEntry,
		2: initialBoardEntry,
		3: initialBoardEntry,
		4: initialBoardEntry,
		5: initialBoardEntry,
		6: initialBoardEntry,
	},
	{
		updateGroupInfo: (state: advertisementBoardState, action: Action) => {
			const newState = { ...state };
			if (action.payload && action.payload.boardKey in newState) {
				newState[action.payload.boardKey as keyof typeof state] = {
					groupInfo: action.payload.groupInfo,
					isClaimed: action.payload.isClaimed,
				};
			}
			return newState;
		},
	},
);
