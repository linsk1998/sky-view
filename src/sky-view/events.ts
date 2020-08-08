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
	emit(name?:string,...args:any[]){
		this.forEach(function(event){
			if(!name || !event.name || event.name==name){
				try{
					event.action.apply(event.thisArg,args);
				}catch(e){
					console.error(e);
				}
			}
		});
	}
}