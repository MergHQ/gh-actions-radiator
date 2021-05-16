export type Some<T> = { value: T }
export type None = { value: null }
export type Maybe<T> = Some<T> | None

export const some = <T>(val: T): Maybe<T> => ({ value: val })

export const none = <T>(): Maybe<T> => ({ value: null })

export const fromNullable = <T>(val: T | null | undefined): Maybe<T> =>
  val === null || val === undefined ? none<T>() : some(val!)

export const map =
  <A, B>(fn: (val: A) => B) =>
  (maybe: Maybe<A>): Maybe<B> => {
    if (maybe.value === null) return { value: null }
    else return { value: fn(maybe.value) }
  }

export const fmap =
  <A, B>(fn: (val: A) => Maybe<B>) =>
  (maybe: Maybe<A>): Maybe<B> => {
    if (maybe.value === null) return { value: null }
    else return fn(maybe.value)
  }

export const fold =
  <A, B>(onSome: (val: A) => B, onNone: () => B) =>
  (maybe: Maybe<A>): B => {
    if (maybe.value === null) return onNone()
    else return onSome(maybe.value)
  }

export const getOrElse =
  <A>(fallback: A) =>
  (maybe: Maybe<A>): A => {
    if (maybe.value === null) return fallback
    else return maybe.value
  }
