/**
 * Al-Fadhel Telecom Platform - Auth & Dashboard Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------
  // 1. Password Visibility Toggles
  // -------------------------------------------------------
  function setupPasswordToggle(buttonId, inputId, iconId) {
    const btn = document.getElementById(buttonId);
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (btn && input && icon) {
      btn.addEventListener("click", () => {
        const isPassword = input.getAttribute("type") === "password";
        input.setAttribute("type", isPassword ? "text" : "password");
        icon.classList.toggle("fa-eye", !isPassword);
        icon.classList.toggle("fa-eye-slash", isPassword);
      });
    }
  }

  // Setup toggle for Signup Page & Login Page
  setupPasswordToggle("togglePasswordBtn", "password", "togglePasswordIcon");
  setupPasswordToggle("toggleLoginPasswordBtn", "loginPassword", "toggleLoginPasswordIcon");

  // -------------------------------------------------------
  // 2. Signup Page: Terms Checkbox Validation
  // -------------------------------------------------------
  const termCheckboxes = document.querySelectorAll(".term-checkbox");
  const submitBtn = document.getElementById("submitBtn");

  function checkTermsValidity() {
    if (!submitBtn) return;
    const allChecked = Array.from(termCheckboxes).every((cb) => cb.checked);
    submitBtn.disabled = !allChecked;
  }

  if (termCheckboxes.length > 0) {
    termCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", checkTermsValidity);
    });
  }

  // -------------------------------------------------------
  // 3. Signup Form Submission (Direct Smooth Transition to OTP)
  // -------------------------------------------------------
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = window.location.pathname.includes("/pages/") ? "verfied.html" : "pages/verfied.html";
    });
  }

  // -------------------------------------------------------
  // 4. Login Form Submission (Direct Smooth Transition to Home)
  // -------------------------------------------------------
  const loginForm = document.getElementById("loginForm");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");

  function handleLoginSubmit(e) {
    if (e) e.preventDefault();
    const isPagesFolder = window.location.pathname.includes("/pages/");
    window.location.href = isPagesFolder ? "home.html" : "pages/home.html";
  }

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }
  if (loginSubmitBtn) {
    loginSubmitBtn.addEventListener("click", function (e) {
      if (loginForm && !loginForm.checkValidity()) return; // allow standard HTML validation check first
      handleLoginSubmit(e);
    });
  }

  // -------------------------------------------------------
  // 5. Forget Password Method Toggle & Submission
  // -------------------------------------------------------
  const forgetPasswordForm = document.getElementById("forgetPasswordForm");
  if (forgetPasswordForm) {
    const resetRadios = document.querySelectorAll('input[name="resetMethod"]');
    const recoveryLabel = document.getElementById("recoveryLabel");
    const recoveryInput = document.getElementById("recoveryInput");

    resetRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.value === "email") {
          if (recoveryLabel) recoveryLabel.textContent = "البريد الإلكتروني المسجل";
          if (recoveryInput) {
            recoveryInput.type = "email";
            recoveryInput.placeholder = "name@example.com";
          }
        } else {
          if (recoveryLabel) recoveryLabel.textContent = "رقم الجوال المسجل";
          if (recoveryInput) {
            recoveryInput.type = "tel";
            recoveryInput.placeholder = "05XXXXXXXX";
          }
        }
      });
    });

    forgetPasswordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      window.location.href = window.location.pathname.includes("/pages/") ? "verfied.html" : "pages/verfied.html";
    });
  }

  // -------------------------------------------------------
  // 6. OTP Verification Page (verfied.html) Logics
  // -------------------------------------------------------
  const otpVerifyForm = document.getElementById("otpVerifyForm");
  if (otpVerifyForm) {
    const otpInputs = Array.from(document.querySelectorAll(".otp-digit-input"));
    const resendBtn = document.getElementById("resendOtpBtn");
    const timerDisplay = document.getElementById("otpTimer");

    // Auto-focus logic for 6-digit PIN
    otpInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        const val = e.target.value;
        if (val.length === 1 && index < otpInputs.length - 1) {
          otpInputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !input.value && index > 0) {
          otpInputs[index - 1].focus();
        }
      });

      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData("text").trim();
        if (/^\d{6}$/.test(pasteData)) {
          pasteData.split("").forEach((char, i) => {
            if (otpInputs[i]) otpInputs[i].value = char;
          });
          otpInputs[otpInputs.length - 1].focus();
        }
      });
    });

    // Countdown Timer logic for Resend OTP
    let secondsLeft = 59;
    let timerInterval = setInterval(() => {
      secondsLeft--;
      if (timerDisplay) {
        timerDisplay.textContent = `00:${secondsLeft < 10 ? "0" + secondsLeft : secondsLeft}`;
      }

      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        if (resendBtn) {
          resendBtn.disabled = false;
          resendBtn.innerHTML = "إعادة إرسال رمز التحقق الآن";
        }
      }
    }, 1000);

    if (resendBtn) {
      resendBtn.addEventListener("click", () => {
        secondsLeft = 59;
        resendBtn.disabled = true;
        timerInterval = setInterval(() => {
          secondsLeft--;
          if (timerDisplay) {
            timerDisplay.textContent = `00:${secondsLeft < 10 ? "0" + secondsLeft : secondsLeft}`;
          }
          if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            resendBtn.disabled = false;
            resendBtn.innerHTML = "إعادة إرسال رمز التحقق الآن";
          }
        }, 1000);
      });
    }

    // OTP Submit handler -> Navigate to Home Dashboard
    otpVerifyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const code = otpInputs.map((i) => i.value).join("");
      if (code.length === 6) {
        window.location.href = window.location.pathname.includes("/pages/") ? "home.html" : "pages/home.html";
      }
    });
  }

  // -------------------------------------------------------
  // 7. Dynamic Arabic Date on Dashboard (home.html)
  // -------------------------------------------------------
  const dateDisplay = document.getElementById("currentDateDisplay");
  if (dateDisplay) {
    try {
      const today = new Date();
      const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      const dayName = days[today.getDay()];
      const dayNum = today.getDate();
      const monthName = months[today.getMonth()];
      dateDisplay.textContent = `${dayName}، ${dayNum} ${monthName} ${today.getFullYear()}`;
    } catch (e) { }
  }

  // -------------------------------------------------------
  // 8. Dashboard Universal Table Search, Filter & Multi-Page Engine
  // -------------------------------------------------------
  function setupTableController({
    searchInputEl,
    filterBtns,
    itemsContainers,
    showingStartEl,
    showingEndEl,
    totalCountEl,
    prevBtn,
    nextBtn,
    pageNumbersContainer,
    itemsPerPage = 4
  }) {
    if (!itemsContainers || itemsContainers.length === 0) return;

    const allItems = [];
    itemsContainers.forEach((container) => {
      if (container) {
        Array.from(container.children).forEach((child) => {
          if (!allItems.includes(child)) allItems.push(child);
        });
      }
    });

    if (allItems.length === 0) return;

    let currentSearchQuery = "";
    let currentStatusFilter = "all";
    let currentPage = 1;

    function renderEllipsisPagination(totalPages) {
      if (!pageNumbersContainer) return;
      pageNumbersContainer.innerHTML = "";

      if (totalPages <= 1) return;

      let pages = [];
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 3) {
          start = 2;
          end = 4;
        } else if (currentPage >= totalPages - 2) {
          start = totalPages - 3;
          end = totalPages - 1;
        }

        for (let i = start; i <= end; i++) pages.push(i);

        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
      }

      pages.forEach((p) => {
        if (p === "...") {
          const span = document.createElement("span");
          span.className = "pagination-dots text-muted fw-bold px-1";
          span.textContent = "...";
          pageNumbersContainer.appendChild(span);
        } else {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `page-btn ${p === currentPage ? "active" : ""}`;
          btn.textContent = p;
          btn.onclick = () => {
            currentPage = p;
            applyFiltersAndPagination();
          };
          pageNumbersContainer.appendChild(btn);
        }
      });
    }

    function applyFiltersAndPagination() {
      const filteredItems = allItems.filter((item) => {
        const textContent = (item.textContent || "").toLowerCase();
        const matchesSearch = !currentSearchQuery || textContent.includes(currentSearchQuery.toLowerCase());

        const itemStatus = item.getAttribute("data-status") || "";
        const matchesStatus = currentStatusFilter === "all" || itemStatus === currentStatusFilter;

        return matchesSearch && matchesStatus;
      });

      const totalCount = filteredItems.length;
      const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

      allItems.forEach((item) => { item.style.display = "none"; });
      filteredItems.slice(startIndex, endIndex).forEach((item) => {
        item.style.display = "";
      });

      if (showingStartEl) showingStartEl.textContent = totalCount > 0 ? startIndex + 1 : 0;
      if (showingEndEl) showingEndEl.textContent = endIndex;
      if (totalCountEl) totalCountEl.textContent = totalCount;

      if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
        prevBtn.onclick = () => {
          if (currentPage > 1) {
            currentPage--;
            applyFiltersAndPagination();
          }
        };
      }

      if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
        nextBtn.onclick = () => {
          if (currentPage < totalPages) {
            currentPage++;
            applyFiltersAndPagination();
          }
        };
      }

      renderEllipsisPagination(totalPages);
    }

    if (searchInputEl) {
      searchInputEl.addEventListener("input", (e) => {
        currentSearchQuery = e.target.value.trim();
        currentPage = 1;
        applyFiltersAndPagination();
      });
    }

    if (filterBtns && filterBtns.length > 0) {
      filterBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterBtns.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          currentStatusFilter = btn.getAttribute("data-filter") || "all";
          currentPage = 1;
          applyFiltersAndPagination();
        });
      });
    }

    applyFiltersAndPagination();
  }

  function initAllDashboardTables() {
    // 1. Orders Page (orders.html)
    const ordersCardsList = document.getElementById("ordersCardsList");
    if (ordersCardsList) {
      setupTableController({
        searchInputEl: document.getElementById("orderSearchInput"),
        filterBtns: document.querySelectorAll(".orders-filter-toolbar .filter-pill-btn"),
        itemsContainers: [ordersCardsList],
        showingStartEl: document.getElementById("ordersShowingStart"),
        showingEndEl: document.getElementById("ordersShowingEnd"),
        totalCountEl: document.getElementById("ordersTotalCount"),
        prevBtn: document.getElementById("ordersPrevPageBtn"),
        nextBtn: document.getElementById("ordersNextPageBtn"),
        pageNumbersContainer: document.getElementById("ordersPageNumbers"),
        itemsPerPage: 4
      });
    }

    // 2. Generic Dashboard Table Cards (home.html, account.html, etc.)
    const tableCards = document.querySelectorAll(".dashboard-table-card");
    tableCards.forEach((card) => {
      const searchInput = card.querySelector(".table-search-input");
      const filterBtns = card.querySelectorAll(".filter-pill-btn[data-filter]");
      const desktopTbody = card.querySelector("table.custom-dashboard-table tbody");
      const mobileList = card.querySelector(".mobile-only-card-list");
      const showingStart = card.querySelector(".showing-start");
      const showingEnd = card.querySelector(".showing-end");
      const totalCount = card.querySelector(".total-count");
      const prevBtn = card.querySelector(".page-prev-btn");
      const nextBtn = card.querySelector(".page-next-btn");
      const pageNumbersContainer = card.querySelector(".page-numbers-container");

      setupTableController({
        searchInputEl: searchInput,
        filterBtns: filterBtns,
        itemsContainers: [desktopTbody, mobileList].filter(Boolean),
        showingStartEl: showingStart,
        showingEndEl: showingEnd,
        totalCountEl: totalCount,
        prevBtn: prevBtn,
        nextBtn: nextBtn,
        pageNumbersContainer: pageNumbersContainer,
        itemsPerPage: 4
      });
    });
  }

  initAllDashboardTables();

  // -------------------------------------------------------
  // 9. Interactive Notifications Engine & LocalStorage Manager
  // -------------------------------------------------------
  const DEFAULT_NOTIFICATIONS = [
    {
      id: "notif-1",
      title: "تم إيداع أرباحك",
      text: "تم إيداع مبلغ 444.36 ر.س أرباح الطلب #ORD-98211 في حسابك البنكي.",
      time: "منذ 10 د",
      icon: "fa-solid fa-coins",
      iconBgClass: "bg-success-subtle text-success",
      link: "account.html",
      unread: true
    },
    {
      id: "notif-2",
      title: "توثيق العقد الرقمي",
      text: "تم اعتماد وتوثيق عقد التوكيل للطلب #ORD-98402 بنجاح.",
      time: "منذ ساعة",
      icon: "fa-solid fa-file-contract",
      iconBgClass: "bg-primary-subtle text-primary",
      link: "contract.html",
      unread: true
    },
    {
      id: "notif-3",
      title: "تأكيد الحجز",
      text: "تم استلام طلب حجز أيفون 17 برو ماكس بنجاح وهو قيد المعالجة.",
      time: "منذ 3 ساعات",
      icon: "fa-solid fa-box-check",
      iconBgClass: "bg-info-subtle text-info",
      link: "orders.html",
      unread: true
    },
    {
      id: "notif-4",
      title: "تحديث الحساب البنكي",
      text: "تم التوثيق وتأكيد بيانات الايبان SA0380000000608010167519 بنجاح.",
      time: "أمس",
      icon: "fa-solid fa-user-shield",
      iconBgClass: "bg-secondary-subtle text-secondary",
      link: "profile.html",
      unread: false
    }
  ];

  function getStoredNotifications() {
    try {
      const stored = localStorage.getItem("alfadhl_notifications_v3");
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    localStorage.setItem("alfadhl_notifications_v3", JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }

  function saveNotifications(notifs) {
    try {
      localStorage.setItem("alfadhl_notifications_v3", JSON.stringify(notifs));
    } catch (e) { }
  }

  function initNotificationSystem() {
    const listContainer = document.getElementById("notificationsList");
    const fullListContainer = document.getElementById("fullNotificationsList");
    const badgeCountEl = document.getElementById("notifBadgeCount");
    const navBellDot = document.getElementById("navBellDot");
    const markAllReadBtn = document.getElementById("markAllReadBtn");
    const clearAllBtn = document.getElementById("clearAllNotifsBtn");
    const tabBtns = document.querySelectorAll(".notif-tab-btn");
    const markAllReadPageBtn = document.getElementById("markAllReadPageBtn");
    const clearAllNotifsPageBtn = document.getElementById("clearAllNotifsPageBtn");

    let activeFilter = "all";

    function render() {
      let notifs = getStoredNotifications();

      let visibleNotifs = notifs;
      if (activeFilter === "unread") {
        visibleNotifs = notifs.filter((n) => n.unread);
      }

      const unreadCount = notifs.filter((n) => n.unread).length;

      if (badgeCountEl) {
        if (unreadCount > 0) {
          badgeCountEl.textContent = `${unreadCount} جديد`;
          badgeCountEl.className = "badge bg-primary-subtle text-primary rounded-pill fs-7 px-2";
        } else {
          badgeCountEl.textContent = "لا جديد";
          badgeCountEl.className = "badge bg-light text-muted rounded-pill fs-7 px-2";
        }
      }

      // Update Bell Dot indicator across all pages
      document.querySelectorAll(".nav-bell-dot, #navBellDot").forEach((dot) => {
        dot.style.display = unreadCount > 0 ? "block" : "none";
      });

      // 1. Render dropdown list if present
      if (listContainer) {
        if (visibleNotifs.length === 0) {
          listContainer.innerHTML = `
            <div class="text-center py-4 px-3 text-muted">
              <i class="fa-regular fa-bell-slash fs-2 mb-2 d-block text-secondary opacity-50"></i>
              <span class="fs-7 fw-medium d-block mb-1">لا توجد تنبيهات ${activeFilter === "unread" ? "غير مقروءة" : ""} حالياً</span>
              <span class="fs-8 text-muted">ستظهر هنا التحديثات والأرباح وتأكيدات العقود فور وصولها</span>
            </div>
          `;
        } else {
          listContainer.innerHTML = visibleNotifs
            .map(
              (n) => `
            <div class="notification-item ${n.unread ? "unread" : ""} d-flex align-items-start gap-3 p-3 border-bottom position-relative text-decoration-none" data-notif-id="${n.id}">
              <div class="notif-icon ${n.iconBgClass} rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 40px; height: 40px;">
                <i class="${n.icon} fs-6"></i>
              </div>
              <div class="notif-content flex-grow-1 cursor-pointer" onclick="window.location.href='${n.link}'">
                <div class="d-flex align-items-center justify-content-between mb-1">
                  <span class="fw-bold text-dark fs-7">${n.title}</span>
                  <span class="text-muted fs-8">${n.time}</span>
                </div>
                <p class="text-secondary fs-7 mb-0 line-clamp-2">${n.text}</p>
              </div>
              <button type="button" class="btn btn-sm text-muted p-0 border-0 notif-single-dismiss" data-dismiss-id="${n.id}" title="حذف">
                <i class="fa-solid fa-xmark fs-7"></i>
              </button>
            </div>
          `
            )
            .join("");

          listContainer.querySelectorAll(".notification-item").forEach((item) => {
            const notifId = item.getAttribute("data-notif-id");
            item.addEventListener("click", (e) => {
              if (e.target.closest(".notif-single-dismiss")) return;
              let currentNotifs = getStoredNotifications();
              const target = currentNotifs.find((n) => n.id === notifId);
              if (target && target.unread) {
                target.unread = false;
                saveNotifications(currentNotifs);
                render();
              }
            });
          });

          listContainer.querySelectorAll(".notif-single-dismiss").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              const id = btn.getAttribute("data-dismiss-id");
              let currentNotifs = getStoredNotifications().filter((n) => n.id !== id);
              saveNotifications(currentNotifs);
              render();
            });
          });
        }
      }

      // 2. Render notifications.html page list if present
      const pageTotalNotifsCount = document.getElementById("pageTotalNotifsCount");
      const pageUnreadNotifsCount = document.getElementById("pageUnreadNotifsCount");

      if (pageTotalNotifsCount) pageTotalNotifsCount.textContent = `${notifs.length} تنبيهات`;
      if (pageUnreadNotifsCount) pageUnreadNotifsCount.textContent = `${unreadCount} جديد`;

      if (fullListContainer) {
        if (visibleNotifs.length === 0) {
          fullListContainer.innerHTML = `
            <div class="text-center py-5 px-3 text-muted bg-white rounded-4 border">
              <i class="fa-regular fa-bell-slash fs-1 mb-3 d-block text-secondary opacity-50"></i>
              <h5 class="fw-bold text-dark mb-1">لا توجد تنبيهات ${activeFilter === "unread" ? "غير مقروءة" : ""} حالياً</h5>
              <p class="text-muted fs-7 mb-0">جميع التحديثات البرمجية والمالية وتأكيدات العقود ستظهر هنا فور إضافتها</p>
            </div>
          `;
        } else {
          fullListContainer.innerHTML = visibleNotifs
            .map(
              (n) => `
            <div class="notif-card-item ${n.unread ? "unread-card" : ""} p-3.5 p-md-4 mb-3 border rounded-4 bg-white shadow-sm position-relative" data-notif-id="${n.id}">
              <div class="d-flex align-items-start gap-3">
                <div class="notif-card-icon ${n.iconBgClass} rounded-4 d-flex align-items-center justify-content-center flex-shrink-0" style="width: 48px; height: 48px;">
                  <i class="${n.icon} fs-5"></i>
                </div>
                
                <div class="flex-grow-1 pe-md-2">
                  <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1.5">
                    <div class="d-flex align-items-center gap-2">
                      <h6 class="fw-bold text-dark mb-0 fs-6">${n.title}</h6>
                      ${n.unread ? '<span class="badge bg-primary text-white rounded-pill fs-8 px-2 py-1">جديد</span>' : ''}
                    </div>
                    
                    <div class="d-flex align-items-center gap-2 ms-auto">
                      <span class="text-muted fs-8 bg-light border px-2.5 py-1 rounded-pill"><i class="fa-regular fa-clock me-1"></i>${n.time}</span>
                      <button type="button" class="btn btn-sm btn-light text-muted rounded-circle p-0 d-flex align-items-center justify-content-center notif-single-dismiss" data-dismiss-id="${n.id}" title="حذف التنبيه" style="width: 30px; height: 30px;">
                        <i class="fa-solid fa-xmark fs-7"></i>
                      </button>
                    </div>
                  </div>
                  
                  <p class="text-secondary fs-7 mb-2.5 leading-relaxed">${n.text}</p>
                  
                  <a href="${n.link}" class="btn btn-sm btn-light-primary fw-semibold fs-7 rounded-pill px-3 py-1.5 text-decoration-none d-inline-flex align-items-center gap-1.5">
                    <span>عرض التفاصيل والتأكيد</span>
                    <i class="fa-solid fa-arrow-left fs-8"></i>
                  </a>
                </div>
              </div>
            </div>
          `
            )
            .join("");

          fullListContainer.querySelectorAll(".notif-card-item").forEach((item) => {
            const notifId = item.getAttribute("data-notif-id");
            item.addEventListener("click", (e) => {
              if (e.target.closest(".notif-single-dismiss") || e.target.closest("a")) return;
              let currentNotifs = getStoredNotifications();
              const target = currentNotifs.find((n) => n.id === notifId);
              if (target && target.unread) {
                target.unread = false;
                saveNotifications(currentNotifs);
                render();
              }
            });
          });

          fullListContainer.querySelectorAll(".notif-single-dismiss").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              const id = btn.getAttribute("data-dismiss-id");
              let currentNotifs = getStoredNotifications().filter((n) => n.id !== id);
              saveNotifications(currentNotifs);
              render();
            });
          });
        }
      }
    }

    if (markAllReadBtn) {
      markAllReadBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        let currentNotifs = getStoredNotifications();
        currentNotifs.forEach((n) => (n.unread = false));
        saveNotifications(currentNotifs);
        render();
      });
    }

    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        saveNotifications([]);
        render();
      });
    }

    if (markAllReadPageBtn) {
      markAllReadPageBtn.addEventListener("click", () => {
        let currentNotifs = getStoredNotifications();
        currentNotifs.forEach((n) => (n.unread = false));
        saveNotifications(currentNotifs);
        render();
      });
    }

    if (clearAllNotifsPageBtn) {
      clearAllNotifsPageBtn.addEventListener("click", () => {
        saveNotifications([]);
        render();
      });
    }

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        tabBtns.forEach((b) => {
          b.classList.remove("active", "fw-semibold");
          b.classList.add("text-muted");
        });
        btn.classList.add("active", "fw-semibold");
        btn.classList.remove("text-muted");

        activeFilter = btn.getAttribute("data-notif-filter") || "all";
        render();
      });
    });

    render();

    if (window.location.pathname.includes("home.html")) {
      setTimeout(() => {
        const notifs = getStoredNotifications();
        const unreadNotif = notifs.find((n) => n.unread);
        if (unreadNotif && !document.getElementById("floatingToastNotif")) {
          showFloatingToast(unreadNotif);
        }
      }, 1500);
    }
  }

  function showFloatingToast(notif) {
    const toast = document.createElement("div");
    toast.id = "floatingToastNotif";
    toast.className = "floating-toast-alert shadow-lg bg-white border border-primary-subtle rounded-4 p-3 d-flex align-items-center gap-3 animate-fade-in-up";
    toast.style.cssText = "position: fixed; bottom: 24px; left: 24px; z-index: 1080; max-width: 380px; box-shadow: 0 15px 35px rgba(0,0,0,0.15); border-right: 4px solid #0284c7 !important;";
    toast.innerHTML = `
      <div class="toast-icon bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 42px; height: 42px;">
        <i class="${notif.icon} fs-5"></i>
      </div>
      <div class="toast-body flex-grow-1 pe-2">
        <div class="d-flex align-items-center justify-content-between mb-1">
          <strong class="text-dark fs-7">${notif.title}</strong>
          <span class="badge bg-primary text-white fs-8">جديد</span>
        </div>
        <p class="text-secondary fs-7 mb-1 line-clamp-2">${notif.text}</p>
        <a href="${notif.link}" class="text-primary fw-bold fs-7 text-decoration-none d-inline-block">عرض التفاصيل ←</a>
      </div>
      <button type="button" class="btn-close ms-auto fs-8 align-self-start p-1" onclick="this.parentElement.remove()" title="إغلاق"></button>
    `;
    document.body.appendChild(toast);
  }

  initNotificationSystem();
});
