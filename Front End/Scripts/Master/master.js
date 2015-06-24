(function (window, document, undefined) {
    window.setPageTitle = function (titleText) {
        document.getElementsByTagName('title')[0].innerText = titleText;
    }
    window.isMobile = $('#mobilify').css('display') !== "none";
})(window, document, undefined);