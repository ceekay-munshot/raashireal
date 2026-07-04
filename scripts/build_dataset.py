import openpyxl, json
from datetime import datetime

BASE="/home/user/raashireal/data-raw/"
def num(x):
    if x is None or x=='' : return None
    try: return round(float(x),2)
    except: return None
def yr(d): return d.year if isinstance(d,datetime) else None

PEERS = [
 ("Rashi Peripheral.xlsx","Rashi Peripherals","RPTECH","#ee5a24","star"),
 ("Redington.xlsx","Redington","REDINGTON","#2a78d6","peer"),
 ("Creative Newtech.xlsx","Creative Newtech","CREATIVE","#12a07a","peer"),
 ("Compuage Info.xlsx","Compuage Infocom","COMPUAGE","#7c4fc4","contrast"),
]

def grid_of(ws): return [[c for c in row] for row in ws.iter_rows(values_only=True)]
def find(grid,label,start=0):
    for i in range(start,len(grid)):
        if grid[i] and grid[i][0]==label: return i
    return None

def parse(fn):
    wb=openpyxl.load_workbook(BASE+fn,data_only=True); ws=wb["Data Sheet"]; grid=grid_of(ws)
    pl=find(grid,"PROFIT & LOSS"); plh=find(grid,"Report Date",pl)
    ymap={j:yr(c) for j,c in enumerate(grid[plh]) if yr(c)}
    def S(label):
        i=find(grid,label,plh)
        if i is None: return {}
        return {ymap[j]:num(grid[i][j]) for j in ymap if num(grid[i][j]) is not None}
    sales=S("Sales");rm=S("Raw Material Cost");chg=S("Change in Inventory")
    power=S("Power and Fuel");mfr=S("Other Mfr. Exp");emp=S("Employee Cost")
    sell=S("Selling and admin");oth=S("Other Expenses");oi=S("Other Income")
    dep=S("Depreciation");intr=S("Interest");pbt=S("Profit before tax");npf=S("Net profit")
    esc=S("Equity Share Capital");res=S("Reserves");bor=S("Borrowings");othl=S("Other Liabilities")
    recv=S("Receivables");inv=S("Inventory");cash=S("Cash & Bank")
    cfo=S("Cash from Operating Activity");cfi=S("Cash from Investing Activity")
    yrs=sorted(set(sales)&set(pbt))
    def g(d,y): return d.get(y)
    rows=[]
    for k,y in enumerate(yrs):
        s=g(sales,y)
        opex=(g(rm,y)or 0)-(g(chg,y)or 0)+(g(power,y)or 0)+(g(mfr,y)or 0)+(g(emp,y)or 0)+(g(sell,y)or 0)+(g(oth,y)or 0)
        ebitda=round(s-opex,2); cogs=(g(rm,y)or 0)-(g(chg,y)or 0); gp=round(s-cogs,2)
        nw=(g(esc,y)or 0)+(g(res,y)or 0); ce=nw+(g(bor,y)or 0); ebit=ebitda-(g(dep,y)or 0)
        dd=round((g(recv,y)or 0)/s*365,1) if s else None
        idd=round((g(inv,y)or 0)/s*365,1) if s else None
        pd=round((g(othl,y)or 0)/cogs*365,1) if cogs else None
        rows.append({"y":y,"sales":round(s,2),"ebitda":ebitda,
          "ebitdaMargin":round(ebitda/s*100,2) if s else None,
          "grossProfit":gp,"grossMargin":round(gp/s*100,2) if s else None,
          "netProfit":g(npf,y),"netMargin":round((g(npf,y)or 0)/s*100,2) if s else None,
          "pbt":g(pbt,y),"interest":g(intr,y),"depreciation":g(dep,y),"otherIncome":g(oi,y),
          "roce":round(((g(pbt,y)or 0)+(g(intr,y)or 0))/ce*100,2) if ce else None,
          "roe":round((g(npf,y)or 0)/nw*100,2) if nw else None,
          "borrowings":g(bor,y),"networth":round(nw,2),"capitalEmployed":round(ce,2),
          "debtEquity":round((g(bor,y)or 0)/nw,2) if nw else None,
          "receivables":g(recv,y),"inventory":g(inv,y),"cash":g(cash,y),"payablesProxy":g(othl,y),
          "debtorDays":dd,"inventoryDays":idd,"payableDays":pd,
          "ccc":round((dd or 0)+(idd or 0)-(pd or 0),1),
          "cfo":g(cfo,y),"cfi":g(cfi,y),
          "salesGrowth":round((s/g(sales,yrs[k-1])-1)*100,1) if k>0 and g(sales,yrs[k-1]) else None})
    # quarters
    qh=find(grid,"Report Date",find(grid,"Quarters"))
    qymap={j:grid[qh][j] for j in range(len(grid[qh])) if isinstance(grid[qh][j],datetime)}
    def QS(label):
        i=find(grid,label,qh)
        if i is None: return {}
        return {j:num(grid[i][j]) for j in qymap if num(grid[i][j]) is not None}
    qs=QS("Sales");qn=QS("Net profit");qo=QS("Operating Profit")
    quarters=[]
    for j in sorted(qymap):
        d=qymap[j]; MN={3:'Mar',6:'Jun',9:'Sep',12:'Dec'}; lbl=f"{MN.get(d.month,d.month)}'{str(d.year)[2:]}"
        quarters.append({"q":lbl,"sales":qs.get(j),"netProfit":qn.get(j),"opProfit":qo.get(j),
                         "opMargin":round((qo.get(j)or 0)/qs.get(j)*100,2) if qs.get(j) else None,
                         "netMargin":round((qn.get(j)or 0)/qs.get(j)*100,2) if qs.get(j) else None})
    return rows,quarters

