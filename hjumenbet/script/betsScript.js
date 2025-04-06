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
const payoutsButton = document.getElementById("payoutsButton");
const winningsButton = document.getElementById("winningsButton");
const settleBetsButton = document.getElementById("settleBetsButton");

(async () => {
    // get the data from the database
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }
    const betsData = structuredClone(obtainedData.record.game.betsData);
    const betters = structuredClone(obtainedData.record.game.betters);

    // get the current user's index in betters
    userIndex = betters.findIndex(better => better.email === userEmail);

    // check the user's permissions and based on that show appropriate buttons
    if (obtainedData.record.users[userIndex].role === "moderator" | obtainedData.record.users[userIndex].role === "admin") {
        // if there are some settled bets, show the payouts button
        if (betsData.settledBets.length !== 0) {
            payoutsButton.style.display = "block";
        }
        settleBetsButton.style.display = "block";
    }

    // if the user has some settled bets, show the Winnings button
    let userhasSettledBets = false;
    betters[userIndex].userBets.map((userBet, userBetIndex) => {
        // go through each user's bets and check, whether it has been settled
        let currentBetSettledIndex = betsData.settledBets.findIndex(settledBet => settledBet.betName === userBet.bet);

        // here I divide the user's bets by whether they are settled or not
        if (currentBetSettledIndex !== -1) {
            userhasSettledBets = true;
        }
    })

    if (userhasSettledBets) {
        winningsButton.style.display = "block";
    }

    // set the user's current bet amount
    let userBetAmount = 0;
    for (section of main.children) {
        for (variation of section.lastChild.lastChild) {
            userBetAmount += Number(variation.lastChild.firstChild.firstChild.firstChild.value);
        }
    }

    userBetAmountSpan.innerHTML = `${userBetAmount} Kč`;

    // go through each created bets
    betsData.currentBets.map((currentBet, currentBetIndex) => {
        // create the section for a bet
        const section = document.createElement("section");
        main.appendChild(section);

        // create a container for the heading and an edit button
        const headingCont = document.createElement("div");
        headingCont.classList.add("headingCont");
        section.appendChild(headingCont);

        //     create the heading
        const betHeading = document.createElement("h2");
        betHeading.innerHTML = currentBet.betName;
        betHeading.classList.add("betHeading");
        headingCont.appendChild(betHeading);

        //     create the edit button
        const editButton = document.createElement("img");
        editButton.src = "icons/edit.png";
        editButton.id = `editButton${currentBetIndex}`;
        editButton.classList.add("editButton", "pointer");
        editButton.addEventListener("click", (e) => {edit(e)});
        headingCont.appendChild(editButton);

        // create a table for the variations
        const variationsTable = document.createElement("table");
        section.appendChild(variationsTable);

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

        const tableHeadingBet = document.createElement("th");
        tableHeadingBet.innerHTML = "Your bet";
        headingRow.appendChild(tableHeadingBet);

        // create the table body
        const tableBody = document.createElement("tbody");
        variationsTable.appendChild(tableBody);

        // go through each bet variations
        currentBet.betVariations.map((currentVariation, currentVariationIndex) => {
            // create a row for the current variation
            const variationRow = document.createElement("tr");
            tableBody.appendChild(variationRow);

            // create a td for the variation name 
            const variationNameTd = document.createElement("td");
            variationNameTd.innerHTML = currentVariation.betVariationName;
            variationRow.appendChild(variationNameTd);

            // create a td for the variation odds
            const variationOddsTd = document.createElement("td");
            variationOddsTd.innerHTML = currentVariation.betVariationOdds;
            variationRow.appendChild(variationOddsTd);

            // create a td for the betted amount
            const bettedAmountTd = document.createElement("td");
            bettedAmountTd.classList.add("bettedAmountTd");
            variationRow.appendChild(bettedAmountTd);

            // create a wapper for all the elements inside for CSS purposes
            const wrapper = document.createElement("div");
            wrapper.classList.add("wrapper");
            bettedAmountTd.appendChild(wrapper);

            //     create a div for the amount input and currency span
            const bettedAmountAmountCont = document.createElement("div");
            bettedAmountAmountCont.classList.add("bettedAmountAmountCont");
            wrapper.appendChild(bettedAmountAmountCont);

            //         create the bet amount input
            const bettedAmountInput = document.createElement("input");
            bettedAmountInput.type = "number";
            bettedAmountInput.min = "0";
            bettedAmountInput.step = "10";
            bettedAmountInput.value = 0;
            bettedAmountInput.classList.add("bettedAmountInput");
            bettedAmountAmountCont.appendChild(bettedAmountInput);

            //         create the bet amount currency span
            const bettedAmountCurrencySpan = document.createElement("span");
            bettedAmountCurrencySpan.innerHTML = "Kč";
            bettedAmountAmountCont.appendChild(bettedAmountCurrencySpan);

            //     create a div for the add subtract buttons
            const addSubtractCont = document.createElement("div");
            addSubtractCont.classList.add("addSubtractCont");
            wrapper.appendChild(addSubtractCont);

            //         create a add button
            const addButton = document.createElement("img");
            addButton.src = "icons/add.png";
            addButton.id = `addButton${currentBetIndex}_${currentVariationIndex}`;
            addButton.classList.add("addSubtractButton")
            addButton.addEventListener("click", (e) => {userBetAdd(e)});
            addSubtractCont.appendChild(addButton);

            //         create a subtract button
            const subtractButton = document.createElement("img");
            subtractButton.src = "icons/subtract.png";
            subtractButton.id = `subtractButton${currentBetIndex}_${currentVariationIndex}`;
            subtractButton.classList.add("addSubtractButton")
            subtractButton.addEventListener("click", (e) => {userBetSubtract(e)});
            addSubtractCont.appendChild(subtractButton);


            // set the user's bet amounts
            betters[userIndex].userBets.map((variation, variationIndex) => { // go through the user's bets
                if ((variation.bet === betsData.currentBets[currentBetIndex].betName) && (variation.betVariation === betsData.currentBets[currentBetIndex].betVariations[currentVariationIndex].betVariationName)) { // if it matches the current element that is being created:
                    bettedAmountInput.value = variation.betAmount; // asign the bet value
                }
            })
        })
        }
    )
}
)();

