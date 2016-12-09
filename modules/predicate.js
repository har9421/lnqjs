
define([
    'lq'
], function(lq) {
    'use strict';

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
    
});