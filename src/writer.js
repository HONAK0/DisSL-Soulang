const { writeFileSync } = require("fs");
const { showerr } = require("./io/err");
const { addfunc, existsfunc, gettypefunc } = require("./io/func");
const { addvar, existsvar, gettypevar } = require("./io/variable");

const types = {
    int:["int", ""],
    string:["char*", ""],
    "string[]":["char*", "[]"],
    "int[]":["int", "[]"]
};

function writer(tokenlist){
    var code = [];
    var imports = [];
    console.log(tokenlist);
    tokenlist.forEach(function(tokens){
        if(tokens.length == 0)
            return;
        if(tokens[0][0] == "id" && tokens[1][1] == "("){
            var args = [];
            for(let index = 2; index < tokens.length-1; index++){
                if(tokens[index][0] == "string")
                    args.push(`"${tokens[index][1]}"`);
                else
                    args.push(`${tokens[index][1]}`);
            }
            switch(tokens[0][1]){
                case "print":
                    code.push(`printf(${args.join("")});`);
                    if(!imports.includes("#include <stdio.h>"))
                        imports.push("#include <stdio.h>");
                    break;
                default:
                    break;
            }
        } else if(tokens[0][0] == "id" && tokens.length > 1 && tokens[1][0] == "id" && tokens[2][0] == "assign"){
            var type = types[tokens[0][1]][0];
            if(!type)
                showerr(`Unknown type '${tokens[0][1]}'`);

            switch(tokens[2][1]){
                case "(":
                    if(existsfunc(tokens[1][1]))
                        showerr(`Function '${tokens[1][1]}' is alredy defined`);
                    var args = [];
                    var targs = [];
                    var targstype = [];
                    for(let index = 3; index < tokens.length-1; index++){
                        if(tokens[index][1] == ")")
                            break;
                        if(tokens[index][1] == ":"){
                            args.pop();
                            if(!types[tokens[index+1][1]])
                                showerr(`Unknown type '${tokens[index+1][1]}'`);
                            args.push(`${types[tokens[index+1][1]][0]} ${tokens[index-1][1]}`);
                            targs.push(tokens[index-1][1]);
                            targstype.push(tokens[index+1][1]);
                            index++;
                            continue;
                        }
                        args.push(`${tokens[index][1]}`);
                    }
                    let ign = false;
                    for(let index = 3; index < tokens.length; index++){
                        if(tokens[index][1] == ")"){
                            index++;
                            if(!tokens[index])
                                break;
                            if(tokens[index][1] == "="){
                                let tcode = [];
                                index++;
                                for(; index < tokens.length; index++){
                                    tcode.push(tokens[index][1]);
                                }
                                ign = true;
                                code.push(`${type} ${tokens[1][1]}(${args.join("")}){ return ${tcode.join("")}; }`);
                            }
                        }
                    }
                    if(!ign)
                        code.push(`${type} ${tokens[1][1]}(${args.join("")}){`);
                    addfunc(tokens[1][1], tokens[0][1], targs, targstype);
                    break;
                case "=":
                    if(existsvar(tokens[1][1]))
                        showerr(`Variable '${tokens[1][1]}' is alredy defined`);
                    if(tokens[3][0] == "id" && tokens.length > 4 && tokens[4][1] == "("){
                        if(gettypefunc(tokens[3][1]) != tokens[0][1])
                            showerr(`Unable to convert '${tokens[0][1]}' type to '${gettypefunc(tokens[3][1])}'`);
                    }
                    if(tokens[3][0] == "id" && tokens.length == 4)
                        showerr(`Variable '${tokens[3][1]}' is not defined`);
                    if(!types[tokens[0][1]])
                        showerr(`Unknown type '${tokens[0][1]}'`);
                    var args = [];
                    for(let index = 3; index < tokens.length; index++){
                        if(tokens[index][0] == "string")
                            args.push(`"${tokens[index][1]}"`);
                        else
                            args.push(`${tokens[index][1]}`);
                    }
                    code.push(`${types[tokens[0][1]][0]} ${tokens[1][1]}${types[tokens[0][1]][1]} = ${args.join("")};`);
                    addvar(tokens[1][1], tokens[0][1], args.join(""));
                    break;
            }
        } else if(tokens[0][1] == "def" && tokens[1][0] == "id"){
            if(existsvar(tokens[1][1]))
                showerr(`Constant value '${tokens[1][1]}' is alredy defined`);
            if(tokens[2][0] == "id" && tokens.length == 3)
                showerr(`Variable '${tokens[2][1]}' is not defined`);
            var args = [];
            for(let index = 2; index < tokens.length; index++){
                if(tokens[index][0] == "string")
                    args.push(`"${tokens[index][1]}"`);
                else
                    args.push(`${tokens[index][1]}`);
            }
            imports.push(`#define ${tokens[1][1]} ${args.join("")}`);
            addvar(tokens[1][1], tokens[0][1], args.join(""));
        }
        else if(tokens[0][1] == "end")
            code.push("}");
        else
            showerr("Unknown instruction");
    });
    var output = imports.concat(code);
    console.log(output);
    writeFileSync(process.argv[2].replace(".sl", ".c"), output.join("\n"), "utf8");
}
module.exports = {
    writer
};