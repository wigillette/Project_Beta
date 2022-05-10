import { RunService, UserInputService } from "@rbxts/services";

export const snap = (num: number, factor: number) => {
	return (factor === 0 && num) || math.ceil(num / factor) * factor;
};
