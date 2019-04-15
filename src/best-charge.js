/*global require,module*/

function bestCharge(selectedItems) {
  const allItems = loadAllItems();
  const cartItems = buildCartItems(selectedItems, allItems);

  const receiptItems = buildReceiptItems(cartItems);

  const promotion = loadPromotions();
  const receipt = buildReceipt(receiptItems, promotion);

  const receiptText = buildReceiptText(receipt);

  return receiptText;
}
//计算被点的菜价格，单个品种菜的总价subtotal
function buildCartItems(selectedItems, allItems) {
  const cartItems = [];

  for (let item of selectedItems) {
    const splittedItems = item.split(' x ');

    for (let allItem of allItems) {
      if (allItem.id === splittedItems[0]) {
        cartItems.push({
          id: allItem.id,
          name: allItem.name,
          count: parseInt(splittedItems[1]),
          subtotal: allItem.price * parseInt(splittedItems[1])
        });
      }
    }
  }

  return cartItems;
}

//构建收据项，计算优惠前的总价total
function buildReceiptItems(cartItems) {
  let total = 0;
  for (let cartItem of cartItems) {
    total += cartItem.subtotal;
  }

  return {cartItem: cartItems, total: total};
}

//选择优惠最大的方式
function buildReceipt(receiptItem, promotions) {
  const receiptA = fullCut(receiptItem);
  const receiptB = discount(receiptItem, promotions);
  if (receiptA.total > receiptB.total) {
    return receiptB;
  } else {
    return receiptA;
  }
}
//满30减6
function fullCut(receiptItem) {
  if (receiptItem.total >= 30) {
    return {cartItem: receiptItem.cartItem, total: receiptItem.total - 6, totalSaved: 6, promotionType: '满30减6元'};
  } else {
    return {cartItem: receiptItem.cartItem, total: receiptItem.total, totalSaved: 0, promotionType: undefined};
  }
}
//打半折
function discount(receiptItem, promotions) {
  const total = receiptItem.total;
  const items = [];

  for (let cartItem of receiptItem.cartItem) {
    for (let item of promotions[1].items) {
      if (item === cartItem.id) {
        receiptItem.total -= cartItem.subtotal / 2;
        items.push(cartItem.name);
      }
    }
  }

  return {
    cartItem: receiptItem.cartItem,
    total: receiptItem.total,
    totalSaved: total - receiptItem.total,
    promotionType: {type: '指定菜品半价', item: items}
  };
}
//构建输出格式
function buildReceiptText(receipt) {
  let receiptText = `============= 订餐明细 =============\n`;

  for (let cartItem of receipt.cartItem) {
    receiptText += `${cartItem.name} x ${cartItem.count} = ${cartItem.subtotal}元\n`;
  }

  receiptText += `-----------------------------------\n`;

  if (receipt.totalSaved != 0) {
    receiptText += `使用优惠:\n`;
    if (receipt.promotionType.type === '指定菜品半价') {
      receiptText += `指定菜品半价(`;
      receiptText += `${receipt.promotionType.item.join('，')}`;
      receiptText += `)，省${receipt.totalSaved}元\n-----------------------------------\n`;
    } else {
      receiptText += `满30减6元，`;
      receiptText += `省${receipt.totalSaved}元\n-----------------------------------\n`;
    }

  }
  receiptText += `总计：${receipt.total}元\n===================================\n`;

  return receiptText;
}
