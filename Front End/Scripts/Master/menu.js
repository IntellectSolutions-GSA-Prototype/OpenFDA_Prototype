$(function () {
    var icon = $('.site-menu-mobile-icon'),
        menu = $('.site-menu'),
        iconDefaultLeft = icon.position().left,
        menuDefaultLeft = menu.position().left,
        offset = 10,
        delay = 200,
        speed = 'fast';
    function close() {
        var left = menu.position().left;
        var degree;
        if (left >= 0) {
            menu.stop().animate({
                left: menuDefaultLeft + 'px'
            }, speed);
            setTimeout(function () {
                icon.stop().animate({
                    left: iconDefaultLeft + 'px'
                }, {
                    step: function (now, fx) {
                        degree = now * 1.71428571429;
                        $(this).css('-webkit-transform', 'rotate(' + degree + 'deg)');
                        $(this).css('-moz-transform', 'rotate(' + degree + 'deg)');
                        $(this).css('transform', 'rotate(' + degree + 'deg)');
                    },
                    complete: function () {
                        degree = 360;
                        $(this).css('-webkit-transform', 'rotate(' + degree + 'deg)');
                        $(this).css('-moz-transform', 'rotate(' + degree + 'deg)');
                        $(this).css('transform', 'rotate(' + degree + 'deg)');
                    }
                }, speed);
            }, delay);
        }
    }
    function open() {
        var left = menu.position().left;
        var degree;
        if (left < 0) {
            icon.stop().animate({
                left: 200 + offset + 'px',
            }, {
                step: function (now, fx) {
                    degree = now * 1.71428571429;
                    $(this).css('-webkit-transform', 'rotate(' + degree + 'deg)');
                    $(this).css('-moz-transform', 'rotate(' + degree + 'deg)');
                    $(this).css('transform', 'rotate(' + degree + 'deg)');
                }
            }, speed);
            setTimeout(function () {
                menu.stop().animate({
                    left: '0px'
                }, speed);
            }, delay);
        }
    }
    icon.click(function () {
        var left = menu.position().left;
        if (left < 0) {
            open();
        } else {
            close();
        }
    });
    window.$menu = {
        open: function () {
            open();
        },
        close: function () {
            close();
        }
    };
});