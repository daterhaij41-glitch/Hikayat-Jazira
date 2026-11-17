const stories = {
  bosphorus:{title:"ظلال البوسفور",category:"دراما وتشويق",episodes:8,year:"2026",description:"في قلب إسطنبول، تعود مهندسة معمارية إلى بيت عائلتها المطل على البوسفور بعد غياب طويل. بين رسائل قديمة وأبواب ظلت مغلقة، تكتشف أن الحكاية التي هربت منها لم تنتهِ أبداً.",image:"https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85",number:"01",tags:["موسم أول","8 حلقات","قريباً"]},
  "last-letter":{title:"الرسالة الأخيرة",category:"غموض",episodes:6,year:"2026",description:"تصل رسالة بلا توقيع إلى صحفي يبحث عن قصة اختفاء قديمة. كل سطر يقوده إلى شاهد جديد، وكل شاهد يخفي جزءاً من الحقيقة.",image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",number:"02",tags:["موسم أول","6 حلقات","قريباً"]},
  "between-two-seas":{title:"بين بحرين",category:"رومانسي",episodes:10,year:"2026",description:"لقاء عابر على شاطئ بعيد يجمع شخصين من عالمين مختلفين. وبين مدينتين وبحرين، يحاول كل منهما أن يختار الطريق الذي يشبه قلبه.",image:"https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85",number:"03",tags:["موسم أول","10 حلقات","قريباً"]},
  chronicles:{title:"دفاتر السلطان",category:"تاريخي",episodes:12,year:"2026",description:"تفتح مخطوطة منسية نافذة على حكايات القصور والأسواق والناس في زمن كانت فيه إسطنبول ملتقى الطرق والأحلام.",image:"https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85",number:"04",tags:["موسم أول","12 حلقة","قريباً"]},
  "old-neighborhood":{title:"الحي القديم",category:"دراما اجتماعية",episodes:8,year:"2026",description:"في حي عتيق تتقاطع حيوات الجيران، وتتكشف أسرار صغيرة تغيّر شكل العائلة والشارع بأكمله.",image:"https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85",number:"05",tags:["موسم أول","8 حلقات","قريباً"]},
  "room-17":{title:"الغرفة 17",category:"غموض وإثارة",episodes:6,year:"2026",description:"في فندق قديم على طرف المدينة، يكتشف موظف الاستقبال أن الغرفة 17 تظهر في سجل النزلاء رغم أنها غير موجودة في المبنى.",image:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85",number:"06",tags:["موسم أول","6 حلقات","قريباً"]}
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const modal = $("#detailModal");
const searchPanel = $("#searchPanel");
let currentStory = null;
let toastTimer;

function showToast(message){
  const toast=$("#toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2400);
}
function getSaved(){try{return JSON.parse(localStorage.getItem("hikayat-list")||"[]")}catch{return []}}
function saveList(list){try{localStorage.setItem("hikayat-list",JSON.stringify(list))}catch{showToast("تعذر حفظ القائمة على هذا الجهاز")}}
function renderWatchlist(){
  const host=$("#watchlistPreview"), saved=getSaved();
  if(!saved.length){host.className="watchlist-preview";host.innerHTML='<span class="watchlist-icon">☆</span><span>قائمتك تبدأ من هنا</span><small>اضغط على علامة النجمة في تفاصيل أي حكاية</small>';return}
  host.className="watchlist-items";
  host.innerHTML=saved.map(id=>stories[id]).filter(Boolean).map(item=>'<span class="watchlist-item">'+item.title+'</span>').join("");
}
function openStory(id){
  const story=stories[id];if(!story)return;currentStory=id;
  $("#modalImage").src=story.image;$("#modalImage").alt=story.title;
  $("#modalNumber").textContent=story.number;$("#modalCategory").textContent=story.category;
  $("#modalTitle").textContent=story.title;$("#modalDescription").textContent=story.description;
  $("#modalFacts").innerHTML=story.tags.map(tag=>'<span>'+tag+'</span>').join("");
  const saved=getSaved().includes(id);$("#followButton").textContent=saved?"★ في قائمتك — إزالة":"☆ أضف إلى قائمتي";
  $("#episodes").classList.remove("visible");
  $("#episodes").innerHTML='<h3>حلقات الموسم الأول</h3>'+Array.from({length:story.episodes},(_,i)=>'<div class="episode-row"><span>الحلقة '+(i+1)+' — '+(i===0?"بداية الحكاية":"تطورات جديدة")+'</span><span>قريباً</span></div>').join("");
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
}
function closeStory(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
function filterCards(term){
  let shown=0;
  $$(".series-card").forEach(card=>{
    const match=term==="all"||card.dataset.category===term;
    card.hidden=!match;if(match)shown++;
  });
  $("#emptyState").hidden=shown!==0;
  $$(".filter-chip").forEach(btn=>btn.classList.toggle("selected",btn.dataset.filter===term));
}
$$("[data-open]").forEach(btn=>btn.addEventListener("click",()=>openStory(btn.dataset.open)));
$$(".filter-chip").forEach(btn=>btn.addEventListener("click",()=>filterCards(btn.dataset.filter)));
$("#modalClose").addEventListener("click",closeStory);
modal.addEventListener("click",e=>{if(e.target===modal)closeStory()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeStory();searchPanel.classList.remove("open");searchPanel.setAttribute("aria-hidden","true")}});
$("#followButton").addEventListener("click",()=>{
  if(!currentStory)return;let saved=getSaved();
  if(saved.includes(currentStory)){saved=saved.filter(id=>id!==currentStory);showToast("أزيلت الحكاية من قائمتك")}
  else{saved.push(currentStory);showToast("أضيفت الحكاية إلى قائمتك")}
  saveList(saved);$("#followButton").textContent=saved.includes(currentStory)?"★ في قائمتك — إزالة":"☆ أضف إلى قائمتي";renderWatchlist();
});
$("#trailerButton").addEventListener("click",()=>$("#episodes").classList.toggle("visible"));
$("#searchToggle").addEventListener("click",()=>{searchPanel.classList.add("open");searchPanel.setAttribute("aria-hidden","false");setTimeout(()=>$("#searchInput").focus(),80)});
$("#closeSearch").addEventListener("click",()=>{searchPanel.classList.remove("open");searchPanel.setAttribute("aria-hidden","true")});
searchPanel.addEventListener("click",e=>{if(e.target===searchPanel){searchPanel.classList.remove("open");searchPanel.setAttribute("aria-hidden","true")}});
$("#searchInput").addEventListener("input",e=>{
  const q=e.target.value.trim().toLowerCase();let shown=0;
  $$(".series-card").forEach(card=>{
    const story=stories[card.dataset.id];const text=(story.title+" "+story.category+" "+story.description).toLowerCase();
    card.hidden=q!==""&&!text.includes(q);if(!card.hidden)shown++;
  });
  $("#emptyState").hidden=shown!==0;
  $$(".filter-chip").forEach(btn=>btn.classList.remove("selected"));
  if(q==="")filterCards("all");
  if(q!=="" )$("#series").scrollIntoView({behavior:"smooth",block:"start"});
});
$("#menuToggle").addEventListener("click",()=>{
  const nav=$("#mainNav"),open=nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded",String(open));
});
$$(".main-nav a").forEach(link=>link.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false")}));
renderWatchlist();