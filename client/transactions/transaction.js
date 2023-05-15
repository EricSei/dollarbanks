import { getAuthUser, getUserByEmail, getFormData, postFormData, updateFormData } from "../user/utility.js";

let currentUser = await getUserByEmail(getAuthUser("auth"));
console.log(currentUser)

async function getAccountsByUserId(userId) {
    let accounts = await getFormData(`http://localhost:3000/accounts?userId=${userId}`)

    return accounts;
}

async function getAccount(accountId) {
    let account = await getFormData(`http://localhost:3000/accounts/${accountId}`)
    console.log(account)
    return account;
}



if (currentUser) {
    let accounts = await getAccountsByUserId(currentUser.id)
    if (accounts.length) {
        createAcountsTable(accounts)
    }

}

function createAcountsTable(accounts) {

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

async function handleTransactionSubmit(event) {
    console.log("transaction form is triggered")
    event.preventDefault();
    const form = event.currentTarget;
    let url = form.action; // URL from form
    let formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    formObject["userId"] = currentUser.id;
    formObject["timestamp"] = new Date().toJSON();
    console.log("form obj " + formObject)
    let expression = formObject.action;

    let currentUserAccount = await getAccount(formObject.userAccountId)
    // let getUpdatingAccountList = currentUserAccounts.filter(account => account.id == formData.userAccountId)
    // let updatingAccount = getUpdatingAccountList[0];
    let transactionObj = null;
    try {


        switch (expression) {

            case 'transfer': {
                //udpate user and receiver accounts's balance
                let userAccountId = formObject.userAccountId;
                let userAccountURL = `http://localhost:3000/accounts/${userAccountId}`
                let userAccountUpdateBody = {
                    balance: Number(currentUserAccount.balance) - Number(formObject.amount)
                }
                await updateFormData(userAccountURL, userAccountUpdateBody)

                let receiverAccountId = formObject.receiverAccountId;
                let receiverAccount = await getAccount(receiverAccountId)
                // let receiverAccList = receiverAccounts.filter(account => account.id == receiverAccountId)
                // let receiverUpdatingAccount = receiverAccList[0];
                let receiverAccountUpdateBody = {
                    balance: Number(receiverAccount.balance) + Number(formObject.amount)
                }

                let receiverAccountURL = `http://localhost:3000/accounts/${receiverAccountId}`
                await updateFormData(receiverAccountURL, receiverAccountUpdateBody)
                transactionObj = {
                    // "id": 1,
                    "action": formObject.action,
                    "userId": currentUser.id,
                    "userAccountId": formObject.userAccountId,
                    "receiverId": formObject.receiverId,
                    "receiverAccountId": formObject.receiverAccountId,
                    "amount": Number(formObject.amount),
                    "timestamp": new Date().toJSON()
                }

            }
                break
            case 'deposit': {
                let userAccountId = formObject.userAccountId;
                let userAccountURL = `http://localhost:3000/accounts/${userAccountId}`
                let userAccountUpdateBody = {
                    balance: Number(currentUserAccount.balance) + Number(formObject.amount)
                }
                await updateFormData(userAccountURL, userAccountUpdateBody)

                transactionObj = {
                    // "id": 1,
                    "action": formObject.action,
                    "userId": currentUser.id,
                    "userAccountId": formObject.userAccountId,
                    "receiverId": 0,
                    "receiverAccountId": 0,
                    "amount": Number(formObject.amount),
                    "timestamp": new Date().toJSON()
                }
            }
                break
            case 'withdraw': {

                let userAccountId = formObject.userAccountId;
                let userAccountURL = `http://localhost:3000/accounts/${userAccountId}`
                let userAccountUpdateBody = {
                    balance: Number(currentUserAccount.balance) - Number(formObject.amount)
                }
                await updateFormData(userAccountURL, userAccountUpdateBody)

                transactionObj = {
                    // "id": 1,
                    "action": formObject.action,
                    "userId": currentUser.id,
                    "userAccountId": formObject.userAccountId,
                    "receiverId": 0,
                    "receiverAccountId": 0,
                    "amount": Number(formObject.amount),
                    "timestamp": new Date().toJSON()
                }

            }
                break
            default: {
                console.error("Invalid Case");
                return;
            }
        }
        //transaction happen for all cases
        url = `http://localhost:3000/transactions`;

        const responseData = await postFormData(url, transactionObj);

        console.log("Added Transaction", responseData);
        // location.replace("http://localhost:5500/client/user/user.html")


    } catch (error) {
        console.error(error);
    }
}

let transferForm = document.getElementById("transfer-form");
console.log(transferForm)
transferForm.addEventListener("submit", handleTransactionSubmit);

// window.onload = function () {
//     transferForm.addEventListener("submit", handleTransactionSubmit);
//     // trasferDiv.addEventListener("submit", handleTransactionSubmit);
//     // alert("hi hi")

// }