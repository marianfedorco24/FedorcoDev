const urlAPI = "https://api.jsonbin.io/v3/b/67feb2c48960c979a585e333";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

// declare some variables
const table = document.querySelector("table");
const tbody = document.querySelector("tbody");
const pathSpan = document.getElementById("pathSpan");
const newFolderPopUp = document.getElementById("newFolderSection");
const newFolderPopUpWrapper = document.getElementById("newFolderPopUpWrapper");
const newFolderInput = document.getElementById("newFolderInput");
const newLinkPopUp = document.getElementById("newLinkSection");
const newLinkPopUpWrapper = document.getElementById("newLinkPopUpWrapper");
const newLinkNameInput = document.getElementById("newLinkNameInput");
const newLinkUrlInput = document.getElementById("newLinkUrlInput");
const editItemWindow = document.getElementById("editSection");
const editItemWindowWrapper = document.getElementById("editWindowWrapper");
const editNameInput = document.getElementById("editNameInput");
const editUrlInput = document.getElementById("editUrlInput");
const editWindowHeading = document.getElementById("editWindowHeading");
const newFolderIconPickerCont = document.getElementById("newFolderIconPickerCont");
const newLinkIconPickerCont = document.getElementById("newLinkIconPickerCont");
const editItemIconPickerCont = document.getElementById("editItemIconPickerCont");
let rootDir;
let currDirPath = "...";
let currDir;
const icons = [
    "icons/social_studies.png",
    "icons/math.png",
    "icons/physics.png",
    "icons/history.png",
    "icons/biology.png",
    "icons/geography.png",
    "icons/language.png",
    "icons/chemistry.png"
];


loadDir(currDirPath, true);

function iconPicked () {
    document.querySelectorAll(".icon").forEach((item) => {item.classList.remove("toggledIcon")});

    event.target.classList.add("toggledIcon");
}

function createIconPicker (parent, type) {
    if (type === "folder") {
        const iconImg = document.createElement("img");
        iconImg.src = "icons/folder.png";
        iconImg.classList.add("icon", "toggledIcon");
        iconImg.addEventListener("click", (e) => {iconPicked()});
        parent.appendChild(iconImg);
    }
    else if (type === "link") {
        const iconImg = document.createElement("img");
        iconImg.src = "icons/link.png";
        iconImg.classList.add("icon", "toggledIcon");
        iconImg.addEventListener("click", (e) => {iconPicked()});
        parent.appendChild(iconImg);
    }
    else {
        const iconImg = document.createElement("img");
        iconImg.src = type;
        iconImg.classList.add("icon", "toggledIcon");
        iconImg.addEventListener("click", (e) => {iconPicked()});
        parent.appendChild(iconImg);
    }

    icons.map((icon, iconIndex) => {
        const iconImg = document.createElement("img");
        iconImg.src = icon;
        iconImg.classList.add("icon");
        iconImg.addEventListener("click", (e) => {iconPicked()});
        parent.appendChild(iconImg);
    })
}

async function deleteItem () {
    const itemName = currentItemNode.target.parentNode.parentNode.children[1].innerHTML;

    let type = "link";

    if (currentItemNode.target.parentNode.parentNode.children[0].firstChild.src.split("/").at(-2) === "folder") {
        type = "folder";
    }
    
    const currentItemIndex = eval(`${getCurrDirObjPath()}.findIndex(item => item.name === itemName && item.type === type)`);

    eval(`${getCurrDirObjPath()}.splice(currentItemIndex, 1)`);

    await putDataAPI(rootDir);
    loadDir(currDirPath, false);
    hideEditItemWindow();
}

function hideEditItemWindow () {
    editItemWindow.style.display = "none";
    editItemWindowWrapper.style.display = "none";
    editUrlInput.style.display = "block";
    editWindowHeading.innerHTML = "Edit link";

    editItemIconPickerCont.innerHTML = "";
}

let currentItemNode;

