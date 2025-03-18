const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '..\\index.html'; // Redirect to login if not logged in
}

const userEmail = sessionStorage.getItem("email");
const userEmailSpan = document.getElementById("userEmail");
userEmailSpan.innerHTML = userEmail;
const tableBody = document.querySelector("tbody");


// create an object to store the dynamic variation elements
let betVariationsObj = [
    {
        variationNameInput: document.getElementById("variationNameInput1"),
        variationOddsInput: document.getElementById("variationOddsInput1"),
        variationClearButton: document.getElementById("variationClearButton1")
    }
];

// asign events to the elements from html
betVariationsObj[0].variationOddsInput.addEventListener("click", newRow);
betVariationsObj[0].variationClearButton.addEventListener("click", (e) => {clearInputs(e)});

// define a function that creates new rows, when needed
function newRow () {
    const newElementIndex = betVariationsObj.length; // get the new row's index

    if (betVariationsObj[newElementIndex - 1].variationNameInput.value === "") { // if the row is already created, don't create it again
        return;
    }

    const newRowTr = document.createElement("tr");
    tableBody.appendChild(newRowTr);

    betVariationsObj.push({}); // create a new object in the betVariationsObj list

    // create the variation name input
    const variationNameInputTd = document.createElement("td");
    newRowTr.appendChild(variationNameInputTd);

    betVariationsObj[newElementIndex].variationNameInput = document.createElement("input");
    betVariationsObj[newElementIndex].variationNameInput.placeholder = "Variation name";
    variationNameInputTd.appendChild(betVariationsObj[newElementIndex].variationNameInput);


    // create the variation odds input
    const variationOddsInputTd = document.createElement("td");
    newRowTr.appendChild(variationOddsInputTd);

    betVariationsObj[newElementIndex].variationOddsInput = document.createElement("input");
    betVariationsObj[newElementIndex].variationOddsInput.type = "number";
    betVariationsObj[newElementIndex].variationOddsInput.min = "1";
    betVariationsObj[newElementIndex].variationOddsInput.step = "0.1";
    betVariationsObj[newElementIndex].variationOddsInput.placeholder = "Odds";
    variationOddsInputTd.appendChild(betVariationsObj[newElementIndex].variationOddsInput);


    // create a clear button
    const variationClearButtonTd = document.createElement("td");
    newRowTr.appendChild(variationClearButtonTd);

    betVariationsObj[newElementIndex].variationClearButton = document.createElement("img");
    betVariationsObj[newElementIndex].variationClearButton.src = "..\\icons\\clear.png";
    betVariationsObj[newElementIndex].variationClearButton.id = `variationClearButton${newElementIndex + 1}`;
    variationClearButtonTd.appendChild(betVariationsObj[newElementIndex].variationClearButton);


    //assign the events to the elements
    betVariationsObj[newElementIndex].variationClearButton.addEventListener("click", (e) => {clearInputs(e)});
    betVariationsObj[newElementIndex].variationOddsInput.addEventListener("click", newRow);


}

function clearInputs (event) {
    const currentIndex = event.target.id.slice(-1) - 1;
    betVariationsObj[currentIndex].variationNameInput.value = "";
    betVariationsObj[currentIndex].variationOddsInput.value = "";

    // hide the row
    const visibleElements = Array.from(tableBody.children).filter(el => window.getComputedStyle(el).display !== "none");
    if (visibleElements.length - 1 > 0) {
        tableBody.children[currentIndex].style.display = "none";
    }
}

const betNameInput = document.getElementById("betName");
const submitButton = document.getElementById("submit");

function submitFc () {
    if (betNameInput.value.trim() === "") {
        alert("Bet name is not set!");
        return;
    }

    else if ((() => { // if all the row variations are empty, don't submit
        let isEmpty = true;
        betVariationsObj.map((row, rowIndex) => {
            if ( !((betVariationsObj[rowIndex].variationNameInput.value.trim() === "")   |   (betVariationsObj[rowIndex].variationOddsInput.value.trim() === "")) ) {
                isEmpty = false;
            }
        });
        return isEmpty;
    })()) {
        alert("None of the variation rows are complete, therefore the bet was not created!");
        return;
    }

    (async () => {
        const obtainedDataRaw = await getDataAPI(); // Wait for the data to be fetched
        if (obtainedDataRaw === null) {
            return; // Or handle the error appropriately.  The user has already been alerted.
        }
        const obtainedData = obtainedDataRaw.record; // tidy up the data

        let newData = structuredClone(obtainedData); // duplicate the obtained data to the "to be sent" data object

        let betToAdd = {
            betName: betNameInput.value.trim(),
            betVariationsAll: {
                betVariations: []
            }
        }
        
        betVariationsObj.map(function (el, index) { // start building the newData object, iterate for the number of elements
            if ((betVariationsObj[index].variationNameInput.value.trim() === "")   |   (betVariationsObj[index].variationOddsInput.value.trim() === "")) { // if the row variation row is empty, skip it
                return;
            }

            // construct the bet data
            betToAdd.betVariationsAll.betVariations.push({
                betVariationName: betVariationsObj[index].variationNameInput.value.trim(),
                betVariationOdds: Number(betVariationsObj[index].variationOddsInput.value.trim()),
                userBet: 0
            })
        })
        newData.game.betsData.bets.push(betToAdd); // add the new bet to the whole data set

        const result = await putDataAPI(newData);
        if (result === null) {
            return; // Handle error case
        }
        alert("Data updated successfully!");
        window.location.href = "..\\bets.html";
    })();
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
