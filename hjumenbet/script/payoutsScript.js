const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; // Redirect to login if not logged in
}

const userEmail = sessionStorage.getItem("email");
const userEmailSpan = document.getElementById("userEmail");
userEmailSpan.innerHTML = userEmail;
const select = document.getElementById("select");
const table = document.getElementById("table");
const tableBody = document.getElementById("tableBody");
const toBePaidSpan = document.getElementById("toBePaid");
let usersToBePaidOut = [];

select.addEventListener("change", loadUser);

(async () => {
    // get the data from the database
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }
    const betsData = structuredClone(obtainedData.record.game.betsData);
    const betters = structuredClone(obtainedData.record.game.betters);

    // go through all the users
    betters.map((better, betterIndex) => {
        usersToBePaidOut.push({
            better: better.email,
            settledBets: [],
            currentBets: []
        })

        better.userBets.map((userBet, userBetIndex) => {
            // go through each user's bets and check, whether it has been settled
            let currentBetSettledIndex = betsData.settledBets.findIndex(settledBet => settledBet.betName === userBet.bet);

            // here I divide the user's bets by whether they are settled or not
            if (currentBetSettledIndex !== -1) {
                const currentSettledBetVariation = betsData.settledBets[currentBetSettledIndex].betVariations.find(variation => variation.betVariationName === userBet.betVariation);
                usersToBePaidOut[betterIndex].settledBets.push({
                    betName: betsData.settledBets[currentBetSettledIndex].betName,
                    variationName: currentSettledBetVariation.betVariationName,
                    variationOdds: currentSettledBetVariation.betVariationOdds,
                    userBettedAmount: userBet.betAmount,
                    isCorrect: currentSettledBetVariation.correct
                })
            }
            else {
                usersToBePaidOut[betterIndex].currentBets.push(userBet);
            }
        })
    })

    usersToBePaidOut.map((user, userIndex) => {
        if (user.settledBets.length !== 0) {
            const option = document.createElement("option");
            option.value = userIndex;
            option.text = user.better;
            select.appendChild(option);
        }
    })

    // load the current defaultly selected user
    loadUser();
})();

function loadUser () {
    if (select.value === "") {
        alert("All users have been paid.");
        window.location.href = "bets.html";
    }

    table.style.display = "block";
    tableBody.innerHTML = "";
    let currentUser = usersToBePaidOut[select.value];
    let toBePaid = 0;

    if (currentUser.settledBets.length !== 0) {
        currentUser.settledBets.map((settledBet, settledBetIndex) => {
            if (settledBet.isCorrect) {
                const tableRow = document.createElement("tr");
                tableBody.appendChild(tableRow);
        
                const betNameTd = document.createElement("td");
                betNameTd.innerHTML = settledBet.betName;
                tableRow.appendChild(betNameTd);
        
                const variationNameTd = document.createElement("td");
                variationNameTd.innerHTML = settledBet.variationName;
                tableRow.appendChild(variationNameTd);
        
                const userWinningTd = document.createElement("td");
                userWinningTd.innerHTML = `${settledBet.userBettedAmount * settledBet.variationOdds} Kč`;
                tableRow.appendChild(userWinningTd);
        
                toBePaid += settledBet.userBettedAmount * settledBet.variationOdds;
            }
        })
    }
    else {
        table.style.display = "none";
    }

    toBePaidSpan.innerHTML = `To be paid: ${toBePaid} Kč`;
}

async function userPaidButtonFc () {
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }
    const cleanData = structuredClone(obtainedData.record);

    let newData = structuredClone(cleanData);

    newData.game.betters[select.value].userBets = usersToBePaidOut[select.value].currentBets;

    if (select.children.length === 1) {
        newData.game.betsData.settledBets = [];
    }

    const result = await putDataAPI(newData);
        if (result === null) {
            return; // Handle error case
        }
        alert("User has been marked as paid.");

        window.location.href = "payouts.html"; //redirect
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