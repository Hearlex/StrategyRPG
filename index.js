const in_name = document.querySelector("#in_name");
const in_type = document.querySelector("#in_type");
const in_value = document.querySelector("#in_value");
const in_min = document.querySelector("#in_min");
const in_max = document.querySelector("#in_max");

const btn_add = document.querySelector("#btn_add");
const color = document.querySelector("#color");
const colorDiv = document.querySelector("#colorDiv");
const typeDiv = document.querySelector("#typeDiv");
const out_res = document.querySelector("#out_res");

const modal = document.querySelector("#modal_container");
const modal_title = document.querySelector("#modal_title");
const change_val = document.querySelector("#change_val");
const btn_plus = document.querySelector("#btn_plus");
const btn_minus = document.querySelector("#btn_minus");
const btn_set = document.querySelector("#btn_set");

const content =  document.querySelector("#content");

types = ["num", "bar"];
clrs = { p: "purple", r: "red", b: "blue", g: "green" };
dat = [];
id = 0;

changing = false;
change_id = undefined;

function init(_) {
    in_type.innerHTML = "";
    types.forEach(type => {
        in_type.innerHTML += '<option value="' + type + '">' + capitalize(type) + "</option>";
    });

    RPGUI.create(in_type, "dropdown");
    RPGUI.create(color, "dropdown");

    btn_add.addEventListener("click",addClick,null);
    btn_plus.addEventListener("click",plusChange, null);
    btn_minus.addEventListener("click",minusChange, null);
    btn_set.addEventListener("click",setChange, null);

    in_name.addEventListener("keypress",no_num,null);
    in_value.addEventListener("keypress",no_text,null);
    in_min.addEventListener("keypress",no_text,null);
    in_max.addEventListener("keypress",no_text,null);
    change_val.addEventListener("keypress",no_text,null);

    in_type.addEventListener("change",autofill,null);

    modal.setAttribute("style","visibility: hidden !important;");
    autofill();
}

function capitalize(word) {
  return word[0].toUpperCase() + word.substr(1);
}

function autofill(_) {
    const {value} = in_type;

    if (value === "bar") {
        in_min.value = "0";
        in_max.value = "100";

        typeDiv.appendChild(colorDiv);
    }
    else {
        in_min.value = "";
        in_max.value = "";

        typeDiv.removeChild(colorDiv);
    }
}

function no_num(e) {
    if (e.which >= 48 && e.which <= 57) {
        e.preventDefault();
    }
}

function no_text(e) {
    if (e.which < 48 || e.which > 57) {
        e.preventDefault();
    }
}

function datIncludes(name) {
    let i = 0;
    while (i < dat.length && dat[i].name != name) {
        i++;
    }

    return i < dat.length;
}

function addClick(_) {
    let name = in_name.value;

    if (name === "") {
        name = "Resource " + id; 
    }

    let type = in_type.value;
    const val = parseInt(in_value.value);
    const min = parseInt(in_min.value);
    const max = parseInt(in_max.value);

    if (min <= val && max >= val && types.includes(type) && !datIncludes(name)) {
        if (type === "bar") {
          type = `${type}-${color.value}`;
        }
      
        dat.push({
            id: id,
            name: name,
            type: type,
            value: val,
            min: min,
            max: max
        });

        createContainer(id);

        id++;
    }
}

function isNum(str) {
    if (typeof str === 'string' || str instanceof String) {
        let i = 0;

        while(i < str.length && str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) {
            i++;
        }

        return i >= str.length;
    }

    return false;
}

function containerClicked(id) {
    console.log(id);
    console.log(changing);

    if (!changing) {
        const data = dat.find(d => d.id == id);
        
        if (data != undefined) {
            changing = true;
            change_id = id;

            modal_title.innerHTML = `Changing '${data.name}' (${data.min} - ${data.max})`;
            modal.setAttribute("style","visibility: visible !important;");
        }
    }
    else {
        const data = dat.find(d => d.id == id);
        
        if (data != undefined) {
            change_id = id;

            modal_title.innerHTML = `Changing '${data.name}' (${data.min} - ${data.max})`;
        }
    }
}

function plusChange(_) {
    if (changing) {
        const data = dat.find(d => d.id == change_id);
        const next = data.value + parseInt(change_val.value);

        if (next >= data.min && next <= data.max) {
            data.value = next;
        }

        updateContainer(change_id);
    }
}

function minusChange(_) {
    if (changing) {
        const data = dat.find(d => d.id == change_id);
        const next = data.value - parseInt(change_val.value);

        if (next >= data.min && next <= data.max) {
            data.value = next;
        }

        updateContainer(change_id);
    }
}

function setChange(_) {
    if (changing) {
        const data = dat.find(d => d.id == change_id);
        const next = parseInt(change_val.value);

        if (next >= data.min && next <= data.max) {
            data.value = next;
        }

        updateContainer(change_id);
    }
}

function updateContainer(id) {
    if (changing) {
        changing = false;
        change_id = undefined;
        modal.setAttribute("style","visibility: hidden !important;");
    }
    
    const data = dat.find(d => d.id == id);
    const val = document.querySelector(`#value_${id}`);

    const type = data.type.split("-")[0];

    if (type === "num") {
        val.innerHTML = data.value;
    }
    else if (type === "bar") {
        RPGUI.set_value(val,(data.value-data.min)/(data.max-data.min));  
    }
}

function createContainer(id) {
    const data = dat.find(d => d.id == id);

    if (data != undefined) {
        const type = data.type.split("-");      
        const container = setupContainer(data.id);      
        const title = setupHeader(1, `${data.name} (${data.min} - ${data.max})`);
        const clicker = setupElem("div");
        clicker.id = "click_"+data.id;
        clicker.addEventListener("click", function() {
            containerClicked(data.id);
        }, null);

        clicker.appendChild(title);
        container.appendChild(clicker);

        if (type[0] === "num") {
            const html = setupElem("p");
            html.id = "value_" + data.id;
            html.innerHTML = data.value;

            clicker.appendChild(html);
            content.appendChild(container);
        }
        else if (type[0] === "bar") {
            const html = setupElem("div");
            html.id = "value_" + data.id;
            const clr = type[1];

            html.classList.add(clrs[clr]);
            
            clicker.appendChild(html);

            content.appendChild(container);

            RPGUI.create(html, "progress");          
            RPGUI.set_value(html,(data.value-data.min)/(data.max-data.min));         
        }

        RPGUI.create(container, "draggable");
    }
}

function setupContainer(id) {
    const container = document.createElement("div");
    container.classList = "rpgui-container framed-golden rpgui-draggable";
    container.addEventListener("click", containerClicked, null);
    container.id = "container_" + id;
    return container;
}

function setupHeader(level, text) {
    const header = document.createElement("h" + level);
    header.innerHTML = text;

    return header;
}

function setupElem(type) {
    return document.createElement(type);
}

window.addEventListener("load",init,null);