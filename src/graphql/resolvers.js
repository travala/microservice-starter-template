import {
  DateTimeResolver,
  JSONResolver,
  JSONObjectResolver,
} from 'graphql-scalars'

const resolvers = {
  Query: {
    async query(parent, args, context) {
      return 0
    },
  },
  DateTime: DateTimeResolver,
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
}

export default resolvers
