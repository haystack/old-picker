<?php
ini_set('display_errors', 'On');
ini_set('allow_url_fopen', 'true');

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
	
	
	// populate picked-sections - use $picked to store section data
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
	$picked = array();
	while ($row = mysql_fetch_row($result)) {
		$picked[] = '(' . $row[0] . ')';
		$arr[] = '"' . $row[0] . '"';
	}
	$items[] = '{"type":"UserData","label":"picked-classes",
		"list":[' . implode(",", $arr) . ']}';
		
	
	if(count($picked) > 0) {
		// pull information from mapws based on picked-sections and picked-classes
		$content = file_get_contents('http://mapws.mit.edu/WarehouseService/?term=2009SP&courses=6');
		if ($content != false) {
			$content = preg_replace('/{"items": \[/', '', $content);
			$content = split(",\n" , $content);
	
			$picked = preg_replace('/\./', '\\\.', $picked);
			
			// $arr uses $picked to fill the grep pattern to sele
			$arr = preg_grep('/' . implode('|', $picked) . '/', $content);
			
			// duplicates functionality of postProcessOfficialData
			$arr = preg_replace('/LectureSession",\s+"label":"L(\d+\.\d+)",\s+"section/',
				'LectureSection", "label":"L$1", "lecture-section', $arr);
			$arr = preg_replace('/RecitationSession",\s+"label":"R(\d+\.\d+)",\s+"section/',
				'RecitationSection", "label":"R$1", "rec-section', $arr);
			$arr = preg_replace('/LabSession",\s+"label":"B(\d+\.\d+)",\s+"section/',
				'LabSection", "label":"B$1", "lab-section', $arr);
			$arr = preg_replace('/"offering":"Y"/', '"offering":"Currently Offered"', $arr);
			
			$items = array_merge($items, $arr);
		} else {
			echo '/* read of mapws file failed */';
		}
	}


	// pull user's ratings
	$result = mysql_query("SELECT r_classid, r_rating FROM ratings
		WHERE r_userid=$userid AND r_type=1;");
	while ($row = mysql_fetch_row($result)) {
		$items[] = '{"type":"UserData","label":"UserRating-' . $row[0] . '",
			"class-user-rating-of":"' . $row[0] . '","rating":"' . $row[1] . '"}';
	}
}

/* ==== THINGS THAT SHOULD BE PULLED REGARDLESS OF AUTHENTICATION ==== */
// pull average ratings
$result = mysql_query("SELECT r_classid, AVG(r_rating),
	COUNT(r_rating) FROM ratings
	WHERE r_type=1 GROUP BY r_classid;;");
while ($row = mysql_fetch_row($result)) {
	$items[] = '{"type":"UserData","label":"AvgRating-' . $row[0] . '",
		"class-avg-rating-of":"' . $row[0] . '",
		"rating":"' . round($row[1],1) . '","total":"' . $row[2] . '"}';
}

// pull comments. we assume scrubbing occurs on comment ingestion
$result = mysql_query("SELECT u_athena, o_classid, o_timestamp, o_comment
	FROM comments INNER JOIN users ON u_userid = o_userid
	WHERE o_flagged = 0 ORDER BY o_timestamp DESC;");
$count = 0;
while ($row = mysql_fetch_row($result)) {
	$count++;
	$string = '{"type":"UserData","label":"Comment-' . $row[1] .'-'. $count . '",
		"class-comment-of":"' . $row[1] . '","author":"' . $row[0] . '",
		"timestamp":"' . $row[2] . '","comment":"' . $row[3] . '"';
	if (isset($athena) && $row[0] == $athena)
		$string .= ',"is-current-user":"true"';	
	$string .= '}';
	
	$items[] = $string;
}

mysql_close();


echo '{"items": [' . implode(",", $items) . '] }';

} // end of main body block
?>
