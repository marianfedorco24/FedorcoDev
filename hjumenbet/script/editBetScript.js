const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; // Redirect to login if not logged in
}

const userEmail = sessionStorage.getItem("email");
const userEmailSpan = document.getElementById("userEmail");
userEmailSpan.innerHTML = userEmail;

// get the index of the bet to be edited
const betIndex = Number(sessionStorage.getItem("betIndex"));

// save some elements
const main = document.querySelector("main");
const variationsContainer = document.getElementById("variationsContainer");
const tbody = document.querySelector("tbody");
const betNameInput = document.getElementById("betName");

// create an array to store the deleted bet variations that are to be deleted form the user bets array in the database
let toBeCleared = {
    betName: null,
    betVariations: []
};

// run the main function displaying the bet
(async () => {
    // get the data
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched

    // check if the data was obtained successfully
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }

    // set some variables
    const cleanData = structuredClone(obtainedData.record);
    const betsData = structuredClone(cleanData.game.betsData);

    // set the betname input
    betNameInput.value = betsData.currentBets[betIndex].betName;

    // save the betName to the toBeCleared array
    toBeCleared.betName = betsData.currentBets[betIndex].betName;

    // create a table row for each betVariation
    betsData.currentBets[betIndex].betVariations.map((variation, variationIndex) => {
        newRow(variation, variationIndex, true);
    })

    // create the extra row
    const newRowIndex = betsData.currentBets[betIndex].betVariations.length;
    newRow(null, newRowIndex, false);

    // locate the save and delete buttons
    const saveChangesButton = document.getElementById("saveChangesButton");
    saveChangesButton.addEventListener("click", saveChanges);

    const deleteBetButton = document.getElementById("deleteBetButton");
    deleteBetButton.addEventListener("click", deleteBet);
}
)();

// function to decide whether a new row should be cretated
function newRowTrigger () {
    // get the index of the new row
    const newRowIndex = tbody.children.length;

    // get the current row
    const currentRow = tbody.lastChild;

    // check whether the row was already created
    if (!(currentRow.children[0].firstChild.value === "")) {
        newRow(null, newRowIndex, false);
    }
}

// function to create a new bet variation row
function newRow (variation, variationIndex, isValueNeeded) {
    // create a new table row
    const variationRow = document.createElement("tr");
    tbody.appendChild(variationRow);


    // add the variation name input
    const variationNameInputTd = document.createElement("td");
    variationRow.appendChild(variationNameInputTd);

    const variationNameInput = document.createElement("input");
    variationNameInput.placeholder = "Variation name"
    variationNameInputTd.appendChild(variationNameInput);


    // add the variation odds input
    const variationOddsInputTd = document.createElement("td");
    variationRow.appendChild(variationOddsInputTd);

    const variationOddsInput = document.createElement("input");
    variationOddsInput.placeholder = "Odds";
    variationOddsInput.type = "number";
    variationOddsInput.min = "1";
    variationOddsInput.step = "0.1";
    variationOddsInput.addEventListener("click", newRowTrigger);
    variationOddsInputTd.appendChild(variationOddsInput);


    // decide, whether to assign values
    if (isValueNeeded) {
        variationNameInput.value = variation.betVariationName;
        variationOddsInput.value = variation.betVariationOdds;
    }


    // create a clear button
    const clearButtonTd = document.createElement("td");
    variationRow.appendChild(clearButtonTd);

    const clearButton = document.createElement("img");
    clearButton.src = "icons/clear.png";
    clearButton.classList.add("clearButton", "pointer");
    clearButton.id = `clearButton${variationIndex}`;
    clearButton.addEventListener("click", ("click", (e) => {clearInputs(e)}));
    clearButtonTd.appendChild(clearButton);
}

// function to clear the inputs of a row
function clearInputs (event) {
    // get the index of the targeted row
    const currentIndex = event.target.id.slice(-1);
    const currentRowTds = tbody.children[currentIndex].children;

    // add the bet variation to the toBeCleared array
    toBeCleared.betVariations.push(currentRowTds[0].firstChild.value);

    // clear the inputs on the bebpage
    currentRowTds[0].firstChild.value = "";
    currentRowTds[1].firstChild.value = "";

    // hide the row
    const visibleElements = Array.from(tbody.children).filter(el => window.getComputedStyle(el).display !== "none");
    if (visibleElements.length - 1 > 0) {
        tbody.children[currentIndex].style.display = "none";
    }
}

// function to remove a specified bet from all users in the user bets database
async function removeUserBets (betName, variationName) {
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }
    
    const betters = obtainedData.record.game.betters;

    let newBetters = structuredClone(betters);
    
    // go through the betters in the database
    betters.map((better, betterIndex) => {
        // go through all the bets of one user
        better.userBets.map((userBet, userBetIndex) => {
            // if the sought bet variation wass found, delete it
            if (userBet.bet === betName && userBet.betVariation === variationName) {
                newBetters[betterIndex].userBets.splice(userBetIndex, 1);
            }
        })
    })
    // create a new variable that will be sent to the database
    let newData = structuredClone(obtainedData.record);
    newData.game.betters = newBetters;

    // post it to the database
    const result = await putDataAPI(newData);
        if (result === null) {
            return; // Handle error case
            }
}

