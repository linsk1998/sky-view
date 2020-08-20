import { ElementComponent, ElementProps } from "./ElementComponent";
import { computed } from "../reactive/object";


export class ArticleComponent extends ElementComponent<HTMLElement>{
	constructor(props:ElementProps){
		if(!props.tagName) props.tagName="ARTICLE";
		super(props);
	}
	@computed
	get innerHTML(){
		return this.el.innerHTML;
	}
	set innerHTML(val:string){
		this.el.innerHTML=val;
	}
}