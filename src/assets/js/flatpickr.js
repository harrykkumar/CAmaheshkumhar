/*! flatpickr v2.4.6, @license MIT */
function Flatpickr(e, t) {
    function n(e) {
        return e && e.bind ? e.bind(oe) : e
    }

    function a(e) {
        oe.config.noCalendar && !oe.selectedDates.length && (oe.selectedDates = [oe.now]), re(e), oe.selectedDates.length && (!oe.minDateHasTime || "input" !== e.type || e.target.value.length >= 2 ? (i(), G()) : setTimeout(function() {
            i(), G()
        }, 1e3))
    }

    function i() {
        if (oe.config.enableTime) {
            var e = parseInt(oe.hourElement.value, 10) || 0,
                t = parseInt(oe.minuteElement.value, 10) || 0,
                n = oe.config.enableSeconds ? parseInt(oe.secondElement.value, 10) || 0 : 0;
            oe.amPM && (e = e % 12 + 12 * ("PM" === oe.amPM.textContent)), oe.minDateHasTime && 0 === ie(oe.latestSelectedDateObj, oe.config.minDate) && (e = Math.max(e, oe.config.minDate.getHours())) === oe.config.minDate.getHours() && (t = Math.max(t, oe.config.minDate.getMinutes())), oe.maxDateHasTime && 0 === ie(oe.latestSelectedDateObj, oe.config.maxDate) && (e = Math.min(e, oe.config.maxDate.getHours())) === oe.config.maxDate.getHours() && (t = Math.min(t, oe.config.maxDate.getMinutes())), o(e, t, n)
        }
    }

    function r(e) {
        var t = e || oe.latestSelectedDateObj;
        t && o(t.getHours(), t.getMinutes(), t.getSeconds())
    }

    function o(e, t, n) {
        oe.selectedDates.length && oe.latestSelectedDateObj.setHours(e % 24, t, n || 0, 0), oe.config.enableTime && !oe.isMobile && (oe.hourElement.value = oe.pad(oe.config.time_24hr ? e : (12 + e) % 12 + 12 * (e % 12 == 0)), oe.minuteElement.value = oe.pad(t), oe.config.time_24hr || (oe.amPM.textContent = e >= 12 ? "PM" : "AM"), oe.config.enableSeconds && (oe.secondElement.value = oe.pad(n)))
    }

    function l(e) {
        var t = e.target.value;
        e.delta && (t = (parseInt(t) + e.delta).toString()), 4 === t.length && (oe.currentYearElement.blur(), /[^\d]/.test(t) || T(t))
    }

    function c(e) {
        e.preventDefault(), oe.changeMonth(Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY)))
    }

    function s() {
        if (oe.config.wrap && ["open", "close", "toggle", "clear"].forEach(function(e) {
                for (var t = oe.element.querySelectorAll("[data-" + e + "]"), n = 0; n < t.length; n++) t[n].addEventListener("click", oe[e])
            }), void 0 !== window.document.createEvent && (oe.changeEvent = window.document.createEvent("HTMLEvents"), oe.changeEvent.initEvent("change", !1, !0)), oe.isMobile) return z();
        oe.debouncedResize = ae(S, 50), oe.triggerChange = function() {
            Z("Change")
        }, oe.debouncedChange = ae(oe.triggerChange, 300), "range" === oe.config.mode && oe.days && oe.days.addEventListener("mouseover", Y), oe.calendarContainer.addEventListener("keydown", I), oe.config.static || (oe.altInput || oe.input).addEventListener("keydown", I), oe.config.inline || oe.config.static || window.addEventListener("resize", oe.debouncedResize), window.ontouchstart && window.document.addEventListener("touchstart", E), window.document.addEventListener("click", E), (oe.altInput || oe.input).addEventListener("blur", E), oe.config.clickOpens && (oe.altInput || oe.input).addEventListener("focus", N), oe.config.noCalendar || (oe.prevMonthNav.addEventListener("click", function() {
            return b(-1)
        }), oe.nextMonthNav.addEventListener("click", function() {
            return b(1)
        }), oe.currentMonthElement.addEventListener("wheel", function(e) {
            return ae(c(e), 50)
        }), oe.currentYearElement.addEventListener("wheel", function(e) {
            return ae(X(e), 50)
        }), oe.currentYearElement.addEventListener("focus", function() {
            oe.currentYearElement.select()
        }), oe.currentYearElement.addEventListener("input", l), oe.currentYearElement.addEventListener("increment", l), oe.days.addEventListener("click", H)), oe.config.enableTime && (oe.timeContainer.addEventListener("transitionend", A), oe.timeContainer.addEventListener("wheel", function(e) {
            return ae(a(e), 5)
        }), oe.timeContainer.addEventListener("input", a), oe.timeContainer.addEventListener("increment", a), oe.timeContainer.addEventListener("increment", oe.debouncedChange), oe.timeContainer.addEventListener("wheel", oe.debouncedChange), oe.timeContainer.addEventListener("input", oe.triggerChange), oe.hourElement.addEventListener("focus", function() {
            oe.hourElement.select()
        }), oe.minuteElement.addEventListener("focus", function() {
            oe.minuteElement.select()
        }), oe.secondElement && oe.secondElement.addEventListener("focus", function() {
            oe.secondElement.select()
        }), oe.amPM && oe.amPM.addEventListener("click", function(e) {
            a(e), oe.triggerChange(e)
        }))
    }

    function u(e) {
        e = e ? oe.parseDate(e) : oe.latestSelectedDateObj || (oe.config.minDate > oe.now ? oe.config.minDate : oe.config.maxDate && oe.config.maxDate < oe.now ? oe.config.maxDate : oe.now);
        try {
            oe.currentYear = e.getFullYear(), oe.currentMonth = e.getMonth()
        } catch (t) {
            console.error(t.stack), console.warn("Invalid date supplied: " + e)
        }
        oe.redraw()
    }

    function d(e, t, n) {
        var a = n || e.target.parentNode.childNodes[0],
            i = void 0;
        try {
            i = new Event("increment", {
                bubbles: !0
            })
        } catch (e) {
            i = window.document.createEvent("CustomEvent"), i.initCustomEvent("increment", !0, !0, {})
        }
        i.delta = t, a.dispatchEvent(i)
    }

    function f(e) {
        var t = ee("div", "numInputWrapper"),
            n = ee("input", "numInput " + e),
            a = ee("span", "arrowUp"),
            i = ee("span", "arrowDown");
        return n.type = "text", n.pattern = "\\d*", t.appendChild(n), t.appendChild(a), t.appendChild(i), a.addEventListener("click", function(e) {
            return d(e, 1)
        }), i.addEventListener("click", function(e) {
            return d(e, -1)
        }), t
    }

    function p() {
        var e = window.document.createDocumentFragment();
        oe.calendarContainer = ee("div", "flatpickr-calendar"), oe.numInputType = navigator.userAgent.indexOf("MSIE 9.0") > 0 ? "text" : "number", oe.config.noCalendar || (e.appendChild(h()), oe.innerContainer = ee("div", "flatpickr-innerContainer"), oe.config.weekNumbers && oe.innerContainer.appendChild(w()), oe.rContainer = ee("div", "flatpickr-rContainer"), oe.rContainer.appendChild(v()), oe.days || (oe.days = ee("div", "flatpickr-days"), oe.days.tabIndex = -1), m(), oe.rContainer.appendChild(oe.days), oe.innerContainer.appendChild(oe.rContainer), e.appendChild(oe.innerContainer)), oe.config.enableTime && e.appendChild(D()), "range" === oe.config.mode && oe.calendarContainer.classList.add("rangeMode"), oe.calendarContainer.appendChild(e);
        var t = oe.config.appendTo && oe.config.appendTo.nodeType;
        if (oe.config.inline || oe.config.static) {
            if (oe.calendarContainer.classList.add(oe.config.inline ? "inline" : "static"), oe.config.inline && !t) return oe.element.parentNode.insertBefore(oe.calendarContainer, (oe.altInput || oe.input).nextSibling);
            if (oe.config.static) {
                var n = ee("div", "flatpickr-wrapper");
                return oe.element.parentNode.insertBefore(n, oe.element), n.appendChild(oe.element), oe.altInput && n.appendChild(oe.altInput), void n.appendChild(oe.calendarContainer)
            }
        }(t ? oe.config.appendTo : window.document.body).appendChild(oe.calendarContainer)
    }

    function g(e, t, n) {
        var a = F(t, !0),
            i = ee("span", "flatpickr-day " + e, t.getDate());
        return i.dateObj = t, ne(i, "today", 0 === ie(t, oe.now)), a ? q(t) && (i.classList.add("selected"), oe.selectedDateElem = i, "range" === oe.config.mode && (ne(i, "startRange", 0 === ie(t, oe.selectedDates[0])), ne(i, "endRange", 0 === ie(t, oe.selectedDates[1])))) : (i.classList.add("disabled"), oe.selectedDates[0] && t > oe.minRangeDate && t < oe.selectedDates[0] ? oe.minRangeDate = t : oe.selectedDates[0] && t < oe.maxRangeDate && t > oe.selectedDates[0] && (oe.maxRangeDate = t)), "range" === oe.config.mode && (Q(t) && !q(t) && i.classList.add("inRange"), 1 === oe.selectedDates.length && (t < oe.minRangeDate || t > oe.maxRangeDate) && i.classList.add("notAllowed")), oe.config.weekNumbers && "prevMonthDay" !== e && n % 7 == 1 && oe.weekNumbers.insertAdjacentHTML("beforeend", "<span class='disabled flatpickr-day'>" + oe.config.getWeek(t) + "</span>"), Z("DayCreate", i), i
    }

    function m(e, t) {
        var n = (new Date(oe.currentYear, oe.currentMonth, 1).getDay() - oe.l10n.firstDayOfWeek + 7) % 7,
            a = "range" === oe.config.mode;
        oe.prevMonthDays = oe.utils.getDaysinMonth((oe.currentMonth - 1 + 12) % 12);
        var i = oe.utils.getDaysinMonth(),
            r = window.document.createDocumentFragment(),
            o = oe.prevMonthDays + 1 - n;
        for (oe.config.weekNumbers && oe.weekNumbers.firstChild && (oe.weekNumbers.textContent = ""), a && (oe.minRangeDate = new Date(oe.currentYear, oe.currentMonth - 1, o), oe.maxRangeDate = new Date(oe.currentYear, oe.currentMonth + 1, (42 - n) % i)), oe.days.firstChild && (oe.days.textContent = ""); o <= oe.prevMonthDays; o++) r.appendChild(g("prevMonthDay", new Date(oe.currentYear, oe.currentMonth - 1, o), o));
        for (o = 1; o <= i; o++) r.appendChild(g("", new Date(oe.currentYear, oe.currentMonth, o), o));
        for (var l = i + 1; l <= 42 - n; l++) r.appendChild(g("nextMonthDay", new Date(oe.currentYear, oe.currentMonth + 1, l % i), l));
        return a && 1 === oe.selectedDates.length && r.childNodes[0] ? (oe._hidePrevMonthArrow = oe._hidePrevMonthArrow || oe.minRangeDate > r.childNodes[0].dateObj, oe._hideNextMonthArrow = oe._hideNextMonthArrow || oe.maxRangeDate < new Date(oe.currentYear, oe.currentMonth + 1, 1)) : $(), oe.days.appendChild(r), oe.days
    }

    function h() {
        var e = window.document.createDocumentFragment();
        oe.monthNav = ee("div", "flatpickr-month"), oe.prevMonthNav = ee("span", "flatpickr-prev-month"), oe.prevMonthNav.innerHTML = oe.config.prevArrow, oe.currentMonthElement = ee("span", "cur-month"), oe.currentMonthElement.title = oe.l10n.scrollTitle;
        var t = f("cur-year");
        return oe.currentYearElement = t.childNodes[0], oe.currentYearElement.title = oe.l10n.scrollTitle, oe.config.minDate && (oe.currentYearElement.min = oe.config.minDate.getFullYear()), oe.config.maxDate && (oe.currentYearElement.max = oe.config.maxDate.getFullYear(), oe.currentYearElement.disabled = oe.config.minDate && oe.config.minDate.getFullYear() === oe.config.maxDate.getFullYear()), oe.nextMonthNav = ee("span", "flatpickr-next-month"), oe.nextMonthNav.innerHTML = oe.config.nextArrow, oe.navigationCurrentMonth = ee("span", "flatpickr-current-month"), oe.navigationCurrentMonth.appendChild(oe.currentMonthElement), oe.navigationCurrentMonth.appendChild(t), e.appendChild(oe.prevMonthNav), e.appendChild(oe.navigationCurrentMonth), e.appendChild(oe.nextMonthNav), oe.monthNav.appendChild(e), Object.defineProperty(oe, "_hidePrevMonthArrow", {
            get: function() {
                return this.__hidePrevMonthArrow
            },
            set: function(e) {
                this.__hidePrevMonthArrow !== e && (oe.prevMonthNav.style.display = e ? "none" : "block"), this.__hidePrevMonthArrow = e
            }
        }), Object.defineProperty(oe, "_hideNextMonthArrow", {
            get: function() {
                return this.__hideNextMonthArrow
            },
            set: function(e) {
                this.__hideNextMonthArrow !== e && (oe.nextMonthNav.style.display = e ? "none" : "block"), this.__hideNextMonthArrow = e
            }
        }), $(), oe.monthNav
    }

    function D() {
        oe.calendarContainer.classList.add("hasTime"), oe.config.noCalendar && oe.calendarContainer.classList.add("noCalendar"), oe.timeContainer = ee("div", "flatpickr-time"), oe.timeContainer.tabIndex = -1;
        var e = ee("span", "flatpickr-time-separator", ":"),
            t = f("flatpickr-hour");
        oe.hourElement = t.childNodes[0];
        var n = f("flatpickr-minute");
        if (oe.minuteElement = n.childNodes[0], oe.hourElement.tabIndex = oe.minuteElement.tabIndex = -1, oe.hourElement.value = oe.pad(oe.latestSelectedDateObj ? oe.latestSelectedDateObj.getHours() : oe.config.defaultHour), oe.minuteElement.value = oe.pad(oe.latestSelectedDateObj ? oe.latestSelectedDateObj.getMinutes() : oe.config.defaultMinute), oe.hourElement.step = oe.config.hourIncrement, oe.minuteElement.step = oe.config.minuteIncrement, oe.hourElement.min = oe.config.time_24hr ? 0 : 1, oe.hourElement.max = oe.config.time_24hr ? 23 : 12, oe.minuteElement.min = 0, oe.minuteElement.max = 59, oe.hourElement.title = oe.minuteElement.title = oe.l10n.scrollTitle, oe.timeContainer.appendChild(t), oe.timeContainer.appendChild(e), oe.timeContainer.appendChild(n), oe.config.time_24hr && oe.timeContainer.classList.add("time24hr"), oe.config.enableSeconds) {
            oe.timeContainer.classList.add("hasSeconds");
            var a = f("flatpickr-second");
            oe.secondElement = a.childNodes[0], oe.secondElement.value = oe.latestSelectedDateObj ? oe.pad(oe.latestSelectedDateObj.getSeconds()) : "00", oe.secondElement.step = oe.minuteElement.step, oe.secondElement.min = oe.minuteElement.min, oe.secondElement.max = oe.minuteElement.max, oe.timeContainer.appendChild(ee("span", "flatpickr-time-separator", ":")), oe.timeContainer.appendChild(a)
        }
        return oe.config.time_24hr || (oe.amPM = ee("span", "flatpickr-am-pm", ["AM", "PM"][oe.hourElement.value > 11 | 0]), oe.amPM.title = oe.l10n.toggleTitle, oe.amPM.tabIndex = -1, oe.timeContainer.appendChild(oe.amPM)), oe.timeContainer
    }

    function v() {
        oe.weekdayContainer || (oe.weekdayContainer = ee("div", "flatpickr-weekdays"));
        var e = oe.l10n.firstDayOfWeek,
            t = oe.l10n.weekdays.shorthand.slice();
        return e > 0 && e < t.length && (t = [].concat(t.splice(e, t.length), t.splice(0, e))), oe.weekdayContainer.innerHTML = "\n\t\t<span class=flatpickr-weekday>\n\t\t\t" + t.join("</span><span class=flatpickr-weekday>") + "\n\t\t</span>\n\t\t", oe.weekdayContainer
    }

    function w() {
        return oe.calendarContainer.classList.add("hasWeeks"), oe.weekWrapper = ee("div", "flatpickr-weekwrapper"), oe.weekWrapper.appendChild(ee("span", "flatpickr-weekday", oe.l10n.weekAbbreviation)), oe.weekNumbers = ee("div", "flatpickr-weeks"), oe.weekWrapper.appendChild(oe.weekNumbers), oe.weekWrapper
    }

    function b(e, t) {
        t = void 0 === t || t;
        var n = t ? e : e - oe.currentMonth;
        n < 0 && oe._hidePrevMonthArrow || n > 0 && oe._hideNextMonthArrow || (oe.currentMonth += n, (oe.currentMonth < 0 || oe.currentMonth > 11) && (oe.currentYear += oe.currentMonth > 11 ? 1 : -1, oe.currentMonth = (oe.currentMonth + 12) % 12, Z("YearChange")), $(), m(), oe.config.noCalendar || oe.days.focus(), Z("MonthChange"))
    }

    function M(e) {
        oe.input.value = "", oe.altInput && (oe.altInput.value = ""), oe.mobileInput && (oe.mobileInput.value = ""), oe.selectedDates = [], oe.latestSelectedDateObj = null, oe.showTimeInput = !1, oe.redraw(), e !== !1 && Z("Change")
    }

    function C() {
        oe.isOpen = !1, oe.isMobile || (oe.calendarContainer.classList.remove("open"), (oe.altInput || oe.input).classList.remove("active")), Z("Close")
    }

    function y(e) {
        e = e || oe, e.clear(!1), window.removeEventListener("resize", e.debouncedResize), window.document.removeEventListener("click", E), window.document.removeEventListener("touchstart", E), window.document.removeEventListener("blur", E), e.timeContainer && e.timeContainer.removeEventListener("transitionend", A), e.mobileInput ? (e.mobileInput.parentNode && e.mobileInput.parentNode.removeChild(e.mobileInput), delete e.mobileInput) : e.calendarContainer && e.calendarContainer.parentNode && e.calendarContainer.parentNode.removeChild(e.calendarContainer), e.altInput && (e.input.type = "text", e.altInput.parentNode && e.altInput.parentNode.removeChild(e.altInput), delete e.altInput), e.input.type = e.input._type, e.input.classList.remove("flatpickr-input"), e.input.removeEventListener("focus", N), e.input.removeAttribute("readonly"), delete e.input._flatpickr
    }

    function k(e) {
        if (oe.config.appendTo && oe.config.appendTo.contains(e)) return !0;
        for (var t = e; t;) {
            if (t === oe.calendarContainer) return !0;
            t = t.parentNode
        }
        return !1
    }

    function E(e) {
        if (oe.isOpen && !oe.config.inline) {
            var t = k(e.target),
                n = e.target === oe.input || e.target === oe.altInput || oe.element.contains(e.target) || e.path && e.path.indexOf && (~e.path.indexOf(oe.input) || ~e.path.indexOf(oe.altInput));
            ("blur" === e.type ? n && e.relatedTarget && !k(e.relatedTarget) : !n && !t) && (e.preventDefault(), oe.close(), "range" === oe.config.mode && 1 === oe.selectedDates.length && (oe.clear(), oe.redraw()))
        }
    }

    function x(e, t) {
        if (oe.config.formatDate) return oe.config.formatDate(e, t);
        var n = e.split("");
        return n.map(function(e, a) {
            return oe.formats[e] && "\\" !== n[a - 1] ? oe.formats[e](t) : "\\" !== e ? e : ""
        }).join("")
    }

    function T(e) {
        if (!(!e || oe.currentYearElement.min && e < oe.currentYearElement.min || oe.currentYearElement.max && e > oe.currentYearElement.max)) {
            var t = parseInt(e, 10),
                n = oe.currentYear !== t;
            oe.currentYear = t || oe.currentYear, oe.config.maxDate && oe.currentYear === oe.config.maxDate.getFullYear() ? oe.currentMonth = Math.min(oe.config.maxDate.getMonth(), oe.currentMonth) : oe.config.minDate && oe.currentYear === oe.config.minDate.getFullYear() && (oe.currentMonth = Math.max(oe.config.minDate.getMonth(), oe.currentMonth)), n && (oe.redraw(), Z("YearChange"))
        }
    }

    function F(e, t) {
        var n = ie(e, oe.config.minDate, void 0 !== t ? t : !oe.minDateHasTime) < 0,
            a = ie(e, oe.config.maxDate, void 0 !== t ? t : !oe.maxDateHasTime) > 0;
        if (n || a) return !1;
        if (!oe.config.enable.length && !oe.config.disable.length) return !0;
        for (var i, r = oe.parseDate(e, !0), o = oe.config.enable.length > 0, l = o ? oe.config.enable : oe.config.disable, c = 0; c < l.length; c++) {
            if ((i = l[c]) instanceof Function && i(r)) return o;
            if (i instanceof Date && i.getTime() === r.getTime()) return o;
            if ("string" == typeof i && oe.parseDate(i, !0).getTime() === r.getTime()) return o;
            if ("object" === (void 0 === i ? "undefined" : _typeof(i)) && i.from && i.to && r >= i.from && r <= i.to) return o
        }
        return !o
    }

    function I(e) {
        if (e.target === (oe.altInput || oe.input) && 13 === e.which) H(e);
        else if (oe.isOpen || oe.config.inline) {
            switch (e.key) {
                case "Enter":
                    oe.timeContainer && oe.timeContainer.contains(e.target) ? G() : H(e);
                    break;
                case "Escape":
                    oe.close();
                    break;
                case "ArrowLeft":
                    e.target !== oe.input & e.target !== oe.altInput && (e.preventDefault(), b(-1), oe.currentMonthElement.focus());
                    break;
                case "ArrowUp":
                    oe.timeContainer && oe.timeContainer.contains(e.target) ? a(e) : (e.preventDefault(), oe.currentYear++, oe.redraw());
                    break;
                case "ArrowRight":
                    e.target !== oe.input & e.target !== oe.altInput && (e.preventDefault(), b(1), oe.currentMonthElement.focus());
                    break;
                case "ArrowDown":
                    oe.timeContainer && oe.timeContainer.contains(e.target) ? a(e) : (e.preventDefault(), oe.currentYear--, oe.redraw());
                    break;
                case "Tab":
                    e.target === oe.hourElement ? (e.preventDefault(), oe.minuteElement.select()) : e.target === oe.minuteElement && oe.amPM && (e.preventDefault(), oe.amPM.focus())
            }
            Z("KeyDown", e)
        }
    }

    function Y(e) {
        if (1 === oe.selectedDates.length && e.target.classList.contains("flatpickr-day")) {
            for (var t = e.target.dateObj, n = oe.parseDate(oe.selectedDates[0], !0), a = Math.min(t.getTime(), oe.selectedDates[0].getTime()), i = Math.max(t.getTime(), oe.selectedDates[0].getTime()), r = !1, o = a; o < i; o += oe.utils.duration.DAY)
                if (!F(new Date(o))) {
                    r = !0;
                    break
                } for (var l = oe.days.childNodes[0].dateObj.getTime(), c = 0; c < 42; c++, l += oe.utils.duration.DAY) {
                (function(o, l) {
                    var c = o < oe.minRangeDate.getTime() || o > oe.maxRangeDate.getTime();
                    if (c) return oe.days.childNodes[l].classList.add("notAllowed"), ["inRange", "startRange", "endRange"].forEach(function(e) {
                        oe.days.childNodes[l].classList.remove(e)
                    }), "continue";
                    if (r && !c) return "continue";
                    ["startRange", "inRange", "endRange", "notAllowed"].forEach(function(e) {
                        oe.days.childNodes[l].classList.remove(e)
                    });
                    var s = Math.max(oe.minRangeDate.getTime(), a),
                        u = Math.min(oe.maxRangeDate.getTime(), i);
                    e.target.classList.add(t < oe.selectedDates[0] ? "startRange" : "endRange"), n > t && o === n.getTime() ? oe.days.childNodes[l].classList.add("endRange") : n < t && o === n.getTime() ? oe.days.childNodes[l].classList.add("startRange") : o >= s && o <= u && oe.days.childNodes[l].classList.add("inRange")
                })(l, c)
            }
        }
    }

    function S() {
        !oe.isOpen || oe.config.static || oe.config.inline || A()
    }

    function N(e) {
        if (oe.isMobile) return e && (e.preventDefault(), e.target.blur()), setTimeout(function() {
            oe.mobileInput.click()
        }, 0), void Z("Open");
        oe.isOpen || (oe.altInput || oe.input).disabled || oe.config.inline || (oe.isOpen = !0, oe.calendarContainer.classList.add("open"), A(), (oe.altInput || oe.input).classList.add("active"), Z("Open"))
    }

    function L(e) {
        return function(t) {
            var n = oe.config["_" + e + "Date"] = oe.parseDate(t),
                a = oe.config["_" + ("min" === e ? "max" : "min") + "Date"],
                i = t && n instanceof Date;
            i && (oe[e + "DateHasTime"] = n.getHours() || n.getMinutes() || n.getSeconds()), oe.selectedDates && (oe.selectedDates = oe.selectedDates.filter(function(e) {
                return F(e)
            }), oe.selectedDates.length || "min" !== e || r(n), G()), oe.days && (j(), i ? oe.currentYearElement[e] = n.getFullYear() : oe.currentYearElement.removeAttribute(e), oe.currentYearElement.disabled = a && n && a.getFullYear() === n.getFullYear())
        }
    }

    function O() {
        var e = ["utc", "wrap", "weekNumbers", "allowInput", "clickOpens", "time_24hr", "enableTime", "noCalendar", "altInput", "shorthandCurrentMonth", "inline", "static", "enableSeconds", "disableMobile"],
            t = ["onChange", "onClose", "onDayCreate", "onKeyDown", "onMonthChange", "onOpen", "onParseConfig", "onReady", "onValueUpdate", "onYearChange"];
        oe.config = Object.create(Flatpickr.defaultConfig);
        var a = _extends({}, oe.instanceConfig, JSON.parse(JSON.stringify(oe.element.dataset || {})));
        oe.config.parseDate = a.parseDate, oe.config.formatDate = a.formatDate, _extends(oe.config, a), !a.dateFormat && a.enableTime && (oe.config.dateFormat = oe.config.noCalendar ? "H:i" + (oe.config.enableSeconds ? ":S" : "") : Flatpickr.defaultConfig.dateFormat + " H:i" + (oe.config.enableSeconds ? ":S" : "")), a.altInput && a.enableTime && !a.altFormat && (oe.config.altFormat = oe.config.noCalendar ? "h:i" + (oe.config.enableSeconds ? ":S K" : " K") : Flatpickr.defaultConfig.altFormat + " h:i" + (oe.config.enableSeconds ? ":S" : "") + " K"), Object.defineProperty(oe.config, "minDate", {
            get: function() {
                return this._minDate
            },
            set: L("min")
        }), Object.defineProperty(oe.config, "maxDate", {
            get: function() {
                return this._maxDate
            },
            set: L("max")
        }), oe.config.minDate = a.minDate, oe.config.maxDate = a.maxDate;
        for (var i = 0; i < e.length; i++) oe.config[e[i]] = oe.config[e[i]] === !0 || "true" === oe.config[e[i]];
        for (var r = 0; r < t.length; r++) oe.config[t[r]] = te(oe.config[t[r]] || []).map(n);
        for (var o = 0; o < oe.config.plugins.length; o++) {
            var l = oe.config.plugins[o](oe) || {};
            for (var c in l) Array.isArray(oe.config[c]) || ~t.indexOf(c) ? oe.config[c] = te(l[c]).map(n).concat(oe.config[c]) : void 0 === a[c] && (oe.config[c] = l[c])
        }
        Z("ParseConfig")
    }

    function _() {
        "object" !== _typeof(oe.config.locale) && void 0 === Flatpickr.l10ns[oe.config.locale] && console.warn("flatpickr: invalid locale " + oe.config.locale), oe.l10n = _extends(Object.create(Flatpickr.l10ns.default), "object" === _typeof(oe.config.locale) ? oe.config.locale : "default" !== oe.config.locale ? Flatpickr.l10ns[oe.config.locale] || {} : {})
    }

    function A(e) {
        if (!e || e.target === oe.timeContainer) {
            var t = oe.calendarContainer.offsetHeight,
                n = oe.calendarContainer.offsetWidth,
                a = oe.config.position,
                i = oe.altInput || oe.input,
                r = i.getBoundingClientRect(),
                o = window.innerHeight - r.bottom + i.offsetHeight,
                l = "above" === a || "below" !== a && o < t && r.top > t,
                c = window.pageYOffset + r.top + (l ? -t - 2 : i.offsetHeight + 2);
            if (ne(oe.calendarContainer, "arrowTop", !l), ne(oe.calendarContainer, "arrowBottom", l), !oe.config.inline) {
                var s = window.pageXOffset + r.left,
                    u = window.document.body.offsetWidth - r.right,
                    d = s + n > window.document.body.offsetWidth;
                ne(oe.calendarContainer, "rightMost", d), oe.config.static || (oe.calendarContainer.style.top = c + "px", d ? (oe.calendarContainer.style.left = "auto", oe.calendarContainer.style.right = u + "px") : (oe.calendarContainer.style.left = s + "px", oe.calendarContainer.style.right = "auto"))
            }
        }
    }

    function j() {
        oe.config.noCalendar || oe.isMobile || (v(), $(), m())
    }

    function H(e) {
        if (e.preventDefault(), e.stopPropagation(), oe.config.allowInput && "Enter" === e.key && e.target === (oe.altInput || oe.input)) return oe.setDate((oe.altInput || oe.input).value, !0, e.target === oe.altInput ? oe.config.altFormat : oe.config.dateFormat), e.target.blur();
        if (e.target.classList.contains("flatpickr-day") && !e.target.classList.contains("disabled") && !e.target.classList.contains("notAllowed")) {
            var t = oe.latestSelectedDateObj = new Date(e.target.dateObj.getTime());
            if (oe.selectedDateElem = e.target, "single" === oe.config.mode) oe.selectedDates = [t];
            else if ("multiple" === oe.config.mode) {
                var n = q(t);
                n ? oe.selectedDates.splice(n, 1) : oe.selectedDates.push(t)
            } else "range" === oe.config.mode && (2 === oe.selectedDates.length && oe.clear(), oe.selectedDates.push(t), 0 !== ie(t, oe.selectedDates[0], !0) && oe.selectedDates.sort(function(e, t) {
                return e.getTime() - t.getTime()
            }));
            if (i(), t.getMonth() !== oe.currentMonth && "range" !== oe.config.mode) {
                var a = oe.currentYear !== t.getFullYear();
                oe.currentYear = t.getFullYear(), oe.currentMonth = t.getMonth(), a && Z("YearChange"), Z("MonthChange")
            }
            m(), oe.minDateHasTime && oe.config.enableTime && 0 === ie(t, oe.config.minDate) && r(oe.config.minDate), G(), setTimeout(function() {
                return oe.showTimeInput = !0
            }, 50), "range" === oe.config.mode && (1 === oe.selectedDates.length ? (Y(e), oe._hidePrevMonthArrow = oe._hidePrevMonthArrow || oe.minRangeDate > oe.days.childNodes[0].dateObj, oe._hideNextMonthArrow = oe._hideNextMonthArrow || oe.maxRangeDate < new Date(oe.currentYear, oe.currentMonth + 1, 1)) : ($(), oe.close())), oe.config.enableTime && setTimeout(function() {
                oe.hourElement.select()
            }, 451), "single" !== oe.config.mode || oe.config.enableTime || oe.close(), Z("Change")
        }
    }

    function P(e, t) {
        oe.config[e] = t, oe.redraw(), u()
    }

    function R(e, t) {
        if (Array.isArray(e)) oe.selectedDates = e.map(function(e) {
            return oe.parseDate(e, !1, t)
        });
        else if (e instanceof Date || !isNaN(e)) oe.selectedDates = [oe.parseDate(e)];
        else if (e && e.substring) switch (oe.config.mode) {
            case "single":
                oe.selectedDates = [oe.parseDate(e, !1, t)];
                break;
            case "multiple":
                oe.selectedDates = e.split("; ").map(function(e) {
                    return oe.parseDate(e, !1, t)
                });
                break;
            case "range":
                oe.selectedDates = e.split(oe.l10n.rangeSeparator).map(function(e) {
                    return oe.parseDate(e, !1, t)
                })
        }
        oe.selectedDates = oe.selectedDates.filter(function(e) {
            return e instanceof Date && F(e, !1)
        }), oe.selectedDates.sort(function(e, t) {
            return e.getTime() - t.getTime()
        })
    }

    function W(e, t, n) {
        if (!e) return oe.clear();
        R(e, n), oe.showTimeInput = oe.selectedDates.length > 0, oe.latestSelectedDateObj = oe.selectedDates[0], oe.redraw(), u(), r(), G(), t && Z("Change")
    }

    function U() {
        function e(e) {
            for (var t = e.length; t--;) "string" == typeof e[t] || +e[t] ? e[t] = oe.parseDate(e[t], !0) : e[t] && e[t].from && e[t].to && (e[t].from = oe.parseDate(e[t].from), e[t].to = oe.parseDate(e[t].to));
            return e.filter(function(e) {
                return e
            })
        }
        oe.selectedDates = [], oe.now = new Date, oe.config.disable.length && (oe.config.disable = e(oe.config.disable)), oe.config.enable.length && (oe.config.enable = e(oe.config.enable)), R(oe.config.defaultDate || oe.input.value);
        var t = oe.selectedDates.length ? oe.selectedDates[0] : oe.config.minDate && oe.config.minDate.getTime() > oe.now ? oe.config.minDate : oe.config.maxDate && oe.config.maxDate.getTime() < oe.now ? oe.config.maxDate : oe.now;
        oe.currentYear = t.getFullYear(), oe.currentMonth = t.getMonth(), oe.selectedDates.length && (oe.latestSelectedDateObj = oe.selectedDates[0]), oe.minDateHasTime = oe.config.minDate && (oe.config.minDate.getHours() || oe.config.minDate.getMinutes() || oe.config.minDate.getSeconds()), oe.maxDateHasTime = oe.config.maxDate && (oe.config.maxDate.getHours() || oe.config.maxDate.getMinutes() || oe.config.maxDate.getSeconds()), Object.defineProperty(oe, "latestSelectedDateObj", {
            get: function() {
                return oe._selectedDateObj || oe.selectedDates[oe.selectedDates.length - 1] || null
            },
            set: function(e) {
                oe._selectedDateObj = e
            }
        }), oe.isMobile || Object.defineProperty(oe, "showTimeInput", {
            get: function() {
                return oe._showTimeInput
            },
            set: function(e) {
                oe._showTimeInput = e, oe.calendarContainer && ne(oe.calendarContainer, "showTimeInput", e)
            }
        })
    }

    function J() {
        oe.utils = {
            duration: {
                DAY: 864e5
            },
            getDaysinMonth: function(e, t) {
                return e = void 0 === e ? oe.currentMonth : e, t = void 0 === t ? oe.currentYear : t, 1 === e && (t % 4 == 0 && t % 100 != 0 || t % 400 == 0) ? 29 : oe.l10n.daysInMonth[e]
            },
            monthToStr: function(e, t) {
                return t = void 0 === t ? oe.config.shorthandCurrentMonth : t, oe.l10n.months[(t ? "short" : "long") + "hand"][e]
            }
        }
    }

    function B() {
        ["D", "F", "J", "M", "W", "l"].forEach(function(e) {
            oe.formats[e] = Flatpickr.prototype.formats[e].bind(oe)
        }), oe.revFormat.F = Flatpickr.prototype.revFormat.F.bind(oe), oe.revFormat.M = Flatpickr.prototype.revFormat.M.bind(oe)
    }

    function K() {
        if (oe.input = oe.config.wrap ? oe.element.querySelector("[data-input]") : oe.element, !oe.input) return console.warn("Error: invalid input element specified", oe.input);
        oe.input._type = oe.input.type, oe.input.type = "text", oe.input.classList.add("flatpickr-input"), oe.config.altInput && (oe.altInput = ee(oe.input.nodeName, oe.input.className + " " + oe.config.altInputClass), oe.altInput.placeholder = oe.input.placeholder, oe.altInput.type = "text", oe.input.type = "hidden", !oe.config.static && oe.input.parentNode && oe.input.parentNode.insertBefore(oe.altInput, oe.input.nextSibling)), oe.config.allowInput || (oe.altInput || oe.input).setAttribute("readonly", "readonly")
    }

    function z() {
        var e = oe.config.enableTime ? oe.config.noCalendar ? "time" : "datetime-local" : "date";
        oe.mobileInput = ee("input", oe.input.className + " flatpickr-mobile"), oe.mobileInput.step = "any", oe.mobileInput.tabIndex = 1, oe.mobileInput.type = e, oe.mobileInput.disabled = oe.input.disabled, oe.mobileInput.placeholder = oe.input.placeholder, oe.mobileFormatStr = "datetime-local" === e ? "Y-m-d\\TH:i:S" : "date" === e ? "Y-m-d" : "H:i:S", oe.selectedDates.length && (oe.mobileInput.defaultValue = oe.mobileInput.value = x(oe.mobileFormatStr, oe.selectedDates[0])), oe.config.minDate && (oe.mobileInput.min = x("Y-m-d", oe.config.minDate)), oe.config.maxDate && (oe.mobileInput.max = x("Y-m-d", oe.config.maxDate)), oe.input.type = "hidden", oe.config.altInput && (oe.altInput.type = "hidden");
        try {
            oe.input.parentNode.insertBefore(oe.mobileInput, oe.input.nextSibling)
        } catch (e) {}
        oe.mobileInput.addEventListener("change", function(e) {
            oe.latestSelectedDateObj = oe.parseDate(e.target.value), oe.setDate(oe.latestSelectedDateObj), Z("Change"), Z("Close")
        })
    }

    function V() {
        oe.isOpen ? oe.close() : oe.open()
    }

    function Z(e, t) {
        var n = oe.config["on" + e];
        if (n)
            for (var a = 0; n[a] && a < n.length; a++) n[a](oe.selectedDates, oe.input && oe.input.value, oe, t);
        if ("Change" === e)
            if ("function" == typeof Event && Event.constructor) oe.input.dispatchEvent(new Event("change", {
                bubbles: !0
            })), oe.input.dispatchEvent(new Event("input", {
                bubbles: !0
            }));
            else {
                if (void 0 !== window.document.createEvent) return oe.input.dispatchEvent(oe.changeEvent);
                oe.input.fireEvent("onchange")
            }
    }

    function q(e) {
        for (var t = 0; t < oe.selectedDates.length; t++)
            if (0 === ie(oe.selectedDates[t], e)) return "" + t;
        return !1
    }

    function Q(e) {
        return !("range" !== oe.config.mode || oe.selectedDates.length < 2) && (ie(e, oe.selectedDates[0]) >= 0 && ie(e, oe.selectedDates[1]) <= 0)
    }

    function $() {
        oe.config.noCalendar || oe.isMobile || !oe.monthNav || (oe.currentMonthElement.textContent = oe.utils.monthToStr(oe.currentMonth) + " ", oe.currentYearElement.value = oe.currentYear, oe._hidePrevMonthArrow = oe.config.minDate && (oe.currentYear === oe.config.minDate.getFullYear() ? oe.currentMonth <= oe.config.minDate.getMonth() : oe.currentYear < oe.config.minDate.getFullYear()), oe._hideNextMonthArrow = oe.config.maxDate && (oe.currentYear === oe.config.maxDate.getFullYear() ? oe.currentMonth + 1 > oe.config.maxDate.getMonth() : oe.currentYear > oe.config.maxDate.getFullYear()))
    }

    function G() {
        if (!oe.selectedDates.length) return oe.clear();
        oe.isMobile && (oe.mobileInput.value = oe.selectedDates.length ? x(oe.mobileFormatStr, oe.latestSelectedDateObj) : "");
        var e = "range" !== oe.config.mode ? "; " : oe.l10n.rangeSeparator;
        oe.input.value = oe.selectedDates.map(function(e) {
            return x(oe.config.dateFormat, e)
        }).join(e), oe.config.altInput && (oe.altInput.value = oe.selectedDates.map(function(e) {
            return x(oe.config.altFormat, e)
        }).join(e)), Z("ValueUpdate")
    }

    function X(e) {
        e.preventDefault();
        var t = Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY));
        T(parseInt(e.target.value, 10) + t), e.target.value = oe.currentYear
    }

    function ee(e, t, n) {
        var a = window.document.createElement(e);
        return t = t || "", n = n || "", a.className = t, n && (a.textContent = n), a
    }

    function te(e) {
        return Array.isArray(e) ? e : [e]
    }

    function ne(e, t, n) {
        if (n) return e.classList.add(t);
        e.classList.remove(t)
    }

    function ae(e, t, n) {
        var a = void 0;
        return function() {
            var i = this,
                r = arguments;
            clearTimeout(a), a = setTimeout(function() {
                a = null, n || e.apply(i, r)
            }, t), n && !a && e.apply(i, r)
        }
    }

    function ie(e, t, n) {
        return e instanceof Date && t instanceof Date && (n !== !1 ? new Date(e.getTime()).setHours(0, 0, 0, 0) - new Date(t.getTime()).setHours(0, 0, 0, 0) : e.getTime() - t.getTime())
    }

    function re(e) {
        e.preventDefault();
        var t = "keydown" === e.type,
            n = (e.type, e.type, e.target);
        if ("input" !== e.type && !t && (e.target.value || e.target.textContent).length >= 2 && (e.target.focus(), e.target.blur()), oe.amPM && e.target === oe.amPM) return e.target.textContent = ["AM", "PM"]["AM" === e.target.textContent | 0];
        var a = Number(n.min),
            i = Number(n.max),
            r = Number(n.step),
            o = parseInt(n.value, 10),
            l = e.delta || (t ? 38 === e.which ? 1 : -1 : Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY)) || 0),
            c = o + r * l;
        if (void 0 !== n.value && 2 === n.value.length) {
            var s = n === oe.hourElement,
                u = n === oe.minuteElement;
            c < a ? (c = i + c + !s + (s && !oe.amPM), u && d(null, -1, oe.hourElement)) : c > i && (c = n === oe.hourElement ? c - i - !oe.amPM : a, u && d(null, 1, oe.hourElement)), oe.amPM && s && (1 === r ? c + o === 23 : Math.abs(c - o) > r) && (oe.amPM.textContent = "PM" === oe.amPM.textContent ? "AM" : "PM"), n.value = oe.pad(c)
        }
    }
    var oe = this;
    return oe.changeMonth = b, oe.changeYear = T, oe.clear = M, oe.close = C, oe._createElement = ee, oe.destroy = y, oe.formatDate = x, oe.isEnabled = F, oe.jumpToDate = u, oe.open = N, oe.redraw = j, oe.set = P, oe.setDate = W, oe.toggle = V,
        function() {
            e._flatpickr && y(e._flatpickr), e._flatpickr = oe, oe.element = e, oe.instanceConfig = t || {}, oe.parseDate = Flatpickr.prototype.parseDate.bind(oe), B(), O(), _(), K(), U(), J(), oe.isOpen = oe.config.inline, oe.isMobile = !oe.config.disableMobile && !oe.config.inline && "single" === oe.config.mode && !oe.config.disable.length && !oe.config.enable.length && !oe.config.weekNumbers && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), oe.isMobile || p(), s(), (oe.selectedDates.length || oe.config.noCalendar) && (oe.config.enableTime && r(oe.config.noCalendar ? oe.config.minDate : null), G()), oe.config.weekNumbers && (oe.calendarContainer.style.width = oe.days.clientWidth + oe.weekWrapper.clientWidth + "px"), oe.showTimeInput = oe.selectedDates.length > 0 || oe.config.noCalendar, oe.isMobile || A(), Z("Ready")
        }(), oe
}

