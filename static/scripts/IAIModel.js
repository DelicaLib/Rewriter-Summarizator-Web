class IAIModel {
    static currentPage = 1
    static currentResult = 1
    static AIResults = []
    static pageCount = 0
    static changeExtraSettingMenuStatus() {}
    static setModeSettings(object) {}
    static setMethodSettings(object) {}
    static setDisabledInputs(id, doDisabled) {}
    static setSettingValue(settingId, available = true, value = 0) {}
    static sendTextToModel() {}
    static setResultVariant(variantNumber) {}
    static setCurrentPageResult(pagenumber) {}
    static setNextPageResult(pagenumber) {}
    static setPageResult(pagenumber, buttons) {}
    static nextPageResult() {}
    static prevPageResult() {}
}