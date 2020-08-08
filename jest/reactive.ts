import { createProxy } from "../src/sky-view/reactive/ObservableObject";
import { direct, observable, computed,onAfterSet, offAfterSet } from "../src/sky-view/reactive/object";

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

	born(date:Date){
		this.birthday=date;
	}
	say(){
		alert("啊");
	}
}
class Cat extends Animal{
	say(){
		alert("喵");
	}
}
test('class', () => {
	var animal=new Animal();
	var proxy=createProxy(animal);
	//direct
	var afterSetName=false;
	onAfterSet(proxy,"name",function onAfterSetName(name,value){
		afterSetName=true;
	});
	proxy.name="A";
	expect(afterSetName).toBe(false);
	//observable
	var afterSetBirthday=false;
	var now=new Date();
	function onAfterSetBirthday(name:string,value:any){
		afterSetBirthday=true;
		expect(name).toBe("birthday");
		expect(value).toEqual(now);
	}
	onAfterSet(proxy,"birthday",onAfterSetBirthday);
	proxy.birthday=now;
	expect(afterSetBirthday).toBe(true);
	offAfterSet(proxy,"birthday",onAfterSetBirthday);
	//computed
	expect(proxy.age).toBe(0);
	var afterSetAge=false;
	onAfterSet(proxy,"age",function onAfterSetAge(name,value){
		afterSetAge=true;
		expect(name).toBe("age");
		expect(value).toBe(0);
	});
	proxy.birthday=new Date();
	expect(afterSetAge).toBe(true);
});
test('extends', () => {
	var animal=new Cat();
	var proxy=createProxy(animal);
	//direct
	var afterSetName=false;
	onAfterSet(proxy,"name",function onAfterSetName(name,value){
		afterSetName=true;
	});
	proxy.name="A";
	expect(afterSetName).toBe(false);
	//observable
	var afterSetBirthday=false;
	var now=new Date();
	function onAfterSetBirthday(name:string,value:any){
		afterSetBirthday=true;
		expect(name).toBe("birthday");
		expect(value).toEqual(now);
	}
	onAfterSet(proxy,"birthday",onAfterSetBirthday);
	proxy.birthday=now;
	expect(afterSetBirthday).toBe(true);
	offAfterSet(proxy,"birthday",onAfterSetBirthday);
	//computed
	expect(proxy.age).toBe(0);
	var afterSetAge=false;
	onAfterSet(proxy,"age",function onAfterSetAge(name,value){
		afterSetAge=true;
		expect(name).toBe("age");
		expect(value).toBe(0);
	});
	proxy.birthday=new Date();
	expect(afterSetAge).toBe(true);
});