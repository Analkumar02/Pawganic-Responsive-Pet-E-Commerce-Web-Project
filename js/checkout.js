$(function () {
  $("#checkout-form").on("submit", function (e) {
    var valid = true;
    var $form = $(this);
    var $email = $form.find('input[type="email"]');
    var $pincode = $form.find('input[placeholder*="Pincode"]');
    var $requiredFields = $form.find("input[required], select[required]");
    var errorMsg = "";

    // Remove previous error highlights
    $form.find(".is-invalid").removeClass("is-invalid");

    // Check required fields
    $requiredFields.each(function () {
      if (!$(this).val().trim()) {
        $(this).addClass("is-invalid");
        valid = false;
      }
    });

    // Email format
    if ($email.length && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($email.val())) {
      $email.addClass("is-invalid");
      errorMsg += "Please enter a valid email address.\n";
      valid = false;
    }

    // Pincode/Zipcode numeric check
    if ($pincode.length && !/^\d{4,10}$/.test($pincode.val())) {
      $pincode.addClass("is-invalid");
      errorMsg += "Please enter a valid pincode/zipcode.\n";
      valid = false;
    }

    if (!valid) {
      e.preventDefault();
      if (errorMsg) {
        alert(errorMsg);
      }
    }
  });
});
