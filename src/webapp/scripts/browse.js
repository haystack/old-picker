/*==================================================
 * Exhibit extensions
 *==================================================
 */
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
function onLoad() {
    var urls = [ ];
    var hasTQE = false;
    
    var query = document.location.search;
    if (query.length > 1) {
        var params = query.substr(1).split("&");
        for (var i = 0; i < params.length; i++) {
            var a = params[i].split("=");
            var name = a[0];
            var value = a.length > 1 ? decodeURIComponent(a[1]) : "";
            if (name == "courses") {
                var courseIDs = value.split(";");
                for (var c = 0; c < courseIDs.length; c++) {
                    var courseID = courseIDs[c];
                    urls.push("data/spring-fall/" + courseID + ".json");
                    if (courseID == "6") {
                        hasTQE = true;
                    }
                    markLoaded(courseID);
                }
            }
        }
    }
    urls.push("data/schema.js");

    window.database = Exhibit.Database.create();
    
    var fDone = function() {
        document.getElementById("schedule-preview-pane").style.display = "block";
        document.getElementById("browsing-interface").style.display = "block";
        
        var pickedSections = new Exhibit.Collection("picked-sections", window.database);
        pickedSections._update = function() {
            this._items = this._database.getSubjects("true", "picked");
            this._onRootItemsChanged();
        };
        pickedSections._update();
        
        if (hasTQE) {
            var tqeDiv = document.getElementById("tqe-facet");
            tqeDiv.onclick = function() { makeFacet(this); };
            tqeDiv.setAttribute("ex:role", "facet");
            tqeDiv.setAttribute("ex:expression", ".TQE");
            tqeDiv.setAttribute("ex:facetLabel", "TQE &raquo;");
        }
        
        window.exhibit = Exhibit.create();
        window.exhibit.setCollection("picked-sections", pickedSections);
        window.exhibit.configureFromDOM();
        
        setupExistingFacet(document.getElementById("category-facet"));
        setupExistingFacet(document.getElementById("semester-facet"));
        setupExistingFacet(document.getElementById("offering-facet"));
        if (hasTQE) {
            setupExistingFacet(document.getElementById("tqe-facet"));
        }
        
        enableMiniTimegrid();
        enableUnitAdder();
        fillAddMoreSelect();
    };
    loadURLs(urls, fDone);
}

function loadMoreClass(button) {
    var classID = button.getAttribute("classID");
    var course = classID.substr(1).split(".")[0];
    var urls = [];
    for (var i = 0; i < courses.length; i++) {
        var course2 = courses[i];
        if (course == course2.number) {
            if (!course2.hasData) {
                alert("Oops! We actually don't have the data for this course.");
                return;
            }
            urls.push("data/spring-fall/" + course + ".json");
            course2.loaded = true;
            break;
        }
    }
    
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
        var urls = [];
        urls.push("data/spring-fall/" + course + ".json");
        markLoaded(course);
        
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
            var importer = Exhibit.importers["application/json"];
            importer.load(url, window.database, fNext);
        } else {
            fDone();
        }
    };
    fNext();
}

/*==================================================
 * Panel switching and facet toggling
 *==================================================
 */
function onShowScheduleDetails() {
    SimileAjax.History.addLengthyAction(
        showScheduleDetails,
        showSchedulePreview,
        "Show Schedule Details"
    );
}

function onShowSchedulePreview() {
    SimileAjax.History.addLengthyAction(
        showSchedulePreview,
        showScheduleDetails,
        "Show Classes"
    );
}

function showScheduleDetails() {
    document.getElementById("classes-layer").style.visibility = "hidden";
    document.getElementById("schedule-preview-pane").style.visibility = "hidden";
    
    document.getElementById("schedule-details-layer").style.visibility = "visible";
    
    document.body.scrollTop = 0;
}

function showSchedulePreview() {
    document.getElementById("schedule-details-layer").style.visibility = "hidden";
    
    document.getElementById("classes-layer").style.visibility = "visible";
    document.getElementById("schedule-preview-pane").style.visibility = "visible";
    
    document.body.scrollTop = 0;
}

function setupExistingFacet(div) {
    div.firstChild.onclick = function() { unmakeFacet(div); }
}

function makeFacet(div) {
    div.className = "";
    
    var facet = Exhibit.UI.createFacet(facetData[div.id], div, window.exhibit.getUIContext());    
    window.exhibit.setComponent(div.id, facet);
    
    div.firstChild.onclick = function() { unmakeFacet(div); }
    div.onclick = null;
};

