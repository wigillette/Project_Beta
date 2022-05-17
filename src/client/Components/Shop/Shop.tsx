import { shopState } from "../../Rodux/Reducers/ShopReducer";
import RoactRodux from "@rbxts/roact-rodux";
import Roact from "@rbxts/roact";
import { movingFadeAbsolute } from "../../UIProperties/FrameEffects";
import { KnitClient as Knit } from "@rbxts/knit";
const shopService = Knit.GetService("ShopService");
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
import SwordShopItem from "./SwordShopItem";
import { RARITIES, PACK_PRICES, PACK_INFO } from "shared/ShopData";
import { ReplicatedStorage } from "@rbxts/services";
import RectButton from "../Material/RectButton";

interface UIProps {
	currentPack: string;
	toggle: boolean;
	switchPack: (packName: string) => void;
}

let oldFadeIn = true;
const shopRef = Roact.createRef<Frame>();
class Shop extends Roact.Component<UIProps> {
	containerRef;
	gridRef;
	scrollRef;
	connections: RBXScriptConnection[];
	modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);
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
				Ref={shopRef}
			>
				<uiaspectratioconstraint {...SquareAspectRatio} AspectRatio={1.25}></uiaspectratioconstraint>
				<frame
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Ref={this.containerRef}
					{...RectContainer}
				>
					<imagelabel ImageColor3={googleMaterial.outerBG} {...RectBG}>
						<frame {...Header} Size={new UDim2(1, 0, 0.15, 0)}>
							<imagelabel ImageColor3={googleMaterial.header} {...RectBG}>
								<textlabel
									Text={"Sword Shop"}
									TextStrokeTransparency={0.8}
									AnchorPoint={new Vector2(0.5, 0.05)}
									Position={new UDim2(0.5, 0, 0.05, 0)}
									Size={new UDim2(0.95, 0, 0.45, 0)}
									TextColor3={googleMaterial.headerFont}
									{...RectText}
									Font={"GothamBold"}
								></textlabel>
								<textlabel
									Text={this.props.currentPack}
									TextStrokeTransparency={0.8}
									AnchorPoint={new Vector2(0.5, 0.95)}
									Position={new UDim2(0.5, 0, 0.95, 0)}
									Size={new UDim2(0.95, 0, 0.45, 0)}
									TextColor3={googleMaterial.headerFont}
									{...RectText}
									Font={"GothamBold"}
								></textlabel>
								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>
						<frame
							{...RectContainer}
							Size={new UDim2(0.95, 0, 0.125, 0)}
							AnchorPoint={new Vector2(0.5, 0.2)}
							Position={new UDim2(0.5, 0, 0.2, 0)}
						>
							<uilistlayout
								FillDirection={Enum.FillDirection.Horizontal}
								HorizontalAlignment={Enum.HorizontalAlignment.Center}
								VerticalAlignment={Enum.VerticalAlignment.Center}
								Padding={new UDim(0.075, 0)}
								SortOrder={Enum.SortOrder.Name}
							></uilistlayout>
							{ObjectUtils.keys(PACK_INFO).map((packName) => {
								return (
									<RectButton
										Position={new UDim2(0, 0, 0, 0)}
										AnchorPoint={new Vector2(0, 0)}
										Size={new UDim2(0.275, 0, 0.95, 0)}
										ButtonText={packName.upper()}
										Callback={() => {
											this.props.switchPack(packName);
										}}
									></RectButton>
								);
							})}
						</frame>
						<frame
							{...Body}
							Size={new UDim2(0.95, 0, 0.55, 0)}
							Position={new UDim2(0.5, 0, 0.7, 0)}
							AnchorPoint={new Vector2(0.5, 0.7)}
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
									<uigridlayout Ref={this.gridRef} {...CardGridLayout}>
										<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
									</uigridlayout>
									{
										// Display all the cards using the CardInfo prop
										ObjectUtils.values(
											PACK_INFO[this.props.currentPack as keyof typeof PACK_INFO],
										).map((Item) => {
											return (
												<SwordShopItem
													Text={Item.Name}
													Percentage={
														RARITIES[this.props.currentPack as keyof typeof RARITIES][
															Item.Rarity as keyof typeof RARITIES.Alpha
														]
													}
													Model={this.modelsFolder?.WaitForChild(Item.Name, 10) as Model}
													Rarity={Item.Rarity}
												></SwordShopItem>
											);
										})
									}
								</scrollingframe>

								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>
						<RectButton
							Position={new UDim2(0.5, 0, 0.975, 0)}
							AnchorPoint={new Vector2(0.5, 0.975)}
							Size={new UDim2(0.25, 0, 0.2, 0)}
							ButtonText={tostring(PACK_PRICES[this.props.currentPack as keyof typeof PACK_PRICES])}
							Callback={() => {
								shopService.PurchasePack(this.props.currentPack);
							}}
						></RectButton>
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
	toggleShop: shopState;
	switchPack: shopState;
}

export = RoactRodux.connect(
	function (state: storeState) {
		const shopFrame = shopRef.getValue() as Frame;
		if (shopFrame && state.toggleShop.toggle !== oldFadeIn) {
			oldFadeIn = state.toggleShop.toggle;
			// Update the frame's position when the toggle changes
			state.toggleShop.toggle
				? movingFadeAbsolute(shopFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
				: movingFadeAbsolute(shopFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
		}

		return {
			toggle: state.toggleShop.toggle,
			currentPack: state.switchPack.currentPack,
		};
	},
	(dispatch) => {
		return {
			switchPack: (packName: string) => {
				dispatch({
					type: "switchPack",
					payload: { pack: packName },
				});
			},
		};
	},
)(Shop);
