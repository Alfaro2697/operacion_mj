/*
  Operación MJ
  Archivo: script.js
  Contiene la lógica del quiz, carta, música, propuesta,
  contador y galería/reel final.
*/

const quiz = [
  {q:"¿Cuál es el nombre de mi mamá?",correct:"Lorena",options:["Lorena","Nela","Silvia","Rosa"],word:"THWIP!",message:"Archivo familiar verificado. Sí eres MJ. 🕸️",effect:"web"},
  {q:"¿Dónde fue nuestra primera cita?",correct:"Nación Sushi",options:["Nación Sushi","Ramen Saki","Autogrill","Sentido Norte"],word:"FLASHBACK!",message:"Memoria desbloqueada: primera cita confirmada. 🍣❤️",effect:"flash"},
  {q:"¿Cuál es mi comida favorita?",correct:"Carne",options:["Carne","Pizza","Hamburguesas","Sushi"],word:"KAPOW!",message:"Respuesta correcta. El sistema detecta hambre. 🥩😂",effect:"spark"},
  {q:"¿Cómo se llama mi sobrino menor?",correct:"Thiago",options:["Thiago","Yahel","Amanda","Yassiel"],word:"SPIDER-SENSE!",message:"Sentido arácnido activado: Thiago confirmado. 🕷️",effect:"radar"},
  {q:"¿En qué trabaja mi hermano?",correct:"Dentista",options:["Muebles","Construcción","Dentista","Ing. industrial"],word:"BAM!",message:"Profesión confirmada. Sonrisa aprobada por el sistema. 🦷✨",effect:"flash"},
  {q:"¿Cuál es la batiseñal?",correct:"🤟",options:["🤟","👍","✌️","😂"],word:"THWIP!",message:"Batiseñal correcta. Identidad totalmente confirmada. 🕷️",effect:"web"}
];

let currentQuestion=0;
let noCount=0;

function shuffle(arr){
  const copy=[...arr];
  for(let i=copy.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]]=[copy[j],copy[i]];
  }
  return copy;
}


let musicStarted = false;
let musicFadeTimer = null;

function startBackgroundMusic(){
  const audio = document.getElementById('bgMusic');
  const button = document.getElementById('musicToggle');
  if(!audio) return;

  if(button) button.classList.add('visible');

  if(musicStarted){
    if(audio.paused){
      audio.play().catch(()=>{});
      if(button) button.classList.remove('paused');
    }
    return;
  }

  musicStarted = true;
  audio.volume = 0;

  const playPromise = audio.play();
  if(playPromise && typeof playPromise.catch === 'function'){
    playPromise.catch(() => {
      musicStarted = false;
      if(button) button.classList.add('paused');
    });
  }

  clearInterval(musicFadeTimer);
  let volume = 0;
  musicFadeTimer = setInterval(() => {
    volume = Math.min(0.32, volume + 0.02);
    audio.volume = volume;
    if(volume >= 0.32){
      clearInterval(musicFadeTimer);
      musicFadeTimer = null;
    }
  }, 90);
}

function toggleMusic(){
  const audio = document.getElementById('bgMusic');
  const button = document.getElementById('musicToggle');
  if(!audio) return;

  if(audio.paused){
    audio.play().catch(()=>{});
    if(button) button.classList.remove('paused');
  }else{
    audio.pause();
    if(button) button.classList.add('paused');
  }
}

let letterOpened = false;

function openLetter(){
  const wrap = document.getElementById('envelopeWrap');
  const scene = document.getElementById('letterScene');
  if(!wrap) return;

  startBackgroundMusic();

  if(!letterOpened){
    letterOpened = true;
    wrap.classList.add('open');
    if(scene) scene.classList.add('opened');
  }
}

function resetLetter(){
  letterOpened = false;
  const wrap = document.getElementById('envelopeWrap');
  const scene = document.getElementById('letterScene');
  if(wrap) wrap.classList.remove('open');
  if(scene) scene.classList.remove('opened');
}

