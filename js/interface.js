var qtdLinhas = 0;
        function createLine(i){
        return '<div class="row" id="linhasI">\n\
                    <div class="col s2"></div>\n\
                    <div class="col s2">\n\
                        <label>Instruções</label>\n\
                        <select class="browser-default" id="op' + i + '" name="op[' + i + ']">\n\
                            <option value="L.D">L.D</option>\n\
                            <option value="S.D">S.D</option>\n\
                            <option value="ADD">ADD</option>\n\
                            <option value="ADD.D">ADD.D</option>\n\
                            <option value="SUB.D">SUB.D</option>\n\
                            <option value="MULT.D">MULT.D</option>\n\
                            <option value="DIV.D">DIV.D</option>\n\
                            <option value="DADDUI">DADDUI</option>\n\
                            <option value="BEQ">BEQ</option>\n\
                            <option value="BNEZ">BNEZ</option>\n\
                        </select>\n\
                    </div>\n\
                    <div class="col s2">\n\
                        <label>rs</label>\n\
                        <input list="reg" name="rs[' + i + ']" id="rd' + i + '">\n\
                        <datalist class="input-field"></datalist>\n\
                    </div>\n\
                    <div class="col s2">\n\
                        <label>rt</label>\n\
                        <input list="reg" name="rt[' + i + ']" id="rs' + i + '">\n\
                        <datalist class="input-field"></datalist>\n\
                    </div>\n\
                    <div class="col s2">\n\
                        <label>rd</label>\n\
                        <input list="reg" name="rd[' + i + ']" id="rt' + i + '">\n\
                        <datalist class="input-field" "></datalist>\n\
                    </div>\n\
                    <div class="col s2"></div>\n\
                </div>';
        }
$(document).ready(function () {
$('#sobre').modal();
        $('#ajuda').modal();
        $('#confirmVoltar').modal();
        //adicionar linha de instruções
        $('#addLinhaI').click(function() {
$('#addInstrucao').append(createLine(qtdLinhas));
        i++;
});
        // remover linha de instruções
        $('#removeLinhaI').click(function() {
$('#linhasI').remove();
        i--;
})
        });
// Ao clicar no botão passo a passo

// Ao clicar no botão execução completa
        function completa() {
        esconderInst();
                mostrarExec();
        }

// Esconde a opção de adicionar instruções
function esconderInst() {
$('#definicao').slideUp();
        $('.controle').hide();
        $('#voltar').removeClass('esconder');
        }

function mostrarExec() {
$('#execTomasulo').removeClass('esconder');
        }

// Voltar a exibir as intruções de adicionar instruções
function voltarInst() {
$('#definicao').slideDown();
        $('.controle').show();
        $('#voltar').addClass('esconder');
        $('#execTomasulo').addClass('esconder');
        }

// Exibe adicionar instruções após ter determinado a quantidade
function addInstrucoes() {
$('#inicio').hide();
        $('#instrucoes').show();
        var qtd = $('#qtdInstrucoes').val();
        for (i = 0; i < qtd; i++) {
$('#addInstrucao').append(createLine(i));
        qtdLinhas = qtdLinhas + 1;
}
}
function readToText(){
$('#inicio').hide();
        generateInstructions($('#area').val());
        $('#execTomasulo').removeClass('esconder');
}

// Volta pra a tela inicial de definir quantidade de instruções
function btnQtd() {
window.location.reload();
        }

function start() {
var ins = "";
        for (i = 0; i < qtdLinhas; i++){
ins = ins.concat(($("#op" + i)).val() + " ");
        ins = ins.concat(($("#rs" + i)).val() + " ");
        ins = ins.concat(($("#rt" + i)).val() + " ");
        ins = ins.concat(($("#rd" + i)).val() + "\n");
        }

$('#instrucoes').hide();

        generateInstructions(ins);
        $('#execTomasulo').removeClass('esconder');
}






