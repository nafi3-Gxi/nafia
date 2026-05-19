/*
================================================================================
  NovaPay — Modern Financial Platform
  Template: templatemo-623-novapay
  JavaScript
  Designed by TemplateMo  (https://templatemo.com)

  Modules:
    1. Live ticker         — infinite CSS scroll with hover-pause
    2. Trusted-by logos    — infinite CSS scroll
    3. Nav scroll behavior — translateY snap on scroll past ticker
    4. Mobile menu         — body-scroll-lock + landscape-safe layout
    5. Stats counter       — IntersectionObserver count-up + bar fill
    6. Sticky stack        — scroll-driven feature switcher with right-panel swap
    7. Pricing toggle      — monthly / annual with dual price display
    8. FAQ                 — independent accordion + expand/collapse all
    9. Testimonials        — auto-scroll carousel with play/pause
   10. Period switcher     — dashboard time range toggle (7D/1M/3M/1Y)
   11. Silk reveals        — IntersectionObserver scroll-triggered animations
   12. Phone 3D tilt       — window-wide mouse tracking with lerp easing
================================================================================
*/

const logos=['الشبكة','اختراق','ادوات','كتب تعلميه','لينكس','كورسات','فحص','تيرمنال','هــكر','الأمن السيبراني','شروحات','كسر كلمة سر'];
const lt=document.getElementById('logosTrack');
[...logos,...logos].forEach(l=>{
  const el=document.createElement('div');
  el.className='logo-item';
  el.textContent=l;
  lt.appendChild(el);
});

const nav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>10);
});
window.addEventListener('load',()=>{
  document.querySelectorAll('.hero-content,.hero-visual').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('visible'),i*150+100);
  });
});

const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobileMenu');
let scrollY=0;
hamburger.addEventListener('click',()=>{
  const open=mobileMenu.classList.contains('open');
  if(open){
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.position='';
    document.body.style.top='';
    window.scrollTo({top:scrollY,behavior:'instant'});
  } else {
    scrollY=window.scrollY;
    document.body.style.position='fixed';
    document.body.style.top=`-${scrollY}px`;
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded','true');
  }
});
mobileMenu.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',()=>{
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded','false');
    document.body.style.position='';
    document.body.style.top='';
    window.scrollTo({top:scrollY,behavior:'instant'});
  });
});


function switchPeriod(btn,period){
  document.querySelectorAll('.dp-period-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const configs={
    '7d':{val:'$284,920',change:'▲ +$12,840 (4.72%) today'},
    '1m':{val:'$284,920',change:'▲ +$74,920 (35.7%) month'},
    '3m':{val:'$284,920',change:'▲ +$104,920 (58.3%) quarter'},
    '1y':{val:'$284,920',change:'▲ +$164,920 (137.4%) year'},
  };
  const c=configs[period];
  document.getElementById('dpChartVal').textContent=c.val;
  document.getElementById('dpChartChange').textContent=c.change;
}



const sparkBars=[60,75,50,90,65,85,70,95];
document.getElementById('sparkline').innerHTML=sparkBars.map(h=>`<div class="pm-spark-bar" style="height:${h}%"></div>`).join('');

const stickyCards=document.querySelectorAll('.sticky-card');
const panelViews=document.querySelectorAll('.panel-view');
const panelLabel=document.getElementById('panelLabel');
const panelLabels=['Transfers','Analytics','Multi-currency','Security'];
stickyCards.forEach((card,i)=>{
  card.addEventListener('click',()=>{
    stickyCards.forEach(c=>c.classList.remove('active'));
    panelViews.forEach(p=>p.classList.remove('active'));
    card.classList.add('active');
    document.getElementById('panel-'+i).classList.add('active');
    panelLabel.textContent=panelLabels[i];
  });
});

const observer=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      stickyCards.forEach((card,i)=>{
        const rect=card.getBoundingClientRect();
        const viewH=window.innerHeight;
        if(rect.top<viewH*0.6&&rect.bottom>viewH*0.3){
          stickyCards.forEach(c=>c.classList.remove('active'));
          panelViews.forEach(p=>p.classList.remove('active'));
          card.classList.add('active');
          document.getElementById('panel-'+i).classList.add('active');
          panelLabel.textContent=panelLabels[i];
        }
      });
    }
  });
},{threshold:0.3});
stickyCards.forEach(c=>observer.observe(c));

