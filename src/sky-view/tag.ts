import { DivProps,Div } from "./component/html/Div";
import { ComponentConstructor } from "./render/ComponentConstructor";
import { HtmlComponent } from "./component/HtmlComponent";
import { Tag } from "./render/Tag";
import { Out, TextProps } from "./tags/core/Out";



function tag(type:"div", props:DivProps, ...children:Child[]):Tag;
function tag(type:string, props:Record<string,any>, ...children:Child[]):Tag;
function tag(type:string | ComponentConstructor, props:any, ...children:Child[]):Tag;
function tag(type:string | ComponentConstructor,props:any):Tag{
	if(typeof type==="string"){
		type=typeMap.get(type);
		if(!type){
			type=HtmlComponent;
			if(!props) props=new Object();
			props.tagName=type;
		}
	}
	var r=new Tag();
	var children:Tag[]=[];
	for(var i=2;i<arguments.length;i++){
		var child=arguments[i];
		if(child instanceof Tag){
			children.push(child); 
		}else{
			var op:TextProps=new Object() as any;
			op.value=child;
			var ct=new Tag();
			ct.props=op;
			ct.component=Out;
			children.push(ct)
		}
	}
	r.children=children;
	r.component=type;
	r.props=props;
	return r;
}
export {tag};
export var typeMap:Map<string,ComponentConstructor>=new Map([
	['div',Div],
]);

type Child = Tag | string | number;