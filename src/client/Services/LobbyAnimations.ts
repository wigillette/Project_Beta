import { Players, TweenService, Workspace } from "@rbxts/services";

const animationsFolder = Workspace.WaitForChild("LobbyAnimations");
const chests = animationsFolder.WaitForChild("Chests");
const bookStand = animationsFolder.WaitForChild("BookStand");
const book = bookStand.WaitForChild("Book") as UnionOperation;
const standardPos = bookStand.WaitForChild("StandardPos") as Part;

const LobbyAnimationsClient = {
	RunBookListener: (character: Model) => {
		const hrp = character.FindFirstChild("HumanoidRootPart") as BasePart;
		let viewing = false;
		const humanoid = character.FindFirstChildOfClass("Humanoid");
		let reset = false;
		spawn(() => {
			if (humanoid) {
				const diedConnection = humanoid.Died.Connect(() => {
					reset = true;
					diedConnection.Disconnect();
					TweenService.Create(
						book,
						new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ CFrame: new CFrame(new Vector3(175.492, 98.174, -235.684), standardPos.Position) },
					).Play();
				});
			}
			while (character && hrp && !reset) {
				if (hrp.CFrame.Position.sub(book.CFrame.Position).Magnitude < 25) {
					viewing = true;
					book.CFrame = new CFrame(book.CFrame.Position, hrp.Position.add(new Vector3(0, 15, 0)));
				} else {
					if (viewing) {
						viewing = false;
						TweenService.Create(
							book,
							new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
							{ CFrame: new CFrame(new Vector3(175.492, 98.174, -235.684), standardPos.Position) },
						).Play();
					}
				}
				wait(0.05);
			}
		});
	},
	init: () => {
		chests.GetChildren().forEach((chest) => {
			if (chest.IsA("Model")) {
				spawn(() => {
					let posCounter = 0;
					let direction = true;
					while (Players.LocalPlayer) {
						if (chest.PrimaryPart) {
							if (direction && posCounter >= 0.2) {
								direction = false;
							} else if (!direction && posCounter <= -0.2) {
								direction = true;
							}

							posCounter += (direction && 0.02) || -0.02;

							const oldCFrame = chest.GetPrimaryPartCFrame();
							chest.SetPrimaryPartCFrame(
								oldCFrame.add(new Vector3(0, posCounter, 0)).mul(CFrame.Angles(0, 0.1, 0)),
							);
							wait(0.03);
						}
					}
				});
			}
		});

		spawn(() => {
			let posCounter = 0;
			let direction = true;
			while (Players.LocalPlayer) {
				if (direction && posCounter >= 0.15) {
					direction = false;
				} else if (!direction && posCounter <= -0.15) {
					direction = true;
				}
				posCounter += (direction && 0.05) || -0.05;
				const oldCFrame = book.CFrame;
				book.CFrame = oldCFrame.add(new Vector3(0, posCounter, 0));
				wait(0.02);
			}
		});

		const character = Players.LocalPlayer.Character || Players.LocalPlayer.CharacterAdded.Wait()[0];
		LobbyAnimationsClient.RunBookListener(character);

		Players.LocalPlayer.CharacterAdded.Connect((char) => {
			wait(0.5);
			LobbyAnimationsClient.RunBookListener(char);
		});

		print("Lobby Animations Initialized | Client");
	},
};

export default LobbyAnimationsClient;
