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
	proxy:any,
	target:any,
	actionDeep:number,
	unemitedActions:Set<string>;
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
export function onAfterSet(obj:any,key:string,action:Action):Action{
	var options=getOptions(obj);
	if(options===void 0){
		return ;
	}
	options.afterSetEmitter.on(key,action);
	return action;
}

/**
 * 取消对象属性监听
 */
export function offAfterSet(obj:any,key:string,action:Function):void{
	var options=getOptions(obj);
	if(options===void 0){
		return ;
	}
	options.afterSetEmitter.off(key,action);
}
export function emitAfterSet(obj:any,key:string,value:any){
	var options=getOptions(obj);
	emitAfterSetByOptions(options,key,value);
}
function emitAfterSetByOptions(options:ObservableObjectOptions,key:string,value:any){
	if(options.actionDeep<=0){
		options.afterSetEmitter.emit(key,key,value);
	}else{
		options.unemitedActions.add(key);
	}
}
/**
 * 初始化
*/
export function init(obj:any,target:any,Class:any):obj is ObservableObject{
	var options:ObservableObjectOptions={
		owners:new LinekedList<Owner>(),
		target:target,
		proxy:obj,
		actionDeep:0,
		unemitedActions:new Set(),
		afterSetEmitter:new EventEmitter(),
		beforeGetEmitter:new EventEmitter()
	};
	obj[KEY_OPTIONS]=options;
	options.afterSetEmitter.on(null,function(key:string,value:any){
		options.owners.forEach(function(owner,index,list){
			var k=owner.key+"."+key;
			emitAfterSet(owner,k,value);
		});
	});
	options.beforeGetEmitter.on(null,function(key:string){
		options.owners.forEach(function(owner,index,list){
			var k=owner.key+"."+key;
			owner.object[KEY_OPTIONS].beforeGetEmitter.emit(k,k);
		});
	});
	var computed:string[]=Class[KEY_COMPUTED];
	if(computed){
		options.computedDeps={};
		options.computedOnWatchs=new Set();
		computed.forEach(function(name:string){
			options.computedDeps[name]=new Set();
		});
		options.beforeGetEmitter.on(null,function(key:string){
			this.computedOnWatchs.forEach(function(name:string){
				var set=this.computedDeps[name];
				set.add(key);
			},this);
		},options);
		options.afterSetEmitter.on(null,function(key:string){
			computed.forEach(function(name:string){
				var set=this.computedDeps[name];
				if(set.has(key)){
					if(this.actionDeep<=0){
						this.afterSetEmitter.emit(name,name,this.proxy[name]);
					}else{
						options.unemitedActions.add(name);
					}
				}
			},this);
		},options);
	}
	return true;
}
export function get(obj:any,key:string){
	var options=getOptions(obj);
	return options.target[key];
}
export function set(obj:any,key:string,value:any){
	var options=getOptions(obj);
	options.target[key]=value;
}
export function getObservable(obj:any,key:string){
	var options=getOptions(obj);
	options.beforeGetEmitter.emit(key,key);
	return options.target[key];
}
export function setObservable(obj:any,key:string,value:any){
	var options=getOptions(obj);
	options.target[key]=value;
	options.afterSetEmitter.emit(key,key,value);
}
export function getComputed(obj:any,key:string){
	var options=getOptions(obj);
	var target=options.target;
	if(key in target){
		return target[key];
	}
	startCollectDeps(options,key);
	var proto=Object.getPrototypeOf(obj);
	var value=Reflect.get(proto,key,obj);
	endCollectDeps(options,key);
	return value;
}
export function setComputed(obj:any,key:string,value:any){
	var options=getOptions(obj);
	var proto=Object.getPrototypeOf(obj);
	try{
		startAction(options);
		Reflect.set(proto,key,value,obj);
	}finally{
		endAction(options);
	}
}
export function doAction(obj:any,fn:Function,args:ArrayLike<any>){
	var options=getOptions(obj);
	var proto=Object.getPrototypeOf(obj);
	try{
		startAction(options);
		var value=Reflect.apply(fn,obj,args);
		return value;
	}finally{
		endAction(options);
	}
}
function startAction(options:ObservableObjectOptions){
	options.actionDeep++;
}
function endAction(options:ObservableObjectOptions){
	options.actionDeep--;
	if(options.actionDeep<=0){
		options.unemitedActions.forEach(finishAction,options);
		options.unemitedActions.clear();
	}
}
function finishAction(key:string):void{
	this.afterSetEmitter.emit(key,key,this.proxy[key]);
}
export function startCollectDeps(options:ObservableObjectOptions,prop:string){
	options.computedOnWatchs.add(prop);
}
export function endCollectDeps(options:ObservableObjectOptions,prop:string){
	options.computedOnWatchs.delete(prop);
}
