import { createProxy } from "../src/sky-view/reactive/ObservableObject";
import { direct, observable, computed,onAfterSet, offAfterSet, action } from "../src/sky-view/reactive/object";

class Animal{
	@direct
	name:string;

	@observable
	birthday:Date;

	@computed
	get age(){
		var now=new Date();
		return now.getFullYear()-this.birthday.getFullYear();
	}
	set age(value){
		var now=new Date();
		if(!this.birthday){
			this.birthday=now;
		}
		this.birthday.setFullYear(now.getFullYear()-value);
	}
	born(date:Date){
		this.birthday=date;
	}
	say(){
		alert("啊");
	}
}
class Cat extends Animal{
	@action
	born(date:Date){
		this.birthday=date;
		this.age=0;
	}
	say(){
		alert("喵");
	}
}
test('class', () => {
	var animal={};
	var proxy=createProxy(animal,Animal);
	//direct
	var afterSetName=false;
	onAfterSet(proxy,"name",function onAfterSetName(name,value){
		afterSetName=true;
	});
	proxy.name="A";
	expect(afterSetName).toBe(false);
	//observable
	var afterSetBirthday=0;
	var now=new Date();
	function onAfterSetBirthday(name:string,value:any){
		afterSetBirthday++;
		expect(name).toBe("birthday");
		expect(value).toEqual(now);
	}
	onAfterSet(proxy,"birthday",onAfterSetBirthday);
	proxy.birthday=now;
	expect(afterSetBirthday).toBe(1);
	offAfterSet(proxy,"birthday",onAfterSetBirthday);
	//computed
	expect(proxy.age).toBe(0);
	var afterSetAge=0;
	onAfterSet(proxy,"age",function onAfterSetAge(name,value){
		afterSetAge++;
		expect(name).toBe("age");
		expect(value).toBe(0);
	});
	proxy.birthday=new Date();
	expect(afterSetAge).toBe(1);
	expect(afterSetBirthday).toBe(1);
});
test('extends', () => {
	var animal={};
	var proxy=createProxy(animal,Cat);
	//direct
	var afterSetName=false;
	onAfterSet(proxy,"name",function onAfterSetName(name,value){
		afterSetName=true;
	});
	proxy.name="A";
	expect(afterSetName).toBe(false);
	//observable
	var afterSetBirthday=0;
	var now=new Date();
	function onAfterSetBirthday(name:string,value:any){
		afterSetBirthday++;
		expect(name).toBe("birthday");
		expect(value).toEqual(now);
	}
	onAfterSet(proxy,"birthday",onAfterSetBirthday);
	proxy.birthday=now;
	expect(afterSetBirthday).toBe(1);
	offAfterSet(proxy,"birthday",onAfterSetBirthday);
	//computed
	expect(proxy.age).toBe(0);
	var afterSetAge=0;
	var onAfterSetAge=onAfterSet(proxy,"age",function(name,value){
		afterSetAge++;
		expect(name).toBe("age");
		expect(value).toBe(0);
	});
	proxy.birthday=new Date();
	expect(afterSetAge).toBe(1);
	expect(afterSetBirthday).toBe(1);
	offAfterSet(proxy,"age",onAfterSetAge);
	//action
	onAfterSet(proxy,"age",function(name,value){
		afterSetAge++;
	});
	onAfterSet(proxy,"birthday",function(name,value){
		afterSetBirthday++;
	});
	proxy.born(new Date());
	expect(afterSetAge).toBe(2);
	expect(afterSetBirthday).toBe(2);
});