<script lang="ts" setup>
import type { QuizEntity } from '~/types/components/quiz'
import type { AppType } from '~/types/components/apps'

export interface Quiz {
  type: AppType
  title: string
  description: string
  questions: {
    question: QuizEntity
    multiple?: boolean
    answers: {
      answer: QuizEntity
      correct: boolean
    }[]
  }[]
}

const form = reactive<Quiz>({
  type: 'quiz',
  title: '',
  description: '',
  questions: [
    {
      question: {
        type: 'text',
        value: '',
      },
      multiple: false,
      answers: [
        {
          answer: {
            type: 'text',
            value: '',
          },
          correct: false,
        },
      ],
    },
  ],
})

function addQuestion() {
  form.questions.push({
    question: {
      type: 'text',
      value: '',
    },
    answers: [],
  })
}

function addAnswer(questionIndex: number) {
  form.questions[questionIndex].answers.push({
    answer: {
      type: 'text',
      value: '',
    },
    correct: false,
  })
}

function removeQuestion(questionIndex: number) {
  form.questions.splice(questionIndex, 1)
}

function removeAnswer(questionIndex: number, answerIndex: number) {
  form.questions[questionIndex].answers.splice(answerIndex, 1)
}
</script>

<template>
  <div class="space-y-4 py-4">
    <h1>Create a quiz</h1>
    <UForm :state="form" class="space-y-4">
      <UFormGroup label="Title">
        <UInput v-model="form.title" />
      </UFormGroup>
      <UFormGroup label="Description">
        <UTextarea v-model="form.description" />
      </UFormGroup>
      <h2>Questions</h2>
      <div class="p-4 space-y-4 bg-primary/20 rounded-md">
        <template
          v-for="(question, questionIndex) in form.questions"
          :key="questionIndex"
        >
          <QuizEntity
            v-model="question.question"
            title="Question"
            @delete="removeQuestion(questionIndex)"
          >
            <div class="p-2">
              <UFormGroup label="Allow multiple answers">
                <UCheckbox v-model="question.multiple" />
              </UFormGroup>
            </div>
          </QuizEntity>
          <div class="p-4 space-y-4 bg-primary/20 rounded-md">
            <template v-for="(answer, answerIndex) in question.answers" :key="answerIndex">
              <QuizEntity
                v-model="answer.answer"
                title="Answer"
                @delete="removeAnswer(questionIndex, answerIndex)"
              >
                <div class="p-2">
                  <UFormGroup label="Mark as a correct answer">
                    <UCheckbox v-model="question.multiple" />
                  </UFormGroup>
                </div>
              </QuizEntity>
            </template>
            <UDivider />
            <div class="flex justify-end">
              <UButton icon="i-heroicons-hand-raised-16-solid" @click="addAnswer(questionIndex)">
                Add answer
              </UButton>
            </div>
          </div>
        </template>
        <UDivider />
        <div class="flex justify-end">
          <UButton icon="i-heroicons-question-mark-circle-16-solid" @click="addQuestion">
            Add question
          </UButton>
        </div>
      </div>
      <UDivider />
      <div class="flex justify-end">
        <UButton icon="i-heroicons-inbox-stack-16-solid">
          Create quiz
        </UButton>
      </div>
    </UForm>
  </div>
  <!-- <div class="space-y-4 py-4">
    <h2>{{ form.title }}</h2>
    <h3>{{ form.description }}</h3>
  </div> -->
</template>
