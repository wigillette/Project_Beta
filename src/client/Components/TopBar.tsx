import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import MenuService from "client/Services/MenuService";
import { profileState } from "client/Rodux/Reducers/ProfileReducer";
import { RectBG, RectContainer, RectShadow, SquareAspectRatio } from "client/UIProperties/RectUI";
import SquareButton from "../Components/Material/SquareButton";
import { playSound, tweenColor } from "client/UIProperties/ButtonEffects";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	visible: boolean;
}

interface UIState {
	currentMenu: string;
}

class TopBar extends Roact.Component<UIProps, UIState> {
	state = {
		currentMenu: "",
	};
	buttonContainerRef: Roact.Ref<Frame>;

	constructor(props: UIProps) {
		super(props);
		this.buttonContainerRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(1, 0, 0, 48)}
				Position={new UDim2(0.5, 0, 0, -48)}
				AnchorPoint={new Vector2(0.5, 0)}
				BackgroundTransparency={1}
			>
				<imagelabel {...RectBG}>
					<uigradient {...whiteGradientProperties}></uigradient>
					<frame
						{...RectContainer}
						Size={new UDim2(0.075, 0, 0.725, 0)}
						Position={new UDim2(0.95, 0, 0.9, 0)}
						AnchorPoint={new Vector2(0.95, 0.9)}
					>
						<SquareButton
							Position={new UDim2(0, 0, 0.5, 0)}
							Size={new UDim2(0.3, 0, 1, 0)}
							AnchorPoint={new Vector2(0, 0.5)}
							ButtonColor={Color3.fromRGB(150, 150, 150)}
							HoverColor={Color3.fromRGB(200, 200, 200)}
							ShadowColor={Color3.fromRGB(36, 36, 36)}
							IconColor={Color3.fromRGB(200, 200, 200)}
							ButtonIcon={"rbxassetid://5354945692"}
							Callback={() => {
								if (this.state.currentMenu === "Settings") {
									MenuService.toggleMenu("Settings");
								} else {
									MenuService.switchMenu("Settings");
									this.setState({ currentMenu: "Settings" });
								}
							}}
							HoverText={"Change Settings"}
						/>
						<SquareButton
							Position={new UDim2(0.5, 0, 0.5, 0)}
							Size={new UDim2(0.3, 0, 0.225, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							ButtonColor={Color3.fromRGB(60, 172, 203)}
							HoverColor={Color3.fromRGB(71, 199, 235)}
							ShadowColor={Color3.fromRGB(20, 56, 66)}
							IconColor={Color3.fromRGB(76, 211, 255)}
							ButtonIcon={"rbxassetid://5354907730"}
							Callback={() => {
								if (this.state.currentMenu === "Twitter") {
									MenuService.toggleMenu("Twitter");
								} else {
									MenuService.switchMenu("Twitter");
									this.setState({ currentMenu: "Twitter" });
								}
							}}
							HoverText={"Redeem Codes"}
						/>
						<SquareButton
							Position={new UDim2(1, 0, 0.5, 0)}
							Size={new UDim2(0.3, 0, 0.225, 0)}
							AnchorPoint={new Vector2(1, 0.5)}
							ButtonColor={Color3.fromRGB(190, 101, 0)}
							HoverColor={Color3.fromRGB(235, 125, 0)}
							ShadowColor={Color3.fromRGB(69, 36, 0)}
							IconColor={Color3.fromRGB(255, 165, 0)}
							ButtonIcon={"rbxassetid://5354930702"}
							Callback={() => {
								if (this.state.currentMenu === "Inventory") {
									MenuService.toggleMenu("Inventory");
								} else {
									MenuService.switchMenu("Inventory");
									this.setState({ currentMenu: "Inventory" });
								}
							}}
							HoverText={"View Inventory"}
						/>
						{/* <uilistlayout Padding={new UDim(0.05, 0)} FillDirection={Enum.FillDirection.Horizontal} /> */}
					</frame>
				</imagelabel>
				<imagelabel {...RectShadow} ImageColor3={googleMaterial.outerShadow}></imagelabel>
			</frame>
		);
	}
}

interface storeState {
	toggleMenu: profileState;
}

export = RoactRodux.connect((state: storeState) => {
	return {
		visible: state.toggleMenu.Visible,
	};
})(TopBar);
