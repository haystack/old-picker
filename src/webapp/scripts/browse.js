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
    else {
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

/* Code for handling exceptions (courses whose data doesn't come from the warehouse removed), rev. 9567, 7/11.
    See earlier revisions if reinstating this code. */

function onLoad() {
    // If false, can output messages in Firebug
    // see simile-widgets.org/wiki/SimileAjax/Debug
	SimileAjax.Debug.silent = true;
    
    var urls = [ ];
    var courseIDs = [ ];

    var URI_course_string = document.location.search;
    if (URI_course_string.length > 1) {
        var encoded_courses = URI_course_string.split("=")[1];
        var decoded_courses = decodeURIComponent(encoded_courses);
        courseIDs = decoded_courses.split(";");
        addCourses(courseIDs, urls);
    }

    urls.push("data/schema.js");
    // load data from MySQL
    urls.push('data/user.php');

    // documentaton: simile-widgets.org/wiki/Exhibit/API/2.2.0/Data/Database
    window.database = Exhibit.Database.create();

    // pulls URLs from cookie
	var picked_classes = PersistentData.stored('picked-classes').toArray();
	for (var i = 0; i < picked_classes.length; i++) {
		var course = picked_classes[i].split('.')[0];
		if (course.length > 0)
			addCourses([course], urls);
	}
    
    var fDone = function() {
		var athena = window.database.getObject("user", "athena");
		var url = document.location.href;
		
		if (document.location.protocol == 'https:' && athena != null) {
			url = url.replace('https:', 'http:');
			$('#httpsStatus').html(' &bull; logged in as ' + athena +
				'&bull; <a href="' + url + '">logout</a>');
		}
		else {
			url = url.replace('http:', 'https:');
			$('#httpsStatus').html(' &bull; <a href="' + url + '">login</a>');
		}
	
        document.getElementById("schedule-preview-pane").style.display = "block";
        document.getElementById("browsing-interface").style.display = "block";
        
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
        window.exhibit.configureFromDOM();
        enableMiniTimegrid();
        enableUnitAdder();
        fillAddMoreSelect();
        enableClassList();
        checkForCookies();
    };
    loadURLs(urls, fDone);
}

function addCourses(courseIDs, urls) { 
    
    var coursesString = courseIDs.join(";");
	//var coursesString = coursesA.join(";");
	if (coursesString != "" && coursesString != null) {
        // warehouse service is up and working as of June 2011
        // NOTE, 2010FA is Fall of 2009-2010 school year. 2009FA is NOT correct.
        urls.push('http://coursews.mit.edu/coursews/?term=2012FA&courses=' + coursesString);
	}
	
	for (var c = 0; c < courseIDs.length; c++) {
		var courseID = courseIDs[c];
    	if (!isLoaded(courseID)) {
    	    if (courseID != "hass_d") {
    		    urls.push("data/spring-fall/textbook-data/" + courseID + ".json");
		    }
    		
    		// a light file representing some scraped information unavailable from data warehouse
    	    urls.push("data/spring-fall/scraped-data/" + courseID + ".json");
    	    // and supplementary wtw data
    	    urls.push("data/spring-fall/wtw-data/" + courseID + ".json");
    	    
    		if (courseID == "6") {
    			urls.push("data/tqe.json");
    			urls.push("data/hkn.json");
    		}
    		markLoaded(courseID);
    	}
	}
}

function loadURLs(urls, fDone) {
    var fNext = function() {
        if (urls.length > 0) {
            var url = urls.shift();
            if (url.search(/http/) == 0) {
                // For coursews data
            	Exhibit.importers["application/jsonp"].load(
                    url, window.database, fNext, processOfficialData);
            } else {
            	loadStaticData(url, window.database, fNext);
            }
        } else {
            fDone();
        }
    };
    fNext();
}

function processOfficialData(json) {
    var items = json.items;				
    for (var i = 0; i < items.length; i++) {
        processOfficialDataItem(items[i]);
    }					
    return json;
}

function processOfficialDataItem(item) {

    if ('prereqs' in item) {
        item.prereqs = processPrereqs(item.prereqs);
	}

	if ('timeAndPlace' in item) {
		if (typeof item.timeAndPlace != "string") {
			item.timeAndPlace = item.timeAndPlace.join(", ");
		} 
		if (item.timeAndPlace.search(/ARRANGED/) >= 0 || item.timeAndPlace.search(/null/) >= 0) {
			item.timeAndPlace = 'To be arranged';
		}
	}

	if ('units' in item) {
		if (item.units == '0-0-0' || item.units == 'unknown') {
			item.units = 'Arranged';
			item['total-units'] = 'Arranged';
		}
	}

    if ('offering' in item) {
        item.offering == 'Y'?item.offering = 'Currently Offered':item.offering = 'Not offered this year';
    }

    if (item.type == 'LectureSession') {
        item.type = 'LectureSection';
        item["lecture-section-of"] = item["section-of"];
        delete item["section-of"];
    }
    if (item.type == 'RecitationSession') {
        item.type = 'RecitationSection';
        item["rec-section-of"] = item["section-of"];
        delete item["section-of"];
    } 
    if (item.type == 'LabSession') {
        item.type = 'LabSection';
        item["lab-section-of"] = item["section-of"];
        delete item["section-of"];
    } 
}

// Puts a string of prereqs into correct format
function processPrereqs(prereqs) {
    if (prereqs == "") {
		prereqs = "--";
	}
	while (prereqs.search(/GIR:/) >= 0) {
		gir = prereqs.match(/GIR:.{4}/);
		prereqs = prereqs.replace(/GIR:.{4}/, girData[gir].join(" or "));
	}
	while (prereqs.search(/[\]\[]/) >= 0 ) {
		prereqs = prereqs.replace(/[\]\[]/, "");
	}

    // Makes prereqs appear as links
	var matches = prereqs.match(/([^\s\/]+\.[\d]+\w?)/g);
	if (matches != null) {
		var s = prereqs;
		var output = "";
		var from = 0;
		for (var m = 0; m < matches.length; m++) {
			var match = matches[m];
			var i = s.indexOf(match, from);
			var replace = 
				"<a href=\"javascript:{}\" onclick=\"showPrereq(this, '" +
					match.replace(/J/, "")+"');\">" + match + "</a>";
			
			output += s.substring(from, i) + replace;
			from = i + match.length;
		}
		prereqs = output + s.substring(from);
    }
    
    return prereqs;
}

function loadStaticData(link, database, cont) {
    var url = typeof link == "string" ? link : link.href;
    // Documentation: simile-widgets.org/wiki/Exhibit/API/2.2.0/Persistence
    // Given a relative or absolute URL, returns the absolute URL
    url = Exhibit.Persistence.resolveURL(url);

    var fError = function(statusText, status, xmlhttp) {
        Exhibit.UI.hideBusyIndicator();
        Exhibit.UI.showHelp(Exhibit.l10n.failedToLoadDataFileMessage(url));
        if (cont) cont();
    };
    
    var fDone = function(xmlhttp) {
        Exhibit.UI.hideBusyIndicator();
        try {
            var JSONobject = null;
            try {
                // xmlhttp.responseText is a JSON data file
                JSONobject = eval("(" + xmlhttp.responseText + ")");
            } catch (e) {
                Exhibit.UI.showJsonFileValidation(Exhibit.l10n.badJsonMessage(url, e), url);
            }
            
            if (JSONobject != null) {
                database.loadData(JSONobject, Exhibit.Persistence.getBaseURL(url));
            }
        } catch (error) {
            SimileAjax.Debug.exception(error, "Error loading Exhibit JSON data from " + url);
        } finally {
            if (cont) cont();
        }
    };

    Exhibit.UI.showBusyIndicator();
    // can be replaced by jQuery
    // performs an asynchronous HTTP get
    // Calls fDone(url) if url in right form, otherwise calls fError
    SimileAjax.XmlHttp.get(url, fError, fDone);
};


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
