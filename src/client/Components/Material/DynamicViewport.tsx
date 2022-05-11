import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import ViewportRotation from "../../UIProperties/ViewportRotation";

interface UIProps {
	Model: Model | Tool;
	Position: UDim2;
	AnchorPoint: Vector2;
	Size: UDim2;
	ZIndex: number;
	rotate: boolean;
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
				ViewportRotation(viewportFrame, model, newCamera);
			} else {
				// Just display the model
				const hrp = newModel.FindFirstChild("HumanoidRootPart") as BasePart;
				if (hrp) {
					let time = 0; // Capture tha animation
					const connection = RunService.RenderStepped.Connect((dt: number) => {
						if (time < 5) {
							newCamera.CFrame = new CFrame(
								hrp.CFrame.ToWorldSpace(new CFrame(0, 0.5, -5)).Position,
								hrp.CFrame.Position,
							);
						} else {
							connection.Disconnect();
						}
						time += dt;
					});
				}
			}
		}
	}
}

export default DynamicViewport;
