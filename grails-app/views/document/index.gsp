
<%@ page import="mindhub.Document" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'document.label', default: 'Document')}" />
		<title><g:message code="default.list.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#list-document" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="list-document" class="content scaffold-list" role="main">
			<h1><g:message code="default.list.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
				<div class="message" role="status">${flash.message}</div>
			</g:if>
			<table>
			<thead>
					<tr>
					
						<g:sortableColumn property="createdDate" title="${message(code: 'document.createdDate.label', default: 'Created Date')}" />
					
					
						<th><g:message code="document.mindmap.label" default="Mindmap" /></th>
					
						<g:sortableColumn property="modifiedDate" title="${message(code: 'document.modifiedDate.label', default: 'Modified Date')}" />
					
						<th><g:message code="document.owner.label" default="Owner" /></th>
					
						<g:sortableColumn property="title" title="${message(code: 'document.title.label', default: 'Title')}" />
					
					</tr>
				</thead>
				<tbody>
				<g:each in="${documentInstanceList}" status="i" var="documentInstance">
					<tr class="${(i % 2) == 0 ? 'even' : 'odd'}">
					
						<td><g:link action="show" id="${documentInstance.id}">${fieldValue(bean: documentInstance, field: "createdDate")}</g:link></td>
					
					
						<td>${fieldValue(bean: documentInstance, field: "mindmap")}</td>
					
						<td><g:formatDate date="${documentInstance.modifiedDate}" /></td>
					
						<td>${fieldValue(bean: documentInstance, field: "owner")}</td>
					
						<td>${fieldValue(bean: documentInstance, field: "title")}</td>
					
					</tr>
				</g:each>
				</tbody>
			</table>
			<div class="pagination">
				<g:paginate total="${documentInstanceCount ?: 0}" />
			</div>
		</div>
	</body>
</html>
