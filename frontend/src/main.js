import 'whatwg-fetch'; // IE11에서 fetch 사용 위해 추가
import 'element-closest'; // IE11에서 closest() 사용 위해 추가
import App from './App.js';

new App(document.querySelector('#app'));
