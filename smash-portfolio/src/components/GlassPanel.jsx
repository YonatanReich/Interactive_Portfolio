// src/components/GlassPanel.jsx
import { Text, Html, RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useStore } from '../store.js'
import { easing } from 'maath'
import * as THREE from 'three'
import '../GlassPanel.css' 
import { useScrollVelocity } from '../hooks/useScrollVelocity.jsx'
import gsap from 'gsap'
import { GrResources } from "react-icons/gr";
import {FiTarget, FiLayout, FiDatabase,  FiCode, FiSettings} from "react-icons/fi"



const LOOP_LENGTH = 700; // Match TunnelChunk length
 const neonGlowStyle = {
  color: 'rgba(76, 180, 187, 1)', // Pure white core
  textShadow: `
    0 0 8px rgba(76, 180, 187, 1), 
    0 0 20px rgba(76, 180, 187, 0.6), 
    0 0 30px rgba(76, 180, 187, 0.3)
  `,
  // Optional: Add a transition in case you want to animate it later
  transition: 'text-shadow 0.3s ease'
};
const CONTENT = {
  modal_projects: {
    title: "PROJECTS",
    body: (
      <>
        <div className="project-card">
  <div className="project-header cursor-target">
    <h3>Applican-t</h3>
    <span className="status-tag-live">LIVE</span>
  </div>
  
  <p className="project-desc cursor-target">
  <strong className="tech-intro">What it is:</strong>  A Job seeker's best friend, A tool that let's users manage a top view of a process that can be complex and tiring, in a way that's intuitive and serves actionable data.
  </p>
  <br/>
  <div className="project-problem cursor-target">
    <strong className="tech-intro">What it solves:</strong> In the current Tech Job market, applicants sometimes need to juggle between tens of application processes, each in different stages, and each may focus on different technologies. Managing this process and producing actionable data that can help users focus on how to maximize their chances at a desired position is what this tool is meant for.
  </div>

  <div className="preview-frame-wrapper cursor-target">
    <iframe 
      src="https://applican-t.com" 
      title="Applicant Mobile Preview"
      className="applicant-iframe-unclickable"
      loading="lazy"
    ></iframe>
  </div>

  <div className="tech-stack-section">
    <h4 className="tech-stack-title" style={{ marginBottom: '12px' }}>
      <GrResources style={{ verticalAlign: '-3', marginRight: '8px' }}/>
      Tech stack
    </h4>
    
    
    <div className="tech-badges-array">
      <img src="https://img.shields.io/badge/Next.js-28a1a7?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
      <img src="https://img.shields.io/badge/TypeScript-28a1a7?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
      <img src="https://img.shields.io/badge/React_Flow-28a1a7?style=for-the-badge&logo=react&logoColor=white" alt="React Flow" />
      <img src="https://img.shields.io/badge/Prisma-28a1a7?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
      <img src="https://img.shields.io/badge/Clerk-28a1a7?style=for-the-badge&logo=clerk&logoColor=white" alt="Clerk" />
    </div>

    <div className="tech-reasoning-grid" style={{ marginTop: '20px' }}>
      
      <div className="tech-item cursor-target">
        <span className="tech-name">Next.js & TypeScript</span>
        <span className="tech-why">
          Utilizes the App Router and Server Actions for a unified, strictly type-safe full-stack environment.
        </span>
      </div>

      <div className="tech-item cursor-target">
        <span className="tech-name">React Flow & Pure CSS</span>
        <span className="tech-why">
          Modern CSS for a slick design, and react flow to produce personalized diagrams that provide a top level view of each user's process.
        </span>
      </div>

      <div className="tech-item cursor-target">
        <span className="tech-name">Clerk & Prisma</span>
        <span className="tech-why">
          Clerk for user Auth, Prisma for a modern, postgreSQL db storage.
        </span>
      </div>

    </div>
  </div>
  
  <div className="project-links">
    <a href="https://applican-t.com" className="project-link cursor-target" target="_blank" rel="noopener noreferrer">Try it yourself &rarr;</a>
  </div>
</div>

        <hr className="divider"/>
        {/* --- PROJECT 2: PORTFOLIO --- */}
        <div className="project-card">
  <div className="project-header cursor-target">
    <h3>My portfolio - You're here right now</h3>
    <h4 className="status-tag-live">LIVE</h4>
  </div>
  
  <p className="project-desc cursor-target">
    <strong className="tech-intro">What it is:</strong> A high end 3D web application meant to demonstrate high level front end skills, and differentiate me from other developers.
  </p>
  <br/>
  <div className="project-problem cursor-target">
    <strong className="tech-intro">What it solves:</strong> With modern tools, standard, minimalist dev websites are so easy to create that it means nothing to have one. This portfolio aims at delivering a unique experience while presenting high-end frontend skills, with the added bonus of doing everything else a dev portfolio does.
  </div>
  
  <div className="preview-frame-wrapper">
    <iframe 
      src="https://yonatanreich.dev" 
      title="Portfolio Mobile Preview"
      className="applicant-iframe"
      loading="lazy"
    ></iframe>
  </div>
  
  <div className="tech-stack-section">
    <h4 className="tech-stack-title" style={{ marginBottom: '12px' }}>
      <GrResources style={{ verticalAlign: '-3', marginRight: '8px' }}/>
      Tech stack
    </h4>

    {/* NEW: Stylized Badge Array directly below the title */}
    <div className="tech-badges-array cursor-target">
      <img src="https://img.shields.io/badge/React_19-28a1a7?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
      <img src="https://img.shields.io/badge/Three.js-28a1a7?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
      <img src="https://img.shields.io/badge/React_Three_Fiber-28a1a7?style=for-the-badge&logo=react&logoColor=white" alt="React Three Fiber" />
      <img src="https://img.shields.io/badge/Vite-28a1a7?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    </div>

    <div className="tech-reasoning-grid" style={{ marginTop: '20px' }}>
      <div className="tech-item cursor-target">
        <span className="tech-name">React 19 & JavaScript</span>
        <span className="tech-why">
          Manages the complex state synchronization between the standard 2D DOM (like this scrollable text) and the WebGL canvas without blocking the main thread.
        </span>
      </div>
      
      <div className="tech-item cursor-target">
        <span className="tech-name">React Three Fiber (WebGL)</span>
        <span className="tech-why">
          Powers the interactive 3D environment, custom shaders, and physics loop natively within the React component tree for maximum performance.
        </span>
      </div>
      
      <div className="tech-item cursor-target">
        <span className="tech-name">Vite Ecosystem</span>
        <span className="tech-why">
          Provides a lightning-fast build pipeline with advanced asset optimization to ensure heavy 3D models and textures load instantly on mobile devices.
        </span>
      </div>
    </div>
  </div>
  
  <div className="project-links">
    <a href="https://github.com/YonatanReich/Interactive_Portfolio" className="project-link cursor-target" target="_blank" rel="noopener noreferrer">Source code &rarr;</a>
  </div>
</div>

        <hr className="divider"/>

        
       

        {/* --- PROJECT 3: DRIVE CLONE --- 
        <div className="project-card">
          <div className="project-header cursor-target">
            <h3>Full-Stack Drive Clone</h3>
            <span className="status-tag-inDev">IN DEVELOPMENT</span>
          </div>
          <p className="project-desc cursor-target">
            A distributed file storage system featuring web and mobile clients, architected with a polyglot backend.
          </p>
          <br/>
          <div className="project-problem cursor-target">
             <strong>The Problem:</strong> Bridging the gap between high-level web APIs and low-level systems programming. This project solves the challenge of handling binary streams and compression by offloading heavy lifting to C++.
          </div>
          <div className="tech-stack-section">
            <h4 className="tech-stack-title">
               <GrResources style={{ verticalAlign: '-3', marginRight: '8px' }}/>
              Tech Architecture</h4>
            <div className="tech-reasoning-grid">
              
              <div className="tech-item cursor-target">
                <span className="tech-name">Node.js & C++ Hybrid Core</span>
                <span className="tech-why">
                  Implements a microservices pattern where the Node.js API acts as a gateway, communicating via raw TCP sockets with a custom C++ server optimized for file manipulation and RLE compression.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">React & React Native (Expo)</span>
                <span className="tech-why">
                  A multi-client ecosystem using React for the web dashboard and Expo Router for the mobile app, ensuring a unified user experience across devices.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">Docker & MongoDB</span>
                <span className="tech-why">
                  Fully containerized environment using Docker Compose to orchestrate the polyglot backend services and persistent MongoDB metadata storage.
                </span>
              </div>

            </div>
          </div>
          <div className="project-links">
            <a href="#" className="project-link cursor-target">View Progress &rarr;</a>
          </div>
        </div>  */}
      </>
    )
  },
  modal_about: {
  title: "ABOUT ME",
  body: (
    <>
      <div className="project-card">
        <div className="project-header cursor-target" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3>Yonatan Reich</h3>
        </div>
        
        <p className="project-desc cursor-target">
          I love building things that work, and providing solutions for real world problems.
          <br/><br/>
          My approach to software engineering is defined by strict discipline and a drive to build things that matter. I don't just write code; I take ownership of the entire lifecycle. Whether diving into complex backend logic or crafting high-performance interactive interfaces, I thrive on turning abstract requirements into robust, production-ready solutions.
        </p>

        <div className="tech-stack-section">
          <h4 className="tech-stack-title" style={{ marginBottom: '16px' }}>
            <FiTarget style={{ verticalAlign: '-3px', marginRight: '8px', color: 'var(--primary-color)' }} />
            Why Work With Me
          </h4>
          
          <div className="tech-reasoning-grid">
            
            <div className="tech-item cursor-target">
              <span className="tech-name">End-to-End Ownership</span>
              <span className="tech-why">
                I take features from concept to deployment. I am equally comfortable designing database schemas and optimizing low-level systems as I am building fluid, High level user interfaces.
              </span>
            </div>

            <div className="tech-item cursor-target">
              <span className="tech-name">Disciplined Problem Solving</span>
              <span className="tech-why">
                I bring a rigorous, systematic work ethic to debugging and architecture. I view constraints as opportunities, breaking down complex bottlenecks to build scalable, long-term solutions rather than quick patches.
              </span>
            </div>

            <div className="tech-item cursor-target">
              <span className="tech-name">Clear & Collaborative Communication</span>
              <span className="tech-why">
                Great code requires great communication. Fully fluent in both English and Hebrew, I prioritize writing clean documentation, sharing knowledge, and maintaining transparent alignment with my team.
              </span>
            </div>

            <div className="tech-item cursor-target">
              <span className="tech-name">Adaptable Foundations</span>
              <span className="tech-why">
                My academic background (BSc in Computer Science at BIU, ongoing) provides me with solid fundementals that help me understand new tools and technologies quickly
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  )
},
  modal_skills: {
  title: "SKILLS",
  body: (
    <>
      <div className="project-card">
        <div className="project-header cursor-target">
          <h3>Engineering Capabilities</h3>
        </div>
        
        <p className="project-desc cursor-target">
          My focus is on building practical, reliable software. Whether I'm designing a fast, intuitive user interface or architecting the secure database that powers it, I care about delivering a complete, polished product that solves real business problems.
        </p>

        {/* --- SECTION 1: THE FULL STACK SPECTRUM --- */}
        <div className="tech-stack-section" style={{ marginTop: '20px' }}>
          
          <div className="tech-reasoning-grid">
            
            <div className="tech-item cursor-target">
              <span className="tech-name">
                <FiLayout style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                Frontend & User Experience
              </span>
              <span className="tech-why">
                Focused on what the user actually sees and feels. I build responsive, highly interactive web applications that look professional, load instantly, and are genuinely enjoyable to use.
              </span>
            </div>

            <div className="tech-item cursor-target">
              <span className="tech-name">
                <FiDatabase style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                Backend & Data Infrastructure
              </span>
              <span className="tech-why">
                Focused on reliability and security. I design structured databases and robust servers to ensure user data is handled safely and applications run smoothly behind the scenes without interruption.
              </span>
            </div>

            <div className="tech-item cursor-target">
              <span className="tech-name">
                <FiSettings style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                Systems & Performance
              </span>
              <span className="tech-why">
                Focused on speed and efficiency. By understanding how software operates under the hood, I write clean, optimized code that prevents bottlenecks and scales easily as a platform grows.
              </span>
            </div>

          </div>
        </div>

        {/* --- SECTION 2: TECHNOLOGIES & TOOLS --- */}
        <div className="tech-stack-section" style={{ marginTop: '30px' }}>
          <h4 className="tech-stack-title" style={{ marginBottom: '16px' }}>
            <FiCode style={{ verticalAlign: '-3px', marginRight: '8px', color: 'var(--primary-color)' }} />
            Technologies & Languages
          </h4>
          
          <div className="tech-badges-array">
            {/* Frontend */}
            <img src="https://img.shields.io/badge/React-28a1a7?style=for-the-badge&logo=react&logoColor=white" alt="React" />
            <img src="https://img.shields.io/badge/React_Native-28a1a7?style=for-the-badge&logo=react&logoColor=white" alt="React Native" />
            <img src="https://img.shields.io/badge/Next.js-28a1a7?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
            <img src="https://img.shields.io/badge/Three.js-28a1a7?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
            
            {/* Backend & DB */}
            <img src="https://img.shields.io/badge/Node.js-28a1a7?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
            <img src="https://img.shields.io/badge/Express-28a1a7?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
            <img src="https://img.shields.io/badge/PostgreSQL-28a1a7?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
            <img src="https://img.shields.io/badge/Prisma-28a1a7?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
            
            {/* Languages */}
            <img src="https://img.shields.io/badge/TypeScript-28a1a7?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
            <img src="https://img.shields.io/badge/JavaScript-28a1a7?style=for-the-badge&logo=javascript&logoColor=white" alt="JavaScript" />
            <img src="https://img.shields.io/badge/Java-28a1a7?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" />
            <img src="https://img.shields.io/badge/C%2B%2B-28a1a7?style=for-the-badge&logo=cplusplus&logoColor=white" alt="C++" />
            <img src="https://img.shields.io/badge/C-28a1a7?style=for-the-badge&logo=c&logoColor=white" alt="C" />
            <img src="https://img.shields.io/badge/Python-28a1a7?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
            <img src="https://img.shields.io/badge/Assembly-28a1a7?style=for-the-badge&logoColor=white" alt="Assembly" />
          </div>
        </div>

      </div>
    </>
  )
},
  modal_contact: {
    title: "CONTACT",
    body: (
      <>
        <div className="project-card">
          
          <div className="project-header cursor-target">
            <h3>Let's Build Together</h3>
          </div>
          
          <p className="project-desc cursor-target">
            I am currently seeking a <strong style={neonGlowStyle}> Student Position</strong> or <strong style={neonGlowStyle}> Full Time Position</strong> in Software Development (Backend / Full Stack).
            <br/><br/>
            I bring a disciplined, architectural mindset to every project. If you are looking for a developer who cares about the "Why" and "How" of every line of code, let's talk.
          </p>

          <div className="cyber-terminal-stack">
            
            {/* Email */}
            <a href="mailto:yonatan.reich@gmail.com" className="cyber-row cursor-target">
               <div className="row-prefix">
                  <span className="icon">
                    <img src="/email-svgrepo-com.svg" alt="Email" className="pixel-icon" />
                  </span> 
                  EMAIL
                </div>
              <div className="row-data">yonatan.reich@gmail.com</div>
              <div className="row-action">[ Email me ]</div>
            </a>

            {/* Phone */}
            <a href="tel:0503318885" className="cyber-row cursor-target">
              <div className="row-prefix">
                  <span className="icon">
                    <img src="/phone-call-svgrepo-com.svg" alt="Phone" className="pixel-icon" />
                  </span> 
                  PHONE
              </div>
              <div className="row-data">050-331-8885</div>
              <div className="row-action">[ Call me ]</div>
            </a>

            {/* Location */}
            <a className="cyber-row cursor-target"> 
               <div className="row-prefix">
                  <span className="icon">
                    <img src="/location-svgrepo-com.svg" alt="Location" className="pixel-icon" />
                  </span> 
                  LOCATION
              </div>
              <div className="row-data">Ramat Gan, Israel</div>
              <div className="row-action">[ I'm located here ]</div>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com/in/yonatan-reich-SWE" target="_blank" rel="noreferrer" className="cyber-row cursor-target">
               <div className="row-prefix">
                  <span className="icon">
                    <img src="/LI-In-Bug.png" alt="LinkedIn" className="pixel-icon" />
                  </span> 
                  LINKEDIN
              </div>
             <div className="row-data"></div>
              <div className="row-action">[ Visit my profile ]</div>
            </a>

            {/* GitHub */}
            <a href="https://github.com/YonatanReich" target="_blank" rel="noreferrer" className="cyber-row cursor-target">
              <div className="row-prefix">
                  <span className="icon">
                    <img src="/GitHub_Invertocat_Black.svg" alt="GitHub" className="pixel-icon" />
                  </span> 
                  GITHUB
              </div>
              <div className="row-data"></div>
              <div className="row-action">[ See my work ]</div>
            </a>

          </div>
        </div>
      </>
    )
  }
}

export default function GlassPanel({ position, label, speed = 1, range = 1, id }) {
  // 1. Physics Body
  const ref = useRef()
  useEffect(() => { if (ref.current) ref.current.position.set(...position) }, [])
  const { viewport, camera } = useThree()
  const activeTarget = useStore((state) => state.activeTarget)
  const isTargeted = activeTarget === id
  const isOtherActive = activeTarget && !isTargeted
  const velocity = useScrollVelocity()
  const panelResetTrigger = useStore((state) => state.panelResetTrigger)
  const getHomeZ = useStore((state) => state.getHomeZ)
  const isFirstMount = useRef(true)

  // FIX: Convert the 'position' array to a Vector3 so we can use .x / .y / .z later
  const startPos = useRef(new THREE.Vector3(...position))
  const meshRef = useRef()
  const textRef = useRef()

  useLayoutEffect(() => {
    if (meshRef.current) {
        meshRef.current.name = "GlassPanel"
        meshRef.current.userData = { id }
    }
  }, [id])
   
  // 2. Animation Loop
  useFrame((state, delta) => {
    // Safety check: ensure ref exists before animating
    if (!ref.current) return

    // 1. Determine our Goal Position & Scale based on state
    const goalPos = new THREE.Vector3()
    const goalScale = new THREE.Vector3()
    const safeDelta = delta > 0.1 ? 0.1 : delta

      if (!isTargeted) {
       const currentVel = velocity?.user?.current || 0
       const moveDist = currentVel * safeDelta
       startPos.current.z += moveDist

       // === 🚀 THE FIX IS HERE ===
       
       // CASE A: Went too far forward (Behind camera) -> Send to Tunnel
       if (startPos.current.z > 20) {
          // 1. Update Logical Position
          startPos.current.z -= LOOP_LENGTH
          
          // 2. HARD TELEPORT VISUALS (Bypass Animation)
          // We force the mesh to the new spot instantly so damp3 doesn't "fly" it there.
          ref.current.position.z -= LOOP_LENGTH
          
          // 3. HARD TELEPORT PHYSICS
         
       }
       
       // CASE B: Went too deep in Tunnel -> Send to Behind Camera
       if (startPos.current.z < -280) {
          startPos.current.z += LOOP_LENGTH
          ref.current.position.z += LOOP_LENGTH
         
       }
    }

    if (isTargeted) {
      // === ACTIVE MODE ===
      // Move to center of tunnel (z=-15) and grow huge
      const targetZ = -35
      goalPos.set(0, 1, targetZ)
      const distance = Math.abs(targetZ - camera.position.z)
      const vHeight = 2 * Math.tan((camera.fov * Math.PI / 180) / 2) * distance
      const vWidth = vHeight * camera.aspect
      goalScale.set(vWidth/2.9, vHeight/2, 1) 
    } else {
    
      // === IDLE MODE ===
      // Float around original start position
      const t = state.clock.getElapsedTime() * speed
      const hoverY = Math.cos(t) * range
      
      // FIX: Now startPos.current.x works because it's a Vector3
      goalPos.set(
        startPos.current.x, 
        startPos.current.y + hoverY, 
        startPos.current.z
      )
      goalScale.set(1, 1, 1) // Reset to normal size
    }

    // 2. Smoothly Animate the VISUAL GROUP (ref)
    easing.damp3(ref.current.position, goalPos, 0.3, delta)
    easing.damp3(ref.current.scale, goalScale, 0.3, delta)
    
    // 3. Sync the PHYSICS BODY
    // "Teleport" the physics box to match our smooth visual animation
    

    // 4. Child Mesh Effects (Color/Opacity)
    if (meshRef.current) {
      let targetColor = "#34648a"
      let targetOpacity = 0.1

      if (isTargeted) {
          targetColor = "#224059"
          targetOpacity = 0.5
      }
      if (isOtherActive) {
          // 👻 FADE OUT if someone else is the star
          targetOpacity = 0 
      }
      
      easing.dampC(meshRef.current.material.color, targetColor, 0.2, delta)
      easing.damp(meshRef.current.material, 'opacity', targetOpacity, 0.2, delta)
    }
if (textRef.current) {
      const shouldHide = activeTarget !== null 
      
      const targetFillOpacity = shouldHide ? 0 : 1
      
      // If closing (not targeted), we want to WAIT before showing label
      // But in JS loop we can't 'wait'. We just dampen slowly.
      // A better trick: If targeted, fade out FAST. If not, fade in SLOW.
      const smoothTime = isTargeted ? 0.3 : 0.8 // Fast out, Slow in
      
      easing.damp(textRef.current, 'fillOpacity', targetFillOpacity, smoothTime, delta)
    }
  })

  useEffect(() => {
    // Skip the first mount so panels don't snap to the camera on load
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    
    const resetZ = position[2]

    gsap.to(startPos.current,{
      z: resetZ,
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: () => {
      
      }
    })
  
  // 4. Update the visual mesh position instantly to prevent the 1-frame "skip"
  if (ref.current) {
    gsap.fromTo(meshRef.current.material,
      { opacity: 0 },
      { opacity: 0.1, duration: 1.5, ease: "power2.inOut" }
    )
  }
}, [panelResetTrigger])

  
  
  const curContent = CONTENT[id]

  return (
    <group ref={ref}>
      
        <RoundedBox 
  ref={meshRef}          // ✅ Pass the animation ref here
  args={[3.5, 2, 0.2]}     // [Width, Height, Depth]
  radius={0.1}           // Radius of the rounded corners
        smoothness={4}         // Number of segments (higher = smoother)
        renderOrder={isTargeted? 999 : 0}
>
        <meshPhysicalMaterial 
          color="#34648a" 
          transmission={0.95} 
          opacity={0.1} 
          metalness={0} 
          roughness={0}       
          ior={isTargeted ? 1.0 : 1.5}           
          thickness= {0}       
          envMapIntensity={2}
          clearcoat={1}
          depthTest={!isTargeted}
          depthWrite={false}
          
        />
        </RoundedBox>
      
      <Text
          ref ={textRef}
          position={[0, 0, 0.15]}
          fontSize={0.5}
          color="white"
          anchorX="center"
        anchorY="middle"
        font =  '/Orbitron-VariableFont_wght.ttf'
        >
          {label}
        </Text>
      
      
        
      <Html >
         
        <div className={`glass-panel-content ${isTargeted ? 'active' : ''}`}>
          {curContent.body}
        </div>
      </Html>
      
    </group>
  )
}
  

