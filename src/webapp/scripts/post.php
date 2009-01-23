<?
ini_set('display_errors', 'On');

mysql_connect('sql.mit.edu', 'picker', 'haymaster')
	or die('MySQL connect failed');
mysql_select_db('picker+userdata');

if(isset($_POST['userid'])
		&& isset($_POST['rating'])
		&& isset($_POST['class'])) {

echo $_POST['userid'];

echo '<br/>' . $_POST['rating'];

echo '<br/>' . $_POST['class'];

	$userid = mysql_real_escape_string($_POST['userid']);
	$rating = mysql_real_escape_string($_POST['rating']);
	$class = mysql_real_escape_string($_POST['class']);
	
/*	
 	mysql_query("INSERT INTO ratings ");
	echo 'something';
*/
	
}

echo 'display';

?>