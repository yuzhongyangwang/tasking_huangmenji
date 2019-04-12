describe('bestCharge', function () {

  it('should generate best charge when best is 指定菜品半价', function() {
    let inputs = ["ITEM0001 x 1", "ITEM0013 x 2", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
黄焖鸡 x 1 = 18元
肉夹馍 x 2 = 12元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
指定菜品半价(黄焖鸡，凉皮)，省13元
-----------------------------------
总计：25元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when best is 满30减6元', function() {
    let inputs = ["ITEM0013 x 4", "ITEM0022 x 1"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
凉皮 x 1 = 8元
-----------------------------------
使用优惠:
满30减6元，省6元
-----------------------------------
总计：26元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

  it('should generate best charge when no promotion can be used', function() {
    let inputs = ["ITEM0013 x 4"];
    let summary = bestCharge(inputs).trim();
    let expected = `
============= 订餐明细 =============
肉夹馍 x 4 = 24元
-----------------------------------
总计：24元
===================================`.trim()
    expect(summary).toEqual(expected)
  });

});


function bestCharge(inputs) {

  let discount = '============= 订餐明细 =============';
  let order = { ITEM0001: 0, ITEM0013: 0, ITEM0022: 0 };
  inputs.forEach(function (k, i, ary) {
    order[inputs[i].substring(0, 8)] = Number(inputs[i].slice(-1));
  })
  let charge_ob = getCharge(order);
  let project = getProject(charge_ob);
  console.log(project);
  switch (project) {
    case '0': {
      discount = discount.concat('\n肉夹馍' + ' x ' + order['ITEM0013'] + ' = ' + order['ITEM0013'] * 6 + '元');
      discount = discount.concat('\n-----------------------------------')
      discount = discount.concat('\n总计：' + order['ITEM0013'] * 6 + '元');
      discount = discount.concat('\n===================================');
    } break;
    case '1': {
      if (order['ITEM0001'] != 0) { discount = discount.concat('\n黄焖鸡' + ' x ' + order['ITEM0001'] + ' = ' + order['ITEM0001'] * 18 + '元'); }
      if (order['ITEM0013'] != 0) { discount = discount.concat('\n肉夹馍' + ' x ' + order['ITEM0013'] + ' = ' + order['ITEM0013'] * 6 + '元'); }
      if (order['ITEM0022'] != 0) { discount = discount.concat('\n凉皮' + ' x ' + order['ITEM0022'] + ' = ' + order['ITEM0022'] * 8 + '元'); }
      discount = discount.concat('\n-----------------------------------' +
        '\n使用优惠:' +
        '\n满30减6元，省6元' +
        '\n-----------------------------------');
      discount = discount.concat('\n总计：' + charge_ob[0] + '元');
      discount = discount.concat('\n===================================');
    } break;
    case '2': {
      if (order['ITEM0001'] != 0) { discount = discount.concat('\n黄焖鸡' + ' x ' + order['ITEM0001'] + ' = ' + order['ITEM0001'] * 18 + '元'); }
      if (order['ITEM0013'] != 0) { discount = discount.concat('\n肉夹馍' + ' x ' + order['ITEM0013'] + ' = ' + order['ITEM0013'] * 6 + '元'); }
      if (order['ITEM0022'] != 0) { discount = discount.concat('\n凉皮' + ' x ' + order['ITEM0022'] + ' = ' + order['ITEM0022'] * 8 + '元'); }
      discount = discount.concat('\n-----------------------------------' +
        '\n使用优惠:' +
        '\n指定菜品半价(黄焖鸡，凉皮)，省' + (order['ITEM0001'] * 9 + order['ITEM0022'] * 4) + '元' +
        '\n-----------------------------------');
      discount = discount.concat('\n总计：' + charge_ob[1] + '元');
      discount = discount.concat('\n===================================');

    }
  }
  return discount;
}
function getCharge(order) {
  let charge_ob = [];
  charge_ob[0] = order['ITEM0001'] * 18 + order['ITEM0013'] * 6 + order['ITEM0022'] * 8;
  if (charge_ob[0] >= 30) {
    charge_ob[0] -= 6;
  }
  charge_ob[1] = order['ITEM0001'] * 9 + order['ITEM0013'] * 6 + order['ITEM0022'] * 4
  if (order['ITEM0001'] == 0 && order['ITEM0022'] == 0 && charge_ob[0] < 30) {
    return -1;
  }
  return charge_ob
}
function getProject(charge_ob) {
  if (charge_ob == -1) {
    return '0';
  }
  if (charge_ob[0] <= charge_ob[1]) {
    return '1';
  } else {
    return '2';
  }
}
