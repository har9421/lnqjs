
define([
    'lq'
], function(lq) {
    'use strict';
    
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


});