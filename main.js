/**
 * RAMOS INDUSTRIAIS — main.js
 * 1. Utilitários
 * 2. Preloader (porta de aço)
 * 3. Animações ScrollTrigger (engrenagens + parallax)
 * 4. Reveal de cards (IntersectionObserver)
 * 5. Feedback mecânico nos botões
 */

/* ── 1. UTILITÁRIOS ── */
document.getElementById('year').textContent = new Date().getFullYear();

function waitForGSAP(callback, attempts = 0) {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    callback();
  } else if (attempts < 30) {
    setTimeout(() => waitForGSAP(callback, attempts + 1), 100);
  } else {
    showContentWithoutAnimation();
  }
}

function showContentWithoutAnimation() {
  const preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
  document.body.style.overflow = '';
  document.querySelectorAll('[data-reveal], .unidade-card, .missao__item').forEach(el => {
    el.classList.add('is-visible');
  });
}

/* ── 2. PRELOADER — porta de aço subindo ── */
function initPreloader() {
  document.body.style.overflow = 'hidden';

  const doorTop    = document.querySelector('.preloader__door--top');
  const doorBottom = document.querySelector('.preloader__door--bottom');
  const logo       = document.querySelector('.preloader__logo');
  const preloader  = document.getElementById('preloader');

  if (!doorTop || !preloader) { showContentWithoutAnimation(); return; }

  const tl = gsap.timeline();

  // Logo entra
  tl.from(logo, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'back.out(1.7)' });

  // Pausa simulando carregamento
  tl.to(logo, { duration: 0.8 });

  // Porta sobe (top) e desce (bottom) ao mesmo tempo
  tl.to(doorTop,    { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, '+=0');
  tl.to(doorBottom, { yPercent:  100, duration: 0.7, ease: 'power3.inOut' }, '<');
  tl.to(logo,       { opacity: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }, '<+=0.1');

  // Remove preloader e libera scroll
  tl.call(() => {
    preloader.style.display = 'none';
    document.body.style.overflow = '';
    initScrollAnimations();
  });
}

/* ── 3. SCROLL ANIMATIONS ── */
function initScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  /* Engrenagens hero giram com scroll */
  document.querySelectorAll('.hero__bg-gear').forEach((gear, i) => {
    gsap.to(gear, {
      rotation: i % 2 === 0 ? 360 : -360,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });

  /* Engrenagem da seção unidades */
  const uGear = document.querySelector('.unidades .unidades__gear');
  if (uGear) {
    gsap.to(uGear, {
      rotation: -180,
      ease: 'none',
      scrollTrigger: { trigger: '.unidades', start: 'top bottom', end: 'bottom top', scrub: 2 }
    });
  }

  /* Engrenagem da missão */
  const mGear = document.querySelector('.missao .unidades__gear');
  if (mGear) {
    gsap.to(mGear, {
      rotation: 120,
      ease: 'none',
      scrollTrigger: { trigger: '.missao', start: 'top bottom', end: 'bottom top', scrub: 2 }
    });
  }

  /* Parallax leve no conteúdo do hero */
  gsap.to('.hero__content', {
    y: 60,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* Header ganha borda vermelha ao rolar */
  const header = document.querySelector('.site-header');
  ScrollTrigger.create({
    start: 80,
    onEnter:     () => { header.style.borderBottomColor = 'rgba(204,0,0,0.25)'; },
    onLeaveBack: () => { header.style.borderBottomColor = 'rgba(255,255,255,0.08)'; }
  });
}

/* ── 4. REVEAL DE CARDS (IntersectionObserver) ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.revealDelay || 0) * 1000;
        setTimeout(() => entry.target.classList.add('is-visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  /* Cards de setores — delay escalonado por posição no grid */
  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.dataset.revealDelay = (i % 4) * 0.12;
    observer.observe(el);
  });

  /* Cards de unidade */
  document.querySelectorAll('.unidade-card').forEach((el, i) => {
    el.dataset.revealDelay = i * 0.18;
    observer.observe(el);
  });

  /* Missão/Visão */
  document.querySelectorAll('.missao__item').forEach((el, i) => {
    el.dataset.revealDelay = i * 0.15;
    observer.observe(el);
  });
}

