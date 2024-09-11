export const formatTime = (time: number) => {
  const roundedTime = Math.round(time)
  const minutes = Math.floor(roundedTime / 60)
  const seconds = Math.floor(roundedTime % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
