import type { CreateResult, Mutable, Options, Result } from './interface';
import { draftify } from './draftify';
import { dataTypes } from './constant';

/**
 * something
 */
export function create<
  T extends object,
  F extends boolean = false,
  O extends boolean = false,
  R extends void | Promise<void> = void
>(state: T, mutate: (draft: Mutable<T>) => R, options?: Options<O, F>) {
  if (options?.hook?.(state, dataTypes) === dataTypes.mutable) {
    const result = mutate(state as Mutable<T>);
    const finalization = options?.enablePatches ? [state, [], []] : state;
    if (result instanceof Promise) {
      return result.then(() => finalization) as CreateResult<T, O, F, R>;
    }
    return finalization as CreateResult<T, O, F, R>;
  }
  const [draft, finalize] = draftify(state, options);
  const result = mutate(draft as Mutable<T>);
  if (result instanceof Promise) {
    return result.then(finalize) as CreateResult<T, O, F, R>;
  }
  return finalize() as CreateResult<T, O, F, R>;
}
