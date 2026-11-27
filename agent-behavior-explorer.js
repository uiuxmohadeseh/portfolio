const agentExplorerIcons = {
 message:'<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5A8.5 8.5 0 1 1 21 11.5Z"/>',
 help:'<circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 0 1 4.9.7c0 1.7-2.6 2-2.6 3.5M12 17h.01"/>',
 messages:'<path d="M4 16l-1 4 4-1h9a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4z"/><path d="M8 9h8M8 13h6"/>',
 graduation:'<path d="m2 9 10-5 10 5-10 5zM6 11v5c3 3 9 3 12 0v-5M22 9v6"/>',
 heart:'<path d="M20.8 5.8a4.5 4.5 0 0 0-6.4 0L12 8.2 9.6 5.8a4.5 4.5 0 0 0-6.4 6.4l8.8 8.3 8.8-8.3a4.5 4.5 0 0 0 0-6.4Z"/><path d="m8 13 2 2 4-4"/>',
 activity:'<path d="M3 12h4l3-7 4 14 3-7h4"/>',
 shieldcheck:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
 layers:'<path d="m12 3 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 16l9 5 9-5"/>',
 book:'<path d="M12 7c-2.5-2-5.5-2-9-1v12c3.5-1 6.5-1 9 1m0-12c2.5-2 5.5-2 9-1v12c-3.5-1-6.5-1-9 1m0-12v12"/>',
 shield:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/>',
 robot:'<rect x="4" y="6" width="16" height="13" rx="3"/><path d="M12 3v3M8 12h.01M16 12h.01M9 16h6M2 11v4M22 11v4"/>'
};
const explorerIcon = name => `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${agentExplorerIcons[name]}</svg>`;

class AgentBehaviorExplorer {
  constructor(root, scenarios) {
    this.root=root; this.scenarios=scenarios; this.index=1; this.render(); this.bind(); this.select(1);
  }
  render() {
    this.root.innerHTML=`<header class="abe-header"><div><p class="abe-eyebrow">Interactive design explorer</p><h3>Explore Ravin's Behavior</h3><p>Explore how Ravin is designed to respond to different interaction scenarios and discover the reasoning behind each behavioral decision.</p></div><span class="abe-header-icon">${explorerIcon('robot')}</span></header>
    <div class="abe-options" role="group" aria-label="Behavior scenarios">${this.scenarios.map((s,i)=>`<button type="button" class="abe-option" data-scenario="${i}" aria-pressed="false"><span class="abe-option-number">${s.number}</span>${explorerIcon(s.icon)}<span>${s.title}</span><span class="abe-check" aria-hidden="true">✓</span></button>`).join('')}</div>
    <div class="abe-detail"><p class="abe-eyebrow" data-number></p><h4 data-title></h4><div class="abe-meta"><div><h5>Trigger</h5><p data-trigger></p></div><div><h5>Expected behavior</h5><p data-behavior></p></div></div>
    <section class="abe-conversation" aria-label="Response example"><h5>Response example</h5><p class="abe-note">Illustrative examples of intended behavior</p><div class="abe-messages" data-messages></div></section>
    <details class="abe-rationale" open><summary>Show design rationale</summary><h5>Why this behavior?</h5><p data-rationale></p></details>
    <nav class="abe-navigation" aria-label="Scenario navigation"><button type="button" data-prev>← <span>Previous</span></button><span data-count></span><button type="button" data-next><span>Next</span> →</button></nav></div>`;
    this.buttons=[...this.root.querySelectorAll('[data-scenario]')];
  }
  bind() {
    this.buttons.forEach((button,i)=>{button.addEventListener('click',()=>this.select(i));button.addEventListener('keydown',e=>{let next;if(e.key==='ArrowDown')next=Math.min(i+2,9);if(e.key==='ArrowUp')next=Math.max(i-2,0);if(e.key==='ArrowRight')next=Math.min(i+1,9);if(e.key==='ArrowLeft')next=Math.max(i-1,0);if(e.key==='Home')next=0;if(e.key==='End')next=9;if(next!==undefined){e.preventDefault();this.buttons[next].focus();this.select(next);}})});
    this.root.querySelector('[data-prev]').addEventListener('click',()=>this.select(this.index-1));
    this.root.querySelector('[data-next]').addEventListener('click',()=>this.select(this.index+1));
  }
  select(index) {
    if(index<0||index>=this.scenarios.length)return; this.index=index; const s=this.scenarios[index];
    this.buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
    const put=(name,value)=>this.root.querySelector(`[data-${name}]`).textContent=value;
    put('number',`Scenario ${s.number}`); put('title',s.title); put('trigger',s.trigger); put('behavior',s.expectedBehavior); put('rationale',s.rationale); put('count',`${s.number} / ${String(this.scenarios.length).padStart(2,'0')}`);
    this.root.querySelector('[data-prev]').disabled=index===0; this.root.querySelector('[data-next]').disabled=index===this.scenarios.length-1;
    this.renderMessages(s);
  }
  renderMessages(s) {
    const area=this.root.querySelector('[data-messages]'); area.replaceChildren();
    s.messages.forEach((m,i)=>{const row=document.createElement('div');row.className=`abe-message abe-message--${m.role}`;row.style.setProperty('--message-order',i);if(m.role==='assistant'){const avatar=document.createElement('span');avatar.className='abe-avatar';avatar.innerHTML=explorerIcon('robot');row.append(avatar)}const body=document.createElement('div');body.className='abe-message__body';const label=document.createElement('span');label.className='abe-message__label';label.textContent=m.role==='assistant'?'Ravin':m.role==='system'?'System status':'User';const text=document.createElement('p');text.textContent=m.content;body.append(label,text);row.append(body);area.append(row)});
    if(s.recoveryAction){const retry=document.createElement('button');retry.type='button';retry.className='abe-retry';retry.textContent=s.recoveryAction;retry.addEventListener('click',()=>{this.renderMessages(s);area.querySelector('.abe-retry').focus();});area.append(retry)}
  }
}
document.querySelectorAll('[data-agent-behavior-explorer]').forEach(root=>new AgentBehaviorExplorer(root,ravinScenarios));
