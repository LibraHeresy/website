var I=Object.defineProperty;var L=(n,s,l)=>s in n?I(n,s,{enumerable:!0,configurable:!0,writable:!0,value:l}):n[s]=l;var o=(n,s,l)=>(L(n,typeof s!="symbol"?s+"":s,l),l);import{_ as S,h as d,C as _,o as x,c as U,m as v,a2 as E,b as Y,a6 as $,a7 as A,Q as O,a8 as X,F}from"./framework.DVBdlveE.js";const N=["src"],W=["id"],z=["src"],H={__name:"PreviewImage",props:{imageUrl:String},setup(n){const s=n,l=d(!1),g=e=>{const t=document.getElementsByTagName("body")[0];e?(t.style.height="100vh",t.style.overflow="hidden",D()):(t.style.height="unset",t.style.overflow="auto"),l.value=e};class h{constructor(){o(this,"scale",1);o(this,"left","50%");o(this,"top","50%");o(this,"translate","")}}const c=d(new h),P=e=>{const{deltaY:t}=e;let{scale:a}=c.value;t>0?(a-=.2,a<.2&&(a=.2)):t<0&&(a+=.2),c.value.scale=a};class m{constructor(){o(this,"x",0);o(this,"y",0)}}class y{constructor(){o(this,"x",document.body.clientWidth/2);o(this,"y",document.body.clientHeight/2)}}const r=d(new m),i=d(new y),f=e=>{const{clientX:t,clientY:a}=e;r.value.x=t,r.value.y=a},p=e=>{const{clientX:t,clientY:a}=e;b(t,a),c.value.translate=""},w=e=>{const{clientX:t,clientY:a}=e,{x:B,y:C}=r.value;c.value.translate=`${t-B}px ${a-C}px`},b=(e,t)=>{i.value.x=i.value.x-r.value.x+e,i.value.y=i.value.y-r.value.y+t,c.value.left=`${i.value.x}px`,c.value.top=`${i.value.y}px`},D=()=>{r.value=new m,i.value=new y,c.value=new h},k=e=>{console.log("touchstart",e),e.touches.length===1&&f(e.touches[0])},M=e=>{e.preventDefault(),console.log("touchmove",e),e.touches.length===1&&w(e.touches[0]),e.touches.length},T=e=>{console.log("touchend",e),e.changedTouches.length===1&&p(e.changedTouches[0])},u=d(!1);return(()=>{const e=navigator.userAgent||navigator.vendor||window.opera;u.value=/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(e),u.value?console.log("这是一个移动设备"):console.log("这是一个PC或桌面设备")})(),_(()=>{const e=document.getElementById(s.imageUrl);u.value?(e.addEventListener("touchstart",k),e.addEventListener("touchmove",M),e.addEventListener("touchend",T)):(e.addEventListener("wheel",P),e.addEventListener("dragstart",f),e.addEventListener("drag",w),e.addEventListener("dragend",p),e.addEventListener("dragover",t=>t.preventDefault()))}),(e,t)=>(x(),U(F,null,[v("img",{class:"frame-img",src:n.imageUrl,onClick:t[0]||(t[0]=E(()=>g(!0),["stop"]))},null,8,N),(x(),Y(X,{to:"body"},[$(v("div",{id:n.imageUrl,class:"preview-img-mask",onClick:t[1]||(t[1]=E(()=>g(!1),["stop"]))},[v("img",{class:"preview-img",style:O(c.value),src:n.imageUrl},null,12,z)],8,W),[[A,l.value]])]))],64))}},q=S(H,[["__scopeId","data-v-089b5489"]]);export{q as P};
