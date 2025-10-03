import React, { useEffect } from "react"
import { useQuery } from "@apollo/client/react";
import { gql } from '@apollo/client'
import { Space,Flex } from "antd";

const GET_TASKINFO = gql`
    query GetTaskInfo($taskName: String!) {
        getCronTaskInfo(taskName: $taskName) {
            isActive, #активна ли задача
            source, 
            sendAt, # 
            getTimeout,
            nextDate,
            lastDate
        }
    }
`;

const FooterInfo = ({onError}) => {
    // получение информации о задаче
    const {data: dataTaskInfo, loading: loadingTaskInfo, error: errorTaskInfo} = useQuery(GET_TASKINFO, {
        variables:{taskName: "handleUserBlockingSchedule"},
        pollInterval: 10000
    });

    useEffect(() => {
        if (errorTaskInfo) onError?.(errorTaskInfo);
    }, [errorTaskInfo, onError]);

    return (
        <Flex style={{color:'rgba(255, 255, 255, 0.62)', width:'100%', padding:'0 10px', justifyContent:'space-between'}}>
            <h4>СТАТУС СЛУЖБЫ:  
                {dataTaskInfo?.getCronTaskInfo?.isActive ? 
                <span style={{color:'rgba(32, 141, 28, 0.62)'}}> ВКЛЮЧЕНА</span> : 
                <span style={{color:'rgba(141, 49, 28, 0.62)'}}> ВЫКЛЮЧЕНА</span>}
            </h4>
            <h4 style={{marginLeft:'-245px'}}>
                Время до следующего выполнения: <span style={{color:'rgba(78, 37, 92, 0.53)'}}>{
                    (() => {
                        const ms = Number(String(dataTaskInfo?.getCronTaskInfo?.getTimeout).replace(/\s/g, ''));
                        if (typeof ms !== 'number' || isNaN(ms)) return '—';
                        const days = Math.floor(ms / (24 * 60 * 60 * 1000));
                        const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                        const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
                        let result = '';
                        if (days > 0) result += `${days} д `;
                        if (hours > 0 || days > 0) result += `${hours} ч `;
                        result += `${minutes} мин`;
                        return result.trim();
                    })()
                }</span> ({new Date(dataTaskInfo?.getCronTaskInfo?.nextDate).toLocaleString()})
            </h4>
            <h4 >Последняя дата сработки: 
                <span style={{color:'rgba(78, 37, 92, 0.53)'}}> {dataTaskInfo?.getCronTaskInfo?.sendAt}</span>
            </h4>
        </Flex>
    )
}

export default FooterInfo