(function(){
  const root='.';
  const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const get=id=>document.getElementById(id);
  const statusLabel={LOCKED:'확정',TARGET:'목표',TEST:'검증 필요','PARTNER PROPOSAL':'제조사 제안'};
  const list=items=>items.map(item=>`<li>${escapeHtml(item)}</li>`).join('');
  function renderBrief(data){
    const project=data.project, concept=data.concept;
    const recipeRoot=get('recipeGrid');
    if(recipeRoot) recipeRoot.innerHTML=data.products.map(product=>`<article class="recipe"><div class="recipe-top"><span class="recipe-number">${escapeHtml(product.number)} · 기본 레시피</span><span class="status-badge">${escapeHtml(product.statusLabel)}</span></div><h3>${escapeHtml(product.name)}</h3><p class="recipe-description">${escapeHtml(product.description)}</p><img class="recipe-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}" loading="lazy"><dl><dt>기본 재료</dt><dd>${escapeHtml(product.baseFood)}</dd><dt>목표 맛</dt><dd>${escapeHtml(product.targetTaste)}</dd><dt>목표 질감</dt><dd>${escapeHtml(product.targetTexture)}</dd><dt>개발 상태</dt><dd>${escapeHtml(statusLabel[product.status]||product.status)}</dd></dl></article>`).join('');
    const targetRoot=get('nutritionTargets');
    if(targetRoot) targetRoot.innerHTML=data.nutrition.targets.map(item=>`<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.value)}</td><td>${escapeHtml(item.status)}</td><td>${escapeHtml(item.note)}</td></tr>`).join('');
    const scienceRoot=get('scienceLayers');
    if(scienceRoot){const layers=[data.science.signature,...data.science.nutritionCandidates,...data.science.rdCandidates,...data.science.holdSeparate];scienceRoot.innerHTML=layers.map(item=>`<div class="science-layer"><div><small>${escapeHtml(item.label)}</small><strong>${escapeHtml(item.name)}</strong></div><p>${escapeHtml(item.status)} · 제조시험과 표시 검토 후 단계가 바뀝니다.</p></div>`).join('')}
    const tests=get('scienceTests'); if(tests) tests.innerHTML=list(data.science.manufacturerTests);
    const evidenceRoot=get('evidenceRegistry');
    if(evidenceRoot&&data.evidence?.sources){evidenceRoot.innerHTML=data.evidence.sources.map(item=>`<article class="evidence-card"><div class="evidence-top"><span>${escapeHtml(item.type)}</span><time datetime="${escapeHtml(item.year)}">${escapeHtml(item.year)}</time></div><h4>${escapeHtml(item.title)}</h4><p class="evidence-publisher">${escapeHtml(item.publisher)}</p><dl><dt>자료 유형</dt><dd>${escapeHtml(item.design)}</dd><dt>관찰 범위</dt><dd>${escapeHtml(item.sample)}</dd><dt>무엇을 봤나</dt><dd>${escapeHtml(item.measure)}</dd></dl><p class="evidence-finding"><strong>자료가 말하는 것</strong>${escapeHtml(item.finding)}</p><p class="evidence-finding"><strong>쉽게 말하면</strong>${escapeHtml(item.consumerSummary)}</p><p class="evidence-use"><strong>사이트에서의 쓰임</strong>${escapeHtml(item.use)}</p><a class="evidence-link" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">원문 보기 ↗</a></article>`).join('')}
    const evidenceUpdated=get('evidenceUpdated'); if(evidenceUpdated&&data.evidence) evidenceUpdated.textContent=`${data.evidence.lastReviewed} 검토 · ${data.evidence.sources.length}개 자료 · 공식 기준과 인체 연구를 구분해 표시`;
    const gi=get('giGuardrails'); if(gi) gi.innerHTML=data.giTolerance.guardrails.map((item,index)=>`<div><span>0${index+1}</span>${escapeHtml(item)}</div>`).join('');
    const prep=get('prepTargets'); if(prep) prep.innerHTML=data.zeroPrep.targets.map(item=>`<span>${escapeHtml(item)}</span>`).join('');
    const status=get('statusTable'); if(status) status.innerHTML=data.developmentStatus.map(item=>`<div class="status-row"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.status)}</span><p>${escapeHtml(item.note)}</p></div>`).join('');
    const roleMap=[['브랜드가 맡는 일',data.responsibilities.brand],['제조사가 맡는 일',data.responsibilities.manufacturer],['함께 진행할 일',data.responsibilities.coDevelopment]];
    const roleRoot=get('roleCards'); if(roleRoot) roleRoot.innerHTML=roleMap.map(([title,items])=>`<article class="role-card"><h3>${title}</h3><ul>${list(items)}</ul></article>`).join('');
    const questions=get('questions'); if(questions) questions.innerHTML=data.manufacturerQuestions.map((item,index)=>`<div class="question-row"><b>${String(index+1).padStart(2,'0')}</b><strong>${escapeHtml(item.question)}</strong><span>${escapeHtml(item.status)}</span></div>`).join('');
    const gates=get('gateRail'); if(gates){const items=[['시장 조사',data.nextGate.market],['소비자 확인',data.nextGate.consumer],['제품 설계',data.nextGate.architecture],['제조 가능성',data.nextGate.manufacturing],['시제품',data.nextGate.prototype]];gates.innerHTML=items.map(([name,status])=>`<div class="gate-step ${status==='IN PROGRESS'||status==='NEXT'?'current':''}"><b>${name}</b><span>${escapeHtml(status)}</span></div>`).join('')}
    const actionRoot=get('nextActions'); if(actionRoot) actionRoot.innerHTML=list(data.nextGate.actions);
    document.querySelectorAll('[data-project-name]').forEach(node=>{node.textContent=project.name});
    document.querySelectorAll('[data-concept-why]').forEach(node=>{node.textContent=concept.why});
  }
  function renderMarket(data){
    const candidates=get('marketCandidates'); if(candidates) candidates.innerHTML=data.candidates.map(item=>`<div class="market-candidate"><b>${escapeHtml(item.number)}</b><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.signal)} · ${escapeHtml(item.experience)}</span><span>${escapeHtml(item.fit)}</span></div>`).join('');
    const axes=get('marketAxes'); if(axes) axes.innerHTML=data.selectionAxes.map(item=>`<span>${escapeHtml(item)}</span>`).join('');
    const limits=get('marketLimits'); if(limits) limits.innerHTML=list(data.limits);
    const meta=get('marketMeta'); if(meta) meta.innerHTML=`<strong>${escapeHtml(data.sampleSize)}</strong><span>${escapeHtml(data.scope)} · ${escapeHtml(data.snapshotAt)}</span>`;
    const alternatives=get('alternatives'); if(alternatives) alternatives.innerHTML=data.alternatives.map(item=>`<div class="market-candidate"><b>↗</b><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.tradeoff)}</span><span>비교 대안</span></div>`).join('');
    const quality=get('dataQualitySummary'); if(quality&&data.dataQuality) quality.textContent=`표본 단위 ${data.dataQuality.unit} · ${data.dataQuality.captureDate} 기준 · 기록 항목 ${data.dataQuality.recordedFields.length}개 · ${data.dataQuality.interpretation}`;
  }
  Promise.all([fetch(`${root}/data/product-brief.json`).then(response=>{if(!response.ok)throw Error('brief');return response.json()}),fetch(`${root}/data/market-data.json`).then(response=>{if(!response.ok)throw Error('market');return response.json()})]).then(([brief,market])=>{renderBrief(brief);renderMarket(market);document.documentElement.dataset.dataLoaded='true'}).catch(()=>{document.documentElement.dataset.dataLoaded='fallback'});
})();
