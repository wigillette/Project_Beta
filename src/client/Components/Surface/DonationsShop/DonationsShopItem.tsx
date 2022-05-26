import Roact from "@rbxts/roact";
import { RectBG, RectContainer } from "client/UIProperties/RectUI";
import RectButton from "../../Material/RectButton";
import Object from "@rbxts/object-utils";
import { darkMaterial, mediumGradientProperties } from "client/UIProperties/ColorSchemes";
import { MarketplaceService, Players } from "@rbxts/services";

interface UIProps {
	amount: number;
	borderColor: Color3;
	productId: number;
}

class KillsLB extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				Size={new UDim2(1, 0, 1, 0)}
				AnchorPoint={new Vector2(0, 0)}
				Position={new UDim2(0, 0, 0, 0)}
				{...RectContainer}
				Key={this.props.amount}
			>
				<imagelabel {...RectBG} ImageColor3={this.props.borderColor}>
					<uigradient {...mediumGradientProperties}></uigradient>
					<imagelabel {...RectBG} Size={new UDim2(0.975, 0, 0.95, 0)} ImageColor3={darkMaterial.cardBG}>
						<textlabel
							TextScaled={true}
							Position={new UDim2(0.5, 0, 0.25, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={new UDim2(0.9, 0, 0.45, 0)}
							TextYAlignment={"Top"}
							TextXAlignment={"Center"}
							BackgroundTransparency={1}
							TextStrokeTransparency={0.8}
							TextColor3={Color3.fromRGB(255, 255, 255)}
							Font={"GothamBold"}
							Text={tostring(this.props.amount)}
						></textlabel>
						<RectButton
							Position={new UDim2(0.5, 0, 0.9, 0)}
							AnchorPoint={new Vector2(0.5, 0.9)}
							ButtonText={"DONATE"}
							Size={new UDim2(0.45, 0, 0.25, 0)}
							Callback={() => {
								print(`Purchase product ${this.props.productId}`);
								MarketplaceService.PromptProductPurchase(Players.LocalPlayer, this.props.productId);
							}}
						></RectButton>
					</imagelabel>
				</imagelabel>
			</frame>
		);
	}
}

export = KillsLB;
