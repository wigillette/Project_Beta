import Roact from "@rbxts/roact";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties, darkMaterial } from "client/UIProperties/ColorSchemes";
import RectButton from "../Material/RectButton";
import { MarketplaceService, Players } from "@rbxts/services";

interface UIProps {
	icon: string;
	title: string;
	description: string;
	productId: number;
	isGamePass: boolean;
	darkMaterial?: boolean;
}

class MatchItem extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.5, 0, 1, 0)} ZIndex={-1}>
				{!this.props.darkMaterial && (
					<uiaspectratioconstraint
						AspectRatio={2}
						DominantAxis={"Width"}
						AspectType={"ScaleWithParentSize"}
					></uiaspectratioconstraint>
				)}
				<imagelabel
					{...RectBG}
					ImageColor3={(this.props.darkMaterial && darkMaterial.cardBG) || googleMaterial.cardBG}
				>
					<textlabel
						{...RectText}
						Position={new UDim2(0.95, 0, 0, 0)}
						AnchorPoint={new Vector2(0.95, 0)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						TextStrokeTransparency={0.8}
						Size={new UDim2(0.65, 0, 0.25, 0)}
						Text={`${tostring(this.props.title)}`}
						Font={Enum.Font.GothamBold}
						TextXAlignment={Enum.TextXAlignment.Center}
					></textlabel>
					{this.props.darkMaterial ? (
						<imagelabel
							{...RectContainer}
							Image={this.props.icon}
							Size={new UDim2(0, 85, 0, 65)}
							Position={new UDim2(0.05, 0, 0.05, 0)}
							AnchorPoint={new Vector2(0.05, 0.05)}
						></imagelabel>
					) : (
						<imagelabel
							{...RectContainer}
							Image={this.props.icon}
							Size={new UDim2(0.25, 0, 1, 0)}
							Position={new UDim2(0.05, 0, 0.05, 0)}
							AnchorPoint={new Vector2(0.05, 0.05)}
						>
							<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
						</imagelabel>
					)}
					<textlabel
						{...RectText}
						Position={new UDim2(0.95, 0, 0.375, 0)}
						AnchorPoint={new Vector2(0.95, 0.375)}
						Size={new UDim2(0.6, 0, 0.35, 0)}
						Text={this.props.description || "No description."}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Center}
						TextColor3={(this.props.darkMaterial && darkMaterial.cardFont) || googleMaterial.cardFont}
					></textlabel>
					<RectButton
						ButtonText="PURCHASE"
						Size={new UDim2(0.4, 0, 0.4, 0)}
						Position={new UDim2(0.05, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.05, 0.95)}
						Callback={() => {
							if (this.props.isGamePass) {
								MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, this.props.productId);
							} else {
								MarketplaceService.PromptProductPurchase(Players.LocalPlayer, this.props.productId);
							}
							print(`Purchasing ${this.props.title}`);
						}}
					/>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel
					{...RectShadow}
					ImageColor3={(this.props.darkMaterial && darkMaterial.cardShadow) || googleMaterial.cardShadow}
				></imagelabel>
			</frame>
		);
	}
}

export default MatchItem;
