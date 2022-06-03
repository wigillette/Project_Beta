export const PACK_PRICES = {
	Alpha: 150,
	Beta: 500,
	Gamma: 1000,
	VIP: 1500,
};

export const RARITIES = {
	Alpha: {
		Common: 20,
		Uncommon: 15,
		Rare: 5,
		Epic: 3,
		Legendary: 2,
	},
	Beta: {
		Common: 20,
		Uncommon: 18,
		Rare: 12,
		Epic: 7,
		Legendary: 4,
	},
	Gamma: {
		Common: 16,
		Uncommon: 14,
		Rare: 11,
		Epic: 9,
		Legendary: 5,
	},
	VIP: {
		Common: 0,
		Uncommon: 0,
		Rare: 14, // 28
		Epic: 12, // 48
		Legendary: 8, // 24
	},
};

export const RARITY_COLORS = {
	Common: Color3.fromRGB(255, 165, 0),
	Uncommon: Color3.fromRGB(255, 255, 0),
	Rare: Color3.fromRGB(0, 0, 139),
	Epic: Color3.fromRGB(238, 75, 43),
	Legendary: Color3.fromRGB(34, 139, 34),
};

export const VIP_INFO = [
	{
		Name: "Demonslayer",
		Rarity: "Rare",
	},
	{
		Name: "Twilight",
		Rarity: "Rare",
	},
	{
		Name: "Faerie",
		Rarity: "Epic",
	},
	{
		Name: "Valkyrie",
		Rarity: "Epic",
	},
	{
		Name: "Illumina",
		Rarity: "Epic",
	},
	{
		Name: "Leviathan",
		Rarity: "Epic",
	},
	{
		Name: "Falchion",
		Rarity: "Legendary",
	},
	{
		Name: "Windforce",
		Rarity: "Legendary",
	},
	{
		Name: "Lightbringer",
		Rarity: "Legendary",
	},
];

export const PACK_INFO = {
	Alpha: [
		{
			Name: "4D",
			Rarity: "Common",
		},
		{
			Name: "Abyss",
			Rarity: "Common",
		},
		{
			Name: "Colossal",
			Rarity: "Common",
		},
		{
			Name: "Cupid",
			Rarity: "Uncommon",
		},

		{
			Name: "Darkheart",
			Rarity: "Uncommon",
		},

		{
			Name: "Demonslayer",
			Rarity: "Rare",
		},
		{
			Name: "Faerie",
			Rarity: "Epic",
		},
		{
			Name: "Falchion",
			Rarity: "Legendary",
		},
	],
	Beta: [
		{
			Name: "Firebrand",
			Rarity: "Common",
		},
		{
			Name: "Fortune",
			Rarity: "Common",
		},
		{
			Name: "Frostbite",
			Rarity: "Uncommon",
		},
		{
			Name: "Ghostwalker",
			Rarity: "Rare",
		},
		{
			Name: "Harbinger",
			Rarity: "Rare",
		},
		{
			Name: "Illumina",
			Rarity: "Epic",
		},
		{
			Name: "Leviathan",
			Rarity: "Epic",
		},
		{
			Name: "Lightbringer",
			Rarity: "Legendary",
		},
	],
	Gamma: [
		{
			Name: "Moonslayer",
			Rarity: "Common",
		},
		{
			Name: "Spolosion",
			Rarity: "Uncommon",
		},
		{
			Name: "Starlight",
			Rarity: "Uncommon",
		},
		{
			Name: "Stormbringer",
			Rarity: "Rare",
		},
		{
			Name: "Teargas",
			Rarity: "Rare",
		},
		{
			Name: "Twilight",
			Rarity: "Rare",
		},
		{
			Name: "Valkyrie",
			Rarity: "Epic",
		},
		{
			Name: "Venomshank",
			Rarity: "Epic",
		},
		{
			Name: "Windforce",
			Rarity: "Legendary",
		},
	],
};
