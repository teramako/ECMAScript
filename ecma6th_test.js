
(function(global){
  // ---------------------------------------------------------------------------
  // Syntax Grammar
  // ---------------------------------------------------------------------------
  module("Syntax Grammar");

  test("11.8.3 Numeric Literals", function () {
    ['0b0', '0B0', '0o0', '0O0'].forEach(function (literal) {
      try {
        var res = eval(literal);
        strictEqual(res, 0, literal);
      } catch (e) {
        ok(false, "not supported: " + e);
      }
    });
  });

  test("12.1.4.1 spread array(...) operator", function () {
    var code = '[...[1,2,3]].join("")';
    try {
      var res = eval(code);
      strictEqual(res, "123", code);
    } catch (e) {
      ok(false, "not supported: " + e);
    }
  });

  test("12.1.4.2 Array Comprehension", function () {
    var list = ["a", "b", "c"];
    var newCode = '[for (i in list) list[i]]',
        oldCode = '[list[i] for (i in list)]';
    try {
      var res = eval(newCode);
      deepEqual(res, list, newCode);
      return;
    } catch(e) {
      ok(false, "not supported new syntax: " + newCode);
    }
    try {
      var res = eval(oldCode);
      deepEqual(res, list, "supported old syntax: " + oldCode);
    } catch (e) {
      ok(false, "not supported: " + oldCode);
    }
  });

  test("12.1.7 Generator Comprehension", function () {
    var list = ["a", "b", "c"];
    var newCode = '(for (i in list) list[i])',
        oldCode = '(list[i] for (i in list))';

    try {
      var res = eval(newCode);
      strictEqual(typeof res.next, "function", newCode);
      return;
    } catch(e) {
      ok(false, "now supported new syntax: " + newCode);
    }
    try {
      var res = eval(oldCode);
      strictEqual(typeof res.next, "function", "supported old syntax: " + oldCode);
    } catch (e) {
      ok(false, "not supported: " + oldCode);
    }
  });

  test("12.1.9 Template Literal(`...`)", function () {
    var str = "OK";
    var code = '`result is $(str).`';
    try {
      var res = eval(code);
      strictEqual(res, "result is OK.", code);
    } catch (e) {
      ok(false, "not supported: " + code);
    }
  });

  test("12.2 spread call(...) operator", function () {
    var code = "Math.max(...[1,2,3])";
    try {
      var res = eval(code);
      strictEqual(res, 3, code);
    } catch(e) {
      ok(false, "not supported: " + e);
    }
  });

  test("12.13 Array Destructing Assignment", function () {
    var code1 = 'var [ a, b ] = ["A","B","C"]',
        code2 = 'var [ a, b, ...c] = ["A","B","C","D"]';
    try {
      eval(code1);
      ok(a === "A" && b === "B", code1);
    } catch(e) {
      ok(false, "not supported: " + code1);
      return;
    }
    try {
      eval(code2);
      deepEqual(c, ["C","D"], code2);
    } catch (e) {
      ok(false, "not suppored: " + code2);
    }
  });

  test("12.13 Object Destructing Assignment", function () {
    var code1 = 'var { a, b } = { a: "A", b: "B" }',
        code2 = 'var { a: a1, b: b1 } = { a: "A", b: "B" }';
    try {
      eval(code1);
      ok(a === "A" && b === "B", code1);
    } catch(e) {
      ok(false, "not supported: " + code1);
      return;
    }
    try {
      eval(code2);
      ok(a1 === "A" && b1 === "B", code2);
    } catch (e) {
      ok(false, "not supported: " + code2);
    }
  });

  test("13.2.1 const", function () {
    "use strict";
    try {
      var code = 'const CONST = "CONST"; CONST;';
      strictEqual(eval(code), "CONST", "supports const basically");
    } catch (e) {
      ok(false, "const not supported");
      return;
    }
    throws(function(){ eval('const CONST = "a"; const CONST = "b";'); }, 'cannot redecralation: const CONST = "THROWS"');

    try {
      var res = eval('const VALUE = 10; { const VALUE = 20; } VALUE === 10;');
      ok(res, "block scope");
    } catch(e) {
      ok(false, "block scope: " + e);
    }
  });

  test("13.2.1 let", function () {
    "use strict";
    try {
      var code = 'let letValue = 10; letValue;';
      strictEqual(eval(code), 10, "supports let basically");
    } catch (e) {
      ok(false, "let not supported");
      return;
    }
    ok(eval('let value = 10; { let value = 20; } value === 10;'), "block scope");
  });

  test("13.6.4 for-of", function () {
    var list = ["a", "b", "c"];
    var code = 'var res=[]; for (var item of list){res.push(item);} res;';
    try {
      var res = eval(code);
      deepEqual(res, list, code);
    } catch(e) {
      ok(false, "not supported: " + e);
      return;
    }
  });

  test("14.1 function rest parameter", function () {
    try {
      var func = eval('(function(a, ...args){ return args.join(""); })');
    } catch(e){
      ok(false, "not supported: " + e);
      return;
    }
    strictEqual(typeof func, "function", "supports rest parameter");
    strictEqual(func('a','b','c'), 'bc', 'func("a", "b", "c")');
  });

  test("14.1 function default parameter", function() {
    try {
      var func = eval('(function(arg = "OK"){ return arg; })');
    } catch(e){
      ok(false, "not supported: " + e)
      return;
    };
    strictEqual(typeof func, "function", 'supports default parameter');
    strictEqual(func(), "OK", "omit paramerter");
    strictEqual(func("FOO"), "FOO", "specify parameter");
  });

  test("14.2 Arrow Function", function () {
    var code1 = '() => "OK";',
        code2 = '() => { return "OK" };',
        code3 = 'arg => typeof arg;';
    try {
      var func = eval(code1);
      ok(func() === "OK", code1);
    } catch (e) {
      ok(false, "not suppored: " + code1 + " : " + e);
      return;
    }
    ok(eval(code2)() === "OK", code2);
    ok(eval(code3)(0) === "number", code3);
    var f = eval(code1);
    ok(!f.hasOwnProperty("prototype"), 'ArrowFunction has no "prototype"');
    throws(function(){ new f; }, "Cannot call [[Construct]]");
  });

  test("14.3 Method Defnition", function () {
    var code1 = '({ m () { return "OK"; } })';
    try {
      var res = eval(code1);
      ok(res.m() === "OK", code1);
    } catch(e) {
      ok(false, "not supported: " + code1 + " : " + e);
      return;
    }
  });

  test("14.4 Generator (yield)", function () {
    var newCode1 = '(function * foo(){ yield 5; })',
        newCode2 = '(function * foo(){ yield * 5; })',
        oldCode = '(function foo(){ yield 5; })';
    try {
      var res = eval(newCode1);
      strictEqual(typeof res, "function", "supported new syntax: " + newCode1);
      try {
        var res = eval(newCode2);
        strictEqual(typeof res, "function", "supported new syntax: " + newCode2);
      } catch (e) {
        ok(false, "not supported new syntax: " + newCode2 + " : " + e);
      }
      return;
    } catch (e) {
      ok(false, "not supported new syntax: " + newCode1 + " : " + e);
    }
    try {
      var res = eval(oldCode);
      strictEqual(typeof res, "function", "supported old syntax: " + oldCode);
    } catch(e) {
      ok(false, "not supported old syntax: " + oldCode + " : " + e);
    }
  });

  test("14.5 Class Definition", function () {
    var code = "class Foo {}";
    try {
      var res = eval(code);
      ok(typeof res === "function", code);
    } catch (e) {
      ok(false, "not supported: " + code + " : " + e);
    }
  });

  test("15.1 module and export", function () {
    var code1 = 'module "foo" { }',
        code2 = 'module "bar" { export var b = "OK" }';
    try {
      var res = eval(code1);
      ok(true, code1);
    } catch(e) {
      ok(false, "not supported: " + code1 + " : " + e);
      return;
    }

    try {
      var res = eval(code2);
      ok(true, code2);
    } catch(e) {
      ok(false, "not supported: " + code2 + " : " + e);
    }
  });


  // ---------------------------------------------------------------------------
  // Built-in Objects
  // ---------------------------------------------------------------------------
  module("Built-in Objects");

  function hasOwn (o, p, msg) {
    ok(Object.prototype.hasOwnProperty.call(o, p), msg);
  }
  function allOK (msg, tests) {
    for (var i = 0, len = tests.length; i < len; ++i) {
      if (tests[i]()) {
        ok(true, "[" + i + "]: " + msg);
        continue;
      } else {
        ok(false, "[" + i + "]: " + msg);
        return;
      }
    }
  }

  test("19.1 Object", function () {
    [
      "assign", "create", "defineProperties", "defineProperty", "freeze",
      "getOwnPropertyDescriptor", "getOwnPropertyNames", "getOwnPropertySymbols",
      "getPrototypeOf", "is", "isExtensible", "isFrozen", "isSealed", "keys",
      "mixin", "preventExtensions", "seal", "setPrototypeOf"
    ].forEach(function(prop) {
      ok(typeof Object[prop] === "function", "Object." + prop);
    })

    strictEqual(Object.prototype.constructor, Object, "Object.prototype.constructor");
    [
      "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString",
      "toString", "valueOf"
    ].forEach(function(prop) {
      ok(typeof Object.prototype[prop] === "function", "Object.prototype." + prop);
    })
  });

  test("19.2 Function", function () {
    strictEqual(Function.length, 1, "Function.lenght");
    strictEqual(Function.prototype.constructor, Function, "Function.prototype.constructor");
    ["apply", "bind", "call", "toString"].forEach(function(prop) {
      ok(typeof Function.prototype[prop] === "function", "Function.prototype." + prop);
    });
  });

  test("15.04 Array", function () {
    allOK("Array.isArray", [
      function(){ return typeof Array.isArray === "function";},
      function(){ return Array.isArray([]); }
    ]);
    allOK("Array.of", [
      function(){ return typeof Array.of === "function"; },
      function(){ return Array.of("a","b").join("") === "ab"; }
    ]);
    allOK("Array.from", [
      function(){ return typeof Array.from === "function"; },
      function(){ return Array.from({0:"A",1:"B",length:2}) instanceof Array; },
      function(){
        var res = Array.from({0:"A",1:"B",length:2}, function(v){ return v.toLowerCase(); });
        return res.join("") === "ab";
      },
    ]);
    [
      "toString", "toLocaleString", "concat", "join", "pop", "push", "reverse", "shift", "slice",
      "sort", "splice", "unshift", "indexOf", "lastIndexOf", "every", "some", "forEach", "map",
      "filter", "reduce", "reduceRight", "find", "findIndex", "entries", "keys", "values"
    ].forEach(function(prop) {
      ok(typeof Array.prototype[prop] === "function", "Array.prototype." + prop);
    });
  });

  test("15.05 String", function () {
    ["fromCharCode", "fromCodePoint", "raw"].forEach(function(prop) {
      ok(typeof String[prop] === "function", "String." + prop);
    });
    strictEqual(String.prototype.constructor, String, "String.prototype.constructor");
    [
      "toString", "valueOf", "charAt", "charCodeAt", "concat", "indexOf", "lastIndexOf", "localeCompare",
      "match", "replace", "search", "slice", "split", "substring", "toLowerCase", "toLocaleLowerCase",
      "toUpperCase", "toLocaleUpperCase", "trim", "repeat", "startsWith", "endsWith", "contains",
      "codePointAt", "normalize",
    ].forEach(function(prop) {
      ok(typeof String.prototype[prop] === "function", "String.prototype." + prop);
    })
  });

  test("20.1 Number", function () {
    ok(Number.EPSILON === 2.2204460492503130808472633361816e-16, "Number.EPSILON");
    ok(Number.MAX_SAFE_INTEGER === 9007199254740991, "Number.MAX_SAFE_INTEGER");
    ok(Number.MAX_VALUE === 1.7976931348623157e+308, "Number.MAX_VALUE");
    ok(isNaN(Number.NaN), "Number.NaN");
    ok(Number.NEGATIVE_INFINITY === -Infinity, "Number.NEGATIVE_INFINITY");
    ok(Number.MIN_SAFE_INTEGER === -9007199254740991, "Number.MIN_SAFE_INTEGER");
    ok(Number.MIN_VALUE === 5e-324, "Number.MIN_VALUE");
    ok(Number.POSITIVE_INFINITY === Infinity, "Number.POSITIVE_INFINITY");
    ok(Number.MAX_INTEGER === 9007199254740991, "Number.MAX_INTEGER");
    [
      "isFinate", "isInteger", "isNaN", "isSafeInteger", "paseFloat", "paseInt"
    ].forEach(function(prop) {
      ok(typeof Number[prop] === "function", "Number." + prop);
    });
    strictEqual(Number.prototype.constructor, Number, "Number.prototype.constructor");
    [
      "clz", "toExponential", "toFixed", "toLocaleString", "toPrecision", "toString",
      "valueOf"
    ].forEach(function(prop) {
      ok(typeof Number.prototype[prop] === "function", "Number.prototype." + prop);
    });
  });

  test("20.2 Math", function () {
    ok(Math.E       === 2.7182818284590452354, "Math.E");
    ok(Math.LN10    === 2.302585092994046, "Math.LN10");
    ok(Math.LOG10E  === 0.4342944819032518, "Math.LOG10E");
    ok(Math.LN2     === 0.6931471805599453, "Math.LN2");
    ok(Math.LOG2E   === 1.4426950408889634, "Math.LOG2E");
    ok(Math.PI      === 3.1415926535897932, "Math.PI");
    ok(Math.SQRT1_2 === 0.7071067811865476, "Math.SQRT1_2");
    ok(Math.SQRT2   === 1.4142135623730951, "Math.SQRT2");
    [
      "abs", "acos", "acosh", "asin", "asinh", "atan", "atanh", "atan2", "cbrt", "cell",
      "cos", "cosh", "exp", "expm1", "floor", "fround", "hypot", "imul", "log", "log1p",
      "log10", "log2", "max", "min", "pow", "random", "round", "sign", "sin", "sinh",
      "sqrt", "tan", "tanh", "trunc"
    ].forEach(function(prop) {
      ok(typeof Math[prop] === "function", "Math." + prop);
    });
  });

  test("20.3 Date", function () {
    ["now", "parse", "UTC"].forEach(function(prop) {
      ok(typeof Date[prop] === "function", "Date." + prop);
    });
    strictEqual(Date.prototype.constructor, Date, "Date.prototype.constructor");
    [
      "getDate", "getDay", "getFullYear", "getHours", "getMilliseconds", "getMinutes", "getMonth",
      "getSeconds", "getTime", "getTimezoneOffset", "getUTCDate", "getUTCDay", "getUTCFullYear",
      "getUTCHours", "getUTCMilliseconds", "getUTCMinutes", "getUTCMonth", "getUTCSeconds",
      "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds",
      "setTime", "setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes",
      "setUTCMonth", "setUTCSeconds", "toDateString", "toISOString", "toJSON", "toLocaleDateString",
      "toLocaleString", "toLocaleTimeString", "toSting", "toTimeString", "toUTCString", "valueOf"
    ].forEach(function(prop) {
      ok(typeof Date.prototype[prop] === "function", "Date.prototype." + prop);
    });
  });

  test("15.10 RegExp", function () {
    strictEqual(RegExp.prototype.constructor, RegExp, "RegExp.prototype.constructor");
    var reg = /foo/;
    ["exec", "toString", "match", "replace", "search", "split", "test"].forEach(function(prop) {
      ok(typeof RegExp.prototype[prop] === "function", "RegExp.prototype." + prop);
    });
    allOK("reg.global", [
      function () { return reg.global === false; },
      function () { var reg = new RegExp("foo", "g"); return reg.global; },
      function () { reg.global = true; return reg.global === false; },
    ]);
    allOK("reg.ignoreCase", [
      function () { return reg.ignoreCase === false; },
      function () { var reg = new RegExp("foo", "i"); return reg.ignoreCase; },
      function () { reg.ignoreCase= true; return reg.ignoreCase === false; },
    ]);
    allOK("reg.prototype.multiline", [
      function () { return reg.multiline === false; },
      function () { var reg = new RegExp("foo", "m"); return reg.multiline; },
      function () { reg.multiline = true; return reg.multiline === false; },
    ]);
    strictEqual(reg.source, "foo", "RegExp.prototype.source");
    allOK("reg.prototype.sticky", [
      function () { return reg.sticky === false; },
      function () { var reg = new RegExp("foo", "y"); return reg.sticky; },
      function () { reg.sticky = true; return reg.sticky === false; },
    ]);
    allOK("reg.prototype.unicode", [
      function () { return reg.unicode === false; },
      function () { var reg = new RegExp("foo", "u"); return reg.unicode; },
      function () { reg.unicode = true; return reg.unicode === false; },
    ]);
    ok(reg.hasOwnProperty("lastIndex"), "reg.lastIndex");
  });

  test("15.11 Error", function () {
    ok(Error.prototype.constructor === Error, "Error.prototype.constructor");
    ok(Error.prototype.name === "Error", "Error.prototype.name");
    ok(typeof Error.prototype.message === "string", "Error.prototype.message");
    ["EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"].forEach(function(f) {
      ok(typeof global[f] === "function", f);
    });
  });

  test("15.12 JSON", function () {
    var code = '{"a":"A","b":"B"}';
    allOK("JSON.parse", [
      function(){ return typeof JSON.parse === "function"; },
      function(){ return typeof JSON.parse(code) === "object"; },
    ]);
    allOK("JSON.stringify", [
      function(){ return typeof JSON.stringify === "function"; },
      function(){ return JSON.stringify({a: "A", b: "B"}) === code; },
      function(){ return JSON.stringify({a: "A", b: "B"}, null, " ") === '{\n "a": "A",\n "b": "B"\n}'; },
    ]);
  });

  test("15.13 Binary Data", function () {
    if (typeof ArrayBuffer === "function") {
      ok(typeof ArrayBuffer.isView === "function", "ArrayBuffer.isView");
      ok(typeof ArrayBuffer.prototype.slice === "function", "ArrayBuffer.prototype.slice");
      ok((new ArrayBuffer).byteLength === 0, "ArrayBuffer#byteLength");
    } else {
      ok(false, "not supported: ArrayBuffer");
      return;
    }
    function typedArrayTest (name, size) {
      var TypedArray = global[name];
      if (typeof TypedArray === "function") {
        ok(typeof TypedArray.prototype.of === "function", name + ".of");
        ok(typeof TypedArray.prototype.from === "function", name + ".from");
        strictEqual(TypedArray.BYTES_PER_ELEMENT, size, name + ".BYTES_PER_ELEMENT");
        ok(typeof TypedArray.prototype.set      === "function", name + ".prototype.set");
        ok(typeof TypedArray.prototype.subarray === "function", name + ".prototype.subarray");
        [
          "toString", "toLocaleString", "join", "reverse", "slice", "sort",
          "indexOf", "lastIndexOf", "every", "some", "forEach", "map", "filter",
          "reduce", "reduceRight", "find", "findIndex", "entries", "keys", "values"
        ].forEach(function(prop) {
          ok(typeof TypedArray.prototype[prop] === "function", name + ".prototype." + prop);
        });
        var tArray = new TypedArray;
        ok(tArray.buffer instanceof ArrayBuffer, "buffer instanceof ArrayBuffer");
        ["byteLength", "byteOffset", "length"].forEach(function(prop) {
          ok(tArray[prop] === 0, name + "#" + prop);
        });
      } else {
        ok(false, "not supported: " + name);
      }
    }
    [
      ["Int8Array", 1], ["Uint8Array", 1], ["Uint8ClampedArray", 1],
      ["Int16Array", 2], ["Uint16Array", 2],
      ["Int32Array", 4], ["Uint32Array", 4],
      ["Float32Array", 4], ["Float64Array", 8]
    ].forEach(function (v) { typedArrayTest(v[0], v[1]); });

    if (typeof DataView === "function") {
      ok(DataView.prototype.constructor === DataView, "DataView.prototype.constructor");
      [
        "getInt8", "getUint8", "getInt16", "getUint16", "getInt32", "getUint32", "getFloat32", "getFloat64",
        "setInt8", "setUint8", "setInt16", "setUint16", "setInt32", "setUint32", "setFloat32", "setFloat64"
      ].forEach(function(prop) {
        ok(typeof DataView.prototype[prop] === "function", "DataView.prototype." + prop);
      });
    } else {
      ok(false, "not supported: DataView");
    }
  });

  test("15.14 Map", function () {
    if (typeof Map === "function") {
      strictEqual(Map.prototype.constructor, Map, "Map.prototype.constructor");
      ["clear", "delete", "forEach", "get", "has", "entries", "keys", "set", "values"].forEach(function(prop) {
        ok(typeof Map.prototype[prop] === "function", "Map.prototype." + prop);
      });
      var sizeDesc = Object.getOwnPropertyDescriptor(Map.prototype, "size");
      ok(sizeDesc && "get" in sizeDesc, "Map.prototype.size");

      var o = {}, o2 = {};
      var m = new Map([["a","A"], [0, "+0"], [-0, "-0"]]);
      m.set(o, o2);
      strictEqual(m.get("a"), "A", 'm.get("a")');
      strictEqual(m.get(0), "+0", 'm.get(0)');
      strictEqual(m.get(-0), "-0", 'm.get(-0)');
      strictEqual(m.get(o), o2, 'm.get(o)');
      strictEqual(m.get(o2), void(0), 'm.get(o2)');
    } else {
      ok(false, "not supported: Map");
    }
  });

  test("15.15 WeakMap", function () {
    if (typeof WeakMap === "function") {
      strictEqual(WeakMap.prototype.constructor, WeakMap, "WeakMap.prototype.constructor");
      ["clear", "delete", "get", "has", "set"].forEach(function(prop) {
        ok(typeof WeakMap.prototype[prop] === "function", "WeakMap.prototype." + prop);
      });
      var o = {}, o2 = {};
      var wm = new WeakMap([[o, "OK"]]);
      strictEqual(wm.get(o), o2, "initial value wm.get(o)");
      wm.set(o2, o);
      strictEqual(wm.get(o2), o, "wm.get(o2)");
      throws(function(){ wm.set(null, ""); }, "throws Error when set null");
      throws(function(){ wm.set("a", ""); }, "throws Error when set a primitive value");
    } else {
      ok(false, "not supported: WeakMap");
    }
  });

  test("15.16 Set", function () {
    if (typeof Set === "function") {
      strictEqual(Set.prototype.constructor, Set, "Set.prototype.constructor");
      ["add", "clear", "delete", "entries", "forEach", "has", "values"].forEach(function(prop) {
        ok(typeof Set.prototype[prop] === "function", "Set.prototype." + prop);
      });
      var sizeDesc = Object.getOwnPropertyDescriptor(Set.prototype, "size");
      ok(sizeDesc && "get" in sizeDesc, "Set.prototype.size");

      var o = {};
      var s = new Set(["a", 0, -0]);
      s.add(o);
      ok(s.has("a"), 's.has("a")');
      ok(s.has(0), "s.has(0)");
      ok(s.has(-0), "s.has(-0)");
      ok(s.has(o), "s.has(o)");
      ok(s.has({}) === false, "s.has({}) is false");
    } else {
      ok(false, "not supported: Set");
    }
  });

  test("15.17 WeakSet", function () {
    if (typeof WeakSet === "function") {
      strictEqual(WeakSet.prototype.constructor, WeakSet, "WeakSet.prototype.constructor");
      ["add", "clear", "delete", "has"].forEach(function(prop) {
        ok(typeof WeakSet.prototype[prop] === "function", "WeakSet.prototype." + prop);
      });
      var o = {};
      var s = new WeakSet(["a", 0, -0]);
      s.add(o);
      ok(s.has("a"), 's.has("a")');
      ok(s.has(0), "s.has(0)");
      ok(s.has(-0), "s.has(-0)");
      ok(s.has(o), "s.has(o)");
      ok(s.has({}) === false, "s.has({}) is false");
    } else {
      ok(false, "not supported: WeakSet");
    }
  });

  test("15.18.1 Reflect", function () {
    if (typeof Reflect !== "undefined") {
      [
        "getPrototypeOf", "setPrototypeOf", "isExtensible", "preventExtensions", "has", "hasOwn",
        "getOwnPropertyDescriptor", "get", "set", "invoke", "deleteProperty", "defineProperty", "enumerate",
        "ownKeys"
      ].forEach(function(prop) {
        ok(typeof Reflect[prop] === "function", "Reflect." + prop);
      });
    } else {
      ok(false, "not supported: Reflect");
    }
  });

  test("15.18.2 Proxy", function () {
    if (typeof Proxy !== "undefined") {
      var code1 = 'new Proxy({}, { get: function(){ return "OK" } })',
          code2 = 'Proxy.create({ get: function(){ return "OK" } })';
      try {
        var res = eval(code1);
        strictEqual(res.foo, "OK", code1);
        return;
      } catch(e) {
        ok(false, "not supported: Direct Proxy: " + code1 + " : " + e);
      }
      try {
        var res = eval(code2);
        strictEqual(res.foo, "OK", code2);
      } catch(e) {
        ok(false, "not supported: " + code2 + " : " + e);
      }
    } else {
      ok(false, "not supported: Proxy");
    }
  });

  test("15.19.4 Generator Objects", function () {
    var code = '(function * foo(){ yield 5; }())', res;
    try {
      res = eval(code);
    } catch (e) {
      ok(false, "not supported: Generator Object");
      return;
    }

    var generator = res.constructor;
    ok(typeof generator.prototype.next === "function", "Generator.prototype.next");
    ok(typeof generator.prototype.throw === "function", "Generator.prototype.throw");
  });

})(this);