# Operational KPIs extracted from Screener "Insights" screenshots
KPI={
 "RPTECH":{"fy":[2021,2022,2023,2024,2025,2026],
   "branches":[51,50,50,51,52,55],"channelPartners":[8834,9401,9996,9915,10255,10300],
   "brands":[45,50,53,60,70,78],"locations":[664,678,733,705,708,701],
   "skus":[11883,13828,14677,16813,17993,18479],"warehouses":[58,58,65,63,68,71],
   "cumUnitsMn":[None,None,None,379.88,526,618],"employees":[None,None,None,1423,1518,1598]},
 "REDINGTON":{"fy":[2024,2025,2026],
   "channelPartners":[50000,70000,75000],"brands":[400,450,450],"markets":[40,40,40],
   "warehouses":[181,174,None],"awsPartners":[773,None,850],"softwareShare":[12,15,17]},
 "CREATIVE":{"fy":[2021,2022,2023,2024,2025,2026],
   "branches":[20,20,25,31,31,31],"brandPartners":[20,25,25,25,25,50],
   "channelPartners":[5000,8000,8000,10000,10000,10000],"countries":[29,29,38,38,38,38],
   "employees":[172,300,300,350,370,370],"warehouses":[None,2,18,18,18,14],
   "brandBizRev":[None,61,110,170,270.68,380.86]},
 "COMPUAGE":{"fy":[2020,2022,2023,2024,2025],
   "channelPartners":[12500,12000,12000,10000,12000],"branches":[46,46,46,45,46],
   "serviceCentres":[70,69,69,70,69],"brands":[29,28,28,None,28],"employees":[735,704,599,None,700]},
}
# latest-snapshot comparable KPIs (for cross-peer bars)
SNAP={
 "RPTECH":{"brands":78,"channelPartners":10300,"warehouses":71,"branches":55,"employees":1598},
 "REDINGTON":{"brands":450,"channelPartners":75000,"warehouses":174,"branches":None,"employees":None},
 "CREATIVE":{"brands":50,"channelPartners":10000,"warehouses":14,"branches":31,"employees":370},
 "COMPUAGE":{"brands":28,"channelPartners":12000,"warehouses":27,"branches":46,"employees":700},
}

