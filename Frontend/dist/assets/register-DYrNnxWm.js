import{U as g,s as m,A,r as C}from"./theme-DasQTWpP.js";import{c as $}from"./authGuard-Cq8U84WP.js";import{a as f}from"./authApi-_NJ2DLzj.js";import{e as b,s as v}from"./modal-DUcl0stV.js";const x=$(g.Admin);if(x){let y=function(r,t){v({title:`Удалить сотрудника "${t}"?`,description:`Вы собираетесь удалить учетную запись пользователя "${t}" из системы агентства. Пользователь потеряет доступ к CRM. Это действие необратимо.`,confirmLabel:"Удалить сотрудника",isDangerous:!0,onConfirm:async()=>{try{await f.deleteUser(r),m(`Сотрудник "${t}" успешно удален`,"success"),u()}catch(e){m(e.message||"Ошибка при удалении сотрудника","error")}}})},w=function(){i&&(i.classList.add("hidden"),i.textContent=""),document.querySelectorAll(".field-error").forEach(r=>{r.textContent=""})},l=function(r,t){const e=document.getElementById(`error-${r}`);e&&(e.textContent=t)};const n=document.getElementById("register-form"),i=document.getElementById("register-general-error"),a=document.getElementById("submit-btn"),d=document.getElementById("users-table-body"),h=document.getElementById("count-users");async function u(){if(d)try{const r=await f.getUsers(),t=Array.isArray(r)?r:r.items||[];if(h&&(h.textContent=t.length),t.length===0){d.innerHTML=`
          <tr>
            <td colspan="4" class="px-5 py-6 text-center text-slate-400">
              В системе пока нет других зарегистрированных сотрудников
            </td>
          </tr>
        `;return}d.innerHTML=t.map(e=>{const s=e.role===g.Admin||e.roleName==="Admin"||e.role===1?`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold font-mono border text-purple-700 dark:text-purple-300 bg-purple-50/90 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/60">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                Администратор (Admin)
              </span>`:`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold font-mono border text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/60">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                Менеджер (Manager)
              </span>`,p=x.login&&e.login.toLowerCase()===x.login.toLowerCase()?'<span class="inline-block text-[11px] font-medium text-slate-400 dark:text-slate-500 italic px-2 py-1">Текущий аккаунт</span>':`<button
                type="button"
                data-action="delete"
                data-id="${e.id}"
                data-login="${b(e.login)}"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                title="Удалить сотрудника"
              >
                ${C("trash2",14)}
              </button>`;return`
            <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-11 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
              <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${e.id}</td>
              <td class="px-5 py-2.5 font-semibold text-slate-800 dark:text-slate-200">${b(e.login)}</td>
              <td class="px-5 py-2.5">${s}</td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">${p}</td>
            </tr>
          `}).join(""),d.querySelectorAll('[data-action="delete"]').forEach(e=>{e.addEventListener("click",()=>{const o=Number(e.dataset.id),s=e.dataset.login||`ID #${o}`;y(o,s)})})}catch(r){d.innerHTML=`
        <tr>
          <td colspan="4" class="px-5 py-6 text-center text-rose-500">
            Не удалось загрузить список сотрудников: ${b(r.message||"Ошибка")}
          </td>
        </tr>
      `}}n==null||n.addEventListener("submit",async r=>{r.preventDefault(),w();const t=n.login.value.trim(),e=n.password.value,o=Number(n.role.value);let s=!1;if(t?(t.length<3||t.length>20)&&(l("login","Длина логина должна быть от 3 до 20 символов"),s=!0):(l("login","Логин обязателен"),s=!0),e?(e.length<6||e.length>30)&&(l("password","Длина пароля должна быть от 6 до 30 символов"),s=!0):(l("password","Пароль обязателен"),s=!0),(isNaN(o)||o!==g.Manager&&o!==g.Admin)&&(l("role","Выберите корректную роль"),s=!0),!s){a.disabled=!0,a.textContent="Регистрация...";try{await f.register(t,e,o),m(`Сотрудник "${t}" успешно зарегистрирован в системе`,"success"),n.reset(),a.disabled=!1,a.textContent="Зарегистрировать сотрудника",u()}catch(c){a.disabled=!1,a.textContent="Зарегистрировать сотрудника",c instanceof A&&c.fieldErrors?Object.entries(c.fieldErrors).forEach(([p,E])=>{const k=p.charAt(0).toLowerCase()+p.slice(1);l(k,E[0])}):(i.textContent=c.message||"Ошибка регистрации сотрудника",i.classList.remove("hidden"))}}}),u()}
