export const INITIAL_CAMERA = new CFrame(-36.7, 34.764, 13.1);

export const INTRO_CAMERAS = [
	[
		new CFrame(36.506, 76.048, 4.292),
		new CFrame(36.506, 45.248, 26.792).mul(CFrame.Angles(math.rad(10), math.rad(5), math.rad(20))),
	],
	[
		new CFrame(11.706, 71.248, 33.092),
		new CFrame(0.106, 63.148, 74.592).mul(CFrame.Angles(math.rad(15), math.rad(5), math.rad(15))),
	],
	[
		new CFrame(64.306, 59.848, 80.792),
		new CFrame(4.506, 69.648, 98.392).mul(CFrame.Angles(math.rad(25), math.rad(20), math.rad(5))),
	],
	[
		new CFrame(100.605, 49.048, 47.092),
		new CFrame(76.205, 45.048, 94.692).mul(CFrame.Angles(math.rad(5), math.rad(25), math.rad(15))),
	],
];

export const TRANSITION_INFO = new TweenInfo(6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
export const BLACKOUT_INFO = new TweenInfo(1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
