import React, { useEffect, useMemo } from "react"
import { useQuery } from "@apollo/client/react";
import { Flex, Tag } from "antd";
import { GET_TASK_INFO } from "../../../../query/ServiceQuery";

const FooterInfo = React.memo(({onError}) => {
    // получение информации о задаче
    const {data: dataTaskInfo, loading: loadingTaskInfo, error: errorTaskInfo} = useQuery(GET_TASK_INFO, {
        variables:{taskName: "handleUserBlockingSchedule"},
        pollInterval: 60000
    });

    const timeLeft = useMemo(() => {
        const raw = dataTaskInfo?.getCronTaskInfo?.getTimeout;
        const ms = Number(String(raw).replace(/\s/g, ''));
    
        if (typeof ms !== "number" || isNaN(ms)) return "—";
    
        const days = Math.floor(ms / (24 * 60 * 60 * 1000));
        const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    
        let result = "";
        if (days > 0) result += `${days} д `;
        if (hours > 0 || days > 0) result += `${hours} ч `;
        result += `${minutes} мин`;
    
        return result.trim();
    }, [dataTaskInfo?.getCronTaskInfo?.getTimeout]);

    useEffect(() => {
        if (errorTaskInfo) onError?.(errorTaskInfo);
    }, [errorTaskInfo, onError]);

    return (
        <Flex style={{color:'rgba(255, 255, 255, 0.62)', width:'100%', padding:'0 10px'}}>
            <Tag bordered={false} color="rgba(255, 255, 255, 0.26)" style={{marginRight:'325px',color:'rgba(106, 104, 104, 0.86)', fontSize:'14px'}}>Статус службы:  
                {dataTaskInfo?.getCronTaskInfo?.isActive ? 
                <span style={{color:'rgba(32, 141, 28, 0.54)',fontWeight:'bold'}}> ВКЛЮЧЕНА</span> : 
                <span style={{color:'rgba(141, 49, 28, 0.54)',fontWeight:'bold'}}> ВЫКЛЮЧЕНА</span>}
            </Tag>
            <Flex justify="space-between" flex={1}>
                <Tag bordered={false} color="rgba(255, 255, 255, 0.26)" style={{ color:'rgba(106, 104, 104, 0.86)', fontSize:'14px'}}>
                    Время до следующего выполнения: <span style={{color:'rgba(78, 37, 92, 0.54)', fontWeight:'bold'}}>{
                        timeLeft
                    }</span> ({new Date(dataTaskInfo?.getCronTaskInfo?.nextDate).toLocaleString()})
                </Tag>
                <Tag bordered={false} color="rgba(255, 255, 255, 0.26)" style={{color:'rgba(106, 104, 104, 0.86)', fontSize:'14px'}}>Следующая дата сработки: 
                    <span style={{color:'rgba(78, 37, 92, 0.54)', fontWeight:'bold'}}> {dataTaskInfo?.getCronTaskInfo?.sendAt}</span>
                </Tag>
            </Flex>
        </Flex>
    )
});

export default FooterInfo