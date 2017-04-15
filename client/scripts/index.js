var templates = {};



$(document).ready(function () {
    templates.vocabResult = Handlebars.compile($("#template-vocab-result").html());
    templates.vocabAll = Handlebars.compile($("#template-vocab-all").html());

    Handlebars.registerHelper('searchResult', function (found, data) {
        console.log(found + ' ' + data);
        var result = "";
        if (found) {
            result += templates.vocabResult(data[0]);
        }

        return new Handlebars.SafeString(result);
    });

    $("#search-button").click(function () {
        console.log("clicked");
        var text = $('#search-text-box').val();
        $.ajax({
                url: "/api/dictionary/search/",
                data : JSON.stringify({
                    word : text
                }),
                type: "post",
                contentType: "application/json",
            })
            .done(function (data) {
                console.log(data);
                $("#result-content").html(templates.vocabAll(data));
            })
            .fail(function (err) {
                console.log(err);
            });
    });

});