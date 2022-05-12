import Roact from "@rbxts/roact";
import {
	RectShadow,
	RectBG,
	RectText,
	RectContainer,
	Header,
	Body,
	CardGridLayout,
	SquareAspectRatio,
} from "client/UIProperties/RectUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import ObjectUtils from "@rbxts/object-utils";
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import Card from "./Card";
import { pushNotification } from "../../Services/SnackbarService";

interface serviceInfo {
	Name: string;
	Remote: string;
}

interface UIProps {
	Header: string;
	CardInfo: Map<string, { Price: number; Model: Model | Tool }>;
	serverCallback: (itemName: string) => string;
}

class Grid extends Roact.Component<UIProps> {
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
								Text={this.props.Header}
								TextStrokeTransparency={0.8}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								Size={new UDim2(0.95, 0, 0.95, 0)}
								TextColor3={googleMaterial.headerFont}
								{...RectText}
								Font={"GothamBold"}
							></textlabel>
							<uigradient {...gradientProperties}></uigradient>
						</imagelabel>
					</frame>

					<frame {...Body}>
						<imagelabel ImageColor3={googleMaterial.innerBG2} {...RectBG}>
							<scrollingframe
								BackgroundTransparency={1}
								Ref={this.scrollRef}
								Size={new UDim2(0.95, 0, 0.95, 0)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								AnchorPoint={new Vector2(0.5, 0.5)}
								BorderSizePixel={0}
								//AutomaticCanvasSize={Enum.AutomaticSize.Y}
							>
								<uigridlayout Ref={this.gridRef} {...CardGridLayout}>
									<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
								</uigridlayout>
								{
									// Display all the cards using the CardInfo prop
									ObjectUtils.entries(this.props.CardInfo).map((Item) => {
										return (
											<Card
												Text={Item[0]}
												ButtonText={tostring(Item[1].Price)}
												Model={Item[1].Model}
												Callback={() => {
													print(`Attempted to purchase ${Item[0]}!`);
													const response = this.props.serverCallback(Item[0]);
													pushNotification(response);
												}}
												ButtonSize={new UDim2(0.6, 0, 0.075, 0)}
											></Card>
										);
									})
								}
							</scrollingframe>

							<uigradient {...gradientProperties}></uigradient>
						</imagelabel>
					</frame>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...RectShadow}></imagelabel>
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

export default Grid;
