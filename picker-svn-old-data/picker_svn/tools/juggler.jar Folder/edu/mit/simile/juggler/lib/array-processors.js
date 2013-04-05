function visitArrayElements(a, handler) {
    var b = [];
    for (var i = 0; i < a.length; i++) {
        var e = handler(a[i]);
        if (typeof e != "undefined") {
            b.push(e);
        }
    }
    return b;
}

function removeArrayElementDuplicates(a) {
    var b = [];
    var m = {};
    for (var i = 0; i < a.length; i++) {
        var e = a[i];
        var t = typeof e;
        if (t == "array" || t == "object") {
            b.push(e);
        } else if (!(e in m)){
            b.push(e);
            m[e] = true;
        }
    }
    return b;
}

function mergeArrayElements(a, keyF, mergeF) {
    var b = [];
    var map = {};
    mergeF = (mergeF) ? mergeF : mergeObjects;
    
    for (var i = 0; i < a.length; i++) {
        var e = a[i];
        var key = keyF(e);
        if (key == null) {
            b.push(e);
        } else if (key in map) {
            mergeF(map[key], e);
        } else {
            map[key] = e;
            b.push(e);
        }
    }
    return b;
}

function fieldKeyRetriever() {
    var fieldNames = arguments;
    return function(o) {
        for (var i = 0; i < fieldNames.length; i++) {
            var n = fieldNames[i];
            if (n in o) {
                return o[n];
            }
        }
        return null;
    }
}
