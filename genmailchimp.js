/* ----------------------------------------------------------- */
/* Generate MailChimp html                                     */
/* ----------------------------------------------------------- */

function formatFactory(html) {
    function parse(html, tab = 0) {
        var tab;
        var html = $.parseHTML(html);
        var formatHtml = new String();   

        function setTabs () {
            var tabs = new String();

            for (i=0; i < tab; i++){
              tabs += '\t';
            }
            return tabs;    
        };


        $.each( html, function( i, el ) {
            if (el.nodeName == '#text') {
                if (($(el).text().trim()).length) {
                    formatHtml += setTabs() + $(el).text().trim() + '\n';
                }    
            } else {
                var innerHTML = $(el).html().trim();
                $(el).html(innerHTML.replace('\n', '').replace(/ +(?= )/g, ''));
                

                if ($(el).children().length) {
                    $(el).html('\n' + parse(innerHTML, (tab + 1)) + setTabs());
                    var outerHTML = $(el).prop('outerHTML').trim();
                    formatHtml += setTabs() + outerHTML + '\n'; 

                } else {
                    var outerHTML = $(el).prop('outerHTML').trim();
                    formatHtml += setTabs() + outerHTML + '\n';
                }      
            }
        });

        return formatHtml;
    };   
    
    return parse(html.replace(/(\r\n|\n|\r)/gm," ").replace(/ +(?= )/g,''));
}; 



function copyToClipboard(selector) {
  var beautify = formatFactory($(selector).html());
  $('textarea').addClass('active')
  $('textarea').val(beautify);
  $('textarea').select();
    document.execCommand("copy");
    alert('HTML copied to clipboard');
}


    function getData(theurl) {
       
        var result = "";
        $.ajax({
            url: theurl,
            dataType: 'text',
            async: false,
            success: function(data) {
                result = data;
            }
        });
        return result;
        }

    function do_get_mailchimp() {
        var url = '/mailchimp-list';
        //var url = 'mailchimp_list.html';
        var res = getData(url);
        
        if (res) {
            $('.statusMessage').text('Processing, might take a minute...');
            var data = $.parseHTML(res);
            var articles = $(res).find('div.sqs-block-summary-v2');
            var items = $(articles).children();
            var prevsection = ''; 
            $( items ).each(function( index ) {
                var theitems = $(this).find('.summary-item');
                $( theitems).each(function( index2) {
                    var src = $(this).find('.summary-title a').attr('href').substr(1);
                    var d = getData(src);
                    var look = src.split('/');
                    var thetype = look[0]; 
                    //console.log(thetype);
                    if (thetype != prevsection) {
                        var thename = 'Upcoming Events';
                        if (thetype == 'services') {thename = 'Services';}
                        if (thetype == 'announcement-items') {thename = 'Announcements';}
                        if (thetype == 'vestry-connections') {thename = 'Vestry Connections';}
                        if (thetype == 'vestry-connections') {thename = 'Vestry Connections';}
                        if (thetype == 'mailchimp-only-items') {thename = 'Mailchimp Only Items';}
                        $('#contentData-wrapper').append('<h2 class="sectionType">' + thename + '</h2>');
                        prevsection = thetype;
                    }
                    if (d.length) {
                        if (thetype == 'events-list' || thetype == 'vestry-connections'
                            || thetype == 'services') {
                            
                            var event = $.parseHTML(d);
                            var title = $(event).find('article.eventitem h1.eventitem-title').text();
                            var startdate = $(event).find('article.eventitem time.event-date').eq(0).text();
                            var starttime = $(event).find('article.eventitem .eventitem-meta-time').eq(0).text();
                            var enddate = $(event).find('article.eventitem time.event-date').eq(1).text();
                            var endtime = $(event).find('article.eventitem span.eventitem-meta-time').eq(1).find('time.event-time-12hr').text();
                            //var contentDataitems = $(event).find('article div.sqs-block-content').eq(1).find('p');
                            var contentDataitems = $(event).find('article div.html-block div.sqs-block-content').eq(0).html();
                           /* if (thetype == 'services') {
                            //console.log(contentDataitems); }*/
                            contentData = ''; 
                            /*$(contentDataitems).each(function(index) {
                                contentData = contentData + '<p class="contentData">' + $(this).html() + '</p>';
                            })*/
                            //contentData = contentData + '<p class="contentData">' + contentDataitems + '</p>';
                            contentData = contentData + contentDataitems;
                            var imgsrc = $(event).find('article div.image-block figure div img').attr('data-src');
                        
                            var out = '<div class="contentData">' + 
                            '<div class="title">' + title + '</div>';
                            if (startdate) {
                                out = out + '<div class="startdate">' + startdate;
                                if (starttime) {
                                    out = out + ' ' + starttime;
                                }
                                out = out + "</div>";
                            }
                            if (imgsrc) {
                                out = out + '<img class="theimg" src="' + imgsrc + '">';
                            }
                            
                            contentData = contentData.replace('<p></p>','');
                            contentData = contentData.replace('<strong></strong>','');
                            contentData = contentData.replace('<strong> </strong>','');
                            contentData = contentData.replace('<em></em>','');
                            
                            
                            out = out + contentData + "</div>";

                            $('#contentData-wrapper').append(out);
                            //$('#contentData-wrapper').append('<div class="clearBoth" style="clear:both;"></div>');

                            /* + 
                            '<div class="datetime startDate">' + startdate + '</div>' + 
                            '<div class="datetime startTime">' + starttime + '</div>' +
                            '<div class="datetime endDate">' + enddate + '</div>' + 
                            '<div class="datetime endTime">' + endtime + '</div>'*/
                        }
                        //alert(src + " " + src.indexOf('/announcement-items/'));
                        var i = src.indexOf('announcement-items/');
                        
                        if (thetype == 'announcement-items' || thetype == 'twelve-days-of-christmas'
                            || thetype == 'mailchimp-only-items') {
                            //console.log('thetype=' + thetype);
                            var event = $.parseHTML(d);
                            var title = $(event).find('div.blog-item-wrapper h1.entry-title').text();
                            contentData = ''; 
                            var contentDataitems = $(event).find('article div.html-block div.sqs-block-content').eq(0).html();
                            var imgsrc = $(event).find('article div.image-block figure div img').attr('data-src');
                            //contentData = contentData + '<p class="contentData">' + contentDataitems + '</p>';
                            contentData = contentData + contentDataitems;
                            var out = '<div class="contentData">' + 
                            '<div class="title">' + title + '</div>';
                            if (imgsrc) {
                                out = out + '<img class="theimg" src="' + imgsrc + '">';
                            }
                            
                            contentData = contentData.replace('<p></p>','');
                            contentData = contentData.replace('<strong></strong>','');
                            contentData = contentData.replace('<strong> </strong>','');
                            contentData = contentData.replace('<em></em>','');
                            
                            out = out + contentData + "</div>";
                            $('#contentData-wrapper').append(out);
                            //$('#contentData-wrapper').append('<div class="clearBoth" style="clear:both;"></div>');
                        }
                    }

                    //$("<li>" + src + " length=" + d.length + "</li>").appendTo('#thedata');
                })
            });
            
        }
        $('.statusMessage').text('All done.');
        $('div#contentData-wrapper').css('display','block');
        $('button#copyToClip').css('display','block');
    }

$(document).ready(function() {
    //do_get_mailchimp();   
});