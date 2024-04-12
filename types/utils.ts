export type Props<T> = T extends new () => { $props: infer P, $emit: infer E } ? NonNullable<P> & { [K in keyof NonNullable<E> as `on${Capitalize<string & K>}`]: NonNullable<E>[K] } :
  T extends (props: infer P, ctx: { slots: any, attrs: any, emit: infer E }, ...args: any) => any ? P & { [K in keyof NonNullable<E> as `on${Capitalize<string & K>}`]: NonNullable<E>[K] } :
      {}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : DeepPartial<T[P]>
}
