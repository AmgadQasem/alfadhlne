// =======================================================
// Al-Fadhel Telecom Platform - Auth & Dashboard Behaviours
// =======================================================

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
    loginSubmitBtn.addEventListener("click", function(e) {
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
  // 8. Mobile Hamburger Menu Toggle (home.html)
  // -------------------------------------------------------
  const mobileMenuToggle = document.getElementById("mobileMenuToggle");
  const mobileNavCollapse = document.getElementById("mobileNavCollapse");
  const mobileMenuIcon = document.getElementById("mobileMenuIcon");

  if (mobileMenuToggle && mobileNavCollapse) {
    mobileMenuToggle.addEventListener("click", () => {
      const isOpen = mobileNavCollapse.classList.toggle("open");

      // Switch icon between ≡ bars and × close
      if (mobileMenuIcon) {
        mobileMenuIcon.classList.toggle("fa-bars", !isOpen);
        mobileMenuIcon.classList.toggle("fa-xmark", isOpen);
      }
    });

    // Close menu when a collapse link is clicked
    mobileNavCollapse.querySelectorAll(".mobile-collapse-link").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavCollapse.classList.remove("open");
        if (mobileMenuIcon) {
          mobileMenuIcon.classList.add("fa-bars");
          mobileMenuIcon.classList.remove("fa-xmark");
        }
      });
    });
  }

    // -------------------------------------------------------
    // 9. Dynamic Arabic Date on Dashboard (home.html)
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
         // -------------------------------------------------------
    // 10. Dashboard Universal Table Search, Filter & Multi-Page Engine
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
  });
