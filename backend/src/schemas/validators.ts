import { TypeGuard } from '@sinclair/typebox/guard'
import { Value } from '@sinclair/typebox/value'
import { Type } from '@sinclair/typebox'
import addFormats from 'ajv-formats'
import Ajv from 'ajv'

function schemaOf(schemaOf: string, value: unknown, schema: unknown) {
  switch (schemaOf) {
    case 'Constructor':
      return TypeGuard.TConstructor(schema) && Value.Check(schema, value) // not supported
    case 'Function':
      return TypeGuard.TFunction(schema) && Value.Check(schema, value) // not supported
    case 'Date':
      return TypeGuard.TDate(schema) && Value.Check(schema, value)
    case 'Promise':
      return TypeGuard.TPromise(schema) && Value.Check(schema, value) // not supported
    case 'Uint8Array':
      return TypeGuard.TUint8Array(schema) && Value.Check(schema, value)
    case 'Undefined':
      return TypeGuard.TUndefined(schema) && Value.Check(schema, value) // not supported
    case 'Void':
      return TypeGuard.TVoid(schema) && Value.Check(schema, value)
    default:
      return false
  }
}

export function createAjv() {
  return addFormats(new Ajv({}), [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex'
  ])
    .addKeyword({ type: 'object', keyword: 'instanceOf', validate: schemaOf })
    .addKeyword({ type: 'null', keyword: 'typeOf', validate: schemaOf })
    .addKeyword('exclusiveMinimumTimestamp')
    .addKeyword('exclusiveMaximumTimestamp')
    .addKeyword('minimumTimestamp')
    .addKeyword('maximumTimestamp')
    .addKeyword('minByteLength')
    .addKeyword('maxByteLength')
}

const ajv = createAjv()

const R = ajv.validate(
  Type.Object({
    // const R = true
    buffer: Type.Uint8Array(),
    date: Type.Date(),
    void: Type.Void()
  }),
  {
    buffer: new Uint8Array(),
    date: new Date(),
    void: null
  }
)
