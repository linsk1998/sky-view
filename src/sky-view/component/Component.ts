export interface Component{
	renderTo(parent:Node):void;
	destroy():void;
	on(name:string, callback:Function, thisArg?:any):void;
	off(name:string, callback:Function):void;
	emit(name:string,...args:any[]):void;
}