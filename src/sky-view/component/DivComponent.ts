import { ElementComponent, ElementProps } from "./ElementComponent";

type Align="left" | "right" | "center";
interface DivProps extends ElementProps{
	align?:Align
}
export class DivComponent extends ElementComponent<HTMLDivElement>{

	constructor(props:DivProps){
		if(!props.tagName) props.tagName="DIV";
		super(props);
	}
}