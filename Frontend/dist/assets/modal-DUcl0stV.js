import{r as x,d as y,e as h}from"./theme-DasQTWpP.js";function b(e){if(e==null)return"";const t=document.createElement("div");return t.textContent=String(e),t.innerHTML}function g(e){return typeof e!="number"||isNaN(e)?"0":new Intl.NumberFormat("ru-RU").format(e)}function L(e){return typeof e!="number"||isNaN(e)?"0%":`${e.toFixed(1)}%`}function $(e){if(!e)return"—";try{const t=new Date(e);return isNaN(t.getTime())?e:new Intl.DateTimeFormat("ru-RU",{day:"numeric",month:"short",year:"numeric"}).format(t)}catch{return e}}function _(e,t){const a=e==="business"?h[t]:y[t];return a?`
    <span class="inline-flex items-center gap-1.5 font-medium rounded-lg backdrop-blur-md border whitespace-nowrap transition-all px-2.5 py-0.5 text-xs ${a.className}">
      <span class="w-1.5 h-1.5 rounded-full ${a.dotColor} shrink-0" aria-hidden="true"></span>
      <span>${b(a.label)}</span>
    </span>
  `:'<span class="text-slate-400">—</span>'}function N({container:e,pageNumber:t,totalPages:a,totalCount:s,pageSize:n,hasPrevious:d,hasNext:o,onPageChange:i,onPageSizeChange:l}){var c,f,v;if(!e)return;const u=s===0?0:(t-1)*n+1,p=Math.min(t*n,s);e.innerHTML=`
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 bg-white/45 dark:bg-[#141925]/80 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <span class="tabular-nums font-mono text-[11px]">
          Показано <strong class="font-semibold text-slate-800 dark:text-slate-200">${g(u)}–${g(p)}</strong> из
          <strong class="font-semibold text-slate-800 dark:text-slate-200">${g(s)}</strong> записей
        </span>

        <div class="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          <span class="text-slate-400 dark:text-slate-500 text-xs">По:</span>
          <select id="pagination-page-size" class="bg-white/90 dark:bg-[#181f2f] border border-slate-200/80 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer">
            <option value="10" ${n===10?"selected":""}>10</option>
            <option value="20" ${n===20?"selected":""}>20</option>
            <option value="50" ${n===50?"selected":""}>50</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="mr-2 tabular-nums text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          Стр. ${t} из ${Math.max(1,a)}
        </span>

        <button
          type="button"
          id="btn-pagination-prev"
          ${d?"":"disabled"}
          class="flex items-center justify-center p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-[#181f2f] text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-2xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Предыдущая страница"
        >
          ${x("chevronLeft",16)}
        </button>

        <button
          type="button"
          id="btn-pagination-next"
          ${o?"":"disabled"}
          class="flex items-center justify-center p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-[#181f2f] text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-2xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Следующая страница"
        >
          ${x("chevronRight",16)}
        </button>
      </div>
    </div>
  `,(c=e.querySelector("#btn-pagination-prev"))==null||c.addEventListener("click",()=>{d&&i(t-1)}),(f=e.querySelector("#btn-pagination-next"))==null||f.addEventListener("click",()=>{o&&i(t+1)}),(v=e.querySelector("#pagination-page-size"))==null||v.addEventListener("change",k=>{l&&l(Number(k.target.value))})}function T(e,t=300){let a;return function(...s){clearTimeout(a),a=setTimeout(()=>e.apply(this,s),t)}}function E(e){if(!e)return;e.classList.remove("hidden"),document.body.style.overflow="hidden";const t=a=>{a.key==="Escape"&&m(e)};e._escListener=t,window.addEventListener("keydown",t)}function m(e){e&&(e.classList.add("hidden"),document.body.style.overflow="",e._escListener&&(window.removeEventListener("keydown",e._escListener),e._escListener=null))}function S(e){if(!e)return;const t=e.querySelector("[data-modal-backdrop]"),a=e.querySelectorAll("[data-modal-close]");t==null||t.addEventListener("click",()=>m(e)),a.forEach(s=>s.addEventListener("click",()=>m(e)))}let r=null;function q({title:e,description:t,confirmLabel:a="Удалить",cancelLabel:s="Отмена",isDangerous:n=!0,onConfirm:d}){var l,u,p,c;r&&r.parentNode&&r.parentNode.removeChild(r),r=document.createElement("div"),r.className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in",r.setAttribute("role","dialog"),r.setAttribute("aria-modal","true"),r.innerHTML=`
    <!-- Neutral optical glass ambient backdrop -->
    <div class="fixed inset-0 bg-slate-900/25 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity" data-dialog-backdrop></div>

    <!-- Frosted Optical Glass Dialog Card -->
    <div class="relative w-full max-w-sm rounded-2xl bg-white/95 dark:bg-[#131824] backdrop-blur-2xl border border-white/95 dark:border-slate-700/80 shadow-[0_20px_50px_rgba(15,23,42,0.1),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transform transition-all z-10 text-slate-900 dark:text-slate-100">
      <div class="flex items-start justify-between px-6 py-4.5 border-b border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
        <div>
          <h3 class="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
            ${b(e)}
          </h3>
        </div>
        <button
          type="button"
          class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 rounded-xl transition-colors cursor-pointer"
          data-dialog-close
          title="Закрыть"
        >
          ${x("x",16)}
        </button>
      </div>

      <div class="px-6 py-5 space-y-4">
        <div class="flex items-start gap-3.5">
          ${n?`<div class="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 rounded-xl shrink-0 backdrop-blur-md">
                   ${x("alertTriangle",20)}
                 </div>`:""}
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">${b(t)}</p>
        </div>

        <div class="flex justify-end gap-2.5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            data-dialog-cancel
            class="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            ${b(s)}
          </button>
          <button
            type="button"
            data-dialog-confirm
            class="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all cursor-pointer ${n?"bg-rose-600 hover:bg-rose-700":"bg-indigo-600 hover:bg-indigo-700"}"
          >
            ${b(a)}
          </button>
        </div>
      </div>
    </div>
  `,document.body.appendChild(r),document.body.style.overflow="hidden";const o=()=>{document.body.style.overflow="",window.removeEventListener("keydown",i),r&&r.parentNode&&(r.parentNode.removeChild(r),r=null)},i=f=>{f.key==="Escape"&&o()};window.addEventListener("keydown",i),(l=r.querySelector("[data-dialog-backdrop]"))==null||l.addEventListener("click",o),(u=r.querySelector("[data-dialog-close]"))==null||u.addEventListener("click",o),(p=r.querySelector("[data-dialog-cancel]"))==null||p.addEventListener("click",o),(c=r.querySelector("[data-dialog-confirm]"))==null||c.addEventListener("click",()=>{o(),typeof d=="function"&&d()})}export{L as a,_ as b,m as c,T as d,b as e,g as f,$ as g,S as i,E as o,N as r,q as s};
