# Reparar Operación MJ sin modificar tu QR

El QR anterior abre: https://alfaro2697.github.io/operacion_mj/

## Cómo instalar
1. Descarga y DESCOMPRIME este archivo.
2. Copia TODO el CONTENIDO de la carpeta descomprimida a la raíz de tu repositorio local `C:\Users\Bernald\Desktop\Propuesta de noviazgo` (no copies otra carpeta contenedora).
3. En la raíz, junto a `.git`, deben quedar `index.html`, `styles.css`, `script.js`, `comic-romance.css`, `proposal-redesign.css`, `assets/`, `vendor/` y `.github/workflows/static.yml`.
4. Asegúrate de que el archivo se llame exactamente `index.html` (no `index.html.html`).
5. Abre una consola en esa carpeta, escribe `dir index.html`, luego:

   git add -A
   git commit -m "Corregir publicacion GitHub Pages sin cambiar QR"
   git pull origin main --rebase
   git push origin main

6. En GitHub > Settings > Pages selecciona como `Source`: GitHub Actions.
7. En GitHub > Actions comprueba que `Deploy Operacion MJ` termine con marca verde.
8. Abre `https://alfaro2697.github.io/operacion_mj/`.

Si tu repo tiene OTRO workflow de Pages, desactívalo si crea dos despliegues paralelos, conservando `Deploy Operacion MJ`.
Si `git pull --rebase` muestra conflictos, detente para resolverlos antes de volver a hacer push.