/* ── 5. FEEDBACK MECÂNICO NOS BOTÕES ── */
function initButtonFeedback() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {

      // Vibração mobile (40ms = impacto curto)
      if (navigator.vibrate) navigator.vibrate(40);

      // Ripple no ponto exato do clique
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      Object.assign(ripple.style, {
        position:        'absolute',
        left:            (e.clientX - rect.left) + 'px',
        top:             (e.clientY - rect.top)  + 'px',
        transform:       'translate(-50%, -50%) scale(0)',
        width:           '80px',
        height:          '80px',
        borderRadius:    '50%',
        backgroundColor: 'rgba(255,255,255,0.15)',
        pointerEvents:   'none',
        zIndex:          '0'
      });

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      if (typeof gsap !== 'undefined') {
        gsap.to(ripple, { scale: 3, opacity: 0, duration: 0.4, ease: 'power2.out', onComplete: () => ripple.remove() });
      } else {
        setTimeout(() => ripple.remove(), 400);
      }
    });
  });
}

/* ── INICIALIZAÇÃO ── */
// Reveal roda imediatamente (não depende do GSAP)
initReveal();
initButtonFeedback();

// Preloader e scroll animations dependem do GSAP
waitForGSAP(() => initPreloader());

/* ── 6. MODAL DE ESCOLHA DE UNIDADE ── */
/*
  Fluxo:
  1. Qualquer botão [data-open-modal] abre o modal
  2. Usuário escolhe Tabuleiro ou Limoeiro
  3. window.open() abre o WhatsApp em nova aba
  4. Modal fecha automaticamente após a escolha

  Links de WhatsApp como placeholders "#" por enquanto.
  Substitua as constantes WA_TABULEIRO e WA_LIMOEIRO quando quiser.
*/
function initModal() {
  // ── Links (troque aqui quando tiver os números definitivos)
  const WA_TABULEIRO = 'https://wa.me/5588981808861';
  const WA_LIMOEIRO  = 'https://wa.me/5588999514292';

  // ── Elementos
  const modal    = document.getElementById('modal-unidade');
  const backdrop = document.getElementById('modal-backdrop');
  const btnClose = document.getElementById('modal-close');
  const btnTab   = document.getElementById('btn-tabuleiro');
  const btnLim   = document.getElementById('btn-limoeiro');

  if (!modal) return;

  // Abre o modal
  function openModal() {
    modal.removeAttribute('aria-hidden');
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden'; // trava o scroll da página
    // Foca o primeiro botão de opção para acessibilidade
    setTimeout(() => btnTab && btnTab.focus(), 100);
  }

  // Fecha o modal
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  // Redireciona para o WhatsApp em nova aba e fecha o modal
  function goToWhatsApp(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
    closeModal();
  }

  // Todos os botões [data-open-modal] disparam o modal
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  // Fechar: botão X
  btnClose.addEventListener('click', closeModal);

  // Fechar: clicar no backdrop (fora da caixa)
  backdrop.addEventListener('click', closeModal);

  // Fechar: tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });

  // Escolha: Tabuleiro
  btnTab.addEventListener('click', () => goToWhatsApp(WA_TABULEIRO));

  // Escolha: Limoeiro
  btnLim.addEventListener('click', () => goToWhatsApp(WA_LIMOEIRO));
}

// Chama junto com os outros inits
initModal();

