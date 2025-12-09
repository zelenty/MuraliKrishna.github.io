// Basic interactive & animation logic (vanilla JS)
// HERO CANVAS: floating organic blobs
(function heroCanvas(){
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = Math.max(420, window.innerHeight * 0.6);
  const blobs = [];
  const colors = ['rgba(77,224,255,0.12)','rgba(176,123,255,0.08)','rgba(77,224,255,0.08)'];

  function rand(min,max){ return Math.random()*(max-min)+min; }
  for(let i=0;i<8;i++){
    blobs.push({
      x: rand(0,w), y: rand(0,h),
      r: rand(60,220),
      vx: rand(-0.2,0.2), vy: rand(-0.15,0.15),
      c: colors[i%colors.length], phase: Math.random()*Math.PI*2
    });
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    blobs.forEach(b=>{
      b.x += b.vx + Math.sin(b.phase)*0.1;
      b.y += b.vy + Math.cos(b.phase)*0.08;
      b.phase += 0.003;
      // Wrap
      if(b.x < -b.r) b.x = w + b.r;
      if(b.x > w + b.r) b.x = -b.r;
      if(b.y < -b.r) b.y = h + b.r;
      if(b.y > h + b.r) b.y = -b.r;
      // draw soft radial
      const grad = ctx.createRadialGradient(b.x, b.y, b.r*0.1, b.x, b.y, b.r);
      grad.addColorStop(0, b.c);
      grad.addColorStop(1, 'rgba(12,15,20,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', ()=>{ w = canvas.width = window.innerWidth; h = canvas.height = Math.max(420, window.innerHeight * 0.6); });
})();

// Reveal timeline and animate skill meters
(function revealOnScroll(){
  const tlItems = Array.from(document.querySelectorAll('.tl-item'));
  const meters = Array.from(document.querySelectorAll('.meter div'));
  const skills = document.querySelectorAll('.skill');

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
      }
    });
  }, {threshold: 0.2});

  tlItems.forEach(i=>obs.observe(i));

  // skill meters
  const skillObserver = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const meter = entry.target.querySelector('.meter div');
        if(meter && !meter.dataset.animated){
          meter.style.width = meter.style.width || meter.getAttribute('data-w') || meter.style.width;
          meter.dataset.animated = "1";
        }
      }
    });
  }, {threshold: 0.25});

  document.querySelectorAll('.skill').forEach(s=>{
    const m = s.querySelector('.meter div');
    // keep width inline with styles used in HTML
    // if not set, ignore
    skillObserver.observe(s);
  });

  // Initialize meter widths from inline style attr (already set in HTML)
  document.querySelectorAll('.meter div').forEach(m=>{
    const w = m.style.width || m.getAttribute('data-w') || '0%';
    m.style.width = '0%';
    // set data target
    m.setAttribute('data-target', w);
  });

  // when skill section visible, animate to target
  const skillsSection = document.getElementById('skills');
  if(skillsSection){
    const sObs = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          document.querySelectorAll('.meter div').forEach(m=>{
            const target = m.getAttribute('data-target') || m.style.width || '80%';
            setTimeout(()=> m.style.width = target, 80);
          });
        }
      });
    }, {threshold: 0.2});
    sObs.observe(skillsSection);
  }
})();

// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(href.length>1){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
