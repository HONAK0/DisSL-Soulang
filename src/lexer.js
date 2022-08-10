// ----------------------------------------------------------------
// Copyright (c) DisStudio 2021-2022
// Do not change this file! After changes app may work with errors!
// ----------------------------------------------------------------

const { writer } = require('./writer');

function handle(chars){
    let str = "";
    let strskip = false;
    var out = [];
    let ids = [];

    function add(deftype){
        if(str === "")
            return;
        let type = deftype;
        switch(str){
            case "true" || "false":
                type = "boolean";
                break;
            case "=":
                type = "assign";
                break;
            default:
                if(!isNaN(Number(str)))
                    type = "int"
                else if(str.startsWith('"') || str.startsWith('"')){
                    type = "string";
                    str = str.replace('"', '');
                    str = str.replace('"', '');
                }
                break;
        }
        ids.push([type, str]);
        str = "";
    }

    chars.forEach(function(char){
        switch(char){
            case '"' || "'":
                if(!strskip)
                    add("id")
                strskip = !strskip;
                break;
            case ";":
                if(!strskip) {
                    if(ids.length === 1)
                        ids.push(["end", "end"]);
                    out.push(ids);
                    ids = [];
                }
                return;
            default:
                if(char === " " || char === "(" || char === ")" || char == ":" || char == ",") {
                    if(!strskip){
                        add("id");
                        if(char !== " ")
                            ids.push(["assign", char]);
                        return;
                    }
                }
                break;
        }
        str+=char;
    });
    //console.log(out);
    writer(out);
}
module.exports = {
    handle
};