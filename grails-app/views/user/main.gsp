<%@ page import="mindhub.Document" %>
<!DOCTYPE html>
<html>
<head>
<title>Main Page</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!-- Bootstrap -->
<link href="../css/bootstrap.min.css" rel="stylesheet">

<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
<!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="../js/libs/jquery-1.10.2.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="../js/libs/bootstrap.min.js"></script>
<script type="text/javascript">
	$('#myTab a').click(function(e) {
		e.preventDefault()
		$(this).tab('show')
	})
</script>
</head>
<body>
	<!-- Nav tabs -->
	<ul class="nav nav-pills nav-justified">
		<li class="active"><a href="#home" data-toggle="pill">My
				mindmaps</a></li>
		<li><a href="#browse" data-toggle="pill">Browse mindmaps</a></li>
		<li><a href="#messages" data-toggle="pill">Messages</a></li>
		<li><a href="#about" data-toggle="pill">About</a></li>
	</ul>
	<!-- Tab panes -->
	<div class="tab-content">
		<div class="tab-pane fade in active" id="home">
			Count of Documents: ${docList.size()}
			<table class="table table-hover">
				<thead>
					<th>Title</th>
					<th>Created Date</th>
					<th>Partners</th>
					<th>Actions</th>
				</thead>
				<tbody>
					<g:each status="i" in="${docList}" var="doc">
						<tr>
							<td>
								${doc.title}
							</td>
							<td>
								${doc.createdDate}
							</td>
							<td>
								${doc.partners}
							</td>
							<td>
								<g:link>	Edit	</g:link>
								|
								<g:link>	Delete</g:link>
							</td>
						</tr>
					</g:each>
				</tbody>
			</table>
		</div>
		<div class="tab-pane fade" id="browse">
			<thead>
				<th>Title</th>
				<th>Created Date</th>
				<th>Partners</th>
				<th>Actions</th>
			</thead>
			<tbody>

			</tbody>
		</div>
		<div class="tab-pane fade" id="messages">messages</div>
		<div class="tab-pane fade" id="about">settings</div>
	</div>

	<script>
		$(function() {
			$('#myTab a:last').tab('show')
		})
	</script>
</body>
</html>