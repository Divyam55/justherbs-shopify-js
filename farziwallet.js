$(document).on(`page:load page:change`, function () {
    var flag_wallet_applied = false
    if($(".tags-list .tag:last-child").length > 0) {
        $(".tags-list .tag:last-child").each(function () {
            console.log("taglist-check")
            var tag_text = $(this).find(".tag__wrapper .reduction-code span:first").text()
            var tag_new_text = "Wallet Applied"
            if (tag_text.startsWith("••••")) {
                $(this).find(".tag__wrapper .reduction-code span:first").text(tag_new_text)
                flag_wallet_applied = true 
            }
            if (tag_text.startsWith("Wallet Applied")) {
                $(".farziwallet-div").hide()
                flag_wallet_applied = true
            }
            var line_text = $(".total-line.total-line--reduction:last-child span:first").text()
            if (line_text.startsWith("Gift card")) {
                $(".total-line.total-line--reduction:last-child span:first").text("Wallet")
                $(".total-line.total-line--reduction:last-child span.reduction-code").remove()
            }
        })
    }
    if ($(".farziwallet-div").length == 0 && flag_wallet_applied == false) {
        var settings = {
            "url": "https://farzipromo-api-stage.farziengineer.co/walletbalance",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json"
            },
            "data": `{
      "customer_id": "5497891160223"
    }`,
        };

        $.ajax(settings).done(function (response) {
            var wallet_div = `<div class="farziwallet-div">
  <input type="checkbox" name="farziwallet" value="yes" id="farziwallet" style="-webkit-appearance: checkbox;">
  <label for="farziwallet">Use Wallet Balance - ` + response.wallet_balance + ` </label><br>
  </div>`
            console.log("wallet_div")
            $(wallet_div).insertBefore($('.section.section--payment-method'))
            $('input[type=checkbox][name=farziwallet]').click(function () {
                if (this.checked && response.wallet_balance > 0) {
                    $("#checkout_reduction_code_mobile").css("color", "#ffffff")
                    console.log($("#checkout_reduction_code_mobile").css("color"))
                    $("#checkout_reduction_code_mobile")[0].value = response.gc;
                    $("#checkout_reduction_code_mobile").parent().next().removeAttr("disabled").click();
                    $("#checkout_reduction_code_mobile").removeAttr("style")
                    var tag_list_interval = setInterval(() => {
                        if ($(".tags-list .tag:last-child").length > 0) {
                            $(".tags-list .tag:last-child").each(function () {
                                console.log("taglist")
                                var tag_text = $(this).find(".tag__wrapper .reduction-code span:first").text()
                                var tag_new_text = "Wallet Applied"
                                if (tag_text.startsWith("••••")) {
                                    $(this).find(".tag__wrapper .reduction-code span:first").text(tag_new_text)
                                    // clearInterval(tag_list_interval)
                                }
                                if (tag_text.startsWith("Wallet Applied")) {
                                    $(".farziwallet-div").hide()
                                }
                                var line_text = $(".total-line.total-line--reduction:last-child span:first").text()
                                if (line_text.startsWith("Gift card")) {
                                    $(".total-line.total-line--reduction:last-child span:first").text("Wallet")
                                    $(".total-line.total-line--reduction:last-child span.reduction-code").remove()
                                }
                            })
                        }
                    }, 100);

                }
            });
            ;
        }).fail(function (xhr, status, error) {
            console.log(xhr.responseText)
        });
    }
});
