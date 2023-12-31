$(window).on('load', function(){
    Summarizator.setModeSettings($("#summarizator #mode[name=standart]"))
    Rewriter.setModeSettings($("#rewriter #mode[name=standart]"))
    setInputNumberCSS($("input[type=checkbox]"))
    $("input[type=checkbox]").change(function () {
        setInputNumberCSS(this)
        var modelName = getModelName(this)
        number = $(this).parent().siblings(`input[type=number]`)
        inputsChange(this, $(this).parent().siblings(`input[type=number]`))
        if (modelName == "summarizator") {
            Summarizator.setModeSettings($("#summarizator button#mode[name=user]"))
        }
        else {
            Rewriter.setModeSettings($("#rewriter button#mode[name=user]"))
        }
    })
    
    $("button#mode").on("click", function () {
        var modelName = getModelName(this) 
        if (modelName == "summarizator") {
            Summarizator.setModeSettings(this)
        }
        else {
            Rewriter.setModeSettings(this)
        }
    })
    
    $("button#method").on("click", function () {
        var modelName = getModelName(this)
        if (modelName == "summarizator") {
            Summarizator.setMethodSettings(this)
            Summarizator.setModeSettings($(`#${modelName} #mode[name=user]`))
        }
        else {
            Rewriter.setMethodSettings(this)
            Rewriter.setModeSettings($(`#${modelName} #mode[name=user]`))
        }
    })
    
    $("input[type=number]").bind('keyup change keydown', function () {
        var modelName = getModelName(this)
        if (modelName == "summarizator") {
            Summarizator.setModeSettings($(`#${modelName} #mode[name=user]`))
        }
        else {
            Rewriter.setModeSettings($(`#${modelName} #mode[name=user]`))
        }
    })
    
    $("[data-tooltip]").on({
        mousemove: function (eventObject) {
            var data_tooltip = $(this).attr("data-tooltip");
            $(".tooltip").text(data_tooltip).css({ 
                            "top" : eventObject.pageY - $(window).scrollTop() + 5,
                            "left" : eventObject.pageX - $(window).scrollLeft() + 5
                        }).show();
        },
        mouseout: function () {
            $(".tooltip").hide()
                        .text("")
                        .css({
                            "top" : 0,
                            "left" : 0
                        });
        }
    })

    $("#summarizator-original-text").bind("input", function (e) {
        if ($(this).val().length >= 10) {
            $(`#summarizator .input-control-buttons button`).prop("disabled", false)
        }
        else {
            $(`#summarizator .input-control-buttons button`).prop("disabled", true)
        }
    })
    $("#rewriter-original-text").bind("input", function (e) {
        if ($(this).val().length >= 10) {
            $(`#rewriter .input-control-buttons button`).prop("disabled", false)
        }
        else {
            $(`#rewriter .input-control-buttons button`).prop("disabled", true)
        }
    })
    
    $("#summarizator #submit").bind("click", function (e) {
        Summarizator.sendTextToModel()
    })

    $("#rewriter #submit").bind("click", function (e) {
        Rewriter.sendTextToModel()
    })
    
    $(window).on("resize", function () {
        var checkboxes = $("input[type=checkbox]")
        setInputNumberCSS(checkboxes)
    })
})



function goToSummarizator() {
    $('html, body').animate({
        scrollTop: $("#summarizator").offset().top
    }, 500);
}

function goToRewriter() {
    $('html, body').animate({
        scrollTop: $("#rewriter").offset().top
    }, 500);
}

function setSettingValue(model, settingId, available = true, value = 0) {
    var inputs = $(`#${model} input#${settingId}`)
    if (!available)
    {
        $(inputs[0]).prop("checked", false)
    }
    else {
        $(inputs[0]).prop("checked", true)
        $(inputs[1]).prop("value", value)
    }
    inputsChange($(inputs[0]), $(inputs[1]))
}

function inputsChange(checkbox, number) {
    if ($(checkbox).prop("checked")) {
        $(number).prop("disabled", false)
    }
    else {
        $(number).prop("disabled", true)
    }
}

function getModelName(object) {
    return $(object).closest("section").prop("id")
}


function variantClick(object) {
    var modelName = getModelName(object)
    if (modelName == "summarizator") {
        if ($(object).prop("id") == "variant-prev")
        {
            Summarizator.prevPageResult()
            return
        }
        var variantNumber = parseInt($(object).prop("name").split("-")[1])
        Summarizator.setResultVariant(variantNumber)
    }
    else {
        if ($(object).prop("id") == "variant-prev")
        {
            Rewriter.prevPageResult()
            return
        }
        var variantNumber = parseInt($(object).prop("name").split("-")[1])
        Rewriter.setResultVariant(variantNumber)
    }
}
function setInputNumberCSS(object) {
    var objectSizeVectorImg = parseFloat($(object).css("width").split("px")[0])
    $(object).each(function () { 
        if ($(this).prop("checked")) {
            $(this).css("background-image", `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='${objectSizeVectorImg}' height='${objectSizeVectorImg}' viewBox='-1 -1 10 10'%3e%3cpath fill='%23000' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e"`)
        }
        else
        {
            $(this).css("background-image", "none")
        }
    })
}