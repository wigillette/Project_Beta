export const SSProperties: Partial<WritableInstanceProperties<ImageLabel>> = {
	Image: "http://www.roblox.com/asset/?id=5280172046",
	Position: new UDim2(0.5, 0, 0.5, 0),
	Size: new UDim2(1, 0, 1, 0),
	AnchorPoint: new Vector2(0.5, 0.5),
	BackgroundTransparency: 1,
	ZIndex: 2,
};

export const CircleBG: Partial<WritableInstanceProperties<ImageLabel>> = {
	Image: "rbxassetid://9603519179",
	Position: new UDim2(0.5, 0, 0.5, 0),
	Size: new UDim2(1, 0, 1, 0),
	AnchorPoint: new Vector2(0.5, 0.5),
	BackgroundTransparency: 1,
	ZIndex: 1,
};

export const circleSSProperties = {
	sheetSize: [1024, 1024],
	spriteSize: [128, 128],
	spriteAmt: 64,
	grid: [8, 8],
};

export const runSpriteSheet = (
	image: ImageLabel,
	progressLabel: TextLabel,
	ratio: number,
	spriteAmt: number,
	spriteSize: number[],
	grid: number[],
	cap: number,
) => {
	// Sprite Sheet Size: dimensions of the entire sheet
	// Individual Sprite Size: dimensions of each sprite
	// Total Sprite Amount: how many sprites are on the page
	// ratio: percentage of spritesheet to use
	// grid: size of each image
	const circlePercent = math.round(ratio * spriteAmt);
	image.ImageRectSize = new Vector2(spriteSize[0], spriteSize[1]);

	coroutine.wrap(() => {
		for (let i = 0; i < circlePercent + 1; i++) {
			image.ImageRectOffset = new Vector2(
				((i - 1) % grid[1]) * spriteSize[1],
				math.floor((i - 1) / grid[0]) * spriteSize[0],
			);
			progressLabel.Text = `${math.floor(ratio * cap)}/${cap}`;
			wait(0.0075);
		}
	})();
};
