import { Players, StarterGui } from "@rbxts/services";
import { KnitClient as Knit } from "@rbxts/knit";
import { googleMaterial } from "client/UIProperties/ColorSchemes";
import store from "client/Rodux/Store";
const DatabaseService = Knit.GetService("DatabaseService");

interface SortingFormat {
	GlobalDonations: (string | number)[][];
	MonthlyDonations: (string | number)[][];
	GlobalWins: (string | number)[][];
	MonthlyWins: (string | number)[][];
	GlobalKills: (string | number)[][];
	MonthlyKills: (string | number)[][];
}

const ODSClient = {
	FetchData(data: SortingFormat) {
		store.dispatch({
			type: "fetchODSData",
			payload: {
				globalDonationsData: data.GlobalDonations,
				globalKillData: data.GlobalKills,
				globalWinsData: data.GlobalWins,
				monthlyDonationsData: data.MonthlyDonations,
				monthlyKillData: data.MonthlyKills,
				monthlyWinsData: data.MonthlyWins,
			},
		});
	},
	FindFirstMatchingAttachment(model: Instance, name: string) {
		let toReturn = undefined;
		model.GetDescendants().forEach((child) => {
			if (child.IsA("Attachment") && child.Name === name) {
				toReturn = child;
			}
		});

		return toReturn;
	},
	WeldAttachments(attach1: Attachment, attach2: Attachment) {
		let toReturn: Weld | undefined = undefined;
		if (attach1.Parent && attach2.Parent) {
			const weld = new Instance("Weld");
			weld.Part0 = attach1.Parent as BasePart;
			weld.Part1 = attach2.Parent as BasePart;
			weld.C0 = attach1.CFrame;
			weld.C1 = attach2.CFrame;
			weld.Parent = attach1.Parent;
			toReturn = weld;
		}
		return toReturn;
	},
	CleanUpMVP(mvpModel: Model) {
		mvpModel.GetChildren().forEach((child) => {
			if (child.IsA("Shirt") || child.IsA("Pants") || child.IsA("Accessory") || child.IsA("CharacterMesh")) {
				child.Destroy();
			}
		});
	},
	UpdateMVP(mvpModel: Model, mvpUserId: number) {
		pcall(() => {
			coroutine.wrap(() => {
				const info = Players.GetCharacterAppearanceAsync(mvpUserId);
				ODSClient.CleanUpMVP(mvpModel);

				info.GetChildren().forEach((child) => {
					if (
						child.IsA("Shirt") ||
						child.IsA("Pants") ||
						child.IsA("BodyColors") ||
						child.IsA("CharacterMesh")
					) {
						child.Parent = mvpModel;
					} else if (child.IsA("Accessory")) {
						const handle = child.FindFirstChild("Handle") as Part;
						if (handle) {
							const accoutrementAttachment = handle.FindFirstChildOfClass("Attachment");
							if (accoutrementAttachment) {
								const characterAttachment = this.FindFirstMatchingAttachment(
									mvpModel,
									accoutrementAttachment.Name,
								);
								if (characterAttachment !== undefined) {
									ODSClient.WeldAttachments(characterAttachment, accoutrementAttachment);
									child.Parent = mvpModel;
								}
							}
						}
					}
				});

				const mvpHead = mvpModel.FindFirstChild("Head", true) as Part;
				if (mvpHead) {
					const face = info.FindFirstChild("face", true) as Decal;
					if (face) {
						face.Clone().Parent = mvpHead;
					}
				}

				mvpModel.Name = Players.GetNameFromUserIdAsync(mvpUserId);
			})();
		});
	},
	init() {
		DatabaseService.GetAllSortingDataPromise()
			.then((data) => {
				ODSClient.FetchData(data);
			})
			.catch((err) => {
				print(err);
			});

		DatabaseService.UpdateSortingData.Connect((sortingTables: SortingFormat) => {
			ODSClient.FetchData(sortingTables);
		});
		print("ODS Service Initialized | Client");
	},
};

export default ODSClient;
