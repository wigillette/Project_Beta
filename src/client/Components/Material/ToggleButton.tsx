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
}

class ToggleButton extends Roact.Component<UIProps> {
	buttonFrameRef;
	frameRef;
	shadowRef;
	toggle;
	constructor(props: UIProps) {
		super(props);
		this.buttonFrameRef = Roact.createRef<Frame>();
		this.frameRef = Roact.createRef<Frame>();
		this.shadowRef = Roact.createRef<ImageLabel>();
		this.toggle = true;
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
					TextColor3={googleMaterial.bgFont}
					Position={new UDim2(0.5, 0, 0, 0)}
					AnchorPoint={new Vector2(0.5, 0)}
					Size={new UDim2(1, 0, 0.4, 0)}
					Text={this.props.Title}
					ZIndex={5}
				></textlabel>
				<frame
					{...CircContainer}
					Size={new UDim2(1, 0, 0.2, 0)}
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
							Position={new UDim2(0, 0, 0, -1.5)}
							{...CircContainer}
							Ref={this.buttonFrameRef}
						>
							<uiaspectratioconstraint
								AspectRatio={1}
								DominantAxis={Enum.DominantAxis.Width}
								AspectType={Enum.AspectType.ScaleWithParentSize}
							></uiaspectratioconstraint>
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
												(this.toggle && new UDim2(1, -buttonFrame.AbsoluteSize.X, 0, 0)) ||
												new UDim2(0, 0, 0, 0);
											rippleEffect(buttonFrame, mouse);
											tweenPosAbsolute(buttonFrame, finalPos);
											tweenTransparencyAbsolute(shadow, this.toggle);
										}
										this.toggle = !this.toggle;
									},
								}}
							>
								<uigradient {...whiteGradientProperties}></uigradient>
							</imagebutton>
							<imagelabel ImageColor3={googleMaterial.cardShadow} {...CircShadow} ZIndex={4}></imagelabel>
						</frame>
						<imagelabel
							ImageColor3={googleMaterial.buttonColor}
							{...CircBG}
							ZIndex={2}
							Size={new UDim2(0.9, 0, 0.9, 0)}
							ImageTransparency={1}
							Ref={this.shadowRef}
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
}

export default ToggleButton;
