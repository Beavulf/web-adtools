import React from "react";
import { createContext, useContext } from "react";
import { 
    message,
} from "antd"
const MessageContext = createContext();

export const CustomMessageProvider = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const msgSuccess = (text) => {
        messageApi.success(text);
    };

    const msgError = (text) => {
        messageApi.error(text);
    };

    const msgInfo = (text) => {
        messageApi.info(text);
    };

    return (
    <MessageContext.Provider value={{ contextHolder, msgSuccess, msgError, msgInfo }}>
        {contextHolder}
        {children}
    </MessageContext.Provider>
    );
};
export const useCustomMessage = () => useContext(MessageContext);
