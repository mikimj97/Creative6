$(document).ready(function() {
    $("#postComment").click(function(event) {
        event.preventDefault();
        var myobj = { Name: $("#name").val(), Comment: $("#comment").val() };
        jobj = JSON.stringify(myobj);
        // $("#json").text(jobj);

        var url = "comment";
        $.ajax({
            url: url,
            type: "POST",
            data: jobj,
            contentType: "application/json; charset=utf-8",
            success: function(data, textStatus) {
                $("#done").html("Comment Posted!");
                $("#comments").html("");
            }
        })
    });

    $("#getComments").click(function() {
        $("#done").html("All Comments Being Shown!");
        $.getJSON('comment', function(data) {
            console.log(data);
            var everything = "<ul class=\"list-group\">";
            for (var comment in data) {
                com = data[comment];
                everything += "<li class=\"list-group-item\">" + com.Comment +" -" + com.Name + "</li>";
            }
            everything += "</ul>";
            $("#comments").html(everything);
        })
    })

    $("#deleteComments").click(function() {
        $("#done").html("All Comments have been deleted!");
        $("#comments").html("");
        $.ajax({
            url: "comment",
            type: "DELETE",
            contentType: "application/json; charset=utf-8"
        })
    })
});
