import Rodux from "@rbxts/rodux";
import Reducer from "./Reducers/CombinedReducers";

const store = new Rodux.Store(Reducer, {}, [Rodux.thunkMiddleware]);

export default store;
