
<%@ page import="mindhub.DocumentJSON" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'documentJSON.label', default: 'DocumentJSON')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#show-documentJSON" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="show-documentJSON" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list documentJSON">
			
				<g:if test="${documentJSONInstance?.json}">
				<li class="fieldcontain">
					<span id="json-label" class="property-label"><g:message code="documentJSON.json.label" default="Json" /></span>
					
						<span class="property-value" aria-labelledby="json-label"><g:fieldValue bean="${documentJSONInstance}" field="json"/></span>
					
				</li>
				</g:if>
			
				<g:if test="${documentJSONInstance?.origin}">
				<li class="fieldcontain">
					<span id="origin-label" class="property-label"><g:message code="documentJSON.origin.label" default="Origin" /></span>
					
						<span class="property-value" aria-labelledby="origin-label"><g:link controller="documentJSON" action="show" id="${documentJSONInstance?.origin?.id}">${documentJSONInstance?.origin?.encodeAsHTML()}</g:link></span>
					
				</li>
				</g:if>
			
				<g:if test="${documentJSONInstance?.owner}">
				<li class="fieldcontain">
					<span id="owner-label" class="property-label"><g:message code="documentJSON.owner.label" default="Owner" /></span>
					
						<span class="property-value" aria-labelledby="owner-label"><g:link controller="user" action="show" id="${documentJSONInstance?.owner?.id}">${documentJSONInstance?.owner?.encodeAsHTML()}</g:link></span>
					
				</li>
				</g:if>
			
			</ol>
			<g:form url="[resource:documentJSONInstance, action:'delete']" method="DELETE">
				<fieldset class="buttons">
					<g:link class="edit" action="edit" resource="${documentJSONInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
