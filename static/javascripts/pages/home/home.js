// todo: Move to another file
// using jQuery
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var userSignedUp = false;
try {
    var store = window.localStorage;
    if ('true' === store.getItem('signed_up')) {
        userSignedUp = true;
    }
} catch(e) {}

var submitEmailAddress = function(email, form) {
    $.post('/', {
        email: email,
        tagIndex: form.find('input[name="tag_index"]').val(),
        formName: form.data('name')
    }, function () {
        $('[data-remodal-id=submitFinished]').remodal({
            hashTracking: false
        }).open();
        try {
            var store = window.localStorage;
            store.setItem('signed_up', 'true');
        } catch (e) { }
        userSignedUp = true;
        $('input[name="email"]').val('');
        $('.input-enter-prompt').hide();
        // Now hide the input hint
    });
};

$(document).on('opened', '.remodal', function () {
  $(document).on('keyup', function(e) {
      console.log('keyup');
    if (e.which === 13) {
        var inst = $('[data-remodal-id=submitFinished]').remodal();
        if (inst) {
            inst.close();
        }
    }
  });
});

$(document).on('closed', '.remodal', function () {
    if (userSignedUp) {
        $('html,body').animate({ scrollTop: $('.row.old-new-compare').position().top }, 'slow');
    }
    $(document).off('keyup');
});


var isOnTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent);
var isSmallDevice = function() {
    return $(window).width() <= 480; // This is synced with includemedia.scss
};



$(document).ready(function(){


if(!isOnTablet) {
    $('input[name="email"]').keyup(function(e){
        var $this = $(this);
        var emailAddr = $this.val();
        if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(emailAddr)) {
            // So the placeholer will not outside the box
            var textDimension = calculateSize(emailAddr, {font: $this.css('font-family'), fontSize: $this.css('font-size')});
            var leftDistance = Math.min(textDimension.width + 20, $this.innerWidth() - 80);
            $this.siblings('.input-enter-prompt').css({'left': leftDistance }).show();
            if (e.which === 13) {
                // Enter key
                submitEmailAddress(emailAddr, $this.parents('form'));
            }
        } else {
            $this.siblings('.input-enter-prompt').hide();
        }
    });
}


// click action
$('.js-submit').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    var target = $(e.target);
    if (isSmallDevice() && target.parents('.fixed-header-wrapper').length > 0 && !userSignedUp) {
        $('html,body').animate({ scrollTop: $('.row.cta').position().top }, 'slow');
        return false;
    }


    var form = target.parents('form');
    var email = target.parents('form').find('input[name="email"]:visible').val();
    if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email)) {
        alert('Email format is invalid');
        return false;
    }

    submitEmailAddress(email, form);
});


var howItWorksInterval;
var startsHowItWorksCarousel = function() {
    var getNextSlide = function() {
        var targetSlide = $('.js-how-it-works .slide-controls li.active').next();
        if (!targetSlide.length) {
            targetSlide = $('.js-how-it-works .slide-controls li:first');
        }
        return targetSlide;
    };
    howItWorksInterval = setInterval(function(){
        highLightSlide(getNextSlide());
    }, 3000);
};

var highLightSlide = function($targetSlide) {
    var itemIndex = $targetSlide.index();
    $targetSlide.addClass('active').siblings().removeClass('active');
    $('.js-how-it-works .feature-text').each(function () {
        $(this).children().eq(itemIndex)
            .siblings()
            .removeClass('active animated fadeinUp');
        $(this).children().eq(itemIndex).addClass('active');
        $(this).children().eq(itemIndex).addClass('animated fadeIn');
    });
};

startsHowItWorksCarousel();


// how it works carousel
$('.js-how-it-works .slide-controls > li').click(function () {
    var $this = $(this);
    clearInterval(howItWorksInterval);
    highLightSlide($this);
});



$('.js-scroll-to-aus').click(function() {
    $('html, body').animate({
        scrollTop: $("#australian-business").offset().top - 100
    }, 1500);
});

var initCountingNumber = function () {
    // Counting numbers
    $('.js-number-count').each(function () {
        var $this = $(this);
        var counterEnd = parseInt($this.data('counter-end'), 10);
        var $numberCount = $this.children('.number-count');
        var $coverText = $this.find('.cover-text');
        $this.prop('counter', 0).animate({
            'counter': counterEnd
        }, {
            duration: 600,
            easing: 'swing',
            step: function (now) {
                $numberCount.text(Math.ceil(now));
            },
            complete: function () {
                $coverText.show().addClass('animated fadeInUp');
            }
        });
    });
};

//http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
var isElementInViewport = function (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
};

var eMondoEfficiencySection = $('.row.efficiency');
if (isElementInViewport(eMondoEfficiencySection)) {
    initCountingNumber();
} else {
    new Waypoint({
        element: eMondoEfficiencySection[0],
        handler: function () {
            initCountingNumber();
            this.destroy();
        }
    });

}


new Waypoint({
    element: $('.row.old-new-compare')[0],
    handler: function (direction) {
        if (!userSignedUp) {
            if (direction === 'down') {
                $('.fixed-header-wrapper').slideDown(200);
            } else {
                $('.fixed-header-wrapper').slideUp(200);
            }
        }

    }
});

new Waypoint({
    element: $('.row.electronic-signature')[0],
    handler: function (direction) {
        if (!userSignedUp) {
            if (direction === 'down') {
                $('.fixed-header-wrapper').slideUp(200);
            } else {
                $('.fixed-header-wrapper').slideDown(200);
            }
        }
    }
});


});