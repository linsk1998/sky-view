import { LinekedList, LinekedListItem } from "./list";

export interface Event extends LinekedListItem{
	name:string,
	action:Function,
	thisArg:object
}
export class EventEmitter extends LinekedList<Event>{
	on(name:string,action:Function,thisArg?:object):this{
		var reaction:Event={
			name,action,thisArg
		};
		this.push(reaction);
		return this;
	}
	off(name?:string,action?:Function):this{
		this.filter(function(current){
			if(!action || current.action===action){
				if(!name || name==current.name){
					return false;
				}
			}
			return true;
		});
		return this;
	}
	/**
	 * @description 发射事件
	 * @param name 事件名
	 * @param args 参数
	 * @returns 如果执行完成返回true，如果中断返回false
	 */
	emit(name?:string,...args:any[]):boolean{
		return this.forEach(function(event){
			if(!name || !event.name || event.name==name){
				try{
					return event.action.apply(event.thisArg,args);
				}catch(e){
					console.error(e);
				}
			}
		});
	}
}