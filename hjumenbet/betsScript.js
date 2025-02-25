const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html'; // Redirect to login if not logged in
}

let betsReferenceList;

(async () => {
    const obtainedData = await getDataAPI(); // Wait for the data to be fetched
    if (obtainedData === null) {
        return; // Or handle the error appropriately.  The user has already been alerted.
        }
    const betsData = structuredClone(obtainedData.record.game.betsData);
    const betters = structuredClone(obtainedData.record.game.betters);
    betsReferenceList = structuredClone(betsData);


    betsReferenceList.container = document.getElementById("betsCont");
    betsData.bets.map(
        function (bet, index) {
            // red
            //            betContainer        
            betsReferenceList.bets[index].container = document.createElement("div");
            //    containerParent                                betContainer
            betsReferenceList.container.appendChild(betsReferenceList.bets[index].container);

            // green
            //             betName
            betsReferenceList.bets[index].betName = document.createElement("h2");
            //             betName
            betsReferenceList.bets[index].betName.innerHTML = betsData.bets[index].betName;
            betsReferenceList.bets[index].betName.style = "display: inline;";
            //           betContainer                                           betName
            betsReferenceList.bets[index].container.appendChild(betsReferenceList.bets[index].betName);

            // edit button
            betsReferenceList.bets[index].editButton = document.createElement("img")
            betsReferenceList.bets[index].editButton.src = "edit_button.png";
            betsReferenceList.bets[index].editButton.width = "15";
            betsReferenceList.bets[index].editButton.id = `editButton${index}`;
            betsReferenceList.bets[index].container.appendChild(betsReferenceList.bets[index].editButton);
            betsReferenceList.bets[index].editButton.addEventListener("click", (e) => {edit(e)});

            // yellow                                  
            //               betVariationsContainer
            betsReferenceList.bets[index].betVariationsAll.container = document.createElement("div");
            //            betContainer                                             betVariationsContainer
            betsReferenceList.bets[index].container.appendChild(betsReferenceList.bets[index].betVariationsAll.container);


            // purples
            //                      betVariations
            betsReferenceList.bets[index].betVariationsAll.betVariations.map(
                function (betVariation, indexBetVariations) {
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container = document.createElement("div");
                    //              betVariationsContainer                                                                betVariationContainer
                    betsReferenceList.bets[index].betVariationsAll.container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container);


                    // name
                    //                                    betVariationName
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName = document.createElement("span");
                    //                                    betVariationName
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName.innerHTML = betsData.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName;
                    //                                  betVariationContainer
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName);


                    // odds
                    //                                      betVariationOdds
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds = document.createElement("span");
                    //                                      betVariationOdds
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds.innerHTML = betsData.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds;
                    //                                  betVariationContainer
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds);


                    // amount
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet = document.createElement("input");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.type = "number";
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.min = "0";
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.step = "10"
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.value = 0
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet);

                    // check whether the user betted at all
                    let isUserBet = [false, null]; // did he bet?, if yes, on which index?
                    betters.map(
                        function (better, betterIndex) {
                            if (sessionStorage.getItem("email") === better.email) {
                                isUserBet = [true, betterIndex];
                            }
                        }
                    )


                    if (isUserBet[0]) { //if the user has some bets:
                        betters[isUserBet[1]].userBets.map(function (variation, variationIndex) { // go through the bets
                            if ((variation.bet === betsData.bets[index].betName) && (variation.betVariation === betsData.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName)) { // if it matches the current element that is being created:
                                betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.value = variation.betAmount; // assign the bet value
                            }
                        })
                    }
                }
            )
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
    const email = sessionStorage.getItem("email");

    const thisUserBetIndex = betters.findIndex(better => better.email === email);

    let newUserBets = [];

    betsReferenceList.bets.map((bet, betIndex) => {
        bet.betVariationsAll.betVariations.map((variation, variationIndex) => {
            newUserBets.push({
                bet: bet.betName.innerHTML,
                betVariation: variation.betVariationName.innerHTML,
                betAmount: variation.userBet.value
            })
        })
    })

    newUserBets = newUserBets.filter(element => element.betAmount !== "0")

    let newData = structuredClone(cleanData);
    newData.game.betters[thisUserBetIndex].userBets = newUserBets;
    console.log(newData);

    (async () => {
        const result = await putDataAPI(newData);
        if (result === null) {
            return; // Handle error case
        }
        console.log("Updated data:", result);
        alert("Data updated successfully!");

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
        console.log("PUT request successful:", data);
        return data;
    }
    catch (error) {
        console.error("Error occurred in getDataAPI function:", error.message); // Log error.message!
        alert("An error occurred fetching data from the API: " + error.message); // Alert error.message!
        return null; 
    }
}

function edit (event) {
    let index = event.target.id.slice(-1);
    sessionStorage.setItem("betIndex", index);
    window.location.href = "editBet.html";
}
