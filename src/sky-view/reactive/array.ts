import { emitAfterSet, emitAfterSetOwn } from "./object";
import { EventEmitter } from "../events";

export class ObservableArray<T>{
	protected emiter=new EventEmitter();
	on(name: string, action: Function, thisArg?: object){
		return this.emiter.on(name, action, thisArg);
	}
	off(name: string, action: Function){
		this.emiter.off(name, action);
	}
	protected array:T[];
	get length(){
		return this.array.length;
	}
	set length(value){
		this.array.length=value;
	}
	get last(){
		return this.array[this.array.length-1];
	}
	get first(){
		return this.array[this.array.length-1];
	}
	add(index:number,item:T){
		var len=this.array.length;
		this.array.splice(index,0,item);
		if(index==0){
			emitAfterSet(this,'first',item);
		}
		if(index==len){
			emitAfterSet(this,'last',item);
		}
		emitAfterSet(this,'length',len+1);
		this.emiter.emit('insert',index,[item]);
	}
	addAll(index:number,items:T[]){
		var len=this.array.length;
		var params=([index,0] as any).concat(items);
		this.array.splice.apply(this.array,params);
		if(index==0){
			emitAfterSet(this,'first',items);
		}
		if(index==len){
			emitAfterSet(this,'last',items);
		}
		emitAfterSet(this,'length',this.array.length);
		this.emiter.emit('insert',index,items);
	}
	get(index:number){
		return this.array[index];
	}
	set(index:number,item:T){
		this.array[index]=item;
		this.emiter.emit('update',index, item);
	}
	remove(index:number){
		var len=this.array.length;
		this.array.splice(index,1);
		var nlen=this.array.length;
		if(index==0){
			if(nlen){
				emitAfterSet(this,'first',this.array[0]);
			}else{
				emitAfterSet(this,'first',undefined);
			}
		}
		if(index==len){
			if(nlen){
				emitAfterSet(this,'last',this.array[len]);
			}else{
				emitAfterSet(this,'last',undefined);
			}
		}
		emitAfterSet(this,'length',nlen);
		this.emiter.emit('dalete',index,1);
	}
	/**
	 * 从尾部添加
	 */
	push(){
		var len=this.array.length;
		this.array.push.apply(this.array,arguments);
		if(len===0){
			emitAfterSet(this,'first',this.array[0]);
		}
		emitAfterSet(this,'last',this.array[this.array.length-1]);
		emitAfterSet(this,'length',this.array.length);
		this.emiter.emit('insert',len,Array.from(arguments));
	}
	/**
	 * 从头部添加
	 */
	unshift(){
		var len=this.array.length;
		this.array.unshift.apply(this.array,arguments);
		emitAfterSet(this,'first',this.array[0]);
		if(len===0){
			emitAfterSet(this,'last',this.array[this.array.length-1]);
		}
		emitAfterSet(this,'length',this.array.length);
		this.emiter.emit('insert',0,Array.from(arguments));
	}
	/**
	 * 从尾部删除
	 */
	pop(){
		var len=this.array.length;
		this.array.pop();
		var nlen=this.array.length;
		if(nlen===0){
			emitAfterSet(this,'first', undefined);
			emitAfterSet(this,'last', undefined);
		}else{
			emitAfterSet(this,'last',this.array[len]);
		}
		emitAfterSet(this,'length',this.array.length);
		this.emiter.emit('delete',len,1);
	}
	/**
	 * 从头部删除
	 */
	shift(){
		this.array.shift();
		var nlen=this.array.length;
		if(nlen===0){
			emitAfterSet(this,'first', undefined);
			emitAfterSet(this,'last', undefined);
		}else{
			emitAfterSet(this,'first',this.array[0]);
		}
		emitAfterSet(this,'length',this.array.length);
		this.emiter.emit('delete',0,1);
	}
	splice(index:number, deleteCount:number):void;
	splice(index:number, deleteCount:number, ...items:T[]):void;
	splice(){
		var index=arguments[0];
		var deleteCount=arguments[1];
		this.array.splice.apply(this.array,arguments);
		emitAfterSet(this,'length',this.array.length);
		if(arguments.length===2){
			this.emiter.emit('delete',index,deleteCount);
		}else{
			if(deleteCount){
				this.emiter.emit('delete',index,deleteCount);
			}
			var items:Array<T>=new Array(arguments.length-2);
			for(var i=2; i<arguments.length;i++) {
				items[i-2]=arguments[i];
			}
			this.emiter.emit('insert',index,items);
		}
	}
	reverse(){
		this.array.reverse();
		emitAfterSetOwn(this);
	}
	sort(compareFn?: (a: T, b: T) => number){
		this.array.sort(compareFn);
		emitAfterSetOwn(this);
	}
	indexOf(item:T){
		return this.array.indexOf(item);
	}
	lastIndexOf(item:T){
		return this.array.lastIndexOf(item);
	}
	find(predicate:(value: T, index: number, obj: T[])=> boolean, thisArg?: any){
		return this.array.find(predicate,thisArg);
	}
	findIndex(predicate:(value: T, index: number, obj: T[])=> boolean, thisArg?: any){
		return this.array.findIndex(predicate,thisArg);
	}
	includes(item:T){
		return this.array.includes(item);
	}
	slice(start:number,end:number):T[]{
		return this.array.slice(start,end);
	}
	toJson(){
		return this.array;
	}
	map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[]{
		return this.array.map(callbackfn,thisArg);
	}
	forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void{
		this.array.forEach(callbackfn,thisArg);
	}
	filter(callbackfn:(value: T, index: number, array: T[]) => value is T,thisArg?:any):T[]{
		return this.array.filter(callbackfn,thisArg);
	}
	some(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean{
		return this.array.some(callbackfn,thisArg);
	}
	every(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean{
		return this.array.every(callbackfn,thisArg);
	}
	reduce(callbackfn: (previousValue:any, currentValue: T, currentIndex: number, array: T[]) => any, initialValue?: any): any{
		return this.array.reduce(callbackfn,initialValue);
	}
	static from<T>(array:ArrayLike<T>){
		var obsArray=new ObservableArray();
		if(Array.isArray(array)){
			obsArray.array=array;
		}else{
			obsArray.array=Array.from(array);
		}
		return obsArray;
	}
}