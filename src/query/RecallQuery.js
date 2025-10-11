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

export {
    CREATE_RECALL,
    GET_RECALLS
}