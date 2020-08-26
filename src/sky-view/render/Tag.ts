import { ComponentConstructor } from "./ComponentConstructor";

export class Tag{
	component:ComponentConstructor;
	children:Tag[];
	props:any
}
