// src/components/GlassPanel.jsx
import { useBox } from '@react-three/cannon'
import { Text, Html, RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { useStore } from '../store.js'
import { easing } from 'maath'
import * as THREE from 'three'
import '../GlassPanel.css' 

const screenWidth = window.innerWidth;
const screenheight = window.innerHeight;

const CONTENT = {
  modal_projects: {
    title: "PROJECTS",
    body: (
      <>
        <h3>🚀 Smash Portfolio</h3>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,.</p>
        <br/>
        <h3>🤖 AI Integrations</h3>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,</p>
        <br/>
        <h3>📱 Unity Games</h3>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,</p>
      </>
    )
  },
  modal_about: {
    title: "ABOUT ME",
    body: (
      <>
        <p>Computer Science Studenttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
          ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
          ttttttttttttttttttttttttttttttttttttttttt</p>
        <p>Passionate about <b>Graphics Programming</b> and <b>Web Development</b>.</p>
        <br/>
        <p>Stack: React, Three.js, Node.js, Python.</p>
      </>
    )
  },
  modal_skills: {
    title: "SKILLS",
    body: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <span>React</span><span>Three.js</span>
        <span>Node.js</span><span>Python</span>
        <span>C++</span><span>WebGL</span>
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
      const targetColor = isTargeted ? "#224059" : "#34648a"
      const targetOpacity = isTargeted ? 0.5 : 0.2
      
      easing.dampC(meshRef.current.material.color, targetColor, 0.2, delta)
      easing.damp(meshRef.current.material, 'opacity', targetOpacity, 0.2, delta)
    }
if (textRef.current) {
      const targetFillOpacity = isTargeted ? 0 : 1
      
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
          thickness={isTargeted ? 0 : 2}       
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

