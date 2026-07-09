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
