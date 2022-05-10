import Roact, { Ref } from "@rbxts/roact";
import { registerListDynamicScrolling } from "../../UIProperties/DynamicScrolling";

interface UIProps {}

class PersonList extends Roact.Component<UIProps> {
	layoutRef;
	connections: RBXScriptConnection[];
	scrollingRef;
	constructor(props: UIProps) {
		super(props);
		this.layoutRef = Roact.createRef<UIListLayout>();
		this.scrollingRef = Roact.createRef<ScrollingFrame>();
		this.connections = [];
	}

	render() {
		return (
			<scrollingframe
				Key={"PersonList"}
				Size={new UDim2(0.2, 0, 0.793, 0)}
				Position={new UDim2(0.034, 0, 0.102, 0)}
				BackgroundTransparency={1}
				BorderSizePixel={0}
				Ref={this.scrollingRef}
			>
				<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 10)} Ref={this.layoutRef} />
			</scrollingframe>
		);
	}

	protected didMount(): void {
		const scrollingFrame = this.scrollingRef.getValue();
		const uiLayout = this.layoutRef.getValue();

		if (scrollingFrame && uiLayout) {
			const connection = registerListDynamicScrolling(scrollingFrame, uiLayout);
			this.connections.push(connection);
		}
	}

	protected willUnmount(): void {
		this.connections.forEach((connection) => {
			connection.Disconnect();
		});
		this.connections.clear();
	}
}

export default PersonList;
