(() => {
  let active = null;
  const close = (restore = false) => {
    if (!active) return;
    active.menu.hidden = true;
    active.trigger.setAttribute('aria-expanded', 'false');
    if (restore) active.trigger.focus();
    active = null;
  };
  document.querySelectorAll('select').forEach(select => {
    const label = document.querySelector(`label[for="${select.id}"]`);
    const wrapper = document.createElement('div'); wrapper.className = 'custom-select';
    const trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'select-trigger'; trigger.id = select.id + '-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox'); trigger.setAttribute('aria-expanded', 'false');
    const menu = document.createElement('div'); menu.className = 'select-menu'; menu.hidden = true;
    menu.id = select.id + '-options'; menu.setAttribute('role', 'listbox');
    menu.setAttribute('aria-label', label?.textContent || select.id);
    trigger.setAttribute('aria-controls', menu.id);
    if (label) { label.id = select.id + '-label'; label.htmlFor = trigger.id; trigger.setAttribute('aria-labelledby', label.id + ' ' + trigger.id); }
    select.before(wrapper); wrapper.append(trigger, menu);
    select.hidden = true;
    const options = [...select.options].map(option => {
      const button = document.createElement('button'); button.type = 'button'; button.tabIndex = -1;
      button.setAttribute('role', 'option'); button.textContent = option.textContent;
      button.dataset.value = option.value;
      button.addEventListener('click', () => {
        select.value = option.value; sync(); select.dispatchEvent(new Event('change', { bubbles: true })); close(true);
      });
      menu.append(button); return button;
    });
    function sync() {
      trigger.textContent = select.selectedOptions[0].textContent;
      options.forEach(option => option.setAttribute('aria-selected', String(option.dataset.value === select.value)));
    }
    function open() {
      close(); menu.hidden = false; trigger.setAttribute('aria-expanded', 'true'); active = { menu, trigger };
      options[select.selectedIndex]?.focus();
    }
    trigger.addEventListener('click', () => active?.menu === menu ? close() : open());
    trigger.addEventListener('keydown', event => {
      if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); open(); }
    });
    menu.addEventListener('keydown', event => {
      const index = options.indexOf(document.activeElement);
      let next = index;
      if (event.key === 'ArrowDown') next = (index + 1) % options.length;
      else if (event.key === 'ArrowUp') next = (index + options.length - 1) % options.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); return; }
      else if (event.key === 'Tab') { close(true); return; }
      else return;
      event.preventDefault(); options[next].focus();
    });
    select.addEventListener('change', sync); sync();
  });
  document.addEventListener('pointerdown', event => {
    if (active && !active.menu.parentElement.contains(event.target)) close();
  });
  document.addEventListener('focusin', event => {
    if (active && !active.menu.parentElement.contains(event.target)) close();
  });
  document.querySelectorAll('[data-folder]').forEach(button => button.addEventListener('click', () => {
    document.querySelector('#folder-value').value = button.dataset.folder;
    document.querySelector('#folder-value').focus();
  }));
})();
