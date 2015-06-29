/****************************************************************************
*****************************************************************************
*****************************************************************************
{
    Summary: ExoTools.Collections.JS - An extension of the ExoTools.JS library that offers
             a high-level abstraction of collections that work off of native JavaScript arrays.
             The common exoTools.collections.enumerable interface provides a standarized API
             similar to C#'s LINQ API for manipulating datasets in JS arrays.,
    Author: Jacob Heater,
    Dependencies: ExoTools.JS,
    Questions/Comments: jacobheater@gmail.com
}
****************************************************************************
*****************************************************************************
*****************************************************************************/
(function (exoTools) {
    exoTools.collections = {
        enumerable: exoTools.$class('exoTools.collections.enumerable', function (array) {
            var copy = array || [],
                $this = this,
                renderEnumerable = function (_array_) {
                    return exoTools.collections.asEnumerable(_array_);
                },
                indexer = 0;
            if (exoTools.isObject(copy) && !exoTools.isArray(copy) && !exoTools.canEnumerate(copy)) {
                var _temp = [];
                exoTools.enumerateObject(copy, function (key, value) {
                    var keyValuePair = new exoTools.keyValuePair(key, value);
                    _temp.push(keyValuePair);
                });
                copy = _temp;
            } else if (exoTools.canEnumerate(copy)) {
                var _temp = [];
                exoTools.$for(copy, function (index, value) {
                    _temp.push(value);
                });
                copy = _temp;
            }
            this.where = function (predicate) {
                var worker = [],
                    fn = exoTools.isFunction(predicate) ? predicate : function () { return false; };
                this.forEach(function (i, value) {
                    if (fn(value) === true) {
                        worker.push(value);
                    }
                });
                return renderEnumerable(worker);
            };
            this.orderBy = function (predicate) {
                var worker = copy,
                    fn = exoTools.isFunction(predicate) ? predicate : function () { return false; },
                    sorted = worker.sort(fn);
                return renderEnumerable(sorted);
            };
            this.groupBy = function (predicate) {
                var worker = copy,
                    fn = exoTools.isFunction(predicate) ? predicate : function () { },
                    groups = [];
                this.forEach(function (i, item) {
                    if (groups.length === 0) {
                        groups.push([item]);
                    } else {
                        var query = exoTools.collections.asEnumerable(groups).where(function (g) {
                            return exoTools.collections.asEnumerable(g).where(function (inner) {
                                return fn.call(this, inner) === fn.call(this, item);
                            }).count() > 0;
                        });
                        if (query.count() === 1) {
                            query.first().push(item);
                        } else {
                            groups.push([item]);
                        }
                    }
                });
                return exoTools.collections.asEnumerable(groups).select(function (inner) {
                    return exoTools.collections.asEnumerable(inner);
                });
            };
            this.contains = function (item) {
                return this.indexOf(item) > -1;
            };
            this.take = function (count, endIndex) {
                var worker = copy,
                    base = exoTools.isNumber(count) ? count : 0,
                    trimmed = exoTools.isDefined(endIndex) ? worker.slice(base, endIndex) : worker.slice(0, base);
                return renderEnumerable(trimmed);
            };
            this.select = function (selector) {
                var worker = [],
                    fn = exoTools.isFunction(selector) ? selector : function () { return false; };
                this.forEach(function (i, value) {
                    var selected = fn(value);
                    if (exoTools.isDefined(selected)) {
                        worker.push(selected);
                    }
                });
                return renderEnumerable(worker);
            };
            this.first = function (filter) {
                if (exoTools.isFunction(filter)) {
                    return this.where(filter).atIndex(0);
                }
                return this.atIndex(0);
            };
            this.count = function () {
                return copy.length;
            };
            this.last = function (filter) {
                if (exoTools.isFunction(filter)) {
                    var filtered = this.where(filter);
                    return filtered.atIndex(filtered.count() - 1);
                }
                return this.atIndex(this.count() - 1);
            };
            this.reverse = function () {
                return renderEnumerable(copy.reverse());
            };
            this.atIndex = function (index) {
                var result = null;
                if (exoTools.isNumber(index)) {
                    result = copy[index];
                }
                return result;
            };
            this.indexOf = function (obj) {
                return copy.indexOf(obj);
            };
            this.toArray = function () {
                return copy.slice(0);
            };
            this.flatten = function () {
                return renderEnumerable(exoTools.flattenArray(copy));
            };
            this.toList = function () {
                return new exoTools.collections.list(this.toArray());
            };
            this.toDictionary = function (keySelector) {
                var worker = [];
                if (exoTools.isFunction(keySelector)) {
                    this.forEach(function (i, item) {
                        var key = keySelector.call(this, item),
                            value = item,
                            keyValuePair = new exoTools.keyValuePair(key, value);
                        worker.push(keyValuePair);
                    });
                } else {
                    this.forEach(function (i, item) {
                        if (exoTools.areDefined(item, item.key, item.value)) {
                            worker.push(new exoTools.keyValuePair(item.key, item.value));
                        }
                    });
                }
                return new exoTools.collections.dictionary(worker);
            };
            this.toStack = function () {
                return new exoTools.collections.stack(this.toArray());
            };
            this.toQueue = function () {
                return new exoTools.collections.queue(this.toArray());
            };
            this.remove = function (item) {
                var index = this.indexOf(item);
                if (index > -1) {
                    copy.splice(index, 1);
                }
                return renderEnumerable(copy);
            };
            this.forEach = function (action) {
                fn = exoTools.isFunction(action) ? action : function () { };
                exoTools.$for(copy, fn);
                return this;
            };
            this.current = function () {
                return this.atIndex(indexer);
            };
            this.next = function () {
                indexer = (indexer + 1) < this.count() ? indexer + 1 : this.count();
            };
            this.previous = function () {
                indexer = (indexer - 1) > 0 ? indexer - 1 : indexer;
            };
            this.canEnumerate = function () {
                return indexer < this.count();
            };
            this.preview = this.toArray();
            this.copyTo = function (target) {
                var copy = exoTools.copyArray($this.toArray(), target);
                return exoTools.collections.asEnumerable(copy);
            };
            this.clear = function () {
                copy.length = 0;
                return renderEnumerable(copy);
            };
        }),
        asEnumerable: function (array) {
            var _enumerable = null;
            if (exoTools.isArray(array) || exoTools.isObject(array)) {
                _enumerable = new exoTools.collections.enumerable(array);
            } else if (exoTools.isClass(array) && array.is(exoTools.collections.enumerable)) {
                _enumerable = new exoTools.collections.enumerable(array.toArray());
            }
            return _enumerable;
        }
    };
    exoTools.extend(exoTools.collections, {
        list: exoTools.$class('exoTools.collections.list << exoTools.collections.enumerable', function (init) {
            var base = exoTools.isEnumerable(init) ? init.toArray() : exoTools.isArray(init) ? init : [],
                $this = this,
                postInvoke = function () {
                    $this.initializeBase(base);
                    $this.preview = $this.base.preview;
                };
            this.overrides = {
                clear: 'clear'
            };
            this.initializeBase(base);
            this.asEnumerable = function () {
                return exoTools.collections.asEnumerable(base);
            };
            this.add = function (item) {
                base.push(item);
                postInvoke();
                return this;
            };
            this.remove = function (item) {
                base = this.asEnumerable().remove(item).toArray();
                postInvoke();
                return this;
            };
            this.clear = function () {
                base = this.asEnumerable().clear().toArray();
                postInvoke();
                return this;
            };
            this.preview = this.asEnumerable().preview;
        }, exoTools.collections.enumerable),
        dictionary: exoTools.$class('exoTools.collections.dictionary << exoTools.collections.enumerable', function (init) {
            var container = exoTools.isDefined(init) && init.isClass === true && init.is(exoTools.collections.enumerable) ? init.toArray() : exoTools.isArray(init) ? init : [],
                $this = this,
                postInvoke = function () {
                    $this.preview = $this.asEnumerable().preview;
                    $this.initializeBase(container);
                };
            this.initializeBase(container);
            this.add = function (key, value) {
                var keyValuePair;
                if (arguments.length === 1 && exoTools.isClass(arguments[0]) && arguments[0].is(exoTools.keyValuePair)) {
                    var properties = exoTools.getObjectProperties(arguments[0]);
                    keyValuePair = new exoTools.keyValuePair(arguments[0][properties[0]], arguments[0][properties[1]]);
                } else if (arguments.length === 2) {
                    keyValuePair = new exoTools.keyValuePair(arguments[0], arguments[1]);
                }
                if (exoTools.collections.asEnumerable(container).where(function (kvp) { return kvp.key === keyValuePair.key; }).count() === 0) {
                    container.push(keyValuePair);
                }
                postInvoke();
                return this;
            };
            this.get = function (key) {
                return this.where(function (kvp) { return kvp.key === key; }).first();
            };
            this.remove = function (key) {
                var query = exoTools.collections.asEnumerable(container).where(function (kvp) {
                    return kvp.key === key;
                }).first();
                if (exoTools.isDefined(query)) {
                    var index = exoTools.collections.asEnumerable(container).indexOf(query)
                    container.splice(index, 1);
                }
                postInvoke();
                return this;
            };
            this.clear = function () {
                this.asEnumerable().clear();
                postInvoke();
                return this;
            };
            this.asEnumerable = function () {
                return exoTools.collections.asEnumerable(container);
            };
            this.preview = this.asEnumerable().preview;
        }, exoTools.collections.enumerable),
        stack: exoTools.$class('exoToos.collections.stack << exoTools.collections.enumerable', function (init) {
            var s = [];
            var $this = this;
            if (exoTools.isArray(arguments[0])) {
                s = arguments[0];
            } else if (exoTools.isEnumerable(arguments[0])) {
                s = arguments[0].toArray();
            }
            var postInvoke = function () {
                $this.initializeBase(s);
            };
            this.initializeBase(s);
            this.add = function (item) {
                s.push(item);
                postInvoke();
                return this;
            };
            this.next = function () {
                var value = s.pop() || null;
                postInvoke();
                return value;
            };
            this.clear = function () {
                this.asEnumerable().clear();
                postInvoke();
                return this;
            };
            this.asEnumerable = function () {
                return exoTools.collections.asEnumerable(s);
            };
            return this;
        }, exoTools.collections.enumerable),
        queue: exoTools.$class('exoTools.collections.queue << exoTools.collections.enumerable', function (init) {
            var q = [];
            var $this = this;
            if (exoTools.isArray(arguments[0])) {
                q = arguments[0];
            } else if (exoTools.isEnumerable(arguments[0])) {
                q = arguments[0].toArray();
            }
            var postInvoke = function () {
                $this.initializeBase(q);
            };
            this.initializeBase(q);
            this.add = function (item) {
                q.push(item);
                postInvoke();
                return this;
            };
            this.cut = function (item) {
                q.unshift(item);
                postInvoke();
                return this;
            };
            this.next = function () {
                var value = q.shift();
                postInvoke();
                return value;
            };
            this.clear = function () {
                this.asEnumerable().clear();
                postInvoke();
                return this;
            };
            this.asEnumerable = function () {
                return exoTools.collections.asEnumerable(q);
            };
            return this;
        }, exoTools.collections.enumerable)
    });
})(exoTools);