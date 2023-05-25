import Component from "../core/Component.js";
import { getReservations } from "../api/reservation.js";
import { dateFormat } from "../lib/util.js";

export default class ReservationPage extends Component {
  async setup() {
    this.$state = {
      reservations: [],
      reservation: {}
    };
    await this.init();
  }

  async init() {
    const { reservations } = await getReservations();
    this.setState({ reservations });
    this.setState({ reservation: reservations[0] });
    this.adjustReservationContentHeight();
  }

  template() {
    if (!this.$state || !this.$state.reservations || !this.$state.reservation) {
      return '';
    }
    const { reservations, reservation } = this.$state;
    const filteredList = reservations.filter(item => item.status !== 'done');

    const formattedList = filteredList.map(reservation => {
      return this.formatReservation(reservation);
    });
    const formattedItem = this.formatReservation(reservation);

    return `
      <div class="title">
        <span>예약 목록</span>
      </div>
      <div class="reservation">
        <div class="reservation-content">
        ${formattedList.map(reservation => `
          <div class="list" data-reservation-id="${reservation.id}">
            <div class="list-item detail-open-button left vertical-center">
              <div class="list-item-summary ellipsis">
                ${reservation.timeReserved}
              </div>
              <div class="list-item-summary ellipsis" style="color: ${reservation.statusColor}">
                ${reservation.statusText}
              </div>
            </div>
            <div class="list-item detail-open-button center vertical-center">
              <div class="list-item-info ellipsis">
                ${reservation.customerName} - ${reservation.tables}
              </div>
              <div class="list-item-info ellipsis">
                성인 ${reservation.customerAdult} 아이 ${reservation.customerChild}
              </div>
              <div class="list-item-info ellipsis">
                ${reservation.menus}
              </div>
            </div>
            <div class="list-item right vertical-center">
              <div>
                <button class="reservation-button">
                  ${reservation.statusButtonText}
                </button>
              </div>
            </div>
          </div>
        `).join('')}
        </div>

        <div class="detail modal">
          <div class="modal-background"></div>
          <div class="modal-content">
            <div>
              <div class="detail-area">
                <div class="detail-title">
                  예약 정보
                </div>
                <div class="detail-close-button">
                  닫기
                </div>
              </div>
              <div class="detail-content">
                <div class="detail-sub-content">
                  <span class="detail-sub-content-key">예약 상태</span>
                  <span class="detail-sub-content-value">
                    ${formattedItem.statusText}
                  </span>
                </div>
                <div class="detail-sub-content">
                  <span class="detail-sub-content-key">예약 시간</span>
                  <span class="detail-sub-content-value">
                    ${formattedItem.timeReserved}
                  </span>
                </div>
                <div class="detail-sub-content">
                  <span class="detail-sub-content-key">접수 시간</span>
                  <span class="detail-sub-content-value">
                    ${formattedItem.timeRegistered}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div class="detail-title">
                고객 정보
              </div>
              <div class="detail-content">
                <div class="detail-sub-content">
                  <div class="detail-sub-content-key">고객 성명</div>
                  <div class="detail-sub-content-value ellipsis">
                    ${formattedItem.customerName}
                  </div>
                </div>
                <div class="detail-sub-content">
                  <div class="detail-sub-content-key">고객 등급</div>
                  <div class="detail-sub-content-value ellipsis">
                    ${formattedItem.customerLevel}
                  </div>
                </div>
                <div class="detail-sub-content">
                  <div class="detail-sub-content-key">고객 메모</div>
                  <div class="detail-sub-content-value row-limit-three">
                    ${formattedItem.customerMemo}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="detail-no-title"></div>
              <div class="detail-content">
                <div class="detail-sub-content">
                  <span class="detail-sub-content-key">요청사항</span>
                  <span class="detail-sub-content-value row-limit-three">
                    ${formattedItem.customerRequest}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setEvent() {
    this.addEvent('click', '.reservation-button', ({ target }) => {
      const listItem = target.closest('.list');
      const id = listItem.dataset.reservationId;
      const reservation = this.$state.reservations.find(item => item.id === id);
      const status = reservation.status;

      if (status === 'reserved') {
        this.updateReservationStatus(id, 'seated');
      } else if (status === 'seated') {
        this.removeReservation(id);
      }
      this.adjustReservationContentHeight();
    });

    this.addEvent('click', '.detail-open-button', ({ target }) => {
      const listItem = target.closest('.list');
      const id = listItem.dataset.reservationId;
      const reservation = this.$state.reservations.find(item => item.id === id);

      this.setState({ reservation: reservation });
      this.openModal();
      this.adjustReservationContentHeight();
    });

    this.addEvent('click', '.detail-close-button', () => {
      this.closeModal();
    });

    this.addEvent('click', '.modal-background', () => {
      this.closeModal();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        this.openModal();
      } else {
        this.closeModal();
      }
      this.adjustReservationContentHeight();
    });
  }

  openModal() {
    const $modal = this.$target.querySelector('.modal');
    $modal.style.display = 'block';
  }

  closeModal() {
    const $modal = this.$target.querySelector('.modal');
    $modal.style.display = 'none';
  }

  updateReservationStatus(id, status) {
    const reservations = this.$state.reservations.map(item => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    this.setState({ reservations });
  }

  removeReservation(id) {
    const reservations = this.$state.reservations.filter(item => item.id !== id);
    this.setState({ reservations });
  }

  adjustReservationContentHeight() {
    const $reservationContent = this.$target.querySelector('.reservation-content');
    const windowHeight = window.innerHeight;
    const reservationContentTop = $reservationContent.getBoundingClientRect().top;
    const height = windowHeight - reservationContentTop;

    $reservationContent.style.maxHeight = `${height}px`;
  }

  statusFormat(status) {
    switch (status) {
      case 'reserved':
        return { text: '예약', color: '#3BB94C', buttonText: '착석' };
      case 'seated':
        return { text: '착석 중', color: '#162149', buttonText: '퇴석' };
      default:
        return { text: '', color: '#000000', buttonText: '' };
    }
  }

  formatReservation(reservation) {
    const { text, color, buttonText } = this.statusFormat(reservation.status);
    return {
      id: reservation.id,
      statusText: text,
      statusColor: color,
      statusButtonText: buttonText,
      timeReserved: dateFormat(reservation?.timeReserved || '', 'HH:mm'),
      timeRegistered: dateFormat(reservation?.timeReserved || '', 'HH:mm'),
      customerName: reservation?.customer?.name || '',
      customerLevel: reservation?.customer?.level || '',
      customerMemo: reservation?.customer?.memo || '',
      customerRequest: reservation?.customer?.request || '',
      customerAdult: reservation?.customer?.adult || '',
      customerChild: reservation?.customer?.child || '',
      tables: reservation?.tables?.map(table => table.name).join(', ') || '',
      menus: reservation?.menus?.map(menu => `${menu.name}(${menu.qty})`).join(', ') || ''
    };
  }
}