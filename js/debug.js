function debugWrite() {
    var aux = "";
    aux = aux.concat("<style>td {text-align: center;}");
    aux = aux.concat("th, td {padding: 1px 5px 1px 5px;}");
    aux = aux.concat("table {border-collapse: collapse;}");
    aux = aux.concat("td.nb{border-right-style:hidden;font-weight:bold;}");
    aux = aux.concat("td.empty{border:0pt;}");
    aux = aux.concat("td.b{font-weight:bold;}");
    aux = aux.concat("th{border = 0;}");
    aux = aux.concat("td.consolas{font-family: Consolas, monaco, monospace;font-weight:bold;}");
    aux = aux.concat("table, td {border: 1px solid black;}</style>");
    aux = aux.concat("<b>Clock: " + clock + "</b>");
    if (!finished) {
        aux = aux.concat("<div class='right'>");

        aux = aux.concat("<a class= 'waves-light btn grey darken-1' onclick='step()'>Próximo Passo</a>\t");
        aux = aux.concat("<a class= 'waves-light btn grey darken-1'  onclick='bulkstep()'>Próxima Ação</a>\t");
        aux = aux.concat("<a class= 'waves-light btn grey darken-1'  onclick='allsteps()'>Execução Completa</a>");
        aux = aux.concat("</div>");
    } else {
       
        aux = aux.concat("<h1>FINISHED </h1> - <b>" + clock + " cycles</b>");
    }
    aux = aux.concat("<br>");
    aux = aux.concat("<br>");
    aux = aux.concat("<table>");
    aux = aux.concat("<tr><th>Instruction</th><th></th><th></th><th></th><th>Issue</th><th>Exec</th><th>Write</th></tr>");
    for (i = 1; i <= is.length - 1; i++) {
        aux = aux.concat("<tr><td class=\"empty\">" + is[i].op + "</td><td class=\"empty\">" + is[i].target + "</td><td class=\"empty\">" + is[i].j + "</td><td class=\"empty\">" + is[i].k + "</td>");
        aux = aux.concat("<td style=\"width: 50px;\">" + (is[i].issued ? is[i].issue : "") + "</td>");
        aux = aux.concat("<td style=\"width: 50px;\">" + (is[i].executed ? is[i].exec : "") + "</td>");
        aux = aux.concat("<td style=\"width: 50px;\">" + (is[i].written ? is[i].write : "") + "</td>");
        aux = aux.concat("</tr>");
    }
    aux = aux.concat("</table>");
    aux = aux.concat("<br/><hr/>");
    aux = aux.concat("<div style=\"width: 100%; overflow: hidden;\">");
    aux = aux.concat("<div style=\"float: left;\"> Reservation Station ");
    aux = aux.concat("<table style=\"border: 0;\" align=\"center\"");
    aux = aux.concat("<tr><th class=\"empty\">Time</th><th> </th><th>Busy</th><th style=\"width: 70px;\"> Op </th><th style=\"width: 50px;\"> Vj </th><th style=\"width: 50px;\"> Vk </th><th style=\"width: 50px;\"> Qj </th><th style=\"width: 50px;\"> Qk </th></tr>");
    for (i = 1; i <= rs.length - 1; i++) {
        aux = aux.concat("<tr><td class=\"empty\">" + ((rs[i].time >= 0) ? rs[i].time : "&nbsp") + "</td><td class=\"consolas\">" + rs[i].name + "</td><td>" + (rs[i].busy ? "Yes" : "No") + "</td>");
        aux = aux.concat("<td class=\"b\">" + rs[i].op + "</td><td >" + rs[i].valueJ + "</td><td>" + rs[i].valueK + "</td>");
        aux = aux.concat("<td>" + rs[i].queueJ + "</td><td>" + rs[i].queueK + "</td></tr>");
    }
    aux = aux.concat("</table>");
    aux = aux.concat("</div>	<div style=\"margin-left: 560px;\"> Load and Store");
    aux = aux.concat("<table style=\"width: 240px;border: 0;\"  ");
    aux = aux.concat("<tr><th> &nbsp </th><th></th><th><center>Busy</center></th><th>Address</th></tr>");
    for (i = 1; i <= rsLoad.length - 1; i++) {
        aux = aux.concat("<tr><td class=\"empty\">" + ((rsLoad[i].time >= 0) ? rsLoad[i].time : "&nbsp") + "</td><td class=\"consolas\">" + rsLoad[i].name + "</td><td><center>" + (rsLoad[i].busy ? "Yes" : "No") + "</center></td><td>" + rsLoad[i].address + "</td></tr>");
    }
    aux = aux.concat("</table>");
    aux = aux.concat("</div></div>");
    aux = aux.concat("</table>");
    aux = aux.concat("Register Result Status <table>");
    aux = aux.concat("<table style=\"border:0pt;\"<tr>");
    for (i = 0; i <= 30; i += 2) {
        aux = aux.concat("<th width=\"40px\">F" + i + "</th>");
    }
    aux = aux.concat("</tr>");
    aux = aux.concat("<tr>");
    for (i = 0; i <= 30; i += 2) {
        if (typeof reg["F" + i] !== 'undefined') {
            aux = aux.concat("<td>" + reg["F" + i] + "</td>");
        } else {
            aux = aux.concat("<td>&nbsp</td>");
        }
    }
    aux = aux.concat("</tr>");
    aux = aux.concat("<tr>");
    aux = aux.concat("<td class=\"empty\">&nbsp</td>");
    aux = aux.concat("</tr>");
    aux = aux.concat("<tr>");
    for (i = 0; i <= 15; i += 1) {
        aux = aux.concat("<th width=\"40px\">R" + i + "</th>");
    }
    aux = aux.concat("</tr>");
    aux = aux.concat("<tr>");
    for (i = 0; i <= 15; i += 1) {
        if (typeof reg["R" + i] !== 'undefined') {
            aux = aux.concat("<td>" + reg["R" + i] + "</td>");
        } else {
            aux = aux.concat("<td>&nbsp</td>");
        }
    }
    aux = aux.concat("</tr>");
    aux = aux.concat("</table>");


    $("#resultado").html(aux);
}

function setInstructions() {
    is[1] = new InstStatus();
    is[1].op = "L.D";
    is[1].target = "F6";
    is[1].j = "34+";
    is[1].k = "R2";
    is[2] = new InstStatus();
    is[2].op = "L.D";
    is[2].target = "F2";
    is[2].j = "45+";
    is[2].k = "R3";
    is[3] = new InstStatus();
    is[3].op = "MULT.D";
    is[3].target = "F0";
    is[3].j = "F2";
    is[3].k = "F4";
    is[4] = new InstStatus();
    is[4].op = "SUB.D";
    is[4].target = "F8";
    is[4].j = "F6";
    is[4].k = "F2";
    is[5] = new InstStatus();
    is[5].op = "DIV.D";
    is[5].target = "F10";
    is[5].j = "F0";
    is[5].k = "F6";
    is[6] = new InstStatus();
    is[6].op = "ADD.D";
    is[6].target = "F6";
    is[6].j = "F8";
    is[6].k = "F2";
}