import Vue from 'vue'

import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'

const ElementUI = require('element-ui');

locale.use(lang);

Vue.use(ElementUI);
