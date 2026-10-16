(() => {
 if(document.documentElement.lang!=='fa')return;
 const digits='۰۱۲۳۴۵۶۷۸۹';
 const skip='script,style,input,textarea,code,kbd,pre,[data-keep-latin],bdi[lang="en"]';
 function localize(node){
  if(node.nodeType===Node.TEXT_NODE){
   if(!node.parentElement||node.parentElement.closest(skip))return;
   const next=node.data.replace(/(?<![A-Za-z0-9])\d+(?![A-Za-z0-9])/g,part=>part.replace(/\d/g,d=>digits[d]));
   if(next!==node.data)node.data=next;
   return;
  }
  if(node.nodeType!==Node.ELEMENT_NODE||node.matches(skip))return;
  const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
  const texts=[];while(walker.nextNode())texts.push(walker.currentNode);
  texts.forEach(localize);
 }
 localize(document.body);
 new MutationObserver(records=>{
  records.forEach(record=>{
   if(record.type==='characterData')localize(record.target);
   else record.addedNodes.forEach(localize);
  });
 }).observe(document.body,{subtree:true,childList:true,characterData:true});
})();
