(function (global) {
    //Enum class that will contain enum members
    var Enum = exoTools.$class('Enum', function (members) {
        var $this = this;
        if (typeof members === 'object') {
            exoTools.enumerateObject(members, function (key, value) {
                var member = value;
                if (typeof member.Index !== 'undefined' && typeof member.Value !== 'undefined') {
                    $this[key] = member;
                }
            });
            this.findIndex = function (val) {
                var index = null;
                exoTools.enumerateObject(this, function (key, value) {
                    if (value.isClass === true && value.is(EnumMember)) {
                        if (val === value.Value) {
                            index = value.Index;
                        }
                    }
                });
                return index;
            };
            this.findValue = function (idx) {
                var _value = null;
                var _idx = exoTools.isNumber(idx) ? idx : exoTools.convert.toNumber(idx);
                exoTools.enumerateObject(this, function (key, value) {
                    if (value.isClass === true && value.is(EnumMember)) {
                        if (_idx === value.Index) {
                            _value = value.Value;
                        }
                    }
                });
                return _value;
            };
        }
    });
    //Enum member class to populate the enum class with
    var EnumMember = exoTools.$class('EnumMember', function (index, value) {
        this.Index = index !== undefined ? index : null;
        this.Value = value !== undefined ? value : null;
        this.toString = function () {
            return this.Value;
        };
        this.toNumber = function () {
            return this.Index;
        };
    });
    //Query class that will contain query parameters
    var Query = exoTools.$class('Query', function (queryParams) {
        this.QueryParameters = exoTools.extend({
            drugType: new EnumMember(),
            drugSource: new EnumMember(),
            drugName: null,
            filterIndex: null,
            queryType: 3
        }, queryParams);
    });
    global.Enum = Enum;
    global.EnumMember = EnumMember;
    global.Query = Query;
})(this);