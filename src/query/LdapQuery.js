import { gql } from '@apollo/client'

const LOGOUT_USER = gql`
    mutation {
        logout
    }
`;

const GET_USER_LDAP = gql`
    query GetUsersLdap($cnOrSAMA: String!) {
        searchUser(data: {cnOrSamaccountname: $cnOrSAMA}) {
        cn,
        sAMAccountName,
        distinguishedName,
        company,
        department,
        description,
        memberOf,
        title,
        userAccountControl
    }
}
`;

export {
    LOGOUT_USER,
    GET_USER_LDAP
};