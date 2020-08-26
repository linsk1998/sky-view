import { direct, computed } from "../reactive/object";
import { ClassList } from "../dom/ClassList";
import { Component } from "../render/Component";
import { EventEmitter } from "../events";
import { attachEvent } from "sky-core";
import { detachEvent } from "sky-core";
import { watcher, fixEvent, proxy } from "../dom/event";
import { Tag } from "../render/Tag";
import { render } from "../render";


export interface ElementProps{
	tagName?:string,
	className?:string,
	classList?:ArrayLike<string>
}

export abstract class  ElementComponent<T extends Element=Element> implements Component{
	@direct
	protected _children:Component[];
	@direct
	protected _parentNode:Node;
	@direct
	public el:T;
	@computed
	get className():string{
		return this.el.className;
	}
	set className(val){
		this.el.className=val;
		this.classList.reset(val);
		this.el.clientHeight
	}
	public readonly classList:ClassList;
	@direct
	public readonly tagName:string;
	protected props:ElementProps;
	protected tags:Tag[];
	constructor(props:ElementProps,tags?:Tag[]){
		this.tagName=props.tagName;
		this.props=props;
		this.tags=tags;
	}
	/** 添加到文档上 */
	public renderTo(parent: Node): void {
		this._parentNode=parent;
		for(var i=0;i<this.tags.length;i++){
			render(this.tags[i],this.el);
		}
		parent.appendChild(this.el);
		this.componentDidMount();
	}
	/** 完成挂载生命周期钩子 */
	protected componentDidMount(){

	}
	/** 添加元素 */
	public appandChild(child:Component){
		child.renderTo(this.el);
		this._children.push(child);
	}
	/** 销毁 */
	public destroy(){
		this.componentWillUnmount();
		var i=this._children.length;
		while(i-->0){
			var child=this._children[i];
			child.destroy();
		}
		this._events.forEach(removeEventListener,this.el);
		var parent=this.el.parentNode;
		if(parent){
			parent.removeChild(this.el);
		}
		try{
			this.el=null;
			return ;
		}finally{
			parent=null;
		}
	}
	/** 将要移除生命周期钩子 */
	protected componentWillUnmount(){
		
	}
	@direct
	protected _eventEmitter=new EventEmitter();
	@direct
	protected _events?:Map<string,Function>;
	/** 添加事件绑定 */
	public on(name:string, callback:Function, thisArg:any){
		if(this._eventEmitter.find((item)=>item.name==name && item.action===callback)){
			return ;
		}
		this._eventEmitter.on(name,callback,thisArg);
		if(!this._events){
			this._events=new Map();
		}
		bindDomEvent(this, name, this._events);
	}
	public off(name:string, callback:Function){
		this._eventEmitter.off(name,callback);
	}
	public emit(name:string,...args:any[]){
		this._eventEmitter.emit.apply(this._eventEmitter,arguments);
	}
	public getAttribute(name:string){
		return this.el.getAttribute(name);
	}
	public setAttribute(name:string,value:string){
		this.el.setAttribute(name,value);
	}
}

function bindDomEvent(com:ElementComponent,name:string,events:Map<string,Function>){
	function domEvent(e:Event){
		e=fixEvent.call(com.el,e);
		com.emit(e.type,com,e);
		var evt=proxy[e.type](e);
		if(evt) com.emit(evt,com,e);
	}
	var type=watcher[name] || name;
	attachEvent(com.el,type,domEvent);
	events.set(type,domEvent);
}
function removeEventListener(callback:Function,name:string){
	detachEvent(this,name,callback);
}
