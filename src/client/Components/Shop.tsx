import { shopState, INITIAL_STATE } from "../Rodux/Reducers/ShopReducer";
import Roact from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import Grid from "./Material/Grid";
import { MenuAspectRatio, RectContainer } from "../UIProperties/RectUI";
import { movingFade } from "../UIProperties/FrameEffects";

interface UIProps {
	items: Map<string, { Price: number; Model: Model | Tool }>;
	toggle: boolean;
}

const shopRef = Roact.createRef<Frame>();
let gridTree: Roact.Tree | undefined = undefined;
class Shop extends Roact.Component<UIProps> {
	constructor(props: UIProps) {
		super(props);
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
				<uiaspectratioconstraint {...MenuAspectRatio}></uiaspectratioconstraint>
			</frame>
		);
	}

	protected willUnmount(): void {
		gridTree = undefined;
	}
}

interface storeState {
	toggleShop: shopState;
	fetchItems: shopState;
}

export = RoactRodux.connect(function (state: storeState) {
	const shopFrame = shopRef.getValue() as Frame;
	if (shopFrame) {
		// Update the frame's position when the toggle changes
		state.toggleShop.toggle ? movingFade(shopFrame, true, 0.3) : movingFade(shopFrame, false, 0.3);
	}

	if (state.fetchItems.items && state.fetchItems.items.size() > 0 && !gridTree) {
		// Bit of a roundabout way to do this. Create the grid component after we fetch the items
		const newGrid = Roact.createElement(Grid, { Header: "Pet Shop", CardInfo: state.fetchItems.items });
		gridTree = Roact.mount(newGrid, shopFrame);
		print("Mounted the grid onto the shop!");
	}

	return {
		toggle: state.toggleShop.toggle,
		items: state.fetchItems.items,
	};
})(Shop);
