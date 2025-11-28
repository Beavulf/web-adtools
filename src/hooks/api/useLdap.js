import { useCallback, useMemo } from "react";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { LOGOUT_USER, GET_USER_LDAP } from "../../query/LdapQuery.js";

export function useLdap(options = {}) {
    const {
        onError,
    } = options;

    // обработчик ошибок для всех запросов
    const handleError = useCallback((error) => {
        if (onError) {
            onError(error);
        }
    }, [onError]);

    // Поиск пользователя в LDAP по имени или логину
    const [fetchUserLdap, {
        data: dataUser,
        loading: loadingUser,
    }] = useLazyQuery(GET_USER_LDAP, {
        fetchPolicy: "network-only",
        onError: handleError
    });

    // Мутация для выхода пользователя из системы (logout)
    const [logout, { loading: loadingLogout }] = useMutation(LOGOUT_USER, {
        onError: handleError
    });

    // action: поиск пользователя (обёртка)
    const searchLdapUser = useCallback(async (cnOrSAMA) => {
        // cnOrSAMA — это имя или SАM Account Name
        if (!cnOrSAMA) {
            return [];
        }
        return fetchUserLdap({ variables: { cnOrSAMA } });
    }, [fetchUserLdap]);

    // action: логаут
    const logoutUser = useCallback(async () => {
        return logout();
    }, [logout]);

    // результат поиска пользователя (массив результатов либо пустой массив)
    const ldapUsers = useMemo(
        () => dataUser?.searchUser ?? [],
        [dataUser]
    );

    return useMemo(()=>({
        ldapUsers,
        loading:{
            logout: loadingLogout,
            search: loadingUser,
        },
        actions: {
            search: searchLdapUser,
            logout: logoutUser,
        }
    }),[
        ldapUsers,
        loadingLogout,
        loadingUser,
        logoutUser,
        searchLdapUser
    ])
};