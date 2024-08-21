chrome.runtime.onInstalled.addListener((details) => {
    switch (details.reason) {
        case "install":
            const data = {

                video_us: false,
            }
            chrome.storage.sync.set({ data })
            break
        case "update":
            break
    }

})

