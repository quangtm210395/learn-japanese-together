/**
 * Created by phanmduong on 5/22/17.
 */
"use strict";
var localstoreSerive = angular.module("mazii.service.localstore", []);
localstoreSerive.factory("localstoreServ", [function () {
    var a = {};
    return a.setItem = function (a, b) {
        localStorage.setItem(a, angular.toJson(b))
    }, a.getItem = function (a) {
        var b = localStorage.getItem(a);
        return angular.fromJson(b)
    }, a.deleteItem = function (a) {
        localStorage.removeItem(a)
    }, a.clear = function () {
        localStorage.clear()
    }, a
}]);
var maziiServ = angular.module("mazii.service.note", []);
maziiServ.factory("noteServ", ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", "userServ", function (a, b, c, d, e, f, g) {
    function h() {
        p = a.categories
    }

    function i() {
        if (null != q)return q;
        var a = localStorage.getItem("grammar");
        return q = JSON.parse(a), null == q && (q = []), q
    }

    function j() {
        if (null != o)return o;
        var a = localStorage.getItem("note");
        return o = JSON.parse(a), null == o && (o = []), o
    }

    function k() {
        var a = JSON.stringify(o);
        localStorage.setItem("note", a)
    }

    function l() {
        var a = JSON.stringify(p);
        localStorage.setItem("categoryNote", a)
    }

    function m() {
        var a = JSON.stringify(q);
        localStorage.setItem("grammar", a)
    }

    var n = {}, o = null, p = null, q = null;
    return n.getNoteItem = function (a, b, c) {
        g.getNote(a, b).then(function (a) {
            c(a)
        })
    }, n.getCategory = function () {
        return null == p && h(), p
    }, n.pushCategory = function (b) {
        if (null != b && "" != b) {
            null == p && h();
            for (var c = -1, d = 0; d < p.length; d++)if (p[d].categoryName == b) {
                c = d;
                break
            }
            -1 != c && p.splice(c, 1);
            var e = {};
            e.categoryName = b, e.date = new Date, null != a.user && g.addCategory(a.user.userId, b, e.date).then(function (a) {
                200 == a.status && (e.categoryId = a.cateId, p.push(e), l())
            })
        }
    }, n.pushGrammar = function (b, c, e, f) {
        if (null != b && "" != b && null != c && "" != c) {
            null == q && i();
            var h = -1;
            if (q.length > 0)for (var j = 0; j < q.length; j++)if (q[j].category == b && q[j].idx == f) {
                h = j;
                break
            }
            if (-1 != h) a.alert.notify = "Từ này đã có trong danh sách", $(".notify-current").fadeIn(200), d(function () {
                $(".notify-current").fadeOut(200)
            }, 2e3); else {
                var k = {};
                k.category = b, k.date = new Date, k.query = c, k.type = e, k.idx = f, null != a.user && g.addNote({
                    noteName: k.query,
                    noteMean: a.meanMyNote,
                    date: k.date,
                    categoryId: b,
                    type: e,
                    idx: f
                }).then(function (a) {
                    k.id = a.noteId, q.push(k), m()
                })
            }
        }
    }, n.pushNote = function (b, c, e) {
        if (null != b && "" != b && null != c && "" != c) {
            null == o && j();
            var f = -1;
            if (o.length > 0)for (var h = 0; h < o.length; h++)if (o[h].category == b && o[h].query == c && o[h].type == e && o[h].mean == a.meanMyNote) {
                f = h;
                break
            }
            if (-1 != f) a.alert.notify = "Từ này đã có trong danh sách", $(".notify-current").fadeIn(200), d(function () {
                $(".notify-current").fadeOut(200)
            }, 2e3); else {
                var i = {};
                i.category = b, i.date = new Date, i.query = c, i.mean = a.meanMyNote, i.type = e, null != a.user && g.addNote({
                    noteName: i.query,
                    noteMean: a.meanMyNote,
                    date: i.date,
                    categoryId: b,
                    type: e,
                    idx: null
                }).then(function (a) {
                    i.id = a.noteId, o.push(i), k()
                })
            }
        }
    }, n.removeCategory = function (b, c) {
        null != a.user && g.deleteCategory(a.user.userId, c).then(function () {
            for (var a = -1, b = 0; b < p.length; b++)if (p[b].categoryId == c) {
                a = b;
                break
            }
            -1 != a && p.splice(a, 1)
        })
    }, n.removeNote = function (b) {
        return null != a.user ? g.deleteNote(b) : void 0
    }, n.clearNote = function () {
        o = [], k()
    }, n.clearGrammar = function () {
        q = [], m()
    }, n.clearCategory = function () {
        p = [], l()
    }, n
}]);
var maziiServ = angular.module("mazii.service.history", []);
maziiServ.factory("historyServ", ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", function (a, b, c, d, e, f) {
    function g() {
        if (null != j)return j;
        var a = localStorage.getItem("history");
        return j = JSON.parse(a), null == j && (j = []), j
    }

    function h() {
        var a = JSON.stringify(j);
        localStorage.setItem("history", a)
    }

    var i = {}, j = null;
    return i.get = function () {
        return null == j && g(), j
    }, i.push = function (a, b) {
        if (null != a && "" != a) {
            null == j && g();
            for (var c = -1, d = 0; d < j.length; d++)if (j[d].query == a && j[d].type == b) {
                c = d;
                break
            }
            -1 != c && j.splice(c, 1);
            var e = 0;
            0 != j.length && (e = j[j.length - 1].id + 1);
            var f = {};
            f.date = new Date, f.query = a, f.type = b, f.id = e, j.push(f), h()
        }
    }, i.remove = function (a) {
        for (var b = -1, c = 0; c < j.length; c++)if (j[c].id == a) {
            b = c;
            break
        }
        -1 != b && j.splice(b, 1), h()
    }, i.clear = function () {
        j = [], h()
    }, i
}]);
var SERVER_ERROR_CODE = 302, SERVER_SUCCESS_CODE = 200, baseUrl = "http://mazii.net/",
    maziiServ = angular.module("mazii.service.search", []);
