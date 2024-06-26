import type { SvelteComponent } from 'svelte'
import { get_current_component } from 'svelte/internal'
import { writable } from 'svelte/store'
import { watch } from './storeUtils'

/**
 * ### `forwardEventHandlers`
 *
 * Natively, Svelte has no way of passing down event handlers inside a
 * component to a child component. Events have to be hand-wired upstream. This
 * function allows you to forward event handlers from a parent component to a child
 * component as if they were declared on the child component itself.
 *
 * ```svelte
 * <!-- Child.svelte -->
 * <script>
 * 	import { forwardEventHandlers } from '@threlte/core'
 * 	const dispatchingComponent = forwardEventHandlers()
 * </script>
 *
 * <OtherChildComponent bind:this={$dispatchingComponent} />
 * ```
 *
 * Now, when implementing `<Child>` and adding event handlers via `on:eventname`,
 * those event handlers will be forwarded to `<OtherChildComponent>`:
 *
 * ```svelte
 * <!-- Parent.svelte -->
 * <script>
 * 	import Child from './Child.svelte'
 * </script>
 *
 * <Child on:click={() => console.log('clicked')} />
 * ```
 *
 * If `OtherChildComponent.svelte` now dispatches a `click` event, the event handler
 * in `Parent.svelte` will be called.
 */
export const forwardEventHandlers = () => {
  const component = get_current_component()

  const dispatchingComponent = writable<SvelteComponent | undefined>(undefined)

  watch(dispatchingComponent, (dispatchingComponent) => {
    if (!dispatchingComponent) return
    Object.entries(component.$$.callbacks).forEach((callback) => {
      const [key, value] = callback as [string, ((...args: any[]) => void)[]]
      if (
        key in dispatchingComponent.$$.callbacks &&
        Array.isArray(dispatchingComponent.$$.callbacks[key])
      ) {
        dispatchingComponent.$$.callbacks[key].push(...value)
      } else {
        dispatchingComponent.$$.callbacks[key] = value
      }
    })
  })

  return dispatchingComponent
}
