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
app.controller('FeedbackController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.isMobile = function () {
        return window.isMobile();
    };
}]);