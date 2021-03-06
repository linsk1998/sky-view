import { isInput } from "sky-core";

/**
 * @description 根据传入事件，得到代替监听DOM的事件
 * @example 传入input可以得到propertychange；传入mouseenter可以得到mouseover 等
 */
export var watcher:Record<string,string>={};
/**
 * @description 根据真实监听到DOM事件，得到标准事件
 * @example 传入propertychange可以得到input；传入mouseover可以得到mouseenter 等
 */
export var proxy:Record<string,(e:Event)=>string | void>={};
var receiver:Record<string,(e:Event)=>void>={};
export function fixEvent(e:any):Event{
	e=window.event;
	e.target=e.srcElement;
	e.stopPropagation=stopPropagation;
	e.preventDefault=preventDefault;
	e.currentTarget=this;
	var r=receiver[e.type];
	if(r) r(e);
	return e;
}


if(!("onwheel" in document)){
	if('onmousewheel' in document){
		watcher.wheel='mousewheel';
		proxy.mousewheel=function(){ return "wheel";};
	}
}
watcher.input='propertychange';
proxy.propertychange=function(e:PropertyChangeEvent){
	if(e.propertyName==='value'){
		var target=e.srcElement;
		if(isInput(target)){
			if(!target.disabled && !target.readOnly){
				return "input";
			}
		}
	}
};
receiver.mouseenter=function(e:any){
	e.relatedTarget=e.fromElement;
};
receiver.mouseleave=function(e:any){
	e.relatedTarget=e.toElement;
};
function stopPropagation(){
	this.cancelBubble=true;
}
function preventDefault(){
	if(this.cancelable===false){
		throw "cancelable:false";
	}
	this.defaultPrevented=true;
	this.returnValue=false;
}