import { ElementProps } from "../ElementComponent";
import { HtmlComponent } from "../HtmlComponent";


export class Article extends HtmlComponent<HTMLElement>{
	constructor(props:ElementProps){
		if(!props.tagName) props.tagName="ARTICLE";
		super(props);
	}
	get innerHTML(){
		return this.el.innerHTML;
	}
	set innerHTML(val:string){
		this.el.innerHTML=val;
	}
}