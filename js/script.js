/*
  Student Name: Samuel Reeder
  File Name: script.js
  Date: 11/12/2025
*/

$(document).ready(function () {

  setupResponsiveTravelMap();
  setupMapHotspotOverlays();
  setupContactForm();

});



// My Travels overlays

function setupMapHotspotOverlays() {
  // Setup hotspot areas with their location in the image
  var $hotspotAreas = $('area[data-overlay-id]');

  // Only activate hotspots on My Travels page
  if (!$hotspotAreas.length) {
    return;
  }

  // Prevent page from refreshing when clicking hotspot
  $hotspotAreas.on('click', function (event) {
    event.preventDefault();

    // Find overlay id for current state/country overlay
    var overlayId = $(this).data('overlay-id');

    // Hide any overlay that might already be open
    $('.state-overlay').addClass('hidden');

    // Show the darkened background and overlay for selected state/country
    $('#overlay-backdrop').removeClass('hidden');
    $('#' + overlayId).removeClass('hidden');
  });

  // Close overlay ONLY by clicking background outside of state-overlay or Close button
  $('.close-overlay-button, #overlay-backdrop').on('click', function (event) {
    if (
      event.target.id === 'overlay-backdrop' ||
      $(event.target).hasClass('close-overlay-button')
      ) {
        $('#overlay-backdrop, .state-overlay').addClass('hidden');
        }
  });
}



// Contact form

function setupContactForm() {
  var $contactForm = $('#contact-form');

  // Only use Contact form script on Contact page
  if (!$contactForm.length) {
    return;
  }

  $contactForm.on('submit', function (event) {
    event.preventDefault();

    var userName = $('#name').val().trim();
    var userEmail = $('#email').val().trim();
    var userMessage = $('#message').val().trim();

    if (!userName || !userEmail || !userMessage) {
      $('#form-status').text('Please fill in all fields.');
      return;
    }

    $('#form-status').text('Wonderful! Your message was sent to Samuel!');
    this.reset();
  });
}



// Responsive image map script

function setupResponsiveTravelMap() {
  // Select us-map.png as image map
  var travelMapImage = document.querySelector('img[usemap="#statemap"]');

  // Only run script on My Travels page
  if (!travelMapImage) {
    return;
  }

  var originalMapWidth = 959;
  var originalMapHeight = 593;

  // Select all hotspot areas on image map
  var hotspotAreas = document.querySelectorAll('map[name="statemap"] area');

  // Save the original coordinates and radius in new attributes
  for (var index = 0; index < hotspotAreas.length; index++) {
    var originalCoords = hotspotAreas[index].getAttribute('coords'); // e.g. "100,325,35"
    hotspotAreas[index].setAttribute('data-original-coords', originalCoords);
  }

  // Recalculates coordinates
  function recalculateHotspotCoordinates() {
    var currentMapWidth = travelMapImage.clientWidth;
    var currentMapHeight = travelMapImage.clientHeight;

    // Skips coord recalculations if image for image map is not visible yet
    if (!currentMapWidth || !currentMapHeight) {
      return;
    }

    var xScaleFactor = currentMapWidth / originalMapWidth;
    var yScaleFactor = currentMapHeight / originalMapHeight;
    var radiusScaleFactor = (xScaleFactor + yScaleFactor) / 2;

    // Update each hotspot circle's coords
    for (var j = 0; j < hotspotAreas.length; j++) {
      var startingCoords = hotspotAreas[j].getAttribute('data-original-coords');
      if (!startingCoords) {
        continue;
      }

      var coordParts = startingCoords.split(',');
      var originalX = parseFloat(coordParts[0]);
      var originalY = parseFloat(coordParts[1]);
      var originalRadius = parseFloat(coordParts[2]);

      // Scale coordinates
      var newXCoord = Math.round(originalX * xScaleFactor);
      var newYCoord = Math.round(originalY * yScaleFactor);
      var newRadius = Math.round(originalRadius * radiusScaleFactor);

      var newCoordsString = newXCoord + ',' + newYCoord + ',' + newRadius;
      hotspotAreas[j].setAttribute('coords', newCoordsString);
    }
  }

  // Recalculate coords only once the image has loaded
  if (travelMapImage.complete) {
    recalculateHotspotCoordinates();
  } else {
    travelMapImage.addEventListener('load', recalculateHotspotCoordinates);
  }

  // Run again if window is resized
  window.addEventListener('resize', recalculateHotspotCoordinates);
}
