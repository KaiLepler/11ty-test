// eleventy.config.js
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/js");

  // Collections
  eleventyConfig.addCollection("publishedPosts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/**/*.md")
      .filter(item => !item.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("draftPosts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/drafts/**/*.md");
  });

  // Date filter
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "LLLL d, yyyy");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes" // Optional: common convention for layouts
    },
    pathPrefix: "/11ty-test/"
  };
};
