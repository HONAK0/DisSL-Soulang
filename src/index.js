// ----------------------------------------------------------------
// Copyright (c) DisStudio 2021-2022
// Do not change this file! After changes app may work with errors!
// ----------------------------------------------------------------

const { readFileSync } = require("fs");
const { handle } = require('./lexer');

function replace_all(str, old, nnew){
    let out = str;
    while(out.indexOf(old) !== -1)
        out = out.replace(old, nnew)
    return out;
}
for(let index = 2; index < process.argv.length; index++){
    var chars = replace_all(readFileSync(process.argv[index], "utf8"), "\n", " ;").split("");
    chars.push(" ");
    chars.push(";");

    handle(chars);
}