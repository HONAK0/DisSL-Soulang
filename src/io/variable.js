var vars = [];

function addvar(varname, type, value){
    vars.push({
        name:varname,
        type:type,
        value:value
    });
}
function existsvar(varname){
    let out = false;
    vars.forEach(function(variable){
        if(variable["name"] == varname)
            out = true;
    });
    return out;
}
function gettypevar(varname){
    let out = false;
    vars.forEach(function(variable){
        if(variable["name"] == varname)
            out = variable["type"];
    });
    return out;
}

module.exports = {
    addvar,
    existsvar,
    gettypevar
};