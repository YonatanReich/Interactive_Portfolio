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

   isEntered: false,
    isTransitioning: false, // 🚀 New state
    
    setEntered: () => set({ isEntered: true, isTransitioning: false }),
    
    resetEntered: () => {
        set({ isTransitioning: true, activeTarget: null }); // Start 3D movement first
        // Delay the full state reset to let the animation breathe
        setTimeout(() => set({ isEntered: false, isTransitioning: false }), 2000);
    },

    cameraZ: 12,

    getHomeZ: () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile ? 12 : 30
    },
    
    setCameraZ: (z) => set({ cameraZ: z }),

    panelResetTrigger: 0,
    triggerPanelReset: () => set((state) => ({ panelResetTrigger: state.panelResetTrigger + 1 })),
}))