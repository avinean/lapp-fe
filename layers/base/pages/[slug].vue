<script lang="ts" setup>
const route = useRoute()
const { getOne } = usePageRepository()
const { data } = await useAsyncData(() => getOne(route.params.slug as string))

useBreadcrumbs(() => data.value?.breadcrumbs || [])

useSeoMeta({
    title:  data.value?.title,
    ...Object.fromEntries((data.value?.meta || []).map(({ name, content }) => [name, content]))
})
</script>

<template>
    <div class="py-4 space-y-4">
        <CmsSection v-if="data?.section" :key="data?.section.slug" :content="data?.section.content" />
    </div>
</template>