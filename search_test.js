(() => {
  let addBtn, srcBtn, wrds, addHandler, 
  form, wordlist, clearWrd, reference;
  // modulo 1
  let expandBtn, filtHandler, expand, filterBtn, flsection, 
  selects, main, sub, clearFltr;
  // modulo 2
  
  wordlist = [];
  form = document.getElementById("txt");
  form.addEventListener("focus", (event) => {
    if (event.target.style.borderColor) {
      event.target.style.removeProperty("border-color");
    }
    if (event.target.style.color) {
      event.target.style.removeProperty("color");
    }    
    event.target.value = "";
  });

  reference = document.getElementById("ref");
  clearWrd = document.getElementById("clearWrd");
  addBtn = document.getElementById("plusbtn");
  srcBtn = document.getElementById("search");
  wrds = document.getElementById("newwords");
  reference.addEventListener("click", (event)=>{
    event.preventDefault();
    document.getElementById("initial").focus();
  });

  addHandler = (event) => {
    event.preventDefault();
    
//     empty form check
    if (form.value==="") {
      form.style.setProperty("border-color", "red");
      form.style.setProperty("color", "red");
      form.value = "Введите слово";
      return;
    }
    if (form.value==="Введите слово") {
      return;
    }

    // adding the word
    let nouveau;
    nouveau=document.createElement("p");    
    wordlist.push(form.value);
    nouveau.textContent = form.value;
    form.value = "";
    nouveau.setAttribute("id", String(wordlist.length - 1))
    nouveau.setAttribute("class", "word")
    wrds.appendChild(nouveau);
    nouveau.addEventListener("click", (event) => {
      let num, trgt, news;
      
      trgt = event.target
      num = parseInt(trgt.getAttribute("id"))
      wrds.removeChild(trgt);
      wordlist.splice(num, 1);
      
//       resetting ids
      if (wordlist.length > 0) {
        news = Array.from(document.getElementsByClassName("word"))
        for (let i = 0; i < news.length; i++) {
          news[i].setAttribute("id", String(i))
        }        
      }
    })
  }

  addBtn.addEventListener("click", addHandler);
  
  function regexPrepare(list) {
    // IN: list of strings
    // OUT: list of regexes
    let newlist = [];
    for (let item of list) {
    // модель для прилагательных
      if (/(ый|ое|ая)$/.test(item)) {
        item = `[^а-яёА-Я]${item.slice(0, item.length - 2)}([ыуоа][еюйхя]|[ыи][м]и*|[ое]го|[ое]му)(?=[< .,:;…!"])`;
      } else if (/ой$/.test(item)) {
        item = `[^а-яёА-Я]${item.slice(0, item.length - 2)}(о[йм]|ого|ому|ы[мхе]|ыми)(?=[< .,:;…!"])`;
      } else if (/^[а-я]{3,}ий$/.test(item)) {
        item = `[^а-яёА-Я]${item.slice(0, item.length - 2)}(ь*[яюие]|ь*[ие][емхй]и*|ь*[ое]го|ь*[ое]му|ь*и)(?=[< .,:;…!"])`;
      // Для чисел
      } else if (/\d{1,4}$/.test(item)) {
        item = `\\D${item}(?=\\D)`;
    // для существительных\
      } else if (/и$/.test(item)) {
        item = `[^а-яёА-Я]${item.slice(0, item.length - 1)}(|и|[еая][кйхвм]|[ая]ми)(?=[< .,:;…!"])`;    
      } else if (/а$/.test(item)) {
        item = `[^а-яёА-Я]${item.slice(0, item.length - 1)}(|[иаыуе]|[оеая][йхвм]|ами)(?=[< .,:;…!"])`;
      } else if (/я$/.test(item)) {
        item = `[^а-яёА-Я]${item.slice(0, item.length - 1)}(ь*[юяие]|ь*[еяё][йхм]|ь*ями)(?=[< .,:;…!"])`;    
      } else if (/(ы|е|о|й)$/.test(item)) {
        item = `[^а-яёА-Я]${item.slice(0, item.length - 1)}(|ь*[йяьоаыиуе]|[оеая][йхвм]|[аы]ми|ь*ями)(?=[< .,:;…!"])`;
      } else if (/ь$/.test(item)) {
        item = `[^а-яёА-Я]${item.slice(0, item.length - 1)}(ь*[яьюаыиуе]|ь*[оеёая][йхвм]|[аы]ми|ь*ями)(?=[< .,:;…!"])`;
      } else if (/^[а-я]{4,}ин$/.test(item)) { // господин, армянин, южанин - 1 буква маленькая!
        item = `[^а-яёА-Я]${item.slice(0, item.length - 2)}(|[ае]|а[хм]|ами|ин[уае]|ином|ин)(?=[< .,:;…!"])`;     
      } else {
        item = `[^а-яёА-Я]${item}(|[аыиуе]|ь*[ыоеая][йхвм]|[аы]ми|ь*ями)(?=[< .,:;…!"])`;
      }
    // выше расписать условия + преобразования в регекспные строки
      newlist.push(new RegExp(item, "i"));
    }
    return newlist;
  }

  function allMatches(item, field) {
    // IN: Object + field
    // OUT: Array of all sentence substrings in a field
    let reg;

    if (item[field] === "") {
      return [];
    }
    reg = /(.*?)[.{0,10}[А-Я]([А-Я]|\*).{0,10}]\./gm
    if (reg.test(item[field])) {
      return item[field].match(reg);
    } else {
      return [item[field]];
    };    
  }

  function toArr(obj) {
    // IN: object with fields
    // OUT: list of all sentence substrings
    let temp, sub;
    sub = []
    for (let n of document.fields) {
      temp = allMatches(obj, n);
      sub = sub.concat(temp);
    }
    return sub;
  }

  function alltest_new(item, list) {
    // IN: object with all fields, list of all regexes
    // OUT: match or false
    let sentences;

    sentences = toArr(item);
    // обходим все предложения в объекте:
    for (let n of sentences) {
      // если все выражения есть в данном предложении
      if (list.every(expr => {
        return expr.test(n);
      })) {
        // возвращаем метч
        return n;
      }
    }
    // если не верно ни для одного из полей, возвращаем неуспех
    return false;
  }

  function filter_alternative(arr=document.filtered) {
    // IN: list of all objects
    // OUT: new list of objects with words + add show field
    let newlist, newobj, res, boldened, mtch, num, insrt;

    newlist = [];
    for (let i = 0; i < arr.length; i++) {
      res = alltest_new(arr[i], document.wrdlist);
      if (res === false) {
        continue;
      } else {
        newobj = Object.assign({}, arr[i]);
        boldened = res;
        for (let n of document.wrdlist) {
            mtch = boldened.match(n);
            num = mtch.index;
            insrt = mtch[0]
            boldened = boldened.slice( 0, num + 1 ) +
            `<b>${insrt.slice(1, insrt.length)}</b>` + 
            boldened.slice( num + mtch[0].length, boldened.length );
        }
        newobj.to_show = boldened;
        newlist.push(newobj);
      }
    }
    return newlist;
  }

    // a handler for the srcbutton, wraps the check func
  function srcFunction(event) {
    event.preventDefault();
    if (!(wordlist && wordlist.length > 0)) {
      form.style.setProperty("border-color", "red");
      form.style.setProperty("color", "red");
      form.value = "Введите слово";
      return;   
    }

    reinit();
  }
  srcBtn.addEventListener("click", srcFunction);

  function wrdReset(event) {
    // IN: EVENT
    // OUT: deletes list of words + word buttons
    event.preventDefault();

    form.value = "";
    document.wrdlist = [];
    wordlist = [];
    wrds.innerHTML = "";
    reinit();
  }
  clearWrd.addEventListener("click", wrdReset);

  function reinit() {
  // checks wordlist state
  // rerenders either with or without word filter
    let check;
    check = Boolean((wordlist && wordlist.length > 0));

    if (check) {
        document.wrdlist = regexPrepare(wordlist);
        document.matches = filter_alternative(document.filtered);     
    } else {
        document.matches = document.filtered;
    }
    document.start = 0;
    document.finish = 20;
    renderFunc(0);    
  }  

  main = document.getElementById("main");
  expandBtn = document.getElementById("clp");
  filterBtn = document.getElementById("filterBtn");
  flsection = document.getElementById("query")
  selects = Array.from(document.getElementsByClassName('select'));
  clearFltr = document.getElementById("clearFltr");
  
  expand = (event) => {
  //     main script
    if (flsection.style.display == "none") {
      flsection.style.setProperty("display", "block");
      flsection.setAttribute("aria-expanded", "true");    
    } else {
      flsection.style.setProperty("display", "none");
      flsection.setAttribute("aria-expanded", "false");
    }
  };

  expandBtn.addEventListener("click", expand);
  //   to the handler
  
  function updateRayon(event) {
    // IN: triggered by city selection
    // OUT: sets options for selector
    let city, selector, all, check;
    
    if (!document.fieldObj) {
      return;
    }
    selector = document.getElementById("selectRayon");
    selector.innerHTML = `<option value="">Не выбрано</option>`;
    city = event.target.value;
    check = document.fieldObj["rayon"][city];
    if (check) {
      all = Array.from(check).sort();
      if (all.length > 0) {
        all.forEach(val => {
          selector.innerHTML += createOption(val);
        })
      }      
    }
  }
  document.getElementById("selectCity").addEventListener("input", updateRayon);

//   creating check functions
  function filterFactory() {
    // IN: all selects
    // OUT: object with field names & regexes
    let newobj = new Object;

    selects.forEach(item => {
        let reg, val, name;

        name = item.name;
        val = item.value;
        if (val == "") {
            return;
        }

        if ( name == "mos" ) {
            name = item.value;
            reg = new RegExp("1", "i");
        } else {
            reg = new RegExp(val, "i")
        }
        newobj[name] = reg;
    })
    return newobj;
  };
  
  function filtFunc(flt) {
    // IN: object with field names & regexes
    // OUT: list of matching objects
    let newlist;

    newlist = document.new.filter((item) => {
        for (let n in flt) {
            if (!flt[n].test(item[n])) {
                return false;
            }
        };
        return true;
    })
    return newlist;
  }

//   filter button handler
  filtHandler = (event) => {
    let filts

    event.preventDefault();
    filts = filterFactory();
    if (Object.entries(filts).length == 0) {
        return;
    }
    document.filtered = filtFunc(filts);
    reinit();
  };
  // saves the results to document.filtered
  filterBtn.addEventListener("click", filtHandler)

  function fltReset(event) {
    event.preventDefault();
    selects.forEach((item) => {
        item.selectedIndex = 0;
    })
    document.filtered = document.new;
    reinit();
  }
  clearFltr.addEventListener("click", fltReset);

})();
// end filtermodule