// function for the save chaanges button
async function saveChanges () {
    // define some variables
    const betName = document.getElementById("betName");

    // get data from the database and check it
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }

    // create an object to store the new edited bet into
    let editedBet = {
        betName: betName.value,
        betVariations: []
    };
    
    // check if the bet name is missing
    if (betName.value.trim() === "") {
        alert("Enter the name of the bet!");
        return;
    }

    // create a variable to be used to check, whether all the bet variations are empty, therefore to delete the whole bet
    let isEmpty = true;

    // go through all the rows
    for (const [rowIndex, row] of [...tbody.children].entries()) {
        const currentRowTds = row.children;
    
        // check if the row is empty
        if (currentRowTds[0].firstChild.value.trim() === "" && currentRowTds[1].firstChild.value.trim() === "") {
            try {
                toBeCleared.betVariations.push(obtainedData.record.game.betsData.currentBets[betIndex].betVariations[rowIndex].betVariationName);
            }
            catch {
                continue; // Skip to next row
            }
        }

        // check whether some values are missing
        else if (currentRowTds[0].firstChild.value.trim() === "" | currentRowTds[1].firstChild.value.trim() === "") {
            alert("Some values are missing,\nor INVALID format!\n(Don't use COMMAS for decimal points.)");
            return;
        }

        // assign the row to the editedBet object
        else {
            // mark that not all the variations are empty
            isEmpty = false;

            // if the current variation is not new, check, if it`s name was changed... without checking whether it`s new, we get an error, because js wouldn`t be able to access it
            if (!(obtainedData.record.game.betsData.currentBets[betIndex].betVariations.length < (rowIndex + 1))) {
                // if the current variation`s name was changed, add it to the toBeCleared array
                if (currentRowTds[0].firstChild.value.trim() !== obtainedData.record.game.betsData.currentBets[betIndex].betVariations[rowIndex].betVariationName) {
                    toBeCleared.betVariations.push(obtainedData.record.game.betsData.currentBets[betIndex].betVariations[rowIndex].betVariationName);
                }
            }
            // add the variation to the object to be sent
            editedBet.betVariations.push({
                betVariationName: currentRowTds[0].firstChild.value.trim(),
                betVariationOdds: currentRowTds[1].firstChild.value.trim(),
                userBet: 0
            }
        )
    }
    }
    
    // if all the variations are empty, delete the whole bet
    if (isEmpty) {
        deleteBet();
        return;
    }

    // create a variable to store the whole data in (not just the one bet) to be uploaded to the database
    let editedData = obtainedData.record;

    // go through all the bet variations that are supposed to be removed from the user bets
    toBeCleared.betVariations.map((item) => {
        // iterate ove all the betters
        obtainedData.record.game.betters.map((better, betterIndex) => {
            // iterate over all the bet variations of a single better
            better.userBets.map((bet, betIndex) => {
                // if the current variation matches the sought one, delete it
                if (bet.bet === toBeCleared.betName && bet.betVariation === item) {
                    editedData.game.betters[betterIndex].userBets.splice(betIndex, 1);
                }
            })
        })
    })

    // check whether the bet name was changed... if yes, change the name in user bets
    if (obtainedData.record.game.betsData.currentBets[betIndex].betName !== betNameInput.value.trim()) {
        obtainedData.record.game.betters.map((better, betterIndex) => {
            better.userBets.map((userBet, userBetIndex) => {
                if (userBet.bet === obtainedData.record.game.betsData.currentBets[betIndex].betName) {
                    editedData.game.betters[betterIndex].userBets[userBetIndex].bet = betNameInput.value.trim();
                }
            })
        })
    }

    // join the two new objects to form an object to be sent to the database
    editedData.game.betsData.currentBets[betIndex] = editedBet;

    // upload the new data to the database
    const result = await putDataAPI(editedData);
        if (result === null) {
            return; // Handle error case
        }
        //move to the main page
        window.location.href = "bets.html";
}

// function to delete the whole bet
async function deleteBet () {
    // get data from the database
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }

    // define a variable to be later sent to the database
    let editedData = obtainedData.record;

    // get the name of the current bet
    const betName = obtainedData.record.game.betsData.currentBets[betIndex].betName;

    // remove the current bet from the new data to be sent
    editedData.game.betsData.currentBets.splice(betIndex, 1);

    // delete all the user bet variations that were made with the current bet (that is getting deleted)
    for (let _better = obtainedData.record.game.betters.length - 1; _better >= 0; _better--) {
        // create a variable to store the current better we are itterating through
        let better = obtainedData.record.game.betters[_better];
    
        // iterate through the user's bets
        for (let _userBet = better.userBets.length - 1; _userBet >= 0; _userBet--) {
            // declare a variable to store the current user bet
            let userBet = better.userBets[_userBet];
    
            // if the if the current iterated user bet matches our sought, to be deleted, bet, delete it
            if (userBet.bet === betName) {
                editedData.game.betters[_better].userBets.splice(_userBet, 1);
            }
        }
    }

    // update the data to the database
    const result = await putDataAPI(editedData);
    if (result === null) {
        return; // Handle error case
    }
    // go to the main page
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
        return data;
    }
    catch (error) {
        console.error("Error occurred in getDataAPI function:", error.message); // Log error.message!
        alert("An error occurred fetching data from the API: " + error.message); // Alert error.message!
        return null; 
    }
}
