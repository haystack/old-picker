// TODO: clean up. write utilities to check userID / return errors if false

/*
 * scripts/user-data.js
 *
 * @description Related functions to handle user input
 * and persistent data, e.g. ratings and feedback.
 *
 * Includes a star rating plugin script
 */

function getUserID(element) {
	var userID = window.database.getObject('user', 'userid');
	if (userID == null) {
		var href = element.baseURI.replace('http:', 'https:');
		leaveMessage(element, 'Must be logged in to rate class. <a href="'
			+ href + '">Login</a>');
	}
	return userID;
}

function setMsg(element, msg) {
	$(element).parent().parent().find('.message').html(msg);
}

function rate(input) {
	var classID = input.getAttribute("classid");
	
	// hide input
	$(input).parent().hide();
	
	var userID = getUserID(input);
	if (userID != null) {				
		$.post("scripts/post.php",
			{ userid: userID,
			  rating: input.value,
			  class: classID
			  },
			function(data){
				setMsg(input, 'Successfully rated: ' + data);
			});
	}
}

function doRate(anchor) {
	var classID = anchor.getAttribute("classid");
	classID = classID.replace('.', '\\.');
	
	$('#rating-' + classID + ' > div.info').hide();
	$('#rating-' + classID + ' > div.select').show();
}

/*
 * @param anchor - the anchored div acting as toggle bar
 * 				its next element is necessarily the div with comments.
 */
function toggleComments(anchor) {
/* 	$(anchor).next().slideToggle('fast'); */
	$(anchor).siblings().toggle();
}

function comment(button) {
	var classID = button.getAttribute("classid");
	
	var $textarea = $(button).parent().find('textarea');
	
	// hide input
	$(button).parent().hide();
	
	var userID = getUserID(button);
	if (userID != null) {
		$.post("scripts/post.php",
			{ userid: userID,
			  comment: $textarea.attr('value'),
			  class: classID
			  },
			function(data){
				setMsg(button, 'Successfully commented: ' + data);
			});
	}
}


// JavaScript Document
/*************************************************
Star Rating System
First Version: 21 November, 2006
Author: Ritesh Agrawal
Inspriation: Will Stuckey's star rating system (http://sandbox.wilstuckey.com/jquery-ratings/)
Demonstration: http://php.scripts.psu.edu/rja171/widgets/rating.php
Usage: $('#rating').rating('www.url.to.post.com', {maxvalue:5, curvalue:0});

arguments
url : required -- post changes to 
options
	maxvalue: number of stars
	curvalue: number of selected stars
	
************************************************/

/*
$.fn.rating = function(url, options) {
	
	if(url == null) return;
	
	var settings = {
		url       : url, // post changes to 
		maxvalue  : 7,   // max number of stars
		curvalue  : 0    // number of selected stars
	};
	
	if(options) {
		$.extend(settings, options);
	};
	$.extend(settings, {cancel: (settings.maxvalue > 1) ? true : false});
	
	var container = $(this);
	
	$.extend(container, {
		averageRating: settings.curvalue,
		url: settings.url
		});

	for(var i= 0; i <= settings.maxvalue ; i++){
		var size = i;
		if (i == 0) {
			if(settings.cancel == true){
	             var div = '<div class="cancel"><a href="#0" title="Cancel Rating">Cancel Rating</a></div>';
				 container.append(div);
			}
        } 
		else {
             var div = '<div class="star"><a href="#'+i+'" title="Give it '+i+'/'+size+'">'+i+'</a></div>';
			 container.append(div);

        }
	}
	
	var stars = container.find('.star');
    var cancel = container.find('.cancel');
	
    stars
		.mouseover(function(){
			event.drain();
			event.fill(this);
		})
		.mouseout(function(){
			event.drain();
			event.reset();
		})
		.focus(function(){
			event.drain();
			event.fill(this)
		})
		.blur(function(){
			event.drain();
			event.reset();
		});

    stars.click(function(){
		if(settings.cancel == true){
            settings.curvalue = stars.index(this) + 1;
            $.post(container.url, {
                "rating": jQuery(this).children('a')[0].href.split('#')[1] 
            });
			return false;
		}
		else if(settings.maxvalue == 1){
			settings.curvalue = (settings.curvalue == 0) ? 1 : 0;
			$(this).toggleClass('on');
			jQuery.post(container.url, {
                "rating": jQuery(this).children('a')[0].href.split('#')[1] 
            });
			return false;
		}
		return true;
			
    });

        // cancel button events
	if(cancel){
        cancel
            .mouseover(function(){
                event.drain();
                jQuery(this).addClass('on')
            })
            .mouseout(function(){
                event.reset();
                jQuery(this).removeClass('on')
            })
            .focus(function(){
                event.drain();
                jQuery(this).addClass('on')
            })
            .blur(function(){
                event.reset();
                jQuery(this).removeClass('on')
            });
        
        // click events.
        cancel.click(function(){
            event.drain();
			settings.curvalue = 0;
            jQuery.post(container.url, {
                "rating": jQuery(this).children('a')[0].href.split('#')[1] 
            });
            return false;
        });
	}
        
	var event = {
		fill: function(el){ // fill to the current mouse position.
			var index = stars.index(el) + 1;
			stars
				.children('a').css('width', '100%').end()
				.slice(0, index).addClass('hover').end();
		},
		drain: function() { // drain all the stars.
			stars
				.filter('.on').removeClass('on').end()
				.filter('.hover').removeClass('hover').end();
		},
		reset: function(){ // Reset the stars to the default index.
			stars.slice(0, settings.curvalue).addClass('on').end();
		}
	}        
	event.reset();
	
	return(this);	

}
*/