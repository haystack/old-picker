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
    var type = item.type;
    if (type == "Class") {
    	return { "type": "Class",
			"has-final": item["has-final"],
			"id": item.id,
			"label": item.label,
			"url": item.url,
			"area": item.area
			//"offering": item.offering,
			//"category": item.category 
		};
	} else {
		return item;
	}
});

var s = jsonize(input);

return s;