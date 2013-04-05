/* Formerly part of browse.js ; look there for svn history */

function onPickUnpick(button) {
    var sectionID = button.getAttribute("sectionID");
    var picked = window.database.getObject(sectionID, "picked") == "true";
    if (picked) {
        // simile-widgets.org/wiki/SimileAjax/History
        SimileAjax.History.addLengthyAction(
            // Does doUnpick; does doPick if back button hit
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
    updateStoredDataFromExhibit();
};

function onUnpick(button) {
    var sectionID = button.getAttribute("sectionID");
    SimileAjax.History.addLengthyAction(
        function() { doUnpick(sectionID) },
        function() { doPick(sectionID) },
        "Unpicked " + sectionID
    );
};

function sectionIDtoClass(sectionID) {
    var db = window.exhibit.getDatabase();
    var type = db.getObject(sectionID, "type");
    var classID = db.getObject(sectionID, sectionTypeToData[type].linkage);
    return classID;
}

function doPick(sectionID) {

    window.database.addStatement(sectionID, "picked", "true");
    window.database.addStatement(sectionID, "color", getNewColor());
    window.database.removeStatement(sectionID, "temppick", "true");
    window.exhibit.getCollection("picked-sections")._update();

    showHidePickDiv(sectionID, true);

    var classID = window.database.getItem(sectionIDtoClass(sectionID))["id"];
    var data = {items: [ {"label":classID, "selected":"yes"}]};
    window.database.loadData(data);
}
function doUnpick(sectionID) {

    var color = window.database.getObject(sectionID, "color");
    releaseColor(color);
    
    window.database.removeStatement(sectionID, "picked", "true");
    window.database.removeStatement(sectionID, "color", color);
    
    window.exhibit.getCollection("picked-sections")._update();
    
    showHidePickDiv(sectionID, false);

    var classID = window.database.getItem(sectionIDtoClass(sectionID))["id"];
    window.database.removeStatement(classID, "selected", "yes");
}

function onMouseOverSection(div) {
    var sectionID = div.getAttribute("sectionID");
    if (window.database.getObject(sectionID, "picked") == null) {
        updateMiniTimegrid(true, sectionID);
    }
}
function onMouseOutSection(div) {
    var sectionID = div.getAttribute("sectionID");
    if (window.database.getObject(sectionID, "picked") == null) {
        updateMiniTimegrid(true, null);
    }
}
function showHidePickDiv(sectionID, picked) {
    var thediv = document.getElementById("divid-" + sectionID);
    if (thediv != null) {
        thediv.className = picked ? "each-section-picked" : "each-section-unpicked";
        
        var button = thediv.getElementsByTagName("button")[0];
        button.innerHTML = picked ? "Remove" : "Add";
    }
}

