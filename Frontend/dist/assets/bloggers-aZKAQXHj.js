import{U as J,s as m,A as K,r as S}from"./theme-DasQTWpP.js";import{c as Q}from"./authGuard-Cq8U84WP.js";import{b as f}from"./bloggersApi-DqTrGCrI.js";import{i as V,o as D,c as X,d as Y,r as Z,e as w,f as tt,a as et,b as at,s as nt}from"./modal-DUcl0stV.js";const q=Q();if(q){let W=function(e){if(!e||e.length===0){const t=B||L!==""?"По заданным параметрам поиска блогеры не найдены":"В базе пока нет зарегистрированных блогеров";i.innerHTML=`
        <tr>
          <td colspan="6" class="px-5 py-8 text-center text-slate-400">
            ${t}
          </td>
        </tr>
      `;return}i.innerHTML=e.map(t=>`
      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-12 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
        <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${t.id}</td>
        <td class="px-5 py-2.5">
          <a
            href="${w(t.instagramUrl)}"
            target="_blank"
            rel="noreferrer"
            class="font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 text-xs"
          >
            <span>${w(t.instagramHandle)}</span>
            ${S("externalLink",12)}
          </a>
        </td>
        <td class="px-5 py-2.5 text-right font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
          ${tt(t.followersCount)}
        </td>
        <td class="px-5 py-2.5 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
          ${et(t.engagementRate)}
        </td>
        <td class="px-5 py-2.5">
          ${at("blogger",t.status)}
        </td>
        <td class="px-5 py-2.5 text-right space-x-1 whitespace-nowrap">
          <button
            type="button"
            data-action="edit"
            data-id="${t.id}"
            class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
            title="Редактировать блогера"
          >
            ${S("edit2",14)}
          </button>
          ${z?`<button
                  type="button"
                  data-action="delete"
                  data-id="${t.id}"
                  data-handle="${w(t.instagramHandle)}"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                  title="Удалить (Admin Only)"
                >
                  ${S("trash2",14)}
                </button>`:""}
        </td>
      </tr>
    `).join(""),i.querySelectorAll('[data-action="edit"]').forEach(t=>{t.addEventListener("click",()=>{const a=Number(t.dataset.id);F(a)})}),i.querySelectorAll('[data-action="delete"]').forEach(t=>{t.addEventListener("click",()=>{const a=Number(t.dataset.id),u=t.dataset.handle||`ID #${a}`;O(a,u)})})},O=function(e,t){nt({title:`Удалить блогера "${t}"?`,description:"Вы собираетесь удалить инфлюенсера из базы данных агентства. Все связанные публикации рилсов останутся в архиве. Это действие необратимо.",confirmLabel:"Удалить блогера",isDangerous:!0,onConfirm:async()=>{try{await f.delete(e),m("Блогер успешно удален","success"),r()}catch(a){m(a.message||"Ошибка при удалении блогера","error")}}})},H=function(){d.classList.add("hidden"),d.textContent="",document.querySelectorAll(".field-error").forEach(e=>{e.textContent=""})},s=function(e,t){const a=document.getElementById(`error-${e}`);return a?(a.textContent=t,!0):!1},g=1,N=10,p=null,h=0,B="",L="";const z=q.role===J.Admin,i=document.getElementById("bloggers-table-body"),j=document.getElementById("pagination-container"),U=document.getElementById("count-bloggers"),I=document.getElementById("bloggers-search-input"),$=document.getElementById("bloggers-status-filter"),b=document.getElementById("blogger-modal"),x=document.getElementById("blogger-modal-title"),y=document.getElementById("blogger-modal-subtitle"),v=document.getElementById("blogger-submit-btn"),n=document.getElementById("blogger-form"),d=document.getElementById("blogger-general-error"),k=document.getElementById("btn-create-blogger"),E=document.getElementById("blogger-status-group"),c=document.getElementById("blogger-status");V(b);async function r(){var e;i.innerHTML=`
      <tr>
        <td colspan="6" class="px-5 py-8 text-center text-slate-400">
          <div class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка блогеров...</span>
          </div>
        </td>
      </tr>
    `;try{const t=await f.getAll(g,N,B,L);W(t.items||[]),Z({container:j,pageNumber:t.pageNumber,totalPages:t.totalPages,totalCount:t.totalCount,pageSize:t.pageSize,hasPrevious:t.hasPrevious,hasNext:t.hasNext,onPageChange:a=>{g=a,r()},onPageSizeChange:a=>{N=a,g=1,r()}}),U&&(U.textContent=t.totalCount??((e=t.items)==null?void 0:e.length)??0)}catch(t){i.innerHTML=`
        <tr>
          <td colspan="6" class="px-5 py-8 text-center text-rose-500">
            Ошибка загрузки данных: ${w(t.message)}
          </td>
        </tr>
      `}}async function F(e){p=e,x&&(x.textContent="Редактировать блогера"),y&&(y.textContent="Изменение параметров инфлюенсера"),v&&(v.textContent="Сохранить изменения"),E&&E.classList.remove("hidden"),H();try{const t=await f.getById(e);h=t.status??0,n.instagramHandle.value=t.instagramHandle||"@",n.instagramUrl.value=t.instagramUrl||"",n.followersCount.value=t.followersCount||0,n.engagementRate.value=t.engagementRate||1.5,c&&(c.value=String(h)),D(b)}catch{m("Не удалось загрузить данные блогера","error")}}k==null||k.addEventListener("click",()=>{p=null,h=0,x&&(x.textContent="Новый блогер в базе"),y&&(y.textContent='Инфлюенсер создается со стартовым статусом "Нет ответа"'),v&&(v.textContent="Добавить в реестр"),E&&E.classList.add("hidden"),c&&(c.value="0"),n.reset(),n.instagramHandle.value="@",n.instagramUrl.value="https://instagram.com/",n.followersCount.value="50000",n.engagementRate.value="3.5",H(),D(b)}),n.addEventListener("submit",async e=>{e.preventDefault(),H();const t=n.instagramHandle.value.trim(),a=n.instagramUrl.value.trim(),u=Number(n.followersCount.value),C=parseFloat(n.engagementRate.value);let o=!1;if(t?t.startsWith("@")||(s("instagramHandle","Должно начинаться с @"),o=!0):(s("instagramHandle","Instagram handle обязателен"),o=!0),a?!a.startsWith("http://")&&!a.startsWith("https://")&&(s("instagramUrl","Введите валидный URL (https://...)"),o=!0):(s("instagramUrl","URL профиля обязателен"),o=!0),(isNaN(u)||u<=0)&&(s("followersCount","Количество подписчиков должно быть больше 0"),o=!0),(isNaN(C)||C<.1||C>100)&&(s("engagementRate","ER должен быть в интервале от 0.1 до 100.0%"),o=!0),o)return;const R={instagramHandle:t,instagramUrl:a,followersCount:u,engagementRate:C},P=n.querySelector('button[type="submit"]');P.disabled=!0;try{if(p){const l=c?Number(c.value):h??0;await f.update(p,{...R,status:l}),m("Данные блогера успешно обновлены","success")}else await f.create(R),m('Блогер успешно добавлен в базу со статусом "Нет ответа"',"success");X(b),r()}catch(l){if(l instanceof K&&l.fieldErrors){let T=!1;Object.entries(l.fieldErrors).forEach(([M,A])=>{const G=M.charAt(0).toLowerCase()+M.slice(1),_=Array.isArray(A)?A.join(", "):A;s(G,_)&&(T=!0)}),T||(d.textContent=l.message||"Ошибка создания блогера",d.classList.remove("hidden"))}else d.textContent=l.message||"Ошибка создания блогера",d.classList.remove("hidden")}finally{P.disabled=!1}}),I==null||I.addEventListener("input",Y(e=>{B=e.target.value.trim(),g=1,r()},300)),$==null||$.addEventListener("change",e=>{L=e.target.value,g=1,r()}),r()}
