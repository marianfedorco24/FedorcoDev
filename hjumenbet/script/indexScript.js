const urlAPI = "https://api.jsonbin.io/v3/b/67b627cbacd3cb34a8e889c7";
const keyAPI = "$2a$10$Xt2Y7JEnOA.yvHPb5DD7UO3oSH9UKc5yG/dTYC0.cDYl8EZeLmTnS";

async function logIn(event) {
    event.preventDefault(); // Prevent form submission
    //get the user's input
    const email = document.getElementById("emailEnt").value.trim();
    let pass = document.getElementById("passEnt").value.trim();

    if (email === "" | pass === "") {
        alert("Enter your full login information.");
        return;
    }

    pass = await hashPassword(pass);

    (async () => {
        const obtainedData = await getDataAPI(); // Wait for the data to be fetched
        if (obtainedData === null) {
            return; // Or handle the error appropriately.  The user has already been alerted.
        }

        let isLoginValid = false;
        // Loop through logins and check for valid credentials
        for (let user of obtainedData.record.users) {
            if (email === user.email && pass === user.password) {
                isLoginValid = true;

                sessionStorage.setItem("isLoggedIn", "true"); //save the fact that the user is logged in
                sessionStorage.setItem("email", email);
                window.location.href = "bets.html"; //redirect

                break; // Exit loop once credentials are found
            }
        }

        // If no valid login was found, alert for invalid credentials
        if (!isLoginValid) {
            alert("Invalid credentials");
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

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}
