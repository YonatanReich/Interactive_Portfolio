import { create } from 'zustand'

export const useStore = create((set) => ({
    activeTarget: null,
    // FIX: Rename 'setActiveTarget' to 'setTarget'
    setTarget: (target) => set({ activeTarget: target }),
    resetTarget: () => set({ activeTarget: null }),

    scrollDirection: 0,
    setScrollDirection: (dir) => set({ scrollDirection: dir }),
    
    isMuted: false,
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
}))