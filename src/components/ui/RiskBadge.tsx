// =============================================================================
// Athlete Risk Intelligence Platform
// RiskBadge Component — Glowing indicator for Low / Watch / High risk
// =============================================================================

import React from 'react';
import { RiskLevel } from '../../types';
import { AlertTriangle, CheckCircle2, Flame } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function RiskBadge({
  level,
  size = 'md',
  showIcon = true,
  className = '',
}: RiskBadgeProps) {
  const normLevel = level.toLowerCase() as RiskLevel;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold gap-1',
    md: 'px-3 py-1 text-sm font-semibold gap-1.5',
    lg: 'px-4 py-1.5 text-base font-bold gap-2',
  }[size];

  const iconSizes = {
    sm: 13,
    md: 16,
    lg: 19,
  }[size];

  const styleConfig = {
    low: {
      label: 'LOW RISK',
      bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      icon: <CheckCircle2 size={iconSizes} className="text-emerald-400" />,
    },
    watch: {
      label: 'WATCH RISK',
      bg: 'bg-amber-950/70 text-amber-300 border-amber-600/60',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.35)] animate-pulse',
      icon: <AlertTriangle size={iconSizes} className="text-amber-400" />,
    },
    high: {
      label: 'HIGH RISK',
      bg: 'bg-rose-950/80 text-rose-300 border-rose-500/70',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.45)] animate-pulse',
      icon: <Flame size={iconSizes} className="text-rose-400" />,
    },
  }[normLevel] || {
    label: 'LOW RISK',
    bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-700/50',
    glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    icon: <CheckCircle2 size={iconSizes} className="text-emerald-400" />,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all duration-300 select-none ${styleConfig.bg} ${styleConfig.glow} ${sizeClasses} ${className}`}
    >
      {showIcon && styleConfig.icon}
      <span>{styleConfig.label}</span>
    </span>
  );
}
