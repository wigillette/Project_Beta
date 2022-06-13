import Roact, { Tree } from "@rbxts/roact";
import RoactRodux from "@rbxts/roact-rodux";
import { playSound } from "client/UIProperties/ButtonEffects";
import { RectContainer, SquareAspectRatio } from "client/UIProperties/RectUI";
import hoverNotification from "./HoverNotification";

interface UIProps {
	ping: number;
}

class Ping extends Roact.Component<UIProps> {
	hoverNotificationTree: Tree | undefined;
	frameRef;
	constructor(props: UIProps) {
		super(props);
		this.frameRef = Roact.createRef<Frame>();
		this.hoverNotificationTree = undefined;
	}

	render() {
		return (
			<frame
				{...RectContainer}
				Size={new UDim2(0.025, 0, 0.075, 0)}
				Position={new UDim2(0.975, 0, 0.9, 0)}
				AnchorPoint={new Vector2(0.975, 0.9)}
				Ref={this.frameRef}
			>
				<imagelabel
					{...RectContainer}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Size={new UDim2(0.95, 0, 0.95, 0)}
					Image={
						(this.props.ping < 100 && "rbxassetid://5041682950") ||
						(this.props.ping < 200 && "rbxassetid://5041685696") ||
						"rbxassetid://5041684837"
					}
					Event={{
						MouseEnter: (rbx) => {
							playSound("Hover");
							const frame = this.frameRef.getValue();
							if (frame) {
								const hoverElement = Roact.createElement(hoverNotification, {
									text: tostring(`${this.props.ping} ms`),
									isRotation: false,
								});
								this.hoverNotificationTree = Roact.mount(hoverElement, frame);
							}
						},
						MouseLeave: (rbx) => {
							if (this.hoverNotificationTree) {
								Roact.unmount(this.hoverNotificationTree);
								this.hoverNotificationTree = undefined;
							}
						},
					}}
				></imagelabel>
				<uiaspectratioconstraint {...SquareAspectRatio}></uiaspectratioconstraint>
			</frame>
		);
	}

	protected didUpdate(previousProps: UIProps, previousState: {}): void {
		if (previousProps.ping !== this.props.ping) {
			const frame = this.frameRef.getValue();
			if (frame) {
				const notificationFrame = frame.FindFirstChild("HoverNotification", true);
				if (notificationFrame) {
					const pingLabel = notificationFrame.FindFirstChild("HoverLabel", true) as TextLabel;
					if (pingLabel) {
						pingLabel.Text = tostring(`${this.props.ping} ms`);
					}
				}
			}
		}
	}
}

interface pingState {
	updatePing: { ping: number };
}

export = RoactRodux.connect((state: pingState) => {
	return {
		ping: state.updatePing.ping,
	};
})(Ping);