function showEditItemWindow () {
    editItemWindow.style.display = "flex";
    editItemWindowWrapper.style.display = "flex";

    currentItemNode = event;
    const itemName = event.target.parentNode.parentNode.children[1].innerHTML;

    let type = "link";

    if (currentItemNode.target.parentNode.parentNode.children[0].firstChild.src.split("/").at(-2) === "folder") {
        type = "folder";
    }

    createIconPicker(editItemIconPickerCont, type);

    const currentItemIndex = eval(`${getCurrDirObjPath()}.findIndex(item => item.name === itemName && item.type === type)`);

    if (currentItemNode.target.parentNode.parentNode.children[0].firstChild.src.split("/").at(-2) === "folder") {
        editUrlInput.style.display = "none";
        editWindowHeading.innerHTML = "Edit folder";
    }
    else {
        editUrlInput.value = eval(`${getCurrDirObjPath()}[currentItemIndex].link`);
    }
    editNameInput.value = itemName;

    const currentItemIconPath = eval(`${getCurrDirObjPath()}[currentItemIndex].icon`);

    document.querySelectorAll(".icon").forEach((item) => {item.classList.remove("toggledIcon")});

    Array.from(editItemIconPickerCont.children).find((icon) => `icons/${icon.src.split("/").at(-1)}` === currentItemIconPath).classList.add("toggledIcon");
}

async function confirmFolderEdit () {
    if (editNameInput.value.trim() === "") {
        return;
    }

    const itemName = currentItemNode.target.parentNode.parentNode.children[1].innerHTML;
    let type = "link";

    if (currentItemNode.target.parentNode.parentNode.children[0].firstChild.src.split("/").at(-1) === "folder.png") {
        type = "folder";
    }
    else if (editUrlInput.value.trim() === "") {
        return;
    }

    const iconPath = `icons/${document.querySelector(".toggledIcon").src.split("/").at(-1)}`;

    const currentItemIndex = eval(`${getCurrDirObjPath()}.findIndex(item => item.name === itemName && item.type === type)`);

    if (editNameInput.value.trim() === "") {
        return;
    }

    if (type === "folder") {
        eval(`${getCurrDirObjPath()}[currentItemIndex].name = editNameInput.value.trim()`);
        eval(`${getCurrDirObjPath()}[currentItemIndex].icon = iconPath`);
    }
    else {
        let name = editNameInput.value.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + name;
        }

        eval(`${getCurrDirObjPath()}[currentItemIndex].name = name`);
        eval(`${getCurrDirObjPath()}[currentItemIndex].link = editUrlInput.value.trim()`);
        eval(`${getCurrDirObjPath()}[currentItemIndex].icon = iconPath`);
    }

    await putDataAPI(rootDir);
    loadDir(currDirPath, false);
    hideEditItemWindow();

    editItemIconPickerCont.innerHTML = "";
}

async function createNewFolder () {
    if (newFolderInput.value !== "") {
        const iconPath = `icons/${document.querySelector(".toggledIcon").src.split("/").at(-1)}`;
        console.log(iconPath)

        eval(getCurrDirObjPath()).push({
            "type": "folder",
            "name": newFolderInput.value.trim(),
            "items": [],
            "icon": iconPath
        })

        await putDataAPI(rootDir);
        loadDir(currDirPath, false);
        newFolderPopUpHide();

        newFolderIconPickerCont.innerHTML = "";
    }
}

// function to create a new folder
function showNewFolderWindow () {
    // show the new folder window
    newFolderPopUp.style.display = "flex";
    newFolderPopUpWrapper.style.display = "flex";
    newFolderInput.value = "";

    createIconPicker(newFolderIconPickerCont, "folder");
}

function newFolderPopUpHide () {
    newFolderPopUp.style.display = "none";
    newFolderPopUpWrapper.style.display = "none";

    newFolderIconPickerCont.innerHTML = "";
}

async function createNewLink () {
    if (newLinkNameInput.value.trim() !== "" && newLinkUrlInput.value.trim() !== "") {
        const iconPath = `icons/${document.querySelector(".toggledIcon").src.split("/").at(-1)}`;

        let url = newLinkUrlInput.value.trim();
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
        }

        eval(getCurrDirObjPath()).push({
            "type": "link",
            "name": newLinkNameInput.value.trim(),
            "link": url,
            "icon": iconPath
        })

        await putDataAPI(rootDir);
        loadDir(currDirPath, false);
        newLinkPopUpHide();

        newLinkIconPickerCont.innerHTML = "";
    }
}

