<?
ini_set('display_errors', 'On');

mysql_connect('sql.mit.edu', 'picker', 'haymaster')
	or die('MySQL connect failed');
mysql_select_db('picker+userdata');

if(isset($_POST['userid']) && !empty($_POST['userid'])
		&& isset($_POST['class']) && !empty($_POST['class'])) {
	$userid = mysql_real_escape_string($_POST['userid']);
	$class = mysql_real_escape_string($_POST['class']);

	if(isset($_POST['rating']) && !empty($_POST['rating'])) {
		$rating = mysql_real_escape_string($_POST['rating']);
		
		mysql_query("INSERT INTO ratings (r_userid, r_classid, r_rating, r_type) VALUES
			($userid,'$class',$rating,1) ON DUPLICATE KEY UPDATE r_rating=$rating;")
			or die (mysql_error());
	
		echo $rating;
	}
	else if (isset($_POST['comment']) && !empty($_POST['comment'])) {
		$comment = mysql_real_escape_string(mysql_real_escape_string($_POST['comment']));
		
		mysql_query("INSERT INTO comments (o_userid, o_classid, o_comment) VALUES
			($userid,'$class','$comment') ON DUPLICATE KEY UPDATE o_comment='$comment';")
			or die (mysql_error());
	
		echo $comment;
	}

}
else {
	echo 'this page should not be accessed on its own.';
}
?>
