---
sidebar_position: 7
---

# Migration from Immer to Mutative

Mutative is a drop-in replacement for Immer, so you can use it with a few changes.

:::tip
[mutative-compat](https://github.com/exuanbo/mutative-compat) - Mutative wrapper with full Immer API compatibility, you can use it to quickly migrate from Immer to Mutative.
:::

## `produce()` -> `create()`

Mutative auto freezing option is **disabled by default**, Immer auto freezing option is enabled by default (if disabled, Immer performance will have a more huge drop).

> You need to check if auto freezing has any impact on your project. If it depends on auto freezing, you can enable it yourself in Mutative.

```ts
import produce from 'immer';

const baseState = {
  list: [{ text: 'coding' }, { text: 'learning' }],
};

const nextState = produce(baseState, (draft) => {
  draft[1].done = true;
  draft.push({ title: 'something' });
});
```

Use Mutative

```ts
import { create } from 'mutative';

const baseState = {
  list: [{ text: 'coding' }, { text: 'learning' }],
};

const nextState = create(baseState, (draft) => {
  draft[1].done = true;
  draft.push({ title: 'something' });
});
```

## `Patches`

```ts
import { produceWithPatches, applyPatches } from 'immer';

enablePatches();

const baseState = {
  info: {
    name: 'Michael',
    age: 33,
  },
};

const [nextState, patches, inversePatches] = produceWithPatches(
  baseState,
  (draft) => {
    draft.info.age++;
  }
);

const state = applyPatches(nextState, inversePatches);

expect(state).toEqual(baseState);
```

Use Mutative

```ts
import { create, apply } from 'mutative';

const baseState = {
  info: {
    name: 'Michael',
    age: 33,
  },
};

const [nextState, patches, inversePatches] = create(
  baseState,
  (draft) => {
    draft.info.age++;
  },
  {
    enablePatches: true,
  }
);

const state = apply(nextState, inversePatches);

expect(state).toEqual(baseState);
```

## Return `undefined`

```ts
import produce, { nothing } from 'immer';

const nextState = produce(baseState, (draft) => {
  return nothing;
});
```

Use Mutative

```ts
import { create, rawReturn } from 'mutative';

const nextState = create(baseState, (draft) => {
  return rawReturn(undefined);
});
```

:::tip
For more on how Mutative differs from Immer, visit [Mutative vs Immer](/docs/extra-topics/comparison-with-immer).
:::
