function objectFieldValueComparator(fieldName, descending, valueComparator) {
    var multiplier = (descending) ? -1 : 1;
    return function(a, b) {
        var c = 0;
        if (fieldName in a) {
            if (fieldName in b) {
                var av = a[fieldName];
                var bv = b[fieldName];
                c = valueComparator(av, bv);
            } else {
                c = 1;
            }
        } else if (fieldName in b) {
            c = -1;
        }
        return c * multiplier;
    }
}

function objectTextFieldValueComparator(fieldName, caseInsensitive, descending) {
    return objectFieldValueComparator(fieldName, descending, 
        (caseInsensitive) ? textValueCaseInsensitiveComparator : textValueComparator);
}

function objectNumberFieldValueComparator(fieldName, descending) {
    return objectFieldValueComparator(fieldName, descending, numberValueComparator);
}

function textValueComparator(a, b) {
    return (typeof a == "string" ? a : String(a)).localeCompare(b);
}

function textValueCaseInsensitiveComparator(a, b) {
    return (typeof a == "string" ? a : String(a)).toLowerCase().localeCompare(b.toLowerCase());
}

function numberValueComparator(a, b) {
    return (typeof a == "number" ? a : parseFloat(a)) - (typeof b == "number" ? b : parseFloat(b));
}

function composeComparators() {
    var functions = arguments;
    return function(a, b) {
        var c = 0;
        for (var i = 0; c == 0 && i < functions.length; i++) {
            c = functions[i](a, b);
        }
        return c;
    };
}