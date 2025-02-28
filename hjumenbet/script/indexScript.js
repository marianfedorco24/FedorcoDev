const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

function logIn(event) {
    event.preventDefault(); // Prevent form submission
    //get the user's input
    const email = document.getElementById("emailEnt").value.trim();
    const pass = document.getElementById("passEnt").value.trim();

    if (email === "" | pass === "") {
        alert("Enter your full login information.");
        console.log("User didn't input all the necessary login information.");
        return;
    }

    (async () => {
        const obtainedData = await getDataAPI(); // Wait for the data to be fetched
        if (obtainedData === null) {
            return; // Or handle the error appropriately.  The user has already been alerted.
        }

        let isLoginValid = false;
        // Loop through logins and check for valid credentials
        console.log(obtainedData)
        for (let user of obtainedData.record.logins) {
            if (email === user[0] && pass === user[1]) {
                console.log("Correct credentials.");
                isLoginValid = true;

                sessionStorage.setItem("isLoggedIn", "true"); //save the fact that the user is logged in
                sessionStorage.setItem("email", email);
                window.location.href = "..\\bets.html"; //redirect

                break; // Exit loop once credentials are found
            }
        }

        // If no valid login was found, alert for invalid credentials
        if (!isLoginValid) {
            alert("Invalid credentials");
            console.log("Invalid credentials.");
        }

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
