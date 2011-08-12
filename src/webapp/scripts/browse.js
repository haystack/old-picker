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
        SimileAjax.RemoteLog.possiblyLog(obj);
    }
}

Exhibit.Functions["building"] = {
    f: function(args) {
        var building = "";
        args[0].forEachValue(function(v) {
            building = v.split("-")[0];
            return true;
        });
        return new Exhibit.Expression._Collection([ building ],  "text");
    }
};

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
    var courseIDs = coursesFromURI();
    // pulls picked classes from cookie and MySQL
	var picked_classes = savedPickedClasses();
    // maps ["14.03", "22.01"] to ["14", "22"]
    var pickedCourses = picked_classes.map(function(elt) { return elt.split('.')[0]; });
    courseIDs = courseIDs.concat(courseIDs, pickedCourses);
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
            this._onRootItemsChanged();
        };
		pickedClasses._update = function() {
		    this._items = this._database.getSubjects("true", "sectionPicked");
		    this._onRootItemsChanged();
		};

        pickedSections._update();
        pickedClasses._update();

        window.exhibit = Exhibit.create();
        window.exhibit.setCollection("picked-sections", pickedSections);
        window.exhibit.setCollection("picked-classes", pickedClasses);
        //check for cookies needs to be here so that picked classes are loaded before the GUI is loaded
        //if picked classes (and sections) are not loaded before GUI loading, then the add/remove buttons
        //will not display correctly 
        checkForCookies();
        window.exhibit.configureFromDOM();
        enableMiniTimegrid();
        enableUnitAdder();
        fillAddMoreSelect();
        enableClassList();
    };
    loadURLs(urls, fDone);
}

// Adds each data file that needs to be loaded to urls
// Marks each course loaded
function addCourses(courseIDs, urls) { 
    var coursesString = courseIDs.join(";");
	if (coursesString != "" && coursesString != null) {
        // NOTE, 2010FA is Fall of 2009-2010 school year. 2009FA is NOT correct.
        urls.push('http://coursews.mit.edu/coursews/?term=2012FA&courses=' + coursesString);
	}
	
	for (var c = 0; c < courseIDs.length; c++) {
		var courseID = courseIDs[c];
    	if (!isLoaded(courseID) && courseID != '') {
    	    if (courseID != "hass_d") {
    		    urls.push("data/spring-fall/textbook-data/" + courseID + ".json");
		    }
    		
    		// files representing data unavailable from data warehouse
    	    urls.push("data/spring-fall/scraped-data/" + courseID + ".json");
    	    urls.push("data/spring-fall/wtw-data/" + courseID + ".json");
    	    
    		if (courseID == "6") {
    			urls.push("data/tqe.json");
    			urls.push("data/hkn.json");
    		}
    		markLoaded(courseID);
    	}
	}
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
function savedPickedClasses() {
    var pickedClasses = PersistentData.stored('picked-classes').toArray();
    var mysqlPickedClasses;
    var userID = window.database.getObject('user', 'userid');
    if (userID != null) {
        $.ajaxSetup({async:false});
        $.post("data/user.php",
            { "userid" : userID,
              "getPickedClasses" : true
              },
            function(classesJSON) {
                mysqlPickedClasses = JSON.parse(classesJSON);
            });
        $.ajaxSetup({async:true});
        pickedClasses = pickedClasses.concat(mysqlPickedClasses);
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
    var exDate = new Date();
    exDate.setDate(exDate.getDate() + 7);
    document.cookie = 'loggedIn='+login+'; expires='+exDate+'; path=/';
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

function loadSingleCourse(course) {
    var urls = [];
    addCourses([course], urls);

    SimileAjax.WindowManager.cancelPopups();
    loadURLs(urls, function(){});
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
        if (course.hasData && !(course.loaded)) {
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
        });
    }
}


function showPrereq(elmt, itemID) {
    Exhibit.UI.showItemInPopup(itemID, elmt, exhibit.getUIContext());
}
