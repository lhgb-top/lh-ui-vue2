<script lang="ts">
import Vue from 'vue'

/**
 * 首页自定义布局（frontmatter `layout: LhHome`）。
 * VuePress 1.x 默认主题的 home 不支持多 CTA / icon / linkText，
 * 这里读取与 vitepress 时代一致的 hero / features frontmatter 结构，
 * 保住「大字渐变主标 + 多按钮 + 特性卡片」的视觉（样式在 styles/index.styl）。
 *
 * v1 的 frontmatter layout 是整体替换站点布局（不像 VitePress 的 home 只是
 * 内容层），默认主题的 navbar / sidebar 不会自动出现，这里显式渲染 Navbar
 * （父主题组件，经 @theme 别名解析），与 plus 站首页对齐。
 */
import Navbar from '@theme/components/Navbar.vue'
import DarkToggle from './components/DarkToggle.vue'

interface HeroAction {
  theme?: string
  text: string
  link: string
}

interface HomeFeature {
  icon?: string
  title: string
  details?: string
  link?: string
  linkText?: string
}

interface HeroFrontmatter {
  name?: string
  text?: string
  tagline?: string
  image?: { src?: string; alt?: string; width?: number; height?: number }
  actions?: HeroAction[]
}

export default Vue.extend({
  name: 'LhHome',
  components: { Navbar, DarkToggle },
  computed: {
    hero(): HeroFrontmatter {
      return ((this.$page as unknown as { frontmatter?: { hero?: HeroFrontmatter } }).frontmatter
        ?.hero ?? {}) as HeroFrontmatter
    },
    features(): HomeFeature[] {
      const fm = (this.$page as unknown as { frontmatter?: { features?: HomeFeature[] } })
        .frontmatter
      return fm?.features ?? []
    },
    footer(): { message?: string; copyright?: string } {
      const fm = (
        this.$page as unknown as {
          frontmatter?: { footer?: { message?: string; copyright?: string } }
        }
      ).frontmatter
      return fm?.footer ?? {}
    },
    isExternal(): (link?: string) => boolean {
      return (link?: string): boolean => !!link && /^https?:\/\//.test(link)
    },
  },
})
</script>

<template>
  <div class="theme-container lh-home-shell">
    <Navbar />
    <main class="lh-home">
      <header class="lh-home__hero">
        <img
          v-if="hero.image && hero.image.src"
          class="lh-home__logo"
          :src="$withBase(hero.image.src)"
          :alt="(hero.image && hero.image.alt) || 'logo'"
          :width="hero.image.width || 120"
          :height="hero.image.height || 120"
        />
        <h1
          v-if="hero.name"
          class="lh-home__name"
        >
          {{ hero.name }}
        </h1>
        <p
          v-if="hero.text"
          class="lh-home__text"
        >
          {{ hero.text }}
        </p>
        <p
          v-if="hero.tagline"
          class="lh-home__tagline"
        >
          {{ hero.tagline }}
        </p>
        <div
          v-if="hero.actions && hero.actions.length"
          class="lh-home__actions"
        >
          <template v-for="(action, i) in hero.actions">
            <router-link
              v-if="action.link && !isExternal(action.link)"
              :key="'in-' + i"
              class="lh-home__action"
              :class="'lh-home__action--' + (action.theme || 'alt')"
              :to="action.link"
            >
              {{ action.text }}
            </router-link>
            <a
              v-else
              :key="'ex-' + i"
              class="lh-home__action"
              :class="'lh-home__action--' + (action.theme || 'alt')"
              :href="action.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ action.text }}
            </a>
          </template>
        </div>
      </header>

      <section
        v-if="features.length"
        class="lh-home__features"
      >
        <template v-for="(feature, i) in features">
          <router-link
            v-if="feature.link && !isExternal(feature.link)"
            :key="'in-' + i"
            v-reveal="i * 90"
            class="lh-home__feature"
            :to="feature.link"
          >
            <div
              v-if="feature.icon"
              class="lh-home__feature-icon"
            >
              {{ feature.icon }}
            </div>
            <h2 class="lh-home__feature-title">
              {{ feature.title }}
            </h2>
            <p
              v-if="feature.details"
              class="lh-home__feature-details"
            >
              {{ feature.details }}
            </p>
            <span
              v-if="feature.linkText"
              class="lh-home__feature-link"
            >
              {{ feature.linkText }} →
            </span>
          </router-link>
          <a
            v-else
            :key="'ex-' + i"
            v-reveal="i * 90"
            class="lh-home__feature"
            :href="feature.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div
              v-if="feature.icon"
              class="lh-home__feature-icon"
            >
              {{ feature.icon }}
            </div>
            <h2 class="lh-home__feature-title">
              {{ feature.title }}
            </h2>
            <p
              v-if="feature.details"
              class="lh-home__feature-details"
            >
              {{ feature.details }}
            </p>
            <span
              v-if="feature.linkText"
              class="lh-home__feature-link"
            >
              {{ feature.linkText }} →
            </span>
          </a>
        </template>
      </section>

      <footer
        v-if="footer.message || footer.copyright"
        class="lh-home__footer"
      >
        <p
          v-if="footer.message"
          class="lh-home__footer-message"
        >
          {{ footer.message }}
        </p>
        <p
          v-if="footer.copyright"
          class="lh-home__footer-copyright"
        >
          {{ footer.copyright }}
        </p>
      </footer>
    </main>
    <DarkToggle />
  </div>
</template>
