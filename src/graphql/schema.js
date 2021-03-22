import { makeExecutableSchema } from '@graphql-tools/schema'
import { stitchSchemas } from '@graphql-tools/stitch'
import path from 'path'
import fs from 'fs'
import resolvers from './resolvers.js'

const customSchema = makeExecutableSchema({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8'),
  resolvers,
})

export default stitchSchemas({
  mergeTypes: true,
  subschemas: [customSchema],
})
