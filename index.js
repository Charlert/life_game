import { Canvas } from "./modules/canvas.js";

document.getElementById("ui_set").addEventListener("click", () => {
    let change = false;
    CONFIG_ENUM.forEach((v) => {
        let ui_v = $("*[placeholder='" + v + "']")[0].value;
        if(ui_v) {
            window[v] = ui_v;
            change = true;
        }
    });
    if(change)
        cvso.initiate();
});

CONFIG_ENUM.forEach((v) => {
    const ibe = $("#input_box");
    const ie = document.createElement("input");
    ie.placeholder = v;
    if (["TEXT_COLOR", "BLOCK_COLOR"].find((vv) => vv === v))
        ie.type = "text";
    else
        ie.type = "number";
    ibe.append(ie);
});

const cvso = new Canvas(document.getElementById("cvs"));
window.cvso = cvso;