maziiServ.factory("maziiServ", ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", function (a, b, c, d, e, f) {
    var g = baseUrl + "api/search/", h = baseUrl + "api/refer/", i = baseUrl + "api/smile/", j = baseUrl + "api/mazii/",
        k = baseUrl + "api/grammar/", l = baseUrl + "api/news/", m = baseUrl + "api/news/",
        n = baseUrl + "api/gsearch/", o = baseUrl + "api/jlptgrammar/", p = baseUrl + "api/jlptkanji/",
        q = "http://alt.mazii.net/ene/log", r = {}, s = {};
    s.search = function (a, d) {
        var e = "";
        "word" == a ? e = g + d + "/20/1" : "example" == a ? e = i + d : "kanji" == a ? e = j + d + "/10" : "grammar" == a ? e = h + d : "grammar_detail" == a && (e = k + d);
        var f = b.defer();
        return null != r[e] ? (f.resolve(r[e]), f.promise) : (c.get(e).success(function (a, b, c, d) {
            r[e] = a, f.resolve(a)
        }).error(function (a, b, c, d) {
            f.reject(b)
        }), f.promise)
    }, s.googleTranslate = function (a, d, e) {
        var f = n + a + "/" + d + "/" + e, g = b.defer();
        return null != r[f] ? (g.resolve(r[f]), g.promise) : (c.get(f).success(function (a, b, c, d) {
            if (null != a && a.status == SERVER_SUCCESS_CODE) {
                var e = JSON.parse(a.data);
                null != e ? (r[f] = e, g.resolve(e)) : g.resolve(null)
            } else g.resolve(null)
        }).error(function (a, b, c, d) {
            g.reject(null)
        }), g.promise)
    }, s.getHeadNews = function (a) {
        null == a && (a = 1);
        var d = b.defer(), e = l + a + "/10";
        return null != r[e] ? (d.resolve(r[e]), d.promise) : (c.get(e).success(function (a, b, c, f) {
            r[e] = a.results, d.resolve(a.results)
        }).error(function (a, b, c, e) {
            d.reject(null)
        }), d.promise)
    }, s.getDetailNews = function (a) {
        var d = m + a, e = b.defer();
        return null != r[d] ? (e.resolve(r[d]), e.promise) : (c.get(d).success(function (a, b, c, f) {
            r[d] = a.result, e.resolve(a.result)
        }).error(function (a, b, c, d) {
            e.reject(null)
        }), e.promise)
    }, s.queryGrammarJLPT = function (a, d) {
        var e = o + a + "/30/" + d, f = b.defer();
        return null != r[e] ? (f.resolve(r[e]), f.promise) : (c.get(e).success(function (a, b, c, d) {
            a.status == SERVER_ERROR_CODE ? f.resolve(null) : (r[e] = a, f.resolve(a))
        }).error(function (a, b, c, d) {
            f.reject(null)
        }), f.promise)
    }, s.queryKanjiJLPT = function (a, d) {
        var e = p + a + "/100/" + d, f = b.defer();
        return null != r[e] ? (f.resolve(r[e]), f.promise) : (c.get(e).success(function (a, b, c, d) {
            a.status == SERVER_ERROR_CODE ? f.resolve(null) : (r[e] = a, f.resolve(a))
        }).error(function (a, b, c, d) {
            f.reject(null)
        }), f.promise)
    };
    var t = function (a, b, c, d) {
        var e = new XMLHttpRequest;
        e.open(a, b), e.setRequestHeader("Content-Type", "application/json"), e.onreadystatechange = function () {
            4 === this.readyState && null != this.responseText && null != d && d(JSON.parse(this.responseText))
        }, null != c ? e.send(JSON.stringify(c)) : e.send()
    };
    return s.sendAltLog = function (a) {
        var b = {entity_id: a};
        t("POST", q, b)
    }, s.sendAltNewsLog = function (a) {
        var b = {news_id: a}, c = "http://alt.mazii.net/ene/news_log";
        t("POST", c, b)
    }, s.sendFeedback = function (a, b, c, d, e, f) {
        var g = "http://alt.mazii.net/ene/feedback",
            h = {entity_id: a, old_category_id: b, new_category_id: c, correct: d, sentence: e};
        t("POST", g, h)
    }, s
}]);
var dictUtilServices = angular.module("mazii.service.util", ["mazii.service.localstore"]);
dictUtilServices.factory("dictUtilSer", ["$q", "$http", "$timeout", "$state", "localstoreServ", "$rootScope", function (a, b, c, d, e, f) {
    function g() {
        null == s && $.ajax({
            type: "GET", url: p, success: function (a, b, c) {
                var d = null;
                d = "string" == typeof a ? JSON.parse(a) : a;
                for (var e = {}, f = 0; f < d.length; f++)e[d[f].w] = d[f].h;
                s = e, 1 == v && h()
            }, error: function (a, b, c) {
            }
        })
    }

    function h() {
        null == t && $.ajax({
            type: "GET", url: q, success: function (a, b, c) {
                t = a, i()
            }, error: function (a, b, c) {
            }
        })
    }

    function i() {
        null == u && $.ajax({
            type: "GET", url: r, success: function (a, b, c) {
                u = a
            }, error: function (a, b, c) {
            }
        })
    }

    function j(a) {
        var b = a.split(",")[0];
        return b.split(";")[0]
    }

    var k = {},
        l = new Array("à", "á", "ạ", "ả", "ã", "â", "ầ", "ấ", "ậ", "ẩ", "ẫ", "ă", "ằ", "ắ", "ặ", "ẳ", "ẵ", "è", "é", "ẹ", "ẻ", "ẽ", "ê", "ề", "ế", "ệ", "ể", "ễ", "ì", "í", "ị", "ỉ", "ĩ", "ò", "ó", "ọ", "ỏ", "õ", "ô", "ồ", "ố", "ộ", "ổ", "ỗ", "ơ", "ờ", "ớ", "ợ", "ở", "ỡ", "ù", "ú", "ụ", "ủ", "ũ", "ư", "ừ", "ứ", "ự", "ử", "ữ", "ỳ", "ý", "ỵ", "ỷ", "ỹ", "đ", "À", "Á", "Ạ", "Ả", "Ã", "Â", "Ầ", "Ấ", "Ậ", "Ẩ", "Ẫ", "Ă", "Ằ", "Ắ", "Ặ", "Ẳ", "Ẵ", "È", "É", "Ẹ", "Ẻ", "Ẽ", "Ê", "Ề", "Ế", "Ệ", "Ể", "Ễ", "Ì", "Í", "Ị", "Ỉ", "Ĩ", "Ò", "Ó", "Ọ", "Ỏ", "Õ", "Ô", "Ồ", "Ố", "Ộ", "Ổ", "Ỗ", "Ơ", "Ờ", "Ớ", "Ợ", "Ở", "Ỡ", "Ù", "Ú", "Ụ", "Ủ", "Ũ", "Ư", "Ừ", "Ứ", "Ự", "Ử", "Ữ", "Ỳ", "Ý", "Ỵ", "Ỷ", "Ỹ", "Đ"),
        m = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        n = [{number: "46", text: "A"}, {number: "31", text: "B"}, {number: "93", text: "C"}, {
            number: "24",
            text: "D"
        }, {number: "37", text: "E"}, {number: "84", text: "F"}, {number: "41", text: "G"}, {
            number: "71",
            text: "H"
        }, {number: "16", text: "I"}, {number: "49", text: "J"}, {number: "52", text: "K"}, {
            number: "59",
            text: "L"
        }, {number: "45", text: "M"}, {number: "96", text: "N"}, {number: "51", text: "O"}, {
            number: "36",
            text: "P"
        }, {number: "95", text: "Q"}, {number: "78", text: "R"}, {number: "74", text: "S"}, {
            number: "19",
            text: "T"
        }, {number: "54", text: "U"}, {number: "42", text: "V"}, {number: "68", text: "W"}, {
            number: "91",
            text: "X"
        }, {number: "62", text: "Y"}, {number: "65", text: "Z"}, {number: "38", text: "a"}, {
            number: "83",
            text: "b"
        }, {number: "88", text: "c"}, {number: "21", text: "d"}, {number: "77", text: "e"}, {
            number: "44",
            text: "f"
        }, {number: "66", text: "g"}, {number: "32", text: "h"}, {number: "56", text: "i"}, {
            number: "92",
            text: "j"
        }, {number: "48", text: "k"}, {number: "34", text: "l"}, {number: "23", text: "m"}, {
            number: "57",
            text: "n"
        }, {number: "69", text: "o"}, {number: "27", text: "p"}, {number: "28", text: "q"}, {
            number: "17",
            text: "r"
        }, {number: "81", text: "s"}, {number: "14", text: "t"}, {number: "67", text: "u"}, {
            number: "79",
            text: "v"
        }, {number: "82", text: "w"}, {number: "26", text: "x"}, {number: "86", text: "y"}, {
            number: "63",
            text: "z"
        }, {number: "18", text: "0"}, {number: "89", text: "1"}, {number: "87", text: "2"}, {
            number: "22",
            text: "3"
        }, {number: "35", text: "4"}, {number: "58", text: "5"}, {number: "13", text: "6"}, {
            number: "99",
            text: "7"
        }, {number: "64", text: "8"}, {number: "55", text: "9"}], o = {
            abbr: "từ viết tắt",
            adj: "tính từ",
            "adj-na": "tính từ đuôi な",
            "adj-no": "danh từ sở hữu cách thêm の",
            "adj-pn": "tính từ đứng trước danh từ",
            "adj-s": "tínhh từ đặc biệt",
            "adj-t": "tính từ đuổi tara",
            adv: "trạng từ",
            "adv-n": "danh từ làm phó từ",
            "adv-to": "trạng từ thêm と",
            arch: "từ cổ",
            ateji: "ký tự thay thế",
            aux: "trợ từ",
            "aux-v": "trợ động từ",
            "aux-adj": "tính từ phụ trợ",
            Buddh: "thuật ngữ phật giáo",
            chn: "ngôn ngữ trẻ em",
            col: "thân mật ngữ",
            comp: "thuật ngữ tin học",
            conj: "liên từ",
            derog: "xúc phạm ngữ",
            ek: "hán tự đặc trưng",
            exp: "cụm từ",
            fam: "từ ngữ thân thuộc",
            fem: "phụ nữ hay dùng",
            food: "thuật ngữ thực phẩm",
            geom: "thuật ngữ hình học",
            gikun: "gikun",
            gram: "thuộc về ngữ pháp",
            hon: "tôn kính ngữ",
            hum: "khiêm nhường ngữ",
            id: "thành ngữ",
            "int": "thán từ",
            iK: "từ chứa kanji bất quy tắc",
            ik: "từ chứa kana bất quy tắc",
            io: "okurigana bất quy tắc",
            iv: "động từ bất quy tắc",
            kyb: "giọng Kyoto",
            ksb: "giọng Kansai",
            ktb: "giọng Kantou",
            ling: "thuật ngữ ngôn ngữ học",
            MA: "thuật ngữ nghệ thuật",
            male: "tiếng lóng của nam giới",
            math: "thuật ngữ toán học",
            mil: "thuật ngữ quân sự",
            "m-sl": "thuật ngữ truyện tranh",
            n: "danh từ",
            "n-adv": "danh từ làm phó từ",
            "n-pref": "danh từ làm tiền tố",
            "n-suf": "danh từ làm hậu tố",
            "n-t": "danh từ chỉ thời gian",
            neg: "thể phủ định",
            "neg-v": "động từ mang nghĩa phủ định",
            ng: "từ trung tính",
            obs: "từ cổ",
            obsc: "từ tối nghĩa",
            oK: "từ chứa kanji cổ",
            ok: "từ chứa kana cổ",
            osk: "Giọng Osaka",
            physics: "thuật ngữ vật lý",
            pol: "thể lịch sự",
            pref: "tiếp đầu ngữ",
            prt: "giới từ",
            qv: "tham khảo mục khác",
            rare: "từ hiếm gặp",
            sl: "tiếng lóng",
            suf: "hậu tố",
            tsb: "giọng Tosa",
            uK: "từ sử dụng kanji đứng một mình",
            uk: "từ sử dụng kana đứng một mình",
            v: "động từ",
            v1: "động từ nhóm 2",
            v5: "động từ nhóm 1",
            v5aru: "động từ nhóm 1 -aru",
            v5b: "động từ nhóm 1 -bu",
            v5g: "động từ nhóm 1 -ku",
            v5k: "động từ nhóm 1 -ku",
            "v5k-s": "động từ nhóm 1 -iku/yuku",
            v5m: "động từ nhóm 1 -mu",
            v5n: "động từ nhóm 1 -nu",
            v5r: "Động từ nhóm 1 -ru",
            "v5r-i": "Động từ nhóm 1 bất quy tắc -ru",
            v5s: "động từ nhóm 1 -su",
            v5t: "động từ nhóm 1 -tsu",
            v5u: "động từ nhóm 1 -u",
            "v5u-s": "động từ nhóm 1 -u (đặc biệt)",
            v5uru: "động từ nhóm 1 -uru",
            vi: "tự động từ",
            vk: "động từ kuru (đặc biệt)",
            vs: "danh từ hoặc giới từ làm trợ từ cho động từ suru",
            "vs-i": "động từ bất quy tắc -suru",
            vt: "tha động từ",
            vulg: "thuật ngữ thô tục",
            vz: "tha động từ",
            X: "thuật ngữ thô tục"
        }, p = "db/kanjimini.json", q = "db/javifastdict.txt", r = "db/vijafastdict.txt", s = null, t = null, u = null,
        v = e.getItem("autocomplete");
    null == v && (v = !0), k.isVietnamese = function (a) {
        for (var b = a.length, c = 0; b > c; c++)if (-1 != l.indexOf(a[c]))return !0;
        return !1
    }, k.capitaliseFirstLetter = function (a) {
        return a.charAt(0).toUpperCase() + a.slice(1)
    }, k.isJapanese = function (a) {
        for (var b = a.length, c = 0; b > c; c++)if (k.isKanji(a.charAt(c)) || k.isHiragana(a.charAt(c)) || k.isKatakan(a.charAt(c)))return !0;
        return !1
    }, k.getKanjiChara = function (a) {
        if (null == a)return "";
        for (var b = "", c = a.length, d = 0; c > d; d++)k.isKanji(a.charAt(d)) && -1 == b.indexOf(a.charAt(d)) && (b += a.charAt(d));
        return b
    }, k.isRomanji = function (a) {
        var b = a.charCodeAt(0);
        return b >= 32 && 126 >= b ? !0 : !1
    }, k.allHiragana = function (a) {
        for (var b = a.length, c = 0; b > c; c++)if (0 == isHiragana(a.charAt(c)))return !1;
        return !0
    }, k.isKanji = function (a) {
        if ("々" == a)return !0;
        var b = a.charCodeAt(0);
        return b >= 19968 && 40895 >= b ? !0 : !1
    }, k.isHiragana = function (a) {
        var b = a.charCodeAt(0);
        return b >= 12352 && 12447 >= b ? !0 : !1
    }, k.isKatakan = function (a) {
        var b = a.charCodeAt(0);
        return b >= 12448 && 12543 >= b ? !0 : !1
    }, k.mergeKanjiAndHiragana = function (a, b) {
        if ("" == a || "" == b || null == a || null == b)return null;
        if (0 == k.isJapanese(a) || 0 == k.isJapanese(b))return null;
        var c = new RegExp(" ", "g");
        -1 != a.indexOf(" ") && (a = a.replace(c, "")), -1 != b.indexOf(" ") && (b = b.replace(c, "")), c = new RegExp("　", "g"), -1 != a.indexOf("　") && (a = a.replace(c, "")), -1 != b.indexOf("　") && (b = b.replace(c, ""));
        for (var d = [], e = "", f = "", g = "", h = 0, i = 0; i < a.length; i++) {
            var j = a.charAt(i);
            if (k.isKanji(j) || k.isKatakan(j)) {
                if ("" == e && "" != f) {
                    var l = new Object;
                    l.k = f, l.h = "", d.push(l), f = "", h += f.length
                }
                e += j
            } else if ("" == e) f += j, h++; else {
                for (g = j; h < b.length;) {
                    if (k.getLengthHiragana(f) < e.length || b.charAt(h) != g) f += b.charAt(h); else if (b.charAt(h) == g) {
                        var l = new Object;
                        l.k = e, l.h = f, d.push(l), e = "", f = j, h++;
                        break
                    }
                    h++
                }
                if (h == b.length && "" != e) {
                    var l = new Object;
                    l.k = e, l.h = f, d.push(l)
                }
                if (h == b.length && i < a.length - 1)return null
            }
        }
        if ("" != e) {
            for (; h < b.length;)f += b.charAt(h), h++;
            var l = new Object;
            l.k = e, l.h = f, d.push(l)
        } else if ("" != f) {
            var l = new Object;
            l.k = f, l.h = "", d.push(l)
        }
        return d
    }, k.getLengthHiragana = function (a) {
        if (null == a || 0 == a.length)return 0;
        for (var b = 0, c = 0; c < a.length; c++) {
            var d = a.charAt(c);
            "ん" != d && "ぁ" != d && "ぃ" != d && "ぇ" != d && "ぅ" != d && "ぉ" != d && "ゅ" != d && "ょ" != d && b++
        }
        return b
    }, k.removeJapaneseChar = function (a) {
        if (null == a)return "";
        for (var b = "", c = 0; c < a.length; c++)k.isJapanese(a[c]) || "～" == a[c] || "、" == a[c] || "　" == a[c] || ":" == a[c] || "：" == a[c] || "（" == a[c] || "。" == a[c] || "）" == a[c] || (b += a[c]);
        return b = b.trim()
    };
    var w = {
        vs: ["する", "した", "しない", "し", "して", "できる", "される", "させる", "すれば", "しろ", "しよう"],
        vk: ["くる", "きた", "きない", "き", "きて", "来られる", "来られる", "来させる", "くれば", "こい", "こよう"],
        v5u: ["う", "った", "わない", "い", "って", "える", "われる", "わせる", "えば", "え", "おう"],
        "v5u-s": ["う", "うた", "わない", "い", "うて", "える", "われる", "わせる", "えば", "え", "おう"],
        v5k: ["く", "いた", "かない", "き", "いて", "ける", "かれる", "かせる", "けば", "け", "こう"],
        "v5k-s": ["く", "った", "かない", "き", "って", "ける", "かれる", "かせる", "けば", "け", "こう"],
        v5g: ["ぐ", "いだ", "がない", "ぎ", "いで", "げる", "がれる", "がせる", "げば", "げ", "ごう"],
        v5s: ["す", "した", "さない", "し", "して", "せる", "される", "させる", "せば", "せ", "そう"],
        v5t: ["つ", "った", "たない", "ち", "って", "てる", "たれる", "たせる", "てば", "て", "とう"],
        v5n: ["ぬ", "んだ", "なない", "に", "んで", "ねる", "なれる", "なせる", "ねば", "ね", "のう"],
        v5b: ["ぶ", "んだ", "ばない", "び", "んで", "べる", "ばれる", "ばせる", "べば", "べ", "ぼう"],
        v5m: ["む", "んだ", "まない", "み", "んで", "める", "まれる", "ませる", "めば", "め", "もう"],
        v5r: ["る", "った", "らない", "り", "って", "れる", "られる", "らせる", "れば", "れ", "ろう"],
        "v5r-i": ["る", "った", "", "り", "って", "ありえる", "", "らせる", "れば", "れる", "ろう"],
        v5aru: ["る", "った", "らない", "い", "って", "りえる", "", "", "", "い", ""],
        v1: ["る", "た", "ない", "-", "て", "られる", "られる", "させる", "れば", "いろ", "よう"]
    };
    return k.getConjugationTableOfVerb = function (a, b, c) {
        -1 != b.indexOf("「") && (b = b.replace("「", ""), b = b.replace("」", ""));
        var d = w[c];
        if (null == d)return null;
        b = b.split(" ")[0], -1 == a.indexOf(d[0]) && (a += d[0], b += d[0]);
        var e = {};
        e.base = {}, e.base.word = a + "/" + b, e.base.name = "Từ điển (辞書)", a == b && (e.base.word = a);
        var f = new RegExp(d[0] + "$");
        if (e.past = {}, e.past.word = a.replace(f, d[1]), e.past.name = "Quá khứ (た)", "" != d[2] ? (e.nagative = {}, e.nagative.word = a.replace(f, d[2]), e.nagative.name = "Phủ định (未然)") : (e.nagative = {}, -1 != a.indexOf("する") ? e.nagative.word = a.replace("する", "しない") : -1 != a.indexOf("くる") && (e.nagative.word = a.replace("くる", "こない")), e.nagative.name = "Phủ định (未然)"), "" != d[3] && (e.polite = {}, "-" == d[3] ? e.polite.word = a.replace(f, "") + "ます" : e.polite.word = a.replace(f, d[3]) + "ます", e.polite.name = "Lịch sự (丁寧)"), "" != d[4] && (e.te = {}, e.te.word = a.replace(f, d[4]), e.te.name = "te (て)"), "" != d[5] && (e.potential = {}, e.potential.word = a.replace(f, d[5]), e.potential.name = "Khả năng (可能)"), "" != d[6] && (e.passive = {}, e.passive.word = a.replace(f, d[6]), e.passive.name = "Thụ động (受身)"), "" != d[7] && (e.causative = {}, e.causative.word = a.replace(f, d[7]), e.causative.name = "Sai khiến (使役)"), "" != d[6] && "" != d[7]) {
            var g = w.v1, h = new RegExp(g[0] + "$");
            e.cau_pass = {}, e.cau_pass.word = e.causative.word.replace(h, d[6]), e.cau_pass.name = "Sai khiến thụ động (使役受身)"
        }
        return "" != d[8] && (e.conditional = {}, e.conditional.word = a.replace(f, d[8]), e.conditional.name = "Điều kiện (条件)"), "" != d[9] && (e.imperative = {}, e.imperative.word = a.replace(f, d[9]), e.imperative.name = "Mệnh lệnh (命令)"), "" != d[10] && (e.volitional = {}, e.volitional.word = a.replace(f, d[10]), e.volitional.name = "Ý chí (意向)"), e.prohibition = {}, e.prohibition.word = a + "な", e.prohibition.name = "Cấm chỉ(禁止)", e
    }, k.convertKindToReadable = function (a) {
        var b = [];
        if (-1 != a.indexOf(",")) {
            b = a.split(",");
            for (var c = 0; c < b.length; c++)b[c] = b[c].trim()
        } else b.push(a);
        for (var d = "", c = 0; c < b.length; c++)d += o.hasOwnProperty(b[c]) ? o[b[c]] : b[c], c != b.length - 1 && (d += ", ");
        return d
    }, k.getHVOfKey = function (a) {
        if (null == a || a.length >= 5)return "";
        if (null == s)return "";
        for (var b = "", c = 0; c < a.length; c++)if (k.isKanji(a[c])) {
            var d = s[a[c]];
            null != d && ("" != b && (b += " "), b += j(d))
        }
        return b
    }, k.sortHVDataByKeyWord = function (a, b) {
        for (var c = new Array, d = 0, e = 0; e < a.length; e++)for (var f = 0; f < b.length; f++)if (a[e] == b[f].kanji) {
            for (var g = !1, h = 0; h < c.length; h++)if (c[h].kanji == a[e]) {
                g = !0;
                break
            }
            0 == g && (c[d] = b[f], d++)
        }
        return c
    }, k.realtimeSearch = function (a, b) {
        var c = t, d = !0;
        "vi" == a && (c = u, d = !1);
        var e = null, f = b.length, g = new RegExp('"([^"]*' + b + '[^"]*)"', "gi"), h = 0, i = [], j = 4;
        for (f > 4 ? j = 16 : f > 6 && (j = 20); e = g.exec(c);) {
            var k = e[1], l = "";
            if (d) {
                for (var m = k.split(" "), l = m[0], n = 0; n < m.length && -1 == l.indexOf(b);)n++, l = m[n];
                if (l.length - f > j)continue
            } else if (l = k, l.length - f > j)continue;
            if (l == b ? i.splice(0, 0, k) : i.push(k), h += 1, h >= 150)break
        }
        for (var o = [], h = 0; 30 > h && h < i.length; h++)o.push(i[h]);
        return o
    }, k.sortResultSuggest = function (a, b) {
        if (null == a)return null;
        for (var c = a.length, d = 0; c > d; d++)for (var e = d + 1; c > e; e++);
    }, k.convertStrToInt = function (a) {
        if (null == a)return 0;
        for (var b = 0, c = a.length - 1, d = 1; c >= 0;)b += a.charCodeAt(c) * d, c--, d *= 10;
        return b
    }, k.generateSuggest = function (a, b) {
        if (null == a || 0 == a.length)return "";
        for (var c = '<div class="item suggest" ng-click="suggestClick({{item}})"><span><b>{{ item.split(" ")[0] }}</b> {{ item.replace(item.split(" ")[0], "") }} </span></div>', d = '<div class="list">', e = {
            item: "",
            suggestClick: b
        }, f = 0; f < a.length; f++)e.item = a[f], d += $interpolate(c)(e);
        return d += "</div>"
    }, k.closePanel = function () {
        $(".menu-left").removeClass("open-menu-left"), $(".history-panel").removeClass("open-history-panel"), $(".setting-panel").removeClass("open-setting-panel"), $(".cover").css("display", "none"), $("body").css("overflow", "auto")
    }, k.showTitlePage = function () {
        $(".title-page").removeClass("hidden-title")
    }, k.hiddenTitlePage = function () {
        $(".title-page").addClass("hidden-title")
    }, k.checkExistNewlineinMessage = function (a) {
        return a.content.indexOf("\n")
    }, k.renderHtmlMessage = function (a) {
        return a.content.split("\n")
    }, k.renderHtmlMessagePrivate = function (a) {
        return a.message.split("\n")
    }, k.renderHtmlListMessage = function (a) {
        for (var b = a.length, c = 0; b > c; c++) {
            var d = k.renderHtmlMessage(a[c]);
            d.length > 1 && (a[c].newLine = !0, a.content = d)
        }
        return a
    }, k.safeApply = function (a) {
        var b = a.$root.$$phase;
        "$apply" == b || "$digest" == b || a.$digest()
    }, k.getDataSurvay = function () {
        var c = a.defer();
        return b.get("db/survay.json").success(function (a, b, d, e) {
            return c.resolve(a)
        }).error(function (a, b, d, e) {
            return c.resolve(null)
        }), c.promise
    }, k.shuffleArray = function (a) {
        for (var b, c, d = a.length; d;)c = Math.floor(Math.random() * d--), b = a[d], a[d] = a[c], a[c] = b;
        return a
    }, k.getAffilate = function () {
        var c = a.defer();
        return b.get("db/affilate.json").then(function (a) {
            var b = a.data, d = [];
            b.forEach(function (a) {
                if (null != a && 0 != a.running) {
                    var b = a;
                    b.link = [], "undefined" != typeof b.code300_1 && null != b.code300_1 && b.link.push(b.code300_1), "undefined" != typeof b.code300_2 && null != b.code300_2 && b.link.push(b.code300_2), "undefined" != typeof b.code300_3 && null != b.code300_3 && b.link.push(b.code300_3), "undefined" != typeof b.code300_4 && null != b.code300_4 && b.link.push(b.code300_4), k.shuffleArray(b.link), d.push(b)
                }
            }), c.resolve(d)
        }), c.promise
    }, k.getCurrentTime = function () {
        var a = new Date, b = a.getMonth() + 1;
        return a.getSeconds() + "/" + a.getMinutes() + "/" + a.getHours() + "/" + a.getDate() + "/" + b + "/" + a.getFullYear()
    }, k.paginationReportMean = function (a, b) {
        if (null == b)return [];
        var c = b.length, d = [], e = a * PAGINATION_REPORT_MEAN, f = e + PAGINATION_REPORT_MEAN, g = !1, h = !1;
        g = 0 == a ? !1 : !0, h = (a + 1) * PAGINATION_REPORT_MEAN >= c ? !1 : !0, f > c && (f = c);
        for (var i = e; f > i; i++)d.push(b[i]);
        return {result: d, showNextLast: h, showPreviousLast: g}
    }, k.generationIndexPagination = function (a) {
        if (null == a)return [];
        for (var b = [], c = a.length, d = Math.floor(c / PAGINATION_REPORT_MEAN), e = 0; d > e; e++)b.push(e + 1);
        return b
    }, k.showInformationUser = function () {
        setTimeout(function () {
            $(".btn-acount").addClass("not-hide")
        }, 200)
    }, k.randomString = function (a) {
        for (var b = "", c = 0; a > c; c++)b += m.charAt(Math.floor(Math.random() * m.length));
        return b
    }, k.encodeToken = function (a, b) {
        for (var c = "", d = k.randomNumber(10), e = b.substr(0, d), f = b.substr(-(b.length - d)), g = e + a + f, h = g.length, i = 0; h > i; i++) {
            var j = g[i], l = k.renderNumberfromChar(j);
            c += l
        }
        return c += d
    }, k.randomNumber = function (a) {
        return Math.floor(Math.random() * a + 1)
    }, k.renderNumberfromChar = function (a) {
        for (var b = n.length, c = 0; b > c; c++)if (n[c].text == a)return n[c].number;
        return ""
    }, k.beautifulString = function (a, b) {
        return a.length > b ? a.substring(0, b - 3) + "..." : a
    }, k.renderHtmlReport = function (a) {
        return a.split("\n")
    }, k.convertJptoHex = function (a) {
        if (null == a || "" == a)return "";
        -1 != a.indexOf("「") && (a = a.replace(new RegExp("「", "g"), ""), a = a.replace(new RegExp("」", "g"), "")), a = a.trim();
        for (var b = "", c = 0; c < a.length; c++)b += ("0000" + a.charCodeAt(c).toString(16)).substr(-4), c != a.length - 1 && (b += "_");
        return b
    }, g(), k
}]);
var authServ = angular.module("mazii.service.auth", []);
authServ.factory("authServ", ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", function (a, b, c, d, e, f) {
    function g() {
        var a = b.defer();
        return FB.api("/me", function (b) {
            var c = b.email;
            ("undefined" == typeof c || null == c || "" == c) && (b.email = b.id + "@gmail.com"), a.resolve(b)
        }), a.promise
    }

    var h = {};
    return h.loginFacebook = function () {
        var a = b.defer();
        return FB.login(function (b) {
            "connected" === b.status ? g().then(function (b) {
                a.resolve(b)
            }) : a.resolve(null)
        }), a.promise
    }, h.logoutFacebook = function () {
        FB.logout()
    }, h.init = function () {
        FB.getLoginStatus(function (b) {
            "connected" === b.status ? g().then(function (b) {
                var c = b.email;
                (null == c || "" == c) && (b.email = b.id + "@gmail.com"), a.user = b, a.$broadcast("loadFBDone")
            }) : a.$broadcast("loadFBDone")
        })
    }, h
}]);
var baseUrlApi = "http://api.mazii.net/", userSerive = angular.module("mazii.service.user", []);
userSerive.factory("userServ", ["$http", "$q", "cookieServ", "$rootScope", "localstoreServ", "dictUtilSer", "encryptionServ", function (a, b, c, d, e, f, g) {
    var h = {};
    h.init = function () {
        var d = b.defer(), e = c.getCookie("tokenId");
        e = g.decode(e);
        var h = new Date, i = (h.getTimezoneOffset(), h.getTime() - 6e4 * h.getTimezoneOffset());
        i = i.toString();
        var j = f.randomString(50), k = f.encodeToken(e + i, j);
        if (null == e || "" == e) d.resolve(null); else {
            var l = baseUrlApi + "api/init-login", m = {tokenId: k};
            a.post(l, m).success(function (a) {
                d.resolve(a)
            })
        }
        return d.promise
    }, h.login = function (c, d) {
        var e = b.defer(), f = baseUrlApi + "api/login", g = {email: c.trim(), password: d.trim()};
        return a.post(f, g).success(function (a) {
            e.resolve(a)
        }), e.promise
    }, h.logout = function () {
        c.setCookie("tokenId", ""), e.deleteItem("note"), e.deleteItem("grammar"), e.deleteItem("categoryNote"), d.user = null
    }, h.logoutAll = function () {
        var c = b.defer(), e = d.user.email, f = baseUrlApi + "api/logout";
        if (null != e) {
            var g = {email: e};
            return a.post(f, g).success(function (a) {
                c.resolve(a)
            }), c.promise
        }
    }, h.register = function (c, d) {
        var e = b.defer(), f = baseUrlApi + "api/register", g = {email: c.trim(), password: d.trim()};
        return a.post(f, g).success(function (a) {
            e.resolve(a)
        }), e.promise
    }, h.changePassword = function (c, e) {
        var f = b.defer();
        if (null == d.user || null == d.user.email)return f.resolve(!1), f.promise;
        var g = d.user.email, h = baseUrlApi + "api/change-password", i = {passwordOld: c, passwordNew: e, email: g};
        return a.post(h, i).success(function (a) {
            f.resolve(a)
        }), f.promise
    }, h.resetPassword = function (c) {
        var d = b.defer(), e = baseUrlApi + "api/reset-password", f = {email: c};
        return a.post(e, f).success(function (a) {
            d.resolve(a)
        }), d.promise
    }, h.resetPasswordReally = function (c, d) {
        var e = b.defer(), f = baseUrlApi + "api/reset-password-really", g = {email: c, password: d};
        return a.post(f, g).success(function (a) {
            e.resolve(a)
        }), e.promise
    }, h.addMeanUser = function (c, d, e, f) {
        var g = b.defer(), h = baseUrlApi + "api/add-mean", i = {userId: c, mean: d, wordId: e, word: f};
        return a.post(h, i).success(function (a) {
            g.resolve(a)
        }), g.promise
    }, h.getMeanById = function (c) {
        var d = b.defer(), e = baseUrlApi + "api/get-mean", f = {wordId: c};
        return a.post(e, f).success(function (a) {
            d.resolve(a)
        }), d.promise
    }, h.updateMeanUser = function (c, d, e, f) {
        var g = b.defer(), h = baseUrlApi + "api/update-mean", i = {wordId: e, userId: c, mean: d, word: f};
        return a.post(h, i).success(function (a) {
            g.resolve(a)
        }), g.promise
    }, h.rateMean = function (c, d, e) {
        var f = b.defer(), g = baseUrlApi + "api/rate-mean", h = {reportId: c, userId: d, type: e};
        return a.post(g, h).success(function (a) {
            f.resolve(a)
        }), f.promise
    }, h.checkMean = function (c, d) {
        var e = b.defer(), f = baseUrlApi + "api/check-mean", g = {wordId: c, userId: d};
        return a.post(f, g).success(function (a) {
            e.resolve(a)
        }), e.promise
    }, h.deleteMean = function (c, d) {
        var e = b.defer(), f = baseUrlApi + "api/delete-mean", g = {userId: c, reportId: d};
        return a.post(f, g).success(function (a) {
            e.resolve(a)
        }), e.promise
    }, h.changeUsername = function (c, d) {
        var e = b.defer(), f = baseUrlApi + "api/change-username", g = {email: c, username: d};
        return a.post(f, g).success(function (a) {
            e.resolve(a)
        }), e.promise
    }, h.initGetRateMean = function () {
        var c = b.defer();
        if (null == d.user)return c.resolve([]), c.promise;
        var e = d.user.userId, f = baseUrlApi + "api/get-rate", g = {userId: e};
        return a.post(f, g).success(function (a) {
            200 == a.status ? c.resolve(a.result) : c.resolve([])
        }), c.promise
    }, h.changeDataRateinLocal = function (a) {
        var b = e.getItem("rateMean");
        if (null == b || 0 == b.length) b = [], b.push(a); else {
            var c = b.length, d = !1;
            "like" == a.type ? a.type = 1 : a.type = 0;
            for (var f = 0; c > f; f++)if (b[f].reportId == a.reportId) {
                b[f] = a, d = !0;
                break
            }
            d || b.push(a)
        }
        e.setItem("rateMean", b)
    }, h.activeButtonLike = function (a) {
        var b = a.length, c = e.getItem("rateMean");
        null == c && (c = []);
        for (var d = c.length, f = [], g = 0; b > g; g++)for (var h = 0; d > h; h++)c[h].reportId == a[g].reportId && f.push({
            reportId: c[h].reportId,
            type: c[h].type
        });
        return f
    }, h.getDataMyNote = function (c) {
        var d = b.defer(), e = baseUrlApi + "api/get-mynote", f = {userId: c};
        return a.post(e, f).success(function (a) {
            d.resolve(a)
        }), d.promise
    }, h.getCategory = function (a) {
        var c = b.defer(), d = baseUrlApi + "api/get-category/" + a + "/100";
        return i("GET", d, null, function (a) {
            c.resolve(a)
        }), c.promise
    }, h.getNote = function (a, c) {
        var d = b.defer(), e = baseUrlApi + "api/get-note/" + a + "/" + c + "/100";
        return i("GET", e, null, function (a) {
            d.resolve(a)
        }), d.promise
    }, h.addCategory = function (c, d, e) {
        var f = b.defer(), g = baseUrlApi + "api/add-category", h = {userId: c, date: e, categoryName: d};
        return a.post(g, h).success(function (a) {
            f.resolve(a)
        }), f.promise
    }, h.addNote = function (c) {
        var d = b.defer(), e = baseUrlApi + "api/add-note";
        "grammar_detail" != c.type && (c.idx = "-1");
        var f = {
            noteName: c.noteName,
            noteMean: c.noteMean,
            categoryId: c.categoryId,
            type: c.type,
            date: c.date,
            idx: c.idx
        };
        return a.post(e, f).success(function (a) {
            d.resolve(a)
        }), d.promise
    }, h.deleteCategory = function (c, d) {
        var e = b.defer(), f = baseUrlApi + "api/delete-category", g = {userId: c, categoryId: d};
        return a.post(f, g).success(function (a) {
            e.resolve(a)
        }), e.promise
    }, h.deleteNote = function (c) {
        var d = b.defer(), e = baseUrlApi + "api/delete-note", f = {noteId: c};
        return a.post(e, f).success(function (a) {
            d.resolve(a)
        }), d.promise
    }, h.pushCategoryafterGetServer = function (a) {
        var b = a.length, c = [];
        if (0 != b) {
            for (var d = 0; b > d; d++) {
                var f = a[d], g = {category: f.categoryName, date: f.date, categoryId: f.categoryId};
                c.push(g)
            }
            e.setItem("categoryNote", c)
        }
    }, h.rememberFlash = function (c, d, e) {
        var f = b.defer(), g = baseUrlApi + "api/remember-flash", h = {userId: c, wordId: d, type: e};
        return a.post(g, h).success(function (a) {
            f.resolve(a)
        }), f.promise
    }, h.noRememberFlash = function (c, d, e) {
        var f = b.defer(), g = baseUrlApi + "api/forget-flash", h = {userId: c, wordId: d, type: e};
        return a.post(g, h).success(function (a) {
            f.resolve(a)
        }), f.promise
    }, h.getListRemember = function (c, d) {
        var e = b.defer(), f = baseUrlApi + "api/get-flashcard", g = {userId: c, type: d};
        return a.post(f, g).success(function (a) {
            e.resolve(a)
        }), e.promise
    }, h.getNewMean = function (c) {
        var d = b.defer(), e = baseUrlApi + "api/get-new", f = {skip: 10 * c, take: 10};
        return a.post(e, f).success(function (a) {
            d.resolve(a)
        }), d.promise
    }, h.pushNoteafterGetServer = function (a) {
        var b = a.length, c = [], d = [];
        if (0 != b) {
            for (var f = 0; b > f; f++) {
                var g = a[f];
                if ("grammar_detail" == g.type) {
                    var h = {
                        date: g.date,
                        query: g.noteName,
                        mean: g.noteMean,
                        type: g.type,
                        id: g.noteId,
                        idx: g.idx,
                        category: g.cateId
                    };
                    d.push(h)
                } else {
                    var i = {
                        date: g.date,
                        query: g.noteName,
                        mean: g.noteMean,
                        type: g.type,
                        id: g.noteId,
                        category: g.cateId
                    };
                    c.push(i)
                }
            }
            e.setItem("note", c), e.setItem("grammar", d)
        }
    };
    var i = function (a, b, d, e) {
        var f = new XMLHttpRequest;
        f.open(a, b);
        var h = c.getCookie("tokenId");
        h = g.decode(h), f.setRequestHeader("Content-Type", "application/json"), f.setRequestHeader("Authorization", h), f.onreadystatechange = function () {
            4 === this.readyState && null != this.responseText && null != e && e(JSON.parse(this.responseText))
        }, null != d ? f.send(JSON.stringify(d)) : f.send()
    };
    return h
}]);
var localstoreSerive = angular.module("mazii.service.cookie", []), TIME_SAVE = 365;
localstoreSerive.factory("cookieServ", [function () {
    var a = {};
    return a.setCookie = function (a, b) {
        var c = new Date;
        c.setTime(c.getTime() + 24 * TIME_SAVE * 60 * 60 * 1e3);
        var d = "expires=" + c.toUTCString();
        document.cookie = a + "=" + b + "; " + d
    }, a.getCookie = function (a) {
        for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
            for (var e = c[d]; " " == e.charAt(0);)e = e.substring(1);
            if (0 == e.indexOf(b))return e.substring(b.length, e.length)
        }
        return ""
    }, a
}]);
var encryptionSerive = angular.module("mazii.service.encryption", []);
encryptionSerive.factory("encryptionServ", ["$crypto", function (a) {
    var b = {}, c = ["#$&AhcHkgh@0gfk!&1LK"], d = c[0];
    return b.encode = function (b) {
        return a.encrypt(b, d)
    }, b.decode = function (b) {
        return a.decrypt(b, d)
    }, b
}]);
var spamServices = angular.module("mazii.service.spam", []);
spamServices.factory("filterSpamSer", ["$q", "$http", "$timeout", "$state", "localstoreServ", "$rootScope", function (a, b, c, d, e, f) {
    var g = {}, h = ["con mẹ"], i = h.length;
    return g.filterSpamReport = function (a) {
        for (var b = 0; i > b; b++) {
            var c = h[b];
            if (-1 != a.indexOf(c))return !0
        }
        return !1
    }, g
}]);
var categor = angular.module("mazii.service.category", []);
categor.factory("categoryServ", ["$rootScope", "$q", "$http", "$timeout", "$stateParams", "$state", function (a, b, c, d, e, f) {
    var g = {}, h = [{id: -1, jp_name: "None", en_name: "None", vi_name: "Không thuộc chủ đề nào"}, {
        id: 1,
        jp_name: "名前_その他",
        en_name: "Name_Other",
        vi_name: "Tên (nói chung)"
    }, {id: 2, jp_name: "人名", en_name: "Person", vi_name: "Tên người"}, {
        id: 3,
        jp_name: "神名",
        en_name: "God",
        vi_name: "Thánh thần"
    }, {id: 4, jp_name: "組織名_その他", en_name: "Organization_Other", vi_name: "Tên tổ chức (nói chung)"}, {
        id: 5,
        jp_name: "国際組織名",
        en_name: "International_Organization",
        vi_name: "Tổ chức quốc tế"
    }, {id: 6, jp_name: "公演組織名", en_name: "Show_Organization", vi_name: "Đoàn nghệ thuật"}, {
        id: 7,
        jp_name: "家系名",
        en_name: "Family",
        vi_name: "Gia tộc"
    }, {id: 8, jp_name: "民族名_その他", en_name: "Ethnic_Group_Other", vi_name: "Dân tộc"}, {
        id: 9,
        jp_name: "国籍名",
        en_name: "Nationality",
        vi_name: "Quốc tịch"
    }, {id: 10, jp_name: "競技組織名_その他", en_name: "Sports_Organization_Other", vi_name: "Đội thể thao"}, {
        id: 11,
        jp_name: "プロ競技組織名",
        en_name: "Pro_Sports_Organization",
        vi_name: "Đội thể thao chuyên nghiệp"
    }, {id: 12, jp_name: "競技リーグ名", en_name: "Sports_League", vi_name: "Giải đấu thể thao"}, {
        id: 13,
        jp_name: "法人名_その他",
        en_name: "Corporation_Other",
        vi_name: "Pháp nhân"
    }, {id: 14, jp_name: "企業名", en_name: "Company", vi_name: "Công ty"}, {
        id: 15,
        jp_name: "企業グループ名",
        en_name: "Company_Group",
        vi_name: "Tập đoàn"
    }, {id: 16, jp_name: "政治的組織名_その他", en_name: "Political_Organization_Other", vi_name: "Tổ chức chính trị"}, {
        id: 17,
        jp_name: "政府組織名",
        en_name: "Government",
        vi_name: "Tổ chức chính phủ"
    }, {id: 18, jp_name: "政党名", en_name: "Political_Party", vi_name: "Chính đảng"}, {
        id: 19,
        jp_name: "内閣名",
        en_name: "Cabinet",
        vi_name: "Chính đảng"
    }, {id: 20, jp_name: "軍隊名", en_name: "Military", vi_name: "Quân đội"}, {
        id: 21, jp_name: "地名_その他", en_name: "Location_Other", vi_name: "Địa danh"
    }, {id: 22, jp_name: "温泉名", en_name: "Spa", vi_name: "Suối nước nóng"}, {
        id: 23,
        jp_name: "GPE_その他",
        en_name: "GPE_Other",
        vi_name: "Thực thể địa chính"
    }, {id: 24, jp_name: "市区町村名", en_name: "City", vi_name: "Quận huyện"}, {
        id: 25,
        jp_name: "郡名",
        en_name: "County",
        vi_name: "Làng"
    }, {id: 26, jp_name: "都道府県州名", en_name: "Province", vi_name: "Tỉnh thành"}, {
        id: 27,
        jp_name: "国名",
        en_name: "Country",
        vi_name: "Đất nước"
    }, {id: 28, jp_name: "地域名_その他", en_name: "Region_Other", vi_name: "Vùng miền"}, {
        id: 29,
        jp_name: "大陸地域名",
        en_name: "Continental_Region",
        vi_name: "Châu lục"
    }, {id: 30, jp_name: "国内地域名", en_name: "Domestic_Region", vi_name: "Vùng địa phương"}, {
        id: 31,
        jp_name: "地形名_その他",
        en_name: "Geological_Region_Other",
        vi_name: "Địa hình"
    }, {id: 32, jp_name: "山地名", en_name: "Mountain", vi_name: "Núi"}, {
        id: 33,
        jp_name: "島名",
        en_name: "Island",
        vi_name: "Đảo"
    }, {id: 34, jp_name: "河川名", en_name: "River", vi_name: "Sông ngòi"}, {
        id: 35,
        jp_name: "湖沼名",
        en_name: "Lake",
        vi_name: "Hồ"
    }, {id: 36, jp_name: "海洋名", en_name: "Sea", vi_name: "Biển"}, {
        id: 37,
        jp_name: "湾名",
        en_name: "Bay",
        vi_name: "Vịnh"
    }, {id: 38, jp_name: "天体名_その他", en_name: "Astral_Body_Other", vi_name: "Thiên thể"}, {
        id: 39,
        jp_name: "恒星名",
        en_name: "Star",
        vi_name: "Mặt trời (Sao)"
    }, {id: 40, jp_name: "惑星名", en_name: "Planet", vi_name: "Hành tinh"}, {
        id: 41,
        jp_name: "星座名",
        en_name: "Constellation",
        vi_name: "Chòm sao"
    }, {id: 42, jp_name: "アドレス_その他", en_name: "Address_Other", vi_name: "Địa chỉ"}, {
        id: 43,
        jp_name: "郵便住所",
        en_name: "Postal_Address",
        vi_name: "Địa chỉ bưu điện"
    }, {id: 44, jp_name: "電話番号", en_name: "Phone_Number", vi_name: "Số điện thoại"}, {
        id: 45,
        jp_name: "電子メイル",
        en_name: "Email",
        vi_name: "Địa chỉ email"
    }, {id: 46, jp_name: "URL", en_name: "URL", vi_name: "URL"}, {
        id: 47,
        jp_name: "施設名_その他",
        en_name: "Facility_Other",
        vi_name: "Kiến trúc"
    }, {id: 48, jp_name: "施設部分名", en_name: "Facility_Part", vi_name: "Bộ phận của kiến trúc"}, {
        id: 49,
        jp_name: "遺跡名_その他",
        en_name: "Archaeological_Place_Other",
        vi_name: "Di tích"
    }, {id: 50, jp_name: "古墳名", en_name: "Tumulus", vi_name: "Mộ cổ"}, {
        id: 51,
        jp_name: "GOE_その他",
        en_name: "GOE_Other",
        vi_name: "Thực thể hành chính"
    }, {id: 52, jp_name: "公共機関名", en_name: "Public_Institution", vi_name: "Cơ quan công cộng"}, {
        id: 53,
        jp_name: "学校名",
        en_name: "School",
        vi_name: "Trường học"
    }, {id: 54, jp_name: "研究機関名", en_name: "Research_Institute", vi_name: "Viện nghiên cứu"}, {
        id: 55,
        jp_name: "取引所名",
        en_name: "Market",
        vi_name: "Sở giao dịch, chợ"
    }, {id: 56, jp_name: "公園名", en_name: "Park", vi_name: "Công viên"}, {
        id: 57,
        jp_name: "競技施設名",
        en_name: "Sports_Facility",
        vi_name: "Nơi thi đấu thể thao"
    }, {id: 58, jp_name: "美術博物館名", en_name: "Museum", vi_name: "Bảo tàng"}, {
        id: 59,
        jp_name: "動植物園名",
        en_name: "Zoo",
        vi_name: "Sở thú, vườn cây"
    }, {id: 60, jp_name: "遊園施設名", en_name: "Amusement_Park", vi_name: "Công viên giải trí"}, {
        id: 61,
        jp_name: "劇場名",
        en_name: "Theater",
        vi_name: "Nhà hát"
    }, {id: 62, jp_name: "神社寺名", en_name: "Worship_Place", vi_name: "Nơi thờ cúng"}, {
        id: 63,
        jp_name: "停車場名",
        en_name: "Car_Stop",
        vi_name: "Bến xe"
    }, {id: 64, jp_name: "電車駅名", en_name: "Station", vi_name: "Ga tàu"}, {
        id: 65,
        jp_name: "空港名",
        en_name: "Airport",
        vi_name: "Sân bay"
    }, {id: 66, jp_name: "港名", en_name: "Port", vi_name: "Cảng"}, {
        id: 67,
        jp_name: "路線名_その他",
        en_name: "Line_Other",
        vi_name: "Tuyến đường"
    }, {id: 68, jp_name: "電車路線名", en_name: "Railroad", vi_name: "Đường sắt"}, {
        id: 69,
        jp_name: "道路名",
        en_name: "Road",
        vi_name: "Đường bộ"
    }, {id: 70, jp_name: "運河名", en_name: "Canal", vi_name: "Kênh đào"}, {
        id: 71,
        jp_name: "航路名",
        en_name: "Water_Route",
        vi_name: "Đường thuỷ"
    }, {id: 72, jp_name: "トンネル名", en_name: "Tunnel", vi_name: "Hầm đường bộ"}, {
        id: 73,
        jp_name: "橋名",
        en_name: "Bridge",
        vi_name: "Cầu"
    }, {id: 74, jp_name: "製品名_その他", en_name: "Product_Other", vi_name: "Sản phẩm"}, {
        id: 75,
        jp_name: "材料名",
        en_name: "Material",
        vi_name: "Chất liệu"
    }, {id: 76, jp_name: "衣類名", en_name: "Clothing", vi_name: "Quần áo"}, {
        id: 77,
        jp_name: "貨幣名",
        en_name: "Money_Form",
        vi_name: "Tiền tệ"
    }, {id: 78, jp_name: "医薬品名", en_name: "Drug", vi_name: "Thuốc men"}, {
        id: 79,
        jp_name: "武器名",
        en_name: "Weapon",
        vi_name: "Vũ khí"
    }, {id: 80, jp_name: "株名", en_name: "Stock", vi_name: "Cổ phiếu"}, {
        id: 81,
        jp_name: "賞名",
        en_name: "Award",
        vi_name: "Giải thưởng"
    }, {id: 82, jp_name: "勲章名", en_name: "Decoration", vi_name: "Huân huy chương"}, {
        id: 83,
        jp_name: "罪名",
        en_name: "Offense",
        vi_name: "Tội phạm"
    }, {id: 84, jp_name: "便名", en_name: "Service", vi_name: "Tên chuyến (tàu, xe, máy bay)"}, {
        id: 85,
        jp_name: "等級名",
        en_name: "Class",
        vi_name: "Tên đẳng cấp"
    }, {id: 86, jp_name: "キャラクター名", en_name: "Character", vi_name: "Nhân vật"}, {
        id: 87,
        jp_name: "識別番号",
        en_name: "ID_Number",
        vi_name: "Nhân vật"
    }, {id: 88, jp_name: "乗り物名_その他", en_name: "Vehicle_Other", vi_name: "Nhân vật"}, {
        id: 89,
        jp_name: "車名",
        en_name: "Car",
        vi_name: "Nhân vật"
    }, {id: 90, jp_name: "列車名", en_name: "Train", vi_name: "Đoàn tàu"}, {
        id: 91,
        jp_name: "飛行機名",
        en_name: "Aircraft",
        vi_name: "Máy bay"
    }, {id: 92, jp_name: "宇宙船名", en_name: "Spaceship", vi_name: "Tàu vũ trụ"}, {
        id: 93,
        jp_name: "船名",
        en_name: "Ship",
        vi_name: "Tàu thuyền"
    }, {id: 94, jp_name: "食べ物名_その他", en_name: "Food_Other", vi_name: "Thức ăn"}, {
        id: 95,
        jp_name: "料理名",
        en_name: "Dish",
        vi_name: "Món ăn"
    }, {id: 96, jp_name: "芸術作品名_その他", en_name: "Art_Other", vi_name: "Tác phẩm nghệ thuật"}, {
        id: 97,
        jp_name: "絵画名",
        en_name: "Picture",
        vi_name: "Tranh ảnh"
    }, {id: 98, jp_name: "番組名", en_name: "Broadcast_Program", vi_name: "Chương trình phát thanh, phát hình"}, {
        id: 99,
        jp_name: "映画名",
        en_name: "Movie",
        vi_name: "Phim ảnh"
    }, {id: 100, jp_name: "公演名", en_name: "Show", vi_name: "Buổi biểu diễn"}, {
        id: 101,
        jp_name: "音楽名",
        en_name: "Music",
        vi_name: "Tên bài hát, nhạc"
    }, {id: 102, jp_name: "文学名", en_name: "Book", vi_name: "Tên sách"}, {
        id: 103,
        jp_name: "出版物名_その他",
        en_name: "Printing_Other",
        vi_name: "Ấn phẩm"
    }, {id: 104, jp_name: "新聞名", en_name: "Newspaper", vi_name: "Báo chí"}, {
        id: 105,
        jp_name: "雑誌名",
        en_name: "Magazine",
        vi_name: "Tạp chí"
    }, {
        id: 106,
        jp_name: "主義方式名_その他",
        en_name: "Doctrine_Method_Other",
        vi_name: "Văn hoá - Tư tưởng - Chủ nghĩa"
    }, {id: 107, jp_name: "文化名", en_name: "Culture", vi_name: "Văn hoá"}, {
        id: 108,
        jp_name: "宗教名",
        en_name: "Religion",
        vi_name: "Tôn giáo"
    }, {id: 109, jp_name: "学問名", en_name: "Academic", vi_name: "Môn học"}, {
        id: 110,
        jp_name: "競技名",
        en_name: "Sport",
        vi_name: "Môn thể thao"
    }, {id: 111, jp_name: "流派名", en_name: "Style", vi_name: "Trường phái"}, {
        id: 112,
        jp_name: "運動名",
        en_name: "Movement",
        vi_name: "Phong trào"
    }, {id: 113, jp_name: "理論名", en_name: "Theory", vi_name: "Lý thuyết"}, {
        id: 114,
        jp_name: "政策計画名",
        en_name: "Plan",
        vi_name: "Kế hoạch, chính sách"
    }, {id: 115, jp_name: "規則名_その他", en_name: "Rule_Other", vi_name: "Luật, quyết định, quyết nghị"}, {
        id: 116,
        jp_name: "条約名",
        en_name: "Treaty",
        vi_name: "Điều ước"
    }, {id: 117, jp_name: "法令名", en_name: "Law", vi_name: "Luật, pháp lệnh"}, {
        id: 118,
        jp_name: "称号名_その他",
        en_name: "Title_Other",
        vi_name: "Danh xưng"
    }, {id: 119, jp_name: "地位職業名", en_name: "Position_Vocation", vi_name: "Địa vị"}, {
        id: 120,
        jp_name: "言語名_その他",
        en_name: "Language_Other",
        vi_name: "Ngôn ngữ, tiếng nói"
    }, {id: 121, jp_name: "国語名", en_name: "National_Language", vi_name: "Ngôn ngữ"}, {
        id: 122,
        jp_name: "単位名_その他",
        en_name: "Unit_Other",
        vi_name: "Đơn vị đo"
    }, {id: 123, jp_name: "通貨単位名", en_name: "Currency", vi_name: "Đơn vị tiền tệ"}, {
        id: 124,
        jp_name: "イベント名_その他",
        en_name: "Event_Other",
        vi_name: "Sự kiện - Hiện tượng"
    }, {id: 125, jp_name: "催し物名_その他", en_name: "Occasion_Other", vi_name: "Sự kiện"}, {
        id: 126,
        jp_name: "例祭名",
        en_name: "Religious_Festival",
        vi_name: "Lễ hội"
    }, {id: 127, jp_name: "競技会名", en_name: "Game", vi_name: "Trận đấu"}, {
        id: 128,
        jp_name: "会議名",
        en_name: "Conference",
        vi_name: "Hội nghị, hội thảo"
    }, {id: 129, jp_name: "事故事件名_その他", en_name: "Incident_Other", vi_name: "Tai nạn"}, {
        id: 130,
        jp_name: "戦争名",
        en_name: "War",
        vi_name: "Chiến tranh"
    }, {id: 131, jp_name: "自然現象名_その他", en_name: "Natural_Phenomenon_Other", vi_name: "Hiện tượng tự nhiên"}, {
        id: 132,
        jp_name: "自然災害名",
        en_name: "Natural_Disaster",
        vi_name: "Thiên tai"
    }, {id: 133, jp_name: "地震名", en_name: "Earthquake", vi_name: "Động đất"}, {
        id: 134,
        jp_name: "自然物名_その他",
        en_name: "Natural_Object_Other",
        vi_name: "Vật chất tự nhiên"
    }, {id: 135, jp_name: "元素名", en_name: "Element", vi_name: "Nguyên tố"}, {
        id: 136,
        jp_name: "化合物名",
        en_name: "Compound",
        vi_name: "Hợp chất"
    }, {id: 137, jp_name: "鉱物名", en_name: "Mineral", vi_name: "Khoáng sản"}, {
        id: 138,
        jp_name: "生物名_その他",
        en_name: "Living_Thing_Other",
        vi_name: "Sinh vật"
    }, {id: 139, jp_name: "真菌類名", en_name: "Fungus", vi_name: "Nấm"}, {
        id: 140,
        jp_name: "軟体動物_節足動物名",
        en_name: "Mollusk_Arthropod",
        vi_name: "Động vật thân mềm, chân khớp"
    }, {id: 141, jp_name: "昆虫類名", en_name: "Insect", vi_name: "Côn trùng"}, {
        id: 142,
        jp_name: "魚類名",
        en_name: "Fish",
        vi_name: "Cá"
    }, {id: 143, jp_name: "両生類名", en_name: "Amphibia", vi_name: "Động vật lưỡng sinh"}, {
        id: 144,
        jp_name: "爬虫類名",
        en_name: "Reptile",
        vi_name: "Bò sát"
    }, {id: 145, jp_name: "鳥類名", en_name: "Bird", vi_name: "Chim"}, {
        id: 146,
        jp_name: "哺乳類名",
        en_name: "Mammal",
        vi_name: "Động vật có vú (thú)"
    }, {id: 147, jp_name: "植物名", en_name: "Flora", vi_name: "Thực vật"}, {
        id: 148,
        jp_name: "生物部位名_その他",
        en_name: "Living_Thing_Part_Other",
        vi_name: "Cấu trúc của sự sống"
    }, {id: 149, jp_name: "動物部位名", en_name: "Animal_Part", vi_name: "Bộ phận cơ thể"}, {
        id: 150,
        jp_name: "植物部位名",
        en_name: "Flora_Part",
        vi_name: "Bộ phận của sinh vật"
    }, {id: 151, jp_name: "病気名_その他", en_name: "Disease_Other", vi_name: "Bệnh tật"}, {
        id: 152,
        jp_name: "動物病気名",
        en_name: "Animal_Disease",
        vi_name: "Bệnh động vật"
    }, {id: 153, jp_name: "色名_その他", en_name: "Color_Other", vi_name: "Màu sắc"}, {
        id: 154,
        jp_name: "自然色名",
        en_name: "Nature_Color",
        vi_name: "Màu tự nhiên"
    }, {id: 155, jp_name: "時間表現_その他", en_name: "Time_Top_Other", vi_name: "Thời gian - thời điểm"}, {
        id: 156,
        jp_name: "時間_その他",
        en_name: "Timex_Other",
        vi_name: "Thời điểm"
    }, {id: 157, jp_name: "時刻表現", en_name: "Time", vi_name: "Thời gian - thời khắc"}, {
        id: 158,
        jp_name: "日付表現",
        en_name: "Date",
        vi_name: "Ngày tháng"
    }, {id: 159, jp_name: "曜日表現", en_name: "Day_Of_Week", vi_name: "Ngày trong tuần"}, {
        id: 160,
        jp_name: "時代表現",
        en_name: "Era",
        vi_name: "Thời đại"
    }, {id: 161, jp_name: "期間_その他", en_name: "Periodx_Other", vi_name: "Thời kỳ"}, {
        id: 162,
        jp_name: "時刻期間",
        en_name: "Period_Time",
        vi_name: "Số thời gian"
    }, {id: 163, jp_name: "日数期間", en_name: "Period_Day", vi_name: "Số ngày"}, {
        id: 164,
        jp_name: "週数期間",
        en_name: "Period_Week",
        vi_name: "Số tuần"
    }, {id: 165, jp_name: "月数期間", en_name: "Period_Month", vi_name: "Số tháng"}, {
        id: 166,
        jp_name: "年数期間",
        en_name: "Period_Year",
        vi_name: "Số năm"
    }, {id: 167, jp_name: "数値表現_その他", en_name: "Numex_Other", vi_name: "Số liệu"}, {
        id: 168,
        jp_name: "金額表現",
        en_name: "Money",
        vi_name: "Số tiền"
    }, {id: 169, jp_name: "株指標", en_name: "Stock_Index", vi_name: "Chỉ số chứng khoán"}, {
        id: 170,
        jp_name: "ポイント",
        en_name: "Point",
        vi_name: "Điểm số"
    }, {id: 171, jp_name: "割合表現", en_name: "Percent", vi_name: "Số phần trăm"}, {
        id: 172,
        jp_name: "倍数表現",
        en_name: "Multiplication",
        vi_name: "Bội số"
    }, {id: 173, jp_name: "頻度表現", en_name: "Frequency", vi_name: "Tần số"}, {
        id: 174,
        jp_name: "年齢",
        en_name: "Age",
        vi_name: "Tuổi tác"
    }, {id: 175, jp_name: "学齢", en_name: "School_Age", vi_name: "Tuổi năm học"}, {
        id: 176,
        jp_name: "序数",
        en_name: "Ordinal_Number",
        vi_name: "Số thứ tự"
    }, {id: 177, jp_name: "順位表現", en_name: "Rank", vi_name: "Thứ hạng"}, {
        id: 178,
        jp_name: "緯度経度",
        en_name: "Latitude_Longitude",
        vi_name: "Kinh độ, vĩ độ"
    }, {id: 179, jp_name: "寸法表現_その他", en_name: "Measurement_Other", vi_name: "Đo lường"}, {
        id: 180,
        jp_name: "長さ",
        en_name: "Physical_Extent",
        vi_name: "Chiều dài"
    }, {id: 181, jp_name: "面積", en_name: "Space", vi_name: "Diện tích"}, {
        id: 182,
        jp_name: "体積",
        en_name: "Volume",
        vi_name: "Thể tích"
    }, {id: 183, jp_name: "重量", en_name: "Weight", vi_name: "Trọng lượng"}, {
        id: 184,
        jp_name: "速度",
        en_name: "Speed",
        vi_name: "Tốc độ"
    }, {id: 185, jp_name: "密度", en_name: "Intensity", vi_name: "Mật độ"}, {
        id: 186,
        jp_name: "温度",
        en_name: "Temperature",
        vi_name: "Nhiệt độ"
    }, {id: 187, jp_name: "カロリー", en_name: "Calorie", vi_name: "Kalo"}, {
        id: 188,
        jp_name: "震度",
        en_name: "Seismic_Intensity",
        vi_name: "Độ rung (động đất)"
    }, {id: 189, jp_name: "マグニチュード", en_name: "Seismic_Magnitude", vi_name: "Độ richter"}, {
        id: 190,
        jp_name: "個数_その他",
        en_name: "Countx_Other",
        vi_name: "Số lượng"
    }, {id: 191, jp_name: "人数", en_name: "N_Person", vi_name: "Số người"}, {
        id: 192,
        jp_name: "組織数",
        en_name: "N_Organization",
        vi_name: "Số tổ chức"
    }, {id: 193, jp_name: "場所数_その他", en_name: "N_Location_Other", vi_name: "Số nơi, số địa điểm"}, {
        id: 194,
        jp_name: "国数",
        en_name: "N_Country",
        vi_name: "Số quốc gia"
    }, {id: 195, jp_name: "施設数", en_name: "N_Facility", vi_name: "Số cơ sở"}, {
        id: 196,
        jp_name: "製品数",
        en_name: "N_Product",
        vi_name: "Số sản phẩm"
    }, {id: 197, jp_name: "イベント数", en_name: "N_Event", vi_name: "Số sự kiện"}, {
        id: 198,
        jp_name: "自然物数_その他",
        en_name: "N_Natural_Object_Other",
        vi_name: "Số vật tự nhiên"
    }, {id: 199, jp_name: "動物数", en_name: "N_Animal", vi_name: "Số con"}, {
        id: 200,
        jp_name: "植物数",
        en_name: "N_Flora",
        vi_name: "Số cây"
    }], i = function () {
        for (var a = 0; a < h.length; a++) {
            var b = j(h[a].vi_name);
            h[a].ten_khongdau = b
        }
    }, j = function (a) {
        return a = a.toLowerCase(), a = a.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a"), a = a.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e"), a = a.replace(/ì|í|ị|ỉ|ĩ/g, "i"), a = a.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o"), a = a.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u"), a = a.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y"), a = a.replace(/đ/g, "d")
    };
    return g.getIdCategory = function (a) {
        for (var b = null, c = 0; c < h.length; c++) {
            var d = h[c].en_name.toLowerCase(), e = a.toLowerCase();
            if (-1 != d.indexOf(e))return b = h[c]
        }
        return b
    }, g.getAllCategory = function (a) {
        a(h)
    }, i(), g
}]);
var initSearchCtrl = !1, SERVER_ADRESS = "http://crazyjapanese.com:8989", SHOW_NOTIFY_NEW_VERSION = !0,
    TIME_SHOW_SURVAY = 3e4, PAGINATION_REPORT_MEAN = 5;
