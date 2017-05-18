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

changeTab = function(index) {
    var activeTab = parseInt($('.active').attr('id').charAt(3));
    console.log(index);
    console.log(activeTab);

    if (index != activeTab) {
        $(".navbar-nav li").removeClass("active");
        $("#nav" + index).addClass("active");
    }
}

showChatTab = function(tabID) {
    if ($('#'+tabID).hasClass("opened")) {
        $('#'+tabID).removeClass("opened");
    } else {
        // $('.chatTab').removeClass("opened");
        $('#'+tabID).addClass("opened");
    }
    
}

videoCall = function(id) {
    var myWindow = window.open("/videocall?peer_id=" + id, "", "width=1280,height=720");
}

acceptCall = function(id) {
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

