define(['jquery', 'scrollbar', 'jquery.currencies'], function($, scrollbar, Currency) {

  console.log('Module Dropdowns is loaded');

  // Make currency dropdown in the header
  function initCurrencyDropdown(select) {
    var $select = $(select);

    if ($select.length === 0) {
      return 0;
    }

    $select.hide();

    var $dropdownContainer = $('<div/>').addClass('dropdown').click(function(e) {
      _dropdownEventsListener(e);
    });

    var $dropdownButton = $('<button/>').addClass('dropdown__button').appendTo($dropdownContainer);
    $('<span/>').addClass('icon').appendTo($dropdownContainer);

    var $dropdownList = $('<ul/>').addClass('dropdown-list');

    for (var i = 0, max = $select[0].length; i < max; i++) {

      if (Currency.currentCurrency !== '' && i === 0) {
        $dropdownButton.text(Currency.currentCurrency);
      } else if (i === 0) {
        $dropdownButton.text($select[0][i].textContent);
      };

      $('<li/>').addClass('dropdown-list__item').text($select[0][i].textContent).attr('data-value', $select[0][i].value).appendTo($dropdownList);
    }

    $dropdownList.appendTo($dropdownContainer);
    $dropdownContainer.insertAfter($select);
  }

  // Make dropdown for select without scroll
  function initDropdown(selects) {
    var $selects = $(selects);

    if ($selects.length === 0) {
      return 0;
    }

    var link = location.href;

    for (var i = 0, max = $selects.length; i < max; i++) {

      var $dropdownContainer = $('<div/>').addClass('dropdown').click(function(e) {
        _dropdownEventsListener(e);
      });

      var $dropdownButton = $('<button/>').addClass('dropdown__button').appendTo($dropdownContainer);
      $('<span/>').addClass('icon').appendTo($dropdownContainer);

      var $dropdownList = $('<ul/>').addClass('dropdown-list');

      for (var j = 0, maxj = $selects[i].length; j < maxj; j++) {

        if (link.indexOf($selects[i][j].value) != -1) {
          $dropdownButton.text($selects[i][j].textContent);
        } else if (j === 0) {
          $dropdownButton.text($selects[i][j].textContent);
          continue;
        };

        $('<li/>').addClass('dropdown-list__item').text($selects[i][j].textContent).attr('data-value', $selects[i][j].value).appendTo($dropdownList);
      }

      $dropdownList.appendTo($dropdownContainer);
      $dropdownContainer.insertAfter($($selects[i]));
      $($selects[i]).hide();
    }
  }

  // Make dropdown for select with scroll
  function initDropdownScroll(selects) {
    var $selects = $(selects);

    if ($selects.length === 0) {
      return 0;
    }

    var dropdownListScroll = [];

    for (var i = 0, max = $selects.length; i < max; i++) {

      var $dropdown = $('<div/>').addClass('dropdown dropdown--scroll').click(function(e) {
        _dropdownEventsListener(e);
      });

      var $dropdownButton = $('<button/>').addClass('dropdown__button').appendTo($dropdown);
      $('<span/>').addClass('icon').appendTo($dropdown);

      var $dropdownList = $('<ul/>').addClass('dropdown-list');

      for (var j = 0, maxj = $selects[i].length; j < maxj; j++) {

        if (j === 0) {

          if ($selects[i].getAttribute('data-default') != '') {
            $dropdownButton.text($selects[i].getAttribute('data-default'));
          } else {
            $dropdownButton.text($selects[i][j].textContent);
          }
          
          $($selects[i][j]).addClass('active');
        };

        $('<li/>').addClass('dropdown-list__item').text($selects[i][j].textContent).attr('data-value', $selects[i][j].value).appendTo($dropdownList);
      }

      var $dropdownListWrapperForIcons = $('<div/>').addClass('dropdown-list-container');
      var $dropdownListWrapper = $('<div/>').addClass('dropdown-list-wrapper');

      $dropdownList.appendTo($dropdownListWrapper);

      $dropdownListWrapper.appendTo($dropdownListWrapperForIcons);
      $dropdownListWrapperForIcons.appendTo($dropdown);
      $dropdown.insertAfter($($selects[i]));
      $($selects[i]).hide();

      // Init scroll
      for (var k = 0, maxk = $dropdownListWrapper.length; k < maxk; k++) {
        dropdownListScroll[k] = scrollbar.createScrollbar($dropdownListWrapper[k], {
          touchScrollSpeed: 1,
          preventDefaultScroll: true,
          customThumbHeight: 30
        });
      }
    }
  }

  // Make dropdown for province selector after changing country selector
  function initDropdownAfterChanageSelector(select, selectForChange) {
    var $select = $(select);

    if ($select.length === 0) {
      return 0;
    }

    var $selectForNewDropdown;
    var $this = this;

    $select.change(function(e) {
      $selectForNewDropdown = $(e.target).closest('.form').find(selectForChange);
      $selectForNewDropdown.next('.dropdown').remove();
      setTimeout(function() {
        initDropdownScroll(selectForChange);
      }, 100)

    })
  }


  // Event listeners for dropdowns (open dropdown, select dropdown item)
  function _dropdownEventsListener(e) {
    e.preventDefault();

    var $target = $(e.target);
    var $parentDropdown = $target.closest('.dropdown');
    var $buttonDropdown = $parentDropdown.find('button.dropdown__button');
    var $currentSelect;
    var $currencyButtons, $currencyWrapers;
    var mobileMenuDrawer;
    var currentOpen = false;
    if ($parentDropdown.hasClass('open')) {
      currentOpen = true;
    }

    // Open dropdown
    if ($target.hasClass('dropdown__button') || $target.hasClass('icon')) {
      $target.closest('.collection__filters').find('.dropdown.open').removeClass('open');
      $target.closest('.shipping-calculator__container').find('.dropdown.open').removeClass('open');

      if (currentOpen) {
        $parentDropdown.removeClass('open');
      } else {
        $parentDropdown.addClass('open');
      }

      if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("resize", false, true);
        window.dispatchEvent(evt);
      } else {
        window.fireEvent("onresize");
      }
    }

    // Click on dropdown items
    if ($target.hasClass('dropdown-list__item')) {
      $currentSelect = $parentDropdown.prev('[class*="js-dropdown"]');
      $currentSelect.val($target.attr('data-value'));

      if ("createEvent" in document) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        $currentSelect[0].dispatchEvent(evt);
      } else {
        $currentSelect[0].fireEvent("onchange");
      }

      $currencyWrapers = $('.search-container .currency-picker__wrapper');

      if ($currencyWrapers.length > 0 && $target.closest('.nav-list__item--currency').length > 0) {
        $currencyButtons = $currencyWrapers.find('.dropdown__button');
        $currencyButtons.text($target.text());
      }

      $buttonDropdown.text($target.text());

      $parentDropdown.find('.active').removeClass('active');
      $target.addClass('active');
      $parentDropdown.removeClass('open');

      mobileMenuDrawer = $('.drawer--menu.open');
      if (mobileMenuDrawer.length > 0) {
        mobileMenuDrawer.find('.drawer__btn-close').trigger('click');
      }
    }
  }



  return {
    initCurrencyDropdown: initCurrencyDropdown,
    initDropdown: initDropdown,
    initDropdownScroll: initDropdownScroll,
    initDropdownAfterChanageSelector: initDropdownAfterChanageSelector
  }
});
