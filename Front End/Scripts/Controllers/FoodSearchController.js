app.controller('FoodSearchController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.setPageTitle = function () {
        window.setPageTitle('openFDA Food Recall Search');
    };
    this.title = "Food Recall Search";
    this.context = "Food Recalls";
}]);