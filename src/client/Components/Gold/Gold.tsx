import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import CircButton from "../Material/CircButton";
import { CircContainer, CircShadow, CircBG, CircText } from "client/UIProperties/CircularUI";
import { RectContainer, RectShadow, RectBG, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { goldState } from "../../Rodux/Reducers/GoldReducer";

interface UIProps {
	Gold: number;
	onToggle: () => void;
	position: UDim2;
	size: UDim2;
}

class Gold extends Roact.Component<UIProps> {
	bodyRef;
	buttonRef;
	frameRef;
	containerRef;
	constructor(props: UIProps) {
		super(props);
		this.bodyRef = Roact.createRef<TextLabel>();
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
		this.containerRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Size={this.props.size}
				AnchorPoint={new Vector2(this.props.position.X.Scale, this.props.position.Y.Scale)}
				Position={this.props.position}
				Ref={this.containerRef}
				{...CircContainer}
			>
				{/* <uiaspectratioconstraint
					AspectRatio={5}
					DominantAxis={Enum.DominantAxis.Height}
					AspectType={Enum.AspectType.ScaleWithParentSize}
				></uiaspectratioconstraint> */}
				<imagelabel ImageColor3={googleMaterial.outerBG} {...CircBG}>
					<uigradient {...whiteGradientProperties}></uigradient>
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
								Image={"rbxassetid://5350867529"}
							>
								<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
							</imagelabel>
						</imagelabel>
						<imagelabel {...CircShadow} ImageColor3={googleMaterial.cardShadow}></imagelabel>
					</frame>

					<textlabel
						{...CircText}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Size={new UDim2(0.45, 0, 0.8, 0)}
						Font={"GothamBold"}
						TextXAlignment={Enum.TextXAlignment.Left}
						TextYAlignment={Enum.TextYAlignment.Bottom}
						TextColor3={Color3.fromRGB(65, 65, 65)}
						Text={tostring(this.props.Gold)}
					></textlabel>
					<CircButton
						Position={new UDim2(0.9, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.9, 0.5)}
						Size={new UDim2(0.15, 0, 0.15, 0)}
						Callback={() => {
							this.props.onToggle();
						}}
					></CircButton>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...CircShadow}></imagelabel>
			</frame>
		);
	}
}

interface storeState {
	updateGold: goldState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		return {
			Gold: state.updateGold.Gold,
		};
	},
	(dispatch) => {
		return {
			onToggle: () => {
				dispatch({
					type: "toggleProducts",
				});
			},
		};
	},
)(Gold);
