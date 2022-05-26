export default (kills: number, deaths: number) => {
	const ratio =
		(kills === 0 && deaths === 0 && 0) ||
		(kills === 0 && deaths !== 0 && -deaths) ||
		(kills !== 0 && deaths === 0 && kills) ||
		kills / deaths;
	const kdrstring =
		(tostring(ratio).find(".")[0] !== undefined &&
			tostring(ratio).find(".")[0] &&
			tonumber(tostring(ratio).sub(1, (tostring(ratio).find(".")[0] as number) + 3))) ||
		ratio;

	return kdrstring;
};

/*
    local KDR = {}

function KDR.calculateKDR(kills, deaths)
	local ratio = (kills == 0 and deaths == 0 and 0) or (kills == 0 and deaths ~= 0 and -deaths) or (kills ~= 0 and deaths == 0 and kills) or (kills/deaths)
	local kdrstring = tostring(ratio):find('.') and tonumber(tostring(ratio):sub(1, tostring(ratio):find('.')+3)) or ratio
	
	return kdrstring
end

return KDR

*/
