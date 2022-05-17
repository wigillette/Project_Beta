import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import RectButton from "../Material/RectButton";
import { Players } from "@rbxts/services";

interface UIProps {
	item: string | Player;
	selectItem: (choice: Player | string) => void;
	buttonText: string;
}

class BettingItem extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.5, 0, 1, 0)} ZIndex={-1}>
				<imagelabel {...RectBG} ImageColor3={googleMaterial.cardBG}>
					<textlabel
						{...RectText}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						TextColor3={googleMaterial.cardFont}
						Size={new UDim2(0.95, 0, 0.25, 0)}
						Text={
							(typeIs(this.props.item, "Instance") && (this.props.item as Player).Name) ||
							(this.props.item as string)
						}
						Font={Enum.Font.GothamBold}
						TextXAlignment={Enum.TextXAlignment.Center}
					></textlabel>
					<imagelabel
						{...RectContainer}
						Image={
							(typeIs(this.props.item, "Instance") &&
								`https://www.roblox.com/headshot-thumbnail/image?userId=${this.props.item.UserId}&width=420&height=420&format=png`) ||
							""
						}
						Size={new UDim2(0.55, 0, 0.55, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					</imagelabel>

					<RectButton
						ButtonText={this.props.buttonText}
						Size={new UDim2(0.6, 0, 0.3, 0)}
						Position={new UDim2(0.5, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Callback={() => {
							this.props.selectItem(this.props.item);
						}}
					/>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.cardShadow}></imagelabel>
			</frame>
		);
	}
}

export = RoactRodux.connect(undefined, (dispatch) => {
	return {
		selectItem: (choice: Player | string) => {
			dispatch({
				type: "selectItem",
				payload: { choice: choice },
			});
		},
	};
})(BettingItem);
