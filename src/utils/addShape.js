/**
 * Created by K on 2019/11/4.
 */
export default function addShape( shape, extrudeSettings, map, x, y, z, rx, ry, rz, s ) {
  const options = { side: THREE.DoubleSide }

  if(typeof map === 'object') {
    options.map = map
  } else {
    options.color = map
  }

  var geometry =  new THREE.ExtrudeBufferGeometry( shape, extrudeSettings );

  console.log(geometry)
  var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( options ) );
  mesh.position.set( x, y, z - 100 );
  mesh.rotation.set( rx, ry, rz );
  mesh.scale.set( s, s, s );
  return mesh

}