const store = require('../../../../store');
const constants = require('../constants');

function showGiftCardWarningMessage() {
  const alertContainer = document.createElement('div');
  alertContainer.setAttribute('id', 'giftCardWarningMessage');
  alertContainer.classList.add(
    'alert',
    'alert-warning',
    'error-message',
    'gift-card-warning-msg',
  );
  alertContainer.setAttribute('role', 'alert');

  const alertContainerP = document.createElement('p');
  alertContainerP.classList.add('error-message-text');
  alertContainerP.textContent = window.giftCardWarningMessage;

  alertContainer.appendChild(alertContainerP);

  const orderTotalSummaryEl = document.querySelector(
    '.card-body.order-total-summary',
  );
  orderTotalSummaryEl.appendChild(alertContainer);
}

function getGiftCardElements() {
  const giftCardSelect = document.querySelector('#giftCardSelect');
  const giftCardUl = document.querySelector('#giftCardUl');
  const giftCardContainer = document.querySelector('#giftCardContainer');
  const giftCardAddButton = document.querySelector('#giftCardAddButton');
  const giftCardSelectContainer = document.querySelector(
    '#giftCardSelectContainer',
  );
  const giftCardsList = document.querySelector('#giftCardsList');

  return {
    giftCardSelect,
    giftCardUl,
    giftCardContainer,
    giftCardAddButton,
    giftCardSelectContainer,
    giftCardsList,
  };
}

function attachGiftCardFormListeners() {
  if (store.giftCardComponentListenersAdded) {
    return;
  }

  store.giftCardComponentListenersAdded = true;
  const {
    giftCardUl,
    giftCardSelect,
    giftCardContainer,
    giftCardAddButton,
    giftCardSelectContainer,
  } = getGiftCardElements();

  if (giftCardUl) {
    giftCardUl.addEventListener('click', (event) => {
      giftCardUl.classList.toggle('invisible');
      const selectedGiftCard = {
        name: event.target.dataset.name,
        brand: event.target.dataset.brand,
        type: event.target.dataset.type,
      };
      if (
        selectedGiftCard.brand !== store.partialPaymentsOrderObj?.giftcard.brand
      ) {
        if (store.componentsObj?.giftcard) {
          store.componentsObj.giftcard.node.unmount('component_giftcard');
        }
        if (!store.partialPaymentsOrderObj) {
          store.partialPaymentsOrderObj = {};
        }
        store.partialPaymentsOrderObj.giftcard = selectedGiftCard;
        giftCardSelect.value = selectedGiftCard.brand;
        giftCardContainer.innerHTML = '';
        const giftCardNode = store.checkout
          .create(constants.GIFTCARD, {
            ...store.checkoutConfiguration.giftcard,
            brand: selectedGiftCard.brand,
            name: selectedGiftCard.name,
          })
          .mount(giftCardContainer);
        store.componentsObj.giftcard = { node: giftCardNode };
      }
    });
  }

  if (giftCardAddButton) {
    giftCardAddButton.addEventListener('click', () => {
      giftCardAddButton.setAttribute('click-listener', 'true');
      if (store.partialPaymentsOrderObj) {
        return;
      }
      const giftCardWarningMessageEl = document.querySelector(
        '#giftCardWarningMessage',
      );
      if (giftCardWarningMessageEl) {
        giftCardWarningMessageEl.style.display = 'none';
      }
      giftCardAddButton.style.display = 'none';
      giftCardSelectContainer.classList.remove('invisible');
    });
  }

  if (giftCardSelect) {
    giftCardSelect.addEventListener('click', () => {
      giftCardUl.classList.toggle('invisible');
    });
  }
}

function removeGiftCardFormListeners() {
  const {
    giftCardUl,
    giftCardSelect,
    giftCardAddButton,
  } = getGiftCardElements();

  giftCardUl.replaceWith(giftCardUl.cloneNode(true));
  giftCardSelect.replaceWith(giftCardSelect.cloneNode(true));
  giftCardAddButton.replaceWith(giftCardAddButton.cloneNode(true));

  store.giftCardComponentListenersAdded = false;
}

