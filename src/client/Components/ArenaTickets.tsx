import Roact, { Tree } from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CircText, CircShadow, CircBG, CircContainer, CircAspectRatio } from "client/UIProperties/CircularUI";
import { movingFade, tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { playSound, tweenColor } from "client/UIProperties/ButtonEffects";
import HoverNotification from "./HoverNotification";
interface UIProps {
	TicketAmount: number;
	size: UDim2;
	position: UDim2;
}

class TicketContainer extends Roact.Component<UIProps> {
	buttonRef;
	hoverNotificationTree: Tree | undefined;
	constructor(props: UIProps) {
		super(props);
		this.buttonRef = Roact.createRef<ImageButton>();
		this.hoverNotificationTree = undefined;
	}

	render() {
		return (
			<frame
				Size={this.props.size}
				AnchorPoint={new Vector2(this.props.position.X.Scale, this.props.position.Y.Scale)}
				Position={this.props.position}
				{...CircContainer}
			>
				<uiaspectratioconstraint
					AspectRatio={2.5}
					DominantAxis={"Height"}
					AspectType={"ScaleWithParentSize"}
				></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...CircBG}>
					<frame
						{...RectContainer}
						Size={new UDim2(0.4, 0, 0.8, 0)}
						Position={new UDim2(0.1, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.1, 0.5)}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
						<imagelabel {...CircBG} ImageColor3={googleMaterial.cardBG}>
							<uigradient {...whiteGradientProperties}></uigradient>
							<imagebutton
								BackgroundTransparency={1}
								Size={new UDim2(0.85, 0, 0.85, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Image={"rbxassetid://4318867178"}
								Ref={this.buttonRef}
								ImageColor3={Color3.fromRGB(220, 220, 220)}
								Event={{
									MouseEnter: (rbx) => {
										playSound("Hover");
										tweenColor(rbx, Color3.fromRGB(255, 255, 255));
										const frame = this.buttonRef.getValue();
										if (frame) {
											const hoverElement = Roact.createElement(HoverNotification, {
												text: "Ticket Info",
												isRotation: false,
											});
											this.hoverNotificationTree = Roact.mount(hoverElement, frame);
										}
									},
									MouseLeave: (rbx) => {
										tweenColor(rbx, Color3.fromRGB(220, 220, 220));
										if (this.hoverNotificationTree) {
											Roact.unmount(this.hoverNotificationTree);
											this.hoverNotificationTree = undefined;
										}
									},
								}}
							>
								<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
							</imagebutton>
						</imagelabel>
						<imagelabel {...CircShadow} ImageColor3={googleMaterial.cardShadow}></imagelabel>
					</frame>
					<textlabel
						{...CircText}
						Text={tostring(this.props.TicketAmount)}
						Position={new UDim2(0.8, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.8, 0.5)}
						Size={new UDim2(0.45, 0, 0.8, 0)}
						Font={"GothamBold"}
						TextXAlignment={Enum.TextXAlignment.Right}
						TextYAlignment={Enum.TextYAlignment.Bottom}
						TextColor3={Color3.fromRGB(65, 65, 65)}
					></textlabel>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...CircShadow}></imagelabel>
			</frame>
		);
	}
}

interface storeState {
	getTickets: { ticketAmount: number };
}

export = RoactRodux.connect((state: storeState) => {
	return {
		TicketAmount: state.getTickets.ticketAmount,
	};
})(TicketContainer);
