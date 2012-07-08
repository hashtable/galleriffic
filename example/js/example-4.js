jQuery(document).ready(function($) {
    // We only want these styles applied when javascript is enabled
    $('#thumbs').css({'width' : '300px', 'float' : 'left'});
    $('div.content').css('display', 'block');

    // Initially set opacity on thumbs and add additional styling for
    // hover effect on thumbs
    var onMouseOutOpacity = 0.67;
    $('#thumbs ul.thumbs li').opacityrollover({
        mouseOutOpacity: onMouseOutOpacity,
        mouseOverOpacity: 1.0,
        fadeSpeed: 'fast',
        exemptionSelector: '.selected'
    });

    // Enable toggling of the caption
    var captionOpacity = 0.0;
    $('#captionToggle a').click(function(e) {
        var link = $(this);

        var isOff = link.hasClass('off');
        var removeClass = isOff ? 'off' : 'on';
        var addClass = isOff ? 'on' : 'off';
        var linkText = isOff ? 'Hide Caption' : 'Show Caption';
        captionOpacity = isOff ? 0.7 : 0.0;

        link.removeClass(removeClass).addClass(addClass).text(linkText).attr('title', linkText);
        $('#caption span.image-caption').fadeTo(1000, captionOpacity);

        e.preventDefault();
    });

    // Initialize Advanced Galleriffic Gallery
    var gallery = $('#thumbs').galleriffic({
        delay:                     2500,
        numThumbs:                 15,
        preloadAhead:              10,
        enableTopPager:            true,
        enableBottomPager:         true,
        maxPagesToShow:            7,
        imageContainerSel:         '#slideshow',
        controlsContainerSel:      '#controls',
        captionContainerSel:       '#caption',
        loadingContainerSel:       '#loading',
        renderSSControls:          true,
        renderNavControls:         true,
        playLinkText:              'Play Slideshow',
        pauseLinkText:             'Pause Slideshow',
        prevLinkText:              '‹ Previous Photo',
        nextLinkText:              'Next Photo ›',
        nextPageLinkText:          'Next ›',
        prevPageLinkText:          '‹ Prev',
        enableHistory:             true,
        autoStart:                 false,
        syncTransitions:           true,
        defaultTransitionDuration: 900,
        onSlideChange:             function(prevIndex, nextIndex) {
            // 'this' refers to the gallery, which is an extension of $('#thumbs')
            this.find('ul.thumbs').children()
                .eq(prevIndex).fadeTo('fast', onMouseOutOpacity).end()
                .eq(nextIndex).fadeTo('fast', 1.0);
        },
        onTransitionOut:           function(slide, caption, isSync, callback) {
            slide.fadeTo(this.getDefaultTransitionDuration(isSync), 0.0, callback);
            caption.fadeTo(this.getDefaultTransitionDuration(isSync), 0.0);
        },
        onTransitionIn:            function(slide, caption, isSync) {
            var duration = this.getDefaultTransitionDuration(isSync);
            slide.fadeTo(duration, 1.0);

            // Position the caption at the bottom of the image and set
            // its opacity
            var slideImage = slide.find('img');
            caption.width(slideImage.width())
                .css({
                    'bottom' : Math.floor((slide.height() - slideImage.outerHeight()) / 2),
                    'left' : Math.floor((slide.width() - slideImage.width()) / 2) + slideImage.outerWidth() - slideImage.width()
                })
                .fadeTo(duration, captionOpacity);
        },
        onPageTransitionOut:       function(callback) {
            this.fadeTo('fast', 0.0, callback);
        },
        onPageTransitionIn:        function() {
            this.fadeTo('fast', 1.0);
        },
        onImageAdded:              function(imageData, $li) {
            $li.opacityrollover({
                mouseOutOpacity:   onMouseOutOpacity,
                mouseOverOpacity:  1.0,
                fadeSpeed:         'fast',
                exemptionSelector: '.selected'
            });
        }
    });

    // Functions to support integration of galleriffic with the
    // jquery.history plugin

    // PageLoad function
    // This function is called when:
    // 1. after calling $.historyInit();
    // 2. after calling $.historyLoad();
    // 3. after pushing "Go Back" button of a browser
    function pageload(hash) {
        // alert("pageload: " + hash);
        // hash doesn't contain the first # character.
        if(hash) {
            $.galleriffic.gotoImage(hash);
        } else {
            gallery.gotoIndex(0);
        }
    }

    // Initialize history plugin.
    // The callback is called at once by present location.hash.
    $.historyInit(pageload, "advanced.html");

    // set onlick event for buttons using the jQuery 1.3 live method
    $("a[rel='history']").live('click', function(e) {
        if (e.button != 0) return true;

        var hash = this.href;
        hash = hash.replace(/^.*#/, '');

        // moves to a new page.
        // pageload is called at once.
        // hash don't contain "#", "?"
        $.historyLoad(hash);

        return false;
    });


    // Attach click event to the Add Image Link

    $('#addImageLink').click(function(e) {
        gallery.insertImage('<li>                                                                                           \
<a class="thumb" href="http://farm1.static.flickr.com/79/263120676_2518b40e5b.jpg" title="Dynamically Added Image">\
<img src="http://farm1.static.flickr.com/79/263120676_2518b40e5b_s.jpg" alt="Dynamically Added Image" />\
</a>                                                                                                        \
<div class="caption">                                                                                       \
<div class="download">                                                                                  \
<a href="http://farm1.static.flickr.com/79/263120676_2518b40e5b_o_d.jpg">Download Original</a>      \
</div>                                                                                                  \
<div class="image-title">Dynamically Added Image</div>                                                  \
<div class="image-desc">                                                                                \
<img src="http://farm1.static.flickr.com/38/buddyicons/77261001@N00.jpg" alt="ringydingydo" />      \
Photo taken by <a href="http://www.flickr.com/photos/ringydingydo/">ringydingydo</a>                \
</div>                                                                                                  \
</div>                                                                                                      \
</li>', 5);

        e.preventDefault();
    });


    // Attach click event to the Remove Image By Index Link

    $('#removeImageByIndexLink').click(function(e) {
        if (!gallery.removeImageByIndex(5))
            alert('There is no longer an image at position 5 to remove!');

        e.preventDefault();
    });


    // Attach click event to the Remove Image By Hash Link

    $('#removeImageByHashLink').click(function(e) {
        if (!gallery.removeImageByHash('lizard'))
            alert('The lizard image has already been removed!');

        e.preventDefault();
    });
});
