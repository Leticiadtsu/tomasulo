var clock = 0;
var finished = false;
var execTime = {
    "add": 1, //1
    "beq": 1,
    "bnez": 1,
    "add.d": 2,
    "sub.d": 2,
    "mult.d": 10, //10
    "div.d": 40, //40
    "daddui": 2,
    "l.d": 2, //2
    "s.d": 2 //2
};

/*var execTime = { 
 "add":1, //1
 "beq":1,
 "bnez":1,
 "add.d":2, 
 "sub.d":2,
 "mult.d":3, //10
 "div.d":20, //40
 "daddui":2,
 "l.d":1, //2
 "s.d":1 //2
 };*/

var unitSize = {
    "inteiro": 3,
    "addsub": 3,
    "multdiv": 2,
    "load": 6,
    "store": 3,
};
var rs = [];
var rsLoad = [];
var reg = [];

var instructionQtd = 5;
var is = [];
// Estruturas
function InstStatus() {
    this.op = "ADD";
    this.instruction = 0;
    this.target = "F2";
    this.j = "F4";
    this.k = "F6";
    this.issue = 0;
    this.exec = 0;
    this.write = 0;
    this.issued = false;
    this.executed = false;
    this.written = false;
    this.rs = null;
}

function LoadBuffers() {
    this.name = "Load0";
    this.busy = false;
    this.address = "";
    this.type = "Type";
    this.instruction = 0;
    this.time = -10;

}

function ReservationStation() {
    this.name = "Load0";
    this.type = "Type";
    this.busy = false;
    this.op = "";
    this.valueJ = ""; //Vj
    this.valueK = ""; //Vk
    this.queueJ = ""; //Qj
    this.queueK = ""; //Qk
    this.time = -10;
    this.instruction = 0;
}

function ReservationResultStatus() {
    this.name = "Load0";
    this.fu = "F0";
}




//auxiliary functions
function getType(str) {
    str = str.toLowerCase();
    if (str == "add" || str == "beq" || str == "bnez") {
        return "integer";
    }
    if (str == "add.d" || str == "sub.d" || str == "daddui") {
        return "float";
    }
    if (str == "mult.d" || str == "div.d") {
        return "mult";
    }
    if (str == "l.d") {
        return "Load";
    }
    if (str == "s.d") {
        return "Store";
    }
    return "unrecognized";
}

function getRegisterNumber(reg) {
    return (parseInt(reg.replace(/[^0-9\.]/g, ''), 10));
}

function getExecTime(op) {
    op = op.toLowerCase();
    return execTime[op];
}




//core functions



//check if the instruction can be issued this clock cycle
function canIssue(ins) {
    bix = getType(ins.op);
    if (bix != "Load" && bix != "Store") {
        for (i = 1; i < rs.length; i++) {
            if (rs[i].type == bix) {
                if (!rs[i].busy) {
                    return true;
                }
            }
        }
    } else {
        for (i = 1; i < rsLoad.length; i++) {
            if (rsLoad[i].type == bix) {
                if (!rsLoad[i].busy) {
                    return true;
                }
            }
        }
    }
    return false;
}

function issue(ins) {
    bix = getType(ins.op);
    if (bix != "Load" && bix != "Store") {
        for (i = 1; i < rs.length; i++) {
            if (rs[i].type == bix) {
                if (!rs[i].busy) {
                    dep = false
                    if ((typeof reg[ins.j] !== 'undefined') && (isBusy(reg[ins.j]))) {
                        rs[i].queueJ = reg[ins.j] + "";
                        dep = true;
                    } else {
                        rs[i].valueJ = "R(" + ins.j + ")";
                    }
                    if ((typeof reg[ins.k] !== 'undefined') && (isBusy(reg[ins.k]))) {
                        rs[i].queueK = reg[ins.k] + "";
                        dep = true;
                    } else {
                        rs[i].valueK = "R(" + ins.k + ")";
                    }
                    reg[ins.target] = rs[i].name;
                    rs[i].time = dep ? -1 : getExecTime(ins.op);
                    rs[i].op = ins.op;
                    rs[i].instruction = ins.instruction;
                    ins.issued = true;
                    rs[i].busy = true;
                    ins.rs = rs[i];
                    ins.issue = clock;
                    break;
                }
            }
        }
    } else {
        for (i = 1; i < rsLoad.length; i++) {
            if (rsLoad[i].type == bix) {
                if (!rsLoad[i].busy) {
                    reg[ins.target] = rsLoad[i].name;
                    rsLoad[i].address = ins.k;
                    rsLoad[i].time = -1;
                    rsLoad[i].instruction = ins.instruction;
                    ins.rs = rsLoad[i];
                    rsLoad[i].busy = true;
                    ins.issued = true;
                    ins.issue = clock;
                    break;
                }
            }
        }
    }
}


function isBusy(fu) {
    for (bindex = 1; bindex < rs.length; bindex++) {
        if (fu == rs[bindex].name) {
            if (rs[bindex].busy) {
                return true; //RS busy
            }
            break;
        }
    }
    for (bindex = 1; bindex < rsLoad.length; bindex++) {
        if (fu == rsLoad[bindex].name) {
            if (rsLoad[bindex].busy) {
                return true; //Buffer busy
            }
            break;
        }
    }
    return false;
}

