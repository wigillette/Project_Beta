import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { CircText, CircShadow, CircBG, CircContainer, CircAspectRatio } from "client/UIProperties/CircularUI";
import { movingFade, tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
interface UIProps {
	TicketAmount: number;
}

class TicketContainer extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.125, 0, 0.125, 0)}
				AnchorPoint={new Vector2(0.975, 0.975)}
				Position={new UDim2(0.975, 0, 0.975, 0)}
				{...CircContainer}
			>
				<uiaspectratioconstraint {...CircAspectRatio}></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...CircBG}>
					<frame
						{...RectContainer}
						Size={new UDim2(0.2, 0, 0.8, 0)}
						Position={new UDim2(0.05, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.05, 0.5)}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
						<imagelabel {...CircBG} ImageColor3={googleMaterial.cardBG}>
							<uigradient {...whiteGradientProperties}></uigradient>
							<imagelabel
								{...RectContainer}
								Size={new UDim2(0.75, 0, 0.75, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Image={"rbxassetid://4318867178"}
							>
								<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
							</imagelabel>
						</imagelabel>
						<imagelabel {...CircShadow} ImageColor3={googleMaterial.cardShadow}></imagelabel>
					</frame>
					<textlabel
						{...CircText}
						Text={tostring(this.props.TicketAmount)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Size={new UDim2(0.45, 0, 0.8, 0)}
						Font={"GothamBold"}
						TextXAlignment={Enum.TextXAlignment.Left}
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
