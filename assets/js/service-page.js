(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("s");
  var data = window.SERVICE_DATA && window.SERVICE_DATA[slug];

  var root = document.getElementById("service-detail-root");
  var notFound = document.getElementById("service-not-found");

  if (!slug || !data) {
    if (root) root.setAttribute("hidden", "hidden");
    if (notFound) notFound.removeAttribute("hidden");
    document.title = "Service not found | Batoor AlWatan Technical Services LLC";
    return;
  }

  document.title = data.title + " | Batoor AlWatan Technical Services LLC";

  var meta = document.querySelector('meta[name="description"]');
  if (meta && data.intro) {
    var d = data.intro.length > 158 ? data.intro.slice(0, 155).trim() + "…" : data.intro;
    meta.setAttribute("content", d);
  }

  var titleEl = document.getElementById("service-title");
  if (titleEl) titleEl.textContent = data.title;

  var introEl = document.getElementById("service-intro");
  if (introEl) introEl.textContent = data.intro;

  var ul = document.getElementById("service-bullets");
  if (ul && data.bullets) {
    ul.innerHTML = "";
    data.bullets.forEach(function (b) {
      var li = document.createElement("li");
      li.textContent = b;
      ul.appendChild(li);
    });
  }

  var gallery = document.getElementById("service-gallery");
  if (gallery && data.images) {
    gallery.innerHTML = "";
    data.images.forEach(function (img, i) {
      var figure = document.createElement("figure");
      figure.className = "service-gallery__item";
      var image = document.createElement("img");
      image.src = img.src;
      image.alt = img.alt;
      image.width = 960;
      image.height = 640;
      image.loading = i === 0 ? "eager" : "lazy";
      image.decoding = "async";
      figure.appendChild(image);
      gallery.appendChild(figure);
    });
  }

  var googleWrap = document.getElementById("service-google-wrap");
  var googleLink = document.getElementById("service-google-images");
  if (googleLink && data.googleQuery) {
    googleLink.href = "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(data.googleQuery);
    if (googleWrap) googleWrap.removeAttribute("hidden");
  }
})();
