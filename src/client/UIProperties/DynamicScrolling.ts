export const registerDynamicScrollingFrame = (frame: ScrollingFrame, layout: UIListLayout) => {
	const absoluteContentSize = layout.AbsoluteContentSize;
	frame.CanvasSize = new UDim2(0, 0, 0, absoluteContentSize.Y);
	const connection = layout.GetPropertyChangedSignal("AbsoluteContentSize").Connect(() => {
		const absoluteContentSize = layout.AbsoluteContentSize;
		frame.CanvasSize = new UDim2(0, 0, 0, absoluteContentSize.Y);
	});

	return connection;
};
