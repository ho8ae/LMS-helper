chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
        const data = {
            video_us: false,
            table_us: false,
            short_us: true,
        }
        chrome.storage.sync.set({ data });
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 필요한 처리 로직만 남기고 콘솔 로그는 제거
    sendResponse({status: "Message received in background"});
    return true;
});