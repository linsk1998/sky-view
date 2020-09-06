
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
export function fixEvent(e:any):Event{
	return e;
}


if(!("onwheel" in document)){
	watcher.wheel='DOMMouseScroll';
	proxy.DOMMouseScroll=function(e:WheelEvent){
		e.wheelDelta=-e.detail*40;
		return 'wheel';
	};
}
if('onmouseenter' in document){
	watcher.mouseenter='mouseover';
	proxy.mouseover=function(e:MouseEvent){
		var related=e.relatedTarget;
		if(related!==this && !this.contains(related)){
			return "mouseenter";
		}
	};
	watcher.mouseleave='mouseout';
	proxy.mouseout=function(e:MouseEvent){
		var related=e.relatedTarget;
		if( related!==this && !this.contains(related) ){
			return "mouseleave";
		}
	}
}