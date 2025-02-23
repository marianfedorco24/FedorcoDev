const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; // Redirect to login if not logged in
}

const betIndex = Number(sessionStorage.getItem("betIndex"));

let betReferenceList = {
    betVariationsAll: {
        betVariations: []
    }
};

const main = document.querySelector("main");

(async () => {
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched

    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }

    const cleanData = structuredClone(obtainedData.record);
    const betsData = structuredClone(cleanData.game.betsData);
    const betters = structuredClone(cleanData.game.betters);

    betReferenceList.betName = document.getElementById("betName");
    betReferenceList.betName.value = betsData.bets[betIndex].betName;
    
    betReferenceList.betVariationsAll.container = document.createElement("div");
    main.appendChild(betReferenceList.betVariationsAll.container);

    betsData.bets[betIndex].betVariationsAll.betVariations.map((variation, variationIndex) => {
        newRow(variation, variationIndex, true);
    })
    const newRowIndex = betsData.bets[betIndex].betVariationsAll.betVariations.length;
    newRow(null, newRowIndex, false);

    const saveChangesButton = document.createElement("button");
    saveChangesButton.innerHTML = "Save changes";
    saveChangesButton.id = "saveCahngesButton";
    saveChangesButton.addEventListener("click", saveChanges);
    main.appendChild(saveChangesButton);

    const deleteBetButton = document.createElement("button");
    deleteBetButton.innerHTML = "Delete bet";
    deleteBetButton.id = "deleteBetButton";
    deleteBetButton.addEventListener("click", deleteBet);
    main.appendChild(deleteBetButton);
}
)();

function newRowTrigger () {
    const newRowIndex = betReferenceList.betVariationsAll.betVariations.length;
    if (betReferenceList.betVariationsAll.betVariations[newRowIndex - 1].betVariationName.value === "") {
        return;
    }
    newRow(null, newRowIndex, false);
}

function newRow (variation, variationIndex, isValueNeeded) {
    // create a container
    betReferenceList.betVariationsAll.betVariations.push({container: document.createElement("div")});
    betReferenceList.betVariationsAll.container.appendChild(betReferenceList.betVariationsAll.betVariations[variationIndex].container);

    // create bet variation name input
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName = document.createElement("input");
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName.type = "text";
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName.placeholder = "Variation name";
    if (isValueNeeded) {
        betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName.value = variation.betVariationName;
    }
    betReferenceList.betVariationsAll.betVariations[variationIndex].container.appendChild(betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName);

    // create bet variation odds input
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds = document.createElement("input");
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds.type = "number";
    if (isValueNeeded) {
        betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds.value = variation.betVariationOdds;
    }
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds.min = "1";
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds.step = "0.1";
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds.placeholder = "Odds";
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds.addEventListener("click", newRowTrigger);
    betReferenceList.betVariationsAll.betVariations[variationIndex].container.appendChild(betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds);

    // create a clear button
    betReferenceList.betVariationsAll.betVariations[variationIndex].clearButton = document.createElement("img");
    betReferenceList.betVariationsAll.betVariations[variationIndex].clearButton.src = "clear.png";
    betReferenceList.betVariationsAll.betVariations[variationIndex].clearButton.width = "20";
    betReferenceList.betVariationsAll.betVariations[variationIndex].clearButton.id = `clearButton${variationIndex}`
    betReferenceList.betVariationsAll.betVariations[variationIndex].clearButton.addEventListener("click", ("click", (e) => {clearInputs(e)}));
    betReferenceList.betVariationsAll.betVariations[variationIndex].container.appendChild(betReferenceList.betVariationsAll.betVariations[variationIndex].clearButton);
}

function clearInputs (event) {
    const index = event.target.id.slice(-1);
    betReferenceList.betVariationsAll.betVariations[index].betVariationName.value = "";
    betReferenceList.betVariationsAll.betVariations[index].betVariationOdds.value = "";
}

async function saveChanges () {
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched

    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }

    let editedBet = {
        betName: betReferenceList.betName.value,
        betVariationsAll: {
            betVariations: []
        }
    };
    
    betReferenceList.betVariationsAll.betVariations.map((variation) => {
        editedBet.betVariationsAll.betVariations.push({
            betVariationName: variation.betVariationName.value,
            betVariationOdds: variation.betVariationOdds.value,
            userBet: 0
        })
    })

    let editedData = obtainedData.record;
    editedData.game.betsData.bets[betIndex] = editedBet;

    const result = await putDataAPI(editedData);
        if (result === null) {
            return; // Handle error case
        }
        console.log("Edited data:", result);
        alert("Data edited successfully!");
        window.location.href = "bets.html";
}

async function deleteBet () {
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched

    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }

    let editedData = obtainedData.record;
    editedData.game.betsData.bets.splice(betIndex, 1);

    const result = await putDataAPI(editedData);
        if (result === null) {
            return; // Handle error case
        }
        console.log("Edited data:", result);
        alert("Bet deleted successfully!");
        window.location.href = "bets.html";
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
        console.log("PUT request successful:", data);
        return data;
    }
    catch (error) {
        console.error("Error occurred in getDataAPI function:", error.message); // Log error.message!
        alert("An error occurred fetching data from the API: " + error.message); // Alert error.message!
        return null; 
    }
}