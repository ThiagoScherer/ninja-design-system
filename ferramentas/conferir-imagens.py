from pathlib import Path
from PIL import Image,ImageChops
import json
r=Path(__file__).resolve().parents[1];report=[]
for p in sorted((r/'referencias').glob('*.png')):
 a=Image.open(p).convert('RGB');b=Image.open(r/'resultados'/p.name).convert('RGB')
 if a.size!=b.size:raise ValueError('Dimensão diferente: '+p.stem)
 d=ImageChops.difference(a,b);hist=d.histogram();pixels=sum(1 for c in d.get_flattened_data() if c!=(0,0,0));maxdelta=max(v[1] for v in d.getextrema());mae=sum((i%256)*n for i,n in enumerate(hist))/(a.width*a.height*3)
 report.append({'exemplo':p.stem,'dimensao':list(a.size),'identico':not d.getbbox(),'pixels_diferentes':pixels,'percentual_pixels_diferentes':pixels/(a.width*a.height)*100,'maior_diferenca_canal_0_255':maxdelta,'erro_medio_canal':mae})
(r/'resultados/comparacao.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,indent=2))
