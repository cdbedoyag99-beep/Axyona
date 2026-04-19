# Axyona — Sitio Web

Sitio web completo de Axyona listo para subir a Hostgator.

## Estructura

```
sitio-web/
├── index.html        ← Home (landing principal)
├── servicios.html    ← Servicios (3 pilares + proceso)
├── contacto.html     ← Contacto (formulario + info)
└── assets/
    ├── styles.css    ← Design system completo
    ├── main.js       ← Animaciones + formulario
    └── img/
        ├── logo.png     ← Logo Axyona full
        └── isotipo.png  ← Símbolo solo
```

## Deploy en Hostgator (cPanel)

1. Abrir cPanel → File Manager
2. Navegar a `public_html/`
3. Crear carpeta `axyona.co` (si el dominio está apuntando aquí)
   — O subir directo a `public_html/` si `axyona.co` es el dominio principal
4. Subir **todo el contenido** de esta carpeta (no la carpeta en sí)
5. Verificar que `index.html` esté en la raíz correcta

## Configurar el formulario (Formspree)

1. Ir a [formspree.io](https://formspree.io) y crear cuenta con `cdbedoyag99@gmail.com`
2. Crear nuevo formulario → copiar el ID (formato: `xabcdefg`)
3. Abrir `contacto.html` y reemplazar `YOUR_FORM_ID` en:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
4. Plan gratuito incluye 50 envíos/mes

## Actualizar datos de contacto

En `contacto.html`, buscar y reemplazar:
- `+57 XXX XXX XXXX` → número real de WhatsApp Business de Axyona
- `57XXXXXXXXXX` → número sin espacios para el link de WhatsApp
- `hola@axyona.co` → email real (también en `index.html` footer)

## Apuntar el dominio axyona.co

En el registrador del dominio, cambiar los nameservers a los de Hostgator:
- `ns1.hostgator.com`
- `ns2.hostgator.com`

La propagación tarda 24-48 horas.

## Notas

- Sin dependencias externas ni build step — subir y funcionar
- Fuentes cargadas desde Google Fonts (requiere conexión a internet)
- Para analytics: agregar Google Analytics 4 en el `<head>` de las 3 páginas
