import Roact from "@rbxts/roact";

interface UIProps {
	Name: string;
	Age: number;
	Gender: string;
}

const PersonTemplate = (props: UIProps) => {
	return (
		<frame
			Size={new UDim2(0.92, 0, 0.06, 0)}
			AnchorPoint={new Vector2(0.5, 0)}
			Position={new UDim2(0.5, 0, 0, 0)}
			BackgroundTransparency={1}
		>
			<imagelabel
				ZIndex={1}
				Size={new UDim2(1, 0, 1, 0)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				Image="http://www.roblox.com/asset/?id=5350360532"
				ImageColor3={Color3.fromRGB(200, 0, 0)}
				ScaleType={Enum.ScaleType.Slice}
				BackgroundTransparency={1}
				SliceCenter={new Rect(350, 350, 350, 350)}
			>
				<textlabel
					Text={string.format("%s | %s | %s", props.Name, props.Gender, tostring(props.Age))}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={new UDim2(0.5, 0, 0.5, 0)}
					TextColor3={new Color3(255, 255, 255)}
					Size={new UDim2(0.9, 0, 0.9, 0)}
					Font={"Gotham"}
					TextScaled={true}
					BackgroundTransparency={1}
					TextStrokeTransparency={0.8}
				></textlabel>
			</imagelabel>
			<imagelabel
				Image="http://www.roblox.com/asset/?id=5350360532"
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={0}
				Position={new UDim2(0.5, 0, 0.5, 3)}
				Size={new UDim2(1, 0, 1, 0)}
				ImageColor3={Color3.fromRGB(160, 0, 0)}
				BackgroundTransparency={1}
				ScaleType={Enum.ScaleType.Slice}
				SliceCenter={new Rect(350, 350, 350, 350)}
			></imagelabel>
		</frame>
	);
};

export default PersonTemplate;
