import { createApp } from 'vue'
// import '@/style.css'
import App from '@/App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-purple/theme.css'
import Button from "primevue/button"
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Sidebar from 'primevue/sidebar';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Fieldset from 'primevue/fieldset';
import Checkbox from 'primevue/checkbox';
import 'primeicons/primeicons.css'



const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);

app.component('Button', Button);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('Sidebar', Sidebar);
app.component('Toast', Toast);
app.component('Fieldset', Fieldset);
app.component('Checkbox', Checkbox);
app.mount('#app');