function getFields(list) {
  // IN: a global list of objects 
  // OUT: a global object with properties for fields with selection
  let fieldObj, controleObj;
  controleObj = {"sujet": ["Просихождение названия объекта/места",
  "Персонажи: исторически и легендарные",
  "Религиозные/ритуальные практикиРазвлекательные мероприятия и праздники.",
  "Социальная Характеристика объекта/места",
  "Характеристика объекта/местаСоциальная характеристика объекта/места",
  "Функциональная Характеристика объекта/места",
  "Строительство/образование объекта/места",
  "Этническая Характеристика объекта/места",
  "Изменение облика объекта/места",
  " Благоустройство/ремонтные работы",
  " Неофициальные границы: район",
  " ",
  "  ",
  "   ",
  "Cтроительство объектов: на месте храма/кладбища",
  "Cверхъестественные события",
  ""],
  "type": ["район ", 
  "строение ", 
  "улица "],
  "city": ["Ивановская обл. ", 
  "Ивановская обл.; Владимирская обл.",
  "Ивановоская обл.",
  "Московская обл.; Тверская обл."]};

  fieldObj = new Object;
  fieldObj["sujet"] = new Set;
  fieldObj["type"] = new Set;
  fieldObj["city"] = new Set;
  fieldObj["rayon"] = new Object;
  for (let n of list) {
    let city, type, ray, tip;

    city = n["city"];
    fieldObj["city"].add(city);

    tip = n["type"];
    fieldObj["type"].add(tip);

    type = n["narrativ_t"]
    .split(". ");
    for (let i of type) {
      fieldObj["sujet"].add(i.replace(".", ""));
    };

    ray = n["rayon"];
    if (ray != "") {
      ray = ray.split("; ")
      if (!fieldObj["rayon"][city]) {
        fieldObj["rayon"][city] = new Set;
        ray.forEach((item) => {
          fieldObj["rayon"][city].add(item);
        })
      } else {
        ray.forEach((item) => {
          fieldObj["rayon"][city].add(item);
        })        
      }
    }
  }

  for (let prop in controleObj) {
    for (let word of controleObj[prop]) {
      fieldObj[prop].delete(word);
    }
    fieldObj[prop] = Array.from(fieldObj[prop]).sort();
  }
  return fieldObj;
}

