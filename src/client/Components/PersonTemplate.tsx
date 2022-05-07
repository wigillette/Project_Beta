import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { RectShadow, RectBG, RectText, RectContainer, RippleFrame, RectButtonText } from "client/UIProperties/RectUI";
import { rippleEffect, popText, tweenColor } from "client/UIProperties/ButtonEffects";
import { tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";

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
				Size={new UDim2(0.92, 0, 0.06, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				Position={new UDim2(0.5, 0, 0, 0)}
				Ref={this.containerRef}
				{...RectContainer}
			>
				<imagelabel ImageColor3={Color3.fromRGB(200, 0, 0)} {...RectBG}>
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
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextStrokeTransparency={0.8}
						{...RectText}
					></textlabel>

					<frame
						Size={new UDim2(0.4, 0, 0.4, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Position={new UDim2(0.5, 0, 0.95, 0)}
						Ref={this.frameRef}
						{...RippleFrame}
					>
						<imagebutton
							ImageColor3={Color3.fromRGB(120, 120, 120)}
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
										})();
									}
								},
								MouseEnter: (rbx) => {
									tweenColor(rbx, Color3.fromRGB(160, 160, 160));
								},
								MouseLeave: (rbx) => {
									tweenColor(rbx, Color3.fromRGB(120, 120, 120));
								},
							}}
						>
							<textlabel
								Ref={this.labelRef}
								Text={"Press Here"}
								ZIndex={2}
								{...RectButtonText}
							></textlabel>
						</imagebutton>
						<imagelabel ImageColor3={Color3.fromRGB(80, 80, 80)} {...RectShadow}></imagelabel>
					</frame>
				</imagelabel>
				<imagelabel ImageColor3={Color3.fromRGB(160, 0, 0)} {...RectShadow}></imagelabel>
			</frame>
		);
	}

	/*
	protected didMount(): void {
		const container = this.containerRef.getValue();

		// Tween in the transparency
		if (container) {
			coroutine.wrap(() => {
				container.Visible = false;
				tweenTransparency(container, true, false);
				wait(0.4);
				container.Visible = true;
				tweenTransparency(container, true, true);
			})();
		}
	}
	*/
}

export default PersonTemplate;
