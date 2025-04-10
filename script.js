const viewOrderBtn = document.getElementById("view-order");
const output = document.getElementById("output");

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "calcu_handler" });
  });
});

chrome.runtime.onMessage.addListener(async (req, res, sender) => {
  const { action, _html } = req || {};
  switch (action) {
    case "gen_table":
      if (_html) {
        output.innerHTML = _html;

        hydrate();
      }
      break;
    default:
      break;
  }
});

function selectItem(el) {
  el = el.target;
  if (!el || !el.dataset) return;

  const checked = el.checked;
  let { cost } = el.dataset;
  cost = +cost

  const totalCostEl = document.getElementById("total-cost");
  let totalCost = Number(totalCostEl?.dataset?.cost || 0);

  if (checked) {
    totalCost += cost;
  } else {
    totalCost -= cost;
  }

  const newTotalCost = Number(totalCost).toFixed(2);
  totalCostEl.setAttribute("data-cost", newTotalCost);
  totalCostEl.innerHTML = `$${newTotalCost}`;
}

function hydrate() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:not(#select-all)',
  );

  for (let el of checkboxes) {
    if (!el || !el instanceof Element) continue;

    el.addEventListener("change", selectItem);
  }

  const selectAllEl = document.getElementById("select-all");

  selectAllEl.addEventListener("click", (e) => {
    const checked = e.target.checked;
    let totalCost = 0;

    if (!!checked) {
      for (let el of checkboxes) {
        if (!el || !el instanceof Element) continue;

        const { cost } = el.dataset;
        totalCost += Number(cost);
        el.checked = true;
      }
    } else {
      for (let el of checkboxes) {
        if (!el || !el instanceof Element) continue;
        el.checked = false;
      }
    }

    totalCost = Number(totalCost).toFixed(2);

    const totalCostEl = document.getElementById("total-cost");
    totalCostEl.setAttribute("data-cost", totalCost);
    totalCostEl.innerHTML = `$${totalCost}`;
  });
}
