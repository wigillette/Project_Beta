export const RectBG: Partial<WritableInstanceProperties<ImageLabel>> = {
	Image: "http://www.roblox.com/asset/?id=5350360532",
	Position: new UDim2(0.5, 0, 0.5, 0),
	Size: new UDim2(1, 0, 1, 0),
	AnchorPoint: new Vector2(0.5, 0.5),
	ScaleType: Enum.ScaleType.Slice,
	SliceCenter: new Rect(350, 350, 350, 350),
	BackgroundTransparency: 1,
	ZIndex: 1,
};

export const RectShadow: Partial<WritableInstanceProperties<ImageLabel>> = {
	...RectBG,
	Position: new UDim2(0.5, 0, 0.5, 3),
	ZIndex: 0,
};

export const RectText: Partial<WritableInstanceProperties<TextLabel>> = {
	Font: Enum.Font.Gotham,
	TextScaled: true,
	BackgroundTransparency: 1,
};

export const RectButtonText: Partial<WritableInstanceProperties<TextLabel>> = {
	AnchorPoint: new Vector2(0.5, 0.5),
	Position: new UDim2(0.5, 0, 0.5, 0),
	Size: new UDim2(0.95, 0, 0.95, 0),
	Font: Enum.Font.Gotham,
	TextScaled: true,
	BackgroundTransparency: 1,
};

export const RippleFrame: Partial<WritableInstanceProperties<Frame>> = {
	BackgroundTransparency: 1,
	ClipsDescendants: true,
};

export const RectContainer: Partial<WritableInstanceProperties<Frame>> = {
	BackgroundTransparency: 1,
};
