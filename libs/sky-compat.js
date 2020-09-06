var Sky = (function (exports) {
	exports=function Sky(){
		return Sky.overload(arguments,this);
	};

	if(typeof globalThis==="undefined"){
		window.globalThis=window;
	}

	if(!Number.isFinite){
		Number.isFinite=function(value){
			return typeof value === 'number' && isFinite(value);
		};
	}

	if(!Number.isNaN){
		Number.isNaN=function(value){
			return typeof value === "number" && isNaN(value);
		};
	}

	if(!Number.isInteger){
		Number.isInteger=function(value){
			return typeof value === "number" &&	isFinite(value) &&	Math.floor(value) === value;
		};
	}

	if(!String.prototype.trim){
		String.prototype.trim=function trim(){
			return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,'');
		};
	}

	if(!String.prototype.trimStart){
		String.prototype.trimStart=function trimStart(){
			return this.replace(/^[\s\uFEFF\xA0]+/g,'');
		};
	}

	if(!String.prototype.trimEnd){
		String.prototype.trimEnd=function trimEnd(){
			return this.replace(/[\s\uFEFF\xA0]+$/g,'');
		};
	}

	if(!String.prototype.endsWith){
		String.prototype.endsWith=function endsWith(prefix,position){
			var length=prefix.length;
			position=position<length?position:this.length;
			return this.slice(position-length, position) === prefix;
		};
	}

	if(!String.prototype.startsWith){
		String.prototype.startsWith=function startsWith(prefix,position){
			if(prefix===null){ return false;}
			position=position?position:0;
			return this.slice(position, prefix.length) === prefix;
		};
	}

	if(!String.prototype.includes) {
		String.prototype.includes=function includes(search, start) {
			if(typeof start!=='number'){
				start=0;
			}
			if(start+search.length>this.length){
				return false;
			}else {
				return this.indexOf(search, start)!==-1;
			}
		};
	}

	if(!String.prototype.repeat){
		String.prototype.repeat=function repeat(count){
			if(count<0){
				throw 'RangeError repeat count must be non-negative';
			}
			if(count==Number.POSITIVE_INFINITY){
				throw 'RangeError repeat count must be less than infinity';
			}
			return new Array(count+1).join(this);
		};
	}

	if(!String.prototype.padStart){
		String.prototype.padStart=function padStart(targetLength,padString){
			var x=targetLength-this.length;
			if(x<0) return this+"";
			if(!padString) padString=" ";
			return padString.repeat(Math.ceil(x/padString.length)).substr(0,x)+this;
		};
	}

	if(!String.prototype.padEnd){
		String.prototype.padEnd=function padEnd(targetLength,padString){
			var x=targetLength-this.length;
			if(x<0) return this+"";
			if(!padString) padString=" ";
			return this+padString.repeat(Math.ceil(x/padString.length)).substr(0,x);
		};
	}

	function isString(obj){
		return Object.prototype.toString.call(obj)==='[object String]';
	}

	function isArrayLike(obj){
		var length=obj.length;
		if(typeof length !="number" || length<0 || isNaN(length) || Math.ceil(length)!=length){
			return false;
		}
		return true;
	}

	if(!Array.from){
		Array.from=function(arrayLike, mapFn, thisArg){
			var arr;
			if((arrayLike instanceof Map )||(arrayLike instanceof Set)){
				if(arrayLike.items){
					arrayLike=arrayLike.items;
				}
			}
			if(isString(arrayLike)){
				arr=new Array();
				for(var i=0;i<arrayLike.length;i++){
					arr.push(arrayLike.charAt(i));
				}
			}else if(isArrayLike(arrayLike)){
				try{
					arr=Array.prototype.slice.call(arrayLike);
				}catch(e){
					arr=new Array();
					for(var i=0;i<arrayLike.length;i++){
						arr.push(arrayLike[i]);
					}
				}
			}else {
				arr=new Array();
				var entries=arrayLike[Symbol.iterator];
				if(entries){
					var it=entries.call(arrayLike);
					while(true){
						var next=it.next();
						if(next.done) break ;
						arr.push(next.value);
					}
				}
			}
			if(mapFn){
				arr=arr.map( mapFn, thisArg);
			}
			return arr;
		};
	}

	if(!Function.prototype.bind){
		Function.prototype.bind=function(context){
			var self=this,args=Array.prototype.slice.call(arguments,1);
			return function(){
				return self.apply(context,args.concat(Array.from(arguments)));
			};
		};
	}

	if(!globalThis.Symbol){
		globalThis.Symbol=(function(){
			var sqe=0;
			var all={};
			function Symbol(desc){
				this.__name__="@@"+desc+":"+sqe;
				sqe++;
				all[this.__name__]=this;
			}
			Symbol.prototype.toString=function(){
				return this.__name__;
			};
			Object.getOwnPropertySymbols=function(obj){
				var arr=[];
				for(var key in obj){
					if(key.startsWith("@@")){
						if(Object.prototype.hasOwnProperty.call(obj,key)){
							arr.push(all[key]);
						}
					}
				}
				return arr;
			};
			return function(desc){
				return new Symbol(desc);
			};
		})();
		Symbol.sham=true;
		Symbol.iterator="@@iterator";
	}

	if(!Symbol.keyFor){
		Symbol.keyFor=function(symbol){
			return symbol.__desc__;
		};
	}
	if(! ('for' in Symbol)){
		var symbol_cache={};
		Symbol['for']=function(desc){
			if(Object.prototype.hasOwnProperty.call(symbol_cache,desc)){
				return symbol_cache[desc];
			}
			var s=Symbol(desc);
			s.__desc__=desc;
			symbol_cache[desc]=s;
			return s;
		};
	}

	if(!Symbol.iterator){
		Symbol.iterator=Symbol("iterator");
	}

	var dontEnums=["toString","toLocaleString","valueOf","hasOwnProperty", "isPrototypeOf","propertyIsEnumerable"];
	function hasOwn(obj,key){
		if(typeof obj!=="object"){
			return false;
		}
		if(!(key in obj)){
			return false;
		}
		var value=obj[key];
		if(!(obj instanceof Object)){
			var constructor=obj.constructor;
			if(constructor){
				var proto=constructor.prototype;
				return proto[key]!==value;
			}
		}
		return Object.prototype.hasOwnProperty.call(obj,key);
	}function compat_forIn(obj,fn,thisArg){
		if(typeof obj!=="object"){
			return false;
		}
		var isJsObject=obj instanceof Object;
		for(var key in obj) {
			if(!isJsObject){
				if(key.startsWith("__") || key==="constructor"){
					continue ;
				}
			}
			if(key.startsWith("@@")){
				continue ;
			}
			if(fn.call(thisArg,obj[key],key)===false){
				return false;
			}
		}
		var i=dontEnums.length;
		var proto=Object.getPrototypeOf(obj);
		//遍历nonEnumerableProps数组
		while(i--){
			var prop=dontEnums[i];
			if(prop in obj && obj[prop]!==proto[prop]){
				if(fn.call(thisArg,obj[prop],prop)===false){
					return false;
				}
			}
		}
		return true;
	}
	function compat_keys$1(obj){
		var result=[],key;
		var isJsObject=obj instanceof Object;
		if(!isJsObject){
			var proto=Object.getPrototypeOf(obj);
			if(proto){
				for(key in obj){
					if(!key.startsWith("@@") && !key.startsWith("__") && proto[key]!==obj[key]){
						result.push(key);
					}
				}
				return result;
			}
		}
		for(key in obj){
			if(Object.prototype.hasOwnProperty.call(obj,key) && !key.startsWith("@@") && !key.startsWith("__")){
				result.push(key);
			}
		}
		var i=dontEnums.length;
		while(i-->0){
			key=dontEnums[i];
			if(hasOwn(obj,key)){
				result.push(key);
			}
		}
		return result;
	}

	var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');

	if(!Object.keys){
		if(hasEnumBug){//仿真模式下没有BUG
			Object.keys=compat_keys$1;
		}
	}

	if(!Object.assign){
		Object.assign=function(target, varArgs){
			if(target===null){
				throw 'Cannot convert undefined or null to object';
			}
			var to=target;
			for(var i=1;i<arguments.length;i++){
				var obj=arguments[i];
				if(obj!=null){
					var keys=Object.keys(obj);
					for(var j=0;j<keys.length;j++){
						var key=keys[j];
						to[key]=obj[key];
					}
				}
			}
			return target;
		};
	}

	function compat_createObject(proto){
		function F(){}
		F.prototype = proto;
		return new F();
	}function compat_inherits(subClass,superClass){
		Object.assign(subClass,superClass);
		subClass.prototype=Object.create(superClass.prototype);
		subClass.prototype.constructor=subClass;
		subClass.__proto__=superClazz.prototype;
	}function compat_getPrototypeOf(obj){
		if(typeof obj!=="object"){
			obj=Object(obj);
		}
		if(!('constructor' in obj)){
			return null;
		}
		if(Object.prototype.hasOwnProperty.call(obj,'constructor')){
			if('__proto__' in obj.constructor){
				return obj.constructor.__proto__.prototype;
			}
		}
		return obj.constructor.prototype;
	}

	if(!Object.create){
		Object.create=compat_createObject;
	}

	if(!Object.getPrototypeOf){
		Object.getPrototypeOf=compat_getPrototypeOf;
	}

	var DESC_KEY=Symbol("descriptor");
	function compat_defineProperty(obj, prop, descriptor){
		if('value' in descriptor){
			obj[prop]=descriptor.value;
		}else {
			console.warn("ES3 do NOT support accessor.");
		}
		if(!obj[DESC_KEY]){
			obj[DESC_KEY]=new Object();
		}
		obj[DESC_KEY][prop]=descriptor;
	}
	var native_defineProperty=Object.defineProperty;
	function ie8_defineProperty(obj, prop, descriptor){
		if(obj instanceof Object){
			compat_defineProperty.apply(Object,arguments);
		}else {
			delete descriptor.enumerable;
			native_defineProperty.apply(Object,arguments);
		}
	}function compat_getOwnPropertyDescriptor(obj,prop){
		var descriptor=obj[DESC_KEY];
		if(descriptor) return descriptor[prop];
		if(prop in obj){
			return {value: obj[prop], writable: true, enumerable: true, configurable: true};
		}
	}function compat_get(target,propertyKey,receiver){
		if(receiver===void 0){ receiver=target;}
		var o=target,attributes;
		do{
			attributes=getOwnPropertyDescriptor(o,propertyKey);
			if(attributes){
				if(attributes.get){
					return attributes.get.call(receiver);
				}
				return attributes.value;
			}
			o=Object.getPrototypeOf(o);
		}while(o && o!==Object.prototype);
		return target[propertyKey];
	}function compat_set(target,propertyKey,value,receiver){
		if(receiver===void 0){ receiver=target;}
		var o=target,attributes;
		do{
			attributes=getOwnPropertyDescriptor(o,propertyKey);
			if(attributes){
				if(attributes.set){
					attributes.set.call(receiver,value);
				}
				return true;
			}
			o=Object.getPrototypeOf(o);
		}while(o && o!==Object.prototype);
		target[propertyKey]=value;
		return true;
	}function compat_deleteProperty(target, prop){
		var descriptor=target[DESC_KEY];
		delete descriptor[prop];
		delete target[prop];
	}

	if(!Object.getOwnPropertyDescriptor){
		Object.getOwnPropertyDescriptor=compat_getOwnPropertyDescriptor;
	}

	if(!Object.defineProperty) {
		if(!Object.prototype.__defineSetter__){
			Object.defineProperty=compat_defineProperty;
		}
	}else if(!Object.defineProperties){
		Object.defineProperty=ie8_defineProperty;
	}

	if(!Object.defineProperties){
		Object.defineProperties=function(obj,properties){
			compat_forIn(properties,function(descriptor,key){
				Object.defineProperty(obj,key,descriptor);
			});
		};
	}

	if (!Object.is){
		Object.is=function(x, y){
			if(x===y){// Steps 1-5, 7-10
				// Steps 6.b-6.e: +0 != -0
				return x!==0 || 1/x===1/y;
			}else {
				// Step 6.a: NaN == NaN
				return x!==x && y!==y;
			}
		};
	}

	function apply(target, thisArgument, argumentsList){
		return Function.prototype.apply.call(target, thisArgument, argumentsList);
	}function construct(target, argumentsList,NewTarget){
		var o=Object.create(target.prototype);
		if(!NewTarget){ NewTarget=o;}
		var o2=Reflect.apply(target,NewTarget,argumentsList);
		if(o2!==void 0){
			return o2;
		}
		return o;
	}function defineProperty(target, propertyKey, attributes){
		try{
			Object.defineProperty(target, propertyKey, attributes);
			return true;
		}catch(e){
			console.error(e);
		}
		return false;
	}

	function modern_get(target,propertyKey,receiver){
		if(receiver===void 0){ receiver=target;}
		var o=target,attributes;
		do{
			attributes=Object.getOwnPropertyDescriptor(o,propertyKey);
			if(attributes){
				if(attributes.get){
					return attributes.get.call(receiver);
				}
				return attributes.value;
			}
			o=Object.getPrototypeOf(o);
		}while(o && o!==Object.prototype);
		return target[propertyKey];
	}function modern_set(target,propertyKey,value,receiver){
		if(receiver===void 0){ 
			try{
				target[propertyKey]=value;
				return true;
			}catch(e){
				return false;
			}
		}
		var o=target,desc;
		do{
			desc=Object.getOwnPropertyDescriptor(o,propertyKey);
			if(desc){
				if(desc.set){
					try{
						descriptor.set.call(receiver,value);
						return true;
					}catch(e){
						return false;
					}
				}else if('value' in desc){
					target[propertyKey]=value;
					return true;
				}
			}
			o=Object.getPrototypeOf(o);
		}while(o && o!==Object.prototype);
		target[propertyKey]=value;
		return true;
	}function modern_deleteProperty(target, key){
		delete target[key];
	}

	if(!globalThis.Reflect){
		globalThis.Reflect={
			apply:apply,
			construct:construct,
			defineProperty:defineProperty,
			getPrototypeOf:Object.getPrototypeOf,
			getOwnPropertyDescriptor:Object.getOwnPropertyDescriptor
		};
		if(-[1,]){
			Reflect.set=modern_set;
			Reflect.get=modern_get;
			Reflect.deleteProperty=modern_deleteProperty;
		}else {
			Reflect.set=compat_set;
			Reflect.get=compat_get;
			Reflect.deleteProperty=compat_deleteProperty;
		}
	}

	if(!Array.prototype.indexOf){
		Array.prototype.indexOf=function(e,fromIndex){
			fromIndex=isNaN(fromIndex)?0:fromIndex;
			for(var i=fromIndex,j;i<this.length; i++){
				j=this[i];
				if(j===e){return i;}
			}
			return -1;
		};
	}

	if(!Array.prototype.lastIndexOf){
		Array.prototype.lastIndexOf = function(e, fromIndex) {
			var i=isNaN(fromIndex)?this.length:fromIndex+1;
			while(i--){
				var j=this[i];
				if(j===e){return i;}
			}
			return -1;
		};
	}

	if(!Array.prototype.forEach){
		Array.prototype.forEach =function(callback, thisArg){
			var len=this.length;
			for(var i=0,j;i<len && i<this.length; i++){
				j=this[i];
				callback.call(thisArg,j,i,this);
			}
		};
	}

	if(!Array.prototype.map){
		Array.prototype.map = function(fn, context) {
			var arr = [];
			for (var k = 0, length = this.length; k < length; k++) {
				arr.push(fn.call(context, this[k], k, this));
			}
			return arr;
		};
	}

	if(!Array.prototype.filter){
		Array.prototype.filter = function(fn, context) {
			var arr = [];
			for (var k = 0, length = this.length; k < length; k++) {
				fn.call(context, this[k], k, this) && arr.push(this[k]);
			}
			return arr;
		};
	}

	if(!Array.prototype.some){
		Array.prototype.some = function(fn, context) {
			var passed = false;
			for (var k = 0, length = this.length; k < length; k++) {
				if (passed === true) break;
				passed = !!fn.call(context, this[k], k, this);
			}
			return passed;
		};
	}

	if(!Array.prototype.every){
		Array.prototype.every = function(fn, context) {
			var passed = true;
			for (var k = 0, length = this.length; k < length; k++) {
				if (passed === false) break;
				passed = !!fn.call(context, this[k], k, this);
			}
			return passed;
		};
	}

	if(!Array.prototype.reduce){
		Array.prototype.reduce=function(callback){
			var i,value;
			if(arguments.length>=2){
				value=arguments[1];
				i=0;
			}else if(this.length>0){
				value=this[0];
				i=1;
			}else {
				throw new Error("Reduce of empty array with no initial value");
			}
			while(i<this.length){
				if (i in this) {
					value=callback(value,this[i],i,this);
				}
				i++;
			}
			return value;
		};
	}

	if(!Array.isArray){
		Array.isArray=function(obj){
			return Object.prototype.toString.call(obj)==='[object Array]';
		};
	}

	if(!Array.of){
		Array.of=function(){
			return Array.prototype.slice.call(arguments);
		};
	}

	if(!Array.prototype.includes){
		Array.prototype.includes=function(search,start){
			return this.indexOf(search, start)!==-1;
		};
	}

	if(!Array.prototype.findIndex){
		Array.prototype.findIndex = function(callback, thisArg) {
			for(var i=0,j; i<this.length; i++){
				j=this[i];
				var r=callback.call(thisArg,j,i,this);
				if(r){
					return i;
				}
			}
			return -1;
		};
	}

	if(!Array.prototype.find){
		Array.prototype.find = function(callback, thisArg) {
			var i=this.findIndex(callback, thisArg);
			if(i>=0){
				return this[i];
			}
		};
	}

	function Iterator(arr){
		this.array=arr;
		this.i=0;
	}
	Iterator.prototype.next=function(){
		var result={};
		result.done=this.array.length<=this.i;
		if(!result.done){
			result.value=this.array[this.i];
			this.i++;
		}
		return result;
	};
	if(!Array.prototype.entries){
		Array.prototype.entries=function(){
			return new Iterator(this);
		};
	}
	if(!Array.prototype[Symbol.iterator]){
		Array.prototype[Symbol.iterator]=Array.prototype.entries;
	}

	function prefixIntrger2(number) {
		if(number<10){
			return '0'+number;
		}
		return number;
	}

	function prefixIntrger3(number) {
		if(number<100){
			return '0'+prefixIntrger2(number);
		}
		return number;
	}

	if(!Date.prototype.toISOString){
		Date.prototype.toISOString = function() {
			return this.getUTCFullYear()+
				'-'+prefixIntrger2(this.getUTCMonth()+1)+
				'-'+prefixIntrger2(this.getUTCDate()) +
				'T'+prefixIntrger2(this.getUTCHours()) +
				':'+prefixIntrger2(this.getUTCMinutes()) +
				':'+prefixIntrger2(this.getUTCSeconds()) +
				'.'+prefixIntrger3(this.getUTCMilliseconds())+'Z';
		};
	}

	if(!Date.prototype.toJSON){
		Date.prototype.toJSON=Date.prototype.toISOString;
	}

	if(!Date.now){
		Date.now=function(){
			return new Date().getTime();
		};
	}

	if(!Date.prototype.toLocaleFormat){//部分浏览器支持
		Date.prototype.toLocaleFormat = function(format) {
			var Y=this.getFullYear();
			var M=prefixIntrger2(this.getMonth()+1);
			var D=prefixIntrger2(this.getDate());
			var h=prefixIntrger2(this.getHours());
			var m=prefixIntrger2(this.getMinutes());
			var s=prefixIntrger2(this.getSeconds());
			var o={
				"%x":Y+"/"+M+"/"+D,
				"%X":h+":"+m+":"+s,
				"%Y":Y,
				"%y":prefixIntrger2(this.getYear()%100),
				"%m":M,
				"%e":this.getDate(),
				"%d":D,
				"%H":h,
				"%i":prefixIntrger2(this.getHours()%12),
				"%M":m,
				"%S":s,
				"%p":this.getHours()%12>1?"PM":"AM",
				"%%":"%"
			};
			o["%T"]=o["%X"];
			return format.replace(/%[xXTYymedHiMSp%]/g,function(word){
				for(var k in o){
					if(k==word){
						return o[k];
					}
				}
				return word;
			});
		};
	}

	//部分非IE浏览器的toLocaleString未国际化
	if(new Date().toLocaleString().match(/[a-z]/i)){
		Date.prototype.toLocaleString = function() {
			return this.toLocaleFormat("%Y-%m-%d %H:%M:%S");
		};
		Date.prototype.toLocaleDateString = function() {
			return this.toLocaleFormat("%Y-%m-%d");
		};
		Date.prototype.toLocaleTimeString = function() {
			return this.toLocaleFormat("%H:%M:%S");
		};
	}

	function createSet(){
		globalThis.Set=function(arr){
			this.items=new Array();
			if(arr){
				var entries=arr[Symbol.iterator];
				if(entries){
					var it=entries.call(arr);
					while(true){
						var next=it.next();
						if(next.done) break ;
						this.add(next.value);
					}
				}
			}
			this.size=this.items.length;
		};
		Set.prototype.has=function(value){
			return this.items.indexOf(value)>=0;
		};
		Set.prototype.add=function(value){
			if(!this.has(value)){
				this.items.push(value);
				this.size=this.items.length;
			}
			return this;
		};
		Set.prototype['delete']=function(value){
			var i=this.items.indexOf(value);
			if(i>=0){
				this.items.splice(i,1);
				this.size=this.items.length;
				return true;
			}
			return false;
		};
		Set.prototype.clear=function(){
			this.items.splice(0,this.items.length);
			this.size=0;
		};
		Set.prototype.forEach=function(callback,thisArg){
			for(var i=0,j;i<this.size; i++){
				j=this.items[i];
				callback.call(thisArg,j,j,this);
			}
		};
		Set.prototype.values=function(){
			return this.items.entries();
		};
		Set.prototype[Symbol.iterator]=Set.prototype.values;
	}

	if(!globalThis.Set){
		createSet();
	}

	function find(arr,key,value){
		for(var i=0; i<arr.length; i++){
			if(arr[i][key]===value){return arr[i];}
		}
	}

	function findIndex(arr,key,value){
		for(var i=0; i<arr.length; i++){
			if(arr[i][key]===value){return i;}
		}
		return -1;
	}

	function createMap(){
		globalThis.Map=function(arr){
			this.items=new Array();
			if(arr){
				var entries=arr[Symbol.iterator];
				if(entries){
					var it=entries.call(arr);
					while(true){
						var next=it.next();
						if(next.done) break ;
						this.set(next.value[0],next.value[1]);
					}
				}
			}
			this.size=this.items.length;
		};
		Map.prototype.entries=function(){
			return this.items.entries();
		};
		Map.prototype.clear=function(){
			this.items.splice(0,this.items.length);
			this.size=0;
		};
		Map.prototype["delete"]=function(key){
			var i=findIndex(this.items,0,key);
			if(i>=0){
				var r=this.items[i];
				this.items.splice(i,1);
				this.size=this.items.length;
				return r;
			}
			return false;
		};
		Map.prototype.forEach=function(callbackfn,thisArg){
			var len=this.size;
			for(var i=0,j;i<len; i++){
				j=this.items[i];
				if(j){
					callbackfn.call(thisArg,j[1],j[0],this);
				}
			}
		};
		Map.prototype.get=function(key){
			var r=find(this.items,0,key);
			if(r){
				return r[1];
			}
		};
		Map.prototype.has=function(key){
			return findIndex(this.items,0,key)>=0;
		};
		Map.prototype.set=function(key,value){
			var r=find(this.items,0,key);
			if(r){
				r[1]=value;
			}else {
				this.items.push([key,value]);
			}
			this.size=this.items.length;
			return this;
		};
		Map.prototype[Symbol.iterator]=Map.prototype.entries;
	}

	if(!globalThis.Map){
		createMap();
	}

	var rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	function escapeString(str){//from lodash
		rx_escapable.lastIndex = 0;
		return rx_escapable.test(str)
			? str.replace(rx_escapable, function(a) {
			var meta = {
				"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r": "\\r",	"\"": "\\\"","\\": "\\\\"
			};
			var c = meta[a];
			return typeof c === "string"
				? c
				: "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
		}): str;
	}

	function isFunction(obj){
		return Object.prototype.toString.call(obj)==='[object Function]';
	}

	function stringify(obj){
		switch(obj){
			case undefined:
			case null:
				return "null";
			case false:
			case true:
				return obj;
			default:
				var type=Object.prototype.toString.call(obj);
				switch(type){
					case '[object String]':
						return '"'+escapeString(obj)+'"';
					case '[object Number]':
						return isNaN(obj)?"null":obj.toString();
					case '[object Array]':
						return "["+obj.map(stringify).join(",")+"]";
					default:
						if(obj.toJSON && isFunction(obj.toJSON)){
							return stringify(obj.toJSON());
						}
						var items=[];
						var keys=Object.keys(obj);
						for(var i=0;i<keys.length;i++){
							var key=keys[i];
							var value=obj[key];
							if(value!==void 0){
								if(!isFunction(value)){
									items.push('"'+escapeString(key)+'":'+stringify(value));
								}
							}
						}
						return "{"+items.join(",")+"}";
				}
		}
	}
	function parse(str){
		return eval('('+str+')');
	}

	if(!globalThis.JSON){
		globalThis.JSON={
			stringify:stringify,
			parse:parse
		};
	}

	if(!globalThis.URLSearchParams){
		globalThis.URLSearchParams=function(paramsString){
			this._data=new Array();
			if(paramsString){
				var i,pair;
				if(Array.isArray(paramsString)){
					i=this._data.length=paramsString.length;
					while(i-->0){
						pair=paramsString[i];
						this._data[i]=new Array(pairs[1],pairs[0]);
					}
				}else {
					var pairs=paramsString.split("&");
					i=this._data.length=pairs.length;
					while(i-->0){
						pair=pairs[i];
						if(pair){
							var id=pair.indexOf("=");
							this._data[i]=new Array(decodeURIComponent(pair.substring(id+1,pair.length)),decodeURIComponent(pair.substring(0,id)));
						}
					}
				}
			}
		};
		URLSearchParams.prototype.append=function(key,value){
			this._data.push([value,key]);
		};
		URLSearchParams.prototype.get=function(key){
			var item=this._data.find(function(item){
				return item[1]==key;
			});
			if(item) return item[0];
			return null;
		};
		URLSearchParams.prototype.getAll=function(key){
			return this._data.filter(function(item){
				return item[1]==key;
			}).map(function(item){
				return item[0];
			});
		};
		URLSearchParams.prototype.set=function(key,value){
			var item=this._data.find(function(item){
				return item[1]==key;
			});
			if(item){
				item[0]=value;
			}else {
				this.append(key,value);
			}
		};
		URLSearchParams.prototype['delete']=function(key){
			this._data=this._data.filter(function(item){
				return item[1]!=key;
			});
		};
		URLSearchParams.prototype.has=function(key){
			return this._data.some(function(item){
				return item[1]==key;
			});
		};
		URLSearchParams.prototype.toString=function(){
			return this._data.map(function(item){
				return encodeURIComponent(item[1])+"="+encodeURIComponent(item[0]);
			}).join("&");
		};
		URLSearchParams.prototype.sort=function(){
			return this._data.sort(function(a,b){
				return a[1] > b[1];
			});
		};
		URLSearchParams.prototype.forEach=function(fn,thisArg){
			this._data.forEach.apply(this._data,arguments);
		};
	}

	function SearchParams(url){
		this.url=url;
	}SearchParams.prototype=Object.create(URLSearchParams.prototype);
	["append","set","delete"].forEach(function(method){
		SearchParams.prototype[method]=function(key,value){
			var searchParams=new URLSearchParams(this.url.search.replace(/^\?/,""));
			searchParams[method].apply(searchParams,arguments);
			this.url.search="?"+searchParams.toString();
		};
	});
	["getAll","get","has","toString","forEach"].forEach(function(method){
		SearchParams.prototype[method]=function(key,value){
			var searchParams=new URLSearchParams(this.url.search.replace(/^\?/,""));
			return searchParams[method].apply(searchParams,arguments);
		};
	});

	if(!-[1,]){
		window.VBURLDescs={
			host:{
				enumerable:true,
				get:function(){
					if(this.port){
						return this.hostname+":"+this.port;
					}
					return this.hostname;
				},
				set:function(value){
					var pattern=/(.*):(\d+)$/;
					var arr=value.match(pattern);
					this.port="";
					if(arr){
						this.hostname=arr[1];
						this.port=arr[2];
					}else {
						this.hostname=value;
					}
				}
			},
			origin:{
				enumerable:true,
				get:function(){
					return this.protocol+"//"+this.host;
				}
			},
			href:{
				enumerable:true,
				get:function(){
					var user=this.username;
					if(user){
						if(this.password){
							user+=":"+this.password;
						}
						user+="@";
					}
					return this.protocol+"//"+user+this.host+this.pathname+this.search+this.hash;
				},
				set:function(value){
					var url=new URL(value);
					this.protocol=url.protocol;
					this.hostname=url.hostname;
					this.pathname=url.pathname;
					this.port=url.port;
					this.search=url.search;
					this.hash=url.hash;
					this.username=url.username;
					this.password=url.password;
					url=null;
				}
			}
		};
		window.URL=function(relativePath, absolutePath){
			var path,arr;
			this.port=this.search=this.hash=this.username=this.password="";
			this.searchParams=new SearchParams(this);
			var pattern=/^[a-zA-Z]+:/;
			if(arr=relativePath.match(pattern)){
				this.protocol=arr[0];
				path=relativePath.replace(pattern,"");
				pattern=/^\/*([^\/]+)/;
				var host=path.match(pattern)[1];
				path=path.replace(pattern,"");
				arr=host.split("@");
				if(arr.length>1){
					this.host=arr[1];
					arr=arr[0].split(":");
					if(arr.length>1){
						this.username=arr[0];
						this.password=arr[1];
					}else {
						this.username=arr[0];
					}
				}else {
					this.host=host;
				}
			}else if(absolutePath){
				var absInfo=absolutePath.indexOf?new URL(absolutePath):absolutePath;
				this.protocol=absInfo.protocol;
				this.hostname=absInfo.hostname;
				this.port=absInfo.port;
				if(absInfo.username) this.username=absInfo.username;
				if(absInfo.password) this.password=absInfo.password;
				this.pathname=absInfo.pathname;
				if(relativePath.startsWith("#")){
					this.search=absInfo.search;
					this.hash=relativePath;
					return VBUrlFactory(this);
				}else if(relativePath.startsWith("?")){
					var a=relativePath.indexOf("#");
					if(a<0){
						this.search=relativePath;
						this.hash="";
					}else {
						this.search=relativePath.substr(0,a);
						this.hash=relativePath.substring(a,relativePath.length);
					}
					return VBUrlFactory(this);
				}else if(relativePath.startsWith("/")){
					path=relativePath;
				}else if(relativePath.startsWith("../")){
					path=absInfo.pathname.replace(/\/[^\/]*$/,"/")+relativePath;
					pattern=/[^\/]+\/\.\.\//;
					while(pattern.test(path)){
						path=path.replace(pattern,"");
					}
					path=path.replace(/^(\/\.\.)+/,"");
				}else {
					path=absInfo.pathname.replace(/[^\/]*$/,"")+relativePath.replace(/^\.\//,"");
				}
				absInfo=null;
			}else {
				throw "SYNTAX_ERROR";
			}
			pattern=/^[^#]*/;
			this.hash=path.replace(pattern,"");
			arr=path.match(pattern);
			path=arr[0];
			pattern=/^[^\?]*/;
			this.search=path.replace(pattern,"");
			arr=path.match(pattern);
			this.pathname=arr[0];
			return VBUrlFactory(this);
		};
		try{
			window.execScript([
				'Class VBURL',
				'	Public [constructor]',
				'	Public [protocol]',
				'	Public [hostname]',
				'	Public [pathname]',
				'	Public [port]',
				'	Public [search]',
				'	Public [searchParams]',
				'	Public [hash]',
				'	Public [username]',
				'	Public [password]',
				'	Public Property Let [host](var)',
				'		Call VBURLDescs.host.set.call(Me,var)',
				'	End Property',
				'	Public Property Get [host]',
				'		[host]=VBURLDescs.host.get.call(Me)',
				'	End Property',
				'	Public Property Get [origin]',
				'		[origin]=VBURLDescs.origin.get.call(Me)',
				'	End Property',
				'	Public Property Let [href](var)',
				'		Call VBURLDescs.href.set.call(Me,var)',
				'	End Property',
				'	Public Property Get [href]',
				'		[href]=VBURLDescs.href.get.call(Me)',
				'	End Property',
				'End Class',
				'Function VBUrlFactory(url)',
				'	Dim o',
				'	Set o = New VBURL',
				'	Call Object.assign(o,url)',
				'	Set o.searchParams.url = o',
				'	Set o.constructor = URL',
				'	Set VBUrlFactory = o',
				'End Function'
			].join('\n'), 'VBScript');
		}catch(e){
			window.VBUrlFactory=function(url){
				if(url.host){
					VBURLDescs.host.set.call(url,url.host);
				}else {
					url.host=VBURLDescs.host.get.call(url);
				}
				url.href=VBURLDescs.href.get.call(url);
				url.origin=VBURLDescs.origin.get.call(url);
				return url;
			};
		}
		window.URL=URL;
	}

	if(!globalThis.queueMicrotask){
		globalThis.queueMicrotask=(function(setTimeout){
			var ticks=null;
			function nextTick(fn){
				if(!ticks){
					ticks=new Array();
					setTimeout(next);
				}
				ticks.push(fn);
			}		function next(){
				if(ticks && ticks.length){
					for(var i=0;i<ticks.length;i++){
						var fn=ticks[i];
						try{
							fn();
						}catch(e){
							console.error(e);
						}
					}
					ticks=null;
				}
			}
			return nextTick;
		})(window.Promise?Promise.prototype.then.bind(Promise.resolve(1)):(window.setImmediate?window.setImmediate:setTimeout));
	}

	function noop(){}

	var PENDING=Symbol("pending");
	var RESOLVED=Symbol("resolved");
	var REJECTED=Symbol("rejected");
	if(!globalThis.Promise){
		globalThis.Promise=(function(){
			function Promise(executor){
				this._resolveds=[];
				this._rejecteds=[];
				this._state=PENDING;//resolved | rejected
				
				var me=this;
				function resolve(value) {
					queueMicrotask(function(){
						if(me._state===PENDING){
							me.data=value;
							me._state=RESOLVED;
							me._resolveds.forEach(callAll,me);
							me._resolveds=null;
						}
					});
				}
				function reject(reason) {
					queueMicrotask(function(){
						if(me._state===PENDING){
							me.data=reason;
							me._state=REJECTED;
							me._rejecteds.forEach(callAll,me);
							me._rejecteds=null;
						}
					});
				}
				try{
					executor(resolve, reject);
				}catch(e){
					reject(e);
				}
			}
			function callAll(fn){
				fn.call(this,this.data);
			}
			function nextPromise(before,after,resolve,reject){
				return function(value){
					try{
						var x=before(value);
						if(x && (typeof x.then==="function")){
							x.then(resolve, reject);
						}else {
							after(x);
						}
					}catch(r){
						reject(r);
					}
				};
			}
			Promise.prototype.then=function(onResolved, onRejected){
				var me=this;
				onResolved=onResolved || noop;
				onRejected=onRejected || noop;
				return new Promise(function(resolve,reject){
					switch(me._state){
						case RESOLVED:
							queueMicrotask(nextPromise(onResolved,resolve,resolve,reject),me.data);
							break ;
						case REJECTED:
							queueMicrotask(nextPromise(onRejected,reject,resolve,reject),me.data);
							break ;
						default:
							me._resolveds.push(nextPromise(onResolved,resolve,resolve,reject));
							me._rejecteds.push(nextPromise(onRejected,reject,resolve,reject));
					}
				});
			};
			Promise.prototype['catch']=function(onRejected){
				return this.then(undefined,onRejected);
			};
			Promise.all=function(promises){
				if (!Array.isArray(promises)) {
					throw new TypeError('You must pass an array to all.');
				}
				return new Promise(function(resolve,reject){
					if(promises.length==0) return resolve(new Array());
					var result=new Array(promises.length);
					var c=0;
					promises.forEach(function(one,index){
						if(typeof one.then==="function"){
							one.then(function(data){
								c++;
								result[index]=data;
								if(c>=promises.length){
									resolve(result);
								}
							},function(data){
								reject(data);
							});
						}else {
							c++;
							result[index]=one;
							if(c>=promises.length){
								resolve(result);
							}
						}
					});
				});
			};
			Promise.race=function(promises){
				if (!Array.isArray(promises)) {
					throw new TypeError('You must pass an array to all.');
				}
				return new Promise(function(resolve,reject){
					promises.forEach(function(one){
						one.then(function(){
							resolve();
						},function(){
							reject();
						});
					});
				});
			};
			Promise.resolve=function(arg){
				return new Promise(function(resolve,reject){
					resolve(arg);
				});
			};
			Promise.reject=function(arg){
				return Promise(function(resolve,reject){
					reject(arg);
				});
			};
			return Promise;
		})();
	}

	if(!('finally' in Promise.prototype)){
		Promise.prototype['finally']=function(onCompleted){
			return this.then(onCompleted,onCompleted);
		};
	}

	if(!('origin' in location)){
		location.origin=location.protocol+"//"+location.host;
	}

	if(!('head' in document)) document.head=document.getElementsByTagName("head")[0];

	if(globalThis.Element) {
		if(!('previousElementSibling' in document.head)){
			Object.defineProperty(Element.prototype,"previousElementSibling", {
				get:function(){
					var e = this.previousSibling;
					while(e && 1 !== e.nodeType)
						e = e.previousSibling;
					return e;
				}
			});
		}
		if(!('nextElementSibling' in document.head)){
			Object.defineProperty(Element.prototype,"nextElementSibling", {
				get:function(){
					var e = this.nextSibling;
					while(e && 1 !== e.nodeType)
						e = e.nextSibling;
					return e;
				}
			});
		}
	}

	if(!globalThis.console){
		console={};
		console.stack=[];
		console.log=console.info=console.error=console.warn=function(data){
			console.stack.push(data);
			window.status=data;
			Debug.writeln(data);
		};
		console.clear=function(){
			console.stack=[];
		};
	}

	if(window.HTMLDocument){
		/** 判断一个节点后代是否包含另一个节点 **/
		if(!HTMLDocument.prototype.contains && HTMLDocument.prototype.compareDocumentPosition){
			HTMLDocument.prototype.contains=function(arg){
				return !!(this.compareDocumentPosition(arg) & 16);
			};
		}
	}

	if(!document.contains && 'all' in document){
		document.contains=function(ele){
			var i,arr=document.all;
			for(i=0;i<arr.length;i++){
				if(arr[i]===ele){
					return true;
				}
			}
			return false;
		};
	}

	if(!globalThis.localStorage){
		globalThis.localStorage=new function(){
			var ele=document.createElement("localStorage");
			if(ele.addBehavior){
				ele.addBehavior("#default#userData");
				document.head.appendChild(ele);
				this.getItem=function(key){
					ele.load("localStorage");
					return ele.getAttribute(key);
				};
				this.setItem=function(key,value){
					ele.setAttribute(key,new String(value));
					ele.save("localStorage");
				};
				this.removeItem=function(key){
					ele.removeAttribute(key);
					ele.save("localStorage");
				};
				this.sham=true;
			}
		}();
	}

	function getCookie(name){
		var arr=document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if(arr != null) return decodeURIComponent(arr[2]); return null;
	}

	function isNumber(obj){
		return Object.prototype.toString.call(obj)==='[object Number]';
	}

	function setCookie(name,value){
		var path="/";
		var seconds;
		var domain;
		var expires;
		if(arguments.length>2){
			for(var i=2;i<arguments.length;i++){
				if(isNumber(arguments[i])){
					seconds=arguments[i];
				}else if(isString(arguments[i])){
					if(arguments[i].indexOf(".")>=0){
						domain=arguments[i];
					}else if(arguments[i].indexOf("/")>=0){
						path=arguments[i];
					}
				}
			}
		}
		if(value==null || seconds<=0) {
			value='';
			seconds=-2592000;
		}
		if(!isNaN(seconds)){
			expires=new Date();
			expires.setTime(expires.getTime() + seconds * 1000);
		}
		document.cookie=name+'='+encodeURIComponent(value)
			+(expires?'; expires='+expires.toGMTString():'')
			+'; path='+path
			+(domain?'; domain='+domain:'');
	}

	if(!globalThis.sessionStorage){
		globalThis.sessionStorage=new function(){
			var ele=document.createElement("sessionStorage");
			var sessionId=getCookie("JSESSIONID");
			if(!sessionId){
				sessionId=Math.random().toString(16).replace("0.","");
				setCookie("JSESSIONID",sessionId);
			}
			if(ele.addBehavior){
				ele.addBehavior("#default#userData");
				document.head.appendChild(ele);
				this.getItem=function(key){
					ele.load(sessionId);
					return ele.getAttribute(key);
				};
				this.setItem=function(key,value){
					ele.setAttribute(key,new String(value));
					ele.save(sessionId);
				};
				this.removeItem=function(key){
					ele.removeAttribute(key);
					ele.save(sessionId);
				};
				this.sham=true;
			}
		}();
	}

	if(!document.scripts){
		document.scripts=document.scripts=document.getElementsByTagName("script");
	}

	if(window.Element){
		/** 判断一个节点后代是否包含另一个节点 **/
		if(!Element.prototype.contains && Element.prototype.compareDocumentPosition){
			Element.prototype.contains=function(arg){
				return !!(this.compareDocumentPosition(arg) & 16);
			};
		}
	}
	if(window.Node){
		if(!('parentElement' in document.head)){
			Node.prototype.__defineGetter__("parentElement", function() {
				var parent=this.parentNode;
				if(parent && parent.nodeType===1){
					return parent;
				}
				return null;
			});
		}
	}

	if(typeof Event!=="function"){
		if(document.createEventObject){
			globalThis.Event=function(evt,init){
				var e=document.createEventObject();
				e.type=evt;
				if(init){
					e.bubbles=init.bubbles;
					e.cancelable=init.cancelable;
				}else {
					e.bubbles=false;
					e.cancelable=false;
				}
				return e;
			};
		}
	}

	if(typeof Event!=="function"){
		if(document.createEvent){
			globalThis.Event=function(evt,init){
				var e=document.createEvent('Event');
				if(init){
					e.initEvent(evt,init.bubbles,init.cancelable);
				}else {
					e.initEvent(evt,false,false);
				}
				return e;
			};
		}
	}

	var rules=[];
	function ckeck(ckeckFunc,index){
		return ckeckFunc(this[index]);
	}
	function compare(x, y){//比较函数
		return x.checks.length-y.checks.length;
	}
	function overload(checks,func,target){
		if(target){
			rules.push({
				'checks':checks,
				'func':func,
				'target':target
			});
			rules.sort(compare);
		}else {
			var args=checks;
			var thisVal=func;
			var i=rules.length;
			while(i--){
				var rule=rules[i];
				if(args.callee===rule.func){
					if(rule.checks.length>=args.length){
						if(rule.checks.every(ckeck,args)){
							return rule.target.apply(thisVal,args);
						}
					}
				}
			}
			return this;
		}
	}

	function isDate(obj){
		return Object.prototype.toString.call(obj)==='[object Date]';
	}

	function isRegExp(obj){
		return Object.prototype.toString.call(obj)==='[object RegExp]';
	}

	function isObject(obj){
		var type=typeof obj;
		if(type!=="object"){
			return false;
		}
		type=Object.prototype.toString.call(obj);
		switch(type){
			case '[object String]':
			case '[object Number]':
			case '[object Function]':
			case '[object Boolean]':
				return false;
		}
		if(typeof obj.toString==="function" && obj.toString().indexOf("@@")===0){
			return false;//symbol polyfill
		}
		return true;
	}

	function isDefined(obj){
		return obj!==void 0;
	}

	function isWindow$1(obj){
		return obj && typeof obj === "object" && "setInterval" in obj;
	}

	function isPlainObject(obj){
		if(obj===null){
			return true;
		}
		if(typeof obj!=="object" || obj.nodeType || isWindow(obj)){
			return false;
		}
		return Object.getPrototypeOf(obj)===Object.prototype;
	}

	function isArrayLikeObject(obj){
		if(typeof obj==="object" && isArrayLike(obj)){
			return true;
		}
		return false;
	}

	function isNumeric(obj){
		var n=parseFloat(obj);
		return !isNaN(n);
	}

	function isElement(obj){
		return obj?obj.nodeType===1:false;
	}

	function isInput(obj){
		return obj?obj.tagName==="INPUT":false;
	}

	function isDocument(obj){
		return obj===document;
	}

	function times(n,iteratee,thisArg){
		if(n<1){
			return [];
		}
		var index = -1,
			result = Array(n);
		while (++index < n) {
			result[index] = iteratee.apply(this,thisArg);
		}
		return result;
	}

	function random(a,b){
		var length=b-a+1;
		return Math.floor(Math.random()*length)+a;
	}

	function escapeHtml(str) {
		return str.replace(/&/g,'&amp;')
			.replace(/</g,'&lt;')
			.replace(/>/g,'&gt;');
	}

	function escapeAttribute(str,quot){
		var esc=escapeHtml(str);
		if(!quot || quot=='"'){
			return esc.replace(/"/g,'&quot;');
		}else {
			return esc.replaceAll(quot.charAt(0),'&#'+quot.charCodeAt(0)+";");
		}
	}

	var htmlEscapes={
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#39;',
		'`': '&#96;'
	};
	function escape(text){
		return text.replace(/[&<>"'`]/g,function(i){
			return htmlEscapes[i];
		});
	}

	var div=document.createElement('div');
	function unescape(html){
		div.innerHTML=html;
		return div.textContent || div.innerText;
	}

	var stringEscapes = {
		'\\': '\\',
		"'": "'",
		'\n': 'n',
		'\r': 'r',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};
	var regexpEscapes = {
		'0': 'x30', '1': 'x31', '2': 'x32', '3': 'x33', '4': 'x34',
		'5': 'x35', '6': 'x36', '7': 'x37', '8': 'x38', '9': 'x39',
		'A': 'x41', 'B': 'x42', 'C': 'x43', 'D': 'x44', 'E': 'x45', 'F': 'x46',
		'a': 'x61', 'b': 'x62', 'c': 'x63', 'd': 'x64', 'e': 'x65', 'f': 'x66',
		'n': 'x6e', 'r': 'x72', 't': 'x74', 'u': 'x75', 'v': 'x76', 'x': 'x78'
	};
	var reRegExpChars = /^[:!,]|[\\^$.*+?()[\]{}|\/]|(^[0-9a-fA-Fnrtuvx])|([\n\r\u2028\u2029])/g;

	function escapeRegExp(str){//from lodash
		if(str){
			reRegExpChars.lastIndex = 0;
			return (reRegExpChars.test(str))
				? str.replace(reRegExpChars, function(chr, leadingChar, whitespaceChar) {
				if (leadingChar) {
					chr = regexpEscapes[chr];
				} else if (whitespaceChar) {
					chr = stringEscapes[chr];
				}
				return '\\' + chr;
			})
				: str;
		}
		return "(?:)";
	}

	function replaceAll(str, reallyDo, replaceWith, ignoreCase) {
		return str.replace(new RegExp(escapeRegExp(reallyDo), (ignoreCase ? "gi": "g")), replaceWith);
	}

	function toString(o){
		return new String(o).valueOf();
	}

	function findLastIndex(arr,key,value){
		for(var i=arr.length-1; i>=0; i--){
			if(arr[i][key]===value){return i;}
		}
		return -1;
	}

	function findLast(arr,key,value){
		for(var i=arr.length-1; i>=0; i--){
			if(arr[i][key]===value){return value;}
		}
	}

	function sortBy(arr,key){
		return arr.sort(function(a,b){
			return a[key] > b[key];
		});
	}

	function pluck(arr,key){
		return arr.map(function(item){
			return item[key];
		});
	}

	function sortedIndex(arr,value){
		for(var i=0; i<arr.length; i++){
			if(arr[i]>=value){
				return i;
			}
		}
		return arr.length;
	}

	function sortedLastIndex(arr,value){
		for(var i=arr.length-1; i>=0; i--){
			if(arr[i]<=value){
				return i+1;
			}
		}
	}

	function shuffle(arr){
		var copyArr=arr.slice();
		var ubound=arr.length-1;
		for(var i=0; i<ubound; i++){
			var r=random(0,ubound);
			var tmp=copyArr[r];
			copyArr[r]=copyArr[i];
			copyArr[i]=tmp;
		}
		return copyArr;
	}

	function union(){
		var set=new Set();
		for(var i=0;i<arguments.length;i++){
			var arr=arguments[i];
			if(!Array.isArray(arr)){
				arr=Array.from(arr);
			}
			var j=arr.length;
			while(j-->0){
				set.add(arr[j]);
			}
		}
		return Array.from(set);
	}

	function difference(arg1){
		if(arguments.length===0){
			return new Array();
		}
		var set=new Set(arg1);
		for(var i=1;i<arguments.length;i++){
			var arr=arguments[i];
			if(!Array.isArray(arr)){
				arr=Array.from(arr);
			}
			var j=arr.length;
			while(j-->0){
				set['delete'](arr[j]);
			}
		}
		return Array.from(set);
	}

	function intersection(arg1){
		if(arguments.length===0){
			return new Array();
		}
		var set=new Set(arg1);
		for(var i=1;i<arguments.length;i++){
			var arr=arguments[i];
			if(!Array.isArray(arr)){
				arr=Array.from(arr);
			}
			set.forEach(function(item){
				if(arr.indexOf(item)<0) this['delete'](item);
			},set);
		}
		return Array.from(set);
	}

	function forOwn(obj,fn,thisArg){
		thisArg=thisArg || undefined;
		var keys=Object.keys(obj);
		for(var i=0;i<keys.length;i++){
			var key=keys[i];
			if(fn.call(thisArg,obj[key],key)===false){
				return false;
			}
		}
		return true;
	}

	function nosymbol_forIn(obj,fn,thisArg){
		for(var key in obj) {
			if(key.startsWith("@@")){
				continue ;
			}
			if(fn.call(thisArg,obj[key],key)===false){
				return false;
			}
		}
		return true;
	}function symbol_forIn(obj,fn,thisArg){
		for(var key in obj) {
			if(fn.call(thisArg,obj[key],key)===false){
				return false;
			}
		}
		return true;
	}

	if(!globalThis.Symbol || !Symbol.sham){
		if(hasEnumBug){
			Object.keys=compat_keys;
			exports.forIn=compat_forIn;
		}else {
			exports.forIn=nosymbol_forIn;
		}
	}else {
		exports.forIn=symbol_forIn;
	}

	function pick(obj,keys){
		var rest={};
		if(obj){
			var ownKeys=Object.keys(obj);
			var i=keys.length;
			while(i--){
				var key=keys[i];
				if(ownKeys.includes(key)){
					rest[key]=obj[key];
				}
			}
		}
		return rest;
	}

	function omit(obj,keys){
		var rest={};
		if(obj){
			var ownKeys=Object.keys(obj);
			var i=ownKeys.length;
			while(i--){
				var key=ownKeys[i];
				if(!keys.includes(key)){
					rest[key]=obj[key];
				}
			}
		}
		return rest;
	}

	function modern_inherits(clazz,superClazz){
		Object.setPrototypeOf(clazz,superClazz);
		clazz.prototype=Object.create(superClazz.prototype);
		clazz.prototype.constructor=clazz;
	}

	var inherits=-[1,]?modern_inherits:compat_inherits;

	function getCurrentScript(){
		var nodes=document.getElementsByTagName('SCRIPT');
		var i=nodes.length;
		while(i--){
			var node=nodes[i];
			if(node.readyState==="interactive"){
				return node;
			}
		}
		return null;
	}

	var supportStack;
	function getStackSupport(){
		try{
			throw new Error('get stack');
		}catch(e){
			var stackHandler={
				'stack':[
					/^@(.*):\d+$/,// Firefox
					/^\s+at (.*):\d+:\d+$/,//Chrome
					/^\s+at [^\(]*\((.*):\d+:\d+\)$/ //IE11
				],
				'stacktrace':[
					/\(\) in\s+(.*?\:\/\/\S+)/m//opera
				]
			};
			for(var name in stackHandler){
				var stacks=e[name];
				if(stacks){
					var patterns=stackHandler[name];
					var stack=getLastStack(stacks);
					var i=patterns.length;
					while(i--){
						var pattern=patterns[i];
						if(pattern.test(stack)){
							supportStack=true;
							return true;
						}
					}
				}
			}
		}
		return false;
	}
	function getCurrentPathByStack(){
		try{
			throw new Error('get stack');
		}catch(e){
			var arr=getLastStack(e[stackResult.name]).match(stackResult.pattern);
			if(arr){
				if(arr[1]!=location.href && arr[1]!=location.origin+location.pathname+location.search){
					return arr[1];
				}
			}
		}
	}
	function getLastStack(stack){
		var stacks=stack.trim().split("\n");	return stacks[stacks.length-1];
	}

	function getCurrentScriptByLast(){
		var path=supportStack?getCurrentPathByStack():null;
		var nodes=document.getElementsByTagName('SCRIPT');
		var arr=[];
		for(var i=0;i<nodes.length;i++){
			var node=nodes[i];
			if(node.readyState==="complete") {
				continue ;
			}
			if(node.src){
				if(path!==new URL(node.src,location).href){
					continue ;
				}
			}else if(path){
				continue ;
			}
			arr.push(node);
		}
		nodes=null;
		if(arr.length){
			return arr[arr.length-1];
		}
		return null;
	}

	if('currentScript' in document){
		exports.getCurrentScript=function(){
			return document.currentScript;
		};
	}else {
		if("readyState" in document.scripts[0]){
			exports.getCurrentScript=getCurrentScript;
		}else {
			document.addEventListener('load',function(e){
				if(e.target.tagName==="SCRIPT"){
					e.target.readyState="complete";
				}
			},true);
			if(getStackSupport()){
				exports.getCurrentPath=getCurrentPathByStack;
			}
			exports.getCurrentScript=getCurrentScriptByLast;
		}
		Object.defineProperty(document,"currentScript",{
			enumerable:true,
			get:exports.getCurrentScript
		});
	}
	if(!exports.getCurrentPath){
		exports.getCurrentPath=function(){
			var url=new URL(exports.getCurrentPath().src,location);
			try{
				return url.href;
			}finally{
				url=null;
			}
		};
	}

	function getScript(src,func,charset){
		var script=document.createElement('script');
		script.charset=charset || "UTF-8";
		script.src=src;
		script.async=true;
		if(func){
			var event='onreadystatechange';
			script.attachEvent(event,function(){
				if(script.readyState==='loaded'){
					document.head.appendChild(script);
				}else if(script.readyState==='complete'){
					script.detachEvent(event,arguments.callee);
					var evt=window.event;
					func.call(script,evt);
				}
			});
		}else {
			document.head.appendChild(script);
		}
		try{
			return script;
		}finally{
			script=null;
		}
	}

	function getScript$1(src,func,charset){
		var script=document.createElement('script');
		script.charset=charset || "UTF-8";
		script.src=src;
		script.async=true;
		if(func){
			if('onafterscriptexecute' in script){
				script.onafterscriptexecute=func;
			}else {
				script.onload=func;
			}
		}
		document.head.appendChild(script);
		return script;
	}

	var getScript$2=("onload" in document.scripts[document.scripts.length-1])?getScript$1:getScript;

	function attachEvent(ele, evt, func){
		ele.attachEvent( 'on'+evt, func);
	}

	function attachEvent$1(ele, evt, func, useCapture){
		ele.addEventListener(evt, func, !!useCapture);
	}

	var attachEvent$2=document.addEventListener?attachEvent$1:attachEvent;

	function detachEvent(ele, evt, func){
		ele.detachEvent('on'+evt, func);
	}

	function detachEvent$1(ele, evt, func, useCapture){
		ele.removeEventListener(evt, func, !!useCapture);
	}

	var detachEvent$2=document.addEventListener?detachEvent$1:detachEvent;

	function fireEvent(ele,evt,props){
		if(!props){
			return ele.fireEvent("on"+evt);
		}
		var e=document.createEventObject();
		if('bubbles' in props){
			e.cancelBubble=!props.bubbles;
		}
		try{
			delete props.type;
			delete props.bubbles;
			delete props.returnValue;
		}catch(err){}
		Object.assign(e, props);
		ele.fireEvent("on"+evt,e);
	}

	var notCapture=["load","unload","scroll","resize","blur","focus","mouseenter","mouseleave","input","propertychange"];
	function fireEvent$1(ele,evt,props){
		var e=document.createEvent('Event');
		var bubbles=true;
		var cancelable=true;
		if(props){
			if('bubbles' in props) bubbles=props.bubbles;
			if('cancelable' in props) cancelable=props.cancelable;
			if(bubbles && notCapture.includes(evt)){
				bubbles=false;
			}
			try{
				delete props.type;
				delete props.bubbles;
				delete props.cancelable;
			}catch(err){}
			Object.assign(e,props);
		}
		e.initEvent(evt,bubbles,cancelable);
		return ele.dispatchEvent(e);
	}

	var fireEvent$2=document.addEventListener?fireEvent$1:fireEvent;

	var isArray=Array.isArray;

	exports.attachEvent = attachEvent$2;
	exports.detachEvent = detachEvent$2;
	exports.difference = difference;
	exports.escape = escape;
	exports.escapeAttribute = escapeAttribute;
	exports.escapeHtml = escapeHtml;
	exports.escapeRegExp = escapeRegExp;
	exports.escapeString = escapeString;
	exports.find = find;
	exports.findIndex = findIndex;
	exports.findLast = findLast;
	exports.findLastIndex = findLastIndex;
	exports.fireEvent = fireEvent$2;
	exports.forOwn = forOwn;
	exports.getCookie = getCookie;
	exports.getScript = getScript$2;
	exports.inherits = inherits;
	exports.intersection = intersection;
	exports.isArray = isArray;
	exports.isArrayLike = isArrayLike;
	exports.isArrayLikeObject = isArrayLikeObject;
	exports.isDate = isDate;
	exports.isDefined = isDefined;
	exports.isDocument = isDocument;
	exports.isElement = isElement;
	exports.isFunction = isFunction;
	exports.isInput = isInput;
	exports.isNumber = isNumber;
	exports.isNumeric = isNumeric;
	exports.isObject = isObject;
	exports.isPlainObject = isPlainObject;
	exports.isRegExp = isRegExp;
	exports.isString = isString;
	exports.isWindow = isWindow$1;
	exports.noop = noop;
	exports.omit = omit;
	exports.overload = overload;
	exports.pick = pick;
	exports.pluck = pluck;
	exports.random = random;
	exports.replaceAll = replaceAll;
	exports.setCookie = setCookie;
	exports.shuffle = shuffle;
	exports.sortBy = sortBy;
	exports.sortedIndex = sortedIndex;
	exports.sortedLastIndex = sortedLastIndex;
	exports.times = times;
	exports.toString = toString;
	exports.unescape = unescape;
	exports.union = union;

	return exports;

}({}));
