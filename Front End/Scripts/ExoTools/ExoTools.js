/****************************************************************************
*****************************************************************************
*****************************************************************************
{
    Summary: ExoTools.JS - A comprehensive JavaScript Library for all JavaScript applications.
             The library provides a set of functionality that makes enforcing type constraints
             and creating typed classes easier. Other helper methods add value, like a string formatter
             that can replace shortcuts with actual values, a string builder for easily concatenating strings,
             among many other useful features.
    Author: Jacob Heater,
    Dependencies: None,
    Questions/Comments: jacobheater@gmail.com
}
*****************************************************************************
*****************************************************************************
*****************************************************************************/
(function (global, undefined) {
    var exoTools = {
        types: {
            fn: 'function',
            num: 'number',
            bool: 'boolean',
            obj: 'object',
            undef: 'undefined',
            string: 'string'
        },
        getType: function (obj) {
            return typeof obj;
        },
        isFunction: function (fn) {
            return this.getType(fn) === this.types.fn;
        },
        isObject: function (obj) {
            return this.getType(obj) === this.types.obj;
        },
        isNumber: function (n) {
            return this.getType(n) === this.types.num;
        },
        isBoolean: function (bool) {
            return this.getType(bool) === this.types.bool;
        },
        isString: function (str) {
            return this.getType(str) === this.types.string;
        },
        isUndefined: function (obj) {
            return this.getType(obj) === this.types.undef || obj === undefined || obj === null;
        },
        isDefined: function (obj) {
            return this.isUndefined(obj) === false;
        },
        isNull: function (obj) {
            return this.isUndefined(obj) === true;
        },
        isNotNull: function (obj) {
            return this.isNotNull(obj) === false;
        },
        canEnumerate: function (obj) {
            return this.isDefined(obj) && this.isDefined(obj.length);
        },
        isArray: function (array) {
            return this.isDefined(array) && this.isDefined(array.length) && this.isDefined(array.slice) && this.isDefined(array.pop) && this.isDefined(array.push);
        },
        isEnumerable: function (enumerable) {
            return this.isDefined(enumerable) && this.isDefined(enumerable.count) && this.isDefined(enumerable.where);
        },
        $for: function () {
            if (this.isObject(arguments[0])) {
                if (this.isArray(arguments[0]) || this.canEnumerate(arguments[0])) {
                    var array = arguments[0],
                        callback = this.isFunction(arguments[1]) ? arguments[1] : function () { };
                    for (var i = 0, len = array.length; i < len; i++) {
                        var _break = callback.call(this, i, array[i]);
                        if (_break === false) {
                            break;
                        }
                    }
                } else if (this.isEnumerable(arguments[0])) {
                    var enumerable = arguments[0],
                        callback = this.isFunction(arguments[1]) ? arguments[1] : function () { };
                    for (var i = 0, len = enumerable.count() ; i < len; i++) {
                        var _break = callback.call(this, i, enumerable.atIndex(i));
                        if (_break === false) {
                            break;
                        }
                    }
                } else {
                    var object = arguments[0],
                        callback = this.isFunction(arguments[1]) ? arguments[1] : function () { };
                    for (var key in object) {
                        var _break = callback.call(this, key, object[key]);
                        if (_break === false) {
                            break;
                        }
                    }
                }
            } else if (this.isNumber(arguments[0]) && this.isNumber(arguments[1])) {
                var n1 = arguments[0],
                    n2 = arguments[1],
                    callback = this.isFunction(arguments[2]) ? arguments[2] : function () { };
                if (n1 < n2) {
                    for (var i = n1; i < n2; i++) {
                        var _break = callback.call(this, i);
                        if (_break === false) {
                            break;
                        }
                    }
                } else if (n1 > n2) {
                    for (var i = n1; i > n2; i--) {
                        var _break = callback.call(this, i);
                        if (_break === false) {
                            break;
                        }
                    }
                }
            }
        },
        extend: function (objA, objB, isDeep) {
            var extended = objA,
                $this = this,
                _deep = this.isBoolean(isDeep) ? isDeep : false;
            if (this.isObject(objA) && this.isObject(objB)) {
                this.$for(objB, function (key, value) {
                    if ($this.isDefined(extended[key])) {
                        if ($this.isArray(extended[key]) && $this.isArray(objB[key])) {
                            if (_deep === true) {
                                $this.$for(objB[key], function (i, value) {
                                    if (extended[key].indexOf(value) < 0) {
                                        extended[key].push(value);
                                    }
                                });
                            } else {
                                extended[key] = objB[key];
                            }
                        } else if ($this.isObject(extended[key]) && $this.isObject(value)) {
                            $this.extend(extended[key], objB[key], isDeep);
                        } else {
                            extended[key] = objB[key];
                        }
                    } else {
                        extended[key] = value;
                    }
                });
            }
            return extended;
        },
        copyArray: function (source, target) {
            var _source = [],
                _target = [];
            if (this.isArray(source) && this.isArray(target)) {
                _source = source;
                _target = target;
            } else if (this.isEnumerable(source) && this.isEnumerable(target)) {
                _source = source.toArray();
                _target = target.toArray();
            } else if (this.isEnumerable(source) && this.isArray(taret)) {
                _source = source.toArray();
                _target = target;
            } else if (this.isArray(source) && this.isEnumerable(target)) {
                _source = source;
                _target = target.toArray();
            }
            return target = _target.concat(_source);
        },
        getObjectProperties: function (obj) {
            var properties = [];
            if (this.isObject(obj)) {
                this.enumerateObject(obj, function (key, value) {
                    properties.push(key);
                });
            }
            return properties;
        },
        enumerateObject: function (obj, action) {
            if (this.isObject(obj) && this.isFunction(action)) {
                for (var prop in obj) {
                    action.call(this, prop, obj[prop]);
                }
            }
        },
        areDefined: function (args) {
            var allDefined = true;
            this.$for(arguments, function (i, arg) {
                if (exoTools.isUndefined(arg)) {
                    allDefined = false;
                }
                return allDefined;
            });
            return allDefined;
        }
    };
    exoTools.extend(exoTools, {
        type: function (typeName, nativeType) {
            this.name = typeName || exoTools.emptyString;
            this.nativeType = nativeType || null;
            return this;
        },
        isClass: function (obj) {
            var value = false;
            if (exoTools.isFunction(obj)) {
                value = exoTools.isDefined(obj.prototype.isClass) && obj.prototype.isClass === true;
            } else if (exoTools.isObject(obj)) {
                value = exoTools.isDefined(obj.isClass) && obj.isClass === true;
            }
            return value;
        },
        $class: function (type, constructor, base) {
            var $this = this;
            if (this.isString(type) && this.isFunction(constructor)) {
                if (this.isFunction(base)) {
                    constructor.prototype.base = null;
                    function construct(constructor, args) {
                        var base = function () {
                            return constructor.apply(this, args);
                        };
                        base.prototype = constructor.prototype;
                        return new base();
                    }
                    constructor.prototype.initializeBase = function (params) {
                        if (arguments.length > 0) {
                            var $this = this;
                            $this.base = construct(base, arguments);
                            exoTools.enumerateObject($this.base, function (key, value) {
                                if (key !== "getType" && key !== "isClass" && key !== "is" && key !== "base" && key !== "initializeBase" && key !== 'getHashCode') {
                                    if (exoTools.isDefined($this.overrides)) {
                                        if (!exoTools.isDefined($this.overrides[key])) {
                                            $this[key] = value;
                                        }
                                    } else {
                                        $this[key] = value;
                                    }
                                }
                            });
                        }
                    };
                }
                constructor.prototype.getType = function () {
                    var _type = new exoTools.type(type, exoTools.getType(this));
                    _type.isClass = true;
                    _type.constructor = constructor;
                    if (exoTools.isDefined(this.base)) {
                        if (exoTools.isClass(this.base)) {
                            _type.baseType = this.base.getType();
                            _type.baseType.isClass = true;
                            _type.baseType.constructor = this.base.constructor;
                        } else {
                            _type.baseType = typeof this.base.constructor.prototype;
                            _type.baseType.isClass = false;
                            _type.baseType.constructor = this.base.constructor;
                        }
                    }
                    return _type;
                };
                constructor.prototype.getHashCode = function () {
                    var hashCode = 0,
                        i = 0;
                    exoTools.enumerateObject(this, function (key, value) {
                        i++;
                        hashCode += hashCode ^ i;
                        hashCode += exoTools.math.random(0, hashCode, true);
                    });
                    return hashCode;
                };
                constructor.prototype.isClass = true;
                constructor.prototype.is = function (typeName) {
                    var name = this.getType().name,
                        _typeName = exoTools.isClass(typeName) ? typeName.prototype.getType().name : typeName,
                        $this = this;
                    inheritance = name.split('<<'),
                    isTypeMatch = false;
                    if (_typeName === name) {
                        isTypeMatch = true;
                    } else if (inheritance.length > 0 && exoTools.areDefined(this.base, this.base.isClass) && exoTools.isClass(_typeName)) {
                        exoTools.$for(inheritance, function (i, value) {
                            if (_typeName.trim() === value.trim()) {
                                isTypeMatch = true;
                                return false;
                            }
                        });
                    }
                    if (isTypeMatch === false) {
                        var checkBase = function (obj) {
                            var isMatch = false;
                            if (exoTools.isDefined(obj.base)) {
                                var base = obj.base,
                                    _proto = exoTools.isFunction(_typeName) ? _typeName.prototype : exoTools.isObject(_typeName) && exoTools.areDefined(_typeName.constructor, _typeName.constructor.prototype) ? _typeName.constructor.prototype : _typeName,
                                    baseProto = exoTools.isObject(base) && exoTools.areDefined(base.constructor, base.constructor.prototype) ? base.constructor.prototype : exoTools.isFunction(base) ? base.prototype : base;
                                if (exoTools.areDefined(base.isClass, base.getType)) {
                                    if (exoTools.isString(_proto)) {
                                        isMatch = _proto === base.getType().name;
                                    } else {
                                        isMatch = _proto === baseProto;
                                    }
                                } else {
                                    isMatch = _proto === baseProto;
                                }
                                if (!isMatch) {
                                    checkBase(obj.base);
                                } else {
                                    isTypeMatch = isMatch;
                                }
                            }
                            return isMatch;
                        };
                        checkBase($this);
                    }
                    return isTypeMatch;
                };
                return constructor;
            }
            return function () { };
        },
    });
    exoTools.extend(exoTools, {
        emptyString: "",
        asyncAction: function (action) {
            this.delayedAction(0, action);
        },
        delayedAction: function (delay, action) {
            if (this.isDefined(global.setTimeout)) {
                global.setTimeout(action, delay);
            }
        },
        stopInterval: function (interval) {
            if (exoTools.isNotNull(interval) && exoTools.isFunction(global.clearInterval)) {
                global.clearInterval(interval);
            }
            return this;
        },
        intervalAction: function (interval, action) {
            if (this.isDefined(global.setInterval) && this.isFunction(action)) {
                var $this = this,
                    timerId = global.setInterval(function () {
                        action.call($this, function () {
                            global.clearInterval(timerId);
                        })
                    }, interval);
            }
        },
        keyValuePair: exoTools.$class('exoTools.keyValuePair', function (key, value) {
            this.key = exoTools.isDefined(key) ? key : exoTools.emptyString;
            this.value = exoTools.isDefined(value) ? value : null;
            return this;
        }),
        stringFormatter: function (format, args) {
            var result = format,
                _args = arguments,
                token = {
                    left: '{',
                    right: '}'
                };
            if (this.isString(format)) {
                this.$for(_args, function (i) {
                    result = result.replace(token.left + i + token.right, exoTools.isDefined(_args[i + 1]) ? (_args[i + 1]).toString() : exoTools.emptyString);
                });
            }
            return result;
        },
        stringBuilder: exoTools.$class('exoTools.stringBuilder', function (init) {
            var $this = this,
                cache = exoTools.isString(init) ? [init] : exoTools.isDefined(init) ? [init.toString()] : [],
                doActionOnItem = function (string, action) {
                    if (exoTools.isString(action) && exoTools.isDefined(string)) {
                        var _string = exoTools.emptyString;
                        if (exoTools.isString(string)) {
                            _string = string;
                        } else {
                            _string = string.toString();
                        }
                        if (_string !== exoTools.emptyString) {
                            cache[action](_string);
                            lastItem = _string;
                        }
                    }
                };
            lastItem = null;
            this.append = function (string) {
                doActionOnItem(string, 'push');
                return this;
            };
            this.prepend = function (string) {
                doActionOnItem(string, 'unshift');
                return this;
            };
            this.clear = function () {
                cache.length = 0;
                lastItem = null;
                return this;
            };
            this.toString = function () {
                return cache.join('');
            };
            this.removeFirst = function () {
                cache.splice(0, 1);
                return this;
            };
            this.removeLast = function () {
                if (cache.length > 0) {
                    cache.splice(cache.length - 1, 1);
                }
                return this;
            };
        }),
        GUID: {
            create: function () {
                var d = new Date().getTime(),
                    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = (d + Math.random() * 16) % 16 | 0;
                        d = Math.floor(d / 16);
                        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                    });
                return uuid;
            },
            isGuid: function (string) {
                if (exoTools.isString(string)) {
                    var split = string.split('-'),
                        isGuid = true;
                    if (split.length === 5) {
                        var checkSplitLength = function (index, length) {
                            return split[index].length === length;
                        };
                        if ((checkSplitLength(0, 8) && checkSplitLength(1, 4) && checkSplitLength(2, 4) && checkSplitLength(3, 4) && checkSplitLength(4, 12)) === false) {
                            isGuid = false;
                        }
                    } else {
                        isGuid = false;
                    }
                    return isGuid;
                }
                return false;
            },
            $default: '00000000-0000-0000-0000-000000000000'
        },
        toJson: function (object) {
            if (exoTools.areDefined(JSON, JSON.stringify)) {
                return JSON.stringify(object, arguments[1], arguments[2]);
            }
            return object;
        },
        parseJson: function (jsonString) {
            if (exoTools.areDefined(JSON, JSON.stringify)) {
                return JSON.parse(jsonString, arguments[1]);
            }
            return jsonString;
        },
        convert: {
            toFloat: function (value) {
                if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) {
                    return Number(value);
                }
                return NaN;
            },
            toNumber: function (value) {
                if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value)) {
                    return Number(value);
                }
                return NaN;
            },
            toString: function (value) {
                return exoTools.stringFormatter("{0}", value);
            },
            toBoolean: function (value) {
                var outValue = false;
                if (exoTools.isString(value)) {
                    var trim = value.trim();
                    if (value === 'true') {
                        outValue = true;
                    } else if (value === 'false') {
                        outValue = false;
                    }
                } else {
                    outValue = new Boolean(value).valueOf();
                }
                return outValue;
            },
            toObject: function (value) {
                return new Object(value).valueOf();
            }
        },
        keyCodeMap: {
            Backspace: 8,
            Space: 32,
            Tab: 9,
            Enter: 13,
            Shift: 16,
            Ctrl: 17,
            Alt: 18,
            PauseBreak: 19,
            CapsLock: 20,
            Esc: 27,
            PgUp: 33,
            PgDn: 34,
            End: 35,
            Home: 36,
            LeftArrow: 37,
            UpArrow: 38,
            RightArrow: 39,
            DownArrow: 40,
            Insert: 45,
            Delete: 46,
            zero: 48,
            one: 49,
            two: 50,
            three: 51,
            four: 52,
            five: 53,
            six: 54,
            seven: 55,
            eight: 56,
            nine: 57,
            a: 65,
            b: 66,
            c: 67,
            d: 68,
            e: 69,
            f: 70,
            g: 71,
            h: 72,
            i: 73,
            j: 74,
            k: 75,
            l: 76,
            m: 77,
            n: 78,
            o: 79,
            p: 80,
            q: 81,
            r: 82,
            s: 83,
            t: 84,
            u: 85,
            v: 86,
            w: 87,
            x: 88,
            y: 89,
            z: 90,
            LeftWindowsKey: 91,
            RightWindowsKey: 92,
            SelectKey: 93,
            NumLock0: 96,
            NumLock1: 97,
            NumLock2: 98,
            NumLock3: 99,
            NumLock4: 100,
            NumLock5: 101,
            NumLock6: 102,
            NumLock7: 103,
            NumLock8: 104,
            NumLock9: 105,
            Multiply: 106,
            Add: 107,
            Subtract: 109,
            DecimalPoint: 110,
            Divide: 111,
            F1: 112,
            F2: 113,
            F3: 114,
            F4: 115,
            F5: 116,
            F6: 117,
            F7: 118,
            F8: 119,
            F9: 120,
            F10: 121,
            F11: 122,
            F12: 123,
            NumLock: 144,
            ScrollLock: 145,
            SemiColon: 186,
            EqualSign: 187,
            Comma: 188,
            Dash: 189,
            Period: 190,
            FowardSlash: 191,
            GraveAccent: 192,
            OpenBracket: 219,
            BackSlash: 220,
            CloseBracket: 221,
            SingleQuote: 222,
            fromKeyCode: function (keyCode) {
                var value = null;
                if (exoTools.isNumber(keyCode)) {
                    exoTools.enumerateObject(this, function (k, v) {
                        if (v === keyCode) {
                            value = k;
                            return false;
                        }
                    });
                }
                return value;
            }
        },
        math: {
            random: function (min, max, round) {
                var _min = exoTools.isNumber(min) ? min : 0,
                    _max = exoTools.isNumber(max) ? max : 0,
                    _round = exoTools.isBoolean(round) ? round : false,
                    _random = 0;
                if (_max !== _min) {
                    if (_round === true) {
                        _random = Math.floor(Math.random() * (_max - _min)) + _min;
                    } else {
                        _random = Math.random() * (_max - _min) + _min;
                    }
                } else {
                    _random = Math.random();
                }
                return _random;
            }
        },
        exception: exoTools.$class('exoTools.exception << Error', function (message, nativeError) {
            this.initializeBase(message);
            this.error = nativeError;
        }, Error),
        tryCatch: function (action, onError) {
            if (exoTools.isFunction(action)) {
                try {
                    action.call(this);
                } catch (error) {
                    var exception = new exoTools.exception(error.message, error);
                    if (exoTools.isFunction(onError)) {
                        onError.call(this, exception);
                    }
                    if (exoTools.isFunction(exoTools.tryCatch.errorHandler)) {
                        exoTools.tryCatch.errorHandler.call(this, exception);
                    }
                }
            }
        },
        flattenArray: function (array) {
            var _array = exoTools.isEnumerable(array) ? array.toArray() : array;
            if (exoTools.isArray(_array)) {
                var flattened = [],
                   flattener = function (a) {
                       exoTools.$for(a, function (i, value) {
                           if (exoTools.isArray(value)) {
                               flattener(value);
                           } else {
                               flattened.push(value);
                           }
                       });
                   };
                flattener(_array);
                return flattened;
            }
            return [];
        }
    });
    exoTools.tryCatch.errorHandler = function (exception) {
        if (exoTools.areDefined(console, console.error)) {
            console.error(exception);
        } else if (exoTools.areDefined(console, console.log)) {
            console.log(exception);
        }
    };
    global.exoTools = global.$e = exoTools;
})(this, undefined);