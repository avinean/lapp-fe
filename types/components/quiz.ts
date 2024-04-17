export type QuizEntity = {
  type: 'text'
  value: string
} | {
  type: 'image'
  value: {
    src: string
    alt: string
  }
} | {
  type: 'textToSpeach'
  value: {
    text: string
    lang: string
  }
} | {
  type: 'video'
  value: {
    src: string
    poster: string
  }
} | {
  type: 'audio'
  value: {
    src: string
  }
}