function showOnly(id){
  document.querySelectorAll('.screen').forEach(x=>{
    x.classList.remove('active');
    x.style.display = 'none';
  });
  const target = document.getElementById(id);
  if(target){
    target.classList.add('active');
    target.style.display = 'flex';
  }
  if(id === 'verified') resetLetter();
}
function startQuiz(){
  currentQuestion=0;
  showOnly('quiz');
  renderQuestion();
}
function renderQuestion(){
  const item=quiz[currentQuestion];
  document.getElementById('questionText').textContent=item.q;
  document.getElementById('feedback').innerHTML="";
  document.getElementById('counter').textContent=`PRUEBA ${currentQuestion+1} / ${quiz.length}`;

  const container=document.getElementById('options');
  container.innerHTML="";
  shuffle(item.options).forEach(opt=>{
    const b=document.createElement('button');
    b.className="option";
    b.textContent=opt;
    b.onclick=()=>checkAnswer(opt);
    container.appendChild(b);
  });
}
function checkAnswer(answer){
  const item=quiz[currentQuestion];
  const feedback=document.getElementById('feedback');
  const card=document.getElementById('quizCard');

  if(answer===item.correct){
    document.querySelectorAll('#options button').forEach(b=>b.disabled=true);
    feedback.innerHTML='<span class="correct">✅ Correcto.</span>';
    playComicEffect(item,()=>{
      currentQuestion++;
      if(currentQuestion<quiz.length) renderQuestion();
      else showOnly('verified');
    });
  }else{
    feedback.innerHTML='<span class="retryBubble">❌ Intenta de nuevo</span>';
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
  }
}
function playComicEffect(item,onDone){
  const layer=document.getElementById('comicLayer');
  const word=document.getElementById('comicWord');
  const bubble=document.getElementById('comicBubble');
  const flash=document.getElementById('flash');
  const webshot=document.getElementById('webshot');
  const radar=document.getElementById('radar');
  const spark=document.getElementById('spark');

  word.textContent=item.word;
  bubble.textContent=item.message;
  layer.classList.add('show');

  [flash,webshot,radar,spark].forEach(el=>el.classList.remove('go'));
  void document.body.offsetWidth;

  if(item.effect==="flash") flash.classList.add('go');
  if(item.effect==="web") webshot.classList.add('go');
  if(item.effect==="radar") radar.classList.add('go');
  if(item.effect==="spark") spark.classList.add('go');

  setTimeout(()=>{
    layer.classList.remove('show');
    [flash,webshot,radar,spark].forEach(el=>el.classList.remove('go'));
    onDone();
  },1500);
}


let proposalTimers = [];

function clearProposalTimers(){
  proposalTimers.forEach(t => clearTimeout(t));
  proposalTimers = [];
}

function setProposalFrame(index){
  const frames = Array.from(document.querySelectorAll('.proposalRefFrame'));
  frames.forEach((frame, i) => {
    frame.classList.toggle('active', i === index);
  });
}

function startProposal(){
  showOnly('proposal');
  noCount=0;

  const noText=document.getElementById('noText');
  const noBtn=document.getElementById('noBtn');
  const speech=document.getElementById('proposalSpeech');
  const video=document.getElementById('proposalVideo');

  if(noText) noText.textContent="";
  if(noBtn) noBtn.style.transform="none";
  if(speech) speech.classList.remove('visible');

  if(video){
    video.pause();
    video.currentTime=0;

    const reveal=()=>{
      if(speech) speech.classList.add('visible');
    };

    video.onended=reveal;
    video.play().catch(()=>{
      reveal();
    });

    setTimeout(reveal,6100);
  }else if(speech){
    speech.classList.add('visible');
  }
}

function nope(){
  noCount++;
  const messages=[
    '¿NO? 🤨 El sentido arácnido dice que ese botón fue un accidente.',
    'Hmm... la telaraña detecta dudas 😂',
    'Última revisión... ¿segura? 👀',
    'Está bien ❤️. El NO también funciona y se respeta.'
  ];
  document.getElementById('noText').textContent=messages[Math.min(noCount-1,messages.length-1)];
  const b=document.getElementById('noBtn');
  if(noCount<4){
    b.style.transform=`translate(${Math.random()*48-24}px,${Math.random()*16-8}px)`;
  }else{
    b.style.transform='none';
  }
}