const statNums=document.querySelectorAll('.stat-num[data-target]');
const statsObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;
      const target=parseFloat(el.dataset.target);
      const suffix=el.dataset.suffix||'';
      const decimal=parseInt(el.dataset.decimal)||0;
      const prefix=el.dataset.prefix||'';
      let start=0,duration=1800,startTime=null;
      function animate(ts){
        if(!startTime)startTime=ts;
        const progress=Math.min((ts-startTime)/duration,1);
        const ease=1-Math.pow(1-progress,3);
        const val=start+(target-start)*ease;
        el.textContent=prefix+(decimal?val.toFixed(decimal):Math.round(val))+suffix;
        if(progress<1)requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      const bar=el.closest('.stat-block').querySelector('.stat-bar');
      if(bar){setTimeout(()=>{bar.style.width=bar.dataset.width;},200);}
      statsObs.unobserve(el);
    }
  });
},{threshold:0.5});
statNums.forEach(el=>statsObs.observe(el));

let isAnnual=false;
function togglePricing(){
  isAnnual=!isAnnual;
  document.getElementById('pricingToggle').classList.toggle('on',isAnnual);
  document.querySelectorAll('.price-num').forEach(el=>{
    el.textContent=isAnnual?el.dataset.annual:el.dataset.monthly;
  });
  document.querySelectorAll('.period-label').forEach(el=>{
    el.textContent=isAnnual?'annually':'monthly';
  });
  document.querySelectorAll('.price-alt-monthly').forEach(el=>{
    el.style.display=isAnnual?'none':'inline';
  });
  document.querySelectorAll('.price-alt-annual').forEach(el=>{
    el.style.display=isAnnual?'inline':'none';
  });
}

// مصفوفة الأسئلة الشائعة الخاصة بالأمن السيبراني
const faqs = [
  {
    q: 'ما هو الأمن السيبراني وما هي أهميته؟',
    a: 'الأمن السيبراني هو ممارسة حماية الأنظمة والشبكات والبرامج من الهجمات الرقمية. تكمن أهميته في حماية البيانات الحساسة، الهويات الرقمية، والأنظمة التشغيلية من السرقة أو التخريب.'
  },
  {
    q: 'كيف يمكنني حماية حساباتي الشخصية من الاختراق؟',
    a: 'من خلال استخدام كلمات مرور قوية وفريدة لكل حساب، تفعيل المصادقة الثنائية (2FA) دائماً، وتجنب الضغط على الروابط المشبوهة أو تحميل ملفات من مصادر غير موثوقة.'
  },
  {
    q: 'ما هو التصيد الاحتيالي (Phishing) وكيف أتجنبه؟',
    a: 'هو أسلوب يتبعه المخترقون لخداعك بهدف الحصول على معلومات سرية مثل كلمات المرور أو بيانات بطاقات الائتمان عبر رسائل بريد أو روابط مزيفة. لتجنبه، تحقق دائماً من بريد المرسل ورابط الموقع الرسمي قبل إدخال أي بيانات.'
  },
  {
    q: 'هل برامج مكافحة الفيروسات المجانية كافية لحمايتي؟',
    a: 'توفر البرامج المجانية حماية أساسية ضد الفيروسات المعروفة، ولكن النسخ المدفوعة أو الأنظمة المتكاملة توفر جدران حماية متقدمة، حماية من برمجيات الفدية (Ransomware)، وتحديثات أمنية فورية للتصدي للثغرات الجديدة.'
  },
  {
    q: 'ما هي المصادقة الثنائية (2FA) ولماذا هي ضرورية؟',
    a: 'هي طبقة أمان إضافية تطلب منك وسيلتين للتحقق من هويتك عند تسجيل الدخول (مثل كلمة المرور + رمز يصل لهاتفك). هي ضرورية لأنه حتى لو عرف المخترق كلمة مرورك، فلن يتمكن من دخول الحساب بدون الرمز الثاني.'
  },
  {
    q: 'كيف أتصرف إذا تعرض جهازي أو حسابي للاختراق؟',
    a: 'قم بفصل الجهاز عن الإنترنت فوراً، غير كلمات المرور لجميع حساباتك الأخرى من جهاز آخر آمن، فعل المصادقة الثنائية، وافحص الجهاز بأداة مكافحة فيروسات موثوقة، وإذا لزم الأمر قم بعمل نسخة احتياطية لبياناتك وأعد تهيئة الجهاز.'
  }
];

const faqList = document.getElementById('faqList');

