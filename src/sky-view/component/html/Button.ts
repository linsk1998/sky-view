import { ElementComponent, ElementProps } from "../ElementComponent";
import { HtmlComponent } from "../HtmlComponent";
import { observable } from "../../reactive/object";

interface ButtonProps extends ElementProps{
	type:"button"|"submit"|"reset",
	disabled:boolean
}
export class Button extends HtmlComponent<HTMLButtonElement>{
	public readonly type:string;
	constructor(props:ButtonProps){
		if(!props.tagName) props.tagName="BUTTON";
		super(props);
		this.type=props.type;
	}
	@observable
	public get disabled(){
		return this.el.disabled;
	}
	public set disabled(val){
		this.el.disabled=val;
	}
}