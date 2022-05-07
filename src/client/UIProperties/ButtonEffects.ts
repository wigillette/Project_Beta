import Circle from "../Components/RippleCircle";
import Roact from "@rbxts/roact";
import { TweenService } from "@rbxts/services";

export const rippleEffect = (frame: Frame, mouse: Mouse) => {
	const newCircle = Roact.createElement(Circle, {
		xPos: mouse.X,
		yPos: mouse.Y,
		frame: frame,
	});

	coroutine.wrap(() => {
		// Mount the newCircle onto the label
		const tree = Roact.mount(newCircle, frame);
		wait(0.5);
		Roact.unmount(tree);
	})();
};

export const popText = (label: TextLabel, currentText: string, newText: string, time: number) => {
	coroutine.wrap(() => {
		label.Text = newText;
		wait(time);
		label.Text = currentText;
	})();
};

export const tweenColor = (button: ImageButton, newColor: Color3) => {
	TweenService.Create(button, new TweenInfo(0.3, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0), {
		ImageColor3: newColor,
	}).Play();
};
