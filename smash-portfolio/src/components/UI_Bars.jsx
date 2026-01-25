import { useStore } from '../store.js'

export default function UI_Bars() {
    const { setTarget, isMuted, toggleMute } = useStore((state) => ({
        setTarget: state.setTarget,
        isMuted: state.isMuted,
        toggleMute: state.toggleMute
    }))
    
    return (
        <div className="ui-bars"
        style={{
                /* CRITICAL LAYOUT STYLES (Inline to prevent Gray Screen) */
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 10,
                pointerEvents: 'none', /* Clicks pass through to 3D */
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <nav className="top-bar-glass">
                <div className="tabs">
          <button onClick ={() => setTarget(null)}>Main menu</button>         
          <button onClick={() => setTarget('projects')}>Projects</button>
          <button onClick={() => setTarget('about')}>About Me</button>
          <button onClick={() => setTarget('skills')}>Skills</button>    
                </div>
                <button className="mute-button" onClick={toggleMute}> 
                    {isMuted ? '🔇 Unmute' : '🔊Mute'}  
                </button>
            </nav>
            
            <footer className="bottom-bar-glass">
                <span className="Name">Yonatan Reich</span>
                <span className="Role">CS student</span>
            </footer>
            </div>
    )
}