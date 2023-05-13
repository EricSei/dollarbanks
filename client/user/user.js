import { getAuthUser, getUserByEmail } from "./utility.js";

let currentUser = await getUserByEmail(getAuthUser("auth"));

async function getTransactions(userId) {
    const response = await fetch(`http://localhost:3000/transactions?userId=${userId}`);
    const transactions = await response.json();
    console.log(transactions);
    return transactions;
}

async function getRecentTransactions(userId) {
    try {
        const transactions = await getTransactions(userId);
        transactions.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        return transactions.slice(0, 4);
    } catch (error) {
        console.error(error);
    }

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
    console.log(transactions.length)
    createTransactionTable(transactions);
}

function createTransactionTable(transactions) {
    var table = document.getElementById("transaction-table");

    var transactionNumber = document.getElementById("transaction-head-number");
    var action = document.getElementById("transaction-head-action");
    var senderId = document.getElementById("transaction-head-senderId");
    var receiverId = document.getElementById("transaction-head-receiverId");
    var amount = document.getElementById("transaction-head-receiverAmount");
    var receivedDate = document.getElementById("transaction-head-receivedDate");

    const tableData = transactions.map(transaction => {
        return (
            `<tr>
                 <td>${transaction.id}</td>
                 <td>${transaction.action}</td>
                 <td>${transaction.userId}</td>
                 <td>${transaction.receiverId ? transaction.receiverId : "n/a"}</td>
                 <td>${transaction.amount}</td>
                 <td>${transaction.timestamp}</td>
              </tr>`
        );
    }).join('');
    const tableBody = document.querySelector("#trst-body");
    tableBody.innerHTML = tableData;

}

window.onload = function () {
    // -- put your code here
    // singUpForm.addEventListener("submit", handleFormSubmit);
}


