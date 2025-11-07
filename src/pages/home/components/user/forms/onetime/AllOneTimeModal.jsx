import React, {useEffect} from "react";
import { 
    Button,
    Flex,
    Modal,
    Table
} from "antd"
import { useLazyQuery } from "@apollo/client/react";
import { GET_ONETIME_TASKS } from "../../../../../../query/OneTimeQuery";
import OneTimeColumns from "./OnetimeColumns";

const AllOneTimeModal = React.memo(({ onCancel, onOpen}) => {

    const [fetchAllOneTime, { data: dataAllOneTime, loading: loadingAllOneTime }] 
    = useLazyQuery(GET_ONETIME_TASKS, {
        fetchPolicy: 'cache-and-network',
    });

    useEffect(() => {
        if (onOpen) {
            fetchAllOneTime({ variables: { filter: {} } });
        }
    }, [onOpen, fetchAllOneTime]);

    return (
        <Modal
            title='Просмотр всех АКТИВНЫХ разовых задач'
            open={onOpen}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
            width={1500}
        >
            <Flex vertical gap={10}>
                <Flex>
                    <Button>{dataAllOneTime?.getOneTimes?.length}</Button>
                </Flex>
                <Table
                    pagination={false}
                    dataSource={dataAllOneTime?.getOneTimes}
                    columns={OneTimeColumns}
                    size="middle"
                    rowKey={'id'}
                    loading={loadingAllOneTime}
                    scroll={{y:'300px'}}
                /> 
            </Flex>
        </Modal>
    )
})

export default AllOneTimeModal;