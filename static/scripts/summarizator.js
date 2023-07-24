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
        extraSettingsMenu.animate({"height": height + "%"}, {queue:false, duration: 200, easing: 'swing'})
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
            Summarizator.setMethodSettings($("#summarizator button[name=sampling"))
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
        inputData["text"] = $("#summarizator-original-text").val()
        inputData["genstrategy"] = $("#summarizator button#method.current").prop("name")
        if (inputData["genstrategy"] == "beamsearch") {
            inputData = Object.assign({}, inputData, Summarizator.getBeamseacrhData())
        }
        else {
            inputData = Object.assign({}, inputData, Summarizator.getSamplingData())
        }
        $("#summarizator #summarizator-info").text("Загрузка...")
        $("#summarizator-result").css("display", "none")
        $.ajax({
            type: "POST",
            url: "/sendToSummarizatorModel",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(inputData),
            success: function (response) {
                $("#summarizator-info").text(response["comment"])
                if (response["comment"] == "Ok!") {
                    $("#summarizator .variant-buttons-line").css("margin-left", "0")
                    $("#summarizator .four").not("#four-0").remove()
                    Summarizator.AIResults.splice(0, Summarizator.AIResults.length)
                    
                    var responseText = response["prediction_best"]["bertscore"].replace("\n", "<br>")
                    response["predictions"].forEach(element => {
                        element = element.replace("\n", "<br>")
                        if (element == responseText) {
                            Summarizator.AIResults.unshift(element)
                        }
                        else {
                            Summarizator.AIResults.push(element)
                        }
                    });
                    Summarizator.currentResult = 1
                    Summarizator.currentPage = 1
                    Summarizator.generatePageResult()
                    Summarizator.setResultVariant(1)
                    $("#summarizator-result").css("display", "flex")
                    $('html, body').animate({
                        scrollTop: $("#summarizator-result").offset().top
                    }, 500);
                }
                $("#summarizator-result #AI-text").text()
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
        if (variantNumber > Summarizator.AIResults.length) return
        $("#summarizator #variant.current").removeClass("current")
        $(`#summarizator #variant[name=variant-${variantNumber}`).addClass("current")
        Summarizator.currentResult = variantNumber
        $("#summarizator-result #AI-text").text(Summarizator.AIResults[variantNumber - 1])
    }

    static generatePageResult() {
        var pagenumber = 1
        Summarizator.currentPage = pagenumber
        var four = $("#summarizator #four-0")
        var buttons = $("#summarizator #four-0 button")
        while(Summarizator.setPageResult(pagenumber, buttons) == 1) {
            var fourClone = four.clone()
            fourClone.prop("id", `four-${pagenumber}`)
            fourClone.insertAfter(`#summarizator #four-${pagenumber - 1}`)
            buttons = $(`#summarizator #four-${pagenumber} button`)
            pagenumber++
        }
        $("#summarizator .variant-buttons-line").css("width", `${(pagenumber) * 103}%`)
        Summarizator.pageCount = pagenumber + 1
    }

    static setPageResult(pagenumber, buttons) {
        if (pagenumber == 1) {
            $(buttons[0]).prop("id", "variant")
            $(buttons[0]).prop("name", "variant-1")
            $(buttons[0]).text("Лучший вариант")
            $(buttons[0]).css("display", "flex")
            $(buttons[0]).addClass("variant-button")
            $(buttons[0]).removeClass("more-variants")
            if (1 == Summarizator.currentResult) {
                $(buttons[0]).addClass("current")
            }
            else {
                $(buttons[0]).removeClass("current")
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
        var endloop = Math.min(startLoop + 2, Summarizator.AIResults.length)
        for (let index = startLoop; index <= endloop; index++) {
            var currButton = $(buttons[index + 1 - startLoop])
            currButton.prop("id", "variant")
            currButton.prop("name", `variant-${index}`)
            currButton.text(`Вариант ${index}`)
            currButton.css("display", "flex")
            if (index == Summarizator.currentResult) {
                currButton.addClass("current")
            }
            else {
                currButton.removeClass("current")
            }
        }
        if (endloop == Summarizator.AIResults.length) {
            for (let index = endloop + 1; index <= startLoop + 2; index++) {
                var currButton = $(buttons[index + 1 - startLoop])
                currButton.prop("id", "variant")
                currButton.prop("name", `variant-${index}`)
                currButton.text(`Вариант ${index}`)
                currButton.css("display", "none")
                if (index == Summarizator.currentResult) {
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
        if (Summarizator.currentPage == Summarizator.pageCount) {
            return
        }
        Summarizator.currentPage++
        $("#summarizator .variant-buttons-line").css("margin-left", `-${(Summarizator.currentPage - 1) * 103}%`)
    }

    static prevPageResult() {
        if (Summarizator.currentPage == 1) {
            return
        }
        Summarizator.currentPage--
        $("#summarizator .variant-buttons-line").css("margin-left", `-${(Summarizator.currentPage - 1) * 103}%`)
    }
}