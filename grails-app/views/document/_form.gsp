<%@ page import="mindhub.Document" %>



<div class="fieldcontain ${hasErrors(bean: documentInstance, field: 'createdDate', 'error')} required">
	<label for="createdDate">
		<g:message code="document.createdDate.label" default="Created Date" />
		<span class="required-indicator">*</span>
	</label>
	<g:datePicker name="createdDate" precision="day"  value="${documentInstance?.createdDate}"  />
</div>

<div class="fieldcontain ${hasErrors(bean: documentInstance, field: 'dimensions', 'error')} required">
	<label for="dimensions">
		<g:message code="document.dimensions.label" default="Dimensions" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="dimensions" name="dimensions.id" from="${mindhub.Point.list()}" optionKey="id" required="" value="${documentInstance?.dimensions?.id}" class="many-to-one"/>
</div>

<div class="fieldcontain ${hasErrors(bean: documentInstance, field: 'mindmap', 'error')} required">
	<label for="mindmap">
		<g:message code="document.mindmap.label" default="Mindmap" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="mindmap" name="mindmap.id" from="${mindhub.Mindmap.list()}" optionKey="id" required="" value="${documentInstance?.mindmap?.id}" class="many-to-one"/>
</div>

<div class="fieldcontain ${hasErrors(bean: documentInstance, field: 'modifiedDate', 'error')} required">
	<label for="modifiedDate">
		<g:message code="document.modifiedDate.label" default="Modified Date" />
		<span class="required-indicator">*</span>
	</label>
	<g:datePicker name="modifiedDate" precision="day"  value="${documentInstance?.modifiedDate}"  />
</div>

<div class="fieldcontain ${hasErrors(bean: documentInstance, field: 'owner', 'error')} required">
	<label for="owner">
		<g:message code="document.owner.label" default="Owner" />
		<span class="required-indicator">*</span>
	</label>
	<g:select id="owner" name="owner.id" from="${mindhub.User.list()}" optionKey="id" required="" value="${documentInstance?.owner?.id}" class="many-to-one"/>
</div>

<div class="fieldcontain ${hasErrors(bean: documentInstance, field: 'title', 'error')} ">
	<label for="title">
		<g:message code="document.title.label" default="Title" />
		
	</label>
	<g:textField name="title" value="${documentInstance?.title}"/>
</div>

