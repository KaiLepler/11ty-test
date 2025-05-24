---
layout: layout.njk
title: "My Blog"
permalink: /blog/index.html
templateEngineOverride: njk,md
---

# My Blog

Welcome to my blog! Here I'll share my thoughts on various topics.

{% if collections.publishedPosts.length > 0 %}
  <ul>
    {% for post in collections.publishedPosts %}
      <li>
        <h2><a href="{{ post.url | url }}">{{ post.data.title }}</a></h2>
        <p><time datetime="{{ post.date | readableDate('yyyy-MM-dd') }}">{{ post.date | readableDate }}</time></p>
        {% if post.data.summary %}
          <p>{{ post.data.summary }}</p>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
{% else %}
  <p>No blog posts yet. Stay tuned!</p>
{% endif %}