// التحقق من وجود العنصر بالصفحة قبل التشغيل لمنع حدوث أي أخطاء برمجية
if (faqList) {
  faqs.forEach((f, i) => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    // إضافة تنسيق محاذاة النص لليمين ليتناسق مع اللغة العربية
    item.innerHTML = `
      <div class="faq-q" style="text-align: right; direction: rtl;">
        <span class="faq-q-text">${f.q}</span>
        <svg class="faq-chevron" viewBox="0 0 24 24" style="margin-right: auto; margin-left: 0;"><polyline points="6,9 12,15 18,9"/></svg>
      </div>
      <div class="faq-a" style="text-align: right; direction: rtl; line-height: 1.6;">${f.a}</div>
    `;
    
    item.querySelector('.faq-q').addEventListener('click', () => {
      item.classList.toggle('open');
    });
    
    faqList.appendChild(item);
  });
}

// دالة تفادي الخطأ لزر فتح الكل في حال تم الضغط عليه
function toggleAllFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  const label = document.getElementById('faqToggleLabel');
  const icon = document.getElementById('faqToggleIcon');
  if(!faqItems.length) return;

  // التحقق لمعرفة هل يوجد أي عنصر مغلق
  const anyClosed = Array.from(faqItems).some(item => !item.classList.contains('open'));
  
  faqItems.forEach(item => {
    if (anyClosed) {
      item.classList.add('open');
    } else {
      item.classList.remove('open');
    }
  });

  if (label) {
    label.textContent = anyClosed ? 'إغلاق الكل' : 'توسيع الكل';
  }
}

let allExpanded=false;
function toggleAllFaq(){
  allExpanded=!allExpanded;
  document.querySelectorAll('.faq-item').forEach(el=>{
    allExpanded?el.classList.add('open'):el.classList.remove('open');
  });
  document.getElementById('faqToggleLabel').textContent=allExpanded?'Collapse all':'Expand all';
  const icon=document.getElementById('faqToggleIcon');
  icon.innerHTML=allExpanded
    ?'<line x1="5" y1="12" x2="19" y2="12"/>'
    :'<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>';
}

const posts = [
  { url: 'https://www.instagram.com/p/DWgvFb4iumv/', img: '/1.jpg', likes: '77' },
  { url: 'https://www.instagram.com/p/DWeAw-6gtyS/', img: '/2.jpg', likes: '59' },
  { url: 'https://www.instagram.com/p/DWjLG_AFSyz/', img: '/3.jpg', likes: '104' },
  { url: 'https://www.instagram.com/p/DWmKTTnjSOV/', img: '/4.jpg', likes: '88' },
  { url: 'https://www.instagram.com/p/DWoZNosFDRf/', img: '/5.jpg', likes: '71' },
  { url: 'https://www.instagram.com/p/DWteYrij80u/', img: '/6.jpg', likes: '95' },
  { url: 'https://www.instagram.com/p/DWzYe4CjYOv/', img: '/7.jpg', likes: '112' },
  { url: 'https://www.instagram.com/p/DWv0EBEFNZO/', img: '/8.jpg', likes: '83' },
  { url: 'https://www.instagram.com/p/DW2EHhyAa3L/', img: '/9.jpg', likes: '76' },
  { url: 'https://www.instagram.com/p/DW4UdLljcEL/', img: '/10.jpg', likes: '69' },
  { url: 'https://www.instagram.com/p/DW_WD31jTva/', img: '/11.jpg', likes: '98' },
  { url: 'https://www.instagram.com/p/DXulFlVCZyU/', img: '/12.jpg', likes: '115' },
  { url: 'https://www.instagram.com/p/DX4gUiPFcIL/', img: '/13.jpg', likes: '87' },
  { url: 'https://www.instagram.com/p/DYU_OYQDpZr/', img: '/14.jpg', likes: '101' },
  { url: 'https://www.instagram.com/p/DYZ8zbRjUuj/', img: '/15.jpg', likes: '93' },
  { url: 'https://www.instagram.com/p/DYfGXidDYnX/', img: '/16.jpg', likes: '120' },
];
const tt=document.getElementById('testiTrack');
[...posts,...posts].forEach(p=>{
  const el=document.createElement('a');
  el.className='testi-card';
  el.href=p.url;
  el.target='_blank';
  el.rel='noopener';
  el.innerHTML=`
  <div style="position:relative;width:220px;height:320px;background:var(--bg3);overflow:hidden;">
    <img src="${p.img}" alt="Instagram post" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s var(--silk);" onerror="this.parentElement.style.background='var(--bg3)'">
    <div style="position:absolute;inset:0;background:rgba(0,0,0,.35);opacity:0;transition:opacity .3s;display:flex;align-items:center;justify-content:center;" class="post-overlay">
      <svg width="28" height="28" fill="none" stroke="#fff" stroke-width="1.8" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    </div>
  </div>`;
  el.innerHTML=`
    <div style="position:relative;aspect-ratio:1/1;background:var(--bg3);overflow:hidden;">
      <img src="${p.img}" alt="Instagram post" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s var(--silk);" onerror="this.parentElement.style.background='var(--bg3)'">
      <div style="position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;transition:opacity .3s;display:flex;align-items:center;justify-content:center;gap:6px;" class="post-overlay">
        <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <span style="color:#fff;font-family:'Outfit',sans-serif;font-weight:700;font-size:16px;">${p.likes}</span>
      </div>
    </div>`;
  el.addEventListener('mouseenter',()=>{
    el.querySelector('img').style.transform='scale(1.08)';
    el.querySelector('.post-overlay').style.opacity='1';
  });
  el.addEventListener('mouseleave',()=>{
    el.querySelector('img').style.transform='scale(1)';
    el.querySelector('.post-overlay').style.opacity='0';
  });
  tt.appendChild(el);
});

