/**
 * 국립국어원 공공사이트 개선 - script.js
 * Figma: 388:489 Mobile
 *
 * 기능:
 *  1. 공지 슬라이드 자동 전환 (3초, Figma: AFTER_TIMEOUT 3)
 *  2. 주제 카드 토글 (교육/참여/개선/지원 펼침)
 *  3. 메뉴 버튼 aria-expanded 토글
 *  4. 슬라이드 인디케이터 클릭
 */

(function () {
  'use strict';

  /* ============================================
     1. 공지 슬라이드 자동 전환
     Figma: AFTER_TIMEOUT 3초, SMART_ANIMATE 0.3초
     ============================================ */
  const slides = document.querySelectorAll('.news-slide');
  const dots = document.querySelectorAll('.news-dot');
  let current = 0;
  let autoTimer = null;

  function showSlide(index) {
    slides.forEach((s) => s.classList.remove('active'));
    dots.forEach((d) => {
      d.classList.remove('active');
      d.setAttribute('aria-selected', 'false');
    });
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    dots[index].setAttribute('aria-selected', 'true');
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(nextSlide, 3000); // Figma: timeout 3초
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (slides.length > 0) {
    showSlide(0);
    startAuto();

    // 인디케이터 클릭
    dots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-index'), 10);
        showSlide(idx);
        startAuto(); // 클릭 후 타이머 리셋
      });
      dot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });

    // 슬라이드 영역 터치/마우스 오버시 일시 정지
    const newsWrap = document.getElementById('news-scroll');
    if (newsWrap) {
      newsWrap.addEventListener('mouseenter', stopAuto);
      newsWrap.addEventListener('mouseleave', startAuto);
      newsWrap.addEventListener('focusin', stopAuto);
      newsWrap.addEventListener('focusout', startAuto);
    }
  }

  /* ============================================
     1-2. 히어로 배너 픽(Peek) 슬라이더 자동 전환 및 수동 조작
     ============================================ */
  const heroTrack = document.getElementById('hero-slider-track');
  if (heroTrack) {
    const heroSlides = heroTrack.querySelectorAll('.hero-slide');
    let heroCurrent = 0;
    let heroTimer = null;
    let isPlaying = true;

    // 조작 버튼들
    const btnPrev = document.getElementById('hero-prev');
    const btnNext = document.getElementById('hero-next');
    const btnToggle = document.getElementById('hero-toggle');
    const iconPlay = btnToggle ? btnToggle.querySelector('.icon-play') : null;
    const iconPause = btnToggle ? btnToggle.querySelector('.icon-pause') : null;

    function moveHeroSlide() {
      const slideWidth = heroSlides[0].offsetWidth;
      const gap = 12; // style.css 에 설정된 gap 값
      heroTrack.style.transform = `translateX(-${heroCurrent * (slideWidth + gap)}px)`;
    }

    function nextHeroSlide() {
      heroCurrent++;
      if (heroCurrent >= heroSlides.length) {
        heroCurrent = 0; // 마지막 도달 시 처음으로 복귀
      }
      moveHeroSlide();
    }

    function prevHeroSlide() {
      heroCurrent--;
      if (heroCurrent < 0) {
        heroCurrent = heroSlides.length - 1; // 처음에서 이전 누르면 마지막으로
      }
      moveHeroSlide();
    }

    function startHeroAuto() {
      if (heroTimer) clearInterval(heroTimer);
      if (isPlaying) {
        heroTimer = setInterval(nextHeroSlide, 4000);
      }
    }

    function stopHeroAuto() {
      if (heroTimer) clearInterval(heroTimer);
    }

    // 초기 실행
    startHeroAuto();
    window.addEventListener('resize', moveHeroSlide);
    
    // 버튼 이벤트 리스너
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        prevHeroSlide();
        startHeroAuto(); // 수동 조작 시 타이머 리셋
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        nextHeroSlide();
        startHeroAuto();
      });
    }

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          btnToggle.setAttribute('aria-label', '자동 재생 정지');
          btnToggle.setAttribute('data-state', 'playing');
          if (iconPlay) iconPlay.style.display = 'none';
          if (iconPause) iconPause.style.display = 'block';
          startHeroAuto();
        } else {
          btnToggle.setAttribute('aria-label', '자동 재생 시작');
          btnToggle.setAttribute('data-state', 'paused');
          if (iconPlay) iconPlay.style.display = 'block';
          if (iconPause) iconPause.style.display = 'none';
          stopHeroAuto();
        }
      });
    }
  }

  /* ============================================
     2. 주제 카드 토글
     Figma: ON_HOVER → CHANGE_TO (호버 펼침)
     모바일: 클릭으로 대체, 키보드 지원
     ============================================ */
  const themeCards = document.querySelectorAll('.theme-card');

  themeCards.forEach((card) => {
    const inner = card.querySelector('.theme-card-inner');
    if (!inner) return;

    function toggleCard() {
      const isOpen = card.classList.contains('open');
      // 다른 카드 닫기
      themeCards.forEach((c) => c.classList.remove('open'));
      if (!isOpen) card.classList.add('open');
    }

    inner.addEventListener('click', function (e) {
      e.preventDefault();
      toggleCard();
    });

    inner.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard();
      }
    });
  });

  /* ============================================
     3. 메뉴 버튼 및 오프캔버스 토글
     ============================================ */
  const menuBtn = document.getElementById('menu-toggle');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuCloseBtn = document.getElementById('menu-close');
  const fullscreenMenu = document.getElementById('fullscreen-menu');

  function openMenu() {
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', '전체 메뉴 닫기');
    }
    if (fullscreenMenu) fullscreenMenu.setAttribute('aria-hidden', 'false');
    if (menuOverlay) menuOverlay.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    document.body.classList.remove('menu-open');
    document.body.style.overflow = ''; // 배경 스크롤 복구
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', '전체 메뉴 열기');
    }
    if (fullscreenMenu) fullscreenMenu.setAttribute('aria-hidden', 'true');
    if (menuOverlay) menuOverlay.setAttribute('aria-hidden', 'true');
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      const isExpanded = document.body.classList.contains('menu-open');
      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuCloseBtn) {
    menuCloseBtn.addEventListener('click', closeMenu);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }

  /* ============================================
     4. 언어 전환 (다국어 지원)
     ============================================ */
  const translations = {
    ko: {
      "skip-main": "본문 내용 바로가기",
      "skip-menu": "주요메뉴 바로가기",
      "org-name": "국립국어원",
      "search-placeholder": "검색어를 입력하세요",
      "hero-tagline": "우리말, 우리 문화",
      "hero-title": "국어 정보의<br>모든 것이 여기에",
      "download-heading": "주요 자료 다운로드",
      "cat-save": "자료<br>저장",
      "link-save-1": "조사 자료 저장",
      "link-save-2": "언어정보나눔터",
      "link-save-3": "모두의 말뭉치",
      "link-save-4": "인공지능 데이터실",
      "cat-dict": "종합<br>사전",
      "link-dict-1": "표준국어대사전",
      "link-dict-2": "우리말샘",
      "link-dict-3": "지역어 종합 정보",
      "link-dict-4": "외래어사전",
      "cat-sign": "수어<br>-<br>점자",
      "link-sign-1": "한국수어사전",
      "link-sign-2": "점자 종합정보",
      "link-sign-3": "수어와 만남",
      "link-sign-4": "수어 교육 영상",
      "cat-norm": "어문<br>규범",
      "link-norm-1": "한글 맞춤법",
      "link-norm-2": "표준어 규정",
      "link-norm-3": "외래어 표기법",
      "link-norm-4": "자주 틀리는 문법",
      "theme-heading": "주제별 서비스",
      "theme-edu": "교육",
      "edu-1": "국어문화학교",
      "edu-2": "한국어교원자격증",
      "edu-3": "온라인 전시관",
      "edu-4": "프로그램 신청 안내",
      "theme-part": "참여",
      "part-1": "온라인 가나다(상담)",
      "part-2": "국민신문고",
      "part-3": "부패행위 신고",
      "part-4": "민원 및 제안",
      "theme-imp": "개선",
      "imp-1": "민원처리현황",
      "imp-2": "서식 자료실",
      "imp-3": "디지털 소통 창구",
      "imp-4": "웹 접근성 가이드",
      "theme-sup": "지원",
      "sup-1": "표준어 규정 찾기",
      "sup-2": "국어 문화 소식지",
      "sup-3": "찾아가는 서비스",
      "sup-4": "이달의 전시 테마",
      "news-heading": "주요 공지 및 소식",
      "news-badge-1": "공지",
      "news-title-1": "2026년 국어 문화 학교 여름 프로그램 신청 안내",
      "news-title-1-1": "제36회 한글 잔치 및 글짓기 대회 안내",
      "news-title-1-2": "2026년 하반기 국어 전문 교육 과정 수강생 모집",
      "news-badge-2": "소식",
      "news-title-2": "표준국어대사전 신규 어휘 3,200건 등재 완료",
      "news-title-2-1": "우리말샘 2026년도 상반기 시민 참여 어휘 선정 결과",
      "news-title-2-2": "AI 한국어 학습용 말뭉치 데이터 1억 어절 추가 공개",
      "news-badge-3": "알림",
      "news-title-3": "온라인 가나다 서비스 개편 안내 (5월 15일~)",
      "news-title-3-1": "웹 접근성 강화를 위한 음성 지원 서비스 시범 운영",
      "news-title-3-2": "지역어 종합 정보 시스템 유지보수 안내 (5/20)",
      "footer-privacy": "개인정보처리방침",
      "footer-copyright": "저작권정책",
      "footer-terms": "이용약관",
      "footer-sitemap": "사이트맵",
      "footer-address": "우 30609 세종특별자치시 한누리대로 402",
      "cert-quality": "품질"
    },
    en: {
      "skip-main": "Skip to main content",
      "skip-menu": "Skip to main menu",
      "org-name": "National Institute of Korean Language",
      "search-placeholder": "Enter search keywords",
      "hero-tagline": "Our Language, Our Culture",
      "hero-title": "Everything about<br>Korean Language is Here",
      "download-heading": "Main Resources Download",
      "cat-save": "Data<br>Archive",
      "link-save-1": "Research Data Storage",
      "link-save-2": "Language Info Sharing",
      "link-save-3": "Everybody's Corpus",
      "link-save-4": "AI Data Room",
      "cat-dict": "General<br>Dictionary",
      "link-dict-1": "Standard Korean Dictionary",
      "link-dict-2": "Urimalsaem",
      "link-dict-3": "Regional Language Info",
      "link-dict-4": "Loanword Dictionary",
      "cat-sign": "Sign<br>-<br>Braille",
      "link-sign-1": "Korean Sign Dictionary",
      "link-sign-2": "Braille Info Center",
      "link-sign-3": "Meeting with Sign",
      "link-sign-4": "Sign Edu Videos",
      "cat-norm": "Language<br>Norms",
      "link-norm-1": "Hangeul Spelling",
      "link-norm-2": "Standard Language Rules",
      "link-norm-3": "Loanword Orthography",
      "link-norm-4": "Common Grammar Errors",
      "theme-heading": "Thematic Services",
      "theme-edu": "Education",
      "edu-1": "Korean Culture School",
      "edu-2": "Korean Teacher Cert",
      "edu-3": "Online Exhibition",
      "edu-4": "Program Registration",
      "theme-part": "Participation",
      "part-1": "Online Ganada(Consult)",
      "part-2": "e-People(e-Petition)",
      "part-3": "Corruption Report",
      "part-4": "Complaints & Suggestions",
      "theme-imp": "Improvement",
      "imp-1": "Complaint Status",
      "imp-2": "Form Archive",
      "imp-3": "Digital Comm Channel",
      "imp-4": "Web Accessibility Guide",
      "theme-sup": "Support",
      "sup-1": "Find Standard Rules",
      "sup-2": "Korean Culture News",
      "sup-3": "Visiting Services",
      "sup-4": "Exhibition of the Month",
      "news-heading": "Major Notices and News",
      "news-badge-1": "Notice",
      "news-title-1": "2026 Korean Culture School Summer Program Registration",
      "news-title-1-1": "36th Hangeul Festival & Writing Contest Notice",
      "news-title-1-2": "Recruitment for 2nd Half 2026 Korean Edu Program",
      "news-badge-2": "News",
      "news-title-2": "3,200 New Vocabularies Added to Standard Dictionary",
      "news-title-2-1": "Urimalsaem 2026 First Half Citizen Vocab Results",
      "news-title-2-2": "100M Words of AI Korean Corpus Data Released",
      "news-badge-3": "Alert",
      "news-title-3": "Online Ganada Service Update (from May 15)",
      "news-title-3-1": "Pilot Operation of Voice Support for Web Accessibility",
      "news-title-3-2": "Regional Language System Maintenance (May 20)",
      "footer-privacy": "Privacy Policy",
      "footer-copyright": "Copyright Policy",
      "footer-terms": "Terms of Use",
      "footer-sitemap": "Sitemap",
      "footer-address": "402 Hannuri-daero, Sejong-si 30609",
      "cert-quality": "Quality"
    }
  };

  function setLanguage(lang) {
    document.documentElement.lang = lang;
    const dict = translations[lang];
    if (!dict) return;

    // 텍스트 변환 (innerHTML 방식 사용 - <br> 태그 보존 위해)
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // placeholder 변환
    const inputs = document.querySelectorAll('[data-i18n-placeholder]');
    inputs.forEach(input => {
      const key = input.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        input.setAttribute('placeholder', dict[key]);
      }
    });
  }

  const langToggleBtn = document.getElementById('lang-toggle-btn');
  const langToggleText = document.getElementById('lang-toggle-text');
  if (langToggleBtn && langToggleText) {
    langToggleBtn.addEventListener('click', function () {
      // 현재 언어 상태 가져오기
      const currentLang = this.getAttribute('data-lang');
      const targetLang = currentLang === 'ko' ? 'en' : 'ko';
      
      // 언어 상태 업데이트
      this.setAttribute('data-lang', targetLang);
      
      // 텍스트 및 접근성 속성 업데이트
      if (targetLang === 'en') {
        langToggleText.textContent = 'english';
        this.setAttribute('aria-label', '영어로 선택됨');
      } else {
        langToggleText.textContent = '한글';
        this.setAttribute('aria-label', '한국어 선택됨');
      }
      
      // 언어 변경 함수 호출
      setLanguage(targetLang);
    });
  }

  /* ============================================
     5. 다운로드 카드 키보드 접근
     ============================================ */
  const downloadCards = document.querySelectorAll('.download-card');
  downloadCards.forEach((card) => {
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        const firstLink = this.querySelector('.card-link');
        if (firstLink) firstLink.click();
      }
    });
  });

})();
