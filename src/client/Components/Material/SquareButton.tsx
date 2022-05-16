import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RectShadow, RectBG, RippleFrame, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { rippleEffect, tweenColor, tweenRotation, playSound } from "client/UIProperties/ButtonEffects";
import { googleMaterial, gradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	Position: UDim2;
	AnchorPoint: Vector2;
	Size: UDim2;
	ButtonIcon: string;
	IconColor: Color3;
	ButtonColor: Color3;
	HoverColor: Color3;
	ShadowColor: Color3;
	Callback: () => void;
}
interface UIState {
	debounce: boolean;
}
class SquareButton extends Roact.Component<UIProps, UIState> {
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
				{...RectContainer}
				ZIndex={5}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>

				<imagebutton
					ImageColor3={this.props.ButtonColor}
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
							tweenColor(rbx, this.props.HoverColor);
							const frame = this.frameRef.getValue();
							if (frame) {
								tweenRotation(frame, true);
							}
						},
						MouseLeave: (rbx) => {
							tweenColor(rbx, this.props.ButtonColor);
							const frame = this.frameRef.getValue();
							if (frame) {
								tweenRotation(frame, false);
							}
						},
					}}
				>
					<uigradient {...gradientProperties}></uigradient>
					<imagelabel
						{...RectContainer}
						Size={new UDim2(0.8, 0, 0.8, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						ImageColor3={this.props.IconColor}
						Image={this.props.ButtonIcon}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					</imagelabel>
				</imagebutton>
				<imagelabel ImageColor3={this.props.ShadowColor} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

export default SquareButton;
