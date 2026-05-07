// path: src/store/useGameDataStore.ts
'use client'

import { create } from 'zustand'
import {
  getOffchainStaticAction,
  getDungeonTodayAction,
  getAllSkillsAction,
  getHeroSkillsProgressAction,
} from '@/actions/gigaverseActions'
import type {
  EnemyEntity,
  OffchainGameItemEntity,
  RecipeEntity,
  CheckpointEntity,
  OffchainConstants,
  TodayDungeonDataEntity,
  SkillDefinition,
  SkillsProgressEntity,
} from '@slkzgm/gigaverse-sdk'

function buildItemMap(items: OffchainGameItemEntity[]): Record<number, OffchainGameItemEntity> {
  const map: Record<number, OffchainGameItemEntity> = {}
  for (const item of items) {
    map[item.ID_CID] = item
  }
  return map
}

function buildTodayDungeonMap(
  arr: TodayDungeonDataEntity[]
): Record<number, TodayDungeonDataEntity> {
  const map: Record<number, TodayDungeonDataEntity> = {}
  arr.forEach((d) => {
    map[d.ID_CID] = d
  })
  return map
}

interface GameDataState {
  enemies: EnemyEntity[]
  gameItems: OffchainGameItemEntity[]
  recipes: RecipeEntity[]
  checkpoints: CheckpointEntity[]
  constants: OffchainConstants | null
  skillDefinitions: SkillDefinition[]
  skillProgress: SkillsProgressEntity[]
  itemsMap: Record<number, OffchainGameItemEntity>
  todayDungeonsMap: Record<number, TodayDungeonDataEntity>

  isLoading: boolean
  error: string | null

  loadOffchainStatic: (token: string) => Promise<void>
  loadTodayDungeonData: (token: string) => Promise<void>
  loadSkills: (token: string, noobId: string) => Promise<void>
}

export const useGameDataStore = create<GameDataState>((set) => ({
  enemies: [],
  gameItems: [],
  recipes: [],
  checkpoints: [],
  constants: null,
  skillDefinitions: [],
  skillProgress: [],

  itemsMap: {},
  todayDungeonsMap: {},

  isLoading: false,
  error: null,

  async loadOffchainStatic(token) {
    set({ isLoading: true, error: null })
    try {
      const resp = await getOffchainStaticAction(token)
      set({
        enemies: resp.enemies,
        gameItems: resp.gameItems,
        recipes: resp.recipes,
        checkpoints: resp.checkpoints,
        constants: resp.constants,
        itemsMap: buildItemMap(resp.gameItems),
        isLoading: false,
      })
    } catch (err) {
      console.error('[useGameDataStore] loadOffchainStatic error:', err)
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to load offchain data.',
      })
    }
  },

  async loadTodayDungeonData(token) {
    set({ isLoading: true, error: null })
    try {
      const resp = await getDungeonTodayAction(token)
      const map = buildTodayDungeonMap(resp.dungeonDataEntities)
      set({
        todayDungeonsMap: map,
        isLoading: false,
      })
    } catch (err) {
      console.error('[useGameDataStore] loadTodayDungeonData error:', err)
      set({
        isLoading: false,
        error:
          err instanceof Error
            ? err.message
            : 'Failed to load dungeon daily data (todayDungeonsMap).',
      })
    }
  },

  async loadSkills(token, noobId) {
    if (!noobId) return
    try {
      const [definitionsResp, progressResp] = await Promise.all([
        getAllSkillsAction(token),
        getHeroSkillsProgressAction(token, noobId),
      ])

      set({
        skillDefinitions: definitionsResp.entities ?? [],
        skillProgress: progressResp.entities ?? [],
      })
    } catch (err) {
      console.error('[useGameDataStore] loadSkills error:', err)
    }
  },
}))
