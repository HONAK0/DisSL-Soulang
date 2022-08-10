var funcs = [];

function addfunc(funcname, type, args, argstype){
    funcs.push({
        function:funcname,
        typefunc:type,
        args:args,
        argstype:argstype
    });
}
function existsfunc(funcname){
    let out = false;
    funcs.forEach(function(func){
        if(func["function"] == funcname)
            out = true;
    });
    return out;
}
function gettypefunc(funcname){
    let out;
    funcs.forEach(function(func){
        if(func["function"] == funcname)
            out = func["typefunc"]
    });
    return out;
}

module.exports = {
    addfunc,
    existsfunc,
    gettypefunc
};