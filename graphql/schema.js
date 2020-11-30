import { makeExecutableSchema } from '@graphql-tools/schema'
import { stitchSchemas } from '@graphql-tools/stitch'
import resolvers from './resolvers.js'
import typeDefs from './typeDefs.js'

const customSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

export default stitchSchemas({
  mergeTypes: true,
  subschemas: [customSchema],
})
