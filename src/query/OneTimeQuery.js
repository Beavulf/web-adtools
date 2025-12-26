import { gql } from '@apollo/client'

// "data": {
//     "fio": "Цыганок ЕСЫЫ",
//     "state": true,
//     "date": "2025-09-03",
//     "login": "beavulf"
// }
const CREATE_ONETIME_TASK = gql`
    mutation CreateOneTimeTask($data: OneTimeCreateInput!) {
        craeteOneTime(data: $data)
    }
`;

const GET_ONETIME_TASKS = gql`
    query GetOneTimes($filter: OneTimeFilterInput!, $take: Float, $skip: Float) {
        getOneTimes(filter: $filter, take: $take, skip: $skip)
    {
        id
        login
        fio
        date
        isCompleate
        state
        description
        createdAt
        updatedAt
        createdBy
        updatedBy
    }
}
`;

const DELETE_ONETIME_TASK = gql`
    mutation DeleteOneTime($id: ID!) {
        deleteOneTime(id: $id)
    }
`;

const ARCHIVE_ONETINE_TASK = gql`
    mutation ArchiveOneTime($id: ID!) {
        archiveOneTime(id: $id)
    }
`;

const GET_ARCHIVE_ONETIME_TASKS = gql`
    query GetArchiveOneTimes($filter: OneTimeFilterInput!, $take: Float, $skip: Float) {
        getArchiveOneTimes(filter: $filter, take: $take, skip: $skip) 
    {
        id
        login
        fio
        date
        isCompleate
        state
        description
        createdAt
        updatedAt
        createdBy
        updatedBy
    }
}
`;

export {
    CREATE_ONETIME_TASK,
    GET_ONETIME_TASKS,
    DELETE_ONETIME_TASK,
    ARCHIVE_ONETINE_TASK,
    GET_ARCHIVE_ONETIME_TASKS
}