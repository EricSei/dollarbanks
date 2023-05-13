import { setUser, getUser, destroyUser, getUserByEmail, setAuthUser } from "./utility.js";




async function handleSignInForm(event) {

    event.preventDefault();

    const form = event.currentTarget;
    let url = form.action; // URL from form

    try {
        const formData = new FormData(form);

        const formObject = Object.fromEntries(formData.entries());

        // db user and validate password
        const storedUser = await getUserByEmail(formObject.email);

        //password validation
        if (formObject.email != storedUser.email && formObject.password != storedUser.password) {
            console.error("User is not found or Wrong Password.")
            return { "Error": "User is not found or Wrong Password." };
        }


        // const responseData = await getFormData(url, formObject);

        /**
         * Normally you'd want to do something with the response data,
         * but for this example we'll just log it to the console.
         */
        console.log(storedUser);
        let authUser = { ...storedUser };
        if (authUser) {
            // alert(`Hi You are signed in. ${JSON.stringify(authUser)}`);
            document.getElementById("sign-in-container").style.display = "none";
            setAuthUser(authUser.email);
            setUser(authUser.email, authUser);
            location.replace("http://localhost:5500/client/user/user.html")
        }
    } catch (error) {
        console.error(error);
    }
}

const signInForm = document.getElementById("signin-form");

window.onload = function () {
    signInForm.addEventListener("submit", handleSignInForm);
}
