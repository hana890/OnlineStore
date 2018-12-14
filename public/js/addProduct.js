{
    var nameEl = $("#p_name");
    var imageEl = $("#p_image");
    var priceEl = $("#p_price");
    var descriptionEl = $("#p_description");

    var addProductBtn = document.querySelector("#p_btn");
    addProductBtn.disabled = true;

    var errors = {
        text: "fill in the field",
        image: "upload image"
    };


    $(document).ready(function () {
        keyPress(nameEl);
        keyPress(imageEl);
        keyPress(priceEl);
        keyPress(descriptionEl);
    });

    /*
    validate Add Product form
     */


    function validateForm() {
        if (isEmpty(nameEl) || isEmpty(imageEl) || isEmpty(priceEl) || isEmpty(descriptionEl)) {
            addProductBtn.disabled = true;
        } else if(!isEmpty(nameEl) && !isEmpty(imageEl) && !isEmpty(priceEl) && !isEmpty(descriptionEl)){
            addProductBtn.disabled = false;
        }
    }



    function isEmpty(el) {
        if (el.val().length < 2) {
            return true;
        } else {
            return false;
        }
    }

    function keyPress(element) {
        element.keyup(function () {
            if (element.is(":empty")) {
                element.addClass("error-input");
                element.attr("placeholder", errors.text);
            }
            validateForm();
            // console.log("blur " + element.val());
        });

        element.keypress(function() {
            if (element.attr('placeholder') !== "") {
                element.attr("placeholder", "");
                element.removeClass("error-input");

            }
        });
    }


}

