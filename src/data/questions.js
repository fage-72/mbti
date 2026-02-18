export const questions = [
  // E vs I (Focus / Risk)
  {
    id: 1,
    text: "휴일에 당신은 무엇을 하고 싶나요?",
    type: "EI",
    options: [
      { text: "친구들과 만나서 신나게 논다.", value: "E", stats: { risk: 5, focus: 0 } },
      { text: "집에서 혼자 조용히 휴식을 취한다.", value: "I", stats: { risk: 0, focus: 5 } },
    ],
  },
  {
    id: 2,
    text: "새로운 사람들과의 모임에서 당신은?",
    type: "EI",
    options: [
      { text: "먼저 말을 걸고 분위기를 주도한다.", value: "E", stats: { risk: 5, strategy: 2 } },
      { text: "조용히 듣고 관찰하는 편이다.", value: "I", stats: { risk: 0, strategy: 5 } },
    ],
  },
  // S vs N (Focus / Risk)
  {
    id: 3,
    text: "영화를 볼 때 더 중요하게 생각하는 것은?",
    type: "SN",
    options: [
      { text: "현실적이고 개연성 있는 스토리", value: "S", stats: { focus: 5, risk: 0 } },
      { text: "상상력을 자극하는 독창적인 세계관", value: "N", stats: { focus: 0, risk: 5 } },
    ],
  },
  {
    id: 4,
    text: "무언가를 설명할 때 당신의 스타일은?",
    type: "SN",
    options: [
      { text: "구체적인 사실과 경험 위주로 설명한다.", value: "S", stats: { focus: 5, strategy: 2 } },
      { text: "비유와 추상적인 개념을 사용하여 설명한다.", value: "N", stats: { focus: 0, strategy: 5 } },
    ],
  },
  // T vs F (Strategy / Empathy -> Strategy로 통합)
  {
    id: 5,
    text: "친구가 고민을 털어놓을 때 당신의 반응은?",
    type: "TF",
    options: [
      { text: "문제의 원인을 분석하고 해결책을 제시한다.", value: "T", stats: { strategy: 5, risk: 2 } },
      { text: "친구의 감정에 공감하고 위로해준다.", value: "F", stats: { strategy: 0, risk: 0 } }, // F는 점수 대신 다른 보너스? 일단 0
    ],
  },
  {
    id: 6,
    text: "결정을 내려야 할 때 더 중요한 기준은?",
    type: "TF",
    options: [
      { text: "논리적인 타당성과 효율성", value: "T", stats: { strategy: 5, focus: 3 } },
      { text: "나와 타인에게 미칠 영향과 가치", value: "F", stats: { strategy: 0, focus: 0 } },
    ],
  },
  // J vs P (Strategy / Risk)
  {
    id: 7,
    text: "여행 계획을 세울 때 당신은?",
    type: "JP",
    options: [
      { text: "분 단위로 세세하게 계획을 짠다.", value: "J", stats: { strategy: 5, focus: 5 } },
      { text: "큰 틀만 정해두고 그때그때 기분에 따라 움직인다.", value: "P", stats: { strategy: 0, risk: 5 } },
    ],
  },
  {
    id: 8,
    text: "일을 처리하는 방식은?",
    type: "JP",
    options: [
      { text: "미리미리 계획대로 끝내는 것을 선호한다.", value: "J", stats: { strategy: 5, focus: 2 } },
      { text: "마감 기한이 임박했을 때 집중해서 처리한다.", value: "P", stats: { strategy: 2, risk: 5 } },
    ],
  },
];