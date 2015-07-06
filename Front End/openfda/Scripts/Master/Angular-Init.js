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
var app = angular.module('OpenFDAPrototype', ['ngRoute']);
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    var urlFormat = "/Views/{0}";
    var createUrl = function (viewName) {
        return exoTools.stringFormatter(urlFormat, viewName);
    };
    $routeProvider.when('/', {
        templateUrl: createUrl('Landing.html'),
        controller: 'LandingController',
        controllerAs: 'landing'
    }).when('/Search', {
        templateUrl: createUrl('Search.html'),
        controller: 'SearchController',
        controllerAs: 'search'
    }).when('/Legal', {
        templateUrl: createUrl('Legal.html'),
        controller: 'LegalController',
        controllerAs: 'legal'
    }).when('/Privacy', {
        templateUrl: createUrl('Privacy.html'),
        controller: 'PrivacyController',
        controllerAs: 'privacy'
    }).when('/Disclosure', {
        templateUrl: createUrl('Disclosure.html'),
        controller: 'DisclosureController',
        controllerAs: 'disclosure'
    }).when('/Feedback', {
        templateUrl: createUrl('Feedback.html'),
        controller: 'FeedbackController',
        controllerAs: 'feedback'
    }).when('/About', {
        templateUrl: createUrl('About.html'),
        controller: 'AboutController',
        controllerAs: 'about'
    }).when('/Video', {
        templateUrl: createUrl('Video.html'),
        controller: 'VideoController',
        controllerAs: 'video'
    });
}]);
var menuItem = exoTools.$class('Prototype.MenuItem', function (text, url, isLogo, show, classes) {
    this.text = text;
    this.url = url;
    this.isLogo = isLogo;
    this.isImage = false;
    this.show = show;
    this.classes = classes || '';
});
var imageMenuItem = exoTools.$class('Prototype.ImageMenuItem', function (src, alt, url, isLogo, show, classes) {
    this.initializeBase('', url, isLogo, show, classes);
    this.src = src;
    this.alt = alt;
    this.isImage = true;
}, menuItem);
app.controller('MainController', ['$route', '$routeParams', '$location', '$scope', function ($route, $routeParams, $location, $scope) {
    this.$route = $route;
    this.$routeParams = $routeParams;
    this.$location = $location;
    this.closeMenu = function () {
        window.$menu.close();
        this.setPageTitle();
    };
    this.isMobile = function () {
        return window.isMobile();
    };
    this.setPageTitle = function () {
        window.setPageTitle('ADERS');
    };
    this.menuItems = [
        new imageMenuItem('/Images/Aders-v3_34wide-Sml.png', 'Open FDA Logo', '/#/', true, true, 'ADERSlogo'),
        new menuItem('Home', '/#/', false, true),
        new menuItem('Our Solution', '#/Video', false, true),
        new menuItem('Drug Search', '#/Search', false, true),
        new menuItem('Feedback', '#/Feedback', false, true),
        new menuItem('About Us', '#/About', false, true),
        new menuItem('Beta Disclosure', '#/Disclosure', false, this.isMobile(), 'beta-menu')
    ];
}]);