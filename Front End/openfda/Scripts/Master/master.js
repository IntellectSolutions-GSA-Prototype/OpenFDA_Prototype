//Helper methods for the application.
(function (window, document, undefined) {
    //Clean up extension for angular routing and prettifying the route.
    if (window.location.href.indexOf('index.html') > -1) {
        window.location.href = "/";
    }
    //Is the application is mobile mode.
    window.isMobile = function () {
        return $('#mobilify').css('display') !== "none";
    };
    //Set the title element of the application.
    window.setPageTitle = function (titleText) {
        document.getElementsByTagName('title')[0].innerText = titleText;
    };
})(window, document, undefined);