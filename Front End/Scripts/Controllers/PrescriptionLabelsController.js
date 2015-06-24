app.controller('PrescriptionLabelsController', ['$routeParams', '$http', function ($routeParams, $http) {
    this.setPageTitle = function () {
        window.setPageTitle('openFDA Prescription Labels Search');
    };
    this.title = "Prescription Search";
    this.context = "Prescription Labels";
}]);