function renderGiftCardSelectForm() {
  const { giftCardSelect, giftCardUl } = getGiftCardElements();
  if (giftCardUl?.innerHTML) {
    return;
  }

  const { paymentMethodsResponse } = store.checkout;
  const { imagePath } = store.checkoutConfiguration.session;

  const giftCardBrands = paymentMethodsResponse.paymentMethods.filter(
    (pm) => pm.type === constants.GIFTCARD,
  );

  giftCardBrands.forEach((giftCard) => {
    const newListItem = document.createElement('li');
    newListItem.setAttribute('data-brand', giftCard.brand);
    newListItem.setAttribute('data-name', giftCard.name);
    newListItem.setAttribute('data-type', giftCard.type);

    const span = document.createElement('span');
    span.textContent = giftCard.name;
    const img = document.createElement('img');
    img.src = `${imagePath}${giftCard.brand}.png`;
    img.width = 40;
    img.height = 26;

    newListItem.appendChild(span);
    newListItem.appendChild(img);

    giftCardUl.appendChild(newListItem);

    const newOption = document.createElement('option');
    newOption.textContent = giftCard.name;
    newOption.value = giftCard.brand;
    newOption.style.visibility = 'hidden';
    giftCardSelect.appendChild(newOption);
  });

  attachGiftCardFormListeners();
}

function removeGiftCard() {
  $.ajax({
    type: 'POST',
    url: 'Adyen-CancelPartialPaymentOrder',
    data: JSON.stringify(store.partialPaymentsOrderObj),
    contentType: 'application/json; charset=utf-8',
    async: false,
    success(res) {
      const adyenPartialPaymentsOrder = document.querySelector(
        '#adyenPartialPaymentsOrder',
      );

      const {
        giftCardsList,
        giftCardAddButton,
        giftCardSelect,
        giftCardUl,
      } = getGiftCardElements();

      adyenPartialPaymentsOrder.value = null;
      giftCardsList.innerHTML = '';
      giftCardAddButton.style.display = 'block';
      giftCardSelect.value = null;
      giftCardUl.innerHTML = '';

      store.partialPaymentsOrderObj = null;
      window.sessionStorage.removeItem(constants.GIFTCARD_DATA_ADDED);

      if (res.resultCode === constants.RECEIVED) {
        document.querySelector('#cancelGiftCardContainer')?.parentNode.remove();
        store.componentsObj?.giftcard?.node.unmount('component_giftcard');
      }
    },
  });
}

function renderAddedGiftCard() {
  const giftCardData = store.partialPaymentsOrderObj.giftcard;
  const { imagePath } = store.checkoutConfiguration.session;

  const { giftCardsList, giftCardAddButton } = getGiftCardElements();

  const giftCardDiv = document.createElement('div');
  giftCardDiv.classList.add('gift-card');

  const brandContainer = document.createElement('div');
  brandContainer.classList.add('brand-container');

  const giftCardImg = document.createElement('img');
  const giftCardImgSrc = `${imagePath}${giftCardData.brand}.png`;
  giftCardImg.setAttribute('src', giftCardImgSrc);
  giftCardImg.classList.add('gift-card-logo');

  const giftCardNameP = document.createElement('p');
  giftCardNameP.textContent = giftCardData.name;

  brandContainer.appendChild(giftCardImg);
  brandContainer.appendChild(giftCardNameP);

  const giftCardAction = document.createElement('div');
  giftCardAction.classList.add('gift-card-action');

  const removeAnchor = document.createElement('a');
  removeAnchor.textContent = window.removeGiftCardButtonText;
  removeAnchor.addEventListener('click', () => {
    removeGiftCard();
    renderGiftCardSelectForm();
  });

  giftCardAction.appendChild(removeAnchor);

  const brandAndRemoveActionWrapper = document.createElement('div');
  brandAndRemoveActionWrapper.classList.add('wrapper');
  brandAndRemoveActionWrapper.appendChild(brandContainer);
  brandAndRemoveActionWrapper.appendChild(giftCardAction);

  const giftCardAmountDiv = document.createElement('div');
  giftCardAmountDiv.classList.add('wrapper');
  const amountLabel = document.createElement('p');
  amountLabel.textContent = window.discountedAmountGiftCardResource;
  const amountValue = document.createElement('strong');
  amountValue.textContent = store.partialPaymentsOrderObj.discountedAmount;
  giftCardAmountDiv.appendChild(amountLabel);
  giftCardAmountDiv.appendChild(amountValue);

  giftCardDiv.appendChild(brandAndRemoveActionWrapper);
  giftCardDiv.appendChild(giftCardAmountDiv);

  giftCardsList.appendChild(giftCardDiv);

  giftCardAddButton.style.display = 'none';

  removeGiftCardFormListeners();
}

