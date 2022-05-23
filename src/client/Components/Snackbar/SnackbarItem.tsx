import Roact from "@rbxts/roact";
import { CircText, CircShadow, CircBG, CircContainer, CircAspectRatio } from "client/UIProperties/CircularUI";
import { movingFade, tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";
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
				Position={new UDim2(0.5, 0, 1, 0)}
				Ref={this.containerRef}
				{...CircContainer}
			>
				<uiaspectratioconstraint {...CircAspectRatio}></uiaspectratioconstraint>
				<imagelabel ImageColor3={googleMaterial.outerBG} {...CircBG}>
					<textlabel
						Text={this.props.Alert}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.9, 0, 0.9, 0)}
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
			movingFade(container, false, -0.5, false);
		}
	}

	private pushItem(): void {
		// Tween the notification up and make it visible to the viwewer
		const container = this.containerRef.getValue();
		if (container) {
			container.Visible = true;
			movingFade(container, true, -0.5, false);
		}
	}

	private setUpItem(): void {
		// Make the notification invisible to start
		const container = this.containerRef.getValue();
		if (container) {
			container.Visible = false;
			tweenTransparency(container, true, false);
		}
	}

	protected didMount(): void {
		// Animate the notification when it is mounted to the view
		const container = this.containerRef.getValue();

		if (container) {
			coroutine.wrap(() => {
				this.setUpItem();
				wait(0.4);
				this.pushItem();
				wait(2.5);
				this.popItem();
			})();
		}
	}

	protected willUnmount(): void {
		// Pop this notification if a new one is incoming
		this.popItem();
		wait(0.4);
	}
}

export default SnackbarItem;
