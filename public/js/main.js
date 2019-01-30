var ms = $("#messenger");
var ms_item = $('.ms_item');
var menu = $(".container-menu");
var ms_menu = $('.ms-menu');
var ms_area = $('.ms-area');
var ms_input = $('.ms-input input');
var rId = 0, sId = 0;
var pSearch = $('.menu-item input');


/*
get scrolling event
 */
$(window).scroll(function () {
    if ($(this).scrollTop()) {
        $('#back-top').fadeIn();
    } else {
        $('#back-top').fadeOut();
    }
});

/*
back to top
 */
$("#toTop").click(function () {
    $("html, body").animate({scrollTop: 0}, 1000);
});


pSearch.keyup(function(e){
    if(e.key === 'Enter' && $(this).val().length > 2)
    {
        console.log($(this).val());
    }
});

/*
open menu
 */
$("#open-menu").click(function () {
    $(this).css("display", "none");
    $("#close-menu").css("display", "block");
    menu.css({"width": "0",}).show(1500).animate({"width": "100%"});
    // menu.next().css({"margin-right": "0",}).show(1500).animate({"margin-right": "350px"});
});

/*
close menu
 */
$("#close-menu").click(function () {
    menu.css({"width": "100%",}).show(1500).animate({"width": "0"});
    $("#open-menu").css("display", "block");
    $(this).css("display", "none");
    // menu.next().css("margin-right", 0);
    // menu.next().css({"margin-right": "350px",}).show(1500).animate({"margin-right": "0"});
});

/*
Toggle profile tab-menu
 */



var pPrev = 0;
$('.profile-inform-menu ul li').click(function () {
    var tab = $('.tape-area >div');
    var pNext = $(this).index();
    tab.eq(pPrev).css('display', 'none');
    if (pNext === 2) tab.eq(pNext).css('display', 'flex');
    else tab.eq(pNext).css('display', 'block');
    console.log('pNext: ' + pNext);
    console.log('pPrev: ' + pPrev);
    pPrev = pNext;
});


/*
Toggle display messages msList
 */

$("#messenger-area").click(function () {
    if (ms.css("display") === "none") {
        ms.css("display", "grid");
        var data = {
            messages: "Messages"
        };
        sendXhrMs(data);
    } else {
        ms.css("display", "none");
    }
});

/*
Send Request messages list
 */

var msList;

function sendXhrMs(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/messages", true);
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        ms.html("");
        msList = [{recipient_id:'test',sender_id:'test'}];
        response.message.reverse().forEach(function (item) {
            getMsList(item, ms);
        });
    };
    xhr.send(JSON.stringify(data));
}


function isRecipientId(item) {
       for (let i = msList.length - 1; i > -1; i--) {
           if (msList[i].recipient_id === item.recipient_id || msList[i].sender_id === item.recipient_id) {
               return false;
           }
           // else if(msList[i].sender_id === item.sender_id && item.id === item.sender_id){
           //     return false;
           // }
       }
       msList.push(item);
       return true;
}


function getMsList(item, ms) {
    if (isRecipientId(item)){
        var divItem = $('<div></div>').attr("name", item.recipient_id);

        divItem.addClass('ms_item', item.recipient_id);
        if (item.id === item.recipient_id) {
            openMsMenu(divItem, item.recipient_id, item.sender_id);
        }else {
            openMsMenu(divItem,item.sender_id, item.recipient_id);
        }


        var img = $('<img>').attr('src', '/public/images/avatar.png');
        var divIm = $('<div></div>').append(img);

        var spanName = $('<h4></h4>').text(item.username);
        var spanDate = $('<span></span>').text(item.date).addClass('right');
        var spanText = $('<span></span>').text(item.text);

        var divText = $('<div></div>').addClass('ms_text');
        divText.append(spanName, spanDate, spanText);

        divItem.append(divIm, divText);
        ms.append(divItem);
    }
}


function getChat(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/chat", true);
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        ms_area.html("");
        response.message.forEach(function (item) {
            var keyNames = Object.keys(item);
            console.log(keyNames);
            getChatArea(item, ms_area);
        });
    };
    xhr.send(JSON.stringify(data));

}

var socket = io.connect('http://localhost:7000/');
var isOpenRoom = false;

$('.close-ms-menu').click(function () {
    $('.ms-menu').css('display', 'none');
    isOpenRoom = false;
    socket.emit('unsubscribe', (rId + sId) + 'www');
});

function openMsMenu(el, recipient_id, sender_id) {
    var data = {rId: recipient_id};

    el.click(function () {
        rId = recipient_id;
        sId = sender_id;
        var text = el.find('.ms_text h4').eq(0).text();
        openRoom(data,text);
    });
}

function openRoom(data,text){
    ms_menu.css('display', 'block');
    $('.us-n').text(text);
    var room = (rId + sId) + 'www';
    console.log(room);
    socket.emit('subscribe', room);

    getChat(data, text);
    console.log("name: " + $(this).attr('name'));
}


$('.ms-send').click(function () {
    var text = ms_input.val();

    if (text.length > 0) {
        ms_input.val('');
        var date = new Date();
        var data = {
            text: text,
            date: date.getHours() + ' : ' + date.getMinutes(),
            sender_id: sId,
            recipient_id: rId
        };
        socket.emit('send-ms', data);
        return false;
    }
});

socket.on('new-ms', function (data) {
    getChatArea(data, ms_area);
    console.log(data);
});


function getChatArea(item, ms_area) {
    var divItem = $('<div></div>').addClass('ms-item');

    if (rId === item.recipient_id) {
        var div = $('<div></div>').addClass('send-ms');
    } else {
        var div = $('<div></div>').addClass('get-ms');
    }

    var text = $('<span></span>').text(item.text);
    var date = $('<h6></h6>').text(item.date);
    div.append(text, date);
    divItem.append(div);
    ms_area.append(divItem);
}


var myProducts = [];
var add_product = $(".add-product");

add_product.click(function () {

    myProducts.push({})
});


// function getAnimatePosition(count) {
//     var position = count;
//
//     return function () {
//         position += count;
//         return position;
//     }
// }
//
//
// var getCloudsPosition = getAnimatePosition(1);
// var getBackgroundPosition = getAnimatePosition(1.3);
// var getForegroundPosition = getAnimatePosition(1.9);