function updateHandler() {
  // IN: an outer request
  // OUT: updates city and sujet form elements
  if (!document.fieldObj) {
    return;
  } else {
    updateField("city");
    updateField("type");
    updateField("sujet");
  }
}

function updateField(fld) {
  // IN: field of object, form element
  // OUT: sets options for the form element
  let source, target;

  if (fld == "city") {
    source = document.fieldObj["city"];
    target = document.getElementById("selectCity");
  } else if (fld == "type") {
    source = document.fieldObj["type"];
    target = document.getElementById("selectType");
  } else if (fld == "sujet") {
    source = document.fieldObj["sujet"];
    target = document.getElementById("selectNarrativT");
  }

  target.innerHTML = `<option value="">Не выбрано</option>`;
  for (let n of source) {
    target.innerHTML += createOption(n);
  }
}

function createOption(val) {
  // IN: name of the option
  // OUT: html element to insert into the form
  return `<option value='${val}'>${val}</option>`
}


// DOWNLOAD MODULE
(async function() {

  let featnum = await fetch("https://pastandnow.nextgis.com/api/resource/14/feature_count", {
    "headers": {
      "accept": "application/javascript, application/json",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    "referrer": "https://pastandnow.staging.nextgis.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  }).then(res => res.json()).catch(err => {
    document.getElementById("main").innerHTML = 
    `<p>Неполадки с соединением</p>
    <p>Попробуйте перезагрузить страницу</p>`;
  }).then(text => {return text.total_count});

  await fetch(`https://pastandnow.nextgis.com/api/resource/14/feature/?limit=${featnum}&fields=addr,city,name,status,rayon,unoff,type,description,narrativ_l,narrativ_b,narrativ_p,narrativ_t,descript2,mos1,mos2,mos3,mos4,mos5,mos6`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    "referrer": "https://pastandnow.staging.nextgis.com/",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
  }).then(res => res.json()).catch(err => {
    document.getElementById("main").innerHTML = 
    `<p>Неполадки с соединением</p>
    <p>Попробуйте перезагрузить страницу</p>`;
  }).then(text => {document.new = text})

  document.new = document.new.map(item => {return item["fields"]})
  document.fields = ["narrativ_p", "narrativ_b", "narrativ_l", "descript2"];
  document.start = 0;
  document.finish = 20;
})()
.then(res => {document.matches = document.filtered = document.new})
.then(res => {document.fieldObj = getFields(document.new)})
.then(res => {updateHandler()})
.then(res => {
  renderFunc(0);
  document.getElementById("forward")
  .addEventListener("click", forwardHandler);
  document.getElementById("forward2")
  .addEventListener("click", forwardHandler);  
  document.getElementById("backward")
  .addEventListener("click", backwardHandler);
  document.getElementById("backward2")
  .addEventListener("click", backwardHandler);  
})

