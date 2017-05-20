$(document).ready(function() {
  var feedbackTemplate = Handlebars.compile($("#feedback-template").html());

	$("#send-feedback").click(function() {
		$.post('/api/feedback/create',
      {
				title: $('#feedback-title').val(),
				content: $('#feedback-content').val()
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
          $('#feedback-title').val("");
          $('#feedback-content').val("");
				}
			})
	});

	$("#get-feedback").click(function() {
		$.ajax({
			method: "get",
			url: "/api/feedback/getAll"
		}).then(function(data) {
      console.log(data);
      data.result.forEach(function(feedback){
          feedback.createdAt = new Date(feedback.createdAt);
          feedback.createdAt = feedback.createdAt.getDate() + "-"
            + (feedback.createdAt.getMonth() + 1) + "-"
            + feedback.createdAt.getFullYear();
      });
		  $('#all-feedback').html(feedbackTemplate(data));
		}).fail(function(err) {
			console.log(err);
		})
	});
})
