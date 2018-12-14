const checkbox = document.querySelectorAll('input[type=checkbox]');
var rng = document.querySelector('input[type=range]');
for (let i = 0; i < checkbox.length; i++) {
    checkbox[i].addEventListener('change', function () {
        document.querySelector("#rPrice").innerHTML = 0;
        $("html, body").animate({scrollTop: 0}, 1000);
        rng.value = 0;

        changeChecked(checkbox,i);
        if (this.checked) {
            var checkboxVal = this.value;
            var data = {
                category: checkboxVal,
                filter:"category"
            };
            sendXhr(data);
        } else {
            var data = {
                filter: "all"
            };
            sendXhr(data);
        }
    });
}

function sendXhr(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/filter", true);
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        var productArea = $(".product-area");
        productArea.html("");
        response.message.forEach(function (item) {
            getProduct(item, productArea);
        });
    };
    xhr.send(JSON.stringify(data));
}

function changeChecked(el,position) {
    for (var i = 0; i < el.length; i++) {
        if (el[i].checked){
            for (var j = 0; j < el.length; j++) {
                if (j === position) {
                    continue;
                }
                el[j].checked = false;
            }
            return false;
        }
        console.log(position);
    }
    return true;
}

function getProduct(item,productArea) {
    var divItem = createDiv('product-item');
    var divItemInner = createDiv('product_inner');
    var divImg = createDiv('product-block-image');

    var img = $('<img>').attr('src', "/../../public/uploads/" + item.img);
    var name = $("<h4></h4>").text(item.name);
    var description = $('<p></p>').text(item.description.slice(0,20) + ".....");
    var price = $('<p></p>').text(item.price + " AMD");
    var btn = $('<button></button>').text("Add Product");
    btn.attr('data-id',item.id);
    btn.attr('data-price',item.price);
    btn.attr('data-name',item.name);
    btn.addClass('add-product').click(addProduct);

    divImg.append(img);
    divItemInner.append(divImg,name, description, price,btn);
    divItem.append(divItemInner);
    productArea.append(divItem);

}

function createDiv(className) {
    var div = $('<div></div>');
    div.addClass(className);
    return div;
}

read("mousedown");
read("mousemove");
// read("keydown");
read("mouseup");

function read(evtType) {
    rng.addEventListener(evtType, function() {
        window.requestAnimationFrame(function () {
            document.querySelector("#rPrice").innerHTML = +rng.value * 500;
            rng.setAttribute("aria-valuenow", rng.value);
            if (evtType === "mouseup"){
                changeChecked(checkbox,10);
                var data = {
                    price: +rng.value * 500,
                    filter:"price"
                };
                console.log(evtType);
                sendXhr(data);
            }
        });
    });
}

var product = [];
var count = 0,priceSum = 0;
var products = document.querySelectorAll('.add-product');
for(var i = 0; i < products.length; i++){
    products[i].addEventListener('click', addProduct)
}

function addProduct(){

    product.push({
        id: this.getAttribute('data-id'),
        name: this.getAttribute('data-name'),
        price: parseInt(this.getAttribute('data-price')),
        count: 1
    });
    priceSum += product[product.length- 1].price;
    count++;
    for(var i = 0; i < product.length - 1; i++){
        if(product[i].id === product[product.length - 1].id){
            ++product[i].count;
            product[i].price += product[product.length - 1].price;
            product.splice(product.length - 1, 1);
            break;
        }
    }

    $('#mega-menu').css('display','flex');
    $('#cal-price').text(priceSum);
    $('#cal-count').text(count);

    console.log(product);
}


$('#buy-btn').click(function () {
    product.push({sum: priceSum});
    var newXhr = new XMLHttpRequest();
    newXhr.open('POST', '/cart', true);
    newXhr.onload = function(){
        console.log(newXhr.responseText);
    };
    newXhr.send(JSON.stringify(product));
});


// var prevValue = 0;
// $('.slider').on('change',function(e){
//
// });
// // mouse down to check for previous value
// $('.slider').on('mousedown',function(e){
//     prevValue = $(this).val();
// });
// // mouse up when the mouse up from the slider with end value
// $('.slider').on('mouseup' , function(){
//     var ThisValue = $(this).val();
//     if(ThisValue !== prevValue){  // check new value with previous value
//         alert('Value Changed');
//     }
// });