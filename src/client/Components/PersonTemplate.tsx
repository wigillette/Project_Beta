import Roact from "@rbxts/roact";
import { TweenService } from "@rbxts/services";
import Circle from "./Circle";

interface UIProps {
	Name: string;
	Age: number;
	Gender: string;
}

class PersonTemplate extends Roact.Component<UIProps> {
	labelRef;
	buttonRef;
	frameRef;
	constructor(props: UIProps) {
		super(props);
		this.labelRef = Roact.createRef<TextLabel>();
		this.buttonRef = Roact.createRef<ImageButton>();
		this.frameRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Size={new UDim2(0.92, 0, 0.06, 0)}
				AnchorPoint={new Vector2(0.5, 0)}
				Position={new UDim2(0.5, 0, 0, 0)}
				BackgroundTransparency={1}
			>
				<imagelabel
					ZIndex={1}
					Size={new UDim2(1, 0, 1, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					Image="http://www.roblox.com/asset/?id=5350360532"
					ImageColor3={Color3.fromRGB(200, 0, 0)}
					ScaleType={Enum.ScaleType.Slice}
					BackgroundTransparency={1}
					SliceCenter={new Rect(350, 350, 350, 350)}
				>
					<textlabel
						Text={string.format(
							"%s | %s | %s",
							this.props.Name,
							this.props.Gender,
							tostring(this.props.Age),
						)}
						AnchorPoint={new Vector2(0.5, 0.05)}
						Position={new UDim2(0.5, 0, 0.05, 0)}
						TextColor3={Color3.fromRGB(255, 255, 255)}
						Size={new UDim2(0.9, 0, 0.45, 0)}
						Font={"Gotham"}
						TextScaled={true}
						BackgroundTransparency={1}
						TextStrokeTransparency={0.8}
					></textlabel>

					<frame
						Size={new UDim2(0.4, 0, 0.4, 0)}
						AnchorPoint={new Vector2(0.5, 0.95)}
						Position={new UDim2(0.5, 0, 0.95, 0)}
						BackgroundTransparency={1}
						Ref={this.frameRef}
						ClipsDescendants={true}
					>
						<imagebutton
							Image="http://www.roblox.com/asset/?id=5350360532"
							ImageColor3={Color3.fromRGB(120, 120, 120)}
							Position={new UDim2(0.5, 0, 0.5, 0)}
							Size={new UDim2(1, 0, 1, 0)}
							AnchorPoint={new Vector2(0.5, 0.5)}
							ScaleType={Enum.ScaleType.Slice}
							SliceCenter={new Rect(350, 350, 350, 350)}
							BackgroundTransparency={1}
							ZIndex={1}
							Ref={this.buttonRef}
							Event={{
								MouseButton1Down: (rbx, x, y) => {
									const label = this.labelRef.getValue();
									const frame = this.frameRef.getValue();
									if (label && frame) {
										coroutine.wrap(() => {
											label.Text = tostring(100 - this.props.Age);
											wait(2);
											label.Text = "Press Here";
										})();
										const newCircle = Roact.createElement(Circle, {
											xPos: x,
											yPos: y,
											frame: frame,
										});

										coroutine.wrap(() => {
											// Mount the newCircle onto the label
											const tree = Roact.mount(newCircle, frame);
											wait(0.5);
											Roact.unmount(tree);
										})();
									}
								},
								MouseEnter: (rbx, x, y) => {
									const button = this.buttonRef.getValue();
									if (button) {
										TweenService.Create(
											button,
											new TweenInfo(
												0.3,
												Enum.EasingStyle.Quad,
												Enum.EasingDirection.Out,
												0,
												false,
												0,
											),
											{ ImageColor3: Color3.fromRGB(160, 160, 160) },
										).Play();
									} else {
										print("NULL");
									}
								},
								MouseLeave: (rbx, x, y) => {
									const button = this.buttonRef.getValue();
									if (button) {
										TweenService.Create(
											button,
											new TweenInfo(
												0.3,
												Enum.EasingStyle.Quad,
												Enum.EasingDirection.Out,
												0,
												false,
												0,
											),
											{ ImageColor3: Color3.fromRGB(120, 120, 120) },
										).Play();
									}
								},
							}}
						>
							<textlabel
								Ref={this.labelRef}
								Text={"Press Here"}
								AnchorPoint={new Vector2(0.5, 0.5)}
								Position={new UDim2(0.5, 0, 0.5, 0)}
								TextColor3={new Color3(255, 255, 255)}
								Size={new UDim2(0.95, 0, 0.95, 0)}
								Font={"Gotham"}
								TextScaled={true}
								BackgroundTransparency={1}
								TextStrokeTransparency={0.8}
							></textlabel>
						</imagebutton>
						<imagelabel
							Image="http://www.roblox.com/asset/?id=5350360532"
							ImageColor3={Color3.fromRGB(80, 80, 80)}
							Position={new UDim2(0.5, 0, 0.5, 3)}
							Size={new UDim2(1, 0, 1, 0)}
							ZIndex={0}
							AnchorPoint={new Vector2(0.5, 0.5)}
							ScaleType={Enum.ScaleType.Slice}
							SliceCenter={new Rect(350, 350, 350, 350)}
							BackgroundTransparency={1}
						></imagelabel>
					</frame>
				</imagelabel>
				<imagelabel
					Image="http://www.roblox.com/asset/?id=5350360532"
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={0}
					Position={new UDim2(0.5, 0, 0.5, 3)}
					Size={new UDim2(1, 0, 1, 0)}
					ImageColor3={Color3.fromRGB(160, 0, 0)}
					BackgroundTransparency={1}
					ScaleType={Enum.ScaleType.Slice}
					SliceCenter={new Rect(350, 350, 350, 350)}
				></imagelabel>
			</frame>
		);
	}
}

export default PersonTemplate;
