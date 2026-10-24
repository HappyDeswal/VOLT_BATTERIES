'use strict';
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const text = (selector, value) => { const element = $(selector); if (element) element.textContent = value; };
  const storage = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } } };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const number = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });
  const modelPrices = { 12: 18000, 24: 28000 };
  const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const state = { voltage: 12, capacity: 100, load: 100, usable: 90, runtimeMode: 'preset', spinning: !reducedMotion.matches, x: -17, y: -28, z: -5, dragging: false };
  const battery = $('#battery'), scene = $('#scene');
  let toastTimer;
  function toast(message) {
    text('#toast', message); $('#toast')?.classList.add('visible'); clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('#toast')?.classList.remove('visible'), 3500);
  }
  function updateRuntime() {
    if (!$('#load-input')) return;
    const custom = state.runtimeMode === 'custom';
    const fields = $('#runtime-build-fields');
    if (fields) { fields.hidden = !custom; fields.disabled = !custom; }
    const toggle = $('#runtime-custom-toggle');
    toggle?.classList.toggle('active', custom); toggle?.setAttribute('aria-pressed', String(custom));
    $$('.calculator-model [data-model]').forEach(button => { const active = !custom && Number(button.dataset.model) === state.voltage && state.capacity === 100; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    if (custom) {
      const v = Number($('#runtime-voltage').value), ah = Number($('#runtime-capacity').value);
      const valid = validBuild(v, ah);
      $('#runtime-build-error').hidden = valid;
      $('#runtime-voltage').setAttribute('aria-invalid', String(!(v >= 12 && v <= 48 && Math.abs(v * 10 - Math.round(v * 10)) < .000001)));
      $('#runtime-capacity').setAttribute('aria-invalid', String(!(Number.isInteger(ah) && ah >= 100 && ah <= 200)));
      const enquiry = $('#runtime-enquire'); enquiry.setAttribute('aria-disabled', String(!valid));
      if (!valid) { enquiry.removeAttribute('href'); text('#runtime-value','—'); text('#runtime-custom-label','Check your custom battery values.'); return; }
      state.voltage = v; state.capacity = ah;
      enquiry.href = `contact.html?type=custom&v=${v}&ah=${ah}`;
    }
    text('#runtime-custom-label', `${custom ? 'CUSTOM BUILD · ' : ''}${state.voltage}V / ${state.capacity}Ah · ${number.format(state.voltage * state.capacity)}Wh`);
    const load = Number($('#load-input').value), usable = Number($('#usable-energy').value);
    const loadValid = load >= 10 && load <= 2000, usableValid = usable >= 10 && usable <= 100;
    $('#load-error').hidden = loadValid && usableValid;
    $('#load-input').setAttribute('aria-invalid', String(!loadValid));
    $('#usable-energy').setAttribute('aria-invalid', String(!usableValid));
    if (!loadValid || !usableValid) { text('#runtime-value', '—'); return; }
    state.load = load; state.usable = usable;
    $('#load-range').value = load;
    $('#load-range').style.setProperty('--range', `${(load - 10) / 1990 * 100}%`);
    const hours = state.voltage * state.capacity * usable / 100 / load;
    text('#runtime-value', hours < 0.05 ? '<0.1' : hours.toFixed(1));
    $('#runtime-value').classList.toggle('long-runtime', hours >= 1000);
    $$('.load-presets button').forEach(button => { const active = Number(button.dataset.load) === load; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });

  }
  function syncModel() {
    $$('[data-model]').forEach(button => {
      const selected = Number(button.dataset.model) === state.voltage && state.capacity === 100;
      button.classList.toggle('active', selected); button.classList.toggle('selected', selected && button.classList.contains('model-card')); button.setAttribute('aria-pressed', String(selected));
      const action = button.querySelector('.model-card-action'); if (action) action.innerHTML = selected ? 'Selected <span>✓</span>' : 'Explore <span>↗</span>';
    });
    text('.battery-voltage', state.voltage); text('#battery-capacity', state.capacity); text('#side-capacity', state.capacity);
    text('.battery-code', `V–${state.voltage}/${state.capacity}`);
    text('#spec-voltage', state.voltage); text('#spec-capacity', state.capacity); text('#spec-energy', number.format(state.voltage * state.capacity));
    text('#callout-energy', number.format(state.voltage * state.capacity / 1000));
    text('.stage-index', $('#custom-form') ? 'CUSTOM / 01' : state.voltage === 12 ? '01 / 02' : '02 / 02');
    text('#selected-price', modelPrices[state.voltage] ? inr.format(modelPrices[state.voltage]) : 'Enquire');
    text('#price-model', `${state.voltage}V / 100Ah`);
    scene?.setAttribute('aria-label', `${state.voltage}V ${state.capacity}Ah battery. ${document.body.dataset.page === 'index' ? 'Move the pointer to rotate, or drag on touch screens.' : 'Drag to rotate.'} Use arrow keys for keyboard rotation. Press R to reset.`);
    battery?.classList.toggle('decimal-voltage', String(state.voltage).length > 2);
    updateRuntime();
  }
  $$('[data-model]').forEach(button => button.addEventListener('click', () => { state.voltage = Number(button.dataset.model); state.capacity = 100; state.runtimeMode = 'preset'; if ([12,24].includes(state.voltage)) storage.set('volt-model', String(state.voltage)); syncModel(); }));
  $('#runtime-custom-toggle')?.addEventListener('click', () => { state.runtimeMode = 'custom'; updateRuntime(); });
  $('#runtime-voltage')?.addEventListener('input', updateRuntime);
  $('#runtime-capacity')?.addEventListener('input', updateRuntime);
  $('#load-input')?.addEventListener('input', updateRuntime); $('#usable-energy')?.addEventListener('input', updateRuntime);
  $('#load-range')?.addEventListener('input', event => { $('#load-input').value = event.target.value; updateRuntime(); });
  $$('.load-presets button').forEach(button => button.addEventListener('click', () => { $('#load-input').value = button.dataset.load; updateRuntime(); }));
  function download(name, content) {
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function summary(custom = false) {
    return `VOLT — ${state.voltage}V / ${state.capacity}Ah\n${custom ? 'CUSTOM BUILD CONCEPT' : 'MODEL SPECIFICATION SUMMARY'}\n\nCell format: Prismatic\nNominal voltage: ${state.voltage}V\nCapacity: ${state.capacity}Ah\nCalculated nominal energy: ${number.format(state.voltage * state.capacity)}Wh (${number.format(state.voltage * state.capacity / 1000)}kWh)\n${!custom && state.capacity === 100 && modelPrices[state.voltage] ? `Price (INR): ${inr.format(modelPrices[state.voltage])}\n` : ''}\nEnergy calculation: voltage × amp-hours.\n\nProduct concept. Geometry and imagery are illustrative. Custom input ranges do not confirm manufacturability. Chemistry, dimensions, weight, charging/discharge limits, certifications and warranty have not been specified. Custom build prices require a separate enquiry. Confirm design and compatibility with a qualified supplier.\n\nRuntime estimates exclude real-world system losses.\n`;
  }
  function downloadSpecs(event) { event.preventDefault(); download(`VOLT-${state.voltage}V-${state.capacity}Ah-specs.txt`, summary()); toast(`${state.voltage}V / ${state.capacity}Ah specs downloaded`); }
  $('#download-hero')?.addEventListener('click', downloadSpecs);
  // Custom values are a planning concept, not electrical design instructions.
  function validBuild(voltage, capacity) { return Number.isFinite(voltage) && voltage >= 12 && voltage <= 48 && Math.abs(voltage * 10 - Math.round(voltage * 10)) < .000001 && Number.isInteger(capacity) && capacity >= 100 && capacity <= 200; }
  let customBuilderMode = false;
  function updateBuildChoices(voltage, capacity) {
    $$('.builder-presets button').forEach(button => {
      const custom = button.id === 'custom-build-option';
      const active = customBuilderMode ? custom : !custom && Number(button.dataset.buildV) === voltage && Number(button.dataset.buildAh) === capacity;
      button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active));
    });
  }
  function updateBuild() {
    const voltage = Number($('#custom-voltage').value), capacity = Number($('#custom-capacity').value);
    const valid = validBuild(voltage, capacity);
    $('#custom-error').hidden = valid;
    $('#custom-voltage').setAttribute('aria-invalid', String(!(voltage >= 12 && voltage <= 48 && Math.abs(voltage * 10 - Math.round(voltage * 10)) < .000001)));
    $('#custom-capacity').setAttribute('aria-invalid', String(!(Number.isInteger(capacity) && capacity >= 100 && capacity <= 200)));
    $('#save-build').disabled = !valid; $('#download-custom').disabled = !valid;
    const runtimeLink = $('#custom-runtime-link'); runtimeLink.setAttribute('aria-disabled', String(!valid));
    if (!valid) { text('#custom-energy','—'); text('#energy-formula','Check your configuration'); runtimeLink.removeAttribute('href'); const enquiryLink = $('#custom-contact-link'); if (enquiryLink) { enquiryLink.removeAttribute('href'); enquiryLink.setAttribute('aria-disabled','true'); } updateBuildChoices(voltage, capacity); return false; }
    state.voltage = voltage; state.capacity = capacity; syncModel();
    text('#custom-energy', (voltage * capacity / 1000).toFixed(2)); text('#energy-formula', `${voltage}V × ${capacity}Ah = ${number.format(voltage * capacity)}Wh`);
    runtimeLink.href = `runtime.html?v=${voltage}&ah=${capacity}`;
    const enquiryLink = $('#custom-contact-link'); if (enquiryLink) { enquiryLink.href = `contact.html?type=custom&v=${voltage}&ah=${capacity}`; enquiryLink.setAttribute('aria-disabled','false'); }
    updateBuildChoices(voltage, capacity);
    return true;
  }
  if ($('#custom-form')) {
    let saved; try { saved = JSON.parse(storage.get('volt-custom-build')); } catch { saved = null; }
    if (saved && validBuild(saved.voltage, saved.capacity)) { $('#custom-voltage').value = saved.voltage; $('#custom-capacity').value = saved.capacity; customBuilderMode = saved.mode === 'custom' || !([12,24].includes(saved.voltage) && saved.capacity === 100); }
    const editCustomBuild = () => { customBuilderMode = true; updateBuild(); };
    $('#custom-voltage').addEventListener('input',editCustomBuild); $('#custom-capacity').addEventListener('input',editCustomBuild);
    $('#custom-build-option')?.addEventListener('click', () => { customBuilderMode = true; updateBuild(); $('#custom-voltage').focus(); $('#custom-voltage').select(); });
    $$('.builder-presets [data-build-v]').forEach(button=>button.addEventListener('click',()=>{ customBuilderMode = false; $('#custom-voltage').value=button.dataset.buildV; $('#custom-capacity').value=button.dataset.buildAh; updateBuild(); }));
    $('#custom-form').addEventListener('submit',event=>{ event.preventDefault(); if(updateBuild()) { const saved=storage.set('volt-custom-build',JSON.stringify({voltage:state.voltage,capacity:state.capacity,mode:customBuilderMode?'custom':'preset'})); toast(saved?'Build saved to this browser':'Browser storage unavailable. Download your build instead.'); } });
    $('#download-custom').addEventListener('click',()=>{ if(updateBuild()) { download(`VOLT-custom-${state.voltage}V-${state.capacity}Ah.txt`,summary(true)); toast('Custom build downloaded'); } });
    updateBuild();
  } else {
    const selected = Number(storage.get('volt-model')); if ([12,24].includes(selected)) state.voltage = selected;
    if ($('#load-input')) { const params = new URLSearchParams(location.search), v = Number(params.get('v')), ah = Number(params.get('ah')); if (validBuild(v,ah)) { state.voltage = v; state.capacity = ah; state.runtimeMode = 'custom'; if ($('#runtime-voltage')) $('#runtime-voltage').value = v; if ($('#runtime-capacity')) $('#runtime-capacity').value = ah; } }
    syncModel();
  }
  if (battery && scene && document.body.dataset.page === 'index') {
    const motion = { hovering: false, zoom: 1, targetX: state.x, targetY: state.y, targetZ: state.z, baseX: state.x, baseY: state.y };
    const paint = () => { battery.style.transform = `rotateX(${state.x}deg) rotateY(${state.y}deg) rotateZ(${state.z}deg) scale3d(${motion.zoom},${motion.zoom},${motion.zoom})`; };
    const spinButton = () => { const button = $('#spin-toggle'); button.setAttribute('aria-pressed', String(state.spinning)); const label = state.spinning ? 'Pause automatic rotation' : 'Start automatic rotation'; button.setAttribute('aria-label', label); button.title = label; text('#spin-icon', state.spinning ? 'Ⅱ' : '▷'); };
    const reset = () => { state.x = motion.targetX = motion.baseX = -17; state.y = motion.targetY = motion.baseY = -28; state.z = motion.targetZ = -5; paint(); };
    const enter = event => {
      if (event.pointerType !== 'mouse') return;
      motion.hovering = true; motion.baseX = state.x; motion.baseY = state.y;
      motion.targetX = state.x; motion.targetY = state.y;
      scene.classList.add('pointer-exploring');
    };
    const leave = () => { motion.hovering = false; motion.targetX = state.x; motion.targetY = state.y; scene.classList.remove('pointer-exploring'); };
    scene.addEventListener('pointerenter', enter);
    scene.addEventListener('pointerleave', leave);
    let startX, startY, baseX, baseY;
    scene.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse') return;
      state.dragging = true; state.spinning = false; spinButton();
      startX = event.clientX; startY = event.clientY; baseX = state.x; baseY = state.y;
      scene.classList.add('dragging'); scene.setPointerCapture(event.pointerId);
    });
    scene.addEventListener('pointermove', event => {
      if (event.pointerType === 'mouse') {
        if (!motion.hovering) enter(event);
        const rect = scene.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
        const ny = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
        motion.targetY = motion.baseY + nx * 32;
        motion.targetX = Math.max(-55, Math.min(35, motion.baseX - ny * 17));
      } else if (state.dragging) {
        motion.targetY = baseY + (event.clientX - startX) * .55;
        motion.targetX = Math.max(-65, Math.min(45, baseX - (event.clientY - startY) * .35));
      }
    });
    const end = () => { state.dragging = false; scene.classList.remove('dragging'); };
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => scene.addEventListener(type, end));
    $('#spin-toggle').addEventListener('click', () => { state.spinning = !state.spinning; spinButton(); });
    $('#reset-view').addEventListener('click', reset);
    scene.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','r','R'].includes(event.key)) return;
      event.preventDefault(); state.spinning = false; spinButton(); leave();
      if (event.key.toLowerCase() === 'r') return reset();
      if (event.key === 'ArrowLeft') motion.targetY -= 12;
      if (event.key === 'ArrowRight') motion.targetY += 12;
      if (event.key === 'ArrowUp') motion.targetX = Math.max(-65, motion.targetX - 8);
      if (event.key === 'ArrowDown') motion.targetX = Math.min(45, motion.targetX + 8);
    });
    let visible = true, previous = null;
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: .05 }).observe(scene);
    function frame(time) {
      const delta = previous === null ? 0 : Math.min(time - previous, 50); previous = time;
      if (visible && !document.hidden) {
        if (state.spinning && !motion.hovering && !state.dragging) {
          motion.targetY += delta * .004; // One gentle revolution every 90 seconds.
          motion.targetX = -17; motion.targetZ = -5;
        }
        const ease = reducedMotion.matches ? 1 : 1 - Math.exp(-delta / 150);
        const zoomTarget = motion.hovering && !reducedMotion.matches ? 1.065 : 1;
        state.x += (motion.targetX - state.x) * ease;
        state.y += (motion.targetY - state.y) * ease;
        state.z += (motion.targetZ - state.z) * ease;
        motion.zoom += (zoomTarget - motion.zoom) * ease;
        paint();
      }
      requestAnimationFrame(frame);
    }
    reducedMotion.addEventListener('change', event => { if (event.matches) { state.spinning = false; motion.zoom = 1; spinButton(); paint(); } });
    text('.drag-hint', 'MOVE TO EXPLORE'); spinButton(); paint(); requestAnimationFrame(frame);
  } else if (battery && scene) {
    const paint = () => { battery.style.transform = `rotateX(${state.x}deg) rotateY(${state.y}deg) rotateZ(${state.z}deg)`; };
    const spinButton = () => { $('#spin-toggle').setAttribute('aria-pressed',String(state.spinning)); const label = state.spinning ? 'Pause automatic rotation' : 'Start automatic rotation'; $('#spin-toggle').setAttribute('aria-label',label); $('#spin-toggle').title=label; text('#spin-icon',state.spinning?'Ⅱ':'▷'); };
    const reset = () => { state.x=-17;state.y=-28;state.z=-5;paint(); };
    $('#spin-toggle').addEventListener('click',()=>{state.spinning=!state.spinning;spinButton();}); $('#reset-view').addEventListener('click',reset);
    let startX,startY,baseX,baseY;
    scene.addEventListener('pointerdown',event=>{if(event.pointerType==='mouse'&&event.button!==0)return;state.dragging=true;state.spinning=false;spinButton();startX=event.clientX;startY=event.clientY;baseX=state.x;baseY=state.y;scene.classList.add('dragging');scene.setPointerCapture(event.pointerId);});
    scene.addEventListener('pointermove',event=>{if(!state.dragging)return;state.y=baseY+(event.clientX-startX)*.55;state.x=Math.max(-65,Math.min(45,baseX-(event.clientY-startY)*.35));paint();});
    const end=()=>{state.dragging=false;scene.classList.remove('dragging');};['pointerup','pointercancel','lostpointercapture'].forEach(type=>scene.addEventListener(type,end));
    scene.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','r','R'].includes(event.key))return;event.preventDefault();state.spinning=false;spinButton();if(event.key.toLowerCase()==='r')return reset();if(event.key==='ArrowLeft')state.y-=12;if(event.key==='ArrowRight')state.y+=12;if(event.key==='ArrowUp')state.x=Math.max(-65,state.x-8);if(event.key==='ArrowDown')state.x=Math.min(45,state.x+8);paint();});
    let visible=true,previous=0,elapsed=0;new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.05}).observe(scene);
    function frame(time){const delta=Math.min(time-previous,50);previous=time;if(state.spinning&&!state.dragging&&visible&&!document.hidden){elapsed+=delta;state.y=-28+Math.sin(elapsed/4000)*14;state.x=-17+Math.sin(elapsed/5500)*3;paint();}requestAnimationFrame(frame);}
    reducedMotion.addEventListener('change',event=>{if(event.matches){state.spinning=false;spinButton();}});spinButton();paint();requestAnimationFrame(frame);
  }
  if ($('#enquiry-form')) {
    const form = $('#enquiry-form'), review = $('#enquiry-review');
    const name = $('#enquiry-name'), email = $('#enquiry-email'), message = $('#enquiry-message');
    const voltage = $('#enquiry-voltage'), capacity = $('#enquiry-capacity'), quantity = $('#enquiry-quantity');
    const recipient = 'contact@example.com';
    $('.contact-submit').disabled = false;
    let preparedBody = '';
    function updateEnquiryEnergy() {
      const v = Number(voltage.value), ah = Number(capacity.value);
      text('#enquiry-energy', validBuild(v, ah) ? `${number.format(v * ah / 1000)}kWh` : '—');
    }
    function updateEnquiryType() {
      const custom = form.querySelector('input[name="enquiry-type"]:checked').value === 'custom';
      $('#enquiry-build').hidden = !custom; $('#enquiry-build').disabled = !custom;
      message.placeholder = custom ? 'Tell me about your battery requirements, space constraints or intended use…' : 'What would you like to know?';
      updateEnquiryEnergy();
    }
    $$('input[name="enquiry-type"]').forEach(input => input.addEventListener('change', updateEnquiryType));
    [voltage, capacity].forEach(input => input.addEventListener('input', updateEnquiryEnergy));
    [name, email, message].forEach(input => input.addEventListener('input', () => input.setCustomValidity('')));
    message.addEventListener('input', () => text('#message-count', `${message.value.length} / 1,500`));
    const params = new URLSearchParams(location.search), requestedV = Number(params.get('v')), requestedAh = Number(params.get('ah'));
    if (params.get('type') === 'custom') {
      form.querySelector('input[value="custom"]').checked = true;
      if (validBuild(requestedV, requestedAh)) { voltage.value = requestedV; capacity.value = requestedAh; }
    }
    updateEnquiryType();
    form.addEventListener('submit', event => {
      event.preventDefault();
      name.setCustomValidity(name.value.trim() ? '' : 'Please enter your name.');
      message.setCustomValidity(message.value.trim().length >= 10 ? '' : 'Please enter a message of at least 10 characters.');
      if (!form.reportValidity()) return;
      const custom = form.querySelector('input[name="enquiry-type"]:checked').value === 'custom';
      const subject = custom ? `VOLT custom battery enquiry — ${Number(voltage.value)}V / ${Number(capacity.value)}Ah` : 'VOLT — General enquiry';
      const lines = [subject, '', `Name: ${name.value.trim()}`, `Reply email: ${email.value.trim()}`];
      const phone = $('#enquiry-phone').value.trim(); if (phone) lines.push(`Phone: ${phone}`);
      if (custom) lines.push('', 'CUSTOM BATTERY REQUIREMENTS', 'Cell format: Prismatic', `Voltage: ${Number(voltage.value)}V`, `Capacity: ${Number(capacity.value)}Ah`, `Quantity: ${Number(quantity.value)} battery pack(s)`, `Nominal energy per pack: ${number.format(Number(voltage.value) * Number(capacity.value))}Wh`);
      const application = $('#enquiry-use').value; if (application) lines.push(`Application: ${application}`);
      lines.push('', 'MESSAGE', message.value.trim());
      if (custom) lines.push('', 'These are requested requirements, subject to design and compatibility review.');
      preparedBody = lines.join('\n');
      $('#enquiry-preview').value = preparedBody;
      $('#send-enquiry').href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(preparedBody)}`;
      form.hidden = true; review.hidden = false; text('#enquiry-copy-status','');
      $('#review-title').focus();
    });
    $('#edit-enquiry').addEventListener('click', () => { review.hidden = true; form.hidden = false; name.focus(); });
    $('#copy-enquiry').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(preparedBody); text('#enquiry-copy-status','Enquiry copied. Paste it into your email service.'); }
      catch { $('#enquiry-preview').focus(); $('#enquiry-preview').select(); text('#enquiry-copy-status','Select and copy the enquiry above, then paste it into your email service.'); }
    });
    $('#download-enquiry').addEventListener('click', () => { download('VOLT-enquiry.txt', `To: ${recipient}\n\n${preparedBody}`); text('#enquiry-copy-status','Enquiry downloaded. It has not been sent.'); });
  }

  text('#year',new Date().getFullYear());
})();
