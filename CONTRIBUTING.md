# Contribuir al workshop

La página publicada se construye con Oracle LiveLabs desde `main`. `manifest.json` define la navegación y sólo se valida el contenido que éste alcanza: los manifiestos históricos bajo `workshops/` no forman parte de este flujo.

## Preparar y revisar una mejora

```powershell
git switch main
git pull --ff-only
git switch -c tipo/descripcion-corta
.\scripts\start-preview.ps1
```

Abra `http://127.0.0.1:5501/` y, tras guardar un cambio, recargue la página. Use `-Port 5502` si el puerto predeterminado está ocupado; el comando no detiene procesos existentes. Para parar la vista previa, ejecute el comando `Stop-Process` que muestra el lanzador.

La página local necesita internet para cargar JavaScript y estilos de Oracle LiveLabs. Revise la portada y los tres laboratorios, la navegación anterior/siguiente, la expansión de tareas y las imágenes enlazadas.

Antes de abrir un Pull Request:

```powershell
py -3.11 scripts/check_site.py --self-test
py -3.11 scripts/check_site.py
git status
```

Haga commits acotados, suba la rama y abra un Pull Request hacia `main`. El control `site-check` se ejecuta en el Pull Request. Cuando esté correcto, fusiónelo manualmente; `main` publica GitHub Pages. El despliegue puede tardar hasta diez minutos. Si una publicación falla, revierta el cambio con otro Pull Request.
