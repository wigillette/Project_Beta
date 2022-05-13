import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { movingFadeAbsolute } from "../UIProperties/FrameEffects";
import { KnitClient as Knit } from "@rbxts/knit";
import { inventoryState } from "../Rodux/Reducers/InventoryReducer";
import {
	RectShadow,
	RectBG,
	RectText,
	MenuAspectRatio,
	Header,
	RectContainer,
	Body,
	CardGridLayout,
	SquareAspectRatio,
} from "client/UIProperties/RectUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "client/UIProperties/ColorSchemes";
import ObjectUtils from "@rbxts/object-utils";
import { registerGridDynamicScrolling } from "../UIProperties/DynamicScrolling";
import Card from "./Material/Card";
import { pushNotification } from "../Services/SnackbarService";

class Inventory extends Roact.Component<inventoryState> {
	static InventoryRef = Roact.createRef<Frame>();
	containerRef;
	gridRef;
	scrollRef;
	connections: RBXScriptConnection[];

	constructor(props: inventoryState) {
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
				Ref={Inventory.InventoryRef}
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
									Text={"Inventory"}
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
								>
									<uigridlayout Ref={this.gridRef} {...CardGridLayout}>
										<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
									</uigridlayout>
									{
										// Display all the cards using the CardInfo prop
										ObjectUtils.entries(this.props.inventory.Swords).map((Item) => {
											return (
												<Card
													Text={Item[0]}
													ButtonText={"Equip"}
													Model={Item[1] as Model | Tool}
													Callback={() => {
														print(`Attempted to purchase ${Item[0]}!`);
														const response = "Equip Callback";
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
	toggleInventory: inventoryState;
	updateInventory: inventoryState;
}

export = RoactRodux.connect(function (state: storeState) {
	const InventoryFrame = Inventory.InventoryRef.getValue() as Frame;
	if (InventoryFrame) {
		state.toggleInventory.toggle
			? movingFadeAbsolute(InventoryFrame, true, new UDim2(0.5, 0, 0.4, 0))
			: movingFadeAbsolute(InventoryFrame, false, new UDim2(0.5, 0, 0.1, 0));
	}

	return {
		toggle: state.toggleInventory.toggle,
		inventory: state.updateInventory.inventory,
	};
})(Inventory);
