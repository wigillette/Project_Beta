import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { Workspace } from "@rbxts/services";
import { spectateState } from "client/Rodux/Reducers/SpectateReducer";
import { CircBG, CircShadow } from "client/UIProperties/CircularUI";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { movingFadeAbsolute } from "client/UIProperties/FrameEffects";
import { RectContainer, RectShadow, RectText, SquareAspectRatio } from "client/UIProperties/RectUI";
import RectButton from "../Material/RectButton";
import SquareButton from "../Material/SquareButton";
interface UIProps {
	playerViewing: Player;
	participants: Player[];
	toggle: boolean;
	switchSpectating: (player: Player) => void;
}

interface UIState {}
const spectateContainerRef = Roact.createRef<Frame>();

class SpectateContainer extends Roact.Component<UIProps, UIState> {
	constructor(props: UIProps) {
		super(props);
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.15, 0, 0.25, 0)}
				Position={new UDim2(0.5, 0, 0.8, 0)}
				AnchorPoint={new Vector2(0.5, 0.8)}
				Ref={spectateContainerRef}
			>
				<imagelabel {...CircBG} ImageColor3={googleMaterial.outerBG}>
					<uiaspectratioconstraint
						AspectRatio={5}
						AspectType={"ScaleWithParentSize"}
						DominantAxis={"Width"}
					></uiaspectratioconstraint>
					<uigradient {...whiteGradientProperties}></uigradient>
					<RectButton
						Position={new UDim2(0.05, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.05, 0.5)}
						Size={new UDim2(0.2, 0, 0.9, 0)}
						AspectRatio={1.5}
						ButtonText={"<"}
						Callback={() => {
							const currentIndex = this.props.participants.indexOf(this.props.playerViewing);
							let newIndex = currentIndex - 1;
							if (newIndex < 0) {
								newIndex = this.props.participants.size() - 1;
							}

							const nextPlayer = this.props.participants[newIndex];
							if (nextPlayer) {
								this.props.switchSpectating(nextPlayer);
							}
						}}
					/>
					<textlabel
						{...RectText}
						Font={"GothamBold"}
						Size={new UDim2(0.4, 0, 1, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Text={this.props.playerViewing.Name}
					></textlabel>
					<RectButton
						Position={new UDim2(0.95, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.95, 0.5)}
						Size={new UDim2(0.2, 0, 0.9, 0)}
						AspectRatio={1.5}
						ButtonText={">"}
						Callback={() => {
							const currentIndex = this.props.participants.indexOf(this.props.playerViewing);
							let newIndex = currentIndex + 1;
							if (newIndex >= this.props.participants.size()) {
								newIndex = 0;
							}

							const nextPlayer = this.props.participants[newIndex];
							if (nextPlayer) {
								this.props.switchSpectating(nextPlayer);
							}
						}}
					/>
				</imagelabel>
				<imagelabel {...CircShadow} ImageColor3={googleMaterial.outerShadow}>
					<uiaspectratioconstraint
						AspectRatio={5}
						AspectType={"ScaleWithParentSize"}
						DominantAxis={"Width"}
					></uiaspectratioconstraint>
				</imagelabel>
			</frame>
		);
	}

	protected didUpdate(previousProps: UIProps, previousState: UIState): void {
		if (previousProps.playerViewing !== this.props.playerViewing) {
			if (this.props.playerViewing) {
				const camera = Workspace.CurrentCamera;
				const character = this.props.playerViewing.Character;
				if (camera && character) {
					const humanoid = character.FindFirstChildOfClass("Humanoid");
					if (humanoid) {
						pcall(() => {
							camera.CameraSubject = humanoid;
						});
					}
				}
			}
		}

		if (this.props.toggle !== previousProps.toggle) {
			const frame = spectateContainerRef.getValue() as Frame;
			if (frame) {
				// Update the frame's position when the toggle changes
				this.props.toggle
					? movingFadeAbsolute(frame, true, new UDim2(0.5, 0, 0.95, 0), false)
					: movingFadeAbsolute(frame, false, new UDim2(0.5, 0, 1, 0), false);
			}
		}
	}

	protected didMount(): void {
		const frame = spectateContainerRef.getValue() as Frame;
		if (frame) {
			this.props.toggle
				? movingFadeAbsolute(frame, true, new UDim2(0.5, 0, 0.95, 0), false)
				: movingFadeAbsolute(frame, false, new UDim2(0.5, 0, 1, 0), false);
		}
	}
}

interface storeState {
	switchSpectating: spectateState;
	updateParticipants: spectateState;
	toggleSpectate: spectateState;
}

export = RoactRodux.connect(
	(state: storeState) => {
		return {
			participants: state.updateParticipants.participants,
			playerViewing: state.switchSpectating.playerViewing,
			toggle: state.toggleSpectate.toggle,
		};
	},
	(dispatch) => {
		return {
			switchSpectating: (player: Player) => {
				dispatch({
					type: "switchSpectating",
					payload: { playerViewing: player },
				});
			},
		};
	},
)(SpectateContainer);
