"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[890],{7890:function(t,n,o){o.r(n),o.d(n,{pwa_camera_modal_instance:function(){return r}});var i=o(9644),__awaiter=function(t,n,o,i){return new(o||(o=Promise))(function(r,h){function a(t){try{s(i.next(t))}catch(t){h(t)}}function c(t){try{s(i.throw(t))}catch(t){h(t)}}function s(t){var n;t.done?r(t.value):((n=t.value)instanceof o?n:new o(function(t){t(n)})).then(a,c)}s((i=i.apply(t,n||[])).next())})},__generator=function(t,n){var o,i,r,h,l={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return h={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(h[Symbol.iterator]=function(){return this}),h;function c(u){return function(f){return function(u){if(o)throw TypeError("Generator is already executing.");for(;h&&(h=0,u[0]&&(l=0)),l;)try{if(o=1,i&&(r=2&u[0]?i.return:u[0]?i.throw||((r=i.return)&&r.call(i),0):i.next)&&!(r=r.call(i,u[1])).done)return r;switch(i=0,r&&(u=[2&u[0],r.value]),u[0]){case 0:case 1:r=u;break;case 4:return l.label++,{value:u[1],done:!1};case 5:l.label++,i=u[1],u=[0];continue;case 7:u=l.ops.pop(),l.trys.pop();continue;default:if(!(r=(r=l.trys).length>0&&r[r.length-1])&&(6===u[0]||2===u[0])){l=0;continue}if(3===u[0]&&(!r||u[1]>r[0]&&u[1]<r[3])){l.label=u[1];break}if(6===u[0]&&l.label<r[1]){l.label=r[1],r=u;break}if(r&&l.label<r[2]){l.label=r[2],l.ops.push(u);break}r[2]&&l.ops.pop(),l.trys.pop();continue}u=n.call(t,l)}catch(t){u=[6,t],i=0}finally{o=r=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,f])}}},r=function(){function e(t){var n=this;(0,i.r)(this,t),this.onPhoto=(0,i.c)(this,"onPhoto",7),this.noDeviceError=(0,i.c)(this,"noDeviceError",7),this.handlePhoto=function(t){return __awaiter(n,void 0,void 0,function(){return __generator(this,function(n){return this.onPhoto.emit(t),[2]})})},this.handleNoDeviceError=function(t){return __awaiter(n,void 0,void 0,function(){return __generator(this,function(n){return this.noDeviceError.emit(t),[2]})})},this.facingMode="user",this.noDevicesText="No camera found",this.noDevicesButtonText="Choose image"}return e.prototype.handleBackdropClick=function(t){t.target!==this.el&&this.onPhoto.emit(null)},e.prototype.handleComponentClick=function(t){t.stopPropagation()},e.prototype.handleBackdropKeyUp=function(t){"Escape"===t.key&&this.onPhoto.emit(null)},e.prototype.render=function(){var t=this;return(0,i.h)("div",{class:"wrapper",onClick:function(n){return t.handleBackdropClick(n)}},(0,i.h)("div",{class:"content"},(0,i.h)("pwa-camera",{onClick:function(n){return t.handleComponentClick(n)},facingMode:this.facingMode,handlePhoto:this.handlePhoto,handleNoDeviceError:this.handleNoDeviceError,noDevicesButtonText:this.noDevicesButtonText,noDevicesText:this.noDevicesText})))},Object.defineProperty(e.prototype,"el",{get:function(){return(0,i.g)(this)},enumerable:!1,configurable:!0}),e}();r.style=":host{z-index:1000;position:fixed;top:0;left:0;width:100%;height:100%;display:-ms-flexbox;display:flex;contain:strict;--inset-width:600px;--inset-height:600px}.wrapper{-ms-flex:1;flex:1;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background-color:rgba(0, 0, 0, 0.15)}.content{-webkit-box-shadow:0px 0px 5px rgba(0, 0, 0, 0.2);box-shadow:0px 0px 5px rgba(0, 0, 0, 0.2);width:var(--inset-width);height:var(--inset-height);max-height:100%}@media only screen and (max-width: 600px){.content{width:100%;height:100%}}"}}]);