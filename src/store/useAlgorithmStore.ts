// path: src/store/useAlgorithmStore.ts
'use client'

import { create } from 'zustand'

export type AlgorithmType = 'manual' | 'mcts' | 'minimax' | 'dp' | 'greedy' | 'random'

export interface AutoStartConfig {
  dungeonId: number
  isJuiced: boolean
  thresholdEnergy: number
}

interface AlgorithmState {
  selectedAlgorithm: AlgorithmType
  autoPlay: boolean
  autoStartConfig: AutoStartConfig | null
  setAlgorithm: (algo: AlgorithmType) => void
  setAutoPlay: (val: boolean) => void
  setAutoStartConfig: (config: AutoStartConfig) => void
  clearAutoStartConfig: () => void
}

export const useAlgorithmStore = create<AlgorithmState>((set) => ({
  selectedAlgorithm: 'manual',
  autoPlay: false,
  autoStartConfig: null,

  setAlgorithm: (algo) => {
    set({ selectedAlgorithm: algo, autoPlay: false })
  },

  setAutoPlay: (val) => {
    set({ autoPlay: val })
  },

  setAutoStartConfig: (config) => {
    set({ autoStartConfig: config })
  },

  clearAutoStartConfig: () => {
    set({ autoStartConfig: null })
  },
}))
