import Roact from "@rbxts/roact";
import { CircShadow, CircBG, CircContainer, CircText } from "client/UIProperties/CircularUI";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { Header, SquareAspectRatio } from "client/UIProperties/RectUI";
import { RunService, UserInputService } from "@rbxts/services";
import { snap } from "client/UIProperties/SliderUtils";

interface UIProps {
	Title: string;
	Size: UDim2;
	Position: UDim2;
	AnchorPoint: Vector2;
}

interface UIState {
	percentage: number;
	value: number;
	held: boolean;
}

class Slider extends Roact.Component<UIProps, UIState> {
	shadowRef;
	frameRef;
	buttonRef;
	textRef;

	state = {
		held: false,
		percentage: 0,
		value: 5,
	};

	constructor(props: UIProps) {
		super(props);
		this.shadowRef = Roact.createRef<ImageLabel>();
		this.frameRef = Roact.createRef<Frame>();
		this.buttonRef = Roact.createRef<Frame>();
		this.textRef = Roact.createRef<TextLabel>();
	}

	render() {
		return (
			<frame
				{...CircContainer}
				Size={this.props.Size}
				Position={this.props.Position}
				AnchorPoint={this.props.AnchorPoint}
			>
				<textlabel
					{...CircText}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextStrokeTransparency={0.8}
					Font={Enum.Font.GothamBold}
					TextXAlignment={Enum.TextXAlignment.Left}
					Position={new UDim2(0.05, 0, 0, 0)}
					AnchorPoint={new Vector2(0, 0)}
					Size={new UDim2(0.4, 0, 0.35, 1)}
					Text={this.props.Title + ":"}
				></textlabel>
				<textlabel
					{...CircText}
					TextColor3={googleMaterial.buttonColor}
					TextStrokeTransparency={0.8}
					Font={Enum.Font.GothamBold}
					TextXAlignment={Enum.TextXAlignment.Left}
					Position={new UDim2(1, 0, 0, 0)}
					AnchorPoint={new Vector2(1, 0)}
					Size={new UDim2(0.57, 0, 0.35, 1)}
					Ref={this.textRef}
					Text={tostring(this.state.value)}
				></textlabel>
				<frame
					Ref={this.frameRef}
					{...CircContainer}
					Size={new UDim2(1, 0, 0.6, 0)}
					Position={new UDim2(0.5, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 1)}
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
										this.setState({ held: true });
										// Update held; create connection for when the mouse is released
										const inputConnection = UserInputService.InputEnded.Connect(
											(input: InputObject) => {
												if (input.UserInputType === Enum.UserInputType.MouseButton1) {
													this.setState({ held: false });
													inputConnection.Disconnect();
												}
											},
										);

										// Update the progress bar and button position
										const sliderUpdateConnection = RunService.RenderStepped.Connect(
											(dt: number) => {
												if (this.state.held) {
													const button = this.buttonRef.getValue();
													const slider = this.frameRef.getValue();
													const progress = this.shadowRef.getValue();
													const textLabel = this.textRef.getValue();
													if (button && slider && progress && textLabel) {
														this.setState({
															percentage: math.clamp(
																snap(
																	(UserInputService.GetMouseLocation().X -
																		slider.AbsolutePosition.X) /
																		slider.AbsoluteSize.X,
																	0.05,
																),
																button.Size.X.Scale / 2,
																1,
															),
														});
														button.Position = new UDim2(
															this.state.percentage - button.Size.X.Scale,
															10,
															button.Position.Y.Scale,
															button.Position.Y.Offset,
														);
														progress.Size = new UDim2(
															this.state.percentage,
															-10,
															progress.Size.Y.Scale,
															progress.Size.Y.Offset,
														);

														this.setState({
															value: math.floor(this.state.percentage * 100),
														});
														textLabel.Text = tostring(this.state.value);
													}
												} else {
													sliderUpdateConnection.Disconnect();
												}
											},
										);
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
			</frame>
		);
	}
}

export default Slider;
