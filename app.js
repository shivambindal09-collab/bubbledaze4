import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import './config.js';

const config = window.BUBBLEDAZE_CONFIG || {};
const connected = Boolean(config.supabaseUrl && config.supabasePublishableKey);
const supabase = connected ? createClient(config.supabaseUrl, config.supabasePublishableKey) : null;
const $ = (selector) => document.querySelector(selector);

$('#year').textContent = new Date().getFullYear();
$('#menuToggle').addEventListener('click', () => $('#mainNav').classList.toggle('open'));
document.querySelectorAll('#mainNav a').forEach(link => link.addEventListener('click', () => $('#mainNav').classList.remove('open')));

async function loadProducts() {
  if (!supabase) return;
  const { data, error } = await supabase.from('products').select('id,name,description,price,image_url,badge,sort_order').eq('is_active', true).order('sort_order');
  if (error) { console.warn('Products could not be loaded:', error.message); return; }
  if (!data || data.length === 0) return;
  const grid = $('#productGrid');
  grid.innerHTML = data.map((p, i) => `
    <article class="product-card">
      <div class="product-visual ${['visual-cream','visual-blush','visual-lilac'][i % 3]}" ${p.image_url ? `style="background-image:url('${escapeAttr(p.image_url)}');background-size:cover;background-position:center"` : ''}>
        <span class="product-label">${escapeHtml(p.badge || 'BUBBLEDAZE')}</span>
        ${p.image_url ? '' : `<div class="mini-pack"><b>B</b><strong>Bubbledaze</strong><small>CARE IN EVERY BUBBLE</small></div>`}
      </div>
      <div class="product-info"><div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description || '')}</p></div><span class="price">${p.price == null ? 'Ask us' : `₹${Number(p.price).toFixed(0)}`}</span></div>
      <button class="product-order" data-product="${escapeAttr(p.name)}">Enquire about this product <span>↗</span></button>
    </article>`).join('');
  bindProductButtons();
}

function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(value='') { return escapeHtml(value); }

function bindProductButtons() {
  document.querySelectorAll('.product-order').forEach(button => button.addEventListener('click', () => {
    const product = button.dataset.product || 'Bubbledaze product';
    $('#enquiryProduct').textContent = product;
    $('#enquiryForm').elements.product.value = product;
    $('#enquiryStatus').textContent = '';
    $('#enquiryDialog').showModal();
  }));
}
bindProductButtons();
$('#dialogClose').addEventListener('click', () => $('#enquiryDialog').close());
$('#enquiryDialog').addEventListener('click', event => { if (event.target === $('#enquiryDialog')) $('#enquiryDialog').close(); });

async function saveSubmission(table, payload, statusEl, form) {
  statusEl.textContent = '';
  if (!supabase) {
    statusEl.textContent = 'Website preview mode: add your Supabase URL and Publishable key in config.js, then run the SQL setup. Nothing has been sent yet.';
    statusEl.className = 'form-status warning';
    return;
  }
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true; submitButton.textContent = 'Sending…';
  try {
    const { error } = await supabase.from(table).insert(payload);
    if (error) throw error;
    statusEl.textContent = 'Thank you! Your message has been received.';
    statusEl.className = 'form-status success';
    form.reset();
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'We could not send this right now. Please try again later.';
    statusEl.className = 'form-status error';
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = form.id === 'contactForm' ? 'Send your message ↗' : 'Send enquiry ↗';
  }
}

$('#contactForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  await saveSubmission('contact_messages', { name: values.name.trim(), contact: values.contact.trim(), subject: values.subject, message: values.message.trim() }, $('#contactStatus'), form);
});

$('#enquiryForm').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  await saveSubmission('product_enquiries', { product_name: values.product, name: values.name.trim(), contact: values.contact.trim(), message: (values.message || '').trim() }, $('#enquiryStatus'), form);
});

loadProducts();
