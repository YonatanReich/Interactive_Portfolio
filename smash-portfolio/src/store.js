import {create} from 'zustand'

export const useStore = create((set) => ({
    activeTarget: null,
    setActiveTarget: (target) => set({ activeTarget: target }),
    resetTarget: () => set({ activeTarget: null }),
    isMuted: false,
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}))