function forwardHandler(event) {
  let quantity, field;

  if (document.finish == document.matches.length) {
    return;
  }

  quantity = 20;
  renderFunc(quantity);
  field = document.getElementById("field");
  field.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  return;
}

function backwardHandler(event) {
  let quantity, field;

  if (document.start == 0) {
    return;
  }

  quantity = -20;
  renderFunc(quantity);
  field = document.getElementById("field");
  field.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  return;
}

function rendOne(obj, id) {
  let short, adr, ray, descr, proshl, unoff, pract, famil;
  if (obj["to_show"]) {short = obj["to_show"];} else {short = "";};
  adr = obj["addr"]
  if (adr == "") {adr = "-"};
  ray = obj["rayon"];
  if (ray == "") {ray = "-";}
  descr = obj["descript2"];
  if (descr != "") {descr = `<hr><strong>Характеристика места:</strong> ${descr}`};
  proshl = obj["narrativ_l"];
  if (proshl != "") {proshl = `<hr><strong>Истории о прошлом:</strong> ${proshl}`};
  pract = obj["narrativ_p"];
  if (pract != "") {pract = `<hr><strong>Практики горожан:</strong> ${pract}`};
  famil = obj["narrativ_b"];
  if (famil != "") {famil = `<hr><strong>Семейные истории:</strong> ${famil}`};  
  unoff = obj["unoff"];
  if (unoff != "") {unoff = `<hr><strong>Неофициальное название:</strong> ${unoff}`};  
  return `<div class="object" style="height:60vh; overflow:auto;">
  <p class="name">${obj["name"]}</p>
  <section class="additional">
  <span>Адрес: ${adr}</span><br>
  <span>Тип: ${obj["type"]}</span><br>
  <span>${obj["city"]}, район: ${ray}</span>
  </section>
  <p>${short}</p>
  <a id="${id}_expand" class="link" href="#">Показать / скрыть полный текст</a>
  <div id="full_${id}" style="overflow: auto; display: none; text-align:left;">
  <p>${descr}</p>
  <p>${proshl}</p>
  <p>${pract}</p>
  <p>${famil}</p>
  <p>${unoff}</p>
  </div>
  <p class="additional">${obj["narrativ_t"]}</p>
  </div>`
}

