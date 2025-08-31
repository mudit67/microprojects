chrome.runtime.onInstalled.addListener(function (e) {
  e.reason === "install" &&
    chrome.tabs.create({ url: "https://sortfeed.framer.website/" });
}),
  chrome.action.onClicked.addListener((e) => {
    chrome.tabs.query({ active: !0, currentWindow: !0 }, (n) => {
      let o = n[0].url;
      chrome.action.setPopup({ tabId: n[0].id, popup: "popup.html" });
    });
  }),
  chrome.tabs.onUpdated.addListener((e, n, o) => {
    chrome.tabs.query({ active: !0, currentWindow: !0 }, (s) => {
      chrome.action.setPopup({ tabId: s[0].id, popup: "popup.html" });
    });
  });
function openDB() {
  console.log("Opening DB");
  return new Promise((e, n) => {
    const o = indexedDB.open("SortFeedDB", 1);
    (o.onupgradeneeded = (s) => {
      const t = s.target.result;
      t.objectStoreNames.contains("settings") ||
        t.createObjectStore("settings");
    }),
      (o.onsuccess = () => e(o.result)),
      (o.onerror = () => n(o.error));
  });
}
function setDBItem(e, n) {
  return openDB().then(
    (o) =>
      new Promise((s, t) => {
        const r = o.transaction("settings", "readwrite");
        r.objectStore("settings").put(n, e),
          (r.oncomplete = s),
          (r.onerror = () => t(r.error));
      })
  );
}
function getDBItem(e) {
  return openDB().then(
    (n) =>
      new Promise((o, s) => {
        const r = n
          .transaction("settings", "readonly")
          .objectStore("settings")
          .get(e);
        (r.onsuccess = () => o(r.result)), (r.onerror = () => s(r.error));
      })
  );
}
function deleteDBItem(e) {
  return openDB().then(
    (n) =>
      new Promise((o, s) => {
        const r = n
          .transaction("settings", "readwrite")
          .objectStore("settings")
          .delete(e);
        (r.onsuccess = () => o()), (r.onerror = () => s(r.error));
      })
  );
}
function checkUserStatus(e) {
//   return { isPro: true }, !0;
  return (
    getDBItem("userSortFeed")
      .then((n) => {
        e({ isPro: n === "Pro" });
      })
      .catch(() => {
        e({ isPro: !1 });
      }),
    !0
  );
}
chrome.runtime.onMessage.addListener((e, n, o) => {
  if (e.refresh === "ON") {
    // throw Error("Refresh Call.");
    return (
      checkUserStatus(({ isPro: t }) => {
        // throw Error("Check user Status");
        const r = true,
          c = true,
          i = true,
          a = true;
        ((r && (c || t)) || (i && (a || t))) &&
          chrome.tabs.query({ active: !0, currentWindow: !0 }, function (u) {
            chrome.tabs.sendMessage(u[0].id, {
              action: "refreshPage",
              sort_by: e.sort_by,
              no_items: e.no_items,
              dates_items: e.dates_items,
            });
          });
      }),
      !0
    );
  }
  if (e.sort_feed_error)
    console.log("SEND ERROR"),
      chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
        chrome.tabs.sendMessage(t[0].id, {
          sort_feed_error: !0,
          error_type: e.error_type,
        });
      });
  else if (e.logo_animate_on)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      console.log("logo ON"),
        chrome.tabs.sendMessage(t[0].id, { logo_animate_on: !0 });
    });
  else if (e.item_collected_no)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      console.log("ITEMS COLLECTED"),
        console.log(e.item_collected_no),
        console.log(e.number_items),
        chrome.tabs.sendMessage(t[0].id, {
          item_collected_no: !0,
          number_items: e.number_items,
        });
    });
  else if (e.logo_animate_off)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      console.log("logo OFF"),
        chrome.tabs.sendMessage(t[0].id, { logo_animate_off: !0 });
    });
  else if (e.export_click)
    console.log("export click from background"),
      chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
        chrome.tabs.sendMessage(t[0].id, {
          export_click_background: !0,
          posts_vs_reels: e.posts_vs_reels,
          sorted_data: e.sorted_data,
          export_format: e.export_format,
        });
      });
  else if (e.page_loaded)
    chrome.tabs.query({ active: !0, currentWindow: !0 }, function (t) {
      setDBItem("userSortFeed", "Pro").then(() => {});
      console.log("page_loaded_completed"),
        chrome.tabs.sendMessage(t[0].id, { page_loaded_completed: "ON" });
    });
  else if (e.action === "forwardMessage")
    console.log("Message received in Content Script A"),
      chrome.tabs.query({ active: !0, currentWindow: !0 }, (t) => {
        chrome.tabs.sendMessage(t[0].id, { action: "receiveMessage" });
      });
  else if (e.zero_state === "instagram") {
    setDBItem("userSortFeed", "Pro").then(() => {});
    var s = "https://www.instagram.com/";
    chrome.tabs.create({ url: s });
  }
  if (e.command === "activatePro")
    setDBItem("userSortFeed", "Pro").then(() => {});
  else if (e.command === "checkProStatus")
    return (
      getDBItem("userSortFeed")
        .then((t) => {
          o({ isPro: t === "Pro" });
        })
        .catch(() => {
          o({ isPro: !1 });
        }),
      !0
    );
});
