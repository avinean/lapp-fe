<script lang="ts" setup>
import type { QuizContent } from '~/types/components/quiz'

const route = useRoute()
const { getOne } = useAppsRepository()
const { data } = useAsyncData(() => getOne<QuizContent>(route.params.slug as string))
</script>

<template>
  <div class="space-y-4 py-4">
    <h1 class="h1">
      {{ data?.title }}
    </h1>
    <h4 class="h4">
      {{ data?.description }}
    </h4>
    <div v-for="question, i in data?.content" :key="i">
      {{ question.question }}
      <div v-for="answer, j in question.answers" :key="j">
        <UCheckbox />
        <span>{{ answer.answer }}</span>
      </div>
    </div>
  </div>
</template>
