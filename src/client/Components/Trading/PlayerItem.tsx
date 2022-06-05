import Roact from "@rbxts/roact";
import { RectShadow, RectBG, RectText, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import RectButton from "../Material/RectButton";
import { KnitClient } from "@rbxts/knit";
const tradingService = KnitClient.GetService("TradingService");

interface UIProps {
	Player: Player;
}

class PlayerItem extends Roact.Component<UIProps> {
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
				Size={new UDim2(0.9, 0, 0.075, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Ref={this.containerRef}
				Key={"Card"}
				{...RectContainer}
			>
				<uiaspectratioconstraint {...SquareAspectRatio} AspectRatio={1.8}></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.cardBG} {...RectBG}>
					<textlabel
						Text={this.props.Player.Name}
						AnchorPoint={new Vector2(0.5, 0.05)}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						Size={new UDim2(0.95, 0, 0.25, 0)}
						TextColor3={googleMaterial.cardFont}
						{...RectText}
						Font={"GothamBold"}
					></textlabel>

					<imagelabel
						{...RectContainer}
						Size={new UDim2(0.5, 0, 0.5, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Image={`https://www.roblox.com/headshot-thumbnail/image?userId=${this.props.Player.UserId}&width=420&height=420&format=png`}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					</imagelabel>

					<RectButton
						Position={new UDim2(0.5, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Size={new UDim2(0.5, 0, 0.25, 0)}
						ButtonText={"REQUEST"}
						Callback={() => {
							tradingService.SendRequest(this.props.Player);
						}}
					/>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.cardShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

export default PlayerItem;
