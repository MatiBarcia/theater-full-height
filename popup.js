const DEFAULTS = { enabled: true, hideMasthead: false };
const inputs = {
  enabled: document.getElementById("enabled"),
  hideMasthead: document.getElementById("hideMasthead"),
};
const hideMastheadRow = document.getElementById("hideMastheadRow");

function syncDisabledState() {
  hideMastheadRow.classList.toggle("disabled", !inputs.enabled.checked);
}

chrome.storage.sync.get(DEFAULTS, (data) => {
  for (const key of Object.keys(inputs)) inputs[key].checked = data[key];
  syncDisabledState();
});

for (const [key, input] of Object.entries(inputs)) {
  input.addEventListener("change", () => {
    chrome.storage.sync.set({ [key]: input.checked });
    syncDisabledState();
  });
}
