﻿//The feedback view controller.
app.controller('FeedbackController', ['$routeParams', '$http', function ($routeParams, $http) {
    //Indicates if the application is operating in mobile mode or not.
    this.isMobile = function () {
        return window.isMobile();
    };
}]);