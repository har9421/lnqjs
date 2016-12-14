//  linq.js 1.0.0
(function () {

    'use strict';

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


    // Selectors

    lq.select = lq.map || function (selector, context) {
        context = context || window;
        var arr = [];
        var l = this.length;
        for (var i = 0; i < l; i++)
            arr.push(selector.call(context, this[i], i, this));
        return arr;
    };

    lq.selectMany = function (selector, resSelector) {
        resSelector = resSelector || function (i, res) { return res; };
        return this.aggregate(function (a, b) {
            return a.concat(selector(b).select(function (res) { return resSelector(b, res) }));
        }, []);
    };

    lq.take = function (c) {
        return this.slice(0, c);
    };

    lq.skip = Array.prototype.slice;

    lq.first = function (predicate, def) {
        var l = this.length;
        if (!predicate) return l ? this[0] : def == null ? null : def;
        for (var i = 0; i < l; i++)
            if (predicate(this[i], i, this))
                return this[i];

        return def == null ? null : def;
    };

    lq.last = function (predicate, def) {
        var l = this.length;
        if (!predicate) return l ? this[l - 1] : def == null ? null : def;
        while (l-- > 0)
            if (predicate(this[l], l, this))
                return this[l];

        return def == null ? null : def;
    };

    lq.union = function (arr) {
        return this.concat(arr).distinct();
    };

    lq.intersect = function (arr, comparer) {
        comparer = comparer || DefaultEqualityComparer;
        return this.distinct(comparer).where(function (t) {
            return arr.contains(t, comparer);
        });
    };

    lq.except = function (arr, comparer) {
        if (!(arr instanceof Array)) arr = [arr];
        comparer = comparer || DefaultEqualityComparer;
        var l = this.length;
        var res = [];
        for (var i = 0; i < l; i++) {
            var k = arr.length;
            var t = false;
            while (k-- > 0) {
                if (comparer(this[i], arr[k]) === true) {
                    t = true;
                    break;
                }
            }
            if (!t) res.push(this[i]);
        }
        return res;
    };

    lq.distinct = function (comparer) {
        var arr = [];
        var l = this.length;
        for (var i = 0; i < l; i++) {
            if (!arr.contains(this[i], comparer))
                arr.push(this[i]);
        }
        return arr;
    };

    lq.zip = function (arr, selector) {
        return this
            .take(Math.min(this.length, arr.length))
            .select(function (t, i) {
                return selector(t, arr[i]);
            });
    };

    lq.indexOf = Array.prototype.indexOf || function (o, index) {
        var l = this.length;
        for (var i = Math.max(Math.min(index, l), 0) || 0; i < l; i++)
            if (this[i] === o) return i;
        return -1;
    };

    lq.lastIndexOf = Array.prototype.lastIndexOf || function (o, index) {
        var l = Math.max(Math.min(index || this.length, this.length), 0);
        while (l-- > 0)
            if (this[l] === o) return l;
        return -1;
    };

    lq.remove = function (item) {
        var i = this.indexOf(item);
        if (i != -1)
            this.splice(i, 1);
    };

    lq.removeAll = function (predicate) {
        var item;
        var i = 0;
        while ((item = this.first(predicate)) != null) {
            i++;
            this.remove(item);
        }

        return i;
    };

    lq.orderBy = function (selector, comparer) {
        comparer = comparer || DefaultSortComparer;
        var arr = this.slice(0);
        var fn = function (a, b) {
            return comparer(selector(a), selector(b));
        };

        arr.thenBy = function (selector, comparer) {
            comparer = comparer || DefaultSortComparer;
            return arr.orderBy(DefaultSelector, function (a, b) {
                var res = fn(a, b);
                return res === 0 ? comparer(selector(a), selector(b)) : res;
            });
        };

        arr.thenByDescending = function (selector, comparer) {
            comparer = comparer || DefaultSortComparer;
            return arr.orderBy(DefaultSelector, function (a, b) {
                var res = fn(a, b);
                return res === 0 ? -comparer(selector(a), selector(b)) : res;
            });
        };

        return arr.sort(fn);
    };

    lq.orderByDescending = function (selector, comparer) {
        comparer = comparer || DefaultSortComparer;
        return this.orderBy(selector, function (a, b) { return -comparer(a, b) });
    };

    lq.innerJoin = function (arr, outer, inner, result, comparer) {
        comparer = comparer || DefaultEqualityComparer;
        var res = [];

        this.forEach(function (t) {
            arr.where(function (u) {
                return comparer(outer(t), inner(u));
            })
            .forEach(function (u) {
                res.push(result(t, u));
            });
        });

        return res;
    };

    lq.groupJoin = function (arr, outer, inner, result, comparer) {
        comparer = comparer || DefaultEqualityComparer;
        return this
            .select(function (t) {
                var key = outer(t);
                return {
                    outer: t,
                    inner: arr.where(function (u) { return comparer(key, inner(u)); }),
                    key: key
                };
            })
            .select(function (t) {
                t.inner.key = t.key;
                return result(t.outer, t.inner);
            });
    };

    lq.groupBy = function (selector, comparer) {
        var grp = [];
        var l = this.length;
        comparer = comparer || DefaultEqualityComparer;
        selector = selector || DefaultSelector;

        for (var i = 0; i < l; i++) {
            var k = selector(this[i]);
            var g = grp.first(function (u) { return comparer(u.key, k); });

            if (!g) {
                g = [];
                g.key = k;
                grp.push(g);
            }

            g.push(this[i]);
        }
        return grp;
    };

    lq.toDictionary = function (keySelector, valueSelector) {
        var o = {};
        var l = this.length;
        while (l-- > 0) {
            var key = keySelector(this[l]);
            if (key == null || key == "") continue;
            o[key] = valueSelector(this[l]);
        }
        return o;
    };


    // Aggregates

    lq.aggregate = Array.prototype.reduce || function (func, seed) {
        var arr = this.slice(0);
        var l = this.length;
        if (seed == null) seed = arr.shift();

        for (var i = 0; i < l; i++)
            seed = func(seed, arr[i], i, this);

        return seed;
    };

    lq.min = function (s) {
        s = s || DefaultSelector;
        var l = this.length;
        var min = s(this[0]);
        while (l-- > 0)
            if (s(this[l]) < min) min = s(this[l]);
        return min;
    };

    lq.max = function (s) {
        s = s || DefaultSelector;
        var l = this.length;
        var max = s(this[0]);
        while (l-- > 0)
            if (s(this[l]) > max) max = s(this[l]);
        return max;
    };

    lq.sum = function (s) {
        s = s || DefaultSelector;
        var l = this.length;
        var sum = 0;
        while (l-- > 0) sum += s(this[l]);
        return sum;
    };

    // Predicates

    lq.where = Array.prototype.filter || function (predicate, context) {
        context = context || window;
        var arr = [];
        var l = this.length;
        for (var i = 0; i < l; i++)
            if (predicate.call(context, this[i], i, this) === true) arr.push(this[i]);
        return arr;
    };

    lq.any = function (predicate, context) {
        context = context || window;
        var f = this.some || function (p, c) {
            var l = this.length;
            if (!p) return l > 0;
            while (l-- > 0)
                if (p.call(c, this[l], l, this) === true) return true;
            return false;
        };
        return f.apply(this, [predicate, context]);
    };

    lq.all = function (predicate, context) {
        context = context || window;
        predicate = predicate || DefaultPredicate;
        var f = this.every || function (p, c) {
            return this.length == this.where(p, c).length;
        };
        return f.apply(this, [predicate, context]);
    };

    lq.takeWhile = function (predicate) {
        predicate = predicate || DefaultPredicate;
        var l = this.length;
        var arr = [];
        for (var i = 0; i < l && predicate(this[i], i) === true ; i++)
            arr.push(this[i]);

        return arr;
    };

    lq.skipWhile = function (predicate) {
        predicate = predicate || DefaultPredicate;
        var l = this.length;
        var i = 0;
        for (i = 0; i < l; i++)
            if (predicate(this[i], i) === false) break;

        return this.skip(i);
    };

    lq.contains = function (o, comparer) {
        comparer = comparer || DefaultEqualityComparer;
        var l = this.length;
        while (l-- > 0)
            if (comparer(this[l], o) === true) return true;
        return false;
    };

    // Iterations

    lq.forEach = Array.prototype.forEach || function (callback, context) {
        context = context || window;
        var l = this.length;
        for (var i = 0; i < l; i++)
            callback.call(context, this[i], i, this);
    };

    lq.defaultIfEmpty = function (val) {
        return this.length == 0 ? [val == null ? null : val] : this;
    };


    Array.range = function (start, count) {
        var arr = [];
        while (count-- > 0) {
            arr.push(start++);
        }
        return arr;
    };

 // added by harshad 

 lq.main = function (obj, start, count) {
         if (_isArray(obj)) {
            var arr = [];
            while (count-- > 0) {
                arr.push(start++);
            }
            return arr;
         } else
             return obj;
    };

    lq.range = function (obj, start, count) {
         if (_isArray(obj)) {
            var arr = [];
            while (count-- > 0) {
                arr.push(start++);
            }
            return arr;
         } else
             return obj;
    };


   
    lq.unique = function (obj, selector, context) {
        var arr = [];
        if (_isArray(obj)) {

            var length = obj.length;

            for (var i = 0; i < length; i++) {
                var currentValue = obj[i];
                var isPresent = false;
                for (var j = 0 ; j < arr.length; j++) {
                    if (currentValue === arr[j]) {
                        isPresent = true;
                        break;
                    }
                }
                if (!isPresent)
                    arr.push(obj[i]);
            }
            return arr;
        } else
            return obj;
    };

    if (typeof define == 'function' && define.amd) {
        define('linq', [], function () {
            return lq;
        });
    }



})();