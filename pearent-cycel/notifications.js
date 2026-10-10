/* =========================================
   RAFIQ SHARED NOTIFICATIONS
========================================= */


/* =========================================
   STORAGE HELPERS
========================================= */

function getRafiqNotifications() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "rafiqNotifications"
      )
    ) || [];

  } catch (error) {

    return [];
  }
}


function saveRafiqNotifications(
  notifications
) {

  localStorage.setItem(
    "rafiqNotifications",
    JSON.stringify(
      notifications
    )
  );


  /*
    Tell the current page that
    notification data changed.
  */

  window.dispatchEvent(
    new Event(
      "rafiqNotificationsChanged"
    )
  );
}


/* =========================================
   CREATE NOTIFICATION

   Other pages can call:

   createRafiqNotification({
      type: "booking",
      title: "...",
      message: "...",
      link: "bookings.html"
   });
========================================= */

function createRafiqNotification({
  type = "default",
  title = "RAFIQ",
  message = "",
  link = null,
  childId = null
}) {

  const notifications =
    getRafiqNotifications();


  const notification = {

    id:
      "notification_" +
      Date.now() +
      "_" +
      Math.random()
        .toString(16)
        .slice(2),

    type,

    title,

    message,

    link,

    childId,

    read:
      false,

    createdAt:
      new Date().toISOString()
  };


  notifications.unshift(
    notification
  );


  /*
    Keep latest 50 notifications.
  */

  const limited =
    notifications.slice(
      0,
      50
    );


  saveRafiqNotifications(
    limited
  );


  return notification;
}


/* Make helper available to other JS files */

window.createRafiqNotification =
  createRafiqNotification;


/* =========================================
   TIME LABEL
========================================= */

function getNotificationTimeLabel(
  dateString
) {

  const date =
    new Date(
      dateString
    );


  const now =
    new Date();


  const difference =
    now.getTime() -
    date.getTime();


  const seconds =
    Math.floor(
      difference / 1000
    );


  if (
    seconds < 60
  ) {

    return "Just now";
  }


  const minutes =
    Math.floor(
      seconds / 60
    );


  if (
    minutes < 60
  ) {

    return (
      minutes +
      (
        minutes === 1
          ? " minute ago"
          : " minutes ago"
      )
    );
  }


  const hours =
    Math.floor(
      minutes / 60
    );


  if (
    hours < 24
  ) {

    return (
      hours +
      (
        hours === 1
          ? " hour ago"
          : " hours ago"
      )
    );
  }


  const days =
    Math.floor(
      hours / 24
    );


  if (
    days < 7
  ) {

    return (
      days +
      (
        days === 1
          ? " day ago"
          : " days ago"
      )
    );
  }


  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric"
    }
  );
}


/* =========================================
   ICON
========================================= */

function getNotificationIcon(
  type
) {

  const icons = {

    booking:
      "◷",

    subscription:
      "✦",

    report:
      "✓",

    cancelled:
      "✕",

    reminder:
      "!",

    default:
      "♡"
  };


  return (
    icons[type] ||
    icons.default
  );
}


/* =========================================
   ESCAPE
========================================= */

function escapeNotificationHTML(
  value
) {

  const element =
    document.createElement(
      "div"
    );


  element.textContent =
    String(
      value ?? ""
    );


  return element.innerHTML;
}


