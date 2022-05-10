import Roact from "@rbxts/roact";
import { CircShadow, CircBG, CircContainer } from "client/UIProperties/CircularUI";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { SquareAspectRatio } from "client/UIProperties/RectUI";
import { RunService, UserInputService } from "@rbxts/services";
import { snap } from "client/UIProperties/SliderUtils";

interface UIProps {
	Title: string;
	Size: UDim2;
	Position: UDim2;
	AnchorPoint: Vector2;
}

class RectButton extends Roact.Component<UIProps> {
	shadowRef;
	frameRef;
	buttonRef;
	held;
	percentage: number;
	constructor(props: UIProps) {
		super(props);
		this.shadowRef = Roact.createRef<ImageLabel>();
		this.frameRef = Roact.createRef<Frame>();
		this.buttonRef = Roact.createRef<Frame>();
		this.held = false;
		this.percentage = 0;
	}

	render() {
		return (
			<frame
				Ref={this.frameRef}
				{...CircContainer}
				Size={this.props.Size}
				Position={this.props.Position}
				AnchorPoint={this.props.AnchorPoint}
			>
				<uiaspectratioconstraint
					AspectRatio={15}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>

				<imagelabel ImageColor3={googleMaterial.cardBG} {...CircBG}>
					<uigradient {...gradientProperties}></uigradient>

					<imagelabel
						Ref={this.shadowRef}
						ImageColor3={googleMaterial.buttonColor}
						{...CircBG}
						Size={new UDim2(0, 0, 0.8, 0)}
						Position={new UDim2(0, 5, 0.5, 0)}
						AnchorPoint={new Vector2(0, 0.5)}
					>
						<uigradient {...gradientProperties}></uigradient>
					</imagelabel>
					<frame
						Size={new UDim2(0.1, 5, 1, 5)}
						Ref={this.buttonRef}
						{...CircContainer}
						AnchorPoint={new Vector2(0, 0.5)}
						Position={new UDim2(0, 0, 0.5, -1)}
					>
						<uiaspectratioconstraint
							{...SquareAspectRatio}
							AspectType={Enum.AspectType.FitWithinMaxSize}
						></uiaspectratioconstraint>
						<imagebutton
							ImageColor3={googleMaterial.cardBG}
							{...CircBG}
							ZIndex={4}
							Event={{
								MouseButton1Down: (rbx: ImageButton) => {
									this.held = true;
									// Update held; create connection for when the mouse is released
									const inputConnection = UserInputService.InputEnded.Connect(
										(input: InputObject) => {
											if (input.UserInputType === Enum.UserInputType.MouseButton1) {
												this.held = false;
												inputConnection.Disconnect();
											}
										},
									);

									// Update the progress bar and button position
									const sliderUpdateConnection = RunService.RenderStepped.Connect((dt: number) => {
										if (this.held) {
											const button = this.buttonRef.getValue();
											const slider = this.frameRef.getValue();
											const progress = this.shadowRef.getValue();
											if (button && slider && progress) {
												this.percentage = math.clamp(
													snap(
														(UserInputService.GetMouseLocation().X -
															slider.AbsolutePosition.X) /
															slider.AbsoluteSize.X,
														0.05,
													),
													button.Size.X.Scale / 2,
													1,
												);
												button.Position = new UDim2(
													this.percentage - button.Size.X.Scale,
													10,
													button.Position.Y.Scale,
													button.Position.Y.Offset,
												);
												progress.Size = new UDim2(
													this.percentage,
													-10,
													progress.Size.Y.Scale,
													progress.Size.Y.Offset,
												);
											}
										} else {
											sliderUpdateConnection.Disconnect();
										}
									});
								},
							}}
						>
							<uigradient {...whiteGradientProperties}></uigradient>
						</imagebutton>
						<imagelabel ImageColor3={googleMaterial.cardShadow} {...CircShadow} ZIndex={3}></imagelabel>
					</frame>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.cardFont} {...CircShadow}></imagelabel>
			</frame>
		);
	}
}

export default RectButton;
