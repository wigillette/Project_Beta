import { SoundService, StarterGui } from "@rbxts/services";
import { KnitClient as Knit } from "@rbxts/knit";
import { googleMaterial } from "client/UIProperties/ColorSchemes";
const MusicService = Knit.GetService("MusicService");

const SFXFolder = SoundService.WaitForChild("SFX");
let currentCategory: string | undefined = undefined;
let currentlyPlaying: Sound | undefined = undefined;

const MusicClient = {
	ChangeMusic(categoryName: string) {
		const songFolder = SFXFolder.FindFirstChild(categoryName);
		currentCategory = categoryName;

		if (songFolder) {
			if (currentlyPlaying) {
				currentlyPlaying.Stop();
				const lobbyFolder = SFXFolder.FindFirstChild("Lobby");
				const matchFolder = SFXFolder.FindFirstChild("Match");
				if (lobbyFolder && matchFolder) {
					lobbyFolder.GetChildren().forEach((song) => {
						if (song.IsA("Sound") && song.IsPlaying) {
							song.Stop();
						}
					});
					matchFolder.GetChildren().forEach((song) => {
						if (song.IsA("Sound") && song.IsPlaying) {
							song.Stop();
						}
					});
				}
			}

			coroutine.wrap(() => {
				let choices = [...songFolder.GetChildren()];

				while (currentCategory === categoryName) {
					if (choices.size() === 0) {
						choices = [...songFolder.GetChildren()];
					}
					const songIndex = math.floor(math.random() * choices.size());
					const randomSong = choices[songIndex] as Sound;
					choices.remove(songIndex);
					currentlyPlaying = randomSong;
					randomSong.Play();
					while (currentCategory === categoryName && randomSong.IsPlaying) {
						wait(1);
					}
				}
			})();
		}
	},
	init() {
		MusicClient.ChangeMusic("Lobby");
		MusicService.ChangeMusic.Connect((categoryName: string) => {
			MusicClient.ChangeMusic(categoryName);
		});

		print("Music Service Initialized | Client");
	},
};

export default MusicClient;
