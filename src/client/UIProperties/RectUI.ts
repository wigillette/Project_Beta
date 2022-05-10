export const RectBG: Partial<WritableInstanceProperties<ImageLabel>> = {
	Image: "http://www.roblox.com/asset/?id=5295627555",
	Position: new UDim2(0.5, 0, 0.5, 0),
	Size: new UDim2(1, 0, 1, 0),
	AnchorPoint: new Vector2(0.5, 0.5),
	ScaleType: Enum.ScaleType.Slice,
	SliceCenter: new Rect(10, 10, 10, 10),
	BackgroundTransparency: 1,
	ZIndex: 1,
};

export const Header: Partial<WritableInstanceProperties<ImageLabel>> = {
	BackgroundTransparency: 1,
	ZIndex: 2,
	Position: new UDim2(0.5, 0, 0, 0),
	Size: new UDim2(1, 0, 0.2, 0),
	AnchorPoint: new Vector2(0.5, 0),
};

export const Body: Partial<WritableInstanceProperties<ImageLabel>> = {
	AnchorPoint: new Vector2(0.5, 0.9),
	Position: new UDim2(0.5, 0, 0.9, 0),
	BackgroundTransparency: 1,
	ZIndex: 2,
	Size: new UDim2(0.95, 0, 0.75, 0),
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

export const SquareAspectRatio: Partial<WritableInstanceProperties<UIAspectRatioConstraint>> = {
	AspectRatio: 1,
	DominantAxis: Enum.DominantAxis.Width,
	AspectType: Enum.AspectType.ScaleWithParentSize,
};

export const MenuAspectRatio: Partial<WritableInstanceProperties<UIAspectRatioConstraint>> = {
	AspectRatio: 1.5,
	DominantAxis: Enum.DominantAxis.Width,
	AspectType: Enum.AspectType.ScaleWithParentSize,
};

export const ButtonAspectRatio: Partial<WritableInstanceProperties<UIAspectRatioConstraint>> = {
	AspectRatio: 4,
	DominantAxis: Enum.DominantAxis.Width,
	AspectType: Enum.AspectType.ScaleWithParentSize,
};

export const CardGridLayout: Partial<WritableInstanceProperties<UIGridLayout>> = {
	CellPadding: new UDim2(0.03, 0, 0.02, 0),
	CellSize: new UDim2(0.25, 0, 0.25, 0),
	FillDirectionMaxCells: 3,
	StartCorner: Enum.StartCorner.TopLeft,
	HorizontalAlignment: Enum.HorizontalAlignment.Center,
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
