var GLOBAL = GLOBAL || {};
//数组
GLOBAL.Arr = GLOBAL.Arr || {};
GLOBAL.Arr.arrIndexOf = function(arr, v){
    var result = -1;
    for(var i = 0, iLen = arr.length; i < iLen; i++){
        if(arr[i] == v){
            result = i;
            break;
        }
    }
    return result;
};

//操作class
GLOBAL.Class = GLOBAL.Class || {};
//添加class
GLOBAL.Class.addClass = function(element, className){
    //如果原来没有class
    if(element.className = ""){
        element.className = className;
    }else{
        //如果有class
        var arrClassName = element.className.split(" ");
        var _index = GLOBAL.Arr.arrIndexOf(arrClassName, className);
        if(_index == -1){
            //如果不存在该className
            element.className += (" " + className);
        }else{
            //...
        }
    }
};
//移除class
GLOBAL.Class.removeClass = function(element, className){
    //如果原来有class
    if(obj.className != ""){
        var arrClassName = element.className.split(" ");
        var _index = GLOBAL.Arr.arrIndexOf(arrClassName, className);
        if(_index != -1){
            //如果有要移除的class
            arrClassName.splice(_index, 1);
            obj.className = arrClassName.join(" ");;
        }else{

        }
    }else{
        //没有class
    }
};

GLOBAL.Dom = GLOBAL.Dom || {};
//通过classname获取元素
GLOBAL.Dom.getElementsByClassName = function(parent, nodeName, className){
    if(arguments.length != 3){
        throw new Error("参数只能为3个");
    }else if(parent.nodeType != 1 && parent.nodeType != 9){
        throw new Error("父级元素必须为节点元素");
    }else if(typeof nodeName != "string" || typeof className != "string"){
        throw new Error("nodeName和className必须为字符串");
    }else{
        var result = [],
            elements = parent.getElementsByTagName(nodeName);
        for(var i = 0, iLen = elements.length; i < iLen; i++){
            var sClassName = elements[i].className,
                aClassName = sClassName.split(" ");
            for(var j = 0, jLen = aClassName.length; j < jLen; j++){
                if(aClassName[j] == className){
                    result.push(elements[i]);
                    break;
                }
            }
        }
        return result;
    }
};

//事件绑定
GLOBAL.EventUtil = {
    addHandler:function(element, type, handler){
        if(element.addEventListener){
            element.addEventListener(type,handler,false);
        }else if(element.attachEvent){
            element.attachEvent("on" + type, handler);
        }else{
            element["on" + type] = handler;
        }
    },removeHandler:function(){
        if(element.removeEventListener){
            element.removeEventListener(type,handler,false);
        }else if(element.deathEvent){
            element.deathEvent("on" + type, handler);
        }else{
            element["on" + type] = null;
        }
    }
};

GLOBAL.Method = GLOBAL.Method || {};
//创建xmlHttpRequest
GLOBAL.Method.createXHR = function () {
    var xhr = null;
    if (typeof XMLHttpRequest != "undefined") {
        xhr = new XMLHttpRequest();
    } else if (typeof ActiveXObject != "undefined") {
        if (typeof arguments.callee.activeXString != "string") {
            var versions = ["MSXML2.XMLHttp.6.0", "MSXMLK2.XMLHttp.3.0", "MSXML2.XMLHttp"],
                len;
            for (i = 0, len = versions.length; i < len; i++) {
                try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                } catch (ex) {
                }
            }
        }
        xhr = new ActiveXObject(arguments.callee.activeXString);
    } else {
        throw new Error("No XHR obejct available.");
    }
    return xhr;
};
//迭代
GLOBAL.Method.Iterator = function (values, fun) {
    var iterations = Math.ceil(arr.length / 8);
    var leftover = arr.length % 8;
    var i = 0;
    if (leftover > 0) {
        do {
            fun(i);
        } while (--leftover > 0);
    }
    do {
        fun(i);
        fun(i);
        fun(i);
        fun(i);
        fun(i);
        fun(i);
        fun(i);
    } while (--iterations > 0);
};

//继承
//inherit返回了一个继承自原型对象p的属性的新对象
GLOBAL.Method.inherit = function (p) {
    if (p == null) throw TypeError();
    if (Object.create) {
        return Object.create(p);
    }
    var t = typeof p;
    if (t !== "object" && t !== "function") throw TypeError();

    function f() {
    };
    f.prototype = p;
    return new f();
};
//类式集成
GLOBAL.Method.extend = function (subClass, superClass){
    var F = function(){};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superClass = superClass.prototype;

    if(superClass.prototype.constructor == Object.prototype.constructor){
        superClass.prototype.constructor = superClass;
    }
};

//原型式继承
GLOBAL.Method.clone = function(object){
    function F(){}
    F.prototype = object;
    return new F();
};

/**
 * 掺元类
 * 有一种重用代码的方法不需要用到严格的继承。如果想把一个函数用到多个类中，可以通过扩充（augmentation）的方式让这些累共享该函数。
 * 其实际做法为：先创建一个包含各种通用方法的类，然后再用它扩充其他类。它们通常不会被实例化或者直接调用。其存在的目的只是向其他类提供自己的方法。
 * 传2个参数则复制givingClass的所有属性和方法
 * 传3个参数，第三个参数为方法名，复制givingClass的制定方法
 */
