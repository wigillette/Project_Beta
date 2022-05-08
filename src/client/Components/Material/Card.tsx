import Roact from "@rbxts/roact";
import { RectShadow, RectBG, RectText, RectContainer, RippleFrame, RectButtonText } from "client/UIProperties/RectUI";
import { rippleEffect, popText, tweenColor } from "client/UIProperties/ButtonEffects";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial } from "client/UIProperties/ColorSchemes";
import RectButton from "./RectButton";

interface UIProps {
	Text: string;
	Image: string;
	ButtonText: string;
	Callback: () => void;
}

class Card extends Roact.Component<UIProps> {
	labelRef;
	buttonRef;
	frameRef;
	containerRef;
	constructor(props: UIProps) {
		super(props);
		this.labelRef = Roact.createRef<TextLabel>();
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
		this.containerRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.25, 0, 0.25, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				Position={new UDim2(0.5, 0, 0, 0)}
				Ref={this.containerRef}
				{...RectContainer}
			>
				<uiaspectratioconstraint
					AspectRatio={1}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG}>
					<textlabel
						Text={this.props.Text}
						AnchorPoint={new Vector2(0.5, 0.05)}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						Size={new UDim2(0.95, 0, 0.5, 0)}
						TextColor3={googleMaterial.cardFont}
						{...RectText}
					></textlabel>
					<RectButton ButtonText={this.props.ButtonText} Callback={this.props.Callback} />
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

export default Card;
