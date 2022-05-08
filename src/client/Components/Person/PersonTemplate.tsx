import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RectShadow, RectBG, RectText, RectContainer, RippleFrame, RectButtonText } from "client/UIProperties/RectUI";
import { rippleEffect, popText, tweenColor } from "client/UIProperties/ButtonEffects";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial } from "client/UIProperties/ColorSchemes";

interface UIProps {
	Name: string;
	Age: number;
	Gender: string;
}

class PersonTemplate extends Roact.Component<UIProps> {
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
				Size={new UDim2(0.9, 0, 0.1, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				Position={new UDim2(0.5, 0, 0, 0)}
				Ref={this.containerRef}
				{...RectContainer}
			>
				<uiaspectratioconstraint
					AspectRatio={3}
					DominantAxis={Enum.DominantAxis.Width}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG}>
					<textlabel
						Text={string.format(
							"%s | %s | %s",
							this.props.Name,
							this.props.Gender,
							tostring(this.props.Age),
						)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						Size={new UDim2(0.95, 0, 0.5, 0)}
						TextColor3={googleMaterial.cardFont}
						{...RectText}
					></textlabel>

					<frame
						Size={new UDim2(0.8, 0, 0.4, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Position={new UDim2(0.5, 0, 0.95, 0)}
						Ref={this.frameRef}
						{...RippleFrame}
					>
						<imagebutton
							ImageColor3={googleMaterial.buttonColor}
							{...RectBG}
							Ref={this.buttonRef}
							Event={{
								MouseButton1Click: () => {
									const client = Players.LocalPlayer;
									const mouse = client.GetMouse();
									const label = this.labelRef.getValue();
									const frame = this.frameRef.getValue();
									const container = this.containerRef.getValue();
									if (label && frame && container) {
										coroutine.wrap(() => {
											popText(label, "Press Here", tostring(100 - this.props.Age), 2);
											rippleEffect(frame, mouse);
											wait(0.3);
											tweenTransparency(container, true, false);
											wait(0.4);
											container.Visible = false;
											container.Destroy();
										})();
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
								Ref={this.labelRef}
								Text={"Press Here"}
								ZIndex={2}
								TextColor3={googleMaterial.butttonFont}
								TextStrokeTransparency={0.9}
								{...RectButtonText}
							></textlabel>
						</imagebutton>
						<imagelabel ImageColor3={googleMaterial.buttonShadow} {...RectShadow}></imagelabel>
					</frame>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

export default PersonTemplate;
