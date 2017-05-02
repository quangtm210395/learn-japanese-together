$(document).ready(function() {
  var feedbackTemplate = Handlebars.compile($("#feedback-template").html());

  $.ajaxSetup({headers: {"token": localStorage.getItem("token")}});

	$("#send-feedback").click(function() {
		$.post('/api/feedback/create',
      {
				title: $('#title').val(),
				content: $('#content').val(),
        user: localStorage.getItem("user")
			},
			function(data, status) {
        console.log(data);
				if (!data.status) {
					if (data.message.length) {
						toastr.error(data.message);
					} else {
						toastr.error('Feedback thất bại');
					}
				} else {
					toastr.success('Feedback thành công');
				}
			})
	});

	$("#get-feedback").click(function() {
		$.ajax({
			method: "get",
			url: "/api/feedback/getAll"
		}).then(function(data) {
			$('#all-feedback').html(feedbackTemplate(data));
		}).fail(function(err) {
			console.log(err);
		})
	});
})
