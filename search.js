/**
 * search.js - 국립국어원 자료 검색 페이지
 * Figma: 388:581 Mobile
 *
 * 기능:
 *  1. 자료 유형 버튼 토글 (단일 선택)
 *  2. 검색 폼 제출 → 결과 필터링 & 표시
 *  3. 날짜 범위 유효성 검사
 *  4. 검색어 하이라이트
 */
(function () {
  'use strict';

  /* ──────────────────────────────────────
     샘플 데이터 (실제 서비스 시 API로 대체)
     ────────────────────────────────────── */
  const SAMPLE_DATA = [
    { id: 1, type: '규정', title: '표준어 규정 개정안 심의 자료', date: '2026-04-15' },
    { id: 2, type: '심의', title: '2026년 국어기본법 시행령 개정 심의 자료', date: '2026-04-10' },
    { id: 3, type: '용례', title: '신조어 용례 분석 자료집', date: '2026-03-28' },
    { id: 4, type: '외래', title: '외래어 표기법 예외 사례 자료', date: '2026-03-15' },
    { id: 5, type: '수어', title: '한국수어 표준 어휘 선정 자료', date: '2026-02-20' },
    { id: 6, type: '규정', title: '한글 맞춤법 일부 개정 규정 자료', date: '2026-02-10' },
    { id: 7, type: '심의', title: '전문어 심의 결과 자료 (의학 분야)', date: '2026-01-25' },
    { id: 8, type: '용례', title: '온라인 언어 용례 수집 분석 자료', date: '2026-01-10' },
    { id: 9, type: '외래', title: '외국어 표기 통일안 관련 자료', date: '2025-12-20' },
    { id: 10, type: '수어', title: '수어 교육 지원 프로그램 운영 자료', date: '2025-12-05' },
    { id: 11, type: '규정', title: '문장 부호 허용 범위 확대 관련 검토 자료', date: '2025-11-12' },
    { id: 12, type: '심의', title: '2025년 제4차 국어심의회 안건 및 의결서', date: '2025-10-30' },
    { id: 13, type: '용례', title: '지역별 방언 분화 및 실생활 활용 사례집', date: '2025-09-15' },
    { id: 14, type: '외래', title: 'IT 신기술 분야 외래어 국어 순화 안', date: '2025-08-22' },
    { id: 15, type: '수어', title: '문화 예술 분야 공공 수어 통역 가이드라인', date: '2025-08-05' },
    { id: 16, type: '규정', title: '공공기관 대상 쉬운 우리말 쓰기 권고 지침', date: '2025-07-20' },
    { id: 17, type: '심의', title: '방송 언어 순화 및 심의 기준 개선안', date: '2025-07-12' },
    { id: 18, type: '용례', title: 'MZ세대 은어 및 비속어 실태 조사 보고서', date: '2025-06-30' },
    { id: 19, type: '외래', title: '스포츠 외래어 표기 통일화 방안 연구', date: '2025-06-15' },
    { id: 20, type: '수어', title: '농인 사회 소통 강화를 위한 지수어 표준화', date: '2025-05-28' },
    { id: 21, type: '규정', title: '초중고 교과서 한글 표기 원칙 준수 점검', date: '2025-05-10' },
    { id: 22, type: '심의', title: '법률 용어 순화 및 어려운 한자어 정비안', date: '2025-04-22' },
    { id: 23, type: '용례', title: '행정 문서 내 중복 표현 및 부적절 용례집', date: '2025-04-05' },
    { id: 24, type: '외래', title: '패션/디자인 산업 외래어 국어 순화 목록', date: '2025-03-18' },
    { id: 25, type: '수어', title: '수어 문법 체계 정립을 위한 학술 분석', date: '2025-03-01' },
    { id: 26, type: '규정', title: '지자체 조례 및 규칙 제명 한글화 규정', date: '2025-02-14' },
    { id: 27, type: '심의', title: '2025년 제1차 국어심의회 결과 보고', date: '2025-01-30' },
    { id: 28, type: '용례', title: '소셜 미디어 언어 오염 실태 분석 자료', date: '2025-01-12' },
    { id: 29, type: '외래', title: '지명/인명 외래어 표기 심의 결정 고시', date: '2024-12-20' },
    { id: 30, type: '수어', title: '수어 사전 수록 어휘 선별 및 검토 자료', date: '2024-12-05' },
    { id: 31, type: '규정', title: '공문서 맞춤법 검사기 표준 엔진 규격', date: '2024-11-22' },
    { id: 32, type: '심의', title: '환경 분야 전문어 표준화 의결 자료', date: '2024-11-10' },
    { id: 33, type: '용례', title: '근대 국어 어휘 변화 추이 분석 자료', date: '2024-10-25' },
    { id: 34, type: '외래', title: '수입 식품 표기법 위반 사례 및 정정안', date: '2024-10-05' },
    { id: 35, type: '수어', title: '한국수어 교원 자격 제도 개선안 연구', date: '2024-09-18' },
    { id: 36, type: '규정', title: '점자 표기법 개정 및 디지털 점자 규정', date: '2024-09-02' },
    { id: 37, type: '심의', title: '전통 문화 예술 용어 국어 정화 심의', date: '2024-08-20' },
    { id: 38, type: '용례', title: '연령별 언어 사용 습관 설문 조사 결과', date: '2024-08-05' },
    { id: 39, type: '외래', title: '자동차 공학 외래어 전문 용어집', date: '2024-07-22' },
    { id: 40, type: '수어', title: '금융 서비스 이용자를 위한 수어 안내', date: '2024-07-10' },
    { id: 41, type: '규정', title: '국어 정보화 사업 중장기 전략 로드맵', date: '2024-06-25' },
    { id: 42, type: '심의', title: '지리정보시스템(GIS) 한글 표기안 심의', date: '2024-06-12' },
    { id: 43, type: '용례', title: '유튜브 자막 오기 및 맞춤법 오류 통계', date: '2024-05-30' },
    { id: 44, type: '외래', title: '비즈니스 실무 외래어 사용 자제 가이드', date: '2024-05-15' },
    { id: 45, type: '수어', title: '병원 내 수어 통역 서비스 배치 매뉴얼', date: '2024-04-28' },
    { id: 46, type: '규정', title: '인공지능 학습용 국어 말뭉치 구축 규정', date: '2024-04-12' },
    { id: 47, type: '심의', title: '기상/재난 안전 분야 전문어 심의 자료', date: '2024-03-30' },
    { id: 48, type: '용례', title: '해외 한류 팬의 한국어 오용 사례 분석', date: '2024-03-15' },
    { id: 49, type: '외래', title: '미용/피부 관리 분야 외래어 정비 목록', date: '2024-02-22' },
    { id: 50, type: '수어', title: '비대면 영상 수어 통역 기술 표준안', date: '2024-02-05' },
    { id: 51, type: '규정', title: '어린이집/유치원 고운 말 교육 지침서', date: '2024-01-20' },
    { id: 52, type: '심의', title: '해양 수산 전문 용어 통합 표준화 심의', date: '2024-01-08' },
    { id: 53, type: '용례', title: '언론 보도 내 차별 및 혐오 표현 분석', date: '2023-12-15' },
    { id: 54, type: '외래', title: '서양 고전 음악 용어 한글 표기 원칙', date: '2023-11-28' },
    { id: 55, type: '수어', title: '종교별 특화 수어 어휘 조사 및 정리', date: '2023-11-10' },
    { id: 56, type: '규정', title: '국어 생활 실태 조사 방법론 고도화', date: '2023-10-25' },
    { id: 57, type: '심의', title: '건축/토목 현장 일본어 투 용어 정리안', date: '2023-10-05' },
    { id: 58, type: '용례', title: '직장 내 호칭어 및 경어법 사용 실태', date: '2023-09-18' },
    { id: 59, type: '외래', title: '외국어 상표명의 국어 표기 가이드북', date: '2023-09-02' },
    { id: 60, type: '보류', title: '[비공개 분류] [소급 대장] 외계(外界) 유입 추정 문자 열람 시 발생하는 정신 간섭 보고서', date: '2000-01-01' },
    { id: 61, type: '보류', title: '[비공개 분류] [소급 대장] 기록되지 않은 방언: 인간의 성대를 거치지 않은 비음성 발화 사례', date: '1999-02-29' },
    { id: 62, type: '보류', title: '[비공개 분류] [소급 대장] 비인가 언어 접촉자의 인지 체계 붕괴 및 사후 처리 심의 기록', date: '1994-10-31' },
    { id: 63, type: '보류', title: '[비공개 분류] [소급 대장] 금기어(禁忌語) 확산 방지를 위한 구강 구조 물리적 제약 지침', date: '2001-05-16' },
    { id: 64, type: '보류', title: '[비공개 분류] 심야 시간대 식별 불가 음성 신호의 음절 구조 분석 자료', date: '2012-11-03' },
    { id: 65, type: '보류', title: '[비공개 분류] [소급 대장] 기원 불명의 고대 구전 형태에 관한 변칙 보고서', date: '1995-08-14' }
  ];

  /* ──────────────────────────────────────
     DOM 참조
     ────────────────────────────────────── */
  const form        = document.getElementById('search-form');
  const keywordInput = document.getElementById('keyword-input');
  const dateFrom    = document.getElementById('date-from'); 
  const dateTo      = document.getElementById('date-to');
  const typeBtns    = document.querySelectorAll('.type-btn');
  const resultsList = document.getElementById('results-list');
  const resultsCount = document.getElementById('results-count');
  const pagination = document.getElementById('pagination');

  let selectedType = ''; // 선택된 자료 유형 ('전체'는 '' 취급)
  let currentPage = 1;
  const ITEMS_PER_PAGE = 10;

  /* ──────────────────────────────────────
     1. 자료 유형 버튼 토글
        Figma: ON_CLICK → CHANGE_TO (호버 전/후 variant)
     ────────────────────────────────────── */
  typeBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const type = this.getAttribute('data-type');

      // 이미 선택된 버튼 클릭 → 선택 해제
      if (this.getAttribute('aria-pressed') === 'true') {
        this.setAttribute('aria-pressed', 'false');
        selectedType = '';
      } else {
        // 다른 버튼 모두 해제
        typeBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
        this.setAttribute('aria-pressed', 'true');
        selectedType = (type === '전체') ? '' : type;
      }

      // 키워드가 있으면 바로 재검색
      if (keywordInput.value.trim()) runSearch();
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  /* ──────────────────────────────────────
     2. 날짜 유효성 검사 (시작 ≤ 종료)
     ────────────────────────────────────── */
  dateTo.addEventListener('change', function () {
    if (dateFrom.value && dateTo.value && dateTo.value < dateFrom.value) {
      dateTo.setCustomValidity('종료 날짜는 시작 날짜 이후여야 합니다.');
      dateTo.reportValidity();
    } else {
      dateTo.setCustomValidity('');
    }
  });

  /* ──────────────────────────────────────
     3. 검색 폼 제출
     ────────────────────────────────────── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    runSearch();
  });

  // 입력 중 실시간 검색 (300ms 디바운스)
  let debounceTimer;
  keywordInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(runSearch, 300);
  });

  /* ──────────────────────────────────────
     4. 검색 실행 로직
     ────────────────────────────────────── */
  function runSearch(resetPage = true) {
    if (resetPage) currentPage = 1;

    const keyword = keywordInput.value.trim();
    const from    = dateFrom.value;
    const to      = dateTo.value;

    let results = SAMPLE_DATA.filter((item) => {
      // 키워드 필터
      const matchKeyword = !keyword || item.title.includes(keyword);
      // 날짜 범위 필터
      const matchFrom = !from || item.date >= from;
      const matchTo   = !to   || item.date <= to;
      // 유형 필터
      const matchType = !selectedType || item.type === selectedType;
      return matchKeyword && matchFrom && matchTo && matchType;
    });

    renderResults(results, keyword);
  }

  /* ──────────────────────────────────────
     5. 결과 렌더링
     ────────────────────────────────────── */
  function renderResults(results, keyword) {
    resultsList.innerHTML = '';
    if (pagination) pagination.innerHTML = '';

    // 카운트 업데이트
    if (resultsCount) {
      resultsCount.innerHTML = results.length > 0
        ? `검색 결과 <strong>${results.length}</strong>건`
        : '';
    }

    if (results.length === 0) {
      // 결과 없음
      const li = document.createElement('li');
      li.className = 'result-empty';
      li.innerHTML = `
        <div class="empty-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="21" cy="21" r="14" stroke="#000B16"
                    stroke-width="2" opacity="0.25"/>
            <path d="M31 31L42 42" stroke="#000B16"
                  stroke-width="2.5" stroke-linecap="round" opacity="0.25"/>
          </svg>
        </div>
        <p class="empty-message">검색 결과가 없습니다.<br>다른 검색어로 시도해 보세요.</p>
      `;
      resultsList.appendChild(li);
      return;
    }

    // 페이지네이션 계산
    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedResults = results.slice(startIndex, endIndex);

    // 결과 아이템 렌더링
    const LABEL_MAP = { 규정: '규정 자료', 심의: '심의 자료', 용례: '용례 자료',
                        외래: '외래 자료', 수어: '수어 자료' };
    paginatedResults.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'result-item';
      li.setAttribute('role', 'listitem');

      const title = keyword
        ? item.title.replace(
            new RegExp(`(${escapeReg(keyword)})`, 'gi'),
            '<mark class="highlight">$1</mark>'
          )
        : item.title;

      li.innerHTML = `
        <div class="result-content-wrap">
          <a href="#" class="result-link" aria-label="${item.title}, ${LABEL_MAP[item.type] || item.type}, ${formatDate(item.date)}">
            <div class="result-meta">
              <span class="result-type-badge">${LABEL_MAP[item.type] || item.type}</span>
              <span class="result-date">${formatDate(item.date)}</span>
            </div>
            <h3 class="result-title">${title}</h3>
          </a>
          <button type="button" class="download-btn" aria-label="${item.title} 다운로드" data-title="${item.title}">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      `;
      resultsList.appendChild(li);
    });

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (!pagination || totalPages <= 1) return;

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button type="button" class="page-btn ${i === currentPage ? 'active' : ''}" aria-label="${i}페이지${i === currentPage ? ' (현재)' : ''}" data-page="${i}">${i}</button>`;
    }
    pagination.innerHTML = html;

    // 페이지 버튼 이벤트 연결
    const pageBtns = pagination.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        currentPage = parseInt(this.getAttribute('data-page'), 10);
        runSearch(false); // 페이지 리셋 없이 재검색 및 렌더링
        window.scrollTo({ top: document.getElementById('search-main').offsetTop - 20, behavior: 'smooth' });
      });
    });
  }

  /* ──────────────────────────────────────
     유틸리티
     ────────────────────────────────────── */
  function formatDate(dateStr) {
    // "2026-04-15" → "2026.04.15"
    return dateStr.replace(/-/g, '.');
  }
  function escapeReg(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ──────────────────────────────────────
     초기화: URL 파라미터에서 검색어 복원
     (index.html에서 링크로 넘어올 때)
     ────────────────────────────────────── */
  (function initFromURL() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) {
      keywordInput.value = q;
      runSearch();
    }
  })();

  /* ──────────────────────────────────────
     6. 다운로드 모달 로직
     ────────────────────────────────────── */
  const downloadModal = document.getElementById('download-modal');
  const modalCancel = document.getElementById('modal-cancel');
  const modalConfirm = document.getElementById('modal-confirm');
  const modalDesc = document.getElementById('modal-desc');

  let currentDownloadTitle = '';

  // 이벤트 위임을 사용하여 다운로드 버튼 클릭 감지
  resultsList.addEventListener('click', function(e) {
    const btn = e.target.closest('.download-btn');
    if (btn) {
      e.preventDefault();
      currentDownloadTitle = btn.getAttribute('data-title');
      openModal();
    }
  });

  function openModal() {
    if (currentDownloadTitle) {
      modalDesc.innerHTML = `<strong>${currentDownloadTitle}</strong><br>해당 자료를 다운로드하시겠습니까?`;
    } else {
      modalDesc.innerHTML = `선택하신 자료를 다운로드하시겠습니까?`;
    }
    downloadModal.classList.add('is-active');
    downloadModal.setAttribute('aria-hidden', 'false');
    if (modalCancel) modalCancel.focus(); // 접근성을 위해 포커스 이동
  }

  function closeModal() {
    downloadModal.classList.remove('is-active');
    downloadModal.setAttribute('aria-hidden', 'true');
  }

  if (modalCancel) modalCancel.addEventListener('click', closeModal);
  if (modalConfirm) {
    modalConfirm.addEventListener('click', function() {
      // 실제 다운로드 로직 (여기서는 alert로 대체)
      alert('다운로드가 완료되었습니다.');
      closeModal();
    });
  }

  // 모달 바깥 클릭 시 닫기
  if (downloadModal) {
    downloadModal.addEventListener('click', function(e) {
      if (e.target === downloadModal) {
        closeModal();
      }
    });
  }

})();
