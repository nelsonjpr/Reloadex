#!/usr/bin/env node
/**
 * buildGuideData.mjs
 *
 * Convierte la cachá de la wiki de Pokémon Reloaded en `src/data/guide.json`.
 * La cachá se obtiene con la API de Fandom (action=parse&prop=wikitext) y se
 * guarda en `scripts/wiki-cache.json`; la app funciona 100% offline con el JSON
 * generado, sin depender de la web en tiempo de ejecución.
 */
import fs from 'node:fs';
import path from 'node:path';

const PROJECT = process.cwd();
const CACHE = path.join(PROJECT, 'scripts', 'wiki-cache.json');
const OUT = path.join(PROJECT, 'src', 'data', 'guide.json');

const raw = JSON.parse(fs.readFileSync(CACHE, 'utf8'));

const TYPE_ES = {
  normal: 'normal', fuego: 'fuego', agua: 'agua', planta: 'planta',
  electrico: 'electrico', eléctrico: 'electrico', hielo: 'hielo', lucha: 'lucha',
  veneno: 'veneno', tierra: 'tierra', volador: 'volador', psiquico: 'psiquico',
  psíquico: 'psiquico', bicho: 'bicho', roca: 'roca', fantasma: 'fantasma',
  dragon: 'dragon', dragón: 'dragon', siniestro: 'siniestro', acero: 'acero',
  hada: 'hada',
};

const slug = (s) => String(s)
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '') || 'seccion';

const clean = (value) => {
  let s = String(value || '');
  s = s.replace(/<br\s*\/?>/gi, '\n');
  s = s.replace(/\[\[(?:Archivo|File|Imagen|Image):[^\]]*\]\]/gi, '');
  s = s.replace(/\{\{\s*t\s*\|\s*([^}|]+?)\s*\}\}/gi, (_, t) => {
    const key = String(t).trim().toLowerCase();
    return `${TYPE_ES[key] || key} `;
  });
  s = s.replace(/\{\{[^{}]*\}\}/g, '');
  s = s.replace(/\[https?:\/\/[^\s\]]+(?:\||%7C)([^\]]+)\]/gi, '$1');
  s = s.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2');
  s = s.replace(/\[\[([^\]]+)\]\]/g, '$1');
  s = s.replace(/<[^>]+>/g, '');
  s = s.replace(/'''''|'''|''/g, '');
  s = s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  return s.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
};

// Acepta tanto `== Título ==` como `==Título==` (la wiki mezcla ambos estilos).
const headingRe = /^(={2,6})\s*(.+?)\s*={2,6}\s*$/;
const skipHeadings = /^(ver también|ver tambien|véase también|vease tambien|referencias|enlaces externos|ver mas|ver más)$/i;

const parseCell = (line) => {
  let s = line.replace(/^[!|]/, '');
  // Quita atributos de estilo previos al separador "|" de la celda.
  if (s.includes('|')) {
    const first = s.slice(0, s.indexOf('|'));
    if (/[=;]/.test(first) || /^\s*(style|class|align|width|colspan|rowspan|border|bgcolor)\s*=/i.test(first)) {
      s = s.slice(s.indexOf('|') + 1);
    }
  }
  return clean(s).replace(/\s*\*\s*/g, ' · ');
};

