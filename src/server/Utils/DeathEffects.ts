import { ReplicatedStorage, TweenService, Workspace, Players, Debris, InsertService } from "@rbxts/services";

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

const tweenCharacterColor = (char: Model, color: Color3) => {
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

// Death Effect Functions
export const DEATH_FUNCTIONS = {
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
	Frostbite: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
				newChar.Name = victim.Name;
				addItems(newChar, Players.GetCharacterAppearanceAsync(victim.UserId));

				newChar.Parent = Workspace;
				newChar.SetPrimaryPartCFrame(hrp.CFrame);
				hideCharacter(victim.Character);

				stripCharacterAssets(newChar);
				tweenCharacterColor(newChar, new BrickColor("Baby blue").Color);

				const iceCube = deathEffectsFolder.FindFirstChild("Ice") as Part;
				if (iceCube) {
					const newIceCube = iceCube.Clone();
					newIceCube.Parent = Workspace;
					newIceCube.CFrame = new CFrame(hrp.Position);
					playAnimation(newChar, "Frostbite");

					TweenService.Create(
						iceCube,
						new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ Size: new Vector3(6, 8, 6) },
					).Play();
					wait(1);
					TweenService.Create(
						iceCube,
						new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ Transparency: 1 },
					).Play();

					wait(0.4);
					iceCube.Destroy();
					newChar.Destroy();
				}
			}
		}
	},
	Ghostwalker: (victim: Player) => {
		if (victim && victim.Character) {
			const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
			newChar.Name = victim.Name;
			addItems(newChar, Players.GetCharacterAppearanceAsync(victim.UserId));
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;

			if (hrp) {
				newChar.Parent = Workspace;
				newChar.SetPrimaryPartCFrame(hrp.CFrame);
				hideCharacter(victim.Character);

				tweenCharacterColor(newChar, new BrickColor("Bright green").Color);
				const tweenInfo = new TweenInfo(0.3, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out, 0, false, 0);
				newChar.GetChildren().forEach((child) => {
					const childPart = child.FindFirstChildOfClass("Part");
					if (child.IsA("Part") && child.Name !== "HumanoidRootPart") {
						TweenService.Create(child, tweenInfo, { Transparency: 0.6 }).Play();
					} else if (childPart) {
						TweenService.Create(childPart, tweenInfo, { Transparency: 0.6 }).Play();
					} else if (child.IsA("Shirt") || child.IsA("Pants")) {
						Debris.AddItem(child, 0.3);
					}
				});

				playAnimation(newChar, "Levitation");

				wait(1);
				newChar.GetChildren().forEach((child) => {
					const childPart = child.FindFirstChildOfClass("Part");
					if (child.IsA("Part") && child.Name !== "HumanoidRootPart") {
						TweenService.Create(child, tweenInfo, { Transparency: 1 }).Play();
					} else if (childPart) {
						TweenService.Create(childPart, tweenInfo, { Transparency: 1 }).Play();
					}
				});
				wait(1);
				newChar.Destroy();
			}
		}
	},
	Darkheart: (victim: Player) => {
		if (victim && victim.Character) {
			const hum = victim.Character.FindFirstChildOfClass("Humanoid");
			stripCharacterAssets(victim.Character);
			tweenCharacterColor(victim.Character, new BrickColor("Black").Color);

			victim.Character.GetChildren().forEach((child) => {
				if (child.IsA("Part")) {
					child.Anchored = true;
				}
			});

			wait(0.25);

			victim.Character.GetChildren().forEach((child) => {
				if (child.IsA("Part")) {
					const v = new Instance("BodyVelocity");
					v.Velocity = new Vector3(math.random() - 0.5, 0, math.random() - 0.5).Unit.mul(2).mul(40);
					v.MaxForce = new Vector3(1, 1, 1).mul(1e5);
					v.Parent = child;
					child.Anchored = false;
				}
			});
		}
	},
	Firebrand: (victim: Player) => {
		if (victim && victim.Character) {
			stripCharacterAssets(victim.Character);
			victim.Character.GetChildren().forEach((child) => {
				if (child.IsA("Part")) {
					child.BrickColor = new BrickColor("Black");
					new Instance("Fire", child);
				}
			});
		}
	},
	Venomshank: (victim: Player) => {
		if (victim && victim.Character) {
			tweenCharacterColor(victim.Character, new BrickColor("Slime green").Color);
			const poisonParticles = deathEffectsFolder.FindFirstChild("Poison") as ParticleEmitter;
			if (poisonParticles) {
				addParticles(victim.Character, poisonParticles);
			}
		}
	},
	Faerie: (victim: Player) => {
		if (victim.Character) {
			hideCharacter(victim.Character);
			const faerieParticles = deathEffectsFolder.FindFirstChild("Faerie") as ParticleEmitter;
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart");
			if (faerieParticles && hrp) {
				faerieParticles.Clone().Parent = hrp;
			}
		}
	},
	Falchion: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
				newChar.Name = victim.Name;
				addItems(newChar, Players.GetCharacterAppearanceAsync(victim.UserId));
				newChar.Parent = Workspace;
				newChar.SetPrimaryPartCFrame(hrp.CFrame);

				const discoBall = deathEffectsFolder.FindFirstChild("FalchionDisco") as Model;
				if (discoBall) {
					const newDiscoBall = discoBall.Clone();
					newDiscoBall.Parent = Workspace;
					newDiscoBall.SetPrimaryPartCFrame(new CFrame(hrp.Position).add(new Vector3(0, 15, 0)));
					playAnimation(newChar, "Falchion");
					wait(3);
					discoBall.Destroy();
					newChar.Destroy();
				}
			}
		}
	},
	Lightbringer: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
				newChar.Name = victim.Name;
				addItems(newChar, Players.GetCharacterAppearanceAsync(victim.UserId));
				newChar.Parent = Workspace;
				newChar.SetPrimaryPartCFrame(hrp.CFrame);
				hideCharacter(newChar);

				stripCharacterAssets(newChar);

				newChar.GetChildren().forEach((child) => {
					if (child.IsA("Part") && child.Name !== "HumanoidRootPart") {
						TweenService.Create(
							child,
							new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
							{ Color: new BrickColor("White").Color },
						).Play();
						child.Material = Enum.Material.Neon;
						const lightbringerLight = deathEffectsFolder.FindFirstChild("LightbringerLight");
						const light = deathEffectsFolder.FindFirstChild("Light");
						if (lightbringerLight && light) {
							lightbringerLight.Clone().Parent = child;
							light.Clone().Parent = child;
						}
					}
				});

				playAnimation(newChar, "Lightbringer");
				wait(1);
				newChar.GetChildren().forEach((child) => {
					if (child.IsA("Part")) {
						const particleEmitter = child.FindFirstChildOfClass("ParticleEmitter");
						const surfaceLight = child.FindFirstChildOfClass("SurfaceLight");
						TweenService.Create(
							child,
							new TweenInfo(0.35, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out, 0, false, 0),
							{ Transparency: 1 },
						).Play();
						if (particleEmitter) {
							Debris.AddItem(particleEmitter, 0.3);
						} else if (surfaceLight) {
							Debris.AddItem(surfaceLight, 0.3);
						}
					}
				});

				wait(2);
				newChar.Destroy();
			}
		}
	},
	Abyss: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const hrpCFrame = hrp.CFrame;
				hrp.Anchored = true;
				tweenCharacterColor(victim.Character, Color3.fromRGB(0, 0, 0));
				victim.Character.GetChildren().forEach((child) => {
					const childPart = child.FindFirstChildOfClass("Part");
					if (child.IsA("Part")) {
						coroutine.wrap(() => {
							for (let i = 0; i < 30; i++) {
								child.CFrame = child.CFrame.Lerp(hrpCFrame, i / 30);
								wait();
							}
						})();
						TweenService.Create(
							child,
							new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
							{ Transparency: 1 },
						).Play();
					} else if (childPart) {
						coroutine.wrap(() => {
							for (let i = 0; i < 30; i++) {
								childPart.CFrame = childPart.CFrame.Lerp(hrpCFrame, i / 30);
								wait();
							}
						})();
						TweenService.Create(
							childPart,
							new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
							{ Transparency: 1 },
						);
					}
				});
			}
		}
	},
	Windforce: (victim: Player) => {
		if (victim && victim.Character) {
			const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
			addItems(newChar, Players.GetCharacterAppearanceAsync(victim.UserId));
			newChar.Parent = Workspace;
			newChar.Name = victim.Name;
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				newChar.SetPrimaryPartCFrame(hrp.CFrame);
				hideCharacter(victim.Character);
				playAnimation(newChar, "Windforce");
				wait(1.5);
				newChar.Destroy();
			}
		}
	},
	Moonslayer: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
				addItems(newChar, Players.GetCharacterAppearanceAsync(victim.UserId));
				newChar.Parent = Workspace;
				newChar.Name = victim.Name;
				newChar.SetPrimaryPartCFrame(hrp.CFrame);
				hideCharacter(victim.Character);
				stripCharacterAssets(newChar);
				tweenCharacterColor(newChar, new BrickColor("White").Color);
				const lightbringerLight = deathEffectsFolder.FindFirstChild("LightbringerLight");
				if (lightbringerLight) {
					newChar.GetChildren().forEach((child) => {
						if (child.IsA("Part")) {
							lightbringerLight.Clone().Parent = child;
						}
					});
					playAnimation(newChar, "Moonslayer");
					wait(1);
					newChar.Destroy();
				}
			}
		}
	},
	Colossal: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
				addItems(newChar, Players.GetCharacterAppearanceAsync(victim.UserId));
				newChar.Parent = Workspace;
				newChar.Name = victim.Name;
				newChar.SetPrimaryPartCFrame(hrp.CFrame);
				hideCharacter(victim.Character);
				stripCharacterAssets(newChar);
				tweenCharacterColor(newChar, new BrickColor("Black").Color);

				const blackHole = deathEffectsFolder.FindFirstChild("Abyss") as Part;
				if (blackHole) {
					const newBlackHole = blackHole.Clone();
					newBlackHole.Parent = Workspace;
					newBlackHole.CFrame = new CFrame(hrp.Position.add(new Vector3(0, -2, 0)));
					TweenService.Create(
						blackHole,
						new TweenInfo(0.5, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out, 0, false, 0),
						{ Size: new Vector3(10, 0.1, 10) },
					).Play();
					playAnimation(newChar, "Colossal");
					wait(1);
					newChar.GetChildren().forEach((child) => {
						const handle = child.FindFirstChild("Handle") as Part;
						if (child.IsA("Part")) {
							child.Transparency = 1;
						} else if (handle) {
							handle.Transparency = 1;
						}
					});

					TweenService.Create(
						blackHole,
						new TweenInfo(0.4, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out, 0, false, 0),
						{ Size: new Vector3(0, 0.05, 0) },
					).Play();
					wait(0.4);
					blackHole.Destroy();
					newChar.Destroy();
				}
			}
		}
	},
	Starlight: (victim: Player) => {
		if (victim && victim.Character) {
			const meteor = deathEffectsFolder.FindFirstChild("Meteor") as Part;
			const torso = victim.Character.FindFirstChild("Torso") as Part;
			if (meteor && torso) {
				meteor.Parent = Workspace;
				meteor.CFrame = new CFrame(torso.Position.add(new Vector3(0, 30, 0)));
				TweenService.Create(
					meteor,
					new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ CFrame: new CFrame(torso.Position) },
				).Play();
				wait(0.4);
				const blast = deathEffectsFolder.FindFirstChild("Blast") as Part;
				if (blast) {
					const newBlast = blast.Clone();
					newBlast.Parent = Workspace;
					newBlast.CFrame = new CFrame(torso.Position);

					TweenService.Create(
						newBlast,
						new TweenInfo(0.6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, true, 0),
						{ Size: new Vector3(30, 30, 30) },
					).Play();
					TweenService.Create(
						newBlast,
						new TweenInfo(0.5, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, true, 0),
						{ Transparency: 1 },
					).Play();

					stripCharacterAssets(victim.Character);
					tweenCharacterColor(victim.Character, new BrickColor("Black").Color);

					victim.Character.GetChildren().forEach((child) => {
						if (child.IsA("Part")) {
							new Instance("Fire", child);
						}
					});

					wait(1.5);
					blast.Destroy();
					meteor.Destroy();
				}
			}
		}
	},
	Splosion: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const bomb = deathEffectsFolder.FindFirstChild("Bomb") as Part;
				if (bomb) {
					const newBomb = bomb.Clone();
					newBomb.Parent = Workspace;
					newBomb.CFrame = new CFrame(hrp.Position.add(new Vector3(0, 8, 0)));
					wait(0.6);
					const explosion = new Instance("Explosion");
					explosion.BlastPressure = 5;
					explosion.DestroyJointRadiusPercent = 0;
					explosion.Parent = Workspace;
					explosion.Position = hrp.Position;
					wait(0.3);
					bomb.Destroy();
				}
			}
		}
	},
	"4D": (victim: Player) => {
		if (victim && victim.Character) {
			stripCharacterAssets(victim.Character);
			tweenCharacterColor(victim.Character, new BrickColor("Black").Color);
			victim.Character.GetChildren().forEach((child) => {
				if (child.IsA("Part") && child.Name !== "HumanoidRootPart") {
					const sbox = new Instance("SelectionBox");
					sbox.LineThickness = 0.1;
					sbox.Color3 = new BrickColor("Baby blue").Color;
					sbox.Parent = child;
					sbox.Adornee = child;
				}
			});

			wait(1);
			victim.Character.GetChildren().forEach((child) => {
				if (child.IsA("Part")) {
					TweenService.Create(
						child,
						new TweenInfo(0.6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ Transparency: 1 },
					).Play();
				}
			});
		}
	},
	Demonslayer: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
				newChar.Parent = Workspace;
				newChar.Name = victim.Name;
				newChar.SetPrimaryPartCFrame(hrp.CFrame);
				hideCharacter(victim.Character);
				stripCharacterAssets(newChar);
				tweenCharacterColor(newChar, new BrickColor("Crimson").Color);
				const demonTail = deathEffectsFolder.FindFirstChild("DemonTail") as Accessory;
				const demonHorns = deathEffectsFolder.FindFirstChild("DemonHorns") as Accessory;
				const demonWings = deathEffectsFolder.FindFirstChild("DemonWings") as Accessory;

				if (demonTail && demonHorns && demonWings) {
					demonTail.Clone().Parent = newChar;
					demonHorns.Clone().Parent = newChar;
					demonWings.Clone().Parent = newChar;
				}

				wait(0.8);
				const blood = deathEffectsFolder.FindFirstChild("Abyss") as Part;
				if (blood) {
					const newBlood = blood.Clone();
					newBlood.Color = new BrickColor("Bright red").Color;
					newBlood.Parent = Workspace;
					newBlood.CFrame = new CFrame(hrp.Position.add(new Vector3(0, -0.4, 0)));
					playAnimation(newChar, "Death");
					TweenService.Create(
						blood,
						new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ Size: new Vector3(10, 0.05, 10) },
					).Play();
					wait(0.8);
					TweenService.Create(
						blood,
						new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ Size: new Vector3(0.05, 0.05, 0.05) },
					).Play();
					wait(0.3);
					newChar.Destroy();
				}
			}
		}
	},
	Harbinger: (victim: Player) => {
		if (victim && victim.Character) {
			const harbingerParticles = deathEffectsFolder.FindFirstChild("Harbinger") as ParticleEmitter;
			if (harbingerParticles) {
				addParticles(victim.Character, harbingerParticles);
			}
		}
	},
	Leviathan: (victim: Player) => {
		if (victim && victim.Character) {
			const levModel = deathEffectsFolder.FindFirstChild("Leviathan") as Model;
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (levModel && hrp) {
				const ocean = levModel.FindFirstChild("Ocean") as Part;
				const shark = levModel.FindFirstChild("Shark") as MeshPart;
				if (ocean && shark) {
					TweenService.Create(
						ocean,
						new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ Size: new Vector3(27.61, 0.05, 27.66) },
					).Play();
					wait(1);
					TweenService.Create(
						shark,
						new TweenInfo(0.8, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{
							CFrame: new CFrame(hrp.Position.add(new Vector3(0, -4, 0))).mul(
								CFrame.Angles(math.rad(90), 0, 0),
							),
						},
					).Play();
					wait(1.5);
					TweenService.Create(
						shark,
						new TweenInfo(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{
							CFrame: new CFrame(shark.Position.add(new Vector3(0, -24, 0))).mul(
								CFrame.Angles(math.rad(90), 0, 0),
							),
						},
					).Play();
					wait(0.4);
					TweenService.Create(
						ocean,
						new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ Size: new Vector3(0, 0.05, 0) },
					).Play();
					wait(0.3);
					levModel.Destroy();
				}
			}
		}
	},
	Valkyrie: (victim: Player) => {
		if (victim && victim.Character) {
			const hrp = victim.Character.FindFirstChild("HumanoidRootPart") as Part;
			if (hrp) {
				const newChar = deathEffectsFolder.WaitForChild("Clone").Clone() as Model;
				addItems(newChar, Players.GetCharacterAppearanceAsync(victim.UserId));
				newChar.Parent = Workspace;
				newChar.Name = victim.Name;
				newChar.SetPrimaryPartCFrame(hrp.CFrame);
				hideCharacter(victim.Character);
				stripCharacterAssets(newChar);
				tweenCharacterColor(newChar, new BrickColor("White").Color);
				const wings = InsertService.LoadAsset(192557913);
				const accessory = wings.FindFirstChildOfClass("Accessory");
				if (accessory) {
					accessory.Clone().Parent = newChar;
				}
				newChar.GetChildren().forEach((child) => {
					if (child.IsA("Part")) {
						if (child.Name === "HumanoidRootPart") {
							child.Transparency = 1;
						} else {
							TweenService.Create(
								child,
								new TweenInfo(1, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out, 0, false, 0),
								{ Transparency: 0.85 },
							).Play();
						}
					}
				});

				playAnimation(newChar, "Levitation");
				wait(1.5);
				newChar.GetChildren().forEach((child) => {
					const handlePart = child.FindFirstChild("Handle") as Part;
					if (child.IsA("Part")) {
						TweenService.Create(
							child,
							new TweenInfo(0.35, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out, 0, false, 0),
							{ Transparency: 1 },
						).Play();
					} else if (handlePart) {
						TweenService.Create(
							handlePart,
							new TweenInfo(0.35, Enum.EasingStyle.Bounce, Enum.EasingDirection.Out, 0, false, 0),
							{ Transparency: 1 },
						).Play();
					}
				});
				wait(1);
				newChar.Destroy();
			}
		}
	},
	Stormbringer: (victim: Player) => {
		if (victim && victim.Character) {
			const stormbringerParticles = deathEffectsFolder.FindFirstChild("StormbringerParticles") as Folder;
			const torso = victim.Character.FindFirstChild("Torso") as Part;
			if (stormbringerParticles && torso) {
				stormbringerParticles.GetChildren().forEach((child) => {
					child.Clone().Parent = torso;
				});
			}
		}
	},
};
