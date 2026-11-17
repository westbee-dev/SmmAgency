(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function o(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=o(r);fetch(r.href,s)}})();const b={Manager:0,Admin:1},y={NoCampaigns:0,InProgress:1,Completed:2},m={NoAnswer:0,Agreed:1,Disagreed:2,Posted:3},C="smm_auth_token",P={[y.NoCampaigns]:{label:"Нет кампаний",className:"text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 shadow-2xs",dotColor:"bg-slate-400 dark:bg-slate-500"},[y.InProgress]:{label:"В процессе",className:"text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 border-blue-200/80 dark:border-blue-800/70 shadow-2xs",dotColor:"bg-blue-600 dark:bg-blue-400"},[y.Completed]:{label:"Завершена",className:"text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/70 shadow-2xs",dotColor:"bg-emerald-600 dark:bg-emerald-400"}},D={[m.NoAnswer]:{label:"Нет ответа",className:"text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 shadow-2xs",dotColor:"bg-slate-400 dark:bg-slate-500"},[m.Agreed]:{label:"Согласен",className:"text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/70 shadow-2xs",dotColor:"bg-amber-600 dark:bg-amber-400"},[m.Disagreed]:{label:"Отказ",className:"text-rose-700 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-800/70 shadow-2xs",dotColor:"bg-rose-600 dark:bg-rose-400"},[m.Posted]:{label:"Опубликовал",className:"text-purple-700 dark:text-purple-300 bg-purple-50/80 dark:bg-purple-950/50 border-purple-200/80 dark:border-purple-800/70 shadow-2xs",dotColor:"bg-purple-600 dark:bg-purple-400"}};function _(e){if(!e||typeof e!="string")return null;try{const t=e.split(".");if(t.length!==3)return null;const n=t[1].replace(/-/g,"+").replace(/_/g,"/"),r=decodeURIComponent(atob(n).split("").map(h=>"%"+("00"+h.charCodeAt(0).toString(16)).slice(-2)).join("")),s=JSON.parse(r),a=s["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]||s.unique_name||s.name||s.sub||"Пользователь",l=s["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]??s.role;let i=b.Manager;return l==="Admin"||l===1||l==="1"?i=b.Admin:(l==="Manager"||l===0||l==="0")&&(i=b.Manager),{login:a,role:i,exp:s.exp,raw:s}}catch(t){return console.error("Failed to parse JWT token:",t),null}}function q(e){const t=_(e);return!t||!t.exp?!0:t.exp*1e3<=Date.now()}const N={building2:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>`,users:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>`,video:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11"/>
      <rect x="2" y="6" width="14" height="12" rx="2"/>
    </svg>`,barChart2:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <line x1="18" x2="18" y1="20" y2="10"/>
      <line x1="12" x2="12" y1="20" y2="4"/>
      <line x1="6" x2="6" y1="20" y2="14"/>
    </svg>`,userPlus:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" x2="19" y1="8" y2="14"/>
      <line x1="22" x2="16" y1="11" y2="11"/>
    </svg>`,logout:(e=15,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>`,plus:(e=15,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M5 12h14"/>
      <path d="M12 5v14"/>
    </svg>`,edit2:(e=14,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
      <path d="m15 5 4 4"/>
    </svg>`,trash2:(e=14,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" x2="10" y1="11" y2="17"/>
      <line x1="14" x2="14" y1="11" y2="17"/>
    </svg>`,externalLink:(e=12,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M15 3h6v6"/>
      <path d="M10 14 21 3"/>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    </svg>`,shieldAlert:(e=14,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
      <path d="M12 8v4"/>
      <path d="M12 16h.01"/>
    </svg>`,sparkles:(e=14,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>`,alertCircle:(e=15,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" x2="12" y1="8" y2="12"/>
      <line x1="12" x2="12.01" y1="16" y2="16"/>
    </svg>`,alertTriangle:(e=20,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" x2="12" y1="9" y2="13"/>
      <line x1="12" x2="12.01" y1="17" y2="17"/>
    </svg>`,checkCircle2:(e=17,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <circle cx="12" cy="12" r="10"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>`,info:(e=17,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" x2="12" y1="16" y2="12"/>
      <line x1="12" x2="12.01" y1="8" y2="8"/>
    </svg>`,x:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </svg>`,chevronLeft:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="m15 18-6-6 6-6"/>
    </svg>`,chevronRight:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="m9 18 6-6-6-6"/>
    </svg>`,bookOpen:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>`,calculator:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <rect width="16" height="20" x="4" y="2" rx="2"/>
      <line x1="8" x2="16" y1="6" y2="6"/>
      <line x1="16" x2="16" y1="14" y2="18"/>
      <path d="M16 10h.01"/>
      <path d="M12 10h.01"/>
      <path d="M8 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M8 14h.01"/>
      <path d="M12 18h.01"/>
      <path d="M8 18h.01"/>
    </svg>`,zap:(e=16,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>`,copy:(e=14,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
    </svg>`,check:(e=14,t="")=>`
    <svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
      <polyline points="20 6 9 17 4 12"/>
    </svg>`};function p(e,t=16,o=""){const n=N[e];return n?n(t,o):""}let u=null;function L(){return(!u||!document.body.contains(u))&&(u=document.getElementById("toast-container"),u||(u=document.createElement("div"),u.id="toast-container",u.className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none",document.body.appendChild(u))),u}function x(e,t="info"){const o=L(),n={success:{cardStyle:"bg-white/95 border-emerald-200 text-emerald-950 shadow-[0_8px_24px_rgba(16,185,129,0.08)]",icon:p("checkCircle2",17,"text-emerald-600 shrink-0")},error:{cardStyle:"bg-white/95 border-rose-200 text-rose-950 shadow-[0_8px_24px_rgba(244,63,94,0.08)]",icon:p("alertCircle",17,"text-rose-600 shrink-0")},warning:{cardStyle:"bg-white/95 border-amber-200 text-amber-950 shadow-[0_8px_24px_rgba(245,158,11,0.08)]",icon:p("alertTriangle",17,"text-amber-600 shrink-0")},info:{cardStyle:"bg-white/95 border-indigo-200 text-indigo-950 shadow-[0_8px_24px_rgba(99,102,241,0.08)]",icon:p("info",17,"text-indigo-600 shrink-0")}},r=n[t]||n.info,s=document.createElement("div");s.className=`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 opacity-0 translate-y-2 ${r.cardStyle}`,s.innerHTML=`
    <div class="pt-0.5">${r.icon}</div>
    <p class="text-xs font-medium flex-1 pt-0.5 leading-relaxed">${B(e)}</p>
    <button type="button" class="text-slate-400 hover:text-slate-700 p-0.5 rounded-lg transition-colors" title="Закрыть">
      ${p("x",14)}
    </button>
  `;const a=s.querySelector("button"),l=()=>{s.classList.add("opacity-0","-translate-y-2"),setTimeout(()=>{s.parentNode&&s.parentNode.removeChild(s)},200)};a==null||a.addEventListener("click",l),o.appendChild(s),requestAnimationFrame(()=>{s.classList.remove("opacity-0","translate-y-2")}),setTimeout(l,4e3)}function B(e){const t=document.createElement("div");return t.textContent=e||"",t.innerHTML}class d extends Error{constructor(t,o,n=null,r=!1){super(o),this.name="ApiError",this.status=t,this.fieldErrors=n,this.isNetworkError=r}}async function j(){try{const e=new AbortController,t=setTimeout(()=>e.abort(),6e3),o=await fetch("/api/health",{method:"GET",signal:e.signal});return clearTimeout(t),o.ok?{online:!0,database:(await o.json().catch(()=>({}))).database==="Connected"?"connected":"disconnected",status:o.status}:o.status===503?{online:!0,database:"disconnected",status:503}:o.status===502||o.status===504?{online:!1,database:"unreachable",status:o.status}:{online:o.status<500,database:"unknown",status:o.status}}catch(e){return{online:!1,database:"unreachable",error:e}}}async function f(e){let t="";try{t=await e.text()}catch{}let o=null;if(t)try{o=JSON.parse(t)}catch{o=t}let n="",r=null;if(typeof o=="string")o.includes("<html")||o.includes("<!DOCTYPE")||o.includes("502 Bad Gateway")||o.includes("504 Gateway")?n="Сервер бэкенда недоступен (Bad Gateway). Проверьте запуск Docker-образа или сервера на порту 5000.":n=o;else if(o&&typeof o=="object"){if(r=o.errors||null,n=o.detail||o.message||"",!n&&r&&typeof r=="object"){const s=Object.values(r).flatMap(a=>Array.isArray(a)?a:[a]).filter(Boolean);s.length>0&&(n=s.join(". "))}n||(n=o.title||"")}return{message:n||`Ошибка HTTP ${e.status}`,fieldErrors:r}}async function k(e,t={}){const o=localStorage.getItem(C),n=new Headers(t.headers||{});!n.has("Content-Type")&&t.body&&!(t.body instanceof FormData)&&n.set("Content-Type","application/json"),o&&n.set("Authorization",`Bearer ${o}`);let r=null;try{r=await fetch(e,{...t,headers:n})}catch(a){throw console.error("Network connection error:",a),new d(0,"Сервер бэкенда недоступен. Проверьте, запущен ли Docker-образ или бэкенд на http://localhost:5000.",null,!0)}if(r.status===502||r.status===503||r.status===504)throw new d(r.status,`Сервер бэкенда недоступен (${r.status} Bad Gateway). Убедитесь, что запущен Docker-контейнер backend или сервер на порту 5000.`,null,!0);if(r.status===500){const a=r.clone();try{const l=await a.text();if(l.includes("ECONNREFUSED")||l.includes("Proxy error")||l.includes("connect error"))throw new d(500,"Сервер бэкенда недоступен (ECONNREFUSED). Проверьте, запущен ли Docker-образ или локальный сервер на порту 5000.",null,!0)}catch(l){if(l instanceof d)throw l}}if(r.status===204)return{};if(r.status===401){const a=e.toLowerCase();if(a.includes("/authorization")||a.includes("/users/authorization")){const{message:l}=await f(r);throw new d(401,l||"Неверный логин или пароль")}throw localStorage.removeItem(C),x("Сессия недействительна. Авторизуйтесь снова","error"),setTimeout(()=>{window.location.href="/index.html"},1e3),new d(401,"Требуется авторизация")}if(r.status===403)throw x("Недостаточно прав (требуется роль Admin)","error"),new d(403,"Доступ запрещен");if(r.status===400||r.status===409||r.status===422){const{message:a,fieldErrors:l}=await f(r);throw new d(r.status,a,l)}if(r.status===404){const{message:a}=await f(r),l=a&&!a.includes("404")?a:"Запрошенный ресурс не найден";throw x(l,"error"),new d(404,l)}if(r.status>=500){const{message:a}=await f(r);throw x(`Ошибка сервера: ${a}`,"error"),new d(r.status,a)}if(!r.ok)throw new d(r.status,`HTTP Error ${r.status}`);const s=r.headers.get("content-type");return s&&s.includes("application/json")?await r.json():await r.text()}const H={get:e=>k(e,{method:"GET"}),post:(e,t)=>k(e,{method:"POST",body:t!==void 0?JSON.stringify(t):void 0}),put:(e,t)=>k(e,{method:"PUT",body:t!==void 0?JSON.stringify(t):void 0}),delete:e=>k(e,{method:"DELETE"})};let M=!1;function G(e={}){const{autoPoll:t=!0,pollIntervalMs:o=25e3,onStatusChange:n=null}=e;let r=document.getElementById("server-status-pill");r||(r=document.createElement("div"),r.id="server-status-pill",r.className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#131824]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] text-xs transition-all duration-300 select-none group hover:shadow-[0_8px_30px_rgb(0,0,0,0.14)]",r.innerHTML=`
      <div class="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
        <span
          id="status-dot-red"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300 dark:bg-slate-600"
          title="Красный — Сервер недоступен / Ошибка"
        ></span>
        <span
          id="status-dot-blue"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300 dark:bg-slate-600"
          title="Синий — Проверка соединения"
        ></span>
        <span
          id="status-dot-green"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300 dark:bg-slate-600"
          title="Зелёный — Сервер подключен и активен"
        ></span>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Сервер:</span>
          <span id="server-status-text" class="text-xs font-semibold text-slate-700 dark:text-slate-200 font-display">
            Проверка...
          </span>
        </div>
      </div>
      <button
        type="button"
        id="btn-recheck-server"
        class="p-1 -mr-1 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
        title="Обновить состояние сервера"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="status-refresh-icon"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
      </button>
    `,document.body.appendChild(r));const s=r.querySelector("#status-dot-red"),a=r.querySelector("#status-dot-blue"),l=r.querySelector("#status-dot-green"),i=r.querySelector("#server-status-text"),h=r.querySelector("#btn-recheck-server"),g=r.querySelector(".status-refresh-icon");function T(){s&&(s.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300"),l&&(l.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300"),a&&(a.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-100 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)] animate-pulse"),i&&(i.textContent="Опрос...",i.className="text-xs font-semibold text-blue-600 font-display"),g&&g.classList.add("animate-spin")}function $(){s&&(s.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300"),a&&(a.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300"),l&&(l.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-100 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]"),i&&(i.textContent="В сети",i.className="text-xs font-semibold text-emerald-600 font-display"),g&&g.classList.remove("animate-spin")}function v(c="Нет связи"){a&&(a.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300"),l&&(l.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300"),s&&(s.className="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-100 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-pulse"),i&&(i.textContent=c,i.className="text-xs font-semibold text-rose-600 font-display"),g&&g.classList.remove("animate-spin")}async function w(){T();const c=await j();return c.online&&c.database==="connected"?$():c.online&&c.database==="disconnected"?v("БД офлайн"):v("Сервер офлайн"),typeof n=="function"&&n(c),c}return h&&!h._hasStatusListener&&(h._hasStatusListener=!0,h.addEventListener("click",c=>{c.stopPropagation(),w()})),w(),t&&!M&&(M=!0,setInterval(()=>{w()},o)),{updateStatus:w,setConnectedState:$,setDisconnectedState:v}}const S="smm_theme";function A(){const e=localStorage.getItem(S);return e==="dark"||e==="light"?e:window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function E(e){e==="dark"?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),localStorage.setItem(S,e),O(e)}function I(){const t=(document.documentElement.classList.contains("dark")?"dark":"light")==="dark"?"light":"dark";return E(t),t}function O(e){const t=e==="dark";document.querySelectorAll("[data-theme-toggle]").forEach(o=>{o.title=t?"Переключить на светлую тему":"Переключить на тёмную тему",o.setAttribute("aria-label",t?"Переключить на светлую тему":"Переключить на тёмную тему");const n=o.querySelector("[data-theme-text]"),r=o.querySelector("[data-theme-dot]"),s=o.querySelector("[data-theme-sun]"),a=o.querySelector("[data-theme-moon]");n&&(n.textContent=t?"Dark mode":"Light mode"),r&&(t?(r.classList.remove("translate-x-0"),r.classList.add("translate-x-3")):(r.classList.remove("translate-x-3"),r.classList.add("translate-x-0"))),s&&a&&(t?(s.classList.add("hidden"),a.classList.remove("hidden")):(s.classList.remove("hidden"),a.classList.add("hidden")))})}function U(){const e=A();E(e),document.querySelectorAll("[data-theme-toggle]").forEach(t=>{t._hasThemeListener||(t._hasThemeListener=!0,t.addEventListener("click",o=>{o.preventDefault(),I()}))})}export{d as A,y as B,C as T,b as U,H as a,U as b,G as c,D as d,P as e,q as i,_ as p,p as r,x as s};
