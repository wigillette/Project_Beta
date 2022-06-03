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
} from "../../UIProperties/RectUI";
import { googleMaterial, gradientProperties, whiteGradientProperties } from "../../UIProperties/ColorSchemes";
import ObjectUtils from "@rbxts/object-utils";
import { registerGridDynamicScrolling } from "../../UIProperties/DynamicScrolling";
import SwordShopItem from "../Shop/SwordShopItem";
import { MarketplaceService, ReplicatedStorage, Players } from "@rbxts/services";
import RectButton from "../Material/RectButton";
import { VIP_INFO, PACK_PRICES, RARITIES } from "../../../shared/ShopData";

interface UIProps {
	toggle: boolean;
}

interface UIState {
	discount: boolean;
}

let oldFadeIn = true;
const shopRef = Roact.createRef<Frame>();
class VIPShop extends Roact.Component<UIProps, UIState> {
	containerRef;
	gridRef;
	scrollRef;
	connections: RBXScriptConnection[];
	modelsFolder = ReplicatedStorage.WaitForChild("ModelsFolder", 10);

	state = {
		discount: false,
	};

	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
		this.gridRef = Roact.createRef<UIGridLayout>();
		this.scrollRef = Roact.createRef<ScrollingFrame>();
		this.connections = [];
		spawn(() => {
			const response = pcall(() => {
				return MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, 8453352);
			});

			if (response[0]) {
				this.setState({ discount: response[1] });
			}
		});
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.4, 0, 0.5, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
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
									Text={"VIP Shop"}
									TextStrokeTransparency={0.8}
									AnchorPoint={new Vector2(0.5, 0.05)}
									Position={new UDim2(0.5, 0, 0.05, 0)}
									Size={new UDim2(0.95, 0, 0.9, 0)}
									TextColor3={googleMaterial.headerFont}
									{...RectText}
									Font={"GothamBold"}
								></textlabel>
								<uigradient {...gradientProperties}></uigradient>
							</imagelabel>
						</frame>

						<frame
							{...Body}
							Size={new UDim2(0.95, 0, 0.7, 0)}
							Position={new UDim2(0.5, 0, 0.55, 0)}
							AnchorPoint={new Vector2(0.5, 0.55)}
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
										ObjectUtils.values(VIP_INFO).map((Item) => {
											return (
												<SwordShopItem
													Text={Item.Name}
													Percentage={RARITIES.VIP[Item.Rarity as keyof typeof RARITIES.VIP]}
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
							ButtonText={
								(this.state.discount === true && tostring(math.floor(PACK_PRICES.VIP * 0.9))) ||
								tostring(PACK_PRICES.VIP)
							}
							Callback={() => {
								shopService.PurchasePack("VIP");
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

	protected didUpdate(previousProps: UIProps, previousState: UIState): void {
		if (this.props.toggle === true && previousProps.toggle !== this.props.toggle) {
			spawn(() => {
				const response = pcall(() => {
					return MarketplaceService.UserOwnsGamePassAsync(Players.LocalPlayer.UserId, 8453352);
				});

				if (response[0]) {
					this.setState({ discount: response[1] });
				}
			});
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
	toggleVIPShop: shopState;
}

export = RoactRodux.connect((state: storeState) => {
	const shopFrame = shopRef.getValue() as Frame;
	if (shopFrame && state.toggleVIPShop.vipToggle !== oldFadeIn) {
		oldFadeIn = state.toggleVIPShop.vipToggle;
		// Update the frame's position when the toggle changes
		state.toggleVIPShop.vipToggle
			? movingFadeAbsolute(shopFrame, true, new UDim2(0.5, 0, 0.4, 0), true)
			: movingFadeAbsolute(shopFrame, false, new UDim2(0.5, 0, 0.1, 0), true);
	}

	return {
		toggle: state.toggleVIPShop.vipToggle,
	};
})(VIPShop);
