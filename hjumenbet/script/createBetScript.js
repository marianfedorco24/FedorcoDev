const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

if (sessionStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = '..\\index.html'; // Redirect to login if not logged in
}
// create an object to store the dynamic variation elements
let betVariationsObj = {
    container: [document.getElementById("variationContainer1")],
    variationName: [document.getElementById("variationName1")],
    variationOdds: [document.getElementById("variationOdds1")],
    clearButton: [document.getElementById("clear1")]
}
// asign events to the elements from html
betVariationsObj.variationOdds[0].addEventListener("click", newRow);
betVariationsObj.clearButton[0].addEventListener("click", (e) => {clearInputs(e)});
// define a function that creates new rows, when needed
function newRow() {
    const newElementIndex = betVariationsObj.container.length; // get the index number, for naming the elements
    const parentContainer = document.getElementById("variationsContainer"); // for better readability, get the parent variationsContainer div
    if (betVariationsObj.variationName[newElementIndex - 1].value === "") { // if the row is already created, don't create it again
        return;
    }

    // create a container element and assign it to the betVariationsObj
    betVariationsObj.container.push(document.createElement("div"));
    betVariationsObj.container[newElementIndex].id = `variationContainer${newElementIndex + 1}`;
    parentContainer.appendChild(betVariationsObj.container[newElementIndex]);
    
    // create a variationName input and assign it to the betVariationsObj
    betVariationsObj.variationName.push(document.createElement("input"));
    betVariationsObj.variationName[newElementIndex].type = "text";
    betVariationsObj.variationName[newElementIndex].id = `variationName${newElementIndex + 1}`;
    betVariationsObj.variationName[newElementIndex].placeholder = "Variation name"
    betVariationsObj.container[newElementIndex].appendChild(betVariationsObj.variationName[newElementIndex]);

    // create a variationOdds input and assign it to the betVariationsObj
    betVariationsObj.variationOdds.push(document.createElement("input"));
    betVariationsObj.variationOdds[newElementIndex].type = "number";
    betVariationsObj.variationOdds[newElementIndex].min = "1";
    betVariationsObj.variationOdds[newElementIndex].step = "0.1";
    betVariationsObj.variationOdds[newElementIndex].id = `variationOdds${newElementIndex + 1}`;
    betVariationsObj.variationOdds[newElementIndex].placeholder = "Odds";
    betVariationsObj.container[newElementIndex].appendChild(betVariationsObj.variationOdds[newElementIndex]);

    // create a clear button and assign it to the betVariationsObj
    betVariationsObj.clearButton.push(document.createElement("img"));
    betVariationsObj.clearButton[newElementIndex].id = `clear${newElementIndex + 1}`;
    betVariationsObj.clearButton[newElementIndex].src = "..\\icons\\clear.png";
    betVariationsObj.clearButton[newElementIndex].width = "20";
    betVariationsObj.container[newElementIndex].appendChild(betVariationsObj.clearButton[newElementIndex]);

    //assign the events to the elements
    betVariationsObj.clearButton[newElementIndex].addEventListener("click", (e) => {clearInputs(e)});
    betVariationsObj.variationOdds[newElementIndex].addEventListener("click", newRow);
}

function clearInputs (event) {
    const index = event.target.id.slice(-1) - 1;
    betVariationsObj.variationName[index].value = "";
    betVariationsObj.variationOdds[index].value = "";
}

const betName = document.getElementById("betName");

const submitButton = document.getElementById("submit");

function submitFc () {
    if (betName.value.trim() === "") {
        alert("Bet name is not set!");
        console.log("Bet name was not set.");
        return;
    }

    else if ((() => { // if all the row variations are empty, don't submit
        let isEmpty = true;
        console.log(betVariationsObj);
        betVariationsObj.container.map((container, containerIndex) => {
            if ( !((betVariationsObj.variationName[containerIndex].value.trim() === "")   |   (betVariationsObj.variationOdds[containerIndex].value.trim() === "")) ) {
                isEmpty = false;
            }
        });
        return isEmpty;
    })()) {
        alert("None of the variation rows are complete, therefore the bet was not submitted!");
        console.log("Submit function not ran, no variation rows were complete.");
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
            betName: betName.value.trim(),
            betVariationsAll: {
                betVariations: []
            }
        }
        
        betVariationsObj.container.map(function (el, index) { // start building the newData object, iterate for the number of elements
            if ((betVariationsObj.variationName[index].value.trim() === "") | (betVariationsObj.variationOdds[index].value.trim() === "")) { // if the row variation row is empty, skip it
                return;
            }

            // construct the bet data
            betToAdd.betVariationsAll.betVariations.push({
                betVariationName: betVariationsObj.variationName[index].value.trim(),
                betVariationOdds: Number(betVariationsObj.variationOdds[index].value.trim()),
                userBet: 0
            })
        })
        newData.game.betsData.bets.push(betToAdd); // add the new bet to the whole data set

        const result = await putDataAPI(newData);
        if (result === null) {
            return; // Handle error case
        }
        console.log("Updated data:", result);
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
        console.log("PUT request successful:", data);
        return data;
    }
    catch (error) {
        console.error("Error occurred in getDataAPI function:", error.message); // Log error.message!
        alert("An error occurred fetching data from the API: " + error.message); // Alert error.message!
        return null; 
    }
}
