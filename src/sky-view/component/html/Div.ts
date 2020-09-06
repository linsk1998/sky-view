
import { HtmlComponent } from "../HtmlComponent";
import { Tag } from "../../render/Tag";
import { DivAttributes } from "../attributes";

export class Div extends HtmlComponent<HTMLDivElement>{

	constructor(props:DivAttributes,tags:Tag[]){
		if(!props.tagName) props.tagName="DIV";
		super(props,tags);
	}
}