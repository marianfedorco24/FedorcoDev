const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

async function register(event) {
    event.preventDefault(); // Prevent form submission
    //get the user's input
    const email = document.getElementById("emailEnt").value.trim();
    let pass = document.getElementById("passEnt").value.trim();
    const passConfirm = document.getElementById("passEntConfirm").value.trim();
    
    if (email === "" | pass === "") {
        alert("Enter your full login information.");
        return;
    }

    if (pass !== passConfirm) {
        alert("Passwords don't match!");
        return;
    }
    
    pass = await hashPassword(pass);

    (async () => {
        const obtainedData = await getDataAPI(); // Wait for the data to be fetched
        if (obtainedData === null) {
            return; // Or handle the error appropriately.  The user has already been alerted.
        }

        let isUserPresent = false;
        // Loop through logins and check for valid credentials
        for (let user of obtainedData.record.users) {
            if (email === user.email) {
                alert("You have already been registered.");
                isUserPresent = true;
                break; // Exit loop once credentials are found
            }
        }

        // If no valid login was found, create account
        if (!isUserPresent) {
            (async () => {
                const dataToSend = obtainedData.record;
                dataToSend.users.push({
                    email: email,
                    password: pass,
                    role: "user"
                });
                dataToSend.game.betters.push({
                    email: email,
                    userBets: [],
                    winnings: 0
                })
                const result = await putDataAPI(dataToSend);
                if (result === null) {
                    return; // Handle error case
                }
                alert("Data updated successfully!");

                sessionStorage.setItem("isLoggedIn", "true"); //save the fact that the user is logged in
                sessionStorage.setItem("email", email);
                window.location.href = "bets.html"; //redirect
            })();
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

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}
