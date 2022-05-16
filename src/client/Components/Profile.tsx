import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { RectBG, RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import { CircContainer, CircBG, CircShadow, CircText } from "client/UIProperties/CircularUI";
import RectProgress from "./Material/RectProgress";
import DynamicViewport from "./Material/DynamicViewport";
import MenuButtons from "./MenuButtons";
import { PROFILE_FORMAT } from "shared/LevelInfo";
import { Players } from "@rbxts/services";

interface UIProps {
	Experience: number;
	ExpCap: number;
	Level: number;
}

interface UIState {
	health: number;
	maxHealth: number;
}

class Profile extends Roact.Component<UIProps, UIState> {
	constructor(props: UIProps) {
		super(props);
	}

	state = {
		health: 100,
		maxHealth: 100,
	};

	render() {
		return (
			<frame
				{...RectContainer}
				Position={new UDim2(0.03, 0, 0.85, 0)}
				Size={new UDim2(0.175, 0, 0.25, 0)}
				AnchorPoint={new Vector2(0.03, 0.85)}
			>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
				<frame
					{...RectContainer}
					Size={new UDim2(0.475, 0, 1, 0)}
					Position={new UDim2(0, 0, 1, 0)}
					AnchorPoint={new Vector2(0, 1)}
				>
					<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
					<imagelabel {...RectBG} ImageColor3={googleMaterial.outerBG}>
						<uigradient {...whiteGradientProperties}></uigradient>
						<DynamicViewport
							Model={undefined}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							Size={new UDim2(0.9, 0, 0.9, 0)}
							rotate={false}
							Animation={undefined}
							ZIndex={5}
						></DynamicViewport>
						<RectProgress
							Icon={"rbxassetid://5371573492"}
							IconColor={Color3.fromRGB(69, 204, 224)}
							Size={new UDim2(0.85, 0, 0.3, 0)}
							Position={new UDim2(1, 0, 1, 0)}
							AnchorPoint={new Vector2(1, 1)}
							percentage={this.props.Experience}
							cap={this.props.ExpCap}
							Color={googleMaterial.buttonColor}
							SeparatorColor={Color3.fromRGB(20, 107, 140)}
						></RectProgress>
						<imagelabel
							{...RectBG}
							ZIndex={7}
							Position={new UDim2(0, 0, 1, 0)}
							Size={new UDim2(0.25, 0, 1, 0)}
							AnchorPoint={new Vector2(0, 1)}
							ImageColor3={googleMaterial.innerBG}
						>
							<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
							<uigradient {...whiteGradientProperties}></uigradient>
							<textlabel
								{...RectText}
								Font={"GothamBold"}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Size={new UDim2(0.9, 0, 0.9, 0)}
								TextColor3={googleMaterial.cardFont}
								Text={tostring(this.props.Level)}
								ZIndex={10}
							></textlabel>
						</imagelabel>
					</imagelabel>
					<imagelabel {...RectShadow} ImageColor3={googleMaterial.outerShadow}></imagelabel>
				</frame>
				<MenuButtons />
				<frame
					{...CircContainer}
					Size={new UDim2(0.5, 0, 0.6, 0)}
					Position={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(1, 1)}
				>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						Padding={new UDim(0, 10)}
						VerticalAlignment={Enum.VerticalAlignment.Bottom}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
					></uilistlayout>
					<RectProgress
						Icon={"rbxassetid://3260313832"}
						IconColor={Color3.fromRGB(250, 128, 114)}
						Size={new UDim2(1, 0, 0.25, 0)}
						Position={new UDim2(0, 0, 0, 0)}
						AnchorPoint={new Vector2(0, 0)}
						percentage={this.state.health}
						cap={this.state.maxHealth}
						Color={Color3.fromRGB(170, 0, 0)}
						SeparatorColor={Color3.fromRGB(60, 0, 0)}
					></RectProgress>
				</frame>
			</frame>
		);
	}

	getHumanoid(character: Model) {
		let humanoid = character.FindFirstChildOfClass("Humanoid");
		while (character && !humanoid) {
			humanoid = character.FindFirstChildOfClass("Humanoid");
			wait(0.05);
		}

		return humanoid;
	}

	setUpHealthConnections(humanoid: Humanoid) {
		humanoid.GetPropertyChangedSignal("Health").Connect(() => {
			this.setState({ health: humanoid?.Health, maxHealth: humanoid?.MaxHealth });
		});
		humanoid.GetPropertyChangedSignal("MaxHealth").Connect(() => {
			this.setState({ health: humanoid?.Health, maxHealth: humanoid?.MaxHealth });
		});
	}

	protected didMount(): void {
		const client = Players.LocalPlayer;
		const character = client.Character || client.CharacterAdded.Wait()[0];

		if (character) {
			const humanoid = this.getHumanoid(character);
			if (humanoid) {
				this.setState({ health: humanoid?.Health, maxHealth: humanoid.MaxHealth });
				this.setUpHealthConnections(humanoid);
			}
		}
		client.CharacterAdded.Connect((newCharacter) => {
			const humanoid = this.getHumanoid(newCharacter);
			if (humanoid) {
				this.setState({ health: humanoid?.Health, maxHealth: humanoid.MaxHealth });
				this.setUpHealthConnections(humanoid);
			}
		});
	}
}

interface storeState {
	fetchExp: PROFILE_FORMAT;
}

export = RoactRodux.connect(function (state: storeState) {
	return {
		Experience: state.fetchExp.Experience,
		ExpCap: state.fetchExp.ExpCap,
		Level: state.fetchExp.Level,
	};
})(Profile);
