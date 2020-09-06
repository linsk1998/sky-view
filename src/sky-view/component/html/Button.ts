import { HtmlComponent } from "../HtmlComponent";
import { observable } from "../../reactive/object";
import { Tag } from "../../render/Tag";
import { ButtonAttributes } from "../attributes";

export class Button extends HtmlComponent<HTMLButtonElement>{
	public readonly type:string;
	constructor(props:ButtonAttributes,tags:Tag[]){
		if(!props.tagName) props.tagName="BUTTON";
		super(props,tags);
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