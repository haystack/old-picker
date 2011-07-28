<?

// Saves previously stored data for each user
// Including which classes have been picked

ini_set('display_errors', 'On');

mysql_connect('sql.mit.edu', 'picker', 'haymaster')
	or die('MySQL connect failed');
mysql_select_db('picker+userdata');

if(isset($_POST['userid']) && !empty($_POST['userid'])) {
	$userid = (int)$_POST['userid'];
	
	if(isset($_POST['class']) && !empty($_POST['class'])) {
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
				$comment = mysql_real_escape_string($_POST['comment']);
				
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
	else if (isset($_POST['pickedclasses']) && !empty($_POST['pickedclasses'])
			&& isset($_POST['pickedsections']) && !empty($_POST['pickedsections'])) {
		$classes = explode(',', mysql_real_escape_string($_POST['pickedclasses']));
		$sections = explode(',', mysql_real_escape_string($_POST['pickedsections']));
		
		mysql_query("DELETE FROM classes WHERE c_userid=$userid;");
		mysql_query("DELETE FROM sections WHERE s_userid=$userid;");
		
		foreach ($classes as $c) {
			mysql_query("INSERT INTO classes VALUES ($userid, '$c', 'Spring 2009');") or die('died1');
		}
		foreach ($sections as $s) {
			mysql_query("INSERT INTO sections VALUES ($userid, '$s');") or die('died2');
		}
	}

}
else {
	echo 'this page should not be accessed on its own.';
}
?>
