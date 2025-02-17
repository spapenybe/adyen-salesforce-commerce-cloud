"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var store = require('../../../../store');
var constants = require('../constants');
function showGiftCardWarningMessage() {
  var alertContainer = document.createElement('div');
  alertContainer.setAttribute('id', 'giftCardWarningMessage');
  alertContainer.classList.add('alert', 'alert-warning', 'error-message', 'gift-card-warning-msg');
  alertContainer.setAttribute('role', 'alert');
  var alertContainerP = document.createElement('p');
  alertContainerP.classList.add('error-message-text');
  alertContainerP.textContent = window.giftCardWarningMessage;
  alertContainer.appendChild(alertContainerP);
  var orderTotalSummaryEl = document.querySelector('.card-body.order-total-summary');
  orderTotalSummaryEl.appendChild(alertContainer);
}
function getGiftCardElements() {
  var giftCardSelect = document.querySelector('#giftCardSelect');
  var giftCardUl = document.querySelector('#giftCardUl');
  var giftCardContainer = document.querySelector('#giftCardContainer');
  var giftCardAddButton = document.querySelector('#giftCardAddButton');
  var giftCardSelectContainer = document.querySelector('#giftCardSelectContainer');
  var giftCardsList = document.querySelector('#giftCardsList');
  return {
    giftCardSelect: giftCardSelect,
    giftCardUl: giftCardUl,
    giftCardContainer: giftCardContainer,
    giftCardAddButton: giftCardAddButton,
    giftCardSelectContainer: giftCardSelectContainer,
    giftCardsList: giftCardsList
  };
}
function attachGiftCardFormListeners() {
  if (store.giftCardComponentListenersAdded) {
    return;
  }
  store.giftCardComponentListenersAdded = true;
  var _getGiftCardElements = getGiftCardElements(),
    giftCardUl = _getGiftCardElements.giftCardUl,
    giftCardSelect = _getGiftCardElements.giftCardSelect,
    giftCardContainer = _getGiftCardElements.giftCardContainer,
    giftCardAddButton = _getGiftCardElements.giftCardAddButton,
    giftCardSelectContainer = _getGiftCardElements.giftCardSelectContainer;
  if (giftCardUl) {
    giftCardUl.addEventListener('click', function (event) {
      var _store$partialPayment;
      giftCardUl.classList.toggle('invisible');
      var selectedGiftCard = {
        name: event.target.dataset.name,
        brand: event.target.dataset.brand,
        type: event.target.dataset.type
      };
      if (selectedGiftCard.brand !== ((_store$partialPayment = store.partialPaymentsOrderObj) === null || _store$partialPayment === void 0 ? void 0 : _store$partialPayment.giftcard.brand)) {
        var _store$componentsObj;
        if ((_store$componentsObj = store.componentsObj) !== null && _store$componentsObj !== void 0 && _store$componentsObj.giftcard) {
          store.componentsObj.giftcard.node.unmount('component_giftcard');
        }
        if (!store.partialPaymentsOrderObj) {
          store.partialPaymentsOrderObj = {};
        }
        store.partialPaymentsOrderObj.giftcard = selectedGiftCard;
        giftCardSelect.value = selectedGiftCard.brand;
        giftCardContainer.innerHTML = '';
        var giftCardNode = store.checkout.create(constants.GIFTCARD, _objectSpread(_objectSpread({}, store.checkoutConfiguration.giftcard), {}, {
          brand: selectedGiftCard.brand,
          name: selectedGiftCard.name
        })).mount(giftCardContainer);
        store.componentsObj.giftcard = {
          node: giftCardNode
        };
      }
    });
  }
  if (giftCardAddButton) {
    giftCardAddButton.addEventListener('click', function () {
      giftCardAddButton.setAttribute('click-listener', 'true');
      if (store.partialPaymentsOrderObj) {
        return;
      }
      var giftCardWarningMessageEl = document.querySelector('#giftCardWarningMessage');
      if (giftCardWarningMessageEl) {
        giftCardWarningMessageEl.style.display = 'none';
      }
      giftCardAddButton.style.display = 'none';
      giftCardSelectContainer.classList.remove('invisible');
    });
  }
  if (giftCardSelect) {
    giftCardSelect.addEventListener('click', function () {
      giftCardUl.classList.toggle('invisible');
    });
  }
}
function removeGiftCardFormListeners() {
  var _getGiftCardElements2 = getGiftCardElements(),
    giftCardUl = _getGiftCardElements2.giftCardUl,
    giftCardSelect = _getGiftCardElements2.giftCardSelect,
    giftCardAddButton = _getGiftCardElements2.giftCardAddButton;
  giftCardUl.replaceWith(giftCardUl.cloneNode(true));
  giftCardSelect.replaceWith(giftCardSelect.cloneNode(true));
  giftCardAddButton.replaceWith(giftCardAddButton.cloneNode(true));
  store.giftCardComponentListenersAdded = false;
}
function renderGiftCardSelectForm() {
  var _getGiftCardElements3 = getGiftCardElements(),
    giftCardSelect = _getGiftCardElements3.giftCardSelect,
    giftCardUl = _getGiftCardElements3.giftCardUl;
  if (giftCardUl !== null && giftCardUl !== void 0 && giftCardUl.innerHTML) {
    return;
  }
  var paymentMethodsResponse = store.checkout.paymentMethodsResponse;
  var imagePath = store.checkoutConfiguration.session.imagePath;
  var giftCardBrands = paymentMethodsResponse.paymentMethods.filter(function (pm) {
    return pm.type === constants.GIFTCARD;
  });
  giftCardBrands.forEach(function (giftCard) {
    var newListItem = document.createElement('li');
    newListItem.setAttribute('data-brand', giftCard.brand);
    newListItem.setAttribute('data-name', giftCard.name);
    newListItem.setAttribute('data-type', giftCard.type);
    var span = document.createElement('span');
    span.textContent = giftCard.name;
    var img = document.createElement('img');
    img.src = "".concat(imagePath).concat(giftCard.brand, ".png");
    img.width = 40;
    img.height = 26;
    newListItem.appendChild(span);
    newListItem.appendChild(img);
    giftCardUl.appendChild(newListItem);
    var newOption = document.createElement('option');
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
    success: function success(res) {
      var adyenPartialPaymentsOrder = document.querySelector('#adyenPartialPaymentsOrder');
      var _getGiftCardElements4 = getGiftCardElements(),
        giftCardsList = _getGiftCardElements4.giftCardsList,
        giftCardAddButton = _getGiftCardElements4.giftCardAddButton,
        giftCardSelect = _getGiftCardElements4.giftCardSelect,
        giftCardUl = _getGiftCardElements4.giftCardUl;
      adyenPartialPaymentsOrder.value = null;
      giftCardsList.innerHTML = '';
      giftCardAddButton.style.display = 'block';
      giftCardSelect.value = null;
      giftCardUl.innerHTML = '';
      store.partialPaymentsOrderObj = null;
      window.sessionStorage.removeItem(constants.GIFTCARD_DATA_ADDED);
      if (res.resultCode === constants.RECEIVED) {
        var _document$querySelect, _store$componentsObj2, _store$componentsObj3;
        (_document$querySelect = document.querySelector('#cancelGiftCardContainer')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.parentNode.remove();
        (_store$componentsObj2 = store.componentsObj) === null || _store$componentsObj2 === void 0 ? void 0 : (_store$componentsObj3 = _store$componentsObj2.giftcard) === null || _store$componentsObj3 === void 0 ? void 0 : _store$componentsObj3.node.unmount('component_giftcard');
      }
    }
  });
}
function renderAddedGiftCard() {
  var giftCardData = store.partialPaymentsOrderObj.giftcard;
  var imagePath = store.checkoutConfiguration.session.imagePath;
  var _getGiftCardElements5 = getGiftCardElements(),
    giftCardsList = _getGiftCardElements5.giftCardsList,
    giftCardAddButton = _getGiftCardElements5.giftCardAddButton;
  var giftCardDiv = document.createElement('div');
  giftCardDiv.classList.add('gift-card');
  var brandContainer = document.createElement('div');
  brandContainer.classList.add('brand-container');
  var giftCardImg = document.createElement('img');
  var giftCardImgSrc = "".concat(imagePath).concat(giftCardData.brand, ".png");
  giftCardImg.setAttribute('src', giftCardImgSrc);
  giftCardImg.classList.add('gift-card-logo');
  var giftCardNameP = document.createElement('p');
  giftCardNameP.textContent = giftCardData.name;
  brandContainer.appendChild(giftCardImg);
  brandContainer.appendChild(giftCardNameP);
  var giftCardAction = document.createElement('div');
  giftCardAction.classList.add('gift-card-action');
  var removeAnchor = document.createElement('a');
  removeAnchor.textContent = window.removeGiftCardButtonText;
  removeAnchor.addEventListener('click', function () {
    removeGiftCard();
    renderGiftCardSelectForm();
  });
  giftCardAction.appendChild(removeAnchor);
  var brandAndRemoveActionWrapper = document.createElement('div');
  brandAndRemoveActionWrapper.classList.add('wrapper');
  brandAndRemoveActionWrapper.appendChild(brandContainer);
  brandAndRemoveActionWrapper.appendChild(giftCardAction);
  var giftCardAmountDiv = document.createElement('div');
  giftCardAmountDiv.classList.add('wrapper');
  var amountLabel = document.createElement('p');
  amountLabel.textContent = window.discountedAmountGiftCardResource;
  var amountValue = document.createElement('strong');
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
  var mainContainer = document.createElement('div');
  var remainingAmountContainer = document.createElement('div');
  var remainingAmountStart = document.createElement('div');
  var remainingAmountEnd = document.createElement('div');
  var discountedAmountContainer = document.createElement('div');
  var discountedAmountStart = document.createElement('div');
  var discountedAmountEnd = document.createElement('div');
  var cancelGiftCard = document.createElement('a');
  var remainingAmountStartP = document.createElement('p');
  var remainingAmountEndP = document.createElement('p');
  var discountedAmountStartP = document.createElement('p');
  var discountedAmountEndP = document.createElement('p');
  var cancelGiftCardP = document.createElement('p');
  var remainingAmountStartSpan = document.createElement('span');
  var discountedAmountStartSpan = document.createElement('span');
  var cancelGiftCardSpan = document.createElement('span');
  var remainingAmountEndSpan = document.createElement('span');
  var discountedAmountEndSpan = document.createElement('span');
  remainingAmountContainer.classList.add('row', 'grand-total', 'leading-lines');
  remainingAmountStart.classList.add('col-6', 'start-lines');
  remainingAmountEnd.classList.add('col-6', 'end-lines');
  remainingAmountStartP.classList.add('order-receipt-label');
  discountedAmountContainer.classList.add('row', 'grand-total', 'leading-lines');
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
  remainingAmountEndSpan.innerText = store.partialPaymentsOrderObj.remainingAmount;
  discountedAmountEndSpan.innerText = store.partialPaymentsOrderObj.discountedAmount;
  cancelGiftCard.addEventListener('click', function () {
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
  var pricingContainer = document.querySelector('.card-body.order-total-summary');
  mainContainer.appendChild(discountedAmountContainer);
  mainContainer.appendChild(remainingAmountContainer);
  mainContainer.appendChild(cancelGiftCard);
  pricingContainer.appendChild(mainContainer);
}
module.exports = {
  removeGiftCard: removeGiftCard,
  renderAddedGiftCard: renderAddedGiftCard,
  renderGiftCardSelectForm: renderGiftCardSelectForm,
  getGiftCardElements: getGiftCardElements,
  showGiftCardWarningMessage: showGiftCardWarningMessage,
  createElementsToShowRemainingGiftCardAmount: createElementsToShowRemainingGiftCardAmount
};