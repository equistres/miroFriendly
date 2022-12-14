document.addEventListener("DOMContentLoaded", function(event) {


    const hideFn = (e) =>{

        if(e.target.classList.contains("icon-arrow-down")){

            e.target.parentElement.parentElement.querySelectorAll("div.app-card").forEach((el) => {
                el.classList.add('hide');
            });

            e.target.classList.add("icon-arrow-up")
            e.target.classList.remove("icon-arrow-down");

        } else {

            e.target.parentElement.parentElement.querySelectorAll("div.app-card").forEach((el) => {
                el.classList.remove('hide');
            });

            e.target.classList.add("icon-arrow-down")
            e.target.classList.remove("icon-arrow-up");

        }

    }
    
    const delFn = (e) => {
        let id = e.target.id;

        let itemsSaved = JSON.parse(localStorage.getItem("itemsSaved"));

        let newArr = itemsSaved.filter(function(item) {
            return JSON.parse(item).id != id
        })

        localStorage.setItem('itemsSaved', JSON.stringify(newArr));
        location.reload();

    };

    const fillCategories = () => {
        let itemsSaved = JSON.parse(localStorage.getItem("itemsSaved"));

        if(itemsSaved!==null){
            for (let index = 0; index < itemsSaved.length; index++) {

                let cat = JSON.parse(itemsSaved[index]).cat;
                let url = JSON.parse(itemsSaved[index]).url;
                let title = JSON.parse(itemsSaved[index]).title;
                let id = JSON.parse(itemsSaved[index]).id;
                document.getElementById(cat).innerHTML +=`<div class="app-card"><a class="link link-primary" href="${url}" target="_blank">${title}</a><span class="icon icon-deactivated" id="${id}"></span></div>`;

                document.querySelectorAll(".icon-deactivated").forEach((el) => {
                    el.addEventListener('click', delFn);
                });

                document.querySelectorAll(".icon-arrow-down").forEach((el) => {
                    el.addEventListener('click', hideFn);
                });

            }
        }
    };


    const showCategories = () => {
        let categories = localStorage.getItem("categories");

        const dropdown = document.getElementById("categorias");

        if(categories!==null){

            dropdown.style.display = "block";

            const items = JSON.parse(localStorage.getItem('categories'));

            Object.keys(items).forEach(function(key){
                dropdown.appendChild(new Option(items[key], items[key]));
                document.getElementById("categorySection").innerHTML +=`<div id="${items[key]}"><div class="title"><h3>${items[key]}</h3><span class="icon icon-arrow-down"></span></div></div>`;
            });

            fillCategories();

        }

    }
    
    const element = document.getElementById("create");

    element.addEventListener("click", function() {
        const newCat = document.getElementById('newcat').value;
        
        var config = [];
        config = JSON.parse(localStorage.getItem('categories')) || [];

        if(config.indexOf(newCat)===-1){
            config.push(newCat);
            localStorage.setItem('categories', JSON.stringify(config));
            location.reload();
        } else {
            alert("esa categoria ya existe");
        }

    });

    const add = document.getElementById("add");

    add.addEventListener("click", function() {

        const array = new Uint32Array(1);
        const id = self.crypto.getRandomValues(array)[0];

        var e = document.getElementById("categorias");
        var selectedCategory = e.options[e.selectedIndex].value;

        var config = [];
        config = JSON.parse(localStorage.getItem('itemsSaved')) || [];

        var obj = new Object();
        obj.cat = selectedCategory;
        obj.title  = localStorage.getItem('title').replace(/, Online Whiteboard for Visual Collaboration/g, "");
        obj.url = localStorage.getItem("currentTabUrl");
        obj.id = id;
        var jsonString= JSON.stringify(obj);


        config.push(jsonString);

        localStorage.setItem('itemsSaved', JSON.stringify(config));
        location.reload();

    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        var activeTab = tabs[0];
        var activeTabUrl = activeTab.url;
        var activeTabTitle = activeTab.title;
        var url = activeTabUrl;
        var testUrl = 'miro.com';

        localStorage.setItem('title', JSON.stringify(activeTabTitle));
        
        var addItem = document.getElementById("add");
        
        if(url.indexOf(testUrl) === -1) {
            addItem.setAttribute("disabled", "disabled");
        }
        localStorage.setItem("currentTabUrl", activeTabUrl); 
        showCategories();
     });

});