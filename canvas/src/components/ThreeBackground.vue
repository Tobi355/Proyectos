<template>
  <div class="fixed inset-0 pointer-events-none" style="z-index: 0;">
    <canvas ref="canvasEl" style="width: 100%; height: 100%;"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

// Nombre correcto: canvasEl (coincide con ref="canvasEl")
const canvasEl = ref(null)

let scene, camera, renderer, particles, animationId

onMounted(() => {
  init()
  animate()
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
})

function init() {
  const canvas = canvasEl.value
  if (!canvas) return

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  // Partículas
  const particlesGeometry = new THREE.BufferGeometry()
  const particlesCount = 80
  const posArray = new Float32Array(particlesCount * 3)

  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x6366f1,
    transparent: true,
    opacity: 0.4
  })

  particles = new THREE.Points(particlesGeometry, particlesMaterial)
  scene.add(particles)

  // Líneas de conexión
  const linesGeometry = new THREE.BufferGeometry()
  const linesCount = 30
  const linesPosArray = new Float32Array(linesCount * 3 * 2)

  for (let i = 0; i < linesCount * 3 * 2; i += 3) {
    linesPosArray[i] = (Math.random() - 0.5) * 10
    linesPosArray[i + 1] = (Math.random() - 0.5) * 10
    linesPosArray[i + 2] = (Math.random() - 0.5) * 10
  }

  linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPosArray, 3))

  const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0.1
  })

  const lines = new THREE.Line(linesGeometry, linesMaterial)
  scene.add(lines)
}

function onWindowResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
  animationId = requestAnimationFrame(animate)

  if (particles) {
    particles.rotation.y += 0.0003
    particles.rotation.x += 0.0001
  }

  scene?.children.forEach(child => {
    if (child.type === 'Line') {
      child.rotation.y += 0.0001
    }
  })

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}
</script>
