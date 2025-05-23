// eleventy.config.js
module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css"); // Add this line

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes" // Optional: common convention for layouts
    }
  };
};
