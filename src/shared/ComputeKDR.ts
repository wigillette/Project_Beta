export default (kills: number, deaths: number) => {
	let ratio = 0;

	if (kills === 0 && deaths === 0) {
		ratio = 0;
	} else if (kills === 0 && deaths !== 0) {
		ratio = -deaths;
	} else if (kills !== 0 && deaths === 0) {
		ratio = kills;
	} else {
		ratio = kills / deaths;
	}

	const ratioString = tostring(ratio);
	const decimal = ratioString.find(".")[0];

	let toReturn = 0;
	if (decimal !== undefined) {
		const expandedDecimal = tonumber(ratioString.sub(1, decimal + 3));
		if (expandedDecimal !== undefined) {
			toReturn = expandedDecimal || ratio;
		}
	}

	return toReturn;
};
