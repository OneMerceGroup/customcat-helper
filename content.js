chrome.runtime.onMessage.addListener(async (req, res, sender) => {
  const { action } = req;
  switch (action) {
    case "calcu_handler":
      const _html = genTable(calcuHandler());

      if (_html) {
        chrome.runtime.sendMessage({ action: "gen_table", _html })
      }
      break;
    default:
      break;
  }
});

function calcuHandler() {
  const checkboxes = document.querySelectorAll(
    'table.table tbody input[type="checkbox"]',
  );

  const res = [];
  for (let item of checkboxes) {
    if (!item || !item.dataset) continue;

    const { order, total, shipping } = item.dataset || {};
    res.push({ order, cost: Number(total) + Number(shipping) });
  }

  return res;
}

function genTable(data) {
  if (!data || data.length === 0) return "";

  let res = "";
  let total = 0;
  for (let item of data) {
    if (!item || !item.order) continue;

    const cost = Number(item.cost).toFixed(2);
    total += +cost;
    res += `
      <tr>
        <td>
          <input checked type="checkbox" data-id="${item.order}" data-cost="${cost}"/>
        </td>
        <td>
          <p>${item.order}</p>
        </td>
        <td>
          <p class="cost">
            $${cost}
          </p>
        </td>
      </tr>
    `;
  }

  const values = `
    <table>
      <thead>
        <th>
          <input id="select-all" type="checkbox" checked/>
        </th>
        <th>ID</th>
        <th>Total Cost</th>
      </thead>
      
      <tbody>
        ${res}
      </tbody>

      <tfoot>
        <tr>
          <td colspan="2">
            <p>Total</p>
          </td>
          <td>
            <p class="cost" id="total-cost" data-cost="${Number(total).toFixed(2)}">$${Number(total).toFixed(2)}</p>
          </td>
        </tr>
      </tfoot>
    </table>
  `;

  return values;
}
