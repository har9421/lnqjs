
define(function(){


    var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this;


    var previousUnderscore = root.lq;

    var lq = function (obj) {
        if (obj instanceof lq) return obj;
        if (!(this instanceof lq)) return new lq(obj);
        this._wrapped = obj;
    };

    if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
            exports = module.exports = lq;
        }
        exports.lq = lq;
    } else {
        root.lq = lq;
    }

    // Default methods

    function DefaultEqualityComparer(a, b) {
        return a === b || a.valueOf() === b.valueOf();
    };

    function DefaultSortComparer(a, b) {
        if (a === b) return 0;
        if (a == null) return -1;
        if (b == null) return 1;
        if (typeof a == "string") return a.toString().localeCompare(b.toString());
        return a.valueOf() - b.valueOf();
    };

    function DefaultPredicate() {
        return true;
    };

    function DefaultSelector(t) {
        return t;
    };


    var _shallowProperty = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        };
    };

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

    var _getLength = _shallowProperty('length');

    var _isArray = function (collection) {
        var length = _getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    // has key in obj
    var _keyInObj = function (obj, key) {
        return key in obj;
    };

    // has value in obj
    var _valueInObj = function (obj, key, value) {
        return _keyInObj(obj, key) && obj[key] === value;
    }


});
