<%@ page import="mindhub.DocumentJSON" %>



<div class="fieldcontain ${hasErrors(bean: documentJSONInstance, field: 'json', 'error')} ">
	<label for="json">
		<g:message code="documentJSON.json.label" default="Json" />
		
	</label>
	<g:textField name="json" value="${documentJSONInstance?.json}"/>
</div>

<div class="fieldcontain ${hasErrors(bean: documentJSONInstance, field: 'origin', 'error')} required">
	<label for="origin">
		<g:message code="documentJSON.origin.label" default="Origin" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="origin" name="origin.id" from="${mindhub.DocumentJSON.list()}" optionKey="id" required="" value="${documentJSONInstance?.origin?.id}" class="many-to-one"/>
</div>

<div class="fieldcontain ${hasErrors(bean: documentJSONInstance, field: 'owner', 'error')} required">
	<label for="owner">
		<g:message code="documentJSON.owner.label" default="Owner" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="owner" name="owner.id" from="${mindhub.User.list()}" optionKey="id" required="" value="${documentJSONInstance?.owner?.id}" class="many-to-one"/>
</div>

