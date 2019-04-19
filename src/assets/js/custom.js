﻿jQuery(function ($) {
  $(document).on('click', '.sidebar-dropdown > a', function () {
    $(".sidebar-submenu").slideUp(200);
    if ($(this).parent().hasClass("active")) {
      $(".sidebar-dropdown").removeClass("active");
      $(this).parent().removeClass("active");
     
    } else {
      $(".sidebar-dropdown").removeClass("active");
      $(this).next(".sidebar-submenu").slideDown(200);
      $(this).parent().addClass("active");
    }
  });

  $("#close-sidebar").click(function () {
    $(".page-wrapper").removeClass("toggled");
  });
  $("#show-sidebar").click(function () {
    $(".page-wrapper").addClass("toggled");
  });
});

$(function () {
  $('.dropdown-menu a').click(function () {
    $(this).closest('.dropdown').find('input.countrycode')
      .val('(' + $(this).attr('data-value') + ')');
  });
});

$(document).ready(function () {
  $("#fixTable").tableHeadFixer({ 'foot': true, 'head': true });
});


