import Roact from "@rbxts/roact";
import { CircShadow, CircBG, CircContainer, CircAspectRatio, CircText } from "client/UIProperties/CircularUI";
import { tweenPosAbsolute, tweenTransparencyAbsolute } from "client/UIProperties/FrameEffects";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { rippleEffect, tweenColor } from "client/UIProperties/ButtonEffects";
import { Players } from "@rbxts/services";
import { RippleFrame } from "client/UIProperties/RectUI";

interface UIProps {
	Title: string;
	Size: UDim2;
	Position: UDim2;
	AnchorPoint: Vector2;
	onClick: (state: boolean) => void;
	disallowClick?: boolean;
	initialToggle: boolean;
}

interface UIState {
	toggle: boolean;
}

class ToggleButton extends Roact.Component<UIProps, UIState> {
	buttonFrameRef;
	frameRef;
	shadowRef;

	state = {
		toggle: true,
	};

	constructor(props: UIProps) {
		super(props);
		this.buttonFrameRef = Roact.createRef<Frame>();
		this.frameRef = Roact.createRef<Frame>();
		this.shadowRef = Roact.createRef<ImageLabel>();
		this.state.toggle = !this.props.initialToggle;
	}

	getButtonSize() {
		const button = this.buttonFrameRef.getValue();
		let toReturn = -10;
		if (button) {
			toReturn = -button.AbsoluteSize.X;
		}
		return toReturn;
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
				<textlabel
					{...CircText}
					Font={"GothamBold"}
					TextColor3={googleMaterial.buttonColor}
					Position={new UDim2(0.5, 0, 0, 0)}
					AnchorPoint={new Vector2(0.5, 0)}
					Size={new UDim2(1, 0, 0.4, 0)}
					Text={this.props.Title}
					ZIndex={5}
				>
					<uitextsizeconstraint MinTextSize={20} MaxTextSize={40}></uitextsizeconstraint>
				</textlabel>
				<frame
					{...CircContainer}
					Size={new UDim2(0.75, 0, 0.2, 0)}
					Position={new UDim2(0.5, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 1)}
				>
					<uiaspectratioconstraint
						AspectRatio={2.5}
						DominantAxis={Enum.DominantAxis.Width}
						AspectType={Enum.AspectType.ScaleWithParentSize}
					></uiaspectratioconstraint>

					<imagelabel ImageColor3={googleMaterial.cardBG} {...CircBG} ZIndex={1}>
						<frame
							Size={new UDim2(1, 0, 1, 0)}
							Position={
								(!this.state.toggle && new UDim2(1, this.getButtonSize(), 0, 0)) ||
								new UDim2(0, 0, 0, 0)
							}
							{...CircContainer}
							Ref={this.buttonFrameRef}
						>
							<uiaspectratioconstraint
								AspectRatio={1}
								DominantAxis={Enum.DominantAxis.Width}
								AspectType={Enum.AspectType.ScaleWithParentSize}
							></uiaspectratioconstraint>

							{(!this.props.disallowClick && (
								<imagebutton
									ImageColor3={Color3.fromRGB(255, 255, 255)}
									{...CircBG}
									ZIndex={5}
									Event={{
										MouseEnter: (rbx: ImageButton) => {
											tweenColor(rbx, Color3.fromRGB(250, 250, 250));
										},
										MouseLeave: (rbx: ImageButton) => {
											tweenColor(rbx, Color3.fromRGB(255, 255, 255));
										},
										MouseButton1Click: (rbx: ImageButton) => {
											const buttonFrame = this.buttonFrameRef.getValue();
											const client = Players.LocalPlayer;
											const mouse = client.GetMouse();
											const shadow = this.shadowRef.getValue();

											if (buttonFrame && shadow) {
												const finalPos =
													(this.state.toggle &&
														new UDim2(1, -buttonFrame.AbsoluteSize.X, 0, 0)) ||
													new UDim2(0, 0, 0, 0);
												rippleEffect(buttonFrame, mouse);
												tweenPosAbsolute(buttonFrame, finalPos);
												tweenTransparencyAbsolute(shadow, this.state.toggle);
											}
											this.setState({ toggle: !this.state.toggle });
											this.props.onClick(!this.state.toggle);
										},
									}}
								>
									<uigradient {...whiteGradientProperties}></uigradient>
								</imagebutton>
							)) || (
								<imagelabel ImageColor3={Color3.fromRGB(255, 255, 255)} {...CircBG} ZIndex={5}>
									<uigradient {...whiteGradientProperties}></uigradient>
								</imagelabel>
							)}
							<imagelabel ImageColor3={googleMaterial.cardShadow} {...CircShadow} ZIndex={4}></imagelabel>
						</frame>
						<imagelabel
							ImageColor3={googleMaterial.buttonColor}
							{...CircBG}
							ZIndex={2}
							Size={new UDim2(0.9, 0, 0.9, 0)}
							ImageTransparency={(this.state.toggle && 1) || 0}
							Ref={this.shadowRef}
							Key={"ToggleShadow"}
						>
							<uigradient {...gradientProperties}></uigradient>
						</imagelabel>
						<uigradient {...gradientProperties}></uigradient>
					</imagelabel>
					<imagelabel ImageColor3={googleMaterial.cardFont} {...CircShadow} ZIndex={0}></imagelabel>
				</frame>
			</frame>
		);
	}

	protected didUpdate(previousProps: UIProps, previousState: UIState): void {
		if (this.props.disallowClick) {
			if (previousProps.initialToggle !== this.props.initialToggle) {
				const buttonFrame = this.buttonFrameRef.getValue();
				const shadow = this.shadowRef.getValue();

				if (buttonFrame && shadow) {
					const finalPos =
						(this.props.initialToggle && new UDim2(1, -buttonFrame.AbsoluteSize.X, 0, 0)) ||
						new UDim2(0, 0, 0, 0);
					tweenPosAbsolute(buttonFrame, finalPos);
					tweenTransparencyAbsolute(shadow, this.props.initialToggle);
				}
			}
		}
	}
}

export default ToggleButton;
