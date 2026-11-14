import assert from 'node:assert/strict';
import { test } from 'node:test';
import { appendLeadAttribution } from '../src/lib/lead-attribution.ts';
import { submitLeadIntake, leadSubmissionMessage } from '../src/lib/lead-intake.ts';

function setup(status = 'accepted', marker = '') {
  const sent = [], requests = [];
  globalThis.window = { location: { href: 'https://www.perfectohomesrealestate.com/contact/' },
    gtag: (...args) => sent.push(args) };
  globalThis.document = { documentElement: { lang: 'en' } };
  globalThis.fetch = async (_url, request) => {
    requests.push(JSON.parse(request.body));
    return { ok: status !== 'rejected', json: async () => ({ ok: true, status }) };
  };
  const formData = new FormData();
  for (const [key, value] of Object.entries({ name: 'Private Customer', email: 'private@example.com',
    phone: '+15555550100', message: marker || 'Private message' })) formData.set(key, value);
  return { sent, requests, formData };
}

test('accepted receipt waits for analytics callback and never includes contact details', async () => {
  const c = setup(); let complete = false;
  const pending = submitLeadIntake({ formData: c.formData, formName: 'contact_form' }).then(() => { complete = true; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(complete, false);
  assert.equal(c.sent.length, 1);
  const [kind, event, params] = c.sent[0];
  assert.equal(kind, 'event'); assert.equal(event, 'generate_lead');
  assert.equal(params.event_id, c.requests[0].event_id);
  assert.equal(params.transport_type, 'beacon'); assert.equal(params.test_submission, 0);
  for (const text of ['private@example.com', '+15555550100', 'Private message', 'Private Customer']) {
    assert.equal(JSON.stringify(params).includes(text), false);
  }
  params.event_callback(); await pending; assert.equal(complete, true);
});

test('marked internal accepted test has a numeric exclusion flag', async () => {
  const c = setup('accepted', 'TRC PERFECTO GA4 TEST 20261114-A — do not contact');
  const pending = submitLeadIntake({ formData: c.formData, formName: 'global_cta_form' });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(c.sent[0][2].test_submission, 1);
  c.sent[0][2].event_callback(); await pending;
});

test('duplicate and rejected responses never emit a lead event', async () => {
  for (const status of ['duplicate', 'rejected']) {
    const c = setup(status);
    if (status === 'rejected') await assert.rejects(submitLeadIntake({ formData: c.formData, formName: 'contact_form' }));
    else await submitLeadIntake({ formData: c.formData, formName: 'contact_form' });
    assert.equal(c.sent.length, 0);
  }
});

test('unavailable or failing analytics never turns an accepted lead into a form error', async () => {
  for (const gtag of [undefined, () => { throw new Error('blocked'); }]) {
    const c = setup(); window.gtag = gtag;
    await submitLeadIntake({ formData: c.formData, formName: 'contact_form' });
  }
});

test('blocked analytics callback has a bounded navigation fallback', async () => {
  const c = setup(); const start = Date.now();
  await submitLeadIntake({ formData: c.formData, formName: 'contact_form' });
  assert.ok(Date.now() - start < 1800);
});
test('secondary email failure cannot reject a lead already committed by the native intake',async()=>{
 const c=setup();window.gtag=undefined;c.formData.set('access_key','test-key');let emails=0;
 globalThis.fetch=async(url,request)=>{
  if(url.includes('web3forms')){emails++;assert.equal(request.keepalive,true);throw Error('email provider unavailable');}
  return {ok:true,json:async()=>({ok:true,status:'accepted'})};
 };
 await submitLeadIntake({formData:c.formData,formName:'contact_form'});
 await new Promise(resolve=>setImmediate(resolve));assert.equal(emails,1);
});
test('a duplicate never emits secondary email and a form-provided retry identity is preserved',async()=>{
 const c=setup('duplicate');c.formData.set('access_key','test-key');c.formData.set('event_id','retry-identity');let emails=0;
 globalThis.fetch=async(url,request)=>{if(url.includes('web3forms')){emails++;return {ok:true};}c.requests.push(JSON.parse(request.body));return {ok:true,json:async()=>({ok:true,status:'duplicate'})};};
 await submitLeadIntake({formData:c.formData,formName:'contact_form'});
 await submitLeadIntake({formData:c.formData,formName:'contact_form'});
 assert.equal(emails,0);assert.deepEqual(c.requests.map(v=>v.event_id),['retry-identity','retry-identity']);
});
test('validation errors are actionable and arbitrary provider failures stay private',async()=>{
 const c=setup();globalThis.fetch=async()=>({ok:true,json:async()=>({ok:false,status:'rejected',errors:['phone must include country code in E.164 format']})});
 try{await submitLeadIntake({formData:c.formData,formName:'contact_form'});assert.fail('Rejected response accepted');}catch(e){assert.match(leadSubmissionMessage(e),/country code/i);}
 assert.doesNotMatch(leadSubmissionMessage(new Error('PRIVATE_SERVER_DETAIL')),/PRIVATE_SERVER_DETAIL/);
});

test('blocked or corrupt attribution storage never prevents a native lead submission', async () => {
  for (const mode of ['get-denied', 'bad-json', 'set-denied']) {
    const c = setup(); window.gtag = undefined;
    globalThis.sessionStorage = {
      getItem: () => { if (mode === 'get-denied') throw Error('denied'); return mode === 'bad-json' ? '{bad' : null; },
      setItem: () => { if (mode === 'set-denied') throw Error('denied'); },
    };
    appendLeadAttribution(c.formData, 'contact_form');
    await submitLeadIntake({formData: c.formData, formName: 'contact_form'});
    assert.equal(c.requests.length, 1);
  }
});
