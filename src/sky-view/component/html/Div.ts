import { ElementProps } from "../ElementComponent";
import { HtmlComponent } from "../HtmlComponent";

type Align="left" | "right" | "center";
export interface DivProps extends ElementProps{
	align?:Align
}
export class Div extends HtmlComponent<HTMLDivElement>{

	constructor(props?:DivProps){
		if(!props.tagName) props.tagName="DIV";
		super(props);
	}
}