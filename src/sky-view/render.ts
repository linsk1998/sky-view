import { Component } from "./render/Component";
import { Tag } from "./render/Tag";

export function render(tag:Tag,parent:Node){
	var com:Component=new tag.component(tag.props,tag.children);
	com.renderTo(parent);
}
