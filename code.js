/* ------------------------------------------------------------------- */
/* Slideshow gallery                                                   */
/* ------------------------------------------------------------------- */


function doGalleryShow() {

    // get some selectors and data 
    var background = $('#page article:first-child section:first-child div.section-background');
    var gallery = $('#page  article:first-child section.gallery-section').first().find('figure');

    // If no gallery found so abort
    if (gallery.length == 0) {
        return false;
    } 

    // Hide the initial template, not needed.
    background.find('img').css('display','none');

    // https://stackoverflow.com/questions/326069/how-to-identify-if-a-webpage-is-being-loaded-inside-an-iframe-or-directly-into-t
    // See if we are editing the SquareSpace page, if so hide the gallery section
    var isEditor = window.frameElement ? true : false;
    if (isEditor == false) {
       gallery.closest('section').css('display', 'none'); 
    }

    // Loop through each figure and add to the list of slides 
    gallery.each(function() {

        var imgtemp = $(this).find('img');
        var imgcap = $(this).find('figcaption p.gallery-caption-content').text();
        var caplink = $(this).find('a').first().attr('href');
        if (caplink) {
            imgcap = '<a href="' + caplink + '">' + imgcap + '</a>';
        }
        if (imgcap) { imgcap = '<div class="slideCaption">' + imgcap + '</div>';}
        var imgpos = imgtemp.attr('data-image-focal-point');

        imgpos = imgpos.split(",");
        var temp = "";
        for (var i = 0; i < imgpos.length; i++) {
            imgpos[i] = imgpos[i] * 100;
            temp = temp + " " + imgpos[i] + "%";
        }
        imgpos = temp.trim();
        var style = ' style="object-position:' + imgpos + ';';
        temp = '<div class="mySlides"><img src="' + imgtemp.attr('data-src') + '"' + style + '">' +
        imgcap + '</div>';
        background.append(temp);
    });

    // start the slideshow
    
    carousel();
}
  
  var myIndex = 0;
  function carousel() {
    var i;
    var background = $('#page article:first-child section:first-child div.section-background');
    var x = background.find('.mySlides');
    if (myIndex >= x.length) {
      myIndex = 0
    }
    x.removeClass("opaque");
    background.find('div.mySlides').eq(myIndex).addClass("opaque");
    myIndex++;
    setTimeout(carousel, 8000);
  }
  
  /* ------------------------------------------------------------------- */
/* Filter checklist values                                             */
/* ------------------------------------------------------------------- */ 

function filter_values () {

    // initialize based on current checkboxes
    filter_showvals();

    // Process a checkbox selection 
    $('#filterContainer input[type=checkbox]').on('change', function(e) {
        console.log('change=' + this.value);
        var name = $(this).attr('name');
        if (name) {
        $('#filterContainer input[type=checkbox][name=' + name + ']')
         .not(this).attr('checked',false);
        }
        filter_showvals();
    })

}

function filter_showvals () {

    // get an array of checked items
    var ids = [];
    var xidsx = [];
    $('#filterContainer input[type=checkbox]:checked')
      .each(function() {
        if(this.value) {ids.push(this.value); }
    });

    $('div.summary-content div.summary-metadata-container div.summary-metadata span.summary-metadata-item--cats a').removeClass('active');

    // if we have anything checked then start with everything hidden
    if (ids.length) {
        $('div.summary-item').css('display','none');
    }

    $('div.summary-item').each(function(index, value) {
        xidsx = [...ids]; // copy the array of checked items
        $(this).find('div.summary-content div.summary-metadata-container div.summary-metadata span.summary-metadata-item--cats a').filter(function (index2) {
            var t = this.href.indexOf('?category=');
            var i = xidsx.indexOf(this.href.substr(t+10));
            if ( i >= 0) {
                xidsx.splice(i, 1);  
            }
            var i = ids.indexOf(this.href.substr(t+10));
            if ( i >= 0) {
                $(this).addClass('active');   
            }
        })
        // if we have found all of the selected items the show
        if (xidsx.length == 0) {
            $(this).css('display','block');
        }
    });
}  

/* ------------------------------------------------------------------- */
/* Accordian                                                           */
/* ------------------------------------------------------------------- */

$( document ).ready(function() {
	$('p span.accordian').closest('.markdown-block').addClass('markdown-accordian');
	$('.markdown-accordian .sqs-block-content h4').addClass('ui-closed').css('cursor','pointer');
	$('.markdown-accordian .sqs-block-content h4').css('cursor','pointer');
	$(".markdown-accordian .sqs-block-content h4").nextUntil("h4").slideToggle();
	$(".markdown-accordian .sqs-block-content h4").click(function() {
		var status = $(this).hasClass("ui-open");
		$(".markdown-accordian .sqs-block-content h4").nextUntil("h4").slideUp();
		$(".markdown-accordian .sqs-block-content h4").removeClass('ui-open');
		$(".markdown-accordian .sqs-block-content h4").addClass('ui-closed');
		if (status == false) {
		   $(this).nextUntil("h4").slideDown();
		   $(this).toggleClass('ui-closed ui-open');
		}
	});
});