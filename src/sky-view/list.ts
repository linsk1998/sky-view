
export interface LinekedListItem{
	next?:this;
	prev?:this;
	list?:LinekedList
}
export class LinekedList<T extends LinekedListItem=LinekedListItem>{
	head:T;
	tail:T;
	length:number;
	constructor(){
		this.length=0;
	}
	/**
	 * 从尾部添加
	 */
	push(item:T){
		if(item.list){
			throw new Error("item has already in other linked list");
		}
		item.list=this;
		if(this.length){
			item.prev=this.tail;
			this.tail.next=item;
		}else{
			this.head=item;
		}
		this.tail=item;
		this.length++;
		return item;
	}
	/**
	 * 从头部添加
	 */
	unshift(item:T){
		if(item.list){
			throw new Error("item has already in other linked list");
		}
		item.list=this;
		if(this.length){
			item.next=this.head;
			this.head.prev=item;
		}else{
			this.tail=item;
		}
		this.head=item;
		this.length++;
	}
	/**
	 * 从尾部删除
	 */
	pop(){
		this.length--;
		if(this.length){
			var item=this.tail;
			var tail=this.tail=item.prev;
			item=item.prev=item.list=tail=tail.next=null;
		}else{
			this.tail=this.head=null;
		}
	}
	/**
	 * 从头部删除
	 */
	shift(){
		this.length--;
		if(this.length){
			var item=this.head;
			var head=this.head=item.next;
			item=item.next=item.list=head=head.prev=null;
		}else{
			this.tail=this.head=null;
		}
	}
	/**
	 * 删除指定元素
	 */
	remove(item:T){
		if(item.list!==this){
			throw new Error("item is not in this linked list");
		}
		this.length--;
		if(this.length){
			if(this.head===item){
				this.head=item.next;
				this.head.prev=null;
			}else if(this.tail===item){
				this.tail=item.prev;
				this.tail.next=null;
			}else{
				item.prev.next=item.next;
			}
		}else{
			this.tail=this.head=null;
		}
		item=item.list=item.next=item.prev=null;
	}
	/**
	 * 在一个元素前面插入
	 * @param newItem 新插入的元素
	 * @param existingItem 原本存在的元素
	 */
	insertBefore(newItem:T,existingItem:T){
		if(newItem.list){
			throw new Error("item has already in other linked list");
		}
		if(existingItem.list!==this){
			throw new Error("item is not in this linked list");
		}
		if(existingItem===this.head){
			this.head=newItem;
		}
		newItem.prev=existingItem.prev;
		newItem.next=existingItem;
		existingItem.prev=newItem;
	}
	/**
	 * 在一个元素后面插入
	 * @param newItem 新插入的元素
	 * @param existingItem 原本存在的元素
	 */
	insertAfter(newItem:T,existingItem:T){
		if(newItem.list){
			throw new Error("item has already in other linked list");
		}
		if(existingItem.list!==this){
			throw new Error("item is not in this linked list");
		}
		if(existingItem===this.tail){
			this.tail=newItem;
		}
		newItem.next=existingItem.next;
		newItem.prev=existingItem;
		existingItem.next=newItem;
	}
	/**
	 * 遍历执行
	 */
	forEach(callback:(currentValue:T, index:number, list:this)=>void,thisArg?:object):void{
		if(this.length===0){
			return ;
		}
		var i=0;
		var current=this.head;
		do{
			callback.call(thisArg,current,i,this);
			i++;
			current=current.next;
		}while(current);
	}
	/**
	 * 用来判断是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。
	 * @param item 链表中，或链表外的一项
	 */
	includes(item:T):boolean{
		return item.list===this;
	}
	/**
	 * 获取列表中满足提供的测试函数的第一个元素的值。
	 * @param callback 在数组每一项上执行的函数
	 * @param thisArg 执行回调时用作this 的对象
	 */
	find(callback:(currentValue:T, index:number, list:this)=>boolean,thisArg?:object):T{
		if(this.length===0){
			return ;
		}
		var i=0;
		var current=this.head;
		do{
			if(callback.call(thisArg,current,i,this)) return current;
			i++;
			current=current.next;
		}while(current);
	}
	/**
	 * 测试数组中是不是至少有1个元素通过了被提供的函数测试。
	 * @param callback 在数组每一项上执行的函数
	 * @param thisArg 执行回调时用作this 的对象
	 */
	some(callback:(currentValue:T, index:number, list:this)=>boolean,thisArg?:object){
		if(this.length===0){
			return false;
		}
		var i=0;
		var current=this.head;
		do{
			if(callback.call(thisArg,current,i,this)) return true;
			i++;
			current=current.next;
		}while(current);
		return false;
	}
	/**
	 * 测试一个数组内的所有元素是否都能通过某个指定函数的测试。
	 * @param callback 在数组每一项上执行的函数
	 * @param thisArg 执行回调时用作this 的对象
	 */
	every(callback:(currentValue:T, index:number, list:this)=>boolean,thisArg?:object){
		if(this.length===0){
			return true;
		}
		var i=0;
		var current=this.head;
		do{
			if(callback.call(thisArg,current,i,this)) return false;
			i++;
			current=current.next;
		}while(current);
		return true;
	}
	/**
	 * 过滤内容, 通过所提供函数实现的测试的所有元素。 
	 * @param callback 在数组每一项上执行的函数
	 * @param thisArg 执行回调时用作this 的对象
	 */
	filter(callback:(currentValue:T, index:number, list:this)=>boolean,thisArg?:object){
		var i=0;
		var current=this.head;
		do{
			if(!callback.call(thisArg,current,i,this)){
				this.remove(current);
			}
			i++;
			current=current.next;
		}while(current);
	}
}