async function saveBets () {
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }
    const cleanData = structuredClone(obtainedData.record);
    const betters = structuredClone(obtainedData.record.game.betters);

    const thisUserBetIndex = betters.findIndex(better => better.email === userEmail);

    // this is the array for the new user bets
    let newUserBets = [];

    // go through all bets visible
    Array.from(main.children).map((currentBet, currentBetIndex) => {
        // go through all the variations of the current bet
        Array.from(currentBet.lastChild.lastChild.children).map((currentVariation, currentVariationIndex) => {
            // if the user betted in the current variation, add it to the newUserBets array
            if (currentVariation.lastChild.firstChild.firstChild.firstChild.value !== undefined && currentVariation.lastChild.firstChild.firstChild.firstChild.value !== "0") {
                newUserBets.push({
                    bet: currentBet.firstChild.firstChild.innerHTML,
                    betVariation: currentVariation.firstChild.innerHTML,
                    betAmount: currentVariation.lastChild.firstChild.firstChild.firstChild.value
                })
            }
        })
    })

    let newData = structuredClone(cleanData);

    let oldUserBets = newData.game.betters[thisUserBetIndex].userBets;

    // go through all the old user bets
    for (let currentOldUserBetIndex = oldUserBets.length - 1; currentOldUserBetIndex >= 0; currentOldUserBetIndex --) {
        // check, whether the current old user bet is present in the new one
        if (newUserBets.find(currentNewUserBet => currentNewUserBet.bet === oldUserBets[currentOldUserBetIndex].bet && currentNewUserBet.betVariation === oldUserBets[currentOldUserBetIndex].betVariation) !== undefined) {
            // if yes, delete it from the old list
            oldUserBets.splice(currentOldUserBetIndex, 1);
        }
    }

    // join the two lists Ferenc Liszt
    newData.game.betters[thisUserBetIndex].userBets = oldUserBets.concat(newUserBets);
    
    (async () => {
        const result = await putDataAPI(newData);
        if (result === null) {
            return; // Handle error case
        }
        alert("Your bets were updated succesfully!");

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

function edit (event) {
    const editIndex = event.target.id.slice(-1);
    sessionStorage.setItem("betIndex", editIndex);
    window.location.href = "editBet.html";
}

function userBetAdd (event) {
    const betIndex = event.target.id.at(-3);
    const variationIndex = event.target.id.at(-1);
    const amountInputCurrent = main.children[betIndex].lastChild.lastChild.children[variationIndex].lastChild.firstChild.firstChild.firstChild;
    amountInputCurrent.value = Number(amountInputCurrent.value) + 10;
}

function userBetSubtract (event) {
    const betIndex = event.target.id.at(-3);
    const variationIndex = event.target.id.at(-1);
    const amountInputCurrent = main.children[betIndex].lastChild.lastChild.children[variationIndex].lastChild.firstChild.firstChild.firstChild;
    if (!(amountInputCurrent.value <= 0)) {
        amountInputCurrent.value = Number(amountInputCurrent.value) - 10;
    }
}
