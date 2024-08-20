(() => {
    let _data = {
        video_us: true,
    }

    const video_us = document.getElementById(video_us)

    function setData(data) {
        chrome.storage.sync.set({ data })
    }
    // setData 함수는 _data 객체를 Chrome의 storage.sync API에 저장합니다. 이 API를 사용하면 사용자의 설정이 여러 장치 간에 동기화될 수 있습니다.

    function getData() {
        chrome.storage.sync.get("data", (data) => {
            _data = data.data
            video_us.checked = _data.video_us
        })
    }

    video_us.onclick = (e) =>{
        _data.video_us = e.target.checked
        setData(_data)
    }

    getData()


})