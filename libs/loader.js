(function (skyCore) {

	var commentRegExp=/\/\*[\s\S]*?\*\/|([^:"'=]|^)\/\/.*$/mg;
	var cjsRequireRegExp=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
	var STATUS={
		INITED:0,//初始化
		LOADING:1,//正在加载script
		DEFINED:2,//已定义
		DEPENDING:3,//正在加载依赖
		COMPLETE:4//完成
	};
	var libs=new Map();
	var cache=new Map();
	var config=new Map();

	var paths=new Map();
	var map=new Map();
	var baseUrl=location.href;
	var urlArgs="";
	var pkgs=[];
	var rules=[];
	var hooks=[];
	var shim={};
	function Module(name){
		this.status=STATUS.INITED;
		this.name=name;
		var me=this;
		this.promise=new Promise(function(resolve, reject){
			var delay=null;
			me.resolve=function(exports){
				if(exports!==void 0){
					me.exports=exports;
				}
				var pluginResolve=function(exports){
					me.status=STATUS.COMPLETE;
					resolve(exports);
				};
				var i=hooks.length;
				while(i-->0){
					var hook=hooks[i];
					var r=hook.call(this,pluginResolve,reject);
					if(r===false){
						return false;
					}
				}
				if(delay){
					delay(pluginResolve, reject);
				}else {
					me.status=STATUS.COMPLETE;
					resolve(me.exports);
				}
			};
			me.reject=reject;
			me.delay=function(fn){
				delay=fn;
			};
		});
	}
	/*
	全局变量中的require
		*/
	window.require=function(deps,callback,onerror){
		var from=this;
		if(from==window){
			from=new Module(null);
			from.script=skyCore.getCurrentScript();
		}
		if(!from.dependencies){
			from.dependencies=new Array();
		}
		if(Array.isArray(deps)){
			var modules=new Array();//需要加载JS文件的模块
			var promises=new Array(deps.length);
			for(var i=0;i<deps.length;i++){
				var dep=deps[i];
				switch(dep){
					case 'require':
						promises[i]=Promise.resolve(require.bind(from));
						break;
					case 'exports':
						promises[i]=Promise.resolve(from.exports=new Object());
						break;
					case 'module':
						promises[i]=Promise.resolve(from);
						break;
					default:
						var module;
						var arr=dep.split("!");
						if(arr.length==2){
							module=nameToModule(arr[0],from);
							promises[i]=module.promise.then(function(plugin){
								return new Promise(function(resolve, reject){
									plugin.load(arr[0], require.bind(module), resolve);
								});
							});
						}else {
							module=nameToModule(dep,from);
							promises[i]=module.promise;
						}
						if(module.status<=STATUS.LOADING){
							modules.push(module);
						}else if(module.status==STATUS.DEFINED){
							module.load();//加载依赖
						}
						from.dependencies.push(module);
				}
			}
			Promise.all(promises).then(function(data){
				callback && callback.apply(from,data);
			},function(e){
				onerror && onerror.call(from,e);
			});
			loadModelesScript(modules);
			checkCircular(from);//检测循环依赖
			return from;
		}else {
			var name=deps;
			var module=nameToModule(name,from);
			if(module.status===STATUS.COMPLETE){
				return module.exports;
			}else if(module.status===STATUS.DEFINED){
				return module.loadSync();
			}
			throw new Error("module("+name+") must loaded before");
		}
	};
	/**
	 * 根据字符串查找模块
	 * */
	function nameToModule(name,from){
		var module,url;
		if(name.startsWith("//") || name.match(/^\w+:/) ){//模块名称是绝对路径
			url=new URL(name,baseUrl);
		}else {
			if(name.startsWith(".")){//模块名称是相对路径
				name=new URL(name,"http://localhost/"+from.name).pathname.replace("/","");
			}
			if(from){//优先查询同脚本模块
				if(from.script){
					if(from.script.modules){
						module=from.script.modules.find(findName,name);
						if(module){
							return module;
						}
					}
				}else {
					debugger ;
				}
			}
			//查询全局声明的模块
			module=cache.get(name);
			if(module){
				return module;
			}
			var pkg=checkPkgs(name);
			if(pkg){
				url=new URL(pkg,baseUrl);
			}else {
				//根据配置获取
				url=nameToURL(name,from);
				if(!url){
					url=new URL(name,baseUrl);
				}
			}
		}
		//TODO 非js模块
		//js模块
		if(!url.search){
			if(!url.pathname.endsWith(".js")){
				url.pathname+=".js";
			}
			if(urlArgs){
				url.search+="?"+urlArgs;
			}
		}else {
			if(urlArgs){
				url.search+="&"+urlArgs;
			}
		}
		var path=url.origin+url.pathname+url.search;
		var script=libs.get(path);
		if(script){
			var lib=script.modules;
			if(lib.length==1){//匿名模块文件
				return lib[0];
			}
			module=lib.find(findName,name);
			if(module){
				cache.set(name,module);
				return module;
			}else {
				var requires=script.requires;
				if(requires){
					module=requires.find(findName,name);
					if(module){
						return module;
					}
					module=lib.find(findNoName,name);
					if(module){
						return module;
					}
					module=new Module(name);
					cache.set(name,module);
					module.src=path;
					module.script=script;
					module.status=STATUS.LOADING;
					requires.push(module);
					return module;
				}
				console.warn("module ["+name+"] not in js \""+path+"\"");
			}
		}else {
			module=new Module(name);
			cache.set(name,module);
			module.src=path;
			return module;
		}
	}
	function checkPkgs(name){
		var i=pkgs.length;
		while(i-->0){
			var pkg=pkgs[i];
			if(pkg==name){
				return pkg;
			}
			if(name.startsWith(pkg+"/")){
				return pkg;
			}
		}
		return false;
	}
	function nameToURL(name,from){
		var i=rules.length;
		while(i--){
			var rule=rules[i];
			var url=rule(name,from);
			if(url){
				return url;
			}
		}
		var path=paths.get(name);
		if(path){
			return new URL(path,baseUrl);
		}
		var fromPaths=map.get(from.name);
		if(fromPaths){
			path=fromPaths.get(name);
			if(path){
				return new URL(path,baseUrl);
			}
		}
		return null;
	}
	function findName(mod){
		return mod.name==this;
	}
	function findNoName(mod){
		return mod.name==null;
	}
	/**加载script */
	function loadModelesScript(modules){
		var libs=new Map();
		var i=modules.length;
		while(i-->0){
			var mod=modules[i];
			if(mod.status==STATUS.INITED){
				var lib=libs.get(mod.src);
				if(!lib){
					lib=new Array();
					libs.set(mod.src,lib);
				}
				lib.push(mod);
			}
		}
		libs.forEach(loadModelesScriptPath);
	}
	function loadModelesScriptPath(modules,src){
		var script=skyCore.getScript(src,handleLast);
		libs.set(src,script);
		script.requires=modules;
		script.modules=[];
		script.onerror=handleError;
		var i=modules.length;
		while(i-->0){
			var mod=modules[i];
			mod.status=STATUS.LOADING;
			mod.script=script;
		}
	}
	function handleError(message,url,line){
		var requires=this.requires;
		requires.forEach(function(module){
			module.reject({'message':message,'url':url,'line':line});
		});
	}
	function handleLast(){
		var requires=this.requires;
		this.requires=null;
		var i=requires.length;
		while(i-->0){
			var module=requires[i];
			if(module.status<=STATUS.LOADING){
				useShim.call(this,module);
			}else if(module.status==STATUS.DEFINED){
				module.load();
			}
		}
	}
	function useShim(module){
		if(Object.prototype.hasOwnProperty.call(shim,module.name)){
			module.resolve(window[shim[module.name]]);
		}else {
			console.warn("No module found in script:"+this.src);
		}
	}
	Module.prototype.define=function(deps,initor){
		if(this.name){
			if(checkPkgs(this.name)){
				cache.set(this.name,this);
			}
		}
		this.script.modules.push(this);
		if(typeof initor==="function"){
			this.initor=initor;
			this.deps=deps;
			this.status=STATUS.DEFINED;
		}else {
			this.resolve(initor);
		}
	};
	Module.prototype.config=function(){
		return config.get(this.name);
	};
	/*
	加载依赖
		*/
	Module.prototype.load=function(){
		if(this.deps && this.deps.length){
			this.status=STATUS.DEPENDING;//加载依赖
			require.call(this,this.deps,function(){
				try{
					this.resolve(this.initor.apply(this,arguments));
				}catch(e){
					console.error(e);
					this.reject(e);
				}
			},function(e){
				this.reject(e);
			});
		}else {
			this.resolve(this.initor());
		}
	};
	Module.prototype.loadSync=function(){
		var result;
		this.plugin=function(fn){
			throw "the module ["+this.name+"] has not been loaded yet";
		};
		if(this.deps && this.deps.length){
			var deps=this.deps.map(function(dep){
				return require.call(this,dep);
			},this);
			result=this.initor.apply(this,deps);
		}else {
			result=this.initor();
		}
		this.resolve(result);
		this.status=STATUS.COMPLETE;
		return this.exports;
	};
	Module.define=function(name,deps,initor){
		var module;
		var script=skyCore.getCurrentScript();
		if(script.modules){
			var path=new URL(script.src,location).href;
			libs.set(path,script);
		}else {
			script.modules=new Array();
		}
		if(script.requires){
			var i=script.requires.length;
			while(i-->0){
				module=script.requires[i];
				if(module.status<=STATUS.LOADING){
					if(name==null || module.name==name){
						module.define(deps,initor);
						return ;
					}
				}
			}
		}
		module=new Module(name);
		cache.set(name,module);
		module.script=script;
		module.define(deps,initor);
	};
	/*
		define(data);
		define(initor);
		define(deps,initor);
		define(name,deps,initor);
		*/
	window.define=function(arg1,arg2,arg3){
		switch(arguments.length){
			case 1:
				if(typeof arg1==="function"){
					var deps=new Array();
					switch(arg1.length){
						case 3:
							deps.unshift('module');
						case 2:
							deps.unshift('exports');
						case 1:
							deps.unshift('require');
							break ;
					}
					arg1.toString().replace(commentRegExp,commentReplace).replace(cjsRequireRegExp,function(match,dep){
						deps.push(dep);//CMD
					});
					Module.define(null,deps,arg1);
				}else {
					Module.define(null,null,arg1);
				}
				break;
			case 2:
				Module.define(null,arg1,arg2);
				break;
			case 3:
				Module.define(arg1,arg2,arg3);
		}
	};
	function checkCircular(module){
		if(module.dependencies.length){
			var stack=new Array();
			stack.push(module);
			return checkCircularSub(module,stack);
		}
	}
	function checkCircularSub(module,stack){
		var i=module.dependencies.length;
		stack.push(module);
		while(i-->0){
			var mod=module.dependencies[i];
			if(stack.includes(mod)){
				var j=stack.length;
				while(j-->0){
					m=stack[j];
					if('exports' in m){
						m.resolve(m.exports);
						m.status=STATUS.COMPLETE;
						return ;
					}
				}
				console.error("circular dependency found,should use exports");
				return ;
			}
			if(mod.dependencies && mod.STATUS!=STATUS.COMPLETE){
				stack.push(mod);
				checkCircularSub(mod,stack);
				stack.pop();
			}
		}
	}
	function commentReplace(match, singlePrefix) {
		return singlePrefix || '';
	}
	require.path=function(rule){
		rules.push(rule);
	};
	require.complete=function(hook){
		hooks.push(hook);
	};
	require.config=function(options){
		skyCore.forOwn(options.paths,function(value,key){
			paths.set(key,value);
		});
		skyCore.forOwn(options.bundles,function(names,path){
			if(names.forEach){
				names.forEach(function(name){
					paths.set(name,path);
				});
			}
		});
		skyCore.forOwn(options.map,function(paths,formPath){
			var pathMap=map.get(formPath);
			if(!pathMap){
				pathMap=new Map();
				map.set(formPath,pathMap);
			}
			paths.forEach(function(path,name){
				pathMap.set(name,path);
			});
		});
		skyCore.forOwn(options.config,function(value,key){
			config.set(key,value);
		});
		if(options.baseUrl){
			baseUrl=options.baseUrl;
		}
		if(options.urlArgs){
			urlArgs=options.urlArgs;
		}
		if(options.pkgs){
			var i=options.pkgs.length;
			while(i-->0){
				var pkg=options.pkgs[i];
				if(!pkgs.includes(pkg)){
					pkgs.push(pkg);
				}
			}
		}
	};
	define.amd=true;

}(Sky));
