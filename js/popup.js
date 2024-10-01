(() => {
  const _labels = ['video_us', 'short_us', 'report_us'];
  let _data = {
    video_us: false,
    short_us: true,
    report_us: true,
  };
  const _disabled = {
    video_us: false,
    short_us: false,
    report_us: false,
  };
  const _us = {};

  function setData(data) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ data }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    });
  }

  function getData() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get("data", (result) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result.data);
        }
      });
    });
  }

  function updateUI() {
    Object.keys(_us).forEach(label => {
      if (!_disabled[label]) {
        _us[label].checked = _data[label];
      }
    });
  }

  async function init() {
    try {
      const storedData = await getData();
      if (storedData) {
        _data = storedData;
      }
      updateUI();
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  }

  _labels.forEach(label => {
    _us[label] = document.getElementById(label);
    _us[label].disabled = _disabled[label];
    _us[label].addEventListener('change', async ({ target }) => {
      if (_disabled[label]) return;
      _data[label] = target.checked;
      try {
        await setData(_data);
      } catch (error) {
        console.error('Error saving data:', error);
        // Revert the UI change if save failed
        target.checked = !target.checked;
      }
    });
  });

  init();
})();