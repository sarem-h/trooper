
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Connection
 * 
 */
export type Connection = $Result.DefaultSelection<Prisma.$ConnectionPayload>
/**
 * Model LinkedAccount
 * 
 */
export type LinkedAccount = $Result.DefaultSelection<Prisma.$LinkedAccountPayload>
/**
 * Model LinkedRepository
 * 
 */
export type LinkedRepository = $Result.DefaultSelection<Prisma.$LinkedRepositoryPayload>
/**
 * Model WebhookConfig
 * 
 */
export type WebhookConfig = $Result.DefaultSelection<Prisma.$WebhookConfigPayload>
/**
 * Model MaskingRule
 * 
 */
export type MaskingRule = $Result.DefaultSelection<Prisma.$MaskingRulePayload>
/**
 * Model WorkItem
 * 
 */
export type WorkItem = $Result.DefaultSelection<Prisma.$WorkItemPayload>
/**
 * Model AgentRun
 * 
 */
export type AgentRun = $Result.DefaultSelection<Prisma.$AgentRunPayload>
/**
 * Model AgentStep
 * 
 */
export type AgentStep = $Result.DefaultSelection<Prisma.$AgentStepPayload>
/**
 * Model PullRequest
 * 
 */
export type PullRequest = $Result.DefaultSelection<Prisma.$PullRequestPayload>
/**
 * Model IndexState
 * 
 */
export type IndexState = $Result.DefaultSelection<Prisma.$IndexStatePayload>
/**
 * Model MaskingAuditEntry
 * 
 */
export type MaskingAuditEntry = $Result.DefaultSelection<Prisma.$MaskingAuditEntryPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Connections
 * const connections = await prisma.connection.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Connections
   * const connections = await prisma.connection.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.connection`: Exposes CRUD operations for the **Connection** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Connections
    * const connections = await prisma.connection.findMany()
    * ```
    */
  get connection(): Prisma.ConnectionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.linkedAccount`: Exposes CRUD operations for the **LinkedAccount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LinkedAccounts
    * const linkedAccounts = await prisma.linkedAccount.findMany()
    * ```
    */
  get linkedAccount(): Prisma.LinkedAccountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.linkedRepository`: Exposes CRUD operations for the **LinkedRepository** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LinkedRepositories
    * const linkedRepositories = await prisma.linkedRepository.findMany()
    * ```
    */
  get linkedRepository(): Prisma.LinkedRepositoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.webhookConfig`: Exposes CRUD operations for the **WebhookConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WebhookConfigs
    * const webhookConfigs = await prisma.webhookConfig.findMany()
    * ```
    */
  get webhookConfig(): Prisma.WebhookConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maskingRule`: Exposes CRUD operations for the **MaskingRule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaskingRules
    * const maskingRules = await prisma.maskingRule.findMany()
    * ```
    */
  get maskingRule(): Prisma.MaskingRuleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.workItem`: Exposes CRUD operations for the **WorkItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more WorkItems
    * const workItems = await prisma.workItem.findMany()
    * ```
    */
  get workItem(): Prisma.WorkItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentRun`: Exposes CRUD operations for the **AgentRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentRuns
    * const agentRuns = await prisma.agentRun.findMany()
    * ```
    */
  get agentRun(): Prisma.AgentRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.agentStep`: Exposes CRUD operations for the **AgentStep** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AgentSteps
    * const agentSteps = await prisma.agentStep.findMany()
    * ```
    */
  get agentStep(): Prisma.AgentStepDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.pullRequest`: Exposes CRUD operations for the **PullRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PullRequests
    * const pullRequests = await prisma.pullRequest.findMany()
    * ```
    */
  get pullRequest(): Prisma.PullRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.indexState`: Exposes CRUD operations for the **IndexState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IndexStates
    * const indexStates = await prisma.indexState.findMany()
    * ```
    */
  get indexState(): Prisma.IndexStateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maskingAuditEntry`: Exposes CRUD operations for the **MaskingAuditEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaskingAuditEntries
    * const maskingAuditEntries = await prisma.maskingAuditEntry.findMany()
    * ```
    */
  get maskingAuditEntry(): Prisma.MaskingAuditEntryDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.4.1
   * Query Engine version: 55ae170b1ced7fc6ed07a15f110549408c501bb3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Connection: 'Connection',
    LinkedAccount: 'LinkedAccount',
    LinkedRepository: 'LinkedRepository',
    WebhookConfig: 'WebhookConfig',
    MaskingRule: 'MaskingRule',
    WorkItem: 'WorkItem',
    AgentRun: 'AgentRun',
    AgentStep: 'AgentStep',
    PullRequest: 'PullRequest',
    IndexState: 'IndexState',
    MaskingAuditEntry: 'MaskingAuditEntry'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "connection" | "linkedAccount" | "linkedRepository" | "webhookConfig" | "maskingRule" | "workItem" | "agentRun" | "agentStep" | "pullRequest" | "indexState" | "maskingAuditEntry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Connection: {
        payload: Prisma.$ConnectionPayload<ExtArgs>
        fields: Prisma.ConnectionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConnectionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConnectionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          findFirst: {
            args: Prisma.ConnectionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConnectionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          findMany: {
            args: Prisma.ConnectionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>[]
          }
          create: {
            args: Prisma.ConnectionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          createMany: {
            args: Prisma.ConnectionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConnectionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>[]
          }
          delete: {
            args: Prisma.ConnectionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          update: {
            args: Prisma.ConnectionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          deleteMany: {
            args: Prisma.ConnectionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConnectionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ConnectionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>[]
          }
          upsert: {
            args: Prisma.ConnectionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConnectionPayload>
          }
          aggregate: {
            args: Prisma.ConnectionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConnection>
          }
          groupBy: {
            args: Prisma.ConnectionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConnectionGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConnectionCountArgs<ExtArgs>
            result: $Utils.Optional<ConnectionCountAggregateOutputType> | number
          }
        }
      }
      LinkedAccount: {
        payload: Prisma.$LinkedAccountPayload<ExtArgs>
        fields: Prisma.LinkedAccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LinkedAccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LinkedAccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>
          }
          findFirst: {
            args: Prisma.LinkedAccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LinkedAccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>
          }
          findMany: {
            args: Prisma.LinkedAccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>[]
          }
          create: {
            args: Prisma.LinkedAccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>
          }
          createMany: {
            args: Prisma.LinkedAccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LinkedAccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>[]
          }
          delete: {
            args: Prisma.LinkedAccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>
          }
          update: {
            args: Prisma.LinkedAccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>
          }
          deleteMany: {
            args: Prisma.LinkedAccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LinkedAccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LinkedAccountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>[]
          }
          upsert: {
            args: Prisma.LinkedAccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedAccountPayload>
          }
          aggregate: {
            args: Prisma.LinkedAccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLinkedAccount>
          }
          groupBy: {
            args: Prisma.LinkedAccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<LinkedAccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.LinkedAccountCountArgs<ExtArgs>
            result: $Utils.Optional<LinkedAccountCountAggregateOutputType> | number
          }
        }
      }
      LinkedRepository: {
        payload: Prisma.$LinkedRepositoryPayload<ExtArgs>
        fields: Prisma.LinkedRepositoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LinkedRepositoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LinkedRepositoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>
          }
          findFirst: {
            args: Prisma.LinkedRepositoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LinkedRepositoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>
          }
          findMany: {
            args: Prisma.LinkedRepositoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>[]
          }
          create: {
            args: Prisma.LinkedRepositoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>
          }
          createMany: {
            args: Prisma.LinkedRepositoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LinkedRepositoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>[]
          }
          delete: {
            args: Prisma.LinkedRepositoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>
          }
          update: {
            args: Prisma.LinkedRepositoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>
          }
          deleteMany: {
            args: Prisma.LinkedRepositoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LinkedRepositoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LinkedRepositoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>[]
          }
          upsert: {
            args: Prisma.LinkedRepositoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkedRepositoryPayload>
          }
          aggregate: {
            args: Prisma.LinkedRepositoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLinkedRepository>
          }
          groupBy: {
            args: Prisma.LinkedRepositoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<LinkedRepositoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.LinkedRepositoryCountArgs<ExtArgs>
            result: $Utils.Optional<LinkedRepositoryCountAggregateOutputType> | number
          }
        }
      }
      WebhookConfig: {
        payload: Prisma.$WebhookConfigPayload<ExtArgs>
        fields: Prisma.WebhookConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WebhookConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WebhookConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>
          }
          findFirst: {
            args: Prisma.WebhookConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WebhookConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>
          }
          findMany: {
            args: Prisma.WebhookConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>[]
          }
          create: {
            args: Prisma.WebhookConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>
          }
          createMany: {
            args: Prisma.WebhookConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WebhookConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>[]
          }
          delete: {
            args: Prisma.WebhookConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>
          }
          update: {
            args: Prisma.WebhookConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>
          }
          deleteMany: {
            args: Prisma.WebhookConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WebhookConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WebhookConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>[]
          }
          upsert: {
            args: Prisma.WebhookConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WebhookConfigPayload>
          }
          aggregate: {
            args: Prisma.WebhookConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWebhookConfig>
          }
          groupBy: {
            args: Prisma.WebhookConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<WebhookConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.WebhookConfigCountArgs<ExtArgs>
            result: $Utils.Optional<WebhookConfigCountAggregateOutputType> | number
          }
        }
      }
      MaskingRule: {
        payload: Prisma.$MaskingRulePayload<ExtArgs>
        fields: Prisma.MaskingRuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaskingRuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaskingRuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>
          }
          findFirst: {
            args: Prisma.MaskingRuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaskingRuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>
          }
          findMany: {
            args: Prisma.MaskingRuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>[]
          }
          create: {
            args: Prisma.MaskingRuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>
          }
          createMany: {
            args: Prisma.MaskingRuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaskingRuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>[]
          }
          delete: {
            args: Prisma.MaskingRuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>
          }
          update: {
            args: Prisma.MaskingRuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>
          }
          deleteMany: {
            args: Prisma.MaskingRuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaskingRuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MaskingRuleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>[]
          }
          upsert: {
            args: Prisma.MaskingRuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingRulePayload>
          }
          aggregate: {
            args: Prisma.MaskingRuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaskingRule>
          }
          groupBy: {
            args: Prisma.MaskingRuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaskingRuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaskingRuleCountArgs<ExtArgs>
            result: $Utils.Optional<MaskingRuleCountAggregateOutputType> | number
          }
        }
      }
      WorkItem: {
        payload: Prisma.$WorkItemPayload<ExtArgs>
        fields: Prisma.WorkItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.WorkItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.WorkItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>
          }
          findFirst: {
            args: Prisma.WorkItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.WorkItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>
          }
          findMany: {
            args: Prisma.WorkItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>[]
          }
          create: {
            args: Prisma.WorkItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>
          }
          createMany: {
            args: Prisma.WorkItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.WorkItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>[]
          }
          delete: {
            args: Prisma.WorkItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>
          }
          update: {
            args: Prisma.WorkItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>
          }
          deleteMany: {
            args: Prisma.WorkItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.WorkItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.WorkItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>[]
          }
          upsert: {
            args: Prisma.WorkItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$WorkItemPayload>
          }
          aggregate: {
            args: Prisma.WorkItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateWorkItem>
          }
          groupBy: {
            args: Prisma.WorkItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<WorkItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.WorkItemCountArgs<ExtArgs>
            result: $Utils.Optional<WorkItemCountAggregateOutputType> | number
          }
        }
      }
      AgentRun: {
        payload: Prisma.$AgentRunPayload<ExtArgs>
        fields: Prisma.AgentRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          findFirst: {
            args: Prisma.AgentRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          findMany: {
            args: Prisma.AgentRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          create: {
            args: Prisma.AgentRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          createMany: {
            args: Prisma.AgentRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          delete: {
            args: Prisma.AgentRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          update: {
            args: Prisma.AgentRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          deleteMany: {
            args: Prisma.AgentRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>[]
          }
          upsert: {
            args: Prisma.AgentRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentRunPayload>
          }
          aggregate: {
            args: Prisma.AgentRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentRun>
          }
          groupBy: {
            args: Prisma.AgentRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentRunCountArgs<ExtArgs>
            result: $Utils.Optional<AgentRunCountAggregateOutputType> | number
          }
        }
      }
      AgentStep: {
        payload: Prisma.$AgentStepPayload<ExtArgs>
        fields: Prisma.AgentStepFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AgentStepFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AgentStepFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>
          }
          findFirst: {
            args: Prisma.AgentStepFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AgentStepFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>
          }
          findMany: {
            args: Prisma.AgentStepFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>[]
          }
          create: {
            args: Prisma.AgentStepCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>
          }
          createMany: {
            args: Prisma.AgentStepCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AgentStepCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>[]
          }
          delete: {
            args: Prisma.AgentStepDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>
          }
          update: {
            args: Prisma.AgentStepUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>
          }
          deleteMany: {
            args: Prisma.AgentStepDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AgentStepUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AgentStepUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>[]
          }
          upsert: {
            args: Prisma.AgentStepUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AgentStepPayload>
          }
          aggregate: {
            args: Prisma.AgentStepAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAgentStep>
          }
          groupBy: {
            args: Prisma.AgentStepGroupByArgs<ExtArgs>
            result: $Utils.Optional<AgentStepGroupByOutputType>[]
          }
          count: {
            args: Prisma.AgentStepCountArgs<ExtArgs>
            result: $Utils.Optional<AgentStepCountAggregateOutputType> | number
          }
        }
      }
      PullRequest: {
        payload: Prisma.$PullRequestPayload<ExtArgs>
        fields: Prisma.PullRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PullRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PullRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          findFirst: {
            args: Prisma.PullRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PullRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          findMany: {
            args: Prisma.PullRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>[]
          }
          create: {
            args: Prisma.PullRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          createMany: {
            args: Prisma.PullRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PullRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>[]
          }
          delete: {
            args: Prisma.PullRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          update: {
            args: Prisma.PullRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          deleteMany: {
            args: Prisma.PullRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PullRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PullRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>[]
          }
          upsert: {
            args: Prisma.PullRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PullRequestPayload>
          }
          aggregate: {
            args: Prisma.PullRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePullRequest>
          }
          groupBy: {
            args: Prisma.PullRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<PullRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.PullRequestCountArgs<ExtArgs>
            result: $Utils.Optional<PullRequestCountAggregateOutputType> | number
          }
        }
      }
      IndexState: {
        payload: Prisma.$IndexStatePayload<ExtArgs>
        fields: Prisma.IndexStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IndexStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IndexStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>
          }
          findFirst: {
            args: Prisma.IndexStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IndexStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>
          }
          findMany: {
            args: Prisma.IndexStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>[]
          }
          create: {
            args: Prisma.IndexStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>
          }
          createMany: {
            args: Prisma.IndexStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IndexStateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>[]
          }
          delete: {
            args: Prisma.IndexStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>
          }
          update: {
            args: Prisma.IndexStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>
          }
          deleteMany: {
            args: Prisma.IndexStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IndexStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IndexStateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>[]
          }
          upsert: {
            args: Prisma.IndexStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IndexStatePayload>
          }
          aggregate: {
            args: Prisma.IndexStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIndexState>
          }
          groupBy: {
            args: Prisma.IndexStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<IndexStateGroupByOutputType>[]
          }
          count: {
            args: Prisma.IndexStateCountArgs<ExtArgs>
            result: $Utils.Optional<IndexStateCountAggregateOutputType> | number
          }
        }
      }
      MaskingAuditEntry: {
        payload: Prisma.$MaskingAuditEntryPayload<ExtArgs>
        fields: Prisma.MaskingAuditEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaskingAuditEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaskingAuditEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>
          }
          findFirst: {
            args: Prisma.MaskingAuditEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaskingAuditEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>
          }
          findMany: {
            args: Prisma.MaskingAuditEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>[]
          }
          create: {
            args: Prisma.MaskingAuditEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>
          }
          createMany: {
            args: Prisma.MaskingAuditEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaskingAuditEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>[]
          }
          delete: {
            args: Prisma.MaskingAuditEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>
          }
          update: {
            args: Prisma.MaskingAuditEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>
          }
          deleteMany: {
            args: Prisma.MaskingAuditEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaskingAuditEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MaskingAuditEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>[]
          }
          upsert: {
            args: Prisma.MaskingAuditEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaskingAuditEntryPayload>
          }
          aggregate: {
            args: Prisma.MaskingAuditEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaskingAuditEntry>
          }
          groupBy: {
            args: Prisma.MaskingAuditEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaskingAuditEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaskingAuditEntryCountArgs<ExtArgs>
            result: $Utils.Optional<MaskingAuditEntryCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    connection?: ConnectionOmit
    linkedAccount?: LinkedAccountOmit
    linkedRepository?: LinkedRepositoryOmit
    webhookConfig?: WebhookConfigOmit
    maskingRule?: MaskingRuleOmit
    workItem?: WorkItemOmit
    agentRun?: AgentRunOmit
    agentStep?: AgentStepOmit
    pullRequest?: PullRequestOmit
    indexState?: IndexStateOmit
    maskingAuditEntry?: MaskingAuditEntryOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ConnectionCountOutputType
   */

  export type ConnectionCountOutputType = {
    linkedAccounts: number
    repositories: number
  }

  export type ConnectionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    linkedAccounts?: boolean | ConnectionCountOutputTypeCountLinkedAccountsArgs
    repositories?: boolean | ConnectionCountOutputTypeCountRepositoriesArgs
  }

  // Custom InputTypes
  /**
   * ConnectionCountOutputType without action
   */
  export type ConnectionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConnectionCountOutputType
     */
    select?: ConnectionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ConnectionCountOutputType without action
   */
  export type ConnectionCountOutputTypeCountLinkedAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkedAccountWhereInput
  }

  /**
   * ConnectionCountOutputType without action
   */
  export type ConnectionCountOutputTypeCountRepositoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkedRepositoryWhereInput
  }


  /**
   * Count Type LinkedAccountCountOutputType
   */

  export type LinkedAccountCountOutputType = {
    assumedByRepos: number
  }

  export type LinkedAccountCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assumedByRepos?: boolean | LinkedAccountCountOutputTypeCountAssumedByReposArgs
  }

  // Custom InputTypes
  /**
   * LinkedAccountCountOutputType without action
   */
  export type LinkedAccountCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccountCountOutputType
     */
    select?: LinkedAccountCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LinkedAccountCountOutputType without action
   */
  export type LinkedAccountCountOutputTypeCountAssumedByReposArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkedRepositoryWhereInput
  }


  /**
   * Count Type LinkedRepositoryCountOutputType
   */

  export type LinkedRepositoryCountOutputType = {
    webhooks: number
  }

  export type LinkedRepositoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    webhooks?: boolean | LinkedRepositoryCountOutputTypeCountWebhooksArgs
  }

  // Custom InputTypes
  /**
   * LinkedRepositoryCountOutputType without action
   */
  export type LinkedRepositoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepositoryCountOutputType
     */
    select?: LinkedRepositoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LinkedRepositoryCountOutputType without action
   */
  export type LinkedRepositoryCountOutputTypeCountWebhooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookConfigWhereInput
  }


  /**
   * Count Type WorkItemCountOutputType
   */

  export type WorkItemCountOutputType = {
    agentRuns: number
    pullRequests: number
  }

  export type WorkItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentRuns?: boolean | WorkItemCountOutputTypeCountAgentRunsArgs
    pullRequests?: boolean | WorkItemCountOutputTypeCountPullRequestsArgs
  }

  // Custom InputTypes
  /**
   * WorkItemCountOutputType without action
   */
  export type WorkItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItemCountOutputType
     */
    select?: WorkItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * WorkItemCountOutputType without action
   */
  export type WorkItemCountOutputTypeCountAgentRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentRunWhereInput
  }

  /**
   * WorkItemCountOutputType without action
   */
  export type WorkItemCountOutputTypeCountPullRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PullRequestWhereInput
  }


  /**
   * Count Type AgentRunCountOutputType
   */

  export type AgentRunCountOutputType = {
    steps: number
    pullRequests: number
  }

  export type AgentRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    steps?: boolean | AgentRunCountOutputTypeCountStepsArgs
    pullRequests?: boolean | AgentRunCountOutputTypeCountPullRequestsArgs
  }

  // Custom InputTypes
  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRunCountOutputType
     */
    select?: AgentRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeCountStepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentStepWhereInput
  }

  /**
   * AgentRunCountOutputType without action
   */
  export type AgentRunCountOutputTypeCountPullRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PullRequestWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Connection
   */

  export type AggregateConnection = {
    _count: ConnectionCountAggregateOutputType | null
    _min: ConnectionMinAggregateOutputType | null
    _max: ConnectionMaxAggregateOutputType | null
  }

  export type ConnectionMinAggregateOutputType = {
    id: string | null
    name: string | null
    provider: string | null
    authMethod: string | null
    providerAccountName: string | null
    providerUrl: string | null
    secretToken: string | null
    secretLastFour: string | null
    isDefault: boolean | null
    status: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConnectionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    provider: string | null
    authMethod: string | null
    providerAccountName: string | null
    providerUrl: string | null
    secretToken: string | null
    secretLastFour: string | null
    isDefault: boolean | null
    status: string | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ConnectionCountAggregateOutputType = {
    id: number
    name: number
    provider: number
    authMethod: number
    providerAccountName: number
    providerUrl: number
    secretToken: number
    secretLastFour: number
    isDefault: number
    status: number
    scopes: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ConnectionMinAggregateInputType = {
    id?: true
    name?: true
    provider?: true
    authMethod?: true
    providerAccountName?: true
    providerUrl?: true
    secretToken?: true
    secretLastFour?: true
    isDefault?: true
    status?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConnectionMaxAggregateInputType = {
    id?: true
    name?: true
    provider?: true
    authMethod?: true
    providerAccountName?: true
    providerUrl?: true
    secretToken?: true
    secretLastFour?: true
    isDefault?: true
    status?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ConnectionCountAggregateInputType = {
    id?: true
    name?: true
    provider?: true
    authMethod?: true
    providerAccountName?: true
    providerUrl?: true
    secretToken?: true
    secretLastFour?: true
    isDefault?: true
    status?: true
    scopes?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ConnectionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Connection to aggregate.
     */
    where?: ConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Connections to fetch.
     */
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Connections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Connections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Connections
    **/
    _count?: true | ConnectionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConnectionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConnectionMaxAggregateInputType
  }

  export type GetConnectionAggregateType<T extends ConnectionAggregateArgs> = {
        [P in keyof T & keyof AggregateConnection]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConnection[P]>
      : GetScalarType<T[P], AggregateConnection[P]>
  }




  export type ConnectionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConnectionWhereInput
    orderBy?: ConnectionOrderByWithAggregationInput | ConnectionOrderByWithAggregationInput[]
    by: ConnectionScalarFieldEnum[] | ConnectionScalarFieldEnum
    having?: ConnectionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConnectionCountAggregateInputType | true
    _min?: ConnectionMinAggregateInputType
    _max?: ConnectionMaxAggregateInputType
  }

  export type ConnectionGroupByOutputType = {
    id: string
    name: string
    provider: string
    authMethod: string
    providerAccountName: string
    providerUrl: string
    secretToken: string | null
    secretLastFour: string | null
    isDefault: boolean
    status: string
    scopes: string[]
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: ConnectionCountAggregateOutputType | null
    _min: ConnectionMinAggregateOutputType | null
    _max: ConnectionMaxAggregateOutputType | null
  }

  type GetConnectionGroupByPayload<T extends ConnectionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConnectionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConnectionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConnectionGroupByOutputType[P]>
            : GetScalarType<T[P], ConnectionGroupByOutputType[P]>
        }
      >
    >


  export type ConnectionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    provider?: boolean
    authMethod?: boolean
    providerAccountName?: boolean
    providerUrl?: boolean
    secretToken?: boolean
    secretLastFour?: boolean
    isDefault?: boolean
    status?: boolean
    scopes?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    linkedAccounts?: boolean | Connection$linkedAccountsArgs<ExtArgs>
    repositories?: boolean | Connection$repositoriesArgs<ExtArgs>
    _count?: boolean | ConnectionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["connection"]>

  export type ConnectionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    provider?: boolean
    authMethod?: boolean
    providerAccountName?: boolean
    providerUrl?: boolean
    secretToken?: boolean
    secretLastFour?: boolean
    isDefault?: boolean
    status?: boolean
    scopes?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["connection"]>

  export type ConnectionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    provider?: boolean
    authMethod?: boolean
    providerAccountName?: boolean
    providerUrl?: boolean
    secretToken?: boolean
    secretLastFour?: boolean
    isDefault?: boolean
    status?: boolean
    scopes?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["connection"]>

  export type ConnectionSelectScalar = {
    id?: boolean
    name?: boolean
    provider?: boolean
    authMethod?: boolean
    providerAccountName?: boolean
    providerUrl?: boolean
    secretToken?: boolean
    secretLastFour?: boolean
    isDefault?: boolean
    status?: boolean
    scopes?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ConnectionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "provider" | "authMethod" | "providerAccountName" | "providerUrl" | "secretToken" | "secretLastFour" | "isDefault" | "status" | "scopes" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["connection"]>
  export type ConnectionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    linkedAccounts?: boolean | Connection$linkedAccountsArgs<ExtArgs>
    repositories?: boolean | Connection$repositoriesArgs<ExtArgs>
    _count?: boolean | ConnectionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ConnectionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ConnectionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ConnectionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Connection"
    objects: {
      linkedAccounts: Prisma.$LinkedAccountPayload<ExtArgs>[]
      repositories: Prisma.$LinkedRepositoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      provider: string
      authMethod: string
      providerAccountName: string
      providerUrl: string
      secretToken: string | null
      secretLastFour: string | null
      isDefault: boolean
      status: string
      scopes: string[]
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["connection"]>
    composites: {}
  }

  type ConnectionGetPayload<S extends boolean | null | undefined | ConnectionDefaultArgs> = $Result.GetResult<Prisma.$ConnectionPayload, S>

  type ConnectionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ConnectionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ConnectionCountAggregateInputType | true
    }

  export interface ConnectionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Connection'], meta: { name: 'Connection' } }
    /**
     * Find zero or one Connection that matches the filter.
     * @param {ConnectionFindUniqueArgs} args - Arguments to find a Connection
     * @example
     * // Get one Connection
     * const connection = await prisma.connection.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConnectionFindUniqueArgs>(args: SelectSubset<T, ConnectionFindUniqueArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Connection that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ConnectionFindUniqueOrThrowArgs} args - Arguments to find a Connection
     * @example
     * // Get one Connection
     * const connection = await prisma.connection.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConnectionFindUniqueOrThrowArgs>(args: SelectSubset<T, ConnectionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Connection that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionFindFirstArgs} args - Arguments to find a Connection
     * @example
     * // Get one Connection
     * const connection = await prisma.connection.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConnectionFindFirstArgs>(args?: SelectSubset<T, ConnectionFindFirstArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Connection that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionFindFirstOrThrowArgs} args - Arguments to find a Connection
     * @example
     * // Get one Connection
     * const connection = await prisma.connection.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConnectionFindFirstOrThrowArgs>(args?: SelectSubset<T, ConnectionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Connections that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Connections
     * const connections = await prisma.connection.findMany()
     * 
     * // Get first 10 Connections
     * const connections = await prisma.connection.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const connectionWithIdOnly = await prisma.connection.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConnectionFindManyArgs>(args?: SelectSubset<T, ConnectionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Connection.
     * @param {ConnectionCreateArgs} args - Arguments to create a Connection.
     * @example
     * // Create one Connection
     * const Connection = await prisma.connection.create({
     *   data: {
     *     // ... data to create a Connection
     *   }
     * })
     * 
     */
    create<T extends ConnectionCreateArgs>(args: SelectSubset<T, ConnectionCreateArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Connections.
     * @param {ConnectionCreateManyArgs} args - Arguments to create many Connections.
     * @example
     * // Create many Connections
     * const connection = await prisma.connection.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConnectionCreateManyArgs>(args?: SelectSubset<T, ConnectionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Connections and returns the data saved in the database.
     * @param {ConnectionCreateManyAndReturnArgs} args - Arguments to create many Connections.
     * @example
     * // Create many Connections
     * const connection = await prisma.connection.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Connections and only return the `id`
     * const connectionWithIdOnly = await prisma.connection.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConnectionCreateManyAndReturnArgs>(args?: SelectSubset<T, ConnectionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Connection.
     * @param {ConnectionDeleteArgs} args - Arguments to delete one Connection.
     * @example
     * // Delete one Connection
     * const Connection = await prisma.connection.delete({
     *   where: {
     *     // ... filter to delete one Connection
     *   }
     * })
     * 
     */
    delete<T extends ConnectionDeleteArgs>(args: SelectSubset<T, ConnectionDeleteArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Connection.
     * @param {ConnectionUpdateArgs} args - Arguments to update one Connection.
     * @example
     * // Update one Connection
     * const connection = await prisma.connection.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConnectionUpdateArgs>(args: SelectSubset<T, ConnectionUpdateArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Connections.
     * @param {ConnectionDeleteManyArgs} args - Arguments to filter Connections to delete.
     * @example
     * // Delete a few Connections
     * const { count } = await prisma.connection.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConnectionDeleteManyArgs>(args?: SelectSubset<T, ConnectionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Connections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Connections
     * const connection = await prisma.connection.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConnectionUpdateManyArgs>(args: SelectSubset<T, ConnectionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Connections and returns the data updated in the database.
     * @param {ConnectionUpdateManyAndReturnArgs} args - Arguments to update many Connections.
     * @example
     * // Update many Connections
     * const connection = await prisma.connection.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Connections and only return the `id`
     * const connectionWithIdOnly = await prisma.connection.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ConnectionUpdateManyAndReturnArgs>(args: SelectSubset<T, ConnectionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Connection.
     * @param {ConnectionUpsertArgs} args - Arguments to update or create a Connection.
     * @example
     * // Update or create a Connection
     * const connection = await prisma.connection.upsert({
     *   create: {
     *     // ... data to create a Connection
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Connection we want to update
     *   }
     * })
     */
    upsert<T extends ConnectionUpsertArgs>(args: SelectSubset<T, ConnectionUpsertArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Connections.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionCountArgs} args - Arguments to filter Connections to count.
     * @example
     * // Count the number of Connections
     * const count = await prisma.connection.count({
     *   where: {
     *     // ... the filter for the Connections we want to count
     *   }
     * })
    **/
    count<T extends ConnectionCountArgs>(
      args?: Subset<T, ConnectionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConnectionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Connection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConnectionAggregateArgs>(args: Subset<T, ConnectionAggregateArgs>): Prisma.PrismaPromise<GetConnectionAggregateType<T>>

    /**
     * Group by Connection.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConnectionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConnectionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConnectionGroupByArgs['orderBy'] }
        : { orderBy?: ConnectionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConnectionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConnectionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Connection model
   */
  readonly fields: ConnectionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Connection.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConnectionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    linkedAccounts<T extends Connection$linkedAccountsArgs<ExtArgs> = {}>(args?: Subset<T, Connection$linkedAccountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    repositories<T extends Connection$repositoriesArgs<ExtArgs> = {}>(args?: Subset<T, Connection$repositoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Connection model
   */
  interface ConnectionFieldRefs {
    readonly id: FieldRef<"Connection", 'String'>
    readonly name: FieldRef<"Connection", 'String'>
    readonly provider: FieldRef<"Connection", 'String'>
    readonly authMethod: FieldRef<"Connection", 'String'>
    readonly providerAccountName: FieldRef<"Connection", 'String'>
    readonly providerUrl: FieldRef<"Connection", 'String'>
    readonly secretToken: FieldRef<"Connection", 'String'>
    readonly secretLastFour: FieldRef<"Connection", 'String'>
    readonly isDefault: FieldRef<"Connection", 'Boolean'>
    readonly status: FieldRef<"Connection", 'String'>
    readonly scopes: FieldRef<"Connection", 'String[]'>
    readonly expiresAt: FieldRef<"Connection", 'DateTime'>
    readonly createdAt: FieldRef<"Connection", 'DateTime'>
    readonly updatedAt: FieldRef<"Connection", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Connection findUnique
   */
  export type ConnectionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connection to fetch.
     */
    where: ConnectionWhereUniqueInput
  }

  /**
   * Connection findUniqueOrThrow
   */
  export type ConnectionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connection to fetch.
     */
    where: ConnectionWhereUniqueInput
  }

  /**
   * Connection findFirst
   */
  export type ConnectionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connection to fetch.
     */
    where?: ConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Connections to fetch.
     */
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Connections.
     */
    cursor?: ConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Connections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Connections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Connections.
     */
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Connection findFirstOrThrow
   */
  export type ConnectionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connection to fetch.
     */
    where?: ConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Connections to fetch.
     */
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Connections.
     */
    cursor?: ConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Connections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Connections.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Connections.
     */
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Connection findMany
   */
  export type ConnectionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter, which Connections to fetch.
     */
    where?: ConnectionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Connections to fetch.
     */
    orderBy?: ConnectionOrderByWithRelationInput | ConnectionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Connections.
     */
    cursor?: ConnectionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Connections from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Connections.
     */
    skip?: number
    distinct?: ConnectionScalarFieldEnum | ConnectionScalarFieldEnum[]
  }

  /**
   * Connection create
   */
  export type ConnectionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * The data needed to create a Connection.
     */
    data: XOR<ConnectionCreateInput, ConnectionUncheckedCreateInput>
  }

  /**
   * Connection createMany
   */
  export type ConnectionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Connections.
     */
    data: ConnectionCreateManyInput | ConnectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Connection createManyAndReturn
   */
  export type ConnectionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * The data used to create many Connections.
     */
    data: ConnectionCreateManyInput | ConnectionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Connection update
   */
  export type ConnectionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * The data needed to update a Connection.
     */
    data: XOR<ConnectionUpdateInput, ConnectionUncheckedUpdateInput>
    /**
     * Choose, which Connection to update.
     */
    where: ConnectionWhereUniqueInput
  }

  /**
   * Connection updateMany
   */
  export type ConnectionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Connections.
     */
    data: XOR<ConnectionUpdateManyMutationInput, ConnectionUncheckedUpdateManyInput>
    /**
     * Filter which Connections to update
     */
    where?: ConnectionWhereInput
    /**
     * Limit how many Connections to update.
     */
    limit?: number
  }

  /**
   * Connection updateManyAndReturn
   */
  export type ConnectionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * The data used to update Connections.
     */
    data: XOR<ConnectionUpdateManyMutationInput, ConnectionUncheckedUpdateManyInput>
    /**
     * Filter which Connections to update
     */
    where?: ConnectionWhereInput
    /**
     * Limit how many Connections to update.
     */
    limit?: number
  }

  /**
   * Connection upsert
   */
  export type ConnectionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * The filter to search for the Connection to update in case it exists.
     */
    where: ConnectionWhereUniqueInput
    /**
     * In case the Connection found by the `where` argument doesn't exist, create a new Connection with this data.
     */
    create: XOR<ConnectionCreateInput, ConnectionUncheckedCreateInput>
    /**
     * In case the Connection was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConnectionUpdateInput, ConnectionUncheckedUpdateInput>
  }

  /**
   * Connection delete
   */
  export type ConnectionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    /**
     * Filter which Connection to delete.
     */
    where: ConnectionWhereUniqueInput
  }

  /**
   * Connection deleteMany
   */
  export type ConnectionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Connections to delete
     */
    where?: ConnectionWhereInput
    /**
     * Limit how many Connections to delete.
     */
    limit?: number
  }

  /**
   * Connection.linkedAccounts
   */
  export type Connection$linkedAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    where?: LinkedAccountWhereInput
    orderBy?: LinkedAccountOrderByWithRelationInput | LinkedAccountOrderByWithRelationInput[]
    cursor?: LinkedAccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinkedAccountScalarFieldEnum | LinkedAccountScalarFieldEnum[]
  }

  /**
   * Connection.repositories
   */
  export type Connection$repositoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    where?: LinkedRepositoryWhereInput
    orderBy?: LinkedRepositoryOrderByWithRelationInput | LinkedRepositoryOrderByWithRelationInput[]
    cursor?: LinkedRepositoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinkedRepositoryScalarFieldEnum | LinkedRepositoryScalarFieldEnum[]
  }

  /**
   * Connection without action
   */
  export type ConnectionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
  }


  /**
   * Model LinkedAccount
   */

  export type AggregateLinkedAccount = {
    _count: LinkedAccountCountAggregateOutputType | null
    _min: LinkedAccountMinAggregateOutputType | null
    _max: LinkedAccountMaxAggregateOutputType | null
  }

  export type LinkedAccountMinAggregateOutputType = {
    id: string | null
    displayName: string | null
    providerUsername: string | null
    email: string | null
    provider: string | null
    authMethod: string | null
    status: string | null
    avatarUrl: string | null
    connectionId: string | null
    expiresAt: Date | null
    lastUsedAt: Date | null
    createdAt: Date | null
  }

  export type LinkedAccountMaxAggregateOutputType = {
    id: string | null
    displayName: string | null
    providerUsername: string | null
    email: string | null
    provider: string | null
    authMethod: string | null
    status: string | null
    avatarUrl: string | null
    connectionId: string | null
    expiresAt: Date | null
    lastUsedAt: Date | null
    createdAt: Date | null
  }

  export type LinkedAccountCountAggregateOutputType = {
    id: number
    displayName: number
    providerUsername: number
    email: number
    provider: number
    authMethod: number
    status: number
    avatarUrl: number
    connectionId: number
    expiresAt: number
    lastUsedAt: number
    createdAt: number
    _all: number
  }


  export type LinkedAccountMinAggregateInputType = {
    id?: true
    displayName?: true
    providerUsername?: true
    email?: true
    provider?: true
    authMethod?: true
    status?: true
    avatarUrl?: true
    connectionId?: true
    expiresAt?: true
    lastUsedAt?: true
    createdAt?: true
  }

  export type LinkedAccountMaxAggregateInputType = {
    id?: true
    displayName?: true
    providerUsername?: true
    email?: true
    provider?: true
    authMethod?: true
    status?: true
    avatarUrl?: true
    connectionId?: true
    expiresAt?: true
    lastUsedAt?: true
    createdAt?: true
  }

  export type LinkedAccountCountAggregateInputType = {
    id?: true
    displayName?: true
    providerUsername?: true
    email?: true
    provider?: true
    authMethod?: true
    status?: true
    avatarUrl?: true
    connectionId?: true
    expiresAt?: true
    lastUsedAt?: true
    createdAt?: true
    _all?: true
  }

  export type LinkedAccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinkedAccount to aggregate.
     */
    where?: LinkedAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkedAccounts to fetch.
     */
    orderBy?: LinkedAccountOrderByWithRelationInput | LinkedAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LinkedAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkedAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkedAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LinkedAccounts
    **/
    _count?: true | LinkedAccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LinkedAccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LinkedAccountMaxAggregateInputType
  }

  export type GetLinkedAccountAggregateType<T extends LinkedAccountAggregateArgs> = {
        [P in keyof T & keyof AggregateLinkedAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLinkedAccount[P]>
      : GetScalarType<T[P], AggregateLinkedAccount[P]>
  }




  export type LinkedAccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkedAccountWhereInput
    orderBy?: LinkedAccountOrderByWithAggregationInput | LinkedAccountOrderByWithAggregationInput[]
    by: LinkedAccountScalarFieldEnum[] | LinkedAccountScalarFieldEnum
    having?: LinkedAccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LinkedAccountCountAggregateInputType | true
    _min?: LinkedAccountMinAggregateInputType
    _max?: LinkedAccountMaxAggregateInputType
  }

  export type LinkedAccountGroupByOutputType = {
    id: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl: string | null
    connectionId: string | null
    expiresAt: Date | null
    lastUsedAt: Date | null
    createdAt: Date
    _count: LinkedAccountCountAggregateOutputType | null
    _min: LinkedAccountMinAggregateOutputType | null
    _max: LinkedAccountMaxAggregateOutputType | null
  }

  type GetLinkedAccountGroupByPayload<T extends LinkedAccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LinkedAccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LinkedAccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LinkedAccountGroupByOutputType[P]>
            : GetScalarType<T[P], LinkedAccountGroupByOutputType[P]>
        }
      >
    >


  export type LinkedAccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    displayName?: boolean
    providerUsername?: boolean
    email?: boolean
    provider?: boolean
    authMethod?: boolean
    status?: boolean
    avatarUrl?: boolean
    connectionId?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    connection?: boolean | LinkedAccount$connectionArgs<ExtArgs>
    assumedByRepos?: boolean | LinkedAccount$assumedByReposArgs<ExtArgs>
    _count?: boolean | LinkedAccountCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linkedAccount"]>

  export type LinkedAccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    displayName?: boolean
    providerUsername?: boolean
    email?: boolean
    provider?: boolean
    authMethod?: boolean
    status?: boolean
    avatarUrl?: boolean
    connectionId?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    connection?: boolean | LinkedAccount$connectionArgs<ExtArgs>
  }, ExtArgs["result"]["linkedAccount"]>

  export type LinkedAccountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    displayName?: boolean
    providerUsername?: boolean
    email?: boolean
    provider?: boolean
    authMethod?: boolean
    status?: boolean
    avatarUrl?: boolean
    connectionId?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
    connection?: boolean | LinkedAccount$connectionArgs<ExtArgs>
  }, ExtArgs["result"]["linkedAccount"]>

  export type LinkedAccountSelectScalar = {
    id?: boolean
    displayName?: boolean
    providerUsername?: boolean
    email?: boolean
    provider?: boolean
    authMethod?: boolean
    status?: boolean
    avatarUrl?: boolean
    connectionId?: boolean
    expiresAt?: boolean
    lastUsedAt?: boolean
    createdAt?: boolean
  }

  export type LinkedAccountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "displayName" | "providerUsername" | "email" | "provider" | "authMethod" | "status" | "avatarUrl" | "connectionId" | "expiresAt" | "lastUsedAt" | "createdAt", ExtArgs["result"]["linkedAccount"]>
  export type LinkedAccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    connection?: boolean | LinkedAccount$connectionArgs<ExtArgs>
    assumedByRepos?: boolean | LinkedAccount$assumedByReposArgs<ExtArgs>
    _count?: boolean | LinkedAccountCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LinkedAccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    connection?: boolean | LinkedAccount$connectionArgs<ExtArgs>
  }
  export type LinkedAccountIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    connection?: boolean | LinkedAccount$connectionArgs<ExtArgs>
  }

  export type $LinkedAccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LinkedAccount"
    objects: {
      connection: Prisma.$ConnectionPayload<ExtArgs> | null
      assumedByRepos: Prisma.$LinkedRepositoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      displayName: string
      providerUsername: string
      email: string
      provider: string
      authMethod: string
      status: string
      avatarUrl: string | null
      connectionId: string | null
      expiresAt: Date | null
      lastUsedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["linkedAccount"]>
    composites: {}
  }

  type LinkedAccountGetPayload<S extends boolean | null | undefined | LinkedAccountDefaultArgs> = $Result.GetResult<Prisma.$LinkedAccountPayload, S>

  type LinkedAccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LinkedAccountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LinkedAccountCountAggregateInputType | true
    }

  export interface LinkedAccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LinkedAccount'], meta: { name: 'LinkedAccount' } }
    /**
     * Find zero or one LinkedAccount that matches the filter.
     * @param {LinkedAccountFindUniqueArgs} args - Arguments to find a LinkedAccount
     * @example
     * // Get one LinkedAccount
     * const linkedAccount = await prisma.linkedAccount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LinkedAccountFindUniqueArgs>(args: SelectSubset<T, LinkedAccountFindUniqueArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LinkedAccount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LinkedAccountFindUniqueOrThrowArgs} args - Arguments to find a LinkedAccount
     * @example
     * // Get one LinkedAccount
     * const linkedAccount = await prisma.linkedAccount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LinkedAccountFindUniqueOrThrowArgs>(args: SelectSubset<T, LinkedAccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinkedAccount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedAccountFindFirstArgs} args - Arguments to find a LinkedAccount
     * @example
     * // Get one LinkedAccount
     * const linkedAccount = await prisma.linkedAccount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LinkedAccountFindFirstArgs>(args?: SelectSubset<T, LinkedAccountFindFirstArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinkedAccount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedAccountFindFirstOrThrowArgs} args - Arguments to find a LinkedAccount
     * @example
     * // Get one LinkedAccount
     * const linkedAccount = await prisma.linkedAccount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LinkedAccountFindFirstOrThrowArgs>(args?: SelectSubset<T, LinkedAccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LinkedAccounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedAccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LinkedAccounts
     * const linkedAccounts = await prisma.linkedAccount.findMany()
     * 
     * // Get first 10 LinkedAccounts
     * const linkedAccounts = await prisma.linkedAccount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const linkedAccountWithIdOnly = await prisma.linkedAccount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LinkedAccountFindManyArgs>(args?: SelectSubset<T, LinkedAccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LinkedAccount.
     * @param {LinkedAccountCreateArgs} args - Arguments to create a LinkedAccount.
     * @example
     * // Create one LinkedAccount
     * const LinkedAccount = await prisma.linkedAccount.create({
     *   data: {
     *     // ... data to create a LinkedAccount
     *   }
     * })
     * 
     */
    create<T extends LinkedAccountCreateArgs>(args: SelectSubset<T, LinkedAccountCreateArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LinkedAccounts.
     * @param {LinkedAccountCreateManyArgs} args - Arguments to create many LinkedAccounts.
     * @example
     * // Create many LinkedAccounts
     * const linkedAccount = await prisma.linkedAccount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LinkedAccountCreateManyArgs>(args?: SelectSubset<T, LinkedAccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LinkedAccounts and returns the data saved in the database.
     * @param {LinkedAccountCreateManyAndReturnArgs} args - Arguments to create many LinkedAccounts.
     * @example
     * // Create many LinkedAccounts
     * const linkedAccount = await prisma.linkedAccount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LinkedAccounts and only return the `id`
     * const linkedAccountWithIdOnly = await prisma.linkedAccount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LinkedAccountCreateManyAndReturnArgs>(args?: SelectSubset<T, LinkedAccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LinkedAccount.
     * @param {LinkedAccountDeleteArgs} args - Arguments to delete one LinkedAccount.
     * @example
     * // Delete one LinkedAccount
     * const LinkedAccount = await prisma.linkedAccount.delete({
     *   where: {
     *     // ... filter to delete one LinkedAccount
     *   }
     * })
     * 
     */
    delete<T extends LinkedAccountDeleteArgs>(args: SelectSubset<T, LinkedAccountDeleteArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LinkedAccount.
     * @param {LinkedAccountUpdateArgs} args - Arguments to update one LinkedAccount.
     * @example
     * // Update one LinkedAccount
     * const linkedAccount = await prisma.linkedAccount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LinkedAccountUpdateArgs>(args: SelectSubset<T, LinkedAccountUpdateArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LinkedAccounts.
     * @param {LinkedAccountDeleteManyArgs} args - Arguments to filter LinkedAccounts to delete.
     * @example
     * // Delete a few LinkedAccounts
     * const { count } = await prisma.linkedAccount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LinkedAccountDeleteManyArgs>(args?: SelectSubset<T, LinkedAccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinkedAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedAccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LinkedAccounts
     * const linkedAccount = await prisma.linkedAccount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LinkedAccountUpdateManyArgs>(args: SelectSubset<T, LinkedAccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinkedAccounts and returns the data updated in the database.
     * @param {LinkedAccountUpdateManyAndReturnArgs} args - Arguments to update many LinkedAccounts.
     * @example
     * // Update many LinkedAccounts
     * const linkedAccount = await prisma.linkedAccount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LinkedAccounts and only return the `id`
     * const linkedAccountWithIdOnly = await prisma.linkedAccount.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LinkedAccountUpdateManyAndReturnArgs>(args: SelectSubset<T, LinkedAccountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LinkedAccount.
     * @param {LinkedAccountUpsertArgs} args - Arguments to update or create a LinkedAccount.
     * @example
     * // Update or create a LinkedAccount
     * const linkedAccount = await prisma.linkedAccount.upsert({
     *   create: {
     *     // ... data to create a LinkedAccount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LinkedAccount we want to update
     *   }
     * })
     */
    upsert<T extends LinkedAccountUpsertArgs>(args: SelectSubset<T, LinkedAccountUpsertArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LinkedAccounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedAccountCountArgs} args - Arguments to filter LinkedAccounts to count.
     * @example
     * // Count the number of LinkedAccounts
     * const count = await prisma.linkedAccount.count({
     *   where: {
     *     // ... the filter for the LinkedAccounts we want to count
     *   }
     * })
    **/
    count<T extends LinkedAccountCountArgs>(
      args?: Subset<T, LinkedAccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LinkedAccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LinkedAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedAccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LinkedAccountAggregateArgs>(args: Subset<T, LinkedAccountAggregateArgs>): Prisma.PrismaPromise<GetLinkedAccountAggregateType<T>>

    /**
     * Group by LinkedAccount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedAccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LinkedAccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LinkedAccountGroupByArgs['orderBy'] }
        : { orderBy?: LinkedAccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LinkedAccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLinkedAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LinkedAccount model
   */
  readonly fields: LinkedAccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LinkedAccount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LinkedAccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    connection<T extends LinkedAccount$connectionArgs<ExtArgs> = {}>(args?: Subset<T, LinkedAccount$connectionArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    assumedByRepos<T extends LinkedAccount$assumedByReposArgs<ExtArgs> = {}>(args?: Subset<T, LinkedAccount$assumedByReposArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LinkedAccount model
   */
  interface LinkedAccountFieldRefs {
    readonly id: FieldRef<"LinkedAccount", 'String'>
    readonly displayName: FieldRef<"LinkedAccount", 'String'>
    readonly providerUsername: FieldRef<"LinkedAccount", 'String'>
    readonly email: FieldRef<"LinkedAccount", 'String'>
    readonly provider: FieldRef<"LinkedAccount", 'String'>
    readonly authMethod: FieldRef<"LinkedAccount", 'String'>
    readonly status: FieldRef<"LinkedAccount", 'String'>
    readonly avatarUrl: FieldRef<"LinkedAccount", 'String'>
    readonly connectionId: FieldRef<"LinkedAccount", 'String'>
    readonly expiresAt: FieldRef<"LinkedAccount", 'DateTime'>
    readonly lastUsedAt: FieldRef<"LinkedAccount", 'DateTime'>
    readonly createdAt: FieldRef<"LinkedAccount", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LinkedAccount findUnique
   */
  export type LinkedAccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * Filter, which LinkedAccount to fetch.
     */
    where: LinkedAccountWhereUniqueInput
  }

  /**
   * LinkedAccount findUniqueOrThrow
   */
  export type LinkedAccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * Filter, which LinkedAccount to fetch.
     */
    where: LinkedAccountWhereUniqueInput
  }

  /**
   * LinkedAccount findFirst
   */
  export type LinkedAccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * Filter, which LinkedAccount to fetch.
     */
    where?: LinkedAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkedAccounts to fetch.
     */
    orderBy?: LinkedAccountOrderByWithRelationInput | LinkedAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinkedAccounts.
     */
    cursor?: LinkedAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkedAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkedAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkedAccounts.
     */
    distinct?: LinkedAccountScalarFieldEnum | LinkedAccountScalarFieldEnum[]
  }

  /**
   * LinkedAccount findFirstOrThrow
   */
  export type LinkedAccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * Filter, which LinkedAccount to fetch.
     */
    where?: LinkedAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkedAccounts to fetch.
     */
    orderBy?: LinkedAccountOrderByWithRelationInput | LinkedAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinkedAccounts.
     */
    cursor?: LinkedAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkedAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkedAccounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkedAccounts.
     */
    distinct?: LinkedAccountScalarFieldEnum | LinkedAccountScalarFieldEnum[]
  }

  /**
   * LinkedAccount findMany
   */
  export type LinkedAccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * Filter, which LinkedAccounts to fetch.
     */
    where?: LinkedAccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkedAccounts to fetch.
     */
    orderBy?: LinkedAccountOrderByWithRelationInput | LinkedAccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LinkedAccounts.
     */
    cursor?: LinkedAccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkedAccounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkedAccounts.
     */
    skip?: number
    distinct?: LinkedAccountScalarFieldEnum | LinkedAccountScalarFieldEnum[]
  }

  /**
   * LinkedAccount create
   */
  export type LinkedAccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * The data needed to create a LinkedAccount.
     */
    data: XOR<LinkedAccountCreateInput, LinkedAccountUncheckedCreateInput>
  }

  /**
   * LinkedAccount createMany
   */
  export type LinkedAccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LinkedAccounts.
     */
    data: LinkedAccountCreateManyInput | LinkedAccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LinkedAccount createManyAndReturn
   */
  export type LinkedAccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * The data used to create many LinkedAccounts.
     */
    data: LinkedAccountCreateManyInput | LinkedAccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinkedAccount update
   */
  export type LinkedAccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * The data needed to update a LinkedAccount.
     */
    data: XOR<LinkedAccountUpdateInput, LinkedAccountUncheckedUpdateInput>
    /**
     * Choose, which LinkedAccount to update.
     */
    where: LinkedAccountWhereUniqueInput
  }

  /**
   * LinkedAccount updateMany
   */
  export type LinkedAccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LinkedAccounts.
     */
    data: XOR<LinkedAccountUpdateManyMutationInput, LinkedAccountUncheckedUpdateManyInput>
    /**
     * Filter which LinkedAccounts to update
     */
    where?: LinkedAccountWhereInput
    /**
     * Limit how many LinkedAccounts to update.
     */
    limit?: number
  }

  /**
   * LinkedAccount updateManyAndReturn
   */
  export type LinkedAccountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * The data used to update LinkedAccounts.
     */
    data: XOR<LinkedAccountUpdateManyMutationInput, LinkedAccountUncheckedUpdateManyInput>
    /**
     * Filter which LinkedAccounts to update
     */
    where?: LinkedAccountWhereInput
    /**
     * Limit how many LinkedAccounts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinkedAccount upsert
   */
  export type LinkedAccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * The filter to search for the LinkedAccount to update in case it exists.
     */
    where: LinkedAccountWhereUniqueInput
    /**
     * In case the LinkedAccount found by the `where` argument doesn't exist, create a new LinkedAccount with this data.
     */
    create: XOR<LinkedAccountCreateInput, LinkedAccountUncheckedCreateInput>
    /**
     * In case the LinkedAccount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LinkedAccountUpdateInput, LinkedAccountUncheckedUpdateInput>
  }

  /**
   * LinkedAccount delete
   */
  export type LinkedAccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    /**
     * Filter which LinkedAccount to delete.
     */
    where: LinkedAccountWhereUniqueInput
  }

  /**
   * LinkedAccount deleteMany
   */
  export type LinkedAccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinkedAccounts to delete
     */
    where?: LinkedAccountWhereInput
    /**
     * Limit how many LinkedAccounts to delete.
     */
    limit?: number
  }

  /**
   * LinkedAccount.connection
   */
  export type LinkedAccount$connectionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Connection
     */
    select?: ConnectionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Connection
     */
    omit?: ConnectionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ConnectionInclude<ExtArgs> | null
    where?: ConnectionWhereInput
  }

  /**
   * LinkedAccount.assumedByRepos
   */
  export type LinkedAccount$assumedByReposArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    where?: LinkedRepositoryWhereInput
    orderBy?: LinkedRepositoryOrderByWithRelationInput | LinkedRepositoryOrderByWithRelationInput[]
    cursor?: LinkedRepositoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinkedRepositoryScalarFieldEnum | LinkedRepositoryScalarFieldEnum[]
  }

  /**
   * LinkedAccount without action
   */
  export type LinkedAccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
  }


  /**
   * Model LinkedRepository
   */

  export type AggregateLinkedRepository = {
    _count: LinkedRepositoryCountAggregateOutputType | null
    _min: LinkedRepositoryMinAggregateOutputType | null
    _max: LinkedRepositoryMaxAggregateOutputType | null
  }

  export type LinkedRepositoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    fullName: string | null
    provider: string | null
    connectionId: string | null
    defaultBranch: string | null
    identityMode: string | null
    assumeAccountId: string | null
    indexEnabled: boolean | null
    defaultReviewer: string | null
    webhookActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LinkedRepositoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    fullName: string | null
    provider: string | null
    connectionId: string | null
    defaultBranch: string | null
    identityMode: string | null
    assumeAccountId: string | null
    indexEnabled: boolean | null
    defaultReviewer: string | null
    webhookActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LinkedRepositoryCountAggregateOutputType = {
    id: number
    name: number
    fullName: number
    provider: number
    connectionId: number
    defaultBranch: number
    identityMode: number
    assumeAccountId: number
    indexEnabled: number
    defaultReviewer: number
    webhookActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LinkedRepositoryMinAggregateInputType = {
    id?: true
    name?: true
    fullName?: true
    provider?: true
    connectionId?: true
    defaultBranch?: true
    identityMode?: true
    assumeAccountId?: true
    indexEnabled?: true
    defaultReviewer?: true
    webhookActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LinkedRepositoryMaxAggregateInputType = {
    id?: true
    name?: true
    fullName?: true
    provider?: true
    connectionId?: true
    defaultBranch?: true
    identityMode?: true
    assumeAccountId?: true
    indexEnabled?: true
    defaultReviewer?: true
    webhookActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LinkedRepositoryCountAggregateInputType = {
    id?: true
    name?: true
    fullName?: true
    provider?: true
    connectionId?: true
    defaultBranch?: true
    identityMode?: true
    assumeAccountId?: true
    indexEnabled?: true
    defaultReviewer?: true
    webhookActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LinkedRepositoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinkedRepository to aggregate.
     */
    where?: LinkedRepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkedRepositories to fetch.
     */
    orderBy?: LinkedRepositoryOrderByWithRelationInput | LinkedRepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LinkedRepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkedRepositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkedRepositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LinkedRepositories
    **/
    _count?: true | LinkedRepositoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LinkedRepositoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LinkedRepositoryMaxAggregateInputType
  }

  export type GetLinkedRepositoryAggregateType<T extends LinkedRepositoryAggregateArgs> = {
        [P in keyof T & keyof AggregateLinkedRepository]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLinkedRepository[P]>
      : GetScalarType<T[P], AggregateLinkedRepository[P]>
  }




  export type LinkedRepositoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkedRepositoryWhereInput
    orderBy?: LinkedRepositoryOrderByWithAggregationInput | LinkedRepositoryOrderByWithAggregationInput[]
    by: LinkedRepositoryScalarFieldEnum[] | LinkedRepositoryScalarFieldEnum
    having?: LinkedRepositoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LinkedRepositoryCountAggregateInputType | true
    _min?: LinkedRepositoryMinAggregateInputType
    _max?: LinkedRepositoryMaxAggregateInputType
  }

  export type LinkedRepositoryGroupByOutputType = {
    id: string
    name: string
    fullName: string
    provider: string
    connectionId: string
    defaultBranch: string
    identityMode: string
    assumeAccountId: string | null
    indexEnabled: boolean
    defaultReviewer: string | null
    webhookActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: LinkedRepositoryCountAggregateOutputType | null
    _min: LinkedRepositoryMinAggregateOutputType | null
    _max: LinkedRepositoryMaxAggregateOutputType | null
  }

  type GetLinkedRepositoryGroupByPayload<T extends LinkedRepositoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LinkedRepositoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LinkedRepositoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LinkedRepositoryGroupByOutputType[P]>
            : GetScalarType<T[P], LinkedRepositoryGroupByOutputType[P]>
        }
      >
    >


  export type LinkedRepositorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    fullName?: boolean
    provider?: boolean
    connectionId?: boolean
    defaultBranch?: boolean
    identityMode?: boolean
    assumeAccountId?: boolean
    indexEnabled?: boolean
    defaultReviewer?: boolean
    webhookActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    connection?: boolean | ConnectionDefaultArgs<ExtArgs>
    assumeAccount?: boolean | LinkedRepository$assumeAccountArgs<ExtArgs>
    webhooks?: boolean | LinkedRepository$webhooksArgs<ExtArgs>
    _count?: boolean | LinkedRepositoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linkedRepository"]>

  export type LinkedRepositorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    fullName?: boolean
    provider?: boolean
    connectionId?: boolean
    defaultBranch?: boolean
    identityMode?: boolean
    assumeAccountId?: boolean
    indexEnabled?: boolean
    defaultReviewer?: boolean
    webhookActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    connection?: boolean | ConnectionDefaultArgs<ExtArgs>
    assumeAccount?: boolean | LinkedRepository$assumeAccountArgs<ExtArgs>
  }, ExtArgs["result"]["linkedRepository"]>

  export type LinkedRepositorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    fullName?: boolean
    provider?: boolean
    connectionId?: boolean
    defaultBranch?: boolean
    identityMode?: boolean
    assumeAccountId?: boolean
    indexEnabled?: boolean
    defaultReviewer?: boolean
    webhookActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    connection?: boolean | ConnectionDefaultArgs<ExtArgs>
    assumeAccount?: boolean | LinkedRepository$assumeAccountArgs<ExtArgs>
  }, ExtArgs["result"]["linkedRepository"]>

  export type LinkedRepositorySelectScalar = {
    id?: boolean
    name?: boolean
    fullName?: boolean
    provider?: boolean
    connectionId?: boolean
    defaultBranch?: boolean
    identityMode?: boolean
    assumeAccountId?: boolean
    indexEnabled?: boolean
    defaultReviewer?: boolean
    webhookActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LinkedRepositoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "fullName" | "provider" | "connectionId" | "defaultBranch" | "identityMode" | "assumeAccountId" | "indexEnabled" | "defaultReviewer" | "webhookActive" | "createdAt" | "updatedAt", ExtArgs["result"]["linkedRepository"]>
  export type LinkedRepositoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    connection?: boolean | ConnectionDefaultArgs<ExtArgs>
    assumeAccount?: boolean | LinkedRepository$assumeAccountArgs<ExtArgs>
    webhooks?: boolean | LinkedRepository$webhooksArgs<ExtArgs>
    _count?: boolean | LinkedRepositoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LinkedRepositoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    connection?: boolean | ConnectionDefaultArgs<ExtArgs>
    assumeAccount?: boolean | LinkedRepository$assumeAccountArgs<ExtArgs>
  }
  export type LinkedRepositoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    connection?: boolean | ConnectionDefaultArgs<ExtArgs>
    assumeAccount?: boolean | LinkedRepository$assumeAccountArgs<ExtArgs>
  }

  export type $LinkedRepositoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LinkedRepository"
    objects: {
      connection: Prisma.$ConnectionPayload<ExtArgs>
      assumeAccount: Prisma.$LinkedAccountPayload<ExtArgs> | null
      webhooks: Prisma.$WebhookConfigPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      fullName: string
      provider: string
      connectionId: string
      defaultBranch: string
      identityMode: string
      assumeAccountId: string | null
      indexEnabled: boolean
      defaultReviewer: string | null
      webhookActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["linkedRepository"]>
    composites: {}
  }

  type LinkedRepositoryGetPayload<S extends boolean | null | undefined | LinkedRepositoryDefaultArgs> = $Result.GetResult<Prisma.$LinkedRepositoryPayload, S>

  type LinkedRepositoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LinkedRepositoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LinkedRepositoryCountAggregateInputType | true
    }

  export interface LinkedRepositoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LinkedRepository'], meta: { name: 'LinkedRepository' } }
    /**
     * Find zero or one LinkedRepository that matches the filter.
     * @param {LinkedRepositoryFindUniqueArgs} args - Arguments to find a LinkedRepository
     * @example
     * // Get one LinkedRepository
     * const linkedRepository = await prisma.linkedRepository.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LinkedRepositoryFindUniqueArgs>(args: SelectSubset<T, LinkedRepositoryFindUniqueArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LinkedRepository that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LinkedRepositoryFindUniqueOrThrowArgs} args - Arguments to find a LinkedRepository
     * @example
     * // Get one LinkedRepository
     * const linkedRepository = await prisma.linkedRepository.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LinkedRepositoryFindUniqueOrThrowArgs>(args: SelectSubset<T, LinkedRepositoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinkedRepository that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedRepositoryFindFirstArgs} args - Arguments to find a LinkedRepository
     * @example
     * // Get one LinkedRepository
     * const linkedRepository = await prisma.linkedRepository.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LinkedRepositoryFindFirstArgs>(args?: SelectSubset<T, LinkedRepositoryFindFirstArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinkedRepository that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedRepositoryFindFirstOrThrowArgs} args - Arguments to find a LinkedRepository
     * @example
     * // Get one LinkedRepository
     * const linkedRepository = await prisma.linkedRepository.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LinkedRepositoryFindFirstOrThrowArgs>(args?: SelectSubset<T, LinkedRepositoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LinkedRepositories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedRepositoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LinkedRepositories
     * const linkedRepositories = await prisma.linkedRepository.findMany()
     * 
     * // Get first 10 LinkedRepositories
     * const linkedRepositories = await prisma.linkedRepository.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const linkedRepositoryWithIdOnly = await prisma.linkedRepository.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LinkedRepositoryFindManyArgs>(args?: SelectSubset<T, LinkedRepositoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LinkedRepository.
     * @param {LinkedRepositoryCreateArgs} args - Arguments to create a LinkedRepository.
     * @example
     * // Create one LinkedRepository
     * const LinkedRepository = await prisma.linkedRepository.create({
     *   data: {
     *     // ... data to create a LinkedRepository
     *   }
     * })
     * 
     */
    create<T extends LinkedRepositoryCreateArgs>(args: SelectSubset<T, LinkedRepositoryCreateArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LinkedRepositories.
     * @param {LinkedRepositoryCreateManyArgs} args - Arguments to create many LinkedRepositories.
     * @example
     * // Create many LinkedRepositories
     * const linkedRepository = await prisma.linkedRepository.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LinkedRepositoryCreateManyArgs>(args?: SelectSubset<T, LinkedRepositoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LinkedRepositories and returns the data saved in the database.
     * @param {LinkedRepositoryCreateManyAndReturnArgs} args - Arguments to create many LinkedRepositories.
     * @example
     * // Create many LinkedRepositories
     * const linkedRepository = await prisma.linkedRepository.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LinkedRepositories and only return the `id`
     * const linkedRepositoryWithIdOnly = await prisma.linkedRepository.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LinkedRepositoryCreateManyAndReturnArgs>(args?: SelectSubset<T, LinkedRepositoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LinkedRepository.
     * @param {LinkedRepositoryDeleteArgs} args - Arguments to delete one LinkedRepository.
     * @example
     * // Delete one LinkedRepository
     * const LinkedRepository = await prisma.linkedRepository.delete({
     *   where: {
     *     // ... filter to delete one LinkedRepository
     *   }
     * })
     * 
     */
    delete<T extends LinkedRepositoryDeleteArgs>(args: SelectSubset<T, LinkedRepositoryDeleteArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LinkedRepository.
     * @param {LinkedRepositoryUpdateArgs} args - Arguments to update one LinkedRepository.
     * @example
     * // Update one LinkedRepository
     * const linkedRepository = await prisma.linkedRepository.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LinkedRepositoryUpdateArgs>(args: SelectSubset<T, LinkedRepositoryUpdateArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LinkedRepositories.
     * @param {LinkedRepositoryDeleteManyArgs} args - Arguments to filter LinkedRepositories to delete.
     * @example
     * // Delete a few LinkedRepositories
     * const { count } = await prisma.linkedRepository.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LinkedRepositoryDeleteManyArgs>(args?: SelectSubset<T, LinkedRepositoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinkedRepositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedRepositoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LinkedRepositories
     * const linkedRepository = await prisma.linkedRepository.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LinkedRepositoryUpdateManyArgs>(args: SelectSubset<T, LinkedRepositoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinkedRepositories and returns the data updated in the database.
     * @param {LinkedRepositoryUpdateManyAndReturnArgs} args - Arguments to update many LinkedRepositories.
     * @example
     * // Update many LinkedRepositories
     * const linkedRepository = await prisma.linkedRepository.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LinkedRepositories and only return the `id`
     * const linkedRepositoryWithIdOnly = await prisma.linkedRepository.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LinkedRepositoryUpdateManyAndReturnArgs>(args: SelectSubset<T, LinkedRepositoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LinkedRepository.
     * @param {LinkedRepositoryUpsertArgs} args - Arguments to update or create a LinkedRepository.
     * @example
     * // Update or create a LinkedRepository
     * const linkedRepository = await prisma.linkedRepository.upsert({
     *   create: {
     *     // ... data to create a LinkedRepository
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LinkedRepository we want to update
     *   }
     * })
     */
    upsert<T extends LinkedRepositoryUpsertArgs>(args: SelectSubset<T, LinkedRepositoryUpsertArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LinkedRepositories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedRepositoryCountArgs} args - Arguments to filter LinkedRepositories to count.
     * @example
     * // Count the number of LinkedRepositories
     * const count = await prisma.linkedRepository.count({
     *   where: {
     *     // ... the filter for the LinkedRepositories we want to count
     *   }
     * })
    **/
    count<T extends LinkedRepositoryCountArgs>(
      args?: Subset<T, LinkedRepositoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LinkedRepositoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LinkedRepository.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedRepositoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LinkedRepositoryAggregateArgs>(args: Subset<T, LinkedRepositoryAggregateArgs>): Prisma.PrismaPromise<GetLinkedRepositoryAggregateType<T>>

    /**
     * Group by LinkedRepository.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkedRepositoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LinkedRepositoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LinkedRepositoryGroupByArgs['orderBy'] }
        : { orderBy?: LinkedRepositoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LinkedRepositoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLinkedRepositoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LinkedRepository model
   */
  readonly fields: LinkedRepositoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LinkedRepository.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LinkedRepositoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    connection<T extends ConnectionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ConnectionDefaultArgs<ExtArgs>>): Prisma__ConnectionClient<$Result.GetResult<Prisma.$ConnectionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    assumeAccount<T extends LinkedRepository$assumeAccountArgs<ExtArgs> = {}>(args?: Subset<T, LinkedRepository$assumeAccountArgs<ExtArgs>>): Prisma__LinkedAccountClient<$Result.GetResult<Prisma.$LinkedAccountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    webhooks<T extends LinkedRepository$webhooksArgs<ExtArgs> = {}>(args?: Subset<T, LinkedRepository$webhooksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LinkedRepository model
   */
  interface LinkedRepositoryFieldRefs {
    readonly id: FieldRef<"LinkedRepository", 'String'>
    readonly name: FieldRef<"LinkedRepository", 'String'>
    readonly fullName: FieldRef<"LinkedRepository", 'String'>
    readonly provider: FieldRef<"LinkedRepository", 'String'>
    readonly connectionId: FieldRef<"LinkedRepository", 'String'>
    readonly defaultBranch: FieldRef<"LinkedRepository", 'String'>
    readonly identityMode: FieldRef<"LinkedRepository", 'String'>
    readonly assumeAccountId: FieldRef<"LinkedRepository", 'String'>
    readonly indexEnabled: FieldRef<"LinkedRepository", 'Boolean'>
    readonly defaultReviewer: FieldRef<"LinkedRepository", 'String'>
    readonly webhookActive: FieldRef<"LinkedRepository", 'Boolean'>
    readonly createdAt: FieldRef<"LinkedRepository", 'DateTime'>
    readonly updatedAt: FieldRef<"LinkedRepository", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LinkedRepository findUnique
   */
  export type LinkedRepositoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which LinkedRepository to fetch.
     */
    where: LinkedRepositoryWhereUniqueInput
  }

  /**
   * LinkedRepository findUniqueOrThrow
   */
  export type LinkedRepositoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which LinkedRepository to fetch.
     */
    where: LinkedRepositoryWhereUniqueInput
  }

  /**
   * LinkedRepository findFirst
   */
  export type LinkedRepositoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which LinkedRepository to fetch.
     */
    where?: LinkedRepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkedRepositories to fetch.
     */
    orderBy?: LinkedRepositoryOrderByWithRelationInput | LinkedRepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinkedRepositories.
     */
    cursor?: LinkedRepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkedRepositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkedRepositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkedRepositories.
     */
    distinct?: LinkedRepositoryScalarFieldEnum | LinkedRepositoryScalarFieldEnum[]
  }

  /**
   * LinkedRepository findFirstOrThrow
   */
  export type LinkedRepositoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which LinkedRepository to fetch.
     */
    where?: LinkedRepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkedRepositories to fetch.
     */
    orderBy?: LinkedRepositoryOrderByWithRelationInput | LinkedRepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinkedRepositories.
     */
    cursor?: LinkedRepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkedRepositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkedRepositories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkedRepositories.
     */
    distinct?: LinkedRepositoryScalarFieldEnum | LinkedRepositoryScalarFieldEnum[]
  }

  /**
   * LinkedRepository findMany
   */
  export type LinkedRepositoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * Filter, which LinkedRepositories to fetch.
     */
    where?: LinkedRepositoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkedRepositories to fetch.
     */
    orderBy?: LinkedRepositoryOrderByWithRelationInput | LinkedRepositoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LinkedRepositories.
     */
    cursor?: LinkedRepositoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkedRepositories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkedRepositories.
     */
    skip?: number
    distinct?: LinkedRepositoryScalarFieldEnum | LinkedRepositoryScalarFieldEnum[]
  }

  /**
   * LinkedRepository create
   */
  export type LinkedRepositoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * The data needed to create a LinkedRepository.
     */
    data: XOR<LinkedRepositoryCreateInput, LinkedRepositoryUncheckedCreateInput>
  }

  /**
   * LinkedRepository createMany
   */
  export type LinkedRepositoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LinkedRepositories.
     */
    data: LinkedRepositoryCreateManyInput | LinkedRepositoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LinkedRepository createManyAndReturn
   */
  export type LinkedRepositoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * The data used to create many LinkedRepositories.
     */
    data: LinkedRepositoryCreateManyInput | LinkedRepositoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinkedRepository update
   */
  export type LinkedRepositoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * The data needed to update a LinkedRepository.
     */
    data: XOR<LinkedRepositoryUpdateInput, LinkedRepositoryUncheckedUpdateInput>
    /**
     * Choose, which LinkedRepository to update.
     */
    where: LinkedRepositoryWhereUniqueInput
  }

  /**
   * LinkedRepository updateMany
   */
  export type LinkedRepositoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LinkedRepositories.
     */
    data: XOR<LinkedRepositoryUpdateManyMutationInput, LinkedRepositoryUncheckedUpdateManyInput>
    /**
     * Filter which LinkedRepositories to update
     */
    where?: LinkedRepositoryWhereInput
    /**
     * Limit how many LinkedRepositories to update.
     */
    limit?: number
  }

  /**
   * LinkedRepository updateManyAndReturn
   */
  export type LinkedRepositoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * The data used to update LinkedRepositories.
     */
    data: XOR<LinkedRepositoryUpdateManyMutationInput, LinkedRepositoryUncheckedUpdateManyInput>
    /**
     * Filter which LinkedRepositories to update
     */
    where?: LinkedRepositoryWhereInput
    /**
     * Limit how many LinkedRepositories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinkedRepository upsert
   */
  export type LinkedRepositoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * The filter to search for the LinkedRepository to update in case it exists.
     */
    where: LinkedRepositoryWhereUniqueInput
    /**
     * In case the LinkedRepository found by the `where` argument doesn't exist, create a new LinkedRepository with this data.
     */
    create: XOR<LinkedRepositoryCreateInput, LinkedRepositoryUncheckedCreateInput>
    /**
     * In case the LinkedRepository was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LinkedRepositoryUpdateInput, LinkedRepositoryUncheckedUpdateInput>
  }

  /**
   * LinkedRepository delete
   */
  export type LinkedRepositoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
    /**
     * Filter which LinkedRepository to delete.
     */
    where: LinkedRepositoryWhereUniqueInput
  }

  /**
   * LinkedRepository deleteMany
   */
  export type LinkedRepositoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinkedRepositories to delete
     */
    where?: LinkedRepositoryWhereInput
    /**
     * Limit how many LinkedRepositories to delete.
     */
    limit?: number
  }

  /**
   * LinkedRepository.assumeAccount
   */
  export type LinkedRepository$assumeAccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedAccount
     */
    select?: LinkedAccountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedAccount
     */
    omit?: LinkedAccountOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedAccountInclude<ExtArgs> | null
    where?: LinkedAccountWhereInput
  }

  /**
   * LinkedRepository.webhooks
   */
  export type LinkedRepository$webhooksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    where?: WebhookConfigWhereInput
    orderBy?: WebhookConfigOrderByWithRelationInput | WebhookConfigOrderByWithRelationInput[]
    cursor?: WebhookConfigWhereUniqueInput
    take?: number
    skip?: number
    distinct?: WebhookConfigScalarFieldEnum | WebhookConfigScalarFieldEnum[]
  }

  /**
   * LinkedRepository without action
   */
  export type LinkedRepositoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkedRepository
     */
    select?: LinkedRepositorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkedRepository
     */
    omit?: LinkedRepositoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkedRepositoryInclude<ExtArgs> | null
  }


  /**
   * Model WebhookConfig
   */

  export type AggregateWebhookConfig = {
    _count: WebhookConfigCountAggregateOutputType | null
    _min: WebhookConfigMinAggregateOutputType | null
    _max: WebhookConfigMaxAggregateOutputType | null
  }

  export type WebhookConfigMinAggregateOutputType = {
    id: string | null
    repositoryId: string | null
    event: string | null
    endpointPath: string | null
    active: boolean | null
    secretConfigured: boolean | null
    lastTriggeredAt: Date | null
    createdAt: Date | null
  }

  export type WebhookConfigMaxAggregateOutputType = {
    id: string | null
    repositoryId: string | null
    event: string | null
    endpointPath: string | null
    active: boolean | null
    secretConfigured: boolean | null
    lastTriggeredAt: Date | null
    createdAt: Date | null
  }

  export type WebhookConfigCountAggregateOutputType = {
    id: number
    repositoryId: number
    event: number
    endpointPath: number
    active: number
    secretConfigured: number
    lastTriggeredAt: number
    createdAt: number
    _all: number
  }


  export type WebhookConfigMinAggregateInputType = {
    id?: true
    repositoryId?: true
    event?: true
    endpointPath?: true
    active?: true
    secretConfigured?: true
    lastTriggeredAt?: true
    createdAt?: true
  }

  export type WebhookConfigMaxAggregateInputType = {
    id?: true
    repositoryId?: true
    event?: true
    endpointPath?: true
    active?: true
    secretConfigured?: true
    lastTriggeredAt?: true
    createdAt?: true
  }

  export type WebhookConfigCountAggregateInputType = {
    id?: true
    repositoryId?: true
    event?: true
    endpointPath?: true
    active?: true
    secretConfigured?: true
    lastTriggeredAt?: true
    createdAt?: true
    _all?: true
  }

  export type WebhookConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookConfig to aggregate.
     */
    where?: WebhookConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookConfigs to fetch.
     */
    orderBy?: WebhookConfigOrderByWithRelationInput | WebhookConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WebhookConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WebhookConfigs
    **/
    _count?: true | WebhookConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WebhookConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WebhookConfigMaxAggregateInputType
  }

  export type GetWebhookConfigAggregateType<T extends WebhookConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateWebhookConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWebhookConfig[P]>
      : GetScalarType<T[P], AggregateWebhookConfig[P]>
  }




  export type WebhookConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WebhookConfigWhereInput
    orderBy?: WebhookConfigOrderByWithAggregationInput | WebhookConfigOrderByWithAggregationInput[]
    by: WebhookConfigScalarFieldEnum[] | WebhookConfigScalarFieldEnum
    having?: WebhookConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WebhookConfigCountAggregateInputType | true
    _min?: WebhookConfigMinAggregateInputType
    _max?: WebhookConfigMaxAggregateInputType
  }

  export type WebhookConfigGroupByOutputType = {
    id: string
    repositoryId: string
    event: string
    endpointPath: string
    active: boolean
    secretConfigured: boolean
    lastTriggeredAt: Date | null
    createdAt: Date
    _count: WebhookConfigCountAggregateOutputType | null
    _min: WebhookConfigMinAggregateOutputType | null
    _max: WebhookConfigMaxAggregateOutputType | null
  }

  type GetWebhookConfigGroupByPayload<T extends WebhookConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WebhookConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WebhookConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WebhookConfigGroupByOutputType[P]>
            : GetScalarType<T[P], WebhookConfigGroupByOutputType[P]>
        }
      >
    >


  export type WebhookConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repositoryId?: boolean
    event?: boolean
    endpointPath?: boolean
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: boolean
    createdAt?: boolean
    repository?: boolean | LinkedRepositoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhookConfig"]>

  export type WebhookConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repositoryId?: boolean
    event?: boolean
    endpointPath?: boolean
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: boolean
    createdAt?: boolean
    repository?: boolean | LinkedRepositoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhookConfig"]>

  export type WebhookConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    repositoryId?: boolean
    event?: boolean
    endpointPath?: boolean
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: boolean
    createdAt?: boolean
    repository?: boolean | LinkedRepositoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["webhookConfig"]>

  export type WebhookConfigSelectScalar = {
    id?: boolean
    repositoryId?: boolean
    event?: boolean
    endpointPath?: boolean
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: boolean
    createdAt?: boolean
  }

  export type WebhookConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "repositoryId" | "event" | "endpointPath" | "active" | "secretConfigured" | "lastTriggeredAt" | "createdAt", ExtArgs["result"]["webhookConfig"]>
  export type WebhookConfigInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | LinkedRepositoryDefaultArgs<ExtArgs>
  }
  export type WebhookConfigIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | LinkedRepositoryDefaultArgs<ExtArgs>
  }
  export type WebhookConfigIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    repository?: boolean | LinkedRepositoryDefaultArgs<ExtArgs>
  }

  export type $WebhookConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WebhookConfig"
    objects: {
      repository: Prisma.$LinkedRepositoryPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      repositoryId: string
      event: string
      endpointPath: string
      active: boolean
      secretConfigured: boolean
      lastTriggeredAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["webhookConfig"]>
    composites: {}
  }

  type WebhookConfigGetPayload<S extends boolean | null | undefined | WebhookConfigDefaultArgs> = $Result.GetResult<Prisma.$WebhookConfigPayload, S>

  type WebhookConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WebhookConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WebhookConfigCountAggregateInputType | true
    }

  export interface WebhookConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WebhookConfig'], meta: { name: 'WebhookConfig' } }
    /**
     * Find zero or one WebhookConfig that matches the filter.
     * @param {WebhookConfigFindUniqueArgs} args - Arguments to find a WebhookConfig
     * @example
     * // Get one WebhookConfig
     * const webhookConfig = await prisma.webhookConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WebhookConfigFindUniqueArgs>(args: SelectSubset<T, WebhookConfigFindUniqueArgs<ExtArgs>>): Prisma__WebhookConfigClient<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WebhookConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WebhookConfigFindUniqueOrThrowArgs} args - Arguments to find a WebhookConfig
     * @example
     * // Get one WebhookConfig
     * const webhookConfig = await prisma.webhookConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WebhookConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, WebhookConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WebhookConfigClient<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebhookConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookConfigFindFirstArgs} args - Arguments to find a WebhookConfig
     * @example
     * // Get one WebhookConfig
     * const webhookConfig = await prisma.webhookConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WebhookConfigFindFirstArgs>(args?: SelectSubset<T, WebhookConfigFindFirstArgs<ExtArgs>>): Prisma__WebhookConfigClient<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WebhookConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookConfigFindFirstOrThrowArgs} args - Arguments to find a WebhookConfig
     * @example
     * // Get one WebhookConfig
     * const webhookConfig = await prisma.webhookConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WebhookConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, WebhookConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__WebhookConfigClient<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WebhookConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WebhookConfigs
     * const webhookConfigs = await prisma.webhookConfig.findMany()
     * 
     * // Get first 10 WebhookConfigs
     * const webhookConfigs = await prisma.webhookConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const webhookConfigWithIdOnly = await prisma.webhookConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WebhookConfigFindManyArgs>(args?: SelectSubset<T, WebhookConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WebhookConfig.
     * @param {WebhookConfigCreateArgs} args - Arguments to create a WebhookConfig.
     * @example
     * // Create one WebhookConfig
     * const WebhookConfig = await prisma.webhookConfig.create({
     *   data: {
     *     // ... data to create a WebhookConfig
     *   }
     * })
     * 
     */
    create<T extends WebhookConfigCreateArgs>(args: SelectSubset<T, WebhookConfigCreateArgs<ExtArgs>>): Prisma__WebhookConfigClient<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WebhookConfigs.
     * @param {WebhookConfigCreateManyArgs} args - Arguments to create many WebhookConfigs.
     * @example
     * // Create many WebhookConfigs
     * const webhookConfig = await prisma.webhookConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WebhookConfigCreateManyArgs>(args?: SelectSubset<T, WebhookConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WebhookConfigs and returns the data saved in the database.
     * @param {WebhookConfigCreateManyAndReturnArgs} args - Arguments to create many WebhookConfigs.
     * @example
     * // Create many WebhookConfigs
     * const webhookConfig = await prisma.webhookConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WebhookConfigs and only return the `id`
     * const webhookConfigWithIdOnly = await prisma.webhookConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WebhookConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, WebhookConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WebhookConfig.
     * @param {WebhookConfigDeleteArgs} args - Arguments to delete one WebhookConfig.
     * @example
     * // Delete one WebhookConfig
     * const WebhookConfig = await prisma.webhookConfig.delete({
     *   where: {
     *     // ... filter to delete one WebhookConfig
     *   }
     * })
     * 
     */
    delete<T extends WebhookConfigDeleteArgs>(args: SelectSubset<T, WebhookConfigDeleteArgs<ExtArgs>>): Prisma__WebhookConfigClient<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WebhookConfig.
     * @param {WebhookConfigUpdateArgs} args - Arguments to update one WebhookConfig.
     * @example
     * // Update one WebhookConfig
     * const webhookConfig = await prisma.webhookConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WebhookConfigUpdateArgs>(args: SelectSubset<T, WebhookConfigUpdateArgs<ExtArgs>>): Prisma__WebhookConfigClient<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WebhookConfigs.
     * @param {WebhookConfigDeleteManyArgs} args - Arguments to filter WebhookConfigs to delete.
     * @example
     * // Delete a few WebhookConfigs
     * const { count } = await prisma.webhookConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WebhookConfigDeleteManyArgs>(args?: SelectSubset<T, WebhookConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WebhookConfigs
     * const webhookConfig = await prisma.webhookConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WebhookConfigUpdateManyArgs>(args: SelectSubset<T, WebhookConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WebhookConfigs and returns the data updated in the database.
     * @param {WebhookConfigUpdateManyAndReturnArgs} args - Arguments to update many WebhookConfigs.
     * @example
     * // Update many WebhookConfigs
     * const webhookConfig = await prisma.webhookConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WebhookConfigs and only return the `id`
     * const webhookConfigWithIdOnly = await prisma.webhookConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WebhookConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, WebhookConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WebhookConfig.
     * @param {WebhookConfigUpsertArgs} args - Arguments to update or create a WebhookConfig.
     * @example
     * // Update or create a WebhookConfig
     * const webhookConfig = await prisma.webhookConfig.upsert({
     *   create: {
     *     // ... data to create a WebhookConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WebhookConfig we want to update
     *   }
     * })
     */
    upsert<T extends WebhookConfigUpsertArgs>(args: SelectSubset<T, WebhookConfigUpsertArgs<ExtArgs>>): Prisma__WebhookConfigClient<$Result.GetResult<Prisma.$WebhookConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WebhookConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookConfigCountArgs} args - Arguments to filter WebhookConfigs to count.
     * @example
     * // Count the number of WebhookConfigs
     * const count = await prisma.webhookConfig.count({
     *   where: {
     *     // ... the filter for the WebhookConfigs we want to count
     *   }
     * })
    **/
    count<T extends WebhookConfigCountArgs>(
      args?: Subset<T, WebhookConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WebhookConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WebhookConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WebhookConfigAggregateArgs>(args: Subset<T, WebhookConfigAggregateArgs>): Prisma.PrismaPromise<GetWebhookConfigAggregateType<T>>

    /**
     * Group by WebhookConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WebhookConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WebhookConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WebhookConfigGroupByArgs['orderBy'] }
        : { orderBy?: WebhookConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WebhookConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWebhookConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WebhookConfig model
   */
  readonly fields: WebhookConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WebhookConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WebhookConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    repository<T extends LinkedRepositoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LinkedRepositoryDefaultArgs<ExtArgs>>): Prisma__LinkedRepositoryClient<$Result.GetResult<Prisma.$LinkedRepositoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WebhookConfig model
   */
  interface WebhookConfigFieldRefs {
    readonly id: FieldRef<"WebhookConfig", 'String'>
    readonly repositoryId: FieldRef<"WebhookConfig", 'String'>
    readonly event: FieldRef<"WebhookConfig", 'String'>
    readonly endpointPath: FieldRef<"WebhookConfig", 'String'>
    readonly active: FieldRef<"WebhookConfig", 'Boolean'>
    readonly secretConfigured: FieldRef<"WebhookConfig", 'Boolean'>
    readonly lastTriggeredAt: FieldRef<"WebhookConfig", 'DateTime'>
    readonly createdAt: FieldRef<"WebhookConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WebhookConfig findUnique
   */
  export type WebhookConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * Filter, which WebhookConfig to fetch.
     */
    where: WebhookConfigWhereUniqueInput
  }

  /**
   * WebhookConfig findUniqueOrThrow
   */
  export type WebhookConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * Filter, which WebhookConfig to fetch.
     */
    where: WebhookConfigWhereUniqueInput
  }

  /**
   * WebhookConfig findFirst
   */
  export type WebhookConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * Filter, which WebhookConfig to fetch.
     */
    where?: WebhookConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookConfigs to fetch.
     */
    orderBy?: WebhookConfigOrderByWithRelationInput | WebhookConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookConfigs.
     */
    cursor?: WebhookConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookConfigs.
     */
    distinct?: WebhookConfigScalarFieldEnum | WebhookConfigScalarFieldEnum[]
  }

  /**
   * WebhookConfig findFirstOrThrow
   */
  export type WebhookConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * Filter, which WebhookConfig to fetch.
     */
    where?: WebhookConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookConfigs to fetch.
     */
    orderBy?: WebhookConfigOrderByWithRelationInput | WebhookConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WebhookConfigs.
     */
    cursor?: WebhookConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WebhookConfigs.
     */
    distinct?: WebhookConfigScalarFieldEnum | WebhookConfigScalarFieldEnum[]
  }

  /**
   * WebhookConfig findMany
   */
  export type WebhookConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * Filter, which WebhookConfigs to fetch.
     */
    where?: WebhookConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WebhookConfigs to fetch.
     */
    orderBy?: WebhookConfigOrderByWithRelationInput | WebhookConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WebhookConfigs.
     */
    cursor?: WebhookConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WebhookConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WebhookConfigs.
     */
    skip?: number
    distinct?: WebhookConfigScalarFieldEnum | WebhookConfigScalarFieldEnum[]
  }

  /**
   * WebhookConfig create
   */
  export type WebhookConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * The data needed to create a WebhookConfig.
     */
    data: XOR<WebhookConfigCreateInput, WebhookConfigUncheckedCreateInput>
  }

  /**
   * WebhookConfig createMany
   */
  export type WebhookConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WebhookConfigs.
     */
    data: WebhookConfigCreateManyInput | WebhookConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WebhookConfig createManyAndReturn
   */
  export type WebhookConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * The data used to create many WebhookConfigs.
     */
    data: WebhookConfigCreateManyInput | WebhookConfigCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * WebhookConfig update
   */
  export type WebhookConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * The data needed to update a WebhookConfig.
     */
    data: XOR<WebhookConfigUpdateInput, WebhookConfigUncheckedUpdateInput>
    /**
     * Choose, which WebhookConfig to update.
     */
    where: WebhookConfigWhereUniqueInput
  }

  /**
   * WebhookConfig updateMany
   */
  export type WebhookConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WebhookConfigs.
     */
    data: XOR<WebhookConfigUpdateManyMutationInput, WebhookConfigUncheckedUpdateManyInput>
    /**
     * Filter which WebhookConfigs to update
     */
    where?: WebhookConfigWhereInput
    /**
     * Limit how many WebhookConfigs to update.
     */
    limit?: number
  }

  /**
   * WebhookConfig updateManyAndReturn
   */
  export type WebhookConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * The data used to update WebhookConfigs.
     */
    data: XOR<WebhookConfigUpdateManyMutationInput, WebhookConfigUncheckedUpdateManyInput>
    /**
     * Filter which WebhookConfigs to update
     */
    where?: WebhookConfigWhereInput
    /**
     * Limit how many WebhookConfigs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * WebhookConfig upsert
   */
  export type WebhookConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * The filter to search for the WebhookConfig to update in case it exists.
     */
    where: WebhookConfigWhereUniqueInput
    /**
     * In case the WebhookConfig found by the `where` argument doesn't exist, create a new WebhookConfig with this data.
     */
    create: XOR<WebhookConfigCreateInput, WebhookConfigUncheckedCreateInput>
    /**
     * In case the WebhookConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WebhookConfigUpdateInput, WebhookConfigUncheckedUpdateInput>
  }

  /**
   * WebhookConfig delete
   */
  export type WebhookConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
    /**
     * Filter which WebhookConfig to delete.
     */
    where: WebhookConfigWhereUniqueInput
  }

  /**
   * WebhookConfig deleteMany
   */
  export type WebhookConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WebhookConfigs to delete
     */
    where?: WebhookConfigWhereInput
    /**
     * Limit how many WebhookConfigs to delete.
     */
    limit?: number
  }

  /**
   * WebhookConfig without action
   */
  export type WebhookConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WebhookConfig
     */
    select?: WebhookConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WebhookConfig
     */
    omit?: WebhookConfigOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WebhookConfigInclude<ExtArgs> | null
  }


  /**
   * Model MaskingRule
   */

  export type AggregateMaskingRule = {
    _count: MaskingRuleCountAggregateOutputType | null
    _min: MaskingRuleMinAggregateOutputType | null
    _max: MaskingRuleMaxAggregateOutputType | null
  }

  export type MaskingRuleMinAggregateOutputType = {
    id: string | null
    pattern: string | null
    description: string | null
    enabled: boolean | null
    builtIn: boolean | null
    regex: string | null
    createdAt: Date | null
  }

  export type MaskingRuleMaxAggregateOutputType = {
    id: string | null
    pattern: string | null
    description: string | null
    enabled: boolean | null
    builtIn: boolean | null
    regex: string | null
    createdAt: Date | null
  }

  export type MaskingRuleCountAggregateOutputType = {
    id: number
    pattern: number
    description: number
    enabled: number
    builtIn: number
    regex: number
    createdAt: number
    _all: number
  }


  export type MaskingRuleMinAggregateInputType = {
    id?: true
    pattern?: true
    description?: true
    enabled?: true
    builtIn?: true
    regex?: true
    createdAt?: true
  }

  export type MaskingRuleMaxAggregateInputType = {
    id?: true
    pattern?: true
    description?: true
    enabled?: true
    builtIn?: true
    regex?: true
    createdAt?: true
  }

  export type MaskingRuleCountAggregateInputType = {
    id?: true
    pattern?: true
    description?: true
    enabled?: true
    builtIn?: true
    regex?: true
    createdAt?: true
    _all?: true
  }

  export type MaskingRuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaskingRule to aggregate.
     */
    where?: MaskingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaskingRules to fetch.
     */
    orderBy?: MaskingRuleOrderByWithRelationInput | MaskingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaskingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaskingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaskingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaskingRules
    **/
    _count?: true | MaskingRuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaskingRuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaskingRuleMaxAggregateInputType
  }

  export type GetMaskingRuleAggregateType<T extends MaskingRuleAggregateArgs> = {
        [P in keyof T & keyof AggregateMaskingRule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaskingRule[P]>
      : GetScalarType<T[P], AggregateMaskingRule[P]>
  }




  export type MaskingRuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaskingRuleWhereInput
    orderBy?: MaskingRuleOrderByWithAggregationInput | MaskingRuleOrderByWithAggregationInput[]
    by: MaskingRuleScalarFieldEnum[] | MaskingRuleScalarFieldEnum
    having?: MaskingRuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaskingRuleCountAggregateInputType | true
    _min?: MaskingRuleMinAggregateInputType
    _max?: MaskingRuleMaxAggregateInputType
  }

  export type MaskingRuleGroupByOutputType = {
    id: string
    pattern: string
    description: string
    enabled: boolean
    builtIn: boolean
    regex: string | null
    createdAt: Date
    _count: MaskingRuleCountAggregateOutputType | null
    _min: MaskingRuleMinAggregateOutputType | null
    _max: MaskingRuleMaxAggregateOutputType | null
  }

  type GetMaskingRuleGroupByPayload<T extends MaskingRuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaskingRuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaskingRuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaskingRuleGroupByOutputType[P]>
            : GetScalarType<T[P], MaskingRuleGroupByOutputType[P]>
        }
      >
    >


  export type MaskingRuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pattern?: boolean
    description?: boolean
    enabled?: boolean
    builtIn?: boolean
    regex?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["maskingRule"]>

  export type MaskingRuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pattern?: boolean
    description?: boolean
    enabled?: boolean
    builtIn?: boolean
    regex?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["maskingRule"]>

  export type MaskingRuleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    pattern?: boolean
    description?: boolean
    enabled?: boolean
    builtIn?: boolean
    regex?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["maskingRule"]>

  export type MaskingRuleSelectScalar = {
    id?: boolean
    pattern?: boolean
    description?: boolean
    enabled?: boolean
    builtIn?: boolean
    regex?: boolean
    createdAt?: boolean
  }

  export type MaskingRuleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "pattern" | "description" | "enabled" | "builtIn" | "regex" | "createdAt", ExtArgs["result"]["maskingRule"]>

  export type $MaskingRulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaskingRule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      pattern: string
      description: string
      enabled: boolean
      builtIn: boolean
      regex: string | null
      createdAt: Date
    }, ExtArgs["result"]["maskingRule"]>
    composites: {}
  }

  type MaskingRuleGetPayload<S extends boolean | null | undefined | MaskingRuleDefaultArgs> = $Result.GetResult<Prisma.$MaskingRulePayload, S>

  type MaskingRuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaskingRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaskingRuleCountAggregateInputType | true
    }

  export interface MaskingRuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaskingRule'], meta: { name: 'MaskingRule' } }
    /**
     * Find zero or one MaskingRule that matches the filter.
     * @param {MaskingRuleFindUniqueArgs} args - Arguments to find a MaskingRule
     * @example
     * // Get one MaskingRule
     * const maskingRule = await prisma.maskingRule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaskingRuleFindUniqueArgs>(args: SelectSubset<T, MaskingRuleFindUniqueArgs<ExtArgs>>): Prisma__MaskingRuleClient<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MaskingRule that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaskingRuleFindUniqueOrThrowArgs} args - Arguments to find a MaskingRule
     * @example
     * // Get one MaskingRule
     * const maskingRule = await prisma.maskingRule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaskingRuleFindUniqueOrThrowArgs>(args: SelectSubset<T, MaskingRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaskingRuleClient<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaskingRule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingRuleFindFirstArgs} args - Arguments to find a MaskingRule
     * @example
     * // Get one MaskingRule
     * const maskingRule = await prisma.maskingRule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaskingRuleFindFirstArgs>(args?: SelectSubset<T, MaskingRuleFindFirstArgs<ExtArgs>>): Prisma__MaskingRuleClient<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaskingRule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingRuleFindFirstOrThrowArgs} args - Arguments to find a MaskingRule
     * @example
     * // Get one MaskingRule
     * const maskingRule = await prisma.maskingRule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaskingRuleFindFirstOrThrowArgs>(args?: SelectSubset<T, MaskingRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaskingRuleClient<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MaskingRules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingRuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaskingRules
     * const maskingRules = await prisma.maskingRule.findMany()
     * 
     * // Get first 10 MaskingRules
     * const maskingRules = await prisma.maskingRule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maskingRuleWithIdOnly = await prisma.maskingRule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaskingRuleFindManyArgs>(args?: SelectSubset<T, MaskingRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MaskingRule.
     * @param {MaskingRuleCreateArgs} args - Arguments to create a MaskingRule.
     * @example
     * // Create one MaskingRule
     * const MaskingRule = await prisma.maskingRule.create({
     *   data: {
     *     // ... data to create a MaskingRule
     *   }
     * })
     * 
     */
    create<T extends MaskingRuleCreateArgs>(args: SelectSubset<T, MaskingRuleCreateArgs<ExtArgs>>): Prisma__MaskingRuleClient<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MaskingRules.
     * @param {MaskingRuleCreateManyArgs} args - Arguments to create many MaskingRules.
     * @example
     * // Create many MaskingRules
     * const maskingRule = await prisma.maskingRule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaskingRuleCreateManyArgs>(args?: SelectSubset<T, MaskingRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaskingRules and returns the data saved in the database.
     * @param {MaskingRuleCreateManyAndReturnArgs} args - Arguments to create many MaskingRules.
     * @example
     * // Create many MaskingRules
     * const maskingRule = await prisma.maskingRule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaskingRules and only return the `id`
     * const maskingRuleWithIdOnly = await prisma.maskingRule.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaskingRuleCreateManyAndReturnArgs>(args?: SelectSubset<T, MaskingRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MaskingRule.
     * @param {MaskingRuleDeleteArgs} args - Arguments to delete one MaskingRule.
     * @example
     * // Delete one MaskingRule
     * const MaskingRule = await prisma.maskingRule.delete({
     *   where: {
     *     // ... filter to delete one MaskingRule
     *   }
     * })
     * 
     */
    delete<T extends MaskingRuleDeleteArgs>(args: SelectSubset<T, MaskingRuleDeleteArgs<ExtArgs>>): Prisma__MaskingRuleClient<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MaskingRule.
     * @param {MaskingRuleUpdateArgs} args - Arguments to update one MaskingRule.
     * @example
     * // Update one MaskingRule
     * const maskingRule = await prisma.maskingRule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaskingRuleUpdateArgs>(args: SelectSubset<T, MaskingRuleUpdateArgs<ExtArgs>>): Prisma__MaskingRuleClient<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MaskingRules.
     * @param {MaskingRuleDeleteManyArgs} args - Arguments to filter MaskingRules to delete.
     * @example
     * // Delete a few MaskingRules
     * const { count } = await prisma.maskingRule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaskingRuleDeleteManyArgs>(args?: SelectSubset<T, MaskingRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaskingRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingRuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaskingRules
     * const maskingRule = await prisma.maskingRule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaskingRuleUpdateManyArgs>(args: SelectSubset<T, MaskingRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaskingRules and returns the data updated in the database.
     * @param {MaskingRuleUpdateManyAndReturnArgs} args - Arguments to update many MaskingRules.
     * @example
     * // Update many MaskingRules
     * const maskingRule = await prisma.maskingRule.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MaskingRules and only return the `id`
     * const maskingRuleWithIdOnly = await prisma.maskingRule.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MaskingRuleUpdateManyAndReturnArgs>(args: SelectSubset<T, MaskingRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MaskingRule.
     * @param {MaskingRuleUpsertArgs} args - Arguments to update or create a MaskingRule.
     * @example
     * // Update or create a MaskingRule
     * const maskingRule = await prisma.maskingRule.upsert({
     *   create: {
     *     // ... data to create a MaskingRule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaskingRule we want to update
     *   }
     * })
     */
    upsert<T extends MaskingRuleUpsertArgs>(args: SelectSubset<T, MaskingRuleUpsertArgs<ExtArgs>>): Prisma__MaskingRuleClient<$Result.GetResult<Prisma.$MaskingRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MaskingRules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingRuleCountArgs} args - Arguments to filter MaskingRules to count.
     * @example
     * // Count the number of MaskingRules
     * const count = await prisma.maskingRule.count({
     *   where: {
     *     // ... the filter for the MaskingRules we want to count
     *   }
     * })
    **/
    count<T extends MaskingRuleCountArgs>(
      args?: Subset<T, MaskingRuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaskingRuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaskingRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingRuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaskingRuleAggregateArgs>(args: Subset<T, MaskingRuleAggregateArgs>): Prisma.PrismaPromise<GetMaskingRuleAggregateType<T>>

    /**
     * Group by MaskingRule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingRuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaskingRuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaskingRuleGroupByArgs['orderBy'] }
        : { orderBy?: MaskingRuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaskingRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaskingRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaskingRule model
   */
  readonly fields: MaskingRuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaskingRule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaskingRuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MaskingRule model
   */
  interface MaskingRuleFieldRefs {
    readonly id: FieldRef<"MaskingRule", 'String'>
    readonly pattern: FieldRef<"MaskingRule", 'String'>
    readonly description: FieldRef<"MaskingRule", 'String'>
    readonly enabled: FieldRef<"MaskingRule", 'Boolean'>
    readonly builtIn: FieldRef<"MaskingRule", 'Boolean'>
    readonly regex: FieldRef<"MaskingRule", 'String'>
    readonly createdAt: FieldRef<"MaskingRule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MaskingRule findUnique
   */
  export type MaskingRuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * Filter, which MaskingRule to fetch.
     */
    where: MaskingRuleWhereUniqueInput
  }

  /**
   * MaskingRule findUniqueOrThrow
   */
  export type MaskingRuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * Filter, which MaskingRule to fetch.
     */
    where: MaskingRuleWhereUniqueInput
  }

  /**
   * MaskingRule findFirst
   */
  export type MaskingRuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * Filter, which MaskingRule to fetch.
     */
    where?: MaskingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaskingRules to fetch.
     */
    orderBy?: MaskingRuleOrderByWithRelationInput | MaskingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaskingRules.
     */
    cursor?: MaskingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaskingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaskingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaskingRules.
     */
    distinct?: MaskingRuleScalarFieldEnum | MaskingRuleScalarFieldEnum[]
  }

  /**
   * MaskingRule findFirstOrThrow
   */
  export type MaskingRuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * Filter, which MaskingRule to fetch.
     */
    where?: MaskingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaskingRules to fetch.
     */
    orderBy?: MaskingRuleOrderByWithRelationInput | MaskingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaskingRules.
     */
    cursor?: MaskingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaskingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaskingRules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaskingRules.
     */
    distinct?: MaskingRuleScalarFieldEnum | MaskingRuleScalarFieldEnum[]
  }

  /**
   * MaskingRule findMany
   */
  export type MaskingRuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * Filter, which MaskingRules to fetch.
     */
    where?: MaskingRuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaskingRules to fetch.
     */
    orderBy?: MaskingRuleOrderByWithRelationInput | MaskingRuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaskingRules.
     */
    cursor?: MaskingRuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaskingRules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaskingRules.
     */
    skip?: number
    distinct?: MaskingRuleScalarFieldEnum | MaskingRuleScalarFieldEnum[]
  }

  /**
   * MaskingRule create
   */
  export type MaskingRuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * The data needed to create a MaskingRule.
     */
    data: XOR<MaskingRuleCreateInput, MaskingRuleUncheckedCreateInput>
  }

  /**
   * MaskingRule createMany
   */
  export type MaskingRuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaskingRules.
     */
    data: MaskingRuleCreateManyInput | MaskingRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaskingRule createManyAndReturn
   */
  export type MaskingRuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * The data used to create many MaskingRules.
     */
    data: MaskingRuleCreateManyInput | MaskingRuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaskingRule update
   */
  export type MaskingRuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * The data needed to update a MaskingRule.
     */
    data: XOR<MaskingRuleUpdateInput, MaskingRuleUncheckedUpdateInput>
    /**
     * Choose, which MaskingRule to update.
     */
    where: MaskingRuleWhereUniqueInput
  }

  /**
   * MaskingRule updateMany
   */
  export type MaskingRuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaskingRules.
     */
    data: XOR<MaskingRuleUpdateManyMutationInput, MaskingRuleUncheckedUpdateManyInput>
    /**
     * Filter which MaskingRules to update
     */
    where?: MaskingRuleWhereInput
    /**
     * Limit how many MaskingRules to update.
     */
    limit?: number
  }

  /**
   * MaskingRule updateManyAndReturn
   */
  export type MaskingRuleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * The data used to update MaskingRules.
     */
    data: XOR<MaskingRuleUpdateManyMutationInput, MaskingRuleUncheckedUpdateManyInput>
    /**
     * Filter which MaskingRules to update
     */
    where?: MaskingRuleWhereInput
    /**
     * Limit how many MaskingRules to update.
     */
    limit?: number
  }

  /**
   * MaskingRule upsert
   */
  export type MaskingRuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * The filter to search for the MaskingRule to update in case it exists.
     */
    where: MaskingRuleWhereUniqueInput
    /**
     * In case the MaskingRule found by the `where` argument doesn't exist, create a new MaskingRule with this data.
     */
    create: XOR<MaskingRuleCreateInput, MaskingRuleUncheckedCreateInput>
    /**
     * In case the MaskingRule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaskingRuleUpdateInput, MaskingRuleUncheckedUpdateInput>
  }

  /**
   * MaskingRule delete
   */
  export type MaskingRuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
    /**
     * Filter which MaskingRule to delete.
     */
    where: MaskingRuleWhereUniqueInput
  }

  /**
   * MaskingRule deleteMany
   */
  export type MaskingRuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaskingRules to delete
     */
    where?: MaskingRuleWhereInput
    /**
     * Limit how many MaskingRules to delete.
     */
    limit?: number
  }

  /**
   * MaskingRule without action
   */
  export type MaskingRuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingRule
     */
    select?: MaskingRuleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingRule
     */
    omit?: MaskingRuleOmit<ExtArgs> | null
  }


  /**
   * Model WorkItem
   */

  export type AggregateWorkItem = {
    _count: WorkItemCountAggregateOutputType | null
    _avg: WorkItemAvgAggregateOutputType | null
    _sum: WorkItemSumAggregateOutputType | null
    _min: WorkItemMinAggregateOutputType | null
    _max: WorkItemMaxAggregateOutputType | null
  }

  export type WorkItemAvgAggregateOutputType = {
    azureId: number | null
  }

  export type WorkItemSumAggregateOutputType = {
    azureId: number | null
  }

  export type WorkItemMinAggregateOutputType = {
    id: string | null
    azureId: number | null
    title: string | null
    description: string | null
    userQuery: string | null
    type: string | null
    status: string | null
    assignedTo: string | null
    repositoryFullName: string | null
    targetBranch: string | null
    linkedRunId: string | null
    linkedPRId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkItemMaxAggregateOutputType = {
    id: string | null
    azureId: number | null
    title: string | null
    description: string | null
    userQuery: string | null
    type: string | null
    status: string | null
    assignedTo: string | null
    repositoryFullName: string | null
    targetBranch: string | null
    linkedRunId: string | null
    linkedPRId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type WorkItemCountAggregateOutputType = {
    id: number
    azureId: number
    title: number
    description: number
    userQuery: number
    type: number
    status: number
    assignedTo: number
    repositoryFullName: number
    targetBranch: number
    linkedRunId: number
    linkedPRId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type WorkItemAvgAggregateInputType = {
    azureId?: true
  }

  export type WorkItemSumAggregateInputType = {
    azureId?: true
  }

  export type WorkItemMinAggregateInputType = {
    id?: true
    azureId?: true
    title?: true
    description?: true
    userQuery?: true
    type?: true
    status?: true
    assignedTo?: true
    repositoryFullName?: true
    targetBranch?: true
    linkedRunId?: true
    linkedPRId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkItemMaxAggregateInputType = {
    id?: true
    azureId?: true
    title?: true
    description?: true
    userQuery?: true
    type?: true
    status?: true
    assignedTo?: true
    repositoryFullName?: true
    targetBranch?: true
    linkedRunId?: true
    linkedPRId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type WorkItemCountAggregateInputType = {
    id?: true
    azureId?: true
    title?: true
    description?: true
    userQuery?: true
    type?: true
    status?: true
    assignedTo?: true
    repositoryFullName?: true
    targetBranch?: true
    linkedRunId?: true
    linkedPRId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type WorkItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkItem to aggregate.
     */
    where?: WorkItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkItems to fetch.
     */
    orderBy?: WorkItemOrderByWithRelationInput | WorkItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: WorkItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned WorkItems
    **/
    _count?: true | WorkItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: WorkItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: WorkItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: WorkItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: WorkItemMaxAggregateInputType
  }

  export type GetWorkItemAggregateType<T extends WorkItemAggregateArgs> = {
        [P in keyof T & keyof AggregateWorkItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateWorkItem[P]>
      : GetScalarType<T[P], AggregateWorkItem[P]>
  }




  export type WorkItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: WorkItemWhereInput
    orderBy?: WorkItemOrderByWithAggregationInput | WorkItemOrderByWithAggregationInput[]
    by: WorkItemScalarFieldEnum[] | WorkItemScalarFieldEnum
    having?: WorkItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: WorkItemCountAggregateInputType | true
    _avg?: WorkItemAvgAggregateInputType
    _sum?: WorkItemSumAggregateInputType
    _min?: WorkItemMinAggregateInputType
    _max?: WorkItemMaxAggregateInputType
  }

  export type WorkItemGroupByOutputType = {
    id: string
    azureId: number
    title: string
    description: string
    userQuery: string | null
    type: string
    status: string
    assignedTo: string | null
    repositoryFullName: string | null
    targetBranch: string | null
    linkedRunId: string | null
    linkedPRId: string | null
    createdAt: Date
    updatedAt: Date
    _count: WorkItemCountAggregateOutputType | null
    _avg: WorkItemAvgAggregateOutputType | null
    _sum: WorkItemSumAggregateOutputType | null
    _min: WorkItemMinAggregateOutputType | null
    _max: WorkItemMaxAggregateOutputType | null
  }

  type GetWorkItemGroupByPayload<T extends WorkItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<WorkItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof WorkItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], WorkItemGroupByOutputType[P]>
            : GetScalarType<T[P], WorkItemGroupByOutputType[P]>
        }
      >
    >


  export type WorkItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    azureId?: boolean
    title?: boolean
    description?: boolean
    userQuery?: boolean
    type?: boolean
    status?: boolean
    assignedTo?: boolean
    repositoryFullName?: boolean
    targetBranch?: boolean
    linkedRunId?: boolean
    linkedPRId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    agentRuns?: boolean | WorkItem$agentRunsArgs<ExtArgs>
    pullRequests?: boolean | WorkItem$pullRequestsArgs<ExtArgs>
    _count?: boolean | WorkItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["workItem"]>

  export type WorkItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    azureId?: boolean
    title?: boolean
    description?: boolean
    userQuery?: boolean
    type?: boolean
    status?: boolean
    assignedTo?: boolean
    repositoryFullName?: boolean
    targetBranch?: boolean
    linkedRunId?: boolean
    linkedPRId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["workItem"]>

  export type WorkItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    azureId?: boolean
    title?: boolean
    description?: boolean
    userQuery?: boolean
    type?: boolean
    status?: boolean
    assignedTo?: boolean
    repositoryFullName?: boolean
    targetBranch?: boolean
    linkedRunId?: boolean
    linkedPRId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["workItem"]>

  export type WorkItemSelectScalar = {
    id?: boolean
    azureId?: boolean
    title?: boolean
    description?: boolean
    userQuery?: boolean
    type?: boolean
    status?: boolean
    assignedTo?: boolean
    repositoryFullName?: boolean
    targetBranch?: boolean
    linkedRunId?: boolean
    linkedPRId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type WorkItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "azureId" | "title" | "description" | "userQuery" | "type" | "status" | "assignedTo" | "repositoryFullName" | "targetBranch" | "linkedRunId" | "linkedPRId" | "createdAt" | "updatedAt", ExtArgs["result"]["workItem"]>
  export type WorkItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    agentRuns?: boolean | WorkItem$agentRunsArgs<ExtArgs>
    pullRequests?: boolean | WorkItem$pullRequestsArgs<ExtArgs>
    _count?: boolean | WorkItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type WorkItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type WorkItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $WorkItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "WorkItem"
    objects: {
      agentRuns: Prisma.$AgentRunPayload<ExtArgs>[]
      pullRequests: Prisma.$PullRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      azureId: number
      title: string
      description: string
      userQuery: string | null
      type: string
      status: string
      assignedTo: string | null
      repositoryFullName: string | null
      targetBranch: string | null
      linkedRunId: string | null
      linkedPRId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["workItem"]>
    composites: {}
  }

  type WorkItemGetPayload<S extends boolean | null | undefined | WorkItemDefaultArgs> = $Result.GetResult<Prisma.$WorkItemPayload, S>

  type WorkItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<WorkItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: WorkItemCountAggregateInputType | true
    }

  export interface WorkItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['WorkItem'], meta: { name: 'WorkItem' } }
    /**
     * Find zero or one WorkItem that matches the filter.
     * @param {WorkItemFindUniqueArgs} args - Arguments to find a WorkItem
     * @example
     * // Get one WorkItem
     * const workItem = await prisma.workItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends WorkItemFindUniqueArgs>(args: SelectSubset<T, WorkItemFindUniqueArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one WorkItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {WorkItemFindUniqueOrThrowArgs} args - Arguments to find a WorkItem
     * @example
     * // Get one WorkItem
     * const workItem = await prisma.workItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends WorkItemFindUniqueOrThrowArgs>(args: SelectSubset<T, WorkItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkItemFindFirstArgs} args - Arguments to find a WorkItem
     * @example
     * // Get one WorkItem
     * const workItem = await prisma.workItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends WorkItemFindFirstArgs>(args?: SelectSubset<T, WorkItemFindFirstArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first WorkItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkItemFindFirstOrThrowArgs} args - Arguments to find a WorkItem
     * @example
     * // Get one WorkItem
     * const workItem = await prisma.workItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends WorkItemFindFirstOrThrowArgs>(args?: SelectSubset<T, WorkItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more WorkItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all WorkItems
     * const workItems = await prisma.workItem.findMany()
     * 
     * // Get first 10 WorkItems
     * const workItems = await prisma.workItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const workItemWithIdOnly = await prisma.workItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends WorkItemFindManyArgs>(args?: SelectSubset<T, WorkItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a WorkItem.
     * @param {WorkItemCreateArgs} args - Arguments to create a WorkItem.
     * @example
     * // Create one WorkItem
     * const WorkItem = await prisma.workItem.create({
     *   data: {
     *     // ... data to create a WorkItem
     *   }
     * })
     * 
     */
    create<T extends WorkItemCreateArgs>(args: SelectSubset<T, WorkItemCreateArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many WorkItems.
     * @param {WorkItemCreateManyArgs} args - Arguments to create many WorkItems.
     * @example
     * // Create many WorkItems
     * const workItem = await prisma.workItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends WorkItemCreateManyArgs>(args?: SelectSubset<T, WorkItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many WorkItems and returns the data saved in the database.
     * @param {WorkItemCreateManyAndReturnArgs} args - Arguments to create many WorkItems.
     * @example
     * // Create many WorkItems
     * const workItem = await prisma.workItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many WorkItems and only return the `id`
     * const workItemWithIdOnly = await prisma.workItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends WorkItemCreateManyAndReturnArgs>(args?: SelectSubset<T, WorkItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a WorkItem.
     * @param {WorkItemDeleteArgs} args - Arguments to delete one WorkItem.
     * @example
     * // Delete one WorkItem
     * const WorkItem = await prisma.workItem.delete({
     *   where: {
     *     // ... filter to delete one WorkItem
     *   }
     * })
     * 
     */
    delete<T extends WorkItemDeleteArgs>(args: SelectSubset<T, WorkItemDeleteArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one WorkItem.
     * @param {WorkItemUpdateArgs} args - Arguments to update one WorkItem.
     * @example
     * // Update one WorkItem
     * const workItem = await prisma.workItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends WorkItemUpdateArgs>(args: SelectSubset<T, WorkItemUpdateArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more WorkItems.
     * @param {WorkItemDeleteManyArgs} args - Arguments to filter WorkItems to delete.
     * @example
     * // Delete a few WorkItems
     * const { count } = await prisma.workItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends WorkItemDeleteManyArgs>(args?: SelectSubset<T, WorkItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many WorkItems
     * const workItem = await prisma.workItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends WorkItemUpdateManyArgs>(args: SelectSubset<T, WorkItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more WorkItems and returns the data updated in the database.
     * @param {WorkItemUpdateManyAndReturnArgs} args - Arguments to update many WorkItems.
     * @example
     * // Update many WorkItems
     * const workItem = await prisma.workItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more WorkItems and only return the `id`
     * const workItemWithIdOnly = await prisma.workItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends WorkItemUpdateManyAndReturnArgs>(args: SelectSubset<T, WorkItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one WorkItem.
     * @param {WorkItemUpsertArgs} args - Arguments to update or create a WorkItem.
     * @example
     * // Update or create a WorkItem
     * const workItem = await prisma.workItem.upsert({
     *   create: {
     *     // ... data to create a WorkItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the WorkItem we want to update
     *   }
     * })
     */
    upsert<T extends WorkItemUpsertArgs>(args: SelectSubset<T, WorkItemUpsertArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of WorkItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkItemCountArgs} args - Arguments to filter WorkItems to count.
     * @example
     * // Count the number of WorkItems
     * const count = await prisma.workItem.count({
     *   where: {
     *     // ... the filter for the WorkItems we want to count
     *   }
     * })
    **/
    count<T extends WorkItemCountArgs>(
      args?: Subset<T, WorkItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], WorkItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a WorkItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends WorkItemAggregateArgs>(args: Subset<T, WorkItemAggregateArgs>): Prisma.PrismaPromise<GetWorkItemAggregateType<T>>

    /**
     * Group by WorkItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {WorkItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends WorkItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: WorkItemGroupByArgs['orderBy'] }
        : { orderBy?: WorkItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, WorkItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the WorkItem model
   */
  readonly fields: WorkItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for WorkItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__WorkItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    agentRuns<T extends WorkItem$agentRunsArgs<ExtArgs> = {}>(args?: Subset<T, WorkItem$agentRunsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pullRequests<T extends WorkItem$pullRequestsArgs<ExtArgs> = {}>(args?: Subset<T, WorkItem$pullRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the WorkItem model
   */
  interface WorkItemFieldRefs {
    readonly id: FieldRef<"WorkItem", 'String'>
    readonly azureId: FieldRef<"WorkItem", 'Int'>
    readonly title: FieldRef<"WorkItem", 'String'>
    readonly description: FieldRef<"WorkItem", 'String'>
    readonly userQuery: FieldRef<"WorkItem", 'String'>
    readonly type: FieldRef<"WorkItem", 'String'>
    readonly status: FieldRef<"WorkItem", 'String'>
    readonly assignedTo: FieldRef<"WorkItem", 'String'>
    readonly repositoryFullName: FieldRef<"WorkItem", 'String'>
    readonly targetBranch: FieldRef<"WorkItem", 'String'>
    readonly linkedRunId: FieldRef<"WorkItem", 'String'>
    readonly linkedPRId: FieldRef<"WorkItem", 'String'>
    readonly createdAt: FieldRef<"WorkItem", 'DateTime'>
    readonly updatedAt: FieldRef<"WorkItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * WorkItem findUnique
   */
  export type WorkItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * Filter, which WorkItem to fetch.
     */
    where: WorkItemWhereUniqueInput
  }

  /**
   * WorkItem findUniqueOrThrow
   */
  export type WorkItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * Filter, which WorkItem to fetch.
     */
    where: WorkItemWhereUniqueInput
  }

  /**
   * WorkItem findFirst
   */
  export type WorkItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * Filter, which WorkItem to fetch.
     */
    where?: WorkItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkItems to fetch.
     */
    orderBy?: WorkItemOrderByWithRelationInput | WorkItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkItems.
     */
    cursor?: WorkItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkItems.
     */
    distinct?: WorkItemScalarFieldEnum | WorkItemScalarFieldEnum[]
  }

  /**
   * WorkItem findFirstOrThrow
   */
  export type WorkItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * Filter, which WorkItem to fetch.
     */
    where?: WorkItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkItems to fetch.
     */
    orderBy?: WorkItemOrderByWithRelationInput | WorkItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for WorkItems.
     */
    cursor?: WorkItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of WorkItems.
     */
    distinct?: WorkItemScalarFieldEnum | WorkItemScalarFieldEnum[]
  }

  /**
   * WorkItem findMany
   */
  export type WorkItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * Filter, which WorkItems to fetch.
     */
    where?: WorkItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of WorkItems to fetch.
     */
    orderBy?: WorkItemOrderByWithRelationInput | WorkItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing WorkItems.
     */
    cursor?: WorkItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` WorkItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` WorkItems.
     */
    skip?: number
    distinct?: WorkItemScalarFieldEnum | WorkItemScalarFieldEnum[]
  }

  /**
   * WorkItem create
   */
  export type WorkItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * The data needed to create a WorkItem.
     */
    data: XOR<WorkItemCreateInput, WorkItemUncheckedCreateInput>
  }

  /**
   * WorkItem createMany
   */
  export type WorkItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many WorkItems.
     */
    data: WorkItemCreateManyInput | WorkItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkItem createManyAndReturn
   */
  export type WorkItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * The data used to create many WorkItems.
     */
    data: WorkItemCreateManyInput | WorkItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * WorkItem update
   */
  export type WorkItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * The data needed to update a WorkItem.
     */
    data: XOR<WorkItemUpdateInput, WorkItemUncheckedUpdateInput>
    /**
     * Choose, which WorkItem to update.
     */
    where: WorkItemWhereUniqueInput
  }

  /**
   * WorkItem updateMany
   */
  export type WorkItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update WorkItems.
     */
    data: XOR<WorkItemUpdateManyMutationInput, WorkItemUncheckedUpdateManyInput>
    /**
     * Filter which WorkItems to update
     */
    where?: WorkItemWhereInput
    /**
     * Limit how many WorkItems to update.
     */
    limit?: number
  }

  /**
   * WorkItem updateManyAndReturn
   */
  export type WorkItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * The data used to update WorkItems.
     */
    data: XOR<WorkItemUpdateManyMutationInput, WorkItemUncheckedUpdateManyInput>
    /**
     * Filter which WorkItems to update
     */
    where?: WorkItemWhereInput
    /**
     * Limit how many WorkItems to update.
     */
    limit?: number
  }

  /**
   * WorkItem upsert
   */
  export type WorkItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * The filter to search for the WorkItem to update in case it exists.
     */
    where: WorkItemWhereUniqueInput
    /**
     * In case the WorkItem found by the `where` argument doesn't exist, create a new WorkItem with this data.
     */
    create: XOR<WorkItemCreateInput, WorkItemUncheckedCreateInput>
    /**
     * In case the WorkItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<WorkItemUpdateInput, WorkItemUncheckedUpdateInput>
  }

  /**
   * WorkItem delete
   */
  export type WorkItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    /**
     * Filter which WorkItem to delete.
     */
    where: WorkItemWhereUniqueInput
  }

  /**
   * WorkItem deleteMany
   */
  export type WorkItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which WorkItems to delete
     */
    where?: WorkItemWhereInput
    /**
     * Limit how many WorkItems to delete.
     */
    limit?: number
  }

  /**
   * WorkItem.agentRuns
   */
  export type WorkItem$agentRunsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    where?: AgentRunWhereInput
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    cursor?: AgentRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * WorkItem.pullRequests
   */
  export type WorkItem$pullRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    where?: PullRequestWhereInput
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    cursor?: PullRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * WorkItem without action
   */
  export type WorkItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
  }


  /**
   * Model AgentRun
   */

  export type AggregateAgentRun = {
    _count: AgentRunCountAggregateOutputType | null
    _avg: AgentRunAvgAggregateOutputType | null
    _sum: AgentRunSumAggregateOutputType | null
    _min: AgentRunMinAggregateOutputType | null
    _max: AgentRunMaxAggregateOutputType | null
  }

  export type AgentRunAvgAggregateOutputType = {
    totalPromptTokens: number | null
    totalCompletionTokens: number | null
    totalTokens: number | null
    currentIteration: number | null
    maxIterations: number | null
  }

  export type AgentRunSumAggregateOutputType = {
    totalPromptTokens: number | null
    totalCompletionTokens: number | null
    totalTokens: number | null
    currentIteration: number | null
    maxIterations: number | null
  }

  export type AgentRunMinAggregateOutputType = {
    id: string | null
    workItemId: string | null
    repositoryFullName: string | null
    userQuery: string | null
    status: string | null
    branchName: string | null
    prId: string | null
    error: string | null
    planSummary: string | null
    totalPromptTokens: number | null
    totalCompletionTokens: number | null
    totalTokens: number | null
    currentIteration: number | null
    maxIterations: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type AgentRunMaxAggregateOutputType = {
    id: string | null
    workItemId: string | null
    repositoryFullName: string | null
    userQuery: string | null
    status: string | null
    branchName: string | null
    prId: string | null
    error: string | null
    planSummary: string | null
    totalPromptTokens: number | null
    totalCompletionTokens: number | null
    totalTokens: number | null
    currentIteration: number | null
    maxIterations: number | null
    startedAt: Date | null
    completedAt: Date | null
  }

  export type AgentRunCountAggregateOutputType = {
    id: number
    workItemId: number
    repositoryFullName: number
    userQuery: number
    status: number
    branchName: number
    prId: number
    error: number
    planSummary: number
    planFiles: number
    totalPromptTokens: number
    totalCompletionTokens: number
    totalTokens: number
    currentIteration: number
    maxIterations: number
    lastChanges: number
    startedAt: number
    completedAt: number
    _all: number
  }


  export type AgentRunAvgAggregateInputType = {
    totalPromptTokens?: true
    totalCompletionTokens?: true
    totalTokens?: true
    currentIteration?: true
    maxIterations?: true
  }

  export type AgentRunSumAggregateInputType = {
    totalPromptTokens?: true
    totalCompletionTokens?: true
    totalTokens?: true
    currentIteration?: true
    maxIterations?: true
  }

  export type AgentRunMinAggregateInputType = {
    id?: true
    workItemId?: true
    repositoryFullName?: true
    userQuery?: true
    status?: true
    branchName?: true
    prId?: true
    error?: true
    planSummary?: true
    totalPromptTokens?: true
    totalCompletionTokens?: true
    totalTokens?: true
    currentIteration?: true
    maxIterations?: true
    startedAt?: true
    completedAt?: true
  }

  export type AgentRunMaxAggregateInputType = {
    id?: true
    workItemId?: true
    repositoryFullName?: true
    userQuery?: true
    status?: true
    branchName?: true
    prId?: true
    error?: true
    planSummary?: true
    totalPromptTokens?: true
    totalCompletionTokens?: true
    totalTokens?: true
    currentIteration?: true
    maxIterations?: true
    startedAt?: true
    completedAt?: true
  }

  export type AgentRunCountAggregateInputType = {
    id?: true
    workItemId?: true
    repositoryFullName?: true
    userQuery?: true
    status?: true
    branchName?: true
    prId?: true
    error?: true
    planSummary?: true
    planFiles?: true
    totalPromptTokens?: true
    totalCompletionTokens?: true
    totalTokens?: true
    currentIteration?: true
    maxIterations?: true
    lastChanges?: true
    startedAt?: true
    completedAt?: true
    _all?: true
  }

  export type AgentRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentRun to aggregate.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentRuns
    **/
    _count?: true | AgentRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgentRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgentRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentRunMaxAggregateInputType
  }

  export type GetAgentRunAggregateType<T extends AgentRunAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentRun[P]>
      : GetScalarType<T[P], AggregateAgentRun[P]>
  }




  export type AgentRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentRunWhereInput
    orderBy?: AgentRunOrderByWithAggregationInput | AgentRunOrderByWithAggregationInput[]
    by: AgentRunScalarFieldEnum[] | AgentRunScalarFieldEnum
    having?: AgentRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentRunCountAggregateInputType | true
    _avg?: AgentRunAvgAggregateInputType
    _sum?: AgentRunSumAggregateInputType
    _min?: AgentRunMinAggregateInputType
    _max?: AgentRunMaxAggregateInputType
  }

  export type AgentRunGroupByOutputType = {
    id: string
    workItemId: string | null
    repositoryFullName: string | null
    userQuery: string | null
    status: string
    branchName: string | null
    prId: string | null
    error: string | null
    planSummary: string | null
    planFiles: JsonValue | null
    totalPromptTokens: number | null
    totalCompletionTokens: number | null
    totalTokens: number | null
    currentIteration: number | null
    maxIterations: number | null
    lastChanges: JsonValue | null
    startedAt: Date
    completedAt: Date | null
    _count: AgentRunCountAggregateOutputType | null
    _avg: AgentRunAvgAggregateOutputType | null
    _sum: AgentRunSumAggregateOutputType | null
    _min: AgentRunMinAggregateOutputType | null
    _max: AgentRunMaxAggregateOutputType | null
  }

  type GetAgentRunGroupByPayload<T extends AgentRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentRunGroupByOutputType[P]>
            : GetScalarType<T[P], AgentRunGroupByOutputType[P]>
        }
      >
    >


  export type AgentRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workItemId?: boolean
    repositoryFullName?: boolean
    userQuery?: boolean
    status?: boolean
    branchName?: boolean
    prId?: boolean
    error?: boolean
    planSummary?: boolean
    planFiles?: boolean
    totalPromptTokens?: boolean
    totalCompletionTokens?: boolean
    totalTokens?: boolean
    currentIteration?: boolean
    maxIterations?: boolean
    lastChanges?: boolean
    startedAt?: boolean
    completedAt?: boolean
    workItem?: boolean | AgentRun$workItemArgs<ExtArgs>
    steps?: boolean | AgentRun$stepsArgs<ExtArgs>
    pullRequests?: boolean | AgentRun$pullRequestsArgs<ExtArgs>
    _count?: boolean | AgentRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workItemId?: boolean
    repositoryFullName?: boolean
    userQuery?: boolean
    status?: boolean
    branchName?: boolean
    prId?: boolean
    error?: boolean
    planSummary?: boolean
    planFiles?: boolean
    totalPromptTokens?: boolean
    totalCompletionTokens?: boolean
    totalTokens?: boolean
    currentIteration?: boolean
    maxIterations?: boolean
    lastChanges?: boolean
    startedAt?: boolean
    completedAt?: boolean
    workItem?: boolean | AgentRun$workItemArgs<ExtArgs>
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    workItemId?: boolean
    repositoryFullName?: boolean
    userQuery?: boolean
    status?: boolean
    branchName?: boolean
    prId?: boolean
    error?: boolean
    planSummary?: boolean
    planFiles?: boolean
    totalPromptTokens?: boolean
    totalCompletionTokens?: boolean
    totalTokens?: boolean
    currentIteration?: boolean
    maxIterations?: boolean
    lastChanges?: boolean
    startedAt?: boolean
    completedAt?: boolean
    workItem?: boolean | AgentRun$workItemArgs<ExtArgs>
  }, ExtArgs["result"]["agentRun"]>

  export type AgentRunSelectScalar = {
    id?: boolean
    workItemId?: boolean
    repositoryFullName?: boolean
    userQuery?: boolean
    status?: boolean
    branchName?: boolean
    prId?: boolean
    error?: boolean
    planSummary?: boolean
    planFiles?: boolean
    totalPromptTokens?: boolean
    totalCompletionTokens?: boolean
    totalTokens?: boolean
    currentIteration?: boolean
    maxIterations?: boolean
    lastChanges?: boolean
    startedAt?: boolean
    completedAt?: boolean
  }

  export type AgentRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "workItemId" | "repositoryFullName" | "userQuery" | "status" | "branchName" | "prId" | "error" | "planSummary" | "planFiles" | "totalPromptTokens" | "totalCompletionTokens" | "totalTokens" | "currentIteration" | "maxIterations" | "lastChanges" | "startedAt" | "completedAt", ExtArgs["result"]["agentRun"]>
  export type AgentRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workItem?: boolean | AgentRun$workItemArgs<ExtArgs>
    steps?: boolean | AgentRun$stepsArgs<ExtArgs>
    pullRequests?: boolean | AgentRun$pullRequestsArgs<ExtArgs>
    _count?: boolean | AgentRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AgentRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workItem?: boolean | AgentRun$workItemArgs<ExtArgs>
  }
  export type AgentRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workItem?: boolean | AgentRun$workItemArgs<ExtArgs>
  }

  export type $AgentRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentRun"
    objects: {
      workItem: Prisma.$WorkItemPayload<ExtArgs> | null
      steps: Prisma.$AgentStepPayload<ExtArgs>[]
      pullRequests: Prisma.$PullRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      workItemId: string | null
      repositoryFullName: string | null
      userQuery: string | null
      status: string
      branchName: string | null
      prId: string | null
      error: string | null
      planSummary: string | null
      planFiles: Prisma.JsonValue | null
      totalPromptTokens: number | null
      totalCompletionTokens: number | null
      totalTokens: number | null
      currentIteration: number | null
      maxIterations: number | null
      lastChanges: Prisma.JsonValue | null
      startedAt: Date
      completedAt: Date | null
    }, ExtArgs["result"]["agentRun"]>
    composites: {}
  }

  type AgentRunGetPayload<S extends boolean | null | undefined | AgentRunDefaultArgs> = $Result.GetResult<Prisma.$AgentRunPayload, S>

  type AgentRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentRunCountAggregateInputType | true
    }

  export interface AgentRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentRun'], meta: { name: 'AgentRun' } }
    /**
     * Find zero or one AgentRun that matches the filter.
     * @param {AgentRunFindUniqueArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentRunFindUniqueArgs>(args: SelectSubset<T, AgentRunFindUniqueArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentRunFindUniqueOrThrowArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentRunFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindFirstArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentRunFindFirstArgs>(args?: SelectSubset<T, AgentRunFindFirstArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindFirstOrThrowArgs} args - Arguments to find a AgentRun
     * @example
     * // Get one AgentRun
     * const agentRun = await prisma.agentRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentRunFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentRuns
     * const agentRuns = await prisma.agentRun.findMany()
     * 
     * // Get first 10 AgentRuns
     * const agentRuns = await prisma.agentRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentRunFindManyArgs>(args?: SelectSubset<T, AgentRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentRun.
     * @param {AgentRunCreateArgs} args - Arguments to create a AgentRun.
     * @example
     * // Create one AgentRun
     * const AgentRun = await prisma.agentRun.create({
     *   data: {
     *     // ... data to create a AgentRun
     *   }
     * })
     * 
     */
    create<T extends AgentRunCreateArgs>(args: SelectSubset<T, AgentRunCreateArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentRuns.
     * @param {AgentRunCreateManyArgs} args - Arguments to create many AgentRuns.
     * @example
     * // Create many AgentRuns
     * const agentRun = await prisma.agentRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentRunCreateManyArgs>(args?: SelectSubset<T, AgentRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentRuns and returns the data saved in the database.
     * @param {AgentRunCreateManyAndReturnArgs} args - Arguments to create many AgentRuns.
     * @example
     * // Create many AgentRuns
     * const agentRun = await prisma.agentRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentRuns and only return the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentRunCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentRun.
     * @param {AgentRunDeleteArgs} args - Arguments to delete one AgentRun.
     * @example
     * // Delete one AgentRun
     * const AgentRun = await prisma.agentRun.delete({
     *   where: {
     *     // ... filter to delete one AgentRun
     *   }
     * })
     * 
     */
    delete<T extends AgentRunDeleteArgs>(args: SelectSubset<T, AgentRunDeleteArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentRun.
     * @param {AgentRunUpdateArgs} args - Arguments to update one AgentRun.
     * @example
     * // Update one AgentRun
     * const agentRun = await prisma.agentRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentRunUpdateArgs>(args: SelectSubset<T, AgentRunUpdateArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentRuns.
     * @param {AgentRunDeleteManyArgs} args - Arguments to filter AgentRuns to delete.
     * @example
     * // Delete a few AgentRuns
     * const { count } = await prisma.agentRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentRunDeleteManyArgs>(args?: SelectSubset<T, AgentRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentRuns
     * const agentRun = await prisma.agentRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentRunUpdateManyArgs>(args: SelectSubset<T, AgentRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentRuns and returns the data updated in the database.
     * @param {AgentRunUpdateManyAndReturnArgs} args - Arguments to update many AgentRuns.
     * @example
     * // Update many AgentRuns
     * const agentRun = await prisma.agentRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentRuns and only return the `id`
     * const agentRunWithIdOnly = await prisma.agentRun.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentRunUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentRun.
     * @param {AgentRunUpsertArgs} args - Arguments to update or create a AgentRun.
     * @example
     * // Update or create a AgentRun
     * const agentRun = await prisma.agentRun.upsert({
     *   create: {
     *     // ... data to create a AgentRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentRun we want to update
     *   }
     * })
     */
    upsert<T extends AgentRunUpsertArgs>(args: SelectSubset<T, AgentRunUpsertArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunCountArgs} args - Arguments to filter AgentRuns to count.
     * @example
     * // Count the number of AgentRuns
     * const count = await prisma.agentRun.count({
     *   where: {
     *     // ... the filter for the AgentRuns we want to count
     *   }
     * })
    **/
    count<T extends AgentRunCountArgs>(
      args?: Subset<T, AgentRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentRunAggregateArgs>(args: Subset<T, AgentRunAggregateArgs>): Prisma.PrismaPromise<GetAgentRunAggregateType<T>>

    /**
     * Group by AgentRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentRunGroupByArgs['orderBy'] }
        : { orderBy?: AgentRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentRun model
   */
  readonly fields: AgentRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workItem<T extends AgentRun$workItemArgs<ExtArgs> = {}>(args?: Subset<T, AgentRun$workItemArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    steps<T extends AgentRun$stepsArgs<ExtArgs> = {}>(args?: Subset<T, AgentRun$stepsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    pullRequests<T extends AgentRun$pullRequestsArgs<ExtArgs> = {}>(args?: Subset<T, AgentRun$pullRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentRun model
   */
  interface AgentRunFieldRefs {
    readonly id: FieldRef<"AgentRun", 'String'>
    readonly workItemId: FieldRef<"AgentRun", 'String'>
    readonly repositoryFullName: FieldRef<"AgentRun", 'String'>
    readonly userQuery: FieldRef<"AgentRun", 'String'>
    readonly status: FieldRef<"AgentRun", 'String'>
    readonly branchName: FieldRef<"AgentRun", 'String'>
    readonly prId: FieldRef<"AgentRun", 'String'>
    readonly error: FieldRef<"AgentRun", 'String'>
    readonly planSummary: FieldRef<"AgentRun", 'String'>
    readonly planFiles: FieldRef<"AgentRun", 'Json'>
    readonly totalPromptTokens: FieldRef<"AgentRun", 'Int'>
    readonly totalCompletionTokens: FieldRef<"AgentRun", 'Int'>
    readonly totalTokens: FieldRef<"AgentRun", 'Int'>
    readonly currentIteration: FieldRef<"AgentRun", 'Int'>
    readonly maxIterations: FieldRef<"AgentRun", 'Int'>
    readonly lastChanges: FieldRef<"AgentRun", 'Json'>
    readonly startedAt: FieldRef<"AgentRun", 'DateTime'>
    readonly completedAt: FieldRef<"AgentRun", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentRun findUnique
   */
  export type AgentRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun findUniqueOrThrow
   */
  export type AgentRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun findFirst
   */
  export type AgentRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun findFirstOrThrow
   */
  export type AgentRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRun to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentRuns.
     */
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun findMany
   */
  export type AgentRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter, which AgentRuns to fetch.
     */
    where?: AgentRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentRuns to fetch.
     */
    orderBy?: AgentRunOrderByWithRelationInput | AgentRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentRuns.
     */
    cursor?: AgentRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentRuns.
     */
    skip?: number
    distinct?: AgentRunScalarFieldEnum | AgentRunScalarFieldEnum[]
  }

  /**
   * AgentRun create
   */
  export type AgentRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentRun.
     */
    data?: XOR<AgentRunCreateInput, AgentRunUncheckedCreateInput>
  }

  /**
   * AgentRun createMany
   */
  export type AgentRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentRuns.
     */
    data: AgentRunCreateManyInput | AgentRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentRun createManyAndReturn
   */
  export type AgentRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The data used to create many AgentRuns.
     */
    data: AgentRunCreateManyInput | AgentRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentRun update
   */
  export type AgentRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentRun.
     */
    data: XOR<AgentRunUpdateInput, AgentRunUncheckedUpdateInput>
    /**
     * Choose, which AgentRun to update.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun updateMany
   */
  export type AgentRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentRuns.
     */
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyInput>
    /**
     * Filter which AgentRuns to update
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to update.
     */
    limit?: number
  }

  /**
   * AgentRun updateManyAndReturn
   */
  export type AgentRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * The data used to update AgentRuns.
     */
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyInput>
    /**
     * Filter which AgentRuns to update
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentRun upsert
   */
  export type AgentRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentRun to update in case it exists.
     */
    where: AgentRunWhereUniqueInput
    /**
     * In case the AgentRun found by the `where` argument doesn't exist, create a new AgentRun with this data.
     */
    create: XOR<AgentRunCreateInput, AgentRunUncheckedCreateInput>
    /**
     * In case the AgentRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentRunUpdateInput, AgentRunUncheckedUpdateInput>
  }

  /**
   * AgentRun delete
   */
  export type AgentRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
    /**
     * Filter which AgentRun to delete.
     */
    where: AgentRunWhereUniqueInput
  }

  /**
   * AgentRun deleteMany
   */
  export type AgentRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentRuns to delete
     */
    where?: AgentRunWhereInput
    /**
     * Limit how many AgentRuns to delete.
     */
    limit?: number
  }

  /**
   * AgentRun.workItem
   */
  export type AgentRun$workItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    where?: WorkItemWhereInput
  }

  /**
   * AgentRun.steps
   */
  export type AgentRun$stepsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    where?: AgentStepWhereInput
    orderBy?: AgentStepOrderByWithRelationInput | AgentStepOrderByWithRelationInput[]
    cursor?: AgentStepWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AgentStepScalarFieldEnum | AgentStepScalarFieldEnum[]
  }

  /**
   * AgentRun.pullRequests
   */
  export type AgentRun$pullRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    where?: PullRequestWhereInput
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    cursor?: PullRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * AgentRun without action
   */
  export type AgentRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentRun
     */
    select?: AgentRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentRun
     */
    omit?: AgentRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentRunInclude<ExtArgs> | null
  }


  /**
   * Model AgentStep
   */

  export type AggregateAgentStep = {
    _count: AgentStepCountAggregateOutputType | null
    _avg: AgentStepAvgAggregateOutputType | null
    _sum: AgentStepSumAggregateOutputType | null
    _min: AgentStepMinAggregateOutputType | null
    _max: AgentStepMaxAggregateOutputType | null
  }

  export type AgentStepAvgAggregateOutputType = {
    order: number | null
    durationMs: number | null
  }

  export type AgentStepSumAggregateOutputType = {
    order: number | null
    durationMs: number | null
  }

  export type AgentStepMinAggregateOutputType = {
    id: string | null
    runId: string | null
    type: string | null
    status: string | null
    label: string | null
    detail: string | null
    order: number | null
    durationMs: number | null
    timestamp: Date | null
  }

  export type AgentStepMaxAggregateOutputType = {
    id: string | null
    runId: string | null
    type: string | null
    status: string | null
    label: string | null
    detail: string | null
    order: number | null
    durationMs: number | null
    timestamp: Date | null
  }

  export type AgentStepCountAggregateOutputType = {
    id: number
    runId: number
    type: number
    status: number
    label: number
    detail: number
    order: number
    durationMs: number
    timestamp: number
    _all: number
  }


  export type AgentStepAvgAggregateInputType = {
    order?: true
    durationMs?: true
  }

  export type AgentStepSumAggregateInputType = {
    order?: true
    durationMs?: true
  }

  export type AgentStepMinAggregateInputType = {
    id?: true
    runId?: true
    type?: true
    status?: true
    label?: true
    detail?: true
    order?: true
    durationMs?: true
    timestamp?: true
  }

  export type AgentStepMaxAggregateInputType = {
    id?: true
    runId?: true
    type?: true
    status?: true
    label?: true
    detail?: true
    order?: true
    durationMs?: true
    timestamp?: true
  }

  export type AgentStepCountAggregateInputType = {
    id?: true
    runId?: true
    type?: true
    status?: true
    label?: true
    detail?: true
    order?: true
    durationMs?: true
    timestamp?: true
    _all?: true
  }

  export type AgentStepAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentStep to aggregate.
     */
    where?: AgentStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentSteps to fetch.
     */
    orderBy?: AgentStepOrderByWithRelationInput | AgentStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AgentStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AgentSteps
    **/
    _count?: true | AgentStepCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AgentStepAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AgentStepSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AgentStepMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AgentStepMaxAggregateInputType
  }

  export type GetAgentStepAggregateType<T extends AgentStepAggregateArgs> = {
        [P in keyof T & keyof AggregateAgentStep]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAgentStep[P]>
      : GetScalarType<T[P], AggregateAgentStep[P]>
  }




  export type AgentStepGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AgentStepWhereInput
    orderBy?: AgentStepOrderByWithAggregationInput | AgentStepOrderByWithAggregationInput[]
    by: AgentStepScalarFieldEnum[] | AgentStepScalarFieldEnum
    having?: AgentStepScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AgentStepCountAggregateInputType | true
    _avg?: AgentStepAvgAggregateInputType
    _sum?: AgentStepSumAggregateInputType
    _min?: AgentStepMinAggregateInputType
    _max?: AgentStepMaxAggregateInputType
  }

  export type AgentStepGroupByOutputType = {
    id: string
    runId: string
    type: string
    status: string
    label: string
    detail: string | null
    order: number
    durationMs: number | null
    timestamp: Date
    _count: AgentStepCountAggregateOutputType | null
    _avg: AgentStepAvgAggregateOutputType | null
    _sum: AgentStepSumAggregateOutputType | null
    _min: AgentStepMinAggregateOutputType | null
    _max: AgentStepMaxAggregateOutputType | null
  }

  type GetAgentStepGroupByPayload<T extends AgentStepGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AgentStepGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AgentStepGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AgentStepGroupByOutputType[P]>
            : GetScalarType<T[P], AgentStepGroupByOutputType[P]>
        }
      >
    >


  export type AgentStepSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    type?: boolean
    status?: boolean
    label?: boolean
    detail?: boolean
    order?: boolean
    durationMs?: boolean
    timestamp?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentStep"]>

  export type AgentStepSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    type?: boolean
    status?: boolean
    label?: boolean
    detail?: boolean
    order?: boolean
    durationMs?: boolean
    timestamp?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentStep"]>

  export type AgentStepSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    type?: boolean
    status?: boolean
    label?: boolean
    detail?: boolean
    order?: boolean
    durationMs?: boolean
    timestamp?: boolean
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["agentStep"]>

  export type AgentStepSelectScalar = {
    id?: boolean
    runId?: boolean
    type?: boolean
    status?: boolean
    label?: boolean
    detail?: boolean
    order?: boolean
    durationMs?: boolean
    timestamp?: boolean
  }

  export type AgentStepOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "runId" | "type" | "status" | "label" | "detail" | "order" | "durationMs" | "timestamp", ExtArgs["result"]["agentStep"]>
  export type AgentStepInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type AgentStepIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type AgentStepIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }

  export type $AgentStepPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AgentStep"
    objects: {
      run: Prisma.$AgentRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      runId: string
      type: string
      status: string
      label: string
      detail: string | null
      order: number
      durationMs: number | null
      timestamp: Date
    }, ExtArgs["result"]["agentStep"]>
    composites: {}
  }

  type AgentStepGetPayload<S extends boolean | null | undefined | AgentStepDefaultArgs> = $Result.GetResult<Prisma.$AgentStepPayload, S>

  type AgentStepCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AgentStepFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AgentStepCountAggregateInputType | true
    }

  export interface AgentStepDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AgentStep'], meta: { name: 'AgentStep' } }
    /**
     * Find zero or one AgentStep that matches the filter.
     * @param {AgentStepFindUniqueArgs} args - Arguments to find a AgentStep
     * @example
     * // Get one AgentStep
     * const agentStep = await prisma.agentStep.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AgentStepFindUniqueArgs>(args: SelectSubset<T, AgentStepFindUniqueArgs<ExtArgs>>): Prisma__AgentStepClient<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AgentStep that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AgentStepFindUniqueOrThrowArgs} args - Arguments to find a AgentStep
     * @example
     * // Get one AgentStep
     * const agentStep = await prisma.agentStep.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AgentStepFindUniqueOrThrowArgs>(args: SelectSubset<T, AgentStepFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AgentStepClient<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentStep that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentStepFindFirstArgs} args - Arguments to find a AgentStep
     * @example
     * // Get one AgentStep
     * const agentStep = await prisma.agentStep.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AgentStepFindFirstArgs>(args?: SelectSubset<T, AgentStepFindFirstArgs<ExtArgs>>): Prisma__AgentStepClient<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AgentStep that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentStepFindFirstOrThrowArgs} args - Arguments to find a AgentStep
     * @example
     * // Get one AgentStep
     * const agentStep = await prisma.agentStep.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AgentStepFindFirstOrThrowArgs>(args?: SelectSubset<T, AgentStepFindFirstOrThrowArgs<ExtArgs>>): Prisma__AgentStepClient<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AgentSteps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentStepFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AgentSteps
     * const agentSteps = await prisma.agentStep.findMany()
     * 
     * // Get first 10 AgentSteps
     * const agentSteps = await prisma.agentStep.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const agentStepWithIdOnly = await prisma.agentStep.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AgentStepFindManyArgs>(args?: SelectSubset<T, AgentStepFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AgentStep.
     * @param {AgentStepCreateArgs} args - Arguments to create a AgentStep.
     * @example
     * // Create one AgentStep
     * const AgentStep = await prisma.agentStep.create({
     *   data: {
     *     // ... data to create a AgentStep
     *   }
     * })
     * 
     */
    create<T extends AgentStepCreateArgs>(args: SelectSubset<T, AgentStepCreateArgs<ExtArgs>>): Prisma__AgentStepClient<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AgentSteps.
     * @param {AgentStepCreateManyArgs} args - Arguments to create many AgentSteps.
     * @example
     * // Create many AgentSteps
     * const agentStep = await prisma.agentStep.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AgentStepCreateManyArgs>(args?: SelectSubset<T, AgentStepCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AgentSteps and returns the data saved in the database.
     * @param {AgentStepCreateManyAndReturnArgs} args - Arguments to create many AgentSteps.
     * @example
     * // Create many AgentSteps
     * const agentStep = await prisma.agentStep.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AgentSteps and only return the `id`
     * const agentStepWithIdOnly = await prisma.agentStep.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AgentStepCreateManyAndReturnArgs>(args?: SelectSubset<T, AgentStepCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AgentStep.
     * @param {AgentStepDeleteArgs} args - Arguments to delete one AgentStep.
     * @example
     * // Delete one AgentStep
     * const AgentStep = await prisma.agentStep.delete({
     *   where: {
     *     // ... filter to delete one AgentStep
     *   }
     * })
     * 
     */
    delete<T extends AgentStepDeleteArgs>(args: SelectSubset<T, AgentStepDeleteArgs<ExtArgs>>): Prisma__AgentStepClient<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AgentStep.
     * @param {AgentStepUpdateArgs} args - Arguments to update one AgentStep.
     * @example
     * // Update one AgentStep
     * const agentStep = await prisma.agentStep.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AgentStepUpdateArgs>(args: SelectSubset<T, AgentStepUpdateArgs<ExtArgs>>): Prisma__AgentStepClient<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AgentSteps.
     * @param {AgentStepDeleteManyArgs} args - Arguments to filter AgentSteps to delete.
     * @example
     * // Delete a few AgentSteps
     * const { count } = await prisma.agentStep.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AgentStepDeleteManyArgs>(args?: SelectSubset<T, AgentStepDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentStepUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AgentSteps
     * const agentStep = await prisma.agentStep.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AgentStepUpdateManyArgs>(args: SelectSubset<T, AgentStepUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AgentSteps and returns the data updated in the database.
     * @param {AgentStepUpdateManyAndReturnArgs} args - Arguments to update many AgentSteps.
     * @example
     * // Update many AgentSteps
     * const agentStep = await prisma.agentStep.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AgentSteps and only return the `id`
     * const agentStepWithIdOnly = await prisma.agentStep.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AgentStepUpdateManyAndReturnArgs>(args: SelectSubset<T, AgentStepUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AgentStep.
     * @param {AgentStepUpsertArgs} args - Arguments to update or create a AgentStep.
     * @example
     * // Update or create a AgentStep
     * const agentStep = await prisma.agentStep.upsert({
     *   create: {
     *     // ... data to create a AgentStep
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AgentStep we want to update
     *   }
     * })
     */
    upsert<T extends AgentStepUpsertArgs>(args: SelectSubset<T, AgentStepUpsertArgs<ExtArgs>>): Prisma__AgentStepClient<$Result.GetResult<Prisma.$AgentStepPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AgentSteps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentStepCountArgs} args - Arguments to filter AgentSteps to count.
     * @example
     * // Count the number of AgentSteps
     * const count = await prisma.agentStep.count({
     *   where: {
     *     // ... the filter for the AgentSteps we want to count
     *   }
     * })
    **/
    count<T extends AgentStepCountArgs>(
      args?: Subset<T, AgentStepCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AgentStepCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AgentStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentStepAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AgentStepAggregateArgs>(args: Subset<T, AgentStepAggregateArgs>): Prisma.PrismaPromise<GetAgentStepAggregateType<T>>

    /**
     * Group by AgentStep.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AgentStepGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AgentStepGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AgentStepGroupByArgs['orderBy'] }
        : { orderBy?: AgentStepGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AgentStepGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAgentStepGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AgentStep model
   */
  readonly fields: AgentStepFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AgentStep.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AgentStepClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    run<T extends AgentRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentRunDefaultArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AgentStep model
   */
  interface AgentStepFieldRefs {
    readonly id: FieldRef<"AgentStep", 'String'>
    readonly runId: FieldRef<"AgentStep", 'String'>
    readonly type: FieldRef<"AgentStep", 'String'>
    readonly status: FieldRef<"AgentStep", 'String'>
    readonly label: FieldRef<"AgentStep", 'String'>
    readonly detail: FieldRef<"AgentStep", 'String'>
    readonly order: FieldRef<"AgentStep", 'Int'>
    readonly durationMs: FieldRef<"AgentStep", 'Int'>
    readonly timestamp: FieldRef<"AgentStep", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AgentStep findUnique
   */
  export type AgentStepFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * Filter, which AgentStep to fetch.
     */
    where: AgentStepWhereUniqueInput
  }

  /**
   * AgentStep findUniqueOrThrow
   */
  export type AgentStepFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * Filter, which AgentStep to fetch.
     */
    where: AgentStepWhereUniqueInput
  }

  /**
   * AgentStep findFirst
   */
  export type AgentStepFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * Filter, which AgentStep to fetch.
     */
    where?: AgentStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentSteps to fetch.
     */
    orderBy?: AgentStepOrderByWithRelationInput | AgentStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentSteps.
     */
    cursor?: AgentStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentSteps.
     */
    distinct?: AgentStepScalarFieldEnum | AgentStepScalarFieldEnum[]
  }

  /**
   * AgentStep findFirstOrThrow
   */
  export type AgentStepFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * Filter, which AgentStep to fetch.
     */
    where?: AgentStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentSteps to fetch.
     */
    orderBy?: AgentStepOrderByWithRelationInput | AgentStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AgentSteps.
     */
    cursor?: AgentStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentSteps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AgentSteps.
     */
    distinct?: AgentStepScalarFieldEnum | AgentStepScalarFieldEnum[]
  }

  /**
   * AgentStep findMany
   */
  export type AgentStepFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * Filter, which AgentSteps to fetch.
     */
    where?: AgentStepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AgentSteps to fetch.
     */
    orderBy?: AgentStepOrderByWithRelationInput | AgentStepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AgentSteps.
     */
    cursor?: AgentStepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AgentSteps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AgentSteps.
     */
    skip?: number
    distinct?: AgentStepScalarFieldEnum | AgentStepScalarFieldEnum[]
  }

  /**
   * AgentStep create
   */
  export type AgentStepCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * The data needed to create a AgentStep.
     */
    data: XOR<AgentStepCreateInput, AgentStepUncheckedCreateInput>
  }

  /**
   * AgentStep createMany
   */
  export type AgentStepCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AgentSteps.
     */
    data: AgentStepCreateManyInput | AgentStepCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AgentStep createManyAndReturn
   */
  export type AgentStepCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * The data used to create many AgentSteps.
     */
    data: AgentStepCreateManyInput | AgentStepCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentStep update
   */
  export type AgentStepUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * The data needed to update a AgentStep.
     */
    data: XOR<AgentStepUpdateInput, AgentStepUncheckedUpdateInput>
    /**
     * Choose, which AgentStep to update.
     */
    where: AgentStepWhereUniqueInput
  }

  /**
   * AgentStep updateMany
   */
  export type AgentStepUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AgentSteps.
     */
    data: XOR<AgentStepUpdateManyMutationInput, AgentStepUncheckedUpdateManyInput>
    /**
     * Filter which AgentSteps to update
     */
    where?: AgentStepWhereInput
    /**
     * Limit how many AgentSteps to update.
     */
    limit?: number
  }

  /**
   * AgentStep updateManyAndReturn
   */
  export type AgentStepUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * The data used to update AgentSteps.
     */
    data: XOR<AgentStepUpdateManyMutationInput, AgentStepUncheckedUpdateManyInput>
    /**
     * Filter which AgentSteps to update
     */
    where?: AgentStepWhereInput
    /**
     * Limit how many AgentSteps to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AgentStep upsert
   */
  export type AgentStepUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * The filter to search for the AgentStep to update in case it exists.
     */
    where: AgentStepWhereUniqueInput
    /**
     * In case the AgentStep found by the `where` argument doesn't exist, create a new AgentStep with this data.
     */
    create: XOR<AgentStepCreateInput, AgentStepUncheckedCreateInput>
    /**
     * In case the AgentStep was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AgentStepUpdateInput, AgentStepUncheckedUpdateInput>
  }

  /**
   * AgentStep delete
   */
  export type AgentStepDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
    /**
     * Filter which AgentStep to delete.
     */
    where: AgentStepWhereUniqueInput
  }

  /**
   * AgentStep deleteMany
   */
  export type AgentStepDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AgentSteps to delete
     */
    where?: AgentStepWhereInput
    /**
     * Limit how many AgentSteps to delete.
     */
    limit?: number
  }

  /**
   * AgentStep without action
   */
  export type AgentStepDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AgentStep
     */
    select?: AgentStepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AgentStep
     */
    omit?: AgentStepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AgentStepInclude<ExtArgs> | null
  }


  /**
   * Model PullRequest
   */

  export type AggregatePullRequest = {
    _count: PullRequestCountAggregateOutputType | null
    _avg: PullRequestAvgAggregateOutputType | null
    _sum: PullRequestSumAggregateOutputType | null
    _min: PullRequestMinAggregateOutputType | null
    _max: PullRequestMaxAggregateOutputType | null
  }

  export type PullRequestAvgAggregateOutputType = {
    prNumber: number | null
    azurePRId: number | null
  }

  export type PullRequestSumAggregateOutputType = {
    prNumber: number | null
    azurePRId: number | null
  }

  export type PullRequestMinAggregateOutputType = {
    id: string | null
    prNumber: number | null
    azurePRId: number | null
    title: string | null
    sourceBranch: string | null
    targetBranch: string | null
    status: string | null
    reviewerAlias: string | null
    rejectionComment: string | null
    workItemId: string | null
    runId: string | null
    url: string | null
    repositoryFullName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PullRequestMaxAggregateOutputType = {
    id: string | null
    prNumber: number | null
    azurePRId: number | null
    title: string | null
    sourceBranch: string | null
    targetBranch: string | null
    status: string | null
    reviewerAlias: string | null
    rejectionComment: string | null
    workItemId: string | null
    runId: string | null
    url: string | null
    repositoryFullName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PullRequestCountAggregateOutputType = {
    id: number
    prNumber: number
    azurePRId: number
    title: number
    sourceBranch: number
    targetBranch: number
    status: number
    reviewerAlias: number
    rejectionComment: number
    workItemId: number
    runId: number
    url: number
    repositoryFullName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PullRequestAvgAggregateInputType = {
    prNumber?: true
    azurePRId?: true
  }

  export type PullRequestSumAggregateInputType = {
    prNumber?: true
    azurePRId?: true
  }

  export type PullRequestMinAggregateInputType = {
    id?: true
    prNumber?: true
    azurePRId?: true
    title?: true
    sourceBranch?: true
    targetBranch?: true
    status?: true
    reviewerAlias?: true
    rejectionComment?: true
    workItemId?: true
    runId?: true
    url?: true
    repositoryFullName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PullRequestMaxAggregateInputType = {
    id?: true
    prNumber?: true
    azurePRId?: true
    title?: true
    sourceBranch?: true
    targetBranch?: true
    status?: true
    reviewerAlias?: true
    rejectionComment?: true
    workItemId?: true
    runId?: true
    url?: true
    repositoryFullName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PullRequestCountAggregateInputType = {
    id?: true
    prNumber?: true
    azurePRId?: true
    title?: true
    sourceBranch?: true
    targetBranch?: true
    status?: true
    reviewerAlias?: true
    rejectionComment?: true
    workItemId?: true
    runId?: true
    url?: true
    repositoryFullName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PullRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PullRequest to aggregate.
     */
    where?: PullRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PullRequests to fetch.
     */
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PullRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PullRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PullRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PullRequests
    **/
    _count?: true | PullRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PullRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PullRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PullRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PullRequestMaxAggregateInputType
  }

  export type GetPullRequestAggregateType<T extends PullRequestAggregateArgs> = {
        [P in keyof T & keyof AggregatePullRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePullRequest[P]>
      : GetScalarType<T[P], AggregatePullRequest[P]>
  }




  export type PullRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PullRequestWhereInput
    orderBy?: PullRequestOrderByWithAggregationInput | PullRequestOrderByWithAggregationInput[]
    by: PullRequestScalarFieldEnum[] | PullRequestScalarFieldEnum
    having?: PullRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PullRequestCountAggregateInputType | true
    _avg?: PullRequestAvgAggregateInputType
    _sum?: PullRequestSumAggregateInputType
    _min?: PullRequestMinAggregateInputType
    _max?: PullRequestMaxAggregateInputType
  }

  export type PullRequestGroupByOutputType = {
    id: string
    prNumber: number | null
    azurePRId: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status: string
    reviewerAlias: string | null
    rejectionComment: string | null
    workItemId: string | null
    runId: string
    url: string
    repositoryFullName: string | null
    createdAt: Date
    updatedAt: Date
    _count: PullRequestCountAggregateOutputType | null
    _avg: PullRequestAvgAggregateOutputType | null
    _sum: PullRequestSumAggregateOutputType | null
    _min: PullRequestMinAggregateOutputType | null
    _max: PullRequestMaxAggregateOutputType | null
  }

  type GetPullRequestGroupByPayload<T extends PullRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PullRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PullRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PullRequestGroupByOutputType[P]>
            : GetScalarType<T[P], PullRequestGroupByOutputType[P]>
        }
      >
    >


  export type PullRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prNumber?: boolean
    azurePRId?: boolean
    title?: boolean
    sourceBranch?: boolean
    targetBranch?: boolean
    status?: boolean
    reviewerAlias?: boolean
    rejectionComment?: boolean
    workItemId?: boolean
    runId?: boolean
    url?: boolean
    repositoryFullName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workItem?: boolean | PullRequest$workItemArgs<ExtArgs>
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pullRequest"]>

  export type PullRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prNumber?: boolean
    azurePRId?: boolean
    title?: boolean
    sourceBranch?: boolean
    targetBranch?: boolean
    status?: boolean
    reviewerAlias?: boolean
    rejectionComment?: boolean
    workItemId?: boolean
    runId?: boolean
    url?: boolean
    repositoryFullName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workItem?: boolean | PullRequest$workItemArgs<ExtArgs>
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pullRequest"]>

  export type PullRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    prNumber?: boolean
    azurePRId?: boolean
    title?: boolean
    sourceBranch?: boolean
    targetBranch?: boolean
    status?: boolean
    reviewerAlias?: boolean
    rejectionComment?: boolean
    workItemId?: boolean
    runId?: boolean
    url?: boolean
    repositoryFullName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    workItem?: boolean | PullRequest$workItemArgs<ExtArgs>
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pullRequest"]>

  export type PullRequestSelectScalar = {
    id?: boolean
    prNumber?: boolean
    azurePRId?: boolean
    title?: boolean
    sourceBranch?: boolean
    targetBranch?: boolean
    status?: boolean
    reviewerAlias?: boolean
    rejectionComment?: boolean
    workItemId?: boolean
    runId?: boolean
    url?: boolean
    repositoryFullName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PullRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "prNumber" | "azurePRId" | "title" | "sourceBranch" | "targetBranch" | "status" | "reviewerAlias" | "rejectionComment" | "workItemId" | "runId" | "url" | "repositoryFullName" | "createdAt" | "updatedAt", ExtArgs["result"]["pullRequest"]>
  export type PullRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workItem?: boolean | PullRequest$workItemArgs<ExtArgs>
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type PullRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workItem?: boolean | PullRequest$workItemArgs<ExtArgs>
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }
  export type PullRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    workItem?: boolean | PullRequest$workItemArgs<ExtArgs>
    run?: boolean | AgentRunDefaultArgs<ExtArgs>
  }

  export type $PullRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PullRequest"
    objects: {
      workItem: Prisma.$WorkItemPayload<ExtArgs> | null
      run: Prisma.$AgentRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      prNumber: number | null
      azurePRId: number | null
      title: string
      sourceBranch: string
      targetBranch: string
      status: string
      reviewerAlias: string | null
      rejectionComment: string | null
      workItemId: string | null
      runId: string
      url: string
      repositoryFullName: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["pullRequest"]>
    composites: {}
  }

  type PullRequestGetPayload<S extends boolean | null | undefined | PullRequestDefaultArgs> = $Result.GetResult<Prisma.$PullRequestPayload, S>

  type PullRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PullRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PullRequestCountAggregateInputType | true
    }

  export interface PullRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PullRequest'], meta: { name: 'PullRequest' } }
    /**
     * Find zero or one PullRequest that matches the filter.
     * @param {PullRequestFindUniqueArgs} args - Arguments to find a PullRequest
     * @example
     * // Get one PullRequest
     * const pullRequest = await prisma.pullRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PullRequestFindUniqueArgs>(args: SelectSubset<T, PullRequestFindUniqueArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PullRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PullRequestFindUniqueOrThrowArgs} args - Arguments to find a PullRequest
     * @example
     * // Get one PullRequest
     * const pullRequest = await prisma.pullRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PullRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, PullRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PullRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestFindFirstArgs} args - Arguments to find a PullRequest
     * @example
     * // Get one PullRequest
     * const pullRequest = await prisma.pullRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PullRequestFindFirstArgs>(args?: SelectSubset<T, PullRequestFindFirstArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PullRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestFindFirstOrThrowArgs} args - Arguments to find a PullRequest
     * @example
     * // Get one PullRequest
     * const pullRequest = await prisma.pullRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PullRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, PullRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PullRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PullRequests
     * const pullRequests = await prisma.pullRequest.findMany()
     * 
     * // Get first 10 PullRequests
     * const pullRequests = await prisma.pullRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pullRequestWithIdOnly = await prisma.pullRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PullRequestFindManyArgs>(args?: SelectSubset<T, PullRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PullRequest.
     * @param {PullRequestCreateArgs} args - Arguments to create a PullRequest.
     * @example
     * // Create one PullRequest
     * const PullRequest = await prisma.pullRequest.create({
     *   data: {
     *     // ... data to create a PullRequest
     *   }
     * })
     * 
     */
    create<T extends PullRequestCreateArgs>(args: SelectSubset<T, PullRequestCreateArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PullRequests.
     * @param {PullRequestCreateManyArgs} args - Arguments to create many PullRequests.
     * @example
     * // Create many PullRequests
     * const pullRequest = await prisma.pullRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PullRequestCreateManyArgs>(args?: SelectSubset<T, PullRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PullRequests and returns the data saved in the database.
     * @param {PullRequestCreateManyAndReturnArgs} args - Arguments to create many PullRequests.
     * @example
     * // Create many PullRequests
     * const pullRequest = await prisma.pullRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PullRequests and only return the `id`
     * const pullRequestWithIdOnly = await prisma.pullRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PullRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, PullRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PullRequest.
     * @param {PullRequestDeleteArgs} args - Arguments to delete one PullRequest.
     * @example
     * // Delete one PullRequest
     * const PullRequest = await prisma.pullRequest.delete({
     *   where: {
     *     // ... filter to delete one PullRequest
     *   }
     * })
     * 
     */
    delete<T extends PullRequestDeleteArgs>(args: SelectSubset<T, PullRequestDeleteArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PullRequest.
     * @param {PullRequestUpdateArgs} args - Arguments to update one PullRequest.
     * @example
     * // Update one PullRequest
     * const pullRequest = await prisma.pullRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PullRequestUpdateArgs>(args: SelectSubset<T, PullRequestUpdateArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PullRequests.
     * @param {PullRequestDeleteManyArgs} args - Arguments to filter PullRequests to delete.
     * @example
     * // Delete a few PullRequests
     * const { count } = await prisma.pullRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PullRequestDeleteManyArgs>(args?: SelectSubset<T, PullRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PullRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PullRequests
     * const pullRequest = await prisma.pullRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PullRequestUpdateManyArgs>(args: SelectSubset<T, PullRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PullRequests and returns the data updated in the database.
     * @param {PullRequestUpdateManyAndReturnArgs} args - Arguments to update many PullRequests.
     * @example
     * // Update many PullRequests
     * const pullRequest = await prisma.pullRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PullRequests and only return the `id`
     * const pullRequestWithIdOnly = await prisma.pullRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PullRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, PullRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PullRequest.
     * @param {PullRequestUpsertArgs} args - Arguments to update or create a PullRequest.
     * @example
     * // Update or create a PullRequest
     * const pullRequest = await prisma.pullRequest.upsert({
     *   create: {
     *     // ... data to create a PullRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PullRequest we want to update
     *   }
     * })
     */
    upsert<T extends PullRequestUpsertArgs>(args: SelectSubset<T, PullRequestUpsertArgs<ExtArgs>>): Prisma__PullRequestClient<$Result.GetResult<Prisma.$PullRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PullRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestCountArgs} args - Arguments to filter PullRequests to count.
     * @example
     * // Count the number of PullRequests
     * const count = await prisma.pullRequest.count({
     *   where: {
     *     // ... the filter for the PullRequests we want to count
     *   }
     * })
    **/
    count<T extends PullRequestCountArgs>(
      args?: Subset<T, PullRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PullRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PullRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PullRequestAggregateArgs>(args: Subset<T, PullRequestAggregateArgs>): Prisma.PrismaPromise<GetPullRequestAggregateType<T>>

    /**
     * Group by PullRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PullRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PullRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PullRequestGroupByArgs['orderBy'] }
        : { orderBy?: PullRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PullRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPullRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PullRequest model
   */
  readonly fields: PullRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PullRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PullRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    workItem<T extends PullRequest$workItemArgs<ExtArgs> = {}>(args?: Subset<T, PullRequest$workItemArgs<ExtArgs>>): Prisma__WorkItemClient<$Result.GetResult<Prisma.$WorkItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    run<T extends AgentRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AgentRunDefaultArgs<ExtArgs>>): Prisma__AgentRunClient<$Result.GetResult<Prisma.$AgentRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PullRequest model
   */
  interface PullRequestFieldRefs {
    readonly id: FieldRef<"PullRequest", 'String'>
    readonly prNumber: FieldRef<"PullRequest", 'Int'>
    readonly azurePRId: FieldRef<"PullRequest", 'Int'>
    readonly title: FieldRef<"PullRequest", 'String'>
    readonly sourceBranch: FieldRef<"PullRequest", 'String'>
    readonly targetBranch: FieldRef<"PullRequest", 'String'>
    readonly status: FieldRef<"PullRequest", 'String'>
    readonly reviewerAlias: FieldRef<"PullRequest", 'String'>
    readonly rejectionComment: FieldRef<"PullRequest", 'String'>
    readonly workItemId: FieldRef<"PullRequest", 'String'>
    readonly runId: FieldRef<"PullRequest", 'String'>
    readonly url: FieldRef<"PullRequest", 'String'>
    readonly repositoryFullName: FieldRef<"PullRequest", 'String'>
    readonly createdAt: FieldRef<"PullRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"PullRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PullRequest findUnique
   */
  export type PullRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequest to fetch.
     */
    where: PullRequestWhereUniqueInput
  }

  /**
   * PullRequest findUniqueOrThrow
   */
  export type PullRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequest to fetch.
     */
    where: PullRequestWhereUniqueInput
  }

  /**
   * PullRequest findFirst
   */
  export type PullRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequest to fetch.
     */
    where?: PullRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PullRequests to fetch.
     */
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PullRequests.
     */
    cursor?: PullRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PullRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PullRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PullRequests.
     */
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * PullRequest findFirstOrThrow
   */
  export type PullRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequest to fetch.
     */
    where?: PullRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PullRequests to fetch.
     */
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PullRequests.
     */
    cursor?: PullRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PullRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PullRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PullRequests.
     */
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * PullRequest findMany
   */
  export type PullRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter, which PullRequests to fetch.
     */
    where?: PullRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PullRequests to fetch.
     */
    orderBy?: PullRequestOrderByWithRelationInput | PullRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PullRequests.
     */
    cursor?: PullRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PullRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PullRequests.
     */
    skip?: number
    distinct?: PullRequestScalarFieldEnum | PullRequestScalarFieldEnum[]
  }

  /**
   * PullRequest create
   */
  export type PullRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a PullRequest.
     */
    data: XOR<PullRequestCreateInput, PullRequestUncheckedCreateInput>
  }

  /**
   * PullRequest createMany
   */
  export type PullRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PullRequests.
     */
    data: PullRequestCreateManyInput | PullRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PullRequest createManyAndReturn
   */
  export type PullRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * The data used to create many PullRequests.
     */
    data: PullRequestCreateManyInput | PullRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PullRequest update
   */
  export type PullRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a PullRequest.
     */
    data: XOR<PullRequestUpdateInput, PullRequestUncheckedUpdateInput>
    /**
     * Choose, which PullRequest to update.
     */
    where: PullRequestWhereUniqueInput
  }

  /**
   * PullRequest updateMany
   */
  export type PullRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PullRequests.
     */
    data: XOR<PullRequestUpdateManyMutationInput, PullRequestUncheckedUpdateManyInput>
    /**
     * Filter which PullRequests to update
     */
    where?: PullRequestWhereInput
    /**
     * Limit how many PullRequests to update.
     */
    limit?: number
  }

  /**
   * PullRequest updateManyAndReturn
   */
  export type PullRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * The data used to update PullRequests.
     */
    data: XOR<PullRequestUpdateManyMutationInput, PullRequestUncheckedUpdateManyInput>
    /**
     * Filter which PullRequests to update
     */
    where?: PullRequestWhereInput
    /**
     * Limit how many PullRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PullRequest upsert
   */
  export type PullRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the PullRequest to update in case it exists.
     */
    where: PullRequestWhereUniqueInput
    /**
     * In case the PullRequest found by the `where` argument doesn't exist, create a new PullRequest with this data.
     */
    create: XOR<PullRequestCreateInput, PullRequestUncheckedCreateInput>
    /**
     * In case the PullRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PullRequestUpdateInput, PullRequestUncheckedUpdateInput>
  }

  /**
   * PullRequest delete
   */
  export type PullRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
    /**
     * Filter which PullRequest to delete.
     */
    where: PullRequestWhereUniqueInput
  }

  /**
   * PullRequest deleteMany
   */
  export type PullRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PullRequests to delete
     */
    where?: PullRequestWhereInput
    /**
     * Limit how many PullRequests to delete.
     */
    limit?: number
  }

  /**
   * PullRequest.workItem
   */
  export type PullRequest$workItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the WorkItem
     */
    select?: WorkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the WorkItem
     */
    omit?: WorkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: WorkItemInclude<ExtArgs> | null
    where?: WorkItemWhereInput
  }

  /**
   * PullRequest without action
   */
  export type PullRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PullRequest
     */
    select?: PullRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PullRequest
     */
    omit?: PullRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PullRequestInclude<ExtArgs> | null
  }


  /**
   * Model IndexState
   */

  export type AggregateIndexState = {
    _count: IndexStateCountAggregateOutputType | null
    _avg: IndexStateAvgAggregateOutputType | null
    _sum: IndexStateSumAggregateOutputType | null
    _min: IndexStateMinAggregateOutputType | null
    _max: IndexStateMaxAggregateOutputType | null
  }

  export type IndexStateAvgAggregateOutputType = {
    totalFiles: number | null
    indexedFiles: number | null
  }

  export type IndexStateSumAggregateOutputType = {
    totalFiles: number | null
    indexedFiles: number | null
  }

  export type IndexStateMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    repository: string | null
    branch: string | null
    status: string | null
    totalFiles: number | null
    indexedFiles: number | null
    lastSyncAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IndexStateMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    repository: string | null
    branch: string | null
    status: string | null
    totalFiles: number | null
    indexedFiles: number | null
    lastSyncAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IndexStateCountAggregateOutputType = {
    id: number
    tenantId: number
    repository: number
    branch: number
    status: number
    totalFiles: number
    indexedFiles: number
    lastSyncAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IndexStateAvgAggregateInputType = {
    totalFiles?: true
    indexedFiles?: true
  }

  export type IndexStateSumAggregateInputType = {
    totalFiles?: true
    indexedFiles?: true
  }

  export type IndexStateMinAggregateInputType = {
    id?: true
    tenantId?: true
    repository?: true
    branch?: true
    status?: true
    totalFiles?: true
    indexedFiles?: true
    lastSyncAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IndexStateMaxAggregateInputType = {
    id?: true
    tenantId?: true
    repository?: true
    branch?: true
    status?: true
    totalFiles?: true
    indexedFiles?: true
    lastSyncAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IndexStateCountAggregateInputType = {
    id?: true
    tenantId?: true
    repository?: true
    branch?: true
    status?: true
    totalFiles?: true
    indexedFiles?: true
    lastSyncAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IndexStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IndexState to aggregate.
     */
    where?: IndexStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexStates to fetch.
     */
    orderBy?: IndexStateOrderByWithRelationInput | IndexStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IndexStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IndexStates
    **/
    _count?: true | IndexStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IndexStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IndexStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IndexStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IndexStateMaxAggregateInputType
  }

  export type GetIndexStateAggregateType<T extends IndexStateAggregateArgs> = {
        [P in keyof T & keyof AggregateIndexState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIndexState[P]>
      : GetScalarType<T[P], AggregateIndexState[P]>
  }




  export type IndexStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IndexStateWhereInput
    orderBy?: IndexStateOrderByWithAggregationInput | IndexStateOrderByWithAggregationInput[]
    by: IndexStateScalarFieldEnum[] | IndexStateScalarFieldEnum
    having?: IndexStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IndexStateCountAggregateInputType | true
    _avg?: IndexStateAvgAggregateInputType
    _sum?: IndexStateSumAggregateInputType
    _min?: IndexStateMinAggregateInputType
    _max?: IndexStateMaxAggregateInputType
  }

  export type IndexStateGroupByOutputType = {
    id: string
    tenantId: string
    repository: string
    branch: string
    status: string
    totalFiles: number
    indexedFiles: number
    lastSyncAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: IndexStateCountAggregateOutputType | null
    _avg: IndexStateAvgAggregateOutputType | null
    _sum: IndexStateSumAggregateOutputType | null
    _min: IndexStateMinAggregateOutputType | null
    _max: IndexStateMaxAggregateOutputType | null
  }

  type GetIndexStateGroupByPayload<T extends IndexStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IndexStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IndexStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IndexStateGroupByOutputType[P]>
            : GetScalarType<T[P], IndexStateGroupByOutputType[P]>
        }
      >
    >


  export type IndexStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    repository?: boolean
    branch?: boolean
    status?: boolean
    totalFiles?: boolean
    indexedFiles?: boolean
    lastSyncAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexState"]>

  export type IndexStateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    repository?: boolean
    branch?: boolean
    status?: boolean
    totalFiles?: boolean
    indexedFiles?: boolean
    lastSyncAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexState"]>

  export type IndexStateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    repository?: boolean
    branch?: boolean
    status?: boolean
    totalFiles?: boolean
    indexedFiles?: boolean
    lastSyncAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["indexState"]>

  export type IndexStateSelectScalar = {
    id?: boolean
    tenantId?: boolean
    repository?: boolean
    branch?: boolean
    status?: boolean
    totalFiles?: boolean
    indexedFiles?: boolean
    lastSyncAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type IndexStateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tenantId" | "repository" | "branch" | "status" | "totalFiles" | "indexedFiles" | "lastSyncAt" | "createdAt" | "updatedAt", ExtArgs["result"]["indexState"]>

  export type $IndexStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IndexState"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      repository: string
      branch: string
      status: string
      totalFiles: number
      indexedFiles: number
      lastSyncAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["indexState"]>
    composites: {}
  }

  type IndexStateGetPayload<S extends boolean | null | undefined | IndexStateDefaultArgs> = $Result.GetResult<Prisma.$IndexStatePayload, S>

  type IndexStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IndexStateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IndexStateCountAggregateInputType | true
    }

  export interface IndexStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IndexState'], meta: { name: 'IndexState' } }
    /**
     * Find zero or one IndexState that matches the filter.
     * @param {IndexStateFindUniqueArgs} args - Arguments to find a IndexState
     * @example
     * // Get one IndexState
     * const indexState = await prisma.indexState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IndexStateFindUniqueArgs>(args: SelectSubset<T, IndexStateFindUniqueArgs<ExtArgs>>): Prisma__IndexStateClient<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IndexState that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IndexStateFindUniqueOrThrowArgs} args - Arguments to find a IndexState
     * @example
     * // Get one IndexState
     * const indexState = await prisma.indexState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IndexStateFindUniqueOrThrowArgs>(args: SelectSubset<T, IndexStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IndexStateClient<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IndexState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexStateFindFirstArgs} args - Arguments to find a IndexState
     * @example
     * // Get one IndexState
     * const indexState = await prisma.indexState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IndexStateFindFirstArgs>(args?: SelectSubset<T, IndexStateFindFirstArgs<ExtArgs>>): Prisma__IndexStateClient<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IndexState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexStateFindFirstOrThrowArgs} args - Arguments to find a IndexState
     * @example
     * // Get one IndexState
     * const indexState = await prisma.indexState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IndexStateFindFirstOrThrowArgs>(args?: SelectSubset<T, IndexStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__IndexStateClient<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IndexStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IndexStates
     * const indexStates = await prisma.indexState.findMany()
     * 
     * // Get first 10 IndexStates
     * const indexStates = await prisma.indexState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const indexStateWithIdOnly = await prisma.indexState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IndexStateFindManyArgs>(args?: SelectSubset<T, IndexStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IndexState.
     * @param {IndexStateCreateArgs} args - Arguments to create a IndexState.
     * @example
     * // Create one IndexState
     * const IndexState = await prisma.indexState.create({
     *   data: {
     *     // ... data to create a IndexState
     *   }
     * })
     * 
     */
    create<T extends IndexStateCreateArgs>(args: SelectSubset<T, IndexStateCreateArgs<ExtArgs>>): Prisma__IndexStateClient<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IndexStates.
     * @param {IndexStateCreateManyArgs} args - Arguments to create many IndexStates.
     * @example
     * // Create many IndexStates
     * const indexState = await prisma.indexState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IndexStateCreateManyArgs>(args?: SelectSubset<T, IndexStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IndexStates and returns the data saved in the database.
     * @param {IndexStateCreateManyAndReturnArgs} args - Arguments to create many IndexStates.
     * @example
     * // Create many IndexStates
     * const indexState = await prisma.indexState.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IndexStates and only return the `id`
     * const indexStateWithIdOnly = await prisma.indexState.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IndexStateCreateManyAndReturnArgs>(args?: SelectSubset<T, IndexStateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IndexState.
     * @param {IndexStateDeleteArgs} args - Arguments to delete one IndexState.
     * @example
     * // Delete one IndexState
     * const IndexState = await prisma.indexState.delete({
     *   where: {
     *     // ... filter to delete one IndexState
     *   }
     * })
     * 
     */
    delete<T extends IndexStateDeleteArgs>(args: SelectSubset<T, IndexStateDeleteArgs<ExtArgs>>): Prisma__IndexStateClient<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IndexState.
     * @param {IndexStateUpdateArgs} args - Arguments to update one IndexState.
     * @example
     * // Update one IndexState
     * const indexState = await prisma.indexState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IndexStateUpdateArgs>(args: SelectSubset<T, IndexStateUpdateArgs<ExtArgs>>): Prisma__IndexStateClient<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IndexStates.
     * @param {IndexStateDeleteManyArgs} args - Arguments to filter IndexStates to delete.
     * @example
     * // Delete a few IndexStates
     * const { count } = await prisma.indexState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IndexStateDeleteManyArgs>(args?: SelectSubset<T, IndexStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IndexStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IndexStates
     * const indexState = await prisma.indexState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IndexStateUpdateManyArgs>(args: SelectSubset<T, IndexStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IndexStates and returns the data updated in the database.
     * @param {IndexStateUpdateManyAndReturnArgs} args - Arguments to update many IndexStates.
     * @example
     * // Update many IndexStates
     * const indexState = await prisma.indexState.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IndexStates and only return the `id`
     * const indexStateWithIdOnly = await prisma.indexState.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IndexStateUpdateManyAndReturnArgs>(args: SelectSubset<T, IndexStateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IndexState.
     * @param {IndexStateUpsertArgs} args - Arguments to update or create a IndexState.
     * @example
     * // Update or create a IndexState
     * const indexState = await prisma.indexState.upsert({
     *   create: {
     *     // ... data to create a IndexState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IndexState we want to update
     *   }
     * })
     */
    upsert<T extends IndexStateUpsertArgs>(args: SelectSubset<T, IndexStateUpsertArgs<ExtArgs>>): Prisma__IndexStateClient<$Result.GetResult<Prisma.$IndexStatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IndexStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexStateCountArgs} args - Arguments to filter IndexStates to count.
     * @example
     * // Count the number of IndexStates
     * const count = await prisma.indexState.count({
     *   where: {
     *     // ... the filter for the IndexStates we want to count
     *   }
     * })
    **/
    count<T extends IndexStateCountArgs>(
      args?: Subset<T, IndexStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IndexStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IndexState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IndexStateAggregateArgs>(args: Subset<T, IndexStateAggregateArgs>): Prisma.PrismaPromise<GetIndexStateAggregateType<T>>

    /**
     * Group by IndexState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IndexStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IndexStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IndexStateGroupByArgs['orderBy'] }
        : { orderBy?: IndexStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IndexStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIndexStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IndexState model
   */
  readonly fields: IndexStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IndexState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IndexStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IndexState model
   */
  interface IndexStateFieldRefs {
    readonly id: FieldRef<"IndexState", 'String'>
    readonly tenantId: FieldRef<"IndexState", 'String'>
    readonly repository: FieldRef<"IndexState", 'String'>
    readonly branch: FieldRef<"IndexState", 'String'>
    readonly status: FieldRef<"IndexState", 'String'>
    readonly totalFiles: FieldRef<"IndexState", 'Int'>
    readonly indexedFiles: FieldRef<"IndexState", 'Int'>
    readonly lastSyncAt: FieldRef<"IndexState", 'DateTime'>
    readonly createdAt: FieldRef<"IndexState", 'DateTime'>
    readonly updatedAt: FieldRef<"IndexState", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * IndexState findUnique
   */
  export type IndexStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexState to fetch.
     */
    where: IndexStateWhereUniqueInput
  }

  /**
   * IndexState findUniqueOrThrow
   */
  export type IndexStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexState to fetch.
     */
    where: IndexStateWhereUniqueInput
  }

  /**
   * IndexState findFirst
   */
  export type IndexStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexState to fetch.
     */
    where?: IndexStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexStates to fetch.
     */
    orderBy?: IndexStateOrderByWithRelationInput | IndexStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IndexStates.
     */
    cursor?: IndexStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IndexStates.
     */
    distinct?: IndexStateScalarFieldEnum | IndexStateScalarFieldEnum[]
  }

  /**
   * IndexState findFirstOrThrow
   */
  export type IndexStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexState to fetch.
     */
    where?: IndexStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexStates to fetch.
     */
    orderBy?: IndexStateOrderByWithRelationInput | IndexStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IndexStates.
     */
    cursor?: IndexStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IndexStates.
     */
    distinct?: IndexStateScalarFieldEnum | IndexStateScalarFieldEnum[]
  }

  /**
   * IndexState findMany
   */
  export type IndexStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * Filter, which IndexStates to fetch.
     */
    where?: IndexStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IndexStates to fetch.
     */
    orderBy?: IndexStateOrderByWithRelationInput | IndexStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IndexStates.
     */
    cursor?: IndexStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IndexStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IndexStates.
     */
    skip?: number
    distinct?: IndexStateScalarFieldEnum | IndexStateScalarFieldEnum[]
  }

  /**
   * IndexState create
   */
  export type IndexStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * The data needed to create a IndexState.
     */
    data: XOR<IndexStateCreateInput, IndexStateUncheckedCreateInput>
  }

  /**
   * IndexState createMany
   */
  export type IndexStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IndexStates.
     */
    data: IndexStateCreateManyInput | IndexStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IndexState createManyAndReturn
   */
  export type IndexStateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * The data used to create many IndexStates.
     */
    data: IndexStateCreateManyInput | IndexStateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IndexState update
   */
  export type IndexStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * The data needed to update a IndexState.
     */
    data: XOR<IndexStateUpdateInput, IndexStateUncheckedUpdateInput>
    /**
     * Choose, which IndexState to update.
     */
    where: IndexStateWhereUniqueInput
  }

  /**
   * IndexState updateMany
   */
  export type IndexStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IndexStates.
     */
    data: XOR<IndexStateUpdateManyMutationInput, IndexStateUncheckedUpdateManyInput>
    /**
     * Filter which IndexStates to update
     */
    where?: IndexStateWhereInput
    /**
     * Limit how many IndexStates to update.
     */
    limit?: number
  }

  /**
   * IndexState updateManyAndReturn
   */
  export type IndexStateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * The data used to update IndexStates.
     */
    data: XOR<IndexStateUpdateManyMutationInput, IndexStateUncheckedUpdateManyInput>
    /**
     * Filter which IndexStates to update
     */
    where?: IndexStateWhereInput
    /**
     * Limit how many IndexStates to update.
     */
    limit?: number
  }

  /**
   * IndexState upsert
   */
  export type IndexStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * The filter to search for the IndexState to update in case it exists.
     */
    where: IndexStateWhereUniqueInput
    /**
     * In case the IndexState found by the `where` argument doesn't exist, create a new IndexState with this data.
     */
    create: XOR<IndexStateCreateInput, IndexStateUncheckedCreateInput>
    /**
     * In case the IndexState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IndexStateUpdateInput, IndexStateUncheckedUpdateInput>
  }

  /**
   * IndexState delete
   */
  export type IndexStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
    /**
     * Filter which IndexState to delete.
     */
    where: IndexStateWhereUniqueInput
  }

  /**
   * IndexState deleteMany
   */
  export type IndexStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IndexStates to delete
     */
    where?: IndexStateWhereInput
    /**
     * Limit how many IndexStates to delete.
     */
    limit?: number
  }

  /**
   * IndexState without action
   */
  export type IndexStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IndexState
     */
    select?: IndexStateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IndexState
     */
    omit?: IndexStateOmit<ExtArgs> | null
  }


  /**
   * Model MaskingAuditEntry
   */

  export type AggregateMaskingAuditEntry = {
    _count: MaskingAuditEntryCountAggregateOutputType | null
    _avg: MaskingAuditEntryAvgAggregateOutputType | null
    _sum: MaskingAuditEntrySumAggregateOutputType | null
    _min: MaskingAuditEntryMinAggregateOutputType | null
    _max: MaskingAuditEntryMaxAggregateOutputType | null
  }

  export type MaskingAuditEntryAvgAggregateOutputType = {
    matchCount: number | null
  }

  export type MaskingAuditEntrySumAggregateOutputType = {
    matchCount: number | null
  }

  export type MaskingAuditEntryMinAggregateOutputType = {
    id: string | null
    runId: string | null
    pattern: string | null
    matchCount: number | null
    timestamp: Date | null
  }

  export type MaskingAuditEntryMaxAggregateOutputType = {
    id: string | null
    runId: string | null
    pattern: string | null
    matchCount: number | null
    timestamp: Date | null
  }

  export type MaskingAuditEntryCountAggregateOutputType = {
    id: number
    runId: number
    pattern: number
    matchCount: number
    filesAffected: number
    timestamp: number
    _all: number
  }


  export type MaskingAuditEntryAvgAggregateInputType = {
    matchCount?: true
  }

  export type MaskingAuditEntrySumAggregateInputType = {
    matchCount?: true
  }

  export type MaskingAuditEntryMinAggregateInputType = {
    id?: true
    runId?: true
    pattern?: true
    matchCount?: true
    timestamp?: true
  }

  export type MaskingAuditEntryMaxAggregateInputType = {
    id?: true
    runId?: true
    pattern?: true
    matchCount?: true
    timestamp?: true
  }

  export type MaskingAuditEntryCountAggregateInputType = {
    id?: true
    runId?: true
    pattern?: true
    matchCount?: true
    filesAffected?: true
    timestamp?: true
    _all?: true
  }

  export type MaskingAuditEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaskingAuditEntry to aggregate.
     */
    where?: MaskingAuditEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaskingAuditEntries to fetch.
     */
    orderBy?: MaskingAuditEntryOrderByWithRelationInput | MaskingAuditEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaskingAuditEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaskingAuditEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaskingAuditEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaskingAuditEntries
    **/
    _count?: true | MaskingAuditEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaskingAuditEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaskingAuditEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaskingAuditEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaskingAuditEntryMaxAggregateInputType
  }

  export type GetMaskingAuditEntryAggregateType<T extends MaskingAuditEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateMaskingAuditEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaskingAuditEntry[P]>
      : GetScalarType<T[P], AggregateMaskingAuditEntry[P]>
  }




  export type MaskingAuditEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaskingAuditEntryWhereInput
    orderBy?: MaskingAuditEntryOrderByWithAggregationInput | MaskingAuditEntryOrderByWithAggregationInput[]
    by: MaskingAuditEntryScalarFieldEnum[] | MaskingAuditEntryScalarFieldEnum
    having?: MaskingAuditEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaskingAuditEntryCountAggregateInputType | true
    _avg?: MaskingAuditEntryAvgAggregateInputType
    _sum?: MaskingAuditEntrySumAggregateInputType
    _min?: MaskingAuditEntryMinAggregateInputType
    _max?: MaskingAuditEntryMaxAggregateInputType
  }

  export type MaskingAuditEntryGroupByOutputType = {
    id: string
    runId: string
    pattern: string
    matchCount: number
    filesAffected: string[]
    timestamp: Date
    _count: MaskingAuditEntryCountAggregateOutputType | null
    _avg: MaskingAuditEntryAvgAggregateOutputType | null
    _sum: MaskingAuditEntrySumAggregateOutputType | null
    _min: MaskingAuditEntryMinAggregateOutputType | null
    _max: MaskingAuditEntryMaxAggregateOutputType | null
  }

  type GetMaskingAuditEntryGroupByPayload<T extends MaskingAuditEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaskingAuditEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaskingAuditEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaskingAuditEntryGroupByOutputType[P]>
            : GetScalarType<T[P], MaskingAuditEntryGroupByOutputType[P]>
        }
      >
    >


  export type MaskingAuditEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    pattern?: boolean
    matchCount?: boolean
    filesAffected?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["maskingAuditEntry"]>

  export type MaskingAuditEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    pattern?: boolean
    matchCount?: boolean
    filesAffected?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["maskingAuditEntry"]>

  export type MaskingAuditEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    runId?: boolean
    pattern?: boolean
    matchCount?: boolean
    filesAffected?: boolean
    timestamp?: boolean
  }, ExtArgs["result"]["maskingAuditEntry"]>

  export type MaskingAuditEntrySelectScalar = {
    id?: boolean
    runId?: boolean
    pattern?: boolean
    matchCount?: boolean
    filesAffected?: boolean
    timestamp?: boolean
  }

  export type MaskingAuditEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "runId" | "pattern" | "matchCount" | "filesAffected" | "timestamp", ExtArgs["result"]["maskingAuditEntry"]>

  export type $MaskingAuditEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaskingAuditEntry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      runId: string
      pattern: string
      matchCount: number
      filesAffected: string[]
      timestamp: Date
    }, ExtArgs["result"]["maskingAuditEntry"]>
    composites: {}
  }

  type MaskingAuditEntryGetPayload<S extends boolean | null | undefined | MaskingAuditEntryDefaultArgs> = $Result.GetResult<Prisma.$MaskingAuditEntryPayload, S>

  type MaskingAuditEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaskingAuditEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaskingAuditEntryCountAggregateInputType | true
    }

  export interface MaskingAuditEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaskingAuditEntry'], meta: { name: 'MaskingAuditEntry' } }
    /**
     * Find zero or one MaskingAuditEntry that matches the filter.
     * @param {MaskingAuditEntryFindUniqueArgs} args - Arguments to find a MaskingAuditEntry
     * @example
     * // Get one MaskingAuditEntry
     * const maskingAuditEntry = await prisma.maskingAuditEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaskingAuditEntryFindUniqueArgs>(args: SelectSubset<T, MaskingAuditEntryFindUniqueArgs<ExtArgs>>): Prisma__MaskingAuditEntryClient<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MaskingAuditEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaskingAuditEntryFindUniqueOrThrowArgs} args - Arguments to find a MaskingAuditEntry
     * @example
     * // Get one MaskingAuditEntry
     * const maskingAuditEntry = await prisma.maskingAuditEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaskingAuditEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, MaskingAuditEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaskingAuditEntryClient<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaskingAuditEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingAuditEntryFindFirstArgs} args - Arguments to find a MaskingAuditEntry
     * @example
     * // Get one MaskingAuditEntry
     * const maskingAuditEntry = await prisma.maskingAuditEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaskingAuditEntryFindFirstArgs>(args?: SelectSubset<T, MaskingAuditEntryFindFirstArgs<ExtArgs>>): Prisma__MaskingAuditEntryClient<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaskingAuditEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingAuditEntryFindFirstOrThrowArgs} args - Arguments to find a MaskingAuditEntry
     * @example
     * // Get one MaskingAuditEntry
     * const maskingAuditEntry = await prisma.maskingAuditEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaskingAuditEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, MaskingAuditEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaskingAuditEntryClient<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MaskingAuditEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingAuditEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaskingAuditEntries
     * const maskingAuditEntries = await prisma.maskingAuditEntry.findMany()
     * 
     * // Get first 10 MaskingAuditEntries
     * const maskingAuditEntries = await prisma.maskingAuditEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maskingAuditEntryWithIdOnly = await prisma.maskingAuditEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaskingAuditEntryFindManyArgs>(args?: SelectSubset<T, MaskingAuditEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MaskingAuditEntry.
     * @param {MaskingAuditEntryCreateArgs} args - Arguments to create a MaskingAuditEntry.
     * @example
     * // Create one MaskingAuditEntry
     * const MaskingAuditEntry = await prisma.maskingAuditEntry.create({
     *   data: {
     *     // ... data to create a MaskingAuditEntry
     *   }
     * })
     * 
     */
    create<T extends MaskingAuditEntryCreateArgs>(args: SelectSubset<T, MaskingAuditEntryCreateArgs<ExtArgs>>): Prisma__MaskingAuditEntryClient<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MaskingAuditEntries.
     * @param {MaskingAuditEntryCreateManyArgs} args - Arguments to create many MaskingAuditEntries.
     * @example
     * // Create many MaskingAuditEntries
     * const maskingAuditEntry = await prisma.maskingAuditEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaskingAuditEntryCreateManyArgs>(args?: SelectSubset<T, MaskingAuditEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaskingAuditEntries and returns the data saved in the database.
     * @param {MaskingAuditEntryCreateManyAndReturnArgs} args - Arguments to create many MaskingAuditEntries.
     * @example
     * // Create many MaskingAuditEntries
     * const maskingAuditEntry = await prisma.maskingAuditEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaskingAuditEntries and only return the `id`
     * const maskingAuditEntryWithIdOnly = await prisma.maskingAuditEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaskingAuditEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, MaskingAuditEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MaskingAuditEntry.
     * @param {MaskingAuditEntryDeleteArgs} args - Arguments to delete one MaskingAuditEntry.
     * @example
     * // Delete one MaskingAuditEntry
     * const MaskingAuditEntry = await prisma.maskingAuditEntry.delete({
     *   where: {
     *     // ... filter to delete one MaskingAuditEntry
     *   }
     * })
     * 
     */
    delete<T extends MaskingAuditEntryDeleteArgs>(args: SelectSubset<T, MaskingAuditEntryDeleteArgs<ExtArgs>>): Prisma__MaskingAuditEntryClient<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MaskingAuditEntry.
     * @param {MaskingAuditEntryUpdateArgs} args - Arguments to update one MaskingAuditEntry.
     * @example
     * // Update one MaskingAuditEntry
     * const maskingAuditEntry = await prisma.maskingAuditEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaskingAuditEntryUpdateArgs>(args: SelectSubset<T, MaskingAuditEntryUpdateArgs<ExtArgs>>): Prisma__MaskingAuditEntryClient<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MaskingAuditEntries.
     * @param {MaskingAuditEntryDeleteManyArgs} args - Arguments to filter MaskingAuditEntries to delete.
     * @example
     * // Delete a few MaskingAuditEntries
     * const { count } = await prisma.maskingAuditEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaskingAuditEntryDeleteManyArgs>(args?: SelectSubset<T, MaskingAuditEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaskingAuditEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingAuditEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaskingAuditEntries
     * const maskingAuditEntry = await prisma.maskingAuditEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaskingAuditEntryUpdateManyArgs>(args: SelectSubset<T, MaskingAuditEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaskingAuditEntries and returns the data updated in the database.
     * @param {MaskingAuditEntryUpdateManyAndReturnArgs} args - Arguments to update many MaskingAuditEntries.
     * @example
     * // Update many MaskingAuditEntries
     * const maskingAuditEntry = await prisma.maskingAuditEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MaskingAuditEntries and only return the `id`
     * const maskingAuditEntryWithIdOnly = await prisma.maskingAuditEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MaskingAuditEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, MaskingAuditEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MaskingAuditEntry.
     * @param {MaskingAuditEntryUpsertArgs} args - Arguments to update or create a MaskingAuditEntry.
     * @example
     * // Update or create a MaskingAuditEntry
     * const maskingAuditEntry = await prisma.maskingAuditEntry.upsert({
     *   create: {
     *     // ... data to create a MaskingAuditEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaskingAuditEntry we want to update
     *   }
     * })
     */
    upsert<T extends MaskingAuditEntryUpsertArgs>(args: SelectSubset<T, MaskingAuditEntryUpsertArgs<ExtArgs>>): Prisma__MaskingAuditEntryClient<$Result.GetResult<Prisma.$MaskingAuditEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MaskingAuditEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingAuditEntryCountArgs} args - Arguments to filter MaskingAuditEntries to count.
     * @example
     * // Count the number of MaskingAuditEntries
     * const count = await prisma.maskingAuditEntry.count({
     *   where: {
     *     // ... the filter for the MaskingAuditEntries we want to count
     *   }
     * })
    **/
    count<T extends MaskingAuditEntryCountArgs>(
      args?: Subset<T, MaskingAuditEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaskingAuditEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaskingAuditEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingAuditEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaskingAuditEntryAggregateArgs>(args: Subset<T, MaskingAuditEntryAggregateArgs>): Prisma.PrismaPromise<GetMaskingAuditEntryAggregateType<T>>

    /**
     * Group by MaskingAuditEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaskingAuditEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaskingAuditEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaskingAuditEntryGroupByArgs['orderBy'] }
        : { orderBy?: MaskingAuditEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaskingAuditEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaskingAuditEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaskingAuditEntry model
   */
  readonly fields: MaskingAuditEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaskingAuditEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaskingAuditEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MaskingAuditEntry model
   */
  interface MaskingAuditEntryFieldRefs {
    readonly id: FieldRef<"MaskingAuditEntry", 'String'>
    readonly runId: FieldRef<"MaskingAuditEntry", 'String'>
    readonly pattern: FieldRef<"MaskingAuditEntry", 'String'>
    readonly matchCount: FieldRef<"MaskingAuditEntry", 'Int'>
    readonly filesAffected: FieldRef<"MaskingAuditEntry", 'String[]'>
    readonly timestamp: FieldRef<"MaskingAuditEntry", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MaskingAuditEntry findUnique
   */
  export type MaskingAuditEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * Filter, which MaskingAuditEntry to fetch.
     */
    where: MaskingAuditEntryWhereUniqueInput
  }

  /**
   * MaskingAuditEntry findUniqueOrThrow
   */
  export type MaskingAuditEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * Filter, which MaskingAuditEntry to fetch.
     */
    where: MaskingAuditEntryWhereUniqueInput
  }

  /**
   * MaskingAuditEntry findFirst
   */
  export type MaskingAuditEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * Filter, which MaskingAuditEntry to fetch.
     */
    where?: MaskingAuditEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaskingAuditEntries to fetch.
     */
    orderBy?: MaskingAuditEntryOrderByWithRelationInput | MaskingAuditEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaskingAuditEntries.
     */
    cursor?: MaskingAuditEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaskingAuditEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaskingAuditEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaskingAuditEntries.
     */
    distinct?: MaskingAuditEntryScalarFieldEnum | MaskingAuditEntryScalarFieldEnum[]
  }

  /**
   * MaskingAuditEntry findFirstOrThrow
   */
  export type MaskingAuditEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * Filter, which MaskingAuditEntry to fetch.
     */
    where?: MaskingAuditEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaskingAuditEntries to fetch.
     */
    orderBy?: MaskingAuditEntryOrderByWithRelationInput | MaskingAuditEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaskingAuditEntries.
     */
    cursor?: MaskingAuditEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaskingAuditEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaskingAuditEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaskingAuditEntries.
     */
    distinct?: MaskingAuditEntryScalarFieldEnum | MaskingAuditEntryScalarFieldEnum[]
  }

  /**
   * MaskingAuditEntry findMany
   */
  export type MaskingAuditEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * Filter, which MaskingAuditEntries to fetch.
     */
    where?: MaskingAuditEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaskingAuditEntries to fetch.
     */
    orderBy?: MaskingAuditEntryOrderByWithRelationInput | MaskingAuditEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaskingAuditEntries.
     */
    cursor?: MaskingAuditEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaskingAuditEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaskingAuditEntries.
     */
    skip?: number
    distinct?: MaskingAuditEntryScalarFieldEnum | MaskingAuditEntryScalarFieldEnum[]
  }

  /**
   * MaskingAuditEntry create
   */
  export type MaskingAuditEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * The data needed to create a MaskingAuditEntry.
     */
    data: XOR<MaskingAuditEntryCreateInput, MaskingAuditEntryUncheckedCreateInput>
  }

  /**
   * MaskingAuditEntry createMany
   */
  export type MaskingAuditEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaskingAuditEntries.
     */
    data: MaskingAuditEntryCreateManyInput | MaskingAuditEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaskingAuditEntry createManyAndReturn
   */
  export type MaskingAuditEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * The data used to create many MaskingAuditEntries.
     */
    data: MaskingAuditEntryCreateManyInput | MaskingAuditEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaskingAuditEntry update
   */
  export type MaskingAuditEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * The data needed to update a MaskingAuditEntry.
     */
    data: XOR<MaskingAuditEntryUpdateInput, MaskingAuditEntryUncheckedUpdateInput>
    /**
     * Choose, which MaskingAuditEntry to update.
     */
    where: MaskingAuditEntryWhereUniqueInput
  }

  /**
   * MaskingAuditEntry updateMany
   */
  export type MaskingAuditEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaskingAuditEntries.
     */
    data: XOR<MaskingAuditEntryUpdateManyMutationInput, MaskingAuditEntryUncheckedUpdateManyInput>
    /**
     * Filter which MaskingAuditEntries to update
     */
    where?: MaskingAuditEntryWhereInput
    /**
     * Limit how many MaskingAuditEntries to update.
     */
    limit?: number
  }

  /**
   * MaskingAuditEntry updateManyAndReturn
   */
  export type MaskingAuditEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * The data used to update MaskingAuditEntries.
     */
    data: XOR<MaskingAuditEntryUpdateManyMutationInput, MaskingAuditEntryUncheckedUpdateManyInput>
    /**
     * Filter which MaskingAuditEntries to update
     */
    where?: MaskingAuditEntryWhereInput
    /**
     * Limit how many MaskingAuditEntries to update.
     */
    limit?: number
  }

  /**
   * MaskingAuditEntry upsert
   */
  export type MaskingAuditEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * The filter to search for the MaskingAuditEntry to update in case it exists.
     */
    where: MaskingAuditEntryWhereUniqueInput
    /**
     * In case the MaskingAuditEntry found by the `where` argument doesn't exist, create a new MaskingAuditEntry with this data.
     */
    create: XOR<MaskingAuditEntryCreateInput, MaskingAuditEntryUncheckedCreateInput>
    /**
     * In case the MaskingAuditEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaskingAuditEntryUpdateInput, MaskingAuditEntryUncheckedUpdateInput>
  }

  /**
   * MaskingAuditEntry delete
   */
  export type MaskingAuditEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
    /**
     * Filter which MaskingAuditEntry to delete.
     */
    where: MaskingAuditEntryWhereUniqueInput
  }

  /**
   * MaskingAuditEntry deleteMany
   */
  export type MaskingAuditEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaskingAuditEntries to delete
     */
    where?: MaskingAuditEntryWhereInput
    /**
     * Limit how many MaskingAuditEntries to delete.
     */
    limit?: number
  }

  /**
   * MaskingAuditEntry without action
   */
  export type MaskingAuditEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaskingAuditEntry
     */
    select?: MaskingAuditEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaskingAuditEntry
     */
    omit?: MaskingAuditEntryOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ConnectionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    provider: 'provider',
    authMethod: 'authMethod',
    providerAccountName: 'providerAccountName',
    providerUrl: 'providerUrl',
    secretToken: 'secretToken',
    secretLastFour: 'secretLastFour',
    isDefault: 'isDefault',
    status: 'status',
    scopes: 'scopes',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ConnectionScalarFieldEnum = (typeof ConnectionScalarFieldEnum)[keyof typeof ConnectionScalarFieldEnum]


  export const LinkedAccountScalarFieldEnum: {
    id: 'id',
    displayName: 'displayName',
    providerUsername: 'providerUsername',
    email: 'email',
    provider: 'provider',
    authMethod: 'authMethod',
    status: 'status',
    avatarUrl: 'avatarUrl',
    connectionId: 'connectionId',
    expiresAt: 'expiresAt',
    lastUsedAt: 'lastUsedAt',
    createdAt: 'createdAt'
  };

  export type LinkedAccountScalarFieldEnum = (typeof LinkedAccountScalarFieldEnum)[keyof typeof LinkedAccountScalarFieldEnum]


  export const LinkedRepositoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    fullName: 'fullName',
    provider: 'provider',
    connectionId: 'connectionId',
    defaultBranch: 'defaultBranch',
    identityMode: 'identityMode',
    assumeAccountId: 'assumeAccountId',
    indexEnabled: 'indexEnabled',
    defaultReviewer: 'defaultReviewer',
    webhookActive: 'webhookActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LinkedRepositoryScalarFieldEnum = (typeof LinkedRepositoryScalarFieldEnum)[keyof typeof LinkedRepositoryScalarFieldEnum]


  export const WebhookConfigScalarFieldEnum: {
    id: 'id',
    repositoryId: 'repositoryId',
    event: 'event',
    endpointPath: 'endpointPath',
    active: 'active',
    secretConfigured: 'secretConfigured',
    lastTriggeredAt: 'lastTriggeredAt',
    createdAt: 'createdAt'
  };

  export type WebhookConfigScalarFieldEnum = (typeof WebhookConfigScalarFieldEnum)[keyof typeof WebhookConfigScalarFieldEnum]


  export const MaskingRuleScalarFieldEnum: {
    id: 'id',
    pattern: 'pattern',
    description: 'description',
    enabled: 'enabled',
    builtIn: 'builtIn',
    regex: 'regex',
    createdAt: 'createdAt'
  };

  export type MaskingRuleScalarFieldEnum = (typeof MaskingRuleScalarFieldEnum)[keyof typeof MaskingRuleScalarFieldEnum]


  export const WorkItemScalarFieldEnum: {
    id: 'id',
    azureId: 'azureId',
    title: 'title',
    description: 'description',
    userQuery: 'userQuery',
    type: 'type',
    status: 'status',
    assignedTo: 'assignedTo',
    repositoryFullName: 'repositoryFullName',
    targetBranch: 'targetBranch',
    linkedRunId: 'linkedRunId',
    linkedPRId: 'linkedPRId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type WorkItemScalarFieldEnum = (typeof WorkItemScalarFieldEnum)[keyof typeof WorkItemScalarFieldEnum]


  export const AgentRunScalarFieldEnum: {
    id: 'id',
    workItemId: 'workItemId',
    repositoryFullName: 'repositoryFullName',
    userQuery: 'userQuery',
    status: 'status',
    branchName: 'branchName',
    prId: 'prId',
    error: 'error',
    planSummary: 'planSummary',
    planFiles: 'planFiles',
    totalPromptTokens: 'totalPromptTokens',
    totalCompletionTokens: 'totalCompletionTokens',
    totalTokens: 'totalTokens',
    currentIteration: 'currentIteration',
    maxIterations: 'maxIterations',
    lastChanges: 'lastChanges',
    startedAt: 'startedAt',
    completedAt: 'completedAt'
  };

  export type AgentRunScalarFieldEnum = (typeof AgentRunScalarFieldEnum)[keyof typeof AgentRunScalarFieldEnum]


  export const AgentStepScalarFieldEnum: {
    id: 'id',
    runId: 'runId',
    type: 'type',
    status: 'status',
    label: 'label',
    detail: 'detail',
    order: 'order',
    durationMs: 'durationMs',
    timestamp: 'timestamp'
  };

  export type AgentStepScalarFieldEnum = (typeof AgentStepScalarFieldEnum)[keyof typeof AgentStepScalarFieldEnum]


  export const PullRequestScalarFieldEnum: {
    id: 'id',
    prNumber: 'prNumber',
    azurePRId: 'azurePRId',
    title: 'title',
    sourceBranch: 'sourceBranch',
    targetBranch: 'targetBranch',
    status: 'status',
    reviewerAlias: 'reviewerAlias',
    rejectionComment: 'rejectionComment',
    workItemId: 'workItemId',
    runId: 'runId',
    url: 'url',
    repositoryFullName: 'repositoryFullName',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PullRequestScalarFieldEnum = (typeof PullRequestScalarFieldEnum)[keyof typeof PullRequestScalarFieldEnum]


  export const IndexStateScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    repository: 'repository',
    branch: 'branch',
    status: 'status',
    totalFiles: 'totalFiles',
    indexedFiles: 'indexedFiles',
    lastSyncAt: 'lastSyncAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IndexStateScalarFieldEnum = (typeof IndexStateScalarFieldEnum)[keyof typeof IndexStateScalarFieldEnum]


  export const MaskingAuditEntryScalarFieldEnum: {
    id: 'id',
    runId: 'runId',
    pattern: 'pattern',
    matchCount: 'matchCount',
    filesAffected: 'filesAffected',
    timestamp: 'timestamp'
  };

  export type MaskingAuditEntryScalarFieldEnum = (typeof MaskingAuditEntryScalarFieldEnum)[keyof typeof MaskingAuditEntryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type ConnectionWhereInput = {
    AND?: ConnectionWhereInput | ConnectionWhereInput[]
    OR?: ConnectionWhereInput[]
    NOT?: ConnectionWhereInput | ConnectionWhereInput[]
    id?: StringFilter<"Connection"> | string
    name?: StringFilter<"Connection"> | string
    provider?: StringFilter<"Connection"> | string
    authMethod?: StringFilter<"Connection"> | string
    providerAccountName?: StringFilter<"Connection"> | string
    providerUrl?: StringFilter<"Connection"> | string
    secretToken?: StringNullableFilter<"Connection"> | string | null
    secretLastFour?: StringNullableFilter<"Connection"> | string | null
    isDefault?: BoolFilter<"Connection"> | boolean
    status?: StringFilter<"Connection"> | string
    scopes?: StringNullableListFilter<"Connection">
    expiresAt?: DateTimeNullableFilter<"Connection"> | Date | string | null
    createdAt?: DateTimeFilter<"Connection"> | Date | string
    updatedAt?: DateTimeFilter<"Connection"> | Date | string
    linkedAccounts?: LinkedAccountListRelationFilter
    repositories?: LinkedRepositoryListRelationFilter
  }

  export type ConnectionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    providerAccountName?: SortOrder
    providerUrl?: SortOrder
    secretToken?: SortOrderInput | SortOrder
    secretLastFour?: SortOrderInput | SortOrder
    isDefault?: SortOrder
    status?: SortOrder
    scopes?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    linkedAccounts?: LinkedAccountOrderByRelationAggregateInput
    repositories?: LinkedRepositoryOrderByRelationAggregateInput
  }

  export type ConnectionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConnectionWhereInput | ConnectionWhereInput[]
    OR?: ConnectionWhereInput[]
    NOT?: ConnectionWhereInput | ConnectionWhereInput[]
    name?: StringFilter<"Connection"> | string
    provider?: StringFilter<"Connection"> | string
    authMethod?: StringFilter<"Connection"> | string
    providerAccountName?: StringFilter<"Connection"> | string
    providerUrl?: StringFilter<"Connection"> | string
    secretToken?: StringNullableFilter<"Connection"> | string | null
    secretLastFour?: StringNullableFilter<"Connection"> | string | null
    isDefault?: BoolFilter<"Connection"> | boolean
    status?: StringFilter<"Connection"> | string
    scopes?: StringNullableListFilter<"Connection">
    expiresAt?: DateTimeNullableFilter<"Connection"> | Date | string | null
    createdAt?: DateTimeFilter<"Connection"> | Date | string
    updatedAt?: DateTimeFilter<"Connection"> | Date | string
    linkedAccounts?: LinkedAccountListRelationFilter
    repositories?: LinkedRepositoryListRelationFilter
  }, "id">

  export type ConnectionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    providerAccountName?: SortOrder
    providerUrl?: SortOrder
    secretToken?: SortOrderInput | SortOrder
    secretLastFour?: SortOrderInput | SortOrder
    isDefault?: SortOrder
    status?: SortOrder
    scopes?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ConnectionCountOrderByAggregateInput
    _max?: ConnectionMaxOrderByAggregateInput
    _min?: ConnectionMinOrderByAggregateInput
  }

  export type ConnectionScalarWhereWithAggregatesInput = {
    AND?: ConnectionScalarWhereWithAggregatesInput | ConnectionScalarWhereWithAggregatesInput[]
    OR?: ConnectionScalarWhereWithAggregatesInput[]
    NOT?: ConnectionScalarWhereWithAggregatesInput | ConnectionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Connection"> | string
    name?: StringWithAggregatesFilter<"Connection"> | string
    provider?: StringWithAggregatesFilter<"Connection"> | string
    authMethod?: StringWithAggregatesFilter<"Connection"> | string
    providerAccountName?: StringWithAggregatesFilter<"Connection"> | string
    providerUrl?: StringWithAggregatesFilter<"Connection"> | string
    secretToken?: StringNullableWithAggregatesFilter<"Connection"> | string | null
    secretLastFour?: StringNullableWithAggregatesFilter<"Connection"> | string | null
    isDefault?: BoolWithAggregatesFilter<"Connection"> | boolean
    status?: StringWithAggregatesFilter<"Connection"> | string
    scopes?: StringNullableListFilter<"Connection">
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Connection"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Connection"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Connection"> | Date | string
  }

  export type LinkedAccountWhereInput = {
    AND?: LinkedAccountWhereInput | LinkedAccountWhereInput[]
    OR?: LinkedAccountWhereInput[]
    NOT?: LinkedAccountWhereInput | LinkedAccountWhereInput[]
    id?: StringFilter<"LinkedAccount"> | string
    displayName?: StringFilter<"LinkedAccount"> | string
    providerUsername?: StringFilter<"LinkedAccount"> | string
    email?: StringFilter<"LinkedAccount"> | string
    provider?: StringFilter<"LinkedAccount"> | string
    authMethod?: StringFilter<"LinkedAccount"> | string
    status?: StringFilter<"LinkedAccount"> | string
    avatarUrl?: StringNullableFilter<"LinkedAccount"> | string | null
    connectionId?: StringNullableFilter<"LinkedAccount"> | string | null
    expiresAt?: DateTimeNullableFilter<"LinkedAccount"> | Date | string | null
    lastUsedAt?: DateTimeNullableFilter<"LinkedAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"LinkedAccount"> | Date | string
    connection?: XOR<ConnectionNullableScalarRelationFilter, ConnectionWhereInput> | null
    assumedByRepos?: LinkedRepositoryListRelationFilter
  }

  export type LinkedAccountOrderByWithRelationInput = {
    id?: SortOrder
    displayName?: SortOrder
    providerUsername?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    status?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    connectionId?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    connection?: ConnectionOrderByWithRelationInput
    assumedByRepos?: LinkedRepositoryOrderByRelationAggregateInput
  }

  export type LinkedAccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LinkedAccountWhereInput | LinkedAccountWhereInput[]
    OR?: LinkedAccountWhereInput[]
    NOT?: LinkedAccountWhereInput | LinkedAccountWhereInput[]
    displayName?: StringFilter<"LinkedAccount"> | string
    providerUsername?: StringFilter<"LinkedAccount"> | string
    email?: StringFilter<"LinkedAccount"> | string
    provider?: StringFilter<"LinkedAccount"> | string
    authMethod?: StringFilter<"LinkedAccount"> | string
    status?: StringFilter<"LinkedAccount"> | string
    avatarUrl?: StringNullableFilter<"LinkedAccount"> | string | null
    connectionId?: StringNullableFilter<"LinkedAccount"> | string | null
    expiresAt?: DateTimeNullableFilter<"LinkedAccount"> | Date | string | null
    lastUsedAt?: DateTimeNullableFilter<"LinkedAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"LinkedAccount"> | Date | string
    connection?: XOR<ConnectionNullableScalarRelationFilter, ConnectionWhereInput> | null
    assumedByRepos?: LinkedRepositoryListRelationFilter
  }, "id">

  export type LinkedAccountOrderByWithAggregationInput = {
    id?: SortOrder
    displayName?: SortOrder
    providerUsername?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    status?: SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    connectionId?: SortOrderInput | SortOrder
    expiresAt?: SortOrderInput | SortOrder
    lastUsedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LinkedAccountCountOrderByAggregateInput
    _max?: LinkedAccountMaxOrderByAggregateInput
    _min?: LinkedAccountMinOrderByAggregateInput
  }

  export type LinkedAccountScalarWhereWithAggregatesInput = {
    AND?: LinkedAccountScalarWhereWithAggregatesInput | LinkedAccountScalarWhereWithAggregatesInput[]
    OR?: LinkedAccountScalarWhereWithAggregatesInput[]
    NOT?: LinkedAccountScalarWhereWithAggregatesInput | LinkedAccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LinkedAccount"> | string
    displayName?: StringWithAggregatesFilter<"LinkedAccount"> | string
    providerUsername?: StringWithAggregatesFilter<"LinkedAccount"> | string
    email?: StringWithAggregatesFilter<"LinkedAccount"> | string
    provider?: StringWithAggregatesFilter<"LinkedAccount"> | string
    authMethod?: StringWithAggregatesFilter<"LinkedAccount"> | string
    status?: StringWithAggregatesFilter<"LinkedAccount"> | string
    avatarUrl?: StringNullableWithAggregatesFilter<"LinkedAccount"> | string | null
    connectionId?: StringNullableWithAggregatesFilter<"LinkedAccount"> | string | null
    expiresAt?: DateTimeNullableWithAggregatesFilter<"LinkedAccount"> | Date | string | null
    lastUsedAt?: DateTimeNullableWithAggregatesFilter<"LinkedAccount"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LinkedAccount"> | Date | string
  }

  export type LinkedRepositoryWhereInput = {
    AND?: LinkedRepositoryWhereInput | LinkedRepositoryWhereInput[]
    OR?: LinkedRepositoryWhereInput[]
    NOT?: LinkedRepositoryWhereInput | LinkedRepositoryWhereInput[]
    id?: StringFilter<"LinkedRepository"> | string
    name?: StringFilter<"LinkedRepository"> | string
    fullName?: StringFilter<"LinkedRepository"> | string
    provider?: StringFilter<"LinkedRepository"> | string
    connectionId?: StringFilter<"LinkedRepository"> | string
    defaultBranch?: StringFilter<"LinkedRepository"> | string
    identityMode?: StringFilter<"LinkedRepository"> | string
    assumeAccountId?: StringNullableFilter<"LinkedRepository"> | string | null
    indexEnabled?: BoolFilter<"LinkedRepository"> | boolean
    defaultReviewer?: StringNullableFilter<"LinkedRepository"> | string | null
    webhookActive?: BoolFilter<"LinkedRepository"> | boolean
    createdAt?: DateTimeFilter<"LinkedRepository"> | Date | string
    updatedAt?: DateTimeFilter<"LinkedRepository"> | Date | string
    connection?: XOR<ConnectionScalarRelationFilter, ConnectionWhereInput>
    assumeAccount?: XOR<LinkedAccountNullableScalarRelationFilter, LinkedAccountWhereInput> | null
    webhooks?: WebhookConfigListRelationFilter
  }

  export type LinkedRepositoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    fullName?: SortOrder
    provider?: SortOrder
    connectionId?: SortOrder
    defaultBranch?: SortOrder
    identityMode?: SortOrder
    assumeAccountId?: SortOrderInput | SortOrder
    indexEnabled?: SortOrder
    defaultReviewer?: SortOrderInput | SortOrder
    webhookActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    connection?: ConnectionOrderByWithRelationInput
    assumeAccount?: LinkedAccountOrderByWithRelationInput
    webhooks?: WebhookConfigOrderByRelationAggregateInput
  }

  export type LinkedRepositoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LinkedRepositoryWhereInput | LinkedRepositoryWhereInput[]
    OR?: LinkedRepositoryWhereInput[]
    NOT?: LinkedRepositoryWhereInput | LinkedRepositoryWhereInput[]
    name?: StringFilter<"LinkedRepository"> | string
    fullName?: StringFilter<"LinkedRepository"> | string
    provider?: StringFilter<"LinkedRepository"> | string
    connectionId?: StringFilter<"LinkedRepository"> | string
    defaultBranch?: StringFilter<"LinkedRepository"> | string
    identityMode?: StringFilter<"LinkedRepository"> | string
    assumeAccountId?: StringNullableFilter<"LinkedRepository"> | string | null
    indexEnabled?: BoolFilter<"LinkedRepository"> | boolean
    defaultReviewer?: StringNullableFilter<"LinkedRepository"> | string | null
    webhookActive?: BoolFilter<"LinkedRepository"> | boolean
    createdAt?: DateTimeFilter<"LinkedRepository"> | Date | string
    updatedAt?: DateTimeFilter<"LinkedRepository"> | Date | string
    connection?: XOR<ConnectionScalarRelationFilter, ConnectionWhereInput>
    assumeAccount?: XOR<LinkedAccountNullableScalarRelationFilter, LinkedAccountWhereInput> | null
    webhooks?: WebhookConfigListRelationFilter
  }, "id">

  export type LinkedRepositoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    fullName?: SortOrder
    provider?: SortOrder
    connectionId?: SortOrder
    defaultBranch?: SortOrder
    identityMode?: SortOrder
    assumeAccountId?: SortOrderInput | SortOrder
    indexEnabled?: SortOrder
    defaultReviewer?: SortOrderInput | SortOrder
    webhookActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LinkedRepositoryCountOrderByAggregateInput
    _max?: LinkedRepositoryMaxOrderByAggregateInput
    _min?: LinkedRepositoryMinOrderByAggregateInput
  }

  export type LinkedRepositoryScalarWhereWithAggregatesInput = {
    AND?: LinkedRepositoryScalarWhereWithAggregatesInput | LinkedRepositoryScalarWhereWithAggregatesInput[]
    OR?: LinkedRepositoryScalarWhereWithAggregatesInput[]
    NOT?: LinkedRepositoryScalarWhereWithAggregatesInput | LinkedRepositoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LinkedRepository"> | string
    name?: StringWithAggregatesFilter<"LinkedRepository"> | string
    fullName?: StringWithAggregatesFilter<"LinkedRepository"> | string
    provider?: StringWithAggregatesFilter<"LinkedRepository"> | string
    connectionId?: StringWithAggregatesFilter<"LinkedRepository"> | string
    defaultBranch?: StringWithAggregatesFilter<"LinkedRepository"> | string
    identityMode?: StringWithAggregatesFilter<"LinkedRepository"> | string
    assumeAccountId?: StringNullableWithAggregatesFilter<"LinkedRepository"> | string | null
    indexEnabled?: BoolWithAggregatesFilter<"LinkedRepository"> | boolean
    defaultReviewer?: StringNullableWithAggregatesFilter<"LinkedRepository"> | string | null
    webhookActive?: BoolWithAggregatesFilter<"LinkedRepository"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"LinkedRepository"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LinkedRepository"> | Date | string
  }

  export type WebhookConfigWhereInput = {
    AND?: WebhookConfigWhereInput | WebhookConfigWhereInput[]
    OR?: WebhookConfigWhereInput[]
    NOT?: WebhookConfigWhereInput | WebhookConfigWhereInput[]
    id?: StringFilter<"WebhookConfig"> | string
    repositoryId?: StringFilter<"WebhookConfig"> | string
    event?: StringFilter<"WebhookConfig"> | string
    endpointPath?: StringFilter<"WebhookConfig"> | string
    active?: BoolFilter<"WebhookConfig"> | boolean
    secretConfigured?: BoolFilter<"WebhookConfig"> | boolean
    lastTriggeredAt?: DateTimeNullableFilter<"WebhookConfig"> | Date | string | null
    createdAt?: DateTimeFilter<"WebhookConfig"> | Date | string
    repository?: XOR<LinkedRepositoryScalarRelationFilter, LinkedRepositoryWhereInput>
  }

  export type WebhookConfigOrderByWithRelationInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    event?: SortOrder
    endpointPath?: SortOrder
    active?: SortOrder
    secretConfigured?: SortOrder
    lastTriggeredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    repository?: LinkedRepositoryOrderByWithRelationInput
  }

  export type WebhookConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: WebhookConfigWhereInput | WebhookConfigWhereInput[]
    OR?: WebhookConfigWhereInput[]
    NOT?: WebhookConfigWhereInput | WebhookConfigWhereInput[]
    repositoryId?: StringFilter<"WebhookConfig"> | string
    event?: StringFilter<"WebhookConfig"> | string
    endpointPath?: StringFilter<"WebhookConfig"> | string
    active?: BoolFilter<"WebhookConfig"> | boolean
    secretConfigured?: BoolFilter<"WebhookConfig"> | boolean
    lastTriggeredAt?: DateTimeNullableFilter<"WebhookConfig"> | Date | string | null
    createdAt?: DateTimeFilter<"WebhookConfig"> | Date | string
    repository?: XOR<LinkedRepositoryScalarRelationFilter, LinkedRepositoryWhereInput>
  }, "id">

  export type WebhookConfigOrderByWithAggregationInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    event?: SortOrder
    endpointPath?: SortOrder
    active?: SortOrder
    secretConfigured?: SortOrder
    lastTriggeredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: WebhookConfigCountOrderByAggregateInput
    _max?: WebhookConfigMaxOrderByAggregateInput
    _min?: WebhookConfigMinOrderByAggregateInput
  }

  export type WebhookConfigScalarWhereWithAggregatesInput = {
    AND?: WebhookConfigScalarWhereWithAggregatesInput | WebhookConfigScalarWhereWithAggregatesInput[]
    OR?: WebhookConfigScalarWhereWithAggregatesInput[]
    NOT?: WebhookConfigScalarWhereWithAggregatesInput | WebhookConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WebhookConfig"> | string
    repositoryId?: StringWithAggregatesFilter<"WebhookConfig"> | string
    event?: StringWithAggregatesFilter<"WebhookConfig"> | string
    endpointPath?: StringWithAggregatesFilter<"WebhookConfig"> | string
    active?: BoolWithAggregatesFilter<"WebhookConfig"> | boolean
    secretConfigured?: BoolWithAggregatesFilter<"WebhookConfig"> | boolean
    lastTriggeredAt?: DateTimeNullableWithAggregatesFilter<"WebhookConfig"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WebhookConfig"> | Date | string
  }

  export type MaskingRuleWhereInput = {
    AND?: MaskingRuleWhereInput | MaskingRuleWhereInput[]
    OR?: MaskingRuleWhereInput[]
    NOT?: MaskingRuleWhereInput | MaskingRuleWhereInput[]
    id?: StringFilter<"MaskingRule"> | string
    pattern?: StringFilter<"MaskingRule"> | string
    description?: StringFilter<"MaskingRule"> | string
    enabled?: BoolFilter<"MaskingRule"> | boolean
    builtIn?: BoolFilter<"MaskingRule"> | boolean
    regex?: StringNullableFilter<"MaskingRule"> | string | null
    createdAt?: DateTimeFilter<"MaskingRule"> | Date | string
  }

  export type MaskingRuleOrderByWithRelationInput = {
    id?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    builtIn?: SortOrder
    regex?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type MaskingRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaskingRuleWhereInput | MaskingRuleWhereInput[]
    OR?: MaskingRuleWhereInput[]
    NOT?: MaskingRuleWhereInput | MaskingRuleWhereInput[]
    pattern?: StringFilter<"MaskingRule"> | string
    description?: StringFilter<"MaskingRule"> | string
    enabled?: BoolFilter<"MaskingRule"> | boolean
    builtIn?: BoolFilter<"MaskingRule"> | boolean
    regex?: StringNullableFilter<"MaskingRule"> | string | null
    createdAt?: DateTimeFilter<"MaskingRule"> | Date | string
  }, "id">

  export type MaskingRuleOrderByWithAggregationInput = {
    id?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    builtIn?: SortOrder
    regex?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: MaskingRuleCountOrderByAggregateInput
    _max?: MaskingRuleMaxOrderByAggregateInput
    _min?: MaskingRuleMinOrderByAggregateInput
  }

  export type MaskingRuleScalarWhereWithAggregatesInput = {
    AND?: MaskingRuleScalarWhereWithAggregatesInput | MaskingRuleScalarWhereWithAggregatesInput[]
    OR?: MaskingRuleScalarWhereWithAggregatesInput[]
    NOT?: MaskingRuleScalarWhereWithAggregatesInput | MaskingRuleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MaskingRule"> | string
    pattern?: StringWithAggregatesFilter<"MaskingRule"> | string
    description?: StringWithAggregatesFilter<"MaskingRule"> | string
    enabled?: BoolWithAggregatesFilter<"MaskingRule"> | boolean
    builtIn?: BoolWithAggregatesFilter<"MaskingRule"> | boolean
    regex?: StringNullableWithAggregatesFilter<"MaskingRule"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"MaskingRule"> | Date | string
  }

  export type WorkItemWhereInput = {
    AND?: WorkItemWhereInput | WorkItemWhereInput[]
    OR?: WorkItemWhereInput[]
    NOT?: WorkItemWhereInput | WorkItemWhereInput[]
    id?: StringFilter<"WorkItem"> | string
    azureId?: IntFilter<"WorkItem"> | number
    title?: StringFilter<"WorkItem"> | string
    description?: StringFilter<"WorkItem"> | string
    userQuery?: StringNullableFilter<"WorkItem"> | string | null
    type?: StringFilter<"WorkItem"> | string
    status?: StringFilter<"WorkItem"> | string
    assignedTo?: StringNullableFilter<"WorkItem"> | string | null
    repositoryFullName?: StringNullableFilter<"WorkItem"> | string | null
    targetBranch?: StringNullableFilter<"WorkItem"> | string | null
    linkedRunId?: StringNullableFilter<"WorkItem"> | string | null
    linkedPRId?: StringNullableFilter<"WorkItem"> | string | null
    createdAt?: DateTimeFilter<"WorkItem"> | Date | string
    updatedAt?: DateTimeFilter<"WorkItem"> | Date | string
    agentRuns?: AgentRunListRelationFilter
    pullRequests?: PullRequestListRelationFilter
  }

  export type WorkItemOrderByWithRelationInput = {
    id?: SortOrder
    azureId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    userQuery?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    assignedTo?: SortOrderInput | SortOrder
    repositoryFullName?: SortOrderInput | SortOrder
    targetBranch?: SortOrderInput | SortOrder
    linkedRunId?: SortOrderInput | SortOrder
    linkedPRId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    agentRuns?: AgentRunOrderByRelationAggregateInput
    pullRequests?: PullRequestOrderByRelationAggregateInput
  }

  export type WorkItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    azureId?: number
    AND?: WorkItemWhereInput | WorkItemWhereInput[]
    OR?: WorkItemWhereInput[]
    NOT?: WorkItemWhereInput | WorkItemWhereInput[]
    title?: StringFilter<"WorkItem"> | string
    description?: StringFilter<"WorkItem"> | string
    userQuery?: StringNullableFilter<"WorkItem"> | string | null
    type?: StringFilter<"WorkItem"> | string
    status?: StringFilter<"WorkItem"> | string
    assignedTo?: StringNullableFilter<"WorkItem"> | string | null
    repositoryFullName?: StringNullableFilter<"WorkItem"> | string | null
    targetBranch?: StringNullableFilter<"WorkItem"> | string | null
    linkedRunId?: StringNullableFilter<"WorkItem"> | string | null
    linkedPRId?: StringNullableFilter<"WorkItem"> | string | null
    createdAt?: DateTimeFilter<"WorkItem"> | Date | string
    updatedAt?: DateTimeFilter<"WorkItem"> | Date | string
    agentRuns?: AgentRunListRelationFilter
    pullRequests?: PullRequestListRelationFilter
  }, "id" | "azureId">

  export type WorkItemOrderByWithAggregationInput = {
    id?: SortOrder
    azureId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    userQuery?: SortOrderInput | SortOrder
    type?: SortOrder
    status?: SortOrder
    assignedTo?: SortOrderInput | SortOrder
    repositoryFullName?: SortOrderInput | SortOrder
    targetBranch?: SortOrderInput | SortOrder
    linkedRunId?: SortOrderInput | SortOrder
    linkedPRId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: WorkItemCountOrderByAggregateInput
    _avg?: WorkItemAvgOrderByAggregateInput
    _max?: WorkItemMaxOrderByAggregateInput
    _min?: WorkItemMinOrderByAggregateInput
    _sum?: WorkItemSumOrderByAggregateInput
  }

  export type WorkItemScalarWhereWithAggregatesInput = {
    AND?: WorkItemScalarWhereWithAggregatesInput | WorkItemScalarWhereWithAggregatesInput[]
    OR?: WorkItemScalarWhereWithAggregatesInput[]
    NOT?: WorkItemScalarWhereWithAggregatesInput | WorkItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"WorkItem"> | string
    azureId?: IntWithAggregatesFilter<"WorkItem"> | number
    title?: StringWithAggregatesFilter<"WorkItem"> | string
    description?: StringWithAggregatesFilter<"WorkItem"> | string
    userQuery?: StringNullableWithAggregatesFilter<"WorkItem"> | string | null
    type?: StringWithAggregatesFilter<"WorkItem"> | string
    status?: StringWithAggregatesFilter<"WorkItem"> | string
    assignedTo?: StringNullableWithAggregatesFilter<"WorkItem"> | string | null
    repositoryFullName?: StringNullableWithAggregatesFilter<"WorkItem"> | string | null
    targetBranch?: StringNullableWithAggregatesFilter<"WorkItem"> | string | null
    linkedRunId?: StringNullableWithAggregatesFilter<"WorkItem"> | string | null
    linkedPRId?: StringNullableWithAggregatesFilter<"WorkItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"WorkItem"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"WorkItem"> | Date | string
  }

  export type AgentRunWhereInput = {
    AND?: AgentRunWhereInput | AgentRunWhereInput[]
    OR?: AgentRunWhereInput[]
    NOT?: AgentRunWhereInput | AgentRunWhereInput[]
    id?: StringFilter<"AgentRun"> | string
    workItemId?: StringNullableFilter<"AgentRun"> | string | null
    repositoryFullName?: StringNullableFilter<"AgentRun"> | string | null
    userQuery?: StringNullableFilter<"AgentRun"> | string | null
    status?: StringFilter<"AgentRun"> | string
    branchName?: StringNullableFilter<"AgentRun"> | string | null
    prId?: StringNullableFilter<"AgentRun"> | string | null
    error?: StringNullableFilter<"AgentRun"> | string | null
    planSummary?: StringNullableFilter<"AgentRun"> | string | null
    planFiles?: JsonNullableFilter<"AgentRun">
    totalPromptTokens?: IntNullableFilter<"AgentRun"> | number | null
    totalCompletionTokens?: IntNullableFilter<"AgentRun"> | number | null
    totalTokens?: IntNullableFilter<"AgentRun"> | number | null
    currentIteration?: IntNullableFilter<"AgentRun"> | number | null
    maxIterations?: IntNullableFilter<"AgentRun"> | number | null
    lastChanges?: JsonNullableFilter<"AgentRun">
    startedAt?: DateTimeFilter<"AgentRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"AgentRun"> | Date | string | null
    workItem?: XOR<WorkItemNullableScalarRelationFilter, WorkItemWhereInput> | null
    steps?: AgentStepListRelationFilter
    pullRequests?: PullRequestListRelationFilter
  }

  export type AgentRunOrderByWithRelationInput = {
    id?: SortOrder
    workItemId?: SortOrderInput | SortOrder
    repositoryFullName?: SortOrderInput | SortOrder
    userQuery?: SortOrderInput | SortOrder
    status?: SortOrder
    branchName?: SortOrderInput | SortOrder
    prId?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    planSummary?: SortOrderInput | SortOrder
    planFiles?: SortOrderInput | SortOrder
    totalPromptTokens?: SortOrderInput | SortOrder
    totalCompletionTokens?: SortOrderInput | SortOrder
    totalTokens?: SortOrderInput | SortOrder
    currentIteration?: SortOrderInput | SortOrder
    maxIterations?: SortOrderInput | SortOrder
    lastChanges?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    workItem?: WorkItemOrderByWithRelationInput
    steps?: AgentStepOrderByRelationAggregateInput
    pullRequests?: PullRequestOrderByRelationAggregateInput
  }

  export type AgentRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentRunWhereInput | AgentRunWhereInput[]
    OR?: AgentRunWhereInput[]
    NOT?: AgentRunWhereInput | AgentRunWhereInput[]
    workItemId?: StringNullableFilter<"AgentRun"> | string | null
    repositoryFullName?: StringNullableFilter<"AgentRun"> | string | null
    userQuery?: StringNullableFilter<"AgentRun"> | string | null
    status?: StringFilter<"AgentRun"> | string
    branchName?: StringNullableFilter<"AgentRun"> | string | null
    prId?: StringNullableFilter<"AgentRun"> | string | null
    error?: StringNullableFilter<"AgentRun"> | string | null
    planSummary?: StringNullableFilter<"AgentRun"> | string | null
    planFiles?: JsonNullableFilter<"AgentRun">
    totalPromptTokens?: IntNullableFilter<"AgentRun"> | number | null
    totalCompletionTokens?: IntNullableFilter<"AgentRun"> | number | null
    totalTokens?: IntNullableFilter<"AgentRun"> | number | null
    currentIteration?: IntNullableFilter<"AgentRun"> | number | null
    maxIterations?: IntNullableFilter<"AgentRun"> | number | null
    lastChanges?: JsonNullableFilter<"AgentRun">
    startedAt?: DateTimeFilter<"AgentRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"AgentRun"> | Date | string | null
    workItem?: XOR<WorkItemNullableScalarRelationFilter, WorkItemWhereInput> | null
    steps?: AgentStepListRelationFilter
    pullRequests?: PullRequestListRelationFilter
  }, "id">

  export type AgentRunOrderByWithAggregationInput = {
    id?: SortOrder
    workItemId?: SortOrderInput | SortOrder
    repositoryFullName?: SortOrderInput | SortOrder
    userQuery?: SortOrderInput | SortOrder
    status?: SortOrder
    branchName?: SortOrderInput | SortOrder
    prId?: SortOrderInput | SortOrder
    error?: SortOrderInput | SortOrder
    planSummary?: SortOrderInput | SortOrder
    planFiles?: SortOrderInput | SortOrder
    totalPromptTokens?: SortOrderInput | SortOrder
    totalCompletionTokens?: SortOrderInput | SortOrder
    totalTokens?: SortOrderInput | SortOrder
    currentIteration?: SortOrderInput | SortOrder
    maxIterations?: SortOrderInput | SortOrder
    lastChanges?: SortOrderInput | SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrderInput | SortOrder
    _count?: AgentRunCountOrderByAggregateInput
    _avg?: AgentRunAvgOrderByAggregateInput
    _max?: AgentRunMaxOrderByAggregateInput
    _min?: AgentRunMinOrderByAggregateInput
    _sum?: AgentRunSumOrderByAggregateInput
  }

  export type AgentRunScalarWhereWithAggregatesInput = {
    AND?: AgentRunScalarWhereWithAggregatesInput | AgentRunScalarWhereWithAggregatesInput[]
    OR?: AgentRunScalarWhereWithAggregatesInput[]
    NOT?: AgentRunScalarWhereWithAggregatesInput | AgentRunScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentRun"> | string
    workItemId?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    repositoryFullName?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    userQuery?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    status?: StringWithAggregatesFilter<"AgentRun"> | string
    branchName?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    prId?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    error?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    planSummary?: StringNullableWithAggregatesFilter<"AgentRun"> | string | null
    planFiles?: JsonNullableWithAggregatesFilter<"AgentRun">
    totalPromptTokens?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    totalCompletionTokens?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    totalTokens?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    currentIteration?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    maxIterations?: IntNullableWithAggregatesFilter<"AgentRun"> | number | null
    lastChanges?: JsonNullableWithAggregatesFilter<"AgentRun">
    startedAt?: DateTimeWithAggregatesFilter<"AgentRun"> | Date | string
    completedAt?: DateTimeNullableWithAggregatesFilter<"AgentRun"> | Date | string | null
  }

  export type AgentStepWhereInput = {
    AND?: AgentStepWhereInput | AgentStepWhereInput[]
    OR?: AgentStepWhereInput[]
    NOT?: AgentStepWhereInput | AgentStepWhereInput[]
    id?: StringFilter<"AgentStep"> | string
    runId?: StringFilter<"AgentStep"> | string
    type?: StringFilter<"AgentStep"> | string
    status?: StringFilter<"AgentStep"> | string
    label?: StringFilter<"AgentStep"> | string
    detail?: StringNullableFilter<"AgentStep"> | string | null
    order?: IntFilter<"AgentStep"> | number
    durationMs?: IntNullableFilter<"AgentStep"> | number | null
    timestamp?: DateTimeFilter<"AgentStep"> | Date | string
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }

  export type AgentStepOrderByWithRelationInput = {
    id?: SortOrder
    runId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    label?: SortOrder
    detail?: SortOrderInput | SortOrder
    order?: SortOrder
    durationMs?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    run?: AgentRunOrderByWithRelationInput
  }

  export type AgentStepWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AgentStepWhereInput | AgentStepWhereInput[]
    OR?: AgentStepWhereInput[]
    NOT?: AgentStepWhereInput | AgentStepWhereInput[]
    runId?: StringFilter<"AgentStep"> | string
    type?: StringFilter<"AgentStep"> | string
    status?: StringFilter<"AgentStep"> | string
    label?: StringFilter<"AgentStep"> | string
    detail?: StringNullableFilter<"AgentStep"> | string | null
    order?: IntFilter<"AgentStep"> | number
    durationMs?: IntNullableFilter<"AgentStep"> | number | null
    timestamp?: DateTimeFilter<"AgentStep"> | Date | string
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }, "id">

  export type AgentStepOrderByWithAggregationInput = {
    id?: SortOrder
    runId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    label?: SortOrder
    detail?: SortOrderInput | SortOrder
    order?: SortOrder
    durationMs?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    _count?: AgentStepCountOrderByAggregateInput
    _avg?: AgentStepAvgOrderByAggregateInput
    _max?: AgentStepMaxOrderByAggregateInput
    _min?: AgentStepMinOrderByAggregateInput
    _sum?: AgentStepSumOrderByAggregateInput
  }

  export type AgentStepScalarWhereWithAggregatesInput = {
    AND?: AgentStepScalarWhereWithAggregatesInput | AgentStepScalarWhereWithAggregatesInput[]
    OR?: AgentStepScalarWhereWithAggregatesInput[]
    NOT?: AgentStepScalarWhereWithAggregatesInput | AgentStepScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AgentStep"> | string
    runId?: StringWithAggregatesFilter<"AgentStep"> | string
    type?: StringWithAggregatesFilter<"AgentStep"> | string
    status?: StringWithAggregatesFilter<"AgentStep"> | string
    label?: StringWithAggregatesFilter<"AgentStep"> | string
    detail?: StringNullableWithAggregatesFilter<"AgentStep"> | string | null
    order?: IntWithAggregatesFilter<"AgentStep"> | number
    durationMs?: IntNullableWithAggregatesFilter<"AgentStep"> | number | null
    timestamp?: DateTimeWithAggregatesFilter<"AgentStep"> | Date | string
  }

  export type PullRequestWhereInput = {
    AND?: PullRequestWhereInput | PullRequestWhereInput[]
    OR?: PullRequestWhereInput[]
    NOT?: PullRequestWhereInput | PullRequestWhereInput[]
    id?: StringFilter<"PullRequest"> | string
    prNumber?: IntNullableFilter<"PullRequest"> | number | null
    azurePRId?: IntNullableFilter<"PullRequest"> | number | null
    title?: StringFilter<"PullRequest"> | string
    sourceBranch?: StringFilter<"PullRequest"> | string
    targetBranch?: StringFilter<"PullRequest"> | string
    status?: StringFilter<"PullRequest"> | string
    reviewerAlias?: StringNullableFilter<"PullRequest"> | string | null
    rejectionComment?: StringNullableFilter<"PullRequest"> | string | null
    workItemId?: StringNullableFilter<"PullRequest"> | string | null
    runId?: StringFilter<"PullRequest"> | string
    url?: StringFilter<"PullRequest"> | string
    repositoryFullName?: StringNullableFilter<"PullRequest"> | string | null
    createdAt?: DateTimeFilter<"PullRequest"> | Date | string
    updatedAt?: DateTimeFilter<"PullRequest"> | Date | string
    workItem?: XOR<WorkItemNullableScalarRelationFilter, WorkItemWhereInput> | null
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }

  export type PullRequestOrderByWithRelationInput = {
    id?: SortOrder
    prNumber?: SortOrderInput | SortOrder
    azurePRId?: SortOrderInput | SortOrder
    title?: SortOrder
    sourceBranch?: SortOrder
    targetBranch?: SortOrder
    status?: SortOrder
    reviewerAlias?: SortOrderInput | SortOrder
    rejectionComment?: SortOrderInput | SortOrder
    workItemId?: SortOrderInput | SortOrder
    runId?: SortOrder
    url?: SortOrder
    repositoryFullName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    workItem?: WorkItemOrderByWithRelationInput
    run?: AgentRunOrderByWithRelationInput
  }

  export type PullRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    azurePRId?: number
    AND?: PullRequestWhereInput | PullRequestWhereInput[]
    OR?: PullRequestWhereInput[]
    NOT?: PullRequestWhereInput | PullRequestWhereInput[]
    prNumber?: IntNullableFilter<"PullRequest"> | number | null
    title?: StringFilter<"PullRequest"> | string
    sourceBranch?: StringFilter<"PullRequest"> | string
    targetBranch?: StringFilter<"PullRequest"> | string
    status?: StringFilter<"PullRequest"> | string
    reviewerAlias?: StringNullableFilter<"PullRequest"> | string | null
    rejectionComment?: StringNullableFilter<"PullRequest"> | string | null
    workItemId?: StringNullableFilter<"PullRequest"> | string | null
    runId?: StringFilter<"PullRequest"> | string
    url?: StringFilter<"PullRequest"> | string
    repositoryFullName?: StringNullableFilter<"PullRequest"> | string | null
    createdAt?: DateTimeFilter<"PullRequest"> | Date | string
    updatedAt?: DateTimeFilter<"PullRequest"> | Date | string
    workItem?: XOR<WorkItemNullableScalarRelationFilter, WorkItemWhereInput> | null
    run?: XOR<AgentRunScalarRelationFilter, AgentRunWhereInput>
  }, "id" | "azurePRId">

  export type PullRequestOrderByWithAggregationInput = {
    id?: SortOrder
    prNumber?: SortOrderInput | SortOrder
    azurePRId?: SortOrderInput | SortOrder
    title?: SortOrder
    sourceBranch?: SortOrder
    targetBranch?: SortOrder
    status?: SortOrder
    reviewerAlias?: SortOrderInput | SortOrder
    rejectionComment?: SortOrderInput | SortOrder
    workItemId?: SortOrderInput | SortOrder
    runId?: SortOrder
    url?: SortOrder
    repositoryFullName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PullRequestCountOrderByAggregateInput
    _avg?: PullRequestAvgOrderByAggregateInput
    _max?: PullRequestMaxOrderByAggregateInput
    _min?: PullRequestMinOrderByAggregateInput
    _sum?: PullRequestSumOrderByAggregateInput
  }

  export type PullRequestScalarWhereWithAggregatesInput = {
    AND?: PullRequestScalarWhereWithAggregatesInput | PullRequestScalarWhereWithAggregatesInput[]
    OR?: PullRequestScalarWhereWithAggregatesInput[]
    NOT?: PullRequestScalarWhereWithAggregatesInput | PullRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PullRequest"> | string
    prNumber?: IntNullableWithAggregatesFilter<"PullRequest"> | number | null
    azurePRId?: IntNullableWithAggregatesFilter<"PullRequest"> | number | null
    title?: StringWithAggregatesFilter<"PullRequest"> | string
    sourceBranch?: StringWithAggregatesFilter<"PullRequest"> | string
    targetBranch?: StringWithAggregatesFilter<"PullRequest"> | string
    status?: StringWithAggregatesFilter<"PullRequest"> | string
    reviewerAlias?: StringNullableWithAggregatesFilter<"PullRequest"> | string | null
    rejectionComment?: StringNullableWithAggregatesFilter<"PullRequest"> | string | null
    workItemId?: StringNullableWithAggregatesFilter<"PullRequest"> | string | null
    runId?: StringWithAggregatesFilter<"PullRequest"> | string
    url?: StringWithAggregatesFilter<"PullRequest"> | string
    repositoryFullName?: StringNullableWithAggregatesFilter<"PullRequest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PullRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PullRequest"> | Date | string
  }

  export type IndexStateWhereInput = {
    AND?: IndexStateWhereInput | IndexStateWhereInput[]
    OR?: IndexStateWhereInput[]
    NOT?: IndexStateWhereInput | IndexStateWhereInput[]
    id?: StringFilter<"IndexState"> | string
    tenantId?: StringFilter<"IndexState"> | string
    repository?: StringFilter<"IndexState"> | string
    branch?: StringFilter<"IndexState"> | string
    status?: StringFilter<"IndexState"> | string
    totalFiles?: IntFilter<"IndexState"> | number
    indexedFiles?: IntFilter<"IndexState"> | number
    lastSyncAt?: DateTimeNullableFilter<"IndexState"> | Date | string | null
    createdAt?: DateTimeFilter<"IndexState"> | Date | string
    updatedAt?: DateTimeFilter<"IndexState"> | Date | string
  }

  export type IndexStateOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    repository?: SortOrder
    branch?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    indexedFiles?: SortOrder
    lastSyncAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexStateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_repository_branch?: IndexStateTenantIdRepositoryBranchCompoundUniqueInput
    AND?: IndexStateWhereInput | IndexStateWhereInput[]
    OR?: IndexStateWhereInput[]
    NOT?: IndexStateWhereInput | IndexStateWhereInput[]
    tenantId?: StringFilter<"IndexState"> | string
    repository?: StringFilter<"IndexState"> | string
    branch?: StringFilter<"IndexState"> | string
    status?: StringFilter<"IndexState"> | string
    totalFiles?: IntFilter<"IndexState"> | number
    indexedFiles?: IntFilter<"IndexState"> | number
    lastSyncAt?: DateTimeNullableFilter<"IndexState"> | Date | string | null
    createdAt?: DateTimeFilter<"IndexState"> | Date | string
    updatedAt?: DateTimeFilter<"IndexState"> | Date | string
  }, "id" | "tenantId_repository_branch">

  export type IndexStateOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    repository?: SortOrder
    branch?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    indexedFiles?: SortOrder
    lastSyncAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IndexStateCountOrderByAggregateInput
    _avg?: IndexStateAvgOrderByAggregateInput
    _max?: IndexStateMaxOrderByAggregateInput
    _min?: IndexStateMinOrderByAggregateInput
    _sum?: IndexStateSumOrderByAggregateInput
  }

  export type IndexStateScalarWhereWithAggregatesInput = {
    AND?: IndexStateScalarWhereWithAggregatesInput | IndexStateScalarWhereWithAggregatesInput[]
    OR?: IndexStateScalarWhereWithAggregatesInput[]
    NOT?: IndexStateScalarWhereWithAggregatesInput | IndexStateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"IndexState"> | string
    tenantId?: StringWithAggregatesFilter<"IndexState"> | string
    repository?: StringWithAggregatesFilter<"IndexState"> | string
    branch?: StringWithAggregatesFilter<"IndexState"> | string
    status?: StringWithAggregatesFilter<"IndexState"> | string
    totalFiles?: IntWithAggregatesFilter<"IndexState"> | number
    indexedFiles?: IntWithAggregatesFilter<"IndexState"> | number
    lastSyncAt?: DateTimeNullableWithAggregatesFilter<"IndexState"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"IndexState"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"IndexState"> | Date | string
  }

  export type MaskingAuditEntryWhereInput = {
    AND?: MaskingAuditEntryWhereInput | MaskingAuditEntryWhereInput[]
    OR?: MaskingAuditEntryWhereInput[]
    NOT?: MaskingAuditEntryWhereInput | MaskingAuditEntryWhereInput[]
    id?: StringFilter<"MaskingAuditEntry"> | string
    runId?: StringFilter<"MaskingAuditEntry"> | string
    pattern?: StringFilter<"MaskingAuditEntry"> | string
    matchCount?: IntFilter<"MaskingAuditEntry"> | number
    filesAffected?: StringNullableListFilter<"MaskingAuditEntry">
    timestamp?: DateTimeFilter<"MaskingAuditEntry"> | Date | string
  }

  export type MaskingAuditEntryOrderByWithRelationInput = {
    id?: SortOrder
    runId?: SortOrder
    pattern?: SortOrder
    matchCount?: SortOrder
    filesAffected?: SortOrder
    timestamp?: SortOrder
  }

  export type MaskingAuditEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaskingAuditEntryWhereInput | MaskingAuditEntryWhereInput[]
    OR?: MaskingAuditEntryWhereInput[]
    NOT?: MaskingAuditEntryWhereInput | MaskingAuditEntryWhereInput[]
    runId?: StringFilter<"MaskingAuditEntry"> | string
    pattern?: StringFilter<"MaskingAuditEntry"> | string
    matchCount?: IntFilter<"MaskingAuditEntry"> | number
    filesAffected?: StringNullableListFilter<"MaskingAuditEntry">
    timestamp?: DateTimeFilter<"MaskingAuditEntry"> | Date | string
  }, "id">

  export type MaskingAuditEntryOrderByWithAggregationInput = {
    id?: SortOrder
    runId?: SortOrder
    pattern?: SortOrder
    matchCount?: SortOrder
    filesAffected?: SortOrder
    timestamp?: SortOrder
    _count?: MaskingAuditEntryCountOrderByAggregateInput
    _avg?: MaskingAuditEntryAvgOrderByAggregateInput
    _max?: MaskingAuditEntryMaxOrderByAggregateInput
    _min?: MaskingAuditEntryMinOrderByAggregateInput
    _sum?: MaskingAuditEntrySumOrderByAggregateInput
  }

  export type MaskingAuditEntryScalarWhereWithAggregatesInput = {
    AND?: MaskingAuditEntryScalarWhereWithAggregatesInput | MaskingAuditEntryScalarWhereWithAggregatesInput[]
    OR?: MaskingAuditEntryScalarWhereWithAggregatesInput[]
    NOT?: MaskingAuditEntryScalarWhereWithAggregatesInput | MaskingAuditEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MaskingAuditEntry"> | string
    runId?: StringWithAggregatesFilter<"MaskingAuditEntry"> | string
    pattern?: StringWithAggregatesFilter<"MaskingAuditEntry"> | string
    matchCount?: IntWithAggregatesFilter<"MaskingAuditEntry"> | number
    filesAffected?: StringNullableListFilter<"MaskingAuditEntry">
    timestamp?: DateTimeWithAggregatesFilter<"MaskingAuditEntry"> | Date | string
  }

  export type ConnectionCreateInput = {
    id?: string
    name: string
    provider: string
    authMethod: string
    providerAccountName: string
    providerUrl: string
    secretToken?: string | null
    secretLastFour?: string | null
    isDefault?: boolean
    status: string
    scopes?: ConnectionCreatescopesInput | string[]
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    linkedAccounts?: LinkedAccountCreateNestedManyWithoutConnectionInput
    repositories?: LinkedRepositoryCreateNestedManyWithoutConnectionInput
  }

  export type ConnectionUncheckedCreateInput = {
    id?: string
    name: string
    provider: string
    authMethod: string
    providerAccountName: string
    providerUrl: string
    secretToken?: string | null
    secretLastFour?: string | null
    isDefault?: boolean
    status: string
    scopes?: ConnectionCreatescopesInput | string[]
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    linkedAccounts?: LinkedAccountUncheckedCreateNestedManyWithoutConnectionInput
    repositories?: LinkedRepositoryUncheckedCreateNestedManyWithoutConnectionInput
  }

  export type ConnectionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    providerAccountName?: StringFieldUpdateOperationsInput | string
    providerUrl?: StringFieldUpdateOperationsInput | string
    secretToken?: NullableStringFieldUpdateOperationsInput | string | null
    secretLastFour?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    scopes?: ConnectionUpdatescopesInput | string[]
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    linkedAccounts?: LinkedAccountUpdateManyWithoutConnectionNestedInput
    repositories?: LinkedRepositoryUpdateManyWithoutConnectionNestedInput
  }

  export type ConnectionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    providerAccountName?: StringFieldUpdateOperationsInput | string
    providerUrl?: StringFieldUpdateOperationsInput | string
    secretToken?: NullableStringFieldUpdateOperationsInput | string | null
    secretLastFour?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    scopes?: ConnectionUpdatescopesInput | string[]
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    linkedAccounts?: LinkedAccountUncheckedUpdateManyWithoutConnectionNestedInput
    repositories?: LinkedRepositoryUncheckedUpdateManyWithoutConnectionNestedInput
  }

  export type ConnectionCreateManyInput = {
    id?: string
    name: string
    provider: string
    authMethod: string
    providerAccountName: string
    providerUrl: string
    secretToken?: string | null
    secretLastFour?: string | null
    isDefault?: boolean
    status: string
    scopes?: ConnectionCreatescopesInput | string[]
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ConnectionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    providerAccountName?: StringFieldUpdateOperationsInput | string
    providerUrl?: StringFieldUpdateOperationsInput | string
    secretToken?: NullableStringFieldUpdateOperationsInput | string | null
    secretLastFour?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    scopes?: ConnectionUpdatescopesInput | string[]
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConnectionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    providerAccountName?: StringFieldUpdateOperationsInput | string
    providerUrl?: StringFieldUpdateOperationsInput | string
    secretToken?: NullableStringFieldUpdateOperationsInput | string | null
    secretLastFour?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    scopes?: ConnectionUpdatescopesInput | string[]
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkedAccountCreateInput = {
    id?: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl?: string | null
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    connection?: ConnectionCreateNestedOneWithoutLinkedAccountsInput
    assumedByRepos?: LinkedRepositoryCreateNestedManyWithoutAssumeAccountInput
  }

  export type LinkedAccountUncheckedCreateInput = {
    id?: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl?: string | null
    connectionId?: string | null
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    assumedByRepos?: LinkedRepositoryUncheckedCreateNestedManyWithoutAssumeAccountInput
  }

  export type LinkedAccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    connection?: ConnectionUpdateOneWithoutLinkedAccountsNestedInput
    assumedByRepos?: LinkedRepositoryUpdateManyWithoutAssumeAccountNestedInput
  }

  export type LinkedAccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    connectionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assumedByRepos?: LinkedRepositoryUncheckedUpdateManyWithoutAssumeAccountNestedInput
  }

  export type LinkedAccountCreateManyInput = {
    id?: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl?: string | null
    connectionId?: string | null
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkedAccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkedAccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    connectionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkedRepositoryCreateInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    defaultBranch: string
    identityMode: string
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    connection: ConnectionCreateNestedOneWithoutRepositoriesInput
    assumeAccount?: LinkedAccountCreateNestedOneWithoutAssumedByReposInput
    webhooks?: WebhookConfigCreateNestedManyWithoutRepositoryInput
  }

  export type LinkedRepositoryUncheckedCreateInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    connectionId: string
    defaultBranch: string
    identityMode: string
    assumeAccountId?: string | null
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    webhooks?: WebhookConfigUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type LinkedRepositoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    connection?: ConnectionUpdateOneRequiredWithoutRepositoriesNestedInput
    assumeAccount?: LinkedAccountUpdateOneWithoutAssumedByReposNestedInput
    webhooks?: WebhookConfigUpdateManyWithoutRepositoryNestedInput
  }

  export type LinkedRepositoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    connectionId?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    assumeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    webhooks?: WebhookConfigUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type LinkedRepositoryCreateManyInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    connectionId: string
    defaultBranch: string
    identityMode: string
    assumeAccountId?: string | null
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LinkedRepositoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkedRepositoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    connectionId?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    assumeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookConfigCreateInput = {
    id?: string
    event: string
    endpointPath: string
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: Date | string | null
    createdAt?: Date | string
    repository: LinkedRepositoryCreateNestedOneWithoutWebhooksInput
  }

  export type WebhookConfigUncheckedCreateInput = {
    id?: string
    repositoryId: string
    event: string
    endpointPath: string
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type WebhookConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    endpointPath?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    secretConfigured?: BoolFieldUpdateOperationsInput | boolean
    lastTriggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repository?: LinkedRepositoryUpdateOneRequiredWithoutWebhooksNestedInput
  }

  export type WebhookConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    endpointPath?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    secretConfigured?: BoolFieldUpdateOperationsInput | boolean
    lastTriggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookConfigCreateManyInput = {
    id?: string
    repositoryId: string
    event: string
    endpointPath: string
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type WebhookConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    endpointPath?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    secretConfigured?: BoolFieldUpdateOperationsInput | boolean
    lastTriggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryId?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    endpointPath?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    secretConfigured?: BoolFieldUpdateOperationsInput | boolean
    lastTriggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaskingRuleCreateInput = {
    id?: string
    pattern: string
    description: string
    enabled?: boolean
    builtIn?: boolean
    regex?: string | null
    createdAt?: Date | string
  }

  export type MaskingRuleUncheckedCreateInput = {
    id?: string
    pattern: string
    description: string
    enabled?: boolean
    builtIn?: boolean
    regex?: string | null
    createdAt?: Date | string
  }

  export type MaskingRuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    builtIn?: BoolFieldUpdateOperationsInput | boolean
    regex?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaskingRuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    builtIn?: BoolFieldUpdateOperationsInput | boolean
    regex?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaskingRuleCreateManyInput = {
    id?: string
    pattern: string
    description: string
    enabled?: boolean
    builtIn?: boolean
    regex?: string | null
    createdAt?: Date | string
  }

  export type MaskingRuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    builtIn?: BoolFieldUpdateOperationsInput | boolean
    regex?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaskingRuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    builtIn?: BoolFieldUpdateOperationsInput | boolean
    regex?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkItemCreateInput = {
    id?: string
    azureId: number
    title: string
    description: string
    userQuery?: string | null
    type: string
    status?: string
    assignedTo?: string | null
    repositoryFullName?: string | null
    targetBranch?: string | null
    linkedRunId?: string | null
    linkedPRId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agentRuns?: AgentRunCreateNestedManyWithoutWorkItemInput
    pullRequests?: PullRequestCreateNestedManyWithoutWorkItemInput
  }

  export type WorkItemUncheckedCreateInput = {
    id?: string
    azureId: number
    title: string
    description: string
    userQuery?: string | null
    type: string
    status?: string
    assignedTo?: string | null
    repositoryFullName?: string | null
    targetBranch?: string | null
    linkedRunId?: string | null
    linkedPRId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agentRuns?: AgentRunUncheckedCreateNestedManyWithoutWorkItemInput
    pullRequests?: PullRequestUncheckedCreateNestedManyWithoutWorkItemInput
  }

  export type WorkItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    azureId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    targetBranch?: NullableStringFieldUpdateOperationsInput | string | null
    linkedRunId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedPRId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRuns?: AgentRunUpdateManyWithoutWorkItemNestedInput
    pullRequests?: PullRequestUpdateManyWithoutWorkItemNestedInput
  }

  export type WorkItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    azureId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    targetBranch?: NullableStringFieldUpdateOperationsInput | string | null
    linkedRunId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedPRId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRuns?: AgentRunUncheckedUpdateManyWithoutWorkItemNestedInput
    pullRequests?: PullRequestUncheckedUpdateManyWithoutWorkItemNestedInput
  }

  export type WorkItemCreateManyInput = {
    id?: string
    azureId: number
    title: string
    description: string
    userQuery?: string | null
    type: string
    status?: string
    assignedTo?: string | null
    repositoryFullName?: string | null
    targetBranch?: string | null
    linkedRunId?: string | null
    linkedPRId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type WorkItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    azureId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    targetBranch?: NullableStringFieldUpdateOperationsInput | string | null
    linkedRunId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedPRId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WorkItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    azureId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    targetBranch?: NullableStringFieldUpdateOperationsInput | string | null
    linkedRunId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedPRId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunCreateInput = {
    id?: string
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    workItem?: WorkItemCreateNestedOneWithoutAgentRunsInput
    steps?: AgentStepCreateNestedManyWithoutRunInput
    pullRequests?: PullRequestCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateInput = {
    id?: string
    workItemId?: string | null
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    steps?: AgentStepUncheckedCreateNestedManyWithoutRunInput
    pullRequests?: PullRequestUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    workItem?: WorkItemUpdateOneWithoutAgentRunsNestedInput
    steps?: AgentStepUpdateManyWithoutRunNestedInput
    pullRequests?: PullRequestUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    workItemId?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    steps?: AgentStepUncheckedUpdateManyWithoutRunNestedInput
    pullRequests?: PullRequestUncheckedUpdateManyWithoutRunNestedInput
  }

  export type AgentRunCreateManyInput = {
    id?: string
    workItemId?: string | null
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type AgentRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AgentRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    workItemId?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AgentStepCreateInput = {
    id?: string
    type: string
    status?: string
    label: string
    detail?: string | null
    order?: number
    durationMs?: number | null
    timestamp?: Date | string
    run: AgentRunCreateNestedOneWithoutStepsInput
  }

  export type AgentStepUncheckedCreateInput = {
    id?: string
    runId: string
    type: string
    status?: string
    label: string
    detail?: string | null
    order?: number
    durationMs?: number | null
    timestamp?: Date | string
  }

  export type AgentStepUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    run?: AgentRunUpdateOneRequiredWithoutStepsNestedInput
  }

  export type AgentStepUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentStepCreateManyInput = {
    id?: string
    runId: string
    type: string
    status?: string
    label: string
    detail?: string | null
    order?: number
    durationMs?: number | null
    timestamp?: Date | string
  }

  export type AgentStepUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentStepUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestCreateInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workItem?: WorkItemCreateNestedOneWithoutPullRequestsInput
    run: AgentRunCreateNestedOneWithoutPullRequestsInput
  }

  export type PullRequestUncheckedCreateInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    workItemId?: string | null
    runId: string
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PullRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workItem?: WorkItemUpdateOneWithoutPullRequestsNestedInput
    run?: AgentRunUpdateOneRequiredWithoutPullRequestsNestedInput
  }

  export type PullRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    workItemId?: NullableStringFieldUpdateOperationsInput | string | null
    runId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestCreateManyInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    workItemId?: string | null
    runId: string
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PullRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    workItemId?: NullableStringFieldUpdateOperationsInput | string | null
    runId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexStateCreateInput = {
    id?: string
    tenantId?: string
    repository: string
    branch: string
    status?: string
    totalFiles?: number
    indexedFiles?: number
    lastSyncAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IndexStateUncheckedCreateInput = {
    id?: string
    tenantId?: string
    repository: string
    branch: string
    status?: string
    totalFiles?: number
    indexedFiles?: number
    lastSyncAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IndexStateUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    repository?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalFiles?: IntFieldUpdateOperationsInput | number
    indexedFiles?: IntFieldUpdateOperationsInput | number
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexStateUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    repository?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalFiles?: IntFieldUpdateOperationsInput | number
    indexedFiles?: IntFieldUpdateOperationsInput | number
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexStateCreateManyInput = {
    id?: string
    tenantId?: string
    repository: string
    branch: string
    status?: string
    totalFiles?: number
    indexedFiles?: number
    lastSyncAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IndexStateUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    repository?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalFiles?: IntFieldUpdateOperationsInput | number
    indexedFiles?: IntFieldUpdateOperationsInput | number
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IndexStateUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    repository?: StringFieldUpdateOperationsInput | string
    branch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalFiles?: IntFieldUpdateOperationsInput | number
    indexedFiles?: IntFieldUpdateOperationsInput | number
    lastSyncAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaskingAuditEntryCreateInput = {
    id?: string
    runId: string
    pattern: string
    matchCount: number
    filesAffected?: MaskingAuditEntryCreatefilesAffectedInput | string[]
    timestamp?: Date | string
  }

  export type MaskingAuditEntryUncheckedCreateInput = {
    id?: string
    runId: string
    pattern: string
    matchCount: number
    filesAffected?: MaskingAuditEntryCreatefilesAffectedInput | string[]
    timestamp?: Date | string
  }

  export type MaskingAuditEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    matchCount?: IntFieldUpdateOperationsInput | number
    filesAffected?: MaskingAuditEntryUpdatefilesAffectedInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaskingAuditEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    matchCount?: IntFieldUpdateOperationsInput | number
    filesAffected?: MaskingAuditEntryUpdatefilesAffectedInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaskingAuditEntryCreateManyInput = {
    id?: string
    runId: string
    pattern: string
    matchCount: number
    filesAffected?: MaskingAuditEntryCreatefilesAffectedInput | string[]
    timestamp?: Date | string
  }

  export type MaskingAuditEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    matchCount?: IntFieldUpdateOperationsInput | number
    filesAffected?: MaskingAuditEntryUpdatefilesAffectedInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaskingAuditEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    runId?: StringFieldUpdateOperationsInput | string
    pattern?: StringFieldUpdateOperationsInput | string
    matchCount?: IntFieldUpdateOperationsInput | number
    filesAffected?: MaskingAuditEntryUpdatefilesAffectedInput | string[]
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LinkedAccountListRelationFilter = {
    every?: LinkedAccountWhereInput
    some?: LinkedAccountWhereInput
    none?: LinkedAccountWhereInput
  }

  export type LinkedRepositoryListRelationFilter = {
    every?: LinkedRepositoryWhereInput
    some?: LinkedRepositoryWhereInput
    none?: LinkedRepositoryWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LinkedAccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LinkedRepositoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ConnectionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    providerAccountName?: SortOrder
    providerUrl?: SortOrder
    secretToken?: SortOrder
    secretLastFour?: SortOrder
    isDefault?: SortOrder
    status?: SortOrder
    scopes?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConnectionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    providerAccountName?: SortOrder
    providerUrl?: SortOrder
    secretToken?: SortOrder
    secretLastFour?: SortOrder
    isDefault?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ConnectionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    providerAccountName?: SortOrder
    providerUrl?: SortOrder
    secretToken?: SortOrder
    secretLastFour?: SortOrder
    isDefault?: SortOrder
    status?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type ConnectionNullableScalarRelationFilter = {
    is?: ConnectionWhereInput | null
    isNot?: ConnectionWhereInput | null
  }

  export type LinkedAccountCountOrderByAggregateInput = {
    id?: SortOrder
    displayName?: SortOrder
    providerUsername?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    status?: SortOrder
    avatarUrl?: SortOrder
    connectionId?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LinkedAccountMaxOrderByAggregateInput = {
    id?: SortOrder
    displayName?: SortOrder
    providerUsername?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    status?: SortOrder
    avatarUrl?: SortOrder
    connectionId?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LinkedAccountMinOrderByAggregateInput = {
    id?: SortOrder
    displayName?: SortOrder
    providerUsername?: SortOrder
    email?: SortOrder
    provider?: SortOrder
    authMethod?: SortOrder
    status?: SortOrder
    avatarUrl?: SortOrder
    connectionId?: SortOrder
    expiresAt?: SortOrder
    lastUsedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type ConnectionScalarRelationFilter = {
    is?: ConnectionWhereInput
    isNot?: ConnectionWhereInput
  }

  export type LinkedAccountNullableScalarRelationFilter = {
    is?: LinkedAccountWhereInput | null
    isNot?: LinkedAccountWhereInput | null
  }

  export type WebhookConfigListRelationFilter = {
    every?: WebhookConfigWhereInput
    some?: WebhookConfigWhereInput
    none?: WebhookConfigWhereInput
  }

  export type WebhookConfigOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LinkedRepositoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    fullName?: SortOrder
    provider?: SortOrder
    connectionId?: SortOrder
    defaultBranch?: SortOrder
    identityMode?: SortOrder
    assumeAccountId?: SortOrder
    indexEnabled?: SortOrder
    defaultReviewer?: SortOrder
    webhookActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LinkedRepositoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    fullName?: SortOrder
    provider?: SortOrder
    connectionId?: SortOrder
    defaultBranch?: SortOrder
    identityMode?: SortOrder
    assumeAccountId?: SortOrder
    indexEnabled?: SortOrder
    defaultReviewer?: SortOrder
    webhookActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LinkedRepositoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    fullName?: SortOrder
    provider?: SortOrder
    connectionId?: SortOrder
    defaultBranch?: SortOrder
    identityMode?: SortOrder
    assumeAccountId?: SortOrder
    indexEnabled?: SortOrder
    defaultReviewer?: SortOrder
    webhookActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LinkedRepositoryScalarRelationFilter = {
    is?: LinkedRepositoryWhereInput
    isNot?: LinkedRepositoryWhereInput
  }

  export type WebhookConfigCountOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    event?: SortOrder
    endpointPath?: SortOrder
    active?: SortOrder
    secretConfigured?: SortOrder
    lastTriggeredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type WebhookConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    event?: SortOrder
    endpointPath?: SortOrder
    active?: SortOrder
    secretConfigured?: SortOrder
    lastTriggeredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type WebhookConfigMinOrderByAggregateInput = {
    id?: SortOrder
    repositoryId?: SortOrder
    event?: SortOrder
    endpointPath?: SortOrder
    active?: SortOrder
    secretConfigured?: SortOrder
    lastTriggeredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type MaskingRuleCountOrderByAggregateInput = {
    id?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    builtIn?: SortOrder
    regex?: SortOrder
    createdAt?: SortOrder
  }

  export type MaskingRuleMaxOrderByAggregateInput = {
    id?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    builtIn?: SortOrder
    regex?: SortOrder
    createdAt?: SortOrder
  }

  export type MaskingRuleMinOrderByAggregateInput = {
    id?: SortOrder
    pattern?: SortOrder
    description?: SortOrder
    enabled?: SortOrder
    builtIn?: SortOrder
    regex?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type AgentRunListRelationFilter = {
    every?: AgentRunWhereInput
    some?: AgentRunWhereInput
    none?: AgentRunWhereInput
  }

  export type PullRequestListRelationFilter = {
    every?: PullRequestWhereInput
    some?: PullRequestWhereInput
    none?: PullRequestWhereInput
  }

  export type AgentRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PullRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type WorkItemCountOrderByAggregateInput = {
    id?: SortOrder
    azureId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    userQuery?: SortOrder
    type?: SortOrder
    status?: SortOrder
    assignedTo?: SortOrder
    repositoryFullName?: SortOrder
    targetBranch?: SortOrder
    linkedRunId?: SortOrder
    linkedPRId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkItemAvgOrderByAggregateInput = {
    azureId?: SortOrder
  }

  export type WorkItemMaxOrderByAggregateInput = {
    id?: SortOrder
    azureId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    userQuery?: SortOrder
    type?: SortOrder
    status?: SortOrder
    assignedTo?: SortOrder
    repositoryFullName?: SortOrder
    targetBranch?: SortOrder
    linkedRunId?: SortOrder
    linkedPRId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkItemMinOrderByAggregateInput = {
    id?: SortOrder
    azureId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    userQuery?: SortOrder
    type?: SortOrder
    status?: SortOrder
    assignedTo?: SortOrder
    repositoryFullName?: SortOrder
    targetBranch?: SortOrder
    linkedRunId?: SortOrder
    linkedPRId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type WorkItemSumOrderByAggregateInput = {
    azureId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type WorkItemNullableScalarRelationFilter = {
    is?: WorkItemWhereInput | null
    isNot?: WorkItemWhereInput | null
  }

  export type AgentStepListRelationFilter = {
    every?: AgentStepWhereInput
    some?: AgentStepWhereInput
    none?: AgentStepWhereInput
  }

  export type AgentStepOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AgentRunCountOrderByAggregateInput = {
    id?: SortOrder
    workItemId?: SortOrder
    repositoryFullName?: SortOrder
    userQuery?: SortOrder
    status?: SortOrder
    branchName?: SortOrder
    prId?: SortOrder
    error?: SortOrder
    planSummary?: SortOrder
    planFiles?: SortOrder
    totalPromptTokens?: SortOrder
    totalCompletionTokens?: SortOrder
    totalTokens?: SortOrder
    currentIteration?: SortOrder
    maxIterations?: SortOrder
    lastChanges?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type AgentRunAvgOrderByAggregateInput = {
    totalPromptTokens?: SortOrder
    totalCompletionTokens?: SortOrder
    totalTokens?: SortOrder
    currentIteration?: SortOrder
    maxIterations?: SortOrder
  }

  export type AgentRunMaxOrderByAggregateInput = {
    id?: SortOrder
    workItemId?: SortOrder
    repositoryFullName?: SortOrder
    userQuery?: SortOrder
    status?: SortOrder
    branchName?: SortOrder
    prId?: SortOrder
    error?: SortOrder
    planSummary?: SortOrder
    totalPromptTokens?: SortOrder
    totalCompletionTokens?: SortOrder
    totalTokens?: SortOrder
    currentIteration?: SortOrder
    maxIterations?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type AgentRunMinOrderByAggregateInput = {
    id?: SortOrder
    workItemId?: SortOrder
    repositoryFullName?: SortOrder
    userQuery?: SortOrder
    status?: SortOrder
    branchName?: SortOrder
    prId?: SortOrder
    error?: SortOrder
    planSummary?: SortOrder
    totalPromptTokens?: SortOrder
    totalCompletionTokens?: SortOrder
    totalTokens?: SortOrder
    currentIteration?: SortOrder
    maxIterations?: SortOrder
    startedAt?: SortOrder
    completedAt?: SortOrder
  }

  export type AgentRunSumOrderByAggregateInput = {
    totalPromptTokens?: SortOrder
    totalCompletionTokens?: SortOrder
    totalTokens?: SortOrder
    currentIteration?: SortOrder
    maxIterations?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type AgentRunScalarRelationFilter = {
    is?: AgentRunWhereInput
    isNot?: AgentRunWhereInput
  }

  export type AgentStepCountOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    label?: SortOrder
    detail?: SortOrder
    order?: SortOrder
    durationMs?: SortOrder
    timestamp?: SortOrder
  }

  export type AgentStepAvgOrderByAggregateInput = {
    order?: SortOrder
    durationMs?: SortOrder
  }

  export type AgentStepMaxOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    label?: SortOrder
    detail?: SortOrder
    order?: SortOrder
    durationMs?: SortOrder
    timestamp?: SortOrder
  }

  export type AgentStepMinOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    type?: SortOrder
    status?: SortOrder
    label?: SortOrder
    detail?: SortOrder
    order?: SortOrder
    durationMs?: SortOrder
    timestamp?: SortOrder
  }

  export type AgentStepSumOrderByAggregateInput = {
    order?: SortOrder
    durationMs?: SortOrder
  }

  export type PullRequestCountOrderByAggregateInput = {
    id?: SortOrder
    prNumber?: SortOrder
    azurePRId?: SortOrder
    title?: SortOrder
    sourceBranch?: SortOrder
    targetBranch?: SortOrder
    status?: SortOrder
    reviewerAlias?: SortOrder
    rejectionComment?: SortOrder
    workItemId?: SortOrder
    runId?: SortOrder
    url?: SortOrder
    repositoryFullName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PullRequestAvgOrderByAggregateInput = {
    prNumber?: SortOrder
    azurePRId?: SortOrder
  }

  export type PullRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    prNumber?: SortOrder
    azurePRId?: SortOrder
    title?: SortOrder
    sourceBranch?: SortOrder
    targetBranch?: SortOrder
    status?: SortOrder
    reviewerAlias?: SortOrder
    rejectionComment?: SortOrder
    workItemId?: SortOrder
    runId?: SortOrder
    url?: SortOrder
    repositoryFullName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PullRequestMinOrderByAggregateInput = {
    id?: SortOrder
    prNumber?: SortOrder
    azurePRId?: SortOrder
    title?: SortOrder
    sourceBranch?: SortOrder
    targetBranch?: SortOrder
    status?: SortOrder
    reviewerAlias?: SortOrder
    rejectionComment?: SortOrder
    workItemId?: SortOrder
    runId?: SortOrder
    url?: SortOrder
    repositoryFullName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PullRequestSumOrderByAggregateInput = {
    prNumber?: SortOrder
    azurePRId?: SortOrder
  }

  export type IndexStateTenantIdRepositoryBranchCompoundUniqueInput = {
    tenantId: string
    repository: string
    branch: string
  }

  export type IndexStateCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    repository?: SortOrder
    branch?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    indexedFiles?: SortOrder
    lastSyncAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexStateAvgOrderByAggregateInput = {
    totalFiles?: SortOrder
    indexedFiles?: SortOrder
  }

  export type IndexStateMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    repository?: SortOrder
    branch?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    indexedFiles?: SortOrder
    lastSyncAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexStateMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    repository?: SortOrder
    branch?: SortOrder
    status?: SortOrder
    totalFiles?: SortOrder
    indexedFiles?: SortOrder
    lastSyncAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IndexStateSumOrderByAggregateInput = {
    totalFiles?: SortOrder
    indexedFiles?: SortOrder
  }

  export type MaskingAuditEntryCountOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    pattern?: SortOrder
    matchCount?: SortOrder
    filesAffected?: SortOrder
    timestamp?: SortOrder
  }

  export type MaskingAuditEntryAvgOrderByAggregateInput = {
    matchCount?: SortOrder
  }

  export type MaskingAuditEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    pattern?: SortOrder
    matchCount?: SortOrder
    timestamp?: SortOrder
  }

  export type MaskingAuditEntryMinOrderByAggregateInput = {
    id?: SortOrder
    runId?: SortOrder
    pattern?: SortOrder
    matchCount?: SortOrder
    timestamp?: SortOrder
  }

  export type MaskingAuditEntrySumOrderByAggregateInput = {
    matchCount?: SortOrder
  }

  export type ConnectionCreatescopesInput = {
    set: string[]
  }

  export type LinkedAccountCreateNestedManyWithoutConnectionInput = {
    create?: XOR<LinkedAccountCreateWithoutConnectionInput, LinkedAccountUncheckedCreateWithoutConnectionInput> | LinkedAccountCreateWithoutConnectionInput[] | LinkedAccountUncheckedCreateWithoutConnectionInput[]
    connectOrCreate?: LinkedAccountCreateOrConnectWithoutConnectionInput | LinkedAccountCreateOrConnectWithoutConnectionInput[]
    createMany?: LinkedAccountCreateManyConnectionInputEnvelope
    connect?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
  }

  export type LinkedRepositoryCreateNestedManyWithoutConnectionInput = {
    create?: XOR<LinkedRepositoryCreateWithoutConnectionInput, LinkedRepositoryUncheckedCreateWithoutConnectionInput> | LinkedRepositoryCreateWithoutConnectionInput[] | LinkedRepositoryUncheckedCreateWithoutConnectionInput[]
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutConnectionInput | LinkedRepositoryCreateOrConnectWithoutConnectionInput[]
    createMany?: LinkedRepositoryCreateManyConnectionInputEnvelope
    connect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
  }

  export type LinkedAccountUncheckedCreateNestedManyWithoutConnectionInput = {
    create?: XOR<LinkedAccountCreateWithoutConnectionInput, LinkedAccountUncheckedCreateWithoutConnectionInput> | LinkedAccountCreateWithoutConnectionInput[] | LinkedAccountUncheckedCreateWithoutConnectionInput[]
    connectOrCreate?: LinkedAccountCreateOrConnectWithoutConnectionInput | LinkedAccountCreateOrConnectWithoutConnectionInput[]
    createMany?: LinkedAccountCreateManyConnectionInputEnvelope
    connect?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
  }

  export type LinkedRepositoryUncheckedCreateNestedManyWithoutConnectionInput = {
    create?: XOR<LinkedRepositoryCreateWithoutConnectionInput, LinkedRepositoryUncheckedCreateWithoutConnectionInput> | LinkedRepositoryCreateWithoutConnectionInput[] | LinkedRepositoryUncheckedCreateWithoutConnectionInput[]
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutConnectionInput | LinkedRepositoryCreateOrConnectWithoutConnectionInput[]
    createMany?: LinkedRepositoryCreateManyConnectionInputEnvelope
    connect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type ConnectionUpdatescopesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LinkedAccountUpdateManyWithoutConnectionNestedInput = {
    create?: XOR<LinkedAccountCreateWithoutConnectionInput, LinkedAccountUncheckedCreateWithoutConnectionInput> | LinkedAccountCreateWithoutConnectionInput[] | LinkedAccountUncheckedCreateWithoutConnectionInput[]
    connectOrCreate?: LinkedAccountCreateOrConnectWithoutConnectionInput | LinkedAccountCreateOrConnectWithoutConnectionInput[]
    upsert?: LinkedAccountUpsertWithWhereUniqueWithoutConnectionInput | LinkedAccountUpsertWithWhereUniqueWithoutConnectionInput[]
    createMany?: LinkedAccountCreateManyConnectionInputEnvelope
    set?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
    disconnect?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
    delete?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
    connect?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
    update?: LinkedAccountUpdateWithWhereUniqueWithoutConnectionInput | LinkedAccountUpdateWithWhereUniqueWithoutConnectionInput[]
    updateMany?: LinkedAccountUpdateManyWithWhereWithoutConnectionInput | LinkedAccountUpdateManyWithWhereWithoutConnectionInput[]
    deleteMany?: LinkedAccountScalarWhereInput | LinkedAccountScalarWhereInput[]
  }

  export type LinkedRepositoryUpdateManyWithoutConnectionNestedInput = {
    create?: XOR<LinkedRepositoryCreateWithoutConnectionInput, LinkedRepositoryUncheckedCreateWithoutConnectionInput> | LinkedRepositoryCreateWithoutConnectionInput[] | LinkedRepositoryUncheckedCreateWithoutConnectionInput[]
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutConnectionInput | LinkedRepositoryCreateOrConnectWithoutConnectionInput[]
    upsert?: LinkedRepositoryUpsertWithWhereUniqueWithoutConnectionInput | LinkedRepositoryUpsertWithWhereUniqueWithoutConnectionInput[]
    createMany?: LinkedRepositoryCreateManyConnectionInputEnvelope
    set?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    disconnect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    delete?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    connect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    update?: LinkedRepositoryUpdateWithWhereUniqueWithoutConnectionInput | LinkedRepositoryUpdateWithWhereUniqueWithoutConnectionInput[]
    updateMany?: LinkedRepositoryUpdateManyWithWhereWithoutConnectionInput | LinkedRepositoryUpdateManyWithWhereWithoutConnectionInput[]
    deleteMany?: LinkedRepositoryScalarWhereInput | LinkedRepositoryScalarWhereInput[]
  }

  export type LinkedAccountUncheckedUpdateManyWithoutConnectionNestedInput = {
    create?: XOR<LinkedAccountCreateWithoutConnectionInput, LinkedAccountUncheckedCreateWithoutConnectionInput> | LinkedAccountCreateWithoutConnectionInput[] | LinkedAccountUncheckedCreateWithoutConnectionInput[]
    connectOrCreate?: LinkedAccountCreateOrConnectWithoutConnectionInput | LinkedAccountCreateOrConnectWithoutConnectionInput[]
    upsert?: LinkedAccountUpsertWithWhereUniqueWithoutConnectionInput | LinkedAccountUpsertWithWhereUniqueWithoutConnectionInput[]
    createMany?: LinkedAccountCreateManyConnectionInputEnvelope
    set?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
    disconnect?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
    delete?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
    connect?: LinkedAccountWhereUniqueInput | LinkedAccountWhereUniqueInput[]
    update?: LinkedAccountUpdateWithWhereUniqueWithoutConnectionInput | LinkedAccountUpdateWithWhereUniqueWithoutConnectionInput[]
    updateMany?: LinkedAccountUpdateManyWithWhereWithoutConnectionInput | LinkedAccountUpdateManyWithWhereWithoutConnectionInput[]
    deleteMany?: LinkedAccountScalarWhereInput | LinkedAccountScalarWhereInput[]
  }

  export type LinkedRepositoryUncheckedUpdateManyWithoutConnectionNestedInput = {
    create?: XOR<LinkedRepositoryCreateWithoutConnectionInput, LinkedRepositoryUncheckedCreateWithoutConnectionInput> | LinkedRepositoryCreateWithoutConnectionInput[] | LinkedRepositoryUncheckedCreateWithoutConnectionInput[]
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutConnectionInput | LinkedRepositoryCreateOrConnectWithoutConnectionInput[]
    upsert?: LinkedRepositoryUpsertWithWhereUniqueWithoutConnectionInput | LinkedRepositoryUpsertWithWhereUniqueWithoutConnectionInput[]
    createMany?: LinkedRepositoryCreateManyConnectionInputEnvelope
    set?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    disconnect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    delete?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    connect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    update?: LinkedRepositoryUpdateWithWhereUniqueWithoutConnectionInput | LinkedRepositoryUpdateWithWhereUniqueWithoutConnectionInput[]
    updateMany?: LinkedRepositoryUpdateManyWithWhereWithoutConnectionInput | LinkedRepositoryUpdateManyWithWhereWithoutConnectionInput[]
    deleteMany?: LinkedRepositoryScalarWhereInput | LinkedRepositoryScalarWhereInput[]
  }

  export type ConnectionCreateNestedOneWithoutLinkedAccountsInput = {
    create?: XOR<ConnectionCreateWithoutLinkedAccountsInput, ConnectionUncheckedCreateWithoutLinkedAccountsInput>
    connectOrCreate?: ConnectionCreateOrConnectWithoutLinkedAccountsInput
    connect?: ConnectionWhereUniqueInput
  }

  export type LinkedRepositoryCreateNestedManyWithoutAssumeAccountInput = {
    create?: XOR<LinkedRepositoryCreateWithoutAssumeAccountInput, LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput> | LinkedRepositoryCreateWithoutAssumeAccountInput[] | LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput[]
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput | LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput[]
    createMany?: LinkedRepositoryCreateManyAssumeAccountInputEnvelope
    connect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
  }

  export type LinkedRepositoryUncheckedCreateNestedManyWithoutAssumeAccountInput = {
    create?: XOR<LinkedRepositoryCreateWithoutAssumeAccountInput, LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput> | LinkedRepositoryCreateWithoutAssumeAccountInput[] | LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput[]
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput | LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput[]
    createMany?: LinkedRepositoryCreateManyAssumeAccountInputEnvelope
    connect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
  }

  export type ConnectionUpdateOneWithoutLinkedAccountsNestedInput = {
    create?: XOR<ConnectionCreateWithoutLinkedAccountsInput, ConnectionUncheckedCreateWithoutLinkedAccountsInput>
    connectOrCreate?: ConnectionCreateOrConnectWithoutLinkedAccountsInput
    upsert?: ConnectionUpsertWithoutLinkedAccountsInput
    disconnect?: ConnectionWhereInput | boolean
    delete?: ConnectionWhereInput | boolean
    connect?: ConnectionWhereUniqueInput
    update?: XOR<XOR<ConnectionUpdateToOneWithWhereWithoutLinkedAccountsInput, ConnectionUpdateWithoutLinkedAccountsInput>, ConnectionUncheckedUpdateWithoutLinkedAccountsInput>
  }

  export type LinkedRepositoryUpdateManyWithoutAssumeAccountNestedInput = {
    create?: XOR<LinkedRepositoryCreateWithoutAssumeAccountInput, LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput> | LinkedRepositoryCreateWithoutAssumeAccountInput[] | LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput[]
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput | LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput[]
    upsert?: LinkedRepositoryUpsertWithWhereUniqueWithoutAssumeAccountInput | LinkedRepositoryUpsertWithWhereUniqueWithoutAssumeAccountInput[]
    createMany?: LinkedRepositoryCreateManyAssumeAccountInputEnvelope
    set?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    disconnect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    delete?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    connect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    update?: LinkedRepositoryUpdateWithWhereUniqueWithoutAssumeAccountInput | LinkedRepositoryUpdateWithWhereUniqueWithoutAssumeAccountInput[]
    updateMany?: LinkedRepositoryUpdateManyWithWhereWithoutAssumeAccountInput | LinkedRepositoryUpdateManyWithWhereWithoutAssumeAccountInput[]
    deleteMany?: LinkedRepositoryScalarWhereInput | LinkedRepositoryScalarWhereInput[]
  }

  export type LinkedRepositoryUncheckedUpdateManyWithoutAssumeAccountNestedInput = {
    create?: XOR<LinkedRepositoryCreateWithoutAssumeAccountInput, LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput> | LinkedRepositoryCreateWithoutAssumeAccountInput[] | LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput[]
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput | LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput[]
    upsert?: LinkedRepositoryUpsertWithWhereUniqueWithoutAssumeAccountInput | LinkedRepositoryUpsertWithWhereUniqueWithoutAssumeAccountInput[]
    createMany?: LinkedRepositoryCreateManyAssumeAccountInputEnvelope
    set?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    disconnect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    delete?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    connect?: LinkedRepositoryWhereUniqueInput | LinkedRepositoryWhereUniqueInput[]
    update?: LinkedRepositoryUpdateWithWhereUniqueWithoutAssumeAccountInput | LinkedRepositoryUpdateWithWhereUniqueWithoutAssumeAccountInput[]
    updateMany?: LinkedRepositoryUpdateManyWithWhereWithoutAssumeAccountInput | LinkedRepositoryUpdateManyWithWhereWithoutAssumeAccountInput[]
    deleteMany?: LinkedRepositoryScalarWhereInput | LinkedRepositoryScalarWhereInput[]
  }

  export type ConnectionCreateNestedOneWithoutRepositoriesInput = {
    create?: XOR<ConnectionCreateWithoutRepositoriesInput, ConnectionUncheckedCreateWithoutRepositoriesInput>
    connectOrCreate?: ConnectionCreateOrConnectWithoutRepositoriesInput
    connect?: ConnectionWhereUniqueInput
  }

  export type LinkedAccountCreateNestedOneWithoutAssumedByReposInput = {
    create?: XOR<LinkedAccountCreateWithoutAssumedByReposInput, LinkedAccountUncheckedCreateWithoutAssumedByReposInput>
    connectOrCreate?: LinkedAccountCreateOrConnectWithoutAssumedByReposInput
    connect?: LinkedAccountWhereUniqueInput
  }

  export type WebhookConfigCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<WebhookConfigCreateWithoutRepositoryInput, WebhookConfigUncheckedCreateWithoutRepositoryInput> | WebhookConfigCreateWithoutRepositoryInput[] | WebhookConfigUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: WebhookConfigCreateOrConnectWithoutRepositoryInput | WebhookConfigCreateOrConnectWithoutRepositoryInput[]
    createMany?: WebhookConfigCreateManyRepositoryInputEnvelope
    connect?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
  }

  export type WebhookConfigUncheckedCreateNestedManyWithoutRepositoryInput = {
    create?: XOR<WebhookConfigCreateWithoutRepositoryInput, WebhookConfigUncheckedCreateWithoutRepositoryInput> | WebhookConfigCreateWithoutRepositoryInput[] | WebhookConfigUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: WebhookConfigCreateOrConnectWithoutRepositoryInput | WebhookConfigCreateOrConnectWithoutRepositoryInput[]
    createMany?: WebhookConfigCreateManyRepositoryInputEnvelope
    connect?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
  }

  export type ConnectionUpdateOneRequiredWithoutRepositoriesNestedInput = {
    create?: XOR<ConnectionCreateWithoutRepositoriesInput, ConnectionUncheckedCreateWithoutRepositoriesInput>
    connectOrCreate?: ConnectionCreateOrConnectWithoutRepositoriesInput
    upsert?: ConnectionUpsertWithoutRepositoriesInput
    connect?: ConnectionWhereUniqueInput
    update?: XOR<XOR<ConnectionUpdateToOneWithWhereWithoutRepositoriesInput, ConnectionUpdateWithoutRepositoriesInput>, ConnectionUncheckedUpdateWithoutRepositoriesInput>
  }

  export type LinkedAccountUpdateOneWithoutAssumedByReposNestedInput = {
    create?: XOR<LinkedAccountCreateWithoutAssumedByReposInput, LinkedAccountUncheckedCreateWithoutAssumedByReposInput>
    connectOrCreate?: LinkedAccountCreateOrConnectWithoutAssumedByReposInput
    upsert?: LinkedAccountUpsertWithoutAssumedByReposInput
    disconnect?: LinkedAccountWhereInput | boolean
    delete?: LinkedAccountWhereInput | boolean
    connect?: LinkedAccountWhereUniqueInput
    update?: XOR<XOR<LinkedAccountUpdateToOneWithWhereWithoutAssumedByReposInput, LinkedAccountUpdateWithoutAssumedByReposInput>, LinkedAccountUncheckedUpdateWithoutAssumedByReposInput>
  }

  export type WebhookConfigUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<WebhookConfigCreateWithoutRepositoryInput, WebhookConfigUncheckedCreateWithoutRepositoryInput> | WebhookConfigCreateWithoutRepositoryInput[] | WebhookConfigUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: WebhookConfigCreateOrConnectWithoutRepositoryInput | WebhookConfigCreateOrConnectWithoutRepositoryInput[]
    upsert?: WebhookConfigUpsertWithWhereUniqueWithoutRepositoryInput | WebhookConfigUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: WebhookConfigCreateManyRepositoryInputEnvelope
    set?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
    disconnect?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
    delete?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
    connect?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
    update?: WebhookConfigUpdateWithWhereUniqueWithoutRepositoryInput | WebhookConfigUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: WebhookConfigUpdateManyWithWhereWithoutRepositoryInput | WebhookConfigUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: WebhookConfigScalarWhereInput | WebhookConfigScalarWhereInput[]
  }

  export type WebhookConfigUncheckedUpdateManyWithoutRepositoryNestedInput = {
    create?: XOR<WebhookConfigCreateWithoutRepositoryInput, WebhookConfigUncheckedCreateWithoutRepositoryInput> | WebhookConfigCreateWithoutRepositoryInput[] | WebhookConfigUncheckedCreateWithoutRepositoryInput[]
    connectOrCreate?: WebhookConfigCreateOrConnectWithoutRepositoryInput | WebhookConfigCreateOrConnectWithoutRepositoryInput[]
    upsert?: WebhookConfigUpsertWithWhereUniqueWithoutRepositoryInput | WebhookConfigUpsertWithWhereUniqueWithoutRepositoryInput[]
    createMany?: WebhookConfigCreateManyRepositoryInputEnvelope
    set?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
    disconnect?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
    delete?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
    connect?: WebhookConfigWhereUniqueInput | WebhookConfigWhereUniqueInput[]
    update?: WebhookConfigUpdateWithWhereUniqueWithoutRepositoryInput | WebhookConfigUpdateWithWhereUniqueWithoutRepositoryInput[]
    updateMany?: WebhookConfigUpdateManyWithWhereWithoutRepositoryInput | WebhookConfigUpdateManyWithWhereWithoutRepositoryInput[]
    deleteMany?: WebhookConfigScalarWhereInput | WebhookConfigScalarWhereInput[]
  }

  export type LinkedRepositoryCreateNestedOneWithoutWebhooksInput = {
    create?: XOR<LinkedRepositoryCreateWithoutWebhooksInput, LinkedRepositoryUncheckedCreateWithoutWebhooksInput>
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutWebhooksInput
    connect?: LinkedRepositoryWhereUniqueInput
  }

  export type LinkedRepositoryUpdateOneRequiredWithoutWebhooksNestedInput = {
    create?: XOR<LinkedRepositoryCreateWithoutWebhooksInput, LinkedRepositoryUncheckedCreateWithoutWebhooksInput>
    connectOrCreate?: LinkedRepositoryCreateOrConnectWithoutWebhooksInput
    upsert?: LinkedRepositoryUpsertWithoutWebhooksInput
    connect?: LinkedRepositoryWhereUniqueInput
    update?: XOR<XOR<LinkedRepositoryUpdateToOneWithWhereWithoutWebhooksInput, LinkedRepositoryUpdateWithoutWebhooksInput>, LinkedRepositoryUncheckedUpdateWithoutWebhooksInput>
  }

  export type AgentRunCreateNestedManyWithoutWorkItemInput = {
    create?: XOR<AgentRunCreateWithoutWorkItemInput, AgentRunUncheckedCreateWithoutWorkItemInput> | AgentRunCreateWithoutWorkItemInput[] | AgentRunUncheckedCreateWithoutWorkItemInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutWorkItemInput | AgentRunCreateOrConnectWithoutWorkItemInput[]
    createMany?: AgentRunCreateManyWorkItemInputEnvelope
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
  }

  export type PullRequestCreateNestedManyWithoutWorkItemInput = {
    create?: XOR<PullRequestCreateWithoutWorkItemInput, PullRequestUncheckedCreateWithoutWorkItemInput> | PullRequestCreateWithoutWorkItemInput[] | PullRequestUncheckedCreateWithoutWorkItemInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutWorkItemInput | PullRequestCreateOrConnectWithoutWorkItemInput[]
    createMany?: PullRequestCreateManyWorkItemInputEnvelope
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
  }

  export type AgentRunUncheckedCreateNestedManyWithoutWorkItemInput = {
    create?: XOR<AgentRunCreateWithoutWorkItemInput, AgentRunUncheckedCreateWithoutWorkItemInput> | AgentRunCreateWithoutWorkItemInput[] | AgentRunUncheckedCreateWithoutWorkItemInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutWorkItemInput | AgentRunCreateOrConnectWithoutWorkItemInput[]
    createMany?: AgentRunCreateManyWorkItemInputEnvelope
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
  }

  export type PullRequestUncheckedCreateNestedManyWithoutWorkItemInput = {
    create?: XOR<PullRequestCreateWithoutWorkItemInput, PullRequestUncheckedCreateWithoutWorkItemInput> | PullRequestCreateWithoutWorkItemInput[] | PullRequestUncheckedCreateWithoutWorkItemInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutWorkItemInput | PullRequestCreateOrConnectWithoutWorkItemInput[]
    createMany?: PullRequestCreateManyWorkItemInputEnvelope
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type AgentRunUpdateManyWithoutWorkItemNestedInput = {
    create?: XOR<AgentRunCreateWithoutWorkItemInput, AgentRunUncheckedCreateWithoutWorkItemInput> | AgentRunCreateWithoutWorkItemInput[] | AgentRunUncheckedCreateWithoutWorkItemInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutWorkItemInput | AgentRunCreateOrConnectWithoutWorkItemInput[]
    upsert?: AgentRunUpsertWithWhereUniqueWithoutWorkItemInput | AgentRunUpsertWithWhereUniqueWithoutWorkItemInput[]
    createMany?: AgentRunCreateManyWorkItemInputEnvelope
    set?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    disconnect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    delete?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    update?: AgentRunUpdateWithWhereUniqueWithoutWorkItemInput | AgentRunUpdateWithWhereUniqueWithoutWorkItemInput[]
    updateMany?: AgentRunUpdateManyWithWhereWithoutWorkItemInput | AgentRunUpdateManyWithWhereWithoutWorkItemInput[]
    deleteMany?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
  }

  export type PullRequestUpdateManyWithoutWorkItemNestedInput = {
    create?: XOR<PullRequestCreateWithoutWorkItemInput, PullRequestUncheckedCreateWithoutWorkItemInput> | PullRequestCreateWithoutWorkItemInput[] | PullRequestUncheckedCreateWithoutWorkItemInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutWorkItemInput | PullRequestCreateOrConnectWithoutWorkItemInput[]
    upsert?: PullRequestUpsertWithWhereUniqueWithoutWorkItemInput | PullRequestUpsertWithWhereUniqueWithoutWorkItemInput[]
    createMany?: PullRequestCreateManyWorkItemInputEnvelope
    set?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    disconnect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    delete?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    update?: PullRequestUpdateWithWhereUniqueWithoutWorkItemInput | PullRequestUpdateWithWhereUniqueWithoutWorkItemInput[]
    updateMany?: PullRequestUpdateManyWithWhereWithoutWorkItemInput | PullRequestUpdateManyWithWhereWithoutWorkItemInput[]
    deleteMany?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
  }

  export type AgentRunUncheckedUpdateManyWithoutWorkItemNestedInput = {
    create?: XOR<AgentRunCreateWithoutWorkItemInput, AgentRunUncheckedCreateWithoutWorkItemInput> | AgentRunCreateWithoutWorkItemInput[] | AgentRunUncheckedCreateWithoutWorkItemInput[]
    connectOrCreate?: AgentRunCreateOrConnectWithoutWorkItemInput | AgentRunCreateOrConnectWithoutWorkItemInput[]
    upsert?: AgentRunUpsertWithWhereUniqueWithoutWorkItemInput | AgentRunUpsertWithWhereUniqueWithoutWorkItemInput[]
    createMany?: AgentRunCreateManyWorkItemInputEnvelope
    set?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    disconnect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    delete?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    connect?: AgentRunWhereUniqueInput | AgentRunWhereUniqueInput[]
    update?: AgentRunUpdateWithWhereUniqueWithoutWorkItemInput | AgentRunUpdateWithWhereUniqueWithoutWorkItemInput[]
    updateMany?: AgentRunUpdateManyWithWhereWithoutWorkItemInput | AgentRunUpdateManyWithWhereWithoutWorkItemInput[]
    deleteMany?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
  }

  export type PullRequestUncheckedUpdateManyWithoutWorkItemNestedInput = {
    create?: XOR<PullRequestCreateWithoutWorkItemInput, PullRequestUncheckedCreateWithoutWorkItemInput> | PullRequestCreateWithoutWorkItemInput[] | PullRequestUncheckedCreateWithoutWorkItemInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutWorkItemInput | PullRequestCreateOrConnectWithoutWorkItemInput[]
    upsert?: PullRequestUpsertWithWhereUniqueWithoutWorkItemInput | PullRequestUpsertWithWhereUniqueWithoutWorkItemInput[]
    createMany?: PullRequestCreateManyWorkItemInputEnvelope
    set?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    disconnect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    delete?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    update?: PullRequestUpdateWithWhereUniqueWithoutWorkItemInput | PullRequestUpdateWithWhereUniqueWithoutWorkItemInput[]
    updateMany?: PullRequestUpdateManyWithWhereWithoutWorkItemInput | PullRequestUpdateManyWithWhereWithoutWorkItemInput[]
    deleteMany?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
  }

  export type WorkItemCreateNestedOneWithoutAgentRunsInput = {
    create?: XOR<WorkItemCreateWithoutAgentRunsInput, WorkItemUncheckedCreateWithoutAgentRunsInput>
    connectOrCreate?: WorkItemCreateOrConnectWithoutAgentRunsInput
    connect?: WorkItemWhereUniqueInput
  }

  export type AgentStepCreateNestedManyWithoutRunInput = {
    create?: XOR<AgentStepCreateWithoutRunInput, AgentStepUncheckedCreateWithoutRunInput> | AgentStepCreateWithoutRunInput[] | AgentStepUncheckedCreateWithoutRunInput[]
    connectOrCreate?: AgentStepCreateOrConnectWithoutRunInput | AgentStepCreateOrConnectWithoutRunInput[]
    createMany?: AgentStepCreateManyRunInputEnvelope
    connect?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
  }

  export type PullRequestCreateNestedManyWithoutRunInput = {
    create?: XOR<PullRequestCreateWithoutRunInput, PullRequestUncheckedCreateWithoutRunInput> | PullRequestCreateWithoutRunInput[] | PullRequestUncheckedCreateWithoutRunInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutRunInput | PullRequestCreateOrConnectWithoutRunInput[]
    createMany?: PullRequestCreateManyRunInputEnvelope
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
  }

  export type AgentStepUncheckedCreateNestedManyWithoutRunInput = {
    create?: XOR<AgentStepCreateWithoutRunInput, AgentStepUncheckedCreateWithoutRunInput> | AgentStepCreateWithoutRunInput[] | AgentStepUncheckedCreateWithoutRunInput[]
    connectOrCreate?: AgentStepCreateOrConnectWithoutRunInput | AgentStepCreateOrConnectWithoutRunInput[]
    createMany?: AgentStepCreateManyRunInputEnvelope
    connect?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
  }

  export type PullRequestUncheckedCreateNestedManyWithoutRunInput = {
    create?: XOR<PullRequestCreateWithoutRunInput, PullRequestUncheckedCreateWithoutRunInput> | PullRequestCreateWithoutRunInput[] | PullRequestUncheckedCreateWithoutRunInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutRunInput | PullRequestCreateOrConnectWithoutRunInput[]
    createMany?: PullRequestCreateManyRunInputEnvelope
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type WorkItemUpdateOneWithoutAgentRunsNestedInput = {
    create?: XOR<WorkItemCreateWithoutAgentRunsInput, WorkItemUncheckedCreateWithoutAgentRunsInput>
    connectOrCreate?: WorkItemCreateOrConnectWithoutAgentRunsInput
    upsert?: WorkItemUpsertWithoutAgentRunsInput
    disconnect?: WorkItemWhereInput | boolean
    delete?: WorkItemWhereInput | boolean
    connect?: WorkItemWhereUniqueInput
    update?: XOR<XOR<WorkItemUpdateToOneWithWhereWithoutAgentRunsInput, WorkItemUpdateWithoutAgentRunsInput>, WorkItemUncheckedUpdateWithoutAgentRunsInput>
  }

  export type AgentStepUpdateManyWithoutRunNestedInput = {
    create?: XOR<AgentStepCreateWithoutRunInput, AgentStepUncheckedCreateWithoutRunInput> | AgentStepCreateWithoutRunInput[] | AgentStepUncheckedCreateWithoutRunInput[]
    connectOrCreate?: AgentStepCreateOrConnectWithoutRunInput | AgentStepCreateOrConnectWithoutRunInput[]
    upsert?: AgentStepUpsertWithWhereUniqueWithoutRunInput | AgentStepUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: AgentStepCreateManyRunInputEnvelope
    set?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
    disconnect?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
    delete?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
    connect?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
    update?: AgentStepUpdateWithWhereUniqueWithoutRunInput | AgentStepUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: AgentStepUpdateManyWithWhereWithoutRunInput | AgentStepUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: AgentStepScalarWhereInput | AgentStepScalarWhereInput[]
  }

  export type PullRequestUpdateManyWithoutRunNestedInput = {
    create?: XOR<PullRequestCreateWithoutRunInput, PullRequestUncheckedCreateWithoutRunInput> | PullRequestCreateWithoutRunInput[] | PullRequestUncheckedCreateWithoutRunInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutRunInput | PullRequestCreateOrConnectWithoutRunInput[]
    upsert?: PullRequestUpsertWithWhereUniqueWithoutRunInput | PullRequestUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: PullRequestCreateManyRunInputEnvelope
    set?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    disconnect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    delete?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    update?: PullRequestUpdateWithWhereUniqueWithoutRunInput | PullRequestUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: PullRequestUpdateManyWithWhereWithoutRunInput | PullRequestUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
  }

  export type AgentStepUncheckedUpdateManyWithoutRunNestedInput = {
    create?: XOR<AgentStepCreateWithoutRunInput, AgentStepUncheckedCreateWithoutRunInput> | AgentStepCreateWithoutRunInput[] | AgentStepUncheckedCreateWithoutRunInput[]
    connectOrCreate?: AgentStepCreateOrConnectWithoutRunInput | AgentStepCreateOrConnectWithoutRunInput[]
    upsert?: AgentStepUpsertWithWhereUniqueWithoutRunInput | AgentStepUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: AgentStepCreateManyRunInputEnvelope
    set?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
    disconnect?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
    delete?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
    connect?: AgentStepWhereUniqueInput | AgentStepWhereUniqueInput[]
    update?: AgentStepUpdateWithWhereUniqueWithoutRunInput | AgentStepUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: AgentStepUpdateManyWithWhereWithoutRunInput | AgentStepUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: AgentStepScalarWhereInput | AgentStepScalarWhereInput[]
  }

  export type PullRequestUncheckedUpdateManyWithoutRunNestedInput = {
    create?: XOR<PullRequestCreateWithoutRunInput, PullRequestUncheckedCreateWithoutRunInput> | PullRequestCreateWithoutRunInput[] | PullRequestUncheckedCreateWithoutRunInput[]
    connectOrCreate?: PullRequestCreateOrConnectWithoutRunInput | PullRequestCreateOrConnectWithoutRunInput[]
    upsert?: PullRequestUpsertWithWhereUniqueWithoutRunInput | PullRequestUpsertWithWhereUniqueWithoutRunInput[]
    createMany?: PullRequestCreateManyRunInputEnvelope
    set?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    disconnect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    delete?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    connect?: PullRequestWhereUniqueInput | PullRequestWhereUniqueInput[]
    update?: PullRequestUpdateWithWhereUniqueWithoutRunInput | PullRequestUpdateWithWhereUniqueWithoutRunInput[]
    updateMany?: PullRequestUpdateManyWithWhereWithoutRunInput | PullRequestUpdateManyWithWhereWithoutRunInput[]
    deleteMany?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
  }

  export type AgentRunCreateNestedOneWithoutStepsInput = {
    create?: XOR<AgentRunCreateWithoutStepsInput, AgentRunUncheckedCreateWithoutStepsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutStepsInput
    connect?: AgentRunWhereUniqueInput
  }

  export type AgentRunUpdateOneRequiredWithoutStepsNestedInput = {
    create?: XOR<AgentRunCreateWithoutStepsInput, AgentRunUncheckedCreateWithoutStepsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutStepsInput
    upsert?: AgentRunUpsertWithoutStepsInput
    connect?: AgentRunWhereUniqueInput
    update?: XOR<XOR<AgentRunUpdateToOneWithWhereWithoutStepsInput, AgentRunUpdateWithoutStepsInput>, AgentRunUncheckedUpdateWithoutStepsInput>
  }

  export type WorkItemCreateNestedOneWithoutPullRequestsInput = {
    create?: XOR<WorkItemCreateWithoutPullRequestsInput, WorkItemUncheckedCreateWithoutPullRequestsInput>
    connectOrCreate?: WorkItemCreateOrConnectWithoutPullRequestsInput
    connect?: WorkItemWhereUniqueInput
  }

  export type AgentRunCreateNestedOneWithoutPullRequestsInput = {
    create?: XOR<AgentRunCreateWithoutPullRequestsInput, AgentRunUncheckedCreateWithoutPullRequestsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutPullRequestsInput
    connect?: AgentRunWhereUniqueInput
  }

  export type WorkItemUpdateOneWithoutPullRequestsNestedInput = {
    create?: XOR<WorkItemCreateWithoutPullRequestsInput, WorkItemUncheckedCreateWithoutPullRequestsInput>
    connectOrCreate?: WorkItemCreateOrConnectWithoutPullRequestsInput
    upsert?: WorkItemUpsertWithoutPullRequestsInput
    disconnect?: WorkItemWhereInput | boolean
    delete?: WorkItemWhereInput | boolean
    connect?: WorkItemWhereUniqueInput
    update?: XOR<XOR<WorkItemUpdateToOneWithWhereWithoutPullRequestsInput, WorkItemUpdateWithoutPullRequestsInput>, WorkItemUncheckedUpdateWithoutPullRequestsInput>
  }

  export type AgentRunUpdateOneRequiredWithoutPullRequestsNestedInput = {
    create?: XOR<AgentRunCreateWithoutPullRequestsInput, AgentRunUncheckedCreateWithoutPullRequestsInput>
    connectOrCreate?: AgentRunCreateOrConnectWithoutPullRequestsInput
    upsert?: AgentRunUpsertWithoutPullRequestsInput
    connect?: AgentRunWhereUniqueInput
    update?: XOR<XOR<AgentRunUpdateToOneWithWhereWithoutPullRequestsInput, AgentRunUpdateWithoutPullRequestsInput>, AgentRunUncheckedUpdateWithoutPullRequestsInput>
  }

  export type MaskingAuditEntryCreatefilesAffectedInput = {
    set: string[]
  }

  export type MaskingAuditEntryUpdatefilesAffectedInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type LinkedAccountCreateWithoutConnectionInput = {
    id?: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl?: string | null
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    assumedByRepos?: LinkedRepositoryCreateNestedManyWithoutAssumeAccountInput
  }

  export type LinkedAccountUncheckedCreateWithoutConnectionInput = {
    id?: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl?: string | null
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    assumedByRepos?: LinkedRepositoryUncheckedCreateNestedManyWithoutAssumeAccountInput
  }

  export type LinkedAccountCreateOrConnectWithoutConnectionInput = {
    where: LinkedAccountWhereUniqueInput
    create: XOR<LinkedAccountCreateWithoutConnectionInput, LinkedAccountUncheckedCreateWithoutConnectionInput>
  }

  export type LinkedAccountCreateManyConnectionInputEnvelope = {
    data: LinkedAccountCreateManyConnectionInput | LinkedAccountCreateManyConnectionInput[]
    skipDuplicates?: boolean
  }

  export type LinkedRepositoryCreateWithoutConnectionInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    defaultBranch: string
    identityMode: string
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    assumeAccount?: LinkedAccountCreateNestedOneWithoutAssumedByReposInput
    webhooks?: WebhookConfigCreateNestedManyWithoutRepositoryInput
  }

  export type LinkedRepositoryUncheckedCreateWithoutConnectionInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    defaultBranch: string
    identityMode: string
    assumeAccountId?: string | null
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    webhooks?: WebhookConfigUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type LinkedRepositoryCreateOrConnectWithoutConnectionInput = {
    where: LinkedRepositoryWhereUniqueInput
    create: XOR<LinkedRepositoryCreateWithoutConnectionInput, LinkedRepositoryUncheckedCreateWithoutConnectionInput>
  }

  export type LinkedRepositoryCreateManyConnectionInputEnvelope = {
    data: LinkedRepositoryCreateManyConnectionInput | LinkedRepositoryCreateManyConnectionInput[]
    skipDuplicates?: boolean
  }

  export type LinkedAccountUpsertWithWhereUniqueWithoutConnectionInput = {
    where: LinkedAccountWhereUniqueInput
    update: XOR<LinkedAccountUpdateWithoutConnectionInput, LinkedAccountUncheckedUpdateWithoutConnectionInput>
    create: XOR<LinkedAccountCreateWithoutConnectionInput, LinkedAccountUncheckedCreateWithoutConnectionInput>
  }

  export type LinkedAccountUpdateWithWhereUniqueWithoutConnectionInput = {
    where: LinkedAccountWhereUniqueInput
    data: XOR<LinkedAccountUpdateWithoutConnectionInput, LinkedAccountUncheckedUpdateWithoutConnectionInput>
  }

  export type LinkedAccountUpdateManyWithWhereWithoutConnectionInput = {
    where: LinkedAccountScalarWhereInput
    data: XOR<LinkedAccountUpdateManyMutationInput, LinkedAccountUncheckedUpdateManyWithoutConnectionInput>
  }

  export type LinkedAccountScalarWhereInput = {
    AND?: LinkedAccountScalarWhereInput | LinkedAccountScalarWhereInput[]
    OR?: LinkedAccountScalarWhereInput[]
    NOT?: LinkedAccountScalarWhereInput | LinkedAccountScalarWhereInput[]
    id?: StringFilter<"LinkedAccount"> | string
    displayName?: StringFilter<"LinkedAccount"> | string
    providerUsername?: StringFilter<"LinkedAccount"> | string
    email?: StringFilter<"LinkedAccount"> | string
    provider?: StringFilter<"LinkedAccount"> | string
    authMethod?: StringFilter<"LinkedAccount"> | string
    status?: StringFilter<"LinkedAccount"> | string
    avatarUrl?: StringNullableFilter<"LinkedAccount"> | string | null
    connectionId?: StringNullableFilter<"LinkedAccount"> | string | null
    expiresAt?: DateTimeNullableFilter<"LinkedAccount"> | Date | string | null
    lastUsedAt?: DateTimeNullableFilter<"LinkedAccount"> | Date | string | null
    createdAt?: DateTimeFilter<"LinkedAccount"> | Date | string
  }

  export type LinkedRepositoryUpsertWithWhereUniqueWithoutConnectionInput = {
    where: LinkedRepositoryWhereUniqueInput
    update: XOR<LinkedRepositoryUpdateWithoutConnectionInput, LinkedRepositoryUncheckedUpdateWithoutConnectionInput>
    create: XOR<LinkedRepositoryCreateWithoutConnectionInput, LinkedRepositoryUncheckedCreateWithoutConnectionInput>
  }

  export type LinkedRepositoryUpdateWithWhereUniqueWithoutConnectionInput = {
    where: LinkedRepositoryWhereUniqueInput
    data: XOR<LinkedRepositoryUpdateWithoutConnectionInput, LinkedRepositoryUncheckedUpdateWithoutConnectionInput>
  }

  export type LinkedRepositoryUpdateManyWithWhereWithoutConnectionInput = {
    where: LinkedRepositoryScalarWhereInput
    data: XOR<LinkedRepositoryUpdateManyMutationInput, LinkedRepositoryUncheckedUpdateManyWithoutConnectionInput>
  }

  export type LinkedRepositoryScalarWhereInput = {
    AND?: LinkedRepositoryScalarWhereInput | LinkedRepositoryScalarWhereInput[]
    OR?: LinkedRepositoryScalarWhereInput[]
    NOT?: LinkedRepositoryScalarWhereInput | LinkedRepositoryScalarWhereInput[]
    id?: StringFilter<"LinkedRepository"> | string
    name?: StringFilter<"LinkedRepository"> | string
    fullName?: StringFilter<"LinkedRepository"> | string
    provider?: StringFilter<"LinkedRepository"> | string
    connectionId?: StringFilter<"LinkedRepository"> | string
    defaultBranch?: StringFilter<"LinkedRepository"> | string
    identityMode?: StringFilter<"LinkedRepository"> | string
    assumeAccountId?: StringNullableFilter<"LinkedRepository"> | string | null
    indexEnabled?: BoolFilter<"LinkedRepository"> | boolean
    defaultReviewer?: StringNullableFilter<"LinkedRepository"> | string | null
    webhookActive?: BoolFilter<"LinkedRepository"> | boolean
    createdAt?: DateTimeFilter<"LinkedRepository"> | Date | string
    updatedAt?: DateTimeFilter<"LinkedRepository"> | Date | string
  }

  export type ConnectionCreateWithoutLinkedAccountsInput = {
    id?: string
    name: string
    provider: string
    authMethod: string
    providerAccountName: string
    providerUrl: string
    secretToken?: string | null
    secretLastFour?: string | null
    isDefault?: boolean
    status: string
    scopes?: ConnectionCreatescopesInput | string[]
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    repositories?: LinkedRepositoryCreateNestedManyWithoutConnectionInput
  }

  export type ConnectionUncheckedCreateWithoutLinkedAccountsInput = {
    id?: string
    name: string
    provider: string
    authMethod: string
    providerAccountName: string
    providerUrl: string
    secretToken?: string | null
    secretLastFour?: string | null
    isDefault?: boolean
    status: string
    scopes?: ConnectionCreatescopesInput | string[]
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    repositories?: LinkedRepositoryUncheckedCreateNestedManyWithoutConnectionInput
  }

  export type ConnectionCreateOrConnectWithoutLinkedAccountsInput = {
    where: ConnectionWhereUniqueInput
    create: XOR<ConnectionCreateWithoutLinkedAccountsInput, ConnectionUncheckedCreateWithoutLinkedAccountsInput>
  }

  export type LinkedRepositoryCreateWithoutAssumeAccountInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    defaultBranch: string
    identityMode: string
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    connection: ConnectionCreateNestedOneWithoutRepositoriesInput
    webhooks?: WebhookConfigCreateNestedManyWithoutRepositoryInput
  }

  export type LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    connectionId: string
    defaultBranch: string
    identityMode: string
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    webhooks?: WebhookConfigUncheckedCreateNestedManyWithoutRepositoryInput
  }

  export type LinkedRepositoryCreateOrConnectWithoutAssumeAccountInput = {
    where: LinkedRepositoryWhereUniqueInput
    create: XOR<LinkedRepositoryCreateWithoutAssumeAccountInput, LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput>
  }

  export type LinkedRepositoryCreateManyAssumeAccountInputEnvelope = {
    data: LinkedRepositoryCreateManyAssumeAccountInput | LinkedRepositoryCreateManyAssumeAccountInput[]
    skipDuplicates?: boolean
  }

  export type ConnectionUpsertWithoutLinkedAccountsInput = {
    update: XOR<ConnectionUpdateWithoutLinkedAccountsInput, ConnectionUncheckedUpdateWithoutLinkedAccountsInput>
    create: XOR<ConnectionCreateWithoutLinkedAccountsInput, ConnectionUncheckedCreateWithoutLinkedAccountsInput>
    where?: ConnectionWhereInput
  }

  export type ConnectionUpdateToOneWithWhereWithoutLinkedAccountsInput = {
    where?: ConnectionWhereInput
    data: XOR<ConnectionUpdateWithoutLinkedAccountsInput, ConnectionUncheckedUpdateWithoutLinkedAccountsInput>
  }

  export type ConnectionUpdateWithoutLinkedAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    providerAccountName?: StringFieldUpdateOperationsInput | string
    providerUrl?: StringFieldUpdateOperationsInput | string
    secretToken?: NullableStringFieldUpdateOperationsInput | string | null
    secretLastFour?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    scopes?: ConnectionUpdatescopesInput | string[]
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repositories?: LinkedRepositoryUpdateManyWithoutConnectionNestedInput
  }

  export type ConnectionUncheckedUpdateWithoutLinkedAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    providerAccountName?: StringFieldUpdateOperationsInput | string
    providerUrl?: StringFieldUpdateOperationsInput | string
    secretToken?: NullableStringFieldUpdateOperationsInput | string | null
    secretLastFour?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    scopes?: ConnectionUpdatescopesInput | string[]
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    repositories?: LinkedRepositoryUncheckedUpdateManyWithoutConnectionNestedInput
  }

  export type LinkedRepositoryUpsertWithWhereUniqueWithoutAssumeAccountInput = {
    where: LinkedRepositoryWhereUniqueInput
    update: XOR<LinkedRepositoryUpdateWithoutAssumeAccountInput, LinkedRepositoryUncheckedUpdateWithoutAssumeAccountInput>
    create: XOR<LinkedRepositoryCreateWithoutAssumeAccountInput, LinkedRepositoryUncheckedCreateWithoutAssumeAccountInput>
  }

  export type LinkedRepositoryUpdateWithWhereUniqueWithoutAssumeAccountInput = {
    where: LinkedRepositoryWhereUniqueInput
    data: XOR<LinkedRepositoryUpdateWithoutAssumeAccountInput, LinkedRepositoryUncheckedUpdateWithoutAssumeAccountInput>
  }

  export type LinkedRepositoryUpdateManyWithWhereWithoutAssumeAccountInput = {
    where: LinkedRepositoryScalarWhereInput
    data: XOR<LinkedRepositoryUpdateManyMutationInput, LinkedRepositoryUncheckedUpdateManyWithoutAssumeAccountInput>
  }

  export type ConnectionCreateWithoutRepositoriesInput = {
    id?: string
    name: string
    provider: string
    authMethod: string
    providerAccountName: string
    providerUrl: string
    secretToken?: string | null
    secretLastFour?: string | null
    isDefault?: boolean
    status: string
    scopes?: ConnectionCreatescopesInput | string[]
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    linkedAccounts?: LinkedAccountCreateNestedManyWithoutConnectionInput
  }

  export type ConnectionUncheckedCreateWithoutRepositoriesInput = {
    id?: string
    name: string
    provider: string
    authMethod: string
    providerAccountName: string
    providerUrl: string
    secretToken?: string | null
    secretLastFour?: string | null
    isDefault?: boolean
    status: string
    scopes?: ConnectionCreatescopesInput | string[]
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    linkedAccounts?: LinkedAccountUncheckedCreateNestedManyWithoutConnectionInput
  }

  export type ConnectionCreateOrConnectWithoutRepositoriesInput = {
    where: ConnectionWhereUniqueInput
    create: XOR<ConnectionCreateWithoutRepositoriesInput, ConnectionUncheckedCreateWithoutRepositoriesInput>
  }

  export type LinkedAccountCreateWithoutAssumedByReposInput = {
    id?: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl?: string | null
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
    connection?: ConnectionCreateNestedOneWithoutLinkedAccountsInput
  }

  export type LinkedAccountUncheckedCreateWithoutAssumedByReposInput = {
    id?: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl?: string | null
    connectionId?: string | null
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkedAccountCreateOrConnectWithoutAssumedByReposInput = {
    where: LinkedAccountWhereUniqueInput
    create: XOR<LinkedAccountCreateWithoutAssumedByReposInput, LinkedAccountUncheckedCreateWithoutAssumedByReposInput>
  }

  export type WebhookConfigCreateWithoutRepositoryInput = {
    id?: string
    event: string
    endpointPath: string
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type WebhookConfigUncheckedCreateWithoutRepositoryInput = {
    id?: string
    event: string
    endpointPath: string
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type WebhookConfigCreateOrConnectWithoutRepositoryInput = {
    where: WebhookConfigWhereUniqueInput
    create: XOR<WebhookConfigCreateWithoutRepositoryInput, WebhookConfigUncheckedCreateWithoutRepositoryInput>
  }

  export type WebhookConfigCreateManyRepositoryInputEnvelope = {
    data: WebhookConfigCreateManyRepositoryInput | WebhookConfigCreateManyRepositoryInput[]
    skipDuplicates?: boolean
  }

  export type ConnectionUpsertWithoutRepositoriesInput = {
    update: XOR<ConnectionUpdateWithoutRepositoriesInput, ConnectionUncheckedUpdateWithoutRepositoriesInput>
    create: XOR<ConnectionCreateWithoutRepositoriesInput, ConnectionUncheckedCreateWithoutRepositoriesInput>
    where?: ConnectionWhereInput
  }

  export type ConnectionUpdateToOneWithWhereWithoutRepositoriesInput = {
    where?: ConnectionWhereInput
    data: XOR<ConnectionUpdateWithoutRepositoriesInput, ConnectionUncheckedUpdateWithoutRepositoriesInput>
  }

  export type ConnectionUpdateWithoutRepositoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    providerAccountName?: StringFieldUpdateOperationsInput | string
    providerUrl?: StringFieldUpdateOperationsInput | string
    secretToken?: NullableStringFieldUpdateOperationsInput | string | null
    secretLastFour?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    scopes?: ConnectionUpdatescopesInput | string[]
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    linkedAccounts?: LinkedAccountUpdateManyWithoutConnectionNestedInput
  }

  export type ConnectionUncheckedUpdateWithoutRepositoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    providerAccountName?: StringFieldUpdateOperationsInput | string
    providerUrl?: StringFieldUpdateOperationsInput | string
    secretToken?: NullableStringFieldUpdateOperationsInput | string | null
    secretLastFour?: NullableStringFieldUpdateOperationsInput | string | null
    isDefault?: BoolFieldUpdateOperationsInput | boolean
    status?: StringFieldUpdateOperationsInput | string
    scopes?: ConnectionUpdatescopesInput | string[]
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    linkedAccounts?: LinkedAccountUncheckedUpdateManyWithoutConnectionNestedInput
  }

  export type LinkedAccountUpsertWithoutAssumedByReposInput = {
    update: XOR<LinkedAccountUpdateWithoutAssumedByReposInput, LinkedAccountUncheckedUpdateWithoutAssumedByReposInput>
    create: XOR<LinkedAccountCreateWithoutAssumedByReposInput, LinkedAccountUncheckedCreateWithoutAssumedByReposInput>
    where?: LinkedAccountWhereInput
  }

  export type LinkedAccountUpdateToOneWithWhereWithoutAssumedByReposInput = {
    where?: LinkedAccountWhereInput
    data: XOR<LinkedAccountUpdateWithoutAssumedByReposInput, LinkedAccountUncheckedUpdateWithoutAssumedByReposInput>
  }

  export type LinkedAccountUpdateWithoutAssumedByReposInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    connection?: ConnectionUpdateOneWithoutLinkedAccountsNestedInput
  }

  export type LinkedAccountUncheckedUpdateWithoutAssumedByReposInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    connectionId?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookConfigUpsertWithWhereUniqueWithoutRepositoryInput = {
    where: WebhookConfigWhereUniqueInput
    update: XOR<WebhookConfigUpdateWithoutRepositoryInput, WebhookConfigUncheckedUpdateWithoutRepositoryInput>
    create: XOR<WebhookConfigCreateWithoutRepositoryInput, WebhookConfigUncheckedCreateWithoutRepositoryInput>
  }

  export type WebhookConfigUpdateWithWhereUniqueWithoutRepositoryInput = {
    where: WebhookConfigWhereUniqueInput
    data: XOR<WebhookConfigUpdateWithoutRepositoryInput, WebhookConfigUncheckedUpdateWithoutRepositoryInput>
  }

  export type WebhookConfigUpdateManyWithWhereWithoutRepositoryInput = {
    where: WebhookConfigScalarWhereInput
    data: XOR<WebhookConfigUpdateManyMutationInput, WebhookConfigUncheckedUpdateManyWithoutRepositoryInput>
  }

  export type WebhookConfigScalarWhereInput = {
    AND?: WebhookConfigScalarWhereInput | WebhookConfigScalarWhereInput[]
    OR?: WebhookConfigScalarWhereInput[]
    NOT?: WebhookConfigScalarWhereInput | WebhookConfigScalarWhereInput[]
    id?: StringFilter<"WebhookConfig"> | string
    repositoryId?: StringFilter<"WebhookConfig"> | string
    event?: StringFilter<"WebhookConfig"> | string
    endpointPath?: StringFilter<"WebhookConfig"> | string
    active?: BoolFilter<"WebhookConfig"> | boolean
    secretConfigured?: BoolFilter<"WebhookConfig"> | boolean
    lastTriggeredAt?: DateTimeNullableFilter<"WebhookConfig"> | Date | string | null
    createdAt?: DateTimeFilter<"WebhookConfig"> | Date | string
  }

  export type LinkedRepositoryCreateWithoutWebhooksInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    defaultBranch: string
    identityMode: string
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    connection: ConnectionCreateNestedOneWithoutRepositoriesInput
    assumeAccount?: LinkedAccountCreateNestedOneWithoutAssumedByReposInput
  }

  export type LinkedRepositoryUncheckedCreateWithoutWebhooksInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    connectionId: string
    defaultBranch: string
    identityMode: string
    assumeAccountId?: string | null
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LinkedRepositoryCreateOrConnectWithoutWebhooksInput = {
    where: LinkedRepositoryWhereUniqueInput
    create: XOR<LinkedRepositoryCreateWithoutWebhooksInput, LinkedRepositoryUncheckedCreateWithoutWebhooksInput>
  }

  export type LinkedRepositoryUpsertWithoutWebhooksInput = {
    update: XOR<LinkedRepositoryUpdateWithoutWebhooksInput, LinkedRepositoryUncheckedUpdateWithoutWebhooksInput>
    create: XOR<LinkedRepositoryCreateWithoutWebhooksInput, LinkedRepositoryUncheckedCreateWithoutWebhooksInput>
    where?: LinkedRepositoryWhereInput
  }

  export type LinkedRepositoryUpdateToOneWithWhereWithoutWebhooksInput = {
    where?: LinkedRepositoryWhereInput
    data: XOR<LinkedRepositoryUpdateWithoutWebhooksInput, LinkedRepositoryUncheckedUpdateWithoutWebhooksInput>
  }

  export type LinkedRepositoryUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    connection?: ConnectionUpdateOneRequiredWithoutRepositoriesNestedInput
    assumeAccount?: LinkedAccountUpdateOneWithoutAssumedByReposNestedInput
  }

  export type LinkedRepositoryUncheckedUpdateWithoutWebhooksInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    connectionId?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    assumeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunCreateWithoutWorkItemInput = {
    id?: string
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    steps?: AgentStepCreateNestedManyWithoutRunInput
    pullRequests?: PullRequestCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateWithoutWorkItemInput = {
    id?: string
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    steps?: AgentStepUncheckedCreateNestedManyWithoutRunInput
    pullRequests?: PullRequestUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunCreateOrConnectWithoutWorkItemInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutWorkItemInput, AgentRunUncheckedCreateWithoutWorkItemInput>
  }

  export type AgentRunCreateManyWorkItemInputEnvelope = {
    data: AgentRunCreateManyWorkItemInput | AgentRunCreateManyWorkItemInput[]
    skipDuplicates?: boolean
  }

  export type PullRequestCreateWithoutWorkItemInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    run: AgentRunCreateNestedOneWithoutPullRequestsInput
  }

  export type PullRequestUncheckedCreateWithoutWorkItemInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    runId: string
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PullRequestCreateOrConnectWithoutWorkItemInput = {
    where: PullRequestWhereUniqueInput
    create: XOR<PullRequestCreateWithoutWorkItemInput, PullRequestUncheckedCreateWithoutWorkItemInput>
  }

  export type PullRequestCreateManyWorkItemInputEnvelope = {
    data: PullRequestCreateManyWorkItemInput | PullRequestCreateManyWorkItemInput[]
    skipDuplicates?: boolean
  }

  export type AgentRunUpsertWithWhereUniqueWithoutWorkItemInput = {
    where: AgentRunWhereUniqueInput
    update: XOR<AgentRunUpdateWithoutWorkItemInput, AgentRunUncheckedUpdateWithoutWorkItemInput>
    create: XOR<AgentRunCreateWithoutWorkItemInput, AgentRunUncheckedCreateWithoutWorkItemInput>
  }

  export type AgentRunUpdateWithWhereUniqueWithoutWorkItemInput = {
    where: AgentRunWhereUniqueInput
    data: XOR<AgentRunUpdateWithoutWorkItemInput, AgentRunUncheckedUpdateWithoutWorkItemInput>
  }

  export type AgentRunUpdateManyWithWhereWithoutWorkItemInput = {
    where: AgentRunScalarWhereInput
    data: XOR<AgentRunUpdateManyMutationInput, AgentRunUncheckedUpdateManyWithoutWorkItemInput>
  }

  export type AgentRunScalarWhereInput = {
    AND?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
    OR?: AgentRunScalarWhereInput[]
    NOT?: AgentRunScalarWhereInput | AgentRunScalarWhereInput[]
    id?: StringFilter<"AgentRun"> | string
    workItemId?: StringNullableFilter<"AgentRun"> | string | null
    repositoryFullName?: StringNullableFilter<"AgentRun"> | string | null
    userQuery?: StringNullableFilter<"AgentRun"> | string | null
    status?: StringFilter<"AgentRun"> | string
    branchName?: StringNullableFilter<"AgentRun"> | string | null
    prId?: StringNullableFilter<"AgentRun"> | string | null
    error?: StringNullableFilter<"AgentRun"> | string | null
    planSummary?: StringNullableFilter<"AgentRun"> | string | null
    planFiles?: JsonNullableFilter<"AgentRun">
    totalPromptTokens?: IntNullableFilter<"AgentRun"> | number | null
    totalCompletionTokens?: IntNullableFilter<"AgentRun"> | number | null
    totalTokens?: IntNullableFilter<"AgentRun"> | number | null
    currentIteration?: IntNullableFilter<"AgentRun"> | number | null
    maxIterations?: IntNullableFilter<"AgentRun"> | number | null
    lastChanges?: JsonNullableFilter<"AgentRun">
    startedAt?: DateTimeFilter<"AgentRun"> | Date | string
    completedAt?: DateTimeNullableFilter<"AgentRun"> | Date | string | null
  }

  export type PullRequestUpsertWithWhereUniqueWithoutWorkItemInput = {
    where: PullRequestWhereUniqueInput
    update: XOR<PullRequestUpdateWithoutWorkItemInput, PullRequestUncheckedUpdateWithoutWorkItemInput>
    create: XOR<PullRequestCreateWithoutWorkItemInput, PullRequestUncheckedCreateWithoutWorkItemInput>
  }

  export type PullRequestUpdateWithWhereUniqueWithoutWorkItemInput = {
    where: PullRequestWhereUniqueInput
    data: XOR<PullRequestUpdateWithoutWorkItemInput, PullRequestUncheckedUpdateWithoutWorkItemInput>
  }

  export type PullRequestUpdateManyWithWhereWithoutWorkItemInput = {
    where: PullRequestScalarWhereInput
    data: XOR<PullRequestUpdateManyMutationInput, PullRequestUncheckedUpdateManyWithoutWorkItemInput>
  }

  export type PullRequestScalarWhereInput = {
    AND?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
    OR?: PullRequestScalarWhereInput[]
    NOT?: PullRequestScalarWhereInput | PullRequestScalarWhereInput[]
    id?: StringFilter<"PullRequest"> | string
    prNumber?: IntNullableFilter<"PullRequest"> | number | null
    azurePRId?: IntNullableFilter<"PullRequest"> | number | null
    title?: StringFilter<"PullRequest"> | string
    sourceBranch?: StringFilter<"PullRequest"> | string
    targetBranch?: StringFilter<"PullRequest"> | string
    status?: StringFilter<"PullRequest"> | string
    reviewerAlias?: StringNullableFilter<"PullRequest"> | string | null
    rejectionComment?: StringNullableFilter<"PullRequest"> | string | null
    workItemId?: StringNullableFilter<"PullRequest"> | string | null
    runId?: StringFilter<"PullRequest"> | string
    url?: StringFilter<"PullRequest"> | string
    repositoryFullName?: StringNullableFilter<"PullRequest"> | string | null
    createdAt?: DateTimeFilter<"PullRequest"> | Date | string
    updatedAt?: DateTimeFilter<"PullRequest"> | Date | string
  }

  export type WorkItemCreateWithoutAgentRunsInput = {
    id?: string
    azureId: number
    title: string
    description: string
    userQuery?: string | null
    type: string
    status?: string
    assignedTo?: string | null
    repositoryFullName?: string | null
    targetBranch?: string | null
    linkedRunId?: string | null
    linkedPRId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pullRequests?: PullRequestCreateNestedManyWithoutWorkItemInput
  }

  export type WorkItemUncheckedCreateWithoutAgentRunsInput = {
    id?: string
    azureId: number
    title: string
    description: string
    userQuery?: string | null
    type: string
    status?: string
    assignedTo?: string | null
    repositoryFullName?: string | null
    targetBranch?: string | null
    linkedRunId?: string | null
    linkedPRId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    pullRequests?: PullRequestUncheckedCreateNestedManyWithoutWorkItemInput
  }

  export type WorkItemCreateOrConnectWithoutAgentRunsInput = {
    where: WorkItemWhereUniqueInput
    create: XOR<WorkItemCreateWithoutAgentRunsInput, WorkItemUncheckedCreateWithoutAgentRunsInput>
  }

  export type AgentStepCreateWithoutRunInput = {
    id?: string
    type: string
    status?: string
    label: string
    detail?: string | null
    order?: number
    durationMs?: number | null
    timestamp?: Date | string
  }

  export type AgentStepUncheckedCreateWithoutRunInput = {
    id?: string
    type: string
    status?: string
    label: string
    detail?: string | null
    order?: number
    durationMs?: number | null
    timestamp?: Date | string
  }

  export type AgentStepCreateOrConnectWithoutRunInput = {
    where: AgentStepWhereUniqueInput
    create: XOR<AgentStepCreateWithoutRunInput, AgentStepUncheckedCreateWithoutRunInput>
  }

  export type AgentStepCreateManyRunInputEnvelope = {
    data: AgentStepCreateManyRunInput | AgentStepCreateManyRunInput[]
    skipDuplicates?: boolean
  }

  export type PullRequestCreateWithoutRunInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    workItem?: WorkItemCreateNestedOneWithoutPullRequestsInput
  }

  export type PullRequestUncheckedCreateWithoutRunInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    workItemId?: string | null
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PullRequestCreateOrConnectWithoutRunInput = {
    where: PullRequestWhereUniqueInput
    create: XOR<PullRequestCreateWithoutRunInput, PullRequestUncheckedCreateWithoutRunInput>
  }

  export type PullRequestCreateManyRunInputEnvelope = {
    data: PullRequestCreateManyRunInput | PullRequestCreateManyRunInput[]
    skipDuplicates?: boolean
  }

  export type WorkItemUpsertWithoutAgentRunsInput = {
    update: XOR<WorkItemUpdateWithoutAgentRunsInput, WorkItemUncheckedUpdateWithoutAgentRunsInput>
    create: XOR<WorkItemCreateWithoutAgentRunsInput, WorkItemUncheckedCreateWithoutAgentRunsInput>
    where?: WorkItemWhereInput
  }

  export type WorkItemUpdateToOneWithWhereWithoutAgentRunsInput = {
    where?: WorkItemWhereInput
    data: XOR<WorkItemUpdateWithoutAgentRunsInput, WorkItemUncheckedUpdateWithoutAgentRunsInput>
  }

  export type WorkItemUpdateWithoutAgentRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    azureId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    targetBranch?: NullableStringFieldUpdateOperationsInput | string | null
    linkedRunId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedPRId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pullRequests?: PullRequestUpdateManyWithoutWorkItemNestedInput
  }

  export type WorkItemUncheckedUpdateWithoutAgentRunsInput = {
    id?: StringFieldUpdateOperationsInput | string
    azureId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    targetBranch?: NullableStringFieldUpdateOperationsInput | string | null
    linkedRunId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedPRId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pullRequests?: PullRequestUncheckedUpdateManyWithoutWorkItemNestedInput
  }

  export type AgentStepUpsertWithWhereUniqueWithoutRunInput = {
    where: AgentStepWhereUniqueInput
    update: XOR<AgentStepUpdateWithoutRunInput, AgentStepUncheckedUpdateWithoutRunInput>
    create: XOR<AgentStepCreateWithoutRunInput, AgentStepUncheckedCreateWithoutRunInput>
  }

  export type AgentStepUpdateWithWhereUniqueWithoutRunInput = {
    where: AgentStepWhereUniqueInput
    data: XOR<AgentStepUpdateWithoutRunInput, AgentStepUncheckedUpdateWithoutRunInput>
  }

  export type AgentStepUpdateManyWithWhereWithoutRunInput = {
    where: AgentStepScalarWhereInput
    data: XOR<AgentStepUpdateManyMutationInput, AgentStepUncheckedUpdateManyWithoutRunInput>
  }

  export type AgentStepScalarWhereInput = {
    AND?: AgentStepScalarWhereInput | AgentStepScalarWhereInput[]
    OR?: AgentStepScalarWhereInput[]
    NOT?: AgentStepScalarWhereInput | AgentStepScalarWhereInput[]
    id?: StringFilter<"AgentStep"> | string
    runId?: StringFilter<"AgentStep"> | string
    type?: StringFilter<"AgentStep"> | string
    status?: StringFilter<"AgentStep"> | string
    label?: StringFilter<"AgentStep"> | string
    detail?: StringNullableFilter<"AgentStep"> | string | null
    order?: IntFilter<"AgentStep"> | number
    durationMs?: IntNullableFilter<"AgentStep"> | number | null
    timestamp?: DateTimeFilter<"AgentStep"> | Date | string
  }

  export type PullRequestUpsertWithWhereUniqueWithoutRunInput = {
    where: PullRequestWhereUniqueInput
    update: XOR<PullRequestUpdateWithoutRunInput, PullRequestUncheckedUpdateWithoutRunInput>
    create: XOR<PullRequestCreateWithoutRunInput, PullRequestUncheckedCreateWithoutRunInput>
  }

  export type PullRequestUpdateWithWhereUniqueWithoutRunInput = {
    where: PullRequestWhereUniqueInput
    data: XOR<PullRequestUpdateWithoutRunInput, PullRequestUncheckedUpdateWithoutRunInput>
  }

  export type PullRequestUpdateManyWithWhereWithoutRunInput = {
    where: PullRequestScalarWhereInput
    data: XOR<PullRequestUpdateManyMutationInput, PullRequestUncheckedUpdateManyWithoutRunInput>
  }

  export type AgentRunCreateWithoutStepsInput = {
    id?: string
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    workItem?: WorkItemCreateNestedOneWithoutAgentRunsInput
    pullRequests?: PullRequestCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateWithoutStepsInput = {
    id?: string
    workItemId?: string | null
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    pullRequests?: PullRequestUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunCreateOrConnectWithoutStepsInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutStepsInput, AgentRunUncheckedCreateWithoutStepsInput>
  }

  export type AgentRunUpsertWithoutStepsInput = {
    update: XOR<AgentRunUpdateWithoutStepsInput, AgentRunUncheckedUpdateWithoutStepsInput>
    create: XOR<AgentRunCreateWithoutStepsInput, AgentRunUncheckedCreateWithoutStepsInput>
    where?: AgentRunWhereInput
  }

  export type AgentRunUpdateToOneWithWhereWithoutStepsInput = {
    where?: AgentRunWhereInput
    data: XOR<AgentRunUpdateWithoutStepsInput, AgentRunUncheckedUpdateWithoutStepsInput>
  }

  export type AgentRunUpdateWithoutStepsInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    workItem?: WorkItemUpdateOneWithoutAgentRunsNestedInput
    pullRequests?: PullRequestUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutStepsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workItemId?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    pullRequests?: PullRequestUncheckedUpdateManyWithoutRunNestedInput
  }

  export type WorkItemCreateWithoutPullRequestsInput = {
    id?: string
    azureId: number
    title: string
    description: string
    userQuery?: string | null
    type: string
    status?: string
    assignedTo?: string | null
    repositoryFullName?: string | null
    targetBranch?: string | null
    linkedRunId?: string | null
    linkedPRId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agentRuns?: AgentRunCreateNestedManyWithoutWorkItemInput
  }

  export type WorkItemUncheckedCreateWithoutPullRequestsInput = {
    id?: string
    azureId: number
    title: string
    description: string
    userQuery?: string | null
    type: string
    status?: string
    assignedTo?: string | null
    repositoryFullName?: string | null
    targetBranch?: string | null
    linkedRunId?: string | null
    linkedPRId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    agentRuns?: AgentRunUncheckedCreateNestedManyWithoutWorkItemInput
  }

  export type WorkItemCreateOrConnectWithoutPullRequestsInput = {
    where: WorkItemWhereUniqueInput
    create: XOR<WorkItemCreateWithoutPullRequestsInput, WorkItemUncheckedCreateWithoutPullRequestsInput>
  }

  export type AgentRunCreateWithoutPullRequestsInput = {
    id?: string
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    workItem?: WorkItemCreateNestedOneWithoutAgentRunsInput
    steps?: AgentStepCreateNestedManyWithoutRunInput
  }

  export type AgentRunUncheckedCreateWithoutPullRequestsInput = {
    id?: string
    workItemId?: string | null
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
    steps?: AgentStepUncheckedCreateNestedManyWithoutRunInput
  }

  export type AgentRunCreateOrConnectWithoutPullRequestsInput = {
    where: AgentRunWhereUniqueInput
    create: XOR<AgentRunCreateWithoutPullRequestsInput, AgentRunUncheckedCreateWithoutPullRequestsInput>
  }

  export type WorkItemUpsertWithoutPullRequestsInput = {
    update: XOR<WorkItemUpdateWithoutPullRequestsInput, WorkItemUncheckedUpdateWithoutPullRequestsInput>
    create: XOR<WorkItemCreateWithoutPullRequestsInput, WorkItemUncheckedCreateWithoutPullRequestsInput>
    where?: WorkItemWhereInput
  }

  export type WorkItemUpdateToOneWithWhereWithoutPullRequestsInput = {
    where?: WorkItemWhereInput
    data: XOR<WorkItemUpdateWithoutPullRequestsInput, WorkItemUncheckedUpdateWithoutPullRequestsInput>
  }

  export type WorkItemUpdateWithoutPullRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    azureId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    targetBranch?: NullableStringFieldUpdateOperationsInput | string | null
    linkedRunId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedPRId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRuns?: AgentRunUpdateManyWithoutWorkItemNestedInput
  }

  export type WorkItemUncheckedUpdateWithoutPullRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    azureId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    assignedTo?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    targetBranch?: NullableStringFieldUpdateOperationsInput | string | null
    linkedRunId?: NullableStringFieldUpdateOperationsInput | string | null
    linkedPRId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    agentRuns?: AgentRunUncheckedUpdateManyWithoutWorkItemNestedInput
  }

  export type AgentRunUpsertWithoutPullRequestsInput = {
    update: XOR<AgentRunUpdateWithoutPullRequestsInput, AgentRunUncheckedUpdateWithoutPullRequestsInput>
    create: XOR<AgentRunCreateWithoutPullRequestsInput, AgentRunUncheckedCreateWithoutPullRequestsInput>
    where?: AgentRunWhereInput
  }

  export type AgentRunUpdateToOneWithWhereWithoutPullRequestsInput = {
    where?: AgentRunWhereInput
    data: XOR<AgentRunUpdateWithoutPullRequestsInput, AgentRunUncheckedUpdateWithoutPullRequestsInput>
  }

  export type AgentRunUpdateWithoutPullRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    workItem?: WorkItemUpdateOneWithoutAgentRunsNestedInput
    steps?: AgentStepUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutPullRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    workItemId?: NullableStringFieldUpdateOperationsInput | string | null
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    steps?: AgentStepUncheckedUpdateManyWithoutRunNestedInput
  }

  export type LinkedAccountCreateManyConnectionInput = {
    id?: string
    displayName: string
    providerUsername: string
    email: string
    provider: string
    authMethod: string
    status: string
    avatarUrl?: string | null
    expiresAt?: Date | string | null
    lastUsedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkedRepositoryCreateManyConnectionInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    defaultBranch: string
    identityMode: string
    assumeAccountId?: string | null
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LinkedAccountUpdateWithoutConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assumedByRepos?: LinkedRepositoryUpdateManyWithoutAssumeAccountNestedInput
  }

  export type LinkedAccountUncheckedUpdateWithoutConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assumedByRepos?: LinkedRepositoryUncheckedUpdateManyWithoutAssumeAccountNestedInput
  }

  export type LinkedAccountUncheckedUpdateManyWithoutConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    providerUsername?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    authMethod?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUsedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkedRepositoryUpdateWithoutConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assumeAccount?: LinkedAccountUpdateOneWithoutAssumedByReposNestedInput
    webhooks?: WebhookConfigUpdateManyWithoutRepositoryNestedInput
  }

  export type LinkedRepositoryUncheckedUpdateWithoutConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    assumeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    webhooks?: WebhookConfigUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type LinkedRepositoryUncheckedUpdateManyWithoutConnectionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    assumeAccountId?: NullableStringFieldUpdateOperationsInput | string | null
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkedRepositoryCreateManyAssumeAccountInput = {
    id?: string
    name: string
    fullName: string
    provider: string
    connectionId: string
    defaultBranch: string
    identityMode: string
    indexEnabled?: boolean
    defaultReviewer?: string | null
    webhookActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LinkedRepositoryUpdateWithoutAssumeAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    connection?: ConnectionUpdateOneRequiredWithoutRepositoriesNestedInput
    webhooks?: WebhookConfigUpdateManyWithoutRepositoryNestedInput
  }

  export type LinkedRepositoryUncheckedUpdateWithoutAssumeAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    connectionId?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    webhooks?: WebhookConfigUncheckedUpdateManyWithoutRepositoryNestedInput
  }

  export type LinkedRepositoryUncheckedUpdateManyWithoutAssumeAccountInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    connectionId?: StringFieldUpdateOperationsInput | string
    defaultBranch?: StringFieldUpdateOperationsInput | string
    identityMode?: StringFieldUpdateOperationsInput | string
    indexEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultReviewer?: NullableStringFieldUpdateOperationsInput | string | null
    webhookActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookConfigCreateManyRepositoryInput = {
    id?: string
    event: string
    endpointPath: string
    active?: boolean
    secretConfigured?: boolean
    lastTriggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type WebhookConfigUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    endpointPath?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    secretConfigured?: BoolFieldUpdateOperationsInput | boolean
    lastTriggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookConfigUncheckedUpdateWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    endpointPath?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    secretConfigured?: BoolFieldUpdateOperationsInput | boolean
    lastTriggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type WebhookConfigUncheckedUpdateManyWithoutRepositoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    event?: StringFieldUpdateOperationsInput | string
    endpointPath?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    secretConfigured?: BoolFieldUpdateOperationsInput | boolean
    lastTriggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentRunCreateManyWorkItemInput = {
    id?: string
    repositoryFullName?: string | null
    userQuery?: string | null
    status?: string
    branchName?: string | null
    prId?: string | null
    error?: string | null
    planSummary?: string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: number | null
    totalCompletionTokens?: number | null
    totalTokens?: number | null
    currentIteration?: number | null
    maxIterations?: number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: Date | string
    completedAt?: Date | string | null
  }

  export type PullRequestCreateManyWorkItemInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    runId: string
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentRunUpdateWithoutWorkItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    steps?: AgentStepUpdateManyWithoutRunNestedInput
    pullRequests?: PullRequestUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateWithoutWorkItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    steps?: AgentStepUncheckedUpdateManyWithoutRunNestedInput
    pullRequests?: PullRequestUncheckedUpdateManyWithoutRunNestedInput
  }

  export type AgentRunUncheckedUpdateManyWithoutWorkItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    userQuery?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    branchName?: NullableStringFieldUpdateOperationsInput | string | null
    prId?: NullableStringFieldUpdateOperationsInput | string | null
    error?: NullableStringFieldUpdateOperationsInput | string | null
    planSummary?: NullableStringFieldUpdateOperationsInput | string | null
    planFiles?: NullableJsonNullValueInput | InputJsonValue
    totalPromptTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalCompletionTokens?: NullableIntFieldUpdateOperationsInput | number | null
    totalTokens?: NullableIntFieldUpdateOperationsInput | number | null
    currentIteration?: NullableIntFieldUpdateOperationsInput | number | null
    maxIterations?: NullableIntFieldUpdateOperationsInput | number | null
    lastChanges?: NullableJsonNullValueInput | InputJsonValue
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    completedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PullRequestUpdateWithoutWorkItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    run?: AgentRunUpdateOneRequiredWithoutPullRequestsNestedInput
  }

  export type PullRequestUncheckedUpdateWithoutWorkItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    runId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestUncheckedUpdateManyWithoutWorkItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    runId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentStepCreateManyRunInput = {
    id?: string
    type: string
    status?: string
    label: string
    detail?: string | null
    order?: number
    durationMs?: number | null
    timestamp?: Date | string
  }

  export type PullRequestCreateManyRunInput = {
    id?: string
    prNumber?: number | null
    azurePRId?: number | null
    title: string
    sourceBranch: string
    targetBranch: string
    status?: string
    reviewerAlias?: string | null
    rejectionComment?: string | null
    workItemId?: string | null
    url: string
    repositoryFullName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AgentStepUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentStepUncheckedUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AgentStepUncheckedUpdateManyWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    detail?: NullableStringFieldUpdateOperationsInput | string | null
    order?: IntFieldUpdateOperationsInput | number
    durationMs?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    workItem?: WorkItemUpdateOneWithoutPullRequestsNestedInput
  }

  export type PullRequestUncheckedUpdateWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    workItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PullRequestUncheckedUpdateManyWithoutRunInput = {
    id?: StringFieldUpdateOperationsInput | string
    prNumber?: NullableIntFieldUpdateOperationsInput | number | null
    azurePRId?: NullableIntFieldUpdateOperationsInput | number | null
    title?: StringFieldUpdateOperationsInput | string
    sourceBranch?: StringFieldUpdateOperationsInput | string
    targetBranch?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    reviewerAlias?: NullableStringFieldUpdateOperationsInput | string | null
    rejectionComment?: NullableStringFieldUpdateOperationsInput | string | null
    workItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    repositoryFullName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}