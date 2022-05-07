import Roact from "@rbxts/roact";

const SnackbarContainer = () => {
	return (
		<frame
			Key={"Snackbar"}
			Size={new UDim2(0.2, 0, 0.1, 0)}
			AnchorPoint={new Vector2(0.5, 0.95)}
			Position={new UDim2(0.5, 0, 0.95, 0)}
			BackgroundTransparency={1}
		></frame>
	);
};

export default SnackbarContainer;
