
import {KEY_OBSERVABLE,KEY_COMPUTED,KEY_DIRECT,KEY_ACTION,init, get, set, getObservable, setObservable, getComputed, setComputed, doAction} from "./object";
export function createProxy<T extends Object>(target:object,Class:new()=>T):T{
	var prototype=Class.prototype;
	var proxy=Object.create(prototype);
	var obs:string[]=Class[KEY_OBSERVABLE];
	var coms:string[]=Class[KEY_COMPUTED];
	var dirs:string[]=Class[KEY_DIRECT];
	var actions:string[]=Class[KEY_ACTION];
	init(proxy,target,Class);
	if(dirs){
		dirs.forEach(createDirect,proxy);
	}
	if(obs){
		obs.forEach(createObservable,proxy);
	}
	if(coms){
		coms.forEach(createComputed,proxy);
	}
	for(var key in prototype){
		var value=prototype[key];
		if(typeof value==="function"){
			if(actions && actions.includes(value)){
				createAction(proxy,key,value);
			}else{
				//TODO 绑定this
			}
		}
	}
	return proxy;
}

function createDirect(key:string){
	Object.defineProperty(this,key,{
		get(){
			return get(this,key);
		},
		set(value){
			return set(this,key,value);
		},
		enumerable:true,
		configurable:false
	});
}
function createObservable(key:string){
	Object.defineProperty(this,key,{
		get(){
			return getObservable(this,key);
		},
		set(value){
			return setObservable(this,key,value);
		},
		enumerable:true,
		configurable:false
	});
}
function createComputed(key:string){
	Object.defineProperty(this,key,{
		get(){
			return getComputed(this,key);
		},
		set(value){
			return setComputed(this,key,value);
		},
		enumerable:true,
		configurable:false
	});
}
function createAction(proxy:any,key:string,fn:Function){
	this[key]=function(){
		doAction(proxy,fn,arguments);
	};
}