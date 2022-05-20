import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RectShadow, RectBG, RippleFrame, RectButtonText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { playSound, rippleEffect, tweenColor } from "client/UIProperties/ButtonEffects";
import { googleMaterial, gradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	Position: UDim2;
	AnchorPoint: Vector2;
	Size: UDim2;
	Callback: () => void;
}

interface UIState {
	debounce: boolean;
}

class RectButton extends Roact.Component<UIProps, UIState> {
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
				ZIndex={19}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<imagebutton
					ImageColor3={googleMaterial.closeButtonColor}
					{...RectBG}
					Ref={this.buttonRef}
					ZIndex={21}
					Event={{
						MouseButton1Click: () => {
							if (!this.state.debounce) {
								this.setState({ debounce: true });
								const frame = this.frameRef.getValue();
								const client = Players.LocalPlayer;
								const mouse = client.GetMouse();

								if (frame) {
									//wait(0.5);
									playSound("Click");
									rippleEffect(frame, mouse);
									wait(0.5);
									this.props.Callback();
								}
								this.setState({ debounce: false });
							}
						},
						MouseEnter: (rbx) => {
							playSound("Hover");
							tweenColor(rbx, googleMaterial.closeButtonHover);
						},
						MouseLeave: (rbx) => {
							tweenColor(rbx, googleMaterial.closeButtonColor);
						},
					}}
				>
					<uigradient {...gradientProperties}></uigradient>
					<textlabel
						Text={"X"}
						TextColor3={googleMaterial.butttonFont}
						TextStrokeTransparency={0.9}
						{...RectButtonText}
						Font={Enum.Font.GothamBold}
						ZIndex={22}
					></textlabel>
				</imagebutton>
			</frame>
		);
	}
}

export default RectButton;
