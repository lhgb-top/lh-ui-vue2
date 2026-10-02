import LhLayoutSfc from './src/index.vue'
import LhLayoutHeaderSfc from './src/header.vue'
import LhLayoutAsideSfc from './src/aside.vue'
import LhLayoutMainSfc from './src/main.vue'
import LhLayoutFooterSfc from './src/footer.vue'
import { withInstall } from '../../install'

export { LH_LAYOUT_KEY } from './src/types'
export type { LhLayoutProps, LhLayoutSectionProps, LhLayoutAsideProps } from './src/types'

const LhLayout = withInstall('LhLayout', LhLayoutSfc)
const LhLayoutHeader = withInstall('LhLayoutHeader', LhLayoutHeaderSfc)
const LhLayoutAside = withInstall('LhLayoutAside', LhLayoutAsideSfc)
const LhLayoutMain = withInstall('LhLayoutMain', LhLayoutMainSfc)
const LhLayoutFooter = withInstall('LhLayoutFooter', LhLayoutFooterSfc)

export default LhLayout
export { LhLayout, LhLayoutHeader, LhLayoutAside, LhLayoutMain, LhLayoutFooter }
