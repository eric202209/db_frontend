"use strict";(self.webpackChunkdb_frontend=self.webpackChunkdb_frontend||[]).push([[396,764,640],{396:(e,t,a)=>{a.r(t),a.d(t,{default:()=>n});a(43);var s=a(764),l=a(640),r=a(579);const n=e=>{let{data:t}=e;const a=[{key:"avgConsMake",title:"Average Consumption",type:"line"},{key:"co2ByClass",title:"CO2 Emissions by Vehicle Class",type:"bar"},{key:"fuelTypeDist",title:"Fuel Type Distribution",type:"bar"},{key:"bestSmog",title:"Best Smog Ratings",type:"bar"},{key:"consByTrans",title:"Consumption by Transmission",type:"bar"},{key:"co2RatingPct",title:"CO2 Rating Percentages",type:"pie"},{key:"topLowCo2",title:"Top Low CO2 Emitters",type:"bar"},{key:"topEfficient",title:"Top Efficient Vehicles",type:"line"}],n=(e,t)=>{if(!e||0===e.length)return[];if(!a.find((e=>e.key===t)))return[];const s=e.map((e=>{const a=Object.keys(e);let s,l;switch(t){case"fuelTypeDist":case"avgConsMake":case"co2ByClass":case"consByTrans":case"topLowCo2":s=1,l=2;break;case"bestSmog":case"topEfficient":s=2,l=3;break;case"co2RatingPct":s=1,l=3;break;default:return null}return{label:e[a[s]],value:parseFloat(e[a[l]])}})).filter(Boolean);return s.sort(((e,t)=>e.value-t.value)),s};return(0,r.jsxs)("div",{className:"analysis-results",children:[(0,r.jsx)("h2",{children:"Analysis Results"}),a.map((e=>(0,r.jsxs)("div",{className:"chart-section",children:[(0,r.jsx)("h3",{children:e.title}),(0,r.jsx)(s.default,{data:n(t[e.key],e.key),type:e.type,title:e.title}),(0,r.jsx)(l.default,{data:t[e.key]})]},e.key)))]})}},764:(e,t,a)=>{a.r(t),a.d(t,{default:()=>n});a(43);var s=a(58),l=a(658),r=a(579);l.t1.register(l.PP,l.kc,l.FN,l.No,l.E8,l.Bs,l.hE,l.m_,l.s$);const n=e=>{let{data:t,type:a,title:l}=e;if(!t||0===t.length)return(0,r.jsx)("div",{children:"No data available for this chart."});const n=t.map((e=>e.label)),i=t.map((e=>e.value)),o=e=>{const t=["rgba(75,192,192,0.6)","rgba(255,99,132,0.6)","rgba(255,206,86,0.6)","rgba(54,162,235,0.6)","rgba(153,102,255,0.6)","rgba(255,159,64,0.6)"];return Array(e).fill().map(((e,a)=>t[a%t.length]))},c={labels:n,datasets:[{label:l,data:i,backgroundColor:"pie"===a?o(i.length):o(1)[0],borderColor:"line"===a?o(1)[0]:"rgba(75,192,192,1)",borderWidth:1}]},d={responsive:!0,plugins:{legend:{position:"top"},title:{display:!0,text:l},tooltip:{callbacks:{label:e=>"".concat(e.parsed.y||e.parsed)}}},scales:"pie"!==a?{y:{beginAtZero:!0}}:{}};return(0,r.jsx)("div",{className:"chart-container",children:(()=>{switch(a){case"bar":default:return(0,r.jsx)(s.yP,{data:c,options:d});case"line":return(0,r.jsx)(s.N1,{data:c,options:d});case"pie":return(0,r.jsx)(s.Fq,{data:c,options:d})}})()})}},640:(e,t,a)=>{a.r(t),a.d(t,{default:()=>l});a(43);var s=a(579);const l=e=>{let{data:t,onComparisonToggle:a}=e;if(!t||0===t.length)return(0,s.jsx)("p",{children:"No data available."});const l=Object.keys(t[0]);return(0,s.jsxs)("table",{className:"data-table",children:[(0,s.jsx)("thead",{children:(0,s.jsxs)("tr",{children:[l.map((e=>(0,s.jsx)("th",{children:e},e))),(0,s.jsx)("th",{children:"Compare"})]})}),(0,s.jsx)("tbody",{children:t.map(((e,t)=>(0,s.jsxs)("tr",{children:[l.map((t=>(0,s.jsx)("td",{children:e[t]},t))),(0,s.jsx)("td",{children:(0,s.jsx)("button",{onClick:()=>a(e),children:"Compare"})})]},t)))})]})}}}]);
//# sourceMappingURL=396.de0e35d5.chunk.js.map