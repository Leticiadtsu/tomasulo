function setLatencis() {
   
    var load = parseInt($('#load').val());
    var store = parseInt($('#store').val());
    var inteiros = parseInt($('#inteiros').val());
    var addsub = parseInt($('#addsub').val());
    var multd = parseInt($('#multd').val());
    var divd = parseInt($('#divd').val());
   
    console.log(load, store, inteiros, addsub, multd, divd);
   
    execTime['add'] = inteiros;
    execTime['beq'] = inteiros;
    execTime['bnez'] = inteiros;
    execTime['add.d'] = addsub;
    execTime['sub.d'] = addsub;
    execTime['mult.d'] = multd;
    execTime['div.d'] = divd;
    execTime['daddui'] = addsub;
    execTime['l.d'] = load;
    execTime['s.d'] = store;
}

function generateInstructions(str) {
    setLatencis();
    tomasulo();
    is = []
    var lines = str.match(/[^\r\n]+/g);
    for (line = 0; line < lines.length; line++) {
        var instruct = lines[line].split(" ");
        if (instruct.length > 0) {
            if (instruct.length > 2) {
                is[line + 1] = new InstStatus();
                is[line + 1].op = instruct[0];
                is[line + 1].target = instruct[1];
                is[line + 1].j = instruct[2];
                is[line + 1].k = instruct[3];
            }
        }
    }
    updateInterface();
}
