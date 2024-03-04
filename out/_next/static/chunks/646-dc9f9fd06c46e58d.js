"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[646],{2373:function(e,t,a){a.d(t,{Z:function(){return Content}});var n=a(5893),i=a(2081);function Content(e){let{children:t,className:a=""}=e;return(0,n.jsx)(i.E.div,{className:"p-4 py-8 grid gap-2 ".concat(a),variants:{offscreen:{x:"100%"},onscreen:{x:0}},whileInView:"onscreen",initial:"offscreen",transition:{type:"spring",bounce:0,duration:.2},viewport:{once:!1,amount:0},children:t})}},4709:function(e,t,a){a.d(t,{Z:function(){return TabNavigation}});var n=a(5893),i=a(8138),l=a(1163),o=a(2081);let s=[{icon:i.X1w,label:"Dashboard",path:"/"},{icon:i.TxY,label:"Facturen"},{icon:i.SsP,label:"Declaraties",path:"/declarations"},{icon:i.H$w,label:"Instellingen"}];function TabNavigation(){let e=(0,l.useRouter)(),isActiveTab=t=>e.pathname===t.path;return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("div",{id:"tab-bar-spacer",className:"h-20"}),(0,n.jsx)("section",{className:"fixed bottom-0 left-0 right-0 bg-white h-20 border-t border-gray-200 flex items-center justify-between gap-8 px-2 text-[10px]",children:s.map((t,a)=>(0,n.jsxs)(o.E.button,{className:"\n                        flex flex-1 flex-col items-center gap-1 p-2 rounded-lg relative\n                        transition-all duration-500\n                        ".concat(isActiveTab(t)?"font-bold text-blue-600":"","\n                    "),onClick:()=>(null==t?void 0:t.path)?e.push(t.path):null,children:[isActiveTab(t)&&(0,n.jsx)(o.E.span,{layoutId:"navigationTabsBubble",transition:{type:"spring",bounce:.2,duration:.4},className:"absolute inset-0 rounded-lg bg-black/5"}),(0,n.jsx)(t.icon,{className:"w-8 h-8",strokeWidth:.1}),t.label]},a))})]})}},9906:function(e,t,a){a.d(t,{Z:function(){return PlusMenu}});var n=a(5893),i=a(7516),l=a(3750),o=a(7294),s=a(2081),r=a(1163),c=a(8583),d=a(5122),u=a(9895),f=a(9872),p=a(891);function PlusMenu(){let e=(0,r.useRouter)(),[t,a]=(0,o.useState)(!1),[h,g]=(0,c.KO)(d.KX),m=(0,o.useRef)(null),[x,b]=(0,o.useState)([]),handleCameraClick=async t=>{if(t.preventDefault(),u.dV.isNativePlatform()){let{scannedImages:t}=await f._4.scanDocument({letUserAdjustCrop:!1,responseType:f.UN.Base64}),a=[];for(let e of t){let t=e.includes("iVBORw0KGgoAAAANSUhEUgAA"),n=e.includes("/9j/");n?a.push("data:image/jpeg;base64,".concat(e)):t&&a.push("data:image/png;base64,".concat(e))}g(a),await e.push("/declaration")}},handleFileInputChange=async t=>{let a=t.target.files;if(b(a),!a.length)return;let n=[];for(let e of a)if(u.dV.isNativePlatform()){console.log("selectedFile",e);let t=await p.fy.readFile({path:e.path,ecoding:"base64"});n.push(t)}else{let t=new FileReader;await t.readAsDataURL(e),t.onloadend=()=>{let e=t.result;n.push(e)}}await g(n),await e.push("/declaration")},handleToggleMenu=e=>{if("boolean"==typeof e)return a(e);a(!t)};return(0,n.jsxs)("div",{className:"fixed right-4 bottom-24 flex flex-col items-end",children:[(0,n.jsxs)(s.E.nav,{layout:!0,animate:t?"open":"closed",variants:{open:{opacity:1,y:0,pointerEvents:"auto"},closed:{opacity:0,y:"100%",pointerEvents:"none"}},initial:"closed",className:"\n                bg-white shadow-md rounded-md mb-4 grid divide-y divide-black/5 w-[240px] overflow-hidden\n                transition-all\n            ",children:[(0,n.jsx)("div",{id:"plusMenu-inset",className:"fixed inset-0 z-30",onClick:()=>handleToggleMenu(!1)}),(0,n.jsx)(s.E.h2,{animate:t?{opacity:1}:{opacity:0},transition:{duration:.4,delay:.2},className:"px-4 py-2 font-bold",children:"Nieuwe declaratie"}),(0,n.jsxs)(s.E.button,{animate:t?{x:0,opacity:1}:{x:100,opacity:0},transition:{duration:.2},className:"z-50 p-4 text-right flex flex-row items-center gap-2 hover:bg-gray-100",onClick:()=>{m.current.click()},children:[(0,n.jsx)(i.MDG,{className:"w-5 h-5",strokeWidth:.1}),"Importeren",(0,n.jsx)("input",{type:"file",accept:"image/*",multiple:!0,hidden:!0,onChange:async e=>await handleFileInputChange(e),ref:m})]}),(0,n.jsxs)(s.E.button,{animate:t?{x:0,opacity:1}:{x:100,opacity:0},transition:{duration:.2,delay:.2},className:"p-4 text-right flex flex-row items-center gap-2 hover:bg-gray-100 z-50",onClick:handleCameraClick,children:[(0,n.jsx)(i.Er0,{className:"w-5 h-5",strokeWidth:.1}),"Scannen"]})]}),(0,n.jsx)(s.E.button,{layout:!0,animate:t?{rotate:45,backgroundColor:"#f6f6f6"}:{rotate:0},className:"w-16 h-16 bg-white shadow-md rounded-full flex items-center justify-center z-50",onClick:handleToggleMenu,children:(0,n.jsx)(l.B8K,{className:"w-8 h-8 opacity-75"})})]})}},1855:function(e,t,a){a.d(t,{Z:function(){return Card}});var n=a(5893),i=a(3750),l=a(9628),o=a(2081),s=a(7294);function Card(){let{onSwipeLeft:e,allowSwipeLeft:t,className:a,selected:r,deselectFn:c,children:d,borderLeft:u,borderColor:f,...p}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},[h,g]=(0,l.H)(),[m,x]=(0,s.useState)(!1);return(0,n.jsxs)(o.E.button,{layout:!0,ref:h,whileHover:{scale:1.01},className:"flex flex-row items-center gap-4 text-xs w-full",onBlur:()=>x(!1),...t&&{drag:"x",dragDirectionLock:!0,onDragEnd:(t,a)=>{let n=a.offset.x,i=a.velocity.x;(n<-200||i<-500)&&(setTimeout(()=>x(!0),200),e&&setTimeout(async()=>{let t=await e();t||x(!1)},500))},dragConstraints:{left:0,right:0},dragElastic:{left:.9,right:0}},...p,children:[r&&(0,n.jsx)(i.rfB,{className:"w-8 h-8 text-blue-500",onClick:()=>c&&c()}),(0,n.jsxs)("a",{className:"\n                    w-full p-4 gap-2 rounded-md bg-white focus:bg-black/5\n                    cursor-pointer ring-blue-500\n                    overflow-hidden relative flex justify-between text-left\n                    ".concat(r?"ring-2 shadow-md":"","\n                    ").concat(a,"\n                "),children:[u&&(0,n.jsx)("div",{className:"card-border-left absolute left-0 top-0 bottom-0 w-[4px] ".concat(null!=f?f:"bg-amber-400")}),d]}),m&&(0,n.jsx)("span",{className:"flex bg-red-600 rounded-md w-16 text-white h-full items-center justify-center p-2",children:(0,n.jsx)(i.yvY,{className:"text-white w-4 h-4"})})]})}},9543:function(e,t,a){a.d(t,{Z:function(){return NotificationsScreen}});var n=a(5893),i=a(3802),l=a(5935),o=a(7294),s=a(3750),r=a(8583),c=a(5122),d=a(8193);function NotificationsScreen(){let[e,t]=(0,r.KO)(c.Gd),[a,u]=(0,r.KO)(c.MX);(0,o.useEffect)(()=>{(0,i.TH)().then(e=>{t(e)})},[]);let notificationIcon=e=>{switch(e){case"warning":return(0,n.jsx)(s.o2K,{className:"text-red-500 w-10 h-10"});case"success":return(0,n.jsx)(s.IQF,{className:"w-10 h-10 text-green-500"});default:return null}};return a?(0,n.jsxs)("div",{className:"absolute inset-0 bg-gray-100 z-20 p-4 py-8 pt-16 text-sm",children:[(0,n.jsx)("div",{className:"flex flex-row justify-end w-full",children:(0,n.jsx)(d.oHP,{className:"bg-black/10 cursor-pointer rounded-full w-8 h-8 p-1 opacity-50",strokeWidth:1,onClick:()=>u(!1)})}),(0,n.jsx)("section",{className:"w-full flex flex-col space-y-2 mt-4",children:e.sort((e,t)=>t.timestamp-e.timestamp).map(e=>{var t;return(0,n.jsxs)("div",{className:"p-4 bg-white flex flex-row gap-4 rounded-lg shadow-xl shadow-gray-500/5",children:[notificationIcon(e.type),(0,n.jsx)("span",{className:"flex-1",children:(0,l.ZP)(null!==(t=e.message)&&void 0!==t?t:"")})]},JSON.stringify(e))})})]}):null}},3802:function(e,t,a){a.d(t,{Bb:function(){return updateDeclaration},JX:function(){return getDeclaration},QC:function(){return getDeclarationAttachments},TH:function(){return getNotifications},b7:function(){return getDeclarations},i0:function(){return createDeclaration},pi:function(){return deleteDeclaration}});var n=a(3977),i=a(9828),l=a(6650);let o=(0,n.ZF)({apiKey:"AIzaSyBpqgq3YLSKhra1bMfQRdSYQJi-MZzOzPM",authDomain:"declaration-of-prototype.firebaseapp.com",projectId:"declaration-of-prototype",storageBucket:"declaration-of-prototype.appspot.com",messagingSenderId:"514470074938",appId:"1:514470074938:web:93348a7f5067b6fe9ab303"}),s=(0,i.ad)(o),r=(0,l.cF)(o,"gs://declaration-of-prototype.appspot.com"),c=(0,i.hJ)(s,"declarations"),getDeclarations=async()=>{let e=await (0,i.PL)(c),t=[];return e.forEach(e=>{t.push({...e.data(),id:e.id})}),t},getDeclaration=async e=>{var t;let a=(0,i.JU)(s,"declarations",e),n=await (0,i.QT)(a),o=[];for(let a=0;a<(null===(t=n.data())||void 0===t?void 0:t.attachments);a++){let t=(0,l.iH)(r,"".concat(e,"/").concat(a)),n=await (0,l.Jt)(t);o.push(n)}return{...n.data(),id:n.id,attachments:o}},createDeclaration=async e=>{var t,a;console.log("creating new declaration",e);let n=await (0,i.ET)((0,i.hJ)(s,"declarations"),{...e,attachments:null==e?void 0:null===(t=e.attachments)||void 0===t?void 0:t.length}),o=n.id,c=[];for(let t=0;t<(null==e?void 0:null===(a=e.attachments)||void 0===a?void 0:a.length);t++){let a=null==e?void 0:e.attachments[t],n=(0,l.iH)(r,"".concat(o,"/").concat(t)),i=(0,l.sf)(n,a,"data_url");c.push(i)}await Promise.all(c)},deleteDeclaration=async e=>{await (0,i.oe)((0,i.JU)(s,"declarations",e))},updateDeclaration=async(e,t)=>{var a;await (0,i.r7)((0,i.JU)(s,"declarations",e),{...t,attachments:null==t?void 0:null===(a=t.attachments)||void 0===a?void 0:a.length})},getDeclarationAttachments=async(e,t)=>{let a=[];for(let n=0;n<t;n++){let t=(0,l.iH)(r,"".concat(e,"/").concat(n)),i=await (0,l.Jt)(t);null==a||a.push(i)}return a},d=(0,i.hJ)(s,"notifications"),getNotifications=async()=>{let e=await (0,i.PL)(d),t=[];return e.forEach(e=>{t.push({...e.data(),id:e.id})}),t}}}]);