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
} from "client/UIProperties/RectUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import ObjectUtils from "@rbxts/object-utils";
import CircularProgress from "../Material/CircularProgress";
import RectButton from "../Material/RectButton";
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import ResultsItem from "./ResultsItem";
import { playerResult, ResultsState } from "../../Rodux/Reducers/ResultsReducer";
import { goldState } from "client/Rodux/Reducers/GoldReducer";
import { PROFILE_FORMAT } from "shared/LevelInfo";

interface UIProps {
	toggle: boolean;
	expEarned: number;
	currentExp: number;
	expCap: number;
	playerResults: playerResult[];
	goldEarned: number;
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
									ZIndex={16}
								></textlabel>

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
									<uigridlayout
										Ref={this.gridRef}
										{...CardGridLayout}
										CellSize={new UDim2(0.2, 0, 0.2, 0)}
										FillDirectionMaxCells={4}
									>
										<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
									</uigridlayout>
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
									Text={`${this.props.currentExp + this.props.expEarned}/${this.props.expCap}`}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Ratio={(this.props.currentExp + this.props.expEarned) / this.props.expCap}
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
								<textlabel
									ZIndex={15}
									{...RectText}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Font={Enum.Font.GothamBold}
									Text={`Gold Earned: ${this.props.goldEarned}`}
								></textlabel>
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
	setResultsToggle: ResultsState;
	updateResultsInfo: ResultsState;
	toggleResults: ResultsState;
	updateGold: goldState;
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
			playerResults: state.updateResultsInfo.playerResults,
			expEarned: state.updateResultsInfo.expEarned,
			goldEarned: state.updateResultsInfo.goldEarned,
			expCap: state.fetchExp.ExpCap,
			currentExp: state.fetchExp.Experience,
		};
	},
	(dispatch) => {
		return {};
	},
)(Results);
