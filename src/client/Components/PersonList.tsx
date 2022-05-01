import Roact from "@rbxts/roact";

const PersonList = () => {
	return (
		<scrollingframe
			Key={"PersonList"}
			Size={new UDim2(0.2, 0, 0.793, 0)}
			Position={new UDim2(0.034, 0, 0.102, 0)}
			BackgroundTransparency={1}
			BorderSizePixel={0}
		>
			<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 10)} />
		</scrollingframe>
	);
};

export default PersonList;
