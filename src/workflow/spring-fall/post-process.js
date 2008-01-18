var merge = function(json1, json2) {
    if ("items" in json2) {
        if ("items" in json1) {
            json1.items = mergeArrayElements(json1.items.concat(json2.items), fieldKeyRetriever("id", "label"));
        } else {
            json1.items = json2.items;
        }
    }
}
var inputs = map(inputs, jsonImporter);

var input = inputs.length > 0 ? inputs[0] : {};
for (var i = 1; i < inputs.length; i++) {
    merge(input, inputs[i]);
}

input.items = visitArrayElements(input.items, function(item) {
	var deleteData = function(item) {
		if ('label' in item) {delete item.label;}
		if ('course' in item) {delete item.course;}
		if ('level' in item) {delete item.level;}
		if ('units' in item) {delete item.units;}
		if ('total-units' in item) {delete item["total-units"];}
		if ('description' in item) {delete item.description;}
		if ('semester' in item) {delete item.semester;}
		if ('offering' in item) {delete item.offering;}
		if ('prereq' in item) {delete item.prereq;}
		if ('in-charge' in item) {delete item["in-charge"];}
	}

    var type = item.type;
    if (type != "Class") {
        return undefined;
    } else {
    	if ('semester' in item) {
			if (typeof(item.semester) == "string") {
				if (item.semester == "Spring") {deleteData(item);}
			} else {
				if (item.semester["Spring"] !== null) { deleteData(item); }
			}
		}
		return item;
	}
});

var s = fastJsonize(input);

return s;