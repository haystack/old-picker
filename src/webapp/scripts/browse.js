/*===================================================
 * Exhibit extensions
 *==================================================
 */
var debug = false;

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
/*
var hasTQE = false; 
*/

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

    // pull necessary URLs from cookie, since window.database doesn't exist yet
	var picked_classes = PersistentData.stored('picked-classes').toArray();
	for (var i = 0; i < picked_classes.length; i++) {
		var course = picked_classes[i].split('.')[0];
		if (course.length > 0)
			addCourses([course], urls);
	}
    
    var fDone = function() {
		var athena = window.database.getObject("user", "athena");
		var href = document.location.href;
		
		if (document.location.protocol == 'https:' && athena != null) {
			href = href.replace('https:', 'http:');
			$('#httpsStatus').html(' &bull; logged in as ' + athena +
				'&bull; <a href="' + href + '">logout</a>');
		}
		else {
			href = href.replace('http:', 'https:');
			$('#httpsStatus').html(' &bull; <a href="' + href + '">login</a>');
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
    var coursesA = [];
    var exceptions = { };
    for (var i = 0; i < courseIDs.length; i++) {
        if (courseIDs[i] != "hass_d") {
            if (!debug && courseIDs[i] in exceptions) {
                urls.push("data/spring-fall/exceptions/" + courseIDs[i] + ".json");
            } else {
                coursesA.push(courseIDs[i]);
            }
        }
    }
    
    // warehouse service is up and working as of June 2011
    // NOTE, 2010FA is Fall of 2009-2010 school year. 2009FA is NOT correct. update: loaded as of 2011 fall
// update: 2012FA is fall of 2011-2012 school year
	var coursesString = coursesA.join(";");
	if (coursesString != "" && coursesString != null) {
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
    	    
    		/* scraped data is not needed with working warehouse service
    		urls.push("data/spring-fall/open-data/" + courseID + ".json"); */
    		if (courseID == "6") {
    			urls.push("data/tqe.json");
    			urls.push("data/hkn.json");
    			hasTQE = true;
    		}
    		markLoaded(courseID);
    	}
	}
}

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

function loadURLs(urls, fDone) {
    var fNext = function() {
        if (urls.length > 0) {
            var url = urls.shift();
            if (url.search(/http/) == 0) {
            	Exhibit.importers["application/jsonp"].load(
                    url, window.database, fNext, postProcessOfficialData);
            } else {
            	loadScrapedData(url, window.database, fNext);
            }
        } else {
            fDone();
        }
    };
    fNext();
}

function postProcessOfficialData(json) {
    var items = json.items;				
    for (var i = 0; i < items.length; i++) {
        postProcessOfficialDataItem(items[i]);
    }					
    return json;
}

function postProcessOfficialDataItem(item) {
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
    if ('prereqs' in item) {
        if (item.prereqs == "") {
            item.prereqs = "--";
        }
        while (item.prereqs.search(/[\]\[]/) >= 0 ) {
            item.prereqs = item.prereqs.replace(/[\]\[]/, "");
        }
        var matches = item.prereqs.match(/([^\s\/]+\.[\d]+\w?)/g);
        if (matches != null) {
            var s = item.prereqs;
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
            item.prereqs = output + s.substring(from);
        }
        /*if (item.prereqs.search(/;/) >= 0) {
            while (item.prereqs.search(/or/) > 0) {
                item.prereqs = item.prereqs.replace(/or/, ",");
            }
        } else if (item.prereqs.search(/or/) >= 0) {
            while (item.prereqs.search(/or/) > 0) {
                item.prereqs = item.prereqs.replace(/or/, ",");
            }
        } else {
            while (item.prereqs.search(/,/) >= 0) {
                item.prereqs = item.prereqs.replace(/,/, ";");
            }
        }
        while (item.prereqs.search(/[a-zA-Z\s]/) >= 0 ) {
            item.prereqs = item.prereqs.replace(/[a-zA-Z\s\]\[]/, "");
        }*/
    }
    if ('timeAndPlace' in item) {
        if (item.timeAndPlace.search(/ARRANGED/) >= 0 || item.timeAndPlace.search(/null/) >= 0) {item.timeAndPlace = 'To be arranged';}
    } 
}

function loadScrapedData(link, database, cont) {
    var url = typeof link == "string" ? link : link.href;
    url = Exhibit.Persistence.resolveURL(url);

    var fError = function(statusText, status, xmlhttp) {
        Exhibit.UI.hideBusyIndicator();
        Exhibit.UI.showHelp(Exhibit.l10n.failedToLoadDataFileMessage(url));
        if (cont) cont();
    };
    
    var fDone = function(xmlhttp) {
        Exhibit.UI.hideBusyIndicator();
        try {
            var o = null;
            try {
                o = eval("(" + xmlhttp.responseText + ")");
            } catch (e) {
                Exhibit.UI.showJsonFileValidation(Exhibit.l10n.badJsonMessage(url, e), url);
            }
            
            if (o != null) {
                if (url.indexOf("/exceptions/") >= 0) {
                    o = postProcessOfficialData(o);
                } else {
                	// this is all data now - open and scraped
                    o = postProcessStaticData(o);
            	}
                database.loadData(o, Exhibit.Persistence.getBaseURL(url));
            }
        } catch (e) {
            SimileAjax.Debug.exception(e, "Error loading Exhibit JSON data from " + url);
        } finally {
            if (cont) cont();
        }
    };

    Exhibit.UI.showBusyIndicator();
    SimileAjax.XmlHttp.get(url, fError, fDone);
};

/*
function postProcessScrapedData(o) {
    if ("items" in o) {
        var items = o.items;
        for (var j = 0; j < items.length; j++) {
            var item = items[j];
            if (database.containsItem(item.id)) {
                if ('label' in item) {delete item.label;} 
                if ('course' in item) {delete item.course;} 
                if ('level' in item) {delete item.level;} 
                if ('units' in item) {delete item.units;} 
                if ('total-units' in item) {delete item["total-units"];} 
                if ('description' in item) {delete item.description;} 
                if ('semester' in item) {delete item.semester;} 
                if ('offering' in item) {delete item.offering;} 
                if ('prereq' in item) {delete item.prereq;} 
                if ('Instructor' in item) {delete item["in-charge"];} 
            }
        }
    }
    return o;
};
*/

// processes open and scraped data

function postProcessStaticData(o) {
	if ("items" in o) {
        var items = o.items;
        for (var j = 0; j < items.length; j++) {
            var item = items[j];
			if ('prereqs' in item) {
				if (item.prereqs == "") {
					item.prereqs = "--";
				}
				while (item.prereqs.search(/GIR:/) >= 0) {
					gir = item.prereqs.match(/GIR:.{4}/);
					item.prereqs = item.prereqs.replace(/GIR:.{4}/, girData[gir].join(" or "));
				}
				while (item.prereqs.search(/[\]\[]/) >= 0 ) {
					item.prereqs = item.prereqs.replace(/[\]\[]/, "");
				}
				var matches = item.prereqs.match(/([^\s\/]+\.[\d]+\w?)/g);
				if (matches != null) {
					var s = item.prereqs;
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
					item.prereqs = output + s.substring(from);
				}
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
		}
	}
	return o;
}

function showPrereq(elmt, itemID) {
    Exhibit.UI.showItemInPopup(itemID, elmt, exhibit.getUIContext());
}