const tableRows = (lines) => {
  const rows = [];
  let current = [];
  let nested = 0;
  for (const line of lines) {
    if (/^\{\|/.test(line)) { nested++; continue; }
    if (/^\|\}/.test(line)) { nested = Math.max(0, nested - 1); continue; }
    if (nested > 0) continue;
    if (/^\|-/.test(line)) {
      if (current) rows.push(current);
      current = [];
      continue;
    }
    if (/^[!|]/.test(line) && current) {
      const parts = line.split(/\|\|/);
      for (const p of parts) {
        const text = parseCell(p.replace(/^[!|]/, '!'));
        if (text) current.push(text);
      }
    } else if (current && line.trim() && !/^\+/.test(line)) {
      const text = clean(line).replace(/\s*\*\s*/g, ' · ');
      if (text && !/^\{\|/.test(line)) {
        if (current.length) current[current.length - 1] += ` ${text}`;
        else current.push(text);
      }
    }
  }
  if (current) rows.push(current);
  return rows
    .map((cells) => cells.map((c) => c.replace(/\n/g, ' ').trim()).filter(Boolean))
    .filter((cells) => cells.length && !cells.every((c) => /^\s*$/.test(c)));
};

function parseWiki(wikitext) {
  const lines = String(wikitext || '').split(/\r?\n/);
  const sections = [];
  let section = { id: 'inicio', heading: 'Inicio', level: 2, blocks: [] };
  let paragraph = [];
  let i = 0;

  const flushParagraph = () => {
    const text = clean(paragraph.join(' '));
    if (text) section.blocks.push({ type: 'p', text });
    paragraph = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    const hm = line.match(headingRe);
    if (hm) {
      flushParagraph();
      const heading = clean(hm[2]).replace(/[.]{2,}$/, '');
      if (heading && !skipHeadings.test(heading)) {
        section = { id: slug(heading), heading, level: hm[1].length, blocks: [] };
        sections.push(section);
      }
      i++;
      continue;
    }

    if (/^\|?-?\|$/.test(line.trim())) { i++; continue; }

    const tabLabel = line.match(/^([^=|]{2,40})=$/);
    if (tabLabel && /^[\p{L}\p{N} áéíóúÁÉÍÓÚñÑ()/-]+$/u.test(tabLabel[1])) {
      flushParagraph();
      section.blocks.push({ type: 'note', text: tabLabel[1].trim() });
      i++;
      continue;
    }

    if (/^\{\|/.test(line)) {
      flushParagraph();
      const tableLines = [];
      let depth = 1;
      i++;
      while (i < lines.length) {
        if (/^\{\|/.test(lines[i])) depth++;
        if (/^\|\}/.test(lines[i])) {
          depth--;
          if (depth === 0) { i++; break; }
        }
        if (depth > 0) tableLines.push(lines[i]);
        i++;
      }
      const rows = tableRows(tableLines);
      if (rows.length) section.blocks.push({ type: 'table', rows });
      continue;
    }

    if (/^(\*+|#+)\s*/.test(line)) {
      flushParagraph();
      const items = [];
      while (i < lines.length && /^(\*+|#+)\s*/.test(lines[i])) {
        const m = lines[i].match(/^(\*+|#+)\s*(.*)$/);
        const text = clean(m[2]);
        if (text) items.push({ depth: m[1].length - 1, ordered: m[1][0] === '#', text });
        i++;
      }
      if (items.length) section.blocks.push({ type: 'list', items });
      continue;
    }

    if (/^[,;:]\s*/.test(line)) {
      flushParagraph();
      const items = [];
      while (i < lines.length && /^[,;:]\s*/.test(lines[i])) {
        const text = clean(lines[i].replace(/^[,;:]\s*/, ''));
        if (text) items.push({ depth: 0, ordered: false, text });
        i++;
      }
      if (items.length) section.blocks.push({ type: 'list', items });
      continue;
    }

    if (/^-{3,}\s*$/.test(line) || /^\s*$/.test(line)) {
      flushParagraph();
      i++;
      continue;
    }

    if (/Advertencia:/i.test(line) && /spoiler|color:red/i.test(lines.slice(Math.max(0, i - 1), i + 1).join(' '))) {
      flushParagraph();
      section.blocks.push({ type: 'note', text: clean(line) });
      i++;
      continue;
    }

    // El contenido de una celda suelta puede iniciar con "|" sin abrir tabla.
    const stripped = line.replace(/^[!|]\s*/, '');
    if (/^\[\[Imagen:|^\[\[Archivo:/i.test(stripped)) { i++; continue; }
    paragraph.push(stripped);
    i++;
  }
  flushParagraph();

  return sections.filter((s) => s.blocks.length || s.heading !== 'Inicio');
}

// ---------------- Capítulos en orden argumental ----------------
const chapterDefs = [
  {
    id: 'reloaded',
    region: 'Antes de empezar',
    part: 'Preparación',
    title: 'Pokémon Reloaded: jugabilidad y controles',
    kind: 'inicio',
    pages: ['Pokémon Reloaded'],
    leadHeading: 'Sobre el juego',
  },
  { id: 'antes', region: 'Antes de empezar', part: 'Preparación', title: 'Consejos y creación de personaje', kind: 'inicio', pages: ['Guía de Pokémon Reloaded'] },
  { id: 'pedrusco', region: 'Star', part: 'Medallas de Star', title: 'Medalla Pedrusco', kind: 'medalla', pages: ['Guía de Pokémon Reloaded Medalla Pedrusco'] },
  { id: 'aguacero', region: 'Star', part: 'Medallas de Star', title: 'Medalla Aguacero', kind: 'medalla', pages: ['Guía de Pokémon Reloaded Medalla Aguacero'] },
  { id: 'misterio', region: 'Star', part: 'Medallas de Star', title: 'Medalla Misterio', kind: 'medalla', pages: ['Guía de Pokémon Reloaded Medalla Misterio'] },
  { id: 'iceberg', region: 'Star', part: 'Medallas de Star', title: 'Medalla Iceberg', kind: 'medalla', pages: ['Guía de Pokémon Reloaded Medalla Iceberg'] },
  { id: 'secuoya', region: 'Star', part: 'Medallas de Star', title: 'Medalla Secuoya', kind: 'medalla', pages: ['Guía de Pokémon Reloaded Medalla Secuoya'] },
  { id: 'llama', region: 'Star', part: 'Medallas de Star', title: 'Medalla Llama', kind: 'medalla', pages: ['Guía de Pokémon Reloaded Medalla Llama'] },
  { id: 'fabula', region: 'Star', part: 'Medallas de Star', title: 'Medalla Fábula', kind: 'medalla', pages: ['Guía de Pokémon Reloaded Medalla Fábula'] },
  { id: 'psiquica', region: 'Star', part: 'Medallas de Star', title: 'Medalla Psíquica', kind: 'medalla', pages: ['Guía de Pokémon Reloaded Medalla Psíquica'] },
  { id: 'liga-star', region: 'Star', part: 'Liga Star', title: 'Liga Star', kind: 'liga', pages: ['Guía de Pokémon Reloaded Liga Star'] },
  { id: 'kanto', region: 'Kanto', part: 'Tras la Liga Star', title: 'Kanto: islas y medallas', kind: 'liga', pages: ['Pokémon Reloaded: Después de la Liga Star'] },
  { id: 'johto', region: 'Johto', part: 'Tras la Liga Kanto', title: 'Johto: guardianes y alto mando', kind: 'liga', pages: ['Pokémon Reloaded: Después de la Liga Kanto'] },
  { id: 'hoenn', region: 'Hoenn', part: 'Tras la Liga Johto', title: 'Hoenn: Team Magma y Team Aqua', kind: 'liga', pages: ['Pokémon Reloaded: Después de la Liga Johto'] },
  { id: 'sinnoh', region: 'Sinnoh', part: 'Tras la Liga Hoenn', title: 'Sinnoh: Helio y el Trío del lago', kind: 'liga', pages: ['Pokémon Reloaded: Después de la Liga Hoenn'] },
  { id: 'teselia', region: 'Teselia', part: 'Tras la Liga Sinnoh', title: 'Teselia: Frente de Batalla y N', kind: 'liga', pages: ['Pokémon Reloaded: Después de la Liga Sinnoh'] },
  { id: 'kalos', region: 'Kalos', part: 'Tras la Liga Teselia', title: 'Kalos: Islas Cometa y Team Flare', kind: 'liga', pages: ['Pokémon Reloaded: Después de la Liga Teselia'] },
  { id: 'alola', region: 'Alola', part: 'Tras la Liga Kalos', title: 'Alola: guardianes y Necrozma', kind: 'liga', pages: ['Pokémon Reloaded: Después de la Liga Kalos'] },
  { id: 'final', region: 'Alola', part: 'Final de la Beta', title: 'Volcán Tormento y fin de la Beta', kind: 'final', pages: ['Pokémon Reloaded: Después de la Liga Alola'] },
  { id: 'islas-cometa', region: 'Islas Cometa', part: 'Misiones', title: 'Misiones de las Islas Cometa', kind: 'misiones', pages: ['Islas Cometa'] },
];

const chapters = chapterDefs.map((def, index) => ({
  ...def,
  order: index,
  sections: def.pages.flatMap((title) => {
    const text = raw[title] || '';
    return parseWiki(def.leadHeading ? `== ${def.leadHeading} ==\n${text}` : text);
  }),
}));

const regions = [...new Set(chapters.map((c) => c.region))];
const parts = [...new Set(chapters.map((c) => c.part))];

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({ regions, parts, chapters }));

const bytes = fs.statSync(OUT).size;
console.log(`[Reloadex] guía generada: ${OUT}`);
console.log({ chapters: chapters.length, sections: chapters.reduce((n, c) => n + c.sections.length, 0), bytes });
