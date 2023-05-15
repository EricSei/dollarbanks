

// userData : { }
// function setUser(userEmail, userData) {
//     let userDataString = JSON.stringify(userData);
//     localStorage.setItem(userEmail, userData);
// }

// //get user in Object
// function getUser(userEmail) {
//     let userData = localStorage.getItem(userEmail);
//     return JSON.parse(userData);
// }

// function destroyUser(userEmail) {
//     localStorage.removeItem(userEmail);
//     console.log("userEmail is removed");
// }

/**
 * Event handler for a form submit event.
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const url = form.action; // URL from form

    try {
        const formData = new FormData(form);

        const formObject = Object.fromEntries(formData.entries());

        //password validation
        if (formObject.password != formObject.confirm_password) {
            console.error("Password and Confirmed Password need to be equal.")
            return { "Error": "Password and Confirmed Password need to be equal." };
        }
        delete formObject.confirm_password

        const responseData = await postFormData(url, formObject);

        /**
         * Normally you'd want to do something with the response data,
         * but for this example we'll just log it to the console.
         */
        console.log({ responseData });
        user = responseData;
        location.replace("http://localhost:5500/client/user/signIn.html")
    } catch (error) {
        console.error(error);
    }
}

/**
 * Helper function for POSTing data as JSON with fetch.
 *
 * @param {Object} options
 * @param {string} options.url - URL to POST data to
 * @param {FormData} options.formData - `FormData` instance
 * @return {Object} - Response body from URL that was POSTed to
 */
async function postFormData(url, formData) {

    const formDataJsonString = JSON.stringify(formData); //Stringtify Object

    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: formDataJsonString,
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.json();
}

async function getUserByEmail(email) {
    const response = await fetch(`http://localhost:3000/users?email=${email}`);
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData[0];
}

// async function handleSignInForm(event) {

//     event.preventDefault();

//     const form = event.currentTarget;
//     let url = form.action; // URL from form

//     try {
//         const formData = new FormData(form);

//         const formObject = Object.fromEntries(formData.entries());

//         // db user and validate password
//         const storedUser = await getUserByEmail(formObject.email);

//         //password validation
//         if (formObject.email != storedUser.email && formObject.password != storedUser.password) {
//             console.error("User is not found or Wrong Password.")
//             return { "Error": "User is not found or Wrong Password." };
//         }


//         // const responseData = await postFormData(url, formObject);

//         /**
//          * Normally you'd want to do something with the response data,
//          * but for this example we'll just log it to the console.
//          */
//         console.log(storedUser);
//         authUser = { ...storedUser };
//         if (authUser) {
//             // alert(`Hi You are signed in. ${JSON.stringify(authUser)}`);
//             document.getElementById("sign-in-container").style.display = "none";
//             setUser(authUser.email, authUser)
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

const singUpForm = document.getElementById("user-form");


window.onload = function () {
    // -- put your code here
    singUpForm.addEventListener("submit", handleFormSubmit);

}
