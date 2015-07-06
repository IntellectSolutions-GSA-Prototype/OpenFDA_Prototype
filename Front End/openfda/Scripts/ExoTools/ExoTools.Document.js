/****************************************************************************
*****************************************************************************
*****************************************************************************
{
    Summary: ExoTools.Document.JS - An extension of the ExoTools.JS library that offers a
             high-level API for working with the DOM and selecting HTML elements on the page.
             It makes cross-browser compatibility a non-issue and traversing the DOM easier than
             ever because of the utilization of the ExoTools.Collections.JS library for quickly
             filtering through DOM elements.
    Author: Jacob Heater,
    Dependencies: ExoTools.JS & ExoTools.Collections.JS, 
    License: Open Source under MIT License @ https://github.com/JacobHeater/ExoTools.js/blob/Version-2.0/LICENSE,
    Questions/Comments: jacobheater@gmail.com
}
****************************************************************************
*****************************************************************************
*****************************************************************************/
(function (exoTools, window, document, undefined) {
    exoTools.window = {
        location: {
            queryString: {
                get: function (key) {
                    var location = window.location,
                        search = location.search,
                        queryString = search.replace('?', exoTools.emptyString),
                        keyValuePairs = queryString.split('&'),
                        value = null;
                    if (keyValuePairs.length > 0) {
                        var enumerable = exoTools.collections.asEnumerable(keyValuePairs),
                            query = enumerable.where(function (kvp) {
                                var split = kvp.split('='),
                                    _key = split[0],
                                    _value = split[1];
                                return _key === key;
                            }).select(function (kvp) {
                                var split = kvp.split('='),
                                    _key = split[0],
                                    _value = split[1];
                                return window.unescape(_value);
                            });
                        if (query.count() > 0) {
                            value = query.first();
                        }
                    }
                    return value;
                }
            }
        }
    };
})(exoTools, window, document, undefined);