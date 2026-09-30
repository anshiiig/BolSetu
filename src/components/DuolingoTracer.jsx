import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Volume2, Check, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';
import { UI_TRANSLATIONS } from '../data/uiTranslations';

// =========================================================================
// AUTHENTIC DEVANAGARI & INDIC STROKE DECOMPOSITIONS
// Coordinates mapped cleanly inside 300x300 SVG canvas (center ~150, 150)
// =========================================================================
export const CHARACTER_STROKES = {
  // Duolingo Korean sample
  'ㅏ': [
    { id: 's1', d: 'M 150 65 L 150 235', arrow: '↓' },
    { id: 's2', d: 'M 150 150 L 210 150', arrow: '→' },
  ],

  // --- DEVANAGARI VOWELS (स्वर) ---
  'अ': [
    { id: 's1', d: 'M 115 100 Q 155 95 155 125 Q 155 150 125 150', arrow: '↷' },
    { id: 's2', d: 'M 125 150 Q 165 150 165 185 Q 165 215 115 210', arrow: '↷' },
    { id: 's3', d: 'M 145 160 L 195 160', arrow: '→' },
    { id: 's4', d: 'M 195 95 L 195 225', arrow: '↓' },
    { id: 's5', d: 'M 175 95 L 225 95', arrow: '→' },
  ],
  'आ': [
    { id: 's1', d: 'M 105 100 Q 145 95 145 125 Q 145 150 115 150', arrow: '↷' },
    { id: 's2', d: 'M 115 150 Q 155 150 155 185 Q 155 215 105 210', arrow: '↷' },
    { id: 's3', d: 'M 135 160 L 180 160', arrow: '→' },
    { id: 's4', d: 'M 180 95 L 180 225', arrow: '↓' },
    { id: 's5', d: 'M 215 95 L 215 225', arrow: '↓' },
    { id: 's6', d: 'M 165 95 L 235 95', arrow: '→' },
  ],
  // Devanagari 'इ' (Authentic Devanagari: curves LEFT first, then RIGHT with loop and tail)
  'इ': [
    { id: 's1', d: 'M 155 90 L 155 112', arrow: '↓' },
    { id: 's2', d: 'M 155 112 C 120 112 120 152 155 152', arrow: '↺' },
    { id: 's3', d: 'M 155 152 C 190 152 190 196 155 196 C 138 196 135 180 155 180 L 130 230', arrow: '↷' },
    { id: 's4', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  // Devanagari 'ई' (Authentic Devanagari S-body + upper hook matra)
  'ई': [
    { id: 's1', d: 'M 155 90 L 155 112', arrow: '↓' },
    { id: 's2', d: 'M 155 112 C 120 112 120 152 155 152', arrow: '↺' },
    { id: 's3', d: 'M 155 152 C 190 152 190 196 155 196 C 138 196 135 180 155 180 L 130 230', arrow: '↷' },
    { id: 's4', d: 'M 105 90 L 205 90', arrow: '→' },
    { id: 's5', d: 'M 155 90 C 160 52 192 52 195 75', arrow: '↗' },
  ],
  'उ': [
    { id: 's1', d: 'M 115 105 Q 165 100 165 135 Q 165 160 125 160', arrow: '↷' },
    { id: 's2', d: 'M 125 160 Q 175 160 175 195 Q 175 225 115 220', arrow: '↷' },
    { id: 's3', d: 'M 95 95 L 190 95', arrow: '→' },
  ],
  'ऊ': [
    { id: 's1', d: 'M 115 105 Q 165 100 165 135 Q 165 160 125 160', arrow: '↷' },
    { id: 's2', d: 'M 125 160 Q 175 160 175 195 Q 175 225 115 220', arrow: '↷' },
    { id: 's3', d: 'M 145 165 C 180 165 190 195 190 220', arrow: '↷' },
    { id: 's4', d: 'M 95 95 L 190 95', arrow: '→' },
  ],
  'ए': [
    { id: 's1', d: 'M 130 90 L 130 155 L 170 215', arrow: '↓' },
    { id: 's2', d: 'M 175 90 L 175 155 L 155 165', arrow: '↓' },
    { id: 's3', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  'ऐ': [
    { id: 's1', d: 'M 130 90 L 130 155 L 170 215', arrow: '↓' },
    { id: 's2', d: 'M 175 90 L 175 155 L 155 165', arrow: '↓' },
    { id: 's3', d: 'M 170 90 L 140 60', arrow: '↖' },
    { id: 's4', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  'ओ': [
    { id: 's1', d: 'M 105 100 Q 145 95 145 125 Q 145 150 115 150', arrow: '↷' },
    { id: 's2', d: 'M 115 150 Q 155 150 155 185 Q 155 215 105 210', arrow: '↷' },
    { id: 's3', d: 'M 135 160 L 180 160', arrow: '→' },
    { id: 's4', d: 'M 180 95 L 180 225', arrow: '↓' },
    { id: 's5', d: 'M 215 95 L 215 225', arrow: '↓' },
    { id: 's6', d: 'M 215 95 L 180 60', arrow: '↖' },
    { id: 's7', d: 'M 165 95 L 235 95', arrow: '→' },
  ],
  'औ': [
    { id: 's1', d: 'M 105 100 Q 145 95 145 125 Q 145 150 115 150', arrow: '↷' },
    { id: 's2', d: 'M 115 150 Q 155 150 155 185 Q 155 215 105 210', arrow: '↷' },
    { id: 's3', d: 'M 135 160 L 180 160', arrow: '→' },
    { id: 's4', d: 'M 180 95 L 180 225', arrow: '↓' },
    { id: 's5', d: 'M 215 95 L 215 225', arrow: '↓' },
    { id: 's6', d: 'M 215 95 L 180 60', arrow: '↖' },
    { id: 's7', d: 'M 215 95 L 195 55', arrow: '↖' },
    { id: 's8', d: 'M 165 95 L 235 95', arrow: '→' },
  ],
  'अं': [
    { id: 's1', d: 'M 115 100 Q 155 95 155 125 Q 155 150 125 150', arrow: '↷' },
    { id: 's2', d: 'M 125 150 Q 165 150 165 185 Q 165 215 115 210', arrow: '↷' },
    { id: 's3', d: 'M 145 160 L 195 160', arrow: '→' },
    { id: 's4', d: 'M 195 95 L 195 225', arrow: '↓' },
    { id: 's5', d: 'M 175 95 L 225 95', arrow: '→' },
    { id: 's6', d: 'M 195 72 L 195 78', arrow: '•' },
  ],
  'अः': [
    { id: 's1', d: 'M 115 100 Q 155 95 155 125 Q 155 150 125 150', arrow: '↷' },
    { id: 's2', d: 'M 125 150 Q 165 150 165 185 Q 165 215 115 210', arrow: '↷' },
    { id: 's3', d: 'M 145 160 L 195 160', arrow: '→' },
    { id: 's4', d: 'M 195 95 L 195 225', arrow: '↓' },
    { id: 's5', d: 'M 175 95 L 225 95', arrow: '→' },
    { id: 's6', d: 'M 225 138 L 225 144', arrow: '•' },
    { id: 's7', d: 'M 225 178 L 225 184', arrow: '•' },
  ],

  // --- DEVANAGARI CONSONANTS (व्यंजन) ---
  'क': [
    { id: 's1', d: 'M 90 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 155 90 L 155 230', arrow: '↓' },
    { id: 's3', d: 'M 155 135 C 105 135 105 185 155 185', arrow: '↺' },
    { id: 's4', d: 'M 155 140 C 200 140 215 170 215 210', arrow: '↷' },
  ],
  'ख': [
    { id: 's1', d: 'M 115 90 C 145 90 145 130 115 150 L 145 200 C 160 200 190 200 190 180', arrow: '↷' },
    { id: 's2', d: 'M 190 90 L 190 230', arrow: '↓' },
    { id: 's3', d: 'M 190 160 C 160 160 160 190 190 190', arrow: '↺' },
    { id: 's4', d: 'M 95 90 L 215 90', arrow: '→' },
  ],
  // Devanagari 'ग' (Corrected authentic 3-stroke decomposition)
  'ग': [
    { id: 's1', d: 'M 130 90 L 130 175 C 130 195 105 195 105 175', arrow: '↓' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 90 90 L 225 90', arrow: '→' },
  ],
  'घ': [
    { id: 's1', d: 'M 120 115 C 155 115 155 150 130 155 C 165 155 165 205 130 205 L 185 205', arrow: '↷' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 95 90 L 220 90', arrow: '→' },
  ],
  'च': [
    { id: 's1', d: 'M 115 150 L 150 150 C 120 190 150 205 185 185', arrow: '→' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 95 90 L 220 90', arrow: '→' },
  ],
  'छ': [
    { id: 's1', d: 'M 120 115 C 160 115 160 155 125 160 C 170 160 170 215 130 215 C 120 215 120 195 135 195', arrow: '↷' },
    { id: 's2', d: 'M 135 195 L 135 110', arrow: '↑' },
    { id: 's3', d: 'M 105 90 L 175 90', arrow: '→' },
  ],
  'ज': [
    { id: 's1', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's2', d: 'M 140 155 L 185 155', arrow: '→' },
    { id: 's3', d: 'M 140 155 C 115 155 105 185 125 210 C 145 225 165 200 165 185', arrow: '↺' },
    { id: 's4', d: 'M 100 90 L 220 90', arrow: '→' },
  ],
  'झ': [
    { id: 's1', d: 'M 145 90 L 145 112', arrow: '↓' },
    { id: 's2', d: 'M 145 112 C 115 112 115 145 145 150', arrow: '↺' },
    { id: 's3', d: 'M 145 150 C 175 150 175 190 145 190 C 130 190 128 178 145 178 L 125 225', arrow: '↷' },
    { id: 's4', d: 'M 145 150 L 185 150', arrow: '→' },
    { id: 's5', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's6', d: 'M 90 90 L 225 90', arrow: '→' },
  ],
  'ट': [
    { id: 's1', d: 'M 155 90 L 155 120', arrow: '↓' },
    { id: 's2', d: 'M 155 120 C 110 130 110 215 155 215 C 185 215 195 195 195 185', arrow: '↷' },
    { id: 's3', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  'ठ': [
    { id: 's1', d: 'M 155 90 L 155 120', arrow: '↓' },
    { id: 's2', d: 'M 155 120 C 115 120 115 215 155 215 C 195 215 195 120 155 120', arrow: '↺' },
    { id: 's3', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  'ड': [
    { id: 's1', d: 'M 155 90 L 155 115', arrow: '↓' },
    { id: 's2', d: 'M 155 115 C 120 115 120 155 155 155 C 190 155 190 205 155 210', arrow: '↷' },
    { id: 's3', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  'ढ': [
    { id: 's1', d: 'M 155 90 L 155 120', arrow: '↓' },
    { id: 's2', d: 'M 155 120 C 110 130 110 215 155 215 C 185 215 195 195 175 185 C 160 185 160 200 175 200', arrow: '↷' },
    { id: 's3', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  'ण': [
    { id: 's1', d: 'M 125 90 L 125 180 C 125 205 165 205 165 180 L 165 90', arrow: '↓' },
    { id: 's2', d: 'M 195 90 L 195 230', arrow: '↓' },
    { id: 's3', d: 'M 95 90 L 225 90', arrow: '→' },
  ],
  'त': [
    { id: 's1', d: 'M 95 90 L 220 90', arrow: '→' },
    { id: 's2', d: 'M 180 90 L 180 230', arrow: '↓' },
    { id: 's3', d: 'M 180 155 L 135 155 C 120 155 120 190 120 230', arrow: '←' },
  ],
  'थ': [
    { id: 's1', d: 'M 120 125 C 110 115 135 95 145 110 C 150 120 135 145 120 160 L 140 200 C 155 205 180 205 185 190', arrow: '↷' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 160 90 L 215 90', arrow: '→' },
  ],
  'द': [
    { id: 's1', d: 'M 155 90 L 155 115', arrow: '↓' },
    { id: 's2', d: 'M 155 115 C 110 125 110 200 155 200 C 175 200 180 185 165 185 L 140 230', arrow: '↷' },
    { id: 's3', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  'ध': [
    { id: 's1', d: 'M 120 115 C 105 105 130 95 135 110 C 155 115 155 150 130 155 C 165 155 165 205 130 205 L 185 205', arrow: '↷' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 160 90 L 220 90', arrow: '→' },
  ],
  'न': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 115 180 C 115 165 135 165 135 180 L 185 180', arrow: '→' },
    { id: 's3', d: 'M 185 90 L 185 230', arrow: '↓' },
  ],
  'प': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 130 90 L 130 170 C 130 195 185 195 185 170', arrow: '↓' },
    { id: 's3', d: 'M 185 90 L 185 230', arrow: '↓' },
  ],
  'फ': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 130 90 L 130 170 C 130 195 165 195 165 170', arrow: '↓' },
    { id: 's3', d: 'M 165 90 L 165 230', arrow: '↓' },
    { id: 's4', d: 'M 165 145 C 205 145 205 185 205 215', arrow: '↷' },
  ],
  'ब': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 185 160 C 135 160 135 205 185 205', arrow: '↺' },
    { id: 's4', d: 'M 150 170 L 175 195', arrow: '↘' },
  ],
  'भ': [
    { id: 's1', d: 'M 125 105 C 110 95 135 85 140 100 L 140 180 L 185 180', arrow: '↓' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 160 90 L 225 90', arrow: '→' },
  ],
  'म': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 130 90 L 130 180', arrow: '↓' },
    { id: 's3', d: 'M 130 180 L 190 180', arrow: '→' },
    { id: 's4', d: 'M 190 90 L 190 230', arrow: '↓' },
  ],
  'य': [
    { id: 's1', d: 'M 120 90 C 145 90 145 130 120 150 L 150 200 L 185 200', arrow: '↷' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 95 90 L 225 90', arrow: '→' },
  ],
  'र': [
    { id: 's1', d: 'M 110 90 L 205 90', arrow: '→' },
    { id: 's2', d: 'M 140 90 C 180 90 180 145 140 165', arrow: '↷' },
    { id: 's3', d: 'M 140 165 L 185 230', arrow: '↘' },
  ],
  'ल': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 115 205 C 115 170 145 170 145 190', arrow: '↷' },
    { id: 's3', d: 'M 145 190 C 145 155 175 155 185 170', arrow: '↷' },
    { id: 's4', d: 'M 185 90 L 185 230', arrow: '↓' },
  ],
  'व': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 185 160 C 135 160 135 205 185 205', arrow: '↺' },
  ],
  'श': [
    { id: 's1', d: 'M 125 110 C 110 95 135 85 145 100 C 155 115 140 140 120 160 L 155 225', arrow: '↷' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 95 90 L 225 90', arrow: '→' },
  ],
  'ष': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 130 90 L 130 170 C 130 195 185 195 185 170', arrow: '↓' },
    { id: 's3', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's4', d: 'M 135 125 L 180 170', arrow: '↘' },
  ],
  'स': [
    { id: 's1', d: 'M 90 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 125 90 C 160 90 160 145 125 160 L 155 225', arrow: '↷' },
    { id: 's3', d: 'M 135 160 L 185 160', arrow: '→' },
    { id: 's4', d: 'M 185 90 L 185 230', arrow: '↓' },
  ],
  'ह': [
    { id: 's1', d: 'M 155 90 L 155 115', arrow: '↓' },
    { id: 's2', d: 'M 155 115 C 120 115 120 152 155 152 L 135 155', arrow: '↺' },
    { id: 's3', d: 'M 140 155 C 185 155 185 210 135 215', arrow: '↷' },
    { id: 's4', d: 'M 105 90 L 205 90', arrow: '→' },
  ],
  'ळ': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 125 180 C 125 140 160 140 160 180 C 160 215 125 215 125 180', arrow: '↺' },
    { id: 's3', d: 'M 160 180 C 160 140 195 140 195 180 C 195 215 160 215 160 180', arrow: '↺' },
    { id: 's4', d: 'M 160 90 L 160 150', arrow: '↓' },
  ],
  'क्ष': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 185 160 L 140 160 C 110 160 110 120 140 120 C 165 120 165 170 125 190 L 160 230', arrow: '↺' },
  ],
  'ज्ञ': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 185 90 L 185 230', arrow: '↓' },
    { id: 's3', d: 'M 140 155 L 185 155', arrow: '→' },
    { id: 's4', d: 'M 140 155 C 110 155 110 190 140 190 C 160 190 160 180 140 180 L 120 225', arrow: '↺' },
  ],

  // --- TELUGU FOUNDATIONAL ALPHABET (తెలుగు) ---
  'అ': [
    { id: 's1', d: 'M 120 125 C 120 85 170 85 170 125 C 170 160 125 160 125 195 C 125 225 185 225 185 195', arrow: '↷' },
    { id: 's2', d: 'M 185 195 L 225 195', arrow: '→' },
  ],
  'ఆ': [
    { id: 's1', d: 'M 120 125 C 120 85 170 85 170 125 C 170 160 125 160 125 195 C 125 225 185 225 185 195', arrow: '↷' },
    { id: 's2', d: 'M 185 195 C 220 195 225 160 225 140', arrow: '↷' },
  ],
  'ఇ': [
    { id: 's1', d: 'M 115 130 C 115 85 185 85 185 130 C 185 175 115 175 115 220 L 195 220', arrow: '↷' },
  ],
  'ఈ': [
    { id: 's1', d: 'M 115 130 C 115 85 185 85 185 130 C 185 175 115 175 115 220 L 195 220', arrow: '↷' },
    { id: 's2', d: 'M 150 90 L 150 65', arrow: '↑' },
  ],
  'ఉ': [
    { id: 's1', d: 'M 115 110 C 185 110 185 160 145 160 C 185 160 185 210 115 210', arrow: '↷' },
    { id: 's2', d: 'M 140 160 L 195 160', arrow: '→' },
  ],
  'క': [
    { id: 's1', d: 'M 110 160 C 110 115 190 115 190 160 C 190 205 110 205 110 160', arrow: '↺' },
    { id: 's2', d: 'M 140 100 L 160 125 L 180 100', arrow: '✓' },
  ],
  'గ': [
    { id: 's1', d: 'M 115 160 C 115 115 185 115 185 160 C 185 205 115 205 115 160', arrow: '↺' },
    { id: 's2', d: 'M 140 105 L 180 105', arrow: '→' },
  ],

  // --- TAMIL FOUNDATIONAL ALPHABET (தமிழ்) ---
  'அ': [
    { id: 's1', d: 'M 110 120 C 110 95 145 95 145 120 C 145 150 110 160 110 185 C 110 215 175 215 175 185', arrow: '↷' },
    { id: 's2', d: 'M 150 185 L 210 185', arrow: '→' },
    { id: 's3', d: 'M 210 100 L 210 225', arrow: '↓' },
  ],
  'ஆ': [
    { id: 's1', d: 'M 110 120 C 110 95 145 95 145 120 C 145 150 110 160 110 185 C 110 215 175 215 175 185', arrow: '↷' },
    { id: 's2', d: 'M 150 185 L 210 185', arrow: '→' },
    { id: 's3', d: 'M 210 100 L 210 225 C 210 250 170 250 170 230', arrow: '↓' },
  ],
  'இ': [
    { id: 's1', d: 'M 115 125 C 115 90 185 90 185 130 C 185 170 125 170 125 205 L 195 205', arrow: '↷' },
  ],
  'ஈ': [
    { id: 's1', d: 'M 130 90 L 130 225', arrow: '↓' },
    { id: 's2', d: 'M 180 90 L 180 225', arrow: '↓' },
    { id: 's3', d: 'M 110 90 L 200 90', arrow: '→' },
    { id: 's4', d: 'M 155 140 L 155 145', arrow: '•' },
  ],
  'உ': [
    { id: 's1', d: 'M 115 110 C 185 110 185 170 120 170 L 195 170', arrow: '↷' },
  ],
  'க': [
    { id: 's1', d: 'M 110 110 L 200 110', arrow: '→' },
    { id: 's2', d: 'M 155 110 L 155 220', arrow: '↓' },
    { id: 's3', d: 'M 155 165 C 185 165 205 185 205 220', arrow: '↷' },
  ],

  // --- BENGALI FOUNDATIONAL ALPHABET (বাংলা) ---
  'অ': [
    { id: 's1', d: 'M 95 90 L 215 90', arrow: '→' },
    { id: 's2', d: 'M 120 120 C 120 100 145 100 145 120 C 145 145 115 155 125 185 C 135 215 175 200 175 175', arrow: '↷' },
    { id: 's3', d: 'M 155 180 L 185 180', arrow: '→' },
    { id: 's4', d: 'M 185 90 L 185 225', arrow: '↓' },
  ],
  'আ': [
    { id: 's1', d: 'M 95 90 L 225 90', arrow: '→' },
    { id: 's2', d: 'M 115 120 C 115 100 140 100 140 120 C 140 145 110 155 120 185 C 130 215 165 200 165 175', arrow: '↷' },
    { id: 's3', d: 'M 145 180 L 175 180', arrow: '→' },
    { id: 's4', d: 'M 175 90 L 175 225', arrow: '↓' },
    { id: 's5', d: 'M 205 90 L 205 225', arrow: '↓' },
  ],
  'ই': [
    { id: 's1', d: 'M 95 90 L 215 90', arrow: '→' },
    { id: 's2', d: 'M 130 115 C 115 100 145 95 155 110 C 165 130 135 155 125 180 L 155 220', arrow: '↷' },
    { id: 's3', d: 'M 155 90 C 158 52 192 52 195 75', arrow: '↗' },
  ],
  'ঈ': [
    { id: 's1', d: 'M 95 90 L 215 90', arrow: '→' },
    { id: 's2', d: 'M 130 115 C 115 100 145 95 155 110 C 165 130 135 155 125 180 L 155 220', arrow: '↷' },
    { id: 's3', d: 'M 155 90 C 158 52 192 52 195 75', arrow: '↗' },
    { id: 's4', d: 'M 155 180 L 195 220', arrow: '↘' },
  ],
  'উ': [
    { id: 's1', d: 'M 95 90 L 205 90', arrow: '→' },
    { id: 's2', d: 'M 115 110 C 175 110 175 155 135 155 C 175 155 175 205 115 205', arrow: '↷' },
  ],
  'ক': [
    { id: 's1', d: 'M 95 90 L 215 90', arrow: '→' },
    { id: 's2', d: 'M 155 90 L 120 185 L 190 185', arrow: '↓' },
    { id: 's3', d: 'M 155 90 L 155 225', arrow: '↓' },
  ],

  // --- ENGLISH FOUNDATIONAL LETTERS ---
  'A': [
    { id: 's1', d: 'M 150 75 L 105 225', arrow: '↙' },
    { id: 's2', d: 'M 150 75 L 195 225', arrow: '↘' },
    { id: 's3', d: 'M 120 175 L 180 175', arrow: '→' },
  ],
  'B': [
    { id: 's1', d: 'M 115 80 L 115 225', arrow: '↓' },
    { id: 's2', d: 'M 115 80 C 175 80 175 150 115 150', arrow: '↷' },
    { id: 's3', d: 'M 115 150 C 185 150 185 225 115 225', arrow: '↷' },
  ],
  'C': [
    { id: 's1', d: 'M 195 105 C 115 75 115 225 195 195', arrow: '↺' },
  ],
};

// Generates graceful curved fallback strokes for any character not explicitly listed
function getFallbackStrokesForChar(char) {
  return [
    { id: 's1', d: 'M 115 125 C 115 85 185 85 185 125 C 185 165 115 165 115 205 C 115 235 185 235 185 205', arrow: '↷' },
    { id: 's2', d: 'M 185 165 L 225 165', arrow: '→' },
  ];
}

// Offscreen SVG helper for instantaneous, synchronous, and 100% reliable stroke metrics
let offscreenPathEl = null;
function getStrokeMetrics(d, progress = 0) {
  if (typeof document === 'undefined') {
    return { totalLength: 160, point: { x: 150, y: 150 } };
  }
  if (!offscreenPathEl) {
    offscreenPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  }
  try {
    offscreenPathEl.setAttribute('d', d);
    const totalLength = offscreenPathEl.getTotalLength() || 160;
    const clamped = Math.min(Math.max(progress, 0), 1);
    const pt = offscreenPathEl.getPointAtLength(clamped * totalLength);
    return { totalLength, point: { x: pt.x, y: pt.y } };
  } catch {
    return { totalLength: 160, point: { x: 150, y: 150 } };
  }
}

export function DuolingoTracer({
  character = 'अ',
  phonetic = 'a',
  targetLang = 'mr',
  uiLang = 'en',
  onComplete,
  compact = false,
}) {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const strokes = useMemo(() => {
    return CHARACTER_STROKES[character] || getFallbackStrokesForChar(character);
  }, [character]);

  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0);
  const [strokeProgress, setStrokeProgress] = useState(0); // 0.0 to 1.0
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const svgRef = useRef(null);
  const activePathRef = useRef(null);
  const pathLengthsRef = useRef({});

  // Reset state when character changes
  useEffect(() => {
    setActiveStrokeIdx(0);
    setStrokeProgress(0);
    setIsCompleted(false);
    setIsDragging(false);
  }, [character]);

  // Measure path lengths on mount / stroke change
  useEffect(() => {
    if (activePathRef.current) {
      try {
        const total = activePathRef.current.getTotalLength();
        pathLengthsRef.current[activeStrokeIdx] = total;
      } catch (e) {
        pathLengthsRef.current[activeStrokeIdx] = 160;
      }
    }
  }, [activeStrokeIdx, character]);

  const currentStroke = strokes[activeStrokeIdx] || strokes[0];

  // Instantaneous synchronous metrics for current active stroke (never lags React renders)
  const { totalLength: activeTotalLength, point: knobPos } = useMemo(() => {
    if (!currentStroke) return { totalLength: 160, point: { x: 150, y: 150 } };
    return getStrokeMetrics(currentStroke.d, strokeProgress);
  }, [currentStroke, strokeProgress]);

  // Audio Playback
  const handlePlaySound = () => {
    sfx.playPop();
    audioEngine.speak(character, targetLang);
  };

  // Convert client pointer event to SVG coordinate
  const getSvgPoint = (e) => {
    const svg = svgRef.current;
    if (!svg) return { x: 150, y: 150 };
    const pt = svg.createSVGPoint();
    pt.x = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    pt.y = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const transformed = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: transformed.x, y: transformed.y };
  };

  // Find progression on stroke given cursor coordinate
  const computeProgress = (pointer) => {
    if (!currentStroke) return strokeProgress;
    if (typeof document === 'undefined') return strokeProgress;
    if (!offscreenPathEl) {
      offscreenPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    }
    offscreenPathEl.setAttribute('d', currentStroke.d);
    const total = activeTotalLength;
    let closestDist = Infinity;
    let bestFraction = strokeProgress;

    // Sample along path in small increments
    const samples = 40;
    for (let i = 0; i <= samples; i++) {
      const fraction = i / samples;
      if (fraction < strokeProgress - 0.1) continue;
      const pt = offscreenPathEl.getPointAtLength(fraction * total);
      const dx = pointer.x - pt.x;
      const dy = pointer.y - pt.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < closestDist) {
        closestDist = dist;
        bestFraction = fraction;
      }
    }

    if (closestDist < 65) {
      return Math.max(strokeProgress, bestFraction);
    }
    return strokeProgress;
  };

  // Pointer Handlers (Mouse & Touch)
  const handlePointerDown = (e) => {
    if (isCompleted) return;
    const pt = getSvgPoint(e);
    const dx = pt.x - knobPos.x;
    const dy = pt.y - knobPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Allow grab if clicked near the arrow knob or near beginning
    if (dist < 55 || strokeProgress < 0.15) {
      setIsDragging(true);
      sfx.playPop();
    }
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isCompleted) return;
    const pt = getSvgPoint(e);
    const nextProg = computeProgress(pt);
    setStrokeProgress(nextProg);

    // If reached 90% or more, snap to 100% and advance stroke
    if (nextProg >= 0.88) {
      setIsDragging(false);
      setStrokeProgress(1);
      sfx.playSuccess();

      // Check if more strokes remain
      if (activeStrokeIdx + 1 < strokes.length) {
        setTimeout(() => {
          setActiveStrokeIdx((prev) => prev + 1);
          setStrokeProgress(0);
        }, 180);
      } else {
        // Character fully written!
        setIsCompleted(true);
        audioEngine.speak(character, targetLang);
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}
        if (onComplete) onComplete();
      }
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalUp = () => setIsDragging(false);
    const handleGlobalMove = (e) => {
      if (isDragging) handlePointerMove(e);
    };

    window.addEventListener('pointerup', handleGlobalUp);
    window.addEventListener('pointermove', handleGlobalMove);
    window.addEventListener('touchcancel', handleGlobalUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalUp);
      window.removeEventListener('pointermove', handleGlobalMove);
      window.removeEventListener('touchcancel', handleGlobalUp);
    };
  }, [isDragging, strokeProgress, activeStrokeIdx]);

  const handleReset = () => {
    sfx.playPop();
    setActiveStrokeIdx(0);
    setStrokeProgress(0);
    setIsCompleted(false);
    setIsDragging(false);
  };

  return (
    <div
      className="duolingo-tracer-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: compact ? '12px' : '16px',
        width: '100%',
        maxWidth: compact ? '320px' : '380px',
        margin: '0 auto',
      }}
    >
      {/* Top Header Card: Native Soundboard speaker, character label & reset */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '8px 12px',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '2px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="duolingo-sound-btn"
            onClick={handlePlaySound}
            title="Listen to native character pronunciation"
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#1CB0F6',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 0 #0284C7',
              cursor: 'pointer',
              transition: 'transform 0.1s, box-shadow 0.1s',
            }}
          >
            <Volume2 size={22} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              {phonetic}
            </span>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1 }}>
              {character}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="icon-btn"
          onClick={handleReset}
          title="Reset tracing"
          style={{ width: '36px', height: '36px' }}
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* SVG Canvas Chalkboard Stage (High contrast #131F24 in both Light & Dark modes) */}
      <div
        className="duolingo-tracing-stage"
        style={{
          width: '100%',
          maxWidth: compact ? '280px' : '340px',
          aspectRatio: '1 / 1',
          background: '#131F24',
          borderRadius: '24px',
          border: '3px solid #233540',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          boxShadow: '0 10px 25px rgba(0,0,0,0.35), inset 0 2px 8px rgba(0,0,0,0.5)',
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 300 300"
          style={{ width: '100%', height: '100%', overflow: 'visible', cursor: isCompleted ? 'default' : 'pointer' }}
          onPointerDown={handlePointerDown}
        >
          {/* Faint Center Crosshairs (Horizontal & Vertical) */}
          <line
            x1="30"
            y1="150"
            x2="270"
            y2="150"
            stroke="#233540"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />
          <line
            x1="150"
            y1="30"
            x2="150"
            y2="270"
            stroke="#233540"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.8"
          />

          {/* Render All Strokes */}
          {strokes.map((stroke, idx) => {
            const isFinished = idx < activeStrokeIdx || isCompleted;
            const isActive = idx === activeStrokeIdx && !isCompleted;

            return (
              <g key={stroke.id}>
                {/* 1. Track Base (High Contrast Chalk Track) */}
                <path
                  d={stroke.d}
                  stroke={isFinished ? '#58CC02' : '#2A3C4D'}
                  strokeWidth="24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  style={{
                    transition: isFinished ? 'stroke 0.2s' : 'none',
                    filter: isFinished ? 'drop-shadow(0 0 6px rgba(88,204,2,0.4))' : 'none',
                  }}
                />

                {/* 2. Active Stroke Fill (Crisp Solid White Chalk) */}
                {isActive && (
                  <path
                    ref={activePathRef}
                    d={stroke.d}
                    stroke="#FFFFFF"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    strokeDasharray={activeTotalLength}
                    strokeDashoffset={activeTotalLength * (1 - strokeProgress)}
                  />
                )}

                {/* 3. Cyan Dashed Guide Line along active stroke */}
                {isActive && (
                  <path
                    d={stroke.d}
                    stroke="#38BDF8"
                    strokeWidth="3.5"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.9"
                  />
                )}
              </g>
            );
          })}

          {/* Active Stroke Slidable Arrow Knob */}
          {!isCompleted && currentStroke && (
            <g
              transform={`translate(${knobPos.x}, ${knobPos.y})`}
              style={{
                cursor: 'grab',
                filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.45))',
                transition: isDragging ? 'none' : 'transform 0.15s ease',
              }}
            >
              {/* Outer Glow Ring */}
              <circle r="22" fill="none" stroke="#38BDF8" strokeWidth="3" opacity="0.6" />
              {/* Knob Circle */}
              <circle r="17" fill="#1CB0F6" />
              {/* Directional Arrow Character */}
              <text
                x="0"
                y="5"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="16"
                fontWeight="900"
                fontFamily="sans-serif"
                pointerEvents="none"
              >
                {currentStroke.arrow || '→'}
              </text>
            </g>
          )}

          {/* Completion Celebration Badge */}
          {isCompleted && (
            <g transform="translate(150, 150)" style={{ animation: 'gentle-bounce 1s infinite' }}>
              <circle r="34" fill="#58CC02" stroke="#FFFFFF" strokeWidth="3" filter="drop-shadow(0 4px 10px rgba(88,204,2,0.6))" />
              <text x="0" y="8" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="900">
                ✓
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Progress Footer: Stroke Steps & Done Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 4px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {strokes.map((_, i) => (
            <div
              key={i}
              style={{
                width: '28px',
                height: '7px',
                borderRadius: '4px',
                background:
                  i < activeStrokeIdx || isCompleted
                    ? '#58CC02'
                    : i === activeStrokeIdx
                    ? '#38BDF8'
                    : 'var(--border-subtle)',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>

        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: isCompleted ? '#16A34A' : 'var(--text-muted)' }}>
          {isCompleted
            ? 'Completed!'
            : `Stroke ${Math.min(activeStrokeIdx + 1, strokes.length)} of ${strokes.length}`}
        </span>
      </div>
    </div>
  );
}
