<script lang="ts">
  import { Canvas } from '@threlte/core'
  import { VRButton } from '@threlte/xr'
  import Scene from './Scene.svelte'
</script>

<div>
  <Canvas>
    <Scene />
  </Canvas>
  <VRButton />
</div>

<style>
  div {
    height: 100%;
  }
</style>
