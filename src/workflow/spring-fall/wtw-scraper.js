outputParams.outputFormat = "json";
json.items = [];

var namespace = document.documentElement.namespaceURI;
var nsResolver = namespace ? function(prefix) {
  return (prefix == 'x') ? namespace : null;
} : null;

var getNode = function(document, contextNode, xpath, nsResolver) {
  return document.evaluate(xpath, contextNode, nsResolver, XPathResult.ANY_TYPE,null).iterateNext();
}

var cleanString = function(s) {
  var string = utilities.trimString(s);
  return string
}

var getText = function(elmt, xpath) {
  return cleanString(getNode(document, elmt, xpath, nsResolver).nodeValue);
}
var getAttribute = function(elmt, xpath, attr) {
  return cleanString(getNode(document, elmt, xpath, nsResolver)[attr]);
}

var addOptionalArrayProperty = function(obj, name, a) {
    if (a.length == 1) {
        obj[name] = a[0];
    } else if (a.length > 1) {
        obj[name] = a;
    }
}

function processTd(element) {
	var classNumber = cleanString(element.innerHTML);
	var instructor = cleanString(element.nextSibling.nextSibling.innerHTML);
	var classItem = {
        "id":           classNumber,
        "instructor":		instructor
    };
	json.items.push(classItem);
	
	log(classNumber + ", " + professor);
}

var xpath = '/html/body/table/tbody/tr/td/table/tbody/tr';
var elements = utilities.gatherElementsOnXPath(document, document, xpath, nsResolver);

for (var i = 0; i < elements.length; i++) {
    var node = elements[i].firstChild;
    
    while (node != null) {
        if (node.nodeType == 1) {
            if (node.tagName == "TD") {
            	if (node.innerHTML.search(/6/) == 0) {
						 try {
							  processTd(node);
						 } catch (e) {
							  // ignore
						 }
					}
            }
        }
        node = node.nextSibling;
    }
}