/*  This is the only file that should be connecting to
	the database and should be interpreted by the application
	as a Javascript file */

<?
$dbhost = 'sql.mit.edu';
$dbuser = 'picker';
$dbpass = 'haymaster';
$dbname = 'picker+userdata';

$conn = mysql_connect($dbhost, $dbuser, $dbpass)
	or die ('Error connecting to MySQL');
mysql_select_db($dbname);



$items = array();

if (isset($_SERVER['SSL_CLIENT_S_DN_CN'])) { 
	$athena = explode("@", $_SERVER['SSL_CLIENT_S_DN_Email']);
	
	$arr = '{"type":"User","id":"userid"}';
	// also set picked-sections and picked-classes as appropriate
	
	$items[] = $arr;
}
		
echo '{"items": [' . implode(",", $items) . '] }';

?>