function createElementsToShowRemainingGiftCardAmount() {
  const mainContainer = document.createElement('div');
  const remainingAmountContainer = document.createElement('div');
  const remainingAmountStart = document.createElement('div');
  const remainingAmountEnd = document.createElement('div');
  const discountedAmountContainer = document.createElement('div');
  const discountedAmountStart = document.createElement('div');
  const discountedAmountEnd = document.createElement('div');
  const cancelGiftCard = document.createElement('a');
  const remainingAmountStartP = document.createElement('p');
  const remainingAmountEndP = document.createElement('p');
  const discountedAmountStartP = document.createElement('p');
  const discountedAmountEndP = document.createElement('p');
  const cancelGiftCardP = document.createElement('p');
  const remainingAmountStartSpan = document.createElement('span');
  const discountedAmountStartSpan = document.createElement('span');
  const cancelGiftCardSpan = document.createElement('span');
  const remainingAmountEndSpan = document.createElement('span');
  const discountedAmountEndSpan = document.createElement('span');

  remainingAmountContainer.classList.add('row', 'grand-total', 'leading-lines');
  remainingAmountStart.classList.add('col-6', 'start-lines');
  remainingAmountEnd.classList.add('col-6', 'end-lines');
  remainingAmountStartP.classList.add('order-receipt-label');
  discountedAmountContainer.classList.add(
    'row',
    'grand-total',
    'leading-lines',
  );
  discountedAmountStart.classList.add('col-6', 'start-lines');
  discountedAmountEnd.classList.add('col-6', 'end-lines');
  discountedAmountStartP.classList.add('order-receipt-label');
  cancelGiftCardP.classList.add('order-receipt-label');
  remainingAmountEndP.classList.add('text-right');
  discountedAmountEndP.classList.add('text-right');
  cancelGiftCard.id = 'cancelGiftCardContainer';
  cancelGiftCard.role = 'button';
  discountedAmountContainer.id = 'discountedAmountContainer';
  remainingAmountContainer.id = 'remainingAmountContainer';

  remainingAmountStartSpan.innerText = window.remainingAmountGiftCardResource;
  discountedAmountStartSpan.innerText = window.discountedAmountGiftCardResource;
  cancelGiftCardSpan.innerText = window.cancelGiftCardResource;
  remainingAmountEndSpan.innerText =
    store.partialPaymentsOrderObj.remainingAmount;
  discountedAmountEndSpan.innerText =
    store.partialPaymentsOrderObj.discountedAmount;

  cancelGiftCard.addEventListener('click', () => {
    removeGiftCard();
    renderGiftCardSelectForm();
  });

  remainingAmountContainer.appendChild(remainingAmountStart);
  remainingAmountContainer.appendChild(remainingAmountEnd);
  remainingAmountContainer.appendChild(cancelGiftCard);
  remainingAmountStart.appendChild(remainingAmountStartP);

  discountedAmountContainer.appendChild(discountedAmountStart);
  discountedAmountContainer.appendChild(discountedAmountEnd);
  discountedAmountStart.appendChild(discountedAmountStartP);

  cancelGiftCard.appendChild(cancelGiftCardP);
  remainingAmountEnd.appendChild(remainingAmountEndP);
  remainingAmountStartP.appendChild(remainingAmountStartSpan);
  discountedAmountEnd.appendChild(discountedAmountEndP);
  discountedAmountStartP.appendChild(discountedAmountStartSpan);
  cancelGiftCardP.appendChild(cancelGiftCardSpan);
  remainingAmountEndP.appendChild(remainingAmountEndSpan);
  discountedAmountEndP.appendChild(discountedAmountEndSpan);

  const pricingContainer = document.querySelector(
    '.card-body.order-total-summary',
  );
  mainContainer.appendChild(discountedAmountContainer);
  mainContainer.appendChild(remainingAmountContainer);
  mainContainer.appendChild(cancelGiftCard);
  pricingContainer.appendChild(mainContainer);
}

module.exports = {
  removeGiftCard,
  renderAddedGiftCard,
  renderGiftCardSelectForm,
  getGiftCardElements,
  showGiftCardWarningMessage,
  createElementsToShowRemainingGiftCardAmount,
};
