$(function () {
  var toc = $("<ul>").css("margin-bottom", "20px !important")
  $("div.sidebar").prepend(toc).prepend($("<h3>").text("Table of Contents"))
  $("div.main div.wikistyle h2").each(function() {
    var id = $(this).text().replace(/\s+/g, "_").replace(/[^0-9a-zA-Z_.-]/g, "")
    $(this).attr("id", id)
    toc.append(
      $("<li>").append($("<b>").append($("<a>").attr("href", "#" + id).text($(this).text())))
    )
  })
})
