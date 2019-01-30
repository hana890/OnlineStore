console.log(' ' + rId);
var searchItemAre = $('#search-res-area');
$('#s-search').click(function () {
    var searchIn = $('#search-inp').val();
    if (searchIn.length > 0) {
        var data = {
            symbol: searchIn
        };

        searchUsers(data);
        var msBtn = $('.wr-ms');
        // for (let i = 0; i < ; i++) {
        //
        // }
    }
    // console.log('searchIn: ' + searchIn);
    // console.log('length: ' + searchIn.length);
});


function searchUsers(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/searchUsers", true);
    xhr.onload = function () {
        var response = JSON.parse(xhr.responseText);
        searchItemAre.html("");
        response.message.forEach(function (item) {
            createUserItem(item);
        });
    };
    xhr.send(JSON.stringify(data));
}

function createUserItem(item) {
    var div = $('<div></div>').addClass('search-res-item');
    var divImg = $('<div></div>');
    var href = $('<a></a>').attr('href','profile/' + item.id);
    var Img = $('<img>').attr('src', '../../public/images/avatar.png');

    var divName = $('<div></div>').addClass('se-pe-name');

    var isLogin = item.isLogin === 1 ? ' (online)' : ' (offline)';

    var name = $('<span></span>').text(item.username + isLogin);

    var msBtm = $('<div></div>').addClass('wr-ms').attr('name', item.id);
    msBtm.attr('data-name', item.username);
    msBtm.attr('onClick', msOnClick(msBtm));
    var btn = $('<span></span>').text('Write');

    href.append(Img);
    divImg.append(href);
    div.append(divImg);
    divName.append(name);
    msBtm.append(btn);
    divName.append(msBtm);
    div.append(divName);
    searchItemAre.append(div);
}

function msOnClick(item) {


    item.click(function () {
        sId = parseInt(searchItemAre.attr('data-name'));
        rId = parseInt(item.attr('name'));
        var data = {rId: rId};
        var text = item.attr('data-name');

        // console.log('rId: ' + rId);
        // console.log('sId: ' + sId);
        // console.log('text: ' + text);

        openRoom(data,text);

    });

}

// function SearchAvatars(data) {
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", "/searchAvatars", true);
//     xhr.onload = function () {
//         var response = JSON.parse(xhr.responseText);
//         cb(response.message);
//     };
//     xhr.send(JSON.stringify(data));
// }