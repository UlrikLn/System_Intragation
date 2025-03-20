## Det her er en __init__.py fil, som er en speciel fil, der fortæller Python, at dette er en modul. Som altid eksiskveres denne fil før
## alle andre filer i mappen. I dette tilfælde importerer vi alle vores routers, så de kan bruges i vores main.py fil.
from routers.spacecrafts_router import router as spacecrafts_router