'use strict';
const LEAD_WHATSAPP_NUMBER='6287867143626';
const form=document.getElementById('lead-form');
const content=document.getElementById('step-content');
const error=document.getElementById('form-error');
const back=document.getElementById('back-button');
const next=document.getElementById('next-button');
const complete=document.getElementById('complete');
const answer={role:'',count:'',accounting:'',name:'',phone:''};
let step=0;
let message='';
const roles=['Собственник / фаундер','CFO / финансовый директор / главный бухгалтер','COO / операционный директор / управляющий','Другая роль'];
const accounting=['В основном Excel и ручная обработка','Несколько систем, данные сводятся вручную','Используем бухгалтерскую систему','Уже автоматизирован, но есть ограничения','Затрудняюсь ответить'];
const arrow='<svg><use href="#arrow"/></svg>';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function options(name,values){return '<div class="options" role="radiogroup" aria-labelledby="question-title">'+values.map((v,i)=>`<label class="option"><input type="radio" name="${name}" value="${esc(v)}" ${answer[name]===v?'checked':''}><span>${esc(v)}</span></label>`).join('')+'</div>';}
function render(focus=false){
 error.textContent=''; form.hidden=false;complete.hidden=true;
 const titles=['Ваша роль в бизнесе?','Сколько у вас заведений?','Как сейчас устроен финансовый учёт?','Как с вами связаться?'];
 const descriptions=['Чтобы обсуждать задачи на вашем языке.','Укажите количество действующих заведений.','Выберите вариант, который ближе к вашей ситуации.','Оставьте контакт — и продолжим обсуждение в WhatsApp.'];
 let body='';
 if(step===0)body=options('role',roles);
 if(step===1)body=`<label class="field-label" for="restaurant-count">Количество заведений</label><div class="count-control"><button type="button" data-adjust="-1" aria-label="Уменьшить количество">−</button><input id="restaurant-count" class="text-input" name="count" type="number" min="1" max="9999" step="1" inputmode="numeric" placeholder="0" value="${esc(answer.count)}"><button type="button" data-adjust="1" aria-label="Увеличить количество">+</button></div><div class="count-shortcuts">${[1,3,5,10,20].map(v=>`<button type="button" data-count="${v}">${v}</button>`).join('')}</div>`;
 if(step===2)body=options('accounting',accounting);
 if(step===3)body=`<label class="field-label" for="contact-name">Ваше имя</label><input id="contact-name" class="text-input" name="name" autocomplete="given-name" maxlength="80" value="${esc(answer.name)}" placeholder="Как к вам обращаться"><label class="field-label" for="contact-phone">Телефон WhatsApp</label><input id="contact-phone" class="text-input" name="phone" type="tel" autocomplete="tel" inputmode="tel" maxlength="25" value="${esc(answer.phone)}" placeholder="+62 812 3456 7890"><p class="contact-note">Данные войдут в текст заявки. На следующем экране откроется чат в WhatsApp — отправьте сообщение, чтобы мы получили ваши ответы.</p>`;
 content.innerHTML=`<h3 id="question-title" class="step-title" tabindex="-1">${titles[step]}</h3><p class="step-description">${descriptions[step]}</p>${body}`;
 document.getElementById('step-label').textContent=`Шаг ${step+1} из 4`;
 document.getElementById('step-name').textContent=['Знакомство','Масштаб бизнеса','Текущий учёт','Контакт'][step];
 document.getElementById('progress-fill').style.width=((step+1)*25)+'%';
 document.querySelector('.progress').setAttribute('aria-valuenow',step+1);
 back.hidden=step===0;
 next.innerHTML=(step===3?'Подготовить заявку':'Далее')+arrow;
 if(focus){content.querySelector('h3').focus({preventScroll:true});revealQuestion();}
}
function saveCurrent(){const data=new FormData(form);if(step===0)answer.role=data.get('role')||'';if(step===1)answer.count=data.get('count')||'';if(step===2)answer.accounting=data.get('accounting')||'';if(step===3){answer.name=String(data.get('name')||'').trim();answer.phone=String(data.get('phone')||'').trim();}}
function validate(){if(step===0&&!answer.role)return 'Выберите вашу роль в бизнесе.';if(step===1&&(!/^\d+$/.test(answer.count)||Number(answer.count)<1||Number(answer.count)>9999))return 'Введите целое количество заведений от 1 до 9999.';if(step===2&&!answer.accounting)return 'Выберите, как сейчас устроен учёт.';if(step===3){if(answer.name.length<2)return 'Укажите ваше имя — минимум 2 символа.';if(!/^\+?[\d\s()\-]+$/.test(answer.phone)||answer.phone.replace(/\D/g,'').length<7||answer.phone.replace(/\D/g,'').length>15)return 'Введите телефон с кодом страны, например +62 812 3456 7890.';}return '';}
form.addEventListener('submit',e=>{e.preventDefault();saveCurrent();const problem=validate();if(problem){error.textContent=problem;if(step===3){const el=form.elements[answer.name.length<2?'name':'phone'];el.setAttribute('aria-invalid','true');el.focus();}return;}if(step<3){step++;render(true);return;}message=`Заявка на автоматизацию финансов ресторана\n\nИмя: ${answer.name}\nWhatsApp: ${answer.phone}\nРоль: ${answer.role}\nКоличество заведений: ${answer.count}\nТекущий учёт: ${answer.accounting}\n\nХочу обсудить автоматизацию финансовых процессов.`;document.getElementById('whatsapp-link').href='https://wa.me/'+LEAD_WHATSAPP_NUMBER+'?text='+encodeURIComponent(message);form.hidden=true;complete.hidden=false;document.getElementById('step-name').textContent='Готово к отправке';complete.querySelector('h3').setAttribute('tabindex','-1');complete.querySelector('h3').focus({preventScroll:true});revealQuestion();});
back.addEventListener('click',()=>{saveCurrent();if(step>0){step--;render(true);}});
content.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;const input=document.getElementById('restaurant-count');if(button.dataset.count)input.value=button.dataset.count;if(button.dataset.adjust)input.value=Math.max(1,Math.min(9999,(Number(input.value)||0)+Number(button.dataset.adjust)));answer.count=input.value;error.textContent='';});
content.addEventListener('input',()=>{error.textContent='';content.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));});
document.getElementById('edit-button').addEventListener('click',()=>render(true));
document.getElementById('copy-button').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText(message);status.textContent='Текст скопирован. Вставьте его в чат WhatsApp +62 878-6714-3626.';}catch{const field=document.createElement('textarea');field.value=message;field.setAttribute('aria-label','Текст заявки для копирования');complete.appendChild(field);field.select();status.textContent='Выделенный текст можно скопировать вручную.';}});
render();
const mobileCTA=document.querySelector('.mobile-cta');
const quizPanel=document.querySelector('.quiz-panel');
function revealQuestion(){
 if(window.matchMedia('(max-width:900px)').matches){
  quizPanel.scrollIntoView({block:'start',behavior:'instant'});
 }
}
// On small screens, CTA links take visitors straight to the question.
document.querySelectorAll('a[href="#quiz"]').forEach(link=>link.addEventListener('click',event=>{
 if(window.matchMedia('(max-width:900px)').matches){event.preventDefault();revealQuestion();}
}));
let ctaFrame=0;
function updateMobileCTA(){
 ctaFrame=0;
 const primary=document.querySelector('.hero-copy .button').getBoundingClientRect();
 const quiz=document.getElementById('quiz').getBoundingClientRect();
 const footer=document.querySelector('.footer').getBoundingClientRect();
 const focusedField=document.activeElement?.matches('input,textarea');
 const quizVisible=quiz.top<innerHeight&&quiz.bottom>0;
 mobileCTA.classList.toggle('is-hidden',primary.bottom>0||quizVisible||footer.top<innerHeight||focusedField);
}
function queueCTAUpdate(){if(!ctaFrame)ctaFrame=requestAnimationFrame(updateMobileCTA);}
addEventListener('scroll',queueCTAUpdate,{passive:true});
addEventListener('resize',queueCTAUpdate,{passive:true});
document.addEventListener('focusin',queueCTAUpdate);
document.addEventListener('focusout',queueCTAUpdate);
window.visualViewport?.addEventListener('resize',queueCTAUpdate);
updateMobileCTA();
