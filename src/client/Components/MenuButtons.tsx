import Roact from "@rbxts/roact";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import SquareButton from "../Components/Material/SquareButton";
interface UIProps {}

interface UIState {
	currentMenu: string;
}

class MenuButtons extends Roact.Component<UIProps, UIState> {
	state = {
		currentMenu: "",
	};
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.4, 0, 0.4, 0)}
				Position={new UDim2(0.925, 0, 0.825, 0)}
				AnchorPoint={new Vector2(1, 0.8)}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<uigridlayout
					FillDirectionMaxCells={2}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Bottom}
					CellPadding={new UDim2(0.05, 0, 0.05, 0)}
					CellSize={new UDim2(0.45, 0, 0.45, 0)}
					StartCorner={Enum.StartCorner.BottomLeft}
				></uigridlayout>
				<SquareButton
					Position={new UDim2(0, 0, 0, 0)}
					Size={new UDim2(0.22, 0, 0.22, 0)}
					AnchorPoint={new Vector2(0, 0)}
					ButtonColor={Color3.fromRGB(150, 150, 150)}
					HoverColor={Color3.fromRGB(200, 200, 200)}
					ShadowColor={Color3.fromRGB(36, 36, 36)}
					IconColor={Color3.fromRGB(200, 200, 200)}
					ButtonIcon={"rbxassetid://5354945692"}
					Callback={() => {
						print("Clicked on settings!");
						this.setState({ currentMenu: "Settings" });
						// TO-DO: Display settings UI and tween away other UIs
					}}
				/>
				<SquareButton
					Position={new UDim2(0, 0, 0, 0)}
					Size={new UDim2(0.22, 0, 0.22, 0)}
					AnchorPoint={new Vector2(0, 0)}
					ButtonColor={Color3.fromRGB(60, 172, 203)}
					HoverColor={Color3.fromRGB(71, 199, 235)}
					ShadowColor={Color3.fromRGB(20, 56, 66)}
					IconColor={Color3.fromRGB(76, 211, 255)}
					ButtonIcon={"rbxassetid://5354907730"}
					Callback={() => {
						print("Clicked on twitter!");
						this.setState({ currentMenu: "Twitter" });
						// TO-DO: Display twitter UI and tween away other UIs
					}}
				/>

				<SquareButton
					Position={new UDim2(0, 0, 0, 0)}
					Size={new UDim2(0.22, 0, 0.22, 0)}
					AnchorPoint={new Vector2(0, 0)}
					ButtonColor={Color3.fromRGB(190, 101, 0)}
					HoverColor={Color3.fromRGB(235, 125, 0)}
					ShadowColor={Color3.fromRGB(69, 36, 0)}
					IconColor={Color3.fromRGB(255, 165, 0)}
					ButtonIcon={"rbxassetid://5354930702"}
					Callback={() => {
						print("Clicked on Inventory!");
						this.setState({ currentMenu: "Inventory" });
						// TO-DO: Display inventory UI and tween away other UIs
					}}
				/>
			</frame>
		);
	}
}

export default MenuButtons;
