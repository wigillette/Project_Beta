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
	let magnitudes = [0, 0];
	switch (direction) {
		case "Up":
			magnitudes = [0, -magnitude];
			break;
		case "Down":
			magnitudes = [0, magnitude];
			break;
		case "Left":
			magnitudes = [-magnitude, 0];
			break;
		case "Right":
			magnitudes = [magnitude, 0];
			break;
	}

	newPos = UDim2.fromScale(frame.Position.X.Scale + magnitudes[0], frame.Position.Y.Scale + magnitudes[1]);
	frame.TweenPosition(newPos, Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.2, true, undefined);
};

export const tweenPosAbsolute = (frame: Frame, position: UDim2) => {
	frame.TweenPosition(position, Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.2, true, undefined);
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
		} else if (object.IsA("ViewportFrame")) {
			object.Visible = transparency === 0;
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

export const tweenTransparencyAbsolute = (object: ImageLabel | ImageButton | TextLabel, fadeIn: boolean) => {
	let transparency;

	if (fadeIn) {
		transparency = 0;
	} else {
		transparency = 1;
	}

	if (object.IsA("ImageLabel") || object.IsA("ImageButton")) {
		TweenService.Create(object, new TweenInfo(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
			ImageTransparency: transparency,
		}).Play();
	} else if (object.IsA("TextLabel")) {
		TweenService.Create(object, new TweenInfo(0.4, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
			TextTransparency: transparency,
		}).Play();
	}
};

export const movingFade = (frame: Frame, fadeIn: boolean, magnitude: number) => {
	const direction = fadeIn ? "Down" : "Up";
	tweenPos(frame, direction, magnitude);
	tweenTransparency(frame, true, fadeIn);
};
