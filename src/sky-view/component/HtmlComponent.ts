import { ElementComponent, initAttributesLowerCase } from "./ElementComponent";
import { direct, computed } from "../reactive/object";
import { Tag } from "../render/Tag";
import { HTMLAttributes } from "./attributes";


export class HtmlComponent<T extends HTMLElement=HTMLElement> extends ElementComponent<T>{
	protected props:HTMLAttributes;
	@direct
	public readonly tagName:string;
	constructor(attrs:HTMLAttributes,tags:Tag[]){
		super(attrs,tags);
		initAttributesLowerCase(['itemProp','itemScope','itemType','itemID','itemRef','unselectable'],this.el,attrs);
	}
	@computed
	get hidden(){
		return !!this.el.getAttribute("hidden");
	}
	set hidden(value:boolean){
		var ele=this.el;
		if(value){
			if(ele.runtimeStyle){
				ele.runtimeStyle.display="block";
			}
			this.el.setAttribute('hidden',"hidden");
		}else{
			if(ele.runtimeStyle){
				ele.runtimeStyle.display="";
			}
			this.el.setAttribute('hidden',"");
		}
	}
}