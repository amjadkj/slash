"use client";

import React from 'react';
import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react';

export default function LiquidMetalBg() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      <LiquidMetal
        {...liquidMetalPresets[2]}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}
