//User Functions
export function setAuthUser(email) {
    localStorage.setItem("auth", email);
}

export function getAuthUser(auth = "auth") {
    return localStorage.getItem("auth");
}

export function setUser(userEmail, userData) {
    let userDataString = JSON.stringify(userData);
    localStorage.setItem(userEmail, userDataString);
}

export async function getUserByEmail(email) {
    const response = await fetch(`http://localhost:3000/users?email=${email}`);
    const jsonData = await response.json();
    // console.log(jsonData[0]);
    return jsonData[0];
}

//get user in Object
export function getUser(userEmail) {
    let userData = localStorage.getItem(userEmail);
    return userData ? JSON.parse(userData) : null;
}

export function destroyUser(userEmail) {
    console.log(userEmail + " will be removed");
    localStorage.removeItem(userEmail);
    localStorage.removeItem("auth");
    location.replace("http://localhost:5500/client/home/home.html")

}

/**
 * Helper function for Geting data as JSON with fetch.
 *
 * @param {Object} options
 * @param {string} options.url - URL to POST data to
 * @param {FormData} options.formData - `FormData` instance
 * @return {Object} - Response body from URL that was POSTed to
 */
export async function getFormData(url) {

    const fetchOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.json();
}

/**
 * Helper function for POSTing data as JSON with fetch.
 *
 * @param {Object} options
 * @param {string} options.url - URL to POST data to
 * @param {FormData} options.formData - `FormData` instance
 * @return {Object} - Response body from URL that was POSTed to
 */
export async function postFormData(url, formData) {

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

export async function updateFormData(url, formData) {

    const formDataJsonString = JSON.stringify(formData); //Stringtify Object

    const fetchOptions = {
        method: "PATCH",
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

//User Accounts
export async function getAccountsByUserId(userId) {
    let accounts = await getFormData(`http://localhost:3000/accounts?userId=${userId}`)

    return accounts;
}

export async function getAccount(accountId) {
    let account = await getFormData(`http://localhost:3000/accounts/${accountId}`)
    console.log(account)
    return account;
}

export function createAcountsTable(accounts) {

    var table = document.getElementById("accounts-table");

    const tableData = accounts && accounts.length > 0 ? accounts.map(account => {
        return (
            `<tr >
                 <td style="border : 1px solid red">${account.id}</td>
                 <td style="border : 1px solid red" >${account.type}</td>
                 <td style="border : 1px solid red" >${account.balance}</td>
                
              </tr>`
        );
    }).join('') : `<tr> Acount is empty. Create Account </tr>`;

    const tableBody = document.querySelector("#trst-body");
    tableBody.innerHTML = tableData;
    table.style.border = "2px solid red";

}