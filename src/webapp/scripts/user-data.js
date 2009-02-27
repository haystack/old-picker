/*
 * scripts/user-data.js
 *
 * @description Related functions to handle user input
 * and persistent data, e.g. ratings and feedback.
 *
 * Includes a star rating plugin script
 */

// holds various dependent functions
userData = {

	// not used outside of this file
	getUserID: function(element) {
		var userID = window.database.getObject('user', 'userid');
		if (userID == null) {
			var href = element.baseURI.replace('http:', 'https:');
			this.setMsg(element, 'Must be logged in to input data. <a href="'
				+ href + '">Login</a>');
		}
		return userID;
	},

	// not used outside of this file
	setMsg: function(element, msg) {
		$(element).parent().parent().find('.message').html(msg);
	},
	
	toggleComments: function(anchor) {
		var userID = this.getUserID($(anchor).children()[0]);
		
		if (userID == null)
			$(anchor).siblings(':not(div.input)').toggle("fast");
		else
			$(anchor).siblings().toggle("fast");
	},
	
	comment: function(button) {
		var classID = button.getAttribute("classid");
		
		var $textarea = $(button).parent().find('textarea');
		
		// hide input
		$(button).parent().hide();
		
		var userID = this.getUserID(button);
		if (userID != null) {
			$.post("scripts/post.php",
				{ userid: userID,
				  comment: $textarea.attr('value'),
				  class: classID
				  },
				function(data){
					userData.setMsg(button, 'Successfully commented: ' + data);
				});
		}
	},
	
	deleteComment: function(anchor) {
		var classID = anchor.getAttribute("classid");
		
		var userID = this.getUserID($(anchor).parent());
		if (userID != null) {
			
			$.post("scripts/post.php",
				{ userid: userID,
				  comment: true,
				  deleteComment: true,
				  class: classID
				  },
				function(data){
					// hide comment div
					$(anchor).parent().hide();
				});
		}
	},
	
	drain: function(elt) {
		var stars = $(elt).parent().children('.star');
		stars
			.filter('.on').removeClass('on').end()
			.filter('.hover').removeClass('hover').end();
	},
	
	reset: function(value, elt) {
		var siblings = $(elt).parent().children('.star');
		siblings.slice(0, value).addClass('on').end();
	},
	
	starOn: function(star) {
		this.drain(star);
		
		var siblings = $(star).parent().children('.star');
		var index = $(star).children('a').html();
		// fill(this)
		siblings.children('a').css('width', '100%').end();
		siblings.slice(0, index).addClass('hover').end();
	},
	
	starClick: function(star) {
		var userID = userData.getUserID($(star).parent()[0]);
		
		if (userID != null) {
			$(star).parent().attr('curvalue', $(star).children('a').html());
			$.post('./scripts/post.php', {
				'userid': userID,
				'class' : $(star).parent().attr('classid'),
				'rating': $(star).children('a').html()
			});
			
			
			return false;
		}
	},
	
	starOff: function(star) {
		this.drain(star);
		
		var curValue = $(star).parent().attr('curvalue');
		this.reset(curValue, star);
	},
	
	cancelOn: function(cancel) {
		this.drain(cancel);
		$(cancel).addClass('on');
	},
	
	cancelClick: function(cancel) {
		this.drain(cancel);
		
		var userID = this.getUserID($(cancel).parent()[0]);
		
		if (userID != null) {
			$(cancel).parent().attr('curvalue', 0);
			$.post('./scripts/post.php', {
				'userid': userID,
				'class' : $(cancel).parent().attr('classid'),
				'rating': '0'
			});
			return false;
		}
	},
	
	cancelOff: function(cancel) {
		var curValue = $(cancel).parent().attr('curvalue');
		this.reset(curValue, cancel);
		
		$(cancel).removeClass('on');
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

-- with lots of changes by Christine Yen, 2009
********************/

/*# AVOID COLLISIONS #*/
;if(window.jQuery) (function($){
/*# AVOID COLLISIONS #*/

	$.fn.rating = function(options) {
		var settings = {
			url       : './scripts/post.php', // post changes to 
			maxvalue  : 7,   // max number of stars
			curvalue  : 0,    // number of selected stars
			cancel    : true
		};
		
		if(options) {
			$.extend(settings, options);
		};
		
		var container = $(this);
		
		$.extend(container, {
			averageRating: settings.curvalue,
			url: settings.url
			});
	
		for(var i= 0; i <= settings.maxvalue ; i++){
			var size = i;
			if (i == 0) {
				if(settings.cancel == true){
					 var span = '<span class="cancel"><a href="javascript:void(0);">Cancel Rating</a></span>';
					 container.append(span);
				}
			} 
			else {
				 var span = '<span class="star"><a href="javascript:void(0);">'+i+'</a></span>';
				 container.append(span);
	
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
				event.fill(this);
			})
			.blur(function(){
				event.drain();
				event.reset();
			});
	
		stars.click(function(){
			var userID = userData.getUserID($(this).parent()[0]);
			
			if (userID != null) {
				settings.curvalue = stars.index(this) + 1;
				$.post(container.url, {
					'userid': userID,
					'class' : $(this).parent().attr('classid'),
					'rating': $(this).children('a').html()
				});
				return false;
			}
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

				var userID = userData.getUserID($(this).parent()[0]);
				
				if (userID != null) {
					$.post(container.url, {
						'userid': userID,
						'class' : $(this).parent().attr('classid'),
						'rating': '0'
					});
					return false;
				}
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
	
	};
	
	
/*# AVOID COLLISIONS #*/
})(jQuery);
/*# AVOID COLLISIONS #*/

function attachRatings() {
	$('div.rate').each(function(i) {
		$(this).rating( {curvalue: $(this).attr('curvalue')} );
		});
}