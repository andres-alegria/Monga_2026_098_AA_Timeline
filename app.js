/* 2026_098 — "How the invasion escalated"
   Renders window.CONTENT (content.js) as a one-card-at-a-time horizontal timeline.
   No editorial strings live here.

   The card transition is GSAP Flip: measure every card, change the layout (the row's
   offset and which card is active, which also changes their scale and opacity), then
   let Flip.from animate each card from where it was to where it now is. That is the
   mechanic of the GSAP FLIP-carousel demo; the one thing it does not do here is loop,
   because a timeline has a first and a last event. */

(function () {
  "use strict";

  var C = window.CONTENT;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasFlip = typeof window.gsap !== "undefined" && typeof window.Flip !== "undefined";

  if (hasFlip) gsap.registerPlugin(Flip);

  /* Inside an article iframe the page drops its side padding so the graphic lines up
     with the story text. ?fill=1 is kept for parity with the other Mongabay embeds. */
  var embedded = window.self !== window.top ||
                 /(^|[?&])fill=1(&|$)/.test(window.location.search);
  if (embedded) document.body.classList.add("is-embedded");

  /* ---------------------------------------------------------------- icons */
  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6c0 .6.7 1 1.2.6l10.3-6.8a.7.7 0 0 0 0-1.2L9.2 4.6A.7.7 0 0 0 8 5.2z"/></svg>',
    muted: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4.8 6.6 8.3H3.4a.9.9 0 0 0-.9.9v5.6c0 .5.4.9.9.9h3.2l4.4 3.5a.7.7 0 0 0 1.1-.6V5.4a.7.7 0 0 0-1.1-.6zM21.3 9.6l-1.1-1.1-2 2-2-2-1.1 1.1 2 2-2 2 1.1 1.1 2-2 2 2 1.1-1.1-2-2z"/></svg>',
    sound: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4.8 6.6 8.3H3.4a.9.9 0 0 0-.9.9v5.6c0 .5.4.9.9.9h3.2l4.4 3.5a.7.7 0 0 0 1.1-.6V5.4a.7.7 0 0 0-1.1-.6zM15.6 8.2l-1.1 1.1a3.8 3.8 0 0 1 0 5.4l1.1 1.1a5.4 5.4 0 0 0 0-7.6zM17.9 5.9l-1.1 1.1a7 7 0 0 1 0 10l1.1 1.1a8.6 8.6 0 0 0 0-12.2z"/></svg>'
  };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function fill(str, map) {
    return str.replace(/\{(\w+)\}/g, function (m, k) { return map[k] != null ? map[k] : m; });
  }

  /* ----------------------------------------------------------- header ---- */
  document.getElementById("tl-title").textContent = C.title;
  document.getElementById("tl-deck").textContent = C.deck;
  document.getElementById("tl-source").textContent = C.source;
  document.title = C.title + " · Mongabay";

  /* ------------------------------------------------------------ blocks --- */
  function renderText(b) { return el("p", "b-text", b.html); }

  function renderQuote(b) {
    var fig = el("figure", "b-quote");
    var p = el("p", null, "“" + b.html + "”");
    if (b.attribution) p.appendChild(el("span", "attr", b.attribution));
    fig.appendChild(p);
    return fig;
  }

  function renderStat(b) {
    var d = el("div", "b-stat");
    d.appendChild(el("span", "v", b.value));
    d.appendChild(el("span", "l", b.label));
    return d;
  }

  function renderImage(b) {
    var fig = el("figure", "b-figure");
    var img = el("img");
    img.src = b.src;
    img.alt = b.alt || "";
    img.width = b.width;
    img.height = b.height;
    /* Three photos, 750 KB in all. Loading them up front costs little and avoids a
       blank frame when a card slides in; the videos are the heavy part and they
       still wait for a click. */
    img.decoding = "async";
    fig.appendChild(img);
    return fig;
  }

  /* Videos: click to play, muted by default, sound optional, English caption
     outside the frame. preload="none" means nothing downloads until a click. */
  function renderVideo(b) {
    var frame = el("div", "v-frame");

    var v = document.createElement("video");
    v.src = b.src;
    v.poster = b.poster;
    v.width = b.width;
    v.height = b.height;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.preload = "none";
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");
    if (b.alt) v.setAttribute("aria-label", b.alt);

    var surface = el("button", "v-surface");
    surface.type = "button";
    surface.setAttribute("aria-label", C.ui.pause);

    var play = el("button", "v-play", "<span>" + ICON.play + "</span>");
    play.type = "button";
    play.setAttribute("aria-label", C.ui.play);

    /* Sound is off until the reader asks for it. The button says which state the
       video is in now, so the label changes when it is pressed. */
    var sound = el("button", "v-sound");
    sound.type = "button";
    sound.setAttribute("aria-pressed", "false");
    sound.setAttribute("aria-label", C.ui.soundOn);
    sound.innerHTML = ICON.muted + "<span>" + C.ui.soundIsOff + "</span>";

    /* A slim line showing how far through the clip the reader is; click to seek.
       Hidden from screen readers: play/pause and sound are the real controls. */
    var bar = el("div", "v-bar");
    bar.setAttribute("aria-hidden", "true");
    var barFill = el("span", "v-bar-fill");
    bar.appendChild(barFill);

    function toggle() {
      if (v.paused || v.ended) {
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* autoplay policy: ignore */ });
      } else {
        v.pause();
      }
    }

    play.addEventListener("click", toggle);
    surface.addEventListener("click", toggle);

    v.addEventListener("play", function () { frame.classList.add("is-playing"); });
    v.addEventListener("pause", function () { frame.classList.remove("is-playing"); });
    v.addEventListener("ended", function () {
      frame.classList.remove("is-playing");
      barFill.style.width = "0%";
    });
    v.addEventListener("timeupdate", function () {
      if (!v.duration) return;
      barFill.style.width = (v.currentTime / v.duration) * 100 + "%";
    });

    bar.addEventListener("click", function (e) {
      if (!v.duration) return;
      var box = bar.getBoundingClientRect();
      v.currentTime = Math.max(0, Math.min(1, (e.clientX - box.left) / box.width)) * v.duration;
    });

    sound.addEventListener("click", function (e) {
      e.stopPropagation();
      v.muted = !v.muted;
      var on = !v.muted;
      sound.setAttribute("aria-pressed", on ? "true" : "false");
      sound.setAttribute("aria-label", on ? C.ui.soundOff : C.ui.soundOn);
      sound.innerHTML = (on ? ICON.sound : ICON.muted) +
        "<span>" + (on ? C.ui.soundIsOn : C.ui.soundIsOff) + "</span>";
    });

    frame.appendChild(v);
    frame.appendChild(surface);
    frame.appendChild(play);
    frame.appendChild(sound);
    frame.appendChild(bar);
    return frame;
  }

  /* The translated captions that belong with a video, kept outside its frame. */
  function renderVideoMeta(b) {
    var meta = el("div", "v-meta");

    if (b.overlays && b.overlays.length) {
      meta.appendChild(el("p", "v-label", C.ui.onScreen));
      var ul = el("ul", "v-overlays");
      b.overlays.forEach(function (o) {
        var li = el("li");
        li.appendChild(el("span", "en", "“" + o.en + "”"));
        li.appendChild(el("span", "pt", o.pt));
        ul.appendChild(li);
      });
      meta.appendChild(ul);
    }
    if (b.source) meta.appendChild(el("p", "v-source", b.source));
    if (b.note) meta.appendChild(el("p", "v-note", b.note));
    if (b.disclosure) {
      var d = el("details", "b-more");
      d.appendChild(el("summary", null, b.disclosure.summary));
      d.appendChild(el("p", null, b.disclosure.html));
      meta.appendChild(d);
    }
    return meta;
  }

  /* -------------------------------------------------------------- cards -- */
  var row = document.getElementById("row");
  var stage = document.getElementById("stage");
  var rail = document.getElementById("rail");
  var stepOut = document.getElementById("step");
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");

  prevBtn.setAttribute("aria-label", C.ui.prev);
  nextBtn.setAttribute("aria-label", C.ui.next);

  C.stops.forEach(function (s, i) {
    var card = el("article", "card");
    card.id = "stop-" + i;
    card.setAttribute("aria-label", s.date + " " + s.year + ": " + s.heading);

    card.appendChild(el("h2", "card-head", s.heading));

    var body = el("div", "card-body");
    var colText = el("div", "col-text");
    var colMedia = el("div", "col-media");
    var media = null;

    s.blocks.forEach(function (b) {
      if (b.type === "text") colText.appendChild(renderText(b));
      else if (b.type === "quote") colText.appendChild(renderQuote(b));
      else if (b.type === "stat") colText.appendChild(renderStat(b));
      else if (b.type === "image") {
        media = "photo";
        colMedia.appendChild(renderImage(b));
        if (b.caption) colMedia.appendChild(el("p", "b-caption", b.caption));
      } else if (b.type === "video") {
        media = "video";
        colMedia.appendChild(renderVideo(b));
        colText.appendChild(renderVideoMeta(b));
      }
    });

    if (media) {
      /* a video column is only as wide as the clip; a photo column takes a share */
      card.classList.add("has-media", "media-" + media);
      body.appendChild(colMedia);
      body.appendChild(colText);
    } else {
      body.appendChild(colText);
    }

    card.appendChild(body);
    row.appendChild(card);
  });

  var cards = Array.prototype.slice.call(row.children);
  var n = cards.length;
  var active = 0;
  var flipTween = null;

  /* --------------------------------------------------------------- rail -- */
  var ticks = C.stops.map(function (s, i) {
    var t = el("button", "tick");
    t.type = "button";
    t.setAttribute("aria-label", fill(C.ui.jumpTo, { date: s.date + " " + s.year, heading: s.heading }));
    t.setAttribute("aria-controls", "stop-" + i);
    /* the date is printed once per day: the second beat on a day is a bare tick */
    if (i === 0 || C.stops[i - 1].date !== s.date) {
      t.appendChild(el("span", "d", s.date));
    }
    t.appendChild(el("span", "dot"));
    t.addEventListener("click", function () { go(i); });
    rail.appendChild(t);
    return t;
  });

  /* ------------------------------------------------------------- layout -- */
  /* The row is offset so the active card sits in the middle of the stage; the
     neighbours show through the stage's padding. */
  function metrics() {
    var cs = getComputedStyle(document.documentElement);
    var peek = parseFloat(cs.getPropertyValue("--peek")) || 0;
    var gap = parseFloat(cs.getPropertyValue("--gap")) || 0;
    var w = stage.clientWidth - 2 * (peek + gap);
    /* the row starts at the stage's content box, so shift it until the active card
       is centred in the stage — otherwise the two peeks come out different widths */
    var centre = (stage.clientWidth - w) / 2 - peek;
    return { w: w, gap: gap, centre: centre };
  }

  function applyLayout() {
    var m = metrics();
    row.style.setProperty("--card-w", m.w + "px");

    /* The stage is as tall as the heaviest card, so the frame never changes height
       as the reader moves along. offsetHeight ignores the neighbours' scale. */
    stage.style.removeProperty("--stage-h");
    var tallest = 0;
    cards.forEach(function (c) { if (c.offsetHeight > tallest) tallest = c.offsetHeight; });
    stage.style.setProperty("--stage-h", tallest + "px");

    /* The row is offset with a layout property, not a transform. Flip measures real
       layout changes; an ancestor's transform is invisible to it, and asking it to
       animate one leaves the inverted transform stuck on every card. */
    row.style.marginLeft = (m.centre - active * (m.w + m.gap)) + "px";

    cards.forEach(function (c, i) { c.classList.toggle("is-active", i === active); });
    ticks.forEach(function (t, i) {
      if (i === active) t.setAttribute("aria-current", "step");
      else t.removeAttribute("aria-current");
      t.classList.toggle("is-done", i < active);
      /* keep the day's label lit while any of its beats is active */
      t.classList.toggle("is-day-active", C.stops[i].date === C.stops[active].date);
    });

    prevBtn.disabled = active === 0;
    nextBtn.disabled = active === n - 1;
    stepOut.textContent = fill(C.ui.stepOf, { i: active + 1, n: n });
  }

  function go(i) {
    i = Math.max(0, Math.min(n - 1, i));
    if (i === active) return;

    /* a video from the card being left behind should not keep playing */
    pauseAll();

    if (!hasFlip || reduced) {
      active = i;
      applyLayout();
      return;
    }

    var state = Flip.getState(cards, { props: "opacity" });
    active = i;
    applyLayout();
    /* finish any move still running rather than killing it, so its cards are handed
       back to the stylesheet instead of keeping Flip's inverted transform */
    if (flipTween && flipTween.isActive()) flipTween.progress(1);
    flipTween = Flip.from(state, {
      duration: 0.62,          /* adjust the slide speed here */
      ease: "power2.inOut",
      scale: true,
      props: "opacity",
      /* hand the cards back to the stylesheet once the move is over, so nothing
         Flip wrote inline can accumulate across moves */
      onComplete: function () {
        gsap.set(cards, { clearProps: "transform,opacity" });
      }
    });
  }

  function pauseAll() {
    videos.forEach(function (v) { if (!v.paused) v.pause(); });
  }

  /* ---------------------------------------------------------- behaviour -- */
  var videos = Array.prototype.slice.call(row.querySelectorAll("video"));

  /* only one video plays at a time */
  videos.forEach(function (v) {
    v.addEventListener("play", function () {
      videos.forEach(function (o) { if (o !== v && !o.paused) o.pause(); });
    });
  });

  prevBtn.addEventListener("click", function () { go(active - 1); });
  nextBtn.addEventListener("click", function () { go(active + 1); });

  /* arrow keys, once the reader is inside the graphic */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    if (!document.getElementById("tl").contains(document.activeElement)) return;
    e.preventDefault();
    go(active + (e.key === "ArrowRight" ? 1 : -1));
  });

  /* Swipe. The only things a drag must not hijack are the ones where a sideways
     drag means something else: the video's scrub bar, a disclosure and a link.
     Buttons are deliberately NOT excluded — a tap on play or sound still works,
     because a click needs press and release on the same element, while a drag
     never fires one. Excluding the whole .v-frame killed every swipe that began
     on the clip, which on a phone is most of the card on the two video steps. */
  if (typeof window.Observer !== "undefined") {
    gsap.registerPlugin(Observer);
    Observer.create({
      target: stage,
      type: "touch,pointer",
      dragMinimum: 12,         /* adjust how far a swipe must travel here */
      tolerance: 12,
      lockAxis: true,          /* a mostly-vertical drag still scrolls the page */
      onPress: function (self) {
        var t = self.event && self.event.target;
        self.__skip = !!(t && t.closest && t.closest(".v-bar, summary, a"));
        self.__done = false;   /* one step per gesture, however many events fire */
      },
      onLeft: function (self) {
        if (self.__skip || self.__done) return;
        self.__done = true;
        go(active + 1);
      },
      onRight: function (self) {
        if (self.__skip || self.__done) return;
        self.__done = true;
        go(active - 1);
      }
    });
  }

  /* A hidden tab stops requestAnimationFrame, which freezes a Flip tween part-way
     and leaves its inverted transforms on the cards. Finish the move on the way out
     so the reader comes back to a settled carousel, and re-measure on the way in. */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      if (flipTween && flipTween.isActive()) flipTween.progress(1);
    } else {
      applyLayout();
    }
  });

  /* a resize changes the card width, so re-lay out without animating */
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(applyLayout, 120);
  });

  /* ?step=3 opens on a given card, so a story can link straight to one moment */
  var startAt = parseInt((/(^|[?&])step=(\d+)/.exec(window.location.search) || [])[2], 10);
  if (startAt >= 1 && startAt <= n) active = startAt - 1;

  /* fonts change the card heights, so settle the layout once they land */
  applyLayout();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(applyLayout);
  }
  window.addEventListener("load", applyLayout);
})();
