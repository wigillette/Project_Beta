import Roact from "@rbxts/roact";
import { TweenService } from "@rbxts/services";

export const tweenSize = (frame: Frame, size: UDim2) => {
	const popSize: UDim2 = new UDim2(size.X.Scale, size.X.Offset + 10, size.Y.Scale, size.Y.Offset + 10);
	coroutine.wrap(() => {
		// Enlarge the frame first for effects
		frame.TweenSize(popSize, Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.15, true, undefined);
		wait(0.15);
		// Tween back to normal size
		frame.TweenSize(size, Enum.EasingDirection.In, Enum.EasingStyle.Quad, 0.2, true, undefined);
	})();
};

export const tweenPos = (frame: Frame, direction: string, magnitude: number) => {
	let newPos: UDim2 = frame.Position;
	switch (direction) {
		case "Up":
			newPos = new UDim2(
				frame.Position.X.Scale,
				frame.Position.X.Offset,
				frame.Position.Y.Scale - magnitude,
				frame.Position.Y.Offset,
			);
			break;
		case "Down":
			newPos = new UDim2(
				frame.Position.X.Scale,
				frame.Position.X.Offset,
				frame.Position.Y.Scale + magnitude,
				frame.Position.Y.Offset,
			);
			break;
		case "Left":
			newPos = new UDim2(
				frame.Position.X.Scale - magnitude,
				frame.Position.X.Offset,
				frame.Position.Y.Scale,
				frame.Position.Y.Offset,
			);
			break;
		case "Right":
			newPos = new UDim2(
				frame.Position.X.Scale + magnitude,
				frame.Position.X.Offset,
				frame.Position.Y.Scale,
				frame.Position.Y.Offset,
			);
			break;
	}

	frame.TweenPosition(newPos, Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 1, true, undefined);
};

// Tween the transparency of each of the children of an object
const tweenTransparencyRecurse = (children: Instance[], recurse: boolean, transparency: number) => {
	children.forEach((object: Instance) => {
		if (object.IsA("ImageLabel") || object.IsA("ImageButton")) {
			TweenService.Create(
				object,
				new TweenInfo(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
				{ ImageTransparency: transparency },
			).Play();
		} else if (object.IsA("TextLabel")) {
			TweenService.Create(
				object,
				new TweenInfo(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
				{ TextTransparency: transparency },
			).Play();
		}

		if (recurse) {
			tweenTransparencyRecurse(object.GetChildren(), recurse, transparency);
		}
	});
};

export const tweenTransparency = (frame: Frame, recurse: boolean, fadeIn: boolean) => {
	let transparency;

	if (fadeIn) {
		transparency = 0;
	} else {
		transparency = 1;
	}

	const children = frame.GetChildren();
	tweenTransparencyRecurse(children, recurse, transparency);
};
