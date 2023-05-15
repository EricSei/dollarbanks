import { getAuthUser, getUserByEmail, getFormData, postFormData, destroyUser } from "./utility.js";

let currentUser = await getUserByEmail(getAuthUser("auth"));

async function getTransactions(userId) {
    const response = await fetch(`http://localhost:3000/transactions?userId=${userId}`);
    const transactions = await response.json();
    // console.log(transactions);
    return transactions;
}

async function getRecentTransactions(userId) {
    try {
        const transactions = await getTransactions(userId);
        transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        return transactions.slice(-5);
    } catch (error) {
        console.error(error);
    }
}



function handleSignOut(event) {
    destroyUser(currentUser.email)
    currentUser = null;

}


if (currentUser) {
    let welcome = document.querySelector("#welcome");
    let userId = document.querySelector("#user-id");
    let userName = document.querySelector("#user-name");
    let userEmail = document.querySelector("#user-email");

    welcome.innerText = `Welcome , ${currentUser.name}`;
    userId.innerText = `User Id : ${currentUser.id}`;
    userName.innerText = ` Name : ${currentUser.name}`;
    userEmail.innerText = `Email : ${currentUser.email}`;

    // await getTransactions(currentUser.id);
    let transactions = await getRecentTransactions(currentUser.id);
    // console.log(transactions.length)
    createTransactionTable(transactions);
} else {
    location.replace("http://localhost:5500/client/home/home.html")
}



function createTransactionTable(transactions) {
    var table = document.getElementById("transaction-table");

    const tableData = transactions.length > 0 ? transactions.map(transaction => {
        return (
            `<tr >
                 <td style="border : 1px solid red">${transaction.id}</td>
                 <td style="border : 1px solid red" >${transaction.action}</td>
                 <td style="border : 1px solid red" >${transaction.userId}</td>
                 <td style="border : 1px solid red" >${transaction.receiverId ? transaction.receiverId : "n/a"}</td>
                 <td style="border : 1px solid red" >${transaction.amount}</td>
                 <td style="border : 1px solid red">${transaction.timestamp}</td>
              </tr>`
        );
    }).join('') : `<tr> Transaction is empty. Start sending money. </tr>`;

    const tableBody = document.querySelector("#trst-body");
    tableBody.innerHTML = tableData;
    table.style.border = "2px solid red";

}

let transferForm = document.getElementById("transfer-form");
let signOutBtn = document.getElementById("sign-out-btn");
signOutBtn.addEventListener("click", handleSignOut);


window.onload = function () {
    transferForm.addEventListener("submit", handleTransactionSubmit);
    signOutBtn.addEventListener("click", handleSignOut);
    // trasferDiv.addEventListener("submit", handleTransactionSubmit);
    // alert("hi hi")

}