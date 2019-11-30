/**
 * Created by K on 2019/11/4.
 */
import { TransformControls } from '../../jsm/controls/TransformControls.js';

export default class Spectacle {
  constructor(option) {
    this.screen = {
      width: option.width,
      height: option.height
    }
    this.Mesh = THREE.Mesh
    this.renderer = option.renderer || new THREE.WebGLRenderer()
    this.scene = null
    this.cameras = {
      names: [],
      selected: null,
    }

    this.lights = {}
    this.mouse = {}

    // 创建的所有函数
    this.created = []

    // 场景所创建的所有目标
    this.meshs = []

    // 所有相交目标
    this.intersects = null

    // 已选中的目标
    this.selected = null

    // 目标物体坐标轴 手柄变化控制
    this.transform = null

    // 世界旋转控制
    this.orbit = null

    this.initRender()
    this.initScene()
  }

  /**
   * 初始化渲染器
   */
  initRender() {
    const { width, height } = this
    this.renderer.setSize(width, height)
  }

  /**
   * 初始化场景
   */
  initScene() {
    const { width, height } = this
    this.scene = new THREE.Scene()
    this.renderer.setSize(width, height)
  }

  create(cb) {
    if(cb) {
      this.created.push(cb)
      // cb.call(this, this.scene)
    }
  }

  use(cb) {
    if(cb) {
      const mesh = cb(this)
      this.scene.add(mesh)
      // cb.call(this, this.scene)
    }
  }

  __created() {
    for(let i in this.created) {
      this.created[i].call(this, this.scene)
    }
    console.log(this.created)
  }

  addMesh(name, mesh) {
    if(!mesh) return
    // console.log('mesh: ' + name, mesh)
    if(!this.scene.getObjectByName(mesh.name)) {
      console.warn(`${mesh} is ready created`)
    }

    if(!this.scene.getObjectByName(name)) {
      console.warn(`${name} is ready created`)
    }

    this.scene.add(mesh)
    mesh.name = name
    this.meshs.push(mesh)
  }

  set target(target) {
    this.scene.add(target)
    this.selected = target
  }

  get target() {
    return this.selected
  }

  addTransform(transform) {
    this.scene.add(transform)
    this.transform = transform
  }

  createTransform(name, camera) {
    const transform = new TransformControls( camera, this.renderer.domElement )
    transform.name = name
    return transform
  }

  removeTarget(name) {
    const object = this.scene.getObjectByName(name)
    this.scene.remove(object)
  }

  removeControl(name) {
    const object = this.scene.getObjectByName(name)
    this.scene.remove(object)
  }

  remove(name) {
    let object = name
    if(typeof name === 'string') {
      object = this.scene.getObjectByName(name)
    }
    this.scene.remove(object)
  }

  load(cb) {
    cb.call(this, this.scene)
  }

  light(cb) {
    cb.call(this, this.scene, this.lights)
  }

  start(scene, camera) {
    this.__created()

  }

  render() {
  }
}