import { KnitClient as Knit } from "@rbxts/knit";
import { GroupService } from "@rbxts/services";
import store from "client/Rodux/Store";
const AdvertisementService = Knit.GetService("AdvertisementService");

const ChatClient = {
	UpdateBoards(boardKey: number, isClaimed: boolean, groupId: number) {
		store.dispatch({
			type: "updateGroupInfo",
			payload: { groupInfo: GroupService.GetGroupInfoAsync(groupId), isClaimed: isClaimed, boardKey: boardKey },
		});
	},
	init() {
		print("Advertisement Service Initialized | Client");
		AdvertisementService.UpdateBoards.Connect((groupId: number, isClaimed: boolean, boardKey: number) => {
			this.UpdateBoards(boardKey, isClaimed, groupId);
		});
	},
};

export default ChatClient;
