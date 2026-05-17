
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
 * Model UuidGenerationAttempt
 * 目的: UUIDv4 生成の全試行履歴を保持し、時系列表示と衝突表示に使う。
 */
export type UuidGenerationAttempt = $Result.DefaultSelection<Prisma.$UuidGenerationAttemptPayload>
/**
 * Model UuidRegistry
 * 目的: 生成済み UUIDv4 の一意集合を保持し、衝突回数を集計する。
 */
export type UuidRegistry = $Result.DefaultSelection<Prisma.$UuidRegistryPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const GenerateSource: {
  AUTO: 'AUTO',
  MANUAL: 'MANUAL'
};

export type GenerateSource = (typeof GenerateSource)[keyof typeof GenerateSource]

}

export type GenerateSource = $Enums.GenerateSource

export const GenerateSource: typeof $Enums.GenerateSource

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more UuidGenerationAttempts
 * const uuidGenerationAttempts = await prisma.uuidGenerationAttempt.findMany()
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
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more UuidGenerationAttempts
   * const uuidGenerationAttempts = await prisma.uuidGenerationAttempt.findMany()
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
   * `prisma.uuidGenerationAttempt`: Exposes CRUD operations for the **UuidGenerationAttempt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UuidGenerationAttempts
    * const uuidGenerationAttempts = await prisma.uuidGenerationAttempt.findMany()
    * ```
    */
  get uuidGenerationAttempt(): Prisma.UuidGenerationAttemptDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.uuidRegistry`: Exposes CRUD operations for the **UuidRegistry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UuidRegistries
    * const uuidRegistries = await prisma.uuidRegistry.findMany()
    * ```
    */
  get uuidRegistry(): Prisma.UuidRegistryDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 7.6.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
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
    UuidGenerationAttempt: 'UuidGenerationAttempt',
    UuidRegistry: 'UuidRegistry'
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
      modelProps: "uuidGenerationAttempt" | "uuidRegistry"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      UuidGenerationAttempt: {
        payload: Prisma.$UuidGenerationAttemptPayload<ExtArgs>
        fields: Prisma.UuidGenerationAttemptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UuidGenerationAttemptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UuidGenerationAttemptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>
          }
          findFirst: {
            args: Prisma.UuidGenerationAttemptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UuidGenerationAttemptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>
          }
          findMany: {
            args: Prisma.UuidGenerationAttemptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>[]
          }
          create: {
            args: Prisma.UuidGenerationAttemptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>
          }
          createMany: {
            args: Prisma.UuidGenerationAttemptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UuidGenerationAttemptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>[]
          }
          delete: {
            args: Prisma.UuidGenerationAttemptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>
          }
          update: {
            args: Prisma.UuidGenerationAttemptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>
          }
          deleteMany: {
            args: Prisma.UuidGenerationAttemptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UuidGenerationAttemptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UuidGenerationAttemptUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>[]
          }
          upsert: {
            args: Prisma.UuidGenerationAttemptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidGenerationAttemptPayload>
          }
          aggregate: {
            args: Prisma.UuidGenerationAttemptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUuidGenerationAttempt>
          }
          groupBy: {
            args: Prisma.UuidGenerationAttemptGroupByArgs<ExtArgs>
            result: $Utils.Optional<UuidGenerationAttemptGroupByOutputType>[]
          }
          count: {
            args: Prisma.UuidGenerationAttemptCountArgs<ExtArgs>
            result: $Utils.Optional<UuidGenerationAttemptCountAggregateOutputType> | number
          }
        }
      }
      UuidRegistry: {
        payload: Prisma.$UuidRegistryPayload<ExtArgs>
        fields: Prisma.UuidRegistryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UuidRegistryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UuidRegistryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>
          }
          findFirst: {
            args: Prisma.UuidRegistryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UuidRegistryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>
          }
          findMany: {
            args: Prisma.UuidRegistryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>[]
          }
          create: {
            args: Prisma.UuidRegistryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>
          }
          createMany: {
            args: Prisma.UuidRegistryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UuidRegistryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>[]
          }
          delete: {
            args: Prisma.UuidRegistryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>
          }
          update: {
            args: Prisma.UuidRegistryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>
          }
          deleteMany: {
            args: Prisma.UuidRegistryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UuidRegistryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UuidRegistryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>[]
          }
          upsert: {
            args: Prisma.UuidRegistryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UuidRegistryPayload>
          }
          aggregate: {
            args: Prisma.UuidRegistryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUuidRegistry>
          }
          groupBy: {
            args: Prisma.UuidRegistryGroupByArgs<ExtArgs>
            result: $Utils.Optional<UuidRegistryGroupByOutputType>[]
          }
          count: {
            args: Prisma.UuidRegistryCountArgs<ExtArgs>
            result: $Utils.Optional<UuidRegistryCountAggregateOutputType> | number
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
    uuidGenerationAttempt?: UuidGenerationAttemptOmit
    uuidRegistry?: UuidRegistryOmit
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
   * Models
   */

  /**
   * Model UuidGenerationAttempt
   */

  export type AggregateUuidGenerationAttempt = {
    _count: UuidGenerationAttemptCountAggregateOutputType | null
    _avg: UuidGenerationAttemptAvgAggregateOutputType | null
    _sum: UuidGenerationAttemptSumAggregateOutputType | null
    _min: UuidGenerationAttemptMinAggregateOutputType | null
    _max: UuidGenerationAttemptMaxAggregateOutputType | null
  }

  export type UuidGenerationAttemptAvgAggregateOutputType = {
    id: number | null
  }

  export type UuidGenerationAttemptSumAggregateOutputType = {
    id: bigint | null
  }

  export type UuidGenerationAttemptMinAggregateOutputType = {
    id: bigint | null
    uuid: string | null
    generateSource: $Enums.GenerateSource | null
    countryCode: string | null
    wasCollision: boolean | null
    createdAt: Date | null
  }

  export type UuidGenerationAttemptMaxAggregateOutputType = {
    id: bigint | null
    uuid: string | null
    generateSource: $Enums.GenerateSource | null
    countryCode: string | null
    wasCollision: boolean | null
    createdAt: Date | null
  }

  export type UuidGenerationAttemptCountAggregateOutputType = {
    id: number
    uuid: number
    generateSource: number
    countryCode: number
    wasCollision: number
    createdAt: number
    _all: number
  }


  export type UuidGenerationAttemptAvgAggregateInputType = {
    id?: true
  }

  export type UuidGenerationAttemptSumAggregateInputType = {
    id?: true
  }

  export type UuidGenerationAttemptMinAggregateInputType = {
    id?: true
    uuid?: true
    generateSource?: true
    countryCode?: true
    wasCollision?: true
    createdAt?: true
  }

  export type UuidGenerationAttemptMaxAggregateInputType = {
    id?: true
    uuid?: true
    generateSource?: true
    countryCode?: true
    wasCollision?: true
    createdAt?: true
  }

  export type UuidGenerationAttemptCountAggregateInputType = {
    id?: true
    uuid?: true
    generateSource?: true
    countryCode?: true
    wasCollision?: true
    createdAt?: true
    _all?: true
  }

  export type UuidGenerationAttemptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UuidGenerationAttempt to aggregate.
     */
    where?: UuidGenerationAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UuidGenerationAttempts to fetch.
     */
    orderBy?: UuidGenerationAttemptOrderByWithRelationInput | UuidGenerationAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UuidGenerationAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UuidGenerationAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UuidGenerationAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UuidGenerationAttempts
    **/
    _count?: true | UuidGenerationAttemptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UuidGenerationAttemptAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UuidGenerationAttemptSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UuidGenerationAttemptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UuidGenerationAttemptMaxAggregateInputType
  }

  export type GetUuidGenerationAttemptAggregateType<T extends UuidGenerationAttemptAggregateArgs> = {
        [P in keyof T & keyof AggregateUuidGenerationAttempt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUuidGenerationAttempt[P]>
      : GetScalarType<T[P], AggregateUuidGenerationAttempt[P]>
  }




  export type UuidGenerationAttemptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UuidGenerationAttemptWhereInput
    orderBy?: UuidGenerationAttemptOrderByWithAggregationInput | UuidGenerationAttemptOrderByWithAggregationInput[]
    by: UuidGenerationAttemptScalarFieldEnum[] | UuidGenerationAttemptScalarFieldEnum
    having?: UuidGenerationAttemptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UuidGenerationAttemptCountAggregateInputType | true
    _avg?: UuidGenerationAttemptAvgAggregateInputType
    _sum?: UuidGenerationAttemptSumAggregateInputType
    _min?: UuidGenerationAttemptMinAggregateInputType
    _max?: UuidGenerationAttemptMaxAggregateInputType
  }

  export type UuidGenerationAttemptGroupByOutputType = {
    id: bigint
    uuid: string
    generateSource: $Enums.GenerateSource
    countryCode: string | null
    wasCollision: boolean
    createdAt: Date
    _count: UuidGenerationAttemptCountAggregateOutputType | null
    _avg: UuidGenerationAttemptAvgAggregateOutputType | null
    _sum: UuidGenerationAttemptSumAggregateOutputType | null
    _min: UuidGenerationAttemptMinAggregateOutputType | null
    _max: UuidGenerationAttemptMaxAggregateOutputType | null
  }

  type GetUuidGenerationAttemptGroupByPayload<T extends UuidGenerationAttemptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UuidGenerationAttemptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UuidGenerationAttemptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UuidGenerationAttemptGroupByOutputType[P]>
            : GetScalarType<T[P], UuidGenerationAttemptGroupByOutputType[P]>
        }
      >
    >


  export type UuidGenerationAttemptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    generateSource?: boolean
    countryCode?: boolean
    wasCollision?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["uuidGenerationAttempt"]>

  export type UuidGenerationAttemptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    generateSource?: boolean
    countryCode?: boolean
    wasCollision?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["uuidGenerationAttempt"]>

  export type UuidGenerationAttemptSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    uuid?: boolean
    generateSource?: boolean
    countryCode?: boolean
    wasCollision?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["uuidGenerationAttempt"]>

  export type UuidGenerationAttemptSelectScalar = {
    id?: boolean
    uuid?: boolean
    generateSource?: boolean
    countryCode?: boolean
    wasCollision?: boolean
    createdAt?: boolean
  }

  export type UuidGenerationAttemptOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "uuid" | "generateSource" | "countryCode" | "wasCollision" | "createdAt", ExtArgs["result"]["uuidGenerationAttempt"]>

  export type $UuidGenerationAttemptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UuidGenerationAttempt"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      /**
       * 表示順と同時刻衝突回避に使う連番 ID。
       */
      id: bigint
      /**
       * 実際に生成された UUIDv4。
       */
      uuid: string
      /**
       * 自動生成か手動トリガーかを表す。
       */
      generateSource: $Enums.GenerateSource
      /**
       * 手動追加を実行したユーザの国コード。
       */
      countryCode: string | null
      /**
       * 既存 UUID と一致したか。
       */
      wasCollision: boolean
      /**
       * 試行日時。
       */
      createdAt: Date
    }, ExtArgs["result"]["uuidGenerationAttempt"]>
    composites: {}
  }

  type UuidGenerationAttemptGetPayload<S extends boolean | null | undefined | UuidGenerationAttemptDefaultArgs> = $Result.GetResult<Prisma.$UuidGenerationAttemptPayload, S>

  type UuidGenerationAttemptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UuidGenerationAttemptFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UuidGenerationAttemptCountAggregateInputType | true
    }

  export interface UuidGenerationAttemptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UuidGenerationAttempt'], meta: { name: 'UuidGenerationAttempt' } }
    /**
     * Find zero or one UuidGenerationAttempt that matches the filter.
     * @param {UuidGenerationAttemptFindUniqueArgs} args - Arguments to find a UuidGenerationAttempt
     * @example
     * // Get one UuidGenerationAttempt
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UuidGenerationAttemptFindUniqueArgs>(args: SelectSubset<T, UuidGenerationAttemptFindUniqueArgs<ExtArgs>>): Prisma__UuidGenerationAttemptClient<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UuidGenerationAttempt that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UuidGenerationAttemptFindUniqueOrThrowArgs} args - Arguments to find a UuidGenerationAttempt
     * @example
     * // Get one UuidGenerationAttempt
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UuidGenerationAttemptFindUniqueOrThrowArgs>(args: SelectSubset<T, UuidGenerationAttemptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UuidGenerationAttemptClient<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UuidGenerationAttempt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidGenerationAttemptFindFirstArgs} args - Arguments to find a UuidGenerationAttempt
     * @example
     * // Get one UuidGenerationAttempt
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UuidGenerationAttemptFindFirstArgs>(args?: SelectSubset<T, UuidGenerationAttemptFindFirstArgs<ExtArgs>>): Prisma__UuidGenerationAttemptClient<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UuidGenerationAttempt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidGenerationAttemptFindFirstOrThrowArgs} args - Arguments to find a UuidGenerationAttempt
     * @example
     * // Get one UuidGenerationAttempt
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UuidGenerationAttemptFindFirstOrThrowArgs>(args?: SelectSubset<T, UuidGenerationAttemptFindFirstOrThrowArgs<ExtArgs>>): Prisma__UuidGenerationAttemptClient<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UuidGenerationAttempts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidGenerationAttemptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UuidGenerationAttempts
     * const uuidGenerationAttempts = await prisma.uuidGenerationAttempt.findMany()
     * 
     * // Get first 10 UuidGenerationAttempts
     * const uuidGenerationAttempts = await prisma.uuidGenerationAttempt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const uuidGenerationAttemptWithIdOnly = await prisma.uuidGenerationAttempt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UuidGenerationAttemptFindManyArgs>(args?: SelectSubset<T, UuidGenerationAttemptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UuidGenerationAttempt.
     * @param {UuidGenerationAttemptCreateArgs} args - Arguments to create a UuidGenerationAttempt.
     * @example
     * // Create one UuidGenerationAttempt
     * const UuidGenerationAttempt = await prisma.uuidGenerationAttempt.create({
     *   data: {
     *     // ... data to create a UuidGenerationAttempt
     *   }
     * })
     * 
     */
    create<T extends UuidGenerationAttemptCreateArgs>(args: SelectSubset<T, UuidGenerationAttemptCreateArgs<ExtArgs>>): Prisma__UuidGenerationAttemptClient<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UuidGenerationAttempts.
     * @param {UuidGenerationAttemptCreateManyArgs} args - Arguments to create many UuidGenerationAttempts.
     * @example
     * // Create many UuidGenerationAttempts
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UuidGenerationAttemptCreateManyArgs>(args?: SelectSubset<T, UuidGenerationAttemptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UuidGenerationAttempts and returns the data saved in the database.
     * @param {UuidGenerationAttemptCreateManyAndReturnArgs} args - Arguments to create many UuidGenerationAttempts.
     * @example
     * // Create many UuidGenerationAttempts
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UuidGenerationAttempts and only return the `id`
     * const uuidGenerationAttemptWithIdOnly = await prisma.uuidGenerationAttempt.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UuidGenerationAttemptCreateManyAndReturnArgs>(args?: SelectSubset<T, UuidGenerationAttemptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UuidGenerationAttempt.
     * @param {UuidGenerationAttemptDeleteArgs} args - Arguments to delete one UuidGenerationAttempt.
     * @example
     * // Delete one UuidGenerationAttempt
     * const UuidGenerationAttempt = await prisma.uuidGenerationAttempt.delete({
     *   where: {
     *     // ... filter to delete one UuidGenerationAttempt
     *   }
     * })
     * 
     */
    delete<T extends UuidGenerationAttemptDeleteArgs>(args: SelectSubset<T, UuidGenerationAttemptDeleteArgs<ExtArgs>>): Prisma__UuidGenerationAttemptClient<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UuidGenerationAttempt.
     * @param {UuidGenerationAttemptUpdateArgs} args - Arguments to update one UuidGenerationAttempt.
     * @example
     * // Update one UuidGenerationAttempt
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UuidGenerationAttemptUpdateArgs>(args: SelectSubset<T, UuidGenerationAttemptUpdateArgs<ExtArgs>>): Prisma__UuidGenerationAttemptClient<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UuidGenerationAttempts.
     * @param {UuidGenerationAttemptDeleteManyArgs} args - Arguments to filter UuidGenerationAttempts to delete.
     * @example
     * // Delete a few UuidGenerationAttempts
     * const { count } = await prisma.uuidGenerationAttempt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UuidGenerationAttemptDeleteManyArgs>(args?: SelectSubset<T, UuidGenerationAttemptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UuidGenerationAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidGenerationAttemptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UuidGenerationAttempts
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UuidGenerationAttemptUpdateManyArgs>(args: SelectSubset<T, UuidGenerationAttemptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UuidGenerationAttempts and returns the data updated in the database.
     * @param {UuidGenerationAttemptUpdateManyAndReturnArgs} args - Arguments to update many UuidGenerationAttempts.
     * @example
     * // Update many UuidGenerationAttempts
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UuidGenerationAttempts and only return the `id`
     * const uuidGenerationAttemptWithIdOnly = await prisma.uuidGenerationAttempt.updateManyAndReturn({
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
    updateManyAndReturn<T extends UuidGenerationAttemptUpdateManyAndReturnArgs>(args: SelectSubset<T, UuidGenerationAttemptUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UuidGenerationAttempt.
     * @param {UuidGenerationAttemptUpsertArgs} args - Arguments to update or create a UuidGenerationAttempt.
     * @example
     * // Update or create a UuidGenerationAttempt
     * const uuidGenerationAttempt = await prisma.uuidGenerationAttempt.upsert({
     *   create: {
     *     // ... data to create a UuidGenerationAttempt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UuidGenerationAttempt we want to update
     *   }
     * })
     */
    upsert<T extends UuidGenerationAttemptUpsertArgs>(args: SelectSubset<T, UuidGenerationAttemptUpsertArgs<ExtArgs>>): Prisma__UuidGenerationAttemptClient<$Result.GetResult<Prisma.$UuidGenerationAttemptPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UuidGenerationAttempts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidGenerationAttemptCountArgs} args - Arguments to filter UuidGenerationAttempts to count.
     * @example
     * // Count the number of UuidGenerationAttempts
     * const count = await prisma.uuidGenerationAttempt.count({
     *   where: {
     *     // ... the filter for the UuidGenerationAttempts we want to count
     *   }
     * })
    **/
    count<T extends UuidGenerationAttemptCountArgs>(
      args?: Subset<T, UuidGenerationAttemptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UuidGenerationAttemptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UuidGenerationAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidGenerationAttemptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UuidGenerationAttemptAggregateArgs>(args: Subset<T, UuidGenerationAttemptAggregateArgs>): Prisma.PrismaPromise<GetUuidGenerationAttemptAggregateType<T>>

    /**
     * Group by UuidGenerationAttempt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidGenerationAttemptGroupByArgs} args - Group by arguments.
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
      T extends UuidGenerationAttemptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UuidGenerationAttemptGroupByArgs['orderBy'] }
        : { orderBy?: UuidGenerationAttemptGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UuidGenerationAttemptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUuidGenerationAttemptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UuidGenerationAttempt model
   */
  readonly fields: UuidGenerationAttemptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UuidGenerationAttempt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UuidGenerationAttemptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UuidGenerationAttempt model
   */
  interface UuidGenerationAttemptFieldRefs {
    readonly id: FieldRef<"UuidGenerationAttempt", 'BigInt'>
    readonly uuid: FieldRef<"UuidGenerationAttempt", 'String'>
    readonly generateSource: FieldRef<"UuidGenerationAttempt", 'GenerateSource'>
    readonly countryCode: FieldRef<"UuidGenerationAttempt", 'String'>
    readonly wasCollision: FieldRef<"UuidGenerationAttempt", 'Boolean'>
    readonly createdAt: FieldRef<"UuidGenerationAttempt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UuidGenerationAttempt findUnique
   */
  export type UuidGenerationAttemptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * Filter, which UuidGenerationAttempt to fetch.
     */
    where: UuidGenerationAttemptWhereUniqueInput
  }

  /**
   * UuidGenerationAttempt findUniqueOrThrow
   */
  export type UuidGenerationAttemptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * Filter, which UuidGenerationAttempt to fetch.
     */
    where: UuidGenerationAttemptWhereUniqueInput
  }

  /**
   * UuidGenerationAttempt findFirst
   */
  export type UuidGenerationAttemptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * Filter, which UuidGenerationAttempt to fetch.
     */
    where?: UuidGenerationAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UuidGenerationAttempts to fetch.
     */
    orderBy?: UuidGenerationAttemptOrderByWithRelationInput | UuidGenerationAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UuidGenerationAttempts.
     */
    cursor?: UuidGenerationAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UuidGenerationAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UuidGenerationAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UuidGenerationAttempts.
     */
    distinct?: UuidGenerationAttemptScalarFieldEnum | UuidGenerationAttemptScalarFieldEnum[]
  }

  /**
   * UuidGenerationAttempt findFirstOrThrow
   */
  export type UuidGenerationAttemptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * Filter, which UuidGenerationAttempt to fetch.
     */
    where?: UuidGenerationAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UuidGenerationAttempts to fetch.
     */
    orderBy?: UuidGenerationAttemptOrderByWithRelationInput | UuidGenerationAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UuidGenerationAttempts.
     */
    cursor?: UuidGenerationAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UuidGenerationAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UuidGenerationAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UuidGenerationAttempts.
     */
    distinct?: UuidGenerationAttemptScalarFieldEnum | UuidGenerationAttemptScalarFieldEnum[]
  }

  /**
   * UuidGenerationAttempt findMany
   */
  export type UuidGenerationAttemptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * Filter, which UuidGenerationAttempts to fetch.
     */
    where?: UuidGenerationAttemptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UuidGenerationAttempts to fetch.
     */
    orderBy?: UuidGenerationAttemptOrderByWithRelationInput | UuidGenerationAttemptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UuidGenerationAttempts.
     */
    cursor?: UuidGenerationAttemptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UuidGenerationAttempts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UuidGenerationAttempts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UuidGenerationAttempts.
     */
    distinct?: UuidGenerationAttemptScalarFieldEnum | UuidGenerationAttemptScalarFieldEnum[]
  }

  /**
   * UuidGenerationAttempt create
   */
  export type UuidGenerationAttemptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * The data needed to create a UuidGenerationAttempt.
     */
    data: XOR<UuidGenerationAttemptCreateInput, UuidGenerationAttemptUncheckedCreateInput>
  }

  /**
   * UuidGenerationAttempt createMany
   */
  export type UuidGenerationAttemptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UuidGenerationAttempts.
     */
    data: UuidGenerationAttemptCreateManyInput | UuidGenerationAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UuidGenerationAttempt createManyAndReturn
   */
  export type UuidGenerationAttemptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * The data used to create many UuidGenerationAttempts.
     */
    data: UuidGenerationAttemptCreateManyInput | UuidGenerationAttemptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UuidGenerationAttempt update
   */
  export type UuidGenerationAttemptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * The data needed to update a UuidGenerationAttempt.
     */
    data: XOR<UuidGenerationAttemptUpdateInput, UuidGenerationAttemptUncheckedUpdateInput>
    /**
     * Choose, which UuidGenerationAttempt to update.
     */
    where: UuidGenerationAttemptWhereUniqueInput
  }

  /**
   * UuidGenerationAttempt updateMany
   */
  export type UuidGenerationAttemptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UuidGenerationAttempts.
     */
    data: XOR<UuidGenerationAttemptUpdateManyMutationInput, UuidGenerationAttemptUncheckedUpdateManyInput>
    /**
     * Filter which UuidGenerationAttempts to update
     */
    where?: UuidGenerationAttemptWhereInput
    /**
     * Limit how many UuidGenerationAttempts to update.
     */
    limit?: number
  }

  /**
   * UuidGenerationAttempt updateManyAndReturn
   */
  export type UuidGenerationAttemptUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * The data used to update UuidGenerationAttempts.
     */
    data: XOR<UuidGenerationAttemptUpdateManyMutationInput, UuidGenerationAttemptUncheckedUpdateManyInput>
    /**
     * Filter which UuidGenerationAttempts to update
     */
    where?: UuidGenerationAttemptWhereInput
    /**
     * Limit how many UuidGenerationAttempts to update.
     */
    limit?: number
  }

  /**
   * UuidGenerationAttempt upsert
   */
  export type UuidGenerationAttemptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * The filter to search for the UuidGenerationAttempt to update in case it exists.
     */
    where: UuidGenerationAttemptWhereUniqueInput
    /**
     * In case the UuidGenerationAttempt found by the `where` argument doesn't exist, create a new UuidGenerationAttempt with this data.
     */
    create: XOR<UuidGenerationAttemptCreateInput, UuidGenerationAttemptUncheckedCreateInput>
    /**
     * In case the UuidGenerationAttempt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UuidGenerationAttemptUpdateInput, UuidGenerationAttemptUncheckedUpdateInput>
  }

  /**
   * UuidGenerationAttempt delete
   */
  export type UuidGenerationAttemptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
    /**
     * Filter which UuidGenerationAttempt to delete.
     */
    where: UuidGenerationAttemptWhereUniqueInput
  }

  /**
   * UuidGenerationAttempt deleteMany
   */
  export type UuidGenerationAttemptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UuidGenerationAttempts to delete
     */
    where?: UuidGenerationAttemptWhereInput
    /**
     * Limit how many UuidGenerationAttempts to delete.
     */
    limit?: number
  }

  /**
   * UuidGenerationAttempt without action
   */
  export type UuidGenerationAttemptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidGenerationAttempt
     */
    select?: UuidGenerationAttemptSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidGenerationAttempt
     */
    omit?: UuidGenerationAttemptOmit<ExtArgs> | null
  }


  /**
   * Model UuidRegistry
   */

  export type AggregateUuidRegistry = {
    _count: UuidRegistryCountAggregateOutputType | null
    _avg: UuidRegistryAvgAggregateOutputType | null
    _sum: UuidRegistrySumAggregateOutputType | null
    _min: UuidRegistryMinAggregateOutputType | null
    _max: UuidRegistryMaxAggregateOutputType | null
  }

  export type UuidRegistryAvgAggregateOutputType = {
    seenCount: number | null
  }

  export type UuidRegistrySumAggregateOutputType = {
    seenCount: number | null
  }

  export type UuidRegistryMinAggregateOutputType = {
    uuid: string | null
    uuidstr: string | null
    firstSeenAt: Date | null
    lastSeenAt: Date | null
    lastSource: $Enums.GenerateSource | null
    seenCount: number | null
  }

  export type UuidRegistryMaxAggregateOutputType = {
    uuid: string | null
    uuidstr: string | null
    firstSeenAt: Date | null
    lastSeenAt: Date | null
    lastSource: $Enums.GenerateSource | null
    seenCount: number | null
  }

  export type UuidRegistryCountAggregateOutputType = {
    uuid: number
    uuidstr: number
    firstSeenAt: number
    lastSeenAt: number
    lastSource: number
    seenCount: number
    _all: number
  }


  export type UuidRegistryAvgAggregateInputType = {
    seenCount?: true
  }

  export type UuidRegistrySumAggregateInputType = {
    seenCount?: true
  }

  export type UuidRegistryMinAggregateInputType = {
    uuid?: true
    uuidstr?: true
    firstSeenAt?: true
    lastSeenAt?: true
    lastSource?: true
    seenCount?: true
  }

  export type UuidRegistryMaxAggregateInputType = {
    uuid?: true
    uuidstr?: true
    firstSeenAt?: true
    lastSeenAt?: true
    lastSource?: true
    seenCount?: true
  }

  export type UuidRegistryCountAggregateInputType = {
    uuid?: true
    uuidstr?: true
    firstSeenAt?: true
    lastSeenAt?: true
    lastSource?: true
    seenCount?: true
    _all?: true
  }

  export type UuidRegistryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UuidRegistry to aggregate.
     */
    where?: UuidRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UuidRegistries to fetch.
     */
    orderBy?: UuidRegistryOrderByWithRelationInput | UuidRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UuidRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UuidRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UuidRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UuidRegistries
    **/
    _count?: true | UuidRegistryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UuidRegistryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UuidRegistrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UuidRegistryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UuidRegistryMaxAggregateInputType
  }

  export type GetUuidRegistryAggregateType<T extends UuidRegistryAggregateArgs> = {
        [P in keyof T & keyof AggregateUuidRegistry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUuidRegistry[P]>
      : GetScalarType<T[P], AggregateUuidRegistry[P]>
  }




  export type UuidRegistryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UuidRegistryWhereInput
    orderBy?: UuidRegistryOrderByWithAggregationInput | UuidRegistryOrderByWithAggregationInput[]
    by: UuidRegistryScalarFieldEnum[] | UuidRegistryScalarFieldEnum
    having?: UuidRegistryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UuidRegistryCountAggregateInputType | true
    _avg?: UuidRegistryAvgAggregateInputType
    _sum?: UuidRegistrySumAggregateInputType
    _min?: UuidRegistryMinAggregateInputType
    _max?: UuidRegistryMaxAggregateInputType
  }

  export type UuidRegistryGroupByOutputType = {
    uuid: string
    uuidstr: string
    firstSeenAt: Date
    lastSeenAt: Date
    lastSource: $Enums.GenerateSource
    seenCount: number
    _count: UuidRegistryCountAggregateOutputType | null
    _avg: UuidRegistryAvgAggregateOutputType | null
    _sum: UuidRegistrySumAggregateOutputType | null
    _min: UuidRegistryMinAggregateOutputType | null
    _max: UuidRegistryMaxAggregateOutputType | null
  }

  type GetUuidRegistryGroupByPayload<T extends UuidRegistryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UuidRegistryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UuidRegistryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UuidRegistryGroupByOutputType[P]>
            : GetScalarType<T[P], UuidRegistryGroupByOutputType[P]>
        }
      >
    >


  export type UuidRegistrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    uuid?: boolean
    uuidstr?: boolean
    firstSeenAt?: boolean
    lastSeenAt?: boolean
    lastSource?: boolean
    seenCount?: boolean
  }, ExtArgs["result"]["uuidRegistry"]>

  export type UuidRegistrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    uuid?: boolean
    uuidstr?: boolean
    firstSeenAt?: boolean
    lastSeenAt?: boolean
    lastSource?: boolean
    seenCount?: boolean
  }, ExtArgs["result"]["uuidRegistry"]>

  export type UuidRegistrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    uuid?: boolean
    uuidstr?: boolean
    firstSeenAt?: boolean
    lastSeenAt?: boolean
    lastSource?: boolean
    seenCount?: boolean
  }, ExtArgs["result"]["uuidRegistry"]>

  export type UuidRegistrySelectScalar = {
    uuid?: boolean
    uuidstr?: boolean
    firstSeenAt?: boolean
    lastSeenAt?: boolean
    lastSource?: boolean
    seenCount?: boolean
  }

  export type UuidRegistryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"uuid" | "uuidstr" | "firstSeenAt" | "lastSeenAt" | "lastSource" | "seenCount", ExtArgs["result"]["uuidRegistry"]>

  export type $UuidRegistryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UuidRegistry"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      /**
       * UUID v4のバイト表現
       */
      uuid: string
      /**
       * UUID v4の文字列表現(検索用)
       */
      uuidstr: string
      /**
       * 最初に観測した日時。
       */
      firstSeenAt: Date
      /**
       * 最後に観測した日時。
       */
      lastSeenAt: Date
      /**
       * 最後に観測した発生源。
       */
      lastSource: $Enums.GenerateSource
      /**
       * 同一 UUID を何回観測したか。
       */
      seenCount: number
    }, ExtArgs["result"]["uuidRegistry"]>
    composites: {}
  }

  type UuidRegistryGetPayload<S extends boolean | null | undefined | UuidRegistryDefaultArgs> = $Result.GetResult<Prisma.$UuidRegistryPayload, S>

  type UuidRegistryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UuidRegistryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UuidRegistryCountAggregateInputType | true
    }

  export interface UuidRegistryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UuidRegistry'], meta: { name: 'UuidRegistry' } }
    /**
     * Find zero or one UuidRegistry that matches the filter.
     * @param {UuidRegistryFindUniqueArgs} args - Arguments to find a UuidRegistry
     * @example
     * // Get one UuidRegistry
     * const uuidRegistry = await prisma.uuidRegistry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UuidRegistryFindUniqueArgs>(args: SelectSubset<T, UuidRegistryFindUniqueArgs<ExtArgs>>): Prisma__UuidRegistryClient<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UuidRegistry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UuidRegistryFindUniqueOrThrowArgs} args - Arguments to find a UuidRegistry
     * @example
     * // Get one UuidRegistry
     * const uuidRegistry = await prisma.uuidRegistry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UuidRegistryFindUniqueOrThrowArgs>(args: SelectSubset<T, UuidRegistryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UuidRegistryClient<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UuidRegistry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidRegistryFindFirstArgs} args - Arguments to find a UuidRegistry
     * @example
     * // Get one UuidRegistry
     * const uuidRegistry = await prisma.uuidRegistry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UuidRegistryFindFirstArgs>(args?: SelectSubset<T, UuidRegistryFindFirstArgs<ExtArgs>>): Prisma__UuidRegistryClient<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UuidRegistry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidRegistryFindFirstOrThrowArgs} args - Arguments to find a UuidRegistry
     * @example
     * // Get one UuidRegistry
     * const uuidRegistry = await prisma.uuidRegistry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UuidRegistryFindFirstOrThrowArgs>(args?: SelectSubset<T, UuidRegistryFindFirstOrThrowArgs<ExtArgs>>): Prisma__UuidRegistryClient<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UuidRegistries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidRegistryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UuidRegistries
     * const uuidRegistries = await prisma.uuidRegistry.findMany()
     * 
     * // Get first 10 UuidRegistries
     * const uuidRegistries = await prisma.uuidRegistry.findMany({ take: 10 })
     * 
     * // Only select the `uuid`
     * const uuidRegistryWithUuidOnly = await prisma.uuidRegistry.findMany({ select: { uuid: true } })
     * 
     */
    findMany<T extends UuidRegistryFindManyArgs>(args?: SelectSubset<T, UuidRegistryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UuidRegistry.
     * @param {UuidRegistryCreateArgs} args - Arguments to create a UuidRegistry.
     * @example
     * // Create one UuidRegistry
     * const UuidRegistry = await prisma.uuidRegistry.create({
     *   data: {
     *     // ... data to create a UuidRegistry
     *   }
     * })
     * 
     */
    create<T extends UuidRegistryCreateArgs>(args: SelectSubset<T, UuidRegistryCreateArgs<ExtArgs>>): Prisma__UuidRegistryClient<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UuidRegistries.
     * @param {UuidRegistryCreateManyArgs} args - Arguments to create many UuidRegistries.
     * @example
     * // Create many UuidRegistries
     * const uuidRegistry = await prisma.uuidRegistry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UuidRegistryCreateManyArgs>(args?: SelectSubset<T, UuidRegistryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UuidRegistries and returns the data saved in the database.
     * @param {UuidRegistryCreateManyAndReturnArgs} args - Arguments to create many UuidRegistries.
     * @example
     * // Create many UuidRegistries
     * const uuidRegistry = await prisma.uuidRegistry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UuidRegistries and only return the `uuid`
     * const uuidRegistryWithUuidOnly = await prisma.uuidRegistry.createManyAndReturn({
     *   select: { uuid: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UuidRegistryCreateManyAndReturnArgs>(args?: SelectSubset<T, UuidRegistryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UuidRegistry.
     * @param {UuidRegistryDeleteArgs} args - Arguments to delete one UuidRegistry.
     * @example
     * // Delete one UuidRegistry
     * const UuidRegistry = await prisma.uuidRegistry.delete({
     *   where: {
     *     // ... filter to delete one UuidRegistry
     *   }
     * })
     * 
     */
    delete<T extends UuidRegistryDeleteArgs>(args: SelectSubset<T, UuidRegistryDeleteArgs<ExtArgs>>): Prisma__UuidRegistryClient<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UuidRegistry.
     * @param {UuidRegistryUpdateArgs} args - Arguments to update one UuidRegistry.
     * @example
     * // Update one UuidRegistry
     * const uuidRegistry = await prisma.uuidRegistry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UuidRegistryUpdateArgs>(args: SelectSubset<T, UuidRegistryUpdateArgs<ExtArgs>>): Prisma__UuidRegistryClient<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UuidRegistries.
     * @param {UuidRegistryDeleteManyArgs} args - Arguments to filter UuidRegistries to delete.
     * @example
     * // Delete a few UuidRegistries
     * const { count } = await prisma.uuidRegistry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UuidRegistryDeleteManyArgs>(args?: SelectSubset<T, UuidRegistryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UuidRegistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidRegistryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UuidRegistries
     * const uuidRegistry = await prisma.uuidRegistry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UuidRegistryUpdateManyArgs>(args: SelectSubset<T, UuidRegistryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UuidRegistries and returns the data updated in the database.
     * @param {UuidRegistryUpdateManyAndReturnArgs} args - Arguments to update many UuidRegistries.
     * @example
     * // Update many UuidRegistries
     * const uuidRegistry = await prisma.uuidRegistry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UuidRegistries and only return the `uuid`
     * const uuidRegistryWithUuidOnly = await prisma.uuidRegistry.updateManyAndReturn({
     *   select: { uuid: true },
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
    updateManyAndReturn<T extends UuidRegistryUpdateManyAndReturnArgs>(args: SelectSubset<T, UuidRegistryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UuidRegistry.
     * @param {UuidRegistryUpsertArgs} args - Arguments to update or create a UuidRegistry.
     * @example
     * // Update or create a UuidRegistry
     * const uuidRegistry = await prisma.uuidRegistry.upsert({
     *   create: {
     *     // ... data to create a UuidRegistry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UuidRegistry we want to update
     *   }
     * })
     */
    upsert<T extends UuidRegistryUpsertArgs>(args: SelectSubset<T, UuidRegistryUpsertArgs<ExtArgs>>): Prisma__UuidRegistryClient<$Result.GetResult<Prisma.$UuidRegistryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UuidRegistries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidRegistryCountArgs} args - Arguments to filter UuidRegistries to count.
     * @example
     * // Count the number of UuidRegistries
     * const count = await prisma.uuidRegistry.count({
     *   where: {
     *     // ... the filter for the UuidRegistries we want to count
     *   }
     * })
    **/
    count<T extends UuidRegistryCountArgs>(
      args?: Subset<T, UuidRegistryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UuidRegistryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UuidRegistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidRegistryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UuidRegistryAggregateArgs>(args: Subset<T, UuidRegistryAggregateArgs>): Prisma.PrismaPromise<GetUuidRegistryAggregateType<T>>

    /**
     * Group by UuidRegistry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UuidRegistryGroupByArgs} args - Group by arguments.
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
      T extends UuidRegistryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UuidRegistryGroupByArgs['orderBy'] }
        : { orderBy?: UuidRegistryGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UuidRegistryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUuidRegistryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UuidRegistry model
   */
  readonly fields: UuidRegistryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UuidRegistry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UuidRegistryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the UuidRegistry model
   */
  interface UuidRegistryFieldRefs {
    readonly uuid: FieldRef<"UuidRegistry", 'String'>
    readonly uuidstr: FieldRef<"UuidRegistry", 'String'>
    readonly firstSeenAt: FieldRef<"UuidRegistry", 'DateTime'>
    readonly lastSeenAt: FieldRef<"UuidRegistry", 'DateTime'>
    readonly lastSource: FieldRef<"UuidRegistry", 'GenerateSource'>
    readonly seenCount: FieldRef<"UuidRegistry", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * UuidRegistry findUnique
   */
  export type UuidRegistryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * Filter, which UuidRegistry to fetch.
     */
    where: UuidRegistryWhereUniqueInput
  }

  /**
   * UuidRegistry findUniqueOrThrow
   */
  export type UuidRegistryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * Filter, which UuidRegistry to fetch.
     */
    where: UuidRegistryWhereUniqueInput
  }

  /**
   * UuidRegistry findFirst
   */
  export type UuidRegistryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * Filter, which UuidRegistry to fetch.
     */
    where?: UuidRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UuidRegistries to fetch.
     */
    orderBy?: UuidRegistryOrderByWithRelationInput | UuidRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UuidRegistries.
     */
    cursor?: UuidRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UuidRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UuidRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UuidRegistries.
     */
    distinct?: UuidRegistryScalarFieldEnum | UuidRegistryScalarFieldEnum[]
  }

  /**
   * UuidRegistry findFirstOrThrow
   */
  export type UuidRegistryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * Filter, which UuidRegistry to fetch.
     */
    where?: UuidRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UuidRegistries to fetch.
     */
    orderBy?: UuidRegistryOrderByWithRelationInput | UuidRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UuidRegistries.
     */
    cursor?: UuidRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UuidRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UuidRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UuidRegistries.
     */
    distinct?: UuidRegistryScalarFieldEnum | UuidRegistryScalarFieldEnum[]
  }

  /**
   * UuidRegistry findMany
   */
  export type UuidRegistryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * Filter, which UuidRegistries to fetch.
     */
    where?: UuidRegistryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UuidRegistries to fetch.
     */
    orderBy?: UuidRegistryOrderByWithRelationInput | UuidRegistryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UuidRegistries.
     */
    cursor?: UuidRegistryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UuidRegistries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UuidRegistries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UuidRegistries.
     */
    distinct?: UuidRegistryScalarFieldEnum | UuidRegistryScalarFieldEnum[]
  }

  /**
   * UuidRegistry create
   */
  export type UuidRegistryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * The data needed to create a UuidRegistry.
     */
    data: XOR<UuidRegistryCreateInput, UuidRegistryUncheckedCreateInput>
  }

  /**
   * UuidRegistry createMany
   */
  export type UuidRegistryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UuidRegistries.
     */
    data: UuidRegistryCreateManyInput | UuidRegistryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UuidRegistry createManyAndReturn
   */
  export type UuidRegistryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * The data used to create many UuidRegistries.
     */
    data: UuidRegistryCreateManyInput | UuidRegistryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UuidRegistry update
   */
  export type UuidRegistryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * The data needed to update a UuidRegistry.
     */
    data: XOR<UuidRegistryUpdateInput, UuidRegistryUncheckedUpdateInput>
    /**
     * Choose, which UuidRegistry to update.
     */
    where: UuidRegistryWhereUniqueInput
  }

  /**
   * UuidRegistry updateMany
   */
  export type UuidRegistryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UuidRegistries.
     */
    data: XOR<UuidRegistryUpdateManyMutationInput, UuidRegistryUncheckedUpdateManyInput>
    /**
     * Filter which UuidRegistries to update
     */
    where?: UuidRegistryWhereInput
    /**
     * Limit how many UuidRegistries to update.
     */
    limit?: number
  }

  /**
   * UuidRegistry updateManyAndReturn
   */
  export type UuidRegistryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * The data used to update UuidRegistries.
     */
    data: XOR<UuidRegistryUpdateManyMutationInput, UuidRegistryUncheckedUpdateManyInput>
    /**
     * Filter which UuidRegistries to update
     */
    where?: UuidRegistryWhereInput
    /**
     * Limit how many UuidRegistries to update.
     */
    limit?: number
  }

  /**
   * UuidRegistry upsert
   */
  export type UuidRegistryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * The filter to search for the UuidRegistry to update in case it exists.
     */
    where: UuidRegistryWhereUniqueInput
    /**
     * In case the UuidRegistry found by the `where` argument doesn't exist, create a new UuidRegistry with this data.
     */
    create: XOR<UuidRegistryCreateInput, UuidRegistryUncheckedCreateInput>
    /**
     * In case the UuidRegistry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UuidRegistryUpdateInput, UuidRegistryUncheckedUpdateInput>
  }

  /**
   * UuidRegistry delete
   */
  export type UuidRegistryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
    /**
     * Filter which UuidRegistry to delete.
     */
    where: UuidRegistryWhereUniqueInput
  }

  /**
   * UuidRegistry deleteMany
   */
  export type UuidRegistryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UuidRegistries to delete
     */
    where?: UuidRegistryWhereInput
    /**
     * Limit how many UuidRegistries to delete.
     */
    limit?: number
  }

  /**
   * UuidRegistry without action
   */
  export type UuidRegistryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UuidRegistry
     */
    select?: UuidRegistrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the UuidRegistry
     */
    omit?: UuidRegistryOmit<ExtArgs> | null
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


  export const UuidGenerationAttemptScalarFieldEnum: {
    id: 'id',
    uuid: 'uuid',
    generateSource: 'generateSource',
    countryCode: 'countryCode',
    wasCollision: 'wasCollision',
    createdAt: 'createdAt'
  };

  export type UuidGenerationAttemptScalarFieldEnum = (typeof UuidGenerationAttemptScalarFieldEnum)[keyof typeof UuidGenerationAttemptScalarFieldEnum]


  export const UuidRegistryScalarFieldEnum: {
    uuid: 'uuid',
    uuidstr: 'uuidstr',
    firstSeenAt: 'firstSeenAt',
    lastSeenAt: 'lastSeenAt',
    lastSource: 'lastSource',
    seenCount: 'seenCount'
  };

  export type UuidRegistryScalarFieldEnum = (typeof UuidRegistryScalarFieldEnum)[keyof typeof UuidRegistryScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'GenerateSource'
   */
  export type EnumGenerateSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GenerateSource'>
    


  /**
   * Reference to a field of type 'GenerateSource[]'
   */
  export type ListEnumGenerateSourceFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GenerateSource[]'>
    


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


  export type UuidGenerationAttemptWhereInput = {
    AND?: UuidGenerationAttemptWhereInput | UuidGenerationAttemptWhereInput[]
    OR?: UuidGenerationAttemptWhereInput[]
    NOT?: UuidGenerationAttemptWhereInput | UuidGenerationAttemptWhereInput[]
    id?: BigIntFilter<"UuidGenerationAttempt"> | bigint | number
    uuid?: UuidFilter<"UuidGenerationAttempt"> | string
    generateSource?: EnumGenerateSourceFilter<"UuidGenerationAttempt"> | $Enums.GenerateSource
    countryCode?: StringNullableFilter<"UuidGenerationAttempt"> | string | null
    wasCollision?: BoolFilter<"UuidGenerationAttempt"> | boolean
    createdAt?: DateTimeFilter<"UuidGenerationAttempt"> | Date | string
  }

  export type UuidGenerationAttemptOrderByWithRelationInput = {
    id?: SortOrder
    uuid?: SortOrder
    generateSource?: SortOrder
    countryCode?: SortOrderInput | SortOrder
    wasCollision?: SortOrder
    createdAt?: SortOrder
  }

  export type UuidGenerationAttemptWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    AND?: UuidGenerationAttemptWhereInput | UuidGenerationAttemptWhereInput[]
    OR?: UuidGenerationAttemptWhereInput[]
    NOT?: UuidGenerationAttemptWhereInput | UuidGenerationAttemptWhereInput[]
    uuid?: UuidFilter<"UuidGenerationAttempt"> | string
    generateSource?: EnumGenerateSourceFilter<"UuidGenerationAttempt"> | $Enums.GenerateSource
    countryCode?: StringNullableFilter<"UuidGenerationAttempt"> | string | null
    wasCollision?: BoolFilter<"UuidGenerationAttempt"> | boolean
    createdAt?: DateTimeFilter<"UuidGenerationAttempt"> | Date | string
  }, "id">

  export type UuidGenerationAttemptOrderByWithAggregationInput = {
    id?: SortOrder
    uuid?: SortOrder
    generateSource?: SortOrder
    countryCode?: SortOrderInput | SortOrder
    wasCollision?: SortOrder
    createdAt?: SortOrder
    _count?: UuidGenerationAttemptCountOrderByAggregateInput
    _avg?: UuidGenerationAttemptAvgOrderByAggregateInput
    _max?: UuidGenerationAttemptMaxOrderByAggregateInput
    _min?: UuidGenerationAttemptMinOrderByAggregateInput
    _sum?: UuidGenerationAttemptSumOrderByAggregateInput
  }

  export type UuidGenerationAttemptScalarWhereWithAggregatesInput = {
    AND?: UuidGenerationAttemptScalarWhereWithAggregatesInput | UuidGenerationAttemptScalarWhereWithAggregatesInput[]
    OR?: UuidGenerationAttemptScalarWhereWithAggregatesInput[]
    NOT?: UuidGenerationAttemptScalarWhereWithAggregatesInput | UuidGenerationAttemptScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"UuidGenerationAttempt"> | bigint | number
    uuid?: UuidWithAggregatesFilter<"UuidGenerationAttempt"> | string
    generateSource?: EnumGenerateSourceWithAggregatesFilter<"UuidGenerationAttempt"> | $Enums.GenerateSource
    countryCode?: StringNullableWithAggregatesFilter<"UuidGenerationAttempt"> | string | null
    wasCollision?: BoolWithAggregatesFilter<"UuidGenerationAttempt"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"UuidGenerationAttempt"> | Date | string
  }

  export type UuidRegistryWhereInput = {
    AND?: UuidRegistryWhereInput | UuidRegistryWhereInput[]
    OR?: UuidRegistryWhereInput[]
    NOT?: UuidRegistryWhereInput | UuidRegistryWhereInput[]
    uuid?: UuidFilter<"UuidRegistry"> | string
    uuidstr?: StringFilter<"UuidRegistry"> | string
    firstSeenAt?: DateTimeFilter<"UuidRegistry"> | Date | string
    lastSeenAt?: DateTimeFilter<"UuidRegistry"> | Date | string
    lastSource?: EnumGenerateSourceFilter<"UuidRegistry"> | $Enums.GenerateSource
    seenCount?: IntFilter<"UuidRegistry"> | number
  }

  export type UuidRegistryOrderByWithRelationInput = {
    uuid?: SortOrder
    uuidstr?: SortOrder
    firstSeenAt?: SortOrder
    lastSeenAt?: SortOrder
    lastSource?: SortOrder
    seenCount?: SortOrder
  }

  export type UuidRegistryWhereUniqueInput = Prisma.AtLeast<{
    uuid?: string
    uuidstr?: string
    AND?: UuidRegistryWhereInput | UuidRegistryWhereInput[]
    OR?: UuidRegistryWhereInput[]
    NOT?: UuidRegistryWhereInput | UuidRegistryWhereInput[]
    firstSeenAt?: DateTimeFilter<"UuidRegistry"> | Date | string
    lastSeenAt?: DateTimeFilter<"UuidRegistry"> | Date | string
    lastSource?: EnumGenerateSourceFilter<"UuidRegistry"> | $Enums.GenerateSource
    seenCount?: IntFilter<"UuidRegistry"> | number
  }, "uuid" | "uuidstr">

  export type UuidRegistryOrderByWithAggregationInput = {
    uuid?: SortOrder
    uuidstr?: SortOrder
    firstSeenAt?: SortOrder
    lastSeenAt?: SortOrder
    lastSource?: SortOrder
    seenCount?: SortOrder
    _count?: UuidRegistryCountOrderByAggregateInput
    _avg?: UuidRegistryAvgOrderByAggregateInput
    _max?: UuidRegistryMaxOrderByAggregateInput
    _min?: UuidRegistryMinOrderByAggregateInput
    _sum?: UuidRegistrySumOrderByAggregateInput
  }

  export type UuidRegistryScalarWhereWithAggregatesInput = {
    AND?: UuidRegistryScalarWhereWithAggregatesInput | UuidRegistryScalarWhereWithAggregatesInput[]
    OR?: UuidRegistryScalarWhereWithAggregatesInput[]
    NOT?: UuidRegistryScalarWhereWithAggregatesInput | UuidRegistryScalarWhereWithAggregatesInput[]
    uuid?: UuidWithAggregatesFilter<"UuidRegistry"> | string
    uuidstr?: StringWithAggregatesFilter<"UuidRegistry"> | string
    firstSeenAt?: DateTimeWithAggregatesFilter<"UuidRegistry"> | Date | string
    lastSeenAt?: DateTimeWithAggregatesFilter<"UuidRegistry"> | Date | string
    lastSource?: EnumGenerateSourceWithAggregatesFilter<"UuidRegistry"> | $Enums.GenerateSource
    seenCount?: IntWithAggregatesFilter<"UuidRegistry"> | number
  }

  export type UuidGenerationAttemptCreateInput = {
    id?: bigint | number
    uuid: string
    generateSource: $Enums.GenerateSource
    countryCode?: string | null
    wasCollision?: boolean
    createdAt?: Date | string
  }

  export type UuidGenerationAttemptUncheckedCreateInput = {
    id?: bigint | number
    uuid: string
    generateSource: $Enums.GenerateSource
    countryCode?: string | null
    wasCollision?: boolean
    createdAt?: Date | string
  }

  export type UuidGenerationAttemptUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    generateSource?: EnumGenerateSourceFieldUpdateOperationsInput | $Enums.GenerateSource
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    wasCollision?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidGenerationAttemptUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    generateSource?: EnumGenerateSourceFieldUpdateOperationsInput | $Enums.GenerateSource
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    wasCollision?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidGenerationAttemptCreateManyInput = {
    id?: bigint | number
    uuid: string
    generateSource: $Enums.GenerateSource
    countryCode?: string | null
    wasCollision?: boolean
    createdAt?: Date | string
  }

  export type UuidGenerationAttemptUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    generateSource?: EnumGenerateSourceFieldUpdateOperationsInput | $Enums.GenerateSource
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    wasCollision?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidGenerationAttemptUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    uuid?: StringFieldUpdateOperationsInput | string
    generateSource?: EnumGenerateSourceFieldUpdateOperationsInput | $Enums.GenerateSource
    countryCode?: NullableStringFieldUpdateOperationsInput | string | null
    wasCollision?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidRegistryCreateInput = {
    uuid: string
    uuidstr: string
    firstSeenAt?: Date | string
    lastSeenAt?: Date | string
    lastSource: $Enums.GenerateSource
    seenCount?: number
  }

  export type UuidRegistryUncheckedCreateInput = {
    uuid: string
    uuidstr: string
    firstSeenAt?: Date | string
    lastSeenAt?: Date | string
    lastSource: $Enums.GenerateSource
    seenCount?: number
  }

  export type UuidRegistryUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    uuidstr?: StringFieldUpdateOperationsInput | string
    firstSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSource?: EnumGenerateSourceFieldUpdateOperationsInput | $Enums.GenerateSource
    seenCount?: IntFieldUpdateOperationsInput | number
  }

  export type UuidRegistryUncheckedUpdateInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    uuidstr?: StringFieldUpdateOperationsInput | string
    firstSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSource?: EnumGenerateSourceFieldUpdateOperationsInput | $Enums.GenerateSource
    seenCount?: IntFieldUpdateOperationsInput | number
  }

  export type UuidRegistryCreateManyInput = {
    uuid: string
    uuidstr: string
    firstSeenAt?: Date | string
    lastSeenAt?: Date | string
    lastSource: $Enums.GenerateSource
    seenCount?: number
  }

  export type UuidRegistryUpdateManyMutationInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    uuidstr?: StringFieldUpdateOperationsInput | string
    firstSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSource?: EnumGenerateSourceFieldUpdateOperationsInput | $Enums.GenerateSource
    seenCount?: IntFieldUpdateOperationsInput | number
  }

  export type UuidRegistryUncheckedUpdateManyInput = {
    uuid?: StringFieldUpdateOperationsInput | string
    uuidstr?: StringFieldUpdateOperationsInput | string
    firstSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSeenAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastSource?: EnumGenerateSourceFieldUpdateOperationsInput | $Enums.GenerateSource
    seenCount?: IntFieldUpdateOperationsInput | number
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type EnumGenerateSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.GenerateSource | EnumGenerateSourceFieldRefInput<$PrismaModel>
    in?: $Enums.GenerateSource[] | ListEnumGenerateSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.GenerateSource[] | ListEnumGenerateSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumGenerateSourceFilter<$PrismaModel> | $Enums.GenerateSource
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UuidGenerationAttemptCountOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    generateSource?: SortOrder
    countryCode?: SortOrder
    wasCollision?: SortOrder
    createdAt?: SortOrder
  }

  export type UuidGenerationAttemptAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UuidGenerationAttemptMaxOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    generateSource?: SortOrder
    countryCode?: SortOrder
    wasCollision?: SortOrder
    createdAt?: SortOrder
  }

  export type UuidGenerationAttemptMinOrderByAggregateInput = {
    id?: SortOrder
    uuid?: SortOrder
    generateSource?: SortOrder
    countryCode?: SortOrder
    wasCollision?: SortOrder
    createdAt?: SortOrder
  }

  export type UuidGenerationAttemptSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumGenerateSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GenerateSource | EnumGenerateSourceFieldRefInput<$PrismaModel>
    in?: $Enums.GenerateSource[] | ListEnumGenerateSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.GenerateSource[] | ListEnumGenerateSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumGenerateSourceWithAggregatesFilter<$PrismaModel> | $Enums.GenerateSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenerateSourceFilter<$PrismaModel>
    _max?: NestedEnumGenerateSourceFilter<$PrismaModel>
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

  export type UuidRegistryCountOrderByAggregateInput = {
    uuid?: SortOrder
    uuidstr?: SortOrder
    firstSeenAt?: SortOrder
    lastSeenAt?: SortOrder
    lastSource?: SortOrder
    seenCount?: SortOrder
  }

  export type UuidRegistryAvgOrderByAggregateInput = {
    seenCount?: SortOrder
  }

  export type UuidRegistryMaxOrderByAggregateInput = {
    uuid?: SortOrder
    uuidstr?: SortOrder
    firstSeenAt?: SortOrder
    lastSeenAt?: SortOrder
    lastSource?: SortOrder
    seenCount?: SortOrder
  }

  export type UuidRegistryMinOrderByAggregateInput = {
    uuid?: SortOrder
    uuidstr?: SortOrder
    firstSeenAt?: SortOrder
    lastSeenAt?: SortOrder
    lastSource?: SortOrder
    seenCount?: SortOrder
  }

  export type UuidRegistrySumOrderByAggregateInput = {
    seenCount?: SortOrder
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

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumGenerateSourceFieldUpdateOperationsInput = {
    set?: $Enums.GenerateSource
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedEnumGenerateSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.GenerateSource | EnumGenerateSourceFieldRefInput<$PrismaModel>
    in?: $Enums.GenerateSource[] | ListEnumGenerateSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.GenerateSource[] | ListEnumGenerateSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumGenerateSourceFilter<$PrismaModel> | $Enums.GenerateSource
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

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
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

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
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

  export type NestedEnumGenerateSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GenerateSource | EnumGenerateSourceFieldRefInput<$PrismaModel>
    in?: $Enums.GenerateSource[] | ListEnumGenerateSourceFieldRefInput<$PrismaModel>
    notIn?: $Enums.GenerateSource[] | ListEnumGenerateSourceFieldRefInput<$PrismaModel>
    not?: NestedEnumGenerateSourceWithAggregatesFilter<$PrismaModel> | $Enums.GenerateSource
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGenerateSourceFilter<$PrismaModel>
    _max?: NestedEnumGenerateSourceFilter<$PrismaModel>
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