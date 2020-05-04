(function(e){function t(t){for(var r,o,n=t[0],c=t[1],l=t[2],h=0,d=[];h<n.length;h++)o=n[h],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&d.push(a[o][0]),a[o]=0;for(r in c)Object.prototype.hasOwnProperty.call(c,r)&&(e[r]=c[r]);u&&u(t);while(d.length)d.shift()();return i.push.apply(i,l||[]),s()}function s(){for(var e,t=0;t<i.length;t++){for(var s=i[t],r=!0,n=1;n<s.length;n++){var c=s[n];0!==a[c]&&(r=!1)}r&&(i.splice(t--,1),e=o(o.s=s[0]))}return e}var r={},a={app:0},i=[];function o(t){if(r[t])return r[t].exports;var s=r[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,o),s.l=!0,s.exports}o.m=e,o.c=r,o.d=function(e,t,s){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(o.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(s,r,function(t){return e[t]}.bind(null,r));return s},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="";var n=window["webpackJsonp"]=window["webpackJsonp"]||[],c=n.push.bind(n);n.push=t,n=n.slice();for(var l=0;l<n.length;l++)t(n[l]);var u=c;i.push([0,"chunk-vendors"]),s()})({0:function(e,t,s){e.exports=s("56d7")},1:function(e,t){},1862:function(e,t,s){},2:function(e,t){},"56d7":function(e,t,s){"use strict";s.r(t);var r=s("2b0e"),a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"app"}},[s("router-view")],1)},i=[];class o{constructor(e,t){this.config=e,this.ebus=t,this.isAuth=!1,this.isAuthError=!1,this.isOffline=!1,this.ws=null,this.registration=this.ebus.$registration,this.applicationServerKey="",this.connect(),this.ebus.$on("refreshConfig",e=>{this.isAuthError=!1,this.config=e,this.connect()}),this.ebus.$on("offline",()=>{this.isOffline=!0}),setInterval(()=>{this.send({cmd:"PING"})},3e4)}connect(){if(this.config.url&&this.config.name&&!this.isAuthError&&!this.isOffline)try{if(this.ws)try{this.ws.onclose=null,this.ws.close()}catch(e){}this.ws=new WebSocket(this.config.url),this.ws.onopen=()=>{this.ws.send(JSON.stringify({cmd:"AUTH",data:{token:this.config.token,name:this.config.name,group:this.config.group}}))},this.ws.onclose=()=>{setTimeout(()=>{this.connect()},this.config.retryWait||3e3)},this.ws.onerror=()=>{this.toast("error","websocket连接失败")},this.ws.onmessage=this.onmessage.bind(this)}catch(e){this.toast("error",`websocket连接出错:${e.message}`)}}onmessage(e){const t=this.decodePacket(e.data);switch(t.cmd){case"AUTH":200===t.data.code?(this.isAuth=!0,localStorage.setItem("auth",t.data.auth),this.applicationServerKey=t.data.fcmServerKey,this.toast("success","websocket连接成功"),this.registerFCM()):(this.isAuthError=!0,this.toast("error",t.data.msg));break;case"MESSAGE":this.send({cmd:"MESSAGE_CALLBACK",data:{mid:t.data.mid}});break;case"INFO":this.toast("info",t.data)}this.ebus.$emit(t.cmd,t.data)}decodePacket(e){return JSON.parse(e)}encodePacket(e){return JSON.stringify(e)}send(e){this.ws.send(this.encodePacket(e))}toast(e,t){this.ebus.$Toast.show({type:e,text:t})}async registerFCM(){try{if(null==window.PushManager||null==navigator.serviceWorker)return void this.toast("error",`当前浏览器不支持消息通知:${typeof window.PushManager} ${typeof navigator.serviceWorker}`);let e=await this.registration.pushManager.getSubscription();if(this.config.fcm){if(e){let t=c(e.options.applicationServerKey),s=this.applicationServerKey.replace(/-/g,"+").replace(/_/g,"/")+"=";if(t===s)return;this.toast("info","重新注册FCM"),e&&await e.unsubscribe()}const t=await this.registration.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:n(this.applicationServerKey)});this.send({cmd:"REGISTER_FCM",data:t})}else e&&e.unsubscribe()}catch(e){this.toast("error",`注册FCM出错: ${e}`),console.log(e)}}}function n(e){let t="=".repeat((4-e.length%4)%4);const s=(e+t).replace(/-/g,"+").replace(/_/g,"/");let r=atob(s),a=new Uint8Array(r.length);for(let i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a}function c(e){return btoa(String.fromCharCode.apply(null,new Uint8Array(e)))}var l={name:"App",methods:{createMpushClient(){new o({url:localStorage.getItem("url")||"",token:localStorage.getItem("token")||"",name:localStorage.getItem("name")||"",group:localStorage.getItem("group")||"",fcm:"true"===localStorage.getItem("fcm")},this.$ebus)}},async created(){const e=[];this.$messagesdb.createReadStream().on("data",t=>{e.push(t.value)}).on("end",()=>{this.$store.commit({type:"initMessages",messages:e.reverse()}),this.createMpushClient()}),this.$ebus.$on("MESSAGE",e=>{(!this.$store.state.messages[0]||this.$store.state.messages[0]&&e.mid!==this.$store.state.messages[0].mid)&&(this.$messagesdb.put(e.mid,e),this.$store.commit({type:"putMessage",message:e}))}),this.$ebus.$on("worker-set-data",e=>{navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({cmd:"set-data",data:e})})}},u=l,h=(s("5c0b"),s("2877")),d=Object(h["a"])(u,a,i,!1,null,null,null),f=d.exports,g=s("9483");function m(e){Object(g["a"])("service-worker.js",{ready(e){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered(t){e.$emit("swregistered",t),console.log("Service worker has been registered.")},cached(){console.log("Content has been cached for offline use.")},updatefound(){console.log("New content is downloading.")},updated(){e.$Toast.show({type:"info",text:"Page is updated; please refresh."})},offline(){e.$emit("offline"),e.$Toast.show({type:"warning",text:"No internet connection found."})},error(e){console.error("Error during service worker registration:",e)}})}var p=s("8c4f"),b=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"home"},[s("div",{staticClass:"nav"},[s("zi-input",{staticClass:"search",attrs:{clearable:"",placeholder:"search"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}},[s("searchIcon",{attrs:{slot:"prefixIcon"},slot:"prefixIcon"})],1),s("router-link",{attrs:{to:"settings"}},[s("settings",{staticClass:"setting"})],1)],1),s("zi-collapse",{staticClass:"list",attrs:{accordion:!0},model:{value:e.expend,callback:function(t){e.expend=t},expression:"expend"}},e._l(e.showList,(function(t){return s("zi-collapse-item",{key:t.mid,attrs:{name:t.mid,title:t.message.text||e.date(Number(t.mid))}},[s("div",{staticClass:"desp"},[s("div",{staticClass:"markdown-body",domProps:{innerHTML:e._s(e.markdown(t.message.desp))}}),s("zi-row",{staticClass:"footer"},[s("div",{staticClass:"handle"},[s("copy",{on:{click:function(s){return e.copyHandle(t.message)}}}),t.message.extra.scheme?s("a",{attrs:{target:"_blank",href:t.message.extra.scheme}},[s("linkIcon")],1):e._e(),s("zi-tooltip",[s("alertCircle",{attrs:{Click:"",Trigger:""}}),s("div",{staticStyle:{"text-align":"left"},attrs:{slot:"content"},slot:"content"},[s("p",[e._v("from: "+e._s(t.from.method)+" "+e._s(t.from.name))]),s("p",[e._v("target: "+e._s("personal"===t.sendType?"":"Group ")+e._s(t.target))])])],1),s("trash",{on:{click:function(s){return e.trash(t)}}})],1),s("h6",{staticClass:"info"},[e._v(e._s(e._f("date")(Number(t.mid))))])])],1)])})),1),s("zi-dialog",{attrs:{title:e.dialogTitle,beforeDone:e.dialogDone,done:"确认",cancel:"取消"},model:{value:e.dialogVisible,callback:function(t){e.dialogVisible=t},expression:"dialogVisible"}})],1)},v=[],w=s("173a"),y=s("9ef9"),k=s("899b"),S=s("cc4f"),$=s("184d"),x=s("ef13"),C={name:"Home",components:{searchIcon:w["a"],settings:y["a"],copy:k["a"],linkIcon:S["a"],alertCircle:$["a"],trash:x["a"]},data(){return{expend:"",dialogVisible:!1,dialogTitle:"",dialogDone:()=>{},search:""}},computed:{messageList(){return this.$store.state.messages},showList(){return this.search?this.messageList.filter(e=>e.message.text.indexOf(this.search)>-1||e.message.desp.indexOf(this.search)>-1):this.messageList}},methods:{markdown(e){return this.$options.filters.markdown(e)},date(e){return this.$options.filters.date(e)},copyHandle(e){if(e.desp){let t=document.createElement("textarea");t.value=e.desp,document.body.appendChild(t),t.select(),document.execCommand("copy"),this.$Toast.show({type:"success",text:"复制成功"}),document.body.removeChild(t)}else this.$Toast.show({type:"error",text:"复制失败,内容为空"})},trash(e){this.comfirm("确认要删除?",()=>{this.$store.commit({type:"deleteMessage",message:e}),this.$messagesdb.del(e.mid)})},comfirm(e,t){this.dialogTitle=e,this.dialogVisible=!0,this.dialogDone=()=>{this.dialogVisible=!1,t()}}}},M=C,_=(s("c214"),Object(h["a"])(M,b,v,!1,null,"02d5ce9c",null)),O=_.exports,I=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"settings"},[s("div",{staticClass:"nav"},[s("router-link",{attrs:{to:"/"}},[s("arrowLeft",{staticClass:"arrowLeft"})],1)],1),s("div",{staticClass:"handles"},[s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{"prefix-label":"WebsocketURL"},model:{value:e.url,callback:function(t){e.url=t},expression:"url"}})],1),s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{"prefix-label":"Token"},model:{value:e.token,callback:function(t){e.token=t},expression:"token"}})],1),s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{"prefix-label":"Name"},model:{value:e.name,callback:function(t){e.name=t},expression:"name"}})],1),s("zi-row",[s("zi-input",{staticClass:"input-handle",attrs:{"prefix-label":"Group"},model:{value:e.group,callback:function(t){e.group=t},expression:"group"}})],1),s("zi-row",[e._v(" FCM推送 "),s("zi-toggle",{model:{value:e.fcm,callback:function(t){e.fcm=t},expression:"fcm"}})],1),s("zi-button",{staticClass:"save",attrs:{shadow:"",type:"success"},on:{click:function(t){return e.save()}}},[e._v("应用")])],1)])},T=[],A=s("fae9"),z={name:"Settings",components:{arrowLeft:A["a"]},data(){return{url:"",token:"",name:"",group:"",fcm:!1,httpurl:""}},methods:{save(){this.url&&this.name?(localStorage.setItem("url",this.url),localStorage.setItem("token",this.token),localStorage.setItem("name",this.name),localStorage.setItem("group",this.group),localStorage.setItem("fcm",this.fcm?"true":"false"),localStorage.setItem("httpurl",this.httpurl),this.$Toast.show({type:"success",text:"保存成功"}),this.$ebus.$emit("refreshConfig",{url:this.url,token:this.token,name:this.name,group:this.group,fcm:this.fcm,httpurl:this.httpurl})):this.$Toast.show({type:"error",text:`[${this.url?"name":"url"}]不能为空`})}},created(){this.url=localStorage.getItem("url")||"",this.token=localStorage.getItem("token")||"",this.name=localStorage.getItem("name")||"",this.group=localStorage.getItem("group")||"",this.fcm="true"===localStorage.getItem("fcm")}},E=z,P=(s("595d"),Object(h["a"])(E,I,T,!1,null,"6af45f04",null)),j=P.exports;r["default"].use(p["a"]);const H=[{path:"/",name:"Home",component:O},{path:"/settings",name:"Settings",component:j}],L=new p["a"]({routes:H});var F=L,N=s("2f62");r["default"].use(N["a"]);var K=new N["a"].Store({state:{messages:[]},mutations:{initMessages(e,t){this.state.messages=t.messages},putMessage(e,t){this.state.messages.unshift(t.message)},deleteMessage(e,t){this.state.messages.splice(this.state.messages.indexOf(t.message),1)}},actions:{},modules:{}}),W=s("5353"),G=s.n(W),V=s("46fd"),D=s.n(V),J=s("ddc3"),R=s.n(J),U=s("e0c1"),B=s.n(U);s("e4cb");const q=new B.a.Renderer;function Y(e,t){let s=new Date(e),r=function(e){return(e<10?"0":"")+e};return t.replace(/yyyy|MM|dd|HH|mm|ss/g,(function(e){switch(e){case"yyyy":return r(s.getFullYear());case"MM":return r(s.getMonth()+1);case"mm":return r(s.getMinutes());case"dd":return r(s.getDate());case"HH":return r(s.getHours());case"ss":return r(s.getSeconds())}}))}q.link=function(e,t,s){return`<a title="${t}" target="_blank" href="${e}">${s}</a>`},B.a.setOptions({gfm:!0,tables:!0,breaks:!0,sanitize:!0,smartLists:!0,smartypants:!0}),r["default"].filter("markdown",(function(e){return B()(e)})),r["default"].filter("date",(function(e){return Y(e,"yyyy-MM-dd HH:mm:ss")}));var Q=s("f64e"),X=s.n(Q),Z=(s("f8c4"),s("34ec"),s("7980"),s("05f7"));r["default"].use(X.a),Object(Z["a"])(r["default"]);const ee=new r["default"];r["default"].config.productionTip=!1,r["default"].prototype.$ebus=ee,r["default"].prototype.$messagesdb=G()(D()(R()("messages",{prefix:""}),{valueEncoding:"json"})),null==window.PushManager||null==navigator.serviceWorker?new r["default"]({router:F,store:K,render:function(e){return e(f)}}).$mount("#app"):(ee.$on("swregistered",e=>{r["default"].prototype.$registration=e,new r["default"]({router:F,store:K,render:function(e){return e(f)}}).$mount("#app")}),m(ee))},5869:function(e,t,s){},"595d":function(e,t,s){"use strict";var r=s("1862"),a=s.n(r);a.a},"5c0b":function(e,t,s){"use strict";var r=s("9c0c"),a=s.n(r);a.a},"9c0c":function(e,t,s){},c214:function(e,t,s){"use strict";var r=s("5869"),a=s.n(r);a.a}});