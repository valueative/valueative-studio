# Valueative Studio — 웹사이트

밸류에이티브(Valueative)의 판매형 랜딩사이트. 정리되지 않은 부동산·사업 자료를
보여줄 수 있는 제안서·소개자료·랜딩페이지로 제작해주는 문서·자료 제작 서비스를 소개한다.

- **도메인**: https://www.valueative.shop
- **호스팅**: GitHub Pages (`.github/workflows/deploy.yml` — `src/` 를 배포)
- **정본 소스**: [`src/`](src/) — 정적 HTML/CSS/JS (프레임워크·빌드 없음)

## 구조

```
src/
├─ index.html      # 단일 페이지 (Hero·Problem·Service·Before/After·Portfolio·Process·Pricing·FAQ·CTA)
├─ css/style.css   # CSS 변수 기반 디자인 시스템
├─ js/main.js      # IntersectionObserver 스크롤 등장 효과 (라이브러리 미사용)
├─ assets/portfolio/  # 포트폴리오 샘플 (표지 썸네일 + 전체 PDF)
└─ CNAME           # 커스텀 도메인
```

> 기획·디자인·카피·배포·운영 가이드(브리프, 디자인 시스템, 카피, 배포/런칭 계획, 운영 원칙)는
> 별도 내부 문서로 관리하며 본 공개 저장소에는 포함하지 않는다.

## 로컬 실행

```bash
cd src && python3 -m http.server 8000   # http://localhost:8000
```

## 배포

`main` 브랜치에 push하면 GitHub Actions가 `src/` 를 GitHub Pages로 배포한다.
