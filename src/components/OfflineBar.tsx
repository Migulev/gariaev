import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export const OfflineBar = () => {
  const isOnline = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className="mb-2 bg-yellow-300 py-2 text-center text-slate-700">
      Вы находитесь в автономном режиме
    </div>
  )
}
