function switchStyle(styleName) {
    var styleLink = document.getElementById("style-link");
    var lastStyleSheet = styleLink.getAttribute("href");
    if (lastStyleSheet != styleName) {
      styleLink.setAttribute("href", styleName);
    }
  }