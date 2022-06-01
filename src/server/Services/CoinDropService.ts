import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";
import { Players, ReplicatedStorage, SoundService, TweenService, Workspace } from "@rbxts/services";
import { GoldService } from "./GoldService";

declare global {
	interface KnitServices {
		CoinDropService: typeof CoinDropService;
	}
}

const CoinDropService = Knit.CreateService({
	Name: "CoinDropService",
	CoinModel: ReplicatedStorage.WaitForChild("Instances").WaitForChild("Coin") as Model,
	Upstairs: [[175.21, 191.213], 95.648, [-297.796, -251.591]],
	Downstairs: [[215.383, 236.636], 75, [-318.934, -221.325]],

	Client: {
		PlayCoinSound: new RemoteSignal<() => void>(),
	},

	SpawnCoin() {
		const newCoin = this.CoinModel.Clone();
		if (newCoin.PrimaryPart) {
			const upstairs = math.floor(math.random() * 2) === 1;
			let randX;
			let Y;
			let randZ;
			if (upstairs) {
				const xValues = this.Upstairs[0] as number[];
				randX = math.random() * (xValues[1] - xValues[0]) + xValues[0];
				Y = this.Upstairs[1] as number;
				const zValues = this.Upstairs[2] as number[];
				randZ = math.random() * (zValues[1] - zValues[0]) + zValues[0];
			} else {
				const xValues = this.Downstairs[0] as number[];
				randX = math.random() * (xValues[1] - xValues[0]) + xValues[0];
				Y = this.Downstairs[1] as number;
				const zValues = this.Downstairs[2] as number[];
				randZ = math.random() * (zValues[1] - zValues[0]) + zValues[0];
			}

			newCoin.Parent = Workspace;
			newCoin.SetPrimaryPartCFrame(new CFrame(new Vector3(randX, Y, randZ)));
			TweenService.Create(
				newCoin.PrimaryPart,
				new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
				{ Transparency: 0 },
			).Play();

			let collected = false;

			spawn(() => {
				while (!collected && Players.GetPlayers().size() > 0) {
					if (newCoin.PrimaryPart) {
						const oldCFrame = newCoin.GetPrimaryPartCFrame();
						newCoin.SetPrimaryPartCFrame(oldCFrame.mul(CFrame.Angles(0, 0.05, 0)));
					}
					wait(0.02);
				}
			});

			const connection = newCoin.PrimaryPart.Touched.Connect((hit) => {
				if (hit.Parent) {
					const humanoid = hit.Parent.FindFirstChildOfClass("Humanoid");
					if (humanoid) {
						const player = Players.GetPlayerFromCharacter(hit.Parent);
						if (player) {
							connection.Disconnect();
							this.Client.PlayCoinSound.Fire(player);
							GoldService.AddGold(player, 5);
							if (newCoin.PrimaryPart) {
								TweenService.Create(
									newCoin.PrimaryPart,
									new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
									{ Transparency: 1 },
								).Play();
							}
							collected = true;
							spawn(() => {
								wait(0.5);
								newCoin.Destroy();
								wait(30);
								this.SpawnCoin();
							});
						}
					}
				}
			});
		}
		newCoin.Parent;
	},

	KnitInit() {
		spawn(() => {
			while (Players.GetPlayers().size() <= 0) {
				wait(0.05);
			}
			this.SpawnCoin();
		});

		print("Coin Drop Service Initialized | Server");
	},
});

export default CoinDropService;
