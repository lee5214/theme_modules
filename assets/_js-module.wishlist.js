define(['jquery'], function($) {

  console.log('Module Whishlist is loading');

  // Initialization of wishlist
  function initAddToWishlist(wishlistContainer) {
    var $wishlistContainer = $(wishlistContainer);

    if ($wishlistContainer.length === 0) {
      return 0;
    }

    $wishlistContainer.find('#add-to-wish-list').submit(function(e) {
      e.preventDefault();
      var postData = $(this).serializeArray();
      var formURL = $(this).attr("action");
      $.ajax({
        url: formURL,
        type: "POST",
        data: postData,
        success: function(data, textStatus) {
          $wishlistContainer.empty().html('<p>This product is in your <a class="text-link--default" href="/pages/wish-list">wishlist</a></p>');
          // $wishlistContainer.empty().html('<p>{{ layout.wishlist_page.error_state | t }}</p>');
        },
        error: function() {
          $(this).append("<p>I'm afraid that didn't work.</p>");
        }
      });
    });
  }

  // Action for wishlist
  function initActionsWishlist(wishlistContainer) {
    var $wishlistContainer = $(wishlistContainer);

    if ($wishlistContainer.length === 0) {
      return 0;
    }

    var $removeButton = $wishlistContainer.find('.js-remove-button');
    var $addToCartButton = $wishlistContainer.find('.js-add-to-cart');
    var $removeForm = $wishlistContainer.find('#remove');
    var $addToCartForm = $wishlistContainer.find('#add-product');

    $addToCartButton.on('click', function(e) {
      e.preventDefault();
      variantID = $(this).attr("data-id");
      $addToCartForm.find('#product-select').attr("value", variantID);
      $addToCartForm.submit();
    });

    $removeButton.on('click', function(e) {
      e.preventDefault();
      _removeFromWishlist($(this), $removeForm);
    });
  }

  // Remove item fron wishlist
  function _removeFromWishlist($removeBtn, $removeForm) {
    var $elem = $removeBtn.closest("tr");
    var tagID = $elem.attr("id");

    $removeForm.find('#remove-value').attr("value", tagID);
    var postData = $removeForm.serializeArray();
    var formURL = $removeForm.attr("action");
    $.ajax({
      url: formURL,
      type: "POST",
      data: postData,
      success: function(data, textStatus) {
        // the message when product successfully added to cart
        var $parentMsg = $elem.closest('.js-wishlist');
        var $message = $parentMsg.find('.remove-message');
        var $table = $parentMsg.find('.table-wrapper');

        if ($message.length > 0 && $message.hasClass('hide-message')) {
          $message.removeClass('hide-message hide').addClass('show-message');
        } else {
          $message = $('<p/>').addClass('remove-message show-message').html(' This product has deleted from your wishlist.');
          $table.before($message);
        }

        // delete item
        $elem.remove();

        setTimeout(function() {
          $message.addClass('hide-message').removeClass('show-message');
          $message.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function addClasses() {
            $message.addClass('hide');
            $message.off('webkitAnimationEnd oanimationend msAnimationEnd animationend', addClasses);
          });
        }, 5000);

        if ($(".wishlist__item").length == 0) {
          $removeForm.prev('.table-wrapper').hide();
          $removeForm.nextAll('.wishlist-empty').show();
        }
      },
      error: function() {
        $(this).append("<p>Sorry, something went wrong. Please, try one more time</p>");
        // $(this).append("<p>{{ layout.wishlist_page.error_state | t }}</p>");
      }
    });
  }

  return {
    initAddToWishlist: initAddToWishlist,
    initActionsWishlist: initActionsWishlist
  }
});
