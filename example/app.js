$(function() {
    var textarea = $("textarea");

    $(".content").hide();
    $(".settings").submit(function(e) {
        e.preventDefault();
        var rows = parseInt(e.currentTarget.rows.value, 10);
        if (rows <= 0) {
            $(".error").text("Minimum rows must be an integer >= 1");
            return;
        }
        var padding = e.currentTarget.padding.value;

        $(e.currentTarget).hide();
        $(".content").show();

        textarea.yaar({
            minRows: rows,
            textPadding: padding
        });
    });

    $(".width-form").submit(function(e) {
        e.preventDefault();
        textarea.parent().css("width", $("#width").val());
        textarea.yaar();
    });
});
