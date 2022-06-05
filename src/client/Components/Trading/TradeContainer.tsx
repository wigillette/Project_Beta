import { tradingState } from "../../Rodux/Reducers/TradingReducer";
import RoactRodux from "@rbxts/roact-rodux";
import Roact from "@rbxts/roact";
import { movingFadeAbsolute } from "../../UIProperties/FrameEffects";
import {
	RectShadow,
	RectBG,
	RectText,
	RectContainer,
	Header,
	SquareAspectRatio,
	CardGridLayout,
} from "client/UIProperties/RectUI";
import { googleMaterial, gradientProperties } from "client/UIProperties/ColorSchemes";
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import { Players, ReplicatedStorage } from "@rbxts/services";
import Card from "client/Components/Material/Card";
import { KnitClient } from "@rbxts/knit";
import RectButton from "../Material/RectButton";
import ToggleButton from "../Material/ToggleButton";
const tradingService = KnitClient.GetService("TradingService");

interface UIProps {
	player1Selection: string[];
	player2Selection: string[];
	player1Inventory: string[];
	player2Inventory: string[];
	tradingToggle: boolean;
	p2Confirmation: boolean;
}
let oldFadeIn = true;
const tradingRef = Roact.createRef<Frame>();
class TradingContainer extends Roact.Component<UIProps> {
	containerRef;
	player1InventoryGridRef;
	player1InventoryScrollRef;
	player2InventoryGridRef;
	player2InventoryScrollRef;
	connections: RBXScriptConnection[];
	modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder") as Folder;

	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.player1InventoryGridRef = Roact.createRef<UIGridLayout>();
		this.player1InventoryScrollRef = Roact.createRef<ScrollingFrame>();
		this.player2InventoryGridRef = Roact.createRef<UIGridLayout>();
		this.player2InventoryScrollRef = Roact.createRef<ScrollingFrame>();
		this.connections = [];
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.5, 0, 0.8, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Ref={tradingRef}
			>
				<uiaspectratioconstraint
					{...SquareAspectRatio}
					AspectRatio={1.3}
					DominantAxis={"Height"}
				></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG}>
					<frame {...Header} Size={new UDim2(1, 0, 0.15, 0)}>
						<imagelabel ImageColor3={googleMaterial.header} {...RectBG}>
							<textlabel
								Text={"Active Trade"}
								TextStrokeTransparency={0.8}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								Size={new UDim2(0.95, 0, 0.9, 0)}
								TextColor3={googleMaterial.headerFont}
								{...RectText}
								Font={"GothamBold"}
							></textlabel>
							<uigradient {...gradientProperties}></uigradient>
						</imagelabel>
					</frame>

					<frame
						{...RectContainer}
						Size={new UDim2(0.95, 0, 0.675, 0)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						AnchorPoint={new Vector2(0.5, 0.5)}
					>
						<frame
							{...RectContainer}
							Size={new UDim2(0.3, 0, 1, 0)}
							Position={new UDim2(0.275, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.275, 0.5)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
								<uigradient {...gradientProperties}></uigradient>
								<scrollingframe
									{...RectContainer}
									Ref={this.player1InventoryScrollRef}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									BorderSizePixel={0}
								>
									<uigridlayout
										{...CardGridLayout}
										CellPadding={new UDim2(0.05, 0, 0, 0)}
										CellSize={new UDim2(0.4, 0, 0.25, 0)}
										FillDirectionMaxCells={2}
										Ref={this.player1InventoryGridRef}
									></uigridlayout>
									{this.props.player1Inventory
										.filter((item) => {
											return item !== "Default";
										})
										.map((item) => {
											return (
												<Card
													Text={item}
													ButtonText={"SELECT"}
													ButtonSize={new UDim2(0.8, 0, 0.35, 0)}
													Model={this.modelsFolder.WaitForChild(item, 10) as Model | Tool}
													Callback={() => {
														tradingService.SelectItem(item);
													}}
												/>
											);
										})}
								</scrollingframe>
							</imagelabel>
						</frame>
						<frame
							{...RectContainer}
							Size={new UDim2(0.15, 0, 1, 0)}
							Position={new UDim2(0.025, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.025, 0.5)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
								<uigradient {...gradientProperties}></uigradient>
								<frame
									{...RectContainer}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
								>
									<uilistlayout
										Padding={new UDim(0.05, 0)}
										FillDirection={"Vertical"}
										HorizontalAlignment={"Center"}
										VerticalAlignment={"Top"}
									></uilistlayout>
									{this.props.player1Selection.map((item) => {
										return (
											<Card
												Text={item}
												ButtonText={"REMOVE"}
												ButtonSize={new UDim2(0.8, 0, 0.35, 0)}
												Model={this.modelsFolder.WaitForChild(item, 10) as Model | Tool}
												Callback={() => {
													tradingService.RemoveItem(item);
												}}
												Size={new UDim2(0.95, 0, 0.175, 0)}
											/>
										);
									})}
								</frame>
							</imagelabel>
						</frame>
						<frame
							{...RectContainer}
							Size={new UDim2(0.3, 0, 1, 0)}
							Position={new UDim2(0.725, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.725, 0.5)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
								<uigradient {...gradientProperties}></uigradient>
								<scrollingframe
									{...RectContainer}
									Ref={this.player2InventoryScrollRef}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
									BorderSizePixel={0}
								>
									<uigridlayout
										{...CardGridLayout}
										CellPadding={new UDim2(0.05, 0, 0, 0)}
										CellSize={new UDim2(0.4, 0, 0.25, 0)}
										FillDirectionMaxCells={2}
										Ref={this.player2InventoryGridRef}
									></uigridlayout>

									{this.props.player2Inventory
										.filter((item) => {
											return item !== "Default";
										})
										.map((item) => {
											return (
												<Card
													Text={item}
													ButtonText={"SELECT"}
													ButtonSize={new UDim2(0.5, 0, 0.25, 0)}
													Model={this.modelsFolder.WaitForChild(item, 10) as Model | Tool}
													Callback={() => {}}
													noCallback={true}
												/>
											);
										})}
								</scrollingframe>
							</imagelabel>
						</frame>
						<frame
							{...RectContainer}
							Size={new UDim2(0.15, 0, 1, 0)}
							Position={new UDim2(0.975, 0, 0.5, 0)}
							AnchorPoint={new Vector2(0.975, 0.5)}
						>
							<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
								<uigradient {...gradientProperties}></uigradient>
								<frame
									{...RectContainer}
									Size={new UDim2(0.95, 0, 0.95, 0)}
									Position={new UDim2(0.5, 0, 0.5, 0)}
									AnchorPoint={new Vector2(0.5, 0.5)}
								>
									<uilistlayout
										Padding={new UDim(0.05, 0)}
										FillDirection={"Vertical"}
										HorizontalAlignment={"Center"}
										VerticalAlignment={"Top"}
									></uilistlayout>
									{this.props.player2Selection.map((item) => {
										return (
											<Card
												Text={item}
												ButtonText={"REMOVE"}
												ButtonSize={new UDim2(0.5, 0, 0.25, 0)}
												Model={this.modelsFolder.WaitForChild(item, 10) as Model | Tool}
												Callback={() => {}}
												Size={new UDim2(0.95, 0, 0.175, 0)}
												noCallback={true}
											/>
										);
									})}
								</frame>
							</imagelabel>
						</frame>
					</frame>
					<ToggleButton
						Title={`Confirm?`}
						Size={new UDim2(0.15, 0, 0.1, 0)}
						Position={new UDim2(0.25, 0, 0.975, 0)}
						AnchorPoint={new Vector2(0.25, 0.975)}
						initialToggle={false}
						onClick={(state: boolean) => {
							tradingService.ToggleConfirmation();
						}}
					/>
					<RectButton
						Position={new UDim2(0.5, 0, 0.975, 0)}
						AnchorPoint={new Vector2(0.5, 0.975)}
						Size={new UDim2(0.25, 0, 0.1, 0)}
						ButtonText={"ACCEPT"}
						Callback={() => {
							tradingService.AcceptTrade();
						}}
					/>
					<ToggleButton
						Title={`Confirm?`}
						Size={new UDim2(0.15, 0, 0.1, 0)}
						Position={new UDim2(0.75, 0, 0.975, 0)}
						AnchorPoint={new Vector2(0.75, 0.975)}
						initialToggle={this.props.p2Confirmation}
						onClick={(state: boolean) => {}}
						disallowClick={true}
					/>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}

	protected didMount(): void {
		const invGrid1 = this.player1InventoryGridRef.getValue();
		const invScroll1 = this.player1InventoryScrollRef.getValue();
		const invGrid2 = this.player2InventoryGridRef.getValue();
		const invScroll2 = this.player2InventoryScrollRef.getValue();
		// Make the scroll frame change size depending on number of items
		if (invGrid1 && invGrid2 && invScroll1 && invScroll2) {
			const playerListConnection = registerGridDynamicScrolling(invScroll1, invGrid1);
			const requestsListConnection = registerGridDynamicScrolling(invScroll2, invGrid2);
			this.connections.push(playerListConnection);
			this.connections.push(requestsListConnection);
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
	updateSelection: tradingState;
	endTrade: tradingState;
	startTrade: tradingState;
	updateTradePlayers: tradingState;
	updateConfirmation: tradingState;
}

export = RoactRodux.connect((state: storeState) => {
	const tradingFrame = tradingRef.getValue() as Frame;
	if (tradingFrame && state.startTrade.tradingToggle !== oldFadeIn) {
		oldFadeIn = state.startTrade.tradingToggle;
		// Update the frame's position when the toggle changes
		state.startTrade.tradingToggle
			? movingFadeAbsolute(tradingFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
			: movingFadeAbsolute(tradingFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
	}

	return {
		player1Selection: state.updateSelection.player1Selected,
		player2Selection: state.updateSelection.player2Selected,
		player1Inventory: state.startTrade.player1Inventory,
		player2Inventory: state.startTrade.player2Inventory,
		tradingToggle: state.startTrade.tradingToggle,
		p2Confirmation: state.updateConfirmation.player2Confirmation,
	};
})(TradingContainer);
