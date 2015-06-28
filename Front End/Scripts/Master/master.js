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