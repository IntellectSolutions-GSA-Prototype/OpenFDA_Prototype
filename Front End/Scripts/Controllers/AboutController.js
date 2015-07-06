/****************************************************************************
*****************************************************************************
*****************************************************************************
{
    Summary: AboutController.JS - 
    Author: Jacob Heater,
    Dependencies: ExoTools.JS & ExoTools.Collections.JS, 
    Questions/Comments: jacobheater@gmail.com
}
****************************************************************************
*****************************************************************************
*****************************************************************************/
app.controller('AboutController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.isMobile = function () {
        return window.isMobile();
    };
}]);