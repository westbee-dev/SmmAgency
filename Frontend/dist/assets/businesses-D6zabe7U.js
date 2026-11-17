import{s as m,A as U,U as R,r as T}from"./theme-DasQTWpP.js";import{c as W}from"./authGuard-Cq8U84WP.js";import{b as g}from"./businessesApi-CisEMkuw.js";import{i as F,o as M,c as G,d as J,r as K,e as p,b as Q,s as V}from"./modal-DUcl0stV.js";const P=W();if(P){let N=function(e){if(!e||e.length===0){const t=h||b!==""?"По заданным параметрам поиска бизнесы не найдены":"В базе пока нет зарегистрированных бизнесов";i.innerHTML=`
        <tr>
          <td colspan="6" class="px-5 py-8 text-center text-slate-400">
            ${t}
          </td>
        </tr>
      `;return}const a=P.role===R.Admin;i.innerHTML=e.map(t=>`
      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-12 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
        <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${t.id}</td>
        <td class="px-5 py-2.5 font-semibold text-slate-900 dark:text-slate-100">${p(t.name)}</td>
        <td class="px-5 py-2.5 font-mono text-indigo-600 dark:text-indigo-400 font-medium">${p(t.instagramHandle)}</td>
        <td class="px-5 py-2.5 text-slate-600 dark:text-slate-400">${p(t.category)}</td>
        <td class="px-5 py-2.5">${Q("business",t.status)}</td>
        <td class="px-5 py-2.5 text-right space-x-1 whitespace-nowrap">
          <button
            type="button"
            data-action="edit"
            data-id="${t.id}"
            class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
            title="Редактировать"
          >
            ${T("edit2",14)}
          </button>
          ${a?`<button
                  type="button"
                  data-action="delete"
                  data-id="${t.id}"
                  data-name="${p(t.name)}"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                  title="Удалить (Admin Only)"
                >
                  ${T("trash2",14)}
                </button>`:""}
        </td>
      </tr>
    `).join(""),i.querySelectorAll('[data-action="edit"]').forEach(t=>{t.addEventListener("click",()=>z(Number(t.dataset.id)))}),i.querySelectorAll('[data-action="delete"]').forEach(t=>{t.addEventListener("click",()=>{const d=Number(t.dataset.id),s=t.dataset.name||`ID #${d}`;D(d,s)})})},D=function(e,a){V({title:`Удалить бизнес "${a}"?`,description:"Вы собираетесь удалить этот бизнес из базы данных агентства. Все связанные кампании должны быть завершены или удалены. Это действие необратимо.",confirmLabel:"Удалить бизнес",isDangerous:!0,onConfirm:async()=>{try{await g.delete(e),m("Бизнес успешно удален","success"),r()}catch(t){m(t.message||"Ошибка при удалении бизнеса","error")}}})},B=function(){l.classList.add("hidden"),l.textContent="",document.querySelectorAll(".field-error").forEach(e=>{e.textContent=""})},o=function(e,a){const t=document.getElementById(`error-${e}`);return t?(t.textContent=a,!0):!1},c=1,w=10,y=null,h="",b="";const i=document.getElementById("businesses-table-body"),q=document.getElementById("pagination-container"),I=document.getElementById("count-businesses"),x=document.getElementById("businesses-search-input"),v=document.getElementById("businesses-status-filter"),f=document.getElementById("business-modal"),H=document.getElementById("modal-title"),$=document.getElementById("modal-subtitle"),n=document.getElementById("business-form"),l=document.getElementById("business-general-error"),E=document.getElementById("btn-create-business");F(f);async function r(){var e;i.innerHTML=`
      <tr>
        <td colspan="6" class="px-5 py-8 text-center text-slate-400">
          <div class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка бизнесов...</span>
          </div>
        </td>
      </tr>
    `;try{const a=await g.getAll(c,w,h,b);N(a.items||[]),K({container:q,pageNumber:a.pageNumber,totalPages:a.totalPages,totalCount:a.totalCount,pageSize:a.pageSize,hasPrevious:a.hasPrevious,hasNext:a.hasNext,onPageChange:t=>{c=t,r()},onPageSizeChange:t=>{w=t,c=1,r()}}),I&&(I.textContent=a.totalCount??((e=a.items)==null?void 0:e.length)??0)}catch(a){i.innerHTML=`
        <tr>
          <td colspan="6" class="px-5 py-8 text-center text-rose-500">
            Ошибка загрузки данных: ${p(a.message)}
          </td>
        </tr>
      `}}E==null||E.addEventListener("click",()=>{y=null,H.textContent="Новый бизнес клиента",$.textContent="Заведение карточки бренда в базу данных агентства";const e=n.querySelector('button[type="submit"]');e&&(e.textContent="Сохранить бренд"),n.reset(),n.instagramHandle.value="@",B(),M(f)});async function z(e){y=e,H.textContent="Редактировать бизнес",$.textContent="Изменение реквизитов и категории бренда";const a=n.querySelector('button[type="submit"]');a&&(a.textContent="Сохранить изменения"),B();try{const t=await g.getById(e);n.name.value=t.name||"",n.instagramHandle.value=t.instagramHandle||"@",n.category.value=t.category||"",M(f)}catch{m("Не удалось загрузить данные бизнеса","error")}}n.addEventListener("submit",async e=>{e.preventDefault(),B();const a=n.name.value.trim(),t=n.instagramHandle.value.trim(),d=n.category.value.trim();let s=!1;if(a?a.length>100&&(o("name","Максимальная длина названия — 100 символов"),s=!0):(o("name","Название компании обязательно"),s=!0),t?t.startsWith("@")||(o("instagramHandle","InstagramHandle должен начинаться с символа @"),s=!0):(o("instagramHandle","InstagramHandle обязателен"),s=!0),d?d.length>40&&(o("category","Максимальная длина категории — 40 символов"),s=!0):(o("category","Категория бизнеса обязательна"),s=!0),s)return;const L={name:a,instagramHandle:t,category:d},k=n.querySelector('button[type="submit"]');k.disabled=!0;try{y?(await g.update(y,L),m("Бизнес успешно обновлен","success")):(await g.create(L),m('Бизнес успешно создан со статусом "Нет кампаний"',"success")),G(f),r()}catch(u){if(u instanceof U&&u.fieldErrors){let A=!1;Object.entries(u.fieldErrors).forEach(([S,C])=>{const j=S.charAt(0).toLowerCase()+S.slice(1),O=Array.isArray(C)?C.join(", "):C;o(j,O)&&(A=!0)}),A||(l.textContent=u.message||"Ошибка сохранения данных",l.classList.remove("hidden"))}else l.textContent=u.message||"Ошибка сохранения данных",l.classList.remove("hidden")}finally{k.disabled=!1}}),x==null||x.addEventListener("input",J(e=>{h=e.target.value.trim(),c=1,r()},300)),v==null||v.addEventListener("change",e=>{b=e.target.value,c=1,r()}),r()}
