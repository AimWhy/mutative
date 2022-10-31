import { DraftType, Operation } from './constant';
import { Patches } from './interface';
import { deepClone, getType } from './utils';
import { create } from './create';

export function apply<T extends object>(state: T, patches: Patches): T {
  return create<T>(state, (draft: any) => {
    patches.forEach((patch) => {
      const { path, op } = patch;
      let base: any = draft;
      for (let index = 0; index < path.length - 1; index++) {
        const parentType = getType(base);
        const key = String(path[index]);
        if (
          ((parentType === DraftType.Object ||
            parentType === DraftType.Array) &&
            (key === '__proto__' || key === 'constructor')) ||
          (typeof base === 'function' && key === 'prototype')
        ) {
          throw new Error(
            `Patching reserved attributes like __proto__, prototype and constructor is not allowed.`
          );
        }
        base = base[key];
        // TODO: refactor
        // base = get(base, p);
        if (typeof base !== 'object') {
          throw new Error(`Cannot apply patch at '${path.join('/')}'.`);
        }
      }

      const type = getType(base);
      // ensure the original patch is not modified.
      const value = deepClone(patch.value);
      const key = path[path.length - 1];
      switch (op) {
        case Operation.Replace:
          switch (type) {
            case DraftType.Map:
              return base.set(key, value);
            case DraftType.Set:
              throw new Error(`Cannot apply replace patch to set.`);
            default:
              return (base[key] = value);
          }
        case Operation.Add:
          switch (type) {
            case DraftType.Array:
              return key === '-'
                ? base.push(value)
                : base.splice(key as any, 0, value);
            case DraftType.Map:
              return base.set(key, value);
            case DraftType.Set:
              return base.add(value);
            default:
              return (base[key] = value);
          }
        case Operation.Remove:
          switch (type) {
            case DraftType.Array:
              return base.splice(key as any, 1);
            case DraftType.Map:
              return base.delete(key);
            case DraftType.Set:
              return base.delete(patch.value);
            default:
              return delete base[key];
          }
        default:
          throw new Error(`Unsupported patch operation: ${op}`);
      }
    });
  });
}
