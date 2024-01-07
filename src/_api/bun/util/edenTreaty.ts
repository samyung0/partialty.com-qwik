import { edenTreaty } from '@elysiajs/eden'
import type { App } from '../../../../bun/index' 

const bunApp = edenTreaty<App>(import.meta.env.MODE === "development" ? "https://api.partialty.com" : 'http://localhost:8080')

export default bunApp;