/**
 * Функция определяет статус активности учетной записи пользователя.
 * Всегда возвращает "ВКЛЮЧЕНА" или "ВЫКЛЮЧЕНА" на основании userAccountControl (AD).
 * @param {Object} selectedUser 
 * @returns {string} "ВКЛЮЧЕНА" | "ВЫКЛЮЧЕНА"
 */
const isActiveFormat = (selectedUser) => {
    // Преобразуем userAccountControl в число (на случай, если это строка)
    const uac = Number(selectedUser?.userAccountControl);

    // Если userAccountControl невалиден, считаем аккаунт выключенным
    if (isNaN(uac)) return "ВЫКЛЮЧЕНА";

    // Проверяем бит ACCOUNTDISABLE (блок активной учетной записи)
    // https://learn.microsoft.com/en-us/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties
    if ((uac & 2) !== 0) {
        return "ВЫКЛЮЧЕНА";
    }

    // Для всех остальных состояний считаем аккаунт включённым — даже если выставлены другие флаги
    // (например, "Пароль не требуется", "Пароль никогда не истекает", и т.д.)
    return "ВКЛЮЧЕНА";
}

export default isActiveFormat;