GLOBAL.Method.augment = function(receivingClass, givingClass){
    receivingClass.prototype = receivingClass.prototype || {};
    if(arguments[2]){
        for(var i = 2, len = arguments.length; i < len; i++){
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    }else{
        for(var methodName in givingClass.prototype){
            if(!receivingClass.prototype || !receivingClass.prototype[methodName]){
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }
        }
    }
};

//复制属性
/**
 * 定义一个扩展函数，用来将第二个及以后的参数属性复制至第一个参数，复制的属性会覆盖原有属性
 * 这里我们处理了一个IE bug：在多数IE版本中，如果o的属性拥有一个不可枚举的同名属性，则for/in循环不会枚举对象o的可枚举属性，
 * 也就是说，将不会正确地处理诸如toString的属性，除非我们显示检测他
 */
GLOBAL.Method.extendProperty = (function(){//将这个函数的返回值赋值给extend
    //在修复它之前，首先检测是否存在bug
    for(var p in {toString: null}){
        //如果代码执行到这里，那么for/in循环会正确工作并返回一个简单版本的extend
        return function extend(o){
            for(var i = 1, iLen = arguments.length; i < iLen; i++){
                var source = arguments[i];
                for(var prop in source){
                    o[prop] = source[prop];
                }
            }
            return o;
        };
    }
    /**
     *如果代码执行到这里，说明for/in循环不会枚举测试对象的toString属性，
     *因此返回另一个版本都extend()函数，这个函数显示测试Object.prototype中的不可枚举属性
     */
    return function patched_extend(o){
        for(var i = i, iLen = arguments.length; i < iLen; i++){
            var source = arguments[i];
            //复制所有的可枚举属性
            for(var prop in source){
                o[prop] = source[prop];
            }
            //现在检查特殊属性
            for(var j = 0, jLen = protoprops.length; j < jLen; j++){
                prop = protoprops[j];
                if(source.hasOwnProperty(prop)){
                    o[prop] = source[prop];
                }
            }
        }
        return o;
    };
    var protoprops = ["toString", "valueOf", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocalString"];
})();


//清除冒泡
GLOBAL.Method.stopPropagation = function (e) {
    e = e || window.event;
    if (document.all) {
        e.cancelBubble = true;
    } else {
        e.stopPropagation();
    }
};

//bind
if(!Function.prototype.bind){
	Function.prototype.bind = function(obj){
		var slice = [].slice,
			args = slice.call(arguments, 1),
			self = this,
			nop = function(){},
			bound = function(){
				return self.apply(this instanceof nop ? this : (obj || {}), args.concat(slice.call(arguments)));
			};
		nop.prototype = self.prototype;
		bound.prototype = new nop();
		return bound;
	};
}

//表单校验
GLOBAL.Verify = GLOBAL.Verify || {};

Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
    return this;
};

//去掉空白字符
String.method("trim", function () {
    return this.replace(/^\ + |\s+$/g, "");
});

//检测字符串中是否存在中文
String.method("hasChinese", function () {
    var regExp = new RegExp("[\u4e00-\u9fa5]");
    return regExp.test(this);
});

//检测字符串是大写字母
String.method("isUpperCase", function () {
    var regExp = /^[A-Z]+$/g;
    return regExp.test(this);
});

//检测字符串中含有空格
String.method("hasSpace", function () {
    var regExp = /\s/;
    return regExp.test(this);
});

//加法
Math.sum = function () {
    var result = 0;
    for (var i = 0, iLen = arguments.length; i < iLen; i++) {
        if (typeof arguments[i] !== "number") {
            throw {
                name: "TypeError",
                message: arguments[i] + "不是数字！"
            };
        }
        result += arguments[i];
    }
    return result;
};

//第2章接口
GLOBAL.Interface = GLOBAL.Interface || function (name, methods) {
    if (arguments.length != 2) {
        throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
    }

    this.name = name;
    this.methods = [];
    for (var i = 0, len = methods.length; i < len; i++) {
        if (typeof methods[i] !== 'string') {
            throw new Error("Interface constructor expects method names to be " + "passed in as a string.");
        }
        this.methods.push(methods[i]);
    }
};

// 接口
GLOBAL.Interface.ensureImplements = function (object) {
    if (arguments.length < 2) {
        throw new Error("Function Interface.ensureImplements called with " +
            arguments.length + "arguments, but expected at least 2.");
    }

    for (var i = 1, len = arguments.length; i < len; i++) {
        var interface = arguments[i];
        if (interface.constructor !== Interface) {
            throw new Error("Function Interface.ensureImplements expects arguments " + "two and above to be instances of Interface.");
        }

        for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
            var method = interface.methods[j];
            if (!object[method] || typeof object[method] !== 'function') {
                throw new Error("Function Interface.ensureImplements: object " + "does not implement the " + interface.name + " interface. Method " + method + " was not found.");
            }
        }
    }
};
