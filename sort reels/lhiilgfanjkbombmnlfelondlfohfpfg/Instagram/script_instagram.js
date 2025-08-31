let isSortingSessionActive = !1;
const inMemoryFeedData = { items: [] };
function save_data_locally_again(e) {
  return inMemoryFeedData.items.push(e), inMemoryFeedData.items;
}
function reset_in_memory_feed_data() {
  inMemoryFeedData.items = [];
}
function createMetadataJson(e) {
  let t = {},
    o = e?.taken_at,
    s = o ? o * 1e3 : null;
  return (
    (t.createDate = s ? new Date(s).toISOString() : ""),
    (t.code = e?.code || ""),
    (t.commentsCount = e?.comment_count ?? null),
    (t.likesCount = e?.like_count ?? null),
    (t.mediaType = e?.media_type ?? null),
    (t.viewCount = e?.view_count ?? null),
    (t.userName = e?.user?.username || ""),
    (t.caption = e?.caption?.text || ""),
    t
  );
}
function getUserNameReels(e = 1) {
  let t = sessionStorage.getItem("sortFeedProfileName");
  if (t) return t;
  {
    let o = document.querySelector("header h2 span");
    if (o) {
      const s = o.innerText.trim();
      return sessionStorage.setItem("sortFeedProfileName", s), s;
    } else if (e > 0) setTimeout(() => getUserNameReels(e - 1), 500);
    else return null;
  }
}
function createMetadataJsonReels(e) {
  let t = {},
    o = e?.play_count ?? e?.view_count ?? null;
  (t.viewCount = o),
    (t.code = e?.code || ""),
    (t.commentsCount = e?.comment_count ?? null),
    (t.likesCount = e?.like_count ?? null),
    (t.mediaType = e?.media_type ?? null);
  let s = getUserNameReels?.() || "";
  return (t.userName = s), t;
}
function scroll_to_view(e) {
  e.scrollIntoView({ behavior: "auto", block: "center" });
}
function save_data_locally(e) {
  if (sessionStorage.getItem("sortFeedData") !== null) {
    let t = JSON.parse(sessionStorage.getItem("sortFeedData"));
    return (
      t.push(e), sessionStorage.setItem("sortFeedData", JSON.stringify(t)), t
    );
  } else {
    let t = [];
    return (
      t.push(e), sessionStorage.setItem("sortFeedData", JSON.stringify(t)), t
    );
  }
}
function return_number_selected() {
  let e = sessionStorage.getItem("sortFeedNoItems");
  return e === "all_reels" ? 0 : parseInt(e.replace("_reels", ""), 10) || 0;
}
function return_herf(e) {
  return [1, 8].includes(e.mediaType)
    ? `/${e.userName}/p/${e.code}/`
    : `/${e.userName}/reel/${e.code}/`;
}
function find_element(e, t = 30, o = 100) {
  return new Promise((s) => {
    const i = (n) => {
      const r = document.querySelector(`a[href*="${e}"]`);
      if (r) {
        const l = r.closest("div");
        s(l);
      } else n > 0 ? setTimeout(() => i(n - 1), o) : s(null);
    };
    i(t);
  });
}
function sort_items(e, t) {
  return t === "views"
    ? [...e].sort((o, s) => s.viewCount - o.viewCount)
    : t === "likes"
    ? [...e].sort((o, s) => s.likesCount - o.likesCount)
    : t === "comments"
    ? [...e].sort((o, s) => s.commentsCount - o.commentsCount)
    : t === "oldest"
    ? [...e].reverse()
    : 0;
}
function update_data_object_with_element(e, t) {
  return (e.element = t.outerHTML), e;
}
function send_items_collected_no(e) {
  if (e !== null)
    try {
      let t = e.length;
      window.postMessage({ item_collected_no: !0, number_items: t }, "*");
    } catch (t) {
      console.error("Error sending message", t);
    }
}
function insta_banner_notification(e, t) {
  if (e !== null)
    try {
      let o = e.length;
      window.postMessage(
        { insta_banner_notification: !0, count: o, type: t },
        "*"
      );
    } catch (o) {
      console.error("Error sending message", o);
    }
}
function removeSortFeedBannerMessage() {
  window.postMessage({ insta_banner_notification_remove: !0 }, "*");
}
async function sort_item_posts(e, t, o, s) {
  return new Promise(async (i) => {
    for (let n = 0; n < e; n++) {
      let r =
          t.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges[n]
            .node,
        l = createMetadataJson(r),
        g = return_herf(l),
        _ = await find_element(g),
        u = update_data_object_with_element(l, _),
        a = save_data_locally_again(u);
      if (
        (send_items_collected_no(a),
        insta_banner_notification(a, "Posts"),
        sessionStorage.getItem("sortFeedStopSorting") === "on")
      ) {
        console.log("CASE 04!"),
          sessionStorage.removeItem("sortFeedStopSorting"),
          removeSortFeedBannerMessage(),
          i(a);
        return;
      } else if (a.length === o) {
        console.log("CASE 01"), i(a);
        return;
      } else if (n === e - 1 && s) {
        console.log("CASE 02"), scroll_to_view(_);
        break;
      } else if (n === e - 1 && !s) {
        console.log("CASE 03!"), i(a);
        return;
      }
    }
  });
}
async function sort_not_all_reels(e, t, o, s) {
  return new Promise(async (i) => {
    for (let n = 0; n < e; n++) {
      let r =
        t.data.xdt_api__v1__clips__user__connection_v2.edges[n].node.media;
      if (r.media_type === 2) {
        let l = createMetadataJsonReels(r),
          g = return_herf(l),
          _ = l.code,
          u = await find_element(_),
          a = update_data_object_with_element(l, u),
          c = save_data_locally_again(a);
        if (
          (send_items_collected_no(c),
          insta_banner_notification(c, "Reels"),
          sessionStorage.getItem("sortFeedStopSorting") === "on")
        ) {
          console.log("CASE 04!"),
            sessionStorage.removeItem("sortFeedStopSorting"),
            removeSortFeedBannerMessage(),
            i(c);
          return;
        } else if (c.length === o) {
          console.log("CASE 01"), i(c);
          return;
        } else if (n === e - 1 && s) {
          console.log("CASE 02"), scroll_to_view(u);
          break;
        } else if (n === e - 1 && !s) {
          console.log("CASE 03!"), i(c);
          return;
        }
      }
    }
  });
}
function remove_overlay() {
  document.getElementById("overlay_sort_reels").remove();
}
function return_date_range(e) {
  let t = new Date(),
    o = new Date();
  if (e === "1_week") return t.setDate(o.getDate() - 7), [t, o];
  if (e === "1_month") return t.setDate(o.getDate() - 30), [t, o];
  if (e === "3_month") return t.setDate(o.getDate() - 90), [t, o];
  if (e === "6_month") return t.setDate(o.getDate() - 180), [t, o];
  if (e === "1_year") return t.setDate(o.getDate() - 360), [t, o];
  if (e === "all_reels") return t.setDate(o.getDate() - 3600), [t, o];
}
function is_create_date_in_range(e, t, o) {
  const s = new Date(e);
  if (isNaN(s) || isNaN(t) || isNaN(o)) throw new Error("Invalid date format");
  return s >= t && s < o;
}
async function sort_date_posts(e, t, o, s, i) {
  return new Promise(async (n) => {
    for (let r = 0; r < e; r++) {
      let l =
          t.data.xdt_api__v1__feed__user_timeline_graphql_connection.edges[r]
            .node,
        g = createMetadataJson(l),
        _ = return_herf(g),
        u = await find_element(_),
        a = update_data_object_with_element(g, u),
        c = new Date(a.createDate).toLocaleString();
      if (sessionStorage.getItem("sortFeedStopSorting") === "on") {
        console.log("Case 0"), sessionStorage.removeItem("sortFeedStopSorting");
        let d = save_data_locally_again(a);
        removeSortFeedBannerMessage(), n(d);
        return;
      } else if (is_create_date_in_range(c, s, i) && r !== e - 1) {
        console.log("case 01");
        let d = save_data_locally_again(a);
        send_items_collected_no(d), insta_banner_notification(d, "Posts");
      } else if (is_create_date_in_range(c, s, i) && r === e - 1 && o) {
        console.log("case 02");
        let d = save_data_locally_again(a);
        send_items_collected_no(d),
          insta_banner_notification(d, "Posts"),
          scroll_to_view(u);
      } else if (is_create_date_in_range(c, s, i) && r === e - 1 && !o) {
        console.log("case 03");
        let d = save_data_locally_again(a);
        send_items_collected_no(d), insta_banner_notification(d, "Posts"), n(d);
      } else if (!is_create_date_in_range(c, s, i))
        if (
          l.timeline_pinned_user_ids &&
          l.timeline_pinned_user_ids.length > 0
        ) {
          console.log("PINNED");
          continue;
        } else {
          console.log("NOT PINNED");
          let d = inMemoryFeedData.items;
          n(d);
          break;
        }
    }
  });
}
(function () {
  const e = XMLHttpRequest.prototype.open,
    t = XMLHttpRequest.prototype.send;
  (XMLHttpRequest.prototype.open = function (o, s, i, n, r) {
    return (this._url = s), e.apply(this, arguments);
  }),
    (XMLHttpRequest.prototype.send = function (o) {
      return (
        this.addEventListener("load", function () {
          if (
            this._url.includes("/graphql/query") &&
            (this.responseType === "" || this.responseType === "text") &&
            sessionStorage.getItem("sortFeedStatus") &&
            sessionStorage.getItem("sortFeedPostsVSReels") === "Posts" &&
            sessionStorage.getItem("sortItemsVsDates") === "dates"
          )
            try {
              let s = JSON.parse(this.responseText);
              if (s.data.xdt_api__v1__feed__user_timeline_graphql_connection) {
                let i =
                    s.data.xdt_api__v1__feed__user_timeline_graphql_connection
                      .edges.length,
                  n =
                    s.data.xdt_api__v1__feed__user_timeline_graphql_connection
                      .page_info.has_next_page,
                  r = sessionStorage.getItem("sortFeedNoItems"),
                  [l, g] = return_date_range(r);
                sort_date_posts(i, s, n, l, g).then((_) => {
                  if (_ === null)
                    removeSortFeedBannerMessage(),
                      remove_overlay(),
                      window.postMessage(
                        { logo_animate_off_zero_insta_time_period: !0 },
                        "*"
                      );
                  else {
                    let u = sessionStorage.getItem("sortFeedSortBy"),
                      a = sort_items(_, u);
                    removeSortFeedBannerMessage(),
                      remove_overlay(),
                      window.postMessage(
                        { logo_animate_off: !0, payload: a },
                        "*"
                      );
                  }
                });
              }
            } catch {}
          else if (
            this._url.includes("/graphql/query") &&
            (this.responseType === "" || this.responseType === "text") &&
            sessionStorage.getItem("sortFeedStatus") &&
            sessionStorage.getItem("sortFeedPostsVSReels") === "Posts" &&
            sessionStorage.getItem("sortItemsVsDates") === "items"
          ) {
            isSortingSessionActive ||
              (reset_in_memory_feed_data(), (isSortingSessionActive = !0));
            try {
              let s = JSON.parse(this.responseText);
              if (s.data.xdt_api__v1__feed__user_timeline_graphql_connection) {
                let i =
                    s.data.xdt_api__v1__feed__user_timeline_graphql_connection
                      .edges.length,
                  n =
                    s.data.xdt_api__v1__feed__user_timeline_graphql_connection
                      .page_info.has_next_page,
                  r = return_number_selected(),
                  l = r == 0 ? 1e4 : r;
                sort_item_posts(i, s, l, n).then((g) => {
                  let _ = sessionStorage.getItem("sortFeedSortBy"),
                    u = sort_items(g, _);
                  removeSortFeedBannerMessage(),
                    remove_overlay(),
                    window.postMessage(
                      { logo_animate_off: !0, payload: u },
                      "*"
                    );
                });
              }
            } catch {}
          } else if (
            this._url.includes("/graphql/query") &&
            (this.responseType === "" || this.responseType === "text") &&
            sessionStorage.getItem("sortFeedStatus") &&
            sessionStorage.getItem("sortFeedPostsVSReels") === "Reels"
          )
            try {
              let s = JSON.parse(this.responseText);
              if (s.data.xdt_api__v1__clips__user__connection_v2) {
                let i =
                    s.data.xdt_api__v1__clips__user__connection_v2.edges.length,
                  n =
                    s.data.xdt_api__v1__clips__user__connection_v2.page_info
                      .has_next_page,
                  r = return_number_selected(),
                  l = r == 0 ? 1e4 : r;
                sort_not_all_reels(i, s, l, n).then((g) => {
                  let _ = sessionStorage.getItem("sortFeedSortBy"),
                    u = sort_items(g, _);
                  removeSortFeedBannerMessage(),
                    remove_overlay(),
                    window.postMessage(
                      { logo_animate_off: !0, payload: u },
                      "*"
                    );
                });
              }
            } catch {}
        }),
        t.apply(this, arguments)
      );
    });
})();
