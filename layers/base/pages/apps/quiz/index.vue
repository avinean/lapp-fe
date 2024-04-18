<script lang="ts" setup>
import type { QuizContent } from '~/types/components/quiz'
import type { AppsEntity } from '~/types/entities'
import { AppType } from '~/types/enums'
import { ModalAskEmail } from '#components'

const toast = useToast()
const modalStore = useModalStore()

function initForm(): AppsEntity<QuizContent> {
  return {
    type: AppType.Quiz,
    title: '',
    description: '',
    content: [
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
    creator: '',
  }
}

const form = reactive<AppsEntity<QuizContent>>(initForm())

function addQuestion() {
  form.content.push({
    question: {
      type: 'text',
      value: '',
    },
    answers: [],
  })
}

function addAnswer(questionIndex: number) {
  form.content[questionIndex].answers.push({
    answer: {
      type: 'text',
      value: '',
    },
    correct: false,
  })
}

function removeQuestion(questionIndex: number) {
  form.content.splice(questionIndex, 1)
}

function removeAnswer(questionIndex: number, answerIndex: number) {
  form.content[questionIndex].answers.splice(answerIndex, 1)
}

function setCorrect(question: QuizContent[number], answer: QuizContent[number]['answers'][number]) {
  question.answers.forEach((a) => {
    a.correct = false
  })
  answer.correct = true
}

function setMultiple(question: QuizContent[number], value: boolean) {
  question.multiple = value
  if (value) {
    question.answers.forEach(a => a.correct = false)
  }
  else {
    question.answers.forEach(a => a.correct = false)
    question.answers[0].correct = true
  }
}

function onCreate() {
  const { add } = useAppsRepository()
  modalStore.open(ModalAskEmail, {
    async onSubmit(email: string) {
      form.creator = email
      try {
        await add(form)
        Object.assign(form, initForm())
        toast.add({
          title: 'Success',
          description: 'Quiz created successfully. Check your email'
        })
      }
      catch (error: any) {
        if (error?.data?.message?.includes('creator must be an email')) {
          toast.add({
            title: 'An error',
            description: 'Please provide a valid email',
          })
        }
        else {
          toast.add({
            title: 'An error',
            description: error?.message,
          })
        }
      }
    },

  })
}
</script>

<template>
  <div class="space-y-4 py-4">
    <h1>Create a quiz</h1>
    <UForm :state="form" class="space-y-4" @submit="onCreate">
      <UFormGroup label="Title">
        <UInput v-model="form.title" />
      </UFormGroup>
      <UFormGroup label="Description">
        <UTextarea v-model="form.description" />
      </UFormGroup>
      <h2>Questions</h2>
      <div class="p-4 space-y-4 bg-primary/20 rounded-md">
        <template
          v-for="(question, questionIndex) in form.content"
          :key="questionIndex"
        >
          <QuizEntity
            v-model="question.question"
            title="Question"
            @delete="removeQuestion(questionIndex)"
          >
            <div class="p-2">
              <UCheckbox :model-value="question.multiple" label="Allow multiple answers" @update:model-value="setMultiple(question, $event)" />
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
                  <UCheckbox v-model="answer.correct" label="Mark as a correct answer" @update:model-value="setCorrect(question, answer)" />
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
        <UButton type="submit" icon="i-heroicons-inbox-stack-16-solid">
          Create quiz
        </UButton>
      </div>
    </UForm>
  </div>
</template>
