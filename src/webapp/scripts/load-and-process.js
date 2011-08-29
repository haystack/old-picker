// Formerly part of browse.js
// Look there for svn history

function loadURLs(urls, fDone) {
    var fNext = function() {
        if (urls.length > 0) {
            var url = urls.shift();

            if (url.search(/http/) == 0) {
                // For coursews data
            	Exhibit.importers["application/jsonp"].load(url, window.database, fNext, processOfficialData);
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

    for (attribute in item) {
        if (item[attribute] == '') {
            delete item[attribute];
        }
    }
    if ('master_subject_id' in item) {
        item.id = item.master_subject_id;
    }

    if (term == 'iap') { }
    else if (term == 'fall') {
        item.Instructor = item.fall_instructors;
    } 
    else {
        item.Instructor = item.spring_instructors;
    }
    if ('equivalent_subjects' in item) {
        item.equivalent_subjects = courseArrayToLinks(item.equivalent_subjects);
    }

	if ('timeAndPlace' in item) {
		if (item.timeAndPlace.search(/ARRANGED/) >= 0 || item.timeAndPlace.search(/null/) >= 0) {
			item.timeAndPlace = 'To be arranged';
		}
	}
	if ('units' in item && item.is_variable_units == 'Y') {
		item['units'] = 'Arranged';
		item['total-units'] = 'Arranged';
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
    else {
	    while (prereqs.search(/GIR:/) >= 0) {
		    gir = prereqs.match(/GIR:.{4}/);
		    prereqs = prereqs.replace(/GIR:.{4}/, girData[gir].join(" or "));
	    }
	    while (prereqs.search(/[\]\[]/) >= 0 ) {
		    prereqs = prereqs.replace(/[\]\[]/, "");
	    }
    }
    // Makes prereqs appear as links
    prereqs = coursesToLinks(prereqs);
    return prereqs;
}

function courseArrayToLinks(array) {
    string = array.join(',, ');
    string = coursesToLinks(string);
    return string.split(',, ');
}

function coursesToLinks(courseString) {
    // Any number of spaces followed by any number of digits
    // followed by, optionally, a letter
    var courseArray = courseString.match(/([^\s\/]+\.[\d]+\w?)/g);
    if (courseArray != null) {
        var string = courseString;
        var output = '';
        var upTo = 0;
        for (var c=0; c<courseArray.length; c++) {
            var course = courseArray[c];
            var index = string.indexOf(course, upTo);
            var replacement = '<a href=\'javascript:{}\' onclick=\'showPrereq(this, "' + course.replace(/J/, '')+'");\'>' + course + '</a>';
            // string.substring(upTo, index) is everything not being replaced
            output += string.substring(upTo, index) + replacement;
            upTo = index + course.length;
        }
        courseString = output + string.substring(upTo);
    }
    return courseString;
}

// http://api.jquery.com/jQuery.ajax/
function loadStaticData(link, database, cont) {
    var url = typeof link == "string" ? link : link.href;
    // Documentation: simile-widgets.org/wiki/Exhibit/API/2.2.0/Persistence
    // Given a relative or absolute URL, returns the absolute URL
    url = Exhibit.Persistence.resolveURL(url);

    var fError = function(jqXHR, textStatus, errorThrown) {
        Exhibit.UI.hideBusyIndicator();
        Exhibit.UI.showHelp(Exhibit.l10n.failedToLoadDataFileMessage(url));
        if (cont) cont();
    };
    
    var fSuccess = function(jsonObject, textStatus, jqXHR) {
        Exhibit.UI.hideBusyIndicator();
        try {
            if (jsonObject != null) {
                database.loadData(jsonObject, Exhibit.Persistence.getBaseURL(url));
            }
        } catch (error) {
            SimileAjax.Debug.exception(error, "Error loading Exhibit JSON data from " + url);
        } finally {
            if (cont) cont();
        }
    };

    Exhibit.UI.showBusyIndicator();
    // Calls fSuccess if data is json in correct form, else calls fError
    $.ajax({ url : url,
        error : fError,
        success: fSuccess,
        dataType: 'json' });
}
