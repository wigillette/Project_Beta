import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players } from "@rbxts/services";

declare global {
	interface KnitServices {
		MusicService: typeof MusicService;
	}
}

const MusicService = Knit.CreateService({
	Name: "MusicService",

	Client: {
		ChangeMusic: new RemoteSignal<(songName: string) => void>(),
	},

	ChangeMusic(participants: Player[], songName: string) {
		participants.forEach((participant: Player) => {
			this.Client.ChangeMusic.Fire(participant, songName);
		});
	},

	KnitInit() {
		print("Music Service Initialized | Server");
	},
});

export default MusicService;
