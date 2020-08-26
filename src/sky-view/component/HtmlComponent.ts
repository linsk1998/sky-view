import { ElementComponent, ElementProps } from "./ElementComponent";
import { direct } from "../reactive/object";

export class HtmlComponent<T extends HTMLElement=HTMLElement> extends ElementComponent<T>{
	protected props:ElementProps;
	@direct
	public readonly tagName:string;
	constructor(props:ElementProps){
		super(props);
		this.el=document.createElement(props.tagName) as any;
	}
}