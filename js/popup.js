(() => {
    const _labels = ['video_us'];  // 사용할 요소의 ID 목록

    let _data = {
        video_us: false,
    };

    const _disabled = {
        video_us: false,
    };

    const _us = {};  // DOM 요소들을 저장할 객체

    function setData(data) {
        chrome.storage.sync.set({ data });
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

        getData();  // 데이터를 가져와서 체크박스를 초기화
    });

})();
