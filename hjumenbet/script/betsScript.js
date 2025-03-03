const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '..\\index.html'; // Redirect to login if not logged in
}

const userEmail = sessionStorage.getItem("email");

const userEmailSpan = document.getElementById("userEmail");
userEmailSpan.innerHTML = userEmail;

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
            betsReferenceList.bets[index].container = document.createElement("section");
            betsReferenceList.bets[index].container.id = `betCont${index + 1}`;
            betsReferenceList.bets[index].container.classList.add("betCont");
            //    containerParent                                betContainer
            betsReferenceList.container.appendChild(betsReferenceList.bets[index].container);

            // green
            //container
            betsReferenceList.bets[index].betNameCont = document.createElement("div");
            betsReferenceList.bets[index].betNameCont.id = `betNameCont${index + 1}`;
            betsReferenceList.bets[index].betNameCont.classList.add("betNameCont");
            betsReferenceList.bets[index].container.appendChild(betsReferenceList.bets[index].betNameCont);

            //             betName
            betsReferenceList.bets[index].betName = document.createElement("h2");
            //             betName
            betsReferenceList.bets[index].betName.innerHTML = betsData.bets[index].betName;
            betsReferenceList.bets[index].betName.style = "display: inline;";
            betsReferenceList.bets[index].betName.id = `betName${index + 1}`;
            betsReferenceList.bets[index].betName.classList.add("betName", "betElements");
            //           betContainer                                           betName
            betsReferenceList.bets[index].betNameCont.appendChild(betsReferenceList.bets[index].betName);

            // edit button
            betsReferenceList.bets[index].editButton = document.createElement("button");
            betsReferenceList.bets[index].editButton.id = `editButton${index + 1}`;
            betsReferenceList.bets[index].editButton.classList.add("editButton", "betElements");
            betsReferenceList.bets[index].betNameCont.appendChild(betsReferenceList.bets[index].editButton);
            betsReferenceList.bets[index].editButton.addEventListener("click", (e) => {edit(e)});

            betsReferenceList.bets[index].editButtonIcon = document.createElement("img");
            betsReferenceList.bets[index].editButtonIcon.src = "..\\icons\\edit.png";
            betsReferenceList.bets[index].editButtonIcon.classList.add("editButtonIcon");
            betsReferenceList.bets[index].editButton.appendChild(betsReferenceList.bets[index].editButtonIcon);
            

            // yellow                                  
            //               betVariationsContainer
            betsReferenceList.bets[index].betVariationsAll.container = document.createElement("div");
            betsReferenceList.bets[index].betVariationsAll.container.id = `variationsCont${index + 1}`;
            betsReferenceList.bets[index].betVariationsAll.container.classList.add("variationsCont", "betElements");
            //            betContainer                                             betVariationsContainer
            betsReferenceList.bets[index].container.appendChild(betsReferenceList.bets[index].betVariationsAll.container);


            // purples
            //                      betVariations
            betsReferenceList.bets[index].betVariationsAll.betVariations.map(
                function (betVariation, indexBetVariations) {
                    // variation container
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container = document.createElement("div");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container.id = `variationCont${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container.classList.add("variationCont");
                    //              betVariationsContainer                                                                betVariationContainer
                    betsReferenceList.bets[index].betVariationsAll.container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container);


                    // name
                    //                                    betVariationName
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName = document.createElement("span");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName.innerHTML = betsData.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName.id = `variationName${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName.classList.add("variationName", "variationElements");
                    //                                  betVariationContainer
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationName);


                    // odds
                    //                                      betVariationOdds
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds = document.createElement("span");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds.innerHTML = betsData.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds.id = `variationOdds${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds.classList.add("variationOdds", "variationElements");
                    //                                  betVariationContainer
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].betVariationOdds);


                    // amount
                    //   container
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet = {};

                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.container = document.createElement("div");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.container.classList.add("variationElements", "userBetCont");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.container);

                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.input = document.createElement("input");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.input.min = "0";
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.input.step = "10"
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.input.value = 0
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.input.id = `userBet${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.input.classList.add("userBet", "variationElements");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.input);

                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.currencyLabel = document.createElement("span");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.currencyLabel.innerHTML = "Kč";
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.currencyLabel);

                    // add / subtract buttons
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons = {};
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.container = document.createElement("div");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.container.id = `addSubtractCont${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.container.classList.add("addSubtractCont", "variationElements");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].userBet.container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.container);

                    //subtract
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton = {};
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.button = document.createElement("button");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.button.id = `subtractButtonButton${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.button.classList.add("subtractButtonButton");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.button.addEventListener("click", (e) => {userBetSubtract(e)});
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.button);

                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.icon = document.createElement("img");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.icon.src = "..\\icons\\subtract.png";
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.icon.width = "20";
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.icon.id = `subtractButtonIcon${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.icon.classList.add("subtractButtonIcon");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.button.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.subtractButton.icon);

                    //add
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton = {};
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.button = document.createElement("button");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.button.id = `addButtonButton${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.button.classList.add("addButtonButton");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.button.addEventListener("click", (e) => {userBetAdd(e)});
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.container.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.button);

                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.icon = document.createElement("img");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.icon.src = "..\\icons\\add.png";
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.icon.width = "20";
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.icon.id = `addButtonIcon${index + 1}_${indexBetVariations + 1}`;
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.icon.classList.add("addButtonIcon");
                    betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.button.appendChild(betsReferenceList.bets[index].betVariationsAll.betVariations[indexBetVariations].addSubtractButtons.addButton.icon);
                    
                    // check whether the user betted at all
                    let isUserBet = [false, null]; // did he bet?, if yes, on which index?
                    betters.map(
                        function (better, betterIndex) {
                            if (userEmail === better.email) {
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

    const thisUserBetIndex = betters.findIndex(better => better.email === userEmail);

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

        window.location.href = "..\\bets.html"; //redirect
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
    const editIndex = event.target.id.slice(-1);
    sessionStorage.setItem("betIndex", editIndex - 1);
    window.location.href = "..\\editBet.html";
}

function userBetAdd (event) {
    const betIndex = event.target.id.at(-3) - 1;
    const variationIndex = event.target.id.at(-1) - 1;
    const userBetNumber = Number(betsReferenceList.bets[betIndex].betVariationsAll.betVariations[variationIndex].userBet.input.value);
    betsReferenceList.bets[betIndex].betVariationsAll.betVariations[variationIndex].userBet.input.value = userBetNumber + 10;
}

function userBetSubtract (event) {
    const betIndex = event.target.id.at(-3) - 1;
    const variationIndex = event.target.id.at(-1) - 1;
    const userBetNumber = Number(betsReferenceList.bets[betIndex].betVariationsAll.betVariations[variationIndex].userBet.input.value);
    if (!(userBetNumber <= 0)) {
        betsReferenceList.bets[betIndex].betVariationsAll.betVariations[variationIndex].userBet.input.value = userBetNumber - 10;
    }
}
