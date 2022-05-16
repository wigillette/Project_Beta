import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RippleFrame } from "client/UIProperties/RectUI";
import { CircShadow, CircBG, CircContainer, CircText } from "client/UIProperties/CircularUI";
import { rippleEffect, tweenColor, playSound } from "client/UIProperties/ButtonEffects";
import { googleMaterial, gradientProperties, mediumGradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	Position: UDim2;
	AnchorPoint: Vector2;
	Size: UDim2;
	Callback: () => void;
}

interface UIState {
	debounce: boolean;
}

class CircButton extends Roact.Component<UIProps, UIState> {
	buttonRef;
	frameRef;
	constructor(props: UIProps) {
		super(props);
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
	}

	state = {
		debounce: false,
	};

	render() {
		return (
			<frame
				Size={this.props.Size}
				AnchorPoint={this.props.AnchorPoint}
				Position={this.props.Position}
				Ref={this.frameRef}
				{...RippleFrame}
				ZIndex={5}
			>
				<uiaspectratioconstraint
					AspectRatio={1}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagebutton
					ImageColor3={googleMaterial.buttonColor}
					{...CircBG}
					Ref={this.buttonRef}
					Event={{
						MouseButton1Click: () => {
							if (!this.state.debounce) {
								this.setState({ debounce: true });
								const frame = this.frameRef.getValue();
								const client = Players.LocalPlayer;
								const mouse = client.GetMouse();

								if (frame) {
									playSound("Click");
									//wait(0.5);
									this.props.Callback();
									rippleEffect(frame, mouse);
								}
								this.setState({ debounce: false });
							}
						},
						MouseEnter: (rbx) => {
							playSound("Hover");
							tweenColor(rbx, googleMaterial.buttonHover);
						},
						MouseLeave: (rbx) => {
							tweenColor(rbx, googleMaterial.buttonColor);
						},
					}}
				>
					<uigradient {...mediumGradientProperties}></uigradient>
					<textlabel
						Text={"+"}
						ZIndex={3}
						Size={new UDim2(0.9, 0, 0.9, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						TextColor3={googleMaterial.butttonFont}
						TextStrokeTransparency={0.9}
						{...CircText}
					></textlabel>
				</imagebutton>
				<imagelabel ImageColor3={googleMaterial.buttonShadow} {...CircShadow}></imagelabel>
			</frame>
		);
	}
}

export default CircButton;
