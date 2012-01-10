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
            
            if (classes.size() > 0) {
                var div = document.getElementById('pre-register');
                var text = ['<input type="button" onclick="document.location=\'https://student.mit.edu/cgi-bin/sfprwtrm.sh?'];
                text.push(classes.toArray().join(","));
                text.push('\'" value="Pre-register these classes"/>');
                div.innerHTML = text.join('');
            }
        }
    });
    
}

function submitBooksQuery() {
    window.location = getBooksURL();
}
/**
function getBooksURL() {
    var classes = window.exhibit.getCollection("picked-classes").getRestrictedItems();
    var classIDs = [];
    classes.visit(function(classID) {
            classIDs.push(classID);
        });
    var classIDsText = classIDs.join(",");
    return 'http://www.bookspicker.com/#search?q=' + classIDsText + '&bundle=' + classIDsText;
}
**/

function getBooksURL() {
    var classes = window.exhibit.getCollection("picked-classes").getRestrictedItems();
    var db = window.exhibit.getDatabase();
    var isbns = [];
    classes.visit(function(classID) {
        var books = db.getSubjects(classID, "class-textbook-of");
        books.visit(function(bookID) {
            isbn = db.getObject(bookID, "isbn");
            // "0393925161 (pbk.)" to "0393925161"
            isbn = isbn.split(' ')[0];
            isbns.push(isbn);
            });
        });
    var isbnText = isbns.join(',');
    return 'http://bookspicker.com/#search?bundle='+isbnText+',&q='+isbnText+',';
}

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
