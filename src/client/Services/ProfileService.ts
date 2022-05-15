import { KnitClient as Knit } from "@rbxts/knit";
import { PROFILE_FORMAT } from "shared/LevelInfo";
import Store from "../Rodux/Store";
const ProfileService = Knit.GetService("ProfileService");
const ProfileClient = {
	ProfileChanged: (Profile: PROFILE_FORMAT) => {
		Store.dispatch({
			type: "fetchExp",
			payload: Profile,
		});
	},
	init: () => {
		const initialProfile = ProfileService.GetProfile();
		ProfileClient.ProfileChanged(initialProfile);
		ProfileService.ProfileChanged.Connect(ProfileClient.ProfileChanged);
		print("Profile Service Initialized | Client");
	},
};

export default ProfileClient;
