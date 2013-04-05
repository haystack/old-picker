function compose() {
    var functions = arguments;
    return function(x) {
        for (var i = 0; i < functions.length && typeof x != "undefined"; i++) {
            x = functions[i](x);
        }
        return x;
    };
}

function map(a, f) {
    var b = [];
    for (var i = 0; i < a.length; i++) {
        b.push(f(a[i], i));
    }
    return b;
}
