import { edenTreaty } from '@elysiajs/eden'
import type { App } from '../../../../bun/index' 

const bunApp = edenTreaty<App>('http://localhost:8080')

export default bunApp;