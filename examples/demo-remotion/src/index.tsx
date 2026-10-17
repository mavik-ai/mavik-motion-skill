import React from 'react';
import {registerRoot, Composition, AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Sequence} from 'remotion';
import {gsap} from 'gsap';
import {GeometryIcon} from './three-geometry';

/** gsap.parseEase() is pure and frame-addressable; no real-time timers or effects. */
const ease = gsap.parseEase('power3.out');
const smooth = (f:number,a:number,b:number) => ease(Math.max(0,Math.min(1,(f-a)/(b-a))));
const BLACK='#000000', WHITE='#FFFFFF', LIME='#CFFF3D';

const Reel:React.FC=()=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const sec=f/fps;
 const a=smooth(f,0,16),b=smooth(f,65,86),c=smooth(f,140,166);
 const firstOpacity=interpolate(f,[0,16,62,78],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const secondOpacity=interpolate(f,[70,86,135,149],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const thirdOpacity=smooth(f,147,170);
 return <AbsoluteFill style={{background:BLACK,fontFamily:'Arial, Helvetica, sans-serif',color:WHITE,overflow:'hidden'}}>
   <div style={{position:'absolute',top:145,left:75,fontSize:22,letterSpacing:5,color:LIME,fontWeight:700}}>MAVIK / MOTION LAB</div>
   <div style={{position:'absolute',right:90,top:245,opacity:0.6+0.4*c,transform:`translateY(${(1-c)*100}px)`}}>
      <GeometryIcon frame={f} width={510} height={510} accent={LIME}/>
   </div>
   <div style={{position:'absolute',top:680,left:75,right:60,minHeight:650}}>
      <div style={{opacity:firstOpacity,transform:`translateX(${(1-a)*-180}px)`,fontSize:128,fontWeight:900,letterSpacing:-8,lineHeight:.95}}>IDEIAS<br/><span style={{color:LIME}}>EM MOVIMENTO.</span></div>
      <div style={{opacity:secondOpacity,transform:`translateY(${(1-b)*130}px)`,position:'absolute',top:0,fontSize:120,fontWeight:900,letterSpacing:-7,lineHeight:1}}>MOVIMENTO<br/><span style={{color:LIME}}>COM INTENÇÃO.</span></div>
      <div style={{opacity:thirdOpacity,transform:`scale(${.9+.1*thirdOpacity})`,transformOrigin:'left center',position:'absolute',top:0,fontSize:122,fontWeight:900,letterSpacing:-7,lineHeight:1}}>CRIE.<br/>ANIME.<br/><span style={{color:LIME}}>EVOLUA.</span></div>
   </div>
   <div style={{position:'absolute',bottom:215,left:75,right:75,height:3,background:'#242424'}}/>
   <div style={{position:'absolute',bottom:215,left:75,width:930*(f/240),height:3,background:LIME}}/>
   <div style={{position:'absolute',bottom:140,left:75,color:'#A6A6A6',fontSize:25,letterSpacing:2}}>KINETIC EDITORIAL  /  FRAME-DETERMINISTIC</div>
 </AbsoluteFill>;
};
const Root:React.FC=()=> <Composition id="DemoMavikMotion" component={Reel} durationInFrames={240} fps={30} width={1080} height={1920}/>;
registerRoot(Root);
