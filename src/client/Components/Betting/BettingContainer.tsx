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
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import BettingItem from "./BettingItem";
import Slider from "../Material/Slider";
import RectButton from "../Material/RectButton";
import { bettingState } from "../../Rodux/Reducers/BettingReducer";
import { goldState } from "client/Rodux/Reducers/GoldReducer";
import BettingService from "client/Services/BettingService";

interface UIProps {
	mode: string;
	toggle: boolean;
	choices: Player[] | string[];
	userGold: number;
	betAmount: number;
	currentSelection: Player | string;
	closeBetting: () => void;
	updateBetAmount: (amount: number) => void;
}

let oldFade = true;
const bettingRef = Roact.createRef<Frame>();
class Betting extends Roact.Component<UIProps> {
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
				Ref={bettingRef}
				ZIndex={20}
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
									Text={`${this.props.mode} Betting`}
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
							Size={new UDim2(0.95, 0, 0.425, 0)}
							Position={new UDim2(0.5, 0, 0.375, 0)}
							AnchorPoint={new Vector2(0.5, 0.375)}
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
										// Display all the choices using the betting item prop
										ObjectUtils.values(this.props.choices).map((Item) => {
											return (
												<BettingItem
													buttonText={
														(this.props.currentSelection === (Item as string | Player) &&
															"SELECTED") ||
														"SELECT"
													}
													item={Item as string | Player}
												/>
											);
										})
									}
								</scrollingframe>

								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>
						<Slider
							Title="Gold Amount"
							Position={new UDim2(0.5, 0, 0.8, 0)}
							AnchorPoint={new Vector2(0.5, 0.8)}
							Size={new UDim2(0.9, 0, 0.18, 0)}
							UpperBound={this.props.userGold}
							Callback={(amount: number) => {
								this.props.updateBetAmount(amount);
							}}
						></Slider>
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
								ButtonText={"Place Bet"}
								Callback={() => {
									const success = BettingService.PlaceBet(
										this.props.betAmount,
										this.props.currentSelection,
									);
									if (success) {
										this.props.closeBetting();
									}
								}}
							></RectButton>
							<RectButton
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Size={new UDim2(0.45, 0, 0.95, 0)}
								ButtonText={"No Bet"}
								Callback={() => {
									this.props.closeBetting();
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
	setBettingToggle: bettingState;
	toggleBetting: bettingState;
	updateBettingInfo: bettingState;
	updateGold: goldState;
	selectItem: bettingState;
	updateBetAmount: bettingState;
}

export = RoactRodux.connect(
	(state: storeState) => {
		const bettingFrame = bettingRef.getValue() as Frame;
		if (bettingFrame && oldFade !== state.toggleBetting.toggle) {
			oldFade = state.toggleBetting.toggle;
			// Update the frame's position when the toggle changes
			state.toggleBetting.toggle
				? movingFadeAbsolute(bettingFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
				: movingFadeAbsolute(bettingFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
		}

		return {
			toggle: state.toggleBetting.toggle,
			choices: state.updateBettingInfo.choices,
			mode: state.updateBettingInfo.mode,
			userGold: state.updateGold.Gold,
			currentSelection: state.selectItem.choice,
			betAmount: state.updateBetAmount.amount,
		};
	},
	(dispatch) => {
		return {
			closeBetting: () => {
				dispatch({
					type: "setBettingToggle",
					payload: { toggle: false },
				});
			},
			updateBetAmount: (amount: number) => {
				dispatch({
					type: "updateBetAmount",
					payload: { amount: amount },
				});
			},
		};
	},
)(Betting);
