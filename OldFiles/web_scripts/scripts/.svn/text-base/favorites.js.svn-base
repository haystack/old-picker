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
    possiblyLog({
        "picker-mark-favorite":classID
    });
}

function undoFavorite(classID, img) {
    window.database.removeStatement(classID, "favorite", "true");
    img.src = "images/gray-star.png";
    possiblyLog({
        "picker-remove-favorite":classID
    });
    
    var checkbox = document.getElementById("favorite-box");
    if (checkbox.checked) {
        processShowOnlyFavoriteClass(checkbox);
    }
    
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
    possiblyLog({
        "picker-toggle-favorite-filter":"show-favorites-only"
    });
}

function showAllClasses() {
    var collection = window.exhibit.getDefaultCollection();
    collection._items = window.database.getSubjects("Class", "type");
    collection._onRootItemsChanged();
    possiblyLog({
        "picker-toggle-favorite-filter":"show-all"
    });
}
