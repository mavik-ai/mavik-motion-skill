import React from 'react';
import * as THREE from 'three';

/** True Three.js geometry & 3D camera projected onto deterministic vector SVG.
 * Deliberately avoids WebGL/GPU requirements in headless CI.
 */
export const GeometryIcon:React.FC<{frame:number;width:number;height:number;accent:string}>=({frame,width,height,accent})=>{
 const geometry=new THREE.IcosahedronGeometry(1.65,0);
 const edges=new THREE.EdgesGeometry(geometry);
 const meshMatrix=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(frame*.011,frame*.016,frame*.007));
 const camera=new THREE.PerspectiveCamera(38,1,.1,100);
 camera.position.set(0,0,7.5);camera.lookAt(0,0,0);camera.updateMatrixWorld();camera.updateProjectionMatrix();
 const data=edges.getAttribute('position');
 const segments:React.ReactNode[]=[];
 for(let i=0;i<data.count;i+=2){
   const a=new THREE.Vector3().fromBufferAttribute(data,i).applyMatrix4(meshMatrix).project(camera);
   const b=new THREE.Vector3().fromBufferAttribute(data,i+1).applyMatrix4(meshMatrix).project(camera);
   const x1=((a.x+1)/2)*width,y1=((1-a.y)/2)*height,x2=((b.x+1)/2)*width,y2=((1-b.y)/2)*height;
   segments.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i%3===0?accent:'#505050'} strokeWidth={i%3===0?4:2} opacity={i%3===0?.96:.66}/>);
 }
 geometry.dispose();edges.dispose();
 return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label="Three.js vector geometry">{segments}</svg>;
};
