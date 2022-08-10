function showerr(log){
    console.log(`fatal error: ${log}`);
    process.exit(1);
}

module.exports = {
    showerr
};