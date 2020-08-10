import { EventEmitter } from "../events";
import { LinekedList,LinekedListItem } from "../list";

var hasOwnProperty=Object.prototype.hasOwnProperty;

export const KEY_OBSERVABLE="@@observable";
export function observable(prototype:any,prop:string){
	var Class=prototype.constructor;
	var obs=Class[KEY_OBSERVABLE];
	if(!hasOwnProperty.call(Class,KEY_OBSERVABLE)){
		if(obs){
			obs=Class[KEY_OBSERVABLE]=Array.from(obs);
		}else{
			obs=Class[KEY_OBSERVABLE]=new Array();
		}
	}
	obs.push(prop);
}
export const KEY_COMPUTED="@@computed";
export function computed(prototype:any,prop:string){
	var Class=prototype.constructor;
	var computeds=Class[KEY_COMPUTED];
	if(!hasOwnProperty.call(Class,KEY_COMPUTED)){
		if(computeds){
			computeds=Class[KEY_COMPUTED]=Array.from(computeds);
		}else{
			computeds=Class[KEY_COMPUTED]=new Array();
		}
	}
	computeds.push(prop);
}
export const KEY_DIRECT="@@direct";
export function direct(prototype:any,prop:string){
	var Class=prototype.constructor;
	var dirs=Class[KEY_DIRECT];
	if(!hasOwnProperty.call(Class,KEY_DIRECT)){
		if(dirs){
			dirs=Class[KEY_DIRECT]=Array.from(dirs);
		}else{
			dirs=Class[KEY_DIRECT]=new Array();
		}
	}
	dirs.push(prop);
}
export const KEY_ACTION="@@action";
export function action(prototype:any,prop:string){
	var Class=prototype.constructor;
	var actions=Class[KEY_ACTION];
	if(!hasOwnProperty.call(Class,KEY_ACTION)){
		if(actions){
			actions=Class[KEY_ACTION]=Array.from(actions);
		}else{
			actions=Class[KEY_ACTION]=new Array();
		}
	}
	actions.push(prop);
}


const KEY_OPTIONS=Symbol();
type Action=(key:string,value:any)=>void;
interface ObservableObject{
	[KEY_OPTIONS]:ObservableObjectOptions
}
interface ObservableObjectOptions{
	owners:LinekedList<Owner>,
	proxy?:any,
	target:any,
	actionStack:number,
	computedDeps?:Record<string,Set<string>>,
	computedOnWatchs?:Set<string>,
	afterSetEmitter:EventEmitter,
	beforeGetEmitter:EventEmitter
}
interface Owner extends LinekedListItem{
	key:string,
	object:ObservableObject
}
export function isObservableObject(obj:any):obj is ObservableObject{
	return obj[KEY_OPTIONS]!==undefined;
}
export function getOptions(obj:any):ObservableObjectOptions{
	return obj[KEY_OPTIONS];
}
/**
 * 对象属性监听
 */
export function onAfterSet(obj:any,key:string,action:Action):void{
	var options:ObservableObjectOptions=obj[KEY_OPTIONS];
	if(options===void 0){
		return ;
	}
	options.afterSetEmitter.on(key,action);
}

/**
 * 取消对象属性监听
 */
export function offAfterSet(obj:any,key:string,action:Function):void{
	var options:ObservableObjectOptions=obj[KEY_OPTIONS];
	if(options===void 0){
		return ;
	}
	options.afterSetEmitter.off(key,action);
}

/**
 * 初始化
*/
export function init(obj:any,target:any,Class:any):obj is ObservableObject{
	var options:ObservableObjectOptions={
		owners:new LinekedList<Owner>(),
		target:target,
		actionStack:0,
		afterSetEmitter:new EventEmitter(),
		beforeGetEmitter:new EventEmitter()
	};
	obj[KEY_OPTIONS]=options;
	options.afterSetEmitter.on(null,function(key:string,value:any){
		options.owners.forEach(function(owner,index,list){
			var k=owner.key+"."+key;
			owner.object[KEY_OPTIONS].afterSetEmitter.emit(k,k,value);
		});
	});
	options.beforeGetEmitter.on(null,function(key:string){
		options.owners.forEach(function(owner,index,list){
			var k=owner.key+"."+key;
			owner.object[KEY_OPTIONS].beforeGetEmitter.emit(k,k);
		});
	});
	var computed=Class[KEY_COMPUTED];
	if(computed){
		options.computedDeps={};
		options.computedOnWatchs=new Set();
		computed.forEach(function(name:string){
			options.computedDeps[name]=new Set();
		});
		options.beforeGetEmitter.on(null,function(key:string){
			options.computedOnWatchs.forEach(function(name){
				var set=options.computedDeps[name];
				set.add(key);
			});
		});
		options.afterSetEmitter.on(null,function(key:string){
			computed.forEach(function(name:string){
				var set=options.computedDeps[name];
				if(set.has(key)){
					options.afterSetEmitter.emit(name,name);
				}
			});
		});
	}
	return true;
}
export function startCollectDeps(options:ObservableObjectOptions,prop:string){
	options.computedOnWatchs.add(prop);
}
export function endCollectDeps(options:ObservableObjectOptions,prop:string){
	options.computedOnWatchs.delete(prop);
}

export function getPropertyDescriptors(obj:object){
	var o={};
	var cur=obj;
	var op=Object.prototype;
	do{
		var ds=Object.getOwnPropertyDescriptors(cur);
		var keys=Object.keys(ds);
		var i=keys.length;
		while(i-->0){
			var key=keys[i];
			if(!hasOwnProperty.call(o,key)){
				o[key]=ds[key];
			}
		}
		cur=Object.getPrototypeOf(cur);
	}while(cur && cur!==op);
	return o;
}