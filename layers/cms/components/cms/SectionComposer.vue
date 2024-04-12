<script lang="ts" setup>
import { AdminModalGallery } from '#components'
import type { GalleryEntity } from '~/types/entities'
import type { CmsSection } from '~/types/cms'

const props = defineProps<{
  sections: CmsSection[]
  allowedTypes?: CmsSection['type'][]
  single?: boolean
}>()

const emit = defineEmits<{
  update: [sections: CmsSection[]]
}>()

const { open } = useModalStore()
const gridKey = ref(Math.random())

function setImage(section: CmsSection) {
  if (section.type !== 'image')
    return
  open(
    AdminModalGallery,
    {
      selected: section.image ? [section.image] : [],
      onSubmit([entity]) {
        if (!entity)
          return
        if (!section.image) {
          section.image = {
            image: entity.image,
            title: entity.title,
            id: entity.id,
          } as GalleryEntity
        }
        else { section.image.image = entity.image }
      },
    },
  )
}

function addSection(type: CmsSection['type']) {
  if (type === 'text')
    emit('update', [...props.sections, { type: 'text', content: '', align: 'left', tag: 'p' }])
  if (type === 'image')
    emit('update', [...props.sections, { type: 'image', image: null, aspectRatio: 'auto', fit: 'cover' }])
  if (type === 'grid') {
    emit('update', [...props.sections, {
      type: 'grid',
      columns: {
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
      },
      groups: [[]],
    }])
  }
  if (type === 'carousel') {
    emit('update', [...props.sections, {
      type: 'carousel',
      columns: {
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
      },
      arrows: false,
      autoplay: false,
      duration: 5000,
      groups: [[]],
    }])
  }
  if (type === 'card')
    emit('update', [...props.sections, { type: 'card', image: null, sections: [] }])
  if (type === 'group')
    emit('update', [...props.sections, { type: 'group', sections: [] }])
  if (type === 'contacts')
    emit('update', [...props.sections, { type: 'contacts' }])
  if (type === 'call')
    emit('update', [...props.sections, { type: 'call' }])
  if (type === 'headerNavigation')
    emit('update', [...props.sections, { type: 'headerNavigation', items: '' }])
}

function duplicateSection(section: CmsSection) {
  emit('update', [...props.sections, JSON.parse(JSON.stringify(section))])
}

function removeSection(section: CmsSection) {
  emit('update', props.sections.filter(s => s !== section))
}

function moveUp(section: any) {
  const index = props.sections.indexOf(section)
  if (index === 0)
    return
  const newSections = [...props.sections]
  newSections[index] = newSections[index - 1]
  newSections[index - 1] = section
  emit('update', newSections)
}

function moveDown(section: any) {
  const index = props.sections.indexOf(section)
  if (index === props.sections.length - 1)
    return
  const newSections = [...props.sections]
  newSections[index] = newSections[index + 1]
  newSections[index + 1] = section
  emit('update', newSections)
}

function duplicateGroup(section: any, array: any[]) {
  array.push(JSON.parse(JSON.stringify(section)))
  gridKey.value = Math.random()
}

function removeGroup(section: any, array: any[]) {
  const index = array.indexOf(section)
  array.splice(index, 1)
  gridKey.value = Math.random()
}

function moveLeft(section: any, array: any[]) {
  const index = array.indexOf(section)
  if (index === 0)
    return
  array[index] = array[index - 1]
  array[index - 1] = section
  gridKey.value = Math.random()
}

function moveRight(section: any, array: any[]) {
  const index = array.indexOf(section)
  if (index === array.length - 1)
    return
  array[index] = array[index + 1]
  array[index + 1] = section
  gridKey.value = Math.random()
}

