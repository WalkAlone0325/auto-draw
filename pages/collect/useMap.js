import { ref } from 'vue'

export function useMap () {
  const showBox = ref(false)
  const boxItem = ref({})

  const clickMarker = (e) => {
    const { markerId } = e.detail
    showBox.value = true
    // boxItem.value = raw
    console.log(e)
  }
  const clickPolyline = (e) => {
    const { lineId, longitude, latitude } = e.detail
    console.log(lineId, longitude, latitude)
  }
  return {
    showBox,
    boxItem,
    clickMarker,
    clickPolyline
  }
}
