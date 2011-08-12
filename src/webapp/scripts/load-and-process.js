// Formerly part of browse.js
// Look there for svn history

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
                // xmlhttp.responseText is JSON data
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
}
