const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; // Redirect to login if not logged in
}

const userEmail = sessionStorage.getItem("email");
const userEmailSpan = document.getElementById("userEmail");
userEmailSpan.innerHTML = userEmail;
let userIndex;
let totalUserWinnings = 0;
const main = document.querySelector("main");
const totalWinningsSpan = document.getElementById("totalWinnings");

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

    // go through each user's bets and check, whether it has been settled
    betters[userIndex].userBets.map((userBet, userBetIndex) => {
        let currentSettledBetIndex = betsData.settledBets.findIndex(settledBet => settledBet.betName === userBet.bet);
        let currentSettledBetName;
        let currentSettledBetVariationName;
        let currentSettledBetVariationOdds;
        let isCurrentsettledBetVariationCorrect;
        if (currentSettledBetIndex !== -1) {
            currentSettledBetName = betsData.settledBets[currentSettledBetIndex].betName;
            const currentSettledBetVariation = betsData.settledBets[currentSettledBetIndex].betVariations.find(variation => variation.betVariationName === userBet.betVariation);

            currentSettledBetVariationName = currentSettledBetVariation.betVariationName;
            currentSettledBetVariationOdds = currentSettledBetVariation.betVariationOdds;
            isCurrentsettledBetVariationCorrect = currentSettledBetVariation.correct

            const section = document.createElement("section");
            main.appendChild(section);

            const betCont = document.createElement("div");
            betCont.classList.add("betCont");
            section.appendChild(betCont);
            
            const betNameHeading = document.createElement("h2");
            betNameHeading.innerHTML = userBet.bet;
            betCont.appendChild(betNameHeading);

            const betTable = document.createElement("table");
            betCont.appendChild(betTable);

            const betTableHeadings = document.createElement("thead");
            betTable.appendChild(betTableHeadings);

            const betTableHeadingsRow = document.createElement("tr");
            betTableHeadings.appendChild(betTableHeadingsRow);

            const variationNameHeading = document.createElement("td");
            variationNameHeading.innerHTML = "Variation";
            betTableHeadingsRow.appendChild(variationNameHeading);

            const variationOddsHeading = document.createElement("td");
            variationOddsHeading.innerHTML = "Odds";
            betTableHeadingsRow.appendChild(variationOddsHeading);

            const yourBetHeading = document.createElement("td");
            yourBetHeading.innerHTML = "Your bet";
            betTableHeadingsRow.appendChild(yourBetHeading);

            const betTableBody = document.createElement("tbody");
            betTable.appendChild(betTableBody);

            const betTableBodyRow = document.createElement("tr");
            betTableBody.appendChild(betTableBodyRow);

            const variationNameTd = document.createElement("td");
            variationNameTd.innerHTML = userBet.betVariation;
            betTableBodyRow.appendChild(variationNameTd);

            const variationOddsTd = document.createElement("td");
            variationOddsTd.innerHTML = currentSettledBetVariationOdds;
            betTableBodyRow.appendChild(variationOddsTd);

            const yourBetTd = document.createElement("td");
            yourBetTd.innerHTML = `${userBet.betAmount} Kč`;
            betTableBodyRow.appendChild(yourBetTd);

            const winningAmountMessage = document.createElement("span");
            winningAmountMessage.classList.add("winningAmountMessage");
            section.appendChild(winningAmountMessage)

            if (isCurrentsettledBetVariationCorrect) {
                winningAmountMessage.innerHTML = `Winnings: ${currentSettledBetVariationOdds * userBet.betAmount} Kč`;
                section.classList.add("betVariationCorrect");
                betCont.classList.add("betVariationCorrectCont");

                totalUserWinnings += currentSettledBetVariationOdds * userBet.betAmount;
            }
            else {
                winningAmountMessage.innerHTML = "Winnings: 0 Kč";
            }
        }
    })
    totalWinningsSpan.innerHTML = `Total winnings: ${totalUserWinnings} Kč`;
}
)();

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