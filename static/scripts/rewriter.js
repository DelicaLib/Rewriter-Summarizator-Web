class Rewriter extends IAIModel {

    static changeExtraSettingMenuStatus() {
        var extraSettingsMenu = $("#rewriter .extra-settings")
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
        $("#rewriter #mode.current").removeClass("current")
        $(object).addClass("current")
        if ($(object).attr("name") == "standart") {
            Rewriter.setSettingValue("num_return_sequences", true, 5)
            Rewriter.setSettingValue("repetition_penalty", false, undefined)
            Rewriter.setSettingValue("top_k", true, 50)
            Rewriter.setSettingValue("top_p", true, 0.7)
            Rewriter.setSettingValue("temperature", true, 0.9)
        }   
        else if ($(object).attr("name") == "original") {
            Rewriter.setSettingValue("num_return_sequences", true, 5)
            Rewriter.setSettingValue("repetition_penalty", false, undefined)
            Rewriter.setSettingValue("top_k", false, undefined)
            Rewriter.setSettingValue("top_p", false, undefined)
            Rewriter.setSettingValue("temperature", false, undefined)
        }
        else {
            if (!$("#rewriter .extra-settings").hasClass("opened")) {
                Rewriter.changeExtraSettingMenuStatus()
            }
        }
    }

    static setDisabledInputs(id, doDisabled) {
        var inputs = $(`#rewriter input#${id}`)
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
        var inputs = $(`#rewriter input#${settingId}`)
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
        inputData["text"] = $("#rewriter-original-text").val()
        inputData["range_mode"] = "all"
        inputData = Object.assign({}, inputData, Rewriter.getData())
        $("#rewriter #rewriter-info").text("Загрузка...")
        $("#rewriter-result").css("display", "none")
        $.ajax({
            type: "POST",
            url: "/sendToRewriterModel",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(inputData),
            success: function (response) {
                $("#rewriter-info").text(response["comment"])
                if (response["comment"] == "Ok!") {
                    $("#rewriter .variant-buttons-line").css("margin-left", "0")
                    $("#rewriter .four").not("#four-0").remove()
                    Rewriter.AIResults.splice(0, Rewriter.AIResults.length)
                    var bertscore = response["prediction_best"]["bertscore"].replace("\n", "<br>")
                    var classifier = response["prediction_best"]["classifier"].replace("\n", "<br>")
                    Rewriter.AIResults.push(bertscore)
                    Rewriter.AIResults.push(classifier)
                    response["predictions_all"].forEach(element => {
                        element = element.replace("\n", "<br>")
                        if (element != bertscore && element != classifier) {
                            Rewriter.AIResults.push(element)
                        }
                    });
                    Rewriter.currentResult = 1
                    Rewriter.currentPage = 1
                    Rewriter.generatePageResult()
                    Rewriter.setResultVariant(1)
                    $("#rewriter-result").css("display", "flex")
                    $('html, body').animate({
                        scrollTop: $("#rewriter-result").offset().top
                    }, 500);
                }
                $("#rewriter-result #AI-text").text()
            },
            error: function (response)
            {
                 $("#summarizator-info").text("Ошибка сервера")

            }
        });
    }

    static getData() {
        var inputData = {}

        var num_return_sequencesCheck = $("#rewriter input[type=checkbox]#num_return_sequences")
        if (num_return_sequencesCheck.prop("checked")) {
            inputData["num_return_sequences"] = $("#rewriter input[type=number]#num_return_sequences").val()
        }

        var repetition_penaltyCheck = $("#rewriter input[type=checkbox]#repetition_penalty")
        if (repetition_penaltyCheck.prop("checked")) {
            inputData["repetition_penalty"] = $("#rewriter input[type=number]#repetition_penalty").val()
        }

        var top_kCheck = $("#rewriter input[type=checkbox]#top_k")
        if (top_kCheck.prop("checked")) {
            inputData["top_k"] = $("#rewriter input[type=number]#top_k").val()
        }

        var top_pCheck = $("#rewriter input[type=checkbox]#top_p")
        if (top_pCheck.prop("checked")) {
            inputData["top_p"] = $("#rewriter input[type=number]#top_p").val()
        }

        var temperatureCheck = $("#rewriter input[type=checkbox]#temperature")
        if (temperatureCheck.prop("checked")) {
            inputData["temperature"] = $("#rewriter input[type=number]#temperature").val()
        }
        return inputData
    }

    static setResultVariant(variantNumber) {
        if (variantNumber > Rewriter.AIResults.length) return
        $("#rewriter #variant.current").removeClass("current")
        $(`#rewriter #variant[name=variant-${variantNumber}`).addClass("current")
        Rewriter.currentResult = variantNumber
        $("#rewriter-result #AI-text").text(Rewriter.AIResults[variantNumber - 1])
    }

    static generatePageResult() {
        var pagenumber = 1
        Rewriter.currentPage = pagenumber
        var four = $("#rewriter #four-0")
        var buttons = $("#rewriter #four-0 button")
        while(Rewriter.setPageResult(pagenumber, buttons) == 1) {
            var fourClone = four.clone()
            fourClone.prop("id", `four-${pagenumber}`)
            fourClone.insertAfter(`#rewriter #four-${pagenumber - 1}`)
            buttons = $(`#rewriter #four-${pagenumber} button`)
            pagenumber++
        }
        $("#rewriter .variant-buttons-line").css("width", `${(pagenumber) * 103}%`)
        Rewriter.pageCount = pagenumber + 1
    }

    static setPageResult(pagenumber, buttons) {
        if (pagenumber == 1) {
            $(buttons[0]).prop("id", "variant")
            $(buttons[0]).prop("name", "variant-1")
            $(buttons[0]).text("Bertscore")
            $(buttons[0]).css("display", "flex")
            $(buttons[0]).addClass("variant-button")
            $(buttons[0]).removeClass("more-variants")
            if (1 == Rewriter.currentResult) {
                $(buttons[0]).addClass("current")
            }
            else {
                $(buttons[0]).removeClass("current")
            }
            $(buttons[1]).prop("id", "variant")
            $(buttons[1]).prop("name", "variant-2")
            $(buttons[1]).text("Classifier")
            $(buttons[1]).css("display", "flex")
            $(buttons[1]).addClass("variant-button")
            $(buttons[1]).removeClass("more-variants")
            if (2 == Rewriter.currentResult) {
                $(buttons[1]).addClass("current")
            }
            else {
                $(buttons[1]).removeClass("current")
            }
        }
        else {
            $(buttons[0]).prop("id", "variant-prev")
            $(buttons[0]).prop("name", "variant-prev")
            $(buttons[0]).text("< Назад")
            $(buttons[0]).css("display", "flex")
            $(buttons[0]).removeClass("current")
            $(buttons[0]).removeClass("variant-button")
            $(buttons[0]).addClass("more-variants")
        }
        var startLoop = 2 + (pagenumber - 1) * 3
        var temp = (pagenumber == 1) ? 1 : 0
        var endloop = Math.min(startLoop + 2  - temp, Rewriter.AIResults.length)
        for (let index = startLoop; index <= endloop; index++) {
            var currButton = $(buttons[index + 1 - startLoop + temp])
            currButton.prop("id", "variant")
            currButton.prop("name", `variant-${index + temp}`)
            currButton.text(`Вариант ${index + temp}`)
            currButton.css("display", "flex")
            if (index == rewriter.currentResult) {
                currButton.addClass("current")
            }
            else {
                currButton.removeClass("current")
            }
        }
        if (endloop == Rewriter.AIResults.length) {
            for (let index = endloop + 1; index <= startLoop + 2 - temp; index++) {
                var currButton = $(buttons[index + 1 - startLoop + temp])
                currButton.prop("id", "variant")
                currButton.prop("name", `variant-${index + temp}`)
                currButton.text(`Вариант ${index + temp}`)
                currButton.css("display", "none")
                if (index == Rewriter.currentResult) {
                    currButton.addClass("current")
                }
                else {
                    currButton.removeClass("current")
                }
            }
            $(buttons[buttons.length - 1]).css("display", "none")
            return 0
        }
        else {
            $(buttons[buttons.length - 1]).css("display", "flex")
            return 1
        }
    }

    static nextPageResult() {
        if (Rewriter.currentPage == Rewriter.pageCount) {
            return
        }
        Rewriter.currentPage++
        $("#rewriter .variant-buttons-line").css("margin-left", `-${(Rewriter.currentPage - 1) * 103}%`)
    }

    static prevPageResult() {
        if (Rewriter.currentPage == 1) {
            return
        }
        Rewriter.currentPage--
        $("#rewriter .variant-buttons-line").css("margin-left", `-${(Rewriter.currentPage - 1) * 103}%`)
    }
}