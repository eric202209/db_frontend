"use strict";(self.webpackChunkdb_frontend=self.webpackChunkdb_frontend||[]).push([[764],{764:(e,r,t)=>{t.r(r),t.d(r,{default:()=>o});t(43);var a=t(58),n=t(658),i=t(579);n.t1.register(n.PP,n.kc,n.FN,n.No,n.E8,n.Bs,n.hE,n.m_,n.s$);const s=e=>{const r=["rgba(75,192,192,0.6)","rgba(255,99,132,0.6)","rgba(255,206,86,0.6)","rgba(54,162,235,0.6)","rgba(153,102,255,0.6)","rgba(255,159,64,0.6)"];return Array(e).fill().map(((e,t)=>r[t%r.length]))},o=e=>{let{data:r,type:t,title:n}=e;if(console.log("Rendering chart for ".concat(n,":"),r),!r||!Array.isArray(r)||0===r.length)return(0,i.jsx)("div",{children:"No data available for this chart."});const o=r.map((e=>e.label)),l=r.map((e=>e.value)),c={labels:o,datasets:[{label:n,data:l,backgroundColor:"pie"===t?s(l.length):s(1)[0],borderColor:"line"===t?s(1)[0]:"rgba(75,192,192,1)",borderWidth:1}]},d={responsive:!0,plugins:{legend:{position:"top"},title:{display:!0,text:n},tooltip:{callbacks:{label:e=>{let r=e.label||"";return r&&(r+=": "),null!==e.parsed.y&&(r+=new Intl.NumberFormat("en-US",{minimumFractionDigits:2,maximumFractionDigits:2,style:"pie"===t?"percent":"decimal"}).format("pie"===t?e.parsed/100:e.parsed)),r}}}},scales:"pie"!==t?{y:{beginAtZero:!0,ticks:{callback:function(e){return"CO2 Rating Percentages"===n?e.toFixed(2)+"%":"Top Low CO2 Vehicles"===n||"CO2 Emissions by Vehicle Class"===n?e.toFixed(2)+" g/km":"Consumption by Transmission"===n||n.includes("Consumption")?e.toFixed(2)+" L/100km":e}}}}:{}};return(0,i.jsx)("div",{className:"chart-container",children:(()=>{try{switch(t){case"bar":default:return(0,i.jsx)(a.yP,{data:c,options:d});case"line":return(0,i.jsx)(a.N1,{data:c,options:d});case"pie":return(0,i.jsx)(a.Fq,{data:c,options:d})}}catch(e){return console.error("Error rendering chart:",e),(0,i.jsx)("div",{children:"Error rendering chart. Check console for details."})}})()})}}}]);
//# sourceMappingURL=764.79852625.chunk.js.map