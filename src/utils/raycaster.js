/**
 * Created by K on 2019/11/13.
 */
let INTERSICTED;
export default function (sp, mouse, control) {

  /**
   * 鼠标位置
   * 使用的相机
   */
  sp.raycaster.setFromCamera(mouse, sp.cameras.perspective);

  /**
   * 获取所有 相交的对象
   */
  const intersects = sp.raycaster.intersectObjects(sp.scene.children);
  // console.log('-------------intersects', intersects)
  /**
   * 当前鼠标指向射线上，是否存在 物品
   * INTERSICTED： 当前选中的物品
   */
  if(intersects.length > 0) {
    // console.log(INTERSICTED, intersects[ 0 ].object)
    // console.log(intersects[ 0 ].object instanceof sp.Mesh)
    // 如果它不是已经选中的，则让他变红
    if(intersects && INTERSICTED !== intersects[ 0 ].object && intersects[ 0 ].object instanceof sp.Mesh && intersects[ 0 ].object.name !== '地面') {
      if(INTERSICTED) {
        if(INTERSICTED.material.emissive) {
          INTERSICTED.material.emissive.setHex(INTERSICTED.surrentHex);
        }
      }
      // 第一个，也就是最近的一个
      INTERSICTED = intersects[ 0 ].object;
      sp.target = intersects[ 0 ].object;
      if(control) {
        // control.visible = false;
      }

      if(INTERSICTED.material.emissive) {
        INTERSICTED.currentHex = INTERSICTED.material.emissive.getHex();
        INTERSICTED.material.emissive.setHex(0xff0000);
      }
    } else {
      // INTERSICTED = null;
    }
  }else {
    if(INTERSICTED) {
      if(INTERSICTED.material.emissive) {
        INTERSICTED.material.emissive.setHex(INTERSICTED.surrentHex);
      }
    }
    INTERSICTED = null;
  }

  return INTERSICTED
}