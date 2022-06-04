import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { RectShadow, RectBG, RectText, RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import RectButton from "../Material/RectButton";
import DynamicViewport from "../Material/DynamicViewport";
import { pushNotification } from "client/Services/SnackbarService";
import { craftingState } from "client/Rodux/Reducers/CraftingReducer";

interface UIProps {
	swordName: string;
	Model: Model | Tool;
	swordsSelected: string[];
	selectSword: (swordName: string) => void;
}

class SwordItem extends Roact.Component<UIProps> {
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
				Size={new UDim2(0.25, 0, 0.25, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Ref={this.containerRef}
				{...RectContainer}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.cardBG} {...RectBG}>
					<textlabel
						Text={this.props.swordName}
						AnchorPoint={new Vector2(0.5, 0.05)}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						Size={new UDim2(0.95, 0, 0.25, 0)}
						TextColor3={googleMaterial.cardFont}
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
					<RectButton
						Position={new UDim2(0.5, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Size={new UDim2(0.6, 0, 0.075, 0)}
						ButtonText={
							(this.props.swordsSelected.includes(this.props.swordName) && "SELECTED") || "SELECT"
						}
						Callback={() => {
							print(this.props.swordsSelected);
							print(this.props.swordsSelected.includes(this.props.swordName));
							this.props.selectSword(this.props.swordName);
						}}
					/>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.cardShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}
}

interface storeState {
	selectSword: craftingState;
}

export = RoactRodux.connect(
	(state: storeState) => {
		return {
			swordsSelected: state.selectSword.selectedSwords,
		};
	},
	(dispatch) => {
		return {
			selectSword: (swordName: string) => {
				dispatch({
					type: "selectSword",
					payload: { selectedSword: swordName },
				});
			},
		};
	},
)(SwordItem);
