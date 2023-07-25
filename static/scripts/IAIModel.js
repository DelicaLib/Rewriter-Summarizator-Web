class IAIModel {
    static changeExtraSettingMenuStatus() {} // Открыть/закрыть дополнительные настройки
    static setModeSettings(object) {} // Выставить настройки для выбранного режима
    static setDisabledInputs(id, doDisabled) {} // Отключить/включить input с настройкой
    static setSettingValue(settingId, available = true, value = 0) {} // Выставить значение настройки
    static sendTextToModel() {} // Отправить данные к API модели
    static setResultVariant(variantNumber) {} // Установить вариант, как выбранный
    static setCurrentPageResult(pagenumber) {} // Установить страницу, как текущую
    static setPageResult(pagenumber, buttons) {} // Установить номера вариантов на кнопки
    static nextPageResult() {} // Перейти на следующую страницу
    static prevPageResult() {} // Перейти на предыдущую страницу
}