angular.module("mazii", ["ui.router", "mdo-angular-cryptography", "mazii.service.history", "mazii.service.note", "mazii.service.util", "mazii.service.search", "mazii.service.auth", "mazii.service.user", "mazii.service.cookie", "mazii.service.encryption", "mazii.service.spam", "mazii.service.category", "ngAudio", "ngSanitize", "templates-main"]).config(["$stateProvider", "$urlRouterProvider", "$sceProvider", function (a, b, c) {
    b.otherwise("search"), b.when("/search?type&query", ["$match", "$stateParams", function (a, b) {
        return initSearchCtrl ? !0 : !1
    }]), a.state("/", {url: "/", "abstract": !0}).state("search", {
        url: "/search?type&query",
        views: {
            main: {templateUrl: "views/search/main.html", controller: "SearchController"},
            right: {templateUrl: "views/search/right.html"}
        }
    }).state("news", {
        url: "/news?id",
        reloadOnSearch: !1,
        views: {
            main: {templateUrl: "views/news/main.html", controller: "NewsController"},
            right: {templateUrl: "views/news/right.html"},
            right2: {templateUrl: "views/news/right2.html"}
        }
    }).state("jlpt", {
        url: "/jlpt",
        views: {
            main: {templateUrl: "views/jlpt/main.html", controller: "JLPTController"},
            right: {templateUrl: "views/jlpt/right.html"}
        }
    }).state("note", {
        url: "/note",
        views: {
            main: {templateUrl: "views/note/main.html", controller: "NoteController"},
            right: {templateUrl: "views/note/right.html"}
        }
    }).state("write", {
        url: "/write",
        views: {
            main: {templateUrl: "views/write/main.html", controller: "WriteController"},
            right: {templateUrl: "views/write/right.html"}
        }
    }).state("help", {
        url: "/help",
        views: {main: {templateUrl: "views/help/main.html", controller: "HelpController"}}
    }).state("about", {
        url: "/about",
        views: {main: {templateUrl: "views/about/main.html", controller: "AboutController"}}
    }).state("term", {
        url: "/term",
        views: {main: {templateUrl: "views/term/main.html", controller: "TermController"}}
    }).state("sentence", {
        url: "/sentence",
        views: {
            main: {templateUrl: "views/sentence/main.html", controller: "SentenceController"},
            right: {templateUrl: "views/sentence/right.html"}
        }
    }).state("login", {
        url: "/login",
        views: {
            main: {templateUrl: "views/login/main.html", controller: "LoginController"},
            right: {templateUrl: "views/login/right.html"}
        }
    }).state("register", {
        url: "/register",
        views: {
            main: {templateUrl: "views/register/main.html", controller: "RegisterController"},
            right: {templateUrl: "views/register/right.html"}
        }
    }).state("change-password", {
        url: "/change-password",
        views: {
            main: {templateUrl: "views/change-password/main.html", controller: "ChangePasswordController"},
            right: {templateUrl: "views/change-password/right.html"}
        }
    }).state("profile", {
        url: "/profile",
        views: {
            main: {templateUrl: "views/profile/main.html", controller: "ProfileController"},
            right: {templateUrl: "views/profile/right.html"}
        }
    }).state("reset-password", {
        url: "/reset-password/:key",
        views: {
            main: {templateUrl: "views/reset-password/main.html", controller: "ResetPasswordController"},
            right: {templateUrl: "views/reset-password/right.html"}
        }
    }), c.enabled(!1)
}]).run(["$rootScope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "$stateParams", "$location", "authServ", "localstoreServ", "$http", "userServ", function (a, b, c, d, e, f, g, h, i, j, k, l) {
    function m() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? !0 : !1
    }

    function n() {
        m() ? ($("#chat-module").html(""), $("#chat-module").addClass("removed")) : $("#chat-module").removeClass("removed"), $(".chat-box-control .suggest-chat-close").click(function (a) {
            $("#chat-module").html(""), $("#chat-module").addClass("removed")
        }), $(".chat-title").click(function (a) {
            $("#chat-module").removeClass("hide-chat")
        }), $(".chat-close").click(function (a) {
            $("#chat-module").addClass("hide-chat")
        })
    }

    window.fbAsyncInit = function () {
        FB.init({appId: "1428630557429556", xfbml: !0, version: "v2.2"})
    }, function (a, b, c) {
        var d, e = a.getElementsByTagName(b)[0];
        a.getElementById(c) || (d = a.createElement(b), d.id = c, d.src = "//connect.facebook.net/en_US/sdk.js", e.parentNode.insertBefore(d, e))
    }(document, "script", "facebook-jssdk"), a.initFlashcard = !1, l.init().then(function (b) {
        null != b && 200 == b.status ? (a.user = b.result, a.$broadcast("login.success")) : (a.user = null, j.deleteItem("rateMean")), e.showInformationUser()
    }), a.$on("login.success", function () {
        a.categories = [];
        var b = 0, c = function () {
            l.getCategory(b).then(function (d) {
                if (null != d && 0 != d.length) {
                    for (var e = 0; e < d.length; e++)a.categories.push(d[e]);
                    100 == d.length ? (b++, c()) : a.$broadcast("load.category.success")
                }
            })
        };
        c()
    }), a.getState = function (a) {
        return b.current.name == a ? "active" : ""
    };
    var o = j.getItem("showFurigana"), p = j.getItem("showSuggest");
    ("undefined" == typeof o || null == o) && j.setItem("showFurigana", !0), ("undefined" == typeof p || null == p) && j.setItem("showSuggest", !0), o ? $("#setting_css").remove() : $("head").append('<style id="setting_css">rt{display: none;}</style>'), a.$on("$stateChangeSuccess", function (b, c, d, e, f) {
        "search" == e.name && (initSearchCtrl = !1), "search" !== c.name ? a.enableInstantView = !0 : a.enableInstantView = !1, "" == e.name && "note" == c.name && (a.currentNoteRoute = !0), q()
    }), a.noResults = !1, a.examples = null, a.words = null, a.kanjis = null, a.grammars = null, a.tabSelected = 0, a.showLoading = !1, a.currentKanjiSelected = 0, a.showKanjiDraw = !1, a.showKanjiDrawTable = function () {
        a.showKanjiDraw = !a.showKanjiDraw
    }, a.$on("query", function (b, c) {
        null != c && "searchpage" != c.tag && (null == c.query ? a.startQuery(c, !0) : (a.setTabByChar(c.type[0]), "grammarDetail" != c.type ? a.startQuery(c.query, !0, c.aux) : a.queryGrammarDetail(c.query)), $("#instant-search").modal())
    }), a.lang = "JA", a.changeLang = function () {
        "JA" == a.lang ? a.lang = "VI" : a.lang = "JA"
    }, a.queryGrammarDetail = function (b) {
        a.noResults = !1, a.examples = null, a.words = null, a.kanjis = null, a.grammars = null, a.grammarDetail = null, a.suggest = null, a.googleTranslate = null, d.search("grammar_detail", b).then(function (b) {
            a.titleInstantSearch = "Tra nhanh ngữ pháp: ", a.grammarDetail = b, a.noResults = !1
        })
    }, a.startQuery = function (b, c, g) {
        a.noResults = !1, a.examples = null, a.words = null, a.kanjis = null, a.grammars = null, a.grammarDetail = null, a.suggest = null, a.googleTranslate = null, a.wordAux = g;
        var h = !1;
        if (0 == e.isJapanese(b) && (e.isVietnamese(b) ? (b = b.toLowerCase(), h = !0) : (b[0] == b[0].toUpperCase() && b.length > 1 && b[1] == b[1].toLowerCase() && (b = b.toLowerCase()), b = wanakana.toKana(b))), 0 == a.tabSelected) {
            a.titleInstantSearch = "Tra nhanh từ vựng: " + b, f.push(b, "word", h ? "VI" : "JA");
            var i = "javi";
            h && (i = "vija"), d.search("word", b).then(function (c) {
                var f = "ja", g = "vi";
                if (e.isJapanese(b) ? (f = "ja", g = "vi") : (f = "vi", g = "ja"), 200 == c.status) {
                    if (null != c.data)for (var h = 0; h < c.data.length; h++)if (c.data[h].word == b || c.data[h].phonetic == b) {
                        c.found = !0;
                        break
                    }
                    if (0 == c.found) a.suggest = c.data; else {
                        a.words = [], a.suggest = [];
                        for (var h = 0; h < c.data.length; h++)c.data[h].word == b || c.data[h].phonetic == b ? a.words.push(c.data[h]) : a.suggest.push(c.data[h])
                    }
                    a.showLoading = !1
                } else a.words = null, a.showLoading = !1;
                d.googleTranslate(b, f, g).then(function (b) {
                    a.googleTranslate = b, null == a.$$phase && a.$apply()
                })
            }, function (b) {
                a.words = null, a.showLoading = !1, a.noResults = !0
            }), d.search("kanji", b).then(function (c) {
                if (200 == c.status) {
                    if (e.isJapanese(b)) {
                        var d = e.getKanjiChara(b);
                        a.resultKanjis = e.sortHVDataByKeyWord(d, c.results)
                    } else a.resultKanjis = c.results;
                    a.noResultsKanjis = !1
                } else a.resultKanjis = null, a.noResultsKanjis = !0
            }, function (b) {
                a.resultKanjis = null, a.noResultsKanjis = !0
            })
        } else 1 == a.tabSelected ? (a.titleInstantSearch = "Tra nhanh hán tự : " + b, d.search("kanji", b).then(function (c) {
            if (a.currentKanjiSelected = 0, 200 == c.status) {
                var d = e.getKanjiChara(b);
                a.kanjis = e.sortHVDataByKeyWord(d, c.results), a.showLoading = !1, f.push(b, "kanji")
            } else a.kanjis = null, a.showLoading = !1, a.noResults = !0
        }, function (b) {
            a.kanjis = null, a.showLoading = !1, a.noResults = !0
        })) : 3 == a.tabSelected ? (a.titleInstantSearch = "Tra nhanh ngữ pháp: " + b, d.search("grammar", b).then(function (c) {
            200 == c.status ? (a.grammars = c.results, a.showLoading = !1, f.push(b, "grammar")) : (a.grammars = null, a.showLoading = !1, a.noResults = !0)
        }, function (b) {
            a.grammars = null, a.showLoading = !1, a.noResults = !0
        })) : 2 == a.tabSelected && d.search("example", b).then(function (c) {
                200 == c.status ? (a.examples = c.results, a.showLoading = !1, f.push(b, "example")) : (a.examples = null, a.showLoading = !1, a.noResults = !0)
            }, function (b) {
                a.examples = null, a.showLoading = !1, a.noResults = !0
            })
    }, a.changeKanjiShow = function (b) {
        a.currentKanjiSelected = b
    }, a.getCurrentKanji = function () {
        return a.kanjis[a.currentKanjiSelected]
    }, a.kanjiSeletectClass = function (b) {
        return a.currentKanjiSelected == b ? "selected" : ""
    }, a.getCurrentType = function () {
        switch (a.tabSelected) {
            case 0:
                return "w";
            case 1:
                return "k";
            case 2:
                return "s";
            case 3:
                return "g"
        }
        return "w"
    }, a.setTabByChar = function (b) {
        null == b || "" == b ? a.tabSelected = 0 : "w" == b ? a.tabSelected = 0 : "k" == b ? a.tabSelected = 1 : "e" == b ? a.tabSelected = 2 : "g" == b ? a.tabSelected = 3 : "s" == b && (a.tabSelected = 2)
    }, a.report = {}, a.alert = {}, a.report.send = function (b) {
        if (null == b || "" == b) a.report.noComment = !0; else {
            (null == a.report.id || null == a.report.type) && ($("#reportModal").modal("hide"), a.showAlert("Báo lỗi không thành công, bạn hãy thử lại."));
            var c = Parse.Object.extend("ReportWrong"), d = new c;
            d.save({
                entryId: a.report.id,
                type: a.report.type,
                comment: a.report.comment,
                entry: a.report.entry
            }, {
                success: function (b) {
                    $("#reportModal").modal("hide"), a.showAlert("Cảm ơn bạn. Chúng tôi sẽ xem xét và sửa lại nội dung này.")
                }, error: function (b, c) {
                    $("#reportModal").modal("hide"), a.showAlert("Báo lỗi không thành công, bạn hãy thử lại.")
                }
            })
        }
    }, a.showAlert = function (b) {
        a.alert.message = b, $("#alertModal").modal()
    };
    var q = function () {
        var a = b.current.name, c = "", d = "", e = "";
        "search" == a || "write" == a || "term" == a ? (c = "col-lg-9 col-md-12 col-xs-12", d = "col-lg-3 col-md-12 col-xs-12", e = "") : "news" == a ? (c = "col-lg-6 col-md-6 col-xs-12", d = "col-lg-3 col-md-3 col-xs-12", e = "col-lg-3 col-md-3 col-xs-12") : "register" == a ? (c = "col-md-6 col-lg-6 col-xs-12", d = "col-md-6 col-lg-6 col-xs-12", e = "") : "help" == a || "about" == a ? (c = "col-md-12 col-lg-12", d = "", e = "") : "jlpt" == a || "login" == a || "change-password" == a || "reset-password" == a ? (c = "col-md-9 col-xs-12", d = "col-md-3 col-lg-3", e = "col-md-3 col-lg-3") : "chat" == a || "sentence" == a ? (c = "col-md-9 col-xs-12", d = "col-md-3 col-lg-3", e = "col-md-3 col-lg-3") : "note" == a ? (c = "col-md-9 col-lg-9", d = "col-md-3 col-lg-3", e = "col-md-3 col-lg-3") : (c = "col-md-6 col-lg-6", d = "col-md-3 col-lg-3", e = "col-md-3 col-lg-3"), $("#view1").attr("class", c), $("#view2").attr("class", d), $("#view3").attr("class", e)
    };
    a.$on("$stateChangeSuccess", function (b, c, d, f, g) {
        a.registerSuccess = !1, $(".notify-current").hide(100), "search" == c.name ? a.showButtonHistory = !0 : a.showButtonHistory = !1;
        var h = $('.menu-left li a[href="#' + c.name + '"]');
        $(".menu-left li").removeClass("menu-left-active"), h.parent().addClass("menu-left-active"), e.closePanel()
    }), n(), $(".close-modal-jlpt").click(function () {
        $("#instant-search").modal("hide")
    }), $(".close-modal-report").click(function () {
        $("#reportModal").modal("hide")
    }), $(".close-modal-alert").click(function () {
        $("#alertModal").modal("hide")
    }), $(".close-delete-history-modal").click(function () {
        $("confirmDeleteHistoryModal").modal("hide")
    }), a.showChromeAds = !1, setTimeout(function () {
        $("body").searchit()
    }, 2e3), setTimeout(function () {
        $(".selection_bubble_root").length > 0 ? (console.log("thấy chrome plugin"), a.showChromeAds = !1) : (console.log("không thấy chrome plugin"), a.showChromeAds = !0), a.$apply()
    }, 5e3), a.showEmailHole = !j.getItem("emailhole_news_songngu")
}]).directive("ngEnter", function () {
    return function (a, b, c) {
        b.bind("keydown keypress", function (b) {
            13 === b.which && (a.$apply(function () {
                a.$eval(c.ngEnter)
            }), b.preventDefault())
        })
    }
}).directive("focusMe", ["$timeout", function (a) {
    return {
        link: function (b, c, d) {
            a(function () {
                c[0].focus()
            }, 500)
        }
    }
}]), angular.module("mazii").directive("ngExample", function () {
    return {
        restrict: "E",
        templateUrl: "components/example/example-template.html",
        scope: {data: "=data", index: "@"},
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function (a, b, c, d) {
            d.isJapanese(b.data.mean) ? (b.isJapanese = !1, b.mergeExample = d.mergeKanjiAndHiragana(b.data.mean, b.data.transcription)) : (b.isJapanese = !0, b.mergeExample = d.mergeKanjiAndHiragana(b.data.content, b.data.transcription))
        }]
    }
}), angular.module("mazii").directive("ngKanji", function () {
    return {
        restrict: "E",
        templateUrl: "components/kanji/kanji-template.html",
        scope: {data: "=data"},
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "$timeout", function (a, b, c, d, e) {
            b.collapse = !1, null != b.data && null != b.data.detail && (b.details = b.data.detail.split("##"));
            var f = function (a) {
                var c = null == a.kun ? null : a.kun.replace(/ /g, "&nbsp;&nbsp;&nbsp;&nbsp;"),
                    d = null == a.on ? null : a.on.replace(/ /g, "&nbsp;&nbsp;&nbsp;&nbsp;");
                b.data.kun = c, b.data.on = d
            };
            b.getDetails = function () {
                return b.details = b.data.detail.split("##"), b.details
            }, b.getTitle = function () {
                b.title = "";
                for (var a = b.data.detail.split("##"), c = 0; c < a.length; c++)for (var d = a[c], e = 0; e < d.length; e++)if ("." == d[e]) {
                    b.title += d.substr(0, e + 1) + " ";
                    break
                }
                return b.title
            }, b.search = function (b) {
                a.$broadcast("searchKanji", b)
            }, b.showCollapse = function () {
                1 == b.collapse ? $(".list-collapse").slideUp(100) : $(".list-collapse").slideDown(100), b.collapse = !b.collapse
            }, b.setQueryType = function (b, c, d) {
                null == a.user ? (a.alert.notify = "Đăng nhập để sử dụng tính năng", $(".notify-current").fadeIn(200), e(function () {
                    $(".notify-current").fadeOut(200)
                }, 1e3)) : ($("#myNote").modal("show"), a.meanMyNote = d, a.$broadcast("setQueryType", {
                    query: b,
                    type: c
                }))
            }, f(b.data)
        }]
    }
}), angular.module("mazii").directive("ngGrammar", function () {
    return {
        restrict: "E",
        templateUrl: "components/grammar/grammar-template.html",
        scope: {data: "=data", detail: "=detail"},
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "maziiServ", "$timeout", function (a, b, c, d, e, f) {
            if (b.loadDetail = function () {
                    null == b.detail && e.search("grammar_detail", b.data._id).then(function (a) {
                        b.detail = a.grammar
                    })
                }, b.splitUtil = function (a, b) {
                    if (null == a || "" == a)return null;
                    for (var c = a.split(b), d = [], e = 0; e < c.length; e++) {
                        var f = c[e].trim();
                        "" != f && d.push(f)
                    }
                    return d
                }, b.removeJapaneseChar = function (a) {
                    return d.removeJapaneseChar(a)
                }, b.splitExplain = function (a) {
                    return b.splitUtil(a, "☞")
                }, b.splitNote = function (a) {
                    return b.splitUtil(a, "☞")
                }, b.setQueryGrammar = function (b, c, d, e) {
                    null == a.user ? (a.alert.notify = "Đăng nhập để sử dụng tính năng", $(".notify-current").fadeIn(200), f(function () {
                        $(".notify-current").fadeOut(200)
                    }, 1e3)) : ($("#myNote").modal("show"), a.meanMyNote = e, a.$broadcast("setQueryGrammar", {
                        query: b,
                        type: c,
                        id: d
                    }))
                }, b.$watch("data", function (a, c) {
                    return null != b.data.grammar ? (b.showDetailImediately = !0, void(b.detail = b.data.grammar)) : void(b.showDetailImediately = !1)
                }), null != b.data.grammar)return b.showDetailImediately = !0, void(b.detail = b.data.grammar);
            b.showDetailImediately = !1;
            var g = b.data.title.split("=>"), h = "";
            g.length > 1 && (h = g[1]), b.title = g[0], b.titleMean = h, b.id = b.data._id.replace(/:/g, "_"), f(function () {
                null == a.user ? b.logined = !1 : b.logined = !0
            }, 200)
        }]
    }
}), angular.module("mazii").directive("ngKanjiResultSearchWord", function () {
    return {
        restrict: "E",
        templateUrl: "components/kanji-result-search-word/kanji-result-search-word-template.html",
        scope: {data: "=data"},
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function (a, b, c, d) {
            b.collapse = !1, null != b.data && null != b.data.detail && (b.details = b.data.detail.split("##")), b.getTitle = function () {
                b.title = "";
                for (var a = b.data.detail.split("##"), c = 0; c < a.length; c++)for (var d = a[c], e = 0; e < d.length; e++)if ("." == d[e]) {
                    b.title += d.substr(0, e + 1) + " ";
                    break
                }
                return b.title
            }, b.search = function (b) {
                a.$broadcast("searchKanji", b)
            }, b.viewDetail = function (b) {
                a.$broadcast("searchKanji", b)
            }
        }]
    }
}), angular.module("mazii").directive("ngWord", function () {
    return {
        restrict: "E",
        templateUrl: "components/word/word-template.html",
        scope: {data: "=data", aux: "=aux"},
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "ngAudio", "userServ", "$timeout", "categoryServ", function (a, b, c, d, e, f, g, h) {
            var i = "http://data.mazii.net/audios/";
            if (b.aux) {
                var j = h.getIdCategory(b.aux.category);
                b.NameCategory = j.vi_name
            }
            b.id = 1e3 * Math.random(), b.show_mean_of_user = !1, b.showAlert = !1, b.indexPagination = 0, b.listRateReport = [];
            null == a.user ? b.notLogin = !0 : b.notLogin = !1;
            for (var k = b.data, l = 0; l < k.means.length; l++) {
                var m = k.means[l].kind;
                if (null != m && "" != m) {
                    var n = [];
                    if (-1 != m.indexOf(",")) {
                        n = m.split(",");
                        for (var o = 0; o < n.length; o++)n[o] = n[o].trim()
                    } else n.push(m);
                    for (var o = 0; o < n.length; o++) {
                        var p = d.getConjugationTableOfVerb(k.word, k.phonetic, n[o]);
                        if (null != p) {
                            b.conjugationVerb = p;
                            break
                        }
                    }
                }
                if (null != b.conjugationVerb)break
            }
            b.setQueryType = function (b, c, d) {
                null == a.user ? (a.alert.notify = "Đăng nhập để sử dụng tính năng", $(".notify-current").fadeIn(200), g(function () {
                    $(".notify-current").fadeOut(200)
                }, 1e3)) : ($("#myNote").modal("show"), d.means.length > 0 ? a.meanMyNote = d.means[0].mean : a.meanMyNote = "", a.$broadcast("setQueryType", {
                    query: b,
                    type: c
                }))
            };
            var q = i + d.convertJptoHex(b.data.word).toUpperCase() + ".mp3";
            b.sound = e.load(q), b.playAudio = function () {
                b.sound.play()
            };
            var r = b.data.word;
            d.isJapanese(r) && (b.amHanViet = d.getHVOfKey(r)), b.data.kinds = {}, b.data.noKinds = [];
            for (var l = 0; l < b.data.means.length; l++) {
                var s = b.data.means[l];
                null != s.kind && "" != s.kind ? (null == b.data.kinds[s.kind] && (b.data.kinds[s.kind] = []), b.data.kinds[s.kind].push(s)) : b.data.noKinds.push(s)
            }
            b.convertKindToReadable = function (a) {
                return null == a || "" == a ? "" : d.convertKindToReadable(a)
            }, b.capitaliseFirstLetter = function (a) {
                return d.capitaliseFirstLetter(a)
            }
        }]
    }
}), angular.module("mazii").directive("ngSetting", function () {
    return {
        restrict: "E",
        templateUrl: "components/setting/setting-template.html",
        controller: ["$rootScope", "$scope", "$http", "localstoreServ", "$state", function (a, b, c, d, e) {
            b.furigana = d.getItem("showFurigana"), b.suggest = d.getItem("showSuggest");
            var f = function () {
                var a = d.getItem("showFurigana");
                a ? $("#setting_css").remove() : $("head").append('<style id="setting_css">rt{display: none;}</style>')
            };
            f(), b.showFurigana = function () {
                d.setItem("showFurigana", b.furigana), b.$emit("changeShowFurigana", b.furigana), f()
            }, b.showSuggestSearch = function () {
                d.setItem("showSuggest", b.suggest), b.$emit("chaneShowSuggest", b.suggest)
            }
        }]
    }
}), angular.module("mazii").directive("ngKanjiRecognize", function () {
    return {
        restrict: "E",
        templateUrl: "components/kanji-recognize/kanji-recognize-template.html",
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function (a, b, c, d) {
            setTimeout(function () {
                new KanjiWriter({
                    canvasId: "draw-canvas",
                    colorDraw: "black",
                    lineWidthDraw: 4,
                    resultId: "#draw-kanji-result",
                    clearButtonId: "#draw-clear",
                    backButtonId: "#draw-back",
                    classResult: "draw-kanji-suggest",
                    resultClickCallback: function () {
                        var b = $(this).text();
                        null != b && "" != b && ($("#draw-clear").trigger("click"), a.$broadcast("insertQueryText", b))
                    }
                })
            }, 100)
        }]
    }
}), angular.module("mazii").directive("ngKanjiDraw", function () {
    return {
        restrict: "E",
        templateUrl: "components/kanji-draw/kanji-draw-template.html",
        scope: {data: "=data"},
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function (a, b, c, d) {
            function e() {
                var a = {
                    skipLoad: !1,
                    autoplay: !0,
                    height: 250,
                    width: 250,
                    viewBox: {x: 0, y: 0, w: 125, h: 125},
                    step: .01,
                    stroke: {
                        animated: {drawing: !0, erasing: !0},
                        order: {visible: !0, attr: {"font-size": "8", fill: "#33B5E5"}},
                        attr: {
                            active: "#CC0000",
                            stroke: "random",
                            "stroke-width": 3,
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round"
                        }
                    },
                    grid: {show: !0, attr: {stroke: "#CCCCCC", "stroke-width": .5, "stroke-dasharray": "--"}}
                };
                return a
            }

            b.draw = function () {
                $("#image-holder").dmak(b.data, e())
            }, b.resetDrawKanjiStroke = function () {
                var a = $("#image-holder");
                a.html(""), a.data("plugin_dmak") && (a.dmak("reset"), a.data("plugin_dmak", null)), b.draw()
            }, b.$watch("data", function (a, c) {
                a != c && b.resetDrawKanjiStroke()
            }), b.resetDrawKanjiStroke()
        }]
    }
}), angular.module("mazii").directive("ngHistory", function () {
    return {
        restrict: "E",
        templateUrl: "components/history/history-template.html",
        controller: ["$rootScope", "$scope", "$http", "historyServ", "$state", "localstoreServ", "dictUtilSer", function (a, b, c, d, e, f, g) {
            b.history = d.get(), b.search = function (b, c) {
                g.closePanel(), a.$broadcast("query", {type: b, query: c, tag: "quick-search"})
            }, b.getTime = function (a) {
                var b = new Date(a);
                return b.toDateString()
            }, b.deleteHistory = function () {
                $("#confirmDeleteHistoryModal").modal("show")
            }, $(".deleteHistory").click(function () {
                d.clear(), b.history = d.get(), $("#confirmDeleteHistoryModal").modal("hide")
            })
        }]
    }
}), angular.module("mazii").directive("ngNote", function () {
    return {
        restrict: "E",
        replace: !0,
        templateUrl: "components/notes/note-template.html",
        controller: ["$rootScope", "$scope", "$http", "noteServ", "$state", "dictUtilSer", function (a, b, c, d, e, f) {
            b.note = [], b.state = !1, b.search = function (b, c) {
                a.$broadcast("query", {type: b, query: c})
            }, b.deleteNote = function (a) {
                d.removeNote(a).then(function () {
                    for (var c = -1, d = 0; d < b.note.length; d++)if (b.note[d].id == a) {
                        c = d;
                        break
                    }
                    -1 != c && (b.note.splice(c, 1), f.safeApply(b))
                })
            }, b.getDeleteState = function () {
                return b.state ? "" : "hidden-note-delete"
            }, b.showEditNote = function () {
                0 == b.state ? b.state = !0 : b.state = !1
            }, b.$on("getNoteItem", function (a, c) {
                "" == c.cate ? b.note = [] : d.getNoteItem(c.cate, 0, function (a) {
                    b.note = a, f.safeApply(b)
                })
            }), b.getTime = function (a) {
                var b = new Date(a);
                return b.toDateString()
            }
        }]
    }
}), angular.module("mazii").directive("ngNoteContent", function () {
    return {
        restrict: "E",
        replace: !0,
        templateUrl: "components/notes/note-content-template.html",
        controller: ["$rootScope", "$scope", "$http", "noteServ", "$state", function (a, b, c, d, e) {
            b.category = d.getCategory(), b.cate = "", b.query = "", b.type = "", b.grammarID = "", b.saveNoteMe = function (a) {
                console.log(a), "" != b.grammarID ? d.pushGrammar(a, b.query, b.type, b.grammarID) : "" != b.query && "" != b.type && d.pushNote(a, b.query, b.type), b.cate = "", b.query = "", b.type = "", b.grammarID = "", $("#myNote").modal("hide")
            }, b.$on("setQueryTypeFromCategory", function (a, c) {
                setTimeout(function () {
                    ("" != c.query || null != c.query) && (b.query = c.query), ("" != c.type || null != c.type) && (b.type = c.type)
                }, 500)
            }), b.$on("setQueryType", function (a, c) {
                ("" != c.query || null != c.query) && (b.query = c.query), ("" != c.type || null != c.type) && (b.type = c.type)
            }), b.$on("setQueryGrammar", function (a, c) {
                ("" != c.query || null != c.query) && (b.query = c.query), ("" != c.type || null != c.type) && (b.type = c.type), ("" != c.id || null != c.id) && (b.grammarID = c.id)
            }), b.getTime = function (a) {
                var b = new Date(a);
                return b.toDateString()
            }, b.showMyCategoryModal = function () {
                $("#myCategory").modal("show"), $("#myNote").modal("hide")
            }
        }]
    }
}), angular.module("mazii").directive("ngCategory", function () {
    return {
        restrict: "E",
        replace: !0,
        templateUrl: "components/notes/category-template.html",
        controller: ["$rootScope", "$scope", "$http", "noteServ", "$state", "userServ", function (a, b, c, d, e, f) {
            b.nameCategory = "", b.cate = "", b.query = "", b.type = "", b.grammarID = "", b.saveCategory = function () {
                "" != b.nameCategory && d.pushCategory(b.nameCategory), "" != b.query && "" != b.type && ($("#myCategory").modal("hide"), $("#myNote").modal("show"), a.$broadcast("setQueryTypeFromCategory", {
                    query: b.query,
                    type: b.type
                })), b.nameCategory = "", b.cate = "", b.query = "", b.type = "", $("#myCategory").modal("hide")
            }, b.$on("setQueryType", function (a, c) {
                ("" != c.query || null != c.query) && (b.query = c.query), ("" != c.type || null != c.type) && (b.type = c.type)
            }), b.$on("setQueryGrammar", function (a, c) {
                ("" != c.query || null != c.query) && (b.query = c.query), ("" != c.type || null != c.type) && (b.type = c.type), ("" != c.id || null != c.id) && (b.grammarID = c.id)
            }), b.$on("set", function (a, c) {
                ("" != c.query || null != c.query) && (b.query = c.query), ("" != c.type || null != c.type) && (b.type = c.type)
            })
        }]
    }
}), angular.module("mazii").directive("ngNewsother", function () {
    return {
        restrict: "E",
        templateUrl: "components/news/newsother-template.html",
        controller: ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "$stateParams", "$location", function (a, b, c, d, e, f, g, h, i) {
            b.clickID = -1, e.getHeadNews().then(function (a) {
                b.lastestNews = a;
                var c = h.id;
                null == c && (c = a[0].value.id), b.clickID = c, e.getDetailNews(c).then(function (a) {
                    b.currentNews = a
                })
            }), b.changeDetailNews = function (c) {
                return b.clickID == c ? !1 : (b.clickID = c, $(".news-link>a").removeClass("news_active"), $(".news-link>#" + c).addClass("news_active"), a.$broadcast("changeDetailNews", {id: c}), -1 == j.indexOf(c) && (j.push(c), localStorage.setItem("news_read", JSON.stringify(j))), void i.search("id", c))
            }, b.getNewsReadClass = function (a) {
                var c;
                return c = b.clickID == a ? "news_active" : -1 != j.indexOf(a) ? "news_read" : ""
            };
            var j = JSON.parse(localStorage.getItem("news_read"));
            null == j && (j = [])
        }]
    }
}), angular.module("mazii").directive("ngVerbConjugtion", function () {
    return {
        restrict: "E",
        scope: {data: "=data"},
        templateUrl: "components/verb-conjugtion/verb-conjugtion-template.html",
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function (a, b, c, d) {
        }]
    }
}), angular.module("mazii").directive("ngGoogleTranslate", function () {
    return {
        restrict: "E",
        scope: {data: "=data", aux: "=aux"},
        templateUrl: "components/google-translate/google-translate-template.html",
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "categoryServ", function (a, b, c, d, e) {
            if (b.aux) {
                var f = e.getIdCategory(b.aux.category);
                b.NameCategory = f.vi_name
            }
        }]
    }
}), angular.module("mazii").directive("ngSynonyms", function () {
    return {
        restrict: "E",
        scope: {data: "=data"},
        templateUrl: "components/synonyms/synonyms-template.html",
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", function (a, b, c, d) {
            b.searchThis = function (b) {
                a.$broadcast("query", {type: "word", query: b, tag: "quick-search"})
            }
        }]
    }
}), angular.module("mazii").directive("ngReport", function () {
    return {
        restrict: "E",
        templateUrl: "components/report/report-template.html",
        scope: {data: "=data", type: "@"},
        controller: ["$rootScope", "$scope", "$http", function (a, b, c) {
            b.showReportDialog = function () {
                var c = b.type, d = "", e = "";
                "grammar" == c ? (d = b.data._id, e = b.data.title) : "kanji" == c ? (d = b.data._id, e = b.data.kanji) : "word" == c ? (d = b.data._id, e = b.data.word) : "grammarDetail" == c && (c = "grammar", d = b.data._id, e = b.data.title), a.report.type = c, a.report.entry = e, a.report.id = d, a.report.comment = "", $("#reportModal").modal({backdrop: "static"})
            }
        }]
    }
}), angular.module("mazii").directive("setFocus", function () {
    return {
        scope: {setFocus: "="}, link: function (a, b) {
            a.setFocus && (b[0].style.background = "blue")
        }
    }
}), angular.module("mazii").directive("ngFooter", function () {
    return {restrict: "E", templateUrl: "components/footer/footer-template.html"}
}), angular.module("mazii").directive("ngNotify", function () {
    return {restrict: "E", templateUrl: "components/notify/notify-template.html"}
}), angular.module("mazii").directive("ngAffilate", function () {
    return {
        restrict: "E",
        scope: {count: "=count"},
        templateUrl: "components/affilate/affilate-template.html",
        controller: ["$rootScope", "$scope", "dictUtilSer", function (a, b, c) {
            if (b.listAffilate = [], null != a.affilate) {
                c.shuffleArray(a.affilate), b.count = parseInt(b.count);
                for (var d = 0; d < a.affilate.length && !(b.listAffilate.length >= b.count); d++)b.listAffilate.push(a.affilate[d]);
                if (b.clickToAds = function (a) {
                        null != a && null != a.name && sendGA("affiliate", "click", a.name)
                    }, b.$on("finish_get_affilate", function (c) {
                        b.listAffilate = a.affilate
                    }), 0 != b.listAffilate.length)for (var d = 0; d < b.listAffilate.length; d++)c.shuffleArray(b.listAffilate[d].link)
            }
        }]
    }
}), angular.module("mazii").directive("ngFeedback", function () {
    return {
        restrict: "E",
        templateUrl: "components/feedback/feedback-template.html",
        scope: {data: "=data"},
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "ngAudio", "userServ", "$timeout", "filterSpamSer", function (a, b, c, d, e, f, g, h) {
            var i = !1, j = [];
            b.showAlert = !1, b.indexPagination = 0, b.listRateReport = [], b.user = a.user, b.showColapse = !1;
            var k = function () {
                b.showMeanofUser(b.data.id)
            };
            b.reportMean = function (c, e) {
                var g = $("#model-web-" + c).val();
                if (b.showAlert = !1, h.filterSpamReport(g)) b.showAlert = !0, b.messageAlert = "Góp ý này chứa các ký tự spam", b.faIcon = "fa-exclamation-triangle"; else if ($("#add-mean-" + c).addClass("button-disabled"), null == g || "" == g) $("#add-mean-" + c).removeClass("button-disabled"), b.noReportModel = !0; else {
                    b.noReportModel = !1;
                    var j = a.user.userId;
                    f.addMeanUser(j, g, c, e).then(function (e) {
                        200 == e.status ? ($("#add-mean-" + c).removeClass("button-disabled"), b.messageAlert = "Thêm thành công góp ý", b.faIcon = "fa-check", null == b.listReport && (b.listReport = []), e.result.username = a.user.username, e.result.reportId = e.result.id, e.result.mean = d.renderHtmlReport(e.result.mean), b.listReport.push(e.result), b.noReport = !1, i = !1, b.showReport(c, e.result), ++b.numberReport) : 302 == e.status ? (b.messageAlert = "Xin lỗi, đã xảy ra sự cố", b.faIcon = "fa-exclamation-triangle") : (b.messageAlert = "Góp ý này không tồn tại", b.faIcon = "fa-exclamation-triangle"), b.showAlert = !0
                    })
                }
            }, b.showReport = function (c, d) {
                if (i = !i, i && null != c && null != d) {
                    if (null == a.user)return void(b.notLogin = !0);
                    b.notLogin = !1;
                    for (var e = 0; e < d.length; e++) {
                        var f = d[e];
                        if (f.userId == a.user.userId)return $("#model-web-" + c).val(f.mean), void(b.reportedMean = !0)
                    }
                    b.reportedMean = !1
                }
            }, b.updateMean = function (c, e) {
                var g = $("#model-web-" + c).val();
                if (b.showAlert = !1, h.filterSpamReport(g)) b.showAlert = !0, b.messageAlert = "Góp ý này chứa các ký tự spam", b.faIcon = "fa-exclamation-triangle"; else {
                    if ($("#update-mean-" + c).addClass("button-disabled"), null == a.user)return;
                    if (null == g || "" == g) b.noReportModel = !0, $("#update-mean-" + c).removeClass("button-disabled"); else {
                        b.noReportModel = !1;
                        var i = a.user.userId;
                        f.updateMeanUser(i, g, c, e).then(function (a) {
                            if (304 == a.status) b.messageAlert = "Góp ý này không tồn tại", b.faIcon = "fa-exclamation-triangle"; else if (302 == a.status) b.messageAlert = "Xin lỗi, đã xảy ra sự cố", b.faIcon = "fa-exclamation-triangle"; else if (b.messageAlert = "Chỉnh sửa góp ý thành công", b.faIcon = "fa-check", null != b.listReport)for (var e = b.listReport.length, f = 0; e > f; f++)if (b.listReport[f].wordId == c && b.listReport[f].userId == i) {
                                b.listReport[f].mean = d.renderHtmlReport(a.result.mean);
                                break
                            }
                            b.showAlert = !0
                        })
                    }
                }
            }, b.rateMean = function (c, d) {
                $("#user-like").addClass("button-disabled"), (null == c || null == a.user) && ("like" == d ? a.alert.notify = "Bạn cần đăng nhập để like" : a.alert.notify = "Bạn cần đăng nhập để bỏ like", $(".notify-current").fadeIn(200), g(function () {
                    $(".notify-current").fadeOut(200)
                }, 2e3));
                var e = a.user.userId;
                f.rateMean(c, e, d).then(function (a) {
                    if ($("#user-like").removeClass("button-disabled"), 200 == a.status) {
                        "like" == d ? ($(".like-" + c).addClass("active-like"), $(".dislike-" + c).removeClass("active-like")) : ($(".dislike-" + c).addClass("active-like"), $(".like-" + c).removeClass("active-like"));
                        for (var e = 0; e < b.listReport.length; e++)b.listReport[e].reportId == c && (b.listReport[e].like = a.result.like, b.listReport[e].dislike = a.result.dislike);
                        f.changeDataRateinLocal({reportId: a.result.reportId, type: d})
                    }
                })
            }, b.showMeanofUser = function (a) {
                if ($("#formReport-" + a).css("display", "block"), !b.showColapse) {
                    if (b.showAlert = !1, b.listIndex = [], b.indexPagination = 0, $("#show-report-" + a).addClass("button-disabled"), null == a)return;
                    f.getMeanById(a).then(function (c) {
                        if (b.showReport(a, c.result), g(function () {
                                $(".pagination-web li  a").css("color", "#4876FF"), $("#page-1 a").css("color", "red")
                            }, 2), $("#show-report-" + a).removeClass("button-disabled"), 304 == c.status || 0 == c.result.length) b.noReport = !0, b.numberReport = 0; else if (b.noReport = !1, b.numberReport = c.result.length, c.result = b.renderNewLineReport(c.result), c.result.length <= PAGINATION_REPORT_MEAN) b.listReport = c.result, l(); else {
                            j = c.result, b.indexPagination = 0;
                            var e = d.paginationReportMean(b.indexPagination, j);
                            b.listReport = e.result, b.showButtonPaginationPreviousLast = e.showPreviousLast, b.showButtonPaginationNextLast = e.showNextLast, b.listIndex = d.generationIndexPagination(c.result), l()
                        }
                    })
                }
                b.showColapse = !b.showColapse
            }, b.nextPagination = function () {
                if (!(null == j || 0 == j.length || (b.indexPagination + 1) * PAGINATION_REPORT_MEAN >= j.length)) {
                    b.indexPagination++;
                    var a = d.paginationReportMean(b.indexPagination, j);
                    b.listReport = a.result, b.showButtonPaginationPreviousLast = a.showPreviousLast, b.showButtonPaginationNextLast = a.showNextLast, l(), g(function () {
                        $(".pagination-web li  a").css("color", "#4876FF"), $("#page-" + (b.indexPagination + 1) + " a").css("color", "red")
                    }, 2)
                }
            }, b.nextPaginationLast = function () {
                if (null != j && 0 != j.length) {
                    b.indexPagination = Math.floor(j.length / PAGINATION_REPORT_MEAN - 1);
                    var a = d.paginationReportMean(b.indexPagination, j);
                    b.listReport = a.result, b.showButtonPaginationPreviousLast = a.showPreviousLast, b.showButtonPaginationNextLast = a.showNextLast, l(), g(function () {
                        $(".pagination-web li  a").css("color", "#4876FF"), $("#page-" + (b.indexPagination + 1) + " a").css("color", "red")
                    }, 2)
                }
            }, b.previousPagination = function () {
                if (null != j && 0 != j.length && 0 != b.indexPagination) {
                    b.indexPagination--;
                    var a = d.paginationReportMean(b.indexPagination, j);
                    b.listReport = a.result, b.showButtonPaginationPreviousLast = a.showPreviousLast, b.showButtonPaginationNextLast = a.showNextLast, l(), g(function () {
                        $(".pagination-web li  a").css("color", "#4876FF"), $("#page-" + (b.indexPagination + 1) + " a").css("color", "red")
                    }, 2)
                }
            }, b.previousPaginationLast = function () {
                if (null != j && 0 != j.length) {
                    b.indexPagination = 0;
                    var a = d.paginationReportMean(b.indexPagination, j);
                    b.listReport = a.result, b.showButtonPaginationPreviousLast = a.showPreviousLast, b.showButtonPaginationNextLast = a.showNextLast, l(), g(function () {
                        $(".pagination-web li  a").css("color", "#4876FF"), $("#page-1 a").css("color", "red")
                    }, 2)
                }
            }, b.changePagination = function (a) {
                b.indexPagination = a - 1;
                var c = d.paginationReportMean(b.indexPagination, j);
                b.listReport = c.result, b.showButtonPaginationPreviousLast = c.showPreviousLast, b.showButtonPaginationNextLast = c.showNextLast, l(), g(function () {
                    $(".pagination-web li  a").css("color", "#4876FF"), $("#page-" + a + " a").css("color", "red")
                }, 2)
            };
            var l = function () {
                var a = f.activeButtonLike(b.listReport);
                setTimeout(function () {
                    for (var b = 0; b < a.length; b++)1 == a[b].type ? $(".like-" + a[b].reportId).addClass("active-like") : $(".dislike-" + a[b].reportId).addClass("active-like")
                }, 100)
            };
            b.addOrUpdate = function (a, c, d, e) {
                13 == e.keyCode && (e.shiftKey || (d ? b.updateMean(a, c) : b.reportMean(a, c), e.preventDefault()))
            }, b.renderNewLineReport = function (a) {
                for (var b = [], c = a.length, e = 0; c > e; e++) {
                    var f = a[e], g = f.mean, h = d.renderHtmlReport(g);
                    h.length < 1 ? b.push(f) : (f.mean = h, b.push(f))
                }
                return b
            }, b.deleteMeanOfUser = function (c, d) {
                $("#confirmDeleteMeanOfUser").modal("show"), $(".deleteMeanOfUser").click(function () {
                    null == a.user || null == c ? (a.alert.notify = "Bạn chưa đăng nhập", $(".notify-current").fadeIn(200), g(function () {
                        $(".notify-current").fadeOut(200)
                    }, 2e3)) : f.deleteMean(a.user.userId, c).then(function (a) {
                        if (200 == a.status) {
                            $("#model-web-" + d).val("");
                            for (var e = b.listReport.length, f = j.length, g = 0; e > g; g++) {
                                var h = b.listReport[g];
                                h.reportId == c && b.listReport.splice(g, 1)
                            }
                            for (var i = 0; f > i; i++) {
                                var h = j[i];
                                h.reportId == c && j.splice(i, 1)
                            }
                            b.showAlert = !1, b.reportedMean = !1, $("#confirmDeleteMeanOfUser").modal("hide"), --b.numberReport
                        }
                    })
                })
            }, null == a.user ? b.notLogin = !0 : b.notLogin = !1, g(function () {
                k()
            }, 200)
        }]
    }
}), angular.module("mazii").directive("ngFlashcard", function () {
    return {
        restrict: "E",
        templateUrl: "components/flashcard/flashcard-template.html",
        scope: {data: "=data"},
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "maziiServ", "userServ", "$timeout", function (a, b, c, d, e, f, g) {
            var h = [], i = 1, j = 1, k = 1, l = 0, m = 0;
            b.i = 0, b.listFlashcard = [];
            b.check = 0, b.title = "hán tự", b.typeShow = "all", b.loadRemember = !0, b.showEmpty = !1;
            var n = [], o = [], p = function () {
                if (i = 1, l = 0, m = 0, "kanji" == a.typeJLPT) {
                    if (b.title = "hán tự", h = [], b.listFlashcard = [], null != a.listJLPT)for (var c = a.listJLPT, d = c.length, g = 0; d > g; g++) {
                        var j = c[g], k = {id: j.id, front: j.value.kanji, after: j.value.mean};
                        h.push(k)
                    }
                    b.sizeOfListFlashcard = h.length;
                    for (var g = 0; 2 > g; g++) {
                        var o = h[g].front, p = h[g].id;
                        e.search("kanji", o).then(function (a) {
                            var c = a.results[0], d = {
                                id: p,
                                front: c.kanji,
                                after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                            };
                            b.listFlashcard.push(d)
                        })
                    }
                } else if ("word" == a.typeJLPT) {
                    b.title = "từ vựng", h = [], b.listFlashcard = [], h = a.listJLPT, b.sizeOfListFlashcard = h.length;
                    var q = h[0], r = {id: q.id, front: q.word, after: {phonetic: q.phonetic, mean: q.mean}};
                    b.listFlashcard.push(r)
                } else {
                    b.title = "ngữ pháp", h = [], b.listFlashcard = [], h = a.listJLPT, b.sizeOfListFlashcard = h.length;
                    var s = h[0], r = {id: s.id, front: s.value.title, after: s.value.title};
                    b.listFlashcard.push(r)
                }
                if (null != a.user)var t = a.user.userId;
                var u = a.typeJLPT;
                f.getListRemember(t, u).then(function (a) {
                    if (200 == a.status) {
                        n = a.result;
                        for (var c = n.length, d = 0; c > d; d++)for (var e = n[d], f = h.length, g = 0; f > g; g++) {
                            var i = h[g];
                            if (e.wordId == i.id) {
                                h[g].status = 1;
                                break
                            }
                        }
                        b.remembered(h[0].id)
                    } else n = []
                })
            };
            b.flip = function (a) {
                $(".card-" + a).toggleClass("flipped")
            }, b.remembered = function (a) {
                for (var c = 0; c < h.length; c++) {
                    if ("all" != b.typeShow) {
                        if ("remember" == b.typeShow) {
                            $("#no-remember").removeClass("button-disabled"), $("#no-remember").removeClass("btn-primary"), $("#remembered").addClass("button-disabled"), $("#remembered").addClass("btn-primary");
                            break
                        }
                        $("#remembered").removeClass("button-disabled"), $("#remembered").removeClass("btn-primary"), $("#no-remember").addClass("button-disabled"), $("#no-remember").addClass("btn-primary");
                        break
                    }
                    if (h[c].id == a && 1 == h[c].status) {
                        $("#no-remember").removeClass("button-disabled"), $("#no-remember").removeClass("btn-primary"), $("#remembered").addClass("button-disabled"), $("#remembered").addClass("btn-primary");
                        break
                    }
                    $("#remembered").removeClass("button-disabled"), $("#remembered").removeClass("btn-primary"), $("#no-remember").addClass("button-disabled"), $("#no-remember").addClass("btn-primary")
                }
            }, b.next = function () {
                if (b.remembered(h[++b.i].id), "kanji" == a.typeJLPT && "remember" == b.typeShow) {
                    ++j;
                    var c = n[j].front, d = n[j].id;
                    e.search("kanji", c).then(function (a) {
                        var c = a.results[0], e = {
                            id: d,
                            front: c.kanji,
                            after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                        };
                        b.listFlashcard.push(e)
                    })
                }
                if ("kanji" == a.typeJLPT && "notRemember" == b.typeShow) {
                    ++k;
                    var c = o[k].front, d = o[k].id;
                    e.search("kanji", c).then(function (a) {
                        var c = a.results[0], e = {
                            id: d,
                            front: c.kanji,
                            after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                        };
                        b.listFlashcard.push(e)
                    })
                }
                if ("kanji" == a.typeJLPT && "all" == b.typeShow) {
                    ++i;
                    var c = h[i].front, d = h[i].id;
                    e.search("kanji", c).then(function (a) {
                        var c = a.results[0], e = {
                            id: d,
                            front: c.kanji,
                            after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                        };
                        b.listFlashcard.push(e)
                    })
                } else if ("word" == a.typeJLPT && "all" == b.typeShow) {
                    if (++l, l < h.length) {
                        var f = {id: h[l].id, front: h[l].word, after: {phonetic: h[l].phonetic, mean: h[l].mean}};
                        b.listFlashcard.push(f)
                    }
                } else if ("grammar" == a.typeJLPT && "all" == b.typeShow && (++m, m < h.length)) {
                    var f = {id: h[m].id, front: h[m].value.title, after: h[m].value.title};
                    b.listFlashcard.push(f)
                }
            }, b.prev = function () {
                b.remembered(h[--b.i].id)
            }, b.showExampleKanji = function (a) {
                var b = "";
                return a.length > 25 ? (b = a.substr(0, 25), b += "...") : b = a, b
            }, b.getBeautyTitleGrammar = function (a) {
                return null == a ? null : a.split("=>")[0]
            }, b.showExampleGrammar = function (a) {
                var b = "";
                return b = a.substr(a.indexOf("=>") + 2, a.length - 1)
            }, b.seclectToShow = function (c) {
                if (b.loadRemember = !1, "all" == c) {
                    b.typeShow = "all", b.i = 0, b.listFlashcard = [], n = [], b.showEmpty = !1;
                    for (var d = h.length, f = 0; d > f; f++)if ("word" == a.typeJLPT) {
                        var g = {id: h[f].id, front: h[f].word, after: {phonetic: h[f].phonetic, mean: h[f].mean}};
                        b.listFlashcard.push(g)
                    } else if ("grammar" == a.typeJLPT) {
                        var g = {id: h[f].id, front: h[f].value.title, after: h[f].value.title};
                        b.listFlashcard.push(g)
                    } else n.push(h[f]);
                    if ("kanji" == a.typeJLPT)for (var f = 0; 2 > f; f++) {
                        var i = h[f].front, j = h[f].id;
                        e.search("kanji", i).then(function (a) {
                            var c = a.results[0], d = {
                                id: j,
                                front: c.kanji,
                                after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                            };
                            b.listFlashcard.push(d)
                        })
                    }
                    b.remembered(h[0].id), b.sizeOfListFlashcard = b.listFlashcard.length, "kanji" == a.typeJLPT && (b.sizeOfListFlashcard = h.length), 0 == b.sizeOfListFlashcard && (b.showEmpty = !0), b.loadRemember = !0
                } else if ("remember" == c) {
                    b.typeShow = "remember", b.listFlashcard = [], n = [], b.showEmpty = !1, $("#no-remember").removeClass("button-disabled"), $("#no-remember").removeClass("btn-primary"), $("#remembered").addClass("button-disabled"), $("#remembered").addClass("btn-primary");
                    for (var d = h.length, f = 0; d > f; f++)if (null != h[f].status && 1 == h[f].status)if ("word" == a.typeJLPT) {
                        var g = {id: h[f].id, front: h[f].word, after: {phonetic: h[f].phonetic, mean: h[f].mean}};
                        b.listFlashcard.push(g)
                    } else if ("grammar" == a.typeJLPT) {
                        var g = {id: h[f].id, front: h[f].value.title, after: h[f].value.title};
                        b.listFlashcard.push(g)
                    } else n.push(h[f]);
                    if ("kanji" == a.typeJLPT) {
                        var k = n.length;
                        if (k >= 2)for (var f = 0; 2 > f; f++) {
                            var i = n[f].front, j = n[f].id;
                            e.search("kanji", i).then(function (a) {
                                var c = a.results[0], d = {
                                    id: j,
                                    front: c.kanji,
                                    after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                                };
                                b.listFlashcard.push(d)
                            })
                        } else {
                            var i = n[0].front, j = n[0].id;
                            e.search("kanji", i).then(function (a) {
                                var c = a.results[0], d = {
                                    id: j,
                                    front: c.kanji,
                                    after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                                };
                                b.listFlashcard.push(d)
                            })
                        }
                    }
                    b.sizeOfListFlashcard = b.listFlashcard.length, "kanji" == a.typeJLPT && (b.sizeOfListFlashcard = n.length), 0 == b.sizeOfListFlashcard && (b.showEmpty = !0), b.loadRemember = !0
                } else if ("notRemember" == c) {
                    b.typeShow = "notRemember", b.listFlashcard = [], o = [], b.showEmpty = !1, $("#remembered").removeClass("button-disabled"), $("#remembered").removeClass("btn-primary"), $("#no-remember").addClass("button-disabled"), $("#no-remember").addClass("btn-primary");
                    for (var d = h.length, f = 0; d > f; f++)if (null == h[f].status || 1 != h[f].status)if ("word" == a.typeJLPT) {
                        var g = {id: h[f].id, front: h[f].word, after: {phonetic: h[f].phonetic, mean: h[f].mean}};
                        b.listFlashcard.push(g)
                    } else if ("grammar" == a.typeJLPT) {
                        var g = {id: h[f].id, front: h[f].value.title, after: h[f].value.title};
                        b.listFlashcard.push(g)
                    } else o.push(h[f]);
                    if ("kanji" == a.typeJLPT) {
                        var l = o.length;
                        if (l >= 2)for (var f = 0; 2 > f; f++) {
                            var i = o[f].front, j = o[f].id;
                            e.search("kanji", i).then(function (a) {
                                var c = a.results[0], d = {
                                    id: j,
                                    front: c.kanji,
                                    after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                                };
                                b.listFlashcard.push(d)
                            })
                        } else {
                            var i = o[0].front, j = o[0].id;
                            e.search("kanji", i).then(function (a) {
                                var c = a.results[0], d = {
                                    id: j,
                                    front: c.kanji,
                                    after: [{kun: c.kun, on: c.on, mean: c.mean, examples: c.examples}]
                                };
                                b.listFlashcard.push(d)
                            })
                        }
                    }
                    b.sizeOfListFlashcard = b.listFlashcard.length, "kanji" == a.typeJLPT && (b.sizeOfListFlashcard = o.length), 0 == b.sizeOfListFlashcard && (b.showEmpty = !0), b.loadRemember = !0
                }
            }, b.clickRemember = function () {
                var b = $(".active .flash-id").val(), c = a.user.userId, d = a.typeJLPT;
                f.rememberFlash(c, b, d).then(function (a) {
                    if (200 == a.status) {
                        for (var c = h.length, d = 0; c > d; d++) {
                            var e = h[d];
                            if (b == e.id) {
                                h[d].status = 1;
                                break
                            }
                        }
                        $("#no-remember").removeClass("button-disabled"), $("#no-remember").removeClass("btn-primary"), $("#remembered").addClass("button-disabled"), $("#remembered").addClass("btn-primary")
                    } else console.log("thất bại")
                })
            }, b.clickNoRemember = function () {
                var b = $(".active .flash-id").val(), c = a.user.userId, d = a.typeJLPT;
                f.noRememberFlash(c, b, d).then(function (a) {
                    if (200 == a.status) {
                        for (var c = h.length, d = 0; c > d; d++) {
                            var e = h[d];
                            if (b == e.id) {
                                h[d].status = null;
                                break
                            }
                        }
                        $("#remembered").removeClass("button-disabled"), $("#remembered").removeClass("btn-primary"), $("#no-remember").addClass("button-disabled"), $("#no-remember").addClass("btn-primary")
                    } else console.log("thất bại")
                })
            }, b.activeFlashcard = function (a) {
                return 0 == a ? "active" : ""
            }, p(), a.$on("jlpt.data.change", function (a, b) {
                p()
            })
        }]
    }
}), angular.module("mazii").directive("ngNewreport", function () {
    return {
        restrict: "E",
        templateUrl: "components/newreport/newreport-template.html",
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "maziiServ", "userServ", "$timeout", function (a, b, c, d, e, f, g) {
            var h = 0, i = 0, j = [], k = null;
            b.valNext = "Xem tiếp", b.listNewMean = [], b.nextSkip = function () {
                ++h, m()
            }, b.convertTime = function (a) {
                try {
                    var b = new Date(a), c = 60 * b.getTimezoneOffset() * 1e3, d = new Date(b.getTime() - c);
                    return d.toISOString()
                } catch (e) {
                    return ""
                }
            }, b.$on("$destroy", function () {
                null != k && clearInterval(k)
            });
            var l = function () {
                k = setInterval(function () {
                    f.getNewMean(0).then(function (a) {
                        h = 0, b.valNext = "Xem tiếp", $(".box-notify-mean .next").removeClass("button-disabled"), 200 == a.status && (b.listNewMean = a.result), 10 * (h + 1) >= i && (b.valNext = "Hết...", $(".box-notify-mean .next").addClass("button-disabled")), setTimeout(function () {
                            $(".user").timeago()
                        }, 100)
                    })
                }, 18e5)
            }, m = function () {
                f.getNewMean(h).then(function (a) {
                    if (0 != a.count && (i = a.count), 200 == a.status) {
                        j = a.result;
                        for (var c = j.length, d = 0; c > d; d++)b.listNewMean.push(j[d])
                    }
                    10 * (h + 1) >= i && (b.valNext = "Hết...", $(".box-notify-mean .next").addClass("button-disabled")), setTimeout(function () {
                        $(".user").timeago()
                    }, 500)
                })
            };
            b.directToFeedback = function (b) {
                var c = {query: b, type: "word", tag: "searchpage"};
                a.$broadcast("query", c)
            }, m(), l()
        }]
    }
}), angular.module("mazii").directive("ngEmailhole", function () {
    return {
        restrict: "E",
        templateUrl: "components/emailhole/emailhole-template.html",
        controller: ["$rootScope", "$scope", "dictUtilSer", "$timeout", "localstoreServ", function (a, b, c, d, e) {
            function f(a) {
                var b = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return b.test(a)
            }

            b.msgErr = null, b.registered = !1, b.sending = !1, b.noRegister = function () {
                e.setItem("emailhole_news_songngu", !0), a.showEmailHole = !1, sendGA("emailhole", "news", "reject")
            }, b.register = function (c, d) {
                return null == c && (c = ""), null == d && (d = ""), c = c.trim(), d = d.trim(), "" == c ? void(b.msgErr = "Bạn hãy nhập vào email") : 0 == f(c) ? void(b.msgErr = "Email không đúng định dạng") : "" == d ? void(b.msgErr = "Bạn hãy nhập vào tên") : void(1 != b.sending && (b.sending = !0, e.setItem("emailhole_news_songngu", !0), a.showEmailHole = !1, sendGA("emailhole", "news", "registered")))
            }
        }]
    }
}), angular.module("mazii").directive("ngMaziiQa", function () {
    return {
        restrict: "E",
        scope: {count: "=count"},
        templateUrl: "components/mazii-qa/mazii-qa-directive.html",
        controller: ["$rootScope", "$scope", "$http", function (a, b, c) {
            c.get("http://qa.mazii.net/?json=get_recent_posts&post_type=question").then(function (a) {
                b.data = a.data.posts
            })
        }]
    }
}), angular.module("mazii").directive("ngCheckCategory", function () {
    return {
        restrict: "E",
        templateUrl: "components/check-category/check-category.html",
        controller: ["$rootScope", "$scope", "$http", "dictUtilSer", "maziiServ", "userServ", "$timeout", "categoryServ", function (a, b, c, d, e, f, g, h) {
            var i = {};
            b.Indata = [], b.names = [], b.showHome = !0, b.showFeedback = !1;
            var j = function () {
                localStorage.getItem("dataNew") && (i = JSON.parse(localStorage.getItem("dataNew"))), i.length > 0 ? (b.notShow = !0, b.showCategory = !1, l(i), b.notNull = !0) : b.notNull = !1
            };
            b.feedback = function (c) {
                if ($(".thankForFeedback").hide(), c)if (i.length > 0) {
                    var d = k(i[i.length - 1].example);
                    e.sendFeedback(i[i.length - 1].entity_id, i[i.length - 1].category_id, null, 1, d, function (a) {
                    }), i.splice(i.length - 1, 1), localStorage.setItem("dataNew", JSON.stringify(i)), b.showFeedback = !1, b.thankForFeedback = !0, b.showHome = !1, setTimeout(function () {
                        $(".thankForFeedback").fadeOut()
                    }, 1e3), g(function () {
                        b.thankForFeedback = !1, b.showHome = !0
                    }, 1e3), a.$broadcast("reloadData"), j()
                } else a.$broadcast("removeData"), localStorage.removeItem("dataNew"); else b.showCategory = !1, b.Indata.feed = null, b.notShow = !0, b.showHome = !1, b.showFeedback = !0, h.getAllCategory(function (a) {
                    for (var c = 0; c < a.length; c++)b.names[c] = a[c]
                })
            }, b.$on("addNewData", function (a, c) {
                b.notNull = !0, b.showHome = !0, b.showFeedback = !1, i = c, l(i)
            }), b.selectCategory = function (a) {
                b.Indata.id = a.id, b.Indata.feed = a.vi_name, b.newCategory = a.vi_name, b.showCategory = !0, b.notShow = !1
            }, b.$on("reloadDataCategory", function () {
                j()
            }), b.sendFeedback = function (c) {
                if ("send" == c) {
                    if (i.length > 0 && b.showCategory) {
                        var d = k(b.exampleCategory);
                        e.sendFeedback(i[i.length - 1].entity_id, i[i.length - 1].category_id, b.Indata.id, 0, d, function (a) {
                        }), i.splice(i.length - 1, 1), localStorage.setItem("dataNew", JSON.stringify(i)), l(i), b.showFeedback = !1, b.thankForFeedback = !0, setTimeout(function () {
                            b.thankForFeedback = !1, $(".thankForFeedback").fadeOut()
                        }, 1e3), g(function () {
                            b.showHome = !0
                        }, 1e3), a.$broadcast("reloadData")
                    } else if (i.length <= 0 && (b.notNull = !1), !b.showCategory) {
                        var d = k(b.exampleCategory);
                        e.sendFeedback(i[i.length - 1].entity_id, i[i.length - 1].category_id, -1, 0, d, function (a) {
                        }), i.splice(i.length - 1, 1), localStorage.setItem("dataNew", JSON.stringify(i)), l(i), b.showFeedback = !1, b.thankForFeedback = !0, setTimeout(function () {
                            b.thankForFeedback = !1, $(".thankForFeedback").fadeOut()
                        }, 1e3), g(function () {
                            b.showHome = !0
                        }, 1e3), a.$broadcast("reloadData")
                    }
                } else b.showHome = !0, b.showFeedback = !1
            };
            var k = function (a) {
                var b = a.replace(/<rt>.*?<\/rt>/g, "");
                return b = b.replace(/<.*?>/g, ""), b = b.replace(/\n/g, "")
            };
            b.removeCategory = function () {
                b.Indata.feed = null, b.notShow = !0, b.showCategory = !1
            };
            var l = function (a) {
                if (a.length > 0) {
                    var c = a[a.length - 1];
                    b.wordCategory = c.text, b.category = c.category_vi_name, m(c.example)
                }
            }, m = function (a) {
                var c = a, d = b.wordCategory, e = c.indexOf(d), f = d.length, g = c.slice(0, e), h = c.slice(e, e + f),
                    i = c.slice(e + f, c.length), j = g + '<span class="bg-color">' + h + "</span>" + i;
                b.exampleCategory = j
            };
            j()
        }]
    }
}), angular.module("mazii").directive("ngCheckCategoryModal", function () {
    return {
        restrict: "E",
        templateUrl: "components/check-category/feedback-category-modal.html",
        controller: ["$rootScope", "$scope", "maziiServ", "categoryServ", function (a, b, c, d) {
            b.names = [], b.Indata = [];
            var e, f, g = null;
            b.Correct = !0;
            var h;
            b.ShowChange = !0, b.modalfeedback = !0;
            var i = function () {
                h = h = JSON.parse(localStorage.getItem("dataNew")), b.thankForFba = !1;
                for (var a = !1, c = 0; c < h.length; c++)if (b.aux.entity == h[c].text) {
                    a = !0;
                    break
                }
                a || (b.modalfeedback = !1)
            };
            b.$on("reloadData", function () {
                i()
            }), b.checkCorrect = function (a) {
                switch (a) {
                    case"correct":
                        f = d.getIdCategory(b.aux.category).id;
                        var c = null;
                        if (h)for (var g = 0; g < h.length; g++)if (b.aux.entity == h[g].text) {
                            c = h[g].example;
                            break
                        }
                        e = {
                            id_entity: b.aux.id,
                            id_category: f,
                            id_newCategory: null,
                            correct: 1,
                            sentence: c
                        }, b.showAddCategory = !1;
                        break;
                    case"Incorrect":
                        e = null, d.getAllCategory(function (a) {
                            for (var c = 0; c < a.length; c++)b.names[c] = a[c]
                        }), b.ShowChange = !1, b.showAddCategory = !0
                }
            }, b.sendSubmit = function () {
                if (b.ShowChange = !1, null != e) {
                    for (var c = 0; c < h.length; c++)if (e.id_entity == h[c].entity_id) {
                        h.splice(c, 1), localStorage.setItem("dataNew", JSON.stringify(h));
                        break
                    }
                    j(e.id_entity, e.id_category, e.newCategory, e.correct, e.sentence), a.$broadcast("reloadData"), b.thankForFba = !0, b.showAddCategory = !1, $("#feedback-modal").fadeOut(4e3), setTimeout(function () {
                        b.modalfeedback = !1
                    }, 3e3), b.ShowChange = !1
                }
            }, b.sendFeedBack = function (a, c) {
                switch (a) {
                    case"send":
                        var e;
                        if (b.showCategory) {
                            e = d.getIdCategory(c.category).id;
                            for (var f = "", i = 0; i < h.length; i++)if (h[i].entity_id == c.id) {
                                f = h[i].example, h[i] = h[i + 1], h.pop(), localStorage.setItem("dataNew", JSON.stringify(h));
                                break
                            }
                            j(c.id, e, g, 0, f)
                        } else {
                            e = d.getIdCategory(c.category).id;
                            for (var f = "", i = 0; i < h.length; i++)if (h[i].entity_id == c.id) {
                                f = h[i].example, h[i] = h[i + 1], h.pop(), localStorage.setItem("dataNew", JSON.stringify(h));
                                break
                            }
                            j(c.id, e, -1, 0, f)
                        }
                        b.thankForFba = !0, b.showAddCategory = !1, $("#feedback-modal").fadeOut(4e3), setTimeout(function () {
                            b.modalfeedback = !1
                        }, 3e3), b.ShowChange = !1;
                        break;
                    case"cancel":
                        b.ShowChange = !0, b.showAddCategory = !1
                }
            };
            var j = function (b, d, e, f, g) {
                var i = g.replace(/<rt>.*?<\/rt>/g, "");
                i = i.replace(/\n/g, ""), localStorage.setItem("dataNew", JSON.stringify(h)), a.$broadcast("reloadDataCategory"), c.sendFeedback(b, d, e, f, i)
            };
            b.removeCategory = function () {
                b.showCategory = !1
            }, b.selectCategory = function (a) {
                b.showCategory = !0, b.newCategory = a.vi_name, b.Indata.feed = null, g = d.getIdCategory(a.en_name).id
            }, i()
        }]
    }
}), angular.module("mazii").controller("SearchController", ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "$stateParams", "$location", "localstoreServ", "ngAudio", "$window", "$http", function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
    initSearchCtrl = !0;
    var n = !1;
    b.examples = null, b.words = null, b.kanjis = null, b.grammars = null, b.suggest = null, b.googleTranslate = null, a.title = "Tìm kiếm", b.noResultsKanjis = !0, b.tabSelected = 0, b.showLoading = !1, b.currentKanjiSelected = 0, b.noResults = !1, b.showNotifynewVersion = SHOW_NOTIFY_NEW_VERSION, b.startSearch = !1, b.showReportBox = [];
    var o, p = !1, q = "", r = j.getItem("showSuggest");
    b.showKanjiDrawTable = function () {
        p = !p, 0 == p && (q = $("#search-text-box").val(), "" != q && b.startQuery(q))
    }, b.queryNotNull = function () {
        return null != q && "" != q
    }, b.getCurrentQuery = function () {
        return q
    }, b.isShowKanjiDraw = function () {
        return p
    }, b.inputEnter = function () {
        q = $("#search-text-box").val(), "" != q && b.startQuery(q)
    }, b.$on("query", function (a, c) {
        if (null != c && "quick-search" != c.tag)if (null == c.query) q = c, b.startQuery(c, !0); else {
            if ("grammarDetail" == c.type)return;
            q = c.query, b.setTabByChar(c.type[0]), b.startQuery(q, !0)
        }
    }), b.filter = function (a) {
        if (r) {
            var b = a.query, c = null;
            if (f.isJapanese(b)) c = f.realtimeSearch("ja", b); else if (f.isVietnamese(b)) c = f.realtimeSearch("vi", b); else {
                b.length > 1 && b[0] == b[0].toUpperCase() && b[1] == b[1].toLowerCase() && (b = b.toLowerCase());
                var d = wanakana.toKana(b);
                c = f.realtimeSearch("ja", d), c.splice(0, 0, b)
            }
            return c
        }
        return []
    }, b.$on("insertQueryText", function (a, b) {
        if (null != b && "" != b) {
            var c = $("#search-text-box").val();
            c += b, $("#search-text-box").val(c)
        }
    }), b.clearQuery = function () {
        $("#search-text-box").val(""), q = "", b.suggestSen = [], setTimeout(function () {
            $("#search-text-box").focus();
        }, 10)
    }, b.changePlaceHolder = function () {
        var a = "", c = b.tabSelected;
        switch (c) {
            case 0:
                a = "日本, nihon, Nhật Bản";
                break;
            case 1:
                a = "公, công";
                break;
            case 2:
                a = "優しい, yasashii, tốt bụng";
                break;
            case 3:
                a = "のに, để"
        }
        $("#search-text-box").attr("placeholder", a)
    }, b.getTypeButtonClass = function (a) {
        return a == b.tabSelected ? "btn-primary" : "btn-default"
    }, b.changeTypeSearch = function (a, c) {
        if (a != b.tabSelected) {
            b.tabSelected = a, 1 == p && (p = !1), $(".search-input-container button").removeClass("tab-active"), $("#tab" + a).addClass("tab-active");
            var d = "";
            switch (a) {
                case 0:
                    d = "日本, nihon, Nhật Bản", o = "word";
                    break;
                case 1:
                    d = "公, công", o = "kanji";
                    break;
                case 2:
                    d = "優しい, yasashii, tốt bụng", o = "example";
                    break;
                case 3:
                    d = "のに, để", o = "grammar"
            }
            $("#search-text-box").attr("placeholder", d), 1 != c && (q = $("#search-text-box").val(), q && "" != q && b.startQuery(q))
        }
    };
    var s = null;
    b.enterInput = function (c) {
        null != c && "" != c ? (null != s && clearTimeout(s), c.length > 1 && c[0] == c[0].toUpperCase() && c[1] == c[1].toLowerCase() && (c = c.toLowerCase()), s = setTimeout(function () {
            var d = {type: o, query: c};
            b.suggestSen = b.filter(d), 1 != b.tabSelected || f.isJapanese(c) || (b.suggestSen = []), new v("search-text-box", "list-suggest-history");
            var e = $(".search-box-range").width();
            $(".list-suggest-history").css("width", e), b.$$phase || a.$$phase || b.$digest()
        }, 400)) : (b.suggestSen = [], clearTimeout(s), s = null)
    }, b.suggestClick = function (a) {
        f.isJapanese(a) ? b.startQuery(a.split(" ")[0], !0) : b.startQuery(a, !0)
    }, b.startQuery = function (c, d) {
        b.startSearch = !0, null != s && clearTimeout(s), p = !1, b.showServerContent = !1, q = c, b.noResults = !1, b.examples = null, b.words = null, b.kanjis = null, b.grammars = null, b.suggest = null, b.googleTranslate = null, b.lang = "JA", b.showLoading = !0, 1 == b.tabSelected && (d = !0);
        var h = !1;
        if (0 == f.isJapanese(c) && (f.isVietnamese(c) || null != d ? (c = c.toLowerCase(), h = !0, b.lang = "VI") : (c.length > 1 && c[0] == c[0].toUpperCase() && c[1] == c[1].toLowerCase() && (c = c.toLowerCase()), c = wanakana.toKana(c))), q = c, $("#search-text-box").val(q), b.query = c, 0 == b.tabSelected) {
            g.push(c, "word", b.lang);
            var j = "javi";
            ("VI" == b.lang || h) && (j = "vija"), e.search("word", c, j).then(function (d) {
                var g = "ja", h = "vi";
                if (f.isJapanese(c) ? (g = "ja", h = "vi") : (g = "vi", h = "ja"), null == d)return b.words = null, f.showLoading(!1), void e.googleTranslate(c, g, h, function (c) {
                    null == c && (b.noResults = !0), b.googleTranslate = c, b.$$phase || a.$$phase || b.$digest()
                });
                if (200 == d.status) {
                    if (null != d.data)for (var i = 0; i < d.data.length; i++)if (d.data[i].word == c || d.data[i].phonetic == c) {
                        d.found = !0;
                        break
                    }
                    if (0 == d.found) b.suggest = d.data; else {
                        b.words = [], b.suggest = [];
                        for (var i = 0; i < d.data.length; i++)d.data[i].word == c || d.data[i].phonetic == c ? b.words.push(d.data[i]) : b.suggest.push(d.data[i])
                    }
                    b.showLoading = !1
                } else b.words = null, b.showLoading = !1;
                e.googleTranslate(c, g, h).then(function (a) {
                    b.googleTranslate = a, null == b.$$phase && b.$apply()
                })
            }, function (a) {
                b.words = null, b.showLoading = !1, b.noResults = !0
            }), e.search("kanji", c).then(function (a) {
                if (200 == a.status) {
                    if (f.isJapanese(c)) {
                        var d = f.getKanjiChara(c);
                        b.resultKanjis = f.sortHVDataByKeyWord(d, a.results)
                    } else b.resultKanjis = a.results;
                    b.noResultsKanjis = !1
                } else b.resultKanjis = null, b.noResultsKanjis = !0
            }, function (a) {
                b.resultKanjis = null, b.noResultsKanjis = !0
            }), sendGA("search", "word", c)
        } else 1 == b.tabSelected ? (e.search("kanji", c).then(function (a) {
            if (b.currentKanjiSelected = 0, 200 == a.status) {
                if (f.isJapanese(c)) {
                    var d = f.getKanjiChara(c);
                    b.kanjis = f.sortHVDataByKeyWord(d, a.results)
                } else b.kanjis = a.results;
                b.showLoading = !1, g.push(c, "kanji", b.lang)
            } else b.kanjis = null, b.showLoading = !1, b.noResults = !0
        }, function (a) {
            b.kanjis = null, b.showLoading = !1, b.noResults = !0
        }), sendGA("search", "kanji", c)) : 3 == b.tabSelected ? (e.search("grammar", c).then(function (a) {
            200 == a.status ? (b.grammars = a.results, b.showLoading = !1, g.push(c, "grammar", b.lang)) : (b.grammars = null, b.showLoading = !1, b.noResults = !0)
        }, function (a) {
            b.grammars = null, b.showLoading = !1, b.noResults = !0
        }), sendGA("search", "grammar", c)) : 2 == b.tabSelected && (e.search("example", c).then(function (a) {
                200 == a.status ? (b.examples = a.results, b.showLoading = !1, g.push(c, "example", b.lang)) : (b.examples = null, b.showLoading = !1, b.noResults = !0)
            }, function (a) {
                b.examples = null, b.showLoading = !1, b.noResults = !0
            }), sendGA("search", "example", c));
        if (b.suggestSen = [], 0 == n) {
            var k = "/search?type=" + b.getCurrentType() + "&query=" + c;
            i.url(k), i.replace(), l.history.pushState(null, "Search", i.absUrl())
        }
    }, b.changeKanjiShow = function (a) {
        b.currentKanjiSelected = a
    }, b.getCurrentKanji = function () {
        return b.kanjis[b.currentKanjiSelected]
    }, b.kanjiSeletectClass = function (a) {
        return b.currentKanjiSelected == a ? "selected" : ""
    }, b.getCurrentType = function () {
        switch (b.tabSelected) {
            case 0:
                return "w";
            case 1:
                return "k";
            case 2:
                return "s";
            case 3:
                return "g"
        }
        return "w"
    }, b.setTabByChar = function (a) {
        var c = 0;
        null == a || "" == a ? c = 0 : "w" == a ? c = 0 : "k" == a ? c = 1 : "e" == a ? c = 2 : "g" == a ? c = 3 : "s" == a && (c = 2), b.changeTypeSearch(c, !0)
    };
    var t = (h.type, h.query);
    b.setTabByChar(t), null != t && "" != t ? (q = t, b.startQuery(t)) : q = "", b.$on("searchKanji", function (a, c) {
        b.changeTypeSearch(1, !0), b.startQuery(c)
    }), b.showServerContent = !1, $("#search-text-box").on("input", function () {
        var a = $("#search-text-box").val();
        a = a.trim(), q = a, b.enterInput(a)
    }), b.showHistoryPanel = function () {
        $(".history-panel").addClass("open-history-panel"), $(".cover").css("display", "block"), $("body").css("overflow", "hidden")
    }, b.showDetailSuggest = function (a) {
        $(".icon_" + a).addClass("hiden"), $(".detail_" + a).removeClass("hiden"), $("." + a).addClass("hiden"), $("#feedback-suggest-" + a).removeClass("hiden"), b.showReportBox[a] = !0
    }, b.convertKindToReadable = function (a) {
        return null == a || "" == a ? "" : f.convertKindToReadable(a)
    }, b.playAudio = function (a) {
        var c = "http://data.mazii.net/audios/", d = c + f.convertJptoHex(a).toUpperCase() + ".mp3";
        b.sound = k.load(d), b.sound.play()
    }, a.$on("chaneShowSuggest", function (a) {
        r = j.getItem("showSuggest")
    }), b.setQueryType = function (b, c, e) {
        null == a.user ? (a.alert.notify = "Đăng nhập để sử dụng tính năng", $(".notify-current").fadeIn(200), d(function () {
            $(".notify-current").fadeOut(200)
        }, 1e3)) : ($("#myNote").modal("show"), e.means.length > 0 ? a.meanMyNote = e.means[0].mean : a.meanMyNote = "", a.$broadcast("setQueryType", {
            query: b,
            type: c
        }))
    }, b.translate = function () {
        "" != b.text && (a.$broadcast("query", {
            type: "word",
            query: b.text,
            tag: "quick-search"
        }), $(".box-search").css("display", "none"))
    }, a.showAllMean = !1, b.$on("$locationChangeSuccess", function (a, c, d, e, f) {
        var g = /type=(.)&query=(.+)/i, h = c.match(g);
        if (null != h && 3 == h.length) {
            var i = h[1], j = decodeURIComponent(h[2]);
            if (j == q)return void(n = !1);
            n = !0, b.setTabByChar(i), b.startQuery(j, !0)
        }
    }), $(document).on("mousemove", function (a) {
        b.x = a.pageX, b.y = a.pageY
    });
    var u = 100, v = function (a, b) {
        function c() {
            40 == window.event.keyCode ? (document.getElementById("list-suggest-history").scrollTop = u, u += 40) : 38 == window.event.keyCode && (u -= 40, document.getElementById("list-suggest-history").scrollTop = u)
        }

        var d = this;
        this.textbox = document.getElementById(a), this.div = document.getElementById(b), this.list = this.div.getElementsByTagName("div"), this.pointer = null, this.textbox.onkeydown = function (a) {
            switch (a = a || window.event, a.keyCode) {
                case 38:
                    d.selectDiv(-1);
                    break;
                case 40:
                    d.selectDiv(1)
            }
        }, this.selectDiv = function (a) {
            if (this.pointer > 1 && c(), 0 == this.pointer && (document.getElementById("list-suggest-history").scrollTop = 0), null !== this.pointer && this.pointer + a >= 0 && this.pointer + a < this.list.length) {
                this.list[this.pointer].className = "suggest-item", this.pointer += a, this.list[this.pointer].className = "active-suggest";
                var b = this.list[this.pointer].innerHTML;
                b = b.substring(56, b.length);
                for (var d = 0; d < b.length; d++)if ("<" == b[d]) {
                    b = b.substring(0, d);
                    break
                }
                this.textbox.value = b
            }
            if (null === this.pointer) {
                this.pointer = 0, u = 20, this.list[this.pointer].className = "active-suggest";
                var b = this.list[this.pointer].innerHTML;
                b = b.substring(56, b.length);
                for (var d = 0; d < b.length; d++)if ("<" == b[d]) {
                    b = b.substring(0, d);
                    break
                }
                this.textbox.value = b
            }
        }
    };
    $("body").removeClass("hidden"), f.showTitlePage(), sendGA("pageview", "search")
}]), angular.module("mazii").controller("NewsController", ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$stateParams", "$location", "categoryServ", function (a, b, c, d, e, f, g, h, i, j, k) {
    var l = i.id;
    b.showVideo = !1, a.title = "Đọc báo";
    var m = [];
    localStorage.getItem("dataNew") && (m = localStorage.getItem("dataNew")), b.$on("changeDetailNews", function (a, c) {
        e.getDetailNews(c.id).then(function (a) {
            b.currentNews = a, b.showVideo = !1, -1 == o.indexOf(a._id) && (o.push(a._id), localStorage.setItem("news_read", JSON.stringify(o)), n(a)), j.search("id", a._id), e.sendAltNewsLog(a._id)
        })
    }), b.$on("removeData", function () {
        m = [], localStorage.removeItem("dataNew")
    });
    var n = function (b) {
        var c = b.content.textmore.replace(/<rt>.*?<\/rt>/g, "");
        c = c.replace(/<.*?>/g, "");
        var d = b.content.textbody.replace(/<rt>.*?<\/rt>/g, "");
        d = d.replace(/<.*?>/g, ""), d = d.concat(d, c), d = d.split("。"), "string" == typeof m && (m = JSON.parse(m));
        for (var e, f, g = {}, h = 0; h < b.def.length; h++)for (var i = 0; i < d.length; i++)if (-1 != d[i].indexOf(b.def[h].entity)) {
            var j = k.getIdCategory(b.def[h].category);
            if (null == j)continue;
            e = j.id, f = j.vi_name, g = {
                entity_id: b.def[h].id,
                category_id: e,
                text: b.def[h].entity,
                example: d[i],
                category: b.def[h].category,
                category_vi_name: f
            }, m.push(g);
            break
        }
        a.$broadcast("addNewData", m), localStorage.setItem("dataNew", JSON.stringify(m))
    };
    b.playVideo = function () {
        b.showVideo = !0
    }, b.getNewsReadClass = function (a) {
        var b = -1 != o.indexOf(a) ? "news_read" : "";
        return b
    }, b.checkLink = function (a) {
        if (-1 != a.indexOf("http"))return a;
        for (var c = b.currentNews.link, d = 0, e = c.length - 1; e >= 0; e--)if ("/" == c[e]) {
            d = e;
            break
        }
        return c = c.substring(0, d + 1), c + a
    }, b.getVideo = function () {
        return b.isMobile() ? '<video class="movie-news-sm movie-news-md" controls>                     <source src="https://nhkmovs-i.akamaihd.net/i/news/' + b.currentNews.content.video + '/master.m3u8" type="video/mp4">                     Your browser does not support the video tag.                     </video>' : '<object type="application/x-shockwave-flash" data="http://www3.nhk.or.jp/news/player5.swf" class="movie-news-sm movie-news-md" id="news_image_div3" style="visibility: visible;">             <param name="allowScriptAccess" value="sameDomain">             <param name="allowFullScreen" value="true">             <param name="wmode" value="direct">             <param name="quality" value="high">             <param name="bgcolor" value="#000000">             <param name="flashvars" value="fms=rtmp://flv.nhk.or.jp/ondemand/flv/news/&amp;movie=' + b.currentNews.content.video + '"></object>'
    }, b.getAudio = function () {
        var a = b.currentNews.content.audio;
        return a = "http://www3.nhk.or.jp/news/easy/" + a.replace(".mp3", "") + "/" + a, '<audio controls><source src="' + a + '" type="audio/mpeg"></audio>'
    }, b.videoAvailable = function () {
        if ("undefined" != typeof device && navigator.connection.type == Connection.NONE)return !1;
        var a = b.currentNews.content.video;
        return null == a || "" == a ? !1 : !0
    }, b.audioAvailable = function () {
        if ("undefined" != typeof device && navigator.connection.type == Connection.NONE)return !1;
        var a = b.currentNews.content.audio;
        return null == a || "" == a ? !1 : !0
    }, b.imageAvailable = function () {
        if ("undefined" != typeof device && navigator.connection.type == Connection.NONE)return !1;
        var a = b.currentNews.content.image;
        return null == a || "" == a ? !1 : !0
    }, b.isMobile = function () {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? !0 : !1
    }, e.getHeadNews().then(function (a) {
        b.lastestNews = a;
        var c = a[0].value.id;
        null != l && (c = l), e.getDetailNews(c).then(function (a) {
            b.currentNews = a, j.search("id", c), e.sendAltNewsLog(c);
            var d = localStorage.getItem("dtTmp");
            if (d)for (var f = 0; f < d.length; f++)d[f].id == a._id && (d.push({id: a._id}), localStorage.setItem("dtTmp", a._id), n(a)); else localStorage.setItem("dtTmp", a._id), n(a)
        })
    });
    var o = JSON.parse(localStorage.getItem("news_read"));
    null == o && (o = []), $(document).on("click", "a.dicWin", function (c) {
        var d = c.currentTarget.innerHTML, f = "";
        if (f = d.replace(/<rt>.*?<\/rt>/g, ""), f = f.replace(/<.*?>/g, ""), "" != f) {
            var g = $(c.currentTarget).attr("altid");
            if (null != g && "" != g) {
                g = parseInt(g), e.sendAltLog(g);
                var h = null, i = b.currentNews.def;
                if (null != i)for (var j = 0; j < i.length; j++)i[j].id == g && (h = i[j]);
                null != h && h.entity != f && (f = h.entity), a.$broadcast("query", {type: "word", query: f, aux: h})
            } else a.$broadcast("query", {type: "word", query: f})
        }
    }), b.translate = function () {
        b.text || (a.$broadcast("query", {type: "word", query: b.text}), $(".box-search").css("display", "none"))
    }, $(document).on("mousemove", function (a) {
        b.x = a.pageX, b.y = a.pageY
    });
    var p = function () {
        var a = h.getItem("showFurigana");
        null != a && 0 == a ? $("head").append('<style id="setting_css">rt{display: none;}</style>') : $("#setting_css").remove()
    };
    a.$on("changeShowFurigana", function (a) {
        p()
    }), sendGA("pageview", "news")
}]), angular.module("mazii").controller("JLPTController", ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$http", function (a, b, c, d, e, f, g, h, i) {
    b.level = 5, b.checkFisrt = !1, b.type = "kanji", a.typeJLPT = "kanji", b.page = 0, b.length = 0, b.firstlength = 0, a.title = "JLPT", a.listJLPT = [], b.inforJlpt = h.getItem("inforJLPT"), null != b.inforJlpt && (b.level = b.inforJlpt.level, b.type = b.inforJlpt.type, b.page = b.inforJlpt.page, b.length = b.inforJlpt.length, b.firstlength = b.inforJlpt.firstlength), b.selectType = function (a) {
        b.length = 0, b.type = a, b.page = 0, b.query()
    }, b.changeShowhanViet = function () {
        if (null == a.showhanViet) {
            var c = h.getItem("showhanViet");
            null == c ? b.showhanViet = !0 : b.showhanViet = c
        } else b.showhanViet = a.showhanViet
    }, b.selectLevel = function (a) {
        b.length = 0, b.level = a, b.page = 0, b.query()
    }, b.getBeautyTitleGrammar = function (a) {
        return null == a ? null : a.split("=>")[0]
    }, b.getBeautyDescGrammar = function (a) {
        if (null == a)return a;
        if (null == a.value || null == a.value.usages)return null;
        var b = a.value.usages[0].mean;
        return null != b && (b = b.replace(":", "").replace("：", "")), b = f.removeJapaneseChar(b)
    }, b.query = function () {
        a.initFlashcard = !1, b.checkFisrt || null == !b.inforJlpt && (b.type = b.inforJlpt.type, b.level = b.inforJlpt.level, b.page = b.inforJlpt.page), "grammar" == b.type ? e.queryGrammarJLPT(b.level, b.page).then(function (c) {
            b.list = c.results, a.listJLPT = c.results, a.typeJLPT = "grammar", a.initFlashcard = !0, a.$broadcast("jlpt.data.change")
        }) : "kanji" == b.type ? e.queryKanjiJLPT(b.level, b.page).then(function (c) {
            b.list = c.results, a.listJLPT = c.results, a.typeJLPT = "kanji", a.initFlashcard = !0, a.$broadcast("jlpt.data.change")
        }) : i.get("db/jlpt/word" + b.level + ".json").success(function (c) {
            b.list = [];
            for (var d = 60 * b.page; d < 60 * b.page + 60; d++)b.list.push(c[d]);
            a.listJLPT = b.list, a.typeJLPT = "word", a.initFlashcard = !0, a.$broadcast("jlpt.data.change")
        }), b.checkFisrt = !0;
        var c = {type: b.type, level: b.level, page: b.page, length: b.length, firstlength: b.firstlength};
        h.setItem("inforJLPT", c), b.$applyAsync()
    }, b.showFlashcard = function () {
        a.initFlashcard = !0, $("#modalFlashcard").modal("show")
    };
    var j = !1, k = !1;
    b.getPreState = function () {
        return 0 == b.page ? (j = !1, "btn-disable") : (j = !0, "")
    }, b.getNextState = function () {
        return null == b.list ? (k = !0, "") : "kanji" == b.type && b.list.length < 100 ? (k = !1, "btn-disable") : "grammar" == b.type && b.list.length < 30 ? (k = !1, "btn-disable") : "word" == b.type && b.list.length < 60 ? (k = !1, "btn-disable") : (k = !0, "")
    }, b.prePage = function () {
        0 != j && (b.page--, b.page < 0 && (b.page = 0), ("grammar" == b.type || "word" == b.type) && (b.length = b.length - b.firstlength), b.query())
    }, b.nextPage = function () {
        0 != k && (b.page++, ("grammar" == b.type || "word" == b.type) && (b.firstlength = b.list.length, b.length += b.list.length), b.query())
    }, b.showModalFlashcard = function () {
        null != a.user ? $("#modalFlashcard").modal("show") : $("#petition-login").modal("show")
    }, b.showKanji = function (b) {
        a.$broadcast("query", {type: "kanji", query: b})
    }, b.showGrammar = function (b) {
        a.$broadcast("query", {type: "grammarDetail", query: b})
    }, b.showWord = function (b) {
        a.$broadcast("query", {type: "word", query: b})
    }, b.query(), b.changeShowhanViet(), b.$on("showhanViet", function (a) {
        b.changeShowhanViet()
    }), sendGA("pageview", "jlpt")
}]), angular.module("mazii").controller("NoteController", ["$rootScope", "$scope", "$state", "$timeout", "noteServ", "$stateParams", "$location", "dictUtilSer", function (a, b, c, d, e, f, g, h) {
    var i, j, k;
    b.category = e.getCategory(), b.state = !1, b.activeItem = null, b.loadDone = !1, a.title = "Từ của tôi";
    var l = function () {
        null == a.user ? b.logined = !1 : b.logined = !0, b.loadDone = !0
    };
    if (b.getNoteItem = function (b) {
            $(".note-item").removeClass("seleted-note"), $(".note-item-" + b).addClass("seleted-note"), a.$broadcast("getNoteItem", {cate: b})
        }, b.deleteCategory = function (a, b) {
            e.removeCategory(a, b)
        }, b.getTime = function (a) {
            var b = new Date(a);
            return b.toDateString()
        }, b.getDeleteState = function () {
            return b.state ? "" : "hidden-note-delete"
        }, b.showEdit = function () {
            $(".category-delete").toggleClass("hidden-note-delete"), 0 == b.state ? b.state = !0 : b.state = !1
        }, a.currentNoteRoute) {
        var m = new Date;
        j = m.getTime(), i = setInterval(function () {
            var b = new Date;
            k = b.getTime(), k - j > 6e3 && clearInterval(), null != a.user && (l(), clearInterval(i))
        }, 100)
    } else l();
    a.$on("load.category.success", function () {
        b.category = e.getCategory()
    }), h.showTitlePage(), sendGA("pageview", "myword")
}]), angular.module("mazii").controller("HelpController", ["$rootScope", "dictUtilSer", function (a, b) {
    a.title = "Trợ giúp", "undefined" == typeof FB || FB.XFBML.parse(), $("#forward-to-chat").click(function (a) {
        document.getElementById("facebook-chat").scrollIntoView(), a.preventDefault()
    }), b.showTitlePage(), sendGA("pageview", "help")
}]), angular.module("mazii").controller("HeaderController", ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "userServ", function (a, b, c, d, e, f, g, h) {
    b.showMenuLeft = function () {
        $(".menu-left").addClass("open-menu-left"), $(".cover").css("display", "block")
    }, b.closePanel = function () {
        f.closePanel()
    }, b.showHistory = function () {
        $(".history-panel").addClass("open-history-panel"), $(".cover").css("display", "block"), $("body").css("overflow", "hidden")
    }, b.showSetting = function () {
        $(".setting-panel").addClass("open-setting-panel"), $(".cover").css("display", "block"), $("body").css("overflow", "hidden")
    }, a.logout = function () {
        h.logout(), f.showInformationUser(), c.go("search")
    }, a.convertEmail = function (a) {
        return a.length > 20 ? a.substring(0, a.length - 3) + "..." : a
    }, a.logoutAll = function () {
        h.logoutAll().then(function (b) {
            200 == b.status ? (h.logout(), f.showInformationUser(), d(function () {
                c.go("search")
            }, 2e3)) : (a.alert.notify = "Có lỗi trong quá trình đăng xuất", $(".notify-current").fadeIn(200), d(function () {
                $(".notify-current").fadeOut(200)
            }, 2e3))
        })
    }, a.resetPasswordClick = function (b) {
        h.resetPassword(b).then(function (b) {
            304 == b.status ? a.alert.notify = "Tài khoản email này không tồn tại." : 302 == b.status ? ($("#resetPassword").modal("hide"), a.alert.notify = "Có lỗi trong quá trình xử lý.") : 306 == b.status ? a.alert.notify = "Tài khoản này đã được yêu cầu cấp lại mật khẩu. Vui lòng kiểm tra lại email của bạn." : ($("#resetPassword").modal("hide"), a.alert.notify = "Hãy kiểm tra tài khoản email của bạn để cấp lại mật khẩu."), $(".notify-current").fadeIn(200), d(function () {
                $(".notify-current").fadeOut(200)
            }, 2e3)
        })
    }
}]), angular.module("mazii").controller("WriteController", ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "$stateParams", "$location", function (a, b, c, d, e, f, g, h, i) {
    b.form = {}, b.showDrawKanji = !1, a.title = "Tập viết";
    var j = function () {
        var a = b.form.kanji;
        e.search("kanji", a).then(function (c) {
            if (b.currentKanjiSelected = 0, 200 == c.status) {
                if (f.isJapanese(a)) {
                    var d = f.getKanjiChara(a);
                    b.kanjis = f.sortHVDataByKeyWord(d, c.results), b.data = b.kanjis[0]
                } else b.kanjis = c.results, b.data = b.kanjis[0];
                b.showDrawKanji = !0, b.showResultNull = !1
            } else b.showResultNull = !0
        })
    };
    b.searchKanji = function () {
        j()
    }, f.showTitlePage(), sendGA("pageview", "draw")
}]), angular.module("mazii").controller("AboutController", ["$rootScope", "dictUtilSer", function (a, b) {
    a.title = "Về Mazii", b.showTitlePage(), sendGA("pageview", "about")
}]), angular.module("mazii").controller("ChatController", ["$rootScope", "$scope", "$state", "localstoreServ", "authServ", "maziiServ", "dictUtilSer", function (a, b, c, d, e, f, g) {
    b.tab_1 = "menu-active", b.tabActive = 1, b.user = a.user;
    var h = a.user;
    b.listMessage = [], b.listUser = [], b.listmessageReceive = [], b.listMessagePrivate = [], b.countMessage = 0, b.newMessage = !1, b.formChat = {}, b.loadDone = !1, b.tabScreen = 0, b.titleBar = "Nhóm chung";
    var i = io.connect(SERVER_ADRESS), j = [], k = 0, l = 0, m = 0, n = function () {
        i.emit("get-list-message-private-in-public", h), i.emit("get-list-data")
    }, o = function () {
        $(".chat-public .list-message").animate({scrollTop: 1e4}, 500)
    }, p = function () {
        h = a.user, b.user = a.user, "undefined" == typeof h || null == h || "" == h ? b.showLogin = !0 : (b.showLogin = !1, i.emit("reset-socket-user", h), n())
    };
    null != a.user ? (p(), b.loadDone = !0) : (b.loadDone = !0, b.showLogin = !1), b.changeTab = function (a) {
        b.tabActive = a, 1 == a ? (b.tab_1 = "menu-active", b.tab_2 = b.tab_3 = "", b.tabScreen = 0, $(".main-chat .list-message li.list-group-item").removeClass("group-jlpt-active"), $(".main-chat .list-message .group-0" + a).addClass("group-jlpt-active"), b.titleBar = "Nhóm chung") : 2 == a ? (b.tab_2 = "menu-active", b.tab_1 = b.tab_3 = "", b.titleBar = "Danh sách tin nhắn", b.newMessage = !1) : (b.tab_3 = "menu-active", b.tab_2 = b.tab_1 = "", b.titleBar = "Danh sách người dùng", b.tabScreen = 7, $(".chat-list-user").scroll(function () {
            var a = $(".chat-list-user").scrollTop();
            a > 0 && 20 > a && (++m, i.emit("load-more-user", m))
        }))
    }, b.changeScreen = function (a) {
        switch (b.tabScreen = a, k = 0, $(".main-chat .list-message li.list-group-item").removeClass("group-jlpt-active"), $(".main-chat .list-message .group-" + a).addClass("group-jlpt-active"), i.emit("get-list-message-jltp", a), a) {
            case 0:
                b.titleBar = "Nhóm chung";
                break;
            default:
                b.titleBar = "Nhóm nhóm JLPT " + a
        }
    }, b.loginFacebook = function () {
        e.loginFacebook().then(function (a) {
            null != a && i.emit("user-join-public", a)
        })
    }, b.logoutFacebook = function () {
        e.logoutFacebook(), h = b.user = a.user = null, p(), q(), g.safeApply(b)
    };
    var q = function () {
        b.tab_1 = "menu-active", b.tabActive = 1, b.listMessage = [], b.listUser = [], b.listmessageReceive = [], b.listMessagePrivate = [], b.countMessage = 0, b.newMessage = !1, b.tabScreen = 0
    };
    i.on("reset-socket-success", function (c) {
        h = c, a.user = h, b.user = h
    }), i.on("login-success", function (c) {
        a.user = c, b.user = c, h = c, n(), b.showLogin = !1, g.safeApply(b)
    }), i.on("get-list-message", function (a) {
        var c, d = a.length;
        b.listMessage = [];
        for (var e = 0; d > e; e++) {
            var c = a[e].index;
            if (g.renderHtmlMessage(a[e]).length > 1)var f = g.renderHtmlMessage(a[e]), h = {
                _id: a[e]._id,
                username: a[e].username,
                index: c,
                message: f,
                date_send: a[e].date_send,
                userId: a[e].userId,
                newLine: !0
            }; else var h = {
                _id: a[e]._id,
                username: a[e].username,
                message: a[e].content,
                index: c,
                date_send: a[e].date_send,
                userId: a[e].userId,
                newLine: !1
            };
            b.listMessage.unshift(h)
        }
        g.safeApply(b), 0 != c && $("#list-message-" + c).scroll(function () {
            var a = $("#list-message-" + c).scrollTop();
            a > 0 && 20 > a && (++k, i.emit("load-more-message-jlpt", {index: c, indexMessage: k}))
        }), o()
    }), i.on("get-list-user", function (a) {
        var c = a.length;
        b.listUser = [];
        for (var d = 0; c > d; d++) {
            var e = a[d];
            (null == h || e.fbId != h.fbId) && b.listUser.push(e)
        }
        g.safeApply(b)
    }), i.on("add-user-public", function (a) {
        (null == h || a._id != h._id) && (b.listUser.push(a), g.safeApply(b))
    }), i.on("receive-message-public", function (a) {
        if (g.renderHtmlMessage(a).length > 1) {
            var c = g.renderHtmlMessage(a), d = {
                _id: a._id,
                username: a.username,
                index: a.index,
                message: c,
                date_send: a.date_send,
                userId: a.userId,
                newLine: !0
            };
            b.listMessage.push(d)
        } else {
            var d = {
                _id: a._id,
                username: a.username,
                message: a.content,
                index: a.index,
                date_send: a.date_send,
                userId: a.userId,
                newLine: !1
            };
            b.listMessage.push(d)
        }
        o(), g.safeApply(b)
    }), b.formChat.sendChat = function (a) {
        r(a)
    }, b.formChat.enterChat = function (a, b) {
        13 == a.keyCode && (a.shiftKey || (r(b), a.preventDefault()))
    };
    var r = function (a) {
        var c = $("#enter-chat-message-" + a).val(), c = c.trim();
        if (null != c && "" != c)if (null == h || "" == h) b.loginFacebook(); else {
            var d = {user: b.user, message: c, index: a};
            i.emit("send-message-public", d), $("#enter-chat-message-" + a).val("")
        }
    };
    i.on("receive-list-message-private-in-public", function (a) {
        var c = b.listmessageReceive.length;
        if (0 == c) b.listmessageReceive.push(a), j.push(a.your_id); else for (var d = 0; c > d; d++)if (-1 == j.indexOf(a.your_id)) j.push(a.your_id), b.listmessageReceive.push(a), b.newMessage = !0; else {
            for (var c = b.listmessageReceive.length, e = 0, f = 0; c > f; f++) {
                var h = b.listmessageReceive[d];
                h.your_id == a.your_id && (b.listmessageReceive[f] = a, e++)
            }
            0 == e && (0 == a.status && 1 == a.flag && (b.newMessage = !0), b.listmessageReceive.push(a))
        }
        for (var d = 0; d < b.listmessageReceive.length; d++)b.newMessage = 0, 0 == b.listmessageReceive[d].status && 1 == b.newMessage;
        g.safeApply(b)
    }), b.redirectChatPrivate = function (a) {
        b.userReceive = {
            _id: a._id,
            username: a.username
        }, b.titleBar = "Chat với " + a.username, b.newMessage = !1, b.tabScreen = 6;
        ({userSend: b.user, userReceive: b.userReceive});
        i.emit("contruct-chat-private", {
            userReceive: b.userReceive,
            userSend: b.user
        }), i.on("read-message-private", {userReceive: b.userReceive, userSend: b.user}), l = 0, g.safeApply(b)
    }, b.redirectChatPrivatetoDetailUser = function (a) {
        if (a.userId != b.user._id) {
            var c = {_id: a.userId, username: a.username};
            b.redirectChatPrivate(c)
        }
    }, b.redirectChatPrivatetoListMessage = function (a) {
        var c = {_id: a.your_id, username: a.your_username};
        b.redirectChatPrivate(c), 0 == a.status && (b.newMessage = !1)
    }, b.formChat.sendChatPrivate = function () {
        s()
    }, b.formChat.enterChatPrivate = function (a) {
        13 == a.keyCode && (a.shiftKey || (s(), a.preventDefault()))
    };
    var s = function () {
        var a = $("#enter-chat-message-6").val();
        if (a = a.trim(), null != a && "" != a) {
            var c = {userSend: b.user, userReceive: b.userReceive, message: a};
            i.emit("send-message-private", c), $("#enter-chat-message-6").val().replace(/\n/g, ""), $("#enter-chat-message-6").val("")
        }
    };
    i.on("get-more-message", function (a) {
        if (null != a && 0 != a.length) {
            $(".list-message-0").scrollTop(50);
            for (var c = a.length, d = 0; c > d; d++) {
                a[d];
                if (g.renderHtmlMessage(a[d]).length > 1)var e = g.renderHtmlMessage(a[d]), f = {
                    _id: a[d]._id,
                    username: a[d].username,
                    index: a[d].index,
                    message: e,
                    date_send: a[d].date_send,
                    userId: a[d].userId,
                    newLine: !0
                }; else var f = {
                    _id: a[d]._id,
                    username: a[d].username,
                    message: a[d].content,
                    index: a[d].index,
                    date_send: a[d].date_send,
                    userId: a[d].userId,
                    newLine: !1
                };
                b.listMessage.unshift(f)
            }
            g.safeApply(b)
        }
    }), i.on("get-more-user", function (a) {
        if (null != a && 0 != a.length) {
            for (var c = a.length, d = 0; c > d; d++)b.listUser.unshift(a[d]);
            g.safeApply(b)
        }
    }), i.on("receive-load-more-message-private", function (a) {
        if (0 != a.length) {
            $(".list-message-private").animate({scrollTop: 100}, 500);
            for (var c = a.length, d = 0; c > d; d++) {
                var e = a[d];
                b.listMessagePrivate.unshift(e)
            }
            g.safeApply(b)
        }
    }), i.on("receive-message-pravite", function (a) {
        g.renderHtmlMessagePrivate(a).length > 1 ? (a.newLine = !0, a.message = g.renderHtmlMessagePrivate(a)) : a.newLine = !1, b.listMessagePrivate.push(a), $(".list-message-private").animate({scrollTop: 1e4}, 500);
        for (var c = b.listmessageReceive.length, d = 0, e = 0; c > e; e++) {
            var f = b.listmessageReceive[e];
            f.your_username == a.your_username && (b.listmessageReceive[e] = a, d++)
        }
        0 == d && b.listmessageReceive.push(a), 0 == a.status && 1 == a.flag && (b.newMessage = !0), g.safeApply(b)
    }), i.on("receive-list-chat-private", function (a) {
        a.reverse(), b.listMessagePrivate = a, g.safeApply(b), $(".list-message-private").animate({scrollTop: 1e4}, 500), $("#list-message-6").scroll(function () {
            var a = $("#list-message-6").scrollTop();
            a > 0 && 20 > a && (++l, i.emit("load-more-message-private", {
                userReceive: b.userReceive,
                userSend: b.user,
                index: l
            }))
        })
    }), b.$on("loadFBDone", function () {
        p(), b.loadDone = !0, g.safeApply(b)
    }), setTimeout(function () {
        $("#list-message-0").scroll(function () {
            var a = $("#list-message-0").scrollTop();
            a > 0 && 20 > a && (++k, i.emit("load-more-message", k))
        })
    }, 2e3), b.showDetailUser = function (a) {
        $(".detail-user-" + a).slideDown(100)
    }, $("*").click(function (a) {
        $(a.target);
        $(a.target).is(".avatar") || $(".detail-user").slideUp(100)
    }), b.translateMessage = function (a, b) {
        "object" == typeof a && (a = a.toString(), a = a.replace(/,/g, " "));
        var c = $(".text-" + b + " > .trans");
        0 == c.length && null != !c && (g.isJapanese(a) ? f.googleTranslate(a, "ja", "vi").then(function (a) {
            var c = a.sentences[0].trans;
            c = '<p class="trans">' + c + "</p>", $(".text-" + b).append(c)
        }) : f.googleTranslate(a, "vi", "ja").then(function (a) {
            var c = a.sentences[0].trans;
            c = '<p class="trans">' + c + "</p>", $(".text-" + b).append(c)
        }))
    }, sendGA("pageview", "chat")
}]), angular.module("mazii").controller("TermController", ["$rootScope", function (a) {
    a.title = "Từ của tôi", sendGA("pageview", "term")
}]), angular.module("mazii").controller("SentenceController", ["$rootScope", "$scope", "$state", "$timeout", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$http", function (a, b, c, d, e, f, g, h, i) {
    var j, k = "ja", l = "vi";
    b.placeholderJa = "こんにちは", b.placeholderVi = "Xin chào các bạn", b.phonetic = "Minasan, kon'nichiwa", a.title = "Đoạn văn", b.changeLanguage = function (a) {
        $(".btn-choice-sentence").removeClass("active-language"), 0 == a ? ($(".btn-javi").addClass("active-language"), k = "ja", l = "vi", b.placeholderJa = "こんにちは", b.placeholderVi = "Xin chào các bạn") : ($(".btn-vija").addClass("active-language"), k = "vi", l = "ja", b.placeholderVi = "こんにちは", b.placeholderJa = "Xin chào các bạn")
    }, b.translateGoogle = function (a) {
        "" != a && null != a && e.googleTranslate(a, k, l).then(function (a) {
            b.to = "", j = a.sentences;
            for (var c = 0; c < j.length - 1; c++)b.to += j[c].trans;
            null != j[j.length - 1].src_translit ? b.phonetic = j[j.length - 1].src_translit : b.phonetic = j[j.length - 1].translit
        })
    }, b.translate = function () {
        "" != b.text && (a.$broadcast("query", {
            type: "word",
            query: b.text,
            tag: "quick-search"
        }), $(".box-search").css("display", "none"))
    }, b["delete"] = function () {
        "" != b.from && null != b.from && (b.from = "", b.to = "", b.phonetic = "")
    }, $(document).on("mousemove", function (a) {
        b.x = a.pageX, b.y = a.pageY
    }), sendGA("pageview", "sentence")
}]), angular.module("mazii").controller("LoginController", ["$rootScope", "$scope", "$state", "userServ", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$http", "$timeout", "cookieServ", "encryptionServ", function (a, b, c, d, e, f, g, h, i, j, k, l) {
    b.title = "Đăng nhập", b.loadDone = !1;
    var m = function () {
        null != a.user ? c.go("search") : b.loadDone = !0
    };
    $("#petition-login").modal("hide"), b.notify = "", b.isLogin = !1, b.login = function (e, g) {
        $(".btn-login").addClass("button-disabled"), d.login(e, g).then(function (e) {
            if ($(".btn-login").removeClass("button-disabled"), 302 == e.status) b.isLogin = !0, b.notify = "Tài khoản chưa được kích hoạt"; else if (304 == e.status) b.isLogin = !0, b.notify = "Tài khoản hoặc mật khẩu không đúng"; else {
                a.user = e.result, b.isLogin = !1, a.alert.notify = "Đăng nhập thành công", $(".notify-current").fadeIn(200), 200 == e.status && j(function () {
                    c.go("search")
                }, 1e3);
                var g = e.result.tokenId;
                g = l.encode(g), k.setCookie("tokenId", g), d.initGetRateMean().then(function (a) {
                    h.setItem("rateMean", a)
                }), a.$broadcast("login.success")
            }
            f.showInformationUser()
        })
    }, b.resetPassword = function () {
        $("#resetPassword").modal("show")
    }, b.checkChar = function (a) {
        var b = ["'", "#", " "];
        if (null != a)for (var c = a.length, d = 0; c > d; d++)if (-1 != b.indexOf(a[d]))return !1;
        return !0
    }, j(function () {
        m()
    }, 200), sendGA("pageview", "login")
}]), angular.module("mazii").controller("RegisterController", ["$rootScope", "$scope", "$state", "userServ", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$http", "$timeout", function (a, b, c, d, e, f, g, h, i, j) {
    b.title = "Đăng ký", a.registerSuccess = !1, b.isPasswordEqual = function (a, b) {
        return a != b ? !1 : !0
    }, b.register = function (b, c, e) {
        $(".btn-register").addClass("button-disabled"), c == e && d.register(b, c).then(function (b) {
            $(".btn-register").removeClass("button-disabled"), 304 == b.status ? a.alert.notify = "Tài khoản email đã được đăng ký" : 302 == b.status ? a.alert.notify = "Có lỗi trong quá trình đăng ký" : 200 == b.status && (a.registerSuccess = !0), 200 != b.status && ($(".notify-current").fadeIn(200), j(function () {
                $(".notify-current").fadeOut(200)
            }, 2e3))
        })
    }, b.checkChar = function (a) {
        var b = ["'", "#", " "];
        if (null != a)for (var c = a.length, d = 0; c > d; d++)if (-1 != b.indexOf(a[d]))return !1;
        return !0
    }, sendGA("pageview", "register")
}]), angular.module("mazii").controller("ProfileController", ["$rootScope", "$scope", "$state", "userServ", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$http", "$timeout", "cookieServ", function (a, b, c, d, e, f, g, h, i, j, k) {
    b.title = "Thông tin", b.updateUsername = !0, b.showAlert = !1, null != a.user && (b.username = a.user.username);
    var l = function () {
        null == a.user ? c.go("login") : b.loadDone = !0
    };
    b.update = function () {
        b.updateUsername = !1
    }, b.saveUsername = function (c) {
        b.showAlert = !1, null != a.user && d.changeUsername(a.user.email, c).then(function (c) {
            200 == c.status ? (b.changeSuccess = !0, a.user = c.result) : b.changeSuccess = !1, b.showAlert = !0
        })
    }, b.updateUsername = function (a, c) {
        null != c && 13 == a.keyCode && b.saveUsername(c)
    }, j(function () {
        l()
    }, 100), sendGA("pageview", "profile")
}]), angular.module("mazii").controller("ChangePasswordController", ["$rootScope", "$scope", "$state", "userServ", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$http", "$timeout", "cookieServ", function (a, b, c, d, e, f, g, h, i, j, k) {
    b.title = "Đổi mật khẩu", b.changePasswordSucess = !1, b.isPasswordEqual = function (a, b) {
        return a != b ? !1 : !0;
    }, b.isChangePassword = !1, b.changePassword = function (a, c, e) {
        $(".btn-change-password").addClass("button-disabled"), c == e && d.changePassword(a, c).then(function (a) {
            $(".btn-change-password").removeClass("button-disabled"), 304 == a.status ? b.isChangePassword = !0 : b.changePasswordSucess = !0
        })
    }, b.checkChar = function (a) {
        var b = ["'", "#"];
        if (null != a)for (var c = a.length, d = 0; c > d; d++)if (-1 != b.indexOf(a[d]))return !1;
        return !0
    }, sendGA("pageview", "change-password")
}]), angular.module("mazii").controller("ResetPasswordController", ["$rootScope", "$scope", "$state", "userServ", "maziiServ", "dictUtilSer", "historyServ", "localstoreServ", "$http", "$timeout", "cookieServ", function (a, b, c, d, e, f, g, h, i, j, k) {
    b.title = "Cấp lại mật khẩu", b.isPasswordEqual = !0, b.resetPassword = function (c, e, f) {
        return $(".btn-reset-password").addClass("button-disabled"), e != f ? void(b.isPasswordEqual = !1) : (b.isPasswordEqual = !0, void d.resetPasswordReally(c, e).then(function (b) {
            $(".btn-reset-password").removeClass("button-disabled"), 304 == b.status ? a.alert.notify = "Hãy kiểm tra email xác nhận cấp lại mật khẩu" : a.alert.notify = "Bạn đã thay đổi mật khẩu thành công", $(".notify-current").fadeIn(200), j(function () {
                $(".notify-current").fadeOut(200)
            }, 2e3)
        }))
    }, b.checkChar = function (a) {
        var b = ["'", "#"];
        if (null != a)for (var c = a.length, d = 0; c > d; d++)if (-1 != b.indexOf(a[d]))return !1;
        return !0
    }, sendGA("pageview", "reset-password")
}]);