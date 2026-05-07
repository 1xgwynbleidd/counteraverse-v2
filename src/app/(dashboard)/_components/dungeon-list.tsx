// path: src/app/(dashboard)/_components/dungeon-list.tsx
'use client'

import { Button } from '@/components/ui/button'
import type { AutoStartConfig } from '@/store/useAlgorithmStore'
import type { TodayDungeonDataEntity } from '@slkzgm/gigaverse-sdk'
import { Clock, Flame, Pause, Zap } from 'lucide-react'

interface DungeonListProps {
  dungeons: Record<number, TodayDungeonDataEntity>
  dayProgressMap: Record<number, number>
  currentEnergy: number
  isPlayerJuiced: boolean
  autoStartConfig: AutoStartConfig | null
  onStartRun: (dungeonId: number, isJuiced: boolean) => void
  onToggleAutoStart: (dungeonId: number, isJuiced: boolean) => void
}

export function DungeonList({
  dungeons,
  dayProgressMap,
  currentEnergy,
  isPlayerJuiced,
  autoStartConfig,
  onStartRun,
  onToggleAutoStart,
}: DungeonListProps) {
  if (Object.keys(dungeons).length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 text-lg font-semibold">Available Dungeons</h2>
        <p className="text-muted-foreground">No dungeons available.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-lg font-semibold">Available Dungeons</h2>
      <div className="space-y-3">
        {Object.entries(dungeons).map(([key, data]) => {
          const dungeonId = Number(key)
          const runsUsed = dayProgressMap[dungeonId] || 0

          const normalCost = data.ENERGY_CID
          const juicedCost = normalCost * 3

          const normalMax = data.UINT256_CID
          const juicedMax = data.juicedMaxRunsPerDay
          const effectiveMax = isPlayerJuiced ? juicedMax : normalMax

          const canRunNormal = runsUsed < effectiveMax && currentEnergy >= normalCost
          const canRunJuiced =
            isPlayerJuiced && runsUsed + 3 <= juicedMax && currentEnergy >= juicedCost
          const canQueueNormal = runsUsed < effectiveMax
          const canQueueJuiced = isPlayerJuiced && runsUsed + 3 <= juicedMax
          const isAutoNormal =
            autoStartConfig?.dungeonId === dungeonId && autoStartConfig.isJuiced === false
          const isAutoJuiced =
            autoStartConfig?.dungeonId === dungeonId && autoStartConfig.isJuiced === true

          return (
            <div key={dungeonId} className="rounded-md border border-border bg-background p-3">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{data.NAME_CID}</h3>
                  <p className="text-xs text-muted-foreground">
                    Runs: {runsUsed} / {effectiveMax}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground">ID: {dungeonId}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
                  <Button
                    size="sm"
                    variant={canRunNormal ? 'default' : 'outline'}
                    disabled={!canRunNormal}
                    onClick={() => onStartRun(dungeonId, false)}
                    className="h-10 sm:h-8"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Normal ({normalCost})
                  </Button>
                  <Button
                    size="sm"
                    variant={isAutoNormal ? 'destructive' : 'outline'}
                    disabled={!canQueueNormal}
                    onClick={() => onToggleAutoStart(dungeonId, false)}
                    className="h-10 px-2 sm:h-8"
                  >
                    {isAutoNormal ? (
                      <Pause className="mr-1 h-3 w-3" />
                    ) : (
                      <Clock className="mr-1 h-3 w-3" />
                    )}
                    {isAutoNormal ? 'Stop' : 'Auto'} 240
                  </Button>
                </div>
                {isPlayerJuiced && (
                  <div className="grid grid-cols-[minmax(0,1fr)_6.5rem] gap-2">
                    <Button
                      size="sm"
                      variant={canRunJuiced ? 'default' : 'outline'}
                      disabled={!canRunJuiced}
                      onClick={() => onStartRun(dungeonId, true)}
                      className="h-10 sm:h-8"
                    >
                      <Flame className="mr-1 h-3 w-3" />
                      Juiced ({juicedCost})
                    </Button>
                    <Button
                      size="sm"
                      variant={isAutoJuiced ? 'destructive' : 'outline'}
                      disabled={!canQueueJuiced}
                      onClick={() => onToggleAutoStart(dungeonId, true)}
                      className="h-10 px-2 sm:h-8"
                    >
                      {isAutoJuiced ? (
                        <Pause className="mr-1 h-3 w-3" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {isAutoJuiced ? 'Stop' : 'Auto'} 240
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