function unmakeFacet(div) {
    var facet = window.exhibit.getComponent(div.id);
    if (facet.hasRestrictions() && !window.confirm("You have something selected in this facet. OK to clear your selection?")) {
        return;
    }
    
    window.exhibit.disposeComponent(div.id);
    
    div.innerHTML = facetData[div.id].facetLabel;
    div.className = "collapsed-facet";
    div.onclick = function() { makeFacet(div); };
}

/*==================================================
 * Favorites
 *==================================================
 */
function toggleFavorite(img) {
    var classID = img.getAttribute("classID");
    var favorite = window.database.getObject(classID, "favorite") == "true";
    if (favorite) {
        SimileAjax.History.addLengthyAction(
            function() { undoFavorite(classID, img) },
            function() { doFavorite(classID, img) },
            "Unfavorite " + classID
        );
    } else {
        SimileAjax.History.addLengthyAction(
            function() { doFavorite(classID, img) },
            function() { undoFavorite(classID, img) },
            "Favorite " + classID
        );
    }
}

function doFavorite(classID, img) {
    window.database.addStatement(classID, "favorite", "true");
    img.src = "images/yellow-star.png";
}

function undoFavorite(classID, img) {
    window.database.removeStatement(classID, "favorite", "true");
    img.src = "images/gray-star.png";
}

function processShowOnlyFavoriteClass(checkbox) {
    if (checkbox.checked) {
        SimileAjax.History.addLengthyAction(
            function() { showFavoritesOnly(); checkbox.checked = true; },
            function() { showAllClasses(); checkbox.checked = false; },
            "Show favorites only"
        );
    } else {
        SimileAjax.History.addLengthyAction(
            function() { showAllClasses(); checkbox.checked = false; },
            function() { showFavoritesOnly(); checkbox.checked = true; },
            "Show all classes"
        );
    }
};

function showFavoritesOnly() {
    var collection = window.exhibit.getDefaultCollection();
    collection._items = window.database.getSubjects("true", "favorite");
    collection._onRootItemsChanged();
}

function showAllClasses() {
    var collection = window.exhibit.getDefaultCollection();
    collection._items = window.database.getSubjects("Class", "type");
    collection._onRootItemsChanged();
}

/*==================================================
 * Section picking
 *==================================================
 */

function onPickUnpick(button) {
    var sectionID = button.getAttribute("sectionID");
    var picked = window.database.getObject(sectionID, "picked") == "true";
    if (picked) {
        SimileAjax.History.addLengthyAction(
            function() { doUnpick(sectionID) },
            function() { doPick(sectionID) },
            "Unpicked " + sectionID
        );
    } else {
        SimileAjax.History.addLengthyAction(
            function() { doPick(sectionID) },
            function() { doUnpick(sectionID) },
            "Picked " + sectionID
        );
    }
};

function onUnpick(button) {
    var sectionID = button.getAttribute("sectionID");
    SimileAjax.History.addLengthyAction(
        function() { doUnpick(sectionID) },
        function() { doPick(sectionID) },
        "Unpicked " + sectionID
    );
};

function doPick(sectionID) {
    window.database.addStatement(sectionID, "picked", "true");
    window.database.addStatement(sectionID, "color", getNewColor());
    window.database.removeStatement(sectionID, "temppick", "true");
    
    window.exhibit.getCollection("picked-sections")._update();

    showHidePickDiv(sectionID, true);
}
function doUnpick(sectionID) {
    var color = window.database.getObject(sectionID, "color");
    releaseColor(color);
    
    window.database.removeStatement(sectionID, "picked", "true");
    window.database.removeStatement(sectionID, "color", color);
    
    window.exhibit.getCollection("picked-sections")._update();
    
    showHidePickDiv(sectionID, false);
}

function onMouseOverSection(div) {
    //if (!SimileAjax.Platform.browser.isIE) {
        var sectionID = div.getAttribute("sectionID");
        if (window.database.getObject(sectionID, "picked") == null) {
            updateMiniTimegrid(true, sectionID);
        }
    //}
}
function onMouseOutSection(div) {
    //if (!SimileAjax.Platform.browser.isIE) {
        var sectionID = div.getAttribute("sectionID");
        if (window.database.getObject(sectionID, "picked") == null) {
            updateMiniTimegrid(true, null);
        }
    //}
}
function showHidePickDiv(sectionID, picked) {
    var thediv = document.getElementById("divid-" + sectionID);
    if (thediv != null) {
        thediv.className = picked ? "each-section-picked" : "each-section-unpicked";
        
        var button = thediv.getElementsByTagName("button")[0];
        button.innerHTML = picked ? "Remove" : "Add";
    }
}
