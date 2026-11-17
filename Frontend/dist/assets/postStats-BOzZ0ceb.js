import{a as $,U as Q,s as x,A as V,r as H}from"./theme-DasQTWpP.js";import{c as X}from"./authGuard-DK-ZWsUg.js";import{c as Y}from"./campaignsApi-DGpu0RLH.js";import{b as Z}from"./bloggersApi-DqTrGCrI.js";import{i as tt,o as D,c as et,d as at,e as h,f as U,r as nt,s as ot}from"./modal-DUcl0stV.js";const w={getAll:(s=1,m=10,d="",p="",I="")=>{let r=`/api/PostStats?page=${s}&pageSize=${m}`;return d&&(r+=`&search=${encodeURIComponent(d)}`),p&&(r+=`&campaignId=${encodeURIComponent(p)}`),I&&(r+=`&bloggerId=${encodeURIComponent(I)}`),$.get(r)},getById:s=>$.get(`/api/PostStats/${s}`),create:s=>$.post("/api/PostStats",s),update:(s,m)=>$.put(`/api/PostStats/${s}`,m),delete:s=>$.delete(`/api/PostStats/${s}`)},E=X();if(E){let F=function(e){if(!e||e.length===0){const t=p?"По заданному запросу публикации не найдены":"В базе пока нет внесенных публикаций рилсов";r.innerHTML=`
        <tr>
          <td colspan="8" class="px-5 py-8 text-center text-slate-400">
            ${t}
          </td>
        </tr>
      `;return}r.innerHTML=e.map(t=>`
      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-12 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
        <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${t.id}</td>
        <td class="px-5 py-2.5 font-mono text-slate-600 dark:text-slate-400">#${t.campaignId}</td>
        <td class="px-5 py-2.5 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">${h(t.bloggerHandle||"—")}</td>
        <td class="px-5 py-2.5 text-slate-700 dark:text-slate-300">${h(t.managerName)}</td>
        <td class="px-5 py-2.5 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
          ${U(t.viewsCount)}
        </td>
        <td class="px-5 py-2.5 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
          ${U(t.likesCount)}
        </td>
        <td class="px-5 py-2.5">
          <a
            href="${h(t.postUrl)}"
            target="_blank"
            rel="noreferrer"
            class="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
          >
            <span>Instagram Reel</span>
            ${H("externalLink",11)}
          </a>
        </td>
        <td class="px-5 py-2.5 text-right space-x-1 whitespace-nowrap">
          <button
            type="button"
            data-action="edit"
            data-id="${t.id}"
            class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
            title="Редактировать запись"
          >
            ${H("edit2",14)}
          </button>
          ${I?`<button
                  type="button"
                  data-action="delete"
                  data-id="${t.id}"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                  title="Удалить запись (Admin Only)"
                >
                  ${H("trash2",14)}
                </button>`:""}
        </td>
      </tr>
    `).join(""),r.querySelectorAll('[data-action="edit"]').forEach(t=>{t.addEventListener("click",()=>{const n=Number(t.dataset.id);G(n)})}),r.querySelectorAll('[data-action="delete"]').forEach(t=>{t.addEventListener("click",()=>{const n=Number(t.dataset.id);_(n)})})},_=function(e){ot({title:`Удалить запись статистики #${e}?`,description:"Вы собираетесь удалить запись о публикации рилса. Счетчик выполненных рилсов в кампании будет пересчитан. Это действие необратимо.",confirmLabel:"Удалить запись",isDangerous:!0,onConfirm:async()=>{try{await w.delete(e),x("Запись статистики удалена","success"),f()}catch(t){x(t.message||"Ошибка при удалении статистики","error")}}})},P=function(){g.classList.add("hidden"),g.textContent="",document.querySelectorAll(".field-error").forEach(e=>{e.textContent=""})},i=function(e,t){const n=document.getElementById(`error-${e}`);return n?(n.textContent=t,!0):!1},s=1,m=10,d=null,p="";const I=E.role===Q.Admin,r=document.getElementById("poststats-table-body"),W=document.getElementById("pagination-container"),M=document.getElementById("count-poststats"),B=document.getElementById("poststats-search-input"),N=document.getElementById("poststat-modal"),k=document.getElementById("poststat-modal-title"),L=document.getElementById("poststat-modal-subtitle"),S=document.getElementById("poststat-submit-btn"),a=document.getElementById("poststat-form"),g=document.getElementById("poststat-general-error"),b=document.getElementById("poststat-campaignId"),v=document.getElementById("poststat-bloggerId"),A=document.getElementById("btn-create-poststat");tt(N);async function f(){var e;r.innerHTML=`
      <tr>
        <td colspan="8" class="px-5 py-8 text-center text-slate-400">
          <div class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка статистики рилсов...</span>
          </div>
        </td>
      </tr>
    `;try{const t=await w.getAll(s,m,p);F(t.items||[]),nt({container:W,pageNumber:t.pageNumber,totalPages:t.totalPages,totalCount:t.totalCount,pageSize:t.pageSize,hasPrevious:t.hasPrevious,hasNext:t.hasNext,onPageChange:n=>{s=n,f()},onPageSizeChange:n=>{m=n,s=1,f()}}),M&&(M.textContent=t.totalCount??((e=t.items)==null?void 0:e.length)??0)}catch(t){r.innerHTML=`
        <tr>
          <td colspan="8" class="px-5 py-8 text-center text-rose-500">
            Ошибка загрузки данных: ${h(t.message)}
          </td>
        </tr>
      `}}async function R(e=null,t=null){b.innerHTML='<option value="">Загрузка кампаний...</option>',v.innerHTML='<option value="">Загрузка блогеров...</option>';try{const[n,y]=await Promise.all([Y.getAll(1,100),Z.getAll(1,100)]),c=n.items||[],u=y.items||[];c.length===0?b.innerHTML='<option value="">Нет созданных кампаний</option>':b.innerHTML=c.map(o=>`<option value="${o.id}" ${o.id===e?"selected":""}>#${o.id} ${h(o.businessName)} (${o.completedReelsCount}/${o.targetReelsCount} рилсов)</option>`).join(""),u.length===0?v.innerHTML='<option value="">Нет зарегистрированных блогеров</option>':v.innerHTML=u.map(o=>`<option value="${o.id}" ${o.id===t?"selected":""}>${h(o.instagramHandle)} (${U(o.followersCount)} подп.)</option>`).join("")}catch{x("Не удалось загрузить списки кампаний или блогеров","error")}}async function G(e){d=e,k&&(k.textContent="Редактировать статистику рилса"),L&&(L.textContent="Изменение параметров или показателей публикации"),S&&(S.textContent="Сохранить изменения"),P();try{const t=await w.getById(e);await R(t.campaignId,t.bloggerId),b.value=t.campaignId,v.value=t.bloggerId,a.managerName.value=t.managerName||E.login||"",a.managerName.readOnly=!0,a.postUrl.value=t.postUrl||"",a.viewsCount.value=t.viewsCount??t.views??0,a.likesCount.value=t.likesCount??t.likes??0,D(N)}catch{x("Не удалось загрузить данные рилса","error")}}A==null||A.addEventListener("click",async()=>{d=null,k&&(k.textContent="Внесение статистики рилса"),L&&(L.textContent="Фиксация выхода рекламы и инкремент счетчика рилсов кампании"),S&&(S.textContent="Зафиксировать рилс"),P(),a.reset(),a.managerName.value=E.login||"",a.managerName.readOnly=!0,a.postUrl.value="https://instagram.com/reel/",a.viewsCount.value="25000",a.likesCount.value="1500",D(N),await R()}),a.addEventListener("submit",async e=>{e.preventDefault(),P();const t=Number(b.value),n=Number(v.value),y=a.managerName.value.trim()||E.login||"",c=a.postUrl.value.trim(),u=Number(a.viewsCount.value),o=Number(a.likesCount.value);let l=!1;if((!t||isNaN(t))&&(i("campaignId","Выберите кампанию"),l=!0),(!n||isNaN(n))&&(i("bloggerId","Выберите блогера"),l=!0),y?y.length>20&&(i("managerName","Максимальная длина имени — 20 символов"),l=!0):(i("managerName","Имя менеджера обязательно"),l=!0),c?!c.startsWith("http://")&&!c.startsWith("https://")&&(i("postUrl","Введите валидный URL (https://...)"),l=!0):(i("postUrl","Ссылка на рилс обязательна"),l=!0),(isNaN(u)||u<0)&&(i("viewsCount","Просмотры не могут быть отрицательными"),l=!0),(isNaN(o)||o<0)&&(i("likesCount","Лайки не могут быть отрицательными"),l=!0),l)return;const j={campaignId:t,bloggerId:n,managerName:y,postUrl:c,viewsCount:u,likesCount:o,views:u,likes:o},z=a.querySelector('button[type="submit"]');z.disabled=!0;try{d?(await w.update(d,j),x("Запись статистики рилса обновлена!","success")):(await w.create(j),x('Статистика рилса внесена! Статус блогера переведен в "Опубликовал"',"success")),et(N),f()}catch(C){if(C instanceof V&&C.fieldErrors){let O=!1;Object.entries(C.fieldErrors).forEach(([q,T])=>{const J=q.charAt(0).toLowerCase()+q.slice(1),K=Array.isArray(T)?T.join(", "):T;i(J,K)&&(O=!0)}),O||(g.textContent=C.message||"Ошибка внесения рилса",g.classList.remove("hidden"))}else g.textContent=C.message||"Ошибка внесения рилса",g.classList.remove("hidden")}finally{z.disabled=!1}}),B==null||B.addEventListener("input",at(e=>{p=e.target.value.trim(),s=1,f()},300)),f()}
