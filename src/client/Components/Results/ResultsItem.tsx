import Roact from "@rbxts/roact";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { playerResult } from "../../Rodux/Reducers/ResultsReducer";

interface UIProps {
	playerResult: playerResult;
}

class ResultsItem extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame {...RectContainer} Size={new UDim2(0.95, 0, 0.15, 0)} ZIndex={17}>
				<imagelabel {...RectBG} ImageColor3={googleMaterial.cardBG} ZIndex={18}>
					<frame
						Size={new UDim2(0.75, 0, 0.95, 0)}
						Position={new UDim2(0.95, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.95, 0.5)}
						ZIndex={19}
						{...RectContainer}
					>
						<uilistlayout
							FillDirection={Enum.FillDirection.Horizontal}
							Padding={new UDim(0.05, 0)}
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
						></uilistlayout>
						<textlabel
							{...RectText}
							Position={new UDim2(0.5, 0, 0.05, 0)}
							AnchorPoint={new Vector2(0.5, 0.05)}
							TextColor3={googleMaterial.cardFont}
							Size={new UDim2(0.4, 0, 0.95, 0)}
							Text={(this.props.playerResult.Player && this.props.playerResult.Player.Name) || "Left"}
							Font={Enum.Font.GothamBold}
							TextXAlignment={Enum.TextXAlignment.Center}
							ZIndex={20}
						></textlabel>
						<textlabel
							{...RectText}
							Position={new UDim2(0.5, 0, 0.05, 0)}
							AnchorPoint={new Vector2(0.5, 0.05)}
							TextColor3={googleMaterial.cardFont}
							Size={new UDim2(0.2, 0, 0.95, 0)}
							Text={`K: ${this.props.playerResult.Kills}`}
							Font={Enum.Font.GothamBold}
							TextXAlignment={Enum.TextXAlignment.Center}
							ZIndex={20}
						></textlabel>
						<textlabel
							{...RectText}
							Position={new UDim2(0.5, 0, 0.05, 0)}
							AnchorPoint={new Vector2(0.5, 0.05)}
							TextColor3={googleMaterial.cardFont}
							Size={new UDim2(0.2, 0, 0.95, 0)}
							Text={`D: ${this.props.playerResult.Deaths}`}
							Font={Enum.Font.GothamBold}
							TextXAlignment={Enum.TextXAlignment.Center}
							ZIndex={20}
						></textlabel>
					</frame>

					<imagelabel
						{...RectContainer}
						Image={`https://www.roblox.com/headshot-thumbnail/image?userId=${
							(this.props.playerResult.Player && this.props.playerResult.Player.UserId) || "0"
						}&width=420&height=420&format=png`}
						Size={new UDim2(0.25, 0, 0.95, 0)}
						Position={new UDim2(0.05, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.05, 0.5)}
						ZIndex={19}
					>
						<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					</imagelabel>

					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.cardShadow} ZIndex={12}></imagelabel>
			</frame>
		);
	}
}

export default ResultsItem;
