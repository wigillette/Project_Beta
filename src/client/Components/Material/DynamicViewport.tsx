import Roact from "@rbxts/roact";
import { RunService, Workspace } from "@rbxts/services";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import ViewportRotation from "../../UIProperties/ViewportRotation";

interface UIProps {
	Model: Model | Tool;
	Position: UDim2;
	AnchorPoint: Vector2;
	Size: UDim2;
	ZIndex: number;
	rotate: boolean;
	Animation: string | undefined;
}

class DynamicViewport extends Roact.Component<UIProps> {
	viewportRef;

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

	playAnimation(model: Model | Tool, newModel: Model | Tool, newCamera: Camera) {
		const hrp = model.FindFirstChild("HumanoidRootPart") as BasePart;
		const hum = model.FindFirstChildOfClass("Humanoid");
		const cloneHRP = newModel.FindFirstChild("HumanoidRootPart") as BasePart;
		const cloneHum = newModel.FindFirstChildOfClass("Humanoid");
		if (hrp && hum && cloneHRP && cloneHum) {
			let animationFinished = false;
			// Display the animation on the view
			coroutine.wrap(() => {
				const connection = RunService.RenderStepped.Connect((dt: number) => {
					newCamera.CFrame = new CFrame(
						hrp.CFrame.ToWorldSpace(new CFrame(0, 0.5, -5)).Position,
						hrp.CFrame.Position,
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
					const realAnim = (model.FindFirstChild("Idle") as Animation) || anim.Clone();
					realAnim.Parent = model;

					const animTrack = hum.LoadAnimation(realAnim);
					const cloneAnimTrack = cloneHum.LoadAnimation(anim);
					animTrack.Play();
					cloneAnimTrack.Play();
					cloneAnimTrack.Stopped.Wait();
					animationFinished = true;
				}
			});
		}
	}

	protected didMount(): void {
		// Get that baby spinning
		const viewportFrame = this.viewportRef.getValue();
		const model = this.props.Model;
		if (viewportFrame && model) {
			// Create the viewport camera
			const newCamera = new Instance("Camera");
			newCamera.Parent = viewportFrame;
			viewportFrame.CurrentCamera = newCamera;
			// Place a copy of the model inside the viewport
			const newModel = model.Clone();
			newModel.Parent = viewportFrame;
			// Initialize the rotation
			if (this.props.rotate) {
				ViewportRotation(viewportFrame, newModel, newCamera);
			} else {
				const worldModel = new Instance("WorldModel");
				worldModel.Parent = viewportFrame;
				newModel.Parent = worldModel;
				this.playAnimation(model, newModel, newCamera);
			}
		}
	}
}

export default DynamicViewport;
