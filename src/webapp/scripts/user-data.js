/*
 * scripts/user-data.js
 *
 * @description Related functions to handle user input
 * and persistent data, e.g. ratings and feedback.
 */

function rate(input) {
	var classID = input.getAttribute("classid");
	$.post("scripts/post.php",
		{ userid: window.database.getObject('user', 'userid'),
		  rating: input.value,
		  class: classID
		  },
		function(data){
			classID = classID.replace('.', '\\.');
			$('#rating-' + classID).hide();
			$('#rating-' + classID + '-exists').html('Successfully rated: ' + data);
			$('#rating-' + classID + '-exists').show();
		});
}

function doRate(anchor) {
	var classID = anchor.getAttribute("classid");
	classID = classID.replace('.', '\\.');
	$('#rating-' + classID + '-exists').hide();
	$('#rating-' + classID).show();
}
