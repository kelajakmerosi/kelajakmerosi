import { useCallback, useMemo, useState } from 'react'
import type { Question, TopicProgressData } from '../types'

export interface QuizState {
  currentIndex: number
  answers:      Record<number, number>
  submitted:    boolean
  score:        number | undefined
  masteryScore: number | undefined
}

const difficultyWeight = (difficulty: Question['difficulty']): number => {
  if (difficulty === 'hard') return 1.6
  if (difficulty === 'medium') return 1.3
  return 1
}

export function useQuiz(questions: Question[], savedData: TopicProgressData) {
  const [state, setState] = useState<QuizState>({
    currentIndex: Math.max(0, Math.min(savedData.resumeQuestionIndex ?? 0, questions.length - 1)),
    answers:      savedData.quizAnswers   ?? {},
    submitted:    savedData.quizSubmitted ?? false,
    score:        savedData.quizScore,
    masteryScore: savedData.masteryScore,
  })

  const selectAnswer = useCallback((qIndex: number, optIndex: number) => {
    setState(prev => {
      if (prev.submitted) return prev
      return { ...prev, answers: { ...prev.answers, [qIndex]: optIndex } }
    })
  }, [])

  const nextQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, questions.length - 1),
    }))
  }, [questions.length])

  const prevQuestion = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0),
    }))
  }, [])

  const submitQuiz = useCallback((): { score: number; masteryScore: number } => {
    const score = questions.reduce(
      (acc, q, i) => acc + (state.answers[i] === q.answer ? 1 : 0),
      0,
    )

    const weighted = questions.reduce((acc, q, idx) => {
      const weight = difficultyWeight(q.difficulty)
      const gotCorrect = state.answers[idx] === q.answer
      return {
        max: acc.max + weight,
        got: acc.got + (gotCorrect ? weight : 0),
      }
    }, { got: 0, max: 0 })

    const masteryScore = weighted.max > 0
      ? Math.round((weighted.got / weighted.max) * 100)
      : 0

    setState(prev => ({
      ...prev,
      submitted: true,
      score,
      masteryScore,
    }))

    return { score, masteryScore }
  }, [questions, state.answers])

  const resetQuiz = useCallback(() => {
    setState({
      currentIndex: 0,
      answers: {},
      submitted: false,
      score: undefined,
      masteryScore: undefined,
    })
  }, [])

  const canSubmit = useMemo(
    () => Object.keys(state.answers).length === questions.length,
    [questions.length, state.answers],
  )

  const canNext = state.answers[state.currentIndex] !== undefined
  const canPrev = state.currentIndex > 0
  const isLast  = state.currentIndex === questions.length - 1

  return {
    state,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    resetQuiz,
    canSubmit,
    canNext,
    canPrev,
    isLast,
  }
}
