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
    query GetRecalls($filter: RecallFilterInput!) {
        getRecalls(filter: $filter) 
    {
        id
        order
        startDate
        endDate
        status
        createdAt
        createdBy
        description
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
    query GetArchiveRecalls($filter: RecallFilterInput!) {
        getArchiveRecalls(filter: $filter) 
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