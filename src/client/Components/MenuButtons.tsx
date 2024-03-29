import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import MenuService from "client/Services/MenuService";
import { movingFadeAbsolute } from "client/UIProperties/FrameEffects";
import { profileState } from "client/Rodux/Reducers/ProfileReducer";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import SquareButton from "../Components/Material/SquareButton";
import { playSound, tweenColor } from "client/UIProperties/ButtonEffects";
import { whiteGradientProperties } from "client/UIProperties/ColorSchemes";
interface UIProps {
	visible: boolean;
	toggleVisible: boolean;
	toggleMenu: () => void;
}

interface UIState {
	currentMenu: string;
}
const containerRef = Roact.createRef<Frame>();
const buttonContainerRef = Roact.createRef<Frame>();
const toggleButtonRef = Roact.createRef<ImageButton>();
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
				Size={new UDim2(0.5, 0, 0.5, 0)}
				Position={new UDim2(1, 0, 1, 0)}
				AnchorPoint={new Vector2(1, 1)}
				Ref={containerRef}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<frame
					{...RectContainer}
					Size={new UDim2(0.75, 0, 0.75, 0)}
					Position={new UDim2(0.75, 0, 1, 0)}
					AnchorPoint={new Vector2(1, 1)}
					Ref={buttonContainerRef}
				>
					<SquareButton
						Position={new UDim2(0, 0, 0, 0)}
						Size={new UDim2(0.47, 0, 0.47, 0)}
						AnchorPoint={new Vector2(0, 0)}
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
						Position={new UDim2(1, 0, 1, 0)}
						Size={new UDim2(0.47, 0, 0.47, 0)}
						AnchorPoint={new Vector2(1, 1)}
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
						Position={new UDim2(1, 0, 0, 0)}
						Size={new UDim2(0.47, 0, 0.47, 0)}
						AnchorPoint={new Vector2(1, 0)}
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
				</frame>
				<imagebutton
					BackgroundTransparency={1}
					Size={new UDim2(0.325, 0, 0.325, 0)}
					Position={new UDim2(0, 0, 1, 0)}
					AnchorPoint={new Vector2(0, 1)}
					Image={"rbxassetid://4974409019"}
					Visible={this.props.toggleVisible}
					Ref={toggleButtonRef}
					Event={{
						MouseButton1Click: () => {
							playSound("Click");
							this.props.toggleMenu();
						},
						MouseEnter: (rbx) => {
							playSound("Hover");
							tweenColor(rbx, Color3.fromRGB(200, 200, 200));
						},
						MouseLeave: (rbx) => {
							tweenColor(rbx, Color3.fromRGB(255, 255, 255));
						},
					}}
				>
					<uiaspectratioconstraint {...SquareAspectRatio} AspectRatio={1.2}></uiaspectratioconstraint>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagebutton>
			</frame>
		);
	}

	protected didUpdate(previousProps: UIProps, previousState: {}): void {
		if (this.props.visible !== previousProps.visible) {
			const frame = buttonContainerRef.getValue() as Frame;
			if (frame) {
				movingFadeAbsolute(
					frame,
					this.props.visible,
					this.props.visible ? new UDim2(0.75, 0, 1, 0) : new UDim2(0.6, 0, 1, 0),
					false,
				);
			}
		}
	}
}

interface storeState {
	toggleMenu: profileState;
	showMenu: profileState;
	hideMenu: profileState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		return {
			visible: state.toggleMenu.Visible,
			toggleVisible: state.showMenu.ToggleVisible,
		};
	},
	(dispatch) => {
		return {
			toggleMenu: () => {
				dispatch({
					type: "toggleMenu",
				});
			},
		};
	},
)(MenuButtons);