function _flatpickr(e, t) {
    for (var n = Array.prototype.slice.call(e), a = [], i = 0; i < n.length; i++) try {
        n[i]._flatpickr = new Flatpickr(n[i], t || {}), a.push(n[i]._flatpickr)
    } catch (e) {
        console.warn(e, e.stack)
    }
    return 1 === a.length ? a[0] : a
}

function flatpickr(e, t) {
    return _flatpickr(window.document.querySelectorAll(e), t)
}
var _extends = Object.assign || function(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a])
        }
        return e
    },
    _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    };
Flatpickr.defaultConfig = {
    mode: "single",
    position: "top",
    utc: !1,
    wrap: !1,
    weekNumbers: !1,
    allowInput: !1,
    clickOpens: !0,
    time_24hr: !1,
    enableTime: !1,
    noCalendar: !1,
    dateFormat: "Y-m-d",
    altInput: !1,
    altInputClass: "flatpickr-input form-control input",
    altFormat: "F j, Y",
    defaultDate: null,
    minDate: null,
    maxDate: null,
    parseDate: null,
    formatDate: null,
    getWeek: function(e) {
        var t = new Date(e.getTime());
        t.setHours(0, 0, 0, 0), t.setDate(t.getDate() + 3 - (t.getDay() + 6) % 7);
        var n = new Date(t.getFullYear(), 0, 4);
        return 1 + Math.round(((t.getTime() - n.getTime()) / 864e5 - 3 + (n.getDay() + 6) % 7) / 7)
    },
    enable: [],
    disable: [],
    shorthandCurrentMonth: !1,
    inline: !1,
    static: !1,
    appendTo: null,
    prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
    nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
    enableSeconds: !1,
    hourIncrement: 1,
    minuteIncrement: 5,
    defaultHour: 12,
    defaultMinute: 0,
    disableMobile: !1,
    locale: "default",
    plugins: [],
    onClose: [],
    onChange: [],
    onDayCreate: [],
    onMonthChange: [],
    onOpen: [],
    onParseConfig: [],
    onReady: [],
    onValueUpdate: [],
    onYearChange: [],
    onKeyDown: []
}, Flatpickr.l10ns = {
    en: {
        weekdays: {
            shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            longhand: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        },
        months: {
            shorthand: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            longhand: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        },
        daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        firstDayOfWeek: 0,
        ordinal: function(e) {
            var t = e % 100;
            if (t > 3 && t < 21) return "th";
            switch (t % 10) {
                case 1:
                    return "st";
                case 2:
                    return "nd";
                case 3:
                    return "rd";
                default:
                    return "th"
            }
        },
        rangeSeparator: " to ",
        weekAbbreviation: "Wk",
        scrollTitle: "Scroll to increment",
        toggleTitle: "Click to toggle"
    }
}, Flatpickr.l10ns.default = Object.create(Flatpickr.l10ns.en), Flatpickr.localize = function(e) {
    return _extends(Flatpickr.l10ns.default, e || {})
}, Flatpickr.setDefaults = function(e) {
    return _extends(Flatpickr.defaultConfig, e || {})
}, Flatpickr.prototype = {
    formats: {
        Z: function(e) {
            return e.toISOString()
        },
        D: function(e) {
            return this.l10n.weekdays.shorthand[this.formats.w(e)]
        },
        F: function(e) {
            return this.utils.monthToStr(this.formats.n(e) - 1, !1)
        },
        H: function(e) {
            return Flatpickr.prototype.pad(e.getHours())
        },
        J: function(e) {
            return e.getDate() + this.l10n.ordinal(e.getDate())
        },
        K: function(e) {
            return e.getHours() > 11 ? "PM" : "AM"
        },
        M: function(e) {
            return this.utils.monthToStr(e.getMonth(), !0)
        },
        S: function(e) {
            return Flatpickr.prototype.pad(e.getSeconds())
        },
        U: function(e) {
            return e.getTime() / 1e3
        },
        W: function(e) {
            return this.config.getWeek(e)
        },
        Y: function(e) {
            return e.getFullYear()
        },
        d: function(e) {
            return Flatpickr.prototype.pad(e.getDate())
        },
        h: function(e) {
            return e.getHours() % 12 ? e.getHours() % 12 : 12
        },
        i: function(e) {
            return Flatpickr.prototype.pad(e.getMinutes())
        },
        j: function(e) {
            return e.getDate()
        },
        l: function(e) {
            return this.l10n.weekdays.longhand[e.getDay()]
        },
        m: function(e) {
            return Flatpickr.prototype.pad(e.getMonth() + 1)
        },
        n: function(e) {
            return e.getMonth() + 1
        },
        s: function(e) {
            return e.getSeconds()
        },
        w: function(e) {
            return e.getDay()
        },
        y: function(e) {
            return String(e.getFullYear()).substring(2)
        }
    },
    revFormat: {
        D: function() {},
        F: function(e, t) {
            e.setMonth(this.l10n.months.longhand.indexOf(t))
        },
        H: function(e, t) {
            return e.setHours(parseFloat(t))
        },
        J: function(e, t) {
            return e.setDate(parseFloat(t))
        },
        K: function(e, t) {
            var n = e.getHours();
            12 !== n && e.setHours(n % 12 + 12 * /pm/i.test(t))
        },
        M: function(e, t) {
            e.setMonth(this.l10n.months.shorthand.indexOf(t))
        },
        S: function(e, t) {
            return e.setSeconds(t)
        },
        W: function() {},
        Y: function(e, t) {
            return e.setFullYear(t)
        },
        Z: function(e, t) {
            return new Date(t)
        },
        d: function(e, t) {
            return e.setDate(parseFloat(t))
        },
        h: function(e, t) {
            return e.setHours(parseFloat(t))
        },
        i: function(e, t) {
            return e.setMinutes(parseFloat(t))
        },
        j: function(e, t) {
            return e.setDate(parseFloat(t))
        },
        l: function() {},
        m: function(e, t) {
            return e.setMonth(parseFloat(t) - 1)
        },
        n: function(e, t) {
            return e.setMonth(parseFloat(t) - 1)
        },
        s: function(e, t) {
            return e.setSeconds(parseFloat(t))
        },
        w: function() {},
        y: function(e, t) {
            return e.setFullYear(2e3 + parseFloat(t))
        }
    },
    tokenRegex: {
        D: "(\\w+)",
        F: "(\\w+)",
        H: "(\\d\\d|\\d)",
        J: "(\\d\\d|\\d)\\w+",
        K: "(\\w+)",
        M: "(\\w+)",
        S: "(\\d\\d|\\d)",
        Y: "(\\d{4})",
        Z: "(.+)",
        d: "(\\d\\d|\\d)",
        h: "(\\d\\d|\\d)",
        i: "(\\d\\d|\\d)",
        j: "(\\d\\d|\\d)",
        l: "(\\w+)",
        m: "(\\d\\d|\\d)",
        n: "(\\d\\d|\\d)",
        s: "(\\d\\d|\\d)",
        w: "(\\d\\d|\\d)",
        y: "(\\d{2})"
    },
    pad: function(e) {
        return ("0" + e).slice(-2)
    },
    parseDate: function(e, t, n) {
        if (!e) return null;
        var a = e;
        if (e.toFixed) e = new Date(e);
        else if ("string" == typeof e) {
            var i = "string" == typeof n ? n : this.config.dateFormat;
            if ("today" === (e = e.trim())) e = new Date, t = !0;
            else if (this.config && this.config.parseDate) e = this.config.parseDate(e);
            else if (/Z$/.test(e) || /GMT$/.test(e)) e = new Date(e);
            else {
                for (var r = this.config.noCalendar ? new Date((new Date).setHours(0, 0, 0, 0)) : new Date((new Date).getFullYear(), 0, 1, 0, 0, 0, 0), o = !1, l = 0, c = 0, s = ""; l < i.length; l++) {
                    var u = i[l],
                        d = "\\" === u,
                        f = "\\" === i[l - 1] || d;
                    if (this.tokenRegex[u] && !f) {
                        s += this.tokenRegex[u];
                        var p = new RegExp(s).exec(e);
                        p && (o = !0) && this.revFormat[u](r, p[++c])
                    } else d || (s += ".")
                }
                e = o ? r : null
            }
        } else e instanceof Date && (e = new Date(e.getTime()));
        return e instanceof Date ? (this.config && this.config.utc && !e.fp_isUTC && (e = e.fp_toUTC()), t === !0 && e.setHours(0, 0, 0, 0), e) : (console.warn("flatpickr: invalid date " + a), console.info(this.element), null)
    }
}, "undefined" != typeof HTMLElement && (HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function(e) {
    return _flatpickr(this, e)
}, HTMLElement.prototype.flatpickr = function(e) {
    return _flatpickr([this], e)
}), "undefined" != typeof jQuery && (jQuery.fn.flatpickr = function(e) {
    return _flatpickr(this, e)
}), Date.prototype.fp_incr = function(e) {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate() + parseInt(e, 10))
}, Date.prototype.fp_isUTC = !1, Date.prototype.fp_toUTC = function() {
    var e = new Date(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds());
    return e.fp_isUTC = !0, e
}, !window.document.documentElement.classList && Object.defineProperty && "undefined" != typeof HTMLElement && Object.defineProperty(HTMLElement.prototype, "classList", {
    get: function() {
        function e(e) {
            return function(n) {
                var a = t.className.split(/\s+/);
                e(a, a.indexOf(n), n), t.className = a.join(" ")
            }
        }
        var t = this,
            n = {
                add: e(function(e, t, n) {
                    ~t || e.push(n)
                }),
                remove: e(function(e, t) {
                    ~t && e.splice(t, 1)
                }),
                toggle: e(function(e, t, n) {
                    ~t ? e.splice(t, 1) : e.push(n)
                }),
                contains: function(e) {
                    return !!~t.className.split(/\s+/).indexOf(e)
                },
                item: function(e) {
                    return t.className.split(/\s+/)[e] || null
                }
            };
        return Object.defineProperty(n, "length", {
            get: function() {
                return t.className.split(/\s+/).length
            }
        }), n
    }
}), "undefined" != typeof module && (module.exports = Flatpickr);