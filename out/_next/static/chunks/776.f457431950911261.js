"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[776],{9776:function(t,e,i){i.r(e),i.d(e,{HapticsWeb:function(){return HapticsWeb}});var a=i(9895),r=i(8681);let HapticsWeb=class HapticsWeb extends a.Uw{constructor(){super(...arguments),this.selectionStarted=!1}async impact(t){let e=this.patternForImpact(null==t?void 0:t.style);this.vibrateWithPattern(e)}async notification(t){let e=this.patternForNotification(null==t?void 0:t.type);this.vibrateWithPattern(e)}async vibrate(t){let e=(null==t?void 0:t.duration)||300;this.vibrateWithPattern([e])}async selectionStart(){this.selectionStarted=!0}async selectionChanged(){this.selectionStarted&&this.vibrateWithPattern([70])}async selectionEnd(){this.selectionStarted=!1}patternForImpact(t=r.y$.Heavy){return t===r.y$.Medium?[43]:t===r.y$.Light?[20]:[61]}patternForNotification(t=r.k$.Success){return t===r.k$.Warning?[30,40,30,50,60]:t===r.k$.Error?[27,45,50]:[35,65,21]}vibrateWithPattern(t){if(navigator.vibrate)navigator.vibrate(t);else throw this.unavailable("Browser does not support the vibrate API")}}}}]);