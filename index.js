var in_name = document.querySelector("#in_name");
var in_type = document.querySelector("#in_type");
var in_value = document.querySelector("#in_value");
var in_min = document.querySelector("#in_min");
var in_max = document.querySelector("#in_max");

var btn_add = document.querySelector("#btn_add");
var out_res = document.querySelector("#out_res");
var modal = undefined;

var body =  document.querySelector("#body");

types = ["num", "bar"];
dat = [];
id = 0;

function init(_) {
    in_type.innerHTML = "";
    types.forEach(type => {
        in_type.innerHTML += '<option value="' + type + '">' + type + "</option>";
    });

    RPGUI.create(in_type, "dropdown");

    btn_add.addEventListener("click",addClick,null);

    in_name.addEventListener("keypress",no_num,null);
    in_value.addEventListener("keypress",no_text,null);
    in_min.addEventListener("keypress",no_text,null);
    in_max.addEventListener("keypress",no_text,null);

    in_type.addEventListener("change",autofill,null);
}

function autofill(e) {
    var value = in_type.value;

    if (value === "bar") {
        in_min.value = "0";
        in_max.value = "100";
    }
    else {
        in_min.value = "";
        in_max.value = "";
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
    var val = parseInt(in_value.value);
    var min = parseInt(in_min.value);
    var max = parseInt(in_max.value);

    if (min <= val && max >= val && types.includes(type) && !datIncludes(name)) {
        dat.push({
            id: id,
            name: name,
            type: type,
            value: val,
            min: min,
            max: max
        });

        id++;
    }

    updateRes();
}

function updateRes() {
    out_res.innerHTML = '';

    dat.forEach(d => {
        var container = document.createElement("div");

        container.addEventListener('click', containerClicked,null);

        if (d.type === "num") {
            var label = document.createElement("p");
            label.innerHTML = d.name + " (" + d.min + " - " + d.max + "):";
            label.id="" + d.id;

            var html = document.createElement("p");
            html.innerHTML = d.value;
            html.id = "" + d.id;

            container.appendChild(label);
            container.appendChild(html);

            out_res.appendChild(container);
        }
        else if (d.type === "bar") {
            var label = document.createElement("label");
            label.innerHTML = d.name + " (" + d.min + " - " + d.max + "):";
            container.appendChild(label);
            label.id="" + d.id;

            var html = document.createElement("div");
            container.appendChild(html);
            html.id = "" + d.id;

            out_res.appendChild(container);

            RPGUI.create(html, "progress");          
            RPGUI.set_value(html,(d.value-d.min)/(d.max-d.min));         
        }
    });

    out_res.innerHTML = html;
}

function isNum(str) {
    if (typeof str === 'string' || str instanceof String) {
        let i = 0;

        if (str.charAt(i) === '-') i++;

        while(i < str.length && str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57) i++;

        return i >= str.length;
    }

    return false;
}

function containerClicked(e) {
    var src = e.target;

    while (src.id === "") {
        console.log(src.id);
        src = src.parentElement;
    }

    if (isNum(src.id)) {
        var num = parseInt(src.id);
        var data = dat.find(d => d.id == num);

        if (data != undefined) {
           var value = window.prompt("Changing value of '" + data.name + "' (" + data.min + " - " + data.max + ") by:");

           if (isNum(value) && data.value + parseInt(value) <= data.max && data.value + parseInt(value) >= data.min) {
                data.value += parseInt(value);
                updateRes();
           }
        }
    }
}

window.addEventListener("load",init,null);