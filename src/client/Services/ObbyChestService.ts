import { KnitClient as Knit } from "@rbxts/knit";
import { TweenService, Workspace } from "@rbxts/services";
const ObbyChestService = Knit.GetService("ObbyChestService");

const CHEST_MODELS = {
	Halfway: Workspace.WaitForChild("HalfWayChest", 10) as Model,
	Full: Workspace.WaitForChild("FullChest", 10) as Model,
};

const ObbyChestClient = {
	HideChest(chestModel: Model) {
		coroutine.wrap(() => {
			chestModel.GetDescendants().forEach((descendant) => {
				if (descendant.IsA("Part")) {
					TweenService.Create(
						descendant,
						new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ Transparency: 1 },
					).Play();
				}
			});
			wait(1);
			chestModel.Destroy();
		})();
	},

	init() {
		ObbyChestService.HideChest.Connect((chestType: string) => {
			if (chestType in CHEST_MODELS) {
				const chestModel = CHEST_MODELS[chestType as keyof typeof CHEST_MODELS];
				if (chestModel) {
					ObbyChestClient.HideChest(chestModel);
				}
			}
		});
		print("ObbyChest Service Initialized | Client");
	},
};

export default ObbyChestClient;
