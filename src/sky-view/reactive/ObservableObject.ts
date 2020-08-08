
import {KEY_OBSERVABLE,KEY_COMPUTED,KEY_DIRECT,init,getOptions,startCollectDeps,endCollectDeps, getPropertyDescriptors} from "./object";
export function createProxy<T extends Object>(target:T):T{
	var Class=target.constructor;
	var proxy=Object.create(Class.prototype);
	var obs:string[]=Class[KEY_OBSERVABLE];
	var coms:string[]=Class[KEY_COMPUTED];
	var dirs:string[]=Class[KEY_DIRECT];
	init(proxy,target,Class)
	if(dirs){
		dirs.forEach(function(key){
			Object.defineProperty(proxy,key,{
				get(){
					var options=getOptions(this);
					return options.target[key];
				},
				set(value){
					var options=getOptions(this);
					options.target[key]=value;
				},
				enumerable:true,
				configurable:false
			})
		});
	}
	if(obs){
		obs.forEach(function(key){
			Object.defineProperty(proxy,key,{
				get(){
					var options=getOptions(this);
					options.beforeGetEmitter.emit(key,key);
					return options.target[key];
				},
				set(value){
					var options=getOptions(this);
					options.target[key]=value;
					options.afterSetEmitter.emit(key,key,value);
				},
				enumerable:true,
				configurable:false
			})
		});
	}
	if(coms){
		var ds=getPropertyDescriptors(target);
		coms.forEach(function(key){
			var d=ds[key];
			if(d.value){
				proxy[key]=function(){
					var options=getOptions(this);
					startCollectDeps(options,key);
					var value=d.value.call(proxy);
					endCollectDeps(options,key);
					return value;
				};
			}else{
				Object.defineProperty(proxy,key,{
					get(){
						var options=getOptions(this);
						startCollectDeps(options,key);
						var value=d.get.call(proxy);
						endCollectDeps(options,key);
						return value;
					},
					set(value){// todo action
						//var options=getOptions(this);
						d.set.call(proxy,value);
						//options.afterSetEmitter.emit(key,key,value);
					},
					enumerable:true,
					configurable:false
				});
			}
		});
	}
	return proxy;
}