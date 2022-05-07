import Roact from "@rbxts/roact";
import { TweenService } from "@rbxts/services";

interface UIProps {
	xPos: number;
	yPos: number;
	frame: Frame;
}

class Circle extends Roact.Component<UIProps> {
	circleRef;
	constructor(props: UIProps) {
		super(props);

		this.circleRef = Roact.createRef<ImageLabel>();
	}
	render() {
		return (
			<imagelabel
				Key={"Circle"}
				Size={new UDim2(0, 0, 0, 0)}
				Position={new UDim2(0, 0, 0, 0)}
				BackgroundTransparency={1}
				ImageTransparency={0.6}
				ScaleType={"Stretch"}
				ZIndex={10}
				ImageColor3={Color3.fromRGB(200, 200, 200)}
				Ref={this.circleRef}
				Image={"rbxassetid://266543268"}
			></imagelabel>
		);
	}

	didMount() {
		const circle = this.circleRef.getValue();
		const frame = this.props.frame;
		if (circle && frame) {
			coroutine.wrap(() => {
				const newX = this.props.xPos - circle.AbsolutePosition.X;
				const newY = this.props.yPos - circle.AbsolutePosition.Y;
				circle.Position = new UDim2(0, newX, 0, newY);
				let size = 0;
				if (frame.AbsoluteSize.X > frame.AbsoluteSize.Y) {
					size = frame.AbsoluteSize.X * 1.5;
				} else if (frame.AbsoluteSize.X < frame.AbsoluteSize.Y) {
					size = frame.AbsoluteSize.Y * 1.5;
				} else {
					size = frame.AbsoluteSize.X * 1.5;
				}

				const time = 0.5;
				circle.TweenSizeAndPosition(
					new UDim2(0, size, 0, size),
					new UDim2(0.5, -size / 2, 0.5, -size / 2),
					"Out",
					"Quad",
					time,
					false,
					undefined,
				);
				TweenService.Create(
					circle,
					new TweenInfo(time, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ ImageTransparency: 1 },
				).Play();
				wait(time);
				circle.Destroy();
			})();
		}
	}
}

export default Circle;
