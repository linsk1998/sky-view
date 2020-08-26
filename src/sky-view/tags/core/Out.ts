import { Component } from "../../render/Component";

export interface TextProps{
	value:string
}
export class Out implements Component{
	protected node:globalThis.Text;
	constructor(props:TextProps){
		this.node=document.createTextNode(props.value);
	}
	renderTo(parent: Node): void {
		parent.appendChild(this.node);
	}
	destroy(): void {
		this.node.data="";
	}
	setAttribute(key:string,value:string){
		if(key=="value"){
			this.node.data=value;
		}
	}
	getAttribute(key:string){
		if(key=="value"){
			return this.node.data;
		}
	}
	get value(){
		return this.node.data;
	}
	set value(val){
		this.node.data=val;
	}
	on(name: string, callback: Function, thisArg?: any): void {
		throw new Error("Text node has no event.");
	}
	off(name: string, callback: Function): void {
		throw new Error("Text node has no event.");
	}
	emit(name: string, ...args: any[]): void {
		throw new Error("Text node has no event.");
	}
}