function yes(){
  const success = document.getElementById('success');
  if(!success) return;

  // Guarda/arranca contador
  startLoveCounter();

  // Muestra la pantalla final de forma forzada
  showOnly('success');

  // Reinicia animaciones visuales
  success.classList.remove('show-memories');
  void success.offsetWidth;
  success.classList.add('show-memories');

  // Asegura que la primera foto aparezca y arranque el reel
  trendIndex = 0;
  buildTrendProgress();
  showTrend(0, true);
  restartTrendTimer();

  // Lleva arriba de la sección
  success.scrollTop = 0;
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  window.scrollTo({top: 0, behavior: 'smooth'});

  // Confetti
  for(let i=0;i<38;i++){
    const c=document.createElement('div');
    c.className='confetti';
    c.textContent=Math.random()>.5?'❤️':'🕸️';
    c.style.left=Math.random()*100+'vw';
    c.style.animationDelay=Math.random()*.8+'s';
    c.style.fontSize=(15+Math.random()*18)+'px';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),4200);
  }
}



let trendIndex = 0;
let trendTimer = null;
let trendProgressBuilt = false;
const TREND_DURATION = 5000;

function buildTrendProgress(){
  if(trendProgressBuilt) return;
  const slides = Array.from(document.querySelectorAll('.trendSlide'));
  const bar = document.getElementById('trendProgress');
  if(!bar || !slides.length) return;

  bar.innerHTML = '';
  slides.forEach((_, index) => {
    const seg = document.createElement('div');
    seg.className = 'trendProgressSegment';
    seg.innerHTML = '<div class="trendProgressFill"></div>';
    seg.onclick = () => showTrend(index, true);
    bar.appendChild(seg);
  });

  trendProgressBuilt = true;
}

function showTrend(index, resetTimer=false){
  const slides = Array.from(document.querySelectorAll('.trendSlide'));
  const segments = Array.from(document.querySelectorAll('.trendProgressSegment'));
  if(!slides.length) return;

  trendIndex = (index + slides.length) % slides.length;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === trendIndex);

    // Reinicia la animación de movimiento de la foto al volver a activarla.
    if(i === trendIndex){
      const photo = slide.querySelector('.trendPhoto');
      if(photo){
        photo.style.animation = 'none';
        void photo.offsetWidth;
        photo.style.animation = '';
      }
    }
  });

  segments.forEach((segment, i) => {
    segment.classList.remove('active','done');
    if(i < trendIndex) segment.classList.add('done');
    if(i === trendIndex){
      void segment.offsetWidth;
      segment.classList.add('active');
    }
  });

  if(resetTimer) restartTrendTimer();
}

function restartTrendTimer(){
  if(trendTimer) clearInterval(trendTimer);
  trendTimer = setInterval(() => {
    const slides = document.querySelectorAll('.trendSlide');
    if(!slides.length) return;
    showTrend((trendIndex + 1) % slides.length);
  }, TREND_DURATION);
}

function nextTrend(){
  showTrend(trendIndex + 1, true);
}

function prevTrend(){
  showTrend(trendIndex - 1, true);
}

function startTrendFinale(){
  buildTrendProgress();
  showTrend(0);
  restartTrendTimer();
}

let loveCounterInterval = null;
let fallbackLoveStart = null;
const LOVE_START_KEY = 'operacion_mj_noviazgo_inicio';

function getOrCreateLoveStart(){
  try{
    let stored = localStorage.getItem(LOVE_START_KEY);
    if(!stored){
      stored = String(Date.now());
      localStorage.setItem(LOVE_START_KEY, stored);
    }
    const value = Number(stored);
    if(Number.isFinite(value) && value > 0) return value;
  }catch(e){}
  if(!fallbackLoveStart) fallbackLoveStart = Date.now();
  return fallbackLoveStart;
}

function updateLoveCounter(startTime){
  const elapsed = Math.max(0, Date.now() - startTime);
  const totalSeconds = Math.floor(elapsed / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if(el) el.textContent = value;
  };

  setText('loveDays', days);
  setText('loveHours', String(hours).padStart(2,'0'));
  setText('loveMinutes', String(minutes).padStart(2,'0'));
  setText('loveSeconds', String(seconds).padStart(2,'0'));
}

function startLoveCounter(){
  const startTime = getOrCreateLoveStart();
  if(loveCounterInterval) clearInterval(loveCounterInterval);
  updateLoveCounter(startTime);
  loveCounterInterval = setInterval(() => updateLoveCounter(startTime), 1000);
}

let taps=0;
function secret(){
  taps++;
  if(taps===5){
    alert('🕷️ Easter egg desbloqueado:\nBernald estuvo programando esto más tiempo del que quiere admitir. 😂');
  }
}