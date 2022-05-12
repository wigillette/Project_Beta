import Roact from "@rbxts/roact";
import { CircText, CircShadow, CircBG, CircContainer, CircAspectRatio } from "client/UIProperties/CircularUI";
import { tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	Alert: string;
}

class SnackbarItem extends Roact.Component<UIProps> {
	containerRef;
	constructor(props: UIProps) {
		super(props);
		this.containerRef = Roact.createRef<Frame>();
	}

	render() {
		return (
			<frame
				Size={new UDim2(1, 0, 1, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 1.5, 0)}
				Ref={this.containerRef}
				{...CircContainer}
			>
				<uiaspectratioconstraint {...CircAspectRatio}></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...CircBG}>
					<textlabel
						Text={this.props.Alert}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.95, 0, 0.95, 0)}
						TextColor3={googleMaterial.bgFont}
						{...CircText}
					></textlabel>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} {...CircShadow}></imagelabel>
			</frame>
		);
	}

	private popItem(): void {
		// Tween the notification up and hide it; destroy the notification
		const container = this.containerRef.getValue();

		if (container) {
			tweenPos(container, "Up", 1.5);
			tweenTransparency(container, true, false);
			wait(0.4);
			container.Visible = false;
			container.Destroy();
		}
	}

	private pushItem(): void {
		// Tween the notification up and make it visible to the viwewer
		const container = this.containerRef.getValue();
		if (container) {
			container.Visible = true;
			tweenTransparency(container, true, true);
			tweenPos(container, "Up", 1);
		}
	}

	private setUpItem(): void {
		// Make the notification invisible to start
		const container = this.containerRef.getValue();
		if (container) {
			tweenTransparency(container, true, false);
			container.Visible = false;
		}
	}

	protected didMount(): void {
		// Animate the notification when it is mounted to the view
		const container = this.containerRef.getValue();

		if (container) {
			coroutine.wrap(() => {
				this.setUpItem();
				wait(0.6);
				this.pushItem();
				wait(0.75);
				this.popItem();
			})();
		}
	}

	protected willUnmount(): void {
		// Pop this notification if a new one is incoming
		this.popItem();
	}
}

export default SnackbarItem;
