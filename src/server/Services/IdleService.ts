import { KnitServer as Knit, RemoteSignal } from "@rbxts/knit";

declare global {
	interface KnitServices {
		IdleService: typeof IdleService;
	}
}

const IdleService = Knit.CreateService({
	Name: "IdleService",

	Client: {
		SendIdleEvent(client: Player, isAFK: boolean) {
			const material = (isAFK && Enum.Material.ForceField) || Enum.Material.Plastic;
			this.Server.UpdateState(client, material);
		},
		UpdatePing() {
			return this.Server.UpdatePing();
		},
	},

	UpdateState(player: Player, material: Enum.Material) {
		if (player.Character) {
			const hrp = player.Character.FindFirstChild("HumanoidRootPart") as Part;
			const current = hrp.CFrame;
			player.Character.GetChildren().forEach((child) => {
				if (child.IsA("BasePart") && child !== undefined) {
					child.Material = material;
				} else {
					if (child.IsA("Accessory")) {
						const handle = child.FindFirstChild("Handle") as Part;
						if (handle) {
							handle.BrickColor = new BrickColor("White");
							handle.Material = material;
						}
					}
				}
			});

			wait(0.5);
			if (current !== hrp.CFrame) {
				this.UpdateState(player, Enum.Material.Plastic);
			}
		}
	},

	UpdatePing() {
		return true;
	},

	KnitInit() {
		print("Idle Service Initialized | Server");
	},
});

export default IdleService;
