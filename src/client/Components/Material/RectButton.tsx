import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RectShadow, RectBG, RippleFrame, RectButtonText } from "client/UIProperties/RectUI";
import { playSound, rippleEffect, tweenColor } from "client/UIProperties/ButtonEffects";
import { googleMaterial, gradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	Position: UDim2;
	AnchorPoint: Vector2;
	Size: UDim2;
	ButtonText: string;
	UseShadow?: boolean;
	AspectRatio?: number;
	Callback: () => void;
}

interface UIState {
	debounce: boolean;
	useShadow: boolean;
}

class RectButton extends Roact.Component<UIProps, UIState> {
	buttonRef;
	frameRef;
	constructor(props: UIProps) {
		super(props);
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
		if (this.props.UseShadow !== undefined) {
			this.setState({ useShadow: false });
		}
	}

	state = {
		debounce: false,
		useShadow: true,
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
					AspectRatio={(this.props.AspectRatio !== undefined && this.props.AspectRatio) || 3}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagebutton
					ImageColor3={googleMaterial.buttonColor}
					{...RectBG}
					Ref={this.buttonRef}
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
							tweenColor(rbx, googleMaterial.buttonHover);
						},
						MouseLeave: (rbx) => {
							tweenColor(rbx, googleMaterial.buttonColor);
						},
					}}
				>
					<uigradient {...gradientProperties}></uigradient>
					<textlabel
						Text={this.props.ButtonText}
						ZIndex={2}
						TextColor3={googleMaterial.butttonFont}
						TextStrokeTransparency={0.9}
						{...RectButtonText}
					></textlabel>
				</imagebutton>
				{this.state.useShadow && (
					<imagelabel ImageColor3={googleMaterial.buttonShadow} {...RectShadow}></imagelabel>
				)}
			</frame>
		);
	}
}

export default RectButton;
