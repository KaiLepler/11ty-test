---
title: "Test: Sidebar Layout"
layout: layouts/page-with-sidebar.njk
---
# Sidebar Layout Test
This page demonstrates the layout with a sidebar. The main content is here.
The sidebar should appear to the side on larger screens and stack on smaller screens.

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Main Content Features
Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.

{% block sidebar %}
<h3>Test Sidebar</h3>
<p>This is custom sidebar content for the test page. It should appear in the sidebar column.</p>
<ul>
  <li>Navigation Item 1</li>
  <li>Another Link</li>
  <li>Helpful Resource</li>
</ul>
<p><em>This content specifically overrides the default sidebar placeholder.</em></p>
{% endblock %}
