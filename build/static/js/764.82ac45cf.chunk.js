"use strict";(self.webpackChunkdb_frontend=self.webpackChunkdb_frontend||[]).push([[764],{764:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});r(43);var a=r(58),s=r(658),i=r(579);s.t1.register(s.PP,s.kc,s.FN,s.No,s.E8,s.Bs,s.hE,s.m_,s.s$);const o=e=>{const t=["rgba(75,192,192,0.6)","rgba(255,99,132,0.6)","rgba(255,206,86,0.6)","rgba(54,162,235,0.6)","rgba(153,102,255,0.6)","rgba(255,159,64,0.6)"];return Array(e).fill().map(((e,r)=>t[r%t.length]))},n=e=>{let{data:t,type:r,title:s}=e;if(console.log("Rendering chart for ".concat(s,":"),t),!t||!Array.isArray(t)||0===t.length)return(0,i.jsx)("div",{children:"No data available for this chart."});const n=t.map((e=>e.label||"Undefined")),l=t.map((e=>{const t=parseFloat(e.value);return isNaN(t)?0:t})),c={labels:n,datasets:[{label:s,data:l,backgroundColor:"pie"===r?o(l.length):o(1)[0],borderColor:"line"===r?o(1)[0]:"rgba(75,192,192,1)",borderWidth:1}]},d={responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"top",labels:{font:{size:14,weight:"bold"}}},title:{display:!0,text:s,font:{size:18,weight:"bold"}},tooltip:{callbacks:{label:e=>{let t,a=e.label||"";return a&&(a+=": "),t="pie"===r?e.parsed:e.parsed.y,null===t||isNaN(t)?a+="N/A":(t=parseFloat(t),"CO2 Rating Percentages"===s?a+=t.toFixed(2)+"%":"Top Low CO2 Vehicles"===s||"CO2 Emissions by Vehicle Class"===s?a+=t.toFixed(2)+" g/km":"Consumption by Transmission"===s||s.includes("Consumption")?a+=t.toFixed(2)+" L/100km":a+=t.toFixed(2)),a}}}},scales:"pie"!==r?{y:{beginAtZero:!0,ticks:{font:{size:12},callback:function(e){return null===e||isNaN(e)?"N/A":(e=parseFloat(e),"CO2 Rating Percentages"===s?e.toFixed(2)+"%":"Top Low CO2 Vehicles"===s||"CO2 Emissions by Vehicle Class"===s?e.toFixed(2)+" g/km":"Consumption by Transmission"===s||s.includes("Consumption")?e.toFixed(2)+" L/100km":e.toFixed(2))}},grid:{color:"rgba(0, 0, 0, 0.1)"}},x:{ticks:{font:{size:12}},grid:{color:"rgba(0, 0, 0, 0.1)"}}}:{}};return(0,i.jsx)("div",{className:"chart-container",children:(()=>{try{switch(r){case"bar":default:return(0,i.jsx)(a.yP,{data:c,options:d});case"line":return(0,i.jsx)(a.N1,{data:c,options:d});case"pie":return(0,i.jsx)(a.Fq,{data:c,options:d})}}catch(e){return console.error("Error rendering chart:",e),(0,i.jsx)("div",{children:"Error rendering chart. Check console for details."})}})()})}}}]);
//# sourceMappingURL=764.82ac45cf.chunk.js.map