let testiPaused=false;
function toggleTestimonials(){
  testiPaused=!testiPaused;
  tt.style.animationPlayState=testiPaused?'paused':'running';
  const icon=document.getElementById('testiIcon');
  const label=document.getElementById('testiLabel');
  const btn=document.getElementById('testiToggle');
  if(testiPaused){
    icon.innerHTML='<polygon points="6,4 20,12 6,20"/>';
    label.textContent='Play';
    btn.setAttribute('aria-label','Play testimonials');
  } else {
    icon.innerHTML='<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>';
    label.textContent='Pause';
    btn.setAttribute('aria-label','Pause testimonials');
  }
}

document.getElementById('testiToggle').addEventListener('mouseenter',function(){
  this.style.borderColor='var(--sky)';
  this.style.color='var(--sky)';
});
document.getElementById('testiToggle').addEventListener('mouseleave',function(){
  this.style.borderColor='var(--border2)';
  this.style.color='var(--text2)';
});


document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(href==='#')return;
    e.preventDefault();
    const target=document.querySelector(href);
    if(target)target.scrollIntoView({behavior:'smooth'});
  });
});

const revealObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.silk-reveal,.silk-reveal-left,.silk-reveal-right').forEach((el,i)=>{
  el.style.animationDelay=(i%4)*0.08+'s';
  revealObs.observe(el);
});

const statBlocks=document.querySelectorAll('.stat-block');
statBlocks.forEach((el,i)=>{
  el.style.opacity='0';
  el.style.transform='translateY(20px)';
  el.style.transition=`opacity .8s var(--silk) ${i*0.1}s, transform .8s var(--silk) ${i*0.1}s, border-color .6s var(--silk), box-shadow .6s var(--silk)`;
});
const statObs2=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
      statObs2.unobserve(e.target);
    }
  });
},{threshold:0.2});
statBlocks.forEach(el=>statObs2.observe(el));

const sectionHeaders=document.querySelectorAll('.section-title,.section-tag,.section-sub');
sectionHeaders.forEach(el=>{
  el.style.opacity='0';
  el.style.transform='translateY(16px)';
  el.style.transition='opacity .8s var(--silk), transform .8s var(--silk)';
});
const headerObs=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity='1';
      e.target.style.transform='translateY(0)';
      headerObs.unobserve(e.target);
    }
  });
},{threshold:0.3});
sectionHeaders.forEach(el=>headerObs.observe(el));

const phoneFrame=document.getElementById('phoneFrame');
if(phoneFrame){
  let targetX=0,targetY=0,currentX=0,currentY=0,rafId=null,running=false;
  const MAX_TILT=16;
  function animate(){
    currentX+=(targetX-currentX)*.06;
    currentY+=(targetY-currentY)*.06;
    phoneFrame.style.transform=`rotateX(${currentY}deg) rotateY(${currentX}deg) translateZ(0)`;
    if(Math.abs(targetX-currentX)>.02||Math.abs(targetY-currentY)>.02){
      rafId=requestAnimationFrame(animate);
    } else {
      rafId=null;
      running=false;
    }
  }
  function kick(){
    if(!rafId){running=true;rafId=requestAnimationFrame(animate);}
  }
  window.addEventListener('mousemove',e=>{
    const x=e.clientX/window.innerWidth-.5;
    const y=e.clientY/window.innerHeight-.5;
    targetX=x*MAX_TILT*4;
    targetY=-y*MAX_TILT*2;
    kick();
  });
  window.addEventListener('mouseleave',()=>{
    targetX=0;targetY=0;
    kick();
  });
}
