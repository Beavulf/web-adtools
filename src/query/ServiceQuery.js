import { gql } from '@apollo/client'

const GET_TASK_INFO = gql`
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

const STOP_TASK = gql`
    mutation StopTaskSchedule($taskName: String!) {
        stopTaskSchedule(taskName: $taskName)
    }
`;

const START_TASK = gql`
    mutation StartTaskSchedule($taskName: String!) {
        startTaskSchedule(taskName: $taskName)
    }
`;

// "data": {
//     "taskName":"handleUserBlockingSchedule",
//     "cronExpression":""
// }
const UPDATE_TASK = gql`
    mutation UpdateTaskSchedule($taskName: String!, $cronExpression: String!) {
        updateTaskSchedule(taskName: $taskName, cronExpression: $cronExpression)
    }
`;

const FIRE_ONTICK_TASK = gql`
    mutation FireOnTick($taskName: String!) {
        fireOnTick(taskName: $taskName)
    }
`;

export {
    GET_TASK_INFO,
    STOP_TASK,
    START_TASK,
    UPDATE_TASK,
    FIRE_ONTICK_TASK
};