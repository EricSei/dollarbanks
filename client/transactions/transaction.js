import {
    getAuthUser,
    getUserByEmail,
    getFormData,
    postFormData,
    updateFormData,
    getAccountsByUserId,
    getAccount,
    createAcountsTable,
} from "../user/utility.js";

let currentUser = await getUserByEmail(getAuthUser("auth"));
console.log(currentUser)

/**
 * Event handler for a form submit event.
 * @param {SubmitEvent} event
 */
async function handleAccountForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let url = form.action; // URL from form
    url = `http://localhost:3000/accounts`;
    // {
    //     "id": 1,
    //     "userId": 1,
    //     "type": "checking",
    //     "balance": 6028
    //   },
    try {
        let formData = new FormData(form);
        let formObject = Object.fromEntries(formData.entries());
        let formBody = {
            "userId": currentUser.id,
            "type": formObject.type,
            "balance": 1000
        }
        //validation
        const responseData = await postFormData(url, formBody);
        console.log(responseData);

    } catch (error) {
        console.error(error);
    }
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

if (currentUser) {
    let accounts = await getAccountsByUserId(currentUser.id)
    if (accounts.length) {
        createAcountsTable(accounts)
    }
}

let transferForm = document.getElementById("transfer-form");
console.log(transferForm)
transferForm.addEventListener("submit", handleTransactionSubmit);

let accountForm = document.getElementById("account-form");
console.log(accountForm)
accountForm.addEventListener("submit", handleAccountForm);

// window.onload = function () {
//     transferForm.addEventListener("submit", handleTransactionSubmit);
//     // trasferDiv.addEventListener("submit", handleTransactionSubmit);
//     // alert("hi hi")

// }