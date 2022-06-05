import { tradingState } from "../../Rodux/Reducers/TradingReducer";
import RoactRodux from "@rbxts/roact-rodux";
import Roact from "@rbxts/roact";
import { movingFadeAbsolute } from "../../UIProperties/FrameEffects";
import { RectShadow, RectBG, RectText, RectContainer, Header, SquareAspectRatio } from "client/UIProperties/RectUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import { registerListDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import { Players } from "@rbxts/services";
import PlayerItem from "./PlayerItem";
import RequestItem from "./RequestItem";

interface UIProps {
	playerList: Player[];
	requests: Player[];
	requestsToggle: boolean;
}

let oldFadeIn = true;
const tradingRef = Roact.createRef<Frame>();
class RequestsContainer extends Roact.Component<UIProps> {
	containerRef;
	playerListRef;
	playerScrollRef;
	requestsListRef;
	requestsScrollRef;
	connections: RBXScriptConnection[];

	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.playerListRef = Roact.createRef<UIListLayout>();
		this.playerScrollRef = Roact.createRef<ScrollingFrame>();
		this.requestsListRef = Roact.createRef<UIListLayout>();
		this.requestsScrollRef = Roact.createRef<ScrollingFrame>();
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
					AspectRatio={0.9}
					DominantAxis={"Height"}
				></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG}>
					<frame {...Header} Size={new UDim2(1, 0, 0.15, 0)}>
						<imagelabel ImageColor3={googleMaterial.header} {...RectBG}>
							<textlabel
								Text={"Trading"}
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
						Size={new UDim2(0.45, 0, 0.8, 0)}
						Position={new UDim2(0.05, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.05, 0.95)}
					>
						<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
							<uigradient {...gradientProperties}></uigradient>
							<scrollingframe
								{...RectContainer}
								Ref={this.playerScrollRef}
								Size={new UDim2(0.95, 0, 0.95, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								BorderSizePixel={0}
							>
								<uilistlayout
									FillDirection={Enum.FillDirection.Vertical}
									HorizontalAlignment={Enum.HorizontalAlignment.Center}
									VerticalAlignment={Enum.VerticalAlignment.Top}
									Padding={new UDim(0.075, 0)}
									SortOrder={Enum.SortOrder.Name}
									Ref={this.playerListRef}
								></uilistlayout>
								{this.props.playerList
									.filter((player) => {
										return player !== Players.LocalPlayer;
									})
									.map((player) => {
										return <PlayerItem Player={player} />;
									})}
							</scrollingframe>
						</imagelabel>
					</frame>
					<frame
						{...RectContainer}
						Size={new UDim2(0.45, 0, 0.8, 0)}
						Position={new UDim2(0.95, 0, 0.95, 0)}
						AnchorPoint={new Vector2(0.95, 0.95)}
					>
						<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
							<uigradient {...gradientProperties}></uigradient>
							<scrollingframe
								{...RectContainer}
								Ref={this.requestsScrollRef}
								Size={new UDim2(0.95, 0, 0.95, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								BorderSizePixel={0}
							>
								<uilistlayout
									FillDirection={Enum.FillDirection.Vertical}
									HorizontalAlignment={Enum.HorizontalAlignment.Center}
									VerticalAlignment={Enum.VerticalAlignment.Top}
									Padding={new UDim(0.075, 0)}
									SortOrder={Enum.SortOrder.Name}
									Ref={this.requestsListRef}
								></uilistlayout>
								{this.props.requests
									.filter((player) => {
										return player !== Players.LocalPlayer;
									})
									.map((sender) => {
										return <RequestItem Player={sender} />;
									})}
							</scrollingframe>
						</imagelabel>
					</frame>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow}></imagelabel>
			</frame>
		);
	}

	protected didMount(): void {
		const requestsList = this.requestsListRef.getValue();
		const requestsScroll = this.requestsScrollRef.getValue();
		const playerList = this.playerListRef.getValue();
		const playerScroll = this.playerScrollRef.getValue();
		// Make the scroll frame change size depending on number of items
		if (requestsList && requestsScroll && playerList && playerScroll) {
			const playerListConnection = registerListDynamicScrolling(playerScroll, playerList);
			const requestsListConnection = registerListDynamicScrolling(requestsScroll, requestsList);
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
	hideTrading: tradingState;
	startTrade: tradingState;
	endTrade: tradingState;
	updateRequests: tradingState;
	updateTradePlayers: tradingState;
}

export = RoactRodux.connect((state: storeState) => {
	const tradingFrame = tradingRef.getValue() as Frame;
	if (tradingFrame && state.startTrade.requestsToggle !== oldFadeIn) {
		oldFadeIn = state.startTrade.requestsToggle;
		// Update the frame's position when the toggle changes
		state.startTrade.requestsToggle
			? movingFadeAbsolute(tradingFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
			: movingFadeAbsolute(tradingFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
	}

	return {
		requestsToggle: state.startTrade.requestsToggle,
		playerList: state.updateTradePlayers.playerList,
		requests: state.updateRequests.requests,
	};
})(RequestsContainer);
