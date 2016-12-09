
define([
    'lq'
], function(lq) {
    'use strict';
    
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


});