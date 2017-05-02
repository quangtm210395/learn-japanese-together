var templates = {};
var tabSelected = 0;
var resultK = "";
var collapse = 0;


$(document).ready(function () {
    templates.vocabResult = Handlebars.compile($("#template-vocab-result").html());
    templates.vocabAll = Handlebars.compile($("#template-vocab-all").html());
    templates.kanjiResult = Handlebars.compile($("#template-kanji-result").html());
    templates.kanjiResultContent = Handlebars.compile($("#template-kanji-content").html());
    templates.sentenceResult = Handlebars.compile($("#template-sentence-result").html());
    templates.grammarResult = Handlebars.compile($("#template-grammar-result").html());
    templates.grammarUsagesResult = Handlebars.compile($("#template-grammar-usages").html());

    Handlebars.registerHelper('searchResultWord', function (found, data) {
        console.log(found + ' ' + data);
        var result = "";
        if (found) {
            result += templates.vocabResult(data[0]);
        }

        return new Handlebars.SafeString(result);
    });

    Handlebars.registerHelper('searchResultKanji', function (status, results) {
        console.log(status + " " + results);
        var result = "";
        var a = {};
        a.results = results;
        console.log("a: " + a);
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
        console.log('clicked!');
        var text = $('#search-text-box').val();
        $.ajax({
                url: "/api/dictionary/search/",
                data: JSON.stringify({
                    word: text
                }),
                type: "post",
                contentType: "application/json",
            })
            .done(function (data) {
                console.log(data);
                $("#result-content-0").html(templates.vocabAll(data));
            })
            .fail(function (err) {
                console.log(err);
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
                    $("#list-kanji").html(templates.kanjiResult(data));
                    $("#kanji-detail-result").html(templates.kanjiResultContent(data.results[0]));
                    resultK = data;
                }
            }).fail(function (err) {
                console.log(err);
            });

        $.ajax({
                url: "/api/dictionary/sentence/" + text,
                type: "post",
            })
            .done(function (data) {
                console.log(data);
                if (data.status == 200) {
                    $("#result-content-2").html(templates.sentenceResult(data));
                }
            }).fail(function (err) {
                console.log(err);
            });

        $.ajax({
                url: "/api/dictionary/grammars/" + text,
                type: "post",
            })
            .done(function (data) {
                console.log(data);
                if (data.status == 200) {
                    $("#result-content-3").html(templates.grammarResult(data));
                    data.results.forEach(function (result) {
                        $.ajax({
                                url: "/api/dictionary/grammar/" + result._id,
                                type: "post",
                            })
                            .done(function (data2) {
                                console.log(data2);
                                if (data2.status == 200) {
                                    var grammar = data2.grammar;
                                    grammar.usages.forEach(function(usage) {
                                        usage.mean = decodeHtml(usage.mean);
                                        usage.examples.forEach(function(examp) {
                                            examp.mean = decodeHtml(examp.mean);
                                        })
                                    })
                                    $("#" + result._id).html(templates.grammarUsagesResult(grammar));
                                }
                            }).fail(function (err) {
                                console.log(err);
                            });
                    })
                }
            }).fail(function (err) {
                console.log(err);
            });
    });


});

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