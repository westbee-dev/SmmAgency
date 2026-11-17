import{U as G,r as E,s as o,B as H,A as J}from"./theme-DasQTWpP.js";import{c as K}from"./authGuard-DK-ZWsUg.js";import{c as m}from"./campaignsApi-DGpu0RLH.js";import{b as Q}from"./businessesApi-CisEMkuw.js";import{i as V,o as S,e as c,c as W,d as X,r as Y,g as Z,s as _}from"./modal-DUcl0stV.js";const R=K();var D;if(R){let z=function(a){if(!a||a.length===0){const e=k?"По заданному запросу кампании не найдены":"В базе пока нет активных рекламных кампаний";i.innerHTML=`
        <tr>
          <td colspan="5" class="px-5 py-8 text-center text-slate-400">
            ${e}
          </td>
        </tr>
      `;return}i.innerHTML=a.map(e=>{const t=Math.min(100,Math.round((e.completedReelsCount||0)/(e.targetReelsCount||1)*100)),n=t>=100;return`
        <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-14 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
          <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${e.id}</td>
          <td class="px-5 py-2.5">
            <div class="font-semibold text-slate-900 dark:text-slate-100">${c(e.businessName)}</div>
            <div class="font-mono text-[11px] text-slate-500 dark:text-slate-400">${c(e.businessHandle||"—")}</div>
          </td>
          <td class="px-5 py-2.5 min-w-[190px]">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono font-medium ${n?"text-emerald-600 dark:text-emerald-400":"text-slate-600 dark:text-slate-300"}">
                  ${e.completedReelsCount} / ${e.targetReelsCount} рилсов
                </span>
                <span class="font-mono text-slate-400 dark:text-slate-500 font-medium">${t}%</span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300 ${n?"bg-emerald-600 dark:bg-emerald-500":"bg-indigo-600 dark:bg-indigo-500"}"
                  style="width: ${t}%"
                ></div>
              </div>
            </div>
          </td>
          <td class="px-5 py-2.5 font-mono text-slate-500 dark:text-slate-400">${Z(e.createdDate||e.createdAt)}</td>
          <td class="px-5 py-2.5 text-right space-x-1 whitespace-nowrap">
            ${b?`<button
                    type="button"
                    data-action="edit"
                    data-id="${e.id}"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                    title="Редактировать кампанию (Admin Only)"
                  >
                    ${E("edit2",14)}
                  </button>
                  <button
                    type="button"
                    data-action="delete"
                    data-id="${e.id}"
                    data-name="${c(e.businessName)}"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                    title="Удалить кампанию (Admin Only)"
                  >
                    ${E("trash2",14)}
                  </button>`:'<span class="text-slate-300 dark:text-slate-600 text-[11px]">—</span>'}
          </td>
        </tr>
      `}).join(""),i.querySelectorAll('[data-action="edit"]').forEach(e=>{e.addEventListener("click",()=>{const t=Number(e.dataset.id);q(t)})}),i.querySelectorAll('[data-action="delete"]').forEach(e=>{e.addEventListener("click",()=>{const t=Number(e.dataset.id),n=e.dataset.name||`ID #${t}`;j(t,n)})})},j=function(a,e){_({title:`Удалить кампанию для "${e}"?`,description:"Вы собираетесь удалить рекламную кампанию из базы. Статус бизнеса будет возвращен в исходное состояние. Это действие необратимо.",confirmLabel:"Удалить кампанию",isDangerous:!0,onConfirm:async()=>{try{await m.delete(a),o("Кампания удалена из базы","success"),d()}catch(t){o(t.message||"Ошибка при удалении кампании","error")}}})},w=function(){r.classList.add("hidden"),r.textContent="",document.querySelectorAll(".field-error").forEach(a=>{a.textContent=""})},L=function(a,e){const t=document.getElementById(`error-${a}`);return t?(t.textContent=e,!0):!1},p=1,I=10,g=null,k="";const b=R.role===G.Admin,i=document.getElementById("campaigns-table-body"),P=document.getElementById("pagination-container"),A=document.getElementById("count-campaigns"),$=document.getElementById("campaigns-search-input"),x=document.getElementById("campaign-modal"),f=document.getElementById("campaign-modal-title"),h=document.getElementById("campaign-modal-subtitle"),y=document.getElementById("campaign-submit-btn"),l=document.getElementById("campaign-form"),r=document.getElementById("campaign-general-error"),s=document.getElementById("campaign-businessId");document.getElementById("btn-create-campaign");const v=document.getElementById("header-action-container");V(x),v&&(b?(v.innerHTML=`
        <button
          type="button"
          id="btn-create-campaign"
          class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700 active:scale-[0.98] rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
        >
          ${E("plus",15)}
          <span>Создать кампанию</span>
        </button>
      `,(D=v.querySelector("#btn-create-campaign"))==null||D.addEventListener("click",O)):v.innerHTML=`
        <div class="text-xs px-3.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center gap-2">
          ${E("shieldAlert",14,"text-amber-600 dark:text-amber-400 shrink-0")}
          <span>Создание доступно только Администратору</span>
        </div>
      `);async function d(){var a;i.innerHTML=`
      <tr>
        <td colspan="5" class="px-5 py-8 text-center text-slate-400">
          <div class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка кампаний...</span>
          </div>
        </td>
      </tr>
    `;try{const e=await m.getAll(p,I,k);z(e.items||[]),Y({container:P,pageNumber:e.pageNumber,totalPages:e.totalPages,totalCount:e.totalCount,pageSize:e.pageSize,hasPrevious:e.hasPrevious,hasNext:e.hasNext,onPageChange:t=>{p=t,d()},onPageSizeChange:t=>{I=t,p=1,d()}}),A&&(A.textContent=e.totalCount??((a=e.items)==null?void 0:a.length)??0)}catch(e){i.innerHTML=`
        <tr>
          <td colspan="5" class="px-5 py-8 text-center text-rose-500">
            Ошибка загрузки данных: ${c(e.message)}
          </td>
        </tr>
      `}}async function q(a){if(!b){o("Редактирование кампаний доступно только Администратору","error");return}g=a,f&&(f.textContent="Редактировать кампанию"),h&&(h.textContent="Изменение целевого количества рилсов"),y&&(y.textContent="Сохранить изменения"),w();try{const e=await m.getById(a);s.innerHTML=`<option value="${e.businessId}">${c(e.businessName)} (Кампания #${e.id})</option>`,s.disabled=!0,l.targetReelsCount.value=e.targetReelsCount,S(x)}catch{o("Не удалось загрузить данные кампании","error")}}async function O(){if(!b){o("Создание кампаний доступно только Администратору","error");return}g=null,s.disabled=!1,f&&(f.textContent="Запуск рекламной кампании"),h&&(h.textContent='Создание кампании разрешено только для бизнеса со статусом "Нет кампаний"'),y&&(y.textContent="Запустить кампанию"),w(),l.reset(),l.targetReelsCount.value="10",s.innerHTML='<option value="">Загрузка списка бизнесов...</option>',S(x);try{const e=(await Q.getAll(1,100)).items||[],t=e.filter(n=>n.status===H.NoCampaigns);if(e.length===0){s.innerHTML='<option value="">Сначала создайте бизнес в разделе Бизнесы</option>';return}s.innerHTML=e.map(n=>{const C=n.status===H.NoCampaigns;return`
          <option value="${n.id}" ${C?"":"disabled"}>
            ${c(n.name)} (${C?"Готов к запуску":"Кампания уже активна/завершена"})
          </option>
        `}).join(""),t.length>0?s.value=t[0].id:(r.textContent='Нет доступных бизнесов со статусом "Нет кампаний". Все бизнесы уже участвуют в кампаниях.',r.classList.remove("hidden"))}catch{s.innerHTML='<option value="">Ошибка загрузки бизнесов</option>',o("Не удалось загрузить список бизнесов","error")}}l.addEventListener("submit",async a=>{a.preventDefault(),w();const e=Number(s.value),t=Number(l.targetReelsCount.value);let n=!1;if((!e||isNaN(e))&&(L("businessId",'Выберите бизнес со статусом "Нет кампаний"'),n=!0),(isNaN(t)||t<1||t>100)&&(L("targetReelsCount","Целевое число рилсов должно быть от 1 до 100"),n=!0),n)return;const C={businessId:e,targetReelsCount:t},N=l.querySelector('button[type="submit"]');N.disabled=!0;try{g?(await m.update(g,{targetReelsCount:t}),o("Кампания успешно обновлена","success")):(await m.create(C),o('Кампания создана! Статус бизнеса переведен в "В процессе"',"success")),W(x),d()}catch(u){if(u instanceof J&&u.fieldErrors){let M=!1;Object.entries(u.fieldErrors).forEach(([T,B])=>{const U=T.charAt(0).toLowerCase()+T.slice(1),F=Array.isArray(B)?B.join(", "):B;L(U,F)&&(M=!0)}),M||(r.textContent=u.message||"Ошибка запуска кампании",r.classList.remove("hidden"))}else r.textContent=u.message||"Ошибка запуска кампании",r.classList.remove("hidden")}finally{N.disabled=!1}}),$==null||$.addEventListener("input",X(a=>{k=a.target.value.trim(),p=1,d()},300)),d()}
