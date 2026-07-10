const revealTargets = document.querySelectorAll(".reveal, .scale-in, .blur-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -40px",
  },
);

revealTargets.forEach((target) => observer.observe(target));

document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) {
      return;
    }

    document.querySelectorAll(".faq-item").forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  });
});

// 카카오톡 CTA 링크 배선 + 전환 추적 (VS_CONFIG 기반)
(function () {
  const cfg = window.VS_CONFIG || {};
  const kakaoReady = cfg.kakao && cfg.kakao.indexOf("__") !== 0;

  document.querySelectorAll(".js-kakao").forEach((el) => {
    if (kakaoReady) {
      el.setAttribute("href", cfg.kakao);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
    el.addEventListener("click", (e) => {
      if (!kakaoReady) {
        e.preventDefault();
      }
      if (window.vsTrack) {
        window.vsTrack("contact_kakao", { location: el.dataset.cta || "unknown" });
      }
      if (kakaoReady && window.fbq) {
        try {
          fbq("track", "Contact");
        } catch (err) {
          /* noop */
        }
      }
    });
  });

  // 섹션 조회 추적: 가격표 / 포트폴리오 (1회)
  const sectionEvents = [
    { id: "pricing", name: "view_pricing" },
    { id: "portfolio", name: "view_portfolio" },
  ];
  if ("IntersectionObserver" in window) {
    const seen = {};
    const secObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen[entry.target.id]) {
            seen[entry.target.id] = true;
            const match = sectionEvents.find((s) => s.id === entry.target.id);
            if (match && window.vsTrack) {
              window.vsTrack(match.name, {});
            }
            secObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );
    sectionEvents.forEach((s) => {
      const node = document.getElementById(s.id);
      if (node) {
        secObs.observe(node);
      }
    });
  }
})();

// 포트폴리오 팝업(모달) — 카드 클릭 시 전체 페이지를 오버레이로 표시
(function () {
  var DATA = {
    "pf-business-plan": { title: "부동산 개발 PF 사업계획서", pages: 60 },
    "market-research": { title: "공동주택 분양가 시장조사 보고서", pages: 10 },
    "smartfarm-proposal": { title: "스마트팜 사업 제안서", pages: 14 },
    "investment-im": { title: "투자 유치 IM (투자설명서)", pages: 14 },
    "product-review": { title: "제품 검토·신규 기획 자료", pages: 15 },
    "website-intro": { title: "홈페이지·브랜드 소개자료", pages: 49 },
    "smgm-proposal": { title: "통합 사업 제안서", pages: 25 },
    "smgm-catalog": { title: "제품 카탈로그", pages: 28 },
  };
  var modal = document.getElementById("pfModal");
  if (!modal) return;
  var grid = document.getElementById("pfModalGrid");
  var titleEl = document.getElementById("pfModalTitle");

  function openModal(slug) {
    var d = DATA[slug];
    if (!d) return;
    titleEl.textContent = d.title;
    var html = "";
    for (var i = 1; i <= d.pages; i++) {
      var n = (i < 10 ? "0" : "") + i;
      html +=
        '<figure class="pf-pg"><img src="/assets/portfolio/pages/' + slug + "/p" + n +
        '.jpg" alt="' + d.title + " " + i + '페이지" loading="lazy">' +
        '<figcaption>' + i + " / " + d.pages + "</figcaption></figure>";
    }
    grid.innerHTML = html;
    grid.scrollTop = 0;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("pf-locked");
    if (window.vsTrack) window.vsTrack("view_sample", { sample: slug });
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pf-locked");
    grid.innerHTML = "";
  }

  document.querySelectorAll(".portfolio-visual-link[data-portfolio]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(a.getAttribute("data-portfolio"));
    });
  });
  modal.querySelectorAll("[data-pf-close]").forEach(function (el) {
    el.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });
})();
