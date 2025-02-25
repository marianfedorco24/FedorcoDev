const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; // Redirect to login if not logged in
}

// get the index of the bet to be edited
const betIndex = Number(sessionStorage.getItem("betIndex"));

//define an object to store the elements in
let betReferenceList = {
    betVariationsAll: {
        betVariations: []
    }
};

// save the main element and the betContainerAll
const main = document.querySelector("main");
const betContainerAll = document.getElementById("betContainerAll");
const variationsContainer = document.getElementById("variationsContainer");

// create an array to store the deleted bet variations that are to be deleted form the user bets array in the database
let toBeCleared = [
    null,
    []
];

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

    // save the betName to the toBeCleared array
    toBeCleared[0] = betsData.bets[betIndex].betName
    
    // assign the benName element to the betReferenceList object
    betReferenceList.betName = document.getElementById("betName");
    betReferenceList.betName.value = betsData.bets[betIndex].betName;
    
    // create a container for the betVariationRows
    betReferenceList.betVariationsAll.container = document.createElement("div");
    betReferenceList.betVariationsAll.container.id = "betVariationRowsContainer";
    variationsContainer.appendChild(betReferenceList.betVariationsAll.container);

    // create a row for each betVariation
    betsData.bets[betIndex].betVariationsAll.betVariations.map((variation, variationIndex) => {
        newRow(variation, variationIndex, true);
    })

    // create the extra row
    const newRowIndex = betsData.bets[betIndex].betVariationsAll.betVariations.length;
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
    // get the index of the last row
    const lastRowIndex = betReferenceList.betVariationsAll.betVariations.length - 1;
    // check whether the row was already created
    if (!(betReferenceList.betVariationsAll.betVariations[lastRowIndex].betVariationName.value === "")) {
        newRow(null, lastRowIndex + 1, false);
    }
}
// function to create a new bet variation row
function newRow (variation, variationIndex, isValueNeeded) {
    // create a container
    betReferenceList.betVariationsAll.betVariations.push({container: document.createElement("div")});
    betReferenceList.betVariationsAll.container.appendChild(betReferenceList.betVariationsAll.betVariations[variationIndex].container);

    // create bet variation name input
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName = document.createElement("input");
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName.type = "text";
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName.placeholder = "Variation name";
    // decide, whether to assign a value to the new bet variation name input
    if (isValueNeeded) {
        betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName.value = variation.betVariationName;
    }
    betReferenceList.betVariationsAll.betVariations[variationIndex].container.appendChild(betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationName);

    // create bet variation odds input
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds = document.createElement("input");
    betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds.type = "number";
    // decide, whether to assign a value to the new variation odds input
    if (isValueNeeded) {
        betReferenceList.betVariationsAll.betVariations[variationIndex].betVariationOdds.value = variation.betVariationOdds;
    }
    // give the odds input some parameters
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

// function to clear the inputs of a row
function clearInputs (event) {
    // get the index of the targeted row
    const index = event.target.id.slice(-1);

    // add the bet variation to the toBeCleared array
    toBeCleared[1].push(betReferenceList.betVariationsAll.betVariations[index].betVariationName.value);

    // clear the inputs on the bebpage
    betReferenceList.betVariationsAll.betVariations[index].betVariationName.value = "";
    betReferenceList.betVariationsAll.betVariations[index].betVariationOdds.value = "";
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
    // get data from the database and check it
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }

    // create an object to store the new edited bet into
    let editedBet = {
        betName: betReferenceList.betName.value,
        betVariationsAll: {
            betVariations: []
        }
    };
    
    // check if the bet name is missing
    if (betReferenceList.betName.value.trim() === "") {
        alert("Enter the name of the bet!");
        return;
    }

    // create a variable to be used to check, whether all the bet variations are empty, therefore to delete the whole bet
    let isEmpty = true;

    // go through all the rows
    for (let variation of betReferenceList.betVariationsAll.betVariations) {
        // get the index of the current variation
        const variationIndex = betReferenceList.betVariationsAll.betVariations.indexOf(variation);
        
        // check, if the whole row is empty
        if ((variation.betVariationName.value.trim() === "") && (variation.betVariationOdds.value.trim() === "")) {
            try {
                toBeCleared[1].push(obtainedData.record.game.betsData.bets[betIndex].betVariationsAll.betVariations[variationIndex].betVariationName);
            }
            catch {continue;}
        }
        // check, if some of the values are missing
        else if ((variation.betVariationName.value.trim() === "") | (variation.betVariationOdds.value.trim() === "")) {
            alert("Some values are missing!");
            console.log("some values are missing");
            return;
        }
        // assign the row to the editedBet object
        else {
            if (variation.betVariationName.value !== obtainedData.record.game.betsData.bets[betIndex].betVariationsAll.betVariations[variationIndex].betVariationName) {
                toBeCleared[1].push(obtainedData.record.game.betsData.bets[betIndex].betVariationsAll.betVariations[variationIndex].betVariationName);
            }

            editedBet.betVariationsAll.betVariations.push({
                betVariationName: variation.betVariationName.value,
                betVariationOdds: variation.betVariationOdds.value,
                userBet: 0
            }
        )

        // check, if all the variations are empty
        if (  !(  (variation.betVariationName.value.trim() === "") && (variation.betVariationOdds.value.trim() === "")  )  ) {
            isEmpty = false;
        }
    }
    }
    // if all the variations are empty, delete the whole bet
    if (isEmpty) {
        deleteBet();
    }

    // create a variable to store the whole data in (not just the one bet) to be uploaded to the database
    let editedData = obtainedData.record;

    // go through all the bet variations that are supposed to be removed from the user bets
    toBeCleared[1].map((item) => {
        // iterate ove all the betters
        obtainedData.record.game.betters.map((better, betterIndex) => {
            // iterate over all the bet variations of a single better
            better.userBets.map((bet, betIndex) => {
                // if the current variation matches the sought one, delete it
                if (bet.bet === toBeCleared[0] && bet.betVariation === item) {
                    editedData.game.betters[betterIndex].userBets.splice(betIndex, 1);
                }
            })
        })
    })

    // join the two new objects to form an object to be sent to the database
    editedData.game.betsData.bets[betIndex] = editedBet;

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
    const betName = obtainedData.record.game.betsData.bets[betIndex].betName;

    // remove the current bet from the new data to be sent
    editedData.game.betsData.bets.splice(betIndex, 1);    

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
        console.log("PUT request successful:", data);
        return data;
    }
    catch (error) {
        console.error("Error occurred in getDataAPI function:", error.message); // Log error.message!
        alert("An error occurred fetching data from the API: " + error.message); // Alert error.message!
        return null; 
    }
}