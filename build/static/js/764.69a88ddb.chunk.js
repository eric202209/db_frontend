"use strict";(self.webpackChunkdb_frontend=self.webpackChunkdb_frontend||[]).push([[764],{764:(e,a,s)=>{s.r(a),s.d(a,{default:()=>c});var t=s(43),r=s(58),l=s(393),o=s(242),n=s(579);l.t1.register(l.PP,l.kc,l.E8,l.hE,l.m_,l.s$,l.Bs,l.FN,l.No,o.Ay);const c=e=>{let{data:a=[],title:s,type:l}=e;if(!a||0===a.length)return(0,n.jsx)("div",{children:"No data available for this chart."});const[o,c]=(0,t.useState)(null),i={labels:Array.isArray(a)?a.map((e=>e.make||e.vehClass||e.fuelType||e.trans||e.co2Rating||"")):[],datasets:[{label:s,data:Array.isArray(a)?a.map((e=>e.avgCons||e.combCons||e.count||e.avgCo2||e.percentage||0)):[],backgroundColor:"rgba(75,192,192,0.6)",borderColor:"rgba(75,192,192,1)",borderWidth:1,hoverBackgroundColor:"rgba(75,192,192,0.4)",hoverBorderColor:"rgba(75,192,192,1)"}]},d={scales:{y:{beginAtZero:!0}},onClick:(e,s)=>{if(s.length>0){const e=s[0].index;c(a[e])}},responsive:!0,plugins:{legend:{position:"top"},title:{display:!0,text:s},zoom:{zoom:{wheel:{enabled:!0},pinch:{enabled:!0},mode:"xy"}},tooltip:{callbacks:{label:function(e){let a=e.dataset.label||"";return a&&(a+=": "),null!==e.parsed.y&&(a+=new Intl.NumberFormat("en-US",{style:"decimal"}).format(e.parsed.y)),a}}}}};let b;switch(l){case"fuelTypeDist":case"co2RatingPct":b=r.Fq;break;case"consByTrans":case"co2ByClass":b=r.N1;break;default:b=r.yP}return(0,n.jsxs)("div",{className:"chart",children:[(0,n.jsx)("h2",{children:s}),(0,n.jsx)(b,{data:i,options:d}),o&&(0,n.jsxs)("div",{className:"detail-view",children:[(0,n.jsx)("h3",{children:o.make||o.vehClass||o.fuelType||o.trans||o.co2Rating}),(0,n.jsxs)("p",{children:["Value: ",o.avgCons||o.combCons||o.count||o.avgCo2||o.percentage]})]})]})}}}]);
//# sourceMappingURL=764.69a88ddb.chunk.js.map