// src/components/GlassPanel.jsx
import { useBox } from '@react-three/cannon'
import { Text, Html, RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { useStore } from '../store.js'
import { easing } from 'maath'
import * as THREE from 'three'
import '../GlassPanel.css' 
import { useScrollVelocity } from '../hooks/useScrollVelocity.jsx'


const LOOP_LENGTH = 350; // Match TunnelChunk length
const CONTENT = {
  modal_projects: {
    title: "PROJECTS",
    body: (
      <div className="project-container">
        
        {/* --- PROJECT 1: PORTFOLIO --- */}
        <div className="project-card">
          <div className="project-header cursor-target">
            <h3>• Interactive SWE Portfolio</h3>
            <h4 className="status-tag-live">LIVE</h4>
            </div>
            
          
          <p className="project-desc cursor-target">
            A high-performance 3D web experience built to demonstrate front-end mastery and graphics programming skills.
          </p>
          <div className="project-problem cursor-target">
            <strong>The Problem:</strong> In a saturated junior market, standard resumes are skimmed and forgotten. This project aims to arrest attention immediately, increasing dwell time and leaving a memorable impression on recruiters.
          </div>
          <div className="tech-stack-section">
            <h4 className="tech-stack-title">⚡ Tech Architecture</h4>
            <div className="tech-reasoning-grid">
              <div className="tech-item cursor-target">
                <span className="tech-name">React 19 & JavaScript</span>
                <span className="tech-why ">
                  Provides the component-based architecture needed to manage the complex synchronization between the 2D UI overlays and the 3D scene state.
                </span>
              </div>
              <div className="tech-item cursor-target">
                <span className="tech-name">React Three Fiber (WebGL)</span>
                <span className="tech-why">
                  A declarative renderer that optimizes the Three.js loop, allowing for efficient 60FPS animation while keeping the codebase modular and readable.
                </span>
              </div>
              <div className="tech-item cursor-target">
                <span className="tech-name">Vite Ecosystem</span>
                <span className="tech-why">
                  Selected for its high-performance build pipeline, enabling rapid prototyping of shaders and physics interactions.
                </span>
              </div>
            </div>
          </div>
          <div className="project-links">
            <a href="https://yonatanreich.dev" className="project-link cursor-target">Go to project &rarr;</a>
            <a href="https://github.com/YonatanReich/Interactive_Portfolio" className="project-link cursor-target">View Repository &rarr;</a>
          </div>
        </div>

        <hr className="divider"/>

        {/* --- PROJECT 2: SANKEY TRACKER --- */}
        <div className="project-card">
          <div className="project-header cursor-target">
            <h3>• Sankey Job Tracker</h3>
            <span className="status-tag-inDev">IN DEVELOPMENT</span>
          </div>
          <p className="project-desc cursor-target">
            A data-visualization tool designed to organize the chaotic job hunt process into actionable insights.
          </p>
          <div className="project-problem cursor-target">
            <strong>The Problem:</strong> Tracking hundreds of applications via spreadsheets lacks depth. Candidates lose track of where they fail (Resume vs. Interview). This app visualizes the funnel to reveal bottlenecks in the process.
          </div>
          <div className="tech-stack-section">
            <h4 className="tech-stack-title">⚡ Tech Architecture</h4>
            <div className="tech-reasoning-grid">
              
              <div className="tech-item cursor-target">
                <span className="tech-name">Next.js 14 & TypeScript</span>
                <span className="tech-why">
                  Utilizes the App Router and Server Actions to unify the frontend and backend, ensuring end-to-end type safety without the need for a separate API layer.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">D3.js Visualization Engine</span>
                <span className="tech-why">
                  Bypasses standard charting libraries in favor of raw D3 calculations, enabling custom Sankey flow logic that dynamically adapts to complex job application states.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">Prisma & PostgreSQL</span>
                <span className="tech-why">
                  A robust relational database strategy managed via Prisma ORM to strictly enforce schema validation for user data and application history.
                </span>
              </div>

            </div>
          </div>
          <div className="project-links">
            <a href="https://github.com/YonatanReich/Sankey-job-hunt-web-app" className="project-link  cursor-target">View Progress &rarr;</a>
          </div>
        </div>

        <hr className="divider"/>

        {/* --- PROJECT 3: DRIVE CLONE --- */}
        <div className="project-card">
          <div className="project-header cursor-target">
            <h3>• Full-Stack Drive Clone</h3>
            <span className="status-tag-inDev">IN DEVELOPMENT</span>
          </div>
          <p className="project-desc cursor-target">
            A distributed file storage system featuring web and mobile clients, architected with a polyglot backend.
          </p>
          <div className="project-problem cursor-target">
             <strong>The Problem:</strong> Bridging the gap between high-level web APIs and low-level systems programming. This project solves the challenge of handling binary streams and compression by offloading heavy lifting to C++.
          </div>
          <div className="tech-stack-section">
            <h4 className="tech-stack-title">⚡ Tech Architecture</h4>
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
        </div>
        </div>
    )
  },
  modal_about: {
    title: "ABOUT ME",
    body: (
      <div className="project-container">
        
        {/* --- BIO CARD --- */}
        <div className="project-card">
          <div className="project-header cursor-target">
            <h3>• The Developer:</h3>
            <span className="status-tag live">Yonatan Reich, CS STUDENT</span>
          </div>
          
          <p className="project-desc cursor-target">
            I am a Computer Science student at <strong>Bar-Ilan University</strong>, expected to graduate in <strong>Summer 2027</strong>.
            <br/><br/>
            Beyond the code, I am defined by a disciplined approach to life. I believe in smart, but rigours work in order to achieve any goal I put in front of myself. My passion lies in seeing a process through from <strong>A to Z</strong>—taking an abstract concept, architecting the solution, and driving it all the way to a polished deployment.
          </p>

          <div className="tech-stack-section">
            <h4 className="tech-stack-title">⚛ Core Philosophy</h4>
            <div className="tech-reasoning-grid">
              
              <div className="tech-item cursor-target">
                <span className="tech-name">End-to-End Ownership</span>
                <span className="tech-why">
                  I thrive on responsibility. Whether it's a low-level backend service or a responsive UI, I am committed to understanding and mastering every layer of the stack to deliver a complete product.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">Creative Problem Solving</span>
                <span className="tech-why">
                  I view constraints as opportunities. I enjoy dissecting complex problems to find elegant, efficient solutions rather than relying on quick fixes or patches.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">Disciplined Growth</span>
                <span className="tech-why">
                  Consistency is my superpower. I am constantly refining my toolset, learning new paradigms (like this portfolio), and holding my code to the highest standard.
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>
    )
  },
  modal_skills: {
    title: "SKILLS",
    body: (
      <div className="project-container">
        
        {/* --- MAIN SKILLS CARD --- */}
        <div className="project-card">
          <div className="project-header cursor-target">
            <h3>• Technical Toolkit</h3>
          </div>
          
          <p className="project-desc cursor-target">
            I am constantly polishing my skills and upgrading my technical toolkit. My goal is to understand the "magic" behind the code- from how a CPU executes instructions to how a web browser renders a page.
          </p>

          {/* 1. SYSTEMS (Honest Student Level) */}
          <div className="tech-stack-section">
            <h4 className="tech-stack-title">⚙️ Systems Programming</h4>
            <div className="tech-reasoning-grid">
              
              <div className="tech-item cursor-target">
                <span className="tech-name">C & C++</span>
                <span className="tech-why">
                  My primary languages for university coursework. Experienced with manual memory management (pointers/malloc) and systems-level logic.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">Operating Systems Concepts</span>
                <span className="tech-why">
                   Currently analyzing the internals of process management, threads, and concurrency to understand how software interacts with hardware.
                </span>
              </div>
              
              <div className="tech-item cursor-target">
                <span className="tech-name">Assembly (x86)</span>
                <span className="tech-why">
                   Gained exposure to low-level instructions and registers, providing a mental model for how high-level code is actually executed.
                </span>
              </div>

            </div>
          </div>

          {/* 2. WEB DEV (Project Level) */}
          <div className="tech-stack-section ">
            <h4 className="tech-stack-title">🌐 Web Development</h4>
            <div className="tech-reasoning-grid ">
              
              <div className="tech-item cursor-target">
                <span className="tech-name">React & Frontend</span>
                <span className="tech-why">
                  Self-taught. Comfortable building interactive UIs (like this portfolio) using Hooks, State, and modern CSS/Tailwind.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">Node.js & Databases</span>
                <span className="tech-why">
                   Experience connecting frontends to scalable backends, working with REST APIs, authentication, and SQL/NoSQL databases.
                </span>
              </div>

            </div>
          </div>

          {/* 3. CORE THEORY (OOP Added Here) */}
          <div className="tech-stack-section ">
            <h4 className="tech-stack-title">🧠 CS Fundamentals</h4>
            <div className="tech-reasoning-grid ">
              
              {/* ✅ OOP added prominently here */}
              <div className="tech-item cursor-target">
                <span className="tech-name">Object-Oriented Programming</span>
                <span className="tech-why">
                   Strong academic foundation in Design Patterns, Inheritance, and Polymorphism (via C++ & Java). I focus on writing modular, maintainable code structures.
                </span>
              </div>

              <div className="tech-item cursor-target">
                <span className="tech-name">Algorithms & Data Structures</span>
                <span className="tech-why">
                   Studying core theory (Graphs, Trees, Sorting) to solve problems efficiently. I prioritize logical correctness and time complexity (Big O) in my solutions.
                </span>
              </div>
              
               <div className="tech-item cursor-target">
                <span className="tech-name">Python</span>
                <span className="tech-why">
                   My go-to tool for automation scripts, data processing, and rapid prototyping.
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    )
  },
  modal_contact: {
    title: "CONTACT",
    body: (
      <div className="project-container">
        
        {/* --- CONTACT CARD --- */}
        <div className="project-card">
          <div className="project-header cursor-target">
            <h3>• Let's Build Together</h3>
            <span className="status-tag-open">OPEN TO WORK</span>
          </div>
          
          <p className="project-desc cursor-target">
            I am currently seeking a <strong>Student Position</strong> or <strong>Internship</strong> in Software Development (Backend / Full Stack).
            <br/><br/>
            I bring a disciplined, architectural mindset to every project. If you are looking for a developer who cares about the "Why" and "How" of every line of code, let's talk.
          </p>

          {/* 1. DIRECT CHANNELS */}
          <div className="tech-stack-section">
            <h4 className="tech-stack-title">✦ Direct Channels</h4>
            <div className="contact-grid ">
              
              {/* Email */}
              <a href="mailto:yonatan.reich@gmail.com" className="contact-item">
                <div className="contact-icon">✉</div>
                <div className="contact-info cursor-target">
                  <span className="contact-label">Email: </span>
                  <span className="contact-value">yonatan.reich@gmail.com</span>
                </div>
              </a>

              {/* Phone */}
              <a href="tel:0503318885" className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-info cursor-target">
                  <span className="contact-label">Phone: </span>
                  <span className="contact-value">050-331-8885</span>
                </div>
              </a>

              {/* Location (Non-clickable) */}
              <div className="contact-item static cursor-target">
                <div className="contact-icon">📍</div>
                <div className="contact-info cursor-target">
                  <span className="contact-label">Based In Ramat Gan, Israel</span>
                </div>
              </div>

            </div>
          </div>

          {/* 2. SOCIAL LINKS */}
          <div className="social-links">
              <a href="https://linkedin.com/in/yonatan-reich-SWE" target="_blank" rel="noreferrer" className="social-button linkedin cursor-target">
                <span>Linked<strong>In</strong></span>
                <span className="arrow">&rarr;</span>
              </a>
              <a href="https://github.com/YonatanReich" target="_blank" rel="noreferrer" className="social-button github cursor-target">
                <span>Git<strong>Hub</strong></span>
                <span className="arrow">&rarr;</span>
              </a>
          </div>

        </div>

      </div>
    )
  }
}

export default function GlassPanel({ position, label, speed = 1, range = 1, id }) {
  // 1. Physics Body
  const [ref, api] = useBox(() => ({
    type: 'Kinematic', 
    position: position,
    args: [3, 2, 0.2] 
  }))
  const { viewport, camera } = useThree()
  const activeTarget = useStore((state) => state.activeTarget)
  const isTargeted = activeTarget === id
  const isOtherActive = activeTarget && !isTargeted
  const velocity = useScrollVelocity()

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
          api.position.set(
            ref.current.position.x, 
            ref.current.position.y, 
            ref.current.position.z
          )
       }
       
       // CASE B: Went too deep in Tunnel -> Send to Behind Camera
       if (startPos.current.z < -280) {
          startPos.current.z += LOOP_LENGTH
          ref.current.position.z += LOOP_LENGTH
          api.position.set(
            ref.current.position.x, 
            ref.current.position.y, 
            ref.current.position.z
          )
       }
    }

    if (isTargeted) {
      // === ACTIVE MODE ===
      // Move to center of tunnel (z=-15) and grow huge
      const targetZ = -35
      goalPos.set(0, 1, targetZ)
      const distance = Math.abs(targetZ - -10)
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
    api.position.set(
      ref.current.position.x, 
      ref.current.position.y, 
      ref.current.position.z
    )

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


  
  
  const curContent = CONTENT[id]

  return (
    <group ref={ref}>
      
        <RoundedBox 
  ref={meshRef}          // ✅ Pass the animation ref here
  args={[3, 2, 0.2]}     // [Width, Height, Depth]
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

