//Controls the menu in mobile mode.
$(function () {
    //The menu button object.
    var icon = $('.site-menu-mobile-icon'),
        //The menu list container.
        menu = $('.site-menu'),
        //The default return position of the menu button.
        iconDefaultLeft = icon.position().left,
        //The default return position of the menu.
        menuDefaultLeft = menu.position().left,
        //The padding to add between the button and the menu
        offset = 10,
        //The delay time to animate the button after the menu has been animated.
        delay = 200,
        //The speed to animate the menu
        speed = 'fast',
        //The class name to apply to the menu
        className = '.flex-menu',
        //The distance the menu should ne animated in px
        dest = 200;
    //Closes the menu
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
    //Opens the menu
    function open() {
        var left = menu.position().left;
        var degree;
        if (left < 0) {
            icon.stop().animate({
                left: dest + offset + 'px',
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
    //Set icon event handlers.
    icon.click(function () {
        var left = menu.position().left;
        if (left < 0) {
            open();
        } else {
            close();
        }
    });
    //Expose the meny functions globally.
    window.$menu = {
        open: function () {
            open();
        },
        close: function () {
            close();
        }
    };
    //Init mouse events.
    $(document).click(function (e) {
        var $target = $(e.target);
        if (!$target.is(className)) {
            window.$menu.close();
        }
    });
});