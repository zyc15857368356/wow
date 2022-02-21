import Vue from 'vue'
import App from './App'
// import Vant from 'vant'
// Vue.use(Vant)
// import 'vant/lib/index.css'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
