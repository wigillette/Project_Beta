import Roact from "@rbxts/roact";
import { MenuAspectRatio, RectBG, RectContainer, RectShadow, RectText } from "client/UIProperties/RectUI";
import { mediumGradientProperties } from "client/UIProperties/ColorSchemes";
import { movingFadeAbsolute, tweenTransparency } from "../UIProperties/FrameEffects";
import { Players, TweenService } from "@rbxts/services";

interface UIProps {
	text: string;
	isRotation: boolean;
}

const oldFadeIn = true;

class HoverNotification extends Roact.Component<UIProps> {
	mouseMoveConnections: RBXScriptConnection[];
	hoverInnerRef;
	hoverNotificationRef;
	constructor(props: UIProps) {
		super(props);
		this.mouseMoveConnections = [] as RBXScriptConnection[];
		this.hoverNotificationRef = Roact.createRef<Frame>();
		this.hoverInnerRef = Roact.createRef<ImageLabel>();
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Position={new UDim2(0, 0, 0, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Size={new UDim2(0, 75, 0, 40)}
				Ref={this.hoverNotificationRef}
				Key={"HoverNotification"}
				ZIndex={10}
			>
				<imagelabel
					{...RectBG}
					ImageColor3={Color3.fromRGB(0, 0, 0)}
					ImageTransparency={0}
					Ref={this.hoverInnerRef}
					ZIndex={11}
				>
					<uigradient {...mediumGradientProperties}></uigradient>
					<textlabel
						Text={this.props.text}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Size={new UDim2(0.8, 0, 0.8, 0)}
						ZIndex={12}
						BackgroundTransparency={1}
						Font={"GothamBlack"}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextScaled={true}
						TextStrokeTransparency={0.8}
					/>
				</imagelabel>
			</frame>
		);
	}

	protected didMount(): void {
		const hoverFrame = this.hoverNotificationRef.getValue();
		const hoverInnerFrame = this.hoverInnerRef.getValue();
		const mouse = Players.LocalPlayer.GetMouse();
		if (hoverFrame && hoverInnerFrame && mouse) {
			const parentFrame = hoverFrame.Parent as Frame;
			if (parentFrame) {
				hoverFrame.Rotation = (this.props.isRotation && -30) || 0;

				hoverFrame.Position = new UDim2(
					0,
					mouse.X - parentFrame.AbsolutePosition.X + 30,
					0,
					mouse.Y - parentFrame.AbsolutePosition.Y - 30,
				);
				TweenService.Create(
					hoverInnerFrame,
					new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ ImageTransparency: 0.5 },
				).Play();
				this.mouseMoveConnections.push(
					mouse.Move.Connect(() => {
						hoverFrame.TweenPosition(
							new UDim2(
								0,
								mouse.X - parentFrame.AbsolutePosition.X + 30,
								0,
								mouse.Y - parentFrame.AbsolutePosition.Y - 30,
							),
							"Out",
							"Quad",
							0.05,
							true,
							undefined,
						);
						hoverFrame.Rotation = (this.props.isRotation && -30) || 0;
					}),
				);
			}
		}
	}

	protected willUnmount(): void {
		this.mouseMoveConnections.forEach((connection) => {
			connection.Disconnect();
		});
		this.mouseMoveConnections.clear();
	}
}

export default HoverNotification;
