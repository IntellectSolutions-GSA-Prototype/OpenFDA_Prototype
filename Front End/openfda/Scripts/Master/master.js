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
    Questions/Comments: jacobheater@gmail.com
}
****************************************************************************
*****************************************************************************
*****************************************************************************/
(function (window, document, undefined) {
    if (window.location.href.indexOf('index.html') > -1) {
        window.location.href = "/";
    }
    window.isMobile = function () {
        return $('#mobilify').css('display') !== "none";
    };
    window.setPageTitle = function (titleText) {
        document.getElementsByTagName('title')[0].innerText = titleText;
    };
})(window, document, undefined);