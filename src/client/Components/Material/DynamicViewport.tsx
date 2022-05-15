import Roact from "@rbxts/roact";
import { RunService, Workspace } from "@rbxts/services";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import ViewportRotation from "../../UIProperties/ViewportRotation";
import { Players } from "@rbxts/services";

interface UIProps {
	Model: Model | Tool | undefined;
	Position: UDim2;
	AnchorPoint: Vector2;
	Size: UDim2;
	ZIndex: number;
	rotate: boolean;
	Animation: string | undefined;
}

class DynamicViewport extends Roact.Component<UIProps> {
	viewportRef;
	validClasses = {
		MeshPart: true,
		Part: true,
		Accoutrement: true,
		Pants: true,
		Shirt: true,
		Humanoid: true,
	};
	RenderParts: Instance[][] = [];

	constructor(props: UIProps) {
		super(props);
		this.viewportRef = Roact.createRef<ViewportFrame>();
	}

	render() {
		return (
			<frame
				Size={this.props.Size}
				AnchorPoint={this.props.AnchorPoint}
				Position={this.props.Position}
				ZIndex={this.props.ZIndex}
				{...RectContainer}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<viewportframe
					Ref={this.viewportRef}
					Ambient={Color3.fromRGB(200, 200, 200)}
					LightColor={Color3.fromRGB(140, 140, 140)}
					LightDirection={new Vector3(-1, -1, -1)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					BackgroundTransparency={1}
					Size={new UDim2(1, 0, 1, 0)}
					ZIndex={4}
					ImageColor3={Color3.fromRGB(255, 255, 255)}
				></viewportframe>
			</frame>
		);
	}

	playAnimation(newModel: Model | Tool, newCamera: Camera) {
		const cloneHRP = newModel.FindFirstChild("HumanoidRootPart") as BasePart;
		const cloneHum = newModel.FindFirstChildOfClass("Humanoid");
		if (cloneHRP && cloneHum) {
			let animationFinished = false;
			// Display the animation on the view
			coroutine.wrap(() => {
				const connection = RunService.RenderStepped.Connect((dt: number) => {
					newCamera.CFrame = new CFrame(
						cloneHRP.CFrame.ToWorldSpace(new CFrame(0, 0.5, -5)).Position,
						cloneHRP.CFrame.Position,
					);
					if (animationFinished) {
						connection.Disconnect();
					}
				});
			})();
			// Play the animation
			spawn(() => {
				if (this.props.Animation !== undefined) {
					const anim = newModel.FindFirstChildOfClass("Animation") || new Instance("Animation");
					anim.Name = "Idle";
					anim.AnimationId = this.props.Animation;
					anim.Parent = newModel;

					const cloneAnimTrack = cloneHum.LoadAnimation(anim);
					cloneAnimTrack.Play();
					cloneAnimTrack.Stopped.Wait();
					animationFinished = true;
				}
			});
		}
	}

	addObject(object: Instance) {
		let toReturn: Instance | undefined = undefined;

		// Ensure the asset is a part, meshpart, accessory, etc.
		if (object.ClassName in this.validClasses) {
			const a = object.Archivable;
			object.Archivable = true;
			const renderClone = object.Clone();
			toReturn = renderClone;
			object.Archivable = a;

			if (object.IsA("MeshPart") || object.IsA("Part")) {
				this.RenderParts.push([object, renderClone]);
			} else if (object.IsA("Accoutrement")) {
				const objectHandle = object.FindFirstChild("Handle");
				const cloneHandle = renderClone.FindFirstChild("Handle");

				if (objectHandle && cloneHandle) {
					this.RenderParts.push([objectHandle, cloneHandle]);
				}
			} else if (object.IsA("Humanoid") && renderClone.IsA("Humanoid")) {
				// Disable all states. We only want it for clothing wrapping.
				renderClone.SetStateEnabled(Enum.HumanoidStateType.FallingDown, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Running, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.RunningNoPhysics, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Climbing, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.StrafingNoPhysics, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Ragdoll, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.GettingUp, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Jumping, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Landed, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Flying, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Freefall, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Seated, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.PlatformStanding, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Dead, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Swimming, false);
				renderClone.SetStateEnabled(Enum.HumanoidStateType.Physics, false);
				renderClone.DisplayDistanceType = Enum.HumanoidDisplayDistanceType.None;
			}
		}

		return toReturn;
	}

	removeObject(object: Instance) {
		// Remove an asset from the viewmodel
		let clone: Instance | undefined = undefined;

		this.RenderParts.forEach((partSet, index) => {
			if (partSet[1] === object) {
				clone = partSet[1] as Instance;
				this.RenderParts.remove(index);
			}
		});

		if (clone !== undefined) {
			clone = clone as Instance;
			if (clone.Parent && clone.Parent.IsA("Accoutrement")) {
				clone.Parent.Destroy();
			} else {
				clone.Destroy();
			}
		}
	}

	replicateState(model: Model, worldModel: WorldModel) {
		const charObjects = model.GetDescendants();
		// Create an empty model to store the assets
		const viewModel = new Instance("Model");
		viewModel.Name = "PlayerViewmodel";
		viewModel.Parent = worldModel;

		// Add each asset to the viewModel
		charObjects.forEach((child) => {
			const renderClone = this.addObject(child);
			if (renderClone) {
				renderClone.Parent = viewModel;
			}
		});

		// Update the viewModel when assets are added to the character
		model.DescendantAdded.Connect((newObject: Instance) => {
			const renderClone = this.addObject(newObject);
			if (renderClone) {
				renderClone.Parent = viewModel;
			}
		});

		// Update the viewModel when assets are removed to the character
		model.DescendantRemoving.Connect((oldObject: Instance) => {
			this.removeObject(oldObject);
		});

		return viewModel;
	}

	protected didMount(): void {
		// Get that baby spinning
		const viewportFrame = this.viewportRef.getValue();
		const model = this.props.Model;
		if (viewportFrame) {
			// Create the viewport camera
			const newCamera = new Instance("Camera");
			newCamera.Parent = viewportFrame;
			viewportFrame.CurrentCamera = newCamera;
			if (model) {
				// Place a copy of the model inside the viewport
				const newModel = model.Clone();
				newModel.Parent = viewportFrame;
				// Initialize the rotation
				if (this.props.rotate) {
					ViewportRotation(viewportFrame, newModel, newCamera);
				} else {
					// Handle NPCs
					const worldModel = new Instance("WorldModel");
					worldModel.Parent = viewportFrame;

					if (this.props.Animation !== undefined) {
						newModel.Parent = worldModel;
						this.playAnimation(newModel, newCamera);
					}
				}
			} else {
				// Render the client's character
				const worldModel = new Instance("WorldModel");
				worldModel.Parent = viewportFrame;
				const client = Players.LocalPlayer;
				let character = client.Character || client.CharacterAdded.Wait()[0];
				this.replicateState(character, worldModel);

				// Reset the viewport frame after the character dies
				client.CharacterAdded.Connect((newCharacter) => {
					// Destroy the old model
					coroutine.wrap(() => {
						wait(0.5);
						character = newCharacter;
						this.RenderParts = []; // Reset the render parts
						const model = worldModel.FindFirstChildOfClass("Model");
						if (model) {
							model.Destroy();
						}
						this.replicateState(newCharacter, worldModel);
					})();
				});

				// Update the viewport on every frame
				RunService.Heartbeat.Connect(() => {
					const hrp = character.FindFirstChild("HumanoidRootPart") as BasePart;
					if (hrp) {
						newCamera.CFrame = new CFrame(
							hrp.CFrame.ToWorldSpace(new CFrame(0, 0.5, -5)).Position,
							hrp.Position,
						);

						this.RenderParts.forEach((partSet: Instance[]) => {
							const original = partSet[0] as Part | BasePart | MeshPart;
							const clone = partSet[1] as Part | BasePart | MeshPart;
							if (original && original.Parent) {
								clone.CFrame = original.CFrame;
							} else {
								this.removeObject(original);
							}
						});
					} else {
						this.replicateState(character, worldModel);
					}
				});
			}
		}
	}
}

export default DynamicViewport;
