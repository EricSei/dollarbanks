
async function getUser(id) {
    const response = await fetch(`http://localhost:3000/users/${id}`);
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
}



async function renderUser() {
    let user = getUser();
    const list = document.querySelector('.js-todo-list');
    const item = document.querySelector(`[data-key='${user.id}']`);
    const node = document.createElement("li"); // a user
    node.innerHTML = `
    <label for="${user.id}" class="tick js-tick"></label>
    <span>${user.email}</span>`

    list.append(node);
}

// renderUser()

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

//   postData("https://example.com/answer", { answer: 42 }).then((data) => {
//     console.log(data); // JSON data parsed by `data.json()` call
//   });

async function createUser() {
    let user = await getUser(2);
    var li = document.createElement("li");
    var inputValue = `${user.id} ${user.email} ${user.name}`;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    document.getElementById("myUL").appendChild(li);
}


async function newElement() {
    var li = document.createElement("li");
    var inputValue = document.getElementById("myInput").value;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);

    let user = await getUser();
    var li = document.createElement("li");
    var inputValue = user.email;
    var t = document.createTextNode(inputValue);
    li.appendChild(t);

    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("myUL").appendChild(li);
    }
    document.getElementById("myInput").value = "";

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            div.style.display = "none";
        }
    }
}



/**
 * Event handler for a form submit event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
 * 
 * @param {SubmitEvent} event
 */
async function handleFormSubmit(event) {
    /**
     * This prevents the default behaviour of the browser submitting
     * the form so that we can handle things instead.
     */
    event.preventDefault();

    /**
     * This gets the element which the event handler was attached to.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget
     */
    const form = event.currentTarget;

    /**
     * This takes the API URL from the form's `action` attribute.
     */
    const url = form.action;

    try {
        /**
         * This takes all the fields in the form and makes their values
         * available through a `FormData` instance.
         * 
         * @see https://developer.mozilla.org/en-US/docs/Web/API/FormData
         */
        const formData = new FormData(form);
        console.log(formData)
        /**
         * We'll define the `postFormDataAsJson()` function in the next step.
         */
        const responseData = await postFormDataAsJson({ url, formData });

        /**
         * Normally you'd want to do something with the response data,
         * but for this example we'll just log it to the console.
         */
        console.log({ responseData });

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
async function postFormDataAsJson({ url, formData }) {
    /**
     * We can't pass the `FormData` instance directly to `fetch`
     * as that will cause it to automatically format the request
     * body as "multipart" and set the `Content-Type` request header
     * to `multipart/form-data`. We want to send the request body
     * as JSON, so we're converting it to a plain object and then
     * into a JSON string.
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
     */
    const plainFormData = Object.fromEntries(formData.entries());
    const formDataJsonString = JSON.stringify(plainFormData);

    const fetchOptions = {
        /**
         * The default method for a request with fetch is GET,
         * so we must tell it to use the POST HTTP method.
         */
        method: "POST",
        /**
         * These headers will be added to the request and tell
         * the API that the request body is JSON and that we can
         * accept JSON responses.
         */
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        /**
         * The body of our POST request is the JSON string that
         * we created above.
         */
        body: formDataJsonString,
    };

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.json();
}

const exampleForm = document.getElementById("example-form");
console.log(exampleForm)
/**
 * We'll define the `handleFormSubmit()` event handler function in the next step.
 */


window.onload = function () {
    // -- put your code here
    exampleForm.addEventListener("submit", handleFormSubmit);
}