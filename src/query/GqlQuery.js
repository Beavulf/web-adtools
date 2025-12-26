import { gql } from '@apollo/client'

const GET_SCHEDULES = gql`
query GetSchedules($filter: ScheduleFilterInput!, $take: Float, $skip: Float) {
    getSchedules(filter: $filter, take: $take, skip: $skip) {
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
        isRecall
    }
}
`;

const GET_SCHEDULES_FILTER = gql`
    query GetSchedules($filter: ScheduleFilterInput!, $take: Float, $skip: Float) {
    getSchedules(filter: $filter, take: $take, skip: $skip) {
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
        isRecall
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



const GET_ARCHIVE_SCHEDULES = gql`
    query GetArchiveSchedules($filter: ScheduleFilterInput!, $take: Float, $skip: Float) {
        getArchiveSchedules(filter: $filter, take: $take, skip: $skip) 
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
        isRecall
    }
}
`;

const GET_FIO_SCHEDULES = gql`
query GetSchedules($filter: ScheduleFilterInput!) {
    getSchedules(filter: $filter) {
        id
        fio
        login
    }
}
`;

const GET_FIO_ARCHIVE_SCHEDULES = gql`
    query GetArchiveSchedules($filter: ScheduleFilterInput!, $take: Float, $skip: Float) {
        getArchiveSchedules(filter: $filter, take: $take, skip: $skip) 
    {
        id
        fio
        login
    }
}
`;

export {
    GET_SCHEDULES, 
    CREATE_SCHEDULE, 
    DELETE_SCHEDULE, 
    ARCHIVE_SCHEDULE, 
    GET_ARCHIVE_SCHEDULES,
    GET_SCHEDULES_FILTER,
    GET_FIO_SCHEDULES,
    GET_FIO_ARCHIVE_SCHEDULES
};