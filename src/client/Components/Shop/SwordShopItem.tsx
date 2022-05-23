import Roact from "@rbxts/roact";
import { RectShadow, RectBG, RectText, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, mediumGradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import DynamicViewport from "../Material/DynamicViewport";
import { tweenTransparency } from "client/UIProperties/FrameEffects";
import { RARITY_COLORS } from "../../../shared/ShopData";

interface UIProps {
	Text: string;
	Model: Model | Tool;
	Percentage: number;
	Rarity: string;
}

class SwordShopItem extends Roact.Component<UIProps> {
	containerRef;

	constructor(props: UIProps) {
		super(props);

		this.containerRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.25, 0, 0.25, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Ref={this.containerRef}
				Key={"Card"}
				{...RectContainer}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.cardBG} {...RectBG}>
					<frame
						{...RectContainer}
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						Size={new UDim2(0.25, 0, 0.25, 0)}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
						<imagelabel ImageColor3={googleMaterial.cardFont} {...RectBG}>
							<uigradient {...mediumGradientProperties}></uigradient>
							<textlabel
								{...RectText}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								Size={new UDim2(0.95, 0, 0.95, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Font={Enum.Font.GothamBold}
								TextStrokeTransparency={0.8}
								Text={`${tostring(this.props.Percentage)}%`}
							></textlabel>
						</imagelabel>
						<imagelabel {...RectShadow} ImageColor3={googleMaterial.darkCardShadow}></imagelabel>
					</frame>
					<textlabel
						Text={this.props.Text}
						AnchorPoint={new Vector2(0.95, 0.05)}
						Position={new UDim2(0.95, 0, 0.05, 0)}
						Size={new UDim2(0.7, 0, 0.25, 0)}
						TextColor3={googleMaterial.cardFont}
						TextYAlignment={Enum.TextYAlignment.Top}
						TextXAlignment={Enum.TextXAlignment.Right}
						{...RectText}
						Font={"GothamBold"}
					></textlabel>

					<DynamicViewport
						rotate={true}
						Model={this.props.Model}
						Position={new UDim2(0.5, 0, 0.525, 0)}
						Size={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						ZIndex={3}
						Animation={undefined}
					/>

					<frame
						{...RectContainer}
						AnchorPoint={new Vector2(0.5, 1)}
						Position={new UDim2(0.5, 0, 1, 0)}
						Size={new UDim2(1, 0, 0.2, 0)}
					>
						<imagelabel
							{...RectBG}
							ImageColor3={RARITY_COLORS[this.props.Rarity as keyof typeof RARITY_COLORS]}
						>
							<textlabel
								Size={new UDim2(0.95, 0, 0.95, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Text={this.props.Rarity}
								TextColor3={Color3.fromRGB(255, 255, 255)}
								TextStrokeTransparency={0.8}
								{...RectText}
								Font={"GothamBold"}
							></textlabel>
							<uigradient {...mediumGradientProperties}></uigradient>
						</imagelabel>
					</frame>

					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.cardShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

export default SwordShopItem;
