/* =========================================================
   SkillSprout — dashboard.js
   Handles sidebar navigation between dashboard sections.
   ========================================================= */

/* All the data each section needs in the top bar */
var sectionMeta = {
  overview:  { title: 'Overview',   sub: 'Welcome back, Priya! Here\'s what\'s happening.',  action: '+ Add new class' },
  classes:   { title: 'My Classes', sub: 'Manage and update your listed classes.',            action: '+ Add new class' },
  students:  { title: 'Students',   sub: 'View all students enrolled in your classes.',       action: 'Export list' },
  reviews:   { title: 'Reviews',    sub: 'See what parents are saying about your classes.',   action: null },
  earnings:  { title: 'Earnings',   sub: 'Track your monthly income and payouts.',            action: 'Request payout' },
};

var navItems    = document.querySelectorAll('.dash-nav-item');
var pageTitle   = document.getElementById('pageTitle');
var pageSub     = document.getElementById('pageSub');
var topbarAction = document.getElementById('topbarAction');

navItems.forEach(function(item) {
  item.addEventListener('click', function(e) {
    e.preventDefault();
    var section = item.getAttribute('data-section');

    /* 1. Update active nav item */
    navItems.forEach(function(n) { n.classList.remove('dash-nav-item--active'); });
    item.classList.add('dash-nav-item--active');

    /* 2. Show correct section, hide others */
    document.querySelectorAll('.dash-section').forEach(function(s) {
      s.classList.add('hidden');
    });
    document.getElementById('section' + capitalise(section)).classList.remove('hidden');

    /* 3. Update topbar text and action button */
    var meta = sectionMeta[section];
    pageTitle.textContent = meta.title;
    pageSub.textContent   = meta.sub;

    if (meta.action) {
      topbarAction.textContent = meta.action;
      topbarAction.style.display = 'inline-block';
    } else {
      topbarAction.style.display = 'none';
    }
  });
});

function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