SHARE_Q = ["Jun'23","Sep'23","Dec'23","Mar'24","Jun'24","Sep'24","Dec'24","Mar'25","Jun'25","Sep'25","Dec'25","Mar'26"]
SHARE = {
 "RPTECH":{"promoter":[None,None,None,63.41,63.41,63.41,63.41,63.61,63.65,63.80,63.98,64.01],
           "fii":[None,None,None,1.63,1.39,0.90,1.67,1.11,1.05,1.39,0.66,0.78],
           "dii":[None,None,None,14.41,16.18,15.28,16.09,16.36,16.39,17.84,18.45,17.45],
           "public":[None,None,None,20.55,19.03,20.41,18.83,18.93,18.92,16.98,16.91,17.76]},
 "REDINGTON":{"promoter":[0,0,0,0,0,0,0,0,0,0,0,0],
           "fii":[59.22,56.26,56.99,58.09,57.87,58.07,58.53,60.57,62.58,61.81,61.94,61.49],
           "dii":[17.40,17.38,17.92,18.57,18.14,18.08,18.64,17.87,16.65,16.97,17.28,17.12],
           "public":[23.38,26.37,25.08,23.32,23.99,23.84,22.82,21.55,20.77,21.22,20.78,21.39]},
 "CREATIVE":{"promoter":[63.48,56.91,56.91,56.67,56.68,56.16,56.16,56.60,56.60,56.62,56.62,56.62],
           "fii":[0.35,0.01,0.00,0.07,0.14,0.29,0.89,0.98,1.01,0.37,0.22,0.22],
           "dii":[0.00,1.06,1.49,1.58,1.57,1.52,1.52,0.96,0.96,0.98,1.04,1.08],
           "public":[36.17,42.01,41.59,41.68,41.61,42.02,41.43,41.47,41.43,42.03,42.12,42.09]},
 "COMPUAGE":{"promoter":[42.65,42.65,42.65,42.65,42.65,42.65,42.65,42.65,42.65,42.65,42.65,42.65],
           "fii":[0.01,0,0,0,0,0,0,0,0,0,0,0],
           "dii":[0,0,0,0,0,0,0,0,0,0,0,0],
           "public":[57.35,57.35,57.36,57.36,57.36,57.35,57.34,57.35,57.35,57.34,57.35,57.34]},
}
SEGMENTS = {
 "RPTECH":{"years":[2023,2024,2025,2026],"labels":["PES","LIT"],
           "PES":[5292.2,6060.0,8360.6,9126.6],"LIT":[4162.1,5034.7,5412.1,6700.8],
           "desc":{"PES":"Personal Computing & Enterprise Solutions","LIT":"Lifestyle & IT Essentials"}},
 "CREATIVE":{"years":[2025,2026],"labels":["Brand","MarketEntry"],
           "Brand":[270.68,380.86],"MarketEntry":[1503.80,2318.92],
           "desc":{"Brand":"Brand Business (owned / licensed)","MarketEntry":"Market Entry Specialist (distribution)"}},
}
GEOGRAPHY = {}   # filled for Redington once extracted

companies=[]; annual={}; quarters={}
for fn,name,tk,color,role in PEERS:
    rows,qs=parse(fn)
    if tk=='COMPUAGE':                     # collapsed FY23-24 → keep only healthy history for fair comparison
        rows=[r for r in rows if r['y']<=2022]
    companies.append({"id":tk,"name":name,"ticker":tk,"color":color,"role":role,"isStar":role=="star"})
    annual[tk]=rows; quarters[tk]=qs

DATA={"companies":companies,"annual":annual,"quarters":quarters,"kpi":KPI,"snap":SNAP,"shareQuarters":SHARE_Q,"shareholding":SHARE,"segments":SEGMENTS,"geography":GEOGRAPHY,
      "meta":{"currency":"₹ Cr","source":"Screener.in (paid) + company disclosures","note":"FY ending March. Compuage collapsed FY23-24 (kept as cautionary contrast)."}}

out="export const DATA = "+json.dumps(DATA,indent=0).replace("NaN","null")+";\nexport default DATA;\n"
open("/home/user/raashireal/src/data/dataset.js","w").write(out)
print("Wrote dataset.js:",len(out),"bytes")
print("Rashi FY26:",{k:annual['RPTECH'][-1][k] for k in ['sales','ebitdaMargin','grossMargin','netMargin','roce','ccc']})
print("Rashi quarters:",[q['q'] for q in quarters['RPTECH']])
print("companies:",[c['name'] for c in companies])
