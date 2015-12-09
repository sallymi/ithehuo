/**
 * Create a bootstrap alert html snippet
 *
 * @function
 * @private
 * @param {String} type - alert type, valid values are success and danger
 * @param {String} message - alert content message
 * @return {String} the alert html snippet
 *
 */
function _fnCreateAlert(type, message) {
  return '<div class="alert alert-' + type + ' alert-dismissible fade in" role="alert" style="text-align:center">' +
          '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
          '</button>' +
          message +
         '</div>';
}

/**
 * Global notification util object,
 * provide notification for success and failed action
 *
 */
var globalNotify = {
  success: function (message) {
    $('#global_notify_ctn').html(_fnCreateAlert('success', message));
    setTimeout(function () {
      $('#global_notify_ctn .alert').alert('close');
    }, 2000);
  },
  failed: function (message) {
    $('#global_notify_ctn').html(_fnCreateAlert('danger', message));
    setTimeout(function () {
      $('#global_notify_ctn .alert').alert('close');
    }, 2000);
  }
};

var messageNotify = {
  success: function (message) {
    $('#notification-container').html(_fnCreateAlert('success', message));
    // setTimeout(function () {
    //   $('#notification-container .alert').alert('close');
    // }, 2000);
  },
  failed: function (message) {
    $('#notification-container').html(_fnCreateAlert('danger', message));
    setTimeout(function () {
      $('#notification-container .alert').alert('close');
    }, 2000);
  }
};

var socket = io.connect('http://119.81.189.152');