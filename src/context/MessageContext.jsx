import React from "react";
import { createContext, useContext } from "react";
import { 
    notification
} from "antd"
const MessageContext = createContext();

export const CustomMessageProvider = ({ children }) => {
    // const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (text,type) => {
        api.open({
            message: 'Оповещение',
            description: text,
            showProgress: true,
            pauseOnHover: true,
            placement: 'bottom',
            type
        })
    }

    const msgSuccess = (text) => {
        openNotification(text,'success');
    };

    const msgError = (text) => {
        openNotification(text,'error');
    };

    const msgInfo = (text) => {
        openNotification(text,'info');
    };

    const msgWarning = (text) => {
        openNotification(text,'warning');
    };


    return (
    <MessageContext.Provider value={{ contextHolder, msgSuccess, msgError, msgInfo, msgWarning }}>
        {contextHolder}
        {children}
    </MessageContext.Provider>
    );
};
export const useCustomMessage = () => useContext(MessageContext);
