import {readFile,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve,relative} from 'node:path';

const root=process.cwd();
const read=path=>readFile(resolve(root,path),'utf8');
const fail=message=>{throw new Error(`Public brief invalid: ${message}`)};
const index=await read('index.html');
const gate=await read('gate1-market.html');
const gateScript=await read('assets/gate1-market.js');
const contrastStyles=await read('assets/contrast-overrides.css');
const evidenceStyles=await read('assets/evidence.css');
const brief=JSON.parse(await read('data/product-brief.json'));
const market=JSON.parse(await read('data/market-data.json'));
const snapshot=JSON.parse(await read('data/PUBLIC_STATUS_SNAPSHOT_20260910.json'));
const forbidden=['LI'+'GHT','DAI'+'LY','FU'+'LL','아침'+' 상태별'];
const required=['MEAL GAP','WHY PORRIDGE','MARKET EVIDENCE','THREE BASE RECIPES','MORNING 7 NUTRITION STANDARD','CELLPINDA SCIENCE','GI TOLERANCE DESIGN','ZERO PREP EXPERIENCE','개발 현황','BRAND × MANUFACTURER','MANUFACTURER RESPONSE REQUIRED','DEVELOPMENT GATE','EVIDENCE / SOURCE'];
for(const marker of required)if(!index.includes(marker))fail(`index missing ${marker}`);
if(!index.includes('./assets/styles.css')||!index.includes('./assets/site.js'))fail('index asset links missing');
if(!index.includes('./assets/contrast-overrides.css')||!gate.includes('./assets/contrast-overrides.css'))fail('contrast override links missing');
for(const selector of ['.section.sage .prep-flow strong','.section.sage .prep-targets span'])if(!contrastStyles.includes(selector))fail(`contrast override missing ${selector}`);
if(!index.includes('./assets/evidence.css')||!gate.includes('./assets/evidence.css'))fail('evidence stylesheet links missing');
for(const selector of ['.evidence-register','.evidence-grid','.evidence-card'])if(!evidenceStyles.includes(selector))fail(`evidence style missing ${selector}`);
if(!index.includes('id="evidenceRegistry"')||!index.includes('id="evidenceUpdated"'))fail('evidence registry mount missing');
if(!gate.includes('id="dataQualitySummary"'))fail('market data quality mount missing');
if(!brief.evidence||brief.evidence.sources.length<5)fail('evidence registry is incomplete');
for(const source of brief.evidence.sources){for(const field of ['type','year','title','publisher','design','sample','measure','consumerSummary','use','url'])if(!source[field])fail(`evidence source ${source.id||source.title} missing ${field}`);if(!/^https:\/\//.test(source.url))fail(`evidence source ${source.id||source.title} must use https`)}
if(!market.dataQuality||market.dataQuality.unit!=='SKU'||!market.dataQuality.captureDate)fail('market data quality metadata is incomplete');
if(!gate.includes('./assets/gate1-market.js')||!gateScript.includes('./data/market-data.json'))fail('market page data links missing');
if(brief.products.length!==3)fail('exactly three base recipe candidates are required');
if(brief.manufacturerQuestions.length!==20)fail('exactly twenty manufacturer questions are required');
if(!['LOCKED','TARGET','TEST','PARTNER PROPOSAL'].every(status=>brief.developmentStatus.some(item=>item.status===status)))fail('status system is incomplete');
if(snapshot.project.name!==brief.project.name)fail('public status name does not match product brief');
if(!market.candidates.length||market.sampleSize!=='80 SKU')fail('market evidence snapshot is incomplete');
for(const product of brief.products){if(!existsSync(resolve(root,product.image.replace('./',''))))fail(`missing product asset ${product.id}`)}
const files=[];
async function walk(directory){for(const entry of await readdir(directory,{withFileTypes:true})){if(entry.name==='.git')continue;const path=resolve(directory,entry.name);if(entry.isDirectory())await walk(path);else if(/\.(html|json|js|md|css)$/.test(entry.name))files.push(path)}}
await walk(root);
for(const file of files){const source=await readFile(file,'utf8');for(const word of forbidden)if(source.includes(word))fail(`legacy concept remains in ${relative(root,file)}`)}
console.log(JSON.stringify({status:'ok',sections:14,products:brief.products.length,manufacturerQuestions:brief.manufacturerQuestions.length,marketSample:market.sampleSize,legacyConcepts:0,nextGate:brief.nextGate.next}));
