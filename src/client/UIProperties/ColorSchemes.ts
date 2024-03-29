export const googleMaterial = {
	header: Color3.fromRGB(31, 140, 176),
	outerBG: Color3.fromRGB(255, 255, 255),
	innerBG: Color3.fromRGB(210, 210, 210),
	outerShadow: Color3.fromRGB(220, 220, 220),
	headerFont: Color3.fromRGB(255, 255, 255),
	buttonColor: Color3.fromRGB(99, 217, 255),
	buttonShadow: Color3.fromRGB(64, 194, 237),
	butttonFont: Color3.fromRGB(255, 255, 255),
	buttonHover: Color3.fromRGB(138, 227, 255),
	cardBG: Color3.fromRGB(240, 240, 240),
	cardShadow: Color3.fromRGB(200, 200, 200),
	cardFont: Color3.fromRGB(100, 100, 100),
	bgFont: Color3.fromRGB(80, 80, 80),
	innerBG2: Color3.fromRGB(230, 230, 230),
	darkCardBG: Color3.fromRGB(180, 180, 180),
	darkCardShadow: Color3.fromRGB(150, 150, 150),
	closeButtonColor: Color3.fromRGB(242, 69, 69),
	closeButtonHover: Color3.fromRGB(255, 128, 128),
	closeButtonShadow: Color3.fromRGB(194, 46, 46),
};

export const darkMaterial = {
	outerBG: Color3.fromRGB(24, 24, 24),
	outerShadow: Color3.fromRGB(0, 0, 0),
	header: Color3.fromRGB(33, 33, 33),
	innerBG: Color3.fromRGB(36, 37, 38),
	buttonColor: Color3.fromRGB(112, 166, 186),
	buttonShadow: Color3.fromRGB(107, 140, 153),
	butttonFont: Color3.fromRGB(255, 255, 255),
	buttonHover: Color3.fromRGB(138, 201, 222),
	headerFont: Color3.fromRGB(228, 230, 235),
	cardBG: Color3.fromRGB(54, 55, 56),
	cardShadow: Color3.fromRGB(44, 45, 46),
	cardFont: Color3.fromRGB(176, 179, 184),
	bgFont: Color3.fromRGB(255, 255, 255),
};

export const gradientProperties: Partial<WritableInstanceProperties<UIGradient>> = {
	Rotation: 90,
	Color: new ColorSequence(Color3.fromRGB(220, 220, 220), Color3.fromRGB(100, 100, 100)),
};

export const whiteGradientProperties: Partial<WritableInstanceProperties<UIGradient>> = {
	Rotation: 90,
	Color: new ColorSequence(Color3.fromRGB(255, 255, 255), Color3.fromRGB(240, 240, 240)),
};

export const mediumGradientProperties: Partial<WritableInstanceProperties<UIGradient>> = {
	Rotation: 90,
	Color: new ColorSequence(Color3.fromRGB(235, 235, 235), Color3.fromRGB(120, 120, 120)),
};
