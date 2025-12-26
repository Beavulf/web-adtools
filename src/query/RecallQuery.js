import { gql } from '@apollo/client'

// "data": {
//     "order": "333-OT",
//     "startDate": "2025-08-28",
//     "endDate": "2025-08-30"
// }
const CREATE_RECALL = gql`
    mutation CreateRecall($data: RecallCreateInput!, $idSchedule: String!) {
        createRecall(data: $data, idSchedule: $idSchedule)
    }
`;

const GET_RECALLS = gql`
    query GetRecalls($filter: RecallFilterInput!, $take: Float, $skip: Float) {
        getRecalls(filter: $filter, take: $take, skip: $skip) 
    {
        id
        order
        startDate
        endDate
        status
        createdAt
        createdBy
        description
        scheduleId
        schedule {
            fio
            login
        }
    }
}
`;

const DELETE_RECALL = gql`
    mutation DeleteRecall($id: ID!) {
        deleteRecall(id: $id)
    }
`;

const ARCHIVE_RECALL = gql`
    mutation ArchiveRecall($id: ID!) {
        recallArchive(id: $id)
    }
`;

const GET_ARCHIVE_RECALLS = gql`
    query GetArchiveRecalls($filter: RecallFilterInput!, $take: Float, $skip: Float) {
        getArchiveRecalls(filter: $filter, take: $take, skip: $skip) 
        {
            id
            order
            startDate
            endDate
            status
            createdAt
            createdBy
            updatedAt
            updatedBy
            description
            scheduleId
        }
    }
`

export {
    CREATE_RECALL,
    GET_RECALLS,
    DELETE_RECALL,
    ARCHIVE_RECALL,
    GET_ARCHIVE_RECALLS
}