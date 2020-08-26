import {Event,EventEmitter} from "../src/sky-view/events";

test('emit', () => {
	var emitter = new EventEmitter();
	var r=1;
	emitter.on("click",function(a,b){
		expect(a).toBe(1);
		expect(b).toBe(2);
		expect(r).toBe(1);
		r=2;
	});
	emitter.emit("click",1,2);
	expect(r).toBe(2);
});
test('emit2', () => {
	var emitter = new EventEmitter();
	var r=1;
	emitter.on(null,function(){
		expect(r).toBe(1);
		r=2;
	});
	emitter.emit("click");
	expect(r).toBe(2);
});
test('off', () => {
	var emitter = new EventEmitter();
	expect(emitter.length).toBe(0);
	var arr=[];
	function cb1(){
		arr.push("cb1");
	}
	function cb2(){
		arr.push("cb2");
		emitter.off("load",cb1);
		emitter.off("load",cb2);
		emitter.off("load",cb3);
	}
	function cb3(){
		arr.push("cb3");
	}
	emitter.on("load",cb1);
	emitter.on("load",cb2);
	emitter.on("load",cb3);
	expect(emitter.length).toBe(3);
	emitter.emit("load");
	expect(arr).toEqual(["cb1","cb2"]);
	expect(emitter.length).toBe(0);
});