import { Canvas } from "./modules/canvas.js";

document.getElementById("ui_set").addEventListener("click", () => {
    let change = false;
    for(const [key, value] of Object.entries(window.cvso_config)) {
        let e = $("*[placeholder='" + key + "']")[0];
        let v = e.value;
        if(v) {
            switch(value.type) {
                case "text":
                    window.cvso_config[key].value = v;
                    break;
                case "number":
                    window.cvso_config[key].value = parseInt(v);
                    break;
            }
            e.value = "";
            change = true;
        }
    }
    if(change)
        cvso.initiate();
});

for(const [key, value] of Object.entries(window.cvso_config)) {
    const ibe = $("#input_box");
    const ie = document.createElement("input");
    ie.placeholder = key;
    ie.type = value.type;
    ibe.append(ie);
}

const cvso = new Canvas(document.getElementById("cvs"));
window.cvso = cvso;