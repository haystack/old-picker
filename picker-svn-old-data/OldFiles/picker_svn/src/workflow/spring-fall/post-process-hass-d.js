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

var s = fastJsonize(input);

return s;