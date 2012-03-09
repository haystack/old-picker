/*===================================================
 * Exhibit extensions
 *==================================================
 */

/*
 * New logging code to study facet interaction
 * Hooks into the  proper logging facilities in the SimileAjax
 * package if present (at time of writing this, not yet baked 
 * into the "official" trunk)
* 8/27/10
 */
function possiblyLog(obj) {
    if (
        (typeof SimileAjax == "object") &&
        (typeof SimileAjax.RemoteLog == "object") && 
        (typeof SimileAjax.RemoteLog.possiblyLog == 'function')
    ) {
        SimileAjax.Debug.log(obj);
        SimileAjax.RemoteLog.possiblyLog(obj);
    }
}


/*==================================================
 * Initialization
 *==================================================
 */

/* Code for handling exceptions (courses whose data doesn't come from the warehouse) removed 
 * rev. 9567, 7/11.
 * See earlier revisions if reinstating this code. 
 */

/**
 * "logging in" on picker uses MIT certificates and saves data long-term in MySQL db.
 * In order to be able to test "logged in" features on your machine,
 * Set up a LAMP server, test on a url that includes "localhost"
**/

function onLoad() { 
    // simile-widgets.org/wiki/SimileAjax/Debug
	SimileAjax.Debug.silent = false;
    // documentaton: simile-widgets.org/wiki/Exhibit/API/2.2.0/Data/Database
    window.database = Exhibit.Database.create();
    // Loads file, then calls onLoadHelper
    loadStaticData("data/user.php", window.database, onLoadHelper);
}

function onLoadHelper() {

    var urls = ["data/schema.js"];
    var selected = coursesFromURI();
    for (var i=0; i< selected.length; i++) {
         possiblyLog({"picker-initial-course":i});
    }
    // pulls picked classes from cookie and MySQL
	var picked_classes = savedPickedClasses();
    // changes classes to courses and removes duplicates
    // ["6.01", "14.02", "6", "8"] -> ["6", "14", "8"]
    var courseIDs = classesToCourses(picked_classes.concat(selected));
    addCourses(courseIDs, urls);

    var fDone = function() {
        setupLogin();

        document.getElementById("schedule-preview-pane").style.display = "block";
        document.getElementById("browsing-interface").style.display = "block";
        
        // simile-widgets.org/wiki/Exhibit/API/2.2.0/Data/Collection
        var pickedSections = new Exhibit.Collection("picked-sections", window.database);
        var pickedClasses = new Exhibit.Collection("picked-classes", window.database);

        pickedSections._update = function() {
            this._items = this._database.getSubjects("true", "picked");
            // defined in enableUnitAdder()
            this._onRootItemsChanged();
        };
		pickedClasses._update = function() {
		    this._items = this._database.getSubjects("true", "sectionPicked");
            this._items.visit(function(classID) {
                window.database.getItem(classID).picked = true;
                
                });
		    this._onRootItemsChanged();
		};
        pickedSections._update();
        pickedClasses._update();

        window.exhibit = Exhibit.create();

        window.exhibit.setCollection("picked-sections", pickedSections);
        window.exhibit.setCollection("picked-classes", pickedClasses);

        // loads picked classes
        updateExhibitSections();
        window.exhibit.configureFromDOM();
        enableMiniTimegrid();
        enableUnitAdderListener();
        fillAddMoreSelect();
        enableClassList();
        pickedSections._update();
    };
    loadURLs(urls, fDone, null);
}

// Adds each data file that needs to be loaded to urls
// Marks each course loaded
function addCourses(courseIDs, urls) {
    // returns true or false, removes "hass_d" from list of courses
    var hass_d = hass_dSetup(courseIDs);
    var regularCourses = [];
    if (courseIDs.length > 0 ) {
        for (var i =0; i< courses.length; i++) {
            var course = courses[i];
            if (!course.loaded && courseIDs.indexOf(course.number) != -1) {
                if (course.interdepartmental) {
                    urls.push('data/spring-fall/interdepartmental-courses/'+course.number+'.json');
                }
                else {
                    addStaticURLs(course.number, urls);
                    regularCourses.push(course.number);
                }
                course.loaded = true;
            }
        }
        if (regularCourses.length >0) {
            urls.push('http://coursews.mit.edu/coursews/?term=2012'+term+'&courses=' + regularCourses.join(';'));
        }
    }
    // Load data for HASS courses
    if (hass_d) {
        urls.push('http://coursews.mit.edu/coursews/?term=2012'+term+'&hassd_only=y');
        for (var j=0; j < courses.length; j++) {
            var course = courses[j];
            // loads static data for *all* courses
            if (!course.loaded && !course.interdepartmental) { addStaticURLs(course.number, urls); }
        }
    }
}

// Like addCourses but for only adding individual classes
function addClass(courseIDs, urls) {
    urls.push('http://coursews.mit.edu/coursews/?term=2012'+term+'&courses=' + courseIDs.join(';'));
    for (var i=0; i < courseIDs.length; i++) {
        addStaticURLs(courseIDs[i], urls);
    }
}

function addStaticURLs(courseID, urls) {
    if (courseID != '' && courseID != "hass_d") {
	    urls.push("data/spring-fall/textbook-data/" + courseID + ".json");
		if (courseID == "6") {
			urls.push("data/tqe.json");
			urls.push("data/hkn.json");
		}
	}
}

