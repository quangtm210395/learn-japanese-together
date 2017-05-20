$(document).ready(function() {
	var feedbackTemplate = Handlebars.compile($("#feedback-template").html());
  var nextUrl = "/api/feedback/getPart?page=0";
  var isLoading = false;
  var isRequested = false;
  var throtte = false;

	$("#send-feedback").click(function() {
		$.post('/api/feedback/create', {
				title: $('#feedback-title').val(),
				content: $('#feedback-content').val()
			},
			function(data, status) {
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
		if (!isRequested) loadNewFeedbackPage();
    isRequested = true;
	});

	$(window).on('scroll', function() {
    if (!isRequested) return;
		if (throtte) return;
		throtte = true;
		setTimeout(function() {
			throtte = false;
		}, 100);

		if ($(document).height() <= $(window).height() + $(window).scrollTop() + 100 && !isLoading) {
      loadNewFeedbackPage();
		}
	});

	function loadNewFeedbackPage() {
		isLoading = true;
    if (nextUrl == "") return;
		$.ajax({
			method: "get",
			url: nextUrl
		}).then(function(data) {
      nextUrl = data.result.nextUrl;
			data.result.feedbacks.forEach(function(feedback) {
				feedback.createdAt = new Date(feedback.createdAt);
				feedback.createdAt = feedback.createdAt.getDate() + "-" +
					(feedback.createdAt.getMonth() + 1) + "-" +
					feedback.createdAt.getFullYear();
			});
			var listFeedback = feedbackTemplate(data.result);
			$('#all-feedback').append($(listFeedback));

		}).fail(function(err) {
			console.log(err);
		}).always(function () {
      isLoading = false;
    });
	}
})
