export const INITIAL_CAMERA = new CFrame(235.237, 75.531, -295.77);

export const INTRO_CAMERAS = [
	[
		new CFrame(271.044, 82.454, -261.07),
		new CFrame(260.106, 74.148, -221).mul(CFrame.Angles(math.rad(15), math.rad(5), math.rad(15))),
	],
	[
		new CFrame(-311.863, 122.87, -262.671),
		new CFrame(-394.844, 110.381, -163.485).mul(CFrame.Angles(math.rad(10), math.rad(5), math.rad(20))),
	],
	[
		new CFrame(229.929, 104.687, -271.752),
		new CFrame(192.798, 98.784, -233.283).mul(CFrame.Angles(math.rad(25), math.rad(20), math.rad(5))),
	],
	[
		new CFrame(226.655, 83.181, -314.836),
		new CFrame(232.813, 77.396, -236.424).mul(CFrame.Angles(math.rad(5), math.rad(25), math.rad(15))),
	],
];

export const TRANSITION_INFO = new TweenInfo(6, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
export const BLACKOUT_INFO = new TweenInfo(1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, false, 0);
