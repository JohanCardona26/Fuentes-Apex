const SetCtrlBreak = (id, value) => {    
    try{
        // Filtro de control break en interactive grid
        if(!$(`#${id} a[data-setting="controlBreak"]:contains("${value}")`).length){
            apex.region(id).widget().interactiveGrid("getActions").invoke(`show-control-break-dialog`)
            apex.item(`${id}_ig_CBD_COLUMN`).setValue(
                apex.item(`${id}_ig_CBD_COLUMN`).element.children().filter((i, e) => e.label == value).val()
            )
            $(`#${id}_ig_control_break_dialog`).parent().children().children().children(`button:contains("Save")`).click()
        }
    }catch{
        try{
            // Filtro de control break en interactive reports
            if(!$(`#control_text_${value}`).length){
                $(`#${id}_actions_menu`).menu("find", "irCtrlBreak").action();
                setTimeout(() =>{
                    apex.item(`${id}_column_01`).setValue(value)
                    $(`.a-IRR-dialog--controlBreak[aria-describedby="${id}_dialog_js"] button:contains("Apply")`)
                    .click()
                }, 2500)
            }
        }catch{
            alert('Error en el filtro')
        }
    }
}

const SetExtraCtrlBreak = (id, value) => {
    if(!$(`#${id} a[data-setting="controlBreak"]:contains("${value}")`).length){ 
        apex.region(id).widget().interactiveGrid("getActions").invoke(`show-control-break-dialog`)
        $(`#${id}_ig_control_break_dialog button[data-action="insert-record"]`).click()
        apex.item(`${id}_ig_CBD_COLUMN`).setValue(
            apex.item(`${id}_ig_CBD_COLUMN`).element.children().filter((i, e) => e.label == value).val()
        )
        $(`#${id}_ig_control_break_dialog`).parent().children().children().children(`button:contains("Save")`).click()
    }
}




/* Colores de los graficos */

var color_red = ["#500207", "#77030B", "#9F040E", "#C70512", "#E30613", "#F92432", "#FA4C58", "#FB747D","#FC9CA2", "#eaa8a8"];
var color_green = ["#007f5f","#2b9348","#55a630","#80b918","#aacc00","#bfd200","#d4d700","#dddf00","#eeef20","#ffff3f","#00A82E","#00B031"];
var color_orange = ["#FF4800", "#FF5400", "#FF6000", "#FF6D00", "#FF7900", "#FF8500", "#FF9100", "#FF9E00", "#FFAA00", "#FFB600"];
var color_purple = ["#6247AA", "#7251B5", "#815AC0", "#9163CB", "#A06CD5", "#B185DB", "#C19EE0", "#D2B7E5", "#DAC3E8", "#DEC9E9"];
var color_blue = ["#03045E", "#023E8A", "#0077B6", "#0096C7", "#00B4D8", "#48CAE4", "#90E0EF", "#ADE8F4", "#CAF0F8","#D5F3F9"]; 
var color_turq =  ["#0d41e1", "#0b6ee9", "#0099ff", "#169CE8", "#0FB4EC", "#0AC1ED", "#06CDEF", "#00DAF0", "#06DCD5", "#14DDAC"];
var color_redora = ["#1ed1af", "#0f9c7e", "#1d915f", "#2b863f", "#80b918", "#aac80c", "#d4d700", "#ffea00", "#ffdd00", "#ffff0a"];
var color_bluetwo = ["#6ff7e8", "#1f7ea1"]
var color_greentwo = ["#036666", "#99e2b4"];
var color_redoratwo =  ["#ffba08", "#d00000"];
var color_redorathree =  ["#cc5803", "#e2711d", "#ff9505","#ffb627", "#ffc971" ];
var color_purpeltwo =  ["#abc4ff", "#b6ccfe", "#c1d3fe","#ccdbfd", "#d7e3fc" ];
var color_bluethree =  ["#5999F0", "#90BDF9",];//["#56d1dc", "#93e1d8", "ddfff7"];

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}


//Esconder mensaje de éxito 
apex.jQuery(document).ready(function () {
    apex.message.setThemeHooks({
        beforeShow: function (pMsgType, pElement$) {
            if (pMsgType === apex.message.TYPE.SUCCESS) {
                setTimeout(function () { apex.message.hidePageSuccess(); }, 2000);
            }
        }
    });
});
