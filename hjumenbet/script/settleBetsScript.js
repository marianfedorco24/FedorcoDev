const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

// check, whether the user is actually logged in
if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; // Redirect to login if not logged in
}

// get the current user's email
const userEmail = sessionStorage.getItem("email");
const userEmailSpan = document.getElementById("userEmail");
userEmailSpan.innerHTML = userEmail;

// create some variables
const userBetAmountSpan = document.getElementById("userBetAmount");
let userIndex;
const main = document.querySelector("main");
let betsToSettle = [];

(async () => {
    // get the data from the database
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }
    const betsData = structuredClone(obtainedData.record.game.betsData);
    const betters = structuredClone(obtainedData.record.game.betters);
    
    // set the betsToSettle variable (the empty values for the "correct" property will be set down there in the map methods)
    betsToSettle = structuredClone(betsData.currentBets);

    // get the current user's index in betters
    userIndex = betters.findIndex(better => better.email === userEmail);

    // go through each created bets
    betsData.currentBets.map((currentBet, currentBetIndex) => {
        // add a "no winning variation" property to each bet
        betsToSettle[currentBetIndex].noWinningVariations = false;

        // create the section for a bet
        const section = document.createElement("section");
        section.id = `section_${currentBetIndex}`;
        main.appendChild(section);

        // create the heading
        const betHeading = document.createElement("h2");
        betHeading.innerHTML = currentBet.betName;
        betHeading.classList.add("betHeading");
        section.appendChild(betHeading);

        // create a div for the table and the "No winning bets" button
        const tableButtonCont = document.createElement("div");
        tableButtonCont.classList.add("tableButtonCont");
        section.appendChild(tableButtonCont);

        // create a table for the variations
        const variationsTable = document.createElement("table");
        tableButtonCont.appendChild(variationsTable);

        // create the table heading element
        const tableHead = document.createElement("thead");
        variationsTable.appendChild(tableHead);

        //     create a row for the headings
        const headingRow = document.createElement("tr");
        tableHead.appendChild(headingRow);

        //         create the table headings
        const tableHeadingVariation = document.createElement("th");
        tableHeadingVariation.innerHTML = "Bet variation";
        headingRow.appendChild(tableHeadingVariation);

        const tableHeadingOdds = document.createElement("th");
        tableHeadingOdds.innerHTML = "Odds";
        headingRow.appendChild(tableHeadingOdds);

        // create the table body
        const tableBody = document.createElement("tbody");
        variationsTable.appendChild(tableBody);

        // go through each bet variations
        currentBet.betVariations.map((currentVariation, currentVariationIndex) => {
            // assign an empty value to the "correct" property to the "betsToSettle" list
            betsToSettle[currentBetIndex].betVariations[currentVariationIndex].correct = false;

            // create a row for the current variation
            const variationRow = document.createElement("tr");
            variationRow.addEventListener("click", (event) => {selectVariation(event)});
            variationRow.id = `variationRow_${currentVariationIndex}`;
            tableBody.appendChild(variationRow);

            // create a td for the variation name 
            const variationNameTd = document.createElement("td");
            variationNameTd.innerHTML = currentVariation.betVariationName;
            variationRow.appendChild(variationNameTd);

            // create a td for the variation odds
            const variationOddsTd = document.createElement("td");
            variationOddsTd.innerHTML = currentVariation.betVariationOdds;
            variationRow.appendChild(variationOddsTd);
        })

        // create a "No winning bet variations" button
        const noWinningVariationsSpan = document.createElement("span");
        noWinningVariationsSpan.classList.add("noWinningVariationsSpan");
        noWinningVariationsSpan.innerHTML = "--no winning bet variations--";
        noWinningVariationsSpan.id = `noWinningVariationsSpan_${currentBetIndex}`;
        noWinningVariationsSpan.addEventListener("click", (event) => {noWinningVariations(event)});
        tableButtonCont.appendChild(noWinningVariationsSpan);
        }
    )
}
)();

async function settleBets () {
    let settledBets = [];

    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }
    const cleanData = structuredClone(obtainedData.record);

    let newData = structuredClone(cleanData);

    for (let sectionIndex = newData.game.betsData.currentBets.length - 1; sectionIndex >= 0; sectionIndex --) {
        if (isSelectedBet(main.childNodes[sectionIndex])) {
            settledBets.push(betsToSettle[sectionIndex]);
            newData.game.betsData.currentBets.splice(sectionIndex, 1);
        }
    }

    if (settledBets.length === 0) {
        alert("No chosen bets to settle.");
        return;
    }

    newData.game.betsData.settledBets = newData.game.betsData.settledBets.concat(settledBets);

    (async () => {
        const result = await putDataAPI(newData);
        if (result === null) {
            return; // Handle error case
        }
        alert("Your settled bets were updated succesfully!");

        window.location.href = "bets.html"; //redirect
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

function selectVariation (event) {
    const section = event.currentTarget.parentNode.parentNode.parentNode.parentNode;
    // set the index variables
    const betIndex = event.currentTarget.parentNode.parentNode.parentNode.parentNode.id.at(-1);
    const variationIndex = event.currentTarget.id.at(-1);

    // if the variation hasn't been clicked on yet, color it and change the property
    if (!betsToSettle[betIndex].betVariations[variationIndex].correct) {
        event.currentTarget.firstChild.classList.add("selectedVariation");
        event.currentTarget.lastChild.classList.add("selectedVariation");
        betsToSettle[betIndex].betVariations[variationIndex].correct = true;
        betsToSettle[betIndex].noWinningVariations = false;
        section.lastChild.lastChild.classList.remove("selectedVariation");
    }
    else {
        event.currentTarget.firstChild.classList.remove("selectedVariation");
        event.currentTarget.lastChild.classList.remove("selectedVariation");
        betsToSettle[betIndex].betVariations[variationIndex].correct = false;
    }

    if (isSelectedBet(section)) {
        section.classList.add("selectedBet");
    }
    else {
        section.classList.remove("selectedBet");
    }
}

function noWinningVariations (event) {
    const section = event.target.parentNode.parentNode;
    const betIndex = event.currentTarget.id.at(-1);
    
    if (!betsToSettle[betIndex].noWinningVariations) {
        event.currentTarget.classList.add("selectedVariation");
        betsToSettle[betIndex].noWinningVariations = true;
        section.classList.add("selectedBet");

        for (let row of section.lastChild.firstChild.lastChild.childNodes) {
            row.firstChild.classList.remove("selectedVariation");
            row.lastChild.classList.remove("selectedVariation");
            betsToSettle[betIndex].betVariations.map(betVariation => {
                betVariation.correct = false;
            });
        }
    }
    else {
        event.currentTarget.classList.remove("selectedVariation");
        betsToSettle[betIndex].noWinningVariations = false;
        section.classList.remove("selectedBet");
    }
}

// function to check whether something was selected in the bet
function isSelectedBet (section) {
    // if "no winning bet variations" was selected, return true
    if (section.lastChild.lastChild.classList.value.includes("selectedVariation")) {
        return true;
    }

    // if one of the variations was selected, return true
    else if (function () {
        for (let row of section.lastChild.firstChild.lastChild.childNodes) {
            if (row.firstChild.classList.value.includes("selectedVariation")) {
                return true;
            }
            }
        return false;
    }()) {
        return true;
    }

    // if none of the above, return false
    else {
        return false;
    }
}