/* ── 7. SCROLL SUAVE — botões que levam para #unidades ── */
function initScrollButtons() {
  const target = document.getElementById('unidades');
  if (!target) return;

  // Botão do header "Pedir Orçamento"
  const btnHeader = document.getElementById('btn-header-orcamento');
  if (btnHeader) {
    btnHeader.addEventListener('click', () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Botão do hero "Fale Conosco"
  const btnFale = document.getElementById('btn-fale-conosco');
  if (btnFale) {
    btnFale.addEventListener('click', () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

/* ── 8. MICRO-ANIMAÇÕES GSAP — novos elementos ── */
function initNewElementAnimations() {
  // Pulso periódico no botão "Pedir Orçamento" do header
  // Chama atenção sem ser intrusivo — pulsa a cada 4s
  const btnHeader = document.getElementById('btn-header-orcamento');
  if (btnHeader && typeof gsap !== 'undefined') {
    // Aguarda 2s para não competir com o preloader
    setTimeout(() => {
      gsap.to(btnHeader, {
        boxShadow: '0 3px 0 rgba(0,0,0,.5), 0 0 28px rgba(204,0,0,.7)',
        scale: 1.05,
        duration: 0.4,
        ease: 'power2.out',
        yoyo: true,
        repeat: -1,        // infinito
        repeatDelay: 3.5,  // pausa entre pulsos
      });
    }, 2000);
  }

  // Marca d'água: rotação lenta e contínua do SVG vetorial
  const watermark = document.querySelector('.hero__watermark-svg');
  if (watermark && typeof gsap !== 'undefined') {
    gsap.to(watermark, {
      rotation: 360,
      duration: 90,        // 90s por volta — imperceptível mas vivo
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    });

    // Parallax: watermark sobe mais devagar que o conteúdo
    gsap.to(watermark, {
      y: 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2.5,
      },
    });
  }

  // Sociais do hero: entrada escalonada após o preloader
  const heroSocials = document.querySelectorAll('.hero__social-link');
  if (heroSocials.length && typeof gsap !== 'undefined') {
    gsap.from(heroSocials, {
      opacity: 0,
      y: 14,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out',
      delay: 1.6,           // depois que o preloader termina (~1.5s)
    });
  }

  // Botão "Fale Conosco": entrada suave
  const btnFale = document.getElementById('btn-fale-conosco');
  if (btnFale && typeof gsap !== 'undefined') {
    gsap.from(btnFale, {
      opacity: 0,
      y: 20,
      scale: 0.95,
      duration: 0.6,
      ease: 'back.out(1.4)',
      delay: 1.3,
    });
  }
}

/* ── Registra os novos inits ── */
initScrollButtons();

// Os que dependem do GSAP ficam no waitForGSAP
waitForGSAP(() => {
  // ScrollTrigger já registrado pelo initScrollAnimations anterior
  // Apenas adiciona as novas animações
  initNewElementAnimations();
});

/* ── 9. LOGOS ESPALHADAS — animações ScrollTrigger por seção ── */
function initSectionLogos() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* ── SETORES: logo gira no sentido horário conforme rola ── */
  const logoSetores = document.querySelector('.section-logo--setores');
  if (logoSetores) {
    gsap.to(logoSetores, {
      rotation: '+=40',        // acumula 40° conforme o usuário rola
      scale: 1.08,
      ease: 'none',
      scrollTrigger: {
        trigger: '.setores',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.8,
      }
    });
    // Fade in ao entrar na viewport
    gsap.from(logoSetores, {
      opacity: 0,
      scale: 0.7,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.setores',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }

  /* ── MARCAS: logo pulsa levemente (scale) com scroll ── */
  const logoMarcas = document.querySelector('.section-logo--marcas');
  if (logoMarcas) {
    gsap.to(logoMarcas, {
      rotation: '-=25',
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.marcas',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      }
    });
    gsap.from(logoMarcas, {
      opacity: 0,
      scale: 1.4,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.marcas',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  /* ── MISSÃO: logo flutua verticalmente (parallax vertical suave) ── */
  const logoMissao = document.querySelector('.section-logo--missao');
  if (logoMissao) {
    gsap.to(logoMissao, {
      y: -60,
      rotation: '+=15',
      ease: 'none',
      scrollTrigger: {
        trigger: '.missao',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
    gsap.from(logoMissao, {
      opacity: 0,
      x: -80,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.missao',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  /* ── UNIDADES: logo entra da direita e gira no sentido anti-horário ── */
  const logoUnidades = document.querySelector('.section-logo--unidades');
  if (logoUnidades) {
    gsap.to(logoUnidades, {
      y: -50,
      rotation: '-=20',
      ease: 'none',
      scrollTrigger: {
        trigger: '.unidades',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
    gsap.from(logoUnidades, {
      opacity: 0,
      x: 100,
      duration: 1.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.unidades',
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }

  /* ── FOOTER LOGO: rotação contínua suave no hover (já tem CSS)
        + entrada com bounce ao scrollar para o footer ── */
  const logoFooter = document.querySelector('.footer__logo-anim');
  if (logoFooter) {
    gsap.from(logoFooter, {
      opacity: 0,
      scale: 0.5,
      rotation: -30,
      duration: 0.8,
      ease: 'back.out(1.6)',
      scrollTrigger: {
        trigger: '.site-footer',
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });
  }
}

/* ── Chama após GSAP carregar ── */
waitForGSAP(() => {
  initSectionLogos();
});
