import { TweenService, Workspace } from "@rbxts/services";

const debounces = new Map<Instance, boolean>();

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

export const tweenPos = (frame: Frame | ImageLabel, direction: string, magnitude: number) => {
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
	pcall(() => {
		frame.TweenPosition(newPos, Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.15, true, undefined);
	});
};

export const tweenPosAbsolute = (frame: Frame | TextLabel | ImageLabel, position: UDim2) => {
	pcall(() => {
		frame.TweenPosition(position, Enum.EasingDirection.Out, Enum.EasingStyle.Quad, 0.15, true, undefined);
	});
};

// Tween the transparency of each of the children of an object
const tweenTransparencyRecurse = (children: Instance[], recurse: boolean, transparency: number) => {
	children.forEach((object: Instance) => {
		if ((object.Name !== "Shadow" || transparency !== 0) && object.Name !== "Badge") {
			if ((object.IsA("ImageLabel") || object.IsA("ImageButton")) && object.Name !== "ToggleShadow") {
				if (object.Name !== "Lock") {
					TweenService.Create(
						object,
						new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ ImageTransparency: transparency },
					).Play();
				} else {
					TweenService.Create(
						object,
						new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
						{ ImageTransparency: (transparency === 0 && 0.6) || 1 },
					).Play();
				}
			} else if (object.IsA("TextLabel")) {
				TweenService.Create(
					object,
					new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
					{ TextTransparency: transparency },
				).Play();
			} else if (object.IsA("ViewportFrame") || object.IsA("ScrollingFrame") || object.IsA("TextBox")) {
				object.Visible = transparency === 0;
			}

			if (recurse) {
				tweenTransparencyRecurse(object.GetChildren(), recurse, transparency);
			}
		}
	});
};

export const tweenTransparency = (frame: Frame | ImageLabel, recurse: boolean, fadeIn: boolean) => {
	let transparency = 0;

	if (fadeIn) {
		frame.Visible = true;
		transparency = 0;
	} else {
		transparency = 1;
	}

	const children = frame.GetChildren();
	if (recurse === true && frame.IsA("Frame")) {
		if (!fadeIn) {
			TweenService.Create(
				frame,
				new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0),
				{
					BackgroundTransparency: transparency,
				},
			).Play();
		}
		tweenTransparencyRecurse(children, recurse, transparency);
	} else if (frame.IsA("Frame")) {
		TweenService.Create(frame, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
			BackgroundTransparency: transparency,
		}).Play();
	} else if (!fadeIn && frame.IsA("ImageLabel")) {
		TweenService.Create(frame, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
			ImageTransparency: transparency,
		}).Play();
	}

	if (transparency === 1 && frame.Name !== "Card" && !fadeIn) {
		spawn(() => {
			wait(0.3);
			frame.Visible = false;
		});
	}
};

export const tweenTransparencyAbsolute = (object: ImageLabel | ImageButton | TextLabel, fadeIn: boolean) => {
	let transparency;

	if (fadeIn) {
		transparency = 0;
	} else {
		transparency = 1;
	}

	if (object.IsA("ImageLabel") || object.IsA("ImageButton")) {
		TweenService.Create(object, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
			ImageTransparency: transparency,
		}).Play();
	} else if (object.IsA("TextLabel")) {
		TweenService.Create(object, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
			TextTransparency: transparency,
		}).Play();
	}
};

const updateBlurEffect = (fadeIn: boolean, key: string) => {
	const camera = Workspace.CurrentCamera;
	if (camera) {
		let blur = camera.FindFirstChild(key) as BlurEffect;
		if (!blur) {
			blur = new Instance("BlurEffect", camera);
			blur.Name = key;
			blur.Parent = camera;
		}
		if (fadeIn) {
			blur.Size = 0;
			blur.Enabled = true;
		}
		TweenService.Create(blur, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
			Size: (fadeIn && 30) || 0,
		}).Play();
		if (!fadeIn) {
			coroutine.wrap(() => {
				wait(0.3);
				blur.Enabled = false;
				blur.Destroy();
			})();
		}
	}
};

export const movingFade = (frame: Frame | ImageLabel, fadeIn: boolean, magnitude: number, blurEffect: boolean) => {
	const state = debounces.get(frame);

	if (!state) {
		debounces.set(frame, true);
		const direction = fadeIn ? "Down" : "Up";
		// Add the blur effect
		if (blurEffect) {
			updateBlurEffect(fadeIn, frame.Name);
		}
		// Tween the frame
		tweenPos(frame, direction, magnitude);
		// Tween the transparency
		tweenTransparency(frame, true, fadeIn);
		debounces.set(frame, false);
	}
};

export const movingFadeAbsolute = (
	frame: Frame | ImageLabel,
	fadeIn: boolean,
	position: UDim2,
	blurEffect: boolean,
) => {
	const state = debounces.get(frame);

	if (!state) {
		debounces.set(frame, true);
		// Add the blur effect
		if (blurEffect) {
			updateBlurEffect(fadeIn, frame.Name);
		}
		// Tween the frame
		tweenPosAbsolute(frame, position);
		// Tween the transparency
		tweenTransparency(frame, true, fadeIn);
		debounces.set(frame, false);
	}
};

export const tweenRotation = (frame: Frame | TextLabel | ImageLabel, rotation: number) => {
	TweenService.Create(frame, new TweenInfo(0.2, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
		Rotation: rotation,
	}).Play();
};
