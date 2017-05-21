changeTypeSearch = function (index) {
    var activeTab = parseInt($('.tab-active').attr('id').charAt(3));
    tabSelected = index;

    if (index != activeTab) {
        console.log(tabSelected);
        $(".search-input-container button").removeClass("tab-active");
        $("#tab" + index).addClass("tab-active");
        $(".tab-container .result").addClass("dis-cont");
        $("#result-content-" + index).removeClass("dis-cont");
        // reloadResources(index);
        var placeholder = "";
        var o;
        switch (index) {
            case 0:
                placeholder = "日本, nihon, Nhật Bản", o = "word";
                break;
            case 1:
                placeholder = "公, công", o = "kanji";
                break;
            case 2:
                placeholder = "優しい, yasashii, tốt bụng", o = "example";
                break;
            case 3:
                placeholder = "のに, để", o = "grammar"
        }
        $("#search-text-box").attr("placeholder", placeholder);
    }
}

changeTab = function (index) {
    var activeTab = parseInt($('.active').attr('id').charAt(3));
    console.log(index);
    console.log(activeTab);

    if (index != activeTab) {
        $(".navbar-nav li").removeClass("active");
        $("#nav" + index).addClass("active");

        if (index == 0) {
            $("#viewContent").show();
            $("#feedback").hide();
        } else if (index == 1) {
            $("#feedback").show();
            $("#viewContent").hide();
        }

    }
}

showChatTab = function (tabID) {
    if ($('#chatTab' + tabID).hasClass("opened")) {
        $('#chatTab' + tabID).removeClass("opened");
        $('#chatTab' + tabID).addClass("closed");
        $(".titlebar").removeClass("greenChatTitle");
    } else {
        $('#chatTab' + tabID).removeClass("closed");
        $('#chatTab' + tabID).addClass("opened");
        $(".titlebar").removeClass("greenChatTitle");
        $("#title" + tabID).addClass("greenChatTitle");
    }

}

closeChatTab = function (tabID) {
    $(".titlebar").removeClass("greenChatTitle");
    $('#chatTab' + tabID).remove();
}

videoCall = function (id) {
    var myWindow = window.open("/videocall?peer_id=" + id, "", "width=1280,height=720");
}

acceptCall = function (id) {
    socket.emit('access call', {
        peer_id: id,
        accepted: true
    });
    var myWindow = window.open("/videocall?peer_id=" + id, "", "width=1280,height=720");
}

rejectCall = function (id) {
    socket.emit('access call', {
        peer_id: id,
        accepted: false
    });
};

scrollToBottom = function (id) {
    // $("#nub"+id).animate({ scrollTop: $("#nub"+id).prop("scrollHeight")}, 1000);
    $("#nub" + id).scrollTop($("#nub" + id).prop("scrollHeight"))
}

clearSearchText = function () {
    $('#search-text-box').val("");
}

isTypingEffect = function (id, isTyping) {
    if (isTyping == true) {
        var text = $("#textTyping" + id).val();
        var dots = "";
        var i = 1;
        setTimeout(function () {
            if (i % 3 == 1) dots = ".";
            else if (i % 3 == 1) dots = "..";
            else dots = "...";
            console.log(i);
            text = text + dots;
            console.log(text);
            $("#textTyping" + id).val(text);
            i++;
            if (i == 100) i = 1;
        }, 500);
    }
}

randomCall = function () {
    var myWindow = window.open("/random-call", "", "width=1280,height=720,top=43,left=24,screenX=43,screenY=24");
}

chatFocus = function (id) {
    $(".titlebar").removeClass("greenChatTitle");
    $("#title" + id).addClass("greenChatTitle");
    $("#send" + id).focus();
}

showLoading = function () {
    $("#search-btn").attr('class', 'fa fa-spinner fa-lg fa-spin loading');
    $("#search-button").prop('disabled', true);
    $("#search-text-box").prop('disabled', true);
}

hideLoading = function () {
    $("#search-btn").attr('class', 'fa fa-search fa-lg');
    $("#search-button").prop('disabled', false);
    $("#search-text-box").prop('disabled', false);
}

playAudio = function (name) {
    var audioName = convertJptoHex(name).toUpperCase() + ".mp3";
    audioElement.setAttribute('src', 'http://data.mazii.net/audios/' + audioName);

    // audioElement.addEventListener('ended', function() {
    //     this.play();
    // }, true);
    audioElement.play();
}

convertJptoHex = function(a) {
    if (null == a || "" == a)
        return "";
    -1 != a.indexOf("「") && (a = a.replace(new RegExp("「","g"), ""),
    a = a.replace(new RegExp("」","g"), "")),
    a = a.trim();
    for (var b = "", c = 0; c < a.length; c++)
        b += ("0000" + a.charCodeAt(c).toString(16)).substr(-4),
        c != a.length - 1 && (b += "_");
    return b;
}

