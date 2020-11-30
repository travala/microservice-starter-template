import gql from 'graphql-tag'

const typeDefs = gql`
  type Query {
    query: Int
  }

  schema {
    query: Query
  }
`

export default typeDefs
