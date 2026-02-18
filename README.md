# MBTI 뉴스 큐레이터 앱

이 앱은 사용자의 성향을 8가지 질문으로 분석하여 16가지 MBTI 유형 중 하나를 도출하고, 해당 유형에 맞는 맞춤형 뉴스를 추천해주는 React 웹 애플리케이션입니다.

## 1. 주요 기능

*   **MBTI 진단:** 8개의 질문(E/I, S/N, T/F, J/P 각 2문항)을 통해 사용자의 성향을 파악합니다.
*   **맞춤 뉴스 추천:** 도출된 MBTI 유형에 따라 가장 관심 있어 할 만한 뉴스 카테고리와 가상 기사를 보여줍니다.
*   **반응형 디자인:** Tailwind CSS를 사용하여 모바일과 데스크톱 모두에서 깔끔하게 보이는 UI를 제공합니다.

## 2. 프로젝트 구조

*   `src/components/StartScreen.jsx`: 앱의 시작 화면.
*   `src/components/Quiz.jsx`: 질문을 보여주고 답변을 수집하여 MBTI를 계산하는 로직 포함.
*   `src/components/Result.jsx`: 결과(MBTI)와 추천 뉴스를 보여주는 화면.
*   `src/data/questions.js`: 8개의 MBTI 질문 데이터.
*   `src/data/newsData.js`: 16개 MBTI 유형별 뉴스 데이터 매핑.

## 3. 실행 방법

터미널에서 다음 명령어를 입력하여 개발 서버를 실행하세요.

```bash
npm run dev
```

브라우저에서 표시된 주소(예: `http://localhost:5173`)로 접속하면 앱을 사용할 수 있습니다.