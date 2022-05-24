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
	SquareAspectRatio,
	MenuAspectRatio,
} from "client/UIProperties/RectUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import ObjectUtils from "@rbxts/object-utils";
import CircularProgress from "../Material/CircularProgress";
import CloseButton from "../Material/CloseButton";
import { registerListDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import ResultsItem from "./ResultsItem";
import { playerResult, ResultsState } from "../../Rodux/Reducers/ResultsReducer";
import { PROFILE_FORMAT } from "shared/LevelInfo";

interface UIProps {
	toggle: boolean;
	currentExp: number;
	expCap: number;
	playerResults: playerResult[];
	goldEarned: number;
	currentLevel: number;
	winner: string;
	closeResults: () => void;
}

let oldFade = true;
const ResultsRef = Roact.createRef<Frame>();
class Results extends Roact.Component<UIProps> {
	containerRef;
	gridRef;
	scrollRef;
	connections: RBXScriptConnection[];
	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.gridRef = Roact.createRef<UIListLayout>();
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
				Ref={ResultsRef}
				ZIndex={11}
			>
				<uiaspectratioconstraint {...MenuAspectRatio}></uiaspectratioconstraint>
				<frame
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Ref={this.containerRef}
					{...RectContainer}
					ZIndex={12}
				>
					<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG} ZIndex={13}>
						<frame {...Header} ZIndex={14}>
							<imagelabel ImageColor3={googleMaterial.header} {...RectBG} ZIndex={15}>
								<textlabel
									Text={"Match Results"}
									TextStrokeTransparency={0.8}
									AnchorPoint={new Vector2(0.5, 0.05)}
									Position={new UDim2(0.5, 0, 0.05, 0)}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									TextColor3={googleMaterial.headerFont}
									{...RectText}
									Font={"GothamBold"}
									TextXAlignment={Enum.TextXAlignment.Left}
									ZIndex={16}
								></textlabel>
								<CloseButton
									Size={new UDim2(0.1, 0, 0.75, 0)}
									Position={new UDim2(0.95, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.95, 0.5)}
									Callback={this.props.closeResults}
								/>

								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>

						<frame
							{...Body}
							AnchorPoint={new Vector2(0.05, 0.8)}
							Position={new UDim2(0.05, 0, 0.8, 0)}
							Size={new UDim2(0.57, 0, 0.7, 0)}
							ZIndex={14}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG} ZIndex={15}>
								<scrollingframe
									BackgroundTransparency={1}
									Ref={this.scrollRef}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									BorderSizePixel={0}
									ZIndex={16}
								>
									<uilistlayout
										Ref={this.gridRef}
										VerticalAlignment={Enum.VerticalAlignment.Top}
										HorizontalAlignment={Enum.HorizontalAlignment.Center}
										FillDirection={Enum.FillDirection.Vertical}
										Padding={new UDim(0.05, 0)}
									></uilistlayout>
									{
										// Display all the results using the Results item prop
										ObjectUtils.values(this.props.playerResults).map((Item) => {
											return <ResultsItem playerResult={Item}></ResultsItem>;
										})
									}
								</scrollingframe>

								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>

						<frame
							{...Body}
							ZIndex={14}
							Size={new UDim2(0.33, 0, 0.5, 0)}
							Position={new UDim2(0.95, 0, 0.45, 0)}
							AnchorPoint={new Vector2(0.95, 0.45)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG} ZIndex={14}>
								<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
								<CircularProgress
									cap={this.props.expCap}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Title={tostring(this.props.currentLevel)}
									Ratio={this.props.currentExp / this.props.expCap}
								></CircularProgress>
							</imagelabel>
						</frame>
						<frame
							{...Body}
							ZIndex={14}
							Size={new UDim2(0.33, 0, 0.2, 0)}
							Position={new UDim2(0.95, 0, 0.925, 0)}
							AnchorPoint={new Vector2(0.95, 0.925)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG} ZIndex={15}>
								<frame
									{...RectContainer}
									Size={new UDim2(0.95, 0, 0.45, 0)}
									Position={new UDim2(0.5, 0, 0.05, 0)}
									AnchorPoint={new Vector2(0.5, 0.05)}
								>
									<imagelabel
										{...RectContainer}
										Size={new UDim2(0.3, 0, 0.95, 0)}
										Position={new UDim2(0, 0, 0.5, 0)}
										AnchorPoint={new Vector2(0, 0.5)}
										Image={"rbxassetid://5350867529"}
										ZIndex={15}
									>
										<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
									</imagelabel>
									<textlabel
										ZIndex={15}
										{...RectText}
										Size={new UDim2(0.55, 0, 0.45, 0)}
										Position={new UDim2(1, 0, 0.5, 0)}
										AnchorPoint={new Vector2(1, 0.5)}
										Font={Enum.Font.GothamBold}
										Text={`Gold Earned: ${this.props.goldEarned}`}
									></textlabel>
								</frame>
								<frame
									{...RectContainer}
									Size={new UDim2(0.95, 0, 0.45, 0)}
									Position={new UDim2(0.5, 0, 0.95, 0)}
									AnchorPoint={new Vector2(0.5, 0.95)}
								>
									<imagelabel
										{...RectContainer}
										Size={new UDim2(0.3, 0, 0.95, 0)}
										Position={new UDim2(0, 0, 0.5, 0)}
										AnchorPoint={new Vector2(0, 0.5)}
										Image={"rbxassetid://9711348873"}
										ZIndex={15}
									>
										<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
									</imagelabel>
									<textlabel
										ZIndex={15}
										{...RectText}
										Size={new UDim2(0.55, 0, 0.45, 0)}
										Position={new UDim2(1, 0, 0.5, 0)}
										AnchorPoint={new Vector2(1, 0.5)}
										Font={Enum.Font.GothamBold}
										Text={`Winner: ${tostring(this.props.winner)}`}
									></textlabel>
								</frame>
							</imagelabel>
						</frame>

						<uigradient {...whiteGradientProperties}></uigradient>
					</imagelabel>
					<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow} ZIndex={12}></imagelabel>
				</frame>
			</frame>
		);
	}

	protected didMount(): void {
		const grid = this.gridRef.getValue();
		const scroll = this.scrollRef.getValue();
		// Make the scroll frame change size depending on number of items
		if (grid && scroll) {
			const connection = registerListDynamicScrolling(scroll, grid);
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
	setResultsToggle: ResultsState;
	updateResultsInfo: ResultsState;
	toggleResults: ResultsState;
	fetchExp: PROFILE_FORMAT;
}

export = RoactRodux.connect(
	(state: storeState) => {
		const ResultsFrame = ResultsRef.getValue() as Frame;
		if (ResultsFrame && oldFade !== state.toggleResults.toggle) {
			oldFade = state.toggleResults.toggle;
			// Update the frame's position when the toggle changes
			state.toggleResults.toggle
				? movingFadeAbsolute(ResultsFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
				: movingFadeAbsolute(ResultsFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
		}

		return {
			toggle: state.toggleResults.toggle,
			winner: state.updateResultsInfo.winner,
			playerResults: state.updateResultsInfo.playerResults,
			goldEarned: state.updateResultsInfo.goldEarned,
			expCap: state.fetchExp.ExpCap,
			currentExp: state.fetchExp.Experience,
			currentLevel: state.fetchExp.Level,
		};
	},
	(dispatch) => {
		return {
			closeResults: () => {
				dispatch({
					type: "setResultsToggle",
					payload: { toggle: false },
				});
			},
		};
	},
)(Results);
