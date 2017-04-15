changeTypeSearch = function (index) {
    var activeTab = parseInt($('.tab-active').attr('id').charAt(3));
    console.log(activeTab);

    if (index != activeTab) {
        $(".search-input-container button").removeClass("tab-active");
        $("#tab" + index).addClass("tab-active");
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