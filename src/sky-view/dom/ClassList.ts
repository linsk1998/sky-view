

export class ClassList{
	protected el:Element;
	protected items:string[];
	length:number;
	value:string;
	constructor(el:Element){
		this.el=el;
		this.value=el.className;
		var set=new Set(this.value.match(/\S+/g));
		this.items=Array.from(set);
		this.length=this.items.length;
	}
	item(index:number){
		return this.items[index];
	}
	contains(token:string){
		return this.items.includes(token);
	}
	add(...values:string[]):void;
	add(){
		for(var i=0;i<arguments.length;i++){
			var val:string=arguments[i];
			var arr=val.split(/\s+/);
			if(arr.length===1){
				this.addOne(val);
			}else{
				for(var j=0;j<arr.length;j++){
					this.addOne(arr[j]);
				}
			}
		}
	}
	protected addOne(token:string){
		if(!this.items.includes(token)){
			this.items.push(token);
			this.length=this.items.length;
			this.value=this.el.className=this.toString();
		}
	}
	remove(...tokens:string[]):void;
	remove(){
		for(var i=0;i<arguments.length;i++){
			var val:string=arguments[i];
			this.removeOne(val);
		}
	}
	protected removeOne(token:string){
		var index=this.items.indexOf(token);
		if(index>=0){
			this.items.splice(index,1);
		}
	}
	replace(oldToken:string, newToken:string){
		this.removeOne(oldToken);
		this.addOne(newToken);
	}
	toggle(token:string , force?:boolean){
		if(this.contains(token)){
			if(force!=true){
				this.removeOne(token);
				return false;
			}
			return true;
		}else{
			if(force!=false){
				this.addOne(token);
				return true;
			}
			return false;
		}
	}
	forEach(callback: (value: string, index: number, array:this) => void, thisArg?: any){
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this.item(i), i, this);
		}
	}
	toString(){
		return this.items.join(" ");
	}
	reset(className:string){
		var set=new Set(className.match(/\S+/g));
		this.value=className;
		this.items=Array.from(set);
		this.length=this.items.length;
	}
}