function hasDependency(ins){
	if(typeof ins.rs.queueJ !== 'undefined' && ins.rs.queueJ!=""){
		if(isBusy(ins.rs.queueJ)){
			return true;
		}else{
			ins.rs.valueJ = ins.rs.queueJ;
			ins.rs.queueJ = "";
		}
	}
	if(typeof ins.rs.queueK !== 'undefined' && ins.rs.queueK!=""){
		if(isBusy(ins.rs.queueK)){
			return true;
		}else{
			ins.rs.valueK = ins.rs.queueK;
			ins.rs.queueK = "";
		}
	}
	if(ins.rs.type =="Load" ||ins.rs.type =="Store"  ){
		if(typeof reg[ins.k] !== 'undefined'&& reg[ins.k]!=""){
			if(isBusy(reg[ins.k])){
				return true;
			}
		}
	}
	return false;

}


function write(ins) {
    issuetime = ins.issue;
    ins.rs.op = "";
    ins.rs.instruction = 0;
    ins.rs.busy = false;
    ins.rs.time = -10
    if (ins.rs.type == "Load" || ins.rs.type == "Store") {
        ins.rs.address = "";
    } else {
        ins.rs.valueJ = "";
        ins.rs.valueK = "";
        ins.rs.queueJ = "";
        ins.rs.queueK = "";
    }
    ins.written = true;
    ins.write = clock;
}

function getTime(ins) {
    for (i = 1; i < rs.length; i++) {
        if (ins.instruction == rs[i].instruction) {
            return rs[i].time;
        }
    }
    for (i = 1; i < rsLoad.length; i++) {
        if (ins.instruction == rsLoad[i].instruction) {
            return rsLoad[i].time;
        }
    }
    return -1;
}

function execute(ins) {
    if (ins.rs.time == -1) {
        if (!hasDependency(ins)) {
            ins.rs.time = getExecTime(ins.op) + 1;

        }
    }
    if (ins.rs.time > 0) {
        ins.rs.time--;
    }
    if (ins.rs.time == 0 || ((ins.rs.type == "Load" || ins.rs.type == "Store") && ins.rs.time == 1)) {
        ins.executed = true;
        ins.exec = clock;
    }
}



function step() {
    clock++;
    for (j = 1; j < is.length; j++) {
        if (!is[j].issued) {
            if (canIssue(is[j])) {
                issue(is[j]);
            }
            break;
        } else {
            if (!is[j].executed) {
                //is[j].executed=true;
                //is[j].exec=clock;
                execute(is[j]);
            } else {
                if (!is[j].written && (clock - 1 == is[j].exec)) {
                    write(is[j]);
                }
            }
        }
    }
    finished = true;
    for (j = 1; j < is.length; j++) {
        if (!is[j].written) {
            finished = false;
            ;
        }
    }
    
    updateInterface();
    console.log(execTime);
}


function bulkstep() {
    changed = false;
    var before = [];
    while (!changed) {
        for (index = 1; index < is.length; index++) {
            before[index] = new InstStatus();
            before[index].issued = is[index].issued
            before[index].executed = is[index].executed
            before[index].written = is[index].written
        }
        step();
        for (index = 1; index < is.length; index++) {
            changed = (before[index].issued != is[index].issued) || changed;
            changed = (before[index].executed != is[index].executed) || changed;
            changed = (before[index].written != is[index].written) || changed;
            if (changed) {
                break;
            }
        }
    }
}
function allsteps() {
    while (!finished) {
        step();
    }
}


//MAIN

function init() {
    tomasulo();
}



function updateInterface() {
    debugWrite();
}

function tomasulo() {
    offset = 1;
    limit = unitSize["inteiro"];
    //Inicialização da unidade de inteiros
    for (i = offset; i <= limit; i++) {
        rs[i] = new ReservationStation();
        rs[i].name = "Int" + (i - offset + 1);
        rs[i].type = getType("add");
    }
    offset = limit + 1;
    limit += unitSize["addsub"];
    //Inicialização da unidade de addsub
    for (i = offset; i <= limit; i++) {
        rs[i] = new ReservationStation();
        rs[i].name = "Add" + (i - offset + 1);
        rs[i].type = getType("add.d");
    }
    offset = limit + 1;
    limit += unitSize["multdiv"];
    //Inicialização da unidade de multdiv
    for (i = offset; i <= limit; i++) {
        rs[i] = new ReservationStation();
        rs[i].name = "Mult" + (i - offset + 1);
        rs[i].type = getType("mult.d");

    }
    offset = 1;
    limit = unitSize["load"];
    //Inicialização da unidade de store
    for (i = offset; i <= limit; i++) {
        rsLoad[i] = new LoadBuffers();
        rsLoad[i].name = "Load" + (i - offset + 1);
        rsLoad[i].type = getType("l.d");
    }
    offset = limit + 1;
    limit += unitSize["store"];
    //Inicialização da unidade de load
    for (i = offset; i <= limit; i++) {
        rsLoad[i] = new LoadBuffers();
        rsLoad[i].name = "Store" + (i - offset + 1);
        rsLoad[i].type = getType("s.d");
    }

    //Inicializando InstructionStatus
    setInstructions();
    for (index = 1; index < is.length; index++) {
        is[index].instruction = index;
    }
    //set instructions ID for control


    updateInterface();
    //alert(getExecTime("div.d"));
    //alert(clock);
    //alert(getType("add.d"));
    //var apple = new Apple('macintosh');
    //alert(apple.getInfo());

}
