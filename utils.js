/** @namespace */
utils = function() {
    var invalidEmailChars = /[\(\)\<\>\,\;\:\\\"\[\]]/;

    function log(e){
        console.log("msg :" + e.msg);
        console.log("status :" + e.status);
    }

    function ajaxCall(url, method, data, cb, parseResp) {
        $.ajax({
            method: method,
            url: url,
            data: data,
            success: function(resp) {
                var data = resp;
                if (parseResp) {
                    data = JSON.parse(resp);
                }
                if (cb) {
                    cb(data);
                } else {                    
                    var result = (parseResp) ? data : resp;
                    return result;                
                }
            },
            error: function(e, xhr, status) {
                var error = {};
                error.msg = e;
                error.status = status;
                if (cb) {
                    cb(error);
                }
                log(error);
            }
        });
    }

    function getWinDims() {
        var winDims = {
            "w": $(window).width(),
            "h": $(window).height()
        }
        return winDims;
    }

    function centerDiv(divId, containerDiv) {
        var winSize;
        if (containerDiv) {
            winSize = {};
            winSize.w = $(containerDiv).width();
            winSize.h = $(containerDiv).height();
        } else {
            winSize = getWinDims();
        }
        $(divId).css("left", (winSize.w - $(divId).outerWidth()) / 2);
        $(divId).css("top", ((winSize.h - $(divId).outerHeight()) / 2) + $(window).scrollTop());
    }

    function showHideLoading(showHide, divId) {
        var div = (divId) ? divId : "#content_loading";
        var display = (showHide === "hide") ? "none" : "block";
        utils.centerDiv(div);
        $(div).css("display", display);
    }

    function showHideOverlay(showHide) {
        if (showHide === "show") {
            $("#overlay").show();
        } else {
            $("#overlay").hide();
        }
    }

    /* get content via ajax and replace current page contents */
    function getPageContent(pageUrl, method, divId, cb, effect, effect_options, duration) {
        var targetDiv = (divId) ? divId : "#main_content";
        $.ajax({
            method: method,
            url: pageUrl,
            success: function(contents) {
                $(targetDiv).empty().html(contents);
                if (effect) {
                    $(targetDiv).effect(effect, effect_options, duration);
                }
                if (cb) {
                    cb();
                }
            }
        });
    }

    /* get handlebars template */
    function getTemplate(src) {
        var source = $(src).html();
        var template = Handlebars.compile(source);
        return template;
    }

    /* render handlebars template */
    function renderTemplate(template, context, targetDiv) {
        var t = utils.getTemplate(template);
        var html = t(context);
        $(targetDiv).empty().append(html);
    }

    function capFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function rnd(x, n) {
        var dec = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
        return Math.round(x * dec[n]) / dec[n];
    }

    function disableClick() {
        return false;
    }

    /*
     * add commas to number
     */
    function addCommas(x) {
        if (x) {
            var parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");
        }
    }

    function jsonify(frmId) {
        var array = $(frmId).serializeArray();
        var json = {};
        $.each(array, function() {
            json[this.name] = this.value || '';
        });
        return json;
    }

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    return {
        addCommas: addCommas,
        ajaxCall: ajaxCall,
        capFirstLetter: capFirstLetter,
        centerDiv: centerDiv,
        disableClick: disableClick,
        getPageContent: getPageContent,
        getTemplate: getTemplate,
        invalidEmailChars: invalidEmailChars,
        jsonify: jsonify,
        log: log,
        renderTemplate: renderTemplate,
        rnd: rnd,
        showHideOverlay: showHideOverlay,
        showHideLoading: showHideLoading,
        validateEmail: validateEmail
    }
}();