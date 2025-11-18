/*
  Student Name: Samuel Reeder
  File Name: script.js
  Date: 11/17/2025
  Description: Responsive image map, overlays, and contact form
*/

$(document).ready(function () {

  // Make the image map responsive for the My Travels page
  setupResponsiveMap();

  // Create map overlays
  $('area[data-state-target]').on('click', function (e) {
    e.preventDefault();

    var target = $(this).data('state-target');

    // Hide any open overlays
    $('.state-overlay').addClass('hidden');

    // Show background and the selected overlay
    $('#overlay-backdrop').removeClass('hidden');
    $('#' + target).removeClass('hidden');
  });

  // Close map overlay when clicking the background or the Close button
  $('.close-overlay, #overlay-backdrop').on('click', function () {
    $('#overlay-backdrop, .state-overlay').addClass('hidden');
  });

  // CONTACT FORM
  $('#contact-form').on('submit', function (e) {
    e.preventDefault();

    var name = $('#name').val().trim();
    var email = $('#email').val().trim();
    var message = $('#message').val().trim();

    if (!name || !email || !message) {
      $('#form-status').text('Please fill in all fields.');
      return;
    }

    $('#form-status').text('Thanks! Your message was sent to Samuel!');
    this.reset();
  });
});

/*
  Make the image map responsive for circle hotspots.

  We know:
  - The original image size: 959 x 593
  - Each <area> uses "circle" coords: x, y, r

  We:
  - Save the original coords once.
  - On resize, scale x and y to the new width/height.
  - Scale radius using the average scale.
*/
function setupResponsiveMap() {
  // Find the map image on the page
  var mapImage = document.querySelector('img[usemap="#statemap"]');
  if (!mapImage) {
    // Not on the My Travels page, so nothing to do
    return;
  }

  // Original size of the image in pixels
  var originalWidth = 959;
  var originalHeight = 593;

  // Get all the <area> elements for this map
  var areas = document.querySelectorAll('map[name="statemap"] area');

  // Save the original coords from the HTML into a data attribute
  var i;
  for (i = 0; i < areas.length; i++) {
    var coords = areas[i].getAttribute('coords'); // e.g. "100,325,35"
    areas[i].setAttribute('data-orig-coords', coords);
  }

  // This function recalculates coords based on the current image size
  function resizeMap() {
    var currentWidth = mapImage.clientWidth;
    var currentHeight = mapImage.clientHeight;

    // If the image is not visible yet, skip
    if (!currentWidth || !currentHeight) {
      return;
    }

    // How much the image has been scaled in each direction
    var xScale = currentWidth / originalWidth;
    var yScale = currentHeight / originalHeight;
    var radiusScale = (xScale + yScale) / 2; // average for radius

    // Update each area's coords
    for (var j = 0; j < areas.length; j++) {
      var original = areas[j].getAttribute('data-orig-coords');
      if (!original) {
        continue;
      }

      var parts = original.split(','); // ["100","325","35"]
      var originalX = parseFloat(parts[0]);
      var originalY = parseFloat(parts[1]);
      var originalRadius = parseFloat(parts[2]);

      var newX = Math.round(originalX * xScale);
      var newY = Math.round(originalY * yScale);
      var newRadius = Math.round(originalRadius * radiusScale);

      var newCoords = newX + ',' + newY + ',' + newRadius;
      areas[j].setAttribute('coords', newCoords);
    }
  }

  // Run once when the image has loaded
  if (mapImage.complete) {
    resizeMap();
  } else {
    mapImage.addEventListener('load', resizeMap);
  }

  // Run again on window resize (e.g., when rotating phone)
  window.addEventListener('resize', resizeMap);
}
