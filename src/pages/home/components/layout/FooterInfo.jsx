import React, { useEffect } from "react"
import { Flex, Tag } from "antd";
import { useCronTask } from "../../../../hooks/api/useCronTask";
import timeLeft from "../../../../utils/formatTimeLeft";

const FooterInfo = React.memo(({onErrorCallBack}) => {
    const {taskInfo, error: errorTaskInfo} = useCronTask({enabled: true, pollInterval: 60000});

    const time = timeLeft(taskInfo?.getTimeout);

    useEffect(()=>{
        if (errorTaskInfo) {
            onErrorCallBack(errorTaskInfo.message);
        }       
    },[errorTaskInfo]);

    return (
        <Flex flex={1} style={{color:'rgba(255, 255, 255, 0.62)', padding:'0 10px'}}>
            <Tag color="rgba(255, 255, 255, 0.26)" style={{marginRight:'325px',color:'rgba(106, 104, 104, 0.86)', fontSize:'14px'}}>Статус службы:  
                {taskInfo?.isActive ? 
                <span style={{color:'rgba(32, 141, 28, 0.54)',fontWeight:'bold'}}> ВКЛЮЧЕНА</span> : 
                <span style={{color:'rgba(141, 49, 28, 0.54)',fontWeight:'bold'}}> ВЫКЛЮЧЕНА</span>}
            </Tag>
            <Flex justify="space-between" flex={1}>
                <Tag color="rgba(255, 255, 255, 0.26)" style={{ color:'rgba(106, 104, 104, 0.86)', fontSize:'14px'}}>
                    Время до следующего выполнения: <span style={{color:'rgba(78, 37, 92, 0.54)', fontWeight:'bold'}}>{
                        time
                    }</span> ({new Date(taskInfo?.nextDate).toLocaleString()})
                </Tag>
                <Tag color="rgba(255, 255, 255, 0.26)" style={{color:'rgba(106, 104, 104, 0.86)', fontSize:'14px', margin:0}}>Следующая дата сработки: 
                    <span style={{color:'rgba(78, 37, 92, 0.54)', fontWeight:'bold'}}> {taskInfo?.sendAt}</span>
                </Tag>
            </Flex>
        </Flex>
    )
});

export default FooterInfo;