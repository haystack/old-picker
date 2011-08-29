/*
 * @description Maintenance of picked-classes -- stores data
 * class-related.js
 */
 
// no elegant way to do this, since multiple sections might correspond to a given class.
// other than this, we'd have to figure out each time whether to actually mark a class as
// added or deleted based on the classes each section in picked-sections corresponds to.
function enableClassList() {
	var collection = window.exhibit.getCollection("picked-sections");
    collection.addListener({ onItemsChanged: function() { 
            var sections = collection.getRestrictedItems();
            var classes = new Exhibit.Set();
            if (sections.size() > 0) {
                sections.visit(function(sectionID) {
                    var type = window.database.getObject(sectionID, "type");
                    var classID = window.database.getObject(sectionID, sectionTypeToData[type].linkage);

                    classes.add(classID);
                })
            }
            var pickedClasses = window.exhibit.getCollection("picked-classes");
            pickedClasses._items = classes;
            pickedClasses._onRootItemsChanged();
            
            updateStoredDataFromExhibit();
            
            // blurb to update pre-registration div - only active at certain times
            /*
            if (classes.size() > 0) {
                var div = document.getElementById('pre-register');
                var text = ['<input type="button" onclick="document.location=\'http://student.mit.edu/ent/cgi-bin/sfprwtrm.sh?'];
                text.push(classes.toArray().join(","));
                text.push('\'" value="Pre-register these classes"/>');
                var text = ['<form method=post action="http://student.mit.edu/catalog/prereg_message.cgi">'];
                classes.visit(function(classID) {
                    text.push('<input type="hidden" name="STATUS" value="Add">'
                                + '<input type="hidden" name="SUBJECT" value="' + classID + '">'
                                + '<input type="hidden" name="UNIT" value="">'
                                + '<input type="hidden" name="TITLE" value="">'
                                + '<input type="hidden" name="LP" value="">');
                });
                text.push('<INPUT TYPE="submit" VALUE="Pre-register these classes"></FORM>');
            
                div.innerHTML = text.join('');
            }
*/
        }
    });
    
}

function submitBooksQuery() {
    window.location = getBooksURL();
}

function getBooksURL() {
    var classes = window.exhibit.getCollection("picked-classes").getRestrictedItems();
    var classIDs = [];
    classes.visit(function(classID) {
            classIDs.push(classID);
        });
    var classIDsText = classIDs.join(",");
    return 'http://www.bookspicker.com/#search?q=' + classIDsText + '&bundle=' + classIDsText;
}

// updates cookies AND pushes updates to database.
/*
function updateCookies() {
    var exDate = new Date();
    exDate.setDate(exDate.getDate() + 7); // default expiration in a week
    
    var sections = window.exhibit.getCollection("picked-sections").getRestrictedItems();
    var classes = window.exhibit.getCollection("picked-classes").getRestrictedItems();
    
    document.cookie = 'picked-sections='+sections.toArray()+'; expires='+exDate+'; path=/';
    document.cookie = 'picked-classes='+classes.toArray()+'; expires='+exDate+'; path-/';
    
    if (window.database.getObject('user', 'userid') != null) {
		$.post("./scripts/post.php",
			{ userid: window.database.getObject('user', 'userid'),
			  pickedsections: sections.toArray().join(','),
			  pickedclasses: classes.toArray().join(',')
			  });
    }
}
*/

// Updates Exhibit collection of picked sections using cookies 
// and, if logged in MySQL data
/*
function checkForCookies() {
	var sections = PersistentData.stored('picked-sections');
    var mysqlSections = new Exhibit.Set(getStoredSections());
    sections.addSet(mysqlSections);

	sections.visit(
		function(sectionID) {
			if (sectionID.length == 0 || window.database.containsItem(sectionID) == false)
				return;
			window.database.addStatement(sectionID, "picked", "true");
			window.database.addStatement(sectionID, "color", getNewColor());
		});

	window.exhibit.getCollection("picked-sections")._update();
    updateCookies();
}
*/

function getStoredSections() {
    var mysqlSections;
    var userID = window.database.getObject('user', 'userid');
    if (userID != null) {
        $.ajax({ type: 'POST',
            url: 'data/user.php',
            data: { 'userid' : userID, 'getPickedSections' : true},
            async: false,
            dataType: 'json',
            success: function(data) {
                mysqlSections = data;
                }
        });
        return mysqlSections;
    }
}
