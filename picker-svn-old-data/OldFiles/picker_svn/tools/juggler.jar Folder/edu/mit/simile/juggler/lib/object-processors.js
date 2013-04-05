function mergeObjects(base, addition) {
    for (var n in addition) {
        if (addition.hasOwnProperty(n)) {
            if (n in base) {
                var oldValue = base[n];
                var newValue = addition[n];
                if (oldValue instanceof Array || newValue instanceof Array || oldValue != newValue) {
                    if (!(oldValue instanceof Array)) {
                        oldValue = [ oldValue ]; 
                    }
                
                    var newValue = addition[n];
                    if (!(newValue instanceof Array)) { 
                        oldValue.push(newValue);
                    } else {
                        oldValue = oldValue.concat(newValue);
                    }
                
                    base[n] = removeArrayElementDuplicates(oldValue);
                }
            } else {
                base[n] = addition[n];
            }
        }
    }
}

function copyObject(o) {
    var p = {};
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            p[n] = o[n];
        }
    }
    return p;
}

function redundantFieldRemover(fieldName, redundantFieldName) {
    return function(o) {
        if (fieldName in o && redundantFieldName in o && o[fieldName] == o[redundantFieldName]) {
            delete o[redundantFieldName];
        }
        return o;
    };
}

function fieldRemover() {
    var m = {};
    for (var i = 0; i < arguments.length; i++) {
        m[arguments[i]] = true;
    }
    return function(o) {
        var p = {};
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                if (!(n in m)) {
                    p[n] = o[n];
                }
            }
        }
        return p;
    };
}

function fieldRenamer(oldName, newName) {
    return function(o) {
        var p = {};
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                if (n == oldName) {
                    p[newName] = o[n];
                } else {
                    p[n] = o[n];
                }
            }
        }
        return p;
    }
}

function removeNullFieldValues(o) {
    var p = {};
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            var v = o[n];
            if (v != null) {
                p[n] = v;
            }
        }
    }
    return p;
}

function removeEmptyArrayFieldValues(o) {
    var p = {};
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            var v = o[n];
            if (!(v instanceof Array) || v.length > 0) {
                p[n] = v;
            }
        }
    }
    return p;
}

function collapseArrayFieldValues(o) {
    var p = {};
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            var v = o[n];
            if (v instanceof Array && v.length == 1) {
                p[n] = v[0];
            } else {
                p[n] = v;
            }
        }
    }
    return p;
}

function fieldValueMapper(fieldName, map) {
    return function(o) {
        var p = copyObject(o);
        if (fieldName in p) {
            var v = p[fieldName];
            if (v instanceof Array) {
                for (var i = 0; i < v.length; i++) {
                    var e = v[i];
                    if (e in map) {
                        v[i] = map[e];
                    }
                }
            } else if (v in map) {
                p[fieldName] = map[v];
            }
        }
        return p;
    }
}

function fieldDefaulter(fieldName, defaultValue) {
    return function(o) {
        if (fieldName in o) {
            return o;
        } else {
            var p = copyObject(o);
            p[fieldName] = defaultValue;
            return p;
        }
    }
}