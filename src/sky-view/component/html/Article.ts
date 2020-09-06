import { ElementAttributes } from "../attributes";
import { HtmlComponent } from "../HtmlComponent";
import { Tag } from "../../render/Tag";


export class Article extends HtmlComponent<HTMLElement>{
	constructor(props:ElementAttributes,tags:Tag[]){
		if(!props.tagName) props.tagName="ARTICLE";
		super(props,tags);
	}
	get innerHTML(){
		return this.el.innerHTML;
	}
	set innerHTML(val:string){
		this.el.innerHTML=val;
	}
}