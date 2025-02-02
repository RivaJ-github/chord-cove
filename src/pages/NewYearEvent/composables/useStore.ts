import { useLocalStorage, createGlobalState } from "@vueuse/core";
import { ref } from 'vue'
import moment from 'moment'

export default createGlobalState(() => {
  const isTargetUsers = navigator.userAgent.toUpperCase().indexOf("HUAWEIALN-AL00") > -1;

  const isEventTime = ref(moment('2025-02-13').isAfter(moment()))

  setInterval(() => {
    isEventTime.value = moment('2025-02-13').isAfter(moment())
  }, 60 * 60 * 1000)

  const firstShow = useLocalStorage("c_c_first_show", true);
  const letterShowen = useLocalStorage("c_c_letter_showen", false);

  return {
    firstShow,
    isTargetUsers,
    isEventTime,
    letterShowen,
  };
});
