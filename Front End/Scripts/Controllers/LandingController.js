/****************************************************************************
*****************************************************************************
*****************************************************************************
{
    Summary: LandingController.JS - 
    Author: Jacob Heater,
    Questions/Comments: jacobheater@gmail.com
}
****************************************************************************
*****************************************************************************
*****************************************************************************/
app.controller('LandingController', ['$routeParams', '$http', '$log', function ($routeParams, $http, $log) {
    this.setPageTitle = function () {
        window.setPageTitle('ADERS');
    };
    this.isMobile = function () {
        return window.isMobile();
    };
}]);