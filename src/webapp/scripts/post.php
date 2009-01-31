<?
ini_set('display_errors', 'On');

mysql_connect('sql.mit.edu', 'picker', 'haymaster')
	or die('MySQL connect failed');
mysql_select_db('picker+userdata');

if(isset($_POST['userid']) && !empty($_POST['userid'])
		&& isset($_POST['class']) && !empty($_POST['class'])) {
	$userid = (int)$_POST['userid'];
	$class = mysql_real_escape_string($_POST['class']);

	if(isset($_POST['rating'])) {
		$rating = (int)$_POST['rating'];
		
		if ($rating == 0)
			mysql_query("DELETE FROM ratings WHERE r_userid=$userid
				AND r_classid='$class';")
				or die (mysql_error());
		else
			mysql_query("INSERT INTO ratings (r_userid,r_classid,r_rating,r_type)
				VALUES ($userid,'$class',$rating,1) ON DUPLICATE KEY
				UPDATE r_rating=$rating;")
				or die (mysql_error());	
		echo $rating;
	}
	else if (isset($_POST['comment']) && !empty($_POST['comment'])) {
		if (!isset($_POST['deleteComment'])) {
			$comment = mysql_real_escape_string(
				mysql_real_escape_string($_POST['comment']));
			
			mysql_query("INSERT INTO comments (o_userid, o_classid, o_comment)
				VALUES ($userid,'$class','$comment') ON DUPLICATE KEY
				UPDATE o_comment='$comment';")
				or die (mysql_error());
		
			echo $comment;
		}
		else {
			mysql_query("DELETE FROM comments WHERE o_userid=$userid AND
				o_classid='$class';")
				or die (mysql_error());
		}
	}

}
else {
	echo 'this page should not be accessed on its own.';
}
?>
