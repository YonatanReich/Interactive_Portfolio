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
      if (typeof window === 'undefined') return 12; // Safety fallback
      
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 🚀 1. Mobile Phones: Needs the camera pushed the FURTHEST back
      if (width < 768) {
          return 25; 
      }
      
      // 🚀 2. Vertical Tablets (iPad in portrait): Needs some extra room
      if (width <= 900 && height > width) {
          return 25; 
      }

      // 🚀 3. Desktop / Landscape Tablets: Wide screens can be closer
      return 12; 
    },
    
    setCameraZ: (z) => set({ cameraZ: z }),

    panelResetTrigger: 0,
    triggerPanelReset: () => set((state) => ({ panelResetTrigger: state.panelResetTrigger + 1 })),

// Replace your current hint state with this:
hintStep: 0, // 0 means completely hidden by default
startHint: () => set({ hintStep: 1 }),
advanceHint: () => set((state) => ({ 
  // If we are on step 4, advancing finishes it (resets to 0). Otherwise, go to next.
  hintStep: state.hintStep >= 4 ? 0 : state.hintStep + 1 
})),
    cancelHint: () => set({ hintStep: 0 }),
previousHint: () => set((state) => ({ 
    hintStep: state.hintStep > 1 ? state.hintStep - 1 : state.hintStep 
  })),
    
}))