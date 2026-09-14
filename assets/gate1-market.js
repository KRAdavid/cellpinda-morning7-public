(function(){
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const get=id=>document.getElementById(id);
  fetch('./data/market-data.json').then(r=>{if(!r.ok)throw Error('market');return r.json()}).then(data=>{
    if(get('metricSku'))get('metricSku').textContent=data.sampleSize;
    if(get('metricCandidates'))get('metricCandidates').textContent=`${data.candidates.length}종`;
    if(get('metricDate'))get('metricDate').textContent=data.snapshotAt;
    if(get('metricSales'))get('metricSales').textContent='미확인';
    if(get('marketTable'))get('marketTable').innerHTML=data.candidates.map(item=>`<tr><td>${esc(item.number)} · ${esc(item.name)}</td><td>${esc(item.category)}</td><td>${esc(item.signal)}</td><td>${esc(item.experience)}</td><td>${esc(item.fit)}</td><td>${esc(item.source)}</td></tr>`).join('');
    if(data.priceReviewComparison){const items=data.priceReviewComparison.items;const maxReviews=Math.max(...items.map(item=>item.reviews));const maxPrice=Math.max(...items.map(item=>item.pricePer100g));if(get('priceReviewSummary'))get('priceReviewSummary').innerHTML=`<div class="price-review-meta"><strong>${esc(data.priceReviewComparison.scope)}</strong><span>${esc(data.priceReviewComparison.unit)}</span></div>`;if(get('priceReviewChart'))get('priceReviewChart').innerHTML=items.map(item=>`<div class="price-review-row"><div class="price-review-name"><strong>${esc(item.name)}</strong><span>${esc(item.category)}</span></div><div class="price-review-bars"><div class="bar-line"><span>리뷰 ${item.reviews.toLocaleString('ko-KR')}</span><i style="width:${Math.max(2,item.reviews/maxReviews*100)}%"></i></div><div class="bar-line price"><span>${item.pricePer100g.toLocaleString('ko-KR')}원 / 100g</span><i style="width:${Math.max(2,item.pricePer100g/maxPrice*100)}%"></i></div></div></div>`).join('')}
    if(get('axisGrid'))get('axisGrid').innerHTML=data.selectionAxes.map(axis=>{const copy={'MARKET FAMILIARITY':'소비자가 이미 알고 있는 메뉴와 맛인가?','FOOD EXPERIENCE':'한 팩을 끝까지 먹고 싶은 경험인가?','MANUFACTURING FIT':'기존 설비와 공정에서 시험할 수 있는가?'}[axis]||'';return `<article><strong>${esc(axis)}</strong><span>${esc(copy)}</span></article>`}).join('');
    if(get('marketLimits'))get('marketLimits').innerHTML=data.limits.map(item=>`<div class="limit-card">${esc(item)}</div>`).join('');
    if(get('alternativeList'))get('alternativeList').innerHTML=data.alternatives.map(item=>`<div class="market-candidate"><b>↗</b><strong>${esc(item.name)}</strong><span>${esc(item.tradeoff)}</span></div>`).join('');
  }).catch(()=>{document.querySelectorAll('.loading').forEach(node=>{node.textContent='시장 자료를 불러오지 못했습니다.'})});
})();
