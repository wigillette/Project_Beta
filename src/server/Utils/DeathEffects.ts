import { Player } from "@rbxts/knit/Knit/KnitClient";
import { ReplicatedStorage, TweenService, Workspace } from "@rbxts/services";

const deathEffectsFolder = ReplicatedStorage.WaitForChild("DeathEffects");

// Death Effect General Functions
const addParticles = (char: Model, particles: ParticleEmitter) => {
	if (char) {
		char.GetChildren().forEach((Child) => {
			if (Child.IsA("Part")) {
				particles.Clone().Parent = Child;
			}
		});
	}
};

const stripCharacterAssets = (char: Model) => {
	if (char) {
		char.GetChildren().forEach((Child) => {
			if (Child.IsA("Accessory") || Child.IsA("Shirt") || Child.IsA("Pants")) {
				Child.Destroy();
			}
		});
	}
};

const tweenChracterColor = (char: Model, color: Color3) => {
	if (char) {
		char.GetChildren().forEach((Child) => {
			const childPart = Child.FindFirstChildOfClass("Part");
			if (Child.IsA("Part")) {
				TweenService.Create(
					Child,
					new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ Color: color },
				).Play();
			} else if (childPart) {
				TweenService.Create(
					childPart,
					new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ Color: color },
				).Play();
			}
		});
	}
};

const hideCharacter = (char: Model) => {
	if (char) {
		char.GetChildren().forEach((Child) => {
			const childPart = Child.FindFirstChildOfClass("Part");
			if (Child.IsA("Part")) {
				Child.Transparency = 1;
			} else if (childPart) {
				childPart.Transparency = 1;
			}
		});
	}
};

const addItems = (model: Model, appear: Model) => {
	appear.GetChildren().forEach((Child) => {
		Child.Parent = model;
	});
};

const playAnimation = (char: Model, killerSword: string) => {
	const hum = char.FindFirstChildOfClass("Humanoid");
	if (hum) {
		const animationObject = deathEffectsFolder.FindFirstChild(killerSword) as Animation;
		if (animationObject) {
			const animation = hum.LoadAnimation(animationObject);
			animation.Priority = Enum.AnimationPriority.Action;
			const hrp = char.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				hrp.Anchored = true;
			}
			animation.Play();
			animation.KeyframeReached.Connect((keyFrame) => {
				if (keyFrame === "Pause") {
					animation.AdjustSpeed(0);
				}
			});
		}
	}
};

export const DEATH_FUNCTIONS = {
	Default: (victim: Player) => {},
	Cupid: (victim: Player) => {
		const particles = deathEffectsFolder.FindFirstChild("CupidParticles") as Folder;
		if (particles && victim) {
			particles.GetChildren().forEach((Child) => {
				if (victim.Character) {
					addParticles(victim.Character, Child as ParticleEmitter);
				}
			});
		}
	},
	Fortune: (victim: Player) => {
		if (victim && victim.Character) {
			hideCharacter(victim.Character);
			const pot = deathEffectsFolder.FindFirstChild("Pot") as UnionOperation;
			if (pot) {
				const potModel = pot.Clone();
				const torso = victim.Character.FindFirstChild("Torso") as Part;
				if (torso) {
					potModel.Parent = Workspace;
					potModel.CFrame = torso.CFrame;

					const tweenInfo = new TweenInfo(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
					TweenService.Create(potModel, tweenInfo, { Transparency: 0 }).Play();
					wait(0.5);
					TweenService.Create(potModel, tweenInfo, { Transparency: 1 }).Play();
					wait(0.5);
					potModel.Destroy();
				}
			}
		}
	},
	Teargas: (victim: Player) => {
		const particles = deathEffectsFolder.FindFirstChild("Teargas");
		if (particles && victim && victim.Character) {
			addParticles(victim.Character, particles as ParticleEmitter);
		}
	},
	Illumina: (victim: Player) => {
		if (victim && victim.Character) {
			const fire = deathEffectsFolder.FindFirstChild("IlluminaFire");
			if (fire) {
				victim.Character.GetChildren().forEach((child) => {
					const childPart = child.FindFirstChildOfClass("Part");
					if (child.IsA("Part")) {
						fire.Clone().Parent = child;
					} else if (childPart) {
						fire.Clone().Parent = childPart;
					}
				});
				wait(0.6);
				const tweenInfo = new TweenInfo(0.6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
				victim.Character.GetChildren().forEach((child) => {
					const childPart = child.FindFirstChildOfClass("Part");
					if (child.IsA("Part")) {
						TweenService.Create(child, tweenInfo, {
							CFrame: child.CFrame.add(new Vector3(0, 5, 0)),
						}).Play();
						TweenService.Create(child, tweenInfo, { Transparency: 1 }).Play();
					} else if (childPart) {
						TweenService.Create(childPart, tweenInfo, {
							CFrame: childPart.CFrame.add(new Vector3(0, 5, 0)),
						}).Play();
						TweenService.Create(childPart, tweenInfo, { Transparency: 1 }).Play();
					}
				});
			}
		}
	},
};
