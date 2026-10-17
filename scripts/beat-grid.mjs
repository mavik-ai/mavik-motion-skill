#!/usr/bin/env node
/** Deterministic tempo grid. BPM must be confirmed by a beat analysis or editorial ear. */
export function makeGrid({bpm,duration,offset=0,beatsPerBar=4}){
 if(!Number.isFinite(bpm)||bpm<=0||bpm>300)throw new Error('BPM inválido');
 if(!Number.isFinite(duration)||duration<=0||duration>3600)throw new Error('Duração inválida');
 const beatLength=60/bpm;
 const beats=[];
 for(let i=0;i<duration/beatLength+3;i++){
  const time=offset+i*beatLength;
  if(time<-1e-6||time>duration+1e-6)continue;
  beats.push({index:i,time:+time.toFixed(4),bar:Math.floor(i/beatsPerBar)+1,beat_in_bar:(i%beatsPerBar)+1,strong:i%beatsPerBar===0});
 }
 return {bpm,duration,offset,beat_interval:+beatLength.toFixed(6),beats};
}
if(import.meta.url===`file://${process.argv[1]}`){
 const get=(arg,def)=>{const i=process.argv.indexOf('--'+arg);return i===-1?def:Number(process.argv[i+1]);};
 try{console.log(JSON.stringify(makeGrid({bpm:get('bpm',124),duration:get('duration',60),offset:get('offset',0),beatsPerBar:get('beats-per-bar',4)}),null,2));}catch(e){console.error(e.message);process.exit(2);}
}
