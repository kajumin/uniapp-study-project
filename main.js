import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

// Vue.prototype.$serverURL = 'https://www.imovietrailer.com/superhero/index/carousel/list'
Vue.prototype.getGlobalUser = function(key){
	var globalUser = uni.getStorageSync(key);
	if(globalUser != undefined && globalUser != null && globalUser != '') {
		return globalUser;
	}else {
		return null;
	}
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
