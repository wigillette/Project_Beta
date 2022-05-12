import { RunService } from "@rbxts/services";

export default (frame: ViewportFrame, model: Model | Tool, camera: Camera) => {
	// Case: The model is a tool; put the tool in a model
	if (model.IsA("Tool")) {
		const par = new Instance("Model");
		par.Parent = model.Parent;
		const modelChildren = model.GetChildren();

		// Put all the children of the tool inside the model
		modelChildren.forEach((Child) => {
			if (Child.IsA("Part") || Child.IsA("UnionOperation") || Child.IsA("MeshPart")) {
				Child.Parent = par;
			}
		});

		// Destroy the tool object
		model.Destroy();

		// Make the handle the primary part and move the tool in standard position
		const handle = par.FindFirstChild("Handle");
		if (handle) {
			par.PrimaryPart = handle as BasePart;
			par.SetPrimaryPartCFrame(par.PrimaryPart.CFrame.mul(CFrame.Angles(math.rad(90), 0, 0)));
		}

		// Update the model to be the newly created model instance
		model = par;
	}

	// All the math calculations that I do not understand; basically it's just centering the model
	let currentAngle = 0;
	const modelBox = model.GetBoundingBox();
	let modelCF = modelBox[0];
	let modelSize = modelBox[1];

	camera.FieldOfView = 5;

	const rotInv = modelCF.sub(modelCF.Position).Inverse();
	modelCF = modelCF.mul(rotInv);
	modelSize = rotInv.mul(modelSize);
	modelSize = new Vector3(math.abs(modelSize.X), math.abs(modelSize.Y), math.abs(modelSize.Z));

	let diagonal = 0;
	const maxExtent = math.max(modelSize.X, modelSize.Y, modelSize.Z);
	const tan = math.tan(math.rad(camera.FieldOfView / 2));

	if (maxExtent === modelSize.X) {
		diagonal = math.sqrt(modelSize.Y * modelSize.Y + modelSize.Z * modelSize.Z) / 2;
	} else if (maxExtent === modelSize.Y) {
		diagonal = math.sqrt(modelSize.X * modelSize.X + modelSize.Z * modelSize.Z) / 2;
	} else {
		diagonal = math.sqrt(modelSize.X * modelSize.X + modelSize.Y * modelSize.Y) / 2;
	}

	const minDist = maxExtent / 2 / tan + diagonal;

	// Rotate the object on every frame
	let connection: RBXScriptConnection;

	coroutine.wrap(() => {
		connection = RunService.RenderStepped.Connect((dt) => {
			if (!model || model.GetChildren().size() <= 0) {
				connection.Disconnect();
			} else {
				currentAngle += 1 * dt * 60;
				camera.CFrame = modelCF
					.mul(CFrame.fromEulerAnglesYXZ(0, math.rad(currentAngle), 0))
					.mul(new CFrame(0, 0, minDist + 3));
			}
		});
	})();
};
