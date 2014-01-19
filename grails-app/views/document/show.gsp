
<%@ page import="mindhub.Document" %>
<!DOCTYPE html>
<html>
	<head>
		<meta name="layout" content="main">
		<g:set var="entityName" value="${message(code: 'document.label', default: 'Document')}" />
		<title><g:message code="default.show.label" args="[entityName]" /></title>
	</head>
	<body>
		<a href="#show-document" class="skip" tabindex="-1"><g:message code="default.link.skip.label" default="Skip to content&hellip;"/></a>
		<div class="nav" role="navigation">
			<ul>
				<li><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></li>
				<li><g:link class="list" action="index"><g:message code="default.list.label" args="[entityName]" /></g:link></li>
				<li><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></li>
			</ul>
		</div>
		<div id="show-document" class="content scaffold-show" role="main">
			<h1><g:message code="default.show.label" args="[entityName]" /></h1>
			<g:if test="${flash.message}">
			<div class="message" role="status">${flash.message}</div>
			</g:if>
			<ol class="property-list document">
			
				<g:if test="${documentInstance?.createdDate}">
				<li class="fieldcontain">
					<span id="createdDate-label" class="property-label"><g:message code="document.createdDate.label" default="Created Date" /></span>
					
						<span class="property-value" aria-labelledby="createdDate-label"><g:formatDate date="${documentInstance?.createdDate}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${documentInstance?.dimensions}">
				<li class="fieldcontain">
					<span id="dimensions-label" class="property-label"><g:message code="document.dimensions.label" default="Dimensions" /></span>
					
						<span class="property-value" aria-labelledby="dimensions-label"><g:link controller="point" action="show" id="${documentInstance?.dimensions?.id}">${documentInstance?.dimensions?.encodeAsHTML()}</g:link></span>
					
				</li>
				</g:if>
			
				<g:if test="${documentInstance?.mindmap}">
				<li class="fieldcontain">
					<span id="mindmap-label" class="property-label"><g:message code="document.mindmap.label" default="Mindmap" /></span>
					
						<span class="property-value" aria-labelledby="mindmap-label"><g:link controller="mindmap" action="show" id="${documentInstance?.mindmap?.id}">${documentInstance?.mindmap?.encodeAsHTML()}</g:link></span>
					
				</li>
				</g:if>
			
				<g:if test="${documentInstance?.modifiedDate}">
				<li class="fieldcontain">
					<span id="modifiedDate-label" class="property-label"><g:message code="document.modifiedDate.label" default="Modified Date" /></span>
					
						<span class="property-value" aria-labelledby="modifiedDate-label"><g:formatDate date="${documentInstance?.modifiedDate}" /></span>
					
				</li>
				</g:if>
			
				<g:if test="${documentInstance?.owner}">
				<li class="fieldcontain">
					<span id="owner-label" class="property-label"><g:message code="document.owner.label" default="Owner" /></span>
					
						<span class="property-value" aria-labelledby="owner-label"><g:link controller="user" action="show" id="${documentInstance?.owner?.id}">${documentInstance?.owner?.encodeAsHTML()}</g:link></span>
					
				</li>
				</g:if>
			
				<g:if test="${documentInstance?.title}">
				<li class="fieldcontain">
					<span id="title-label" class="property-label"><g:message code="document.title.label" default="Title" /></span>
					
						<span class="property-value" aria-labelledby="title-label"><g:fieldValue bean="${documentInstance}" field="title"/></span>
					
				</li>
				</g:if>
			
			</ol>
			<g:form url="[resource:documentInstance, action:'delete']" method="DELETE">
				<fieldset class="buttons">
					<g:link class="edit" action="edit" resource="${documentInstance}"><g:message code="default.button.edit.label" default="Edit" /></g:link>
					<g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" />
				</fieldset>
			</g:form>
		</div>
	</body>
</html>
