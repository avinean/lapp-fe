import type { Sizes } from './ds'
import type { GalleryEntity } from './entities'

export interface TextSection {
  type: 'text'
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'ul'
  align: 'left' | 'center' | 'right'
  content: string
}

export interface ImageSection {
  type: 'image'
  fit: 'contain' | 'cover'
  aspectRatio?: 'auto' | 1 | '2/1' | '3/2' | '4/3' | '3/4' | '2/3' | '1/2'
  image: GalleryEntity | null
}

export interface GridSection {
  type: 'grid'
  columns: {
    [S in Sizes]: 1 | 2 | 3 | 4 | 5 | 6
  }
  groups: CmsSection[][]
}

export interface CardSection {
  type: 'card'
  image: GalleryEntity | null
  sections: CmsSection[]
}

export interface ContactsSection {
  type: 'contacts'
}

export interface CallSection {
  type: 'call'
}

export interface GroupSection {
  type: 'group'
  sections: CmsSection[]
}

export interface CarouselSection {
  type: 'carousel'
  columns: {
    [S in Sizes]: 1 | 2 | 3 | 4 | 5 | 6
  }
  arrows: boolean
  autoplay: boolean
  duration: number
  groups: CmsSection[][]
}

export interface NavigationItem {
  to: string
  label: string
  children?: NavigationItem[]
}
export interface HeaderNavigationSection {
  type: 'headerNavigation'
  items: string
}

export type CmsSection = TextSection | ImageSection | GridSection | CardSection | ContactsSection | CallSection | GroupSection | CarouselSection | HeaderNavigationSection

export interface CmsEntity {
  id: number
  slug: string
  title: string
  content: CmsSection[]
  createdAt: Date
  updatedAt: Date
}
