import React, {useEffect} from "react";
import { useLazyQuery } from "@apollo/client/react";
import { GET_RECALLS } from "../../../../query/RecallQuery";
import {
    Flex,
    Typography
} from 'antd'
import dayjs from "dayjs";
import { useCustomMessage } from "../../../../context/MessageContext";

const {Text} = Typography;

const UserReacllInfo = React.memo(({record}) => {
    const {msgError} = useCustomMessage()

    const [fetchGetRecall, { data: dataRecall, loading: loadingRecall, error: errorRecall }] 
    = useLazyQuery(GET_RECALLS, {
        fetchPolicy: 'cache-and-network',
    });

    useEffect(() => {
        if (record) {
            try{
                fetchGetRecall({variables: {filter: {scheduleId: {contains: record.id}}}});
            }
            catch(err) {
                msgError(err.message);
            }
        }
    },[record, fetchGetRecall])

    return (
        <Flex gap={10} style={{overflow:'hidden'}}>
            <Text>Продление - </Text>
            <Text >приказ {dataRecall?.getRecalls[0].order},</Text>
            <Text>с {dayjs(dataRecall?.getRecalls[0].startDate).format('DD.MM.YYYY')}</Text>
            <Text>по {dayjs(dataRecall?.getRecalls[0].endDate).format('DD.MM.YYYY')},</Text>
            <Text>статус: {dataRecall?.getRecalls[0].status ? 'Выполняется' : 'ожидание'} |</Text>
            {dataRecall?.getRecalls[0].description && <Text style={{color:'gray'}}>описание: {dataRecall?.getRecalls[0].description}</Text>}
            <Flex gap={10} style={{marginLeft:'auto'}}>
                <Text style={{color:'gray'}}>Создан: {dayjs(dataRecall?.getRecalls[0].createdAt).format('DD.MM.YYYY HH:mm:ss')}</Text>
                <Text style={{color:'gray'}}> {dataRecall?.getRecalls[0].createdBy}</Text>
            </Flex>
        </Flex>
    )
})

export default UserReacllInfo;