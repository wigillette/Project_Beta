import { KnitClient as Knit } from "@rbxts/knit";
import { SoundService } from "@rbxts/services";
import { PROFILE_FORMAT } from "shared/LevelInfo";
import Store from "../Rodux/Store";
const ProfileService = Knit.GetService("ProfileService");
const sfxFolder = SoundService.WaitForChild("SFX");
const levelUp = sfxFolder.WaitForChild("LevelUp") as Sound;

const ProfileClient = {
	ProfileChanged: (Profile: PROFILE_FORMAT) => {
		Store.dispatch({
			type: "fetchExp",
			payload: Profile,
		});
	},
	PlayLevelUpSFX: () => {
		levelUp.Play();
	},
	init: () => {
		const initialProfile = ProfileService.GetProfile();
		ProfileClient.ProfileChanged(initialProfile);
		ProfileService.ProfileChanged.Connect(ProfileClient.ProfileChanged);
		print("Profile Service Initialized | Client");
	},
};

export default ProfileClient;
