import Component from "./core/Component.js";
import ReservationPage from "./component/ReservationPage.js";

export default class App extends Component {
  setup() {
    this.$state = {
      reservations: [],
    };
  }

  template() {
    return `
      <div class="reservation-page"></div>
    `;
  }

  mounted() {
    const $reservationPage = this.$target.querySelector('.reservation-page');
    new ReservationPage($reservationPage);
  }
}