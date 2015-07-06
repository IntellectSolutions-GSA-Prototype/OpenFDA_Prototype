/****************************************************************************
*****************************************************************************
*****************************************************************************
{
    Summary: FoodSearchController.js - Summary
    Author: Jacob Heater,
    Questions/Comments: jacobheater@gmail.com
}
****************************************************************************
*****************************************************************************
*****************************************************************************/
app.controller('FoodSearchController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.setPageTitle = function () {
        window.setPageTitle('ADERS');
    };
    this.title = "Food Recall Search";
    this.context = "Food Recalls";
}]);