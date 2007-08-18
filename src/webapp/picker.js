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
    document.getElementById("classes-layer").style.display = "none";
    document.getElementById("schedule-preview-pane").style.visibility = "hidden";
    
    document.getElementById("schedule-details-layer").style.display = "block";
}

function showSchedulePreview() {
    document.getElementById("schedule-details-layer").style.display = "none";
    
    document.getElementById("classes-layer").style.display = "block";
    document.getElementById("schedule-preview-pane").style.visibility = "visible";
}

function makeFacet(div) {
    div.className = "";
    
    var facet = Exhibit.UI.createFacet(facetData[div.id], div, window.exhibit.getUIContext());    
    window.exhibit.setComponent(div.id, facet);
    
    div.onclick = function() { unmakeFacet(div); }
};

function unmakeFacet(div) {
    window.exhibit.disposeComponent(div.id);
    
    div.innerHTML = facetData[div.id].facetLabel;
    div.className = "collapsed-facet";
    div.onclick = function() { makeFacet(div); };
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
    var sectionID = div.getAttribute("sectionID");
    if (window.database.getObject(sectionID, "picked") == null) {
        updateMiniTimegrid(sectionID);
    }
}

function onMouseOutSection(div) {
    var sectionID = div.getAttribute("sectionID");
    if (window.database.getObject(sectionID, "picked") == null) {
        updateMiniTimegrid();
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

