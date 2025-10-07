import { gql } from '@apollo/client'

const GET_SCHEDULES = gql`
    query GetSchedules($fio: String) {
    getSchedules(filter: {
        fio: { contains: $fio },
    }) {
        id
        fio
        login
        type
        order
        startDate
        endDate
        status
        description
        createdAt
        updatedAt
        createdBy
        updatedBy
        recall
    }
}
`;

const CREATE_SCHEDULE = gql`
    mutation CreateSchedule($data: ScheduleCreateInput!) {
        createSchedule(data: $data)
    }
`;

const DELETE_SCHEDULE = gql`
    mutation DeleteSchedule($id: ID!) {
        deleteSchedule(id: $id)
    }
`;

const ARCHIVE_SCHEDULE = gql`
    mutation ArchiveSchedule($id: ID!, $shouldArchiveRecall: Boolean!) {
        archiveSchedule(id: $id, shouldArchiveRecall: $shouldArchiveRecall)
    }
`;

const CREATE_ONETIME_TASK = gql`
    mutation CreateOneTimeTask($data: OneTimeCreateInput!) {
        craeteOneTime(data: $data)
    }
`;

const GET_ARCHIVE_SCHEDULES = gql`
    query GetArchiveSchedules($filter: ScheduleFilterInput!) {
        getArchiveSchedules(filter: $filter) 
    {
        id
        fio
        login
        type
        order
        startDate
        endDate
        status
        description
        createdAt
        updatedAt
        createdBy
        updatedBy
        recall
    }
}
`;

export {
    GET_SCHEDULES, 
    CREATE_SCHEDULE, 
    DELETE_SCHEDULE, 
    ARCHIVE_SCHEDULE, 
    CREATE_ONETIME_TASK,
    GET_ARCHIVE_SCHEDULES
};