// function to create a new folder
function showNewLinkWindow () {
    // show the new folder window
    newLinkPopUp.style.display = "flex";
    newLinkPopUpWrapper.style.display = "flex";
    newLinkNameInput.value = "";
    newLinkUrlInput.value = "";

    createIconPicker(newLinkIconPickerCont, "link");
}

function newLinkPopUpHide () {
    newLinkPopUp.style.display = "none";
    newLinkPopUpWrapper.style.display = "none";

    newLinkIconPickerCont.innerHTML = "";
}

// function that gives us the js path to the current dir
function getCurrDirObjPath () {
    // get the current path array and remove the "..."
    const pathArr = currDirPath.split("/");
    pathArr.splice(0, 1);

    let finalPath = "rootDir.items"
    pathArr.map((dir, dirIndex) => {
        let soughtIndex = eval(finalPath).findIndex(item => item.type === "folder" && item.name === dir)
        finalPath += `[${soughtIndex}].items`;
    })
    return finalPath;
}

function navigateDir () {
    currDirPath += `/${event.currentTarget.parentNode.children[1].innerHTML}`;
    pathSpan.innerHTML = currDirPath;

    loadDir(currDirPath, false);
}

// function that navigated to the parent directory
function prevDir () {
    if (currDirPath !== "...") {
        let currDirPathArr = currDirPath.split("/");
        currDirPathArr.splice(currDirPathArr.length - 1, 1);
        currDirPath = currDirPathArr.join("/");

        loadDir(currDirPath, false);
    }
}

// function that loads the current directory
async function loadDir(path, doFetchAPI) {
    pathSpan.innerHTML = currDirPath;
    tbody.innerHTML = "";

    let obtainedData;
    let data = rootDir;

    if (doFetchAPI) {
        obtainedData = await getDataAPI();
        data = obtainedData.record;
        rootDir = data;
    }

    currDir = getDir(data, path);

    currDir.map((item, itemIndex) => {
        const tableRow = document.createElement("tr");
        tbody.appendChild(tableRow);

        const imgTd = document.createElement("td");
        tableRow.appendChild(imgTd);

        const icon = document.createElement("img");
        icon.classList.add("tableIcon")
        imgTd.appendChild(icon);

        const nameTd = document.createElement("td");
        nameTd.innerHTML = item.name;
        tableRow.appendChild(nameTd);

        let path = item.icon.split("/");
        path.splice(1, 0, item.type);
        path = path.join("/");

        icon.src = path;

        if (item.type === "folder") {
            imgTd.addEventListener("click", (e) => {navigateDir(e)});
            nameTd.addEventListener("click", (e) => {navigateDir(e)});
        }
        else {
            imgTd.addEventListener("click", () => {window.open(item.link, "_blank")});
            nameTd.addEventListener("click", () => {window.open(item.link, "_blank")});
        }

        const editButtonTd = document.createElement("td");
        tableRow.appendChild(editButtonTd);

        const editButton = document.createElement("img");
        editButton.src = "icons/edit.png";
        editButton.classList.add("editButton");
        editButton.addEventListener("click", (e) => {showEditItemWindow(e)});
        editButtonTd.appendChild(editButton);
        }
    )     
}

// function that accesses the given directory and returns it
function getDir (tree, path) {
    const pathArr = path.split("/");
    pathArr.splice(0, 1);
    let currentDir = tree.items;

    for (let folder of pathArr) {
        currentDir = currentDir.find(dir => dir.type === "folder" && dir.name === folder).items
    }
    return currentDir;
}

// Function to obtain the data from an API
async function getDataAPI() {
    try {
        const options = {
            method: "GET",
            headers: {"X-Master-Key": keyAPI}
          };

        const response = await fetch(urlAPI, options);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error occurred in getDataAPI function:", error.message); // Log error.message!
        alert("An error occurred fetching data from the API: " + error.message); // Alert error.message!
        return null; 
    }
}

// function to send the data to an API
async function putDataAPI(dataToSend) {
    try {
        const options = {
            method: 'PUT',
            headers: {
                "X-Master-Key": keyAPI,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
            };
        const response = await fetch(urlAPI, options);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error occurred in getDataAPI function:", error.message); // Log error.message!
        alert("An error occurred fetching data from the API: " + error.message); // Alert error.message!
        return null; 
    }
}
