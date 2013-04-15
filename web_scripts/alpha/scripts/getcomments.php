<?

// Gets the latest comment from the database of comments

// Sets configuration options
ini_set('display_errors', 'On');

$con = mysqli_connect('sql.mit.edu', 'picker', 'haystackpicker', 'picker+classcomment');

// Check connection
if (mysqli_connect_errno($con))
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

/**
 *Gets the class from the comments classes if it exits, else insert class into
 *database
 **/

if(isset($_POST['slug'])) {
    $slug = mysqli_real_escape_string($con, $_POST['slug']);
    
    $result = mysqli_query($con, "SELECT slug FROM mitclass WHERE slug='$slug'");
    if (mysqli_num_rows($result) > 0) {
	$row = mysqli_fetch_array($result);
        $classid = $row[0];
    }
    else {
        if(isset($_POST['title']) && isset($_POST['number']) && isset($_POST['description'])) {
            //&& isset($_POST['prereqs']) && isset($_POST['classtype']) && isset($_POST['units']) && isset($_POST['semester'])
            $title = mysqli_real_escape_string($con, $_POST['title']);
            $description = mysqli_real_escape_string($con, $_POST['description']);
            /**$instructors = mysqli_real_escape_string($con, $_POST['instructors']);
            $prereqs = mysqli_real_escape_string($con, $_POST['prereqs']);
            $classtype = mysqli_real_escape_string($con, $_POST['classtype']);
            $units = mysqli_real_escape_string($con, $_POST['units']);
            $semester = mysqli_real_escape_string($con, $_POST['semester']);**/
            $number = mysqli_real_escape_string($con, $_POST['number']);
            /**, instructors, prereqs, classtype, units, semester
            , '$instructors', '$prereqs', '$classtype', '$units', '$semester')**/
            
            mysqli_query($con, "INSERT INTO mitclass (number_name, title, slug, description)
                          VALUES ('$number', '$title', '$slug', '$description')");
            $classid = mysqli_insert_id();  
        }
    }
    return getLatestComment($classid);
 }
 
function getLatestComment($classid) {
    $result = mysqli_query($con, "SELECT slug FROM django_comments WHERE content_type_id = 10 AND object_pk = '$classid' ORDER BY submit_date");
    if(mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_all($result);
        return $row[0];
    }
    else {
        return "No comments yet for this class.";
    }
 }
 
 mysqli_close($con);
 
 ?>