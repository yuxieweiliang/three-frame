<template>
  <div id="root" class="root">

  </div>
</template>

<script>
  import '../../../static/script/loaders/OBJLoader.js';
  import '../../../static/script/loaders/MTLLoader.js';
  import { RectAreaLightUniformsLib } from '../../../static/jsm/lights/RectAreaLightUniformsLib.js';
  import { PointerLockControls } from '../../../static/jsm/controls/PointerLockControls.js';
  import { OrbitControls } from '../../../static/jsm/controls/OrbitControls.js';
  import { TransformControls } from '../../../static/jsm/controls/TransformControls.js';
  import addShape from '../../utils/addShape.js'
  import createBox from '../../utils/createBox.js'
  import roundedRect from '../../utils/roundedRect.js'
  import Spectacle from '../../utils/spectacle.js'
  import rayCaster from '../../utils/raycaster.js'

  var control, orbit, INTERSICTED;


  // console.log(...data.material.data)
  export default {
    data () {
      return { }
    },

    components: { },

    methods: { },

    mounted () {
      console.log('--------------')

      const sp = new Spectacle({
        width: window.innerWidth,
        height: window.innerHeight
      })

      // 网格
      sp.load(function (scene) {
        const gridHelper = new THREE.GridHelper( 1000, 10 )
        gridHelper.name = '地面网格'
        scene.add( gridHelper );
      })


      // 相机
      sp.create(function (scene) {
        const perspective = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1e10 );
        perspective.position.set( 0, 150, 500 );
        perspective.name = '相机'
        scene.add( perspective );
        this.cameras.perspective = perspective
        console.log('light2222', this);
      })

      // 点光 && 平行光
      sp.create(function (scene) {
        const direction = new THREE.DirectionalLight(0xffffff);
        direction.position.set(0, 1, 1).normalize();
        direction.name = '平行光'
        scene.add(direction);
        this.lights.direction = direction
      })

      // 地面
      sp.create(function (scene) {
        var plane = new THREE.Mesh( new THREE.PlaneBufferGeometry(10000, 10000), new THREE.MeshBasicMaterial( { side: THREE.DoubleSide, color: '#b8b8b8' } ) );
        plane.name = '地面';
        plane.rotation.x = - Math.PI / 2;
        plane.position.y = -308;
        scene.add(plane);
      })

      sp.create(function (scene) {
        var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
        var material = new THREE.MeshLambertMaterial( { color: '#ff564d', transparent: true } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = -100

        sp.addMesh( '红色方块', mesh );
      })

      // 初始化 物品
      sp.create(function (scene) {
        const { cameras: { perspective: camera }, renderer, screen: { width, height } } = this

        /**
         * 重新创建一个立方体
         */
        var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
        var material = new THREE.MeshLambertMaterial( { color: '#ffa', transparent: true } );
        var mesh = new THREE.Mesh( geometry, material );

        // 控制手柄
        sp.raycaster = new THREE.Raycaster();
        sp.radius = 100

        this.render = function () {
          // 函数updateMatrix()和updateMatrixWorld(force)将根据position,rotation或quaternion,scale参数更新matrix和matrixWorld(矩阵和矩阵世界)。
          camera.updateMatrixWorld();
          renderer.render(scene, camera);
        }

        sp.addMesh( '黄色方块', mesh );
        addOrbit(camera, renderer.domElement, this.render)


        this.renderer.setSize(width, height);
        document.getElementById('root').appendChild(this.renderer.domElement);
        setTimeout(this.render.bind(this), 100)
      })

      /**
       * 世界旋转
       */
      function addOrbit(camera, dom, render) {
        orbit = new OrbitControls( camera, dom );
        orbit.update();
        orbit.addEventListener('change', render);
      }

      /**
       * 物体控制轴
       */
      function createTransform(targetMesh, name) {
        const camera = sp.cameras.perspective
        const dom = sp.renderer.domElement
        const render = sp.render
        const selected = sp.scene.getObjectByName(name)
        const controlName = `${name}-${targetMesh.name}`
        const transform = sp.createTransform(controlName, camera)


        // 第一次，selected 还是 null
        if(!sp.transform) {
          // 创建一个控制器
          sp.addTransform(transform)

        } else {

          console.log(sp.transform.name, transform.name)
          // console.log(sp.control.transform.name, transform.name)
          /**
           * 已选中 !== 当前选中
           */
          if(sp.transform.name !== transform.name) {
            /**
             * 删除已选 target
             */
            sp.transform.detach()
            sp.remove(sp.transform)

            /**
             * 重新创建 target
             */
            sp.addTransform(transform)
          }
        }

        // console.log('selected: ', sp.control.transform)
        if(sp.transform) {

          sp.transform.attach( targetMesh );

          sp.transform.addEventListener('change', render);

          // sp.scene.add( control );

          sp.intersects = targetMesh;
          // sp.addTarget(targetMesh.name, targetMesh)
          // sp.addTransform(controlName, control)

          // control.minDistance = 2;
          // control.maxDistance = 10;
          /**
           * 当拖动 已经改变时回调
           * 也就是在这个时候，把 orbit 的 启用 改为 false
           * event: {
       *  target: 拖动目标
       *  type: 拖动类型
       *  value: 开始拖动为 true, 拖动结束为 false
       * }
           */
          sp.transform.addEventListener( 'dragging-changed', function ( event ) {
            orbit.enabled = !event.value
          });
        }
        // control.enabled = false
      }

      document.addEventListener('mousemove', onMouseMove, false);
      document.addEventListener('mousedown', onMouseDown, false);

      let Mesh;
      function onMouseMove(e) {
        const { width, height } = sp.screen;

        e.preventDefault();
        const mouse = {
          x: (e.clientX / (width)) * 2 - 1,
          y: - (e.clientY / (height)) * 2 + 1
        };

        /**
         * 添加选中状态
         */
        Mesh = rayCaster(sp, mouse, control)

        // console.log('-------------', Mesh)
        // sp.render()
      }
      function onMouseDown(e) {

        if(Mesh) {
          /**
           * 添加控制器
           */
          // console.log('-------------Mesh', 'control'+i-1)
          // console.log('-------------sp.scene', sp.scene)
          /*if(sp.scene.getObjectByName('control'+(i-1))) {
           console.log('-------------sp.control', sp.scene.getObjectByName('control'+(i-1)))
           sp.scene.getObjectByName('control'+(i-1)).detach().remove()
           sp.scene.remove(sp.scene.getObjectByName('control'+(i-1)))
           }*/
          // console.log(sp.target)

          control = createTransform(Mesh, 'transform')

        }
        // dispose()
        sp.render()
        // document.removeEventListener('mousedown', onMouseDown)
      }

      sp.active = '鼠标当前交叉的目标';

      sp.start()

      sp.create(() => {

        setTimeout(function () {
          const obj = sp.scene.getObjectByName('方块黄色')

          obj.material.emissive.setHex(0x0000ff);
        }, 2000);
      })


      sp.use(function (sp) {
        var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
        var material = new THREE.MeshLambertMaterial( { color: '#3e42ff', transparent: true } );
        var mesh = new THREE.Mesh( geometry, material );
        mesh.name = '蓝色方块'

        mesh.position.setX(100)
        return mesh
      })
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "./style.less";

</style>