function mainAlert() {
    let main;

    main = document.getElementById("main");
    main.innerHTML = "<p style='font-size: 1.1rem;'>Произошла ошибка, попробуйте обновить страницу.</p>";
}

function countUpdate() {
  let countelem, counter, main, field;

  main = document.getElementById("main");
  field = document.getElementById("field");
  countelem = document.getElementById("counter");  

  if (!countelem) {
      counter = document.createElement("p");
      counter.setAttribute("id", "counter")
      counter.style.setProperty("position", "static");
      counter.style.setProperty("display", "block");
      counter.innerHTML = `${document.start+1}-${document.finish} / ${document.matches.length}`;
      field.insertBefore(counter, main);      
  } else {
    countelem.innerHTML = `${document.start+1}-${document.finish} / ${document.matches.length}`;
  }  
}

function renderFunc(quant) {
  let main, subarr, id, links, field;

  main = document.getElementById("main");
  field = document.getElementById("field");
//     если фильтры дали 0
  if ( !document.matches || document.matches.length == 0 ) {
    main.innerHTML = "<p style='font-size: 1.1rem;'>Запрос не дал результатов</p>";
    document.start = 0;
    document.finish = 20;
    countUpdate();
    return;
  }
// проверка наличия коротких версий
  
  document.start = document.start + quant;
  if ( quant >= 0 ) {
    document.finish = document.finish + quant;
  } else {
    document.finish = document.start - quant;
  }
  // document.finish = document.finish + quant;
  if (document.finish > document.matches.length) {
    document.finish = document.matches.length;
  }

  countUpdate();

  try {
      main.innerHTML = "";
      id = 1;
      subarr = document.matches.slice(document.start, document.finish);
      subarr.forEach((item) => {
        main.innerHTML += rendOne(item, id);
        id ++;
      });
      links = Array.from(document.getElementsByClassName("link"));
      links.forEach(item => {
        item.addEventListener("click", linkHandler)
      })
      
  } catch(err) {
    mainAlert();
  } finally {
    return;
  }
}  

function linkHandler(event) {
  let full, num;

  event.preventDefault();
  num = parseInt(event.target.id);
  full = document.getElementById(`full_${num}`);
  if (full.style.display == "none") {
    full.style.removeProperty("display");    
  } else {
    full.style.setProperty("display", "none");
  }  
}