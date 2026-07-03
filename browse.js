/* =========================================================
   SkillSprout — browse.js
   Small pieces of interactivity for the Browse Classes page.
   This is your first JS file in the project — read every
   comment carefully. We're keeping it simple on purpose.
   ========================================================= */

/* ---------- 1. REMOVE INDIVIDUAL FILTER TAGS ----------
   When you click the ✕ on a filter tag, it should disappear.

   document.querySelectorAll() — selects ALL elements that
   match a CSS selector, returns a NodeList (like an array).

   forEach() — loops over each element and runs a function.

   addEventListener('click', ...) — listens for a click event
   and runs the callback function when it fires.

   .closest('.filter-tag') — walks UP the DOM from the ✕ button
   to find its parent .filter-tag element, so we can remove
   the whole tag, not just the button inside it.

   .remove() — removes the element from the page entirely.
*/
document.querySelectorAll('.remove-tag').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var tag = btn.closest('.filter-tag');
    tag.remove();
  });
});


/* ---------- 2. CLEAR ALL FILTERS ----------
   Clicking "Clear all" should:
   a) Uncheck every checkbox and radio in the sidebar
   b) Remove all active filter tags
*/
var clearAllBtn = document.getElementById('clearAll');

clearAllBtn.addEventListener('click', function() {
  // a) uncheck all checkboxes and radios inside the sidebar
  document.querySelectorAll('.filter-sidebar input').forEach(function(input) {
    input.checked = false;
  });

  // b) remove all active filter tags
  document.querySelectorAll('.filter-tag').forEach(function(tag) {
    tag.remove();
  });
});


/* ---------- 3. ADD A FILTER TAG WHEN A CHECKBOX IS CHECKED ----------
   When you tick a checkbox, a new tag should appear in the
   active-filters area. When you untick it, the tag disappears.

   This connects the sidebar checkboxes to the tag strip above them,
   making the UI feel live and responsive without any backend.
*/
var activeFiltersContainer = document.getElementById('activeFilters');

document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
    if (checkbox.checked) {
      // Create a new tag
      var tag = document.createElement('span');
      tag.classList.add('filter-tag');
      // Use the label text as the tag label (minus the count number)
      var label = checkbox.closest('label');
      // label.childNodes[2] is the text node " Dance" etc. — we clean it up
      var labelText = label.textContent.replace(/\d+/g, '').trim();
      tag.innerHTML = labelText + ' <button class="remove-tag" aria-label="Remove filter">✕</button>';
      // Store a reference to the checkbox on the tag so we can uncheck it when removed
      tag.dataset.value = checkbox.value;
      activeFiltersContainer.appendChild(tag);

      // The newly created ✕ button also needs the remove listener
      tag.querySelector('.remove-tag').addEventListener('click', function() {
        checkbox.checked = false; // untick the checkbox too
        tag.remove();
      });
    } else {
      // If unchecked, find and remove the matching tag
      var existingTag = activeFiltersContainer.querySelector('[data-value="' + checkbox.value + '"]');
      if (existingTag) existingTag.remove();
    }
  });
});
