var errors = {
        name: {
            emptyError: "you did not repeat the password",
            lengthError: "name must be at least 3 characters",
            symbolError: "the name must not contain spaces"
        },
        email: {
            emptyError: "you have not entered email",
            lengthError: "email must be at least 6 characters",
            symbolError: "you entered an incorrect email",
        },
        password: {
            emptyError: "you did not enter a password",
            lengthError: "the password must be at least 6 characters long",
        },
        repeatPassword: {
            emptyError: "you did not repeat the password",
            matchError: "passwords do not match"
        }
    };

    var rUsername = $("#username");
    var rEmail = $("#email");
    var rPassword = $("#password");
    var rRepeatPassword = $("#repeatPassword");

    var btn = document.querySelector("#p_btn");
    btn.disabled = true;
    // var btn = require("main");
    // btn.disabled = true;
    var regexW = new RegExp("^[a-zA-Z0-9_.@\s]+$");

    $(document).ready(function () {
        keyPress(rUsername,isValidName);
        keyPress(rEmail,isValidEmail);
        keyPress(rPassword,isValidPassword);
        keyPress(rRepeatPassword,isValidaRepeatPassword);
    });

    // function validateForm() {
    //     if (isValidEl(rUsername,isValidName) || isValidEl(rEmail,isValidEmail) ||
    //         isValidEl(rPassword,isValidPassword) || isValidEl(rRepeatPassword,isValidaRepeatPassword)) {
    //         btn.disabled = true;
    //     } else if(!isValidEl(rUsername,isValidName) && !isValidEl(rEmail,isValidEmail) &&
    //         !isValidEl(rPassword,isValidPassword) && !isValidEl(rRepeatPassword,isValidaRepeatPassword)){
    //         btn.disabled = false;
    //     }
    // }


    function validateForm() {
        if (isValidName() && isValidEmail() && isValidPassword() && isValidaRepeatPassword()) {
            btn.disabled = false;
        } else if (!isValidName() || !isValidEmail() || !isValidPassword() || !isValidaRepeatPassword()) {
            btn.disabled = true;
        }

        console.log(
            "Name: " + isValidName() +
            ", Email: " + isValidEmail() +
            ", Password: " + isValidPassword() +
            ", RepeatPassword: " +isValidaRepeatPassword());

    }




    function isValidEl(element,isValid) {
        if (!isValid) {
           // element.val("");
            element.addClass("error-input");
            return false;
        }else {
            return true;
        }
    }

    function keyPress(element,isValid) {
        element.keyup(function () {
            isValidEl(element,isValid);
            if(isValid){
                validateForm();
            }
        });

        element.keypress(function() {
            if (element.attr('placeholder') !== "") {
                element.attr("placeholder", "");
                element.removeClass("error-input");

            }
        });
    }

    function isValidName() {
        if (rUsername.val().length === 0) {
            rUsername.attr("placeholder", errors.name.emptyError);
            return false;
        } else if (rUsername.val().length < 3) {
           rUsername.attr("placeholder", errors.name.lengthError);
            return false;
        } else if (regexW.test(rUsername)) {
           rUsername.attr("placeholder", errors.name.symbolError);
            return false;
        } else {
           rUsername.removeClass("error-input");
            return true;
        }
    }

    function isValidEmail() {
        if (rEmail.val().length === 0) {
            rEmail.attr("placeholder", errors.email.emptyError);
            return false;
        } else if (rEmail.val().length < 6) {
            rEmail.attr("placeholder", errors.email.lengthError);
            return false;
        } else if (regexW.test(rEmail) || rEmail.val().indexOf("@",1) === -1 || rEmail.val().indexOf(".",2) === -1) {
            rEmail.attr("placeholder", errors.email.symbolError);
            return false;
        } else {
            rEmail.removeClass("error-input");
            return true;
        }
    }

    function isValidPassword() {
        if (rPassword.val().length === 0) {
            rPassword.attr("placeholder", errors.password.emptyError);
            return false;
        } else if (rPassword.val().length < 6) {
            rPassword.attr("placeholder", errors.password.lengthError);
            return false;
        } else {
            rPassword.removeClass("error-input");
            return true;
        }
    }

    function isValidaRepeatPassword() {
        if (rRepeatPassword.val().length === 0) {
            rRepeatPassword.attr("placeholder", errors.repeatPassword.emptyError);
            return false;
        } else if (rRepeatPassword.val() !== rPassword.val()) {
            rRepeatPassword.attr("placeholder", errors.repeatPassword.matchError);
            return false;
        } else {
            rRepeatPassword.removeClass("error-input");
            return true;
        }
    }

