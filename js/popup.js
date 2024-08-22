(() => {
    const _labels = ['video_us', 'table_us', 'short_us'];
  
    let _data = {
      video_us: false,
      table_us: false,
      short_us: true,
    };
  
    const _disabled = {
      video_us: false,
      table_us: false,
      short_us: false,
    };
  
    const _us = {};
  
    function setData(data) {
      chrome.storage.sync.set({ data }, () => {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "updateContent" });
        });
      });
    }
  
    function getData() {
      chrome.storage.sync.get("data", (result) => {
        if (result.data) {
          _data = result.data;
        }
        Object.keys(_us).forEach(label => {
          if (_us[label] && !_disabled[label]) {
            _us[label].checked = _data[label];
          }
        });
      });
    }
  
    document.addEventListener('DOMContentLoaded', () => {
      _labels.forEach(label => {
        const element = document.getElementById(label);
        if (element) {
          _us[label] = element;
          _us[label].disabled = _disabled[label];
          _us[label].onclick = ({ target }) => {
            if (_disabled[label]) return;
            _data[label] = target.checked;
            setData(_data);
          };
        }
      });
  
      getData();
    });
  })();