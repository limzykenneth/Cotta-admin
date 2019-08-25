(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  /*!
   * Vue.js v2.6.10
   * (c) 2014-2019 Evan You
   * Released under the MIT License.
   */
  /*  */

  const emptyObject = Object.freeze({});

  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive.
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  const _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    const n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  function isPromise (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    const n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    const map = Object.create(null);
    const list = str.split(',');
    for (let i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? val => map[val.toLowerCase()]
      : val => map[val]
  }

  /**
   * Check if a tag is a built-in tag.
   */
  const isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute.
   */
  const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      const index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    const cache = Object.create(null);
    return (function cachedFn (str) {
      const hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  const camelizeRE = /-(\w)/g;
  const camelize = cached((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
  });

  /**
   * Capitalize a string.
   */
  const capitalize = cached((str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cached((str) => {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      const l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  const bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    let i = list.length - start;
    const ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (const key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    const res = {};
    for (let i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  const no = (a, b, c) => false;

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value.
   */
  const identity = (_) => _;

  /**
   * Generate a string containing static keys from compiler modules.
   */
  function genStaticKeys (modules) {
    return modules.reduce((keys, m) => {
      return keys.concat(m.staticKeys || [])
    }, []).join(',')
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) return true
    const isObjectA = isObject(a);
    const isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        const isArrayA = Array.isArray(a);
        const isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every((e, i) => {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          const keysA = Object.keys(a);
          const keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(key => {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf (arr, val) {
    for (let i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) return i
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    let called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  const SSR_ATTR = 'data-server-rendered';

  const ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
  ];

  /*  */



  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "development" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "development" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    const c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`);
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    const segments = path.split('.');
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) return
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  const hasProto = '__proto__' in {};

  // Browser environment sniffing
  const inBrowser = typeof window !== 'undefined';
  const inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  const weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  const UA = inBrowser && window.navigator.userAgent.toLowerCase();
  const isIE = UA && /msie|trident/.test(UA);
  const isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  const isEdge = UA && UA.indexOf('edge/') > 0;
  const isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  const isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  const isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  const isPhantomJS = UA && /phantomjs/.test(UA);
  const isFF = UA && UA.match(/firefox\/(\d+)/);

  // Firefox has a "watch" function on Object.prototype...
  const nativeWatch = ({}).watch;

  let supportsPassive = false;
  if (inBrowser) {
    try {
      const opts = {};
      Object.defineProperty(opts, 'passive', ({
        get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  let _isServer;
  const isServerRendering = () => {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  const devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  const hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  let _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = class Set   {
      
      constructor () {
        this.set = Object.create(null);
      }
      has (key) {
        return this.set[key] === true
      }
      add (key) {
        this.set[key] = true;
      }
      clear () {
        this.set = Object.create(null);
      }
    };
  }

  /*  */

  let warn = noop;
  let tip = noop;
  let generateComponentTrace = (noop); // work around flow check
  let formatComponentName = (noop);

  {
    const hasConsole = typeof console !== 'undefined';
    const classifyRE = /(?:^|[-_])(\w)/g;
    const classify = str => str
      .replace(classifyRE, c => c.toUpperCase())
      .replace(/[-_]/g, '');

    warn = (msg, vm) => {
      const trace = vm ? generateComponentTrace(vm) : '';

      if (config.warnHandler) {
        config.warnHandler.call(null, msg, vm, trace);
      } else if (hasConsole && (!config.silent)) {
        console.error(`[Vue warn]: ${msg}${trace}`);
      }
    };

    tip = (msg, vm) => {
      if (hasConsole && (!config.silent)) {
        console.warn(`[Vue tip]: ${msg}` + (
          vm ? generateComponentTrace(vm) : ''
        ));
      }
    };

    formatComponentName = (vm, includeFile) => {
      if (vm.$root === vm) {
        return '<Root>'
      }
      const options = typeof vm === 'function' && vm.cid != null
        ? vm.options
        : vm._isVue
          ? vm.$options || vm.constructor.options
          : vm;
      let name = options.name || options._componentTag;
      const file = options.__file;
      if (!name && file) {
        const match = file.match(/([^/\\]+)\.vue$/);
        name = match && match[1];
      }

      return (
        (name ? `<${classify(name)}>` : `<Anonymous>`) +
        (file && includeFile !== false ? ` at ${file}` : '')
      )
    };

    const repeat = (str, n) => {
      let res = '';
      while (n) {
        if (n % 2 === 1) res += str;
        if (n > 1) str += str;
        n >>= 1;
      }
      return res
    };

    generateComponentTrace = vm => {
      if (vm._isVue && vm.$parent) {
        const tree = [];
        let currentRecursiveSequence = 0;
        while (vm) {
          if (tree.length > 0) {
            const last = tree[tree.length - 1];
            if (last.constructor === vm.constructor) {
              currentRecursiveSequence++;
              vm = vm.$parent;
              continue
            } else if (currentRecursiveSequence > 0) {
              tree[tree.length - 1] = [last, currentRecursiveSequence];
              currentRecursiveSequence = 0;
            }
          }
          tree.push(vm);
          vm = vm.$parent;
        }
        return '\n\nfound in\n\n' + tree
          .map((vm, i) => `${
          i === 0 ? '---> ' : repeat(' ', 5 + i * 2)
        }${
          Array.isArray(vm)
            ? `${formatComponentName(vm[0])}... (${vm[1]} recursive calls)`
            : formatComponentName(vm)
        }`)
          .join('\n')
      } else {
        return `\n\n(found in ${formatComponentName(vm)})`
      }
    };
  }

  /*  */

  let uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  class Dep {
    
    
    

    constructor () {
      this.id = uid++;
      this.subs = [];
    }

    addSub (sub) {
      this.subs.push(sub);
    }

    removeSub (sub) {
      remove(this.subs, sub);
    }

    depend () {
      if (Dep.target) {
        Dep.target.addDep(this);
      }
    }

    notify () {
      // stabilize the subscriber list first
      const subs = this.subs.slice();
      if (!config.async) {
        // subs aren't sorted in scheduler if not running async
        // we need to sort them now to make sure they fire in correct
        // order
        subs.sort((a, b) => a.id - b.id);
      }
      for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update();
      }
    }
  }

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  const targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /*  */

  class VNode {
    
    
    
    
    
    
     // rendered in this component's scope
    
    
     // component instance
     // component placeholder node

    // strictly internal
     // contains raw HTML? (server only)
     // hoisted static node
     // necessary for enter transition check
     // empty comment placeholder?
     // is a cloned node?
     // is a v-once node?
     // async component factory function
    
    
    
     // real context vm for functional nodes
     // for SSR caching
     // used to store functional render context for devtools
     // functional scope id support

    constructor (
      tag,
      data,
      children,
      text,
      elm,
      context,
      componentOptions,
      asyncFactory
    ) {
      this.tag = tag;
      this.data = data;
      this.children = children;
      this.text = text;
      this.elm = elm;
      this.ns = undefined;
      this.context = context;
      this.fnContext = undefined;
      this.fnOptions = undefined;
      this.fnScopeId = undefined;
      this.key = data && data.key;
      this.componentOptions = componentOptions;
      this.componentInstance = undefined;
      this.parent = undefined;
      this.raw = false;
      this.isStatic = false;
      this.isRootInsert = true;
      this.isComment = false;
      this.isCloned = false;
      this.isOnce = false;
      this.asyncFactory = asyncFactory;
      this.asyncMeta = undefined;
      this.isAsyncPlaceholder = false;
    }

    // DEPRECATED: alias for componentInstance for backwards compat.
    /* istanbul ignore next */
    get child () {
      return this.componentInstance
    }
  }

  const createEmptyVNode = (text = '') => {
    const node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    const cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  const arrayProto = Array.prototype;
  const arrayMethods = Object.create(arrayProto);

  const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator (...args) {
      const result = original.apply(this, args);
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) ob.observeArray(inserted);
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  let shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  class Observer {
    
    
     // number of vms that have this object as root $data

    constructor (value) {
      this.value = value;
      this.dep = new Dep();
      this.vmCount = 0;
      def(value, '__ob__', this);
      if (Array.isArray(value)) {
        if (hasProto) {
          protoAugment(value, arrayMethods);
        } else {
          copyAugment(value, arrayMethods, arrayKeys);
        }
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    /**
     * Walk through all properties and convert them into
     * getter/setters. This method should only be called when
     * value type is Object.
     */
    walk (obj) {
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++) {
        defineReactive$$1(obj, keys[i]);
      }
    }

    /**
     * Observe a list of Array items.
     */
    observeArray (items) {
      for (let i = 0, l = items.length; i < l; i++) {
        observe(items[i]);
      }
    }
  }

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (let i = 0, l = keys.length; i < l; i++) {
      const key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    let ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    const dep = new Dep();

    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    const getter = property && property.get;
    const setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    let childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        const value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        const value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        /* eslint-enable no-self-compare */
        if (customSetter) {
          customSetter();
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) return
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target)}`);
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    const ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (isUndef(target) || isPrimitive(target)
    ) {
      warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target)}`);
    }
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    const ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      warn(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (let e, i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  const strats = config.optionMergeStrategies;

  /**
   * Options with restrictions
   */
  {
    strats.el = strats.propsData = function (parent, child, vm, key) {
      if (!vm) {
        warn(
          `option "${key}" can only be used during instance ` +
          'creation with the `new` keyword.'
        );
      }
      return defaultStrat(parent, child)
    };
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) return to
    let key, toVal, fromVal;

    const keys = hasSymbol
      ? Reflect.ownKeys(from)
      : Object.keys(from);

    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      // in case the object is already observed...
      if (key === '__ob__') continue
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (
        toVal !== fromVal &&
        isPlainObject(toVal) &&
        isPlainObject(fromVal)
      ) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        const instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        const defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {
        warn(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        );

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    const res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    const res = [];
    for (let i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    const res = Object.create(parentVal || null);
    if (childVal) {
      assertObjectType(key, childVal, vm);
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) parentVal = undefined;
    if (childVal === nativeWatch) childVal = undefined;
    /* istanbul ignore if */
    if (!childVal) return Object.create(parentVal || null)
    {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) return childVal
    const ret = {};
    extend(ret, parentVal);
    for (const key in childVal) {
      let parent = ret[key];
      const child = childVal[key];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && "development" !== 'production') {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) return childVal
    const ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) extend(ret, childVal);
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  const defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Validate component names
   */
  function checkComponents (options) {
    for (const key in options.components) {
      validateComponentName(key);
    }
  }

  function validateComponentName (name) {
    if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
      warn(
        'Invalid component name: "' + name + '". Component names ' +
        'should conform to valid custom element name in html5 specification.'
      );
    }
    if (isBuiltInTag(name) || config.isReservedTag(name)) {
      warn(
        'Do not use built-in or reserved HTML elements as component ' +
        'id: ' + name
      );
    }
  }

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    const props = options.props;
    if (!props) return
    const res = {};
    let i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else {
          warn('props must be strings when using array syntax.');
        }
      }
    } else if (isPlainObject(props)) {
      for (const key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    } else {
      warn(
        `Invalid value for option "props": expected an Array or an Object, ` +
        `but got ${toRawType(props)}.`,
        vm
      );
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    const inject = options.inject;
    if (!inject) return
    const normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (let i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (const key in inject) {
        const val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    } else {
      warn(
        `Invalid value for option "inject": expected an Array or an Object, ` +
        `but got ${toRawType(inject)}.`,
        vm
      );
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    const dirs = options.directives;
    if (dirs) {
      for (const key in dirs) {
        const def$$1 = dirs[key];
        if (typeof def$$1 === 'function') {
          dirs[key] = { bind: def$$1, update: def$$1 };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        `Invalid value for option "${name}": expected an Object, ` +
        `but got ${toRawType(value)}.`,
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {
    {
      checkComponents(child);
    }

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }
      if (child.mixins) {
        for (let i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    const options = {};
    let key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      const strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    const assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) return assets[id]
    const camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) return assets[camelizedId]
    const PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
    // fallback to prototype chain
    const res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    if (warnMissing && !res) {
      warn(
        'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
        options
      );
    }
    return res
  }

  /*  */



  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    const prop = propOptions[key];
    const absent = !hasOwn(propsData, key);
    let value = propsData[key];
    // boolean casting
    const booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        const stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      const prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    {
      assertProp(prop, key, value, vm, absent);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    const def = prop.default;
    // warn against non-factory defaults for Object & Array
    if (isObject(def)) {
      warn(
        'Invalid default value for prop "' + key + '": ' +
        'Props with type Object/Array must use a factory function ' +
        'to return the default value.',
        vm
      );
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Assert whether a prop is valid.
   */
  function assertProp (
    prop,
    name,
    value,
    vm,
    absent
  ) {
    if (prop.required && absent) {
      warn(
        'Missing required prop: "' + name + '"',
        vm
      );
      return
    }
    if (value == null && !prop.required) {
      return
    }
    let type = prop.type;
    let valid = !type || type === true;
    const expectedTypes = [];
    if (type) {
      if (!Array.isArray(type)) {
        type = [type];
      }
      for (let i = 0; i < type.length && !valid; i++) {
        const assertedType = assertType(value, type[i]);
        expectedTypes.push(assertedType.expectedType || '');
        valid = assertedType.valid;
      }
    }

    if (!valid) {
      warn(
        getInvalidTypeMessage(name, value, expectedTypes),
        vm
      );
      return
    }
    const validator = prop.validator;
    if (validator) {
      if (!validator(value)) {
        warn(
          'Invalid prop: custom validator check failed for prop "' + name + '".',
          vm
        );
      }
    }
  }

  const simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

  function assertType (value, type) {
    let valid;
    const expectedType = getType(type);
    if (simpleCheckRE.test(expectedType)) {
      const t = typeof value;
      valid = t === expectedType.toLowerCase();
      // for primitive wrapper objects
      if (!valid && t === 'object') {
        valid = value instanceof type;
      }
    } else if (expectedType === 'Object') {
      valid = isPlainObject(value);
    } else if (expectedType === 'Array') {
      valid = Array.isArray(value);
    } else {
      valid = value instanceof type;
    }
    return {
      valid,
      expectedType
    }
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    const match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (let i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  function getInvalidTypeMessage (name, value, expectedTypes) {
    let message = `Invalid prop: type check failed for prop "${name}".` +
      ` Expected ${expectedTypes.map(capitalize).join(', ')}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    // check if we need to specify expected value
    if (expectedTypes.length === 1 &&
        isExplicable(expectedType) &&
        !isBoolean(expectedType, receivedType)) {
      message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    // check if we need to specify received value
    if (isExplicable(receivedType)) {
      message += `with value ${receivedValue}.`;
    }
    return message
  }

  function styleValue (value, type) {
    if (type === 'String') {
      return `"${value}"`
    } else if (type === 'Number') {
      return `${Number(value)}`
    } else {
      return `${value}`
    }
  }

  function isExplicable (value) {
    const explicitTypes = ['string', 'number', 'boolean'];
    return explicitTypes.some(elem => value.toLowerCase() === elem)
  }

  function isBoolean (...args) {
    return args.some(elem => elem.toLowerCase() === 'boolean')
  }

  /*  */

  function handleError (err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        let cur = vm;
        while ((cur = cur.$parent)) {
          const hooks = cur.$options.errorCaptured;
          if (hooks) {
            for (let i = 0; i < hooks.length; i++) {
              try {
                const capture = hooks[i].call(cur, err, vm, info) === false;
                if (capture) return
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook');
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info);
    } finally {
      popTarget();
    }
  }

  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    let res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(e => handleError(e, vm, info + ` (Promise/async)`));
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e, null, 'config.errorHandler');
        }
      }
    }
    logError(err, vm, info);
  }

  function logError (err, vm, info) {
    {
      warn(`Error in ${info}: "${err.toString()}"`, vm);
    }
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */

  let isUsingMicroTask = false;

  const callbacks = [];
  let pending = false;

  function flushCallbacks () {
    pending = false;
    const copies = callbacks.slice(0);
    callbacks.length = 0;
    for (let i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  let timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    const p = Promise.resolve();
    timerFunc = () => {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) setTimeout(noop);
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    let counter = 1;
    const observer = new MutationObserver(flushCallbacks);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = () => {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Techinically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = () => {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = () => {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    let _resolve;
    callbacks.push(() => {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(resolve => {
        _resolve = resolve;
      })
    }
  }

  /*  */

  let mark;
  let measure;

  {
    const perf = inBrowser && window.performance;
    /* istanbul ignore if */
    if (
      perf &&
      perf.mark &&
      perf.measure &&
      perf.clearMarks &&
      perf.clearMeasures
    ) {
      mark = tag => perf.mark(tag);
      measure = (name, startTag, endTag) => {
        perf.measure(name, startTag, endTag);
        perf.clearMarks(startTag);
        perf.clearMarks(endTag);
        // perf.clearMeasures(name)
      };
    }
  }

  /* not type checking this file because flow doesn't play well with Proxy */

  let initProxy;

  {
    const allowedGlobals = makeMap(
      'Infinity,undefined,NaN,isFinite,isNaN,' +
      'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
      'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
      'require' // for Webpack/Browserify
    );

    const warnNonPresent = (target, key) => {
      warn(
        `Property or method "${key}" is not defined on the instance but ` +
        'referenced during render. Make sure that this property is reactive, ' +
        'either in the data option, or for class-based components, by ' +
        'initializing the property. ' +
        'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
        target
      );
    };

    const warnReservedPrefix = (target, key) => {
      warn(
        `Property "${key}" must be accessed with "$data.${key}" because ` +
        'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
        'prevent conflicts with Vue internals' +
        'See: https://vuejs.org/v2/api/#data',
        target
      );
    };

    const hasProxy =
      typeof Proxy !== 'undefined' && isNative(Proxy);

    if (hasProxy) {
      const isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
      config.keyCodes = new Proxy(config.keyCodes, {
        set (target, key, value) {
          if (isBuiltInModifier(key)) {
            warn(`Avoid overwriting built-in modifier in config.keyCodes: .${key}`);
            return false
          } else {
            target[key] = value;
            return true
          }
        }
      });
    }

    const hasHandler = {
      has (target, key) {
        const has = key in target;
        const isAllowed = allowedGlobals(key) ||
          (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
        if (!has && !isAllowed) {
          if (key in target.$data) warnReservedPrefix(target, key);
          else warnNonPresent(target, key);
        }
        return has || !isAllowed
      }
    };

    const getHandler = {
      get (target, key) {
        if (typeof key === 'string' && !(key in target)) {
          if (key in target.$data) warnReservedPrefix(target, key);
          else warnNonPresent(target, key);
        }
        return target[key]
      }
    };

    initProxy = function initProxy (vm) {
      if (hasProxy) {
        // determine which proxy handler to use
        const options = vm.$options;
        const handlers = options.render && options.render._withStripped
          ? getHandler
          : hasHandler;
        vm._renderProxy = new Proxy(vm, handlers);
      } else {
        vm._renderProxy = vm;
      }
    };
  }

  /*  */

  const seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    let i, keys;
    const isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      const depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) _traverse(val[i], seen);
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) _traverse(val[keys[i]], seen);
    }
  }

  /*  */

  const normalizeEvent = cached((name) => {
    const passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    const once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    const capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name,
      once: once$$1,
      capture,
      passive
    }
  });

  function createFnInvoker (fns, vm) {
    function invoker () {
      const fns = invoker.fns;
      if (Array.isArray(fns)) {
        const cloned = fns.slice();
        for (let i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`);
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`)
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    let name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) {
        warn(
          `Invalid handler for event "${event.name}": got ` + String(cur),
          vm
        );
      } else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    let invoker;
    const oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    const propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    const res = {};
    const { attrs, props } = data;
    if (isDef(attrs) || isDef(props)) {
      for (const key in propOptions) {
        const altKey = hyphenate(key);
        {
          const keyInLowerCase = key.toLowerCase();
          if (
            key !== keyInLowerCase &&
            attrs && hasOwn(attrs, keyInLowerCase)
          ) {
            tip(
              `Prop "${keyInLowerCase}" is passed to component ` +
              `${formatComponentName(tag || Ctor)}, but the declared prop name is` +
              ` "${key}". ` +
              `Note that HTML attributes are case-insensitive and camelCased ` +
              `props need to use their kebab-case equivalents when using in-DOM ` +
              `templates. You should probably use "${altKey}" instead of "${key}".`
            );
          }
        }
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (let i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    const res = [];
    let i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') continue
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, `${nestedIndex || ''}_${i}`);
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = `__vlist${nestedIndex}_${i}__`;
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function initProvide (vm) {
    const provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    const result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(key => {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key], () => {
            warn(
              `Avoid mutating an injected value directly since the changes will be ` +
              `overwritten whenever the provided component re-renders. ` +
              `injection being mutated: "${key}"`,
              vm
            );
          });
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      const result = Object.create(null);
      const keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') continue
        const provideKey = inject[key].from;
        let source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            const provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          } else {
            warn(`Injection "${key}" not found`, vm);
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    const slots = {};
    for (let i = 0, l = children.length; i < l; i++) {
      const child = children[i];
      const data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        const name = data.slot;
        const slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (const name in slots) {
      if (slots[name].every(isWhitespace)) {
        delete slots[name];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    let res;
    const hasNormalSlots = Object.keys(normalSlots).length > 0;
    const isStable = slots ? !!slots.$stable : !hasNormalSlots;
    const key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (const key in slots) {
        if (slots[key] && key[0] !== '$') {
          res[key] = normalizeScopedSlot(normalSlots, key, slots[key]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (const key in normalSlots) {
      if (!(key in res)) {
        res[key] = proxyNormalSlot(normalSlots, key);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    const normalized = function () {
      let res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return () => slots[key]
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    let ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        const iterator = val[Symbol.iterator]();
        let result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    const scopedSlotFn = this.$scopedSlots[name];
    let nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        if (!isObject(bindObject)) {
          warn(
            'slot v-bind without argument expects an Object',
            this
          );
        }
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    const target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    const mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) {
        warn(
          'v-bind without argument expects an Object or Array value',
          this
        );
      } else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        let hash;
        for (const key in value) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            const type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          const camelizedKey = camelize(key);
          const hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              const on = data.on || (data.on = {});
              on[`update:${key}`] = function ($event) {
                value[key] = $event;
              };
            }
          }
        }
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    const cached = this._staticTrees || (this._staticTrees = []);
    let tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, `__static__${index}`, false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, `__once__${index}${key ? `_${key}` : ``}`, true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], `${key}_${i}`, isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) {
        warn(
          'v-on without argument expects an Object value',
          this
        );
      } else {
        const on = data.on = data.on ? extend({}, data.on) : {};
        for (const key in value) {
          const existing = on[key];
          const ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots (
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (let i = 0; i < fns.length; i++) {
      const slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys (baseObj, values) {
    for (let i = 0; i < values.length; i += 2) {
      const key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      } else if (key !== '' && key !== null) {
        // null is a speical value for explicitly removing a binding
        warn(
          `Invalid value for dynamic directive argument (expected string or null): ${key}`,
          this
        );
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier (value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    const options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    let contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    const isCompiled = isTrue(options._compiled);
    const needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = () => {
      if (!this.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this.$slots = resolveSlots(children, parent)
        );
      }
      return this.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get () {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = (a, b, c, d) => {
        const vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = (a, b, c, d) => createElement(contextVm, a, b, c, d, needNormalization);
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    const options = Ctor.options;
    const props = {};
    const propOptions = options.props;
    if (isDef(propOptions)) {
      for (const key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) mergeProps(props, data.attrs);
      if (isDef(data.props)) mergeProps(props, data.props);
    }

    const renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    const vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
    } else if (Array.isArray(vnode)) {
      const vnodes = normalizeChildren(vnode) || [];
      const res = new Array(vnodes.length);
      for (let i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    const clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    {
      (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
    }
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (const key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  const componentVNodeHooks = {
    init (vnode, hydrating) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        const mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        const child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch (oldVnode, vnode) {
      const options = vnode.componentOptions;
      const child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert (vnode) {
      const { context, componentInstance } = vnode;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy (vnode) {
      const { componentInstance } = vnode;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  const hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    const baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      {
        warn(`Invalid Component definition: ${String(Ctor)}`, context);
      }
      return
    }

    // async component
    let asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    const propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    const listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      const slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    const name = Ctor.options.name || tag;
    const vnode = new VNode(
      `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
      data, undefined, undefined, undefined, context,
      { Ctor, propsData, listeners, tag, children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent, // activeInstance in lifecycle state
  ) {
    const options = {
      _isComponent: true,
      _parentVnode: vnode,
      parent
    };
    // check inline-template render functions
    const inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    const hooks = data.hook || (data.hook = {});
    for (let i = 0; i < hooksToMerge.length; i++) {
      const key = hooksToMerge[i];
      const existing = hooks[key];
      const toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1 (f1, f2) {
    const merged = (a, b) => {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    const prop = (options.model && options.model.prop) || 'value';
    const event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    const on = data.on || (data.on = {});
    const existing = on[event];
    const callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  const SIMPLE_NORMALIZE = 1;
  const ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
      warn(
        `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
        'Always create fresh vnode data objects in each render!',
        context
      );
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // warn against non-primitive key
    if (isDef(data) && isDef(data.key) && !isPrimitive(data.key)
    ) {
      {
        warn(
          'Avoid using non-primitive value as key, ' +
          'use string/number value instead.',
          context
        );
      }
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    let vnode, ns;
    if (typeof tag === 'string') {
      let Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) applyNS(vnode, ns);
      if (isDef(data)) registerDeepBindings(data);
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (let i = 0, l = vnode.children.length; i < l; i++) {
        const child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    const options = vm.$options;
    const parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    const renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false);
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true);

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    const parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
        !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm);
      }, true);
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, () => {
        !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm);
      }, true);
    }
  }

  let currentRenderingInstance = null;

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      const vm = this;
      const { render, _parentVnode } = vm.$options;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      let vnode;
      try {
        // There's no need to maintain a stack becaues all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, `render`);
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        if (vm.$options.renderError) {
          try {
            vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
          } catch (e) {
            handleError(e, vm, `renderError`);
            vnode = vm._vnode;
          }
        } else {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if (Array.isArray(vnode)) {
          warn(
            'Multiple root nodes returned from render function. Render function ' +
            'should return a single root node.',
            vm
          );
        }
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    const node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data, context, children, tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    const owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      const owners = factory.owners = [owner];
      let sync = true;
      let timerLoading = null;
      let timerTimeout = null

      ;(owner).$on('hook:destroyed', () => remove(owners, owner));

      const forceRender = (renderCompleted) => {
        for (let i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      const resolve = once((res) => {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      const reject = once(reason => {
        warn(
          `Failed to resolve async component: ${String(factory)}` +
          (reason ? `\nReason: ${reason}` : '')
        );
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      const res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(() => {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(() => {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                  `timeout (${res.timeout}ms)`
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        const c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    const listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  let target;

  function add (event, fn) {
    target.$on(event, fn);
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler (event, fn) {
    const _target = target;
    return function onceHandler () {
      const res = fn.apply(null, arguments);
      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    }
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    const hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      const vm = this;
      if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      const vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      const vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) {
          vm.$off(event[i], fn);
        }
        return vm
      }
      // specific event
      const cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      let cb;
      let i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      const vm = this;
      {
        const lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
          tip(
            `Event "${lowerCaseEvent}" is emitted in component ` +
            `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
            `Note that HTML attributes are case-insensitive and you cannot use ` +
            `v-on to listen to camelCase events when using in-DOM templates. ` +
            `You should probably use "${hyphenate(event)}" instead of "${event}".`
          );
        }
      }
      let cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        const args = toArray(arguments, 1);
        const info = `event handler for "${event}"`;
        for (let i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  let activeInstance = null;
  let isUpdatingChildComponent = false;

  function setActiveInstance(vm) {
    const prevActiveInstance = activeInstance;
    activeInstance = vm;
    return () => {
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle (vm) {
    const options = vm.$options;

    // locate first non-abstract parent
    let parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      const vm = this;
      const prevEl = vm.$el;
      const prevVnode = vm._vnode;
      const restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      const vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      const vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      const parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      let i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
      {
        /* istanbul ignore if */
        if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
          vm.$options.el || el) {
          warn(
            'You are using the runtime-only build of Vue where the template ' +
            'compiler is not available. Either pre-compile the templates into ' +
            'render functions, or use the compiler-included build.',
            vm
          );
        } else {
          warn(
            'Failed to mount component: template or render function not defined.',
            vm
          );
        }
      }
    }
    callHook(vm, 'beforeMount');

    let updateComponent;
    /* istanbul ignore if */
    if (config.performance && mark) {
      updateComponent = () => {
        const name = vm._name;
        const id = vm._uid;
        const startTag = `vue-perf-start:${id}`;
        const endTag = `vue-perf-end:${id}`;

        mark(startTag);
        const vnode = vm._render();
        mark(endTag);
        measure(`vue ${name} render`, startTag, endTag);

        mark(startTag);
        vm._update(vnode, hydrating);
        mark(endTag);
        measure(`vue ${name} patch`, startTag, endTag);
      };
    } else {
      updateComponent = () => {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {
    {
      isUpdatingChildComponent = true;
    }

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    const newScopedSlots = parentVnode.data.scopedSlots;
    const oldScopedSlots = vm.$scopedSlots;
    const hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    const needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      const props = vm._props;
      const propKeys = vm.$options._propKeys || [];
      for (let i = 0; i < propKeys.length; i++) {
        const key = propKeys[i];
        const propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    const oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }

    {
      isUpdatingChildComponent = false;
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) return true
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (let i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (let i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    const handlers = vm.$options[hook];
    const info = `${hook} hook`;
    if (handlers) {
      for (let i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  /*  */

  const MAX_UPDATE_COUNT = 100;

  const queue = [];
  const activatedChildren = [];
  let has = {};
  let circular = {};
  let waiting = false;
  let flushing = false;
  let index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    {
      circular = {};
    }
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  let currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  let getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    const performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = () => performance.now();
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    let watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort((a, b) => a.id - b.id);

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if (has[id] != null) {
        circular[id] = (circular[id] || 0) + 1;
        if (circular[id] > MAX_UPDATE_COUNT) {
          warn(
            'You may have an infinite update loop ' + (
              watcher.user
                ? `in watcher with expression "${watcher.expression}"`
                : `in a component render function.`
            ),
            watcher.vm
          );
          break
        }
      }
    }

    // keep copies of post queues before resetting state
    const activatedQueue = activatedChildren.slice();
    const updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    let i = queue.length;
    while (i--) {
      const watcher = queue[i];
      const vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (let i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    const id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        let i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;

        if (!config.async) {
          flushSchedulerQueue();
          return
        }
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */



  let uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  class Watcher {
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    constructor (
      vm,
      expOrFn,
      cb,
      options,
      isRenderWatcher
    ) {
      this.vm = vm;
      if (isRenderWatcher) {
        vm._watcher = this;
      }
      vm._watchers.push(this);
      // options
      if (options) {
        this.deep = !!options.deep;
        this.user = !!options.user;
        this.lazy = !!options.lazy;
        this.sync = !!options.sync;
        this.before = options.before;
      } else {
        this.deep = this.user = this.lazy = this.sync = false;
      }
      this.cb = cb;
      this.id = ++uid$2; // uid for batching
      this.active = true;
      this.dirty = this.lazy; // for lazy watchers
      this.deps = [];
      this.newDeps = [];
      this.depIds = new _Set();
      this.newDepIds = new _Set();
      this.expression = expOrFn.toString();
      // parse expression for getter
      if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
      } else {
        this.getter = parsePath(expOrFn);
        if (!this.getter) {
          this.getter = noop;
          warn(
            `Failed watching path: "${expOrFn}" ` +
            'Watcher only accepts simple dot-delimited paths. ' +
            'For full control, use a function instead.',
            vm
          );
        }
      }
      this.value = this.lazy
        ? undefined
        : this.get();
    }

    /**
     * Evaluate the getter, and re-collect dependencies.
     */
    get () {
      pushTarget(this);
      let value;
      const vm = this.vm;
      try {
        value = this.getter.call(vm, vm);
      } catch (e) {
        if (this.user) {
          handleError(e, vm, `getter for watcher "${this.expression}"`);
        } else {
          throw e
        }
      } finally {
        // "touch" every property so they are all tracked as
        // dependencies for deep watching
        if (this.deep) {
          traverse(value);
        }
        popTarget();
        this.cleanupDeps();
      }
      return value
    }

    /**
     * Add a dependency to this directive.
     */
    addDep (dep) {
      const id = dep.id;
      if (!this.newDepIds.has(id)) {
        this.newDepIds.add(id);
        this.newDeps.push(dep);
        if (!this.depIds.has(id)) {
          dep.addSub(this);
        }
      }
    }

    /**
     * Clean up for dependency collection.
     */
    cleanupDeps () {
      let i = this.deps.length;
      while (i--) {
        const dep = this.deps[i];
        if (!this.newDepIds.has(dep.id)) {
          dep.removeSub(this);
        }
      }
      let tmp = this.depIds;
      this.depIds = this.newDepIds;
      this.newDepIds = tmp;
      this.newDepIds.clear();
      tmp = this.deps;
      this.deps = this.newDeps;
      this.newDeps = tmp;
      this.newDeps.length = 0;
    }

    /**
     * Subscriber interface.
     * Will be called when a dependency changes.
     */
    update () {
      /* istanbul ignore else */
      if (this.lazy) {
        this.dirty = true;
      } else if (this.sync) {
        this.run();
      } else {
        queueWatcher(this);
      }
    }

    /**
     * Scheduler job interface.
     * Will be called by the scheduler.
     */
    run () {
      if (this.active) {
        const value = this.get();
        if (
          value !== this.value ||
          // Deep watchers and watchers on Object/Arrays should fire even
          // when the value is the same, because the value may
          // have mutated.
          isObject(value) ||
          this.deep
        ) {
          // set new value
          const oldValue = this.value;
          this.value = value;
          if (this.user) {
            try {
              this.cb.call(this.vm, value, oldValue);
            } catch (e) {
              handleError(e, this.vm, `callback for watcher "${this.expression}"`);
            }
          } else {
            this.cb.call(this.vm, value, oldValue);
          }
        }
      }
    }

    /**
     * Evaluate the value of the watcher.
     * This only gets called for lazy watchers.
     */
    evaluate () {
      this.value = this.get();
      this.dirty = false;
    }

    /**
     * Depend on all deps collected by this watcher.
     */
    depend () {
      let i = this.deps.length;
      while (i--) {
        this.deps[i].depend();
      }
    }

    /**
     * Remove self from all dependencies' subscriber list.
     */
    teardown () {
      if (this.active) {
        // remove self from vm's watcher list
        // this is a somewhat expensive operation so we skip it
        // if the vm is being destroyed.
        if (!this.vm._isBeingDestroyed) {
          remove(this.vm._watchers, this);
        }
        let i = this.deps.length;
        while (i--) {
          this.deps[i].removeSub(this);
        }
        this.active = false;
      }
    }
  }

  /*  */

  const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    const opts = vm.$options;
    if (opts.props) initProps(vm, opts.props);
    if (opts.methods) initMethods(vm, opts.methods);
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) initComputed(vm, opts.computed);
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    const propsData = vm.$options.propsData || {};
    const props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    const keys = vm.$options._propKeys = [];
    const isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    for (const key in propsOptions) {
      keys.push(key);
      const value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        const hyphenatedKey = hyphenate(key);
        if (isReservedAttribute(hyphenatedKey) ||
            config.isReservedAttr(hyphenatedKey)) {
          warn(
            `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
            vm
          );
        }
        defineReactive$$1(props, key, value, () => {
          if (!isRoot && !isUpdatingChildComponent) {
            warn(
              `Avoid mutating a prop directly since the value will be ` +
              `overwritten whenever the parent component re-renders. ` +
              `Instead, use a data or computed property based on the prop's ` +
              `value. Prop being mutated: "${key}"`,
              vm
            );
          }
        });
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, `_props`, key);
      }
    }
    toggleObserving(true);
  }

  function initData (vm) {
    let data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
      warn(
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance
    const keys = Object.keys(data);
    const props = vm.$options.props;
    const methods = vm.$options.methods;
    let i = keys.length;
    while (i--) {
      const key = keys[i];
      {
        if (methods && hasOwn(methods, key)) {
          warn(
            `Method "${key}" has already been defined as a data property.`,
            vm
          );
        }
      }
      if (props && hasOwn(props, key)) {
        warn(
          `The data property "${key}" is already declared as a prop. ` +
          `Use prop default value instead.`,
          vm
        );
      } else if (!isReserved(key)) {
        proxy(vm, `_data`, key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, `data()`);
      return {}
    } finally {
      popTarget();
    }
  }

  const computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    const watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    const isSSR = isServerRendering();

    for (const key in computed) {
      const userDef = computed[key];
      const getter = typeof userDef === 'function' ? userDef : userDef.get;
      if (getter == null) {
        warn(
          `Getter is missing for computed property "${key}".`,
          vm
        );
      }

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      } else {
        if (key in vm.$data) {
          warn(`The computed property "${key}" is already defined in data.`, vm);
        } else if (vm.$options.props && key in vm.$options.props) {
          warn(`The computed property "${key}" is already defined as a prop.`, vm);
        }
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    const shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    if (sharedPropertyDefinition.set === noop) {
      sharedPropertyDefinition.set = function () {
        warn(
          `Computed property "${key}" was assigned to but it has no setter.`,
          this
        );
      };
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      const watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    const props = vm.$options.props;
    for (const key in methods) {
      {
        if (typeof methods[key] !== 'function') {
          warn(
            `Method "${key}" has type "${typeof methods[key]}" in the component definition. ` +
            `Did you reference the function correctly?`,
            vm
          );
        }
        if (props && hasOwn(props, key)) {
          warn(
            `Method "${key}" has already been defined as a prop.`,
            vm
          );
        }
        if ((key in vm) && isReserved(key)) {
          warn(
            `Method "${key}" conflicts with an existing Vue instance method. ` +
            `Avoid defining component methods that start with _ or $.`
          );
        }
      }
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (const key in watch) {
      const handler = watch[key];
      if (Array.isArray(handler)) {
        for (let i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    const dataDef = {};
    dataDef.get = function () { return this._data };
    const propsDef = {};
    propsDef.get = function () { return this._props };
    {
      dataDef.set = function () {
        warn(
          'Avoid replacing instance root $data. ' +
          'Use nested data properties instead.',
          this
        );
      };
      propsDef.set = function () {
        warn(`$props is readonly.`, this);
      };
    }
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      const vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      const watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`);
        }
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  let uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      const vm = this;
      // a uid
      vm._uid = uid$3++;

      let startTag, endTag;
      /* istanbul ignore if */
      if (config.performance && mark) {
        startTag = `vue-perf-start:${vm._uid}`;
        endTag = `vue-perf-end:${vm._uid}`;
        mark(startTag);
      }

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        initProxy(vm);
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      /* istanbul ignore if */
      if (config.performance && mark) {
        vm._name = formatComponentName(vm, false);
        mark(endTag);
        measure(`vue ${vm._name} init`, startTag, endTag);
      }

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    const opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    const parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    const vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    let options = Ctor.options;
    if (Ctor.super) {
      const superOptions = resolveConstructorOptions(Ctor.super);
      const cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        const modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    let modified;
    const latest = Ctor.options;
    const sealed = Ctor.sealedOptions;
    for (const key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) modified = {};
        modified[key] = latest[key];
      }
    }
    return modified
  }

  function Vue (options) {
    if (!(this instanceof Vue)
    ) {
      warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      const installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      const args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    let cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      const Super = this;
      const SuperId = Super.cid;
      const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      const name = extendOptions.name || Super.options.name;
      if (name) {
        validateComponentName(name);
      }

      const Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    const props = Comp.options.props;
    for (const key in props) {
      proxy(Comp.prototype, `_props`, key);
    }
  }

  function initComputed$1 (Comp) {
    const computed = Comp.options.computed;
    for (const key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(type => {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          /* istanbul ignore if */
          if (type === 'component') {
            validateComponentName(id);
          }
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */



  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    const { cache, keys, _vnode } = keepAliveInstance;
    for (const key in cache) {
      const cachedNode = cache[key];
      if (cachedNode) {
        const name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    const cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  const patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed () {
      for (const key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys);
      }
    },

    mounted () {
      this.$watch('include', val => {
        pruneCache(this, name => matches(val, name));
      });
      this.$watch('exclude', val => {
        pruneCache(this, name => !matches(val, name));
      });
    },

    render () {
      const slot = this.$slots.default;
      const vnode = getFirstComponentChild(slot);
      const componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        const name = getComponentName(componentOptions);
        const { include, exclude } = this;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        const { cache, keys } = this;
        const key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    const configDef = {};
    configDef.get = () => config;
    {
      configDef.set = () => {
        warn(
          'Do not replace the Vue.config object, set individual fields instead.'
        );
      };
    }
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn,
      extend,
      mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6 explicit observable API
    Vue.observable = (obj) => {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(type => {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.10';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  const isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  const acceptValue = makeMap('input,textarea,option,select,progress');
  const mustUseProp = (tag, type, attr) => {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  const isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  const isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  const convertEnumeratedValue = (key, value) => {
    return isFalsyAttrValue(value) || value === 'false'
      ? 'false'
      // allow arbitrary string value for contenteditable
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true'
  };

  const isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  const xlinkNS = 'http://www.w3.org/1999/xlink';

  const isXlink = (name) => {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  const getXlinkProp = (name) => {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  const isFalsyAttrValue = (val) => {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    let data = vnode.data;
    let parentNode = vnode;
    let childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    let res = '';
    let stringified;
    for (let i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) res += ' ';
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    let res = '';
    for (const key in value) {
      if (value[key]) {
        if (res) res += ' ';
        res += key;
      }
    }
    return res
  }

  /*  */

  const namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  const isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  const isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  const isPreTag = (tag) => tag === 'pre';

  const isReservedTag = (tag) => {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  const unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    const el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  const isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      const selected = document.querySelector(el);
      if (!selected) {
        warn(
          'Cannot find element: ' + el
        );
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    const elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create (_, vnode) {
      registerRef(vnode);
    },
    update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    const key = vnode.data.ref;
    if (!isDef(key)) return

    const vm = vnode.context;
    const ref = vnode.componentInstance || vnode.elm;
    const refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  const emptyNode = new VNode('', {}, []);

  const hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') return true
    let i;
    const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    let i, key;
    const map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) map[key] = i;
    }
    return map
  }

  function createPatchFunction (backend) {
    let i, j;
    const cbs = {};

    const { modules, nodeOps } = backend;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeNode (el) {
      const parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function isUnknownElement$$1 (vnode, inVPre) {
      return (
        !inVPre &&
        !vnode.ns &&
        !(
          config.ignoredElements.length &&
          config.ignoredElements.some(ignore => {
            return isRegExp(ignore)
              ? ignore.test(vnode.tag)
              : ignore === vnode.tag
          })
        ) &&
        config.isUnknownElement(vnode.tag)
      )
    }

    let creatingElmInVPre = 0;

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      const data = vnode.data;
      const children = vnode.children;
      const tag = vnode.tag;
      if (isDef(tag)) {
        {
          if (data && data.pre) {
            creatingElmInVPre++;
          }
          if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
            warn(
              'Unknown custom element: <' + tag + '> - did you ' +
              'register the component correctly? For recursive components, ' +
              'make sure to provide the "name" option.',
              vnode.context
            );
          }
        }

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }

        if (data && data.pre) {
          creatingElmInVPre--;
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      let i = vnode.data;
      if (isDef(i)) {
        const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          insert(parentElm, vnode.elm, refElm);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      let i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      let innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (nodeOps.parentNode(ref$$1) === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        {
          checkDuplicateKeys(children);
        }
        for (let i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (let i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) i.create(emptyNode, vnode);
        if (isDef(i.insert)) insertedVnodeQueue.push(vnode);
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      let i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        let ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      let i, j;
      const data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
        for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        let i;
        const listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      let oldStartIdx = 0;
      let newStartIdx = 0;
      let oldEndIdx = oldCh.length - 1;
      let oldStartVnode = oldCh[0];
      let oldEndVnode = oldCh[oldEndIdx];
      let newEndIdx = newCh.length - 1;
      let newStartVnode = newCh[0];
      let newEndVnode = newCh[newEndIdx];
      let oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      const canMove = !removeOnly;

      {
        checkDuplicateKeys(newCh);
      }

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function checkDuplicateKeys (children) {
      const seenKeys = {};
      for (let i = 0; i < children.length; i++) {
        const vnode = children[i];
        const key = vnode.key;
        if (isDef(key)) {
          if (seenKeys[key]) {
            warn(
              `Duplicate keys detected: '${key}'. This may cause an update error.`,
              vnode.context
            );
          } else {
            seenKeys[key] = true;
          }
        }
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (let i = start; i < end; i++) {
        const c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) return i
      }
    }

    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      const elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      let i;
      const data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      const oldCh = oldVnode.children;
      const ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
        if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode);
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly);
        } else if (isDef(ch)) {
          {
            checkDuplicateKeys(ch);
          }
          if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '');
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode);
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (let i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    let hydrationBailed = false;
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    const isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      let i;
      const { tag, data, children } = vnode;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      // assert node match
      {
        if (!assertNodeMatch(elm, vnode, inVPre)) {
          return false
        }
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) i(vnode, true /* hydrating */);
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                /* istanbul ignore if */
                if (typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('server innerHTML: ', i);
                  console.warn('client innerHTML: ', elm.innerHTML);
                }
                return false
              }
            } else {
              // iterate and compare children lists
              let childrenMatch = true;
              let childNode = elm.firstChild;
              for (let i = 0; i < children.length; i++) {
                if (!childNode || !hydrate(childNode, children[i], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                /* istanbul ignore if */
                if (typeof console !== 'undefined' &&
                  !hydrationBailed
                ) {
                  hydrationBailed = true;
                  console.warn('Parent: ', elm);
                  console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
                }
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          let fullInvoke = false;
          for (const key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    function assertNodeMatch (node, vnode, inVPre) {
      if (isDef(vnode.tag)) {
        return vnode.tag.indexOf('vue-component') === 0 || (
          !isUnknownElement$$1(vnode, inVPre) &&
          vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
        )
      } else {
        return node.nodeType === (vnode.isComment ? 8 : 3)
      }
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) invokeDestroyHook(oldVnode);
        return
      }

      let isInitialPatch = false;
      const insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        const isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              } else {
                warn(
                  'The client-side rendered virtual DOM tree is not matching ' +
                  'server-rendered content. This is likely caused by incorrect ' +
                  'HTML markup, for example nesting block-level elements inside ' +
                  '<p>, or missing <tbody>. Bailing hydration and performing ' +
                  'full client-side render.'
                );
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          const oldElm = oldVnode.elm;
          const parentElm = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            let ancestor = vnode.parent;
            const patchable = isPatchable(vnode);
            while (ancestor) {
              for (let i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (let i = 0; i < cbs.create.length; ++i) {
                  cbs.create[i](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                const insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (let i = 1; i < insert.fns.length; i++) {
                    insert.fns[i]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes(parentElm, [oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    const isCreate = oldVnode === emptyNode;
    const isDestroy = vnode === emptyNode;
    const oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    const newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    const dirsWithInsert = [];
    const dirsWithPostpatch = [];

    let key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      const callInsert = () => {
        for (let i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', () => {
        for (let i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  const emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    const res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    let i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || `${dir.name}.${Object.keys(dir.modifiers || {}).join('.')}`
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    const fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, `directive ${dir.name} ${hook} hook`);
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    const opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    let key, cur, old;
    const elm = vnode.elm;
    const oldAttrs = oldVnode.data.attrs || {};
    let attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, convertEnumeratedValue(key, value));
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        const blocker = e => {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    const el = vnode.elm;
    const data = vnode.data;
    const oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    let cls = genClassForVnode(vnode);

    // handle transition classes
    const transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  const validDivisionCharRE = /[\w).+\-_$\]]/;

  function parseFilters (exp) {
    let inSingle = false;
    let inDouble = false;
    let inTemplateString = false;
    let inRegex = false;
    let curly = 0;
    let square = 0;
    let paren = 0;
    let lastFilterIndex = 0;
    let c, prev, i, expression, filters;

    for (i = 0; i < exp.length; i++) {
      prev = c;
      c = exp.charCodeAt(i);
      if (inSingle) {
        if (c === 0x27 && prev !== 0x5C) inSingle = false;
      } else if (inDouble) {
        if (c === 0x22 && prev !== 0x5C) inDouble = false;
      } else if (inTemplateString) {
        if (c === 0x60 && prev !== 0x5C) inTemplateString = false;
      } else if (inRegex) {
        if (c === 0x2f && prev !== 0x5C) inRegex = false;
      } else if (
        c === 0x7C && // pipe
        exp.charCodeAt(i + 1) !== 0x7C &&
        exp.charCodeAt(i - 1) !== 0x7C &&
        !curly && !square && !paren
      ) {
        if (expression === undefined) {
          // first filter, end of expression
          lastFilterIndex = i + 1;
          expression = exp.slice(0, i).trim();
        } else {
          pushFilter();
        }
      } else {
        switch (c) {
          case 0x22: inDouble = true; break         // "
          case 0x27: inSingle = true; break         // '
          case 0x60: inTemplateString = true; break // `
          case 0x28: paren++; break                 // (
          case 0x29: paren--; break                 // )
          case 0x5B: square++; break                // [
          case 0x5D: square--; break                // ]
          case 0x7B: curly++; break                 // {
          case 0x7D: curly--; break                 // }
        }
        if (c === 0x2f) { // /
          let j = i - 1;
          let p;
          // find first non-whitespace prev char
          for (; j >= 0; j--) {
            p = exp.charAt(j);
            if (p !== ' ') break
          }
          if (!p || !validDivisionCharRE.test(p)) {
            inRegex = true;
          }
        }
      }
    }

    if (expression === undefined) {
      expression = exp.slice(0, i).trim();
    } else if (lastFilterIndex !== 0) {
      pushFilter();
    }

    function pushFilter () {
      (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
      lastFilterIndex = i + 1;
    }

    if (filters) {
      for (i = 0; i < filters.length; i++) {
        expression = wrapFilter(expression, filters[i]);
      }
    }

    return expression
  }

  function wrapFilter (exp, filter) {
    const i = filter.indexOf('(');
    if (i < 0) {
      // _f: resolveFilter
      return `_f("${filter}")(${exp})`
    } else {
      const name = filter.slice(0, i);
      const args = filter.slice(i + 1);
      return `_f("${name}")(${exp}${args !== ')' ? ',' + args : args}`
    }
  }

  /*  */



  /* eslint-disable no-unused-vars */
  function baseWarn (msg, range) {
    console.error(`[Vue compiler]: ${msg}`);
  }
  /* eslint-enable no-unused-vars */

  function pluckModuleFunction (
    modules,
    key
  ) {
    return modules
      ? modules.map(m => m[key]).filter(_ => _)
      : []
  }

  function addProp (el, name, value, range, dynamic) {
    (el.props || (el.props = [])).push(rangeSetItem({ name, value, dynamic }, range));
    el.plain = false;
  }

  function addAttr (el, name, value, range, dynamic) {
    const attrs = dynamic
      ? (el.dynamicAttrs || (el.dynamicAttrs = []))
      : (el.attrs || (el.attrs = []));
    attrs.push(rangeSetItem({ name, value, dynamic }, range));
    el.plain = false;
  }

  // add a raw attr (use this in preTransforms)
  function addRawAttr (el, name, value, range) {
    el.attrsMap[name] = value;
    el.attrsList.push(rangeSetItem({ name, value }, range));
  }

  function addDirective (
    el,
    name,
    rawName,
    value,
    arg,
    isDynamicArg,
    modifiers,
    range
  ) {
    (el.directives || (el.directives = [])).push(rangeSetItem({
      name,
      rawName,
      value,
      arg,
      isDynamicArg,
      modifiers
    }, range));
    el.plain = false;
  }

  function prependModifierMarker (symbol, name, dynamic) {
    return dynamic
      ? `_p(${name},"${symbol}")`
      : symbol + name // mark the event as captured
  }

  function addHandler (
    el,
    name,
    value,
    modifiers,
    important,
    warn,
    range,
    dynamic
  ) {
    modifiers = modifiers || emptyObject;
    // warn prevent and passive modifier
    /* istanbul ignore if */
    if (
      warn &&
      modifiers.prevent && modifiers.passive
    ) {
      warn(
        'passive and prevent can\'t be used together. ' +
        'Passive handler can\'t prevent default event.',
        range
      );
    }

    // normalize click.right and click.middle since they don't actually fire
    // this is technically browser-specific, but at least for now browsers are
    // the only target envs that have right/middle clicks.
    if (modifiers.right) {
      if (dynamic) {
        name = `(${name})==='click'?'contextmenu':(${name})`;
      } else if (name === 'click') {
        name = 'contextmenu';
        delete modifiers.right;
      }
    } else if (modifiers.middle) {
      if (dynamic) {
        name = `(${name})==='click'?'mouseup':(${name})`;
      } else if (name === 'click') {
        name = 'mouseup';
      }
    }

    // check capture modifier
    if (modifiers.capture) {
      delete modifiers.capture;
      name = prependModifierMarker('!', name, dynamic);
    }
    if (modifiers.once) {
      delete modifiers.once;
      name = prependModifierMarker('~', name, dynamic);
    }
    /* istanbul ignore if */
    if (modifiers.passive) {
      delete modifiers.passive;
      name = prependModifierMarker('&', name, dynamic);
    }

    let events;
    if (modifiers.native) {
      delete modifiers.native;
      events = el.nativeEvents || (el.nativeEvents = {});
    } else {
      events = el.events || (el.events = {});
    }

    const newHandler = rangeSetItem({ value: value.trim(), dynamic }, range);
    if (modifiers !== emptyObject) {
      newHandler.modifiers = modifiers;
    }

    const handlers = events[name];
    /* istanbul ignore if */
    if (Array.isArray(handlers)) {
      important ? handlers.unshift(newHandler) : handlers.push(newHandler);
    } else if (handlers) {
      events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
    } else {
      events[name] = newHandler;
    }

    el.plain = false;
  }

  function getRawBindingAttr (
    el,
    name
  ) {
    return el.rawAttrsMap[':' + name] ||
      el.rawAttrsMap['v-bind:' + name] ||
      el.rawAttrsMap[name]
  }

  function getBindingAttr (
    el,
    name,
    getStatic
  ) {
    const dynamicValue =
      getAndRemoveAttr(el, ':' + name) ||
      getAndRemoveAttr(el, 'v-bind:' + name);
    if (dynamicValue != null) {
      return parseFilters(dynamicValue)
    } else if (getStatic !== false) {
      const staticValue = getAndRemoveAttr(el, name);
      if (staticValue != null) {
        return JSON.stringify(staticValue)
      }
    }
  }

  // note: this only removes the attr from the Array (attrsList) so that it
  // doesn't get processed by processAttrs.
  // By default it does NOT remove it from the map (attrsMap) because the map is
  // needed during codegen.
  function getAndRemoveAttr (
    el,
    name,
    removeFromMap
  ) {
    let val;
    if ((val = el.attrsMap[name]) != null) {
      const list = el.attrsList;
      for (let i = 0, l = list.length; i < l; i++) {
        if (list[i].name === name) {
          list.splice(i, 1);
          break
        }
      }
    }
    if (removeFromMap) {
      delete el.attrsMap[name];
    }
    return val
  }

  function getAndRemoveAttrByRegex (
    el,
    name
  ) {
    const list = el.attrsList;
    for (let i = 0, l = list.length; i < l; i++) {
      const attr = list[i];
      if (name.test(attr.name)) {
        list.splice(i, 1);
        return attr
      }
    }
  }

  function rangeSetItem (
    item,
    range
  ) {
    if (range) {
      if (range.start != null) {
        item.start = range.start;
      }
      if (range.end != null) {
        item.end = range.end;
      }
    }
    return item
  }

  /*  */

  /**
   * Cross-platform code generation for component v-model
   */
  function genComponentModel (
    el,
    value,
    modifiers
  ) {
    const { number, trim } = modifiers || {};

    const baseValueExpression = '$$v';
    let valueExpression = baseValueExpression;
    if (trim) {
      valueExpression =
        `(typeof ${baseValueExpression} === 'string'` +
        `? ${baseValueExpression}.trim()` +
        `: ${baseValueExpression})`;
    }
    if (number) {
      valueExpression = `_n(${valueExpression})`;
    }
    const assignment = genAssignmentCode(value, valueExpression);

    el.model = {
      value: `(${value})`,
      expression: JSON.stringify(value),
      callback: `function (${baseValueExpression}) {${assignment}}`
    };
  }

  /**
   * Cross-platform codegen helper for generating v-model value assignment code.
   */
  function genAssignmentCode (
    value,
    assignment
  ) {
    const res = parseModel(value);
    if (res.key === null) {
      return `${value}=${assignment}`
    } else {
      return `$set(${res.exp}, ${res.key}, ${assignment})`
    }
  }

  /**
   * Parse a v-model expression into a base path and a final key segment.
   * Handles both dot-path and possible square brackets.
   *
   * Possible cases:
   *
   * - test
   * - test[key]
   * - test[test1[key]]
   * - test["a"][key]
   * - xxx.test[a[a].test1[key]]
   * - test.xxx.a["asa"][test1[key]]
   *
   */

  let len, str, chr, index$1, expressionPos, expressionEndPos;



  function parseModel (val) {
    // Fix https://github.com/vuejs/vue/pull/7730
    // allow v-model="obj.val " (trailing whitespace)
    val = val.trim();
    len = val.length;

    if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
      index$1 = val.lastIndexOf('.');
      if (index$1 > -1) {
        return {
          exp: val.slice(0, index$1),
          key: '"' + val.slice(index$1 + 1) + '"'
        }
      } else {
        return {
          exp: val,
          key: null
        }
      }
    }

    str = val;
    index$1 = expressionPos = expressionEndPos = 0;

    while (!eof()) {
      chr = next();
      /* istanbul ignore if */
      if (isStringStart(chr)) {
        parseString(chr);
      } else if (chr === 0x5B) {
        parseBracket(chr);
      }
    }

    return {
      exp: val.slice(0, expressionPos),
      key: val.slice(expressionPos + 1, expressionEndPos)
    }
  }

  function next () {
    return str.charCodeAt(++index$1)
  }

  function eof () {
    return index$1 >= len
  }

  function isStringStart (chr) {
    return chr === 0x22 || chr === 0x27
  }

  function parseBracket (chr) {
    let inBracket = 1;
    expressionPos = index$1;
    while (!eof()) {
      chr = next();
      if (isStringStart(chr)) {
        parseString(chr);
        continue
      }
      if (chr === 0x5B) inBracket++;
      if (chr === 0x5D) inBracket--;
      if (inBracket === 0) {
        expressionEndPos = index$1;
        break
      }
    }
  }

  function parseString (chr) {
    const stringQuote = chr;
    while (!eof()) {
      chr = next();
      if (chr === stringQuote) {
        break
      }
    }
  }

  /*  */

  let warn$1;

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  const RANGE_TOKEN = '__r';
  const CHECKBOX_RADIO_TOKEN = '__c';

  function model (
    el,
    dir,
    _warn
  ) {
    warn$1 = _warn;
    const value = dir.value;
    const modifiers = dir.modifiers;
    const tag = el.tag;
    const type = el.attrsMap.type;

    {
      // inputs with type="file" are read only and setting the input's
      // value will throw an error.
      if (tag === 'input' && type === 'file') {
        warn$1(
          `<${el.tag} v-model="${value}" type="file">:\n` +
          `File inputs are read only. Use a v-on:change listener instead.`,
          el.rawAttrsMap['v-model']
        );
      }
    }

    if (el.component) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else if (tag === 'select') {
      genSelect(el, value, modifiers);
    } else if (tag === 'input' && type === 'checkbox') {
      genCheckboxModel(el, value, modifiers);
    } else if (tag === 'input' && type === 'radio') {
      genRadioModel(el, value, modifiers);
    } else if (tag === 'input' || tag === 'textarea') {
      genDefaultModel(el, value, modifiers);
    } else if (!config.isReservedTag(tag)) {
      genComponentModel(el, value, modifiers);
      // component v-model doesn't need extra runtime
      return false
    } else {
      warn$1(
        `<${el.tag} v-model="${value}">: ` +
        `v-model is not supported on this element type. ` +
        'If you are working with contenteditable, it\'s recommended to ' +
        'wrap a library dedicated for that purpose inside a custom component.',
        el.rawAttrsMap['v-model']
      );
    }

    // ensure runtime directive metadata
    return true
  }

  function genCheckboxModel (
    el,
    value,
    modifiers
  ) {
    const number = modifiers && modifiers.number;
    const valueBinding = getBindingAttr(el, 'value') || 'null';
    const trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
    const falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
    addProp(el, 'checked',
      `Array.isArray(${value})` +
      `?_i(${value},${valueBinding})>-1` + (
        trueValueBinding === 'true'
          ? `:(${value})`
          : `:_q(${value},${trueValueBinding})`
      )
    );
    addHandler(el, 'change',
      `var $$a=${value},` +
          '$$el=$event.target,' +
          `$$c=$$el.checked?(${trueValueBinding}):(${falseValueBinding});` +
      'if(Array.isArray($$a)){' +
        `var $$v=${number ? '_n(' + valueBinding + ')' : valueBinding},` +
            '$$i=_i($$a,$$v);' +
        `if($$el.checked){$$i<0&&(${genAssignmentCode(value, '$$a.concat([$$v])')})}` +
        `else{$$i>-1&&(${genAssignmentCode(value, '$$a.slice(0,$$i).concat($$a.slice($$i+1))')})}` +
      `}else{${genAssignmentCode(value, '$$c')}}`,
      null, true
    );
  }

  function genRadioModel (
    el,
    value,
    modifiers
  ) {
    const number = modifiers && modifiers.number;
    let valueBinding = getBindingAttr(el, 'value') || 'null';
    valueBinding = number ? `_n(${valueBinding})` : valueBinding;
    addProp(el, 'checked', `_q(${value},${valueBinding})`);
    addHandler(el, 'change', genAssignmentCode(value, valueBinding), null, true);
  }

  function genSelect (
    el,
    value,
    modifiers
  ) {
    const number = modifiers && modifiers.number;
    const selectedVal = `Array.prototype.filter` +
      `.call($event.target.options,function(o){return o.selected})` +
      `.map(function(o){var val = "_value" in o ? o._value : o.value;` +
      `return ${number ? '_n(val)' : 'val'}})`;

    const assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
    let code = `var $$selectedVal = ${selectedVal};`;
    code = `${code} ${genAssignmentCode(value, assignment)}`;
    addHandler(el, 'change', code, null, true);
  }

  function genDefaultModel (
    el,
    value,
    modifiers
  ) {
    const type = el.attrsMap.type;

    // warn if v-bind:value conflicts with v-model
    // except for inputs with v-bind:type
    {
      const value = el.attrsMap['v-bind:value'] || el.attrsMap[':value'];
      const typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type'];
      if (value && !typeBinding) {
        const binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value';
        warn$1(
          `${binding}="${value}" conflicts with v-model on the same element ` +
          'because the latter already expands to a value binding internally',
          el.rawAttrsMap[binding]
        );
      }
    }

    const { lazy, number, trim } = modifiers || {};
    const needCompositionGuard = !lazy && type !== 'range';
    const event = lazy
      ? 'change'
      : type === 'range'
        ? RANGE_TOKEN
        : 'input';

    let valueExpression = '$event.target.value';
    if (trim) {
      valueExpression = `$event.target.value.trim()`;
    }
    if (number) {
      valueExpression = `_n(${valueExpression})`;
    }

    let code = genAssignmentCode(value, valueExpression);
    if (needCompositionGuard) {
      code = `if($event.target.composing)return;${code}`;
    }

    addProp(el, 'value', `(${value})`);
    addHandler(el, event, code, null, true);
    if (trim || number) {
      addHandler(el, 'blur', '$forceUpdate()');
    }
  }

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      const event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  let target$1;

  function createOnceHandler$1 (event, handler, capture) {
    const _target = target$1; // save current target element in closure
    return function onceHandler () {
      const res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  const useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1 (
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      const attachedTimestamp = currentFlushTimestamp;
      const original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture, passive }
        : capture
    );
  }

  function remove$2 (
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    const on = vnode.data.on || {};
    const oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  let svgContainer;

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    let key, cur;
    const elm = vnode.elm;
    const oldProps = oldVnode.data.domProps || {};
    let props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) vnode.children.length = 0;
        if (cur === oldProps[key]) continue
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        const strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = `<svg>${cur}</svg>`;
        const svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecesarry `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) {}
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    let notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    const value = elm.value;
    const modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  const parseStyleText = cached(function (cssText) {
    const res = {};
    const listDelimiter = /;(?![^(]*\))/g;
    const propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        const tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    const style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    const res = {};
    let styleData;

    if (checkChild) {
      let childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    let parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  const cssVarRE = /^--/;
  const importantRE = /\s*!important$/;
  const setProp = (el, name, val) => {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      const normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (let i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  const vendorNames = ['Webkit', 'Moz', 'ms'];

  let emptyStyle;
  const normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    const capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (let i = 0; i < vendorNames.length; i++) {
      const name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    const data = vnode.data;
    const oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    let cur, name;
    const el = vnode.elm;
    const oldStaticStyle = oldData.staticStyle;
    const oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    const oldStyle = oldStaticStyle || oldStyleBinding;

    const style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    const newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  const whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(c => el.classList.add(c));
      } else {
        el.classList.add(cls);
      }
    } else {
      const cur = ` ${el.getAttribute('class') || ''} `;
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(c => el.classList.remove(c));
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      let cur = ` ${el.getAttribute('class') || ''} `;
      const tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      const res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  const autoCssTransition = cached(name => {
    return {
      enterClass: `${name}-enter`,
      enterToClass: `${name}-enter-to`,
      enterActiveClass: `${name}-enter-active`,
      leaveClass: `${name}-leave`,
      leaveToClass: `${name}-leave-to`,
      leaveActiveClass: `${name}-leave-active`
    }
  });

  const hasTransition = inBrowser && !isIE9;
  const TRANSITION = 'transition';
  const ANIMATION = 'animation';

  // Transition property/event sniffing
  let transitionProp = 'transition';
  let transitionEndEvent = 'transitionend';
  let animationProp = 'animation';
  let animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  const raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ fn => fn();

  function nextFrame (fn) {
    raf(() => {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    const transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) return cb()
    const event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    let ended = 0;
    const end = () => {
      el.removeEventListener(event, onEnd);
      cb();
    };
    const onEnd = e => {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  const transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    const styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    const transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    const transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    const animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    const animationTimeout = getTimeout(animationDelays, animationDurations);

    let type;
    let timeout = 0;
    let propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    const hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type,
      timeout,
      propCount,
      hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map((d, i) => {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs (s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    const el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    const data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    const {
      css,
      type,
      enterClass,
      enterToClass,
      enterActiveClass,
      appearClass,
      appearToClass,
      appearActiveClass,
      beforeEnter,
      enter,
      afterEnter,
      enterCancelled,
      beforeAppear,
      appear,
      afterAppear,
      appearCancelled,
      duration
    } = data;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    let context = activeInstance;
    let transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    const isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    const startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    const activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    const toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    const beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    const enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    const afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    const enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    const explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    if (explicitEnterDuration != null) {
      checkDuration(explicitEnterDuration, 'enter', vnode);
    }

    const expectsCSS = css !== false && !isIE9;
    const userWantsControl = getHookArgumentsLength(enterHook);

    const cb = el._enterCb = once(() => {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', () => {
        const parent = el.parentNode;
        const pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(() => {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    const el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    const data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    const {
      css,
      type,
      leaveClass,
      leaveToClass,
      leaveActiveClass,
      beforeLeave,
      leave,
      afterLeave,
      leaveCancelled,
      delayLeave,
      duration
    } = data;

    const expectsCSS = css !== false && !isIE9;
    const userWantsControl = getHookArgumentsLength(leave);

    const explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    if (isDef(explicitLeaveDuration)) {
      checkDuration(explicitLeaveDuration, 'leave', vnode);
    }

    const cb = el._leaveCb = once(() => {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(() => {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  // only used in dev mode
  function checkDuration (val, name, vnode) {
    if (typeof val !== 'number') {
      warn(
        `<transition> explicit ${name} duration is not a valid number - ` +
        `got ${JSON.stringify(val)}.`,
        vnode.context
      );
    } else if (isNaN(val)) {
      warn(
        `<transition> explicit ${name} duration is NaN - ` +
        'the duration expression might be incorrect.',
        vnode.context
      );
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    const invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  const modules = platformModules.concat(baseModules);

  const patch = createPatchFunction({ nodeOps, modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', () => {
      const el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  const directive = {
    inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', () => {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        const prevOptions = el._vOptions;
        const curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some((o, i) => !looseEqual(o, prevOptions[i]))) {
          // trigger change event if
          // no matching option found for at least one value
          const needReset = el.multiple
            ? binding.value.some(v => hasNoMatchingOption(v, curOptions))
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(() => {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    const value = binding.value;
    const isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      warn(
        `<select multiple v-model="${binding.expression}"> ` +
        `expects an Array value for its binding, but got ${
        Object.prototype.toString.call(value).slice(8, -1)
      }`,
        vm
      );
      return
    }
    let selected, option;
    for (let i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(o => !looseEqual(o, value))
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) return
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    const e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind (el, { value }, vnode) {
      vnode = locateNode(vnode);
      const transition$$1 = vnode.data && vnode.data.transition;
      const originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, () => {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update (el, { value, oldValue }, vnode) {
      /* istanbul ignore if */
      if (!value === !oldValue) return
      vnode = locateNode(vnode);
      const transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, () => {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, () => {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show
  };

  /*  */

  const transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    const compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    const data = {};
    const options = comp.$options;
    // props
    for (const key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    const listeners = options._parentListeners;
    for (const key in listeners) {
      data[camelize(key)] = listeners[key];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  const isNotTextNode = (c) => c.tag || isAsyncPlaceholder(c);

  const isVShowDirective = d => d.name === 'show';

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render (h) {
      let children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      // warn multiple elements
      if (children.length > 1) {
        warn(
          '<transition> can only be used on a single element. Use ' +
          '<transition-group> for lists.',
          this.$parent
        );
      }

      const mode = this.mode;

      // warn invalid mode
      if (mode && mode !== 'in-out' && mode !== 'out-in'
      ) {
        warn(
          'invalid <transition> mode: ' + mode,
          this.$parent
        );
      }

      const rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      const child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      const id = `__transition-${this._uid}-`;
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      const data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      const oldRawChild = this._vnode;
      const oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        const oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', () => {
            this._leaving = false;
            this.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          let delayedLeave;
          const performLeave = () => { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', leave => { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  const props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props,

    beforeMount () {
      const update = this._update;
      this._update = (vnode, hydrating) => {
        const restoreActiveInstance = setActiveInstance(this);
        // force removing pass
        this.__patch__(
          this._vnode,
          this.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this._vnode = this.kept;
        restoreActiveInstance();
        update.call(this, vnode, hydrating);
      };
    },

    render (h) {
      const tag = this.tag || this.$vnode.data.tag || 'span';
      const map = Object.create(null);
      const prevChildren = this.prevChildren = this.children;
      const rawChildren = this.$slots.default || [];
      const children = this.children = [];
      const transitionData = extractTransitionData(this);

      for (let i = 0; i < rawChildren.length; i++) {
        const c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          } else {
            const opts = c.componentOptions;
            const name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
            warn(`<transition-group> children must be keyed: <${name}>`);
          }
        }
      }

      if (prevChildren) {
        const kept = [];
        const removed = [];
        for (let i = 0; i < prevChildren.length; i++) {
          const c = prevChildren[i];
          c.data.transition = transitionData;
          c.data.pos = c.elm.getBoundingClientRect();
          if (map[c.key]) {
            kept.push(c);
          } else {
            removed.push(c);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated () {
      const children = this.prevChildren;
      const moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach((c) => {
        if (c.data.moved) {
          const el = c.elm;
          const s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        const clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach((cls) => { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        const info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    const oldPos = c.data.pos;
    const newPos = c.data.newPos;
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      const s = c.elm.style;
      s.transform = s.WebkitTransform = `translate(${dx}px,${dy}px)`;
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition,
    TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(() => {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        } else {
          console[console.info ? 'info' : 'log'](
            'Download the Vue Devtools extension for a better development experience:\n' +
            'https://github.com/vuejs/vue-devtools'
          );
        }
      }
      if (config.productionTip !== false &&
        typeof console !== 'undefined'
      ) {
        console[console.info ? 'info' : 'log'](
          `You are running Vue in development mode.\n` +
          `Make sure to turn on production mode when deploying for production.\n` +
          `See more tips at https://vuejs.org/guide/deployment.html`
        );
      }
    }, 0);
  }

  /*  */

  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;

  const buildRegex = cached(delimiters => {
    const open = delimiters[0].replace(regexEscapeRE, '\\$&');
    const close = delimiters[1].replace(regexEscapeRE, '\\$&');
    return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
  });



  function parseText (
    text,
    delimiters
  ) {
    const tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
    if (!tagRE.test(text)) {
      return
    }
    const tokens = [];
    const rawTokens = [];
    let lastIndex = tagRE.lastIndex = 0;
    let match, index, tokenValue;
    while ((match = tagRE.exec(text))) {
      index = match.index;
      // push text token
      if (index > lastIndex) {
        rawTokens.push(tokenValue = text.slice(lastIndex, index));
        tokens.push(JSON.stringify(tokenValue));
      }
      // tag token
      const exp = parseFilters(match[1].trim());
      tokens.push(`_s(${exp})`);
      rawTokens.push({ '@binding': exp });
      lastIndex = index + match[0].length;
    }
    if (lastIndex < text.length) {
      rawTokens.push(tokenValue = text.slice(lastIndex));
      tokens.push(JSON.stringify(tokenValue));
    }
    return {
      expression: tokens.join('+'),
      tokens: rawTokens
    }
  }

  /*  */

  function transformNode (el, options) {
    const warn = options.warn || baseWarn;
    const staticClass = getAndRemoveAttr(el, 'class');
    if (staticClass) {
      const res = parseText(staticClass, options.delimiters);
      if (res) {
        warn(
          `class="${staticClass}": ` +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div class="{{ val }}">, use <div :class="val">.',
          el.rawAttrsMap['class']
        );
      }
    }
    if (staticClass) {
      el.staticClass = JSON.stringify(staticClass);
    }
    const classBinding = getBindingAttr(el, 'class', false /* getStatic */);
    if (classBinding) {
      el.classBinding = classBinding;
    }
  }

  function genData (el) {
    let data = '';
    if (el.staticClass) {
      data += `staticClass:${el.staticClass},`;
    }
    if (el.classBinding) {
      data += `class:${el.classBinding},`;
    }
    return data
  }

  var klass$1 = {
    staticKeys: ['staticClass'],
    transformNode,
    genData
  };

  /*  */

  function transformNode$1 (el, options) {
    const warn = options.warn || baseWarn;
    const staticStyle = getAndRemoveAttr(el, 'style');
    if (staticStyle) {
      /* istanbul ignore if */
      {
        const res = parseText(staticStyle, options.delimiters);
        if (res) {
          warn(
            `style="${staticStyle}": ` +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div style="{{ val }}">, use <div :style="val">.',
            el.rawAttrsMap['style']
          );
        }
      }
      el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
    }

    const styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
    if (styleBinding) {
      el.styleBinding = styleBinding;
    }
  }

  function genData$1 (el) {
    let data = '';
    if (el.staticStyle) {
      data += `staticStyle:${el.staticStyle},`;
    }
    if (el.styleBinding) {
      data += `style:(${el.styleBinding}),`;
    }
    return data
  }

  var style$1 = {
    staticKeys: ['staticStyle'],
    transformNode: transformNode$1,
    genData: genData$1
  };

  /*  */

  let decoder;

  var he = {
    decode (html) {
      decoder = decoder || document.createElement('div');
      decoder.innerHTML = html;
      return decoder.textContent
    }
  };

  /*  */

  const isUnaryTag = makeMap(
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr'
  );

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  const canBeLeftOpenTag = makeMap(
    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
  );

  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  const isNonPhrasingTag = makeMap(
    'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
    'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
    'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
    'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
    'title,tr,track'
  );

  /**
   * Not type-checking this file because it's mostly vendor code.
   */

  // Regular Expressions for parsing tags and attributes
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  const startTagClose = /^\s*(\/?)>/;
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
  const doctype = /^<!DOCTYPE [^>]+>/i;
  // #7298: escape - to avoid being pased as HTML comment when inlined in page
  const comment = /^<!\--/;
  const conditionalComment = /^<!\[/;

  // Special Elements (can contain anything)
  const isPlainTextElement = makeMap('script,style,textarea', true);
  const reCache = {};

  const decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t',
    '&#39;': "'"
  };
  const encodedAttr = /&(?:lt|gt|quot|amp|#39);/g;
  const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#39|#10|#9);/g;

  // #5992
  const isIgnoreNewlineTag = makeMap('pre,textarea', true);
  const shouldIgnoreFirstNewline = (tag, html) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n';

  function decodeAttr (value, shouldDecodeNewlines) {
    const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
    return value.replace(re, match => decodingMap[match])
  }

  function parseHTML (html, options) {
    const stack = [];
    const expectHTML = options.expectHTML;
    const isUnaryTag$$1 = options.isUnaryTag || no;
    const canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
    let index = 0;
    let last, lastTag;
    while (html) {
      last = html;
      // Make sure we're not in a plaintext content element like script/style
      if (!lastTag || !isPlainTextElement(lastTag)) {
        let textEnd = html.indexOf('<');
        if (textEnd === 0) {
          // Comment:
          if (comment.test(html)) {
            const commentEnd = html.indexOf('-->');

            if (commentEnd >= 0) {
              if (options.shouldKeepComment) {
                options.comment(html.substring(4, commentEnd), index, index + commentEnd + 3);
              }
              advance(commentEnd + 3);
              continue
            }
          }

          // http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
          if (conditionalComment.test(html)) {
            const conditionalEnd = html.indexOf(']>');

            if (conditionalEnd >= 0) {
              advance(conditionalEnd + 2);
              continue
            }
          }

          // Doctype:
          const doctypeMatch = html.match(doctype);
          if (doctypeMatch) {
            advance(doctypeMatch[0].length);
            continue
          }

          // End tag:
          const endTagMatch = html.match(endTag);
          if (endTagMatch) {
            const curIndex = index;
            advance(endTagMatch[0].length);
            parseEndTag(endTagMatch[1], curIndex, index);
            continue
          }

          // Start tag:
          const startTagMatch = parseStartTag();
          if (startTagMatch) {
            handleStartTag(startTagMatch);
            if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
              advance(1);
            }
            continue
          }
        }

        let text, rest, next;
        if (textEnd >= 0) {
          rest = html.slice(textEnd);
          while (
            !endTag.test(rest) &&
            !startTagOpen.test(rest) &&
            !comment.test(rest) &&
            !conditionalComment.test(rest)
          ) {
            // < in plain text, be forgiving and treat it as text
            next = rest.indexOf('<', 1);
            if (next < 0) break
            textEnd += next;
            rest = html.slice(textEnd);
          }
          text = html.substring(0, textEnd);
        }

        if (textEnd < 0) {
          text = html;
        }

        if (text) {
          advance(text.length);
        }

        if (options.chars && text) {
          options.chars(text, index - text.length, index);
        }
      } else {
        let endTagLength = 0;
        const stackedTag = lastTag.toLowerCase();
        const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
        const rest = html.replace(reStackedTag, function (all, text, endTag) {
          endTagLength = endTag.length;
          if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
            text = text
              .replace(/<!\--([\s\S]*?)-->/g, '$1') // #7298
              .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
          }
          if (shouldIgnoreFirstNewline(stackedTag, text)) {
            text = text.slice(1);
          }
          if (options.chars) {
            options.chars(text);
          }
          return ''
        });
        index += html.length - rest.length;
        html = rest;
        parseEndTag(stackedTag, index - endTagLength, index);
      }

      if (html === last) {
        options.chars && options.chars(html);
        if (!stack.length && options.warn) {
          options.warn(`Mal-formatted tag at end of template: "${html}"`, { start: index + html.length });
        }
        break
      }
    }

    // Clean up any remaining tags
    parseEndTag();

    function advance (n) {
      index += n;
      html = html.substring(n);
    }

    function parseStartTag () {
      const start = html.match(startTagOpen);
      if (start) {
        const match = {
          tagName: start[1],
          attrs: [],
          start: index
        };
        advance(start[0].length);
        let end, attr;
        while (!(end = html.match(startTagClose)) && (attr = html.match(dynamicArgAttribute) || html.match(attribute))) {
          attr.start = index;
          advance(attr[0].length);
          attr.end = index;
          match.attrs.push(attr);
        }
        if (end) {
          match.unarySlash = end[1];
          advance(end[0].length);
          match.end = index;
          return match
        }
      }
    }

    function handleStartTag (match) {
      const tagName = match.tagName;
      const unarySlash = match.unarySlash;

      if (expectHTML) {
        if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
          parseEndTag(lastTag);
        }
        if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) {
          parseEndTag(tagName);
        }
      }

      const unary = isUnaryTag$$1(tagName) || !!unarySlash;

      const l = match.attrs.length;
      const attrs = new Array(l);
      for (let i = 0; i < l; i++) {
        const args = match.attrs[i];
        const value = args[3] || args[4] || args[5] || '';
        const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
          ? options.shouldDecodeNewlinesForHref
          : options.shouldDecodeNewlines;
        attrs[i] = {
          name: args[1],
          value: decodeAttr(value, shouldDecodeNewlines)
        };
        if (options.outputSourceRange) {
          attrs[i].start = args.start + args[0].match(/^\s*/).length;
          attrs[i].end = args.end;
        }
      }

      if (!unary) {
        stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs, start: match.start, end: match.end });
        lastTag = tagName;
      }

      if (options.start) {
        options.start(tagName, attrs, unary, match.start, match.end);
      }
    }

    function parseEndTag (tagName, start, end) {
      let pos, lowerCasedTagName;
      if (start == null) start = index;
      if (end == null) end = index;

      // Find the closest opened tag of the same type
      if (tagName) {
        lowerCasedTagName = tagName.toLowerCase();
        for (pos = stack.length - 1; pos >= 0; pos--) {
          if (stack[pos].lowerCasedTag === lowerCasedTagName) {
            break
          }
        }
      } else {
        // If no tag name is provided, clean shop
        pos = 0;
      }

      if (pos >= 0) {
        // Close all the open elements, up the stack
        for (let i = stack.length - 1; i >= pos; i--) {
          if (i > pos || !tagName &&
            options.warn
          ) {
            options.warn(
              `tag <${stack[i].tag}> has no matching end tag.`,
              { start: stack[i].start, end: stack[i].end }
            );
          }
          if (options.end) {
            options.end(stack[i].tag, start, end);
          }
        }

        // Remove the open elements from the stack
        stack.length = pos;
        lastTag = pos && stack[pos - 1].tag;
      } else if (lowerCasedTagName === 'br') {
        if (options.start) {
          options.start(tagName, [], true, start, end);
        }
      } else if (lowerCasedTagName === 'p') {
        if (options.start) {
          options.start(tagName, [], false, start, end);
        }
        if (options.end) {
          options.end(tagName, start, end);
        }
      }
    }
  }

  /*  */

  const onRE = /^@|^v-on:/;
  const dirRE = /^v-|^@|^:/;
  const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
  const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
  const stripParensRE = /^\(|\)$/g;
  const dynamicArgRE = /^\[.*\]$/;

  const argRE = /:(.*)$/;
  const bindRE = /^:|^\.|^v-bind:/;
  const modifierRE = /\.[^.\]]+(?=[^\]]*$)/g;

  const slotRE = /^v-slot(:|$)|^#/;

  const lineBreakRE = /[\r\n]/;
  const whitespaceRE$1 = /\s+/g;

  const invalidAttributeRE = /[\s"'<>\/=]/;

  const decodeHTMLCached = cached(he.decode);

  const emptySlotScopeToken = `_empty_`;

  // configurable state
  let warn$2;
  let delimiters;
  let transforms;
  let preTransforms;
  let postTransforms;
  let platformIsPreTag;
  let platformMustUseProp;
  let platformGetTagNamespace;
  let maybeComponent;

  function createASTElement (
    tag,
    attrs,
    parent
  ) {
    return {
      type: 1,
      tag,
      attrsList: attrs,
      attrsMap: makeAttrsMap(attrs),
      rawAttrsMap: {},
      parent,
      children: []
    }
  }

  /**
   * Convert HTML string to AST.
   */
  function parse (
    template,
    options
  ) {
    warn$2 = options.warn || baseWarn;

    platformIsPreTag = options.isPreTag || no;
    platformMustUseProp = options.mustUseProp || no;
    platformGetTagNamespace = options.getTagNamespace || no;
    const isReservedTag = options.isReservedTag || no;
    maybeComponent = (el) => !!el.component || !isReservedTag(el.tag);

    transforms = pluckModuleFunction(options.modules, 'transformNode');
    preTransforms = pluckModuleFunction(options.modules, 'preTransformNode');
    postTransforms = pluckModuleFunction(options.modules, 'postTransformNode');

    delimiters = options.delimiters;

    const stack = [];
    const preserveWhitespace = options.preserveWhitespace !== false;
    const whitespaceOption = options.whitespace;
    let root;
    let currentParent;
    let inVPre = false;
    let inPre = false;
    let warned = false;

    function warnOnce (msg, range) {
      if (!warned) {
        warned = true;
        warn$2(msg, range);
      }
    }

    function closeElement (element) {
      trimEndingWhitespace(element);
      if (!inVPre && !element.processed) {
        element = processElement(element, options);
      }
      // tree management
      if (!stack.length && element !== root) {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) {
          {
            checkRootConstraints(element);
          }
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } else {
          warnOnce(
            `Component template should contain exactly one root element. ` +
            `If you are using v-if on multiple elements, ` +
            `use v-else-if to chain them instead.`,
            { start: element.start }
          );
        }
      }
      if (currentParent && !element.forbidden) {
        if (element.elseif || element.else) {
          processIfConditions(element, currentParent);
        } else {
          if (element.slotScope) {
            // scoped slot
            // keep it in the children list so that v-else(-if) conditions can
            // find it as the prev node.
            const name = element.slotTarget || '"default"'
            ;(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
          }
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }

      // final children cleanup
      // filter out scoped slots
      element.children = element.children.filter(c => !(c).slotScope);
      // remove trailing whitespace node again
      trimEndingWhitespace(element);

      // check pre state
      if (element.pre) {
        inVPre = false;
      }
      if (platformIsPreTag(element.tag)) {
        inPre = false;
      }
      // apply post-transforms
      for (let i = 0; i < postTransforms.length; i++) {
        postTransforms[i](element, options);
      }
    }

    function trimEndingWhitespace (el) {
      // remove trailing whitespace node
      if (!inPre) {
        let lastNode;
        while (
          (lastNode = el.children[el.children.length - 1]) &&
          lastNode.type === 3 &&
          lastNode.text === ' '
        ) {
          el.children.pop();
        }
      }
    }

    function checkRootConstraints (el) {
      if (el.tag === 'slot' || el.tag === 'template') {
        warnOnce(
          `Cannot use <${el.tag}> as component root element because it may ` +
          'contain multiple nodes.',
          { start: el.start }
        );
      }
      if (el.attrsMap.hasOwnProperty('v-for')) {
        warnOnce(
          'Cannot use v-for on stateful component root element because ' +
          'it renders multiple elements.',
          el.rawAttrsMap['v-for']
        );
      }
    }

    parseHTML(template, {
      warn: warn$2,
      expectHTML: options.expectHTML,
      isUnaryTag: options.isUnaryTag,
      canBeLeftOpenTag: options.canBeLeftOpenTag,
      shouldDecodeNewlines: options.shouldDecodeNewlines,
      shouldDecodeNewlinesForHref: options.shouldDecodeNewlinesForHref,
      shouldKeepComment: options.comments,
      outputSourceRange: options.outputSourceRange,
      start (tag, attrs, unary, start, end) {
        // check namespace.
        // inherit parent ns if there is one
        const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

        // handle IE svg bug
        /* istanbul ignore if */
        if (isIE && ns === 'svg') {
          attrs = guardIESVGBug(attrs);
        }

        let element = createASTElement(tag, attrs, currentParent);
        if (ns) {
          element.ns = ns;
        }

        {
          if (options.outputSourceRange) {
            element.start = start;
            element.end = end;
            element.rawAttrsMap = element.attrsList.reduce((cumulated, attr) => {
              cumulated[attr.name] = attr;
              return cumulated
            }, {});
          }
          attrs.forEach(attr => {
            if (invalidAttributeRE.test(attr.name)) {
              warn$2(
                `Invalid dynamic argument expression: attribute names cannot contain ` +
                `spaces, quotes, <, >, / or =.`,
                {
                  start: attr.start + attr.name.indexOf(`[`),
                  end: attr.start + attr.name.length
                }
              );
            }
          });
        }

        if (isForbiddenTag(element) && !isServerRendering()) {
          element.forbidden = true;
          warn$2(
            'Templates should only be responsible for mapping the state to the ' +
            'UI. Avoid placing tags with side-effects in your templates, such as ' +
            `<${tag}>` + ', as they will not be parsed.',
            { start: element.start }
          );
        }

        // apply pre-transforms
        for (let i = 0; i < preTransforms.length; i++) {
          element = preTransforms[i](element, options) || element;
        }

        if (!inVPre) {
          processPre(element);
          if (element.pre) {
            inVPre = true;
          }
        }
        if (platformIsPreTag(element.tag)) {
          inPre = true;
        }
        if (inVPre) {
          processRawAttrs(element);
        } else if (!element.processed) {
          // structural directives
          processFor(element);
          processIf(element);
          processOnce(element);
        }

        if (!root) {
          root = element;
          {
            checkRootConstraints(root);
          }
        }

        if (!unary) {
          currentParent = element;
          stack.push(element);
        } else {
          closeElement(element);
        }
      },

      end (tag, start, end) {
        const element = stack[stack.length - 1];
        // pop stack
        stack.length -= 1;
        currentParent = stack[stack.length - 1];
        if (options.outputSourceRange) {
          element.end = end;
        }
        closeElement(element);
      },

      chars (text, start, end) {
        if (!currentParent) {
          {
            if (text === template) {
              warnOnce(
                'Component template requires a root element, rather than just text.',
                { start }
              );
            } else if ((text = text.trim())) {
              warnOnce(
                `text "${text}" outside root element will be ignored.`,
                { start }
              );
            }
          }
          return
        }
        // IE textarea placeholder bug
        /* istanbul ignore if */
        if (isIE &&
          currentParent.tag === 'textarea' &&
          currentParent.attrsMap.placeholder === text
        ) {
          return
        }
        const children = currentParent.children;
        if (inPre || text.trim()) {
          text = isTextTag(currentParent) ? text : decodeHTMLCached(text);
        } else if (!children.length) {
          // remove the whitespace-only node right after an opening tag
          text = '';
        } else if (whitespaceOption) {
          if (whitespaceOption === 'condense') {
            // in condense mode, remove the whitespace node if it contains
            // line break, otherwise condense to a single space
            text = lineBreakRE.test(text) ? '' : ' ';
          } else {
            text = ' ';
          }
        } else {
          text = preserveWhitespace ? ' ' : '';
        }
        if (text) {
          if (!inPre && whitespaceOption === 'condense') {
            // condense consecutive whitespaces into single space
            text = text.replace(whitespaceRE$1, ' ');
          }
          let res;
          let child;
          if (!inVPre && text !== ' ' && (res = parseText(text, delimiters))) {
            child = {
              type: 2,
              expression: res.expression,
              tokens: res.tokens,
              text
            };
          } else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') {
            child = {
              type: 3,
              text
            };
          }
          if (child) {
            if (options.outputSourceRange) {
              child.start = start;
              child.end = end;
            }
            children.push(child);
          }
        }
      },
      comment (text, start, end) {
        // adding anyting as a sibling to the root node is forbidden
        // comments should still be allowed, but ignored
        if (currentParent) {
          const child = {
            type: 3,
            text,
            isComment: true
          };
          if (options.outputSourceRange) {
            child.start = start;
            child.end = end;
          }
          currentParent.children.push(child);
        }
      }
    });
    return root
  }

  function processPre (el) {
    if (getAndRemoveAttr(el, 'v-pre') != null) {
      el.pre = true;
    }
  }

  function processRawAttrs (el) {
    const list = el.attrsList;
    const len = list.length;
    if (len) {
      const attrs = el.attrs = new Array(len);
      for (let i = 0; i < len; i++) {
        attrs[i] = {
          name: list[i].name,
          value: JSON.stringify(list[i].value)
        };
        if (list[i].start != null) {
          attrs[i].start = list[i].start;
          attrs[i].end = list[i].end;
        }
      }
    } else if (!el.pre) {
      // non root node in pre blocks with no attributes
      el.plain = true;
    }
  }

  function processElement (
    element,
    options
  ) {
    processKey(element);

    // determine whether this is a plain element after
    // removing structural attributes
    element.plain = (
      !element.key &&
      !element.scopedSlots &&
      !element.attrsList.length
    );

    processRef(element);
    processSlotContent(element);
    processSlotOutlet(element);
    processComponent(element);
    for (let i = 0; i < transforms.length; i++) {
      element = transforms[i](element, options) || element;
    }
    processAttrs(element);
    return element
  }

  function processKey (el) {
    const exp = getBindingAttr(el, 'key');
    if (exp) {
      {
        if (el.tag === 'template') {
          warn$2(
            `<template> cannot be keyed. Place the key on real elements instead.`,
            getRawBindingAttr(el, 'key')
          );
        }
        if (el.for) {
          const iterator = el.iterator2 || el.iterator1;
          const parent = el.parent;
          if (iterator && iterator === exp && parent && parent.tag === 'transition-group') {
            warn$2(
              `Do not use v-for index as key on <transition-group> children, ` +
              `this is the same as not using keys.`,
              getRawBindingAttr(el, 'key'),
              true /* tip */
            );
          }
        }
      }
      el.key = exp;
    }
  }

  function processRef (el) {
    const ref = getBindingAttr(el, 'ref');
    if (ref) {
      el.ref = ref;
      el.refInFor = checkInFor(el);
    }
  }

  function processFor (el) {
    let exp;
    if ((exp = getAndRemoveAttr(el, 'v-for'))) {
      const res = parseFor(exp);
      if (res) {
        extend(el, res);
      } else {
        warn$2(
          `Invalid v-for expression: ${exp}`,
          el.rawAttrsMap['v-for']
        );
      }
    }
  }



  function parseFor (exp) {
    const inMatch = exp.match(forAliasRE);
    if (!inMatch) return
    const res = {};
    res.for = inMatch[2].trim();
    const alias = inMatch[1].trim().replace(stripParensRE, '');
    const iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      res.alias = alias.replace(forIteratorRE, '').trim();
      res.iterator1 = iteratorMatch[1].trim();
      if (iteratorMatch[2]) {
        res.iterator2 = iteratorMatch[2].trim();
      }
    } else {
      res.alias = alias;
    }
    return res
  }

  function processIf (el) {
    const exp = getAndRemoveAttr(el, 'v-if');
    if (exp) {
      el.if = exp;
      addIfCondition(el, {
        exp: exp,
        block: el
      });
    } else {
      if (getAndRemoveAttr(el, 'v-else') != null) {
        el.else = true;
      }
      const elseif = getAndRemoveAttr(el, 'v-else-if');
      if (elseif) {
        el.elseif = elseif;
      }
    }
  }

  function processIfConditions (el, parent) {
    const prev = findPrevElement(parent.children);
    if (prev && prev.if) {
      addIfCondition(prev, {
        exp: el.elseif,
        block: el
      });
    } else {
      warn$2(
        `v-${el.elseif ? ('else-if="' + el.elseif + '"') : 'else'} ` +
        `used on element <${el.tag}> without corresponding v-if.`,
        el.rawAttrsMap[el.elseif ? 'v-else-if' : 'v-else']
      );
    }
  }

  function findPrevElement (children) {
    let i = children.length;
    while (i--) {
      if (children[i].type === 1) {
        return children[i]
      } else {
        if (children[i].text !== ' ') {
          warn$2(
            `text "${children[i].text.trim()}" between v-if and v-else(-if) ` +
            `will be ignored.`,
            children[i]
          );
        }
        children.pop();
      }
    }
  }

  function addIfCondition (el, condition) {
    if (!el.ifConditions) {
      el.ifConditions = [];
    }
    el.ifConditions.push(condition);
  }

  function processOnce (el) {
    const once$$1 = getAndRemoveAttr(el, 'v-once');
    if (once$$1 != null) {
      el.once = true;
    }
  }

  // handle content being passed to a component as slot,
  // e.g. <template slot="xxx">, <div slot-scope="xxx">
  function processSlotContent (el) {
    let slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr(el, 'scope');
      /* istanbul ignore if */
      if (slotScope) {
        warn$2(
          `the "scope" attribute for scoped slots have been deprecated and ` +
          `replaced by "slot-scope" since 2.5. The new "slot-scope" attribute ` +
          `can also be used on plain elements in addition to <template> to ` +
          `denote scoped slots.`,
          el.rawAttrsMap['scope'],
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr(el, 'slot-scope'))) {
      /* istanbul ignore if */
      if (el.attrsMap['v-for']) {
        warn$2(
          `Ambiguous combined usage of slot-scope and v-for on <${el.tag}> ` +
          `(v-for takes higher priority). Use a wrapper <template> for the ` +
          `scoped slot to make it clearer.`,
          el.rawAttrsMap['slot-scope'],
          true
        );
      }
      el.slotScope = slotScope;
    }

    // slot="xxx"
    const slotTarget = getBindingAttr(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      el.slotTargetDynamic = !!(el.attrsMap[':slot'] || el.attrsMap['v-bind:slot']);
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (el.tag !== 'template' && !el.slotScope) {
        addAttr(el, 'slot', slotTarget, getRawBindingAttr(el, 'slot'));
      }
    }

    // 2.6 v-slot syntax
    {
      if (el.tag === 'template') {
        // v-slot on <template>
        const slotBinding = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding) {
          {
            if (el.slotTarget || el.slotScope) {
              warn$2(
                `Unexpected mixed usage of different slot syntaxes.`,
                el
              );
            }
            if (el.parent && !maybeComponent(el.parent)) {
              warn$2(
                `<template v-slot> can only appear at the root level inside ` +
                `the receiving the component`,
                el
              );
            }
          }
          const { name, dynamic } = getSlotName(slotBinding);
          el.slotTarget = name;
          el.slotTargetDynamic = dynamic;
          el.slotScope = slotBinding.value || emptySlotScopeToken; // force it into a scoped slot for perf
        }
      } else {
        // v-slot on component, denotes default slot
        const slotBinding = getAndRemoveAttrByRegex(el, slotRE);
        if (slotBinding) {
          {
            if (!maybeComponent(el)) {
              warn$2(
                `v-slot can only be used on components or <template>.`,
                slotBinding
              );
            }
            if (el.slotScope || el.slotTarget) {
              warn$2(
                `Unexpected mixed usage of different slot syntaxes.`,
                el
              );
            }
            if (el.scopedSlots) {
              warn$2(
                `To avoid scope ambiguity, the default slot should also use ` +
                `<template> syntax when there are other named slots.`,
                slotBinding
              );
            }
          }
          // add the component's children to its default slot
          const slots = el.scopedSlots || (el.scopedSlots = {});
          const { name, dynamic } = getSlotName(slotBinding);
          const slotContainer = slots[name] = createASTElement('template', [], el);
          slotContainer.slotTarget = name;
          slotContainer.slotTargetDynamic = dynamic;
          slotContainer.children = el.children.filter((c) => {
            if (!c.slotScope) {
              c.parent = slotContainer;
              return true
            }
          });
          slotContainer.slotScope = slotBinding.value || emptySlotScopeToken;
          // remove children as they are returned from scopedSlots now
          el.children = [];
          // mark el non-plain so data gets generated
          el.plain = false;
        }
      }
    }
  }

  function getSlotName (binding) {
    let name = binding.name.replace(slotRE, '');
    if (!name) {
      if (binding.name[0] !== '#') {
        name = 'default';
      } else {
        warn$2(
          `v-slot shorthand syntax requires a slot name.`,
          binding
        );
      }
    }
    return dynamicArgRE.test(name)
      // dynamic [name]
      ? { name: name.slice(1, -1), dynamic: true }
      // static name
      : { name: `"${name}"`, dynamic: false }
  }

  // handle <slot/> outlets
  function processSlotOutlet (el) {
    if (el.tag === 'slot') {
      el.slotName = getBindingAttr(el, 'name');
      if (el.key) {
        warn$2(
          `\`key\` does not work on <slot> because slots are abstract outlets ` +
          `and can possibly expand into multiple elements. ` +
          `Use the key on a wrapping element instead.`,
          getRawBindingAttr(el, 'key')
        );
      }
    }
  }

  function processComponent (el) {
    let binding;
    if ((binding = getBindingAttr(el, 'is'))) {
      el.component = binding;
    }
    if (getAndRemoveAttr(el, 'inline-template') != null) {
      el.inlineTemplate = true;
    }
  }

  function processAttrs (el) {
    const list = el.attrsList;
    let i, l, name, rawName, value, modifiers, syncGen, isDynamic;
    for (i = 0, l = list.length; i < l; i++) {
      name = rawName = list[i].name;
      value = list[i].value;
      if (dirRE.test(name)) {
        // mark element as dynamic
        el.hasBindings = true;
        // modifiers
        modifiers = parseModifiers(name.replace(dirRE, ''));
        // support .foo shorthand syntax for the .prop modifier
        if (modifiers) {
          name = name.replace(modifierRE, '');
        }
        if (bindRE.test(name)) { // v-bind
          name = name.replace(bindRE, '');
          value = parseFilters(value);
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          if (
            value.trim().length === 0
          ) {
            warn$2(
              `The value for a v-bind expression cannot be empty. Found in "v-bind:${name}"`
            );
          }
          if (modifiers) {
            if (modifiers.prop && !isDynamic) {
              name = camelize(name);
              if (name === 'innerHtml') name = 'innerHTML';
            }
            if (modifiers.camel && !isDynamic) {
              name = camelize(name);
            }
            if (modifiers.sync) {
              syncGen = genAssignmentCode(value, `$event`);
              if (!isDynamic) {
                addHandler(
                  el,
                  `update:${camelize(name)}`,
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i]
                );
                if (hyphenate(name) !== camelize(name)) {
                  addHandler(
                    el,
                    `update:${hyphenate(name)}`,
                    syncGen,
                    null,
                    false,
                    warn$2,
                    list[i]
                  );
                }
              } else {
                // handler w/ dynamic event name
                addHandler(
                  el,
                  `"update:"+(${name})`,
                  syncGen,
                  null,
                  false,
                  warn$2,
                  list[i],
                  true // dynamic
                );
              }
            }
          }
          if ((modifiers && modifiers.prop) || (
            !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
          )) {
            addProp(el, name, value, list[i], isDynamic);
          } else {
            addAttr(el, name, value, list[i], isDynamic);
          }
        } else if (onRE.test(name)) { // v-on
          name = name.replace(onRE, '');
          isDynamic = dynamicArgRE.test(name);
          if (isDynamic) {
            name = name.slice(1, -1);
          }
          addHandler(el, name, value, modifiers, false, warn$2, list[i], isDynamic);
        } else { // normal directives
          name = name.replace(dirRE, '');
          // parse arg
          const argMatch = name.match(argRE);
          let arg = argMatch && argMatch[1];
          isDynamic = false;
          if (arg) {
            name = name.slice(0, -(arg.length + 1));
            if (dynamicArgRE.test(arg)) {
              arg = arg.slice(1, -1);
              isDynamic = true;
            }
          }
          addDirective(el, name, rawName, value, arg, isDynamic, modifiers, list[i]);
          if (name === 'model') {
            checkForAliasModel(el, value);
          }
        }
      } else {
        // literal attribute
        {
          const res = parseText(value, delimiters);
          if (res) {
            warn$2(
              `${name}="${value}": ` +
              'Interpolation inside attributes has been removed. ' +
              'Use v-bind or the colon shorthand instead. For example, ' +
              'instead of <div id="{{ val }}">, use <div :id="val">.',
              list[i]
            );
          }
        }
        addAttr(el, name, JSON.stringify(value), list[i]);
        // #6887 firefox doesn't update muted state if set via attribute
        // even immediately after element creation
        if (!el.component &&
            name === 'muted' &&
            platformMustUseProp(el.tag, el.attrsMap.type, name)) {
          addProp(el, name, 'true', list[i]);
        }
      }
    }
  }

  function checkInFor (el) {
    let parent = el;
    while (parent) {
      if (parent.for !== undefined) {
        return true
      }
      parent = parent.parent;
    }
    return false
  }

  function parseModifiers (name) {
    const match = name.match(modifierRE);
    if (match) {
      const ret = {};
      match.forEach(m => { ret[m.slice(1)] = true; });
      return ret
    }
  }

  function makeAttrsMap (attrs) {
    const map = {};
    for (let i = 0, l = attrs.length; i < l; i++) {
      if (
        map[attrs[i].name] && !isIE && !isEdge
      ) {
        warn$2('duplicate attribute: ' + attrs[i].name, attrs[i]);
      }
      map[attrs[i].name] = attrs[i].value;
    }
    return map
  }

  // for script (e.g. type="x/template") or style, do not decode content
  function isTextTag (el) {
    return el.tag === 'script' || el.tag === 'style'
  }

  function isForbiddenTag (el) {
    return (
      el.tag === 'style' ||
      (el.tag === 'script' && (
        !el.attrsMap.type ||
        el.attrsMap.type === 'text/javascript'
      ))
    )
  }

  const ieNSBug = /^xmlns:NS\d+/;
  const ieNSPrefix = /^NS\d+:/;

  /* istanbul ignore next */
  function guardIESVGBug (attrs) {
    const res = [];
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (!ieNSBug.test(attr.name)) {
        attr.name = attr.name.replace(ieNSPrefix, '');
        res.push(attr);
      }
    }
    return res
  }

  function checkForAliasModel (el, value) {
    let _el = el;
    while (_el) {
      if (_el.for && _el.alias === value) {
        warn$2(
          `<${el.tag} v-model="${value}">: ` +
          `You are binding v-model directly to a v-for iteration alias. ` +
          `This will not be able to modify the v-for source array because ` +
          `writing to the alias is like modifying a function local variable. ` +
          `Consider using an array of objects and use v-model on an object property instead.`,
          el.rawAttrsMap['v-model']
        );
      }
      _el = _el.parent;
    }
  }

  /*  */

  function preTransformNode (el, options) {
    if (el.tag === 'input') {
      const map = el.attrsMap;
      if (!map['v-model']) {
        return
      }

      let typeBinding;
      if (map[':type'] || map['v-bind:type']) {
        typeBinding = getBindingAttr(el, 'type');
      }
      if (!map.type && !typeBinding && map['v-bind']) {
        typeBinding = `(${map['v-bind']}).type`;
      }

      if (typeBinding) {
        const ifCondition = getAndRemoveAttr(el, 'v-if', true);
        const ifConditionExtra = ifCondition ? `&&(${ifCondition})` : ``;
        const hasElse = getAndRemoveAttr(el, 'v-else', true) != null;
        const elseIfCondition = getAndRemoveAttr(el, 'v-else-if', true);
        // 1. checkbox
        const branch0 = cloneASTElement(el);
        // process for on the main node
        processFor(branch0);
        addRawAttr(branch0, 'type', 'checkbox');
        processElement(branch0, options);
        branch0.processed = true; // prevent it from double-processed
        branch0.if = `(${typeBinding})==='checkbox'` + ifConditionExtra;
        addIfCondition(branch0, {
          exp: branch0.if,
          block: branch0
        });
        // 2. add radio else-if condition
        const branch1 = cloneASTElement(el);
        getAndRemoveAttr(branch1, 'v-for', true);
        addRawAttr(branch1, 'type', 'radio');
        processElement(branch1, options);
        addIfCondition(branch0, {
          exp: `(${typeBinding})==='radio'` + ifConditionExtra,
          block: branch1
        });
        // 3. other
        const branch2 = cloneASTElement(el);
        getAndRemoveAttr(branch2, 'v-for', true);
        addRawAttr(branch2, ':type', typeBinding);
        processElement(branch2, options);
        addIfCondition(branch0, {
          exp: ifCondition,
          block: branch2
        });

        if (hasElse) {
          branch0.else = true;
        } else if (elseIfCondition) {
          branch0.elseif = elseIfCondition;
        }

        return branch0
      }
    }
  }

  function cloneASTElement (el) {
    return createASTElement(el.tag, el.attrsList.slice(), el.parent)
  }

  var model$1 = {
    preTransformNode
  };

  var modules$1 = [
    klass$1,
    style$1,
    model$1
  ];

  /*  */

  function text (el, dir) {
    if (dir.value) {
      addProp(el, 'textContent', `_s(${dir.value})`, dir);
    }
  }

  /*  */

  function html (el, dir) {
    if (dir.value) {
      addProp(el, 'innerHTML', `_s(${dir.value})`, dir);
    }
  }

  var directives$1 = {
    model,
    text,
    html
  };

  /*  */

  const baseOptions = {
    expectHTML: true,
    modules: modules$1,
    directives: directives$1,
    isPreTag,
    isUnaryTag,
    mustUseProp,
    canBeLeftOpenTag,
    isReservedTag,
    getTagNamespace,
    staticKeys: genStaticKeys(modules$1)
  };

  /*  */

  let isStaticKey;
  let isPlatformReservedTag;

  const genStaticKeysCached = cached(genStaticKeys$1);

  /**
   * Goal of the optimizer: walk the generated template AST tree
   * and detect sub-trees that are purely static, i.e. parts of
   * the DOM that never needs to change.
   *
   * Once we detect these sub-trees, we can:
   *
   * 1. Hoist them into constants, so that we no longer need to
   *    create fresh nodes for them on each re-render;
   * 2. Completely skip them in the patching process.
   */
  function optimize (root, options) {
    if (!root) return
    isStaticKey = genStaticKeysCached(options.staticKeys || '');
    isPlatformReservedTag = options.isReservedTag || no;
    // first pass: mark all non-static nodes.
    markStatic$1(root);
    // second pass: mark static roots.
    markStaticRoots(root, false);
  }

  function genStaticKeys$1 (keys) {
    return makeMap(
      'type,tag,attrsList,attrsMap,plain,parent,children,attrs,start,end,rawAttrsMap' +
      (keys ? ',' + keys : '')
    )
  }

  function markStatic$1 (node) {
    node.static = isStatic(node);
    if (node.type === 1) {
      // do not make component slot content static. this avoids
      // 1. components not able to mutate slot nodes
      // 2. static slot content fails for hot-reloading
      if (
        !isPlatformReservedTag(node.tag) &&
        node.tag !== 'slot' &&
        node.attrsMap['inline-template'] == null
      ) {
        return
      }
      for (let i = 0, l = node.children.length; i < l; i++) {
        const child = node.children[i];
        markStatic$1(child);
        if (!child.static) {
          node.static = false;
        }
      }
      if (node.ifConditions) {
        for (let i = 1, l = node.ifConditions.length; i < l; i++) {
          const block = node.ifConditions[i].block;
          markStatic$1(block);
          if (!block.static) {
            node.static = false;
          }
        }
      }
    }
  }

  function markStaticRoots (node, isInFor) {
    if (node.type === 1) {
      if (node.static || node.once) {
        node.staticInFor = isInFor;
      }
      // For a node to qualify as a static root, it should have children that
      // are not just static text. Otherwise the cost of hoisting out will
      // outweigh the benefits and it's better off to just always render it fresh.
      if (node.static && node.children.length && !(
        node.children.length === 1 &&
        node.children[0].type === 3
      )) {
        node.staticRoot = true;
        return
      } else {
        node.staticRoot = false;
      }
      if (node.children) {
        for (let i = 0, l = node.children.length; i < l; i++) {
          markStaticRoots(node.children[i], isInFor || !!node.for);
        }
      }
      if (node.ifConditions) {
        for (let i = 1, l = node.ifConditions.length; i < l; i++) {
          markStaticRoots(node.ifConditions[i].block, isInFor);
        }
      }
    }
  }

  function isStatic (node) {
    if (node.type === 2) { // expression
      return false
    }
    if (node.type === 3) { // text
      return true
    }
    return !!(node.pre || (
      !node.hasBindings && // no dynamic bindings
      !node.if && !node.for && // not v-if or v-for or v-else
      !isBuiltInTag(node.tag) && // not a built-in
      isPlatformReservedTag(node.tag) && // not a component
      !isDirectChildOfTemplateFor(node) &&
      Object.keys(node).every(isStaticKey)
    ))
  }

  function isDirectChildOfTemplateFor (node) {
    while (node.parent) {
      node = node.parent;
      if (node.tag !== 'template') {
        return false
      }
      if (node.for) {
        return true
      }
    }
    return false
  }

  /*  */

  const fnExpRE = /^([\w$_]+|\([^)]*?\))\s*=>|^function\s*(?:[\w$]+)?\s*\(/;
  const fnInvokeRE = /\([^)]*?\);*$/;
  const simplePathRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/;

  // KeyboardEvent.keyCode aliases
  const keyCodes = {
    esc: 27,
    tab: 9,
    enter: 13,
    space: 32,
    up: 38,
    left: 37,
    right: 39,
    down: 40,
    'delete': [8, 46]
  };

  // KeyboardEvent.key aliases
  const keyNames = {
    // #7880: IE11 and Edge use `Esc` for Escape key name.
    esc: ['Esc', 'Escape'],
    tab: 'Tab',
    enter: 'Enter',
    // #9112: IE11 uses `Spacebar` for Space key name.
    space: [' ', 'Spacebar'],
    // #7806: IE11 uses key names without `Arrow` prefix for arrow keys.
    up: ['Up', 'ArrowUp'],
    left: ['Left', 'ArrowLeft'],
    right: ['Right', 'ArrowRight'],
    down: ['Down', 'ArrowDown'],
    // #9112: IE11 uses `Del` for Delete key name.
    'delete': ['Backspace', 'Delete', 'Del']
  };

  // #4868: modifiers that prevent the execution of the listener
  // need to explicitly return null so that we can determine whether to remove
  // the listener for .once
  const genGuard = condition => `if(${condition})return null;`;

  const modifierCode = {
    stop: '$event.stopPropagation();',
    prevent: '$event.preventDefault();',
    self: genGuard(`$event.target !== $event.currentTarget`),
    ctrl: genGuard(`!$event.ctrlKey`),
    shift: genGuard(`!$event.shiftKey`),
    alt: genGuard(`!$event.altKey`),
    meta: genGuard(`!$event.metaKey`),
    left: genGuard(`'button' in $event && $event.button !== 0`),
    middle: genGuard(`'button' in $event && $event.button !== 1`),
    right: genGuard(`'button' in $event && $event.button !== 2`)
  };

  function genHandlers (
    events,
    isNative
  ) {
    const prefix = isNative ? 'nativeOn:' : 'on:';
    let staticHandlers = ``;
    let dynamicHandlers = ``;
    for (const name in events) {
      const handlerCode = genHandler(events[name]);
      if (events[name] && events[name].dynamic) {
        dynamicHandlers += `${name},${handlerCode},`;
      } else {
        staticHandlers += `"${name}":${handlerCode},`;
      }
    }
    staticHandlers = `{${staticHandlers.slice(0, -1)}}`;
    if (dynamicHandlers) {
      return prefix + `_d(${staticHandlers},[${dynamicHandlers.slice(0, -1)}])`
    } else {
      return prefix + staticHandlers
    }
  }

  function genHandler (handler) {
    if (!handler) {
      return 'function(){}'
    }

    if (Array.isArray(handler)) {
      return `[${handler.map(handler => genHandler(handler)).join(',')}]`
    }

    const isMethodPath = simplePathRE.test(handler.value);
    const isFunctionExpression = fnExpRE.test(handler.value);
    const isFunctionInvocation = simplePathRE.test(handler.value.replace(fnInvokeRE, ''));

    if (!handler.modifiers) {
      if (isMethodPath || isFunctionExpression) {
        return handler.value
      }
      return `function($event){${
      isFunctionInvocation ? `return ${handler.value}` : handler.value
    }}` // inline statement
    } else {
      let code = '';
      let genModifierCode = '';
      const keys = [];
      for (const key in handler.modifiers) {
        if (modifierCode[key]) {
          genModifierCode += modifierCode[key];
          // left/right
          if (keyCodes[key]) {
            keys.push(key);
          }
        } else if (key === 'exact') {
          const modifiers = (handler.modifiers);
          genModifierCode += genGuard(
            ['ctrl', 'shift', 'alt', 'meta']
              .filter(keyModifier => !modifiers[keyModifier])
              .map(keyModifier => `$event.${keyModifier}Key`)
              .join('||')
          );
        } else {
          keys.push(key);
        }
      }
      if (keys.length) {
        code += genKeyFilter(keys);
      }
      // Make sure modifiers like prevent and stop get executed after key filtering
      if (genModifierCode) {
        code += genModifierCode;
      }
      const handlerCode = isMethodPath
        ? `return ${handler.value}($event)`
        : isFunctionExpression
          ? `return (${handler.value})($event)`
          : isFunctionInvocation
            ? `return ${handler.value}`
            : handler.value;
      return `function($event){${code}${handlerCode}}`
    }
  }

  function genKeyFilter (keys) {
    return (
      // make sure the key filters only apply to KeyboardEvents
      // #9441: can't use 'keyCode' in $event because Chrome autofill fires fake
      // key events that do not have keyCode property...
      `if(!$event.type.indexOf('key')&&` +
      `${keys.map(genFilterCode).join('&&')})return null;`
    )
  }

  function genFilterCode (key) {
    const keyVal = parseInt(key, 10);
    if (keyVal) {
      return `$event.keyCode!==${keyVal}`
    }
    const keyCode = keyCodes[key];
    const keyName = keyNames[key];
    return (
      `_k($event.keyCode,` +
      `${JSON.stringify(key)},` +
      `${JSON.stringify(keyCode)},` +
      `$event.key,` +
      `${JSON.stringify(keyName)}` +
      `)`
    )
  }

  /*  */

  function on (el, dir) {
    if (dir.modifiers) {
      warn(`v-on without argument does not support modifiers.`);
    }
    el.wrapListeners = (code) => `_g(${code},${dir.value})`;
  }

  /*  */

  function bind$1 (el, dir) {
    el.wrapData = (code) => {
      return `_b(${code},'${el.tag}',${dir.value},${
      dir.modifiers && dir.modifiers.prop ? 'true' : 'false'
    }${
      dir.modifiers && dir.modifiers.sync ? ',true' : ''
    })`
    };
  }

  /*  */

  var baseDirectives = {
    on,
    bind: bind$1,
    cloak: noop
  };

  /*  */





  class CodegenState {
    
    
    
    
    
    
    
    
    

    constructor (options) {
      this.options = options;
      this.warn = options.warn || baseWarn;
      this.transforms = pluckModuleFunction(options.modules, 'transformCode');
      this.dataGenFns = pluckModuleFunction(options.modules, 'genData');
      this.directives = extend(extend({}, baseDirectives), options.directives);
      const isReservedTag = options.isReservedTag || no;
      this.maybeComponent = (el) => !!el.component || !isReservedTag(el.tag);
      this.onceId = 0;
      this.staticRenderFns = [];
      this.pre = false;
    }
  }



  function generate (
    ast,
    options
  ) {
    const state = new CodegenState(options);
    const code = ast ? genElement(ast, state) : '_c("div")';
    return {
      render: `with(this){return ${code}}`,
      staticRenderFns: state.staticRenderFns
    }
  }

  function genElement (el, state) {
    if (el.parent) {
      el.pre = el.pre || el.parent.pre;
    }

    if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el, state)
    } else if (el.for && !el.forProcessed) {
      return genFor(el, state)
    } else if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
      return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
      return genSlot(el, state)
    } else {
      // component or element
      let code;
      if (el.component) {
        code = genComponent(el.component, el, state);
      } else {
        let data;
        if (!el.plain || (el.pre && state.maybeComponent(el))) {
          data = genData$2(el, state);
        }

        const children = el.inlineTemplate ? null : genChildren(el, state, true);
        code = `_c('${el.tag}'${
        data ? `,${data}` : '' // data
      }${
        children ? `,${children}` : '' // children
      })`;
      }
      // module transforms
      for (let i = 0; i < state.transforms.length; i++) {
        code = state.transforms[i](el, code);
      }
      return code
    }
  }

  // hoist static sub-trees out
  function genStatic (el, state) {
    el.staticProcessed = true;
    // Some elements (templates) need to behave differently inside of a v-pre
    // node.  All pre nodes are static roots, so we can use this as a location to
    // wrap a state change and reset it upon exiting the pre node.
    const originalPreState = state.pre;
    if (el.pre) {
      state.pre = el.pre;
    }
    state.staticRenderFns.push(`with(this){return ${genElement(el, state)}}`);
    state.pre = originalPreState;
    return `_m(${
    state.staticRenderFns.length - 1
  }${
    el.staticInFor ? ',true' : ''
  })`
  }

  // v-once
  function genOnce (el, state) {
    el.onceProcessed = true;
    if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.staticInFor) {
      let key = '';
      let parent = el.parent;
      while (parent) {
        if (parent.for) {
          key = parent.key;
          break
        }
        parent = parent.parent;
      }
      if (!key) {
        state.warn(
          `v-once can only be used inside v-for that is keyed. `,
          el.rawAttrsMap['v-once']
        );
        return genElement(el, state)
      }
      return `_o(${genElement(el, state)},${state.onceId++},${key})`
    } else {
      return genStatic(el, state)
    }
  }

  function genIf (
    el,
    state,
    altGen,
    altEmpty
  ) {
    el.ifProcessed = true; // avoid recursion
    return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
  }

  function genIfConditions (
    conditions,
    state,
    altGen,
    altEmpty
  ) {
    if (!conditions.length) {
      return altEmpty || '_e()'
    }

    const condition = conditions.shift();
    if (condition.exp) {
      return `(${condition.exp})?${
      genTernaryExp(condition.block)
    }:${
      genIfConditions(conditions, state, altGen, altEmpty)
    }`
    } else {
      return `${genTernaryExp(condition.block)}`
    }

    // v-if with v-once should generate code like (a)?_m(0):_m(1)
    function genTernaryExp (el) {
      return altGen
        ? altGen(el, state)
        : el.once
          ? genOnce(el, state)
          : genElement(el, state)
    }
  }

  function genFor (
    el,
    state,
    altGen,
    altHelper
  ) {
    const exp = el.for;
    const alias = el.alias;
    const iterator1 = el.iterator1 ? `,${el.iterator1}` : '';
    const iterator2 = el.iterator2 ? `,${el.iterator2}` : '';

    if (state.maybeComponent(el) &&
      el.tag !== 'slot' &&
      el.tag !== 'template' &&
      !el.key
    ) {
      state.warn(
        `<${el.tag} v-for="${alias} in ${exp}">: component lists rendered with ` +
        `v-for should have explicit keys. ` +
        `See https://vuejs.org/guide/list.html#key for more info.`,
        el.rawAttrsMap['v-for'],
        true /* tip */
      );
    }

    el.forProcessed = true; // avoid recursion
    return `${altHelper || '_l'}((${exp}),` +
      `function(${alias}${iterator1}${iterator2}){` +
        `return ${(altGen || genElement)(el, state)}` +
      '})'
  }

  function genData$2 (el, state) {
    let data = '{';

    // directives first.
    // directives may mutate the el's other properties before they are generated.
    const dirs = genDirectives(el, state);
    if (dirs) data += dirs + ',';

    // key
    if (el.key) {
      data += `key:${el.key},`;
    }
    // ref
    if (el.ref) {
      data += `ref:${el.ref},`;
    }
    if (el.refInFor) {
      data += `refInFor:true,`;
    }
    // pre
    if (el.pre) {
      data += `pre:true,`;
    }
    // record original tag name for components using "is" attribute
    if (el.component) {
      data += `tag:"${el.tag}",`;
    }
    // module data generation functions
    for (let i = 0; i < state.dataGenFns.length; i++) {
      data += state.dataGenFns[i](el);
    }
    // attributes
    if (el.attrs) {
      data += `attrs:${genProps(el.attrs)},`;
    }
    // DOM props
    if (el.props) {
      data += `domProps:${genProps(el.props)},`;
    }
    // event handlers
    if (el.events) {
      data += `${genHandlers(el.events, false)},`;
    }
    if (el.nativeEvents) {
      data += `${genHandlers(el.nativeEvents, true)},`;
    }
    // slot target
    // only for non-scoped slots
    if (el.slotTarget && !el.slotScope) {
      data += `slot:${el.slotTarget},`;
    }
    // scoped slots
    if (el.scopedSlots) {
      data += `${genScopedSlots(el, el.scopedSlots, state)},`;
    }
    // component v-model
    if (el.model) {
      data += `model:{value:${
      el.model.value
    },callback:${
      el.model.callback
    },expression:${
      el.model.expression
    }},`;
    }
    // inline-template
    if (el.inlineTemplate) {
      const inlineTemplate = genInlineTemplate(el, state);
      if (inlineTemplate) {
        data += `${inlineTemplate},`;
      }
    }
    data = data.replace(/,$/, '') + '}';
    // v-bind dynamic argument wrap
    // v-bind with dynamic arguments must be applied using the same v-bind object
    // merge helper so that class/style/mustUseProp attrs are handled correctly.
    if (el.dynamicAttrs) {
      data = `_b(${data},"${el.tag}",${genProps(el.dynamicAttrs)})`;
    }
    // v-bind data wrap
    if (el.wrapData) {
      data = el.wrapData(data);
    }
    // v-on data wrap
    if (el.wrapListeners) {
      data = el.wrapListeners(data);
    }
    return data
  }

  function genDirectives (el, state) {
    const dirs = el.directives;
    if (!dirs) return
    let res = 'directives:[';
    let hasRuntime = false;
    let i, l, dir, needRuntime;
    for (i = 0, l = dirs.length; i < l; i++) {
      dir = dirs[i];
      needRuntime = true;
      const gen = state.directives[dir.name];
      if (gen) {
        // compile-time directive that manipulates AST.
        // returns true if it also needs a runtime counterpart.
        needRuntime = !!gen(el, dir, state.warn);
      }
      if (needRuntime) {
        hasRuntime = true;
        res += `{name:"${dir.name}",rawName:"${dir.rawName}"${
        dir.value ? `,value:(${dir.value}),expression:${JSON.stringify(dir.value)}` : ''
      }${
        dir.arg ? `,arg:${dir.isDynamicArg ? dir.arg : `"${dir.arg}"`}` : ''
      }${
        dir.modifiers ? `,modifiers:${JSON.stringify(dir.modifiers)}` : ''
      }},`;
      }
    }
    if (hasRuntime) {
      return res.slice(0, -1) + ']'
    }
  }

  function genInlineTemplate (el, state) {
    const ast = el.children[0];
    if (el.children.length !== 1 || ast.type !== 1) {
      state.warn(
        'Inline-template components must have exactly one child element.',
        { start: el.start }
      );
    }
    if (ast && ast.type === 1) {
      const inlineRenderFns = generate(ast, state.options);
      return `inlineTemplate:{render:function(){${
      inlineRenderFns.render
    }},staticRenderFns:[${
      inlineRenderFns.staticRenderFns.map(code => `function(){${code}}`).join(',')
    }]}`
    }
  }

  function genScopedSlots (
    el,
    slots,
    state
  ) {
    // by default scoped slots are considered "stable", this allows child
    // components with only scoped slots to skip forced updates from parent.
    // but in some cases we have to bail-out of this optimization
    // for example if the slot contains dynamic names, has v-if or v-for on them...
    let needsForceUpdate = el.for || Object.keys(slots).some(key => {
      const slot = slots[key];
      return (
        slot.slotTargetDynamic ||
        slot.if ||
        slot.for ||
        containsSlotChild(slot) // is passing down slot from parent which may be dynamic
      )
    });

    // #9534: if a component with scoped slots is inside a conditional branch,
    // it's possible for the same component to be reused but with different
    // compiled slot content. To avoid that, we generate a unique key based on
    // the generated code of all the slot contents.
    let needsKey = !!el.if;

    // OR when it is inside another scoped slot or v-for (the reactivity may be
    // disconnected due to the intermediate scope variable)
    // #9438, #9506
    // TODO: this can be further optimized by properly analyzing in-scope bindings
    // and skip force updating ones that do not actually use scope variables.
    if (!needsForceUpdate) {
      let parent = el.parent;
      while (parent) {
        if (
          (parent.slotScope && parent.slotScope !== emptySlotScopeToken) ||
          parent.for
        ) {
          needsForceUpdate = true;
          break
        }
        if (parent.if) {
          needsKey = true;
        }
        parent = parent.parent;
      }
    }

    const generatedSlots = Object.keys(slots)
      .map(key => genScopedSlot(slots[key], state))
      .join(',');

    return `scopedSlots:_u([${generatedSlots}]${
    needsForceUpdate ? `,null,true` : ``
  }${
    !needsForceUpdate && needsKey ? `,null,false,${hash(generatedSlots)}` : ``
  })`
  }

  function hash(str) {
    let hash = 5381;
    let i = str.length;
    while(i) {
      hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0
  }

  function containsSlotChild (el) {
    if (el.type === 1) {
      if (el.tag === 'slot') {
        return true
      }
      return el.children.some(containsSlotChild)
    }
    return false
  }

  function genScopedSlot (
    el,
    state
  ) {
    const isLegacySyntax = el.attrsMap['slot-scope'];
    if (el.if && !el.ifProcessed && !isLegacySyntax) {
      return genIf(el, state, genScopedSlot, `null`)
    }
    if (el.for && !el.forProcessed) {
      return genFor(el, state, genScopedSlot)
    }
    const slotScope = el.slotScope === emptySlotScopeToken
      ? ``
      : String(el.slotScope);
    const fn = `function(${slotScope}){` +
      `return ${el.tag === 'template'
      ? el.if && isLegacySyntax
        ? `(${el.if})?${genChildren(el, state) || 'undefined'}:undefined`
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)
    }}`;
    // reverse proxy v-slot without scope on this.$slots
    const reverseProxy = slotScope ? `` : `,proxy:true`;
    return `{key:${el.slotTarget || `"default"`},fn:${fn}${reverseProxy}}`
  }

  function genChildren (
    el,
    state,
    checkSkip,
    altGenElement,
    altGenNode
  ) {
    const children = el.children;
    if (children.length) {
      const el = children[0];
      // optimize single v-for
      if (children.length === 1 &&
        el.for &&
        el.tag !== 'template' &&
        el.tag !== 'slot'
      ) {
        const normalizationType = checkSkip
          ? state.maybeComponent(el) ? `,1` : `,0`
          : ``;
        return `${(altGenElement || genElement)(el, state)}${normalizationType}`
      }
      const normalizationType = checkSkip
        ? getNormalizationType(children, state.maybeComponent)
        : 0;
      const gen = altGenNode || genNode;
      return `[${children.map(c => gen(c, state)).join(',')}]${
      normalizationType ? `,${normalizationType}` : ''
    }`
    }
  }

  // determine the normalization needed for the children array.
  // 0: no normalization needed
  // 1: simple normalization needed (possible 1-level deep nested array)
  // 2: full normalization needed
  function getNormalizationType (
    children,
    maybeComponent
  ) {
    let res = 0;
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      if (el.type !== 1) {
        continue
      }
      if (needsNormalization(el) ||
          (el.ifConditions && el.ifConditions.some(c => needsNormalization(c.block)))) {
        res = 2;
        break
      }
      if (maybeComponent(el) ||
          (el.ifConditions && el.ifConditions.some(c => maybeComponent(c.block)))) {
        res = 1;
      }
    }
    return res
  }

  function needsNormalization (el) {
    return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
  }

  function genNode (node, state) {
    if (node.type === 1) {
      return genElement(node, state)
    } else if (node.type === 3 && node.isComment) {
      return genComment(node)
    } else {
      return genText(node)
    }
  }

  function genText (text) {
    return `_v(${text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))
  })`
  }

  function genComment (comment) {
    return `_e(${JSON.stringify(comment.text)})`
  }

  function genSlot (el, state) {
    const slotName = el.slotName || '"default"';
    const children = genChildren(el, state);
    let res = `_t(${slotName}${children ? `,${children}` : ''}`;
    const attrs = el.attrs || el.dynamicAttrs
      ? genProps((el.attrs || []).concat(el.dynamicAttrs || []).map(attr => ({
          // slot props are camelized
          name: camelize(attr.name),
          value: attr.value,
          dynamic: attr.dynamic
        })))
      : null;
    const bind$$1 = el.attrsMap['v-bind'];
    if ((attrs || bind$$1) && !children) {
      res += `,null`;
    }
    if (attrs) {
      res += `,${attrs}`;
    }
    if (bind$$1) {
      res += `${attrs ? '' : ',null'},${bind$$1}`;
    }
    return res + ')'
  }

  // componentName is el.component, take it as argument to shun flow's pessimistic refinement
  function genComponent (
    componentName,
    el,
    state
  ) {
    const children = el.inlineTemplate ? null : genChildren(el, state, true);
    return `_c(${componentName},${genData$2(el, state)}${
    children ? `,${children}` : ''
  })`
  }

  function genProps (props) {
    let staticProps = ``;
    let dynamicProps = ``;
    for (let i = 0; i < props.length; i++) {
      const prop = props[i];
      const value = transformSpecialNewlines(prop.value);
      if (prop.dynamic) {
        dynamicProps += `${prop.name},${value},`;
      } else {
        staticProps += `"${prop.name}":${value},`;
      }
    }
    staticProps = `{${staticProps.slice(0, -1)}}`;
    if (dynamicProps) {
      return `_d(${staticProps},[${dynamicProps.slice(0, -1)}])`
    } else {
      return staticProps
    }
  }

  // #3895, #4268
  function transformSpecialNewlines (text) {
    return text
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029')
  }

  /*  */



  // these keywords should not appear inside expressions, but operators like
  // typeof, instanceof and in are allowed
  const prohibitedKeywordRE = new RegExp('\\b' + (
    'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
    'super,throw,while,yield,delete,export,import,return,switch,default,' +
    'extends,finally,continue,debugger,function,arguments'
  ).split(',').join('\\b|\\b') + '\\b');

  // these unary operators should not be used as property/method names
  const unaryOperatorsRE = new RegExp('\\b' + (
    'delete,typeof,void'
  ).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

  // strip strings in expressions
  const stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

  // detect problematic expressions in a template
  function detectErrors (ast, warn) {
    if (ast) {
      checkNode(ast, warn);
    }
  }

  function checkNode (node, warn) {
    if (node.type === 1) {
      for (const name in node.attrsMap) {
        if (dirRE.test(name)) {
          const value = node.attrsMap[name];
          if (value) {
            const range = node.rawAttrsMap[name];
            if (name === 'v-for') {
              checkFor(node, `v-for="${value}"`, warn, range);
            } else if (onRE.test(name)) {
              checkEvent(value, `${name}="${value}"`, warn, range);
            } else {
              checkExpression(value, `${name}="${value}"`, warn, range);
            }
          }
        }
      }
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          checkNode(node.children[i], warn);
        }
      }
    } else if (node.type === 2) {
      checkExpression(node.expression, node.text, warn, node);
    }
  }

  function checkEvent (exp, text, warn, range) {
    const stipped = exp.replace(stripStringRE, '');
    const keywordMatch = stipped.match(unaryOperatorsRE);
    if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
      warn(
        `avoid using JavaScript unary operator as property name: ` +
        `"${keywordMatch[0]}" in expression ${text.trim()}`,
        range
      );
    }
    checkExpression(exp, text, warn, range);
  }

  function checkFor (node, text, warn, range) {
    checkExpression(node.for || '', text, warn, range);
    checkIdentifier(node.alias, 'v-for alias', text, warn, range);
    checkIdentifier(node.iterator1, 'v-for iterator', text, warn, range);
    checkIdentifier(node.iterator2, 'v-for iterator', text, warn, range);
  }

  function checkIdentifier (
    ident,
    type,
    text,
    warn,
    range
  ) {
    if (typeof ident === 'string') {
      try {
        new Function(`var ${ident}=_`);
      } catch (e) {
        warn(`invalid ${type} "${ident}" in expression: ${text.trim()}`, range);
      }
    }
  }

  function checkExpression (exp, text, warn, range) {
    try {
      new Function(`return ${exp}`);
    } catch (e) {
      const keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
      if (keywordMatch) {
        warn(
          `avoid using JavaScript keyword as property name: ` +
          `"${keywordMatch[0]}"\n  Raw expression: ${text.trim()}`,
          range
        );
      } else {
        warn(
          `invalid expression: ${e.message} in\n\n` +
          `    ${exp}\n\n` +
          `  Raw expression: ${text.trim()}\n`,
          range
        );
      }
    }
  }

  /*  */

  const range = 2;

  function generateCodeFrame (
    source,
    start = 0,
    end = source.length
  ) {
    const lines = source.split(/\r?\n/);
    let count = 0;
    const res = [];
    for (let i = 0; i < lines.length; i++) {
      count += lines[i].length + 1;
      if (count >= start) {
        for (let j = i - range; j <= i + range || end > count; j++) {
          if (j < 0 || j >= lines.length) continue
          res.push(`${j + 1}${repeat(` `, 3 - String(j + 1).length)}|  ${lines[j]}`);
          const lineLength = lines[j].length;
          if (j === i) {
            // push underline
            const pad = start - (count - lineLength) + 1;
            const length = end > count ? lineLength - pad : end - start;
            res.push(`   |  ` + repeat(` `, pad) + repeat(`^`, length));
          } else if (j > i) {
            if (end > count) {
              const length = Math.min(end - count, lineLength);
              res.push(`   |  ` + repeat(`^`, length));
            }
            count += lineLength + 1;
          }
        }
        break
      }
    }
    return res.join('\n')
  }

  function repeat (str, n) {
    let result = '';
    if (n > 0) {
      while (true) { // eslint-disable-line
        if (n & 1) result += str;
        n >>>= 1;
        if (n <= 0) break
        str += str;
      }
    }
    return result
  }

  /*  */



  function createFunction (code, errors) {
    try {
      return new Function(code)
    } catch (err) {
      errors.push({ err, code });
      return noop
    }
  }

  function createCompileToFunctionFn (compile) {
    const cache = Object.create(null);

    return function compileToFunctions (
      template,
      options,
      vm
    ) {
      options = extend({}, options);
      const warn$$1 = options.warn || warn;
      delete options.warn;

      /* istanbul ignore if */
      {
        // detect possible CSP restriction
        try {
          new Function('return 1');
        } catch (e) {
          if (e.toString().match(/unsafe-eval|CSP/)) {
            warn$$1(
              'It seems you are using the standalone build of Vue.js in an ' +
              'environment with Content Security Policy that prohibits unsafe-eval. ' +
              'The template compiler cannot work in this environment. Consider ' +
              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
              'templates into render functions.'
            );
          }
        }
      }

      // check cache
      const key = options.delimiters
        ? String(options.delimiters) + template
        : template;
      if (cache[key]) {
        return cache[key]
      }

      // compile
      const compiled = compile(template, options);

      // check compilation errors/tips
      {
        if (compiled.errors && compiled.errors.length) {
          if (options.outputSourceRange) {
            compiled.errors.forEach(e => {
              warn$$1(
                `Error compiling template:\n\n${e.msg}\n\n` +
                generateCodeFrame(template, e.start, e.end),
                vm
              );
            });
          } else {
            warn$$1(
              `Error compiling template:\n\n${template}\n\n` +
              compiled.errors.map(e => `- ${e}`).join('\n') + '\n',
              vm
            );
          }
        }
        if (compiled.tips && compiled.tips.length) {
          if (options.outputSourceRange) {
            compiled.tips.forEach(e => tip(e.msg, vm));
          } else {
            compiled.tips.forEach(msg => tip(msg, vm));
          }
        }
      }

      // turn code into functions
      const res = {};
      const fnGenErrors = [];
      res.render = createFunction(compiled.render, fnGenErrors);
      res.staticRenderFns = compiled.staticRenderFns.map(code => {
        return createFunction(code, fnGenErrors)
      });

      // check function generation errors.
      // this should only happen if there is a bug in the compiler itself.
      // mostly for codegen development use
      /* istanbul ignore if */
      {
        if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
          warn$$1(
            `Failed to generate render function:\n\n` +
            fnGenErrors.map(({ err, code }) => `${err.toString()} in\n\n${code}\n`).join('\n'),
            vm
          );
        }
      }

      return (cache[key] = res)
    }
  }

  /*  */

  function createCompilerCreator (baseCompile) {
    return function createCompiler (baseOptions) {
      function compile (
        template,
        options
      ) {
        const finalOptions = Object.create(baseOptions);
        const errors = [];
        const tips = [];

        let warn = (msg, range, tip) => {
          (tip ? tips : errors).push(msg);
        };

        if (options) {
          if (options.outputSourceRange) {
            // $flow-disable-line
            const leadingSpaceLength = template.match(/^\s*/)[0].length;

            warn = (msg, range, tip) => {
              const data = { msg };
              if (range) {
                if (range.start != null) {
                  data.start = range.start + leadingSpaceLength;
                }
                if (range.end != null) {
                  data.end = range.end + leadingSpaceLength;
                }
              }
              (tip ? tips : errors).push(data);
            };
          }
          // merge custom modules
          if (options.modules) {
            finalOptions.modules =
              (baseOptions.modules || []).concat(options.modules);
          }
          // merge custom directives
          if (options.directives) {
            finalOptions.directives = extend(
              Object.create(baseOptions.directives || null),
              options.directives
            );
          }
          // copy other options
          for (const key in options) {
            if (key !== 'modules' && key !== 'directives') {
              finalOptions[key] = options[key];
            }
          }
        }

        finalOptions.warn = warn;

        const compiled = baseCompile(template.trim(), finalOptions);
        {
          detectErrors(compiled.ast, warn);
        }
        compiled.errors = errors;
        compiled.tips = tips;
        return compiled
      }

      return {
        compile,
        compileToFunctions: createCompileToFunctionFn(compile)
      }
    }
  }

  /*  */

  // `createCompilerCreator` allows creating compilers that use alternative
  // parser/optimizer/codegen, e.g the SSR optimizing compiler.
  // Here we just export a default compiler using the default parts.
  const createCompiler = createCompilerCreator(function baseCompile (
    template,
    options
  ) {
    const ast = parse(template.trim(), options);
    if (options.optimize !== false) {
      optimize(ast, options);
    }
    const code = generate(ast, options);
    return {
      ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  });

  /*  */

  const { compile, compileToFunctions } = createCompiler(baseOptions);

  /*  */

  // check whether current browser encodes a char inside attribute values
  let div;
  function getShouldDecode (href) {
    div = div || document.createElement('div');
    div.innerHTML = href ? `<a href="\n"/>` : `<div a="\n"/>`;
    return div.innerHTML.indexOf('&#10;') > 0
  }

  // #3663: IE encodes newlines inside attribute values while other browsers don't
  const shouldDecodeNewlines = inBrowser ? getShouldDecode(false) : false;
  // #6828: chrome encodes content in a[href]
  const shouldDecodeNewlinesForHref = inBrowser ? getShouldDecode(true) : false;

  /*  */

  const idToTemplate = cached(id => {
    const el = query(id);
    return el && el.innerHTML
  });

  const mount = Vue.prototype.$mount;
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && query(el);

    /* istanbul ignore if */
    if (el === document.body || el === document.documentElement) {
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      );
      return this
    }

    const options = this.$options;
    // resolve template/el and convert to render function
    if (!options.render) {
      let template = options.template;
      if (template) {
        if (typeof template === 'string') {
          if (template.charAt(0) === '#') {
            template = idToTemplate(template);
            /* istanbul ignore if */
            if (!template) {
              warn(
                `Template element not found or is empty: ${options.template}`,
                this
              );
            }
          }
        } else if (template.nodeType) {
          template = template.innerHTML;
        } else {
          {
            warn('invalid template option:' + template, this);
          }
          return this
        }
      } else if (el) {
        template = getOuterHTML(el);
      }
      if (template) {
        /* istanbul ignore if */
        if (config.performance && mark) {
          mark('compile');
        }

        const { render, staticRenderFns } = compileToFunctions(template, {
          outputSourceRange: "development" !== 'production',
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        }, this);
        options.render = render;
        options.staticRenderFns = staticRenderFns;

        /* istanbul ignore if */
        if (config.performance && mark) {
          mark('compile end');
          measure(`vue ${this._name} compile`, 'compile', 'compile end');
        }
      }
    }
    return mount.call(this, el, hydrating)
  };

  /**
   * Get outerHTML of elements, taking care
   * of SVG elements in IE as well.
   */
  function getOuterHTML (el) {
    if (el.outerHTML) {
      return el.outerHTML
    } else {
      const container = document.createElement('div');
      container.appendChild(el.cloneNode(true));
      return container.innerHTML
    }
  }

  Vue.compile = compileToFunctions;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var urlJoin = createCommonjsModule(function (module) {
  (function (name, context, definition) {
    if ( module.exports) module.exports = definition();
    else context[name] = definition();
  })('urljoin', commonjsGlobal, function () {

    function normalize (strArray, options) {
      var resultArray = [];
      
      // If the first part is a plain protocol, we combine it with the next part.
      if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
        var first = strArray.shift();
        strArray[0] = first + strArray[0];
      }

      // There must be two or three slashes in the file protocol, two slashes in anything else.
      if (strArray[0].match(/^file:\/\/\//)) {
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
      } else {
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
      }
      
      for (var i = 0; i < strArray.length; i++) {
        
        var component = strArray[i];

        if (typeof component !== 'string') {
          component = component && component.toString() || '';
        }

        if (i > 0) {
          // Removing the starting slashes for each component but the first.
          component = component.replace(/^[\/]+/, '');
        }
        if (i < strArray.length - 1) {
          // Removing the ending slashes for each component but the last.
          component = component.replace(/[\/]+$/, '');
        } else {
          // For the last component we will combine multiple slashes to a single one.
          component = component.replace(/[\/]+$/, '/');
        }
        
        resultArray.push(component);
        
      }

      var str = resultArray.join('/');
      // Each input component is now separated by a single slash except the possible first plain protocol part.

      // remove trailing slash before parameters or hash
      str = str.replace(/\/(\?|&|#[^!])/g, '$1');

      // replace ? in parameters with &
      var parts = str.split('?');
      str = parts.shift() + (parts.length > 0 ? '?': '') + parts.join('&');

      return str;
    }

    return function () {
      var input = arguments;

      if (typeof arguments[0] === 'object') {
        // new syntax with array and options
        input = arguments[0];
      }
      
      return normalize([].slice.call(input));
    };

  });
  });

  /**
   * The code was extracted from:
   * https://github.com/davidchambers/Base64.js
   */

  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  function InvalidCharacterError(message) {
    this.message = message;
  }

  InvalidCharacterError.prototype = new Error();
  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

  function polyfill (input) {
    var str = String(input).replace(/=+$/, '');
    if (str.length % 4 == 1) {
      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
    }
    for (
      // initialize result and counters
      var bc = 0, bs, buffer, idx = 0, output = '';
      // get next character
      buffer = str.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
    }
    return output;
  }


  var atob = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;

  function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
      var code = p.charCodeAt(0).toString(16).toUpperCase();
      if (code.length < 2) {
        code = '0' + code;
      }
      return '%' + code;
    }));
  }

  var base64_url_decode = function(str) {
    var output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw "Illegal base64url string!";
    }

    try{
      return b64DecodeUnicode(output);
    } catch (err) {
      return atob(output);
    }
  };

  function InvalidTokenError(message) {
    this.message = message;
  }

  InvalidTokenError.prototype = new Error();
  InvalidTokenError.prototype.name = 'InvalidTokenError';

  var lib = function (token,options) {
    if (typeof token !== 'string') {
      throw new InvalidTokenError('Invalid token specified');
    }

    options = options || {};
    var pos = options.header === true ? 0 : 1;
    try {
      return JSON.parse(base64_url_decode(token.split('.')[pos]));
    } catch (e) {
      throw new InvalidTokenError('Invalid token specified: ' + e.message);
    }
  };

  var InvalidTokenError_1 = InvalidTokenError;
  lib.InvalidTokenError = InvalidTokenError_1;

  //---------------------------------------------//
  //               App constants                 //
  //---------------------------------------------//
  const siteTitle = "Char Admin";
  const url = "http://localhost:3000/api";

  //---------------------------------------------//
  //                  Utils                      //
  //---------------------------------------------//
  /**
   * Generate `request` object to be passed to `fetch` that is populated with all
   * the necessary headers. Also automatically stringify payload body.
   */
  function generateRequest(path, method="GET", payload=null, contentType="application/json"){
  	const finalURL = urlJoin(url, path);
  	const token = store.get("access_token");

  	const header = {};
  	header["Content-Type"] = contentType;
  	if(path !== "token/generate_new_token"){
  		header["Authorization"] = `Bearer ${token}`;
  	}

  	let body;
  	if(payload !== null){
  		if(contentType === "application/json"){
  			body = JSON.stringify(payload);
  		}else{
  			body = payload;
  		}
  	}

  	const request = new Request(finalURL, {
  		method: method,
  		body: body,
  		headers: new Headers(header)
  	});

  	return request;
  }

  /**
   * Returns true if access_token exist and has not expired
   */
  function appTokenValid(){
  	const token = store.get("access_token");
  	if(token){
  		const tokenContent = lib(token);
  		if(tokenContent.exp > Math.floor(Date.now()/1000)){
  			return true;
  		}
  	}

  	return false;
  }

  /**
   * Utility function to send fetch request and deal with errors.
   * `responseHandler` callback should return promise resolution
   */
  function sendRequest(request, responseHandler){
  	let requestSuccess;
  	return fetch(request).then((res) => {
  		if(res.status >= 200 && res.status < 300){
  			requestSuccess = true;
  		}else if(res.status >= 400){
  			requestSuccess = false;
  		}else{
  			// PANIC
  			throw new Error(request);
  		}
  		return res.json();
  	}).then((response) => {
  		return responseHandler(requestSuccess, response);
  	});
  }

  var vuex = createCommonjsModule(function (module, exports) {
  /**
   * vuex v3.0.1
   * (c) 2017 Evan You
   * @license MIT
   */
  (function (global, factory) {
  	 module.exports = factory() ;
  }(commonjsGlobal, (function () {
  var applyMixin = function (Vue) {
    var version = Number(Vue.version.split('.')[0]);

    if (version >= 2) {
      Vue.mixin({ beforeCreate: vuexInit });
    } else {
      // override init and inject vuex init procedure
      // for 1.x backwards compatibility.
      var _init = Vue.prototype._init;
      Vue.prototype._init = function (options) {
        if ( options === void 0 ) options = {};

        options.init = options.init
          ? [vuexInit].concat(options.init)
          : vuexInit;
        _init.call(this, options);
      };
    }

    /**
     * Vuex init hook, injected into each instances init hooks list.
     */

    function vuexInit () {
      var options = this.$options;
      // store injection
      if (options.store) {
        this.$store = typeof options.store === 'function'
          ? options.store()
          : options.store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }
    }
  };

  var devtoolHook =
    typeof window !== 'undefined' &&
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  function devtoolPlugin (store) {
    if (!devtoolHook) { return }

    store._devtoolHook = devtoolHook;

    devtoolHook.emit('vuex:init', store);

    devtoolHook.on('vuex:travel-to-state', function (targetState) {
      store.replaceState(targetState);
    });

    store.subscribe(function (mutation, state) {
      devtoolHook.emit('vuex:mutation', mutation, state);
    });
  }

  /**
   * Get the first item that pass the test
   * by second argument function
   *
   * @param {Array} list
   * @param {Function} f
   * @return {*}
   */
  /**
   * Deep copy the given object considering circular structure.
   * This function caches all nested objects and its copies.
   * If it detects circular structure, use cached copy to avoid infinite loop.
   *
   * @param {*} obj
   * @param {Array<Object>} cache
   * @return {*}
   */


  /**
   * forEach for object
   */
  function forEachValue (obj, fn) {
    Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
  }

  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  function isPromise (val) {
    return val && typeof val.then === 'function'
  }

  function assert (condition, msg) {
    if (!condition) { throw new Error(("[vuex] " + msg)) }
  }

  var Module = function Module (rawModule, runtime) {
    this.runtime = runtime;
    this._children = Object.create(null);
    this._rawModule = rawModule;
    var rawState = rawModule.state;
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
  };

  var prototypeAccessors$1 = { namespaced: { configurable: true } };

  prototypeAccessors$1.namespaced.get = function () {
    return !!this._rawModule.namespaced
  };

  Module.prototype.addChild = function addChild (key, module) {
    this._children[key] = module;
  };

  Module.prototype.removeChild = function removeChild (key) {
    delete this._children[key];
  };

  Module.prototype.getChild = function getChild (key) {
    return this._children[key]
  };

  Module.prototype.update = function update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };

  Module.prototype.forEachChild = function forEachChild (fn) {
    forEachValue(this._children, fn);
  };

  Module.prototype.forEachGetter = function forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };

  Module.prototype.forEachAction = function forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };

  Module.prototype.forEachMutation = function forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };

  Object.defineProperties( Module.prototype, prototypeAccessors$1 );

  var ModuleCollection = function ModuleCollection (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false);
  };

  ModuleCollection.prototype.get = function get (path) {
    return path.reduce(function (module, key) {
      return module.getChild(key)
    }, this.root)
  };

  ModuleCollection.prototype.getNamespace = function getNamespace (path) {
    var module = this.root;
    return path.reduce(function (namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  };

  ModuleCollection.prototype.update = function update$1 (rawRootModule) {
    update([], this.root, rawRootModule);
  };

  ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
      var this$1 = this;
      if ( runtime === void 0 ) runtime = true;

    {
      assertRawModule(path, rawModule);
    }

    var newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, function (rawChildModule, key) {
        this$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };

  ModuleCollection.prototype.unregister = function unregister (path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    if (!parent.getChild(key).runtime) { return }

    parent.removeChild(key);
  };

  function update (path, targetModule, newModule) {
    {
      assertRawModule(path, newModule);
    }

    // update target module
    targetModule.update(newModule);

    // update nested modules
    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          {
            console.warn(
              "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
              'manual reload is needed'
            );
          }
          return
        }
        update(
          path.concat(key),
          targetModule.getChild(key),
          newModule.modules[key]
        );
      }
    }
  }

  var functionAssert = {
    assert: function (value) { return typeof value === 'function'; },
    expected: 'function'
  };

  var objectAssert = {
    assert: function (value) { return typeof value === 'function' ||
      (typeof value === 'object' && typeof value.handler === 'function'); },
    expected: 'function or object with "handler" function'
  };

  var assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
  };

  function assertRawModule (path, rawModule) {
    Object.keys(assertTypes).forEach(function (key) {
      if (!rawModule[key]) { return }

      var assertOptions = assertTypes[key];

      forEachValue(rawModule[key], function (value, type) {
        assert(
          assertOptions.assert(value),
          makeAssertionMessage(path, key, type, value, assertOptions.expected)
        );
      });
    });
  }

  function makeAssertionMessage (path, key, type, value, expected) {
    var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
    if (path.length > 0) {
      buf += " in module \"" + (path.join('.')) + "\"";
    }
    buf += " is " + (JSON.stringify(value)) + ".";
    return buf
  }

  var Vue; // bind on install

  var Store = function Store (options) {
    var this$1 = this;
    if ( options === void 0 ) options = {};

    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue);
    }

    {
      assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
      assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
      assert(this instanceof Store, "Store must be called with the new operator.");
    }

    var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
    var strict = options.strict; if ( strict === void 0 ) strict = false;

    var state = options.state; if ( state === void 0 ) state = {};
    if (typeof state === 'function') {
      state = state() || {};
    }

    // store internal state
    this._committing = false;
    this._actions = Object.create(null);
    this._actionSubscribers = [];
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = Object.create(null);
    this._subscribers = [];
    this._watcherVM = new Vue();

    // bind commit and dispatch to self
    var store = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    };
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    };

    // strict mode
    this.strict = strict;

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root);

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreVM(this, state);

    // apply plugins
    plugins.forEach(function (plugin) { return plugin(this$1); });

    if (Vue.config.devtools) {
      devtoolPlugin(this);
    }
  };

  var prototypeAccessors = { state: { configurable: true } };

  prototypeAccessors.state.get = function () {
    return this._vm._data.$$state
  };

  prototypeAccessors.state.set = function (v) {
    {
      assert(false, "Use store.replaceState() to explicit replace store state.");
    }
  };

  Store.prototype.commit = function commit (_type, _payload, _options) {
      var this$1 = this;

    // check object-style commit
    var ref = unifyObjectStyle(_type, _payload, _options);
      var type = ref.type;
      var payload = ref.payload;
      var options = ref.options;

    var mutation = { type: type, payload: payload };
    var entry = this._mutations[type];
    if (!entry) {
      {
        console.error(("[vuex] unknown mutation type: " + type));
      }
      return
    }
    this._withCommit(function () {
      entry.forEach(function commitIterator (handler) {
        handler(payload);
      });
    });
    this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

    if (
      
      options && options.silent
    ) {
      console.warn(
        "[vuex] mutation type: " + type + ". Silent option has been removed. " +
        'Use the filter functionality in the vue-devtools'
      );
    }
  };

  Store.prototype.dispatch = function dispatch (_type, _payload) {
      var this$1 = this;

    // check object-style dispatch
    var ref = unifyObjectStyle(_type, _payload);
      var type = ref.type;
      var payload = ref.payload;

    var action = { type: type, payload: payload };
    var entry = this._actions[type];
    if (!entry) {
      {
        console.error(("[vuex] unknown action type: " + type));
      }
      return
    }

    this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

    return entry.length > 1
      ? Promise.all(entry.map(function (handler) { return handler(payload); }))
      : entry[0](payload)
  };

  Store.prototype.subscribe = function subscribe (fn) {
    return genericSubscribe(fn, this._subscribers)
  };

  Store.prototype.subscribeAction = function subscribeAction (fn) {
    return genericSubscribe(fn, this._actionSubscribers)
  };

  Store.prototype.watch = function watch (getter, cb, options) {
      var this$1 = this;

    {
      assert(typeof getter === 'function', "store.watch only accepts a function.");
    }
    return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
  };

  Store.prototype.replaceState = function replaceState (state) {
      var this$1 = this;

    this._withCommit(function () {
      this$1._vm._data.$$state = state;
    });
  };

  Store.prototype.registerModule = function registerModule (path, rawModule, options) {
      if ( options === void 0 ) options = {};

    if (typeof path === 'string') { path = [path]; }

    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
      assert(path.length > 0, 'cannot register the root module by using registerModule.');
    }

    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path), options.preserveState);
    // reset store to update getters...
    resetStoreVM(this, this.state);
  };

  Store.prototype.unregisterModule = function unregisterModule (path) {
      var this$1 = this;

    if (typeof path === 'string') { path = [path]; }

    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }

    this._modules.unregister(path);
    this._withCommit(function () {
      var parentState = getNestedState(this$1.state, path.slice(0, -1));
      Vue.delete(parentState, path[path.length - 1]);
    });
    resetStore(this);
  };

  Store.prototype.hotUpdate = function hotUpdate (newOptions) {
    this._modules.update(newOptions);
    resetStore(this, true);
  };

  Store.prototype._withCommit = function _withCommit (fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };

  Object.defineProperties( Store.prototype, prototypeAccessors );

  function genericSubscribe (fn, subs) {
    if (subs.indexOf(fn) < 0) {
      subs.push(fn);
    }
    return function () {
      var i = subs.indexOf(fn);
      if (i > -1) {
        subs.splice(i, 1);
      }
    }
  }

  function resetStore (store, hot) {
    store._actions = Object.create(null);
    store._mutations = Object.create(null);
    store._wrappedGetters = Object.create(null);
    store._modulesNamespaceMap = Object.create(null);
    var state = store.state;
    // init all modules
    installModule(store, state, [], store._modules.root, true);
    // reset vm
    resetStoreVM(store, state, hot);
  }

  function resetStoreVM (store, state, hot) {
    var oldVm = store._vm;

    // bind store public getters
    store.getters = {};
    var wrappedGetters = store._wrappedGetters;
    var computed = {};
    forEachValue(wrappedGetters, function (fn, key) {
      // use computed to leverage its lazy-caching mechanism
      computed[key] = function () { return fn(store); };
      Object.defineProperty(store.getters, key, {
        get: function () { return store._vm[key]; },
        enumerable: true // for local getters
      });
    });

    // use a Vue instance to store the state tree
    // suppress warnings just in case the user has added
    // some funky global mixins
    var silent = Vue.config.silent;
    Vue.config.silent = true;
    store._vm = new Vue({
      data: {
        $$state: state
      },
      computed: computed
    });
    Vue.config.silent = silent;

    // enable strict mode for new vm
    if (store.strict) {
      enableStrictMode(store);
    }

    if (oldVm) {
      if (hot) {
        // dispatch changes in all subscribed watchers
        // to force getter re-evaluation for hot reloading.
        store._withCommit(function () {
          oldVm._data.$$state = null;
        });
      }
      Vue.nextTick(function () { return oldVm.$destroy(); });
    }
  }

  function installModule (store, rootState, path, module, hot) {
    var isRoot = !path.length;
    var namespace = store._modules.getNamespace(path);

    // register in namespace map
    if (module.namespaced) {
      store._modulesNamespaceMap[namespace] = module;
    }

    // set state
    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];
      store._withCommit(function () {
        Vue.set(parentState, moduleName, module.state);
      });
    }

    var local = module.context = makeLocalContext(store, namespace, path);

    module.forEachMutation(function (mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store, namespacedType, mutation, local);
    });

    module.forEachAction(function (action, key) {
      var type = action.root ? key : namespace + key;
      var handler = action.handler || action;
      registerAction(store, type, handler, local);
    });

    module.forEachGetter(function (getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store, namespacedType, getter, local);
    });

    module.forEachChild(function (child, key) {
      installModule(store, rootState, path.concat(key), child, hot);
    });
  }

  /**
   * make localized dispatch, commit, getters and state
   * if there is no namespace, just use root ones
   */
  function makeLocalContext (store, namespace, path) {
    var noNamespace = namespace === '';

    var local = {
      dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;
          if ( !store._actions[type]) {
            console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
            return
          }
        }

        return store.dispatch(type, payload)
      },

      commit: noNamespace ? store.commit : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;
          if ( !store._mutations[type]) {
            console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
            return
          }
        }

        store.commit(type, payload, options);
      }
    };

    // getters and state object must be gotten lazily
    // because they will be changed by vm update
    Object.defineProperties(local, {
      getters: {
        get: noNamespace
          ? function () { return store.getters; }
          : function () { return makeLocalGetters(store, namespace); }
      },
      state: {
        get: function () { return getNestedState(store.state, path); }
      }
    });

    return local
  }

  function makeLocalGetters (store, namespace) {
    var gettersProxy = {};

    var splitPos = namespace.length;
    Object.keys(store.getters).forEach(function (type) {
      // skip if the target getter is not match this namespace
      if (type.slice(0, splitPos) !== namespace) { return }

      // extract local getter type
      var localType = type.slice(splitPos);

      // Add a port to the getters proxy.
      // Define as getter property because
      // we do not want to evaluate the getters in this time.
      Object.defineProperty(gettersProxy, localType, {
        get: function () { return store.getters[type]; },
        enumerable: true
      });
    });

    return gettersProxy
  }

  function registerMutation (store, type, handler, local) {
    var entry = store._mutations[type] || (store._mutations[type] = []);
    entry.push(function wrappedMutationHandler (payload) {
      handler.call(store, local.state, payload);
    });
  }

  function registerAction (store, type, handler, local) {
    var entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler (payload, cb) {
      var res = handler.call(store, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store.getters,
        rootState: store.state
      }, payload, cb);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store._devtoolHook) {
        return res.catch(function (err) {
          store._devtoolHook.emit('vuex:error', err);
          throw err
        })
      } else {
        return res
      }
    });
  }

  function registerGetter (store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
      {
        console.error(("[vuex] duplicate getter key: " + type));
      }
      return
    }
    store._wrappedGetters[type] = function wrappedGetter (store) {
      return rawGetter(
        local.state, // local state
        local.getters, // local getters
        store.state, // root state
        store.getters // root getters
      )
    };
  }

  function enableStrictMode (store) {
    store._vm.$watch(function () { return this._data.$$state }, function () {
      {
        assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
      }
    }, { deep: true, sync: true });
  }

  function getNestedState (state, path) {
    return path.length
      ? path.reduce(function (state, key) { return state[key]; }, state)
      : state
  }

  function unifyObjectStyle (type, payload, options) {
    if (isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }

    {
      assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
    }

    return { type: type, payload: payload, options: options }
  }

  function install (_Vue) {
    if (Vue && _Vue === Vue) {
      {
        console.error(
          '[vuex] already installed. Vue.use(Vuex) should be called only once.'
        );
      }
      return
    }
    Vue = _Vue;
    applyMixin(Vue);
  }

  var mapState = normalizeNamespace(function (namespace, states) {
    var res = {};
    normalizeMap(states).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val;

      res[key] = function mappedState () {
        var state = this.$store.state;
        var getters = this.$store.getters;
        if (namespace) {
          var module = getModuleByNamespace(this.$store, 'mapState', namespace);
          if (!module) {
            return
          }
          state = module.context.state;
          getters = module.context.getters;
        }
        return typeof val === 'function'
          ? val.call(this, state, getters)
          : state[val]
      };
      // mark vuex getter for devtools
      res[key].vuex = true;
    });
    return res
  });

  var mapMutations = normalizeNamespace(function (namespace, mutations) {
    var res = {};
    normalizeMap(mutations).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val;

      res[key] = function mappedMutation () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var commit = this.$store.commit;
        if (namespace) {
          var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
          if (!module) {
            return
          }
          commit = module.context.commit;
        }
        return typeof val === 'function'
          ? val.apply(this, [commit].concat(args))
          : commit.apply(this.$store, [val].concat(args))
      };
    });
    return res
  });

  var mapGetters = normalizeNamespace(function (namespace, getters) {
    var res = {};
    normalizeMap(getters).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val;

      val = namespace + val;
      res[key] = function mappedGetter () {
        if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
          return
        }
        if ( !(val in this.$store.getters)) {
          console.error(("[vuex] unknown getter: " + val));
          return
        }
        return this.$store.getters[val]
      };
      // mark vuex getter for devtools
      res[key].vuex = true;
    });
    return res
  });

  var mapActions = normalizeNamespace(function (namespace, actions) {
    var res = {};
    normalizeMap(actions).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val;

      res[key] = function mappedAction () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var dispatch = this.$store.dispatch;
        if (namespace) {
          var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
          if (!module) {
            return
          }
          dispatch = module.context.dispatch;
        }
        return typeof val === 'function'
          ? val.apply(this, [dispatch].concat(args))
          : dispatch.apply(this.$store, [val].concat(args))
      };
    });
    return res
  });

  var createNamespacedHelpers = function (namespace) { return ({
    mapState: mapState.bind(null, namespace),
    mapGetters: mapGetters.bind(null, namespace),
    mapMutations: mapMutations.bind(null, namespace),
    mapActions: mapActions.bind(null, namespace)
  }); };

  function normalizeMap (map) {
    return Array.isArray(map)
      ? map.map(function (key) { return ({ key: key, val: key }); })
      : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
  }

  function normalizeNamespace (fn) {
    return function (namespace, map) {
      if (typeof namespace !== 'string') {
        map = namespace;
        namespace = '';
      } else if (namespace.charAt(namespace.length - 1) !== '/') {
        namespace += '/';
      }
      return fn(namespace, map)
    }
  }

  function getModuleByNamespace (store, helper, namespace) {
    var module = store._modulesNamespaceMap[namespace];
    if ( !module) {
      console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
    }
    return module
  }

  var index = {
    Store: Store,
    install: install,
    version: '3.0.1',
    mapState: mapState,
    mapMutations: mapMutations,
    mapGetters: mapGetters,
    mapActions: mapActions,
    createNamespacedHelpers: createNamespacedHelpers
  };

  return index;

  })));
  });

  Vue.use(vuex);

  /**
   * Vuex store initialization
   */
  var appStore = new vuex.Store({
  	/**
  	 * Vuex store states initialization.
  	 */
  	state: {
  		toastMessage: "",

  		loggedIn: false,
  		loggedInUser: "",
  		schemas: [],
  		usersList: [],

  		currentContentView: "app-dashboard",
  		currentCollection: [],
  		currentCollectionSchema: {},
  		currentModel: {},
  		currentViewUser: {}
  	},
  	/**
  	 * Vuex store mutations. Used to modify Vuex store states.
  	 */
  	mutations: {
  		setToastMessage: function(state, message){
  			if(message === state.toastMessage && message.trim() !== ""){
  				state.toastMessage = "";
  				_.defer(() => {
  					state.toastMessage = message;
  				});
  			}else{
  				state.toastMessage = message;
  			}
  		},
  		updateSchemas: function(state, newSchemas){
  			state.schemas = newSchemas;
  		},
  		addNewEditSchema: function(state, schema){
  			const matchedSchemaIndex = _.findIndex(state.schemas, function(el){
  				return el.tableSlug == schema.tableSlug;
  			});
  			if(matchedSchemaIndex > -1){
  				state.schemas[matchedSchemaIndex] = schema;
  			}else{
  				state.schemas.push(schema);
  			}
  		},
  		removeSchema: function(state, tableSlug){
  			state.schemas = _.filter(state.schemas, function(el){
  				return el.tableSlug != tableSlug;
  			});
  		},
  		updateUsersList: function(state, newUsersList){
  			state.usersList = newUsersList;
  		},
  		setCurrentViewUser: function(state, currentViewUser){
  			state.currentViewUser = currentViewUser;
  		},
  		setContentView: function(state, view){
  			state.currentContentView = view;
  		},
  		setLoggedIn: function(state, loggedIn){
  			state.loggedIn = loggedIn;
  		},
  		setLoggedInUser: function(state, username){
  			state.loggedInUser = username;
  		},
  		setCurrentCollection: function(state, result){
  			state.currentCollection = result.collection;
  			this.commit("setCurrentCollectionSchema", result.tableSlug);
  		},
  		setCurrentCollectionSchema: function(state, tableSlug){
  			const selectedSchema = _.find(state.schemas, function(el){
  				return el.tableSlug == tableSlug;
  			});
  			state.currentCollectionSchema = selectedSchema;
  		},
  		setCurrentModel: function(state, result){
  			state.currentModel = result.model;
  			this.commit("setCurrentCollectionSchema", result.tableSlug);
  		},
  		removeModel: function(state, options){
  			const tableSlug = options.tableSlug;
  			const model = options.model;

  			if(!model){
  				throw Error("No valid model defined");
  			}

  			state.currentCollection = _.filter(state.currentCollection, function(el){
  				return el._uid != model._uid;
  			});
  		}
  	},
  	/**
  	 * Vuex store actions. Used make asynchronous calls to the server and
  	 * update the Vuex store by calling Vuex mutations.
  	 */
  	actions: {
  		fetchSchemas: function(context){
  			const token = store.get("access_token");
  			if(token && Math.floor(Date.now()/1000) < lib(token).exp){
  				const request = generateRequest("schema");
  				return sendRequest(request, (requestSuccess, schemas) => {
  					if(requestSuccess){
  						context.commit("updateSchemas", schemas);
  						context.commit("setLoggedIn", true);
  						context.commit("setLoggedInUser", lib(store.get("access_token")).username);
  						return Promise.resolve(schemas);
  					}else{
  						context.commit("setLoggedIn", false);
  						context.commit("updateSchemas", []);
  						context.commit("setLoggedInUser", "");
  						context.commit("setContentView", "login-page");
  					}
  				});
  			}
  		},
  		submitSchema: function(context, schema){
  			const request = generateRequest("schema", "POST", schema);
  			return sendRequest(request, (requestSuccess, schemas) => {
  				if(requestSuccess){
  					context.commit("setCurrentCollectionSchema", schema);
  					context.commit("addNewEditSchema", schema);
  					return Promise.resolve(schema);
  				}else{
  					return Promise.reject(schema);
  				}
  			});
  		},
  		deleteSchema: function(context, tableSlug){
  			const request = generateRequest(`schema/${tableSlug}`, "DELETE");
  			return sendRequest(request, (requestSuccess, schemas) => {
  				if(requestSuccess){
  					context.commit("removeSchema", tableSlug);
  					return Promise.resolve(schemas);
  				}else{
  					return Promise.reject(schema);
  				}
  			});
  		},
  		fetchUsersList: function(context){
  			const token = store.get("access_token");
  			if(token && Math.floor(Date.now()/1000) < lib(token).exp){
  				const request = generateRequest("users");
  				return sendRequest(request, (requestSuccess, users) => {
  					if(requestSuccess){
  						context.commit("updateUsersList", users);
  						return Promise.resolve(users);
  					}else{
  						return Promise.reject(users);
  					}
  				});
  			}
  		},
  		fetchInitialData: function(context){
  			return Promise.all([
  				context.dispatch("fetchSchemas"),
  				context.dispatch("fetchUsersList")
  			]);
  		},
  		fetchCollection: function(context, tableSlug){
  			const request = generateRequest(`collections/${tableSlug}`);
  			return sendRequest(request, (requestSuccess, collection) => {
  				if(requestSuccess){
  					context.commit("setCurrentCollection", {
  						collection,
  						tableSlug
  					});

  					return Promise.resolve(collection);
  				}else{
  					return Promise.reject(collection);
  				}
  			});
  		},
  		fetchModel: function(context, options){
  			const tableSlug = options.tableSlug;
  			const uid = options.uid;
  			const request = generateRequest(`collections/${tableSlug}/${uid}`);
  			return sendRequest(request, (requestSuccess, model) => {
  				if(requestSuccess){
  					context.commit("setCurrentModel", {
  						tableSlug,
  						model
  					});

  					return Promise.resolve(model);
  				}else{
  					return Promise.reject(model);
  				}
  			});
  		},
  		submitModel: function(context, options){
  			const model = options.model;
  			const tableSlug = options.tableSlug;
  			const uid = options.uid;

  			// Check if there's upload field
  			const files = _.reduce(model, (acc, el, key) => {
  				if(el.file) {
  					acc[key] = el.file;
  				}
  				return acc;
  			}, {});

  			if(_.size(files) > 0){
  				// There are at least one upload field
  				// Remove the binary file entry from the model
  				_.each(model, (el) => {
  					if(el.file){
  						delete el.file;
  					}
  				});

  				// Create the request for submitting the model
  				const request = generateRequest(`collections/${tableSlug}/${uid}`, "POST", model);
  				// Submit the model
  				return sendRequest(request, (requestSuccess, model) => {
  					if(requestSuccess){
  						return Promise.resolve(model);
  					}else{
  						return Promise.reject(model);
  					}
  				}).then((model) => {
  					// Model submission successful
  					const promises = [];

  					// Send individual images according to the link provided in the response
  					_.each(model, (el, key) => {
  						if(el.permalink){
  							const file = _.find(files, (f, k) => {
  								return k === key;
  							});

  							const req = generateRequest(
  								`upload/${model[key].uid}`,
  								"POST",
  								file,
  								file.type
  							);

  							promises.push(sendRequest(req, (success, res) => {
  								if(success) {
  									return Promise.resolve(res);
  								}else{
  									return Promise.reject(res);
  								}
  							}));
  						}
  					});

  					// All images successfully uploaded, resolve promise to model
  					return Promise.all(promises).then(() => {
  						return Promise.resolve(model);
  					});
  				});
  			}else{
  				// There are no upload fields
  				const request = generateRequest(`collections/${tableName}/${uid}`, "POST", model);

  				return sendRequest(request, (requestSuccess, model) => {
  					if(requestSuccess){
  						context.commit("setCurrentModel", {
  							tableName,
  							model
  						});
  						return Promise.resolve(model);
  					}else{
  						return Promise.reject(model);
  					}
  				});
  			}
  		},
  		deleteModel: function(context, options){
  			const tableSlug = options.tableSlug;
  			const uid = options.uid;
  			const request = generateRequest(`collections/${tableSlug}/${uid}`, "DELETE");

  			return sendRequest(request, (requestSuccess, model) => {
  				if(requestSuccess){
  					context.commit("removeModel", {
  						tableSlug,
  						model
  					});
  					return Promise.resolve(model);
  				}else{
  					return Promise.reject(model);
  				}
  			});
  		},

  		fetchUser: function(context, username){
  			const request = generateRequest(`users/${username}`);
  			return sendRequest(request, (requestSuccess, response) => {
  				if(requestSuccess){
  					return Promise.resolve(response);
  				}else{
  					return Promise.reject(response);
  				}
  			});
  		},
  		deleteUser: function(context, username){
  			const request = generateRequest(`users/${username}`, "DELETE");
  			return sendRequest(request, (requestSuccess, response) => {
  				if(requestSuccess){
  					return Promise.resolve(response);
  				}else{
  					return Promise.reject(response);
  				}
  			});
  		},
  		submitUser: function(context, user){
  			if(user.role && !user.password){
  				const request = generateRequest(`users/${user.username}`, "POST", user);
  				return sendRequest(request, (requestSuccess, response) => {
  					if(requestSuccess){
  						return Promise.resolve(response);
  					}else{
  						return Promise.reject(response);
  					}
  				});
  			}else if(user.password && !user.role){
  				const request = generateRequest("users", "POST", user);
  				return sendRequest(request, (requestSuccess, response) => {
  					if(requestSuccess){
  						return Promise.resolve(response);
  					}else{
  						return Promise.reject(response);
  					}
  				});
  			}
  		},

  		/**
  		 * Login/Sign up related actions
  		 */
  		loginUser: function(context, loginDetails){
  			const request = generateRequest("tokens/generate_new_token", "POST", loginDetails);
  			return sendRequest(request, (requestSuccess, response) => {
  				if(requestSuccess){
  					store.set("access_token", response.access_token);
  					return context.dispatch("fetchInitialData");
  				}else{
  					return Promise.reject(response);
  				}
  			});
  		},
  		signupUser: function(context, signupDetails){
  			const request = generateRequest("signup", "POST", signupDetails);
  			return sendRequest(request, (requestSuccess, response) => {
  				if(requestSuccess){
  					return Promise.resolve(response);
  				}else{
  					return Promise.reject(response);
  				}
  			});
  		},
  		submitChangePassword: function(context, details){
  			const request = generateRequest("account/change_password", "POST", details);
  			return sendRequest(request, (requestSuccess, response) => {
  				if(requestSuccess){
  					return Promise.resolve(response);
  				}else{
  					return Promise.reject(response);
  				}
  			});
  		}
  	}
  });

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script = {
  	name: "AppSidebar",
  	props: {
  		"schemas": {
  			type: Array,
  			default: function(){
  				return [];
  			}
  		},
  		"loggedIn": {
  			type: Boolean,
  			default: false
  		}
  	},
  	methods: {
  		renderDashboard: function(e){
  			this.$emit("renderDashboard");
  		},
  		renderSchemasList: function(e){
  			this.$emit("renderSchemasList");
  		},
  		renderCollection: function(tableSlug){
  			this.$emit("renderCollection", tableSlug);
  		},
  		renderUsersList: function(){
  			this.$emit("renderUsersList");
  		},
  		renderSettings: function(){

  		}
  	}
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  /* script */
  const __vue_script__ = script;
  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _vm.loggedIn
      ? _c("section", { attrs: { id: "page-sidebar" } }, [
          _c("ul", { staticClass: "lists admin-list" }, [
            _c(
              "a",
              {
                attrs: { href: "/" },
                on: {
                  click: function($event) {
                    $event.preventDefault();
                    return _vm.renderDashboard($event)
                  }
                }
              },
              [_vm._m(0)]
            ),
            _vm._v(" "),
            _c(
              "a",
              {
                attrs: { href: "schemas" },
                on: {
                  click: function($event) {
                    $event.preventDefault();
                    return _vm.renderSchemasList($event)
                  }
                }
              },
              [_vm._m(1)]
            ),
            _vm._v(" "),
            _c(
              "a",
              {
                attrs: { href: "users" },
                on: {
                  click: function($event) {
                    $event.preventDefault();
                    return _vm.renderUsersList($event)
                  }
                }
              },
              [_vm._m(2)]
            ),
            _vm._v(" "),
            _c(
              "a",
              {
                attrs: { href: "settings" },
                on: {
                  click: function($event) {
                    $event.preventDefault();
                    return _vm.renderSettings($event)
                  }
                }
              },
              [_vm._m(3)]
            ),
            _vm._v(" "),
            _c("li", { staticClass: "spacer" })
          ]),
          _vm._v(" "),
          _c(
            "ul",
            { staticClass: "lists schema-list" },
            [
              _c("h4", { staticClass: "list-section-title" }, [
                _vm._v("Collections")
              ]),
              _vm._v(" "),
              _vm._l(_vm.schemas, function(schema) {
                return _c(
                  "a",
                  {
                    key: schema.tableSlug,
                    attrs: { href: schema.tableSlug },
                    on: {
                      click: function($event) {
                        $event.preventDefault();
                        return _vm.renderCollection(schema.tableSlug)
                      }
                    }
                  },
                  [
                    _c("li", [
                      _c("i", {
                        staticClass: "fa fa-file",
                        attrs: { "aria-hidden": "true" }
                      }),
                      _vm._v(_vm._s(schema.tableName))
                    ])
                  ]
                )
              })
            ],
            2
          )
        ])
      : _vm._e()
  };
  var __vue_staticRenderFns__ = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("li", [
        _c("i", {
          staticClass: "fa fa-tachometer",
          attrs: { "aria-hidden": "true" }
        }),
        _vm._v("Dashboard\n\t\t")
      ])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("li", [
        _c("i", { staticClass: "fa fa-table", attrs: { "aria-hidden": "true" } }),
        _vm._v("Schemas\n\t\t")
      ])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("li", [
        _c("i", { staticClass: "fa fa-users", attrs: { "aria-hidden": "true" } }),
        _vm._v("Users\n\t\t")
      ])
    },
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("li", [
        _c("i", { staticClass: "fa fa-cog", attrs: { "aria-hidden": "true" } }),
        _vm._v("Settings\n\t\t")
      ])
    }
  ];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = undefined;
    /* scoped */
    const __vue_scope_id__ = "data-v-3b486a0e";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Sidebar = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$1 = {
  	name: "AppHeader",
  	props: {
  		"siteTitle": {
  			type: String,
  			required: true
  		},
  		"loggedIn": {
  			type: Boolean,
  			default: false
  		}
  	},
  	methods: {
  		renderLogin: function(){
  			this.$emit("renderLogin");
  		},
  		logoutUser: function(){
  			this.$emit("logoutUser");
  			this.$emit("renderLogin");
  		},
  		renderAccount: function(){
  			this.$emit("renderAccount");
  		}
  	}
  };

  /* script */
  const __vue_script__$1 = script$1;
  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("header", { attrs: { id: "page-header" } }, [
      _c("span", { staticClass: "header-items left" }, [
        _vm._v(_vm._s(_vm.siteTitle))
      ]),
      _vm._v(" "),
      _c("span", { staticClass: "spacer" }),
      _vm._v(" "),
      _vm.loggedIn
        ? _c(
            "a",
            {
              attrs: { href: "/account" },
              on: {
                click: function($event) {
                  $event.preventDefault();
                  return _vm.renderAccount($event)
                }
              }
            },
            [
              _c("span", { staticClass: "header-items right" }, [
                _vm._v("Account")
              ])
            ]
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.loggedIn
        ? _c(
            "a",
            {
              attrs: { href: "/logout" },
              on: {
                click: function($event) {
                  $event.preventDefault();
                  return _vm.logoutUser($event)
                }
              }
            },
            [
              _c("span", { staticClass: "header-items right" }, [
                _vm._v("Logout")
              ])
            ]
          )
        : _c(
            "a",
            {
              attrs: { href: "/login" },
              on: {
                click: function($event) {
                  $event.preventDefault();
                  return _vm.renderLogin($event)
                }
              }
            },
            [_c("span", { staticClass: "header-items right" }, [_vm._v("Login")])]
          )
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = undefined;
    /* scoped */
    const __vue_scope_id__$1 = "data-v-04f9ad0c";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Header = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //

  var script$2 = {
  	name: "AppToast",
  	props: {
  		"toastMessage": {
  			type: String,
  			default: "This is a toast message!"
  		}
  	},
  	watch: {
  		toastMessage: function(message){
  			if(message.trim() !== ""){
  				popToast.call(this);
  			}
  		}
  	},
  	methods: {

  	}
  };

  let timerPersist, timerFade;
  function popToast(){
  	clearTimeout(timerPersist);
  	clearTimeout(timerFade);

  	this.$el.style.display = "block";
  	_.defer(() => {
  		this.$el.style.opacity = 1;
  	});

  	timerPersist = setTimeout(() => {

  		this.$el.style.opacity = 0;
  		timerFade = setTimeout(() => {
  			this.$el.style.display = "none";
  			this.$store.commit("setToastMessage", "");
  		}, 500);

  	}, 3000);
  }

  /* script */
  const __vue_script__$2 = script$2;
  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("section", { attrs: { id: "page-toast" } }, [
      _c("span", { attrs: { id: "toast-message" } }, [
        _vm._v(_vm._s(_vm.toastMessage))
      ])
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = "data-v-4d2725d2";
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Toast = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //

  var script$3 = {
  	name: "AppDashboard"
  };

  /* script */
  const __vue_script__$3 = script$3;
  /* template */
  var __vue_render__$3 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _vm._m(0)
  };
  var __vue_staticRenderFns__$3 = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("article", [_c("h1", [_vm._v("Welcome!")])])
    }
  ];
  __vue_render__$3._withStripped = true;

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = "data-v-cb5fcfca";
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Dashboard = normalizeComponent_1(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$4 = {
  	name: "LoginPage",
  	props: {
  	},
  	methods: {
  		loginUser: function(e){
  			var username = e.target.querySelector("#username").value;
  			var password = e.target.querySelector("#password").value;

  			this.$emit("loginUser", {
  				username: username,
  				password: password
  			});
  		},
  		renderSignup: function(){
  			this.$emit("renderSignup");
  		}
  	}
  };

  /* script */
  const __vue_script__$4 = script$4;
  /* template */
  var __vue_render__$4 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "login-container" } }, [
      _c("h1", [_vm._v("Login")]),
      _vm._v(" "),
      _c(
        "form",
        {
          on: {
            submit: function($event) {
              $event.preventDefault();
              return _vm.loginUser($event)
            }
          }
        },
        [
          _c("input", {
            attrs: {
              id: "username",
              type: "text",
              name: "username",
              placeholder: "Username",
              required: ""
            }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: {
              id: "password",
              type: "password",
              name: "password",
              placeholder: "Password",
              required: ""
            }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "submit", name: "submit", value: "Submit" }
          })
        ]
      ),
      _vm._v(" "),
      _c("hr"),
      _vm._v(" "),
      _c("p", { attrs: { id: "signup" } }, [
        _vm._v("\n\t\tDon't have an account? "),
        _c(
          "a",
          {
            attrs: { href: "/signup" },
            on: {
              click: function($event) {
                $event.preventDefault();
                return _vm.renderSignup($event)
              }
            }
          },
          [_vm._v("Sign Up")]
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$4 = [];
  __vue_render__$4._withStripped = true;

    /* style */
    const __vue_inject_styles__$4 = undefined;
    /* scoped */
    const __vue_scope_id__$4 = "data-v-d4a02f3a";
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var LoginPage = normalizeComponent_1(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$5 = {
  	name: "SignupPage",
  	methods: {
  		signupUser: function(e){
  			var username = e.target.querySelector("#username").value;
  			var password = e.target.querySelector("#password").value;
  			var confirmPassword = e.target.querySelector("#confirm-password").value;

  			if(password !== confirmPassword){
  				this.$el.querySelector("#message").innerHTML = "Passwords don't match";
  				return;
  			}else{
  				this.$el.querySelector("#message").innerHTML = "";
  			}

  			this.$emit("signupUser", {
  				username: username,
  				password: password
  			});
  		},
  		renderLogin: function(){
  			this.$emit("renderLogin");
  		}
  	}
  };

  /* script */
  const __vue_script__$5 = script$5;
  /* template */
  var __vue_render__$5 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "signup-container" } }, [
      _c("h1", [_vm._v("Sign Up")]),
      _vm._v(" "),
      _c("div", { attrs: { id: "message" } }),
      _vm._v(" "),
      _c(
        "form",
        {
          on: {
            submit: function($event) {
              $event.preventDefault();
              return _vm.signupUser($event)
            }
          }
        },
        [
          _c("input", {
            attrs: {
              id: "username",
              type: "text",
              name: "username",
              placeholder: "Username",
              required: ""
            }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: {
              id: "password",
              type: "password",
              name: "password",
              placeholder: "Password",
              required: ""
            }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: {
              id: "confirm-password",
              type: "password",
              name: "confirm-password",
              placeholder: "Confirm Password",
              required: ""
            }
          }),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "submit", name: "submit", value: "Submit" }
          })
        ]
      ),
      _vm._v(" "),
      _c("hr"),
      _vm._v(" "),
      _c("p", [
        _vm._v("Have an account? "),
        _c(
          "a",
          {
            attrs: { href: "/login" },
            on: {
              click: function($event) {
                $event.preventDefault();
                return _vm.renderLogin($event)
              }
            }
          },
          [_vm._v("Login")]
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$5 = [];
  __vue_render__$5._withStripped = true;

    /* style */
    const __vue_inject_styles__$5 = undefined;
    /* scoped */
    const __vue_scope_id__$5 = "data-v-fac4a3a6";
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var SignupPage = normalizeComponent_1(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$6 = {
  	name: "CollectionList",
  	props: {
  		"currentCollection": {
  			type: Array,
  			required: true
  		},
  		"currentCollectionSchema": {
  			type: Object,
  			required: true
  		}
  	},
  	methods: {
  		renderModel: function(tableSlug, uid){
  			this.$emit("renderModel", tableSlug, uid);
  		},
  		renderModelForm: function(tableSlug){
  			this.$emit("renderModelForm", tableSlug);
  		}
  	}
  };

  /* script */
  const __vue_script__$6 = script$6;
  /* template */
  var __vue_render__$6 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "collection-container" } }, [
      _c("h1", [_vm._v(_vm._s(_vm.currentCollectionSchema.tableName))]),
      _vm._v(" "),
      _c(
        "button",
        {
          attrs: { id: "new-button" },
          on: {
            click: function($event) {
              $event.preventDefault();
              return _vm.renderModelForm(_vm.currentCollectionSchema.tableSlug)
            }
          }
        },
        [_vm._v("New")]
      ),
      _vm._v(" "),
      _c(
        "ul",
        { attrs: { id: "collection-list" } },
        _vm._l(_vm.currentCollection, function(model) {
          return _c(
            "a",
            {
              key: model._uid,
              staticClass: "list-items",
              attrs: {
                href:
                  "collections/" +
                  _vm.currentCollectionSchema.tableSlug +
                  "/" +
                  model._uid
              },
              on: {
                click: function($event) {
                  $event.preventDefault();
                  return _vm.renderModel(
                    _vm.currentCollectionSchema.tableSlug,
                    model._uid
                  )
                }
              }
            },
            [_c("li", [_vm._v("\n\t\t\t\t" + _vm._s(model._uid) + "\n\t\t\t")])]
          )
        }),
        0
      )
    ])
  };
  var __vue_staticRenderFns__$6 = [];
  __vue_render__$6._withStripped = true;

    /* style */
    const __vue_inject_styles__$6 = undefined;
    /* scoped */
    const __vue_scope_id__$6 = "data-v-ef6371c8";
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var CollectionList = normalizeComponent_1(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //

  var script$7 = {
  	name: "SchemasListItem",
  	props: {
  		"schema": {
  			type: Object,
  			required: true
  		}
  	},
  	methods: {
  		renderSchemaForm: function(){
  			this.$emit("renderSchemaForm", this.schema.tableSlug);
  		},
  		deleteSchema: function(){
  			this.$emit("deleteSchema", this.schema.tableSlug);
  		}
  	}
  };

  /* script */
  const __vue_script__$7 = script$7;
  /* template */
  var __vue_render__$7 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "schema-container" }, [
      _c("span", { staticClass: "collection-name" }, [
        _vm._v(_vm._s(_vm.schema.tableName))
      ]),
      _vm._v(" "),
      _c(
        "button",
        {
          staticClass: "edit-button",
          on: {
            click: function($event) {
              $event.preventDefault();
              return _vm.renderSchemaForm($event)
            }
          }
        },
        [_vm._v("Edit")]
      ),
      _vm._v(" "),
      _c(
        "button",
        {
          staticClass: "delete-button",
          on: {
            click: function($event) {
              $event.preventDefault();
              return _vm.deleteSchema($event)
            }
          }
        },
        [_vm._v("Delete")]
      )
    ])
  };
  var __vue_staticRenderFns__$7 = [];
  __vue_render__$7._withStripped = true;

    /* style */
    const __vue_inject_styles__$7 = undefined;
    /* scoped */
    const __vue_scope_id__$7 = "data-v-16775951";
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var SchemaListItem = normalizeComponent_1(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      undefined,
      undefined
    );

  //

  var script$8 = {
  	name: "SchemasList",
  	components: {
  		"schemas-list-item": SchemaListItem
  	},
  	props: {
  		"schemas": {
  			type: Array,
  			required: true
  		}
  	},
  	methods: {
  		renderSchemaForm: function(tableSlug){
  			this.$emit("renderSchemaForm", tableSlug);
  		},
  		deleteSchema: function(tableSlug){
  			this.$emit("deleteSchema", tableSlug);
  		}
  	}
  };

  /* script */
  const __vue_script__$8 = script$8;
  /* template */
  var __vue_render__$8 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "article",
      { attrs: { id: "schema-list-container" } },
      [
        _c("h1", [_vm._v("Schemas")]),
        _vm._v(" "),
        _c(
          "button",
          {
            attrs: { id: "new-button" },
            on: {
              click: function($event) {
                $event.preventDefault();
                return _vm.renderSchemaForm($event)
              }
            }
          },
          [_vm._v("New")]
        ),
        _vm._v(" "),
        _vm._l(_vm.schemas, function(schema) {
          return _c("schemas-list-item", {
            key: schema.tableSlug,
            attrs: { schema: schema },
            on: {
              renderSchemaForm: _vm.renderSchemaForm,
              deleteSchema: _vm.deleteSchema
            }
          })
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$8 = [];
  __vue_render__$8._withStripped = true;

    /* style */
    const __vue_inject_styles__$8 = undefined;
    /* scoped */
    const __vue_scope_id__$8 = "data-v-35ce507c";
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var SchemasList = normalizeComponent_1(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$8,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      undefined,
      undefined
    );

  /**
   * Special language-specific overrides.
   *
   * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
   *
   * @type {Object}
   */
  var LANGUAGES = {
    tr: {
      regexp: /\u0130|\u0049|\u0049\u0307/g,
      map: {
        '\u0130': '\u0069',
        '\u0049': '\u0131',
        '\u0049\u0307': '\u0069'
      }
    },
    az: {
      regexp: /[\u0130]/g,
      map: {
        '\u0130': '\u0069',
        '\u0049': '\u0131',
        '\u0049\u0307': '\u0069'
      }
    },
    lt: {
      regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
      map: {
        '\u0049': '\u0069\u0307',
        '\u004A': '\u006A\u0307',
        '\u012E': '\u012F\u0307',
        '\u00CC': '\u0069\u0307\u0300',
        '\u00CD': '\u0069\u0307\u0301',
        '\u0128': '\u0069\u0307\u0303'
      }
    }
  };

  /**
   * Lowercase a string.
   *
   * @param  {String} str
   * @return {String}
   */
  var lowerCase = function (str, locale) {
    var lang = LANGUAGES[locale];

    str = str == null ? '' : String(str);

    if (lang) {
      str = str.replace(lang.regexp, function (m) { return lang.map[m] });
    }

    return str.toLowerCase()
  };

  var nonWordRegexp = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;

  var camelCaseRegexp = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;

  var camelCaseUpperRegexp = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;

  /**
   * Sentence case a string.
   *
   * @param  {string} str
   * @param  {string} locale
   * @param  {string} replacement
   * @return {string}
   */
  var noCase = function (str, locale, replacement) {
    if (str == null) {
      return ''
    }

    replacement = typeof replacement !== 'string' ? ' ' : replacement;

    function replace (match, index, value) {
      if (index === 0 || index === (value.length - match.length)) {
        return ''
      }

      return replacement
    }

    str = String(str)
      // Support camel case ("camelCase" -> "camel Case").
      .replace(camelCaseRegexp, '$1 $2')
      // Support odd camel case ("CAMELCase" -> "CAMEL Case").
      .replace(camelCaseUpperRegexp, '$1 $2')
      // Remove all non-word characters and replace with a single space.
      .replace(nonWordRegexp, replace);

    // Lower case the entire string.
    return lowerCase(str, locale)
  };

  /**
   * Snake case a string.
   *
   * @param  {string} value
   * @param  {string} [locale]
   * @return {string}
   */
  var snakeCase = function (value, locale) {
    return noCase(value, locale, '_')
  };

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$9 = {
  	name: "SchemasEditFieldMultiChoice",
  	props: {
  		"choice": {
  			type: Object,
  			default: () => {
  				return {
  					label: "",
  					value: ""
  				};
  			}
  		},
  		"index": {
  			type: Number,
  			default: 0
  		},
  		"showRemove": {
  			type: Boolean,
  			default: false
  		}
  	},
  	methods: {
  		removeChoice: function(){
  			this.$emit("removeChoice", this.index);
  		},
  		choiceChanged: function(){
  			this.$emit("choiceChanged", {
  				choice: this.choice,
  				index: this.index
  			});
  		}
  	}
  };

  /* script */
  const __vue_script__$9 = script$9;
  /* template */
  var __vue_render__$9 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "multi-choice" }, [
      _c("span", [_vm._v("Choice " + _vm._s(_vm.index) + ": ")]),
      _vm._v(" "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.choice.label,
            expression: "choice.label"
          }
        ],
        staticClass: "choice-label choice-input",
        attrs: { type: "text", placeholder: "Label", name: "choice-label" },
        domProps: { value: _vm.choice.label },
        on: {
          input: [
            function($event) {
              if ($event.target.composing) {
                return
              }
              _vm.$set(_vm.choice, "label", $event.target.value);
            },
            _vm.choiceChanged
          ]
        }
      }),
      _vm._v(" "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.choice.value,
            expression: "choice.value"
          }
        ],
        staticClass: "choice-value choice-input",
        attrs: { type: "text", placeholder: "Value", name: "choice-value" },
        domProps: { value: _vm.choice.value },
        on: {
          input: [
            function($event) {
              if ($event.target.composing) {
                return
              }
              _vm.$set(_vm.choice, "value", $event.target.value);
            },
            _vm.choiceChanged
          ]
        }
      }),
      _vm._v(" "),
      _vm.showRemove
        ? _c(
            "button",
            {
              on: {
                click: function($event) {
                  $event.preventDefault();
                  return _vm.removeChoice($event)
                }
              }
            },
            [_vm._v("Remove")]
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$9 = [];
  __vue_render__$9._withStripped = true;

    /* style */
    const __vue_inject_styles__$9 = undefined;
    /* scoped */
    const __vue_scope_id__$9 = "data-v-40d3be16";
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var MultiChoice = normalizeComponent_1(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$9,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      undefined,
      undefined
    );

  //

  var script$a = {
  	name: "SchemasEditField",
  	components: {
  		"multi-choice": MultiChoice
  	},
  	props: {
  		"fieldName": {
  			type: String,
  			default: ""
  		},
  		"value": {
  			type: String,
  			default: ""
  		},
  		"selfIndex": {
  			type: Number,
  			required: true
  		},
  		"choices": {
  			type: Object,
  			default: () => {
  				return {};
  			}
  		}
  	},
  	data: function(){
  		// choices object to choicesArray
  		const choicesArray = _.map(this.choices, (choice, key) => {
  			return {
  				label: key,
  				value: choice
  			};
  		});

  		return {
  			"choicesArray": choicesArray
  		};
  	},
  	computed: {
  		showRemove: function(){
  			return this.choicesArray.length > 1;
  		}
  	},
  	methods: {
  		removeField: function(index){
  			this.$emit("removeField", index);
  		},
  		selectionChanged: function(e){
  			if(e.target.value === "checkbox" || e.target.value === "radio"){
  				this.choicesArray = [{
  					label: "",
  					value: ""
  				}];
  			}
  			this.$emit("input", e.target.value);
  			this.$emit("choiceChanged", {
  				choices: null,
  				index: this.selfIndex
  			});
  		},
  		nameChanged: function(e){
  			this.$emit("nameChanged", e.target.value, this.selfIndex);
  		},
  		addChoice: function(e){
  			this.choicesArray.push({
  				label: "",
  				value: ""
  			});
  		},
  		removeChoice: function(index){
  			this.choicesArray.splice(index, 1);
  		},
  		choiceChanged: function(data){
  			this.choicesArray[data.index] = data.choice;
  			const choices = _.reduce(this.choicesArray, (acc, c, i) => {
  				acc[c.label] = c.value;
  				return acc;
  			}, {});
  			this.$emit("choiceChanged", {
  				choices,
  				index: this.selfIndex
  			});
  		}
  	}
  };

  /* script */
  const __vue_script__$a = script$a;
  /* template */
  var __vue_render__$a = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "schema-field" }, [
      _c("input", {
        attrs: { type: "text", name: "field", required: "" },
        domProps: { value: _vm.fieldName },
        on: { input: _vm.nameChanged }
      }),
      _vm._v(" "),
      _c(
        "select",
        {
          attrs: { required: "" },
          domProps: { value: _vm.value },
          on: { input: _vm.selectionChanged }
        },
        [
          _c("option", { attrs: { disabled: "", selected: "", value: "" } }, [
            _vm._v(" -- select an option -- ")
          ]),
          _vm._v(" "),
          _c("option", { attrs: { value: "wysiwyg" } }, [_vm._v("wysiwyg")]),
          _vm._v(" "),
          _c("option", { attrs: { value: "text" } }, [_vm._v("text")]),
          _vm._v(" "),
          _c("option", { attrs: { value: "email" } }, [_vm._v("email")]),
          _vm._v(" "),
          _c("option", { attrs: { value: "checkbox" } }, [_vm._v("checkbox")]),
          _vm._v(" "),
          _c("option", { attrs: { value: "radio" } }, [_vm._v("radio")]),
          _vm._v(" "),
          _c("option", { attrs: { value: "file" } }, [_vm._v("file")])
        ]
      ),
      _vm._v(" "),
      _c(
        "button",
        {
          on: {
            click: function($event) {
              $event.preventDefault();
              return _vm.removeField(_vm.selfIndex)
            }
          }
        },
        [_vm._v("Remove")]
      ),
      _vm._v(" "),
      _vm.choicesArray.length
        ? _c(
            "div",
            { staticClass: "multi-choice-container" },
            [
              _vm._l(_vm.choicesArray, function(choice, index) {
                return _c("multi-choice", {
                  key: index,
                  attrs: {
                    choice: choice,
                    index: index,
                    showRemove: _vm.showRemove
                  },
                  on: {
                    removeChoice: _vm.removeChoice,
                    choiceChanged: _vm.choiceChanged
                  }
                })
              }),
              _vm._v(" "),
              _c(
                "button",
                {
                  on: {
                    click: function($event) {
                      $event.preventDefault();
                      return _vm.addChoice($event)
                    }
                  }
                },
                [_vm._v("Add")]
              )
            ],
            2
          )
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__$a = [];
  __vue_render__$a._withStripped = true;

    /* style */
    const __vue_inject_styles__$a = undefined;
    /* scoped */
    const __vue_scope_id__$a = "data-v-8ea2d782";
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var SchemasEditField = normalizeComponent_1(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$a,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      undefined,
      undefined
    );

  //

  var script$b = {
  	name: "SchemasEdit",
  	components: {
  		"schemas-edit-field": SchemasEditField
  	},
  	props: {
  		"currentCollectionSchema": {
  			type: Object,
  			default: function(){
  				return null;
  			}
  		}
  	},
  	data: function(){
  		let fields = [];
  		let tableName = "";

  		if(this.currentCollectionSchema){
  			fields = this.currentCollectionSchema.fields.slice(0);
  			tableName = this.currentCollectionSchema.tableName;
  		}else{
  			fields = [{
  				properties: {},
  				name: "",
  				slug: "",
  				type: ""
  			}];
  		}

  		return {
  			tableName,
  			fields
  		};
  	},
  	computed: {
  		tableSlug: function(){
  			return snakeCase(this.tableName);
  		},
  		editName: function(){
  			if(this.currentCollectionSchema){
  				return true;
  			}else{
  				return false;
  			}
  		}
  	},
  	methods: {
  		nameChanged: function(newName, i){
  			this.fields[i].name = newName;
  			this.fields[i].slug = snakeCase(newName);
  		},
  		submitSchema: function(){
  			const schema = {
  				tableSlug: this.tableSlug,
  				tableName: this.tableName,
  				fields: this.fields
  			};

  			this.$emit("submitSchema", schema);
  		},
  		validateInput: function(tableName, fields){
  			if(!tableName){
  				return false;
  			}
  		},
  		addField: function(){
  			const newField = {
  				properties: {},
  				name: "",
  				slug: "",
  				type: ""
  			};
  			this.fields.push(newField);
  		},
  		removeField: function(index){
  			this.fields.splice(index, 1);
  		},
  		choiceChanged: function(data){
  			this.$set(this.fields[data.index].properties, "choices", data.choices);
  		}
  	}
  };

  /* script */
  const __vue_script__$b = script$b;
  /* template */
  var __vue_render__$b = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "schema-edit-container" } }, [
      _c(
        "form",
        {
          attrs: { id: "form" },
          on: {
            submit: function($event) {
              $event.preventDefault();
              return _vm.submitSchema($event)
            }
          }
        },
        [
          _c("div", { attrs: { id: "collection-name" } }, [
            _c("label", { attrs: { for: "tableName" } }, [
              _vm._v("Collection Name: ")
            ]),
            _vm._v(" "),
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.tableName,
                  expression: "tableName"
                }
              ],
              attrs: {
                type: "text",
                name: "tableName",
                required: "",
                disabled: _vm.editName
              },
              domProps: { value: _vm.tableName },
              on: {
                input: function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.tableName = $event.target.value;
                }
              }
            })
          ]),
          _vm._v(" "),
          _c(
            "div",
            { attrs: { id: "schema-fields-container" } },
            [
              _vm._m(0),
              _vm._v(" "),
              _vm._l(_vm.fields, function(field, index) {
                return _c("schemas-edit-field", {
                  key: index,
                  attrs: {
                    fieldName: field.name,
                    selfIndex: index,
                    choices: field.properties.choices
                  },
                  on: {
                    nameChanged: _vm.nameChanged,
                    removeField: _vm.removeField,
                    choiceChanged: _vm.choiceChanged
                  },
                  model: {
                    value: field.type,
                    callback: function($$v) {
                      _vm.$set(field, "type", $$v);
                    },
                    expression: "field.type"
                  }
                })
              })
            ],
            2
          ),
          _vm._v(" "),
          _c(
            "button",
            {
              on: {
                click: function($event) {
                  $event.preventDefault();
                  return _vm.addField($event)
                }
              }
            },
            [_vm._v("Add")]
          ),
          _vm._v(" "),
          _c("input", {
            attrs: { type: "submit", name: "submit", value: "Submit" }
          })
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$b = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { attrs: { id: "schema-fields-label" } }, [
        _c("span", { attrs: { id: "field-name-label" } }, [_vm._v("Field Name")]),
        _vm._v(" "),
        _c("span", { attrs: { id: "field-type-label" } }, [_vm._v("Field Type")])
      ])
    }
  ];
  __vue_render__$b._withStripped = true;

    /* style */
    const __vue_inject_styles__$b = undefined;
    /* scoped */
    const __vue_scope_id__$b = "data-v-6dd3e050";
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var SchemasEdit = normalizeComponent_1(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$b,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$c = {
  	name: "UserListItem",
  	props: {
  		"user": {
  			type: Object,
  			required: true
  		}
  	},
  	methods: {
  		renderUser: function(username){
  			this.$emit("renderUser", username);
  		},
  		renderUserForm: function(){
  			this.$emit("renderUserForm", this.user.username);
  		},
  		deleteUser: function(){
  			this.$emit("deleteUser", this.user.username);
  		}
  	}
  };

  /* script */
  const __vue_script__$c = script$c;
  /* template */
  var __vue_render__$c = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "li",
      {
        staticClass: "user-container",
        on: {
          click: function($event) {
            $event.preventDefault();
            return _vm.renderUser(_vm.user.username)
          }
        }
      },
      [
        _c("span", { staticClass: "collection-name" }, [
          _vm._v(_vm._s(_vm.user.username))
        ]),
        _vm._v(" "),
        _c(
          "button",
          {
            staticClass: "edit-button",
            on: {
              click: function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                return _vm.renderUserForm($event)
              }
            }
          },
          [_vm._v("Edit")]
        ),
        _vm._v(" "),
        _c(
          "button",
          {
            staticClass: "delete-button",
            on: {
              click: function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                return _vm.deleteUser($event)
              }
            }
          },
          [_vm._v("Delete")]
        )
      ]
    )
  };
  var __vue_staticRenderFns__$c = [];
  __vue_render__$c._withStripped = true;

    /* style */
    const __vue_inject_styles__$c = undefined;
    /* scoped */
    const __vue_scope_id__$c = "data-v-7b0c4811";
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var UsersListItem = normalizeComponent_1(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$c,
      __vue_script__$c,
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      undefined,
      undefined
    );

  //

  var script$d = {
  	name: "UsersList",
  	components: {
  		"users-list-item": UsersListItem
  	},
  	props: {
  		"usersList": {
  			type: Array,
  			required: true
  		}
  	},
  	methods:{
  		renderUser: function(username){
  			this.$emit("renderUser", username);
  		},
  		renderUserForm: function(username){
  			this.$emit("renderUserForm", username);
  		},
  		deleteUser: function(username){
  			this.$emit("deleteUser", username);
  		}
  	}
  };

  /* script */
  const __vue_script__$d = script$d;
  /* template */
  var __vue_render__$d = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "users-container" } }, [
      _c("h1", [_vm._v("Users")]),
      _vm._v(" "),
      _c(
        "button",
        {
          attrs: { id: "new-button" },
          on: {
            click: function($event) {
              $event.preventDefault();
              return _vm.renderUserForm("")
            }
          }
        },
        [_vm._v("New")]
      ),
      _vm._v(" "),
      _c(
        "ul",
        { attrs: { id: "users-list" } },
        _vm._l(_vm.usersList, function(user) {
          return _c("users-list-item", {
            key: user.username,
            attrs: { user: user },
            on: {
              renderUser: _vm.renderUser,
              renderUserForm: _vm.renderUserForm,
              deleteUser: _vm.deleteUser
            }
          })
        }),
        1
      )
    ])
  };
  var __vue_staticRenderFns__$d = [];
  __vue_render__$d._withStripped = true;

    /* style */
    const __vue_inject_styles__$d = undefined;
    /* scoped */
    const __vue_scope_id__$d = "data-v-627b01fa";
    /* module identifier */
    const __vue_module_identifier__$d = undefined;
    /* functional template */
    const __vue_is_functional_template__$d = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var UsersList = normalizeComponent_1(
      { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
      __vue_inject_styles__$d,
      __vue_script__$d,
      __vue_scope_id__$d,
      __vue_is_functional_template__$d,
      __vue_module_identifier__$d,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$e = {
  	name: "UserEdit",
  	props: {
  		"currentViewUser": {
  			type: Object,
  			default: function(){
  				return {};
  			}
  		}
  	},
  	methods: {
  		submitUser: function(e){
  			var result = this.$_formToJSON(e.target);
  			this.$emit("submitUser", result);
  		},

  		// Private functions
  		$_formToJSON: function(formElement){
  			var result = {};

  			var data = new FormData(formElement);
  			for(const entry of data){
  				if(result[entry[0]]){
  					result[entry[0]] = Array(result[entry[0]]).concat([entry[1]]);
  					// Flatten 2D array
  					result[entry[0]] = result[entry[0]].reduce(
  						function(a, b) {
  							return a.concat(b);
  						},
  						[]
  					);
  				}else{
  					result[entry[0]] = entry[1];
  				}
  			}
  			return result;
  		}
  	}
  };

  /* script */
  const __vue_script__$e = script$e;
  /* template */
  var __vue_render__$e = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "user-form-container" } }, [
      _vm.currentViewUser.role ? _c("h1", [_vm._v("User")]) : _vm._e(),
      _vm._v(" "),
      _vm.currentViewUser.role == undefined
        ? _c("h1", [_vm._v("New User")])
        : _vm._e(),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "user-form" },
          on: {
            submit: function($event) {
              $event.preventDefault();
              return _vm.submitUser($event)
            }
          }
        },
        [
          _c("div", { staticClass: "form-items" }, [
            _c("label", [_vm._v("Username:")]),
            _vm._v(" "),
            _c("input", {
              attrs: { type: "text", name: "username", required: "" },
              domProps: { value: _vm.currentViewUser.username }
            }),
            _vm._v(" "),
            _c("br"),
            _vm._v(" "),
            _vm.currentViewUser.role ? _c("label", [_vm._v("Role:")]) : _vm._e(),
            _vm._v(" "),
            _vm.currentViewUser.role
              ? _c("input", {
                  attrs: { type: "text", name: "role", required: "" },
                  domProps: { value: _vm.currentViewUser.role }
                })
              : _vm._e(),
            _vm._v(" "),
            _vm.currentViewUser.role == undefined
              ? _c("label", [_vm._v("Password:")])
              : _vm._e(),
            _vm._v(" "),
            _vm.currentViewUser.role == undefined
              ? _c("input", {
                  attrs: { type: "password", name: "password", required: "" }
                })
              : _vm._e()
          ]),
          _vm._v(" "),
          _c("input", {
            attrs: {
              id: "submit",
              type: "submit",
              name: "submit",
              value: "Submit"
            }
          })
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$e = [];
  __vue_render__$e._withStripped = true;

    /* style */
    const __vue_inject_styles__$e = undefined;
    /* scoped */
    const __vue_scope_id__$e = "data-v-161f56b6";
    /* module identifier */
    const __vue_module_identifier__$e = undefined;
    /* functional template */
    const __vue_is_functional_template__$e = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var UserEdit = normalizeComponent_1(
      { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
      __vue_inject_styles__$e,
      __vue_script__$e,
      __vue_scope_id__$e,
      __vue_is_functional_template__$e,
      __vue_module_identifier__$e,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$f = {
  	name: "UserPage",
  	props: {
  		"currentViewUser": {
  			type: Object,
  			required: true
  		}
  	},
  	computed: {
  		userModelLinks: function(){
  			let models = [];
  			_.each(this.currentViewUser.models, (model, i) => {
  				let modelPaths = model.split(".");
  				let tableSlug = modelPaths[0];
  				let modelID = modelPaths[1];
  				let link = `collections/${tableSlug}/${modelID}`;
  				models.push({
  					tableSlug,
  					modelID,
  					link
  				});
  			});

  			return models;
  		}
  	},
  	methods: {
  		renderModel: function(tableSlug, uid){
  			this.$emit("renderModel", tableSlug, uid);
  		}
  	}
  };

  /* script */
  const __vue_script__$f = script$f;
  /* template */
  var __vue_render__$f = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "user-container" } }, [
      _c("h1", [_vm._v(_vm._s(_vm.currentViewUser.username))]),
      _vm._v(" "),
      _c("p", [_vm._v("User role: " + _vm._s(_vm.currentViewUser.role))]),
      _vm._v(" "),
      _c("p", [
        _vm._v("\n\t\tUser models:\n\t\t"),
        _c(
          "ul",
          { attrs: { id: "user-models-list" } },
          _vm._l(_vm.currentViewUser.models, function(model, index) {
            return _c(
              "a",
              {
                key: index,
                staticClass: "list-items",
                attrs: { href: _vm.userModelLinks[index].link },
                on: {
                  click: function($event) {
                    $event.preventDefault();
                    return _vm.renderModel(
                      _vm.userModelLinks[index].tableSlug,
                      _vm.userModelLinks[index].modelID
                    )
                  }
                }
              },
              [_c("li", [_vm._v("\n\t\t\t\t\t" + _vm._s(model) + "\n\t\t\t\t")])]
            )
          }),
          0
        )
      ])
    ])
  };
  var __vue_staticRenderFns__$f = [];
  __vue_render__$f._withStripped = true;

    /* style */
    const __vue_inject_styles__$f = undefined;
    /* scoped */
    const __vue_scope_id__$f = "data-v-8db3b5b6";
    /* module identifier */
    const __vue_module_identifier__$f = undefined;
    /* functional template */
    const __vue_is_functional_template__$f = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var UserPage = normalizeComponent_1(
      { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
      __vue_inject_styles__$f,
      __vue_script__$f,
      __vue_scope_id__$f,
      __vue_is_functional_template__$f,
      __vue_module_identifier__$f,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$g = {
  	name: "ModelPage",
  	props: {
  		"currentModel": {
  			type: Object,
  			required: true
  		},
  		"currentCollectionSchema": {
  			type: Object,
  			required: true
  		}
  	},
  	methods: {
  		renderModelForm: function(){
  			this.$emit("renderModelForm",
  				this.currentCollectionSchema.tableSlug,
  				this.currentModel._uid
  			);
  		},
  		deleteModel: function(){
  			this.$emit("deleteModel",
  				this.currentCollectionSchema.tableSlug,
  				this.currentModel._uid
  			);
  		}
  	}
  };

  /* script */
  const __vue_script__$g = script$g;
  /* template */
  var __vue_render__$g = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "model-container" } }, [
      _c("h1", [
        _vm._v(
          _vm._s(_vm.currentCollectionSchema.tableName) +
            " - " +
            _vm._s(_vm.currentModel._uid)
        )
      ]),
      _vm._v(" "),
      _c(
        "button",
        {
          on: {
            click: function($event) {
              $event.preventDefault();
              return _vm.renderModelForm($event)
            }
          }
        },
        [_vm._v("\n\t\tEdit\n\t")]
      ),
      _vm._v(" "),
      _c(
        "button",
        {
          staticClass: "delete-button",
          on: {
            click: function($event) {
              $event.preventDefault();
              return _vm.deleteModel($event)
            }
          }
        },
        [_vm._v("\n\t\tDelete\n\t")]
      ),
      _vm._v(" "),
      _c(
        "ul",
        { attrs: { id: "model-list" } },
        _vm._l(_vm.currentCollectionSchema.fields, function(field) {
          return _c("li", { key: field.slug }, [
            _c("h4", [_vm._v(_vm._s(field.name))]),
            _vm._v(" "),
            field.type == "wysiwyg"
              ? _c("div", {
                  staticClass: "field",
                  domProps: { innerHTML: _vm._s(_vm.currentModel[field.slug]) }
                })
              : field.type == "text"
              ? _c("div", { staticClass: "field" }, [
                  _vm._v(_vm._s(_vm.currentModel[field.slug]))
                ])
              : field.type == "email"
              ? _c("div", { staticClass: "field" }, [
                  _vm._v(_vm._s(_vm.currentModel[field.slug]))
                ])
              : field.type == "checkbox"
              ? _c("div", { staticClass: "field" }, [
                  _c(
                    "ul",
                    _vm._l(_vm.currentModel[field.slug], function(option) {
                      return _c("li", [_vm._v(_vm._s(option))])
                    }),
                    0
                  )
                ])
              : field.type == "radio"
              ? _c("div", { staticClass: "field" }, [
                  _vm._v(_vm._s(_vm.currentModel[field.slug]))
                ])
              : _vm._e()
          ])
        }),
        0
      )
    ])
  };
  var __vue_staticRenderFns__$g = [];
  __vue_render__$g._withStripped = true;

    /* style */
    const __vue_inject_styles__$g = undefined;
    /* scoped */
    const __vue_scope_id__$g = "data-v-353a3ef8";
    /* module identifier */
    const __vue_module_identifier__$g = undefined;
    /* functional template */
    const __vue_is_functional_template__$g = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var ModelPage = normalizeComponent_1(
      { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
      __vue_inject_styles__$g,
      __vue_script__$g,
      __vue_scope_id__$g,
      __vue_is_functional_template__$g,
      __vue_module_identifier__$g,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$h = {
  	name: "ModelForm",
  	props: {
  		"currentCollectionSchema": {
  			type: Object,
  			required: true
  		},
  		"currentModel": {
  			type: Object,
  			default: function(){
  				return {};
  			}
  		}
  	},
  	methods: {
  		submitModel: function(e){
  			const result = this.$_formToJSON(e.target);
  			const slug = this.currentCollectionSchema.tableSlug;
  			const uid = this.currentModel._uid || "";

  			if(this.validateModel(result)){
  				this.$emit("submitModel", result, slug, uid);
  			}
  		},

  		validateModel: function(model){
  			const fields = this.currentCollectionSchema.fields;
  			for(let i=0; i<fields.length; i++){
  				if(typeof model[fields[i].slug] == "undefined"){
  					if(fields[i].type == "checkbox"){
  						model[fields[i].slug] = [];
  					}else{
  						model[fields[i].slug] = "";
  					}
  				}

  				if(fields[i].type == "checkbox" && !Array.isArray(model[fields[i].slug])){
  					model[fields[i].slug] = [model[fields[i].slug]];
  				}
  				// Other validations go here, return false if failed
  			}
  			return true;
  		},
  		checkboxChecked: function(choice, slug){
  			if(!this.currentModel[slug]) return false;
  			return this.currentModel[slug].includes(choice);
  		},

  		// Private functions
  		$_formToJSON: function(formElement){
  			const result = {};

  			const data = new FormData(formElement);
  			for(const entry of data){
  				if(result[entry[0]]){
  					// Handling multiple choice form
  					result[entry[0]] = Array(result[entry[0]]).concat([entry[1]]);
  					// Flatten 2D array
  					result[entry[0]] = result[entry[0]].reduce(
  						function(a, b) {
  							return a.concat(b);
  						},
  						[]
  					);
  				}else{
  					if(entry[1] instanceof File){
  						// File upload
  						result[entry[0]] = {
  							"content-type": entry[1].type,
  							file_name: entry[1].name,
  							file_description: "",
  							file: entry[1]
  						};
  					}else{
  						// All other elements
  						result[entry[0]] = entry[1];
  					}
  				}
  			}
  			return result;
  		}
  	}
  };

  /* script */
  const __vue_script__$h = script$h;
  /* template */
  var __vue_render__$h = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "form",
      {
        attrs: { id: "form" },
        on: {
          submit: function($event) {
            $event.preventDefault();
            return _vm.submitModel($event)
          }
        }
      },
      [
        _vm._l(_vm.currentCollectionSchema.fields, function(field) {
          return _c("div", { key: field.slug, staticClass: "field-container" }, [
            _c(
              "label",
              { staticClass: "field-name", attrs: { for: field.slug } },
              [_vm._v("\n\t\t\t" + _vm._s(field.name) + "\n\t\t")]
            ),
            _vm._v(" "),
            field.type == "checkbox" || field.type == "radio"
              ? _c(
                  "span",
                  { staticClass: "field" },
                  _vm._l(field.properties.choices, function(choice, key) {
                    return _c("span", { staticClass: "v-for-container" }, [
                      _c("input", {
                        attrs: { type: field.type, name: field.slug, id: choice },
                        domProps: {
                          value: choice,
                          checked: _vm.checkboxChecked(choice, field.slug)
                        }
                      }),
                      _vm._v(" "),
                      _c("label", { attrs: { for: choice } }, [
                        _vm._v(_vm._s(key))
                      ])
                    ])
                  }),
                  0
                )
              : _c("span", { staticClass: "field" }, [
                  _c("input", {
                    attrs: { required: "", type: field.type, name: field.slug },
                    domProps: { value: _vm.currentModel[field.slug] }
                  })
                ])
          ])
        }),
        _vm._v(" "),
        _c("input", {
          attrs: { id: "submit", type: "submit", name: "submit", value: "Submit" }
        })
      ],
      2
    )
  };
  var __vue_staticRenderFns__$h = [];
  __vue_render__$h._withStripped = true;

    /* style */
    const __vue_inject_styles__$h = undefined;
    /* scoped */
    const __vue_scope_id__$h = "data-v-7e48c35c";
    /* module identifier */
    const __vue_module_identifier__$h = undefined;
    /* functional template */
    const __vue_is_functional_template__$h = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var ModelForm = normalizeComponent_1(
      { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
      __vue_inject_styles__$h,
      __vue_script__$h,
      __vue_scope_id__$h,
      __vue_is_functional_template__$h,
      __vue_module_identifier__$h,
      undefined,
      undefined
    );

  //

  var script$i = {
  	name: "ModelEdit",
  	components: {
  		"model-form": ModelForm
  	},
  	props: {
  		"currentModel": {
  			type: Object,
  			default: function(){
  				return {};
  			}
  		},
  		"currentCollectionSchema": {
  			type: Object,
  			required: true
  		}
  	},
  	methods: {
  		submitModel: function(model, tableSlug, uid=""){
  			this.$emit("submitModel", model, tableSlug, uid);
  		}
  	}
  };

  /* script */
  const __vue_script__$i = script$i;
  /* template */
  var __vue_render__$i = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("model-form", {
      attrs: {
        "current-collection-schema": _vm.currentCollectionSchema,
        "current-model": _vm.currentModel
      },
      on: { submitModel: _vm.submitModel }
    })
  };
  var __vue_staticRenderFns__$i = [];
  __vue_render__$i._withStripped = true;

    /* style */
    const __vue_inject_styles__$i = undefined;
    /* scoped */
    const __vue_scope_id__$i = "data-v-389d15da";
    /* module identifier */
    const __vue_module_identifier__$i = undefined;
    /* functional template */
    const __vue_is_functional_template__$i = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var ModelEdit = normalizeComponent_1(
      { render: __vue_render__$i, staticRenderFns: __vue_staticRenderFns__$i },
      __vue_inject_styles__$i,
      __vue_script__$i,
      __vue_scope_id__$i,
      __vue_is_functional_template__$i,
      __vue_module_identifier__$i,
      undefined,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script$j = {
  	name: "AccountPage",
  	props: {
  		"loggedInUser": {
  			type: String,
  			default: ""
  		}
  	},
  	methods: {
  		submitChangePassword: function(e){
  			var result = this.$_formToJSON(e.target);
  			result.username = this.loggedInUser;
  			this.$emit("submitChangePassword", result);
  		},

  		// Private functions
  		$_formToJSON: function(formElement){
  			var result = {};

  			var data = new FormData(formElement);
  			for(const entry of data){
  				if(result[entry[0]]){
  					result[entry[0]] = Array(result[entry[0]]).concat([entry[1]]);
  					// Flatten 2D array
  					result[entry[0]] = result[entry[0]].reduce(
  						function(a, b) {
  							return a.concat(b);
  						},
  						[]
  					);
  				}else{
  					result[entry[0]] = entry[1];
  				}
  			}
  			return result;
  		}
  	}
  };

  /* script */
  const __vue_script__$j = script$j;
  /* template */
  var __vue_render__$j = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("article", { attrs: { id: "account-container" } }, [
      _c("h1", [_vm._v("Your Account")]),
      _vm._v(" "),
      _c("h2", [_vm._v("Change password")]),
      _vm._v(" "),
      _c(
        "form",
        {
          attrs: { id: "change-password-form" },
          on: {
            submit: function($event) {
              $event.preventDefault();
              return _vm.submitChangePassword($event)
            }
          }
        },
        [
          _vm._m(0),
          _vm._v(" "),
          _c("input", {
            attrs: {
              id: "submit",
              type: "submit",
              name: "submit",
              value: "Submit"
            }
          })
        ]
      )
    ])
  };
  var __vue_staticRenderFns__$j = [
    function() {
      var _vm = this;
      var _h = _vm.$createElement;
      var _c = _vm._self._c || _h;
      return _c("div", { staticClass: "form-items" }, [
        _c("label", [_vm._v("Password:")]),
        _vm._v(" "),
        _c("input", { attrs: { type: "password", name: "password" } }),
        _vm._v(" "),
        _c("br"),
        _vm._v(" "),
        _c("label", [_vm._v("New Password:")]),
        _vm._v(" "),
        _c("input", { attrs: { type: "password", name: "newPassword" } })
      ])
    }
  ];
  __vue_render__$j._withStripped = true;

    /* style */
    const __vue_inject_styles__$j = undefined;
    /* scoped */
    const __vue_scope_id__$j = "data-v-4ddbdea3";
    /* module identifier */
    const __vue_module_identifier__$j = undefined;
    /* functional template */
    const __vue_is_functional_template__$j = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var AccountPage = normalizeComponent_1(
      { render: __vue_render__$j, staticRenderFns: __vue_staticRenderFns__$j },
      __vue_inject_styles__$j,
      __vue_script__$j,
      __vue_scope_id__$j,
      __vue_is_functional_template__$j,
      __vue_module_identifier__$j,
      undefined,
      undefined
    );

  //

  var script$k = {
  	name: "AppContent",
  	components: {
  		"app-dashboard": Dashboard,
  		"login-page": LoginPage,
  		"signup-page": SignupPage,
  		"collection-list": CollectionList,
  		"schemas-list": SchemasList,
  		"schemas-edit": SchemasEdit,
  		"users-list": UsersList,
  		"user-edit": UserEdit,
  		"user-page": UserPage,
  		"model-page": ModelPage,
  		"model-edit": ModelEdit,
  		"account-page": AccountPage
  	},
  	props: {
  		"loggedInUser": {
  			type: String,
  			default: ""
  		},
  		"schemas": {
  			type: Array,
  			default: function(){
  				return [];
  			}
  		},
  		"currentView": {
  			type: String,
  			default: "app-dashboard",
  			required: true
  		},
  		"currentCollection": {
  			type: Array,
  			default: function(){
  				return [];
  			}
  		},
  		"currentCollectionSchema": {
  			type: Object,
  			default: function(){
  				return null;
  			}
  		},
  		"currentModel": {
  			type: Object,
  			default: function(){
  				return {};
  			}
  		},
  		"usersList": {
  			type: Array,
  			default: function(){
  				return [];
  			}
  		},
  		"currentViewUser": {
  			type: Object,
  			default: function(){
  				return {};
  			}
  		}
  	},
  	methods: {
  		loginUser: function(loginDetails){
  			this.$emit("loginUser", loginDetails);
  		},
  		renderLogin: function(){
  			this.$emit("renderLogin");
  		},
  		signupUser: function(signupDetails){
  			this.$emit("signupUser", signupDetails);
  		},
  		renderSignup: function(){
  			this.$emit("renderSignup");
  		},

  		renderModel: function(tableSlug, uid){
  			this.$emit("renderModel", tableSlug, uid);
  		},
  		renderModelForm: function(tableSlug, uid){
  			this.$emit("renderModelForm", tableSlug, uid);
  		},
  		submitModel: function(model, tableSlug, uid=""){
  			this.$emit("submitModel", model, tableSlug, uid);
  		},
  		deleteModel: function(tableSlug, uid){
  			this.$emit("deleteModel", tableSlug, uid);
  		},

  		renderSchemaForm: function(tableSlug){
  			this.$emit("renderSchemaForm", tableSlug);
  		},
  		submitSchema: function(schema){
  			this.$emit("submitSchema", schema);
  		},
  		deleteSchema: function(tableSlug){
  			this.$emit("deleteSchema", tableSlug);
  		},

  		renderUser: function(username){
  			this.$emit("renderUser", username);
  		},
  		renderUserForm: function(username){
  			this.$emit("renderUserForm", username);
  		},
  		deleteUser: function(username){
  			this.$emit("deleteUser", username);
  		},
  		submitUser: function(user){
  			this.$emit("submitUser", user);
  		},

  		submitChangePassword: function(result){
  			this.$emit("submitChangePassword", result);
  		}
  	}
  };

  /* script */
  const __vue_script__$k = script$k;
  /* template */
  var __vue_render__$k = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "section",
      { attrs: { id: "page-content" } },
      [
        _c(_vm.currentView, {
          tag: "component",
          attrs: {
            "logged-in-user": _vm.loggedInUser,
            schemas: _vm.schemas,
            "current-collection": _vm.currentCollection,
            "current-collection-schema": _vm.currentCollectionSchema,
            "users-list": _vm.usersList,
            "current-model": _vm.currentModel,
            "current-view-user": _vm.currentViewUser
          },
          on: {
            loginUser: _vm.loginUser,
            renderLogin: _vm.renderLogin,
            signupUser: _vm.signupUser,
            renderSignup: _vm.renderSignup,
            renderModel: _vm.renderModel,
            renderModelForm: _vm.renderModelForm,
            submitModel: _vm.submitModel,
            deleteModel: _vm.deleteModel,
            renderSchemaForm: _vm.renderSchemaForm,
            submitSchema: _vm.submitSchema,
            deleteSchema: _vm.deleteSchema,
            renderUser: _vm.renderUser,
            renderUserForm: _vm.renderUserForm,
            deleteUser: _vm.deleteUser,
            submitUser: _vm.submitUser,
            submitChangePassword: _vm.submitChangePassword
          }
        })
      ],
      1
    )
  };
  var __vue_staticRenderFns__$k = [];
  __vue_render__$k._withStripped = true;

    /* style */
    const __vue_inject_styles__$k = undefined;
    /* scoped */
    const __vue_scope_id__$k = "data-v-23f2c399";
    /* module identifier */
    const __vue_module_identifier__$k = undefined;
    /* functional template */
    const __vue_is_functional_template__$k = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var Content = normalizeComponent_1(
      { render: __vue_render__$k, staticRenderFns: __vue_staticRenderFns__$k },
      __vue_inject_styles__$k,
      __vue_script__$k,
      __vue_scope_id__$k,
      __vue_is_functional_template__$k,
      __vue_module_identifier__$k,
      undefined,
      undefined
    );

  //

  var script$l = {
  	name: "App",
  	components: {
  		"app-header": Header,
  		"app-sidebar": Sidebar,
  		"app-toast": Toast,
  		"app-content": Content
  	},
  	methods: {
  		/**
  		 * Render methods. Used to render different pages.
  		 */
  		renderDashboard: function(){
  			this.$store.commit("setContentView", this.contentViews.dashboard);
  		},
  		renderSchemasList: function(){
  			this.$store.commit("setContentView", this.contentViews.schemasList);
  		},
  		renderCollection: function(tableSlug){
  			this.$store.dispatch("fetchCollection", tableSlug).then(() => {
  				this.$store.commit("setContentView", this.contentViews.collectionList);
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		renderUsersList: function(){
  			this.$store.dispatch("fetchUsersList").then(() => {
  				this.$store.commit("setContentView", this.contentViews.usersList);
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		renderLogin: function(){
  			this.$store.commit("setContentView", this.contentViews.loginPage);
  		},
  		renderModel: function(tableSlug, uid){
  			this.$store.dispatch("fetchModel", {
  				tableSlug,
  				uid
  			}).then((model) => {
  				this.$store.commit("setContentView", this.contentViews.modelPage);
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		renderModelForm: function(tableSlug, uid){
  			this.$store.dispatch("fetchCollection", tableSlug).then((collection) => {
  				if(!uid){
  					// If not uid is defined, render blank form
  					this.$store.commit("setCurrentModel", {
  						model: {},
  						tableSlug
  					});
  					this.$store.commit("setContentView", this.contentViews.modelEdit);
  				}else{
  					// If uid is defined, fetch model then render populated form
  					this.$store.dispatch("fetchModel", {
  						tableSlug,
  						uid
  					}).then((model) => {
  						this.$store.commit("setContentView", this.contentViews.modelEdit);
  					}).catch((err) => {
  						this.$store.commit("setToastMessage", err.detail);
  					});
  				}
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		renderAccount: function(){
  			this.$store.commit("setContentView", this.contentViews.accountPage);
  		},

  		/**
  		 * Model related methods. Used to manipulate individual model
  		 */
  		submitModel: function(model, tableSlug, uid=""){
  			this.$store.dispatch("submitModel", {
  				model,
  				tableSlug,
  				uid
  			}).then((model) => {
  				this.$store.commit("setCurrentModel", {
  					model,
  					tableSlug
  				});
  				this.$store.commit("setContentView", this.contentViews.modelPage);
  				this.$store.commit("setToastMessage", "Created new model");
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		deleteModel: function(tableSlug, uid){
  			this.$store.dispatch("deleteModel", {
  				tableSlug,
  				uid
  			}).then((model) => {
  				this.$store.commit("setContentView", this.contentViews.collectionList);
  				this.$store.commit("setToastMessage", "Deleted model");
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},

  		/**
  		 * Schema related methods. Used to render schema form and manipulate
  		 * individual schema
  		 */
  		renderSchemaForm: function(tableSlug=""){
  			this.$store.commit("setCurrentCollectionSchema", tableSlug);
  			this.$store.commit("setContentView", this.contentViews.schemasEdit);
  		},
  		submitSchema: function(schema){
  			this.$store.dispatch("submitSchema", schema).then((schema) => {
  				this.$store.commit("setContentView", this.contentViews.schemasList);
  				this.$store.commit("setToastMessage", `Created schema "${schema.tableName}".`);
  			});
  		},
  		deleteSchema: function(tableSlug){
  			this.$store.dispatch("deleteSchema", tableSlug).then((response) => {
  				this.$store.commit("setContentView", this.contentViews.schemasList);
  				this.$store.commit("setToastMessage", response.message);
  			});
  		},

  		/**
  		 * User related methods. Used to render user form and manipulate
  		 * individual user's data
  		 */
  		renderUser: function(username){
  			this.$store.dispatch("fetchUser", username).then((user) => {
  				this.$store.commit("setCurrentViewUser", user);
  				this.$store.commit("setContentView", this.contentViews.userPage);
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		renderUserForm: function(username){
  			if(username){
  				this.$store.dispatch("fetchUser", username).then((user) => {
  					this.$store.commit("setCurrentViewUser", user);
  					this.$store.commit("setContentView", this.contentViews.userEdit);
  				});
  			}else{
  				this.$store.commit("setCurrentViewUser", {});
  				this.$store.commit("setContentView", this.contentViews.userEdit);
  			}
  		},
  		deleteUser: function(username){
  			this.$store.dispatch("deleteUser", username).then((res) => {
  				this.$store.commit("setToastMessage", res.message);
  				this.$store.dispatch("fetchUsersList").catch((err) => {
  					this.$store.commit("setToastMessage", err.detail);
  				});
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		submitUser: function(user){
  			this.$store.dispatch("submitUser", user).then((res) => {
  				this.$store.commit("setContentView", this.contentViews.dashboard);
  				this.$store.commit("setToastMessage", res.message);
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},

  		/**
  		 * Login/logout/signup related methods.
  		 */
  		loginUser: function(loginDetails){
  			this.$store.dispatch("loginUser", loginDetails).then((res) => {
  				this.$store.commit("setContentView", this.contentViews.dashboard);
  			}).catch((err) => {
  				if(err.title === "Authentication Failed"){
  					this.$store.commit("setContentView", this.contentViews.loginPage);
  				}else{
  					console.error(err);
  				}
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		logoutUser: function(){
  			store.remove("access_token");
  			this.$store.commit("updateSchemas", []);
  			this.$store.commit("setLoggedIn", false);
  			this.$store.commit("updateUsersList", []);
  			this.$store.commit("setLoggedInUser", "");
  		},
  		signupUser: function(signupDetails){
  			this.$store.dispatch("signupUser", signupDetails).then((res) => {
  				this.$store.commit("setContentView", this.contentViews.loginPage);
  				this.$store.commit("setToastMessage", "You have sucessfully signed up!");
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		},
  		renderSignup: function(){
  			this.$store.commit("setContentView", this.contentViews.signupPage);
  		},

  		submitChangePassword: function(result){
  			this.$store.dispatch("submitChangePassword", result).then((res) => {
  				this.$store.commit("setContentView", this.contentViews.dashboard);
  				this.$store.commit("setToastMessage", res.message);
  			}).catch((err) => {
  				this.$store.commit("setToastMessage", err.detail);
  			});
  		}
  	}
  };

  /* script */
  const __vue_script__$l = script$l;
  /* template */
  var __vue_render__$l = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c(
      "div",
      { attrs: { id: "page-container" } },
      [
        _c("app-header", {
          attrs: { "site-title": _vm.siteTitle, "logged-in": _vm.loggedIn },
          on: {
            renderLogin: _vm.renderLogin,
            logoutUser: _vm.logoutUser,
            renderSignup: _vm.renderSignup,
            renderAccount: _vm.renderAccount
          }
        }),
        _vm._v(" "),
        _c("app-toast", { attrs: { "toast-message": _vm.toastMessage } }),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "flex-container" },
          [
            _c("app-sidebar", {
              attrs: { schemas: _vm.schemas, "logged-in": _vm.loggedIn },
              on: {
                renderSchemasList: _vm.renderSchemasList,
                renderDashboard: _vm.renderDashboard,
                renderCollection: _vm.renderCollection,
                renderUsersList: _vm.renderUsersList
              }
            }),
            _vm._v(" "),
            _c("app-content", {
              attrs: {
                "logged-in-user": _vm.loggedInUser,
                schemas: _vm.schemas,
                "current-view": _vm.currentContentView,
                "current-collection": _vm.currentCollection,
                "current-collection-schema": _vm.currentCollectionSchema,
                "current-model": _vm.currentModel,
                "users-list": _vm.usersList,
                "current-view-user": _vm.currentViewUser
              },
              on: {
                loginUser: _vm.loginUser,
                renderLogin: _vm.renderLogin,
                signupUser: _vm.signupUser,
                renderSignup: _vm.renderSignup,
                renderModel: _vm.renderModel,
                renderModelForm: _vm.renderModelForm,
                submitModel: _vm.submitModel,
                deleteModel: _vm.deleteModel,
                renderSchemaForm: _vm.renderSchemaForm,
                submitSchema: _vm.submitSchema,
                deleteSchema: _vm.deleteSchema,
                renderUser: _vm.renderUser,
                renderUserForm: _vm.renderUserForm,
                deleteUser: _vm.deleteUser,
                submitUser: _vm.submitUser,
                submitChangePassword: _vm.submitChangePassword
              }
            })
          ],
          1
        )
      ],
      1
    )
  };
  var __vue_staticRenderFns__$l = [];
  __vue_render__$l._withStripped = true;

    /* style */
    const __vue_inject_styles__$l = undefined;
    /* scoped */
    const __vue_scope_id__$l = "data-v-6d012a4d";
    /* module identifier */
    const __vue_module_identifier__$l = undefined;
    /* functional template */
    const __vue_is_functional_template__$l = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var App = normalizeComponent_1(
      { render: __vue_render__$l, staticRenderFns: __vue_staticRenderFns__$l },
      __vue_inject_styles__$l,
      __vue_script__$l,
      __vue_scope_id__$l,
      __vue_is_functional_template__$l,
      __vue_module_identifier__$l,
      undefined,
      undefined
    );

  //---------------------------------------------//
  App.data = function(){
  	return {
  		siteTitle: siteTitle,
  		serverURL: url,

  		contentViews: {
  			dashboard: "app-dashboard",
  			loginPage: "login-page",
  			signupPage: "signup-page",
  			schemasList: "schemas-list",
  			schemasEdit: "schemas-edit",
  			collectionList: "collection-list",
  			usersList: "users-list",
  			userEdit: "user-edit",
  			userPage: "user-page",
  			modelPage: "model-page",
  			modelEdit: "model-edit",
  			accountPage: "account-page"
  		},

  		utils: {
  			generateRequest: generateRequest,
  			urlJoin: urlJoin,
  			appTokenValid: appTokenValid
  		}
  	};
  };

  /**
   * Computed properties controlled by Vuex
   */
  App.computed = {
  	toastMessage: function(){
  		return appStore.state.toastMessage;
  	},
  	loggedIn: function(){
  		return appStore.state.loggedIn;
  	},
  	loggedInUser: function(){
  		return appStore.state.loggedInUser;
  	},
  	schemas: function(){
  		return appStore.state.schemas;
  	},
  	usersList: function(){
  		return appStore.state.usersList;
  	},
  	currentViewUser: function(){
  		return appStore.state.currentViewUser;
  	},
  	currentContentView: function(){
  		return appStore.state.currentContentView;
  	},
  	currentCollection: function(){
  		return appStore.state.currentCollection;
  	},
  	currentCollectionSchema: function(){
  		return appStore.state.currentCollectionSchema;
  	},
  	currentModel: function(){
  		return appStore.state.currentModel;
  	}
  };

  //---------------------------------------------//
  //              Start the app!                 //
  //---------------------------------------------//
  /**
   * Starting point of the Vue app
   */
  new Vue({
  	el: "#page-content",
  	store: appStore,
  	render: function(createElement){
  		if(appTokenValid()){
  			appStore.dispatch("fetchUsersList");
  			appStore.dispatch("fetchSchemas");
  		}else{
  			appStore.commit("setContentView", "login-page");
  		}
  		return createElement(App);
  	}
  });

}));
//# sourceMappingURL=bundle.js.map
