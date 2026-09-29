import{n as e}from"./rolldown-runtime.js";import{$ as t,A as n,At as r,B as i,C as a,Ct as o,D as s,Dt as c,E as l,Er as u,Et as d,F as f,Ft as ee,G as te,H as ne,Hn as p,I as re,It as m,J as ie,K as ae,L as oe,Lt as se,M as ce,Mt as h,N as g,Nt as le,O as ue,Ot as de,P as fe,Pt as pe,Q as _,R as me,Rt as he,S as ge,St as _e,T as ve,Tr as v,Tt as y,U as ye,V as be,Vn as b,W as xe,X as Se,Y as Ce,Z as x,_ as we,_t as Te,a as Ee,at as De,b as Oe,bt as S,c as ke,ct as Ae,d as je,dt as Me,er as Ne,et as Pe,f as Fe,ft as Ie,g as Le,gt as C,h as Re,ht as ze,i as Be,it as Ve,j as He,jt as w,k as Ue,kt as T,l as We,lt as Ge,m as E,mt as Ke,n as D,nt as O,o as qe,ot as Je,p as Ye,pt as k,q as Xe,r as Ze,rt as Qe,s as $e,st as et,t as tt,tt as nt,u as rt,ut as it,v as at,w as ot,x as st,xt as ct,y as lt,yt as ut,z as dt}from"./viewer.js";var ft=e({acuiRegisterSimpleUiPlugin:()=>pt});async function pt(e,t={}){let{acuiCreateSimpleUiPlugin:n}=await he(async()=>{let{acuiCreateSimpleUiPlugin:e}=await Promise.resolve().then(()=>mt);return{acuiCreateSimpleUiPlugin:e}},void 0,import.meta.url);await e.loadPlugin(n(t))}var mt=e({AcApSimpleUiPlugin:()=>hn,AcUiI18n:()=>tn,SIMPLE_UI_PLUGIN_NAME:()=>Ht,acuiCreateDefaultToolbarItems:()=>V,acuiCreateDefaultToolbarPresetMap:()=>W,acuiCreatePhoneToolbarItems:()=>H,acuiCreateSettingsToolbarItem:()=>B,acuiCreateSimpleUiPlugin:()=>gn,acuiCreateZoomToolbarItem:()=>z,acuiMergeToolbarOptionsForLayout:()=>M,acuiPrependToolbarLayoutSwitcher:()=>j,acuiRegisterSimpleUiI18n:()=>en,acuiResolveToolbarItems:()=>G}),ht={version:`1.7.3`},A=class{constructor(e,t=`layers`){this.dockPanel=e,this.layersTabId=t,this.handleCloseLayerManager=()=>{this.hide()},C.on(`close-layer-manager`,this.handleCloseLayerManager)}toggleFromCommand(){this.dockPanel.hasTab(this.layersTabId)&&this.dockPanel.open(this.layersTabId)}hide(){this.dockPanel.close()}refreshLocale(){this.dockPanel.refreshLocale()}destroy(){C.off(`close-layer-manager`,this.handleCloseLayerManager)}},gt=class{toggleFromCommand(){var e;(e=this.current)==null||e.toggleFromCommand()}hide(){var e;(e=this.current)==null||e.hide()}refreshLocale(){var e;(e=this.current)==null||e.refreshLocale()}},_t=class extends _{constructor(e){super(),this.actions=e}async execute(e){this.actions.prepare(),this.actions.toggle()}},vt=class extends _{constructor(e){super(),this.actions=e}async execute(e){this.actions.prepare(),this.actions.toggle()}},yt=class extends _{constructor(e){super(),this.actions=e}async execute(e){this.actions.prepare(),this.actions.toggle()}};function j(e,t){return[t,{type:`separator`,id:`toolbar-layout-switcher-separator`},...e]}var bt=[`select`,`pan`];function xt(e){if(e===`phone`)return{enabled:!0,placement:`bottom`,items:`default`,collapsible:!1,defaultCollapsed:!1,edgeOffset:0,sideOffset:0,showLabels:!0,size:`stretch`,overflow:`menu`,showBorder:!0,showButtonBorder:!1,showSeparators:!0,showChildrenIndicator:!1,subToolbar:{showLabels:!0,showSeparators:!1,size:`stretch`,overflow:`wrap`,replaceOnNested:!0}};let t={enabled:!0,placement:`right`,items:`default`,collapsible:!1,defaultCollapsed:!1,edgeOffset:8,sideOffset:0,showLabels:!1,size:`auto`,overflow:`menu`,showBorder:!0,showButtonBorder:!1,showSeparators:!0,showChildrenIndicator:!0,subToolbar:{replaceOnNested:!1}};return e===`pad`?{...t,excludeItems:[...bt]}:t}var St=[`mountTarget`,`enabled`,`inCanvasParent`,`showButtonBorder`];function M(e,t,n){let r=xt(e),i={};if(t){if(e===`phone`)for(let e of St)t[e]!==void 0&&(i[e]=t[e]);else Object.assign(i,t)}return{...r,...i,...n}}function Ct(e={}){let t=e.dockPanel?.enabled===!0;return{host:e.host,layout:e.layout??`auto`,layouts:e.layouts??{},dockPanel:{enabled:t,defaultOpen:e.dockPanel?.defaultOpen??!1,defaultSide:e.dockPanel?.defaultSide??`left`,defaultHeight:e.dockPanel?.defaultHeight??240,defaultWidth:e.dockPanel?.defaultWidth??280},toolbar:{enabled:e.toolbar?.enabled===!1?!1:e.toolbar?.enabled??!0,placement:e.toolbar?.placement??`right`,items:e.toolbar?.items??`default`,...e.toolbar&&`excludeItems`in e.toolbar?{excludeItems:e.toolbar.excludeItems}:{},appendItems:e.toolbar?.appendItems,appendItemsAfter:e.toolbar?.appendItemsAfter,appendItemsBefore:e.toolbar?.appendItemsBefore,collapsible:e.toolbar?.collapsible??!1,defaultCollapsed:e.toolbar?.defaultCollapsed??!1,edgeOffset:e.toolbar?.edgeOffset??8,sideOffset:e.toolbar?.sideOffset??0,showLabels:e.toolbar?.showLabels,size:e.toolbar?.size,overflow:e.toolbar?.overflow,showBorder:e.toolbar?.showBorder??!0,showButtonBorder:e.toolbar?.showButtonBorder??!1,showSeparators:e.toolbar?.showSeparators??!0,inCanvasParent:e.toolbar?.inCanvasParent===!0,subToolbar:e.toolbar?.subToolbar},shouldCreateDockPanel:t}}var wt=[`ml-ex-ui-dock-main`,`ml-ex-ui-toolbar-main`];function N(e,t,n=wt){let r=e;for(;r!==t&&r.parentElement&&n.some(e=>r.classList?.contains(e)===!0);)r=r.parentElement;return r}function P(e,t){if(t)return t;let n=h.instance.curView?.container?.parentElement;return n&&(n===e||e.contains(n))?N(n,e):e}function Tt(){let e=h.instance.curDocument?.database,t=e?.objects?.layout;if(!e||!(t!=null&&t.newIterator))return[];let n=[];for(let t of e.objects.layout.newIterator())n.push({name:t.layoutName,tabOrder:t.tabOrder,blockTableRecordId:t.blockTableRecordId,isActive:t.blockTableRecordId===e.currentSpaceId});return n.sort((e,t)=>e.tabOrder-t.tabOrder),n}function Et(e){Ne().layoutManager.setCurrentLayoutBtrId(e)}function Dt(){return Tt().map(e=>({id:`layout-${e.blockTableRecordId}`,label:e.name,action:()=>Et(e.blockTableRecordId),toggle:{getValue:()=>h.instance.curDocument?.database?.currentSpaceId===e.blockTableRecordId,on:{},off:{}}}))}function F(){return de({id:`layout`,label:`toolbar.layout`,icon:Re,requiresDocument:!0,childrenUi:`menu`,children:[]},Dt)}var Ot=[`top`,`bottom`,`left`,`right`],kt={top:f,bottom:ce,left:g,right:fe},At={top:`toolbar.placementTop`,bottom:`toolbar.placementBottom`,left:`toolbar.placementLeft`,right:`toolbar.placementRight`};function jt(e){return{id:`toolbar-placement`,label:`toolbar.placement`,icon:ae,requiresDocument:!1,childrenUi:`toolbar`,childIcon:`selected`,selectedChildId:`placement-${e?.getPlacement()??`right`}`,children:Ot.map(t=>({id:`placement-${t}`,label:At[t],icon:kt[t],requiresDocument:!1,action:()=>e?.setPlacement(t)}))}}var Mt=[`en`,`zh`,`cs`,`tr`,`ar`],Nt={en:`EN`,zh:`中`,cs:`CS`,tr:`TR`,ar:`AR`},Pt={en:`toolbar.localeEn`,zh:`toolbar.localeZh`,cs:`toolbar.localeCs`,tr:`toolbar.localeTr`,ar:`toolbar.localeAr`};function Ft(e){return`<span class="ml-ex-ui-locale-badge">${e}</span>`}function It(e){let t=e?.getLocale()??`en`;return{id:`locale`,label:`toolbar.locale`,icon:Ye,requiresDocument:!1,childrenUi:`toolbar`,childIcon:`selected`,selectedChildId:`locale-${t}`,children:Mt.map(t=>({id:`locale-${t}`,label:Pt[t],icon:Ft(Nt[t]),requiresDocument:!1,action:()=>e?.setLocale(t)}))}}function Lt(e){let t=()=>e?.getTheme()??`light`,n=()=>{let n=t()===`dark`?`light`:`dark`;e?.setTheme(n)};return{id:`theme`,requiresDocument:!1,toggle:{getValue:()=>t()===`light`,on:{label:`toolbar.themeLight`,icon:te,action:n},off:{label:`toolbar.themeDark`,icon:xe,action:n}}}}function Rt(){let e=()=>m.instance.toggle(`useSimulatedMouseOnTouch`);return{id:`simulated-mouse`,requiresDocument:!1,toggle:{getValue:()=>!!m.instance.get(`useSimulatedMouseOnTouch`),on:{label:`toolbar.simulatedMouseOn`,icon:ne,action:e},off:{label:`toolbar.simulatedMouseOff`,icon:ne,action:e}}}}function I(){try{return h.instance.isReadingModeEnabled()}catch{return!1}}function zt(){return{id:`reading-mode`,requiresDocument:!0,toggle:{getValue:I,on:{label:`toolbar.readingMode`,icon:re,command:`readingmode`},off:{label:`toolbar.readingMode`,icon:re,command:`readingmode`}}}}function L(){return{id:`measure`,label:`toolbar.measure`,icon:a,childrenUi:`toolbar`,children:[{id:`measure-distance`,label:`toolbar.measureDistance`,icon:Ue,command:`measuredistance`},{id:`measure-continuous`,label:`toolbar.measureContinuous`,icon:ue,command:`measurecontinuous`},{id:`measure-angle`,label:`toolbar.measureAngle`,icon:ve,command:`measureangle`},{id:`measure-area`,label:`toolbar.measureArea`,icon:s,command:`measurearea`},{id:`measure-arc`,label:`toolbar.measureArc`,icon:l,command:`measurearc`},{id:`measure-point`,label:`toolbar.measurePoint`,icon:n,command:`measurepoint`},{id:`measurement-panel`,label:`toolbar.measurementPanel`,icon:ot,command:`measurementpanel`},{id:`measurement-vis`,toggle:{getValue:Pe,on:{label:`toolbar.showMeasurements`,icon:Ze,command:`measurementvis`},off:{label:`toolbar.hideMeasurements`,icon:D,command:`measurementvis`}}},{id:`clear-measurements`,label:`toolbar.clearMeasurements`,icon:qe,command:`clearmeasurements`},{type:`separator`,id:`sep-measure-import-export`},{id:`measurement-import`,label:`toolbar.measurementImport`,icon:lt,command:`measurementimport`},{id:`measurement-export`,label:`toolbar.measurementExport`,icon:at,command:`measurementexport`}]}}function R(){return{id:`annotation`,label:`toolbar.annotation`,icon:tt,minOpenMode:Je.Review,childrenUi:`toolbar`,children:[{id:`markup-cloud`,label:`toolbar.markupCloud`,icon:me,command:`markupcloud`},{id:`markup-callout`,label:`toolbar.markupCallout`,icon:we,command:`markupcallout`},{id:`markup-text`,label:`toolbar.markupText`,icon:ge,command:`markuptext`},{id:`markup-rect`,label:`toolbar.markupRect`,icon:dt,command:`markuprect`},{id:`markup-circle`,label:`toolbar.markupCircle`,icon:oe,command:`markupcircle`},{id:`markup-arrow`,label:`toolbar.markupArrow`,icon:Le,command:`markuparrow`},{id:`markup-stamp`,label:`toolbar.markupStamp`,icon:st,command:`markupstamp`},{id:`markup-panel`,label:`toolbar.markupPanel`,icon:Oe,command:`markuppanel`},{id:`markup-vis`,toggle:{getValue:pe,on:{label:`toolbar.showMarkup`,icon:Ze,command:`markupvis`},off:{label:`toolbar.hideMarkup`,icon:D,command:`markupvis`}}},{id:`clear-markups`,label:`toolbar.clearMarkups`,icon:Ee,command:`clearmarkups`},{type:`separator`,id:`sep-markup-import-export`},{id:`markup-import`,label:`toolbar.markupImport`,icon:lt,command:`markupimport`},{id:`markup-export`,label:`toolbar.markupExport`,icon:at,command:`markupexport`}]}}function z(){return{id:`zoom`,label:`toolbar.zoom`,icon:Xe,childrenUi:`toolbar`,childIcon:`selected`,selectedChildId:`zoom-extent`,children:[{id:`zoom-saved`,label:`toolbar.zoomSaved`,icon:ie,command:`zoom
saved`},{id:`zoom-extent`,label:`toolbar.zoomExtent`,icon:Xe,command:`zoom
all`},{id:`zoom-smart-extents`,label:`toolbar.zoomSmartExtents`,icon:Ce,command:`zoom
smart`},{id:`zoom-window`,label:`toolbar.zoomWindow`,icon:Se,command:`zoom
window`}]}}function B(e){return{id:`settings`,label:`toolbar.settings`,icon:be,requiresDocument:!1,childrenUi:`toolbar`,children:[Rt(),jt(e),Lt(e),{id:`switch-bg`,label:`toolbar.switchBg`,icon:ye,command:`switchbg`,disabled:I},zt(),It(e)]}}function V(e){return[{id:`select`,label:`toolbar.select`,icon:i,command:`select`},{id:`pan`,label:`toolbar.pan`,icon:He,command:`pan`},z(),{id:`layer`,label:`toolbar.layer`,icon:E,command:`layer`},F(),L(),R(),{id:`export`,label:`toolbar.export`,icon:We,childrenUi:`toolbar`,children:[{id:`export-html`,label:`toolbar.exportHtml`,icon:rt,command:`chtml`},{id:`export-pdf`,label:`toolbar.exportPdf`,icon:je,command:`cpdf`},{id:`export-svg`,label:`toolbar.exportSvg`,icon:Fe,command:`csvg`}]},{type:`separator`,id:`sep-settings`},B(e)]}function H(e){return[z(),L(),{...R(),label:`toolbar.annotationShort`},{id:`layer`,label:`toolbar.layerShort`,icon:E,command:`layer`},F(),B(e)]}function U(e,t){var n;for(let r of e)le(r)||(t.has(r.id)||t.set(r.id,r),!De(r)&&(n=r.children)!=null&&n.length&&U(r.children,t))}function W(e,t=`desktop`){let n=new Map;S(V(e),n);let r=H(e);return t===`phone`?S(r,n):U(r,n),n}function Bt(e,t,n){if(!t.length)return e;let r=n?.before??n?.after;if(!r)return[...e,...t];let i=e.findIndex(e=>e.id===r);if(i===-1)return[...e,...t];let a=n!=null&&n.before?i:i+1;return[...e.slice(0,a),...t,...e.slice(a)]}function G(e,t,n=`desktop`){var r,i;let a=e??{},o=W(t,n),s;if(s=a.items==="default"||a.items==null?n===`phone`?H(t):V(t):ct(a.items,o),(r=a.appendItems)!=null&&r.length&&(s=Bt(s,ct(a.appendItems,o),{after:a.appendItemsAfter,before:a.appendItemsBefore})),(i=a.excludeItems)!=null&&i.length){let e=new Set(a.excludeItems);s=s.filter(t=>!t.id||!e.has(t.id))}return s}function Vt(e,t){if(t)return t;let n=h.instance.curView?.container,r=n?.parentElement;return r&&(r===e||e.contains(r))?N(r,e,[`ml-ex-ui-toolbar-main`]):n&&(n===e||e.contains(n))?n:e}var Ht=`SimpleUiPlugin`,Ut={"toolbar.select":`تحديد`,"toolbar.pan":`تحريك العرض`,"toolbar.zoom":`تكبير`,"toolbar.zoomExtent":`ملاءمة`,"toolbar.zoomSmartExtents":`ملاءمة ذكية`,"toolbar.zoomWindow":`نافذة`,"toolbar.zoomSaved":`محفوظ`,"toolbar.zoomOriginal":`محفوظ`,"toolbar.layer":`مدير الطبقات`,"toolbar.layerShort":`الطبقات`,"toolbar.layout":`المخطط`,"toolbar.settings":`الإعدادات`,"toolbar.simulatedMouseOn":`ماوس`,"toolbar.simulatedMouseOff":`عدسة`,"toolbar.measure":`القياس`,"toolbar.measureDistance":`مسافة`,"toolbar.measureContinuous":`مستمر`,"toolbar.measureAngle":`زاوية`,"toolbar.measureArea":`مساحة`,"toolbar.measureArc":`قوس`,"toolbar.measurePoint":`XY`,"toolbar.showMeasurements":`إظهار`,"toolbar.hideMeasurements":`إخفاء`,"toolbar.measurementImport":`استيراد`,"toolbar.measurementExport":`تصدير`,"toolbar.clearMeasurements":`مسح`,"toolbar.measurementPanel":`نتائج`,"toolbar.switchBg":`خلفية`,"toolbar.readingMode":`قراءة`,"toolbar.annotation":`أدوات المراجعة`,"toolbar.annotationShort":`مراجعة`,"toolbar.markupCloud":`سحابة`,"toolbar.markupCallout":`وسيلة شرح`,"toolbar.markupText":`نص`,"toolbar.markupRect":`مستطيل`,"toolbar.markupCircle":`دائرة`,"toolbar.markupArrow":`سهم`,"toolbar.markupStamp":`ختم`,"toolbar.markupPanel":`نتائج`,"toolbar.markupImport":`استيراد`,"toolbar.markupExport":`تصدير`,"toolbar.clearMarkups":`مسح`,"toolbar.showMarkup":`إظهار`,"toolbar.hideMarkup":`إخفاء`,"toolbar.export":`تصدير`,"toolbar.exportHtml":`تصدير HTML`,"toolbar.exportPdf":`تصدير PDF`,"toolbar.exportSvg":`تصدير SVG`,"toolbar.placement":`موضع شريط الأدوات`,"toolbar.placementTop":`أعلى`,"toolbar.placementBottom":`أسفل`,"toolbar.placementLeft":`يسار`,"toolbar.placementRight":`يمين`,"toolbar.themeLight":`فاتح`,"toolbar.themeDark":`داكن`,"toolbar.locale":`اللغة`,"toolbar.localeEn":`English`,"toolbar.localeZh":`中文`,"toolbar.localeCs":`Čeština`,"toolbar.localeTr":`Türkçe`,"toolbar.localeAr":`العربية`,"toolbar.collapse":`طي شريط الأدوات`,"toolbar.moreOverflow":`المزيد من الأدوات`,"toolbar.expand":`توسيع شريط الأدوات`,"layerManager.title":`مدير الطبقات`,"layerManager.name":`الاسم`,"layerManager.on":`تشغيل`,"layerManager.color":`اللون`,"layerManager.currentLayer":`الطبقة الحالية`,"layerManager.zoomToLayer":`تم التكبير إلى الطبقة: {layer}`,"layerManager.sortByNameAsc":`ترتيب حسب الاسم تصاعديًا`,"layerManager.sortByNameDesc":`ترتيب حسب الاسم تنازليًا`,"layerManager.sortByNameNone":`إلغاء ترتيب الاسم`,"colorPicker.title":`تحديد اللون`,"colorPicker.index":`فهرس اللون: `,"colorPicker.rgb":`RGB: `,"colorPicker.input":`اللون`,"colorPicker.inputPlaceholder":`1-255 أو #RRGGBB`,"colorPicker.ok":`موافق`,"colorPicker.cancel":`إلغاء`,"dockPanel.close":`إغلاق اللوحة`,"dockPanel.dockSide":`جهة الإرساء`,"dockPanel.dockTop":`إرساء بالأعلى`,"dockPanel.dockBottom":`إرساء بالأسفل`,"dockPanel.dockLeft":`إرساء باليسار`,"dockPanel.dockRight":`إرساء باليمين`,"dockPanel.moreTabs":`المزيد من علامات التبويب`,"dockPanel.tab.layers":`الطبقات`,"dockPanel.tab.review":`المراجعة`,"dockPanel.tab.measurements":`القياسات`,"dockPanel.resize":`تغيير ارتفاع اللوحة`,"reviewPalette.searchPlaceholder":`البحث في علامات المراجعة`,"reviewPalette.empty":`لا توجد علامات مراجعة حتى الآن`,"reviewPalette.type":`النوع`,"reviewPalette.status":`الحالة`,"reviewPalette.author":`المؤلف`,"reviewPalette.summary":`الملخص`,"reviewPalette.details":`التفاصيل`,"reviewPalette.closeDetails":`إغلاق التفاصيل`,"reviewPalette.label":`التسمية`,"reviewPalette.comment":`التعليق`,"reviewPalette.zoomTo":`تكبير إلى`,"reviewPalette.delete":`حذف`,"reviewPalette.clear":`مسح الكل`,"reviewPalette.statusValues.open":`مفتوح`,"reviewPalette.statusValues.question":`سؤال`,"reviewPalette.statusValues.answered":`تمت الإجابة`,"reviewPalette.statusValues.closed":`مغلق`,"reviewPalette.typeValues.cloud":`سحابة`,"reviewPalette.typeValues.callout":`وسيلة شرح`,"reviewPalette.typeValues.text":`نص`,"reviewPalette.typeValues.rect":`مستطيل`,"reviewPalette.typeValues.circle":`دائرة`,"reviewPalette.typeValues.arrow":`سهم`,"reviewPalette.typeValues.stamp":`ختم`,"reviewPalette.typeValues.line":`خط`,"reviewPalette.typeValues.highlight":`تمييز`,"reviewPalette.typeValues.symbol":`رمز`,"measurePalette.filterGroup":`التصفية حسب النوع`,"measurePalette.empty":`لا توجد قياسات حتى الآن`,"measurePalette.type":`النوع`,"measurePalette.value":`القيمة`,"measurePalette.delete":`حذف`,"measurePalette.clear":`مسح الكل`,"measurePalette.typeValues.distance":`مسافة`,"measurePalette.typeValues.angle":`زاوية`,"measurePalette.typeValues.area":`مساحة`,"measurePalette.typeValues.arc":`قوس`,"measurePalette.typeValues.point":`XY`},Wt={ACAD:{layer:{description:`فتح أو إغلاق لوحة مدير الطبقات`},markuppanel:{description:`فتح لوحة المراجعة`},measurementpanel:{description:`فتح لوحة قائمة القياسات`}}},Gt={ACAD:{layer:{description:`Otevře nebo zavře dokovací panel správce hladin`},markuppanel:{description:`Otevře dokovací panel kontroly`},measurementpanel:{description:`Otevře dokovací panel seznamu měření`}}},Kt={ACAD:{layer:{description:`Opens or closes the layer manager dock panel`},markuppanel:{description:`Opens the review palette dock panel`},measurementpanel:{description:`Opens the measurement list dock panel`}}},qt={ACAD:{layer:{description:`Katman yöneticisi yerleştirme panelini açar veya kapatır`},markuppanel:{description:`İnceleme paleti yerleştirme panelini açar`},measurementpanel:{description:`Ölçüm listesi yerleştirme panelini açar`}}},Jt={ACAD:{layer:{description:`打开或关闭图层管理器停靠面板`},markuppanel:{description:`打开批注面板停靠页`},measurementpanel:{description:`打开测量列表面板`}}},Yt={"toolbar.select":`Výběr`,"toolbar.pan":`Posun`,"toolbar.zoom":`Zoom`,"toolbar.zoomExtent":`Rozsah`,"toolbar.zoomSmartExtents":`Chytrý rozsah`,"toolbar.zoomWindow":`Okno`,"toolbar.zoomSaved":`Uložený`,"toolbar.zoomOriginal":`Uložený`,"toolbar.layer":`Správce hladin`,"toolbar.layerShort":`Hladiny`,"toolbar.layout":`Rozvržení`,"toolbar.settings":`Nastavení`,"toolbar.simulatedMouseOn":`Myš`,"toolbar.simulatedMouseOff":`Lupa`,"toolbar.measure":`Měření`,"toolbar.measureDistance":`Vzdálenost`,"toolbar.measureContinuous":`Spojité`,"toolbar.measureAngle":`Úhel`,"toolbar.measureArea":`Plocha`,"toolbar.measureArc":`Oblouk`,"toolbar.measurePoint":`XY`,"toolbar.showMeasurements":`Zobrazit`,"toolbar.hideMeasurements":`Skrýt`,"toolbar.measurementImport":`Importovat`,"toolbar.measurementExport":`Exportovat`,"toolbar.clearMeasurements":`Vymazat`,"toolbar.measurementPanel":`Výsledky`,"toolbar.switchBg":`Pozadí`,"toolbar.readingMode":`Čtení`,"toolbar.annotation":`Nástroje kontroly`,"toolbar.annotationShort":`Kontrola`,"toolbar.markupCloud":`Obláček`,"toolbar.markupCallout":`Odkaz`,"toolbar.markupText":`Text`,"toolbar.markupRect":`Obdélník`,"toolbar.markupCircle":`Kružnice`,"toolbar.markupArrow":`Šipka`,"toolbar.markupStamp":`Razítko`,"toolbar.markupPanel":`Výsledky`,"toolbar.markupImport":`Importovat`,"toolbar.markupExport":`Exportovat`,"toolbar.clearMarkups":`Vymazat`,"toolbar.showMarkup":`Zobrazit`,"toolbar.hideMarkup":`Skrýt`,"toolbar.export":`Export`,"toolbar.exportHtml":`Exportovat HTML`,"toolbar.exportPdf":`Exportovat PDF`,"toolbar.exportSvg":`Exportovat SVG`,"toolbar.placement":`Pozice panelu nástrojů`,"toolbar.placementTop":`Nahoře`,"toolbar.placementBottom":`Dole`,"toolbar.placementLeft":`Vlevo`,"toolbar.placementRight":`Vpravo`,"toolbar.themeLight":`Světlý`,"toolbar.themeDark":`Tmavý`,"toolbar.locale":`Jazyk`,"toolbar.localeEn":`English`,"toolbar.localeZh":`中文`,"toolbar.localeCs":`Čeština`,"toolbar.localeTr":`Türkçe`,"toolbar.localeAr":`العربية`,"toolbar.collapse":`Sbalit panel nástrojů`,"toolbar.moreOverflow":`Další nástroje`,"toolbar.expand":`Rozbalit panel nástrojů`,"layerManager.title":`Správce hladin`,"layerManager.name":`Název`,"layerManager.on":`Zapnuto`,"layerManager.color":`Barva`,"layerManager.currentLayer":`Aktuální hladina`,"layerManager.zoomToLayer":`Přiblíženo na hladinu: {layer}`,"layerManager.sortByNameAsc":`Řadit podle názvu vzestupně`,"layerManager.sortByNameDesc":`Řadit podle názvu sestupně`,"layerManager.sortByNameNone":`Zrušit řazení podle názvu`,"colorPicker.title":`Vybrat barvu`,"colorPicker.index":`Index barvy: `,"colorPicker.rgb":`RGB: `,"colorPicker.input":`Barva`,"colorPicker.inputPlaceholder":`1-255 nebo #RRGGBB`,"colorPicker.ok":`OK`,"colorPicker.cancel":`Zrušit`,"dockPanel.close":`Zavřít panel`,"dockPanel.dockSide":`Strana ukotvení`,"dockPanel.dockTop":`Ukotvit nahoře`,"dockPanel.dockBottom":`Ukotvit dole`,"dockPanel.dockLeft":`Ukotvit vlevo`,"dockPanel.dockRight":`Ukotvit vpravo`,"dockPanel.moreTabs":`Další karty`,"dockPanel.tab.layers":`Hladiny`,"dockPanel.tab.review":`Kontrola`,"dockPanel.tab.measurements":`Měření`,"dockPanel.resize":`Změnit velikost panelu`,"reviewPalette.searchPlaceholder":`Hledat poznámky`,"reviewPalette.empty":`Zatím žádné poznámky`,"reviewPalette.type":`Typ`,"reviewPalette.status":`Stav`,"reviewPalette.author":`Autor`,"reviewPalette.summary":`Souhrn`,"reviewPalette.details":`Podrobnosti`,"reviewPalette.closeDetails":`Zavřít podrobnosti`,"reviewPalette.label":`Popisek`,"reviewPalette.comment":`Komentář`,"reviewPalette.zoomTo":`Přiblížit na`,"reviewPalette.delete":`Odstranit`,"reviewPalette.clear":`Vymazat vše`,"reviewPalette.statusValues.open":`Otevřeno`,"reviewPalette.statusValues.question":`Otázka`,"reviewPalette.statusValues.answered":`Zodpovězeno`,"reviewPalette.statusValues.closed":`Uzavřeno`,"reviewPalette.typeValues.cloud":`Oblak`,"reviewPalette.typeValues.callout":`Odnož`,"reviewPalette.typeValues.text":`Text`,"reviewPalette.typeValues.rect":`Obdélník`,"reviewPalette.typeValues.circle":`Kružnice`,"reviewPalette.typeValues.arrow":`Šipka`,"reviewPalette.typeValues.stamp":`Razítko`,"reviewPalette.typeValues.line":`Čára`,"reviewPalette.typeValues.highlight":`Zvýraznění`,"reviewPalette.typeValues.symbol":`Symbol`,"measurePalette.filterGroup":`Filtrovat podle typu`,"measurePalette.empty":`Zatím žádná měření`,"measurePalette.type":`Typ`,"measurePalette.value":`Hodnota`,"measurePalette.delete":`Odstranit`,"measurePalette.clear":`Vymazat vše`,"measurePalette.typeValues.distance":`Vzdálenost`,"measurePalette.typeValues.angle":`Úhel`,"measurePalette.typeValues.area":`Plocha`,"measurePalette.typeValues.arc":`Oblouk`,"measurePalette.typeValues.point":`XY`},Xt={"toolbar.select":`Select`,"toolbar.pan":`Pan`,"toolbar.zoom":`Zoom`,"toolbar.zoomExtent":`Extents`,"toolbar.zoomSmartExtents":`Smart extents`,"toolbar.zoomWindow":`Window`,"toolbar.zoomSaved":`Saved`,"toolbar.zoomOriginal":`Saved`,"toolbar.layer":`Layer Manager`,"toolbar.layerShort":`Layers`,"toolbar.layout":`Layout`,"toolbar.settings":`Settings`,"toolbar.simulatedMouseOn":`Mouse`,"toolbar.simulatedMouseOff":`Loupe`,"toolbar.measure":`Measure`,"toolbar.measureDistance":`Distance`,"toolbar.measureContinuous":`Continuous`,"toolbar.measureAngle":`Angle`,"toolbar.measureArea":`Area`,"toolbar.measureArc":`Arc`,"toolbar.measurePoint":`XY`,"toolbar.showMeasurements":`Show`,"toolbar.hideMeasurements":`Hide`,"toolbar.measurementImport":`Import`,"toolbar.measurementExport":`Export`,"toolbar.clearMeasurements":`Clear`,"toolbar.measurementPanel":`Results`,"toolbar.switchBg":`Background`,"toolbar.readingMode":`Reading`,"toolbar.annotation":`Review tools`,"toolbar.annotationShort":`Review`,"toolbar.markupCloud":`Cloud`,"toolbar.markupCallout":`Callout`,"toolbar.markupText":`Text`,"toolbar.markupRect":`Rect`,"toolbar.markupCircle":`Circle`,"toolbar.markupArrow":`Arrow`,"toolbar.markupStamp":`Stamp`,"toolbar.markupPanel":`Results`,"toolbar.markupImport":`Import`,"toolbar.markupExport":`Export`,"toolbar.clearMarkups":`Clear`,"toolbar.showMarkup":`Show`,"toolbar.hideMarkup":`Hide`,"toolbar.export":`Export`,"toolbar.exportHtml":`Export HTML`,"toolbar.exportPdf":`Export PDF`,"toolbar.exportSvg":`Export SVG`,"toolbar.placement":`Toolbar Position`,"toolbar.placementTop":`Top`,"toolbar.placementBottom":`Bottom`,"toolbar.placementLeft":`Left`,"toolbar.placementRight":`Right`,"toolbar.themeLight":`Light`,"toolbar.themeDark":`Dark`,"toolbar.locale":`Language`,"toolbar.localeEn":`English`,"toolbar.localeZh":`中文`,"toolbar.localeCs":`Čeština`,"toolbar.localeTr":`Türkçe`,"toolbar.localeAr":`العربية`,"toolbar.collapse":`Collapse toolbar`,"toolbar.moreOverflow":`More tools`,"toolbar.expand":`Expand toolbar`,"layerManager.title":`Layer Manager`,"layerManager.name":`Name`,"layerManager.on":`On`,"layerManager.color":`Color`,"layerManager.currentLayer":`Current layer`,"layerManager.zoomToLayer":`Zoomed to layer: {layer}`,"layerManager.sortByNameAsc":`Sort by name ascending`,"layerManager.sortByNameDesc":`Sort by name descending`,"layerManager.sortByNameNone":`Clear name sort`,"colorPicker.title":`Select Color`,"colorPicker.index":`Color Index: `,"colorPicker.rgb":`RGB: `,"colorPicker.input":`Color`,"colorPicker.inputPlaceholder":`1-255 or #RRGGBB`,"colorPicker.ok":`OK`,"colorPicker.cancel":`Cancel`,"dockPanel.close":`Close panel`,"dockPanel.dockSide":`Dock side`,"dockPanel.dockTop":`Dock to top`,"dockPanel.dockBottom":`Dock to bottom`,"dockPanel.dockLeft":`Dock to left`,"dockPanel.dockRight":`Dock to right`,"dockPanel.moreTabs":`More tabs`,"dockPanel.tab.layers":`Layers`,"dockPanel.tab.review":`Review`,"dockPanel.tab.measurements":`Measurements`,"dockPanel.resize":`Resize panel`,"reviewPalette.searchPlaceholder":`Search markups`,"reviewPalette.empty":`No markups yet`,"reviewPalette.type":`Type`,"reviewPalette.status":`Status`,"reviewPalette.author":`Author`,"reviewPalette.summary":`Summary`,"reviewPalette.details":`Details`,"reviewPalette.closeDetails":`Close details`,"reviewPalette.label":`Label`,"reviewPalette.comment":`Comment`,"reviewPalette.zoomTo":`Zoom to`,"reviewPalette.delete":`Delete`,"reviewPalette.clear":`Clear all`,"reviewPalette.statusValues.open":`Open`,"reviewPalette.statusValues.question":`Question`,"reviewPalette.statusValues.answered":`Answered`,"reviewPalette.statusValues.closed":`Closed`,"reviewPalette.typeValues.cloud":`Cloud`,"reviewPalette.typeValues.callout":`Callout`,"reviewPalette.typeValues.text":`Text`,"reviewPalette.typeValues.rect":`Rectangle`,"reviewPalette.typeValues.circle":`Circle`,"reviewPalette.typeValues.arrow":`Arrow`,"reviewPalette.typeValues.stamp":`Stamp`,"reviewPalette.typeValues.line":`Line`,"reviewPalette.typeValues.highlight":`Highlight`,"reviewPalette.typeValues.symbol":`Symbol`,"measurePalette.filterGroup":`Filter by type`,"measurePalette.empty":`No measurements yet`,"measurePalette.type":`Type`,"measurePalette.value":`Value`,"measurePalette.delete":`Delete`,"measurePalette.clear":`Clear all`,"measurePalette.typeValues.distance":`Distance`,"measurePalette.typeValues.angle":`Angle`,"measurePalette.typeValues.area":`Area`,"measurePalette.typeValues.arc":`Arc`,"measurePalette.typeValues.point":`XY`},Zt={"toolbar.select":`Seç`,"toolbar.pan":`Kaydır`,"toolbar.zoom":`Yakınlaştır`,"toolbar.zoomExtent":`Sınırlar`,"toolbar.zoomSmartExtents":`Akıllı sınırlar`,"toolbar.zoomWindow":`Pencere`,"toolbar.zoomSaved":`Kayıtlı`,"toolbar.zoomOriginal":`Kayıtlı`,"toolbar.layer":`Katman Yöneticisi`,"toolbar.layerShort":`Katman`,"toolbar.layout":`Düzen`,"toolbar.settings":`Ayarlar`,"toolbar.simulatedMouseOn":`Fare`,"toolbar.simulatedMouseOff":`Büyüteç`,"toolbar.measure":`Ölçüm`,"toolbar.measureDistance":`Mesafe`,"toolbar.measureContinuous":`Sürekli`,"toolbar.measureAngle":`Açı`,"toolbar.measureArea":`Alan`,"toolbar.measureArc":`Yay`,"toolbar.measurePoint":`XY`,"toolbar.showMeasurements":`Göster`,"toolbar.hideMeasurements":`Gizle`,"toolbar.measurementImport":`İçe Aktar`,"toolbar.measurementExport":`Dışa Aktar`,"toolbar.clearMeasurements":`Temizle`,"toolbar.measurementPanel":`Sonuç`,"toolbar.switchBg":`Arka Plan`,"toolbar.readingMode":`Okuma`,"toolbar.annotation":`İnceleme araçları`,"toolbar.annotationShort":`İnceleme`,"toolbar.markupCloud":`Bulut`,"toolbar.markupCallout":`Çağrı`,"toolbar.markupText":`Metin`,"toolbar.markupRect":`Dikdörtgen`,"toolbar.markupCircle":`Daire`,"toolbar.markupArrow":`Ok`,"toolbar.markupStamp":`Damga`,"toolbar.markupPanel":`Sonuç`,"toolbar.markupImport":`İçe Aktar`,"toolbar.markupExport":`Dışa Aktar`,"toolbar.clearMarkups":`Temizle`,"toolbar.showMarkup":`Göster`,"toolbar.hideMarkup":`Gizle`,"toolbar.export":`Dışa Aktar`,"toolbar.exportHtml":`HTML Dışa Aktar`,"toolbar.exportPdf":`PDF Dışa Aktar`,"toolbar.exportSvg":`SVG Dışa Aktar`,"toolbar.placement":`Araç Çubuğu Konumu`,"toolbar.placementTop":`Üst`,"toolbar.placementBottom":`Alt`,"toolbar.placementLeft":`Sol`,"toolbar.placementRight":`Sağ`,"toolbar.themeLight":`Açık`,"toolbar.themeDark":`Koyu`,"toolbar.locale":`Dil`,"toolbar.localeEn":`English`,"toolbar.localeZh":`中文`,"toolbar.localeCs":`Čeština`,"toolbar.localeTr":`Türkçe`,"toolbar.localeAr":`العربية`,"toolbar.collapse":`Araç çubuğunu daralt`,"toolbar.moreOverflow":`Diğer araçlar`,"toolbar.expand":`Araç çubuğunu genişlet`,"layerManager.title":`Katman Yöneticisi`,"layerManager.name":`Ad`,"layerManager.on":`Açık`,"layerManager.color":`Renk`,"layerManager.currentLayer":`Geçerli katman`,"layerManager.zoomToLayer":`Katmana yakınlaştırıldı: {layer}`,"layerManager.sortByNameAsc":`Ada göre artan sırala`,"layerManager.sortByNameDesc":`Ada göre azalan sırala`,"layerManager.sortByNameNone":`Ad sıralamasını temizle`,"colorPicker.title":`Renk Seç`,"colorPicker.index":`Renk İndeksi: `,"colorPicker.rgb":`RGB: `,"colorPicker.input":`Renk`,"colorPicker.inputPlaceholder":`1-255 veya #RRGGBB`,"colorPicker.ok":`Tamam`,"colorPicker.cancel":`İptal`,"dockPanel.close":`Paneli kapat`,"dockPanel.dockSide":`Yerleşim kenarı`,"dockPanel.dockTop":`Üste yerleştir`,"dockPanel.dockBottom":`Alta yerleştir`,"dockPanel.dockLeft":`Sola yerleştir`,"dockPanel.dockRight":`Sağa yerleştir`,"dockPanel.moreTabs":`Diğer sekmeler`,"dockPanel.tab.layers":`Katmanlar`,"dockPanel.tab.review":`İnceleme`,"dockPanel.tab.measurements":`Ölçümler`,"dockPanel.resize":`Panel boyutunu ayarla`,"reviewPalette.searchPlaceholder":`İşaretlerde ara`,"reviewPalette.empty":`Henüz işaret yok`,"reviewPalette.type":`Tür`,"reviewPalette.status":`Durum`,"reviewPalette.author":`Yazar`,"reviewPalette.summary":`Özet`,"reviewPalette.details":`Ayrıntılar`,"reviewPalette.closeDetails":`Ayrıntıları kapat`,"reviewPalette.label":`Etiket`,"reviewPalette.comment":`Yorum`,"reviewPalette.zoomTo":`Yakınlaştır`,"reviewPalette.delete":`Sil`,"reviewPalette.clear":`Tümünü temizle`,"reviewPalette.statusValues.open":`Açık`,"reviewPalette.statusValues.question":`Soru`,"reviewPalette.statusValues.answered":`Yanıtlandı`,"reviewPalette.statusValues.closed":`Kapalı`,"reviewPalette.typeValues.cloud":`Bulut`,"reviewPalette.typeValues.callout":`Çağrı`,"reviewPalette.typeValues.text":`Metin`,"reviewPalette.typeValues.rect":`Dikdörtgen`,"reviewPalette.typeValues.circle":`Daire`,"reviewPalette.typeValues.arrow":`Ok`,"reviewPalette.typeValues.stamp":`Damga`,"reviewPalette.typeValues.line":`Çizgi`,"reviewPalette.typeValues.highlight":`Vurgu`,"reviewPalette.typeValues.symbol":`Sembol`,"measurePalette.filterGroup":`Türe göre filtrele`,"measurePalette.empty":`Henüz ölçüm yok`,"measurePalette.type":`Tür`,"measurePalette.value":`Değer`,"measurePalette.delete":`Sil`,"measurePalette.clear":`Tümünü temizle`,"measurePalette.typeValues.distance":`Mesafe`,"measurePalette.typeValues.angle":`Açı`,"measurePalette.typeValues.area":`Alan`,"measurePalette.typeValues.arc":`Yay`,"measurePalette.typeValues.point":`XY`},Qt={"toolbar.select":`选择`,"toolbar.pan":`平移`,"toolbar.zoom":`缩放`,"toolbar.zoomExtent":`范围`,"toolbar.zoomSmartExtents":`智能范围`,"toolbar.zoomWindow":`窗口`,"toolbar.zoomSaved":`保存的视图`,"toolbar.zoomOriginal":`保存的视图`,"toolbar.layer":`图层管理器`,"toolbar.layerShort":`图层`,"toolbar.layout":`布局`,"toolbar.settings":`设置`,"toolbar.simulatedMouseOn":`鼠标`,"toolbar.simulatedMouseOff":`放大`,"toolbar.measure":`测量`,"toolbar.measureDistance":`测距离`,"toolbar.measureContinuous":`连续测`,"toolbar.measureAngle":`测角度`,"toolbar.measureArea":`测面积`,"toolbar.measureArc":`测弧长`,"toolbar.measurePoint":`测坐标`,"toolbar.showMeasurements":`显示`,"toolbar.hideMeasurements":`隐藏`,"toolbar.measurementImport":`导入`,"toolbar.measurementExport":`导出`,"toolbar.clearMeasurements":`清除`,"toolbar.measurementPanel":`看结果`,"toolbar.switchBg":`背景`,"toolbar.readingMode":`阅读`,"toolbar.annotation":`审阅工具`,"toolbar.annotationShort":`批注`,"toolbar.markupCloud":`云线`,"toolbar.markupCallout":`标注`,"toolbar.markupText":`文字`,"toolbar.markupRect":`矩形`,"toolbar.markupCircle":`圆`,"toolbar.markupArrow":`箭头`,"toolbar.markupStamp":`图章`,"toolbar.markupPanel":`看结果`,"toolbar.markupImport":`导入`,"toolbar.markupExport":`导出`,"toolbar.clearMarkups":`清除`,"toolbar.showMarkup":`显示`,"toolbar.hideMarkup":`隐藏`,"toolbar.export":`导出`,"toolbar.exportHtml":`导出 HTML`,"toolbar.exportPdf":`导出 PDF`,"toolbar.exportSvg":`导出 SVG`,"toolbar.placement":`工具栏位置`,"toolbar.placementTop":`上方`,"toolbar.placementBottom":`下方`,"toolbar.placementLeft":`左侧`,"toolbar.placementRight":`右侧`,"toolbar.themeLight":`浅色`,"toolbar.themeDark":`深色`,"toolbar.locale":`语言`,"toolbar.localeEn":`English`,"toolbar.localeZh":`中文`,"toolbar.localeCs":`Čeština`,"toolbar.localeTr":`Türkçe`,"toolbar.localeAr":`العربية`,"toolbar.collapse":`收起工具栏`,"toolbar.moreOverflow":`更多工具`,"toolbar.expand":`展开工具栏`,"layerManager.title":`图层管理器`,"layerManager.name":`名称`,"layerManager.on":`开`,"layerManager.color":`颜色`,"layerManager.currentLayer":`当前图层`,"layerManager.zoomToLayer":`已缩放至图层：{layer}`,"layerManager.sortByNameAsc":`按名称升序排序`,"layerManager.sortByNameDesc":`按名称降序排序`,"layerManager.sortByNameNone":`取消名称排序`,"colorPicker.title":`选择颜色`,"colorPicker.index":`颜色索引：`,"colorPicker.rgb":`RGB：`,"colorPicker.input":`颜色`,"colorPicker.inputPlaceholder":`1-255 或 #RRGGBB`,"colorPicker.ok":`确定`,"colorPicker.cancel":`取消`,"dockPanel.close":`关闭面板`,"dockPanel.dockSide":`停靠位置`,"dockPanel.dockTop":`停靠在顶部`,"dockPanel.dockBottom":`停靠在底部`,"dockPanel.dockLeft":`停靠在左侧`,"dockPanel.dockRight":`停靠在右侧`,"dockPanel.moreTabs":`更多标签页`,"dockPanel.tab.layers":`图层`,"dockPanel.tab.review":`批注`,"dockPanel.tab.measurements":`测量`,"dockPanel.resize":`调整面板高度`,"reviewPalette.searchPlaceholder":`搜索批注`,"reviewPalette.empty":`暂无批注`,"reviewPalette.type":`类型`,"reviewPalette.status":`状态`,"reviewPalette.author":`作者`,"reviewPalette.summary":`摘要`,"reviewPalette.details":`详情`,"reviewPalette.closeDetails":`关闭详情`,"reviewPalette.label":`标签`,"reviewPalette.comment":`评论`,"reviewPalette.zoomTo":`缩放到`,"reviewPalette.delete":`删除`,"reviewPalette.clear":`全部清除`,"reviewPalette.statusValues.open":`打开`,"reviewPalette.statusValues.question":`疑问`,"reviewPalette.statusValues.answered":`已答复`,"reviewPalette.statusValues.closed":`已关闭`,"reviewPalette.typeValues.cloud":`云线`,"reviewPalette.typeValues.callout":`标注`,"reviewPalette.typeValues.text":`文字`,"reviewPalette.typeValues.rect":`矩形`,"reviewPalette.typeValues.circle":`圆`,"reviewPalette.typeValues.arrow":`箭头`,"reviewPalette.typeValues.stamp":`图章`,"reviewPalette.typeValues.line":`直线`,"reviewPalette.typeValues.highlight":`高亮`,"reviewPalette.typeValues.symbol":`符号`,"measurePalette.filterGroup":`按类型筛选`,"measurePalette.empty":`暂无测量`,"measurePalette.type":`类型`,"measurePalette.value":`数值`,"measurePalette.delete":`删除`,"measurePalette.clear":`全部清除`,"measurePalette.typeValues.distance":`距离`,"measurePalette.typeValues.angle":`角度`,"measurePalette.typeValues.area":`面积`,"measurePalette.typeValues.arc":`弧长`,"measurePalette.typeValues.point":`坐标`},K=`simpleUi`,$t=!1;function q(e){let t={};for(let[n,r]of Object.entries(e)){let e=n.split(`.`),i=t;for(let t=0;t<e.length-1;t++){let n=e[t],r=i[n];(!r||typeof r==`string`)&&(i[n]={}),i=i[n]}i[e[e.length-1]]=r}return t}function en(){$t||=(w.mergeLocaleMessage(`en`,{command:Kt,[K]:q(Xt)}),w.mergeLocaleMessage(`zh`,{command:Jt,[K]:q(Qt)}),w.mergeLocaleMessage(`cs`,{command:Gt,[K]:q(Yt)}),w.mergeLocaleMessage(`tr`,{command:qt,[K]:q(Zt)}),w.mergeLocaleMessage(`ar`,{command:Wt,[K]:q(Ut)}),!0)}var tn=class{t(e,t){let n=`${K}.${e}`,r=w.t(n,{fallback:e});return t?Object.keys(t).reduce((e,n)=>e.replace(`{${n}}`,t[n]),r):r}};function nn(e){let t=e.getAttribute(`data-ml-ui-theme`);if(t===`light`||t===`dark`)return t}function rn(e){let t=b.instance().getVar(p.COLORTHEME,e);return k(t)?`light`:`dark`}var an=class{constructor(e,t){this.host=e,this.onThemeChanged=t,this.handleSysVarChanged=e=>{let t=h.instance.curDocument?.database;!t||e.database!==t||e.name.toLowerCase()===p.COLORTHEME.toLowerCase()&&this.applyTheme(k(e.newVal)?`light`:`dark`)},this.handleDocumentActivated=e=>{this.applyTheme(rn(e.doc.database))}}start(){this.syncFromCurrentSource(),b.instance().events.sysVarChanged.addEventListener(this.handleSysVarChanged),h.instance.events.documentActivated.addEventListener(this.handleDocumentActivated)}stop(){b.instance().events.sysVarChanged.removeEventListener(this.handleSysVarChanged),h.instance.events.documentActivated.removeEventListener(this.handleDocumentActivated)}getTheme(){return nn(this.host)??`dark`}setTheme(e){let t=h.instance.curDocument?.database;if(t){b.instance().setVar(p.COLORTHEME,+(e===`light`),t);return}this.applyTheme(e)}syncFromCurrentSource(){let e=h.instance.curDocument?.database;if(e){this.applyTheme(rn(e));return}nn(this.host)}applyTheme(e){var t;Te(e,this.host),(t=this.onThemeChanged)==null||t.call(this)}},J=`ml-ex-ui-styles`;function Y(){if(ut(),document.getElementById(J))return;let e=document.createElement(`style`);e.id=J,e.textContent=`
    .ml-ex-ui-layer-manager {
      position: absolute;
      z-index: 100;
      width: min(280px, calc(100% - 16px));
      max-width: calc(100% - 16px);
      min-height: 120px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: var(--ml-ui-bg, #ffffff);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.35));
      border-radius: 8px;
      overflow: hidden;
      color: var(--ml-ui-text, #303133);
      font-size: 12px;
    }

    .ml-ex-ui-layer-manager.is-compact {
      width: calc(100% - 16px);
      max-width: none;
      border-radius: 12px 12px 8px 8px;
    }

    .ml-ex-ui-layer-manager.is-compact .ml-ex-ui-layer-table th:first-child,
    .ml-ex-ui-layer-manager.is-compact .ml-ex-ui-layer-table td:first-child {
      width: 100%;
      max-width: 0;
    }

    .ml-ex-ui-layer-manager.is-compact .ml-ex-ui-layer-name {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-layer-manager.is-hidden {
      display: none;
    }

    .ml-ex-ui-layer-manager .ml-ex-ui-layer-list {
      flex: 1;
      min-height: 0;
    }

    .ml-ex-ui-layer-manager-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      user-select: none;
      font-weight: 600;
      flex: 0 0 auto;
    }

    .ml-ex-ui-layer-table-wrap {
      overflow: auto;
      flex: 1;
    }

    .ml-ex-ui-layer-table {
      width: 100%;
      border-collapse: collapse;
    }

    .ml-ex-ui-layer-table th,
    .ml-ex-ui-layer-table td {
      padding: 4px 8px;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      text-align: left;
    }

    .ml-ex-ui-layer-table th {
      position: sticky;
      top: 0;
      background: var(--ml-ui-bg, #ffffff);
      z-index: 1;
    }

    .ml-ex-ui-layer-table td.center,
    .ml-ex-ui-layer-table th.center {
      text-align: center;
      vertical-align: middle;
    }

    .ml-ex-ui-layer-name-header.is-sortable {
      padding: 0;
    }

    .ml-ex-ui-layer-name-sort {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      margin: 0;
      padding: 4px 8px;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }

    .ml-ex-ui-layer-name-sort:hover {
      color: var(--ml-ui-accent, #409eff);
    }

    .ml-ex-ui-layer-name-header.is-sorted-asc .ml-ex-ui-layer-name-sort,
    .ml-ex-ui-layer-name-header.is-sorted-desc .ml-ex-ui-layer-name-sort {
      color: var(--ml-ui-accent, #409eff);
    }

    .ml-ex-ui-layer-sort-indicator {
      display: inline-block;
      min-width: 0.75em;
      font-size: 10px;
      line-height: 1;
      opacity: 0.85;
    }

    .ml-ex-ui-layer-header-on {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .ml-ex-ui-layer-header-on span {
      line-height: 1;
    }

    .ml-ex-ui-layer-header-on input[type='checkbox'] {
      margin: 0;
    }

    .ml-ex-ui-layer-name {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }

    .ml-ex-ui-layer-current-marker {
      color: var(--ml-ui-accent, #409eff);
      font-weight: 600;
    }

    .ml-ex-ui-layer-color {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 3px;
      cursor: pointer;
    }

    .ml-ex-ui-color-dialog-backdrop {
      position: fixed;
      inset: 0;
      z-index: 120;
      background: var(--ml-ui-overlay, rgba(0, 0, 0, 0.18));
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ml-ex-ui-color-dialog {
      width: fit-content;
      max-width: calc(100vw - 24px);
      background: var(--ml-ui-bg, #ffffff);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 8px;
      box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.35));
      padding: 12px;
      color: var(--ml-ui-text, #303133);
      font-family: Arial, sans-serif;
      font-size: 12px;
    }

    .ml-ex-ui-color-dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .ml-ex-ui-color-dialog-title {
      font-weight: 600;
    }

    .ml-ex-ui-color-dialog-close {
      border: none;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 2px 6px;
    }

    .ml-ex-ui-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .ml-ex-ui-btn {
      padding: 4px 12px;
      border-radius: 4px;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      cursor: pointer;
      font-size: 12px;
    }

    .ml-ex-ui-btn-primary {
      border-color: var(--ml-ui-accent, #409eff);
      background: var(--ml-ui-accent, #409eff);
      color: #fff;
    }

    .ml-ex-ui-toast {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 200;
      padding: 8px 14px;
      border-radius: 6px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      box-shadow: var(--ml-ui-shadow, 0 2px 6px rgba(0, 0, 0, 0.12));
    }

    .ml-ex-ui-layer-list {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      overflow: hidden;
    }

    .ml-ex-ui-review-palette {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      gap: 8px;
      padding: 8px;
      box-sizing: border-box;
      color: var(--ml-ui-text, #303133);
      font-size: 12px;
    }

    .ml-ex-ui-review-toolbar {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: 0 0 auto;
    }

    .ml-ex-ui-review-search,
    .ml-ex-ui-review-input,
    .ml-ex-ui-review-select,
    .ml-ex-ui-review-textarea {
      box-sizing: border-box;
      width: 100%;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      padding: 4px 8px;
    }

    .ml-ex-ui-review-search {
      flex: 1;
      min-width: 0;
    }

    .ml-ex-ui-review-textarea {
      resize: vertical;
      min-height: 44px;
    }

    .ml-ex-ui-review-btn {
      flex: 0 0 auto;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      padding: 4px 8px;
      cursor: pointer;
    }

    .ml-ex-ui-review-btn:hover:not(:disabled) {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-review-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .ml-ex-ui-review-btn-danger {
      color: var(--ml-ui-danger, #f56c6c);
      border-color: var(--ml-ui-danger, #f56c6c);
    }

    .ml-ex-ui-review-table-wrap {
      flex: 1;
      min-height: 120px;
      overflow: auto;
    }

    .ml-ex-ui-review-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .ml-ex-ui-review-table th,
    .ml-ex-ui-review-table td {
      padding: 4px 6px;
      text-align: left;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-review-table th {
      font-weight: 600;
      position: sticky;
      top: 0;
      background: var(--ml-ui-bg, #ffffff);
    }

    .ml-ex-ui-review-table th:nth-child(1),
    .ml-ex-ui-review-table td:nth-child(1) {
      width: 88px;
    }

    .ml-ex-ui-review-table th:nth-child(2),
    .ml-ex-ui-review-table td:nth-child(2) {
      width: 96px;
    }

    .ml-ex-ui-review-row {
      cursor: pointer;
    }

    .ml-ex-ui-review-row:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-review-row.is-selected {
      background: var(--ml-ui-accent-soft, rgba(64, 158, 255, 0.12));
    }

    .ml-ex-ui-review-empty-row td {
      text-align: center;
      color: var(--ml-ui-muted, #909399);
      white-space: normal;
      padding: 16px 8px;
    }

    .ml-ex-ui-review-detail {
      border-top: 1px solid var(--ml-ui-border, #dcdfe6);
      padding-top: 6px;
      max-height: 46%;
      overflow: auto;
      flex: 0 0 auto;
    }

    .ml-ex-ui-review-detail-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      margin-bottom: 4px;
    }

    .ml-ex-ui-review-detail-title {
      font-weight: 600;
    }

    .ml-ex-ui-review-detail-close {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-left: auto;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--ml-ui-text, #303133);
      cursor: pointer;
      padding: 0;
    }

    .ml-ex-ui-review-detail-close:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-review-field {
      margin-bottom: 4px;
    }

    .ml-ex-ui-review-field-label {
      display: block;
      margin-bottom: 2px;
      line-height: 1.2;
    }

    .ml-ex-ui-review-detail-actions {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
    }

    .ml-ex-ui-review-detail-actions .ml-ex-ui-review-btn {
      flex: 0 0 auto;
      width: auto;
    }

    .ml-ex-ui-measure-palette {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      gap: 8px;
      padding: 8px;
      box-sizing: border-box;
      color: var(--ml-ui-text, #303133);
      font-size: 12px;
    }

    .ml-ex-ui-measure-toolbar {
      display: flex;
      gap: 8px;
      align-items: center;
      flex: 0 0 auto;
    }

    .ml-ex-ui-measure-filter {
      display: flex;
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
    }

    .ml-ex-ui-measure-filter-btn {
      flex: 1 1 0;
      min-width: 0;
      border: none;
      border-right: 1px solid var(--ml-ui-border, #dcdfe6);
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      font-size: 11px;
      padding: 4px 2px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ml-ex-ui-measure-filter-btn:last-child {
      border-right: none;
    }

    .ml-ex-ui-measure-filter-btn:hover:not(.is-active) {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-measure-filter-btn.is-active {
      background: var(--ml-ui-accent-soft, rgba(64, 158, 255, 0.16));
      color: var(--ml-ui-accent, #409eff);
    }

    .ml-ex-ui-measure-btn {
      flex: 0 0 auto;
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 4px;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      font: inherit;
      padding: 4px 8px;
      cursor: pointer;
    }

    .ml-ex-ui-measure-btn:hover:not(:disabled) {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-measure-btn:disabled {
      opacity: 0.5;
      cursor: default;
    }

    .ml-ex-ui-measure-btn-danger {
      color: #f56c6c;
      border-color: rgba(245, 108, 108, 0.55);
    }

    .ml-ex-ui-measure-table-wrap {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
    }

    .ml-ex-ui-measure-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    .ml-ex-ui-measure-table th,
    .ml-ex-ui-measure-table td {
      padding: 6px 8px;
      text-align: left;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .ml-ex-ui-measure-table th {
      font-weight: 600;
      color: var(--ml-ui-text-muted, #606266);
    }

    .ml-ex-ui-measure-table th:nth-child(1),
    .ml-ex-ui-measure-table td:nth-child(1) {
      width: 28%;
    }

    .ml-ex-ui-measure-actions-col {
      width: 72px;
      text-align: right;
    }

    .ml-ex-ui-measure-row {
      cursor: pointer;
    }

    .ml-ex-ui-measure-row:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.04));
    }

    .ml-ex-ui-measure-row.is-selected {
      background: var(--ml-ui-accent-soft, rgba(64, 158, 255, 0.12));
    }

    .ml-ex-ui-measure-empty-row td {
      text-align: center;
      color: var(--ml-ui-text-muted, #606266);
      cursor: default;
    }

    .ml-ex-ui-measure-row-delete {
      padding: 2px 6px;
      font-size: 11px;
    }

    .ml-ex-ui-layer-list .ml-ex-ui-layer-table-wrap {
      flex: 1;
      min-height: 0;
    }

    .ml-ex-ui-host-dock {
      min-height: 0;
      min-width: 0;
    }

    .ml-ex-ui-host-dock:not([class*='ml-ex-ui-host-dock-']) {
      display: flex;
      flex-direction: column;
    }

    .ml-ex-ui-host-dock-top,
    .ml-ex-ui-host-dock-bottom,
    .ml-ex-ui-host-dock-sheet {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .ml-ex-ui-host-dock-left,
    .ml-ex-ui-host-dock-right {
      display: flex;
      flex-direction: row;
      min-width: 0;
      min-height: 0;
    }

    .ml-ex-ui-dock-main {
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      position: relative;
      overflow: hidden;
    }

    .ml-ex-ui-dock-panel {
      --ml-ex-ui-dock-size: 240px;
      display: flex;
      flex-direction: column;
      flex: 0 0 auto;
      background: var(--ml-ui-bg, #ffffff);
      color: var(--ml-ui-text, #303133);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      font-size: 12px;
      z-index: 25;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .ml-ex-ui-dock-panel[data-open='false'] {
      display: none;
    }

    .ml-ex-ui-dock-panel[data-side='bottom'],
    .ml-ex-ui-dock-panel[data-side='top'] {
      width: 100%;
      height: var(--ml-ex-ui-dock-size);
      border-left: none;
      border-right: none;
    }

    .ml-ex-ui-dock-panel[data-side='bottom'] {
      border-bottom: none;
      border-top: none;
    }

    .ml-ex-ui-dock-panel[data-side='top'] {
      border-top: none;
      border-bottom: none;
    }

    .ml-ex-ui-dock-panel[data-side='left'],
    .ml-ex-ui-dock-panel[data-side='right'] {
      flex-direction: row;
      height: 100%;
      width: var(--ml-ex-ui-dock-size);
      border-top: none;
      border-bottom: none;
    }

    .ml-ex-ui-dock-content {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .ml-ex-ui-dock-panel[data-side='left'] {
      border-left: none;
      border-right: none;
    }

    .ml-ex-ui-dock-panel[data-side='right'] {
      border-right: none;
      border-left: none;
    }

    .ml-ex-ui-dock-resize-handle {
      flex: 0 0 auto;
      background: transparent;
      touch-action: none;
      z-index: 1;
    }

    .ml-ex-ui-dock-resize-handle:hover,
    .ml-ex-ui-dock-resize-handle:active {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.08));
    }

    .ml-ex-ui-dock-panel[data-side='bottom'] .ml-ex-ui-dock-resize-handle {
      order: -1;
      width: 100%;
      height: 6px;
      cursor: ns-resize;
      border-top: 1px solid var(--ml-ui-border, #dcdfe6);
    }

    .ml-ex-ui-dock-panel[data-side='top'] .ml-ex-ui-dock-resize-handle {
      order: 2;
      width: 100%;
      height: 6px;
      cursor: ns-resize;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
    }

    .ml-ex-ui-dock-panel[data-side='left'] .ml-ex-ui-dock-resize-handle {
      order: 2;
      align-self: stretch;
      width: 6px;
      cursor: ew-resize;
      border-right: 1px solid var(--ml-ui-border, #dcdfe6);
    }

    .ml-ex-ui-dock-panel[data-side='right'] .ml-ex-ui-dock-resize-handle {
      order: -1;
      align-self: stretch;
      width: 6px;
      cursor: ew-resize;
      border-left: 1px solid var(--ml-ui-border, #dcdfe6);
    }

    .ml-ex-ui-dock-sheet-chrome {
      display: none;
      position: relative;
    }

    .ml-ex-ui-dock-sheet-grabber {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 20px;
      cursor: ns-resize;
      touch-action: none;
    }

    .ml-ex-ui-dock-sheet-grabber::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 36px;
      height: 4px;
      border-radius: 2px;
      background: var(--ml-ui-text-muted, #909399);
      opacity: 0.7;
    }

    .ml-ex-ui-dock-sheet-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 28px;
      border: none;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      cursor: pointer;
      flex: 0 0 auto;
      position: relative;
      z-index: 1;
    }

    .ml-ex-ui-dock-sheet-close:hover {
      color: var(--ml-ui-text, #303133);
    }

    .ml-ex-ui-dock-header {
      display: flex;
      align-items: stretch;
      flex: 0 0 auto;
      border-bottom: 1px solid var(--ml-ui-border, #dcdfe6);
      background: var(--ml-ui-bg, #ffffff);
      min-height: 28px;
    }

    .ml-ex-ui-dock-tabs-wrap {
      display: flex;
      align-items: stretch;
      flex: 1 1 auto;
      min-width: 0;
    }

    .ml-ex-ui-dock-tabs {
      display: flex;
      align-items: stretch;
      flex: 1 1 auto;
      min-width: 0;
      overflow: hidden;
    }

    .ml-ex-ui-dock-tab-overflow-btn {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
    }

    .ml-ex-ui-dock-tab-overflow-btn[hidden] {
      display: none !important;
    }

    .ml-ex-ui-dock-tab-overflow-btn:hover,
    .ml-ex-ui-dock-tab-overflow-btn.is-active {
      color: var(--ml-ui-text, #303133);
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.04));
    }

    .ml-ex-ui-dock-tab-overflow-btn.is-active {
      border-bottom-color: var(--ml-ui-accent, #409eff);
    }

    .ml-ex-ui-dock-tab[hidden] {
      display: none;
    }

    .ml-ex-ui-dock-tab {
      flex: 0 0 auto;
      border: none;
      border-bottom: 2px solid transparent;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }

    .ml-ex-ui-dock-tab:hover {
      color: var(--ml-ui-text, #303133);
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.04));
    }

    .ml-ex-ui-dock-tab.is-active {
      color: var(--ml-ui-text, #303133);
      border-bottom-color: var(--ml-ui-accent, #409eff);
    }

    .ml-ex-ui-dock-actions {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      gap: 2px;
      padding: 0 4px;
    }

    .ml-ex-ui-dock-action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: var(--ml-ui-text-muted, #606266);
      cursor: pointer;
    }

    .ml-ex-ui-dock-action-btn:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
      color: var(--ml-ui-text, #303133);
    }

    .ml-ex-ui-dock-body {
      flex: 1 1 auto;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
      position: relative;
    }

    .ml-ex-ui-dock-tab-panel {
      position: absolute;
      inset: 0;
      overflow: auto;
    }

    .ml-ex-ui-dock-tab-panel:has(> .ml-ex-ui-review-palette),
    .ml-ex-ui-dock-tab-panel:has(> .ml-ex-ui-measure-palette),
    .ml-ex-ui-dock-tab-panel:has(> .ml-ex-ui-layer-list) {
      overflow: hidden;
    }

    .ml-ex-ui-dock-tab-panel[hidden] {
      display: none;
    }

    .ml-ex-ui-dock-side-menu {
      position: fixed;
      z-index: 110;
      min-width: 160px;
      padding: 4px 0;
      background: var(--ml-ui-bg, #ffffff);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 6px;
      box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.35));
    }

    .ml-ex-ui-dock-side-menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--ml-ui-text, #303133);
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      text-align: left;
    }

    .ml-ex-ui-dock-side-menu-item:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-dock-side-menu-item.is-selected {
      color: var(--ml-ui-accent, #409eff);
    }

    .ml-ex-ui-dock-tab-overflow-menu {
      position: fixed;
      z-index: 110;
      min-width: 160px;
      padding: 4px 0;
      background: var(--ml-ui-bg, #ffffff);
      border: 1px solid var(--ml-ui-border, #dcdfe6);
      border-radius: 6px;
      box-shadow: var(--ml-ui-shadow, 0 6px 18px rgba(0, 0, 0, 0.35));
    }

    .ml-ex-ui-dock-tab-overflow-menu-item {
      display: block;
      width: 100%;
      border: none;
      background: transparent;
      color: var(--ml-ui-text, #303133);
      padding: 6px 12px;
      font-size: 12px;
      cursor: pointer;
      text-align: left;
      white-space: nowrap;
    }

    .ml-ex-ui-dock-tab-overflow-menu-item:hover {
      background: var(--ml-ui-border, rgba(0, 0, 0, 0.06));
    }

    .ml-ex-ui-dock-tab-overflow-menu-item.is-selected {
      color: var(--ml-ui-accent, #409eff);
    }

    @media (max-width: 600px) {
      .ml-ex-ui-dock-panel[data-open='true'][data-phone-sheet='true'] {
        position: absolute;
        left: 0;
        right: 0;
        top: auto;
        bottom: var(--ml-ex-ui-phone-sheet-inset, 0px);
        width: 100%;
        height: var(--ml-ex-ui-dock-size);
        max-height: calc(100% - var(--ml-ex-ui-phone-sheet-inset, 0px));
        flex: none;
        flex-direction: column;
        z-index: 35;
        border: none;
        border-top: 1px solid var(--ml-ui-border, #dcdfe6);
        border-radius: 12px 12px 0 0;
        box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.18);
      }

      .ml-ex-ui-dock-panel[data-phone-sheet='true'] .ml-ex-ui-dock-resize-handle {
        display: none;
      }

      .ml-ex-ui-dock-panel[data-phone-sheet='true'] .ml-ex-ui-dock-sheet-chrome {
        display: flex;
        align-items: center;
        flex: 0 0 auto;
        min-height: 28px;
      }

      .ml-ex-ui-dock-panel[data-phone-sheet='true'] .ml-ex-ui-dock-header {
        display: none;
      }

      .ml-ex-ui-host-dock-sheet .ml-ex-ui-dock-main {
        flex: 1 1 auto;
      }
    }
  `,document.head.appendChild(e)}function on(){var e;Ie(),!document.querySelector(`.ml-ex-ui-layer-manager, .ml-ex-ui-dock-panel, .ml-ex-ui-review-palette, .ml-ex-ui-measure-palette`)&&((e=document.getElementById(J))==null||e.remove())}var X=120,sn=.75,cn=28,ln=class{constructor(e){this.tabs=new Map,this.overflowTabIds=[],this.resizeStartPos=0,this.resizeStartSize=0,this.handleResizePointerDown=e=>{if(e.button!==0||!this.isPanelOpen)return;e.preventDefault(),this.resizePointerId=e.pointerId,this.resizeStartPos=this.usesVerticalResize()?e.clientY:e.clientX,this.resizeStartSize=this.size;let t=e.currentTarget instanceof HTMLElement?e.currentTarget:this.resizeHandle;this.resizeCaptureTarget=t,t.setPointerCapture(e.pointerId),document.addEventListener(`pointermove`,this.handleResizePointerMove),document.addEventListener(`pointerup`,this.handleResizePointerUp),document.addEventListener(`pointercancel`,this.handleResizePointerUp)},this.handleResizePointerMove=e=>{if(this.resizePointerId!==e.pointerId)return;e.preventDefault();let t=this.usesPhoneSheet()||this.side===`bottom`?this.resizeStartPos-e.clientY:this.side===`top`?e.clientY-this.resizeStartPos:this.side===`right`?this.resizeStartPos-e.clientX:e.clientX-this.resizeStartPos;this.setSize(this.resizeStartSize+t)},this.handleResizePointerUp=e=>{if(this.resizePointerId!==e.pointerId)return;this.resizePointerId=void 0;let t=this.resizeCaptureTarget??this.resizeHandle;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId),this.resizeCaptureTarget=void 0,document.removeEventListener(`pointermove`,this.handleResizePointerMove),document.removeEventListener(`pointerup`,this.handleResizePointerUp),document.removeEventListener(`pointercancel`,this.handleResizePointerUp)},this.handleDocumentPointerDown=e=>{e.target instanceof Node&&(this.sideMenuRoot&&!this.sideMenuRoot.contains(e.target)&&!this.sideMenuButton.contains(e.target)&&this.closeSideMenu(),this.overflowMenuRoot&&!this.overflowMenuRoot.contains(e.target)&&!this.overflowButton.contains(e.target)&&this.closeOverflowMenu())},this.handleMobileMediaChange=()=>{this.usesPhoneSheet()&&this.side!==`bottom`&&this.side!==`top`&&(this.size=this.defaultHeight),this.applyLayoutState()},this.host=e.host,this.i18n=e.i18n,this.side=e.defaultSide??`left`,this.isPanelOpen=e.defaultOpen??!1,this.defaultHeight=e.defaultHeight??240,this.defaultWidth=e.defaultWidth??280,this.onOpen=e.onOpen,this.size=this.side===`bottom`||this.side===`top`?this.defaultHeight:this.defaultWidth,Y(),this.ensureHostLayout(),this.root=document.createElement(`div`),this.root.className=`ml-ex-ui-dock-panel`,this.root.dataset.side=this.side,this.root.dataset.open=String(this.isPanelOpen),this.resizeHandle=document.createElement(`div`),this.resizeHandle.className=`ml-ex-ui-dock-resize-handle`,this.resizeHandle.addEventListener(`pointerdown`,this.handleResizePointerDown),this.contentEl=document.createElement(`div`),this.contentEl.className=`ml-ex-ui-dock-content`;let t=document.createElement(`div`);t.className=`ml-ex-ui-dock-header`,this.tabsWrap=document.createElement(`div`),this.tabsWrap.className=`ml-ex-ui-dock-tabs-wrap`,this.tabsEl=document.createElement(`div`),this.tabsEl.className=`ml-ex-ui-dock-tabs`,this.tabsEl.setAttribute(`role`,`tablist`),this.overflowButton=document.createElement(`button`),this.overflowButton.type=`button`,this.overflowButton.className=`ml-ex-ui-dock-tab-overflow-btn`,this.overflowButton.hidden=!0,this.overflowButton.textContent=`»`,this.overflowButton.title=this.i18n.t(`dockPanel.moreTabs`),this.overflowButton.setAttribute(`aria-label`,this.i18n.t(`dockPanel.moreTabs`)),this.overflowButton.addEventListener(`click`,e=>{e.stopPropagation(),this.toggleOverflowMenu()}),this.tabsWrap.appendChild(this.tabsEl),this.tabsWrap.appendChild(this.overflowButton),this.tabOverflowObserver=new ResizeObserver(()=>{this.scheduleUpdateTabOverflow()}),this.tabOverflowObserver.observe(this.tabsWrap);let n=document.createElement(`div`);n.className=`ml-ex-ui-dock-actions`,this.sideMenuButton=document.createElement(`button`),this.sideMenuButton.type=`button`,this.sideMenuButton.className=`ml-ex-ui-dock-action-btn`,this.sideMenuButton.title=this.i18n.t(`dockPanel.dockSide`),this.sideMenuButton.setAttribute(`aria-label`,this.i18n.t(`dockPanel.dockSide`)),this.sideMenuButton.appendChild(x(ke)),this.sideMenuButton.addEventListener(`click`,e=>{e.stopPropagation(),this.toggleSideMenu()}),this.closeButton=document.createElement(`button`),this.closeButton.type=`button`,this.closeButton.className=`ml-ex-ui-dock-action-btn`,this.closeButton.title=this.i18n.t(`dockPanel.close`),this.closeButton.setAttribute(`aria-label`,this.i18n.t(`dockPanel.close`)),this.closeButton.appendChild(x($e)),this.closeButton.addEventListener(`click`,()=>this.close()),n.appendChild(this.sideMenuButton),n.appendChild(this.closeButton),t.appendChild(this.tabsWrap),t.appendChild(n),this.bodyEl=document.createElement(`div`),this.bodyEl.className=`ml-ex-ui-dock-body`,this.contentEl.appendChild(t),this.contentEl.appendChild(this.bodyEl),this.sheetChrome=document.createElement(`div`),this.sheetChrome.className=`ml-ex-ui-dock-sheet-chrome`,this.sheetGrabber=document.createElement(`div`),this.sheetGrabber.className=`ml-ex-ui-dock-sheet-grabber`,this.sheetGrabber.setAttribute(`role`,`separator`),this.sheetGrabber.setAttribute(`aria-orientation`,`horizontal`),this.sheetGrabber.title=this.i18n.t(`dockPanel.resize`),this.sheetGrabber.setAttribute(`aria-label`,this.i18n.t(`dockPanel.resize`)),this.sheetGrabber.addEventListener(`pointerdown`,this.handleResizePointerDown),this.sheetCloseButton=document.createElement(`button`),this.sheetCloseButton.type=`button`,this.sheetCloseButton.className=`ml-ex-ui-dock-sheet-close`,this.sheetCloseButton.title=this.i18n.t(`dockPanel.close`),this.sheetCloseButton.setAttribute(`aria-label`,this.i18n.t(`dockPanel.close`)),this.sheetCloseButton.appendChild(x(Be)),this.sheetCloseButton.addEventListener(`click`,()=>this.close()),this.sheetChrome.append(this.sheetGrabber,this.sheetCloseButton),this.root.appendChild(this.sheetChrome),this.root.appendChild(this.contentEl),this.root.appendChild(this.resizeHandle),this.ensureDockMainWrapper(),this.mountToHost(),this.bindMobileMediaQuery(),this.applyLayoutState()}hasTab(e){return this.tabs.has(e)}addTab(e){if(this.tabs.has(e.id)||!e.labelKey&&!e.label)return!1;let t=`ml-ex-ui-dock-tab-${e.id}`,n=`ml-ex-ui-dock-tabpanel-${e.id}`,r=document.createElement(`button`);r.type=`button`,r.className=`ml-ex-ui-dock-tab`,r.id=t,r.setAttribute(`role`,`tab`),r.setAttribute(`aria-controls`,n),r.dataset.tabId=e.id,r.textContent=this.getTabLabel(e),r.addEventListener(`click`,()=>{this.openPanel(e.id)});let i=document.createElement(`div`);return i.className=`ml-ex-ui-dock-tab-panel`,i.id=n,i.setAttribute(`role`,`tabpanel`),i.setAttribute(`aria-labelledby`,t),i.dataset.tabId=e.id,i.hidden=!0,i.tabIndex=-1,i.appendChild(e.content),this.tabs.set(e.id,{id:e.id,labelKey:e.labelKey,label:e.label,tabButton:r,panel:i}),this.tabsEl.appendChild(r),this.bodyEl.appendChild(i),this.activeTabId||this.setActiveTab(e.id),this.scheduleUpdateTabOverflow(),!0}reparentTo(e){if(this.host===e){this.ensureMounted(),this.applyLayoutState();return}let t=this.isPanelOpen,n=this.activeTabId;this.closeSideMenu(),this.closeOverflowMenu(),this.releaseDockMainWrapper(),this.root.remove(),this.clearHostLayoutClasses(),this.host=e,this.ensureHostLayout(),this.ensureDockMainWrapper(),this.mountToHost(),this.isPanelOpen=t,n&&this.tabs.has(n)&&this.setActiveTab(n),this.ensureMounted(),this.applyLayoutState()}ensureMounted(){this.root.isConnected||this.mountToHost()}removeTab(e){let t=this.tabs.get(e);if(t){if(t.tabButton.remove(),t.panel.remove(),this.tabs.delete(e),this.activeTabId===e){let e=this.tabs.keys().next().value;this.activeTabId=void 0,e&&this.setActiveTab(e)}this.scheduleUpdateTabOverflow()}}get hasTabs(){return this.tabs.size>0}open(e){var t;(t=this.onOpen)==null||t.call(this),e?this.setActiveTab(e):this.activeTabId?this.setActiveTab(this.activeTabId):this.tabs.size>0&&this.setActiveTab(this.tabs.keys().next().value),this.isPanelOpen=!0,this.ensureMounted(),this.applyLayoutState()}close(){this.isPanelOpen=!1,this.closeSideMenu(),this.closeOverflowMenu(),this.applyLayoutState()}toggle(e){if(this.isPanelOpen&&(!e||this.activeTabId===e)){this.close();return}this.open(e)}setSide(e){if(this.side===e)return;let t=this.side;this.side=e,(t===`left`||t===`right`)&&(e===`left`||e===`right`)||(t===`top`||t===`bottom`)&&(e===`top`||e===`bottom`)||(this.size=e===`bottom`||e===`top`?this.defaultHeight:this.defaultWidth),this.closeSideMenu(),this.closeOverflowMenu(),this.mountToHost(),this.applyLayoutState(),this.scheduleUpdateTabOverflow()}getMountHost(){return this.host}get isOpen(){return this.isPanelOpen}getSide(){return this.side}getSize(){return this.size}setPanelSize(e){this.setSize(e)}get activeTab(){return this.activeTabId}refreshLocale(){for(let e of this.tabs.values())e.tabButton.textContent=this.getTabLabel(e);this.sideMenuButton.title=this.i18n.t(`dockPanel.dockSide`),this.sideMenuButton.setAttribute(`aria-label`,this.i18n.t(`dockPanel.dockSide`)),this.closeButton.title=this.i18n.t(`dockPanel.close`),this.closeButton.setAttribute(`aria-label`,this.i18n.t(`dockPanel.close`)),this.overflowButton.title=this.i18n.t(`dockPanel.moreTabs`),this.overflowButton.setAttribute(`aria-label`,this.i18n.t(`dockPanel.moreTabs`)),this.sheetGrabber.title=this.i18n.t(`dockPanel.resize`),this.sheetGrabber.setAttribute(`aria-label`,this.i18n.t(`dockPanel.resize`)),this.sheetCloseButton.title=this.i18n.t(`dockPanel.close`),this.sheetCloseButton.setAttribute(`aria-label`,this.i18n.t(`dockPanel.close`)),this.sideMenuRoot&&this.renderSideMenuItems(),this.overflowMenuRoot&&this.renderOverflowMenuItems(),this.scheduleUpdateTabOverflow()}destroy(){var e;document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),document.removeEventListener(`pointermove`,this.handleResizePointerMove),document.removeEventListener(`pointerup`,this.handleResizePointerUp),document.removeEventListener(`pointercancel`,this.handleResizePointerUp),this.tabOverflowFrame!==void 0&&(cancelAnimationFrame(this.tabOverflowFrame),this.tabOverflowFrame=void 0),(e=this.tabOverflowObserver)==null||e.disconnect(),this.tabOverflowObserver=void 0,this.unbindMobileMediaQuery(),this.closeSideMenu(),this.closeOverflowMenu(),this.releaseDockMainWrapper(),this.clearHostLayoutClasses(),this.root.remove()}openPanel(e){this.setActiveTab(e),this.isPanelOpen=!0,this.applyLayoutState()}setActiveTab(e){if(this.tabs.has(e)){this.activeTabId=e;for(let t of this.tabs.values()){let n=t.id===e;t.tabButton.classList.toggle(`is-active`,n),t.tabButton.setAttribute(`aria-selected`,String(n)),t.tabButton.tabIndex=n?0:-1,t.panel.hidden=!n,n?t.panel.removeAttribute(`aria-hidden`):t.panel.setAttribute(`aria-hidden`,`true`)}this.scheduleUpdateTabOverflow()}}ensureHostLayout(){getComputedStyle(this.host).position===`static`&&(this.host.style.position=`relative`),this.host.classList.contains(`ml-ex-ui-host-dock`)||this.host.classList.add(`ml-ex-ui-host-dock`)}ensureDockMainWrapper(){var e;if((e=this.dockMainWrapper)!=null&&e.isConnected)return;let t=[];if(Array.from(this.host.childNodes).forEach(e=>{e instanceof HTMLElement&&e.classList.contains(`ml-ex-ui-dock-panel`)||t.push(e)}),t.length===0)return;let n=document.createElement(`div`);n.className=`ml-ex-ui-dock-main`,t.forEach(e=>n.appendChild(e)),this.host.appendChild(n),this.dockMainWrapper=n}releaseDockMainWrapper(){var e;if(!((e=this.dockMainWrapper)!=null&&e.isConnected)){this.dockMainWrapper=void 0;return}for(;this.dockMainWrapper.firstChild;)this.host.insertBefore(this.dockMainWrapper.firstChild,this.dockMainWrapper);this.dockMainWrapper.remove(),this.dockMainWrapper=void 0}clearHostLayoutClasses(){this.host.classList.remove(`ml-ex-ui-host-dock`,`ml-ex-ui-host-dock-top`,`ml-ex-ui-host-dock-bottom`,`ml-ex-ui-host-dock-left`,`ml-ex-ui-host-dock-right`,`ml-ex-ui-host-dock-sheet`)}mountToHost(){if(this.ensureDockMainWrapper(),this.root.isConnected&&this.root.remove(),this.side===`left`||this.side===`top`){this.host.insertBefore(this.root,this.host.firstChild);return}this.host.appendChild(this.root)}applyLayoutState(){let e=this.usesPhoneSheet();this.root.dataset.side=this.side,this.root.dataset.open=String(this.isPanelOpen),this.root.dataset.phoneSheet=String(e),this.host.classList.remove(`ml-ex-ui-host-dock-top`,`ml-ex-ui-host-dock-bottom`,`ml-ex-ui-host-dock-left`,`ml-ex-ui-host-dock-right`,`ml-ex-ui-host-dock-sheet`),this.isPanelOpen&&this.host.classList.add(e?`ml-ex-ui-host-dock-sheet`:`ml-ex-ui-host-dock-${this.side}`),e?this.syncPhoneSheetInset():this.root.style.removeProperty(`--ml-ex-ui-phone-sheet-inset`),this.root.style.setProperty(`--ml-ex-ui-dock-size`,`${this.size}px`),this.scheduleUpdateTabOverflow()}setSize(e){let t=this.getMaxSize();this.size=Math.max(X,Math.min(t,e)),this.root.style.setProperty(`--ml-ex-ui-dock-size`,`${this.size}px`),this.scheduleUpdateTabOverflow()}getMaxSize(){if(this.usesPhoneSheet()||this.side===`bottom`||this.side===`top`){let e=this.usesPhoneSheet()?this.host.clientHeight-this.getPhoneChromeInset():this.host.clientHeight;return Math.max(X,e*sn)}return Math.max(X,this.host.clientWidth*sn)}usesPhoneSheet(){return _e()}usesVerticalResize(){return this.usesPhoneSheet()||this.side===`bottom`||this.side===`top`}bindMobileMediaQuery(){typeof window.matchMedia==`function`&&(this.mobileMediaQuery=window.matchMedia(t),this.mobileMediaQuery.addEventListener(`change`,this.handleMobileMediaChange))}unbindMobileMediaQuery(){var e;(e=this.mobileMediaQuery)==null||e.removeEventListener(`change`,this.handleMobileMediaChange),this.mobileMediaQuery=void 0}syncPhoneSheetInset(){this.root.style.setProperty(`--ml-ex-ui-phone-sheet-inset`,`${this.getPhoneChromeInset()}px`)}getPhoneChromeInset(){let e=0,t=this.host.querySelector(`.ml-ex-ui-toolbar`);return t instanceof HTMLElement&&this.isElementVisible(t)&&(e+=t.offsetHeight),this.host.querySelectorAll(`.ml-ex-ui-subtoolbar`).forEach(t=>{t instanceof HTMLElement&&this.isElementVisible(t)&&(e+=t.offsetHeight)}),e}isElementVisible(e){return e.hidden?!1:e.offsetParent!==null||e.getClientRects().length>0}toggleSideMenu(){if(this.sideMenuRoot){this.closeSideMenu();return}this.closeOverflowMenu(),this.openSideMenu()}openSideMenu(){this.sideMenuRoot=document.createElement(`div`),this.sideMenuRoot.className=`ml-ex-ui-dock-side-menu`,this.sideMenuRoot.setAttribute(`role`,`menu`),this.renderSideMenuItems();let e=this.sideMenuButton.getBoundingClientRect();this.host.appendChild(this.sideMenuRoot),this.sideMenuRoot.style.top=`${e.bottom+4}px`,this.sideMenuRoot.style.left=`${Math.max(8,e.right-160)}px`,this.syncOutsidePointerListener()}renderSideMenuItems(){this.sideMenuRoot&&(this.sideMenuRoot.replaceChildren(),[{side:`top`,labelKey:`dockPanel.dockTop`,icon:f},{side:`bottom`,labelKey:`dockPanel.dockBottom`,icon:ce},{side:`left`,labelKey:`dockPanel.dockLeft`,icon:g},{side:`right`,labelKey:`dockPanel.dockRight`,icon:fe}].forEach(e=>{let t=document.createElement(`button`);t.type=`button`,t.className=`ml-ex-ui-dock-side-menu-item`,t.setAttribute(`role`,`menuitem`),e.side===this.side&&t.classList.add(`is-selected`),t.appendChild(x(e.icon));let n=document.createElement(`span`);n.textContent=this.i18n.t(e.labelKey),t.appendChild(n),t.addEventListener(`click`,t=>{t.stopPropagation(),this.setSide(e.side),this.closeSideMenu()}),this.sideMenuRoot.appendChild(t)}))}closeSideMenu(){var e;(e=this.sideMenuRoot)==null||e.remove(),this.sideMenuRoot=void 0,this.syncOutsidePointerListener()}syncOutsidePointerListener(){document.removeEventListener(`pointerdown`,this.handleDocumentPointerDown,!0),(this.sideMenuRoot||this.overflowMenuRoot)&&document.addEventListener(`pointerdown`,this.handleDocumentPointerDown,!0)}scheduleUpdateTabOverflow(){this.tabOverflowFrame===void 0&&(this.tabOverflowFrame=requestAnimationFrame(()=>{this.tabOverflowFrame=void 0,this.updateTabOverflow()}))}updateTabOverflow(){let e=Array.from(this.tabs.values());if(e.length===0){this.overflowButton.hidden=!0,this.overflowTabIds=[];return}this.overflowButton.hidden=!0,e.forEach(e=>{e.tabButton.hidden=!1});let t=this.tabsWrap.clientWidth;if(t<=0)return;if(e.reduce((e,t)=>e+t.tabButton.offsetWidth,0)<=t){this.overflowTabIds=[],this.overflowButton.hidden=!0,this.overflowButton.classList.remove(`is-active`),this.overflowMenuRoot&&this.closeOverflowMenu();return}let n=this.activeTabId??e[0].id,r=t-cn,i=new Set(e.map(e=>e.id)),a=new Set,o=()=>e.filter(e=>i.has(e.id)).reduce((e,t)=>e+t.tabButton.offsetWidth,0);for(;i.size>1&&o()>r;){let t;for(let r=e.length-1;r>=0;--r){let a=e[r].id;if(a!==n&&i.has(a)){t=a;break}}if(!t)break;i.delete(t),a.add(t)}if(!i.has(n))for(a.delete(n),i.add(n);i.size>1&&o()>r;){let t;for(let r=e.length-1;r>=0;--r){let a=e[r].id;if(a!==n&&i.has(a)){t=a;break}}if(!t)break;i.delete(t),a.add(t)}e.forEach(e=>{e.tabButton.hidden=a.has(e.id)}),this.overflowTabIds=e.filter(e=>a.has(e.id)).map(e=>e.id),this.overflowButton.hidden=this.overflowTabIds.length===0,this.overflowButton.classList.toggle(`is-active`,this.overflowTabIds.includes(n)),this.overflowMenuRoot&&this.overflowTabIds.length===0?this.closeOverflowMenu():this.overflowMenuRoot&&this.renderOverflowMenuItems()}getTabLabel(e){return e.label?e.label:e.labelKey?this.i18n.t(e.labelKey):``}toggleOverflowMenu(){if(this.overflowMenuRoot){this.closeOverflowMenu();return}this.closeSideMenu(),this.openOverflowMenu()}openOverflowMenu(){if(this.overflowTabIds.length===0)return;this.overflowMenuRoot=document.createElement(`div`),this.overflowMenuRoot.className=`ml-ex-ui-dock-tab-overflow-menu`,this.overflowMenuRoot.setAttribute(`role`,`menu`),this.renderOverflowMenuItems();let e=this.overflowButton.getBoundingClientRect();this.host.appendChild(this.overflowMenuRoot),this.overflowMenuRoot.style.top=`${e.bottom+4}px`,this.overflowMenuRoot.style.left=`${Math.max(8,e.right-180)}px`,this.syncOutsidePointerListener()}renderOverflowMenuItems(){this.overflowMenuRoot&&(this.overflowMenuRoot.replaceChildren(),this.overflowTabIds.forEach(e=>{let t=this.tabs.get(e);if(!t)return;let n=document.createElement(`button`);n.type=`button`,n.className=`ml-ex-ui-dock-tab-overflow-menu-item`,n.setAttribute(`role`,`menuitem`),e===this.activeTabId&&n.classList.add(`is-selected`),n.textContent=this.getTabLabel(t),n.addEventListener(`click`,t=>{t.stopPropagation(),this.openPanel(e),this.closeOverflowMenu()}),this.overflowMenuRoot.appendChild(n)}))}closeOverflowMenu(){var e;(e=this.overflowMenuRoot)==null||e.remove(),this.overflowMenuRoot=void 0,this.syncOutsidePointerListener()}},un=class{constructor(e,t,n){this.i18n=e,Y(),this.backdrop=document.createElement(`div`),this.backdrop.className=`ml-ex-ui-color-dialog-backdrop`,this.backdrop.addEventListener(`mousedown`,e=>{e.target===this.backdrop&&this.finish(null)});let r=document.createElement(`div`);r.className=`ml-ex-ui-color-dialog`,r.addEventListener(`mousedown`,e=>e.stopPropagation());let i=document.createElement(`div`);i.className=`ml-ex-ui-color-dialog-header`;let a=document.createElement(`div`);a.className=`ml-ex-ui-color-dialog-title`,a.textContent=this.i18n.t(`colorPicker.title`);let o=document.createElement(`button`);o.type=`button`,o.className=`ml-ex-ui-color-dialog-close`,o.setAttribute(`aria-label`,`Close`),o.textContent=`×`,o.addEventListener(`click`,()=>this.finish(null)),i.appendChild(a),i.appendChild(o),r.appendChild(i),this.picker=d({labels:{index:this.i18n.t(`colorPicker.index`),rgb:this.i18n.t(`colorPicker.rgb`),input:this.i18n.t(`colorPicker.input`),inputPlaceholder:this.i18n.t(`colorPicker.inputPlaceholder`)},initialIndex:this.toColorIndex(n)}),r.appendChild(this.picker.root);let s=document.createElement(`div`);s.className=`ml-ex-ui-dialog-actions`;let c=document.createElement(`button`);c.type=`button`,c.className=`ml-ex-ui-btn`,c.textContent=this.i18n.t(`colorPicker.cancel`),c.addEventListener(`click`,()=>this.finish(null));let l=document.createElement(`button`);l.type=`button`,l.className=`ml-ex-ui-btn ml-ex-ui-btn-primary`,l.textContent=this.i18n.t(`colorPicker.ok`),l.addEventListener(`click`,()=>this.finish(this.toSelectedColor())),s.appendChild(c),s.appendChild(l),r.appendChild(s),this.backdrop.appendChild(r),t.appendChild(this.backdrop)}open(){return new Promise(e=>{this.resolve=e})}finish(e){var t;this.picker.dispose(),this.backdrop.remove(),(t=this.resolve)==null||t.call(this,e),this.resolve=void 0}toColorIndex(e){return e?e.isByLayer?256:e.isByBlock?0:e.isByACI&&e.colorIndex!=null?e.colorIndex:null:null}toSelectedColor(){let e=this.picker.getIndex();if(e==null)return null;if(e===256){let e=new v;return e.setByLayer(),e}if(e===0){let e=new v;return e.setByBlock(),e}return new v(u.ByACI,e)}},dn=class{constructor(e){if(this.nameSortOrder=`none`,this.handleDocumentActivated=()=>{this.bindToActiveDocument(),this.renderRows()},this.handleLayersChanged=()=>{this.renderRows()},this.editor=e.editor,this.i18n=e.i18n,this.host=e.host,this.showHeader=e.showHeader??!1,Y(),this.element=document.createElement(`div`),this.element.className=`ml-ex-ui-layer-list`,this.showHeader){let t=document.createElement(`div`);t.className=`ml-ex-ui-layer-manager-header`;let n=document.createElement(`span`);this.titleEl=n,n.textContent=e.i18n.t(`layerManager.title`),t.appendChild(n),this.element.appendChild(t)}let t=document.createElement(`div`);t.className=`ml-ex-ui-layer-table-wrap`;let n=document.createElement(`table`);n.className=`ml-ex-ui-layer-table`;let r=document.createElement(`thead`),i=document.createElement(`tr`),a=document.createElement(`th`);this.nameHeaderEl=a,a.className=`ml-ex-ui-layer-name-header is-sortable`,a.setAttribute(`role`,`columnheader`),a.setAttribute(`aria-sort`,`none`);let o=document.createElement(`button`);o.type=`button`,o.className=`ml-ex-ui-layer-name-sort`;let s=document.createElement(`span`);this.nameHeaderLabelEl=s,s.textContent=e.i18n.t(`layerManager.name`);let c=document.createElement(`span`);this.nameSortIndicatorEl=c,c.className=`ml-ex-ui-layer-sort-indicator`,c.setAttribute(`aria-hidden`,`true`),o.appendChild(s),o.appendChild(c),o.addEventListener(`click`,()=>{this.cycleNameSortOrder()}),a.appendChild(o),this.updateNameSortHeader();let l=document.createElement(`th`);l.className=`center`;let u=document.createElement(`div`);u.className=`ml-ex-ui-layer-header-on`;let d=document.createElement(`span`);this.onLabelEl=d,d.textContent=e.i18n.t(`layerManager.on`),this.masterCheckbox=document.createElement(`input`),this.masterCheckbox.type=`checkbox`,this.masterCheckbox.addEventListener(`change`,()=>{let e=this.activeLayerStore;e&&(this.masterCheckbox.checked?e.setAllLayersOn():e.setAllLayersOffExceptCurrent())}),u.appendChild(d),u.appendChild(this.masterCheckbox),l.appendChild(u);let f=document.createElement(`th`);f.className=`center`,this.colorHeaderEl=f,f.textContent=e.i18n.t(`layerManager.color`),i.appendChild(a),i.appendChild(l),i.appendChild(f),r.appendChild(i),this.tbody=document.createElement(`tbody`),n.appendChild(r),n.appendChild(this.tbody),t.appendChild(n),this.element.appendChild(t),this.editor.events.documentActivated.addEventListener(this.handleDocumentActivated),this.bindToActiveDocument(),this.renderRows()}get activeLayerStore(){return this.editor.curDocument?.layerStore}bindToActiveDocument(){this.subscribedLayerStore&&this.subscribedLayerStore.events.changed.removeEventListener(this.handleLayersChanged),this.subscribedLayerStore=this.activeLayerStore,this.subscribedLayerStore&&this.subscribedLayerStore.events.changed.addEventListener(this.handleLayersChanged)}refreshLocale(){this.titleEl&&(this.titleEl.textContent=this.i18n.t(`layerManager.title`)),this.nameHeaderLabelEl.textContent=this.i18n.t(`layerManager.name`),this.onLabelEl.textContent=this.i18n.t(`layerManager.on`),this.colorHeaderEl.textContent=this.i18n.t(`layerManager.color`),this.updateNameSortHeader()}cycleNameSortOrder(){this.nameSortOrder=this.nameSortOrder===`none`?`asc`:this.nameSortOrder===`asc`?`desc`:`none`,this.updateNameSortHeader(),this.renderRows()}updateNameSortHeader(){var e;let t=this.nameSortOrder===`asc`?`layerManager.sortByNameDesc`:this.nameSortOrder===`desc`?`layerManager.sortByNameNone`:`layerManager.sortByNameAsc`,n=this.i18n.t(t);this.nameHeaderEl.title=n,(e=this.nameHeaderEl.querySelector(`button`))==null||e.setAttribute(`aria-label`,n),this.nameHeaderEl.setAttribute(`aria-sort`,this.nameSortOrder===`asc`?`ascending`:this.nameSortOrder===`desc`?`descending`:`none`),this.nameHeaderEl.classList.toggle(`is-sorted-asc`,this.nameSortOrder===`asc`),this.nameHeaderEl.classList.toggle(`is-sorted-desc`,this.nameSortOrder===`desc`),this.nameSortIndicatorEl.textContent=this.nameSortOrder===`asc`?`▲`:this.nameSortOrder===`desc`?`▼`:``}getSortedLayers(e){if(this.nameSortOrder===`none`)return e;let t=this.nameSortOrder===`asc`?1:-1;return[...e].sort((e,n)=>t*e.name.localeCompare(n.name,void 0,{numeric:!0,sensitivity:`base`}))}destroy(){this.editor.events.documentActivated.removeEventListener(this.handleDocumentActivated),this.subscribedLayerStore&&this.subscribedLayerStore.events.changed.removeEventListener(this.handleLayersChanged)}renderRows(){let e=this.activeLayerStore;if(this.tbody.replaceChildren(),!e){this.masterCheckbox.checked=!1,this.masterCheckbox.indeterminate=!1;return}let t=this.getSortedLayers(e.getLayers()),n=e.getCurrentLayerName();t.forEach(e=>{this.tbody.appendChild(this.createRow(e,n))});let r=t.length>0&&t.every(e=>e.isOn),i=t.some(e=>e.isOn);this.masterCheckbox.checked=r,this.masterCheckbox.indeterminate=i&&!r}createRow(e,t){let n=document.createElement(`tr`);n.addEventListener(`dblclick`,()=>{var t;(t=h.instance.curView)!=null&&t.zoomToFitLayer(e.name)&&this.showToast(this.i18n.t(`layerManager.zoomToLayer`,{layer:e.name}))});let r=document.createElement(`td`),i=document.createElement(`span`);if(i.className=`ml-ex-ui-layer-name`,i.textContent=e.name,e.name===t){let e=document.createElement(`span`);e.className=`ml-ex-ui-layer-current-marker`,e.textContent=`*`,e.title=this.i18n.t(`layerManager.currentLayer`),e.setAttribute(`aria-hidden`,`true`),i.appendChild(e)}r.appendChild(i);let a=document.createElement(`td`);a.className=`center`;let o=document.createElement(`input`);o.type=`checkbox`,o.checked=e.isOn,o.addEventListener(`change`,()=>{var t;(t=this.activeLayerStore)==null||t.setLayerOn(e.name,o.checked)}),a.appendChild(o);let s=document.createElement(`td`);s.className=`center`;let c=document.createElement(`span`);return c.className=`ml-ex-ui-layer-color`,c.style.background=e.cssColor,c.addEventListener(`click`,async()=>{var t;let n=v.fromString(e.color),r=await new un(this.i18n,this.host,n??void 0).open();r&&((t=this.activeLayerStore)==null||t.setLayerColor(e.name,r))}),s.appendChild(c),n.appendChild(r),n.appendChild(a),n.appendChild(s),n}showToast(e){let t=document.createElement(`div`);t.className=`ml-ex-ui-toast`,t.textContent=e,document.body.appendChild(t),window.setTimeout(()=>t.remove(),1500)}},fn=[`distance`,`arc`,`angle`,`area`],pn=class{constructor(e){this.filterButtons=new Map,this.measurements=[],this.tableContentKey=``,this.editor=e.editor,this.i18n=e.i18n,Y(),this.element=document.createElement(`div`),this.element.className=`ml-ex-ui-measure-palette`,this.buildDom(),this.refreshLocale(),this.unsubscribeList=Qe(()=>this.syncFromStore()),this.unsubscribeSelection=Me(()=>this.syncFromStore()),this.syncFromStore()}refreshLocale(){this.filterGroup.setAttribute(`aria-label`,this.i18n.t(`measurePalette.filterGroup`));for(let[e,t]of this.filterButtons){let n=this.i18n.t(`measurePalette.typeValues.${e}`);t.textContent=n,t.title=n,t.setAttribute(`aria-label`,n)}this.clearButton.textContent=this.i18n.t(`measurePalette.clear`),this.typeHeaderEl.textContent=this.i18n.t(`measurePalette.type`),this.valueHeaderEl.textContent=this.i18n.t(`measurePalette.value`),this.renderTable()}destroy(){var e,t;(e=this.unsubscribeList)==null||e.call(this),this.unsubscribeList=void 0,(t=this.unsubscribeSelection)==null||t.call(this),this.unsubscribeSelection=void 0}buildDom(){let e=document.createElement(`div`);e.className=`ml-ex-ui-measure-toolbar`,this.filterGroup=document.createElement(`div`),this.filterGroup.className=`ml-ex-ui-measure-filter`,this.filterGroup.setAttribute(`role`,`group`);for(let e of fn){let t=document.createElement(`button`);t.type=`button`,t.className=`ml-ex-ui-measure-filter-btn`,t.dataset.measureFilter=e,t.setAttribute(`aria-pressed`,`false`),t.addEventListener(`click`,()=>this.toggleFilter(e)),this.filterButtons.set(e,t),this.filterGroup.appendChild(t)}e.appendChild(this.filterGroup),this.clearButton=document.createElement(`button`),this.clearButton.type=`button`,this.clearButton.className=`ml-ex-ui-measure-btn`,this.clearButton.addEventListener(`click`,()=>this.clearAll()),e.appendChild(this.clearButton),this.element.appendChild(e);let t=document.createElement(`div`);t.className=`ml-ex-ui-measure-table-wrap`;let n=document.createElement(`table`);n.className=`ml-ex-ui-measure-table`;let r=document.createElement(`thead`),i=document.createElement(`tr`);this.typeHeaderEl=document.createElement(`th`),this.valueHeaderEl=document.createElement(`th`),this.actionsHeaderEl=document.createElement(`th`),this.actionsHeaderEl.className=`ml-ex-ui-measure-actions-col`,i.append(this.typeHeaderEl,this.valueHeaderEl,this.actionsHeaderEl),r.appendChild(i),n.appendChild(r),this.tbody=document.createElement(`tbody`),this.tbody.addEventListener(`click`,e=>{let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`button[data-measure-delete]`);if(n instanceof HTMLElement&&this.tbody.contains(n)){e.stopPropagation();let t=n.dataset.measureDelete;t&&this.removeOne(t);return}let r=this.rowMeasurementId(e);r&&this.handleRowClick(r)}),n.appendChild(this.tbody),t.appendChild(n),this.element.appendChild(t)}syncFromStore(){let e=this.editor.curView;this.measurements=e?se(e):[],this.selectedId=it(),this.clearButton.disabled=this.measurements.length===0,this.refreshTable()}rowMeasurementId(e){let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`tr[data-measure-id]`);if(n&&this.tbody.contains(n))return n instanceof HTMLElement?n.dataset.measureId:void 0}refreshTable(){let e=this.editor.curDocument?.database,t=this.measurements.map(t=>`${t.id}	${t.type}	${nt(t.id,e)}`).join(`
`);if(t===this.tableContentKey&&this.tbody.querySelector(`tr[data-measure-id], .ml-ex-ui-measure-empty-row`)){this.syncRowSelection();return}this.tableContentKey=t,this.renderTable()}syncRowSelection(){this.tbody.querySelectorAll(`tr[data-measure-id]`).forEach(e=>{e.classList.toggle(`is-selected`,e.dataset.measureId===this.selectedId)})}renderTable(){let e=this.filteredMeasurements(),t=this.editor.curDocument?.database;if(this.tbody.replaceChildren(),e.length===0){let e=document.createElement(`tr`);e.className=`ml-ex-ui-measure-empty-row`;let t=document.createElement(`td`);t.colSpan=3,t.textContent=this.i18n.t(`measurePalette.empty`),e.appendChild(t),this.tbody.appendChild(e);return}let n=this.i18n.t(`measurePalette.delete`);for(let r of e){let e=document.createElement(`tr`);e.className=`ml-ex-ui-measure-row`,e.dataset.measureId=r.id,r.id===this.selectedId&&e.classList.add(`is-selected`);let i=document.createElement(`td`);i.textContent=this.typeLabel(r.type);let a=document.createElement(`td`),o=nt(r.id,t)||`—`;a.textContent=o,a.title=o;let s=document.createElement(`td`);s.className=`ml-ex-ui-measure-actions-col`;let c=document.createElement(`button`);c.type=`button`,c.className=`ml-ex-ui-measure-btn ml-ex-ui-measure-btn-danger ml-ex-ui-measure-row-delete`,c.dataset.measureDelete=r.id,c.textContent=n,c.title=n,c.setAttribute(`aria-label`,n),s.appendChild(c),e.append(i,a,s),this.tbody.appendChild(e)}}filteredMeasurements(){return this.activeFilter?this.measurements.filter(e=>e.type===this.activeFilter):this.measurements}toggleFilter(e){this.activeFilter=this.activeFilter===e?void 0:e;for(let[e,t]of this.filterButtons){let n=this.activeFilter===e;t.classList.toggle(`is-active`,n),t.setAttribute(`aria-pressed`,String(n))}this.renderTable()}handleRowClick(e){let t=this.measurements.find(t=>t.id===e),n=this.editor.curView;!t||!n||Ae(n,t)}removeOne(e){let t=this.editor.curView;t&&Ve(t,e)}clearAll(){let e=this.editor.curView;e&&Ge(e)}typeLabel(e){let t=`measurePalette.typeValues.${e}`,n=this.i18n.t(t);return n===t?e:n}},mn=class{constructor(e){this.markups=[],this.tableContentKey=``,this.detailsOpen=!0,this.editor=e.editor,this.i18n=e.i18n,Y(),this.element=document.createElement(`div`),this.element.className=`ml-ex-ui-review-palette`,this.buildDom(),this.refreshLocale(),this.unsubscribeStore=c().subscribe(()=>{this.syncFromStore()}),this.syncFromStore()}refreshLocale(){this.searchInput.placeholder=this.i18n.t(`reviewPalette.searchPlaceholder`),this.clearButton.textContent=this.i18n.t(`reviewPalette.clear`),this.typeHeaderEl.textContent=this.i18n.t(`reviewPalette.type`),this.statusHeaderEl.textContent=this.i18n.t(`reviewPalette.status`),this.authorHeaderEl.textContent=this.i18n.t(`reviewPalette.author`),this.summaryHeaderEl.textContent=this.i18n.t(`reviewPalette.summary`),this.detailTitleEl.textContent=this.i18n.t(`reviewPalette.details`);let e=this.i18n.t(`reviewPalette.closeDetails`);this.closeDetailsButton.title=e,this.closeDetailsButton.setAttribute(`aria-label`,e),this.statusFieldLabelEl.textContent=this.i18n.t(`reviewPalette.status`),this.authorFieldLabelEl.textContent=this.i18n.t(`reviewPalette.author`),this.textFieldLabelEl.textContent=this.i18n.t(`reviewPalette.label`),this.commentFieldLabelEl.textContent=this.i18n.t(`reviewPalette.comment`),this.zoomButton.textContent=this.i18n.t(`reviewPalette.zoomTo`),this.deleteButton.textContent=this.i18n.t(`reviewPalette.delete`),this.rebuildStatusOptions(),this.renderTable(),this.updateDetailFields({preserveDrafts:!0})}destroy(){var e;(e=this.unsubscribeStore)==null||e.call(this),this.unsubscribeStore=void 0}buildDom(){let e=document.createElement(`div`);e.className=`ml-ex-ui-review-toolbar`,this.searchInput=document.createElement(`input`),this.searchInput.type=`search`,this.searchInput.className=`ml-ex-ui-review-search`,this.searchInput.addEventListener(`input`,()=>this.renderTable()),e.appendChild(this.searchInput),this.clearButton=document.createElement(`button`),this.clearButton.type=`button`,this.clearButton.className=`ml-ex-ui-review-btn`,this.clearButton.addEventListener(`click`,()=>this.clearAll()),e.appendChild(this.clearButton),this.element.appendChild(e);let t=document.createElement(`div`);t.className=`ml-ex-ui-review-table-wrap`;let n=document.createElement(`table`);n.className=`ml-ex-ui-review-table`;let r=document.createElement(`thead`),i=document.createElement(`tr`);this.typeHeaderEl=document.createElement(`th`),this.statusHeaderEl=document.createElement(`th`),this.authorHeaderEl=document.createElement(`th`),this.summaryHeaderEl=document.createElement(`th`),i.append(this.typeHeaderEl,this.statusHeaderEl,this.authorHeaderEl,this.summaryHeaderEl),r.appendChild(i),n.appendChild(r),this.tbody=document.createElement(`tbody`),this.tbody.addEventListener(`click`,e=>{let t=this.rowMarkupId(e);t&&this.handleRowClick(t)}),this.tbody.addEventListener(`dblclick`,e=>{let t=this.rowMarkupId(e);if(!t)return;let n=this.markups.find(e=>e.id===t);n&&this.handleRowDblClick(n)}),n.appendChild(this.tbody),t.appendChild(n),this.element.appendChild(t),this.detailEl=document.createElement(`div`),this.detailEl.className=`ml-ex-ui-review-detail`,this.detailEl.hidden=!0;let a=document.createElement(`div`);a.className=`ml-ex-ui-review-detail-header`,this.detailTitleEl=document.createElement(`div`),this.detailTitleEl.className=`ml-ex-ui-review-detail-title`,this.closeDetailsButton=document.createElement(`button`),this.closeDetailsButton.type=`button`,this.closeDetailsButton.className=`ml-ex-ui-review-detail-close`,this.closeDetailsButton.appendChild(x($e)),this.closeDetailsButton.addEventListener(`click`,()=>this.closeDetails()),a.append(this.detailTitleEl,this.closeDetailsButton),this.detailEl.appendChild(a);let o=document.createElement(`div`);o.className=`ml-ex-ui-review-detail-form`;let s=this.createField();this.statusFieldLabelEl=s.label,this.statusSelect=document.createElement(`select`),this.statusSelect.className=`ml-ex-ui-review-select`,this.statusSelect.addEventListener(`change`,()=>{let e=this.selectedMarkup();e&&this.updateMeta(e.id,{status:this.statusSelect.value})}),s.body.appendChild(this.statusSelect),o.appendChild(s.root);let c=this.createField();this.authorFieldLabelEl=c.label,this.authorInput=document.createElement(`input`),this.authorInput.type=`text`,this.authorInput.className=`ml-ex-ui-review-input`,this.authorInput.disabled=!0,c.body.appendChild(this.authorInput),o.appendChild(c.root);let l=this.createField();this.textFieldLabelEl=l.label,this.textInput=document.createElement(`input`),this.textInput.type=`text`,this.textInput.className=`ml-ex-ui-review-input`,this.textInput.addEventListener(`blur`,()=>this.commitText()),this.textInput.addEventListener(`keydown`,e=>{e.key!==`Enter`||e.isComposing||e.keyCode===229||(e.preventDefault(),this.commitText(),this.textInput.blur())}),l.body.appendChild(this.textInput),o.appendChild(l.root);let u=this.createField();this.commentFieldLabelEl=u.label,this.commentInput=document.createElement(`textarea`),this.commentInput.className=`ml-ex-ui-review-textarea`,this.commentInput.rows=2,this.commentInput.addEventListener(`blur`,()=>this.commitComment()),u.body.appendChild(this.commentInput),o.appendChild(u.root);let d=document.createElement(`div`);d.className=`ml-ex-ui-review-detail-actions`,this.zoomButton=document.createElement(`button`),this.zoomButton.type=`button`,this.zoomButton.className=`ml-ex-ui-review-btn`,this.zoomButton.addEventListener(`click`,()=>{let e=this.selectedMarkup();e&&this.focusMarkup(e)}),this.deleteButton=document.createElement(`button`),this.deleteButton.type=`button`,this.deleteButton.className=`ml-ex-ui-review-btn ml-ex-ui-review-btn-danger`,this.deleteButton.addEventListener(`click`,()=>{let e=this.selectedMarkup();e&&this.removeMarkup(e.id)}),d.append(this.zoomButton,this.deleteButton),o.appendChild(d),this.detailEl.appendChild(o),this.element.appendChild(this.detailEl)}createField(){let e=document.createElement(`div`);e.className=`ml-ex-ui-review-field`;let t=document.createElement(`label`);t.className=`ml-ex-ui-review-field-label`;let n=document.createElement(`div`);return n.className=`ml-ex-ui-review-field-body`,e.append(t,n),{root:e,label:t,body:n}}rebuildStatusOptions(){let e=this.statusSelect.value;this.statusSelect.replaceChildren();for(let e of Ke){let t=document.createElement(`option`);t.value=e,t.textContent=this.statusLabel(e),this.statusSelect.appendChild(t)}e&&(this.statusSelect.value=e)}syncFromStore(){let e=c(),t=this.lastSelectedId;this.markups=e.list(),this.selectedId=e.selectedId,t&&t!==this.selectedId&&this.commitDraftsFor(t),this.selectedId&&this.selectedId!==t&&(this.loadDrafts(),this.detailsOpen=!0),this.selectedId||(this.detailsOpen=!1),this.lastSelectedId=this.selectedId,this.clearButton.disabled=this.markups.length===0,this.refreshTable(),this.updateDetailFields({preserveDrafts:this.selectedId===t})}rowMarkupId(e){let t=e.target;if(!(t instanceof Element))return;let n=t.closest(`tr[data-markup-id]`);if(n&&this.tbody.contains(n))return n instanceof HTMLElement?n.dataset.markupId:void 0}refreshTable(){let e=this.markups.map(e=>`${e.id}	${e.type}	${e.status}	${e.author}	${e.text??``}	${e.comment}`).join(`
`);if(e===this.tableContentKey&&this.tbody.querySelector(`tr[data-markup-id], .ml-ex-ui-review-empty-row`)){this.syncRowSelection();return}this.tableContentKey=e,this.renderTable()}syncRowSelection(){this.tbody.querySelectorAll(`tr[data-markup-id]`).forEach(e=>{e.classList.toggle(`is-selected`,e.dataset.markupId===this.selectedId)})}renderTable(){let e=this.filteredMarkups();if(this.tbody.replaceChildren(),e.length===0){let e=document.createElement(`tr`);e.className=`ml-ex-ui-review-empty-row`;let t=document.createElement(`td`);t.colSpan=4,t.textContent=this.i18n.t(`reviewPalette.empty`),e.appendChild(t),this.tbody.appendChild(e);return}for(let t of e){let e=document.createElement(`tr`);e.className=`ml-ex-ui-review-row`,e.dataset.markupId=t.id,t.id===this.selectedId&&e.classList.add(`is-selected`);let n=document.createElement(`td`);n.textContent=this.typeLabel(t.type);let r=document.createElement(`td`);r.textContent=this.statusLabel(t.status);let i=document.createElement(`td`);i.textContent=t.author,i.title=t.author;let a=document.createElement(`td`),o=t.text||t.comment||`—`;a.textContent=o,a.title=o,e.append(n,r,i,a),this.tbody.appendChild(e)}}updateDetailFields(e){let t=this.selectedMarkup(),n=!!(t&&this.detailsOpen);if(this.detailEl.hidden=!n,t&&n){if(this.statusSelect.value=t.status,this.authorInput.value=t.author,e.preserveDrafts){let e=document.activeElement;e!==this.textInput&&(this.textInput.value=t.text??``),e!==this.commentInput&&(this.commentInput.value=t.comment??``);return}this.loadDrafts()}}loadDrafts(){let e=this.selectedMarkup();this.textInput.value=e?.text??``,this.commentInput.value=e?.comment??``,this.authorInput.value=e?.author??``,e&&(this.statusSelect.value=e.status)}filteredMarkups(){let e=this.searchInput.value.trim().toLowerCase();return e?this.markups.filter(t=>`${t.type} ${t.status} ${t.author} ${t.text??``} ${t.comment}`.toLowerCase().includes(e)):this.markups}selectedMarkup(){return this.markups.find(e=>e.id===this.selectedId)}handleRowClick(e){this.detailsOpen=!0;let t=this.editor.curView;t&&T().select(t,e),this.updateDetailFields({preserveDrafts:!0})}handleRowDblClick(e){this.handleRowClick(e.id),this.focusMarkup(e)}closeDetails(){this.commitText(),this.commitComment(),this.detailsOpen=!1,this.detailEl.hidden=!0}commitText(){let e=this.selectedId;if(!e)return;let t=this.markups.find(t=>t.id===e),n=this.textInput.value;n!==(t?.text??``)&&this.updateMeta(e,{text:n})}commitComment(){let e=this.selectedId;if(!e)return;let t=this.markups.find(t=>t.id===e),n=this.commentInput.value;n!==(t?.comment??``)&&this.updateMeta(e,{comment:n})}commitDraftsFor(e){let t=this.markups.find(t=>t.id===e);if(!t)return;let n=this.textInput.value,r=this.commentInput.value,i={};n!==(t.text??``)&&(i.text=n),r!==(t.comment??``)&&(i.comment=r),Object.keys(i).length!==0&&this.updateMeta(e,i)}updateMeta(e,t){let n=this.editor.curView;n&&ze(n,`Edit Markup`,()=>{let r=c().updateMeta(e,t);r&&(t.text!==void 0||t.comment!==void 0)&&T().publish(n,r)})}focusMarkup(e){let t=this.editor.curView;t&&T().focus(t,e)}removeMarkup(e){let t=this.editor.curView;t&&T().unpublish(t,e)}clearAll(){let e=this.editor.curView;e&&T().clearVisuals(e,{clearStore:!0})}statusLabel(e){return this.i18n.t(`reviewPalette.statusValues.${e}`)}typeLabel(e){let t=`reviewPalette.typeValues.${e}`,n=this.i18n.t(t);return n===t?e:n}},Z=`layers`,Q=`review`,$=`measurements`,hn=class{constructor(e={}){this.options=e,this.name=Ht,this.version=ht.version,this.description=`Framework-agnostic toolbar, layer manager, and review palette UI`,this.layerUiControllerHolder=new gt,this.baseToolbarItems=[],this.toolbarItemsInput=`default`,this.toolbarItemsOverridden=!1,this.hasLayerToolbarItem=!1,this.hasMarkupPanelToolbarItem=!1,this.hasMeasurementPanelToolbarItem=!1,this.dockPanelExplicitlyEnabled=!1,this.toolbarPlacement=`right`,this.toolbarCollapsible=!1,this.toolbarEdgeOffset=8,this.toolbarSideOffset=0,this.toolbarInCanvasParent=!1,this.toolbarShowLabels=!1,this.toolbarShowChildrenIndicator=!0,this.toolbarShowBorder=!0,this.toolbarShowButtonBorder=!1,this.toolbarShowSeparators=!0,this.toolbarSize=`auto`,this.toolbarOverflow=`menu`,this.layoutMode=`auto`,this.activeLayoutKind=`desktop`,this.registeredCommands=[],this.handleLocaleChanged=()=>{var e,t,n,r,i;this.rebuildToolbarItems(this.activeLayoutKind),(e=this.toolbar)==null||e.setSelectedChild(`locale`,`locale-${w.currentLocale}`),(t=this.layerListView)==null||t.refreshLocale(),(n=this.reviewPaletteView)==null||n.refreshLocale(),(r=this.measurementPaletteView)==null||r.refreshLocale(),(i=this.dockPanel)==null||i.refreshLocale(),this.toolbar&&(this.toolbar.updateItems(this.baseToolbarItems),this.toolbar.refreshLocale())},this.handleDocumentActivatedForDock=()=>{var e,t;this.hasLayerToolbarItem&&this.mountLayerDockUi(),this.hasMarkupPanelToolbarItem&&this.mountReviewDockUi(),this.hasMeasurementPanelToolbarItem&&this.mountMeasurementDockUi(),this.tryUpgradeDockMountTarget(),(e=this.dockPanel)==null||e.ensureMounted(),this.ensureViewerToolbar(),this.tryUpgradeToolbarMountTarget(),(t=this.toolbar)==null||t.syncInParentLayout()}}addDockPanelTab(e){return!e.labelKey&&!e.label||(this.ensureDockReady(),!this.dockPanel)||!this.dockPanel.addTab(e)?!1:(this.dockPanel.open(e.id),!0)}isDockPanelOpen(){return this.dockPanel?.isOpen??!1}hasDockPanelTab(e){return this.dockPanel?.hasTab(e)??!1}toggleDockPanelTab(e){var t;return!((t=this.dockPanel)!=null&&t.hasTab(e))||(this.ensureDockReady(),!this.dockPanel)?!1:(this.dockPanel.toggle(e),!0)}setDockPanelOpen(e){return e?(this.ensureDockReady(),this.dockPanel?(this.dockPanel.open(),!0):(console.warn(`[SimpleUiPlugin] setDockPanelOpen skipped: dock panel is unavailable.`),!1)):(this.dockPanel&&this.dockPanel.close(),!0)}getDockPanelSide(){return this.dockPanel?.getSide()}getDockPanelSize(){return this.dockPanel?.getSize()}setDockPanelSize(e){return this.ensureDockReady(),this.dockPanel?(this.dockPanel.setPanelSize(e),!0):(console.warn(`[SimpleUiPlugin] setDockPanelSize skipped: dock panel is unavailable.`),!1)}getToolbarItems(){return this.toolbarItemsInput}setToolbarItems(e,t){if(!this.toolbar)return;this.toolbarItemsOverridden=!0,this.toolbarLayoutSwitcher=t,this.toolbarItemsInput=e;let n=this.resolveBaseToolbarItems(e);this.baseToolbarItems=t?j(n,t):n,this.syncLayerToolbarItem(),this.syncReviewToolbarItem(),this.syncMeasurementToolbarItem(),this.renderToolbarItems()}getToolbarPlacement(){return this.toolbarPlacement}setToolbarPlacement(e){return this.toolbar?(this.applyToolbarPlacement(e),!0):(console.warn(`[SimpleUiPlugin] setToolbarPlacement skipped: toolbar is unavailable.`),!1)}isToolbarVisible(){return this.toolbar?.isVisible??!1}setToolbarVisible(e){var t;return this.toolbar?(this.toolbar.setVisible(e),e||(t=this.dockPanel)==null||t.close(),!0):(console.warn(`[SimpleUiPlugin] setToolbarVisible skipped: toolbar is unavailable.`),!1)}isToolbarCollapsed(){return this.toolbar?.isCollapsed??!1}setToolbarCollapsed(e){return this.toolbar?this.toolbarCollapsible?(this.toolbar.setCollapsed(e),!0):(console.warn(`[SimpleUiPlugin] setToolbarCollapsed skipped: toolbar is not collapsible.`),!1):(console.warn(`[SimpleUiPlugin] setToolbarCollapsed skipped: toolbar is unavailable.`),!1)}getToolbarEdgeOffset(){return this.toolbar?.getEdgeOffset()??this.toolbarEdgeOffset}getLayout(){return this.activeLayoutKind}setLayout(e){var t;return!this.toolbar&&e!==this.layoutMode?(this.layoutMode=e,!0):this.toolbar?(this.layoutMode=e,(t=this.unsubscribeLayout)==null||t.call(this),this.unsubscribeLayout=void 0,e===`auto`?(this.unsubscribeLayout=r(e=>{e!==this.activeLayoutKind&&this.applyLayoutKind(e)}),this.applyLayoutKind(O())):this.applyLayoutKind(e),!0):!1}setToolbarEdgeOffset(e){return this.toolbar?(this.toolbarEdgeOffset=Math.max(0,e),this.toolbar.setEdgeOffset(this.toolbarEdgeOffset),!0):(console.warn(`[SimpleUiPlugin] setToolbarEdgeOffset skipped: toolbar is unavailable.`),!1)}onLoad(e,t){en(),this.commandManager=t,m.instance.set(`isShowRibbon`,!1,{persist:!1});let n=Ct(this.options),r=n.host??h.instance.curView?.container??document.body;this.hostEl=r,this.dockPanelMountTargetOption=this.options.dockPanel?.mountTarget,this.toolbarMountTargetOption=this.options.toolbar?.mountTarget,this.layoutMode=n.layout,this.dockPanelExplicitlyEnabled=n.dockPanel.enabled===!0,this.dockPanelDefaults={defaultOpen:n.dockPanel.defaultOpen??!1,defaultSide:n.dockPanel.defaultSide??`left`,defaultHeight:n.dockPanel.defaultHeight??240,defaultWidth:n.dockPanel.defaultWidth??280},this.themeSync=new an(r,()=>this.toolbar?.refresh()),this.themeSync.start(),this.i18n=new tn,w.events.localeChanged.addEventListener(this.handleLocaleChanged),h.instance.events.documentActivated.addEventListener(this.handleDocumentActivatedForDock);let i=this.layoutMode===`auto`?O():this.layoutMode,a=this.isViewerToolbarEnabled();this.applyLayoutKind(i,{skipToolbarApply:!a}),n.shouldCreateDockPanel&&this.ensureDockPanel(),this.hasLayerToolbarItem&&(this.mountLayerDockUi(),this.ensureLayerCommandRegistered()),this.hasMarkupPanelToolbarItem&&(this.mountReviewDockUi(),this.ensureMarkupPanelCommandRegistered()),this.hasMeasurementPanelToolbarItem&&(this.mountMeasurementDockUi(),this.ensureMeasurementPanelCommandRegistered()),this.ensureViewerToolbar(r)}isViewerToolbarEnabled(){return this.options.toolbar?.enabled!==!1}ensureViewerToolbar(e){var t;if(!this.isViewerToolbarEnabled())return;if(this.toolbar){if(this.toolbar.isRootConnected())return;(t=this.toolbarDocUnbind)==null||t.call(this),this.toolbarDocUnbind=void 0,this.toolbar.destroy(),this.toolbar=void 0,this.toolbarMountEl=void 0}let n=e??this.hostEl;if(!n||!this.i18n)return;let r=this.getToolbarMountEl()??n;this.toolbarMountEl=r;let i=this.getMergedToolbarOptions(this.activeLayoutKind);try{this.toolbar=new et({host:r,themeHost:n,placement:this.toolbarPlacement,edgeOffset:this.toolbarEdgeOffset,sideOffset:this.toolbarSideOffset,items:this.baseToolbarItems,i18n:this.i18n,collapsible:this.toolbarCollapsible,defaultCollapsed:i.defaultCollapsed,showLabels:this.toolbarShowLabels,showChildrenIndicator:this.toolbarShowChildrenIndicator,size:this.toolbarSize,overflow:this.toolbarOverflow,showBorder:this.toolbarShowBorder,showButtonBorder:this.toolbarShowButtonBorder,showSeparators:this.toolbarShowSeparators,inCanvasParent:this.toolbarInCanvasParent,subToolbar:this.toolbarSubToolbar,onCollapse:()=>{var e;(e=this.dockPanel)==null||e.close()},onExclusiveOpen:()=>this.dismissDockForExclusiveChrome(),onCommand:e=>{h.instance.sendStringToExecute(e)}}),this.toolbarDocUnbind=ee(this.toolbar)}catch(e){console.error(`[SimpleUiPlugin] Failed to create viewer toolbar:`,e);return}try{this.setLayout(this.layoutMode)}catch(e){console.warn(`[SimpleUiPlugin] setLayout failed during toolbar setup:`,e)}}getToolbarMountEl(){if(this.hostEl)return this.toolbarInCanvasParent?P(this.hostEl,this.toolbarMountTargetOption):Vt(this.hostEl,this.toolbarMountTargetOption)}tryUpgradeToolbarMountTarget(){if(this.toolbarMountTargetOption||!this.hostEl||!this.toolbar)return;let e=this.getToolbarMountEl();if(!e||e===this.toolbarMountEl)return;let t=h.instance.curView?.container,n=t?.parentElement;this.toolbarMountEl!==this.hostEl&&this.toolbarMountEl!==t&&this.toolbarMountEl!==n||(this.toolbar.reparentTo(e),this.toolbarMountEl=e,this.toolbar.syncInParentLayout())}getMergedToolbarOptions(e){return M(e,this.options.toolbar,this.options.layouts?.[e]?.toolbar)}applyLayoutKind(e,t){this.activeLayoutKind=e;let n=this.getMergedToolbarOptions(e);this.toolbarPlacement=n.placement??`right`,this.toolbarCollapsible=n.collapsible??!1,this.toolbarEdgeOffset=n.edgeOffset??8,this.toolbarSideOffset=n.sideOffset??0,this.toolbarShowLabels=n.showLabels??!1,this.toolbarShowChildrenIndicator=n.showChildrenIndicator??!0,this.toolbarShowBorder=n.showBorder??!0,this.toolbarShowButtonBorder=n.showButtonBorder??!1,this.toolbarShowSeparators=n.showSeparators??!0,this.toolbarSize=n.size??`auto`,this.toolbarOverflow=n.overflow??`menu`,this.toolbarSubToolbar=n.subToolbar;let r=n.inCanvasParent===!0,i=r!==this.toolbarInCanvasParent;if(this.toolbarInCanvasParent=r,this.rebuildToolbarItems(e,n),this.syncLayerToolbarItem(),this.syncReviewToolbarItem(),this.syncMeasurementToolbarItem(),!(t!=null&&t.skipToolbarApply||!this.toolbar)){if(this.toolbar.applyViewOptions({placement:this.toolbarPlacement,edgeOffset:this.toolbarEdgeOffset,sideOffset:this.toolbarSideOffset,collapsible:this.toolbarCollapsible,defaultCollapsed:n.defaultCollapsed,showLabels:this.toolbarShowLabels,showChildrenIndicator:this.toolbarShowChildrenIndicator,size:this.toolbarSize,overflow:this.toolbarOverflow,showBorder:this.toolbarShowBorder,showButtonBorder:this.toolbarShowButtonBorder,showSeparators:this.toolbarShowSeparators,subToolbar:this.toolbarSubToolbar,inCanvasParent:this.toolbarInCanvasParent,items:this.baseToolbarItems}),i||!this.toolbar.isRootConnected()){let e=this.getToolbarMountEl();e&&(this.toolbar.reparentTo(e),this.toolbarMountEl=e)}this.toolbar.syncInParentLayout()}}getToolbarContext(){return{getTheme:()=>this.themeSync?.getTheme()??`dark`,setTheme:e=>this.themeSync?.setTheme(e),getLocale:()=>w.currentLocale,setLocale:e=>this.setLocale(e),getPlacement:()=>this.toolbarPlacement,setPlacement:e=>{this.applyToolbarPlacement(e)}}}rebuildToolbarItems(e,t){if(this.toolbarItemsOverridden){let e=this.resolveBaseToolbarItems(this.toolbarItemsInput);this.baseToolbarItems=this.toolbarLayoutSwitcher?j(e,this.toolbarLayoutSwitcher):e;return}let n=t??this.getMergedToolbarOptions(e);this.toolbarItemsInput=n.items??`default`,this.baseToolbarItems=G(n,this.getToolbarContext(),e)}resolveBaseToolbarItems(e){return G({items:e,appendItems:void 0},this.getToolbarContext(),this.activeLayoutKind)}renderToolbarItems(){var e;(e=this.toolbar)==null||e.updateItems(this.baseToolbarItems)}syncLayerToolbarItem(){let e=this.hasLayerToolbarItem,t=y(this.baseToolbarItems,`layer`);this.hasLayerToolbarItem=t,t&&!e?(this.ensureLayerCommandRegistered(),this.mountLayerDockUi()):!t&&e&&(this.teardownLayerUi(),this.unregisterLayerCommand())}syncReviewToolbarItem(){let e=this.hasMarkupPanelToolbarItem,t=y(this.baseToolbarItems,`markup-panel`);this.hasMarkupPanelToolbarItem=t,t&&!e?(this.ensureMarkupPanelCommandRegistered(),this.mountReviewDockUi()):!t&&e&&(this.teardownReviewUi(),this.unregisterMarkupPanelCommand())}syncMeasurementToolbarItem(){let e=this.hasMeasurementPanelToolbarItem,t=y(this.baseToolbarItems,`measurement-panel`);this.hasMeasurementPanelToolbarItem=t,t&&!e?(this.ensureMeasurementPanelCommandRegistered(),this.mountMeasurementDockUi()):!t&&e&&(this.teardownMeasurementUi(),this.unregisterMeasurementPanelCommand())}unregisterLayerCommand(){if(!this.commandManager)return;let e=o.SYSTEMT_COMMAND_GROUP_NAME,t=this.registeredCommands.findIndex(e=>e.name===`layer`);t!==-1&&(this.commandManager.removeCmd(e,`layer`),this.registeredCommands.splice(t,1))}ensureLayerCommandRegistered(){this.commandManager&&(this.registeredCommands.some(e=>e.name===`layer`)||this.registerLayerCommand(this.commandManager))}unregisterMarkupPanelCommand(){if(!this.commandManager)return;let e=o.SYSTEMT_COMMAND_GROUP_NAME,t=this.registeredCommands.findIndex(e=>e.name===`markuppanel`);t!==-1&&(this.commandManager.removeCmd(e,`markuppanel`),this.registeredCommands.splice(t,1))}ensureMarkupPanelCommandRegistered(){this.commandManager&&(this.registeredCommands.some(e=>e.name===`markuppanel`)||this.registerMarkupPanelCommand(this.commandManager))}unregisterMeasurementPanelCommand(){if(!this.commandManager)return;let e=o.SYSTEMT_COMMAND_GROUP_NAME,t=this.registeredCommands.findIndex(e=>e.name===`measurementpanel`);t!==-1&&(this.commandManager.removeCmd(e,`measurementpanel`),this.registeredCommands.splice(t,1))}ensureMeasurementPanelCommandRegistered(){this.commandManager&&(this.registeredCommands.some(e=>e.name===`measurementpanel`)||this.registerMeasurementPanelCommand(this.commandManager))}registerLayerCommand(e){if(this.registeredCommands.some(e=>e.name===`layer`))return;let t=o.SYSTEMT_COMMAND_GROUP_NAME;e.addCommand(t,`layer`,`layer`,this.createLayerCommand()),this.registeredCommands.push({group:t,name:`layer`})}createLayerCommand(){return new _t({prepare:()=>this.prepareLayerDockForCommand(),toggle:()=>this.layerUiControllerHolder.toggleFromCommand()})}prepareLayerDockForCommand(){this.mountLayerDockUi(),this.tryUpgradeDockMountTarget()}registerMarkupPanelCommand(e){if(this.registeredCommands.some(e=>e.name===`markuppanel`))return;let t=o.SYSTEMT_COMMAND_GROUP_NAME;e.addCommand(t,`markuppanel`,`markuppanel`,this.createMarkupPanelCommand()),this.registeredCommands.push({group:t,name:`markuppanel`})}createMarkupPanelCommand(){return new vt({prepare:()=>this.prepareReviewDockForCommand(),toggle:()=>this.dockPanel?.open(Q)})}prepareReviewDockForCommand(){this.mountReviewDockUi(),this.tryUpgradeDockMountTarget()}registerMeasurementPanelCommand(e){if(this.registeredCommands.some(e=>e.name===`measurementpanel`))return;let t=o.SYSTEMT_COMMAND_GROUP_NAME;e.addCommand(t,`measurementpanel`,`measurementpanel`,this.createMeasurementPanelCommand()),this.registeredCommands.push({group:t,name:`measurementpanel`})}createMeasurementPanelCommand(){return new yt({prepare:()=>this.prepareMeasurementDockForCommand(),toggle:()=>this.dockPanel?.open($)})}prepareMeasurementDockForCommand(){this.mountMeasurementDockUi(),this.tryUpgradeDockMountTarget()}ensureDockReady(){var e;if(!this.dockPanel){this.prepareDockPanel();return}this.hasLayerToolbarItem&&!this.dockPanel.hasTab(Z)&&this.mountLayerDockUi(),this.hasMarkupPanelToolbarItem&&!this.dockPanel.hasTab(Q)&&this.mountReviewDockUi(),this.hasMeasurementPanelToolbarItem&&!this.dockPanel.hasTab($)&&this.mountMeasurementDockUi(),this.tryUpgradeDockMountTarget(),this.dockPanel.ensureMounted(),(e=this.toolbar)==null||e.syncInParentLayout()}prepareDockPanel(){this.hasLayerToolbarItem&&this.mountLayerDockUi(),this.hasMarkupPanelToolbarItem&&this.mountReviewDockUi(),this.hasMeasurementPanelToolbarItem&&this.mountMeasurementDockUi(),this.dockPanel||this.ensureDockPanel(),this.tryUpgradeDockMountTarget()}dismissStripsForDockPanel(){var e;(e=this.toolbar)!=null&&e.replaceOnNested&&this.toolbar.dismissOpenChildren()}dismissDockForExclusiveChrome(){var e,t;(e=this.toolbar)!=null&&e.replaceOnNested&&((t=this.dockPanel)==null||t.close())}ensureDockPanel(){let e=this.getDockMountEl();!e||!this.i18n||!this.dockPanelDefaults||this.dockPanel||(this.dockPanel=new ln({host:e,i18n:this.i18n,defaultSide:this.dockPanelDefaults.defaultSide,defaultOpen:this.dockPanelDefaults.defaultOpen,defaultHeight:this.dockPanelDefaults.defaultHeight,defaultWidth:this.dockPanelDefaults.defaultWidth,onOpen:()=>this.dismissStripsForDockPanel()}),this.syncToolbarMountAfterDockChange())}getDockMountEl(){if(this.hostEl)return P(this.hostEl,this.dockPanelMountTargetOption)}tryUpgradeDockMountTarget(){if(this.dockPanelMountTargetOption||!this.hostEl||!this.dockPanel)return;let e=P(this.hostEl),t=this.dockPanel.getMountHost();t!==e&&(t!==this.hostEl||e===this.hostEl||(this.dockPanel.reparentTo(e),this.refreshLayerDockController(),this.syncToolbarMountAfterDockChange()))}refreshLayerDockController(){var e,t;(e=this.dockPanel)!=null&&e.hasTab(Z)&&((t=this.layerDockController)==null||t.destroy(),this.layerDockController=new A(this.dockPanel,Z),this.layerUiControllerHolder.current=this.layerDockController)}mountLayerDockUi(){if(!(!this.hostEl||!this.i18n||(this.ensureDockPanel(),!this.dockPanel))){if(this.dockPanel.hasTab(Z)){this.refreshLayerDockController();return}if(this.layerListView=new dn({editor:h.instance,i18n:this.i18n,host:this.hostEl,showHeader:!1}),!this.dockPanel.addTab({id:Z,labelKey:`dockPanel.tab.layers`,content:this.layerListView.element})){this.layerListView.destroy(),this.layerListView=void 0;return}this.layerDockController=new A(this.dockPanel,Z),this.layerUiControllerHolder.current=this.layerDockController}}teardownLayerUi(){var e,t,n;(e=this.dockPanel)==null||e.removeTab(Z),(t=this.layerListView)==null||t.destroy(),this.layerListView=void 0,(n=this.layerDockController)==null||n.destroy(),this.layerDockController=void 0,this.layerUiControllerHolder.current=void 0,this.destroyDockIfUnused()}mountReviewDockUi(){!this.hostEl||!this.i18n||(this.ensureDockPanel(),!this.dockPanel)||this.dockPanel.hasTab(Q)||(this.reviewPaletteView=new mn({editor:h.instance,i18n:this.i18n}),this.dockPanel.addTab({id:Q,labelKey:`dockPanel.tab.review`,content:this.reviewPaletteView.element})||(this.reviewPaletteView.destroy(),this.reviewPaletteView=void 0))}teardownReviewUi(){var e,t;(e=this.dockPanel)==null||e.removeTab(Q),(t=this.reviewPaletteView)==null||t.destroy(),this.reviewPaletteView=void 0,this.destroyDockIfUnused()}mountMeasurementDockUi(){!this.hostEl||!this.i18n||(this.ensureDockPanel(),!this.dockPanel)||this.dockPanel.hasTab($)||(this.measurementPaletteView=new pn({editor:h.instance,i18n:this.i18n}),this.dockPanel.addTab({id:$,labelKey:`dockPanel.tab.measurements`,content:this.measurementPaletteView.element})||(this.measurementPaletteView.destroy(),this.measurementPaletteView=void 0))}teardownMeasurementUi(){var e,t;(e=this.dockPanel)==null||e.removeTab($),(t=this.measurementPaletteView)==null||t.destroy(),this.measurementPaletteView=void 0,this.destroyDockIfUnused()}destroyDockIfUnused(){this.dockPanel&&(this.dockPanel.hasTabs||(this.dockPanel.close(),!this.dockPanelExplicitlyEnabled&&(this.dockPanel.destroy(),this.dockPanel=void 0,this.syncToolbarMountAfterDockChange())))}syncToolbarMountAfterDockChange(){if(!this.toolbar||!this.hostEl)return;let e=this.getToolbarMountEl();e&&((e!==this.toolbarMountEl||!this.toolbar.isRootConnected())&&(this.toolbar.reparentTo(e),this.toolbarMountEl=e),this.toolbar.syncInParentLayout())}applyToolbarPlacement(e){var t;this.toolbarPlacement=e,(t=this.toolbar)==null||t.setPlacement(e)}onUnload(e,t){var n,r,i,a,o;(n=this.unsubscribeLayout)==null||n.call(this),this.unsubscribeLayout=void 0,w.events.localeChanged.removeEventListener(this.handleLocaleChanged),h.instance.events.documentActivated.removeEventListener(this.handleDocumentActivatedForDock);for(let e of this.registeredCommands)t.removeCmd(e.group,e.name);this.registeredCommands=[],this.teardownLayerUi(),this.teardownReviewUi(),this.teardownMeasurementUi(),(r=this.toolbarDocUnbind)==null||r.call(this),this.toolbarDocUnbind=void 0,(i=this.toolbar)==null||i.destroy(),(a=this.dockPanel)==null||a.destroy(),this.toolbar=void 0,this.toolbarMountEl=void 0,this.toolbarMountTargetOption=void 0,this.dockPanel=void 0,this.hostEl=void 0,this.dockPanelMountTargetOption=void 0,this.baseToolbarItems=[],this.toolbarItemsInput=`default`,this.toolbarItemsOverridden=!1,this.toolbarLayoutSwitcher=void 0,this.hasLayerToolbarItem=!1,this.hasMarkupPanelToolbarItem=!1,this.hasMeasurementPanelToolbarItem=!1,this.commandManager=void 0,this.i18n=void 0,(o=this.themeSync)==null||o.stop(),this.themeSync=void 0,m.instance.clearSessionOverride(`isShowRibbon`),on()}setLocale(e){w.setCurrentLocale(e)}};function gn(e={}){return new hn(e)}export{ft as t};