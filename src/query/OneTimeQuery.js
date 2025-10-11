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
    query GetOneTimes($filter: OneTimeFilterInput!) {
        getOneTimes(filter: $filter) 
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
    GET_ONETIME_TASKS
}