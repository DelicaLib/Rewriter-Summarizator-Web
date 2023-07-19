$(window).on('load', function(){
    Summarizator.setModeSettings($("#summarizator #mode[name=standart]"))
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

class IAIModel {
    static currentPage = 0
    static AIResults = []
    static changeExtraSettingMenuStatus() {}
    static setModeSettings(object) {}
    static setMethodSettings(object) {}
    static setDisabledInputs(id, doDisabled) {}
    static setSettingValue(settingId, available = true, value = 0) {}
    static sendTextToModel() {}
    static setResultVariant(variantNumber) {}
}

class Summarizator extends IAIModel {

    static changeExtraSettingMenuStatus() {
        var extraSettingsMenu = $("#summarizator .extra-settings")
        var height = 100
        if (extraSettingsMenu.hasClass("opened")) {
            height = 0
            extraSettingsMenu.removeClass("opened")
        }
        else {
            extraSettingsMenu.addClass("opened")
        }
        extraSettingsMenu.animate({"height": height + "%"}, 200)
    }

    static setModeSettings(object) {
        if ($(object).hasClass("current")) return
        $("#summarizator #mode.current").removeClass("current")
        $(object).addClass("current")
        if ($(object).attr("name") == "standart") {
            Summarizator.setMethodSettings($("#summarizator button[name=beamsearch]"))
            Summarizator.setSettingValue("num_beams", true, 5)
            Summarizator.setSettingValue("num_return_sequences", true, 5)
            Summarizator.setSettingValue("no_repeat_ngram_size", false, undefined)
            Summarizator.setSettingValue("repetition_penalty", false, undefined)
            Summarizator.setSettingValue("length_penalty", true, 0.5)
        }   
        else if ($(object).attr("name") == "original") {
            Summarizator.setMethodSettings($("button[name=sampling"))
            Summarizator.setSettingValue("num_return_sequences", false, undefined)
            Summarizator.setSettingValue("no_repeat_ngram_size", false, undefined)
            Summarizator.setSettingValue("repetition_penalty", false, undefined)
            Summarizator.setSettingValue("top_k", false, undefined)
            Summarizator.setSettingValue("top_p", false, undefined)
            Summarizator.setSettingValue("temperature", false, undefined)
            Summarizator.setSettingValue("length_penalty", false, undefined)
        }
        else {
            if (!$("#summarizator .extra-settings").hasClass("opened")) {
                Summarizator.changeExtraSettingMenuStatus()
            }
        }
    }

    static setMethodSettings(object) {
        if ($(object).hasClass("current")) return
        $("#summarizator #method.current").removeClass("current")
        $(object).addClass("current")
        if ($(object).attr("name") == "beamsearch") {
            Summarizator.setDisabledInputs("num_beams", false)
            Summarizator.setDisabledInputs("top_k", true)
            Summarizator.setDisabledInputs("top_p", true)
            Summarizator.setDisabledInputs("temperature", true)
        }
        else {
            Summarizator.setDisabledInputs("num_beams", true)
            Summarizator.setDisabledInputs("top_k", false)
            Summarizator.setDisabledInputs("top_p", false)
            Summarizator.setDisabledInputs("temperature", false)
        }
    }

    static setDisabledInputs(id, doDisabled) {
        var inputs = $(`#summarizator input#${id}`)
        if (doDisabled) {
            inputs.prop( "disabled", true )
        }
        else {
            $(inputs[0]).prop( "disabled", false )
            if ($(inputs[0]).is(':checked')) {
                $(inputs[1]).prop( "disabled", false )
            }
        }
    }

    static setSettingValue(settingId, available = true, value = 0) {
        var inputs = $(`#summarizator input#${settingId}`)
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

    static sendTextToModel() {
        var inputData = {}
        inputData["text"] = $("#summarizator #original-text").val()
        inputData["genstrategy"] = $("#summarizator button#method.current").prop("name")
        if (inputData["genstrategy"] == "beamsearch") {
            inputData = Object.assign({}, inputData, Summarizator.getBeamseacrhData())
        }
        else {
            inputData = Object.assign({}, inputData, Summarizator.getSamplingData())
        }
        $("#summarizator #summarizator-info").text("Загрузка...")
        $.ajax({
            type: "POST",
            url: "/sendToSummarizatorModel",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(inputData),
            success: function (response) {
                $("#summarizator-info").text(response["comment"])
                if (response["comment"] == "Ok!") {
                    $("#summarizator-result").css("display", "flex")
                    var responseText = response["prediction_best"]["bertscore"].replace("\n", "<br>")
                    $("#summarizator-result #AI-text").text(responseText)
                    Summarizator.AIResults = response["predictions"]
                    $('html, body').animate({
                        scrollTop: $("#summarizator-result").offset().top
                    }, 500);
                }
                $("#summarizator-result").css("display", "flex")
                $("#summarizator-result #AI-text").text()
                console.log(response)
            }
        });
    }

    static getBeamseacrhData() {
        var inputData = {}
        var num_beamsCheck = $("#summarizator input[type=checkbox]#num_beams")
        if (num_beamsCheck.prop("checked")) {
            inputData["num_beams"] = $("#summarizator input[type=number]#num_beams").val()
        }

        var num_return_sequencesCheck = $("#summarizator input[type=checkbox]#num_return_sequences")
        if (num_return_sequencesCheck.prop("checked")) {
            inputData["num_return_sequences"] = $("#summarizator input[type=number]#num_return_sequences").val()
        }

        var no_repeat_ngram_sizeCheck = $("#summarizator input[type=checkbox]#no_repeat_ngram_size")
        if (no_repeat_ngram_sizeCheck.prop("checked")) {
            inputData["no_repeat_ngram_size"] = $("#summarizator input[type=number]#no_repeat_ngram_size").val()
        }

        var repetition_penaltyCheck = $("#summarizator input[type=checkbox]#repetition_penalty")
        if (repetition_penaltyCheck.prop("checked")) {
            inputData["repetition_penalty"] = $("#summarizator input[type=number]#repetition_penalty").val()
        }

        var length_penaltyCheck = $("#summarizator input[type=checkbox]#length_penalty")
        if (length_penaltyCheck.prop("checked")) {
            inputData["length_penalty"] = $("#summarizator input[type=number]#length_penalty").val()
        }
        return inputData
    }

    static getSamplingData() {
        var inputData = {}

        var num_return_sequencesCheck = $("#summarizator input[type=checkbox]#num_return_sequences")
        if (num_return_sequencesCheck.prop("checked")) {
            inputData["num_return_sequences"] = $("#summarizator input[type=number]#num_return_sequences").val()
        }

        var no_repeat_ngram_sizeCheck = $("#summarizator input[type=checkbox]#no_repeat_ngram_size")
        if (no_repeat_ngram_sizeCheck.prop("checked")) {
            inputData["no_repeat_ngram_size"] = $("#summarizator input[type=number]#no_repeat_ngram_size").val()
        }

        var repetition_penaltyCheck = $("#summarizator input[type=checkbox]#repetition_penalty")
        if (repetition_penaltyCheck.prop("checked")) {
            inputData["repetition_penalty"] = $("#summarizator input[type=number]#repetition_penalty").val()
        }

        var top_kCheck = $("#summarizator input[type=checkbox]#top_k")
        if (top_kCheck.prop("checked")) {
            inputData["top_k"] = $("#summarizator input[type=number]#top_k").val()
        }

        var top_pCheck = $("#summarizator input[type=checkbox]#top_p")
        if (top_pCheck.prop("checked")) {
            inputData["top_p"] = $("#summarizator input[type=number]#top_p").val()
        }

        var temperatureCheck = $("#summarizator input[type=checkbox]#temperature")
        if (temperatureCheck.prop("checked")) {
            inputData["temperature"] = $("#summarizator input[type=number]#temperature").val()
        }

        var length_penaltyCheck = $("#summarizator input[type=checkbox]#length_penalty")
        if (length_penaltyCheck.prop("checked")) {
            inputData["length_penalty"] = $("#summarizator input[type=number]#length_penalty").val()
        }
        return inputData
    }

    static setResultVariant(variantNumber) {
        
    }
}

function getModelName(object) {
    return $(object).closest("section").prop("id")
}

$("input[type=checkbox]").change(function () {
    var modelName = getModelName(this)
    number = $(this).parent().siblings(`input[type=number]`)
    inputsChange(this, $(this).parent().siblings(`input[type=number]`))
    if (modelName == "summarizator") {
        Summarizator.setModeSettings($("#summarizator button#mode[name=user]"))
    }
})

$("button#mode").on("click", function () {
    var modelName = getModelName(this) 
    if (modelName == "summarizator") {
        Summarizator.setModeSettings(this)
    }
})

$("button#method").on("click", function () {
    var modelName = getModelName(this)
    if (modelName == "summarizator") {
        Summarizator.setMethodSettings(this)
        Summarizator.setModeSettings($(`#${modelName} #mode[name=user]`))
    }
})

$("input[type=number]").bind('keyup change keydown', function () {
    var modelName = getModelName(this)
    if (modelName == "summarizator") {
        Summarizator.setModeSettings($(`#${modelName} #mode[name=user]`))
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

$("#original-text").bind("input", function (e) {
    var modelName = getModelName(this)
    if ($(this).val().length >= 10) {
        $(`#${modelName} .input-control-buttons button`).prop("disabled", false)
    }
    else {
        $(`#${modelName} .input-control-buttons button`).prop("disabled", true)
    }
})

$("#summarizator #submit").bind("click", function (e) {
    var modelName = getModelName(this)
    if (modelName == "summarizator") {
        Summarizator.sendTextToModel()
    }
});