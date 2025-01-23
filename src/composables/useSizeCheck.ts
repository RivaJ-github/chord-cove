import { ref } from "vue"
import { createGlobalState } from "@vueuse/core";

export enum Size {
  SMALL,
  MIDDLE,
  LARGE
}

export default createGlobalState((dom = window) => {
  const size = ref(Size.SMALL)
  const checkSize = () => {
      const width = dom.innerWidth
      if (width < 450) {
          size.value = Size.SMALL
      } else if (width < 690) {
          size.value = Size.MIDDLE
      } else {
          size.value = Size.LARGE
      }
      console.log(size.value, 'size')
  }
  checkSize()
  dom.addEventListener('resize', checkSize)
  return size
})