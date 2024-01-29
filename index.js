var in_name = document.querySelector("#in_name");
var in_type = document.querySelector("#in_type");
var in_value = document.querySelector("#in_value");
var in_min = document.querySelector("#in_min");
var in_max = document.querySelector("#in_max");

var btn_add = document.querySelector("#btn_add");
var color = document.querySelector("#color");
var out_res = document.querySelector("#out_res");
var modal = undefined;

var content =  document.querySelector("#content");

types = ["num", "bar"];
clrs = { p: "purple", r: "red", b: "blue", g: "green" };
dat = [];
id = 0;

function init(_) {
    in_type.innerHTML = "";
    types.forEach(type => {
        in_type.innerHTML += '<option value="' + type + '">' + capitalize(type) + "</option>";
    });

    RPGUI.create(in_type, "dropdown");
    RPGUI.create(color, "dropdown");
    
    color.disabled = true;

    btn_add.addEventListener("click",addClick,null);

    in_name.addEventListener("keypress",no_num,null);
    in_value.addEventListener("keypress",no_text,null);
    in_min.addEventListener("keypress",no_text,null);
    in_max.addEventListener("keypress",no_text,null);

    in_type.addEventListener("change",autofill,null);
}

function capitalize(word) {
  return word[0].toUpperCase() + word.substr(1);
}

function autofill(e) {
    var value = in_type.value;

    if (value === "bar") {
        in_min.value = "0";
        in_max.value = "100";
        
        color.disabled = false;
    }
    else {
        in_min.value = "";
        in_max.value = "";
        
        color.disabled = true;
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
    var i = 0;
    while (i < dat.length && dat[i].name != name) i++;

    return i < dat.length;
}

function addClick(_) {
    var name = in_name.value;

    if (name === "") {
        name = "" + id; 
    }

    var type = in_type.value;
    var clr = color.value;
    var val = parseInt(in_value.value);
    var min = parseInt(in_min.value);
    var max = parseInt(in_max.value);

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

        while(i < str.length && str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) i++;

        return i >= str.length;
    }

    return false;
}

function containerClicked(e) {
    var src = e.target;

    while (src.id === "") {
        src = src.parentElement;
    }

    if (isNum(src.id)) {
        var num = parseInt(src.id);
        var data = dat.find(d => d.id == num);

        if (data != undefined) {
           var value = window.prompt("Changing value of '" + data.name + "' (" + data.min + " - " + data.max + ") by:");

           if (isNum(value) && data.value + parseInt(value) <= data.max && data.value + parseInt(value) >= data.min) {
                data.value += parseInt(value);
                //updateRes();
           }
        }
    }
}

function setupContainer(id) {
  var container = document.createElement("div");
  container.classList = "rpgui-container framed-golden rpgui-draggable";
  container.setAttribute("data-rpguitype", "draggable");
  container.draggable = false;
  container.addEventListener("click", containerClicked, null);
  container.id = "container_" + id;
  return container;
}

function setupHeader(level, text) {
  var header = document.createElement("h" + level);
  header.innerHTML = text;
  
  return header;
}

function setupElem(type) {
  return document.createElement(type);
}

function createContainer(id) {
    var data = dat.find(d => d.id == id);

    if (data != undefined) {
        var type = data.type.split("-");
      
        var container = setupContainer(data.id);
        
        var title = setupHeader(1, `${data.name} (${data.min} - ${data.max})`);

        var clicker = setupElem("div");
        clicker.id = data.id;

        container.appendChild(title);
        container.appendChild(clicker);

        if (type[0] === "num") {
            var html = setupElem("p");
            html.innerHTML = data.value;

            clicker.appendChild(html);
            content.appendChild(container);
        }
        else if (type[0] === "bar") {
            var html = setupElem("div");
            var clr = type[1];

            html.classList.add(clrs[clr]);
            
            clicker.appendChild(html);

            content.appendChild(container);

            RPGUI.create(html, "progress");          
            RPGUI.set_value(html,(data.value-data.min)/(data.max-data.min));         
        }

        RPGUI.create(container, "draggable");
    }
}

window.addEventListener("load",init,null);