function hass_dSetup(courseIDs) {
    var hass_d = false;
    while (courseIDs.indexOf('hass_d') != -1) {
        hass_d = true;
        courseIDs.splice(courseIDs.indexOf('hass_d'), 1);
    }
    return hass_d;
}

function markLoaded(courseID) {
    for (var i = 0; i < courses.length; i++) {
        var course = courses[i];
        if (courseID == course.number) {
            course.loaded = true;
            return;
        }
    }
}

function isLoaded(courseID) {
    for (var i = 0; i < courses.length; i++) {
        var course = courses[i];
        if (courseID == course.number)
            return course.loaded ? true : false;
    }
}
/*
 * Helper functions for onLoad()
 */

// Loads picked classes from cookies and from MySQL db
// Doesn't work when there are no classes in cookie
function savedPickedClasses() {
    var pickedClasses = getExhibitSet('picked-classes').toArray();
    var userID = window.database.getObject('user', 'userid');
    if (userID != null) {
        $.ajax({ type: 'POST',
                url: 'data/user.php',
                data: { 'userid' : userID, 'getPickedClasses' : true},
                async: false,
                dataType: 'json',
                success: function(mysqlClasses) {
                    pickedClasses = pickedClasses.concat(mysqlClasses);
                }
        });
    }
    return pickedClasses;
}

function coursesFromURI() {
    var urlQueryPortion = document.location.search;
    if (urlQueryPortion.length > 1) {
        var encodedCourses = urlQueryPortion.split("=")[1];
        var decodedCourses = decodeURIComponent(encodedCourses);
        courseIDs = decodedCourses.split(";");
    }
    return courseIDs;
}

function classesToCourses(classList) {
    var courses = [];
    for (var i=0; i<classList.length; i++) {
        var course = classList[i].split('.')[0];
        if (courses.indexOf(course) == -1) {
            courses.push(course);
        }
    }
    return courses;
}

/** When protocol is https on an MIT server, certificates are automatically authenticated.
    On clicking "login", protocol changes to https, certificates are processed,
    and window.database.getObject("user", "athena") becomes a kerberos ID.
**/
function setupLogin() {
	var athena = window.database.getObject("user", "athena");
	var url = document.location.href;

    if (window.location.host.search(/localhost/) >= 0 ) {
        if (athena != null) {
            $('#localhostLogin').html(' &bull; logged in as '+athena+'&bull; <a href="'+url+'" onClick="toggleLogin(false);">log out on localhost</a>');
        }
        else {
            $('#localhostLogin').html(' &bull; <a href="'+url+'" onClick="toggleLogin(true);">log in on localhost</a>');
        }
    }

	else if (document.location.protocol == 'https:' && athena != null) {
		url = url.replace('https:', 'http:');
		$('#httpsStatus').html(' &bull; logged in as ' + athena +
			'&bull; <a href="' + url + '">logout</a>');
	}
	else {
		url = url.replace('http:', 'https:');
		$('#httpsStatus').html(' &bull; <a href="' + url + '">login</a>');
	}
}

function toggleLogin(login) {
    writeCookie('loggedIn', login);
}

/*==================================================
 * Post-initialization class-loading functionality
 *==================================================
 */

function loadMoreClass(button) {
    var classID = button.getAttribute("classID");
    var course = classID.split(".")[0];
    loadSingleCourse(course);
}

// To add several individual classes, used for cross-listed classes
// Ex. if user loads Course 18, also load 6.046, 2.062, 6.042, etc.
function loadIndividualClasses(classList) {
    var urls = [];
    var courses = classesToCourses(classList);
    addClass(courses, urls);
    SimileAjax.WindowManager.cancelPopups();
    loadURLs(urls, function(){}, classList);
}

function loadSingleCourse(course) {
    var urls = [];
    addCourses([course], urls);
    SimileAjax.WindowManager.cancelPopups();
    loadURLs(urls, function(){}, null);
}

function fillAddMoreSelect() {
    var select = document.getElementById("add-more-select");
    select.innerHTML = "";
    // creates dropdown list
    var option = document.createElement("option");
    option.value = "";
    option.label = "add more courses";
    option.text = "add more courses";
    select.appendChild(option);
    for (var i = 0; i < courses.length; i++) {
        var course = courses[i];
        if (!(course.loaded)) {
            var label = course.number + " " + course.name;
            option = document.createElement("option");
            option.value = course.number;
            option.label = label;
            option.text = label;
            select.appendChild(option);
        }
    }
}

function onAddMoreSelectChange() {
    var select = document.getElementById("add-more-select");
    var course = select.value;
    if (course.length > 0) {
        possiblyLog({
            "picker-add-course":course
        });
        var urls = [];
        addCourses([course], urls);
        
        SimileAjax.WindowManager.cancelPopups();
        
        Exhibit.UI.showBusyIndicator();

        loadURLs(urls, function(){ 
                Exhibit.UI.hideBusyIndicator();
                fillAddMoreSelect(); 
            },
            null);
    }
}

function showPrereq(elmt, itemID) {
    Exhibit.UI.showItemInPopup(itemID, elmt, exhibit.getUIContext());
}

function logFacet(facetName) {
    //log that facet has been uncollapsed
    // possiblyLog
}
