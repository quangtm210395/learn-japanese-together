var templates = {};
var tabSelected = 0;
var resultK = "";
var collapse = 0;
var audioElement;

$.ajaxSetup({
    headers: {
        "token": localStorage.getItem("token")
    }
});

var incommingData = {};

$(document).ready(function () {
    audioElement = document.createElement("audio");

    templates.vocabResult = Handlebars.compile($("#template-vocab-result").html());
    templates.vocabAll = Handlebars.compile($("#template-vocab-all").html());
    templates.kanjiResult = Handlebars.compile($("#template-kanji-result").html());
    templates.kanjiResultContent = Handlebars.compile($("#template-kanji-content").html());
    templates.sentenceResult = Handlebars.compile($("#template-sentence-result").html());
    templates.grammarResult = Handlebars.compile($("#template-grammar-result").html());
    templates.grammarUsagesResult = Handlebars.compile($("#template-grammar-usages").html());
    templates.chatTabs = Handlebars.compile($('#template-chat-tabs').html());
    templates.chatMySelf = Handlebars.compile($('#template-chat-myself').html());
    templates.chatFriend = Handlebars.compile($('#template-chat-friend').html());
    templates.incommingCall = Handlebars.compile($('#template-incomming-call').html());
    templates.noResult = Handlebars.compile($("#template-no-result").html());

    Handlebars.registerHelper('searchResultWord', function (found, data) {
        var result = "";
        if (found) {
            result += templates.vocabResult(data[0]);
        }

        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('searchResultKanji', function (status, results) {
        var result = "";
        var a = {};
        a.results = results;
        if (status == 200) {
            result += templates.kanjiResult(a);
        }

        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('checkSentence', function (status, expected, opts) {
        if (status == expected) return opts.fn(this);
        if (status == expected) return opts.inverse(this);
    })

    $("#search-button").click(function () {
        searchDictionary();
    });

    $("#search-text-box").keyup(function (e) {
        if (e.keyCode === 13) searchDictionary();
    });

    $("div.user-search").click(function () {
        $("#user-search-input").focus();
    });

});

function searchUser(e) {
    var searchText = $("#user-search-input").val().trim();
    var searchedList = [];
    usersData.users.forEach(function (user) {
        if (user.name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
            searchedList.push(user);
        }
    });
    if (e.keyCode === 13 || searchText.length == 0) {
        var listUser = usersStatusTemplate({
            users: searchedList,
            searchText: searchText
        });
        $('#viewAside').html(listUser);
        $("#user-search-input").val("");
        $("#user-search-input").focus();
    }
}

function cancelSearch() {
    var listUser = usersStatusTemplate({
        users: usersData.users,
        searchText: ""
    });
    $('#viewAside').html(listUser);
    $("#user-search-input").val("");
    $("#user-search-input").focus();
}

function searchDictionary() {
    var text = $('#search-text-box').val().toLowerCase();
    if (text != "") {
        showLoading();
        $.ajax({
                url: "/api/dictionary/search/",
                data: JSON.stringify({
                    word: text
                }),
                type: "post",
                contentType: "application/json",
            })
            .done(function (data) {
                if (data.found)
                    $("#result-content-0").html(templates.vocabAll(data));
                else
                    $("#result-content-0").html(templates.noResult({
                        type: "từ vựng",
                        word: text
                    }));
            })
            .fail(function (err) {
            }).always(function () {
                hideLoading();
            });

        $.ajax({
                url: "/api/dictionary/kanji/" + text,
                type: "post",
            })
            .done(function (data) {
                if (data.status == 200) {
                    data.results.forEach(function (item) {
                        item.details = getDetail(item);
                        item.title = getTittle(item);
                    });
                    $("#result-content-1-nr").html("");
                    $("#list-kanji").html(templates.kanjiResult(data));
                    $("#kanji-detail-result").html(templates.kanjiResultContent(data.results[0]));
                    resultK = data;
                } else {
                    $("#list-kanji").html("");
                    $("#kanji-detail-result").html("");
                    $("#result-content-1-nr").html(templates.noResult({
                        type: "chữ hán",
                        word: text
                    }));
                }
            }).fail(function (err) {
            }).always(function () {
                hideLoading();
            });

        $.ajax({
                url: "/api/dictionary/sentence/" + text,
                type: "post",
            })
            .done(function (data) {
                if (data.status == 200) {
                    $("#result-content-2").html(templates.sentenceResult(data));
                } else {
                    $("#result-content-2").html(templates.noResult({
                        type: "câu",
                        word: text
                    }));
                }
            }).fail(function (err) {

            }).always(function () {
                hideLoading();
            });

        $.ajax({
                url: "/api/dictionary/grammars/" + text,
                type: "post",
            })
            .done(function (data) {
                if (data.status == 200) {
                    $("#result-content-3").html(templates.grammarResult(data));
                    data.results.forEach(function (result) {
                        $.ajax({
                                url: "/api/dictionary/grammar/" + result._id,
                                type: "post",
                            })
                            .done(function (data2) {
                                if (data2.status == 200) {
                                    var grammar = data2.grammar;
                                    grammar.usages.forEach(function (usage) {
                                        usage.mean = decodeHtml(usage.mean);
                                        usage.examples.forEach(function (examp) {
                                            examp.mean = decodeHtml(examp.mean);
                                        })
                                    })
                                    $("#" + result._id).html(templates.grammarUsagesResult(grammar));
                                }
                            }).fail(function (err) {
                                console.log(err);
                            });
                    })
                } else {
                    $("#result-content-3").html(templates.noResult({
                        type: "ngữ pháp",
                        word: text
                    }));
                }
            }).fail(function (err) {
                console.log(err);
            }).always(function () {
                hideLoading();
            });
    }
}

function regisChat(id) {
    if ($("#chatTab" + id).length == 0) {
        $.ajax({
                url: "/api/conversation/get/" + id,
                method: "get"
            })
            .done(function (data) {
                if (data.status) {
                    var result = data.result;
                    result.messages.forEach(function (item) {
                        if (item.sender == id) {
                            item._chatCss = "chat-friend";
                            item._reverseCss = "";
                            item._isFriend = true;
                        } else {
                            item._chatCss = "chat-myself";
                            item._reverseCss = "row-reverse";
                            item._isFriend = false;
                        }
                    });
                    $('#chatTabs').append(templates.chatTabs(result));
                    scrollToBottom(id);
                    if (!$("#send" + id).is(":focus"))
                        chatFocus(id);
                    // isTypingEffect(id, true);
                }
            });
    } else {
        $('#chatTab' + id).removeClass("closed");
        $('#chatTab' + id).addClass("opened");
        $(".titlebar").removeClass("greenChatTitle");
        $("#title" + id).addClass("greenChatTitle");
        if (!$("#send" + id).is(":focus"))
            chatFocus(id);
    }
}


function reloadResources(index) {
    // $("#list-kanji").html(templates.kanjiResult(resultK));
    $("#kanji-detail-result").html(templates.kanjiResultContent(resultK.results[index]));
}

function changeKanji(index) {
    $("#kanji-detail-result").html(templates.kanjiResultContent(resultK.results[index]));
}

function getDetail(data) {
    if (data.detail)
        return data.detail.split("##");
}

function getTittle(data) {
    if (data.detail) {
        var title = "";
        var details = data.detail.split('##');
        details.forEach(function (item) {
            for (let i = 0; i < item.length; i++) {
                if ('.' == item[i]) {
                    title += item.substr(0, i + 1) + " ";
                    break;
                }
            }
        });
        return title;
    }
}

function showCollapse() {
    if (collapse == 1) {
        $(".list-collapse").slideUp(100);
        $(".button-collapse>i").addClass("fa-angle-double-down");
        $(".button-collapse>i").removeClass("fa-angle-double-up");
    } else {
        $(".list-collapse").slideDown(100);
        $(".button-collapse>i").addClass("fa-angle-double-up");
        $(".button-collapse>i").removeClass("fa-angle-double-down");
    }
    collapse = !collapse;

}

function isKanji(a) {
    if ("々" == a) return true;
    var b = a.charCodeAt(0);
    return b >= 19968 && 40895 >= b;
}

function isHiragana(a) {
    var b = a.charCodeAt(0);
    return b >= 12352 && 12447 >= b;
}

function isKatakana(a) {
    var b = a.charCodeAt(0);
    return b >= 12448 && 12543 >= b;
}

function isJapanese(a) {
    for (let i = 0; i < a.length; i++) {
        if (isKanji(a.charAt(i)) || isHiragana(a.charAt(i)) || isKatakan(a.charAt(i)))
            return true;
    }
    return false;
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

var capitaliseFirstLetter = function (a) {
    return a.charAt(0).toUpperCase() + a.slice(1);
}