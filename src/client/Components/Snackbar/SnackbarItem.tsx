import Roact from "@rbxts/roact";
import { CircText, CircShadow, CircBG, CircContainer, CircAspectRatio } from "client/UIProperties/CircularUI";
import { movingFade, tweenPos, tweenTransparency } from "client/UIProperties/FrameEffects";
import { googleMaterial, whiteGradientProperties } from "client/UIProperties/ColorSchemes";

interface UIProps {
	Alert: string;
	Index: number;
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
				Size={new UDim2(1, 0, 0.283, 0)}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={new UDim2(0.5, 0, 1.5, 0)}
				Ref={this.containerRef}
				Key={this.props.Index}
				Visible={false}
				{...CircContainer}
			>
				<uiaspectratioconstraint {...CircAspectRatio} AspectRatio={6}></uiaspectratioconstraint>
				<imagelabel ImageTransparency={1} ImageColor3={googleMaterial.outerBG} {...CircBG}>
					<textlabel
						Text={this.props.Alert}
						TextTransparency={1}
						AnchorPoint={new Vector2(0.5, 0.5)}
						Position={new UDim2(0.5, 0, 0.5, 0)}
						Size={new UDim2(0.9, 0, 0.9, 0)}
						TextColor3={googleMaterial.bgFont}
						{...CircText}
					></textlabel>
					<uigradient {...whiteGradientProperties}></uigradient>
				</imagelabel>
				<imagelabel ImageColor3={googleMaterial.outerShadow} ImageTransparency={1} {...CircShadow}></imagelabel>
			</frame>
		);
	}

	private popItem(): void {
		// Tween the notification up and hide it; destroy the notification
		const container = this.containerRef.getValue();

		if (container) {
			movingFade(container, false, 0.5, false);
			wait(0.5);
			container.Destroy();
		}
	}

	private pushItem(): void {
		// Tween the notification up and make it visible to the viwewer
		const container = this.containerRef.getValue();
		if (container) {
			movingFade(container, true, -0.5, false);
		}
	}

	protected didMount(): void {
		this.pushItem();
	}

	public getContainerRef() {
		return this.containerRef.getValue();
	}

	protected willUnmount(): void {
		// Pop this notification if a new one is incoming
		this.popItem();
	}
}

export default SnackbarItem;