/* =========================================
   INITIALIZE UI
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Every parent page already has
      .topbar.

      We inject notification UI automatically.
    */

    const topbar =
      document.querySelector(
        ".topbar"
      );


    if (!topbar) {

      return;
    }


    /*
      Prevent duplicate bell if the
      script gets loaded more than once.
    */

    if (
      document.getElementById(
        "notificationCenter"
      )
    ) {

      return;
    }


    // =====================================
    // CREATE HTML
    // =====================================

    const center =
      document.createElement(
        "div"
      );


    center.className =
      "notification-center";


    center.id =
      "notificationCenter";


    center.innerHTML = `
      <button
        type="button"
        class="notification-bell"
        id="notificationBell"
        aria-label="Notifications"
        aria-expanded="false"
      >
        🔔

        <span
          class="notification-badge"
          id="notificationBadge"
          hidden
        >
          0
        </span>
      </button>


      <div
        class="notification-dropdown"
        id="notificationDropdown"
        hidden
      >

        <div class="notification-header">

          <div class="notification-header-text">

            <span>
              RAFIQ
            </span>

            <h3>
              Notifications
            </h3>

          </div>


          <button
            type="button"
            class="mark-all-button"
            id="markAllReadButton"
          >
            Mark all as read
          </button>

        </div>


        <div
          class="notification-list"
          id="notificationList"
        ></div>


        <div class="notification-footer">
          Your latest RAFIQ updates
        </div>

      </div>
    `;


    /*
      Some topbars already contain a
      right-side button/link.

      Bell gets appended after it.
    */

    topbar.appendChild(
      center
    );


    // =====================================
    // ELEMENTS
    // =====================================

    const bell =
      document.getElementById(
        "notificationBell"
      );


    const badge =
      document.getElementById(
        "notificationBadge"
      );


    const dropdown =
      document.getElementById(
        "notificationDropdown"
      );


    const list =
      document.getElementById(
        "notificationList"
      );


    const markAllButton =
      document.getElementById(
        "markAllReadButton"
      );


    // =====================================
    // CURRENT CHILD
    // =====================================

    function getCurrentChildId() {

      return localStorage.getItem(
        "rafiqCurrentChildId"
      );
    }


    /*
      Global notifications such as
      subscription have no childId.

      Child-specific notifications show
      only for the current child.
    */

    function getVisibleNotifications() {

      const currentChildId =
        getCurrentChildId();


      return getRafiqNotifications()
        .filter(
          notification => {

            return (
              !notification.childId ||
              notification.childId ===
                currentChildId
            );
          }
        );
    }


    // =====================================
    // RENDER
    // =====================================

    function renderNotifications() {

      const notifications =
        getVisibleNotifications();


      const unreadCount =
        notifications.filter(
          notification =>
            !notification.read
        ).length;


      if (
        unreadCount > 0
      ) {

        badge.hidden =
          false;


        badge.textContent =
          unreadCount > 99
            ? "99+"
            : unreadCount;

      } else {

        badge.hidden =
          true;
      }


      markAllButton.style.display =
        unreadCount > 0
          ? ""
          : "none";


      list.innerHTML =
        "";


      if (
        notifications.length === 0
      ) {

        list.innerHTML = `
          <div class="notification-empty">

            <div class="notification-empty-icon">
              🔔
            </div>

            <strong>
              You're all caught up.
            </strong>

            <p>
              New RAFIQ updates will appear here.
            </p>

          </div>
        `;


        return;
      }


      notifications.forEach(
        notification => {

          const item =
            document.createElement(
              "button"
            );


          item.type =
            "button";


          item.className =
            "notification-item";


          if (
            !notification.read
          ) {

            item.classList.add(
              "unread"
            );
          }


          const safeType =
            [
              "booking",
              "subscription",
              "report",
              "cancelled",
              "reminder"
            ].includes(
              notification.type
            )
              ? notification.type
              : "default";


          item.innerHTML = `
            <div
              class="notification-icon ${safeType}"
            >
              ${getNotificationIcon(
                safeType
              )}
            </div>


            <div class="notification-content">

              <strong>
                ${escapeNotificationHTML(
                  notification.title
                )}
              </strong>

              <p>
                ${escapeNotificationHTML(
                  notification.message
                )}
              </p>

              <span class="notification-time">
                ${getNotificationTimeLabel(
                  notification.createdAt
                )}
              </span>

            </div>


            <span class="notification-dot"></span>
          `;


          item.addEventListener(
            "click",
            () => {

              markAsRead(
                notification.id
              );


              if (
                notification.link
              ) {

                window.location.href =
                  notification.link;
              }

            }
          );


          list.appendChild(
            item
          );

        }
      );
    }


    // =====================================
    // MARK ONE
    // =====================================

    function markAsRead(
      notificationId
    ) {

      const notifications =
        getRafiqNotifications();


      const notification =
        notifications.find(
          item =>
            item.id ===
            notificationId
        );


      if (
        notification &&
        !notification.read
      ) {

        notification.read =
          true;


        saveRafiqNotifications(
          notifications
        );
      }
    }


    // =====================================
    // MARK ALL
    // =====================================

    function markAllAsRead() {

      const currentChildId =
        getCurrentChildId();


      const notifications =
        getRafiqNotifications();


      notifications.forEach(
        notification => {

          /*
            Mark:
            - global notifications
            - current child's notifications
          */

          if (
            !notification.childId ||
            notification.childId ===
              currentChildId
          ) {

            notification.read =
              true;
          }

        }
      );


      saveRafiqNotifications(
        notifications
      );
    }


    // =====================================
    // OPEN / CLOSE
    // =====================================

    function openDropdown() {

      dropdown.hidden =
        false;


      bell.setAttribute(
        "aria-expanded",
        "true"
      );


      renderNotifications();
    }


    function closeDropdown() {

      dropdown.hidden =
        true;


      bell.setAttribute(
        "aria-expanded",
        "false"
      );
    }


    function toggleDropdown() {

      if (
        dropdown.hidden
      ) {

        openDropdown();

      } else {

        closeDropdown();
      }
    }


    // =====================================
    // EVENTS
    // =====================================

    bell.addEventListener(
      "click",
      event => {

        event.stopPropagation();

        toggleDropdown();
      }
    );


    dropdown.addEventListener(
      "click",
      event => {

        event.stopPropagation();
      }
    );


    markAllButton.addEventListener(
      "click",
      markAllAsRead
    );


    document.addEventListener(
      "click",
      () => {

        closeDropdown();
      }
    );


    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {

          closeDropdown();
        }
      }
    );


    /*
      Refresh bell immediately after
      another page/component creates
      notification.
    */

    window.addEventListener(
      "rafiqNotificationsChanged",
      renderNotifications
    );


    /*
      Update if localStorage changes
      from another browser tab.
    */

    window.addEventListener(
      "storage",
      event => {

        if (
          event.key ===
          "rafiqNotifications"
        ) {

          renderNotifications();
        }
      }
    );


    // INIT

    renderNotifications();

  }
);