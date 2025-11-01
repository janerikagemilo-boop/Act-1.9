import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Debug
 */
const gui = new dat.GUI()

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = () => {
    console.log('All textures loaded')
}

const textureLoader = new THREE.TextureLoader(loadingManager)
const colorTexture = textureLoader.load('/textures/minecraft.png')
const checkerTexture = textureLoader.load('/textures/checkerboard-8x8.png')
const largeCheckerTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')

// Texture configuration
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)

// Minecraft texture cube
const minecraftMaterial = new THREE.MeshBasicMaterial({ map: colorTexture })
const minecraftCube = new THREE.Mesh(geometry, minecraftMaterial)
minecraftCube.position.x = -2
scene.add(minecraftCube)

// Checker texture cube
const checkerMaterial = new THREE.MeshBasicMaterial({ map: checkerTexture })
const checkerCube = new THREE.Mesh(geometry, checkerMaterial)
scene.add(checkerCube)

// Large checker texture cube
const largeCheckerMaterial = new THREE.MeshBasicMaterial({ map: largeCheckerTexture })
const largeCheckerCube = new THREE.Mesh(geometry, largeCheckerMaterial)
largeCheckerCube.position.x = 2
scene.add(largeCheckerCube)

// Debug
const textureSettings = {
    minecraftRepeat: 1,
    checkerRepeat: 1,
    largeCheckerRepeat: 1
}

gui.add(textureSettings, 'minecraftRepeat').min(1).max(10).step(1).onChange(() => {
    colorTexture.repeat.set(textureSettings.minecraftRepeat, textureSettings.minecraftRepeat)
    colorTexture.needsUpdate = true
})

gui.add(textureSettings, 'checkerRepeat').min(1).max(10).step(1).onChange(() => {
    checkerTexture.repeat.set(textureSettings.checkerRepeat, textureSettings.checkerRepeat)
    checkerTexture.needsUpdate = true
})

gui.add(textureSettings, 'largeCheckerRepeat').min(1).max(10).step(1).onChange(() => {
    largeCheckerTexture.repeat.set(textureSettings.largeCheckerRepeat, textureSettings.largeCheckerRepeat)
    largeCheckerTexture.needsUpdate = true
})

// Enable texture wrapping
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
checkerTexture.wrapS = THREE.RepeatWrapping
checkerTexture.wrapT = THREE.RepeatWrapping
largeCheckerTexture.wrapS = THREE.RepeatWrapping
largeCheckerTexture.wrapT = THREE.RepeatWrapping

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate cubes
    minecraftCube.rotation.y = elapsedTime * 0.5
    checkerCube.rotation.y = elapsedTime * 0.5
    largeCheckerCube.rotation.y = elapsedTime * 0.5

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()