const menu = [
  [{
    label: 'Додати секцію',
  }],
  ([
    {
      type: 'text',
      label: 'Текст',
      icon: 'i-heroicons-document-text-16-solid',
      click: () => addSection('text'),
    },
    {
      type: 'image',
      label: 'Зображення',
      icon: 'i-heroicons-photo-solid',
      click: () => addSection('image'),
    },
    {
      type: 'grid',
      label: 'Сітку',
      icon: 'i-heroicons-rectangle-group-20-solid',
      click: () => addSection('grid'),
    },
    {
      type: 'group',
      label: 'Групу елементів',
      icon: 'i-heroicons-queue-list-16-solid',
      click: () => addSection('group'),
    },
    {
      type: 'card',
      label: 'Картку',
      icon: 'i-heroicons-presentation-chart-bar-20-solid',
      click: () => addSection('card'),
    },
    {
      type: 'contacts',
      label: 'Контакти',
      icon: 'i-heroicons-phone-arrow-down-left-16-solid',
      click: () => addSection('contacts'),
    },
    {
      type: 'call',
      label: 'Форма зворотнього звʼязку',
      icon: 'i-heroicons-phone-arrow-down-left-16-solid',
      click: () => addSection('call'),
    },
    {
      type: 'carousel',
      label: 'Карусель',
      icon: 'i-heroicons-presentation-chart-bar-16-solid',
      click: () => addSection('carousel'),
    },
    {
      type: 'headerNavigation',
      label: 'Навігація хедера',
      icon: 'i-heroicons-globe-asia-australia-16-solid',
      click: () => addSection('headerNavigation'),
    },
  ] as {
    type: CmsSection['type']
    label: string
    icon: string
    click: () => void
  }[]).filter(({ type }) => props.allowedTypes?.includes(type) ?? true),
]
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="(section, index) in sections"
      :key="index"
      class="shadow-md hover:shadow-xl p-4"
    >
      <UDivider>
        <div class="flex items-center">
          <UBadge v-if="section.type === 'text'" label="Текст" />
          <UBadge v-else-if="section.type === 'image'" label="Зображення" />
          <UBadge v-else-if="section.type === 'grid'" label="Сітка" />
          <UBadge v-else-if="section.type === 'card'" label="Картка" />
          <UBadge v-else-if="section.type === 'group'" label="Група" />
          <UBadge v-else-if="section.type === 'contacts'" label="Контакти" />
          <UBadge v-else-if="section.type === 'call'" label="Форма зворотнього звʼязку" />
          <UBadge v-else-if="section.type === 'carousel'" label="Карусель" />
          <UBadge v-else-if="section.type === 'headerNavigation'" label="Навігація хедера" />

          <UButtonGroup>
            <UTooltip text="Створити дублікат">
              <UButton icon="i-heroicons-document-duplicate-solid" size="2xs" @click="duplicateSection(section)" />
            </UTooltip>
            <UTooltip text="Видалити секцію">
              <UButton icon="i-heroicons-trash-16-solid" size="2xs" @click="removeSection(section)" />
            </UTooltip>
            <UTooltip v-if="index" text="Перемістити вище">
              <UButton icon="i-heroicons-arrow-up-16-solid" size="2xs" @click="moveUp(section)" />
            </UTooltip>
            <UTooltip v-if="index !== sections.length - 1" text="Перемістити нижче">
              <UButton icon="i-heroicons-arrow-down-16-solid" size="2xs" @click="moveDown(section)" />
            </UTooltip>
          </UButtonGroup>
        </div>
      </UDivider>
      <div v-if="section.type === 'text'">
        <div class="flex gap-2 flex-wrap mb-4">
          <UFormGroup label="Тип:" class="flex-1">
            <USelect
              v-model="section.tag"
              option-attribute="label"
              value-attribute="value"
              :options="[
                { label: 'Заголовок 1', value: 'h1' },
                { label: 'Заголовок 2', value: 'h2' },
                { label: 'Заголовок 3', value: 'h3' },
                { label: 'Заголовок 4', value: 'h4' },
                { label: 'Заголовок 5', value: 'h5' },
                { label: 'Заголовок 6', value: 'h6' },
                { label: 'Параграф', value: 'p' },
                { label: 'Список', value: 'ul' },
              ]"
            />
          </UFormGroup>
          <UFormGroup label="Вирівнювання:" class="flex-1">
            <USelect
              v-model="section.align"
              option-attribute="label"
              value-attribute="value"
              :options="[
                { label: 'Зліва', value: 'left' },
                { label: 'По центру', value: 'center' },
                { label: 'Справа', value: 'right' },
              ]"
            />
          </UFormGroup>
        </div>
        <UTextarea v-model="section.content" />
      </div>

      <div v-else-if="section.type === 'image'">
        <div class="space-y-2 mb-2">
          <UFormGroup label="Пропорція:" class="flex-1">
            <USelect
              v-model="section.aspectRatio"
              option-attribute="label"
              value-attribute="value"
              :options="[
                { label: 'Автоматична', value: 'auto' },
                { label: '1:1', value: 1 },
                { label: '2:1', value: '2/1' },
                { label: '3:1', value: '3/1' },
                { label: '4:1', value: '4/1' },
                { label: '1:4', value: '1/4' },
                { label: '1:3', value: '1/3' },
                { label: '1:2', value: '1/2' },
              ]"
            />
          </UFormGroup>
          <UFormGroup label="Вміщення картинки:" class="flex-1">
            <USelect
              v-model="section.fit"
              option-attribute="label"
              value-attribute="value"
              :options="[
                { label: 'Заповнити', value: 'cover' },
                { label: 'Вмістити', value: 'contain' },
              ]"
            />
          </UFormGroup>
        </div>
        <CmsImage
          v-bind="section"
          class="cursor-pointer max-w-64"
          @click="setImage(section)"
        />
      </div>
      <div v-else-if="section.type === 'grid'">
        <div class="grid grid-cols-4 gap-4 mb-4">
          <UFormGroup label="Кількість колонок (sm):">
            <USelect v-model="section.columns.sm" :options="[1, 2, 3, 4, 5, 6]" />
          </UFormGroup>
          <UFormGroup label="Кількість колонок (md):">
            <USelect v-model="section.columns.md" :options="[1, 2, 3, 4, 5, 6]" />
          </UFormGroup>
          <UFormGroup label="Кількість колонок (lg):">
            <USelect v-model="section.columns.lg" :options="[1, 2, 3, 4, 5, 6]" />
          </UFormGroup>
          <UFormGroup label="Кількість колонок (xl):">
            <USelect v-model="section.columns.xl" :options="[1, 2, 3, 4, 5, 6]" />
          </UFormGroup>
        </div>
        <CmsGrid :columns="section.columns">
          <div v-for="group, key in section.groups" :key="key + gridKey" class="shadow-md hover:shadow-xl p-2">
            <UDivider>
              <UBadge label="Комірка сітки" />
              <UButtonGroup>
                <UTooltip text="Створити дублікат комірки">
                  <UButton icon="i-heroicons-document-duplicate-solid" size="2xs" @click="duplicateGroup(group, section.groups)" />
                </UTooltip>
                <UTooltip text="Видалити комірку">
                  <UButton icon="i-heroicons-trash-16-solid" size="2xs" @click="removeGroup(group, section.groups)" />
                </UTooltip>
                <UTooltip text="Перемістити назад">
                  <UButton icon="i-heroicons-arrow-left-16-solid" size="2xs" @click="moveLeft(group, section.groups)" />
                </UTooltip>
                <UTooltip text="Перемістити вперед">
                  <UButton icon="i-heroicons-arrow-right-16-solid" size="2xs" @click="moveRight(group, section.groups)" />
                </UTooltip>
              </UButtonGroup>
            </UDivider>
            <CmsSectionComposer :sections="group" :allowed-types="['group', 'card', 'image', 'text', 'call']" single @update="section.groups[key] = $event" />
          </div>
          <div class="flex items-center justify-center shadow-md hover:shadow-xl  p-2">
            <UButton icon="i-heroicons-rectangle-group-20-solid" @click="section.groups.push([])">
              Додати комірку
            </UButton>
          </div>
        </CmsGrid>
      </div>
      <div v-else-if="section.type === 'carousel'">
        <div class="grid grid-cols-4 gap-4 mb-4">
          <UFormGroup label="Кількість колонок (sm):">
            <USelect v-model="section.columns.sm" :options="[1, 2, 3, 4, 5, 6]" />
          </UFormGroup>
          <UFormGroup label="Кількість колонок (md):">
            <USelect v-model="section.columns.md" :options="[1, 2, 3, 4, 5, 6]" />
          </UFormGroup>
          <UFormGroup label="Кількість колонок (lg):">
            <USelect v-model="section.columns.lg" :options="[1, 2, 3, 4, 5, 6]" />
          </UFormGroup>
          <UFormGroup label="Кількість колонок (xl):">
            <USelect v-model="section.columns.xl" :options="[1, 2, 3, 4, 5, 6]" />
          </UFormGroup>
          <UFormGroup label="Показувати стрілки:">
            <UCheckbox v-model="section.arrows" />
          </UFormGroup>
          <UFormGroup label="Автопрогравання:">
            <UCheckbox v-model="section.autoplay" />
          </UFormGroup>
          <UFormGroup label="Тривалість (секунд):">
            <UInput :model-value="section.duration / 1000" @update:model-value="section.duration = $event * 1000" />
          </UFormGroup>
        </div>
        <CmsGrid :columns="section.columns">
          <div v-for="group, key in section.groups" :key="key + gridKey" class="shadow-md hover:shadow-xl p-2">
            <UDivider>
              <UBadge label="Комірка сітки" />
              <UButtonGroup>
                <UTooltip text="Створити дублікат комірки">
                  <UButton icon="i-heroicons-document-duplicate-solid" size="2xs" @click="duplicateGroup(group, section.groups)" />
                </UTooltip>
                <UTooltip text="Видалити комірку">
                  <UButton icon="i-heroicons-trash-16-solid" size="2xs" @click="removeGroup(group, section.groups)" />
                </UTooltip>
                <UTooltip text="Перемістити назад">
                  <UButton icon="i-heroicons-arrow-left-16-solid" size="2xs" @click="moveLeft(group, section.groups)" />
                </UTooltip>
                <UTooltip text="Перемістити вперед">
                  <UButton icon="i-heroicons-arrow-right-16-solid" size="2xs" @click="moveRight(group, section.groups)" />
                </UTooltip>
              </UButtonGroup>
            </UDivider>
            <CmsSectionComposer :sections="group" :allowed-types="['group', 'card', 'image', 'text', 'call']" single @update="section.groups[key] = $event" />
          </div>
          <div class="flex items-center justify-center shadow-md hover:shadow-xl  p-2">
            <UButton icon="i-heroicons-rectangle-group-20-solid" @click="section.groups.push([])">
              Додати комірку
            </UButton>
          </div>
        </CmsGrid>
      </div>
      <div v-else-if="section.type === 'card'">
        <CmsSectionComposer :sections="section.sections" :allowed-types="['image', 'text']" @update="section.sections = $event" />
      </div>
      <div v-else-if="section.type === 'group'">
        <CmsSectionComposer :sections="section.sections" :allowed-types="['image', 'text', 'call', 'contacts']" @update="section.sections = $event" />
      </div>
      <div v-else-if="section.type === 'contacts'">
        <CmsContacts />
      </div>
      <div v-else-if="section.type === 'call'">
        <CmsCall />
      </div>
      <div v-else-if="section.type === 'headerNavigation'">
        <UTextarea v-model="section.items" autoresize />
      </div>
    </div>
    <UDivider v-if="single ? sections.length !== 1 : true">
      <UDropdown
        :items="menu"
        :popper="{ placement: 'bottom-start' }"
      >
        <UButton icon="i-heroicons-folder-plus-16-solid">
          Додати секцію
        </UButton>
      </UDropdown>
    </UDivider>
  </div>
</template>
