<?php
ini_set('display_errors', 'On');

mysql_connect('sql.mit.edu', 'picker', 'haymaster')
	or die('MySQL connect failed');
mysql_select_db('picker+userdata');

// POST handling
if (isset($_POST['userid'])) {
	// user has picked a new section
	if (isset($_POST['doPick'])) {
	
		$userid = mysql_real_escape_string($_POST['userid']);
		$sec = mysql_real_escape_string($_POST['doPick']);
		
		mysql_query("INSERT INTO sections VALUES($userid, $sec);");
	}
	// user has removed a section
	else if (isset($_POST['doUnpick'])) {
		$userid = mysql_real_escape_string($_POST['userid']);
		$sec = mysql_real_escape_string($_POST['doUnpick']);
	
		mysql_query("DELETE FROM sections WHERE s_userid=$userid AND s_sectionid=$sec;");
	}
}
else { // OTHERWISE - do everything else. main JS body starts here ---- ?>


<?

/*  This is the only file that should be connecting to
	the database and should be interpreted by the application
	as a Javascript file */

function getUser($athena, $email) {
	$result = mysql_query("SELECT u_userid FROM users WHERE u_athena='$athena';");
	if (mysql_num_rows($result) > 0) {
		$row = mysql_fetch_row($result);
		return $row[0];
	}
	else {
		mysql_query("INSERT INTO users (u_athena, u_email)
			VALUES ('$athena', '$email')");
		return mysql_insert_id();
	}
}

// determine user identity, store in $userid
if (isset($_SERVER['SSL_CLIENT_S_DN_CN'])) {
	$athena = explode("@", $_SERVER['SSL_CLIENT_S_DN_Email']);
	$athena = $athena[0];
	$userid = getUser($athena, $_SERVER['SSL_CLIENT_S_DN_Email']);
}


//accessible via: database.getObject("currentUser", "athena");

$items = array();

if (isset($userid)) {
	$arr = '{"type":"UserData","label":"user",
			"athena":"' . $athena . '","userid":"' . $userid . '"}';
	$items = array($arr);
	
	
	// populate picked-sections
 	$result = mysql_query("SELECT s_sectionid FROM sections WHERE s_userid=$userid;");
 	
 	$arr = array();
 	while ($row = mysql_fetch_row($result)) {
 		$arr[] = '"' . $row[0] . '"';
 	}
	$items[] = '{"type":"UserData","label":"picked-sections",
		"list":[' . implode(",", $arr) . ']}';
	
	
	// populate schedule-list (official picked-classes done by listener)
	$result = mysql_query("SELECT c_classid FROM classes WHERE c_userid=$userid;");
	$arr = array();
	while ($row = mysql_fetch_row($result)) {
		$arr[] = '"' . $row[0] . '"';
	}
	$items[] = '{"type":"UserData","label":"all-classes",
		"list":[' . implode(",", $arr) . ']}';


	// pull user's ratings
	$result = mysql_query("SELECT r_classid, r_rating FROM ratings
		WHERE r_userid=$userid AND r_type=1;");
	$arr = array();
	while ($row = mysql_fetch_row($result)) {
		$items[] = '{"type":"UserData","label":"UserRating-' . $row[0] . '",
			"class-user-rating-of":"' . $row[0] . '","rating":"' . $row[1] . '"}';
	}

	// pull average ratings

}

mysql_close();

echo "\n\n";	
echo '{"items": [' . implode(",", $items) . '] }';

} // end of main body block
?>
