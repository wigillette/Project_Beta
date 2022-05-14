export const CircBG: Partial<WritableInstanceProperties<ImageLabel>> = {
	Size: new UDim2(1, 0, 1, 0),
	AnchorPoint: new Vector2(0.5, 0.5),
	Position: new UDim2(0.5, 0, 0.5, 0),
	BackgroundTransparency: 1,
	ZIndex: 1,
	ScaleType: Enum.ScaleType.Slice,
	SliceCenter: new Rect(350, 350, 350, 350),
	Image: "rbxassetid://5350360532",
};

export const CircShadow: Partial<WritableInstanceProperties<ImageLabel>> = {
	...CircBG,
	Position: new UDim2(0.5, 0, 0.5, 3),
	ZIndex: 0,
};

export const CircText: Partial<WritableInstanceProperties<TextLabel>> = {
	Font: Enum.Font.Gotham,
	TextScaled: true,
	BackgroundTransparency: 1,
};

export const CircAspectRatio: Partial<WritableInstanceProperties<UIAspectRatioConstraint>> = {
	AspectRatio: 5,
	DominantAxis: Enum.DominantAxis.Width,
	AspectType: Enum.AspectType.ScaleWithParentSize,
};

export const CircContainer: Partial<WritableInstanceProperties<Frame>> = {
	BackgroundTransparency: 1,
};

export const SeparatorProperties: Partial<WritableInstanceProperties<Frame>> = {
	Size: new UDim2(0.005, 0, 1, 0),
	BorderSizePixel: 0,
	ZIndex: 2,
};
