<script lang="ts">
  import { T } from '@threlte/core'
  import { GLTF, interactivity } from '@threlte/extras'
  import { SheetObject, useSequence } from '@threlte/theatre'

  interactivity()

  const { play, pause, position, length } = useSequence()

  let baseline: number | undefined = undefined
</script>

<T.Group
  on:pointerenter={pause}
  on:pointerleave={play}
  on:pointerdown={(event) => {
    baseline = event.intersections[0].point.y
  }}
  on:pointermove={(event) => {
    if (baseline) {
      const current = event.intersections[0].point.y
      const progress = (baseline - current) / 2
      $position = $position + progress * $length
      baseline = current
    }
  }}
  on:pointerup={() => (baseline = undefined)}
  on:pointerleave={() => (baseline = undefined)}
>
  <SheetObject
    key="Feather"
    let:Transform
  >
    <Transform>
      <GLTF url="/models/feather.glb" />
    </Transform>
  </SheetObject>
</T.Group>
