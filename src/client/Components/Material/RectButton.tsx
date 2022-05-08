import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RectShadow, RectBG, RippleFrame, RectButtonText } from "client/UIProperties/RectUI";
import { rippleEffect, tweenColor } from "client/UIProperties/ButtonEffects";
import { googleMaterial } from "client/UIProperties/ColorSchemes";

interface UIProps {
	ButtonText: string;
	Callback: () => void;
}

class RectButton extends Roact.Component<UIProps> {
	buttonRef;
	frameRef;
	constructor(props: UIProps) {
		super(props);
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.8, 0, 0.4, 0)}
				AnchorPoint={new Vector2(0.5, 0.95)}
				Position={new UDim2(0.5, 0, 0.95, 0)}
				Ref={this.frameRef}
				{...RippleFrame}
			>
				<uiaspectratioconstraint
					AspectRatio={5}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagebutton
					ImageColor3={googleMaterial.buttonColor}
					{...RectBG}
					Ref={this.buttonRef}
					Event={{
						MouseButton1Click: () => {
							const frame = this.frameRef.getValue();
							const client = Players.LocalPlayer;
							const mouse = client.GetMouse();

							if (frame) {
								rippleEffect(frame, mouse);
								this.props.Callback();
							}
						},
						MouseEnter: (rbx) => {
							tweenColor(rbx, googleMaterial.buttonHover);
						},
						MouseLeave: (rbx) => {
							tweenColor(rbx, googleMaterial.buttonColor);
						},
					}}
				>
					<textlabel
						Text={this.props.ButtonText}
						ZIndex={2}
						TextColor3={googleMaterial.butttonFont}
						TextStrokeTransparency={0.9}
						{...RectButtonText}
					></textlabel>
				</imagebutton>
				<imagelabel ImageColor3={googleMaterial.buttonShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

export default RectButton;
