(() => {
  'use strict';
  const search = document.getElementById('helpSearch');
  const groups = [...document.querySelectorAll('.help-group')];
  const normalize = value => value.toLowerCase().normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي');
  function filter() {
    const term = normalize(search.value.trim());
    let count = 0;
    groups.forEach(group => {
      let matches = 0;
      group.querySelectorAll('.help-question').forEach(question => {
        const match = !term || normalize(question.textContent + ' ' + group.querySelector('h2').textContent).includes(term);
        question.hidden = !match;
        if (match) {matches++;count++;}
      });
      group.hidden = matches === 0;
    });
    document.getElementById('helpEmpty').hidden = count > 0;
    document.getElementById('helpResults').textContent = term ? `${count} matching ${count === 1 ? 'answer' : 'answers'}` : '';
  }
  search.addEventListener('input',filter);
  document.querySelectorAll('.help-categories a').forEach(link => link.addEventListener('click',() => {search.value='';filter();}));
  filter();
})();