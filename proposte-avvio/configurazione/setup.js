(() => {
  const $ = selector => document.querySelector(selector);
  const live = document.body.classList.contains('live');
  let footage = '', pendingRemoval = null;
  const message = (title, text = 'Questa è una simulazione. Nessuna sessione o impostazione di produzione viene modificata.') => {
    $('#message-title').textContent = title;
    $('#message-text').textContent = text;
    $('#message').showModal();
  };
  const update = () => {
    if (live) {
      const codec = $('#codec').value;
      const hevc = codec === 'hevc', jpeg = codec === 'mjpeg';
      $('#quality').hidden = hevc;
      $('#quality').disabled = !jpeg;
      $('#bitrate').hidden = !hevc;
      $('#bitrate').disabled = !hevc;
      $('#quality-label').textContent = hevc ? 'Bitrate · Mb/s' : 'Qualità';
      $('#quality-label').htmlFor = hevc ? 'bitrate' : 'quality';
      $('#quality-note').textContent = hevc ? 'Da 20 a 400 Mb/s' : jpeg ? 'Da 40 a 100' : 'Definita dal profilo';
      const gbh = hevc ? Number($('#bitrate').value) * .45 : jpeg ? 33 * Number($('#quality').value) / 88 : codec === 'prores422lt' ? 49 : 87;
      $('#weight').textContent = Math.round(gbh * Number($('#cameras').value));
    }
    const named = $('#name').value.trim().length > 0;
    const ready = named && (live || footage.length > 0) && $('#setup-form').checkValidity();
    $('#submit').disabled = !ready;
    $('#readiness').textContent = ready ? 'Configurazione pronta per la simulazione.' : !named ? `Inserisci il nome ${live ? 'della sessione' : 'del progetto'}.` : !live && !footage ? 'Scegli il girato da catalogare.' : 'Controlla i valori inseriti.';
  };
  $('#setup-form').addEventListener('input', update);
  $('#setup-form').addEventListener('change', update);
  $('#setup-form').addEventListener('submit', event => {
    event.preventDefault();
    if ($('#submit').disabled) return;
    message(live ? 'Sessione pronta' : 'Progetto pronto', `${$('#name').value.trim()}\n${live ? $('#codec').selectedOptions[0].textContent + ' · ' + $('#cameras').value + ' camere' : footage}\n${$('#folder').textContent}\n\nAnteprima: nessuna registrazione avviata e nessun progetto creato.`);
  });
  $('#change-folder').addEventListener('click', () => $('#folder-dialog').showModal());
  $('#folder-cancel').addEventListener('click', () => $('#folder-dialog').close());
  $('#folder-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!$('#folder-value').value.trim()) return;
    $('#folder').textContent = $('#folder-value').value.trim();
    $('#folder-dialog').close();
  });
  if (!live) {
    const selectFootage = value => {
      footage = value.trim();
      $('#filename').textContent = footage || 'Scegli il girato da catalogare';
      update();
    };
    $('#footage').addEventListener('change', event => { $('#manual-path').value = ''; selectFootage(event.target.files[0]?.name || ''); });
    $('#sample-file').addEventListener('click', () => { $('#manual-path').value = ''; $('#footage').value = ''; selectFootage('Derby_CAM1.mov · esempio'); });
    $('#manual-path').addEventListener('input', event => { $('#footage').value = ''; selectFootage(event.target.value); });
  }
  document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => message(button.dataset.demo)));
  document.querySelectorAll('[data-remove]').forEach(button => button.addEventListener('click', () => {
    pendingRemoval = button.closest('.recent');
    $('#delete-name').textContent = button.dataset.remove;
    if ($('#include-footage')) $('#include-footage').checked = false;
    $('#delete-dialog').showModal();
  }));
  $('#delete-cancel').addEventListener('click', () => $('#delete-dialog').close());
  $('#delete-confirm').addEventListener('click', () => {
    pendingRemoval?.remove(); pendingRemoval = null;
    const count = document.querySelectorAll('.recent').length;
    $('.count').textContent = count;
    $('.empty').hidden = count > 0;
    $('#delete-dialog').close();
  });
  update();
})();
