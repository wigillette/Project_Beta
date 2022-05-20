import RoactRodux from "@rbxts/roact-rodux";
import Roact from "@rbxts/roact";
import { movingFadeAbsolute } from "../../UIProperties/FrameEffects";
import {
	RectShadow,
	RectBG,
	RectText,
	RectContainer,
	Header,
	Body,
	CardGridLayout,
	SquareAspectRatio,
	MenuAspectRatio,
	ButtonAspectRatio,
} from "client/UIProperties/RectUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import ObjectUtils from "@rbxts/object-utils";
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import MapItem from "./MapItem";
import ModeItem from "./ModeItem";
import VotingService from "../../Services/VotingService";
import RectButton from "../Material/RectButton";
import { votingState } from "../../Rodux/Reducers/VotingReducer";
import { ReplicatedStorage } from "@rbxts/services";
import { modeDescriptions } from "shared/GameInfo";

interface UIProps {
	chosenMode: string;
	chosenMap: string;
	toggle: boolean;
	maps: string[];
	modes: string[];
	closeVoting: () => void;
}

let oldFade = true;
const votingRef = Roact.createRef<Frame>();
const mapsFolder = ReplicatedStorage.WaitForChild("Maps", 10);
class Voting extends Roact.Component<UIProps> {
	containerRef;
	gridRef;
	scrollRef;
	connections: RBXScriptConnection[];
	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.gridRef = Roact.createRef<UIGridLayout>();
		this.scrollRef = Roact.createRef<ScrollingFrame>();
		this.connections = [];
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.5, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.4, 0)}
				Ref={votingRef}
			>
				<uiaspectratioconstraint {...MenuAspectRatio}></uiaspectratioconstraint>
				<frame
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Ref={this.containerRef}
					{...RectContainer}
				>
					<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG}>
						<frame {...Header}>
							<imagelabel ImageColor3={googleMaterial.header} {...RectBG}>
								<textlabel
									Text={`Match Selection`}
									TextStrokeTransparency={0.8}
									AnchorPoint={new Vector2(0.5, 0.05)}
									Position={new UDim2(0.5, 0, 0.05, 0)}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									TextColor3={googleMaterial.headerFont}
									{...RectText}
									Font={"GothamBold"}
								></textlabel>

								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>

						<frame
							{...Body}
							Size={new UDim2(0.95, 0, 0.3, 0)}
							Position={new UDim2(0.5, 0, 0.3, 0)}
							AnchorPoint={new Vector2(0.5, 0.3)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
								<scrollingframe
									BackgroundTransparency={1}
									Ref={this.scrollRef}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									BorderSizePixel={0}
								>
									<uigridlayout
										Ref={this.gridRef}
										{...CardGridLayout}
										CellSize={new UDim2(0.2, 0, 0.2, 0)}
										FillDirectionMaxCells={4}
									>
										<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
									</uigridlayout>
									{
										// Display all the choices using the voting item prop
										ObjectUtils.values(this.props.maps).map((mapName) => {
											return (
												<MapItem
													mapName={mapName}
													mapModel={
														mapsFolder && (mapsFolder.FindFirstChild(mapName) as Model)
													}
													buttonText={
														(this.props.chosenMap === mapName && "SELECTED") || "SELECT"
													}
												/>
											);
										})
									}
								</scrollingframe>

								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>

						<frame
							{...Body}
							Size={new UDim2(0.95, 0, 0.3, 0)}
							Position={new UDim2(0.5, 0, 0.75, 0)}
							AnchorPoint={new Vector2(0.5, 0.75)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
								<scrollingframe
									BackgroundTransparency={1}
									Ref={this.scrollRef}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									BorderSizePixel={0}
								>
									<uigridlayout
										Ref={this.gridRef}
										{...CardGridLayout}
										CellSize={new UDim2(0.35, 0, 0.5, 0)}
										FillDirectionMaxCells={3}
									>
										<uiaspectratioconstraint
											{...ButtonAspectRatio}
											AspectRatio={1.2}
										></uiaspectratioconstraint>
									</uigridlayout>
									{
										// Display all the choices using the voting item prop
										ObjectUtils.values(this.props.modes).map((modeName) => {
											return (
												<ModeItem
													modeName={modeName}
													modeDescription={
														modeDescriptions[modeName as keyof typeof modeDescriptions] ||
														"None"
													}
													buttonText={
														(this.props.chosenMode === modeName && "SELECTED") || "SELECT"
													}
												/>
											);
										})
									}
								</scrollingframe>

								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>

						<frame
							{...RectContainer}
							Position={new UDim2(0.5, 0, 0.975, 0)}
							AnchorPoint={new Vector2(0.5, 0.975)}
							Size={new UDim2(0.75, 0, 0.1, 0)}
						>
							<uilistlayout
								FillDirection={Enum.FillDirection.Horizontal}
								VerticalAlignment={Enum.VerticalAlignment.Center}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								Padding={new UDim(0.1, 0)}
							></uilistlayout>
							<RectButton
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Size={new UDim2(0.45, 0, 0.95, 0)}
								ButtonText={"Cast Vote"}
								Callback={() => {
									this.props.closeVoting();
									VotingService.CastVote({ Map: this.props.chosenMap, Mode: this.props.chosenMode });
								}}
							></RectButton>
						</frame>

						<uigradient {...whiteGradientProperties}></uigradient>
					</imagelabel>
					<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow}></imagelabel>
				</frame>
			</frame>
		);
	}

	protected didMount(): void {
		const grid = this.gridRef.getValue();
		const scroll = this.scrollRef.getValue();
		// Make the scroll frame change size depending on number of items
		if (grid && scroll) {
			const connection = registerGridDynamicScrolling(scroll, grid);
			this.connections.push(connection);
		}
	}

	protected willUnmount(): void {
		// Disconnect the scroll frame listener
		this.connections.forEach((connection) => {
			connection.Disconnect();
		});
		this.connections.clear();
	}
}

interface storeState {
	setVotingToggle: votingState;
	setChosenMap: votingState;
	setChosenMode: votingState;
	updateVotingOptions: votingState;
}

export = RoactRodux.connect(
	(state: storeState) => {
		const votingFrame = votingRef.getValue() as Frame;
		if (votingFrame && oldFade !== state.setVotingToggle.toggle) {
			oldFade = state.setVotingToggle.toggle;
			// Update the frame's position when the toggle changes
			state.setVotingToggle.toggle
				? movingFadeAbsolute(votingFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
				: movingFadeAbsolute(votingFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
		}

		return {
			toggle: state.setVotingToggle.toggle,
			maps: state.updateVotingOptions.maps,
			modes: state.updateVotingOptions.modes,
			chosenMap: state.setChosenMap.chosenMap,
			chosenMode: state.setChosenMode.chosenMode,
		};
	},
	(dispatch) => {
		return {
			closeVoting: () => {
				dispatch({
					type: "setVotingToggle",
					payload: { toggle: false },
				});
			},
		};
	},
)(Voting);
