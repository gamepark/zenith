import { css } from '@emotion/react'
import { BottomBarNavigation, buttonCss, GameTheme } from '@gamepark/react-game'
import { CornerFoldButton } from './components/ZenithDialog'
import background from './images/background.jpg'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export const zenithTheme: DeepPartial<GameTheme> = {
  root: {
    fontFamily: 'Quicksand',
    background: {
      image: background,
      overlay: 'rgba(0, 0, 0, 0.7)'
    }
  },
  dialog: {
    backgroundColor: '#f5efe4',
    color: '#3e3020',
    container: css`
      border-radius: 0.75em;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23ddd5c5' fill-opacity='0.3'/%3E%3Crect x='0' y='0' width='1' height='1' fill='%23c8b8a0' fill-opacity='0.08'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23c8b8a0' fill-opacity='0.06'/%3E%3C/svg%3E");
      box-shadow:
        0 0 0 1px rgba(212, 135, 42, 0.1),
        0 0 20px rgba(212, 135, 42, 0.08),
        0 8px 30px rgba(0, 0, 0, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
      overflow: visible;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: calc(5em * var(--gp-scale, 1));
        height: calc(5em * var(--gp-scale, 1));
        background: linear-gradient(135deg, rgba(212, 135, 42, 0.06), transparent 60%);
        border-radius: 0.75em 0 0 0;
        pointer-events: none;
      }
    `,
    closeButton: CornerFoldButton,
    navigation: BottomBarNavigation,
    content: css`
      > h2 {
        color: #d4872a;
      }
    `
  },
  palette: {
    primary: '#d4872a',
    primaryHover: '#c07824',
    primaryActive: '#a8691f',
    primaryLight: 'rgba(212, 135, 42, 0.08)',
    primaryLighter: 'rgba(212, 135, 42, 0.04)',
    surface: '#f4ede2',
    onSurface: '#3e3020',
    onSurfaceFocus: 'rgba(212, 135, 42, 0.12)',
    onSurfaceActive: 'rgba(212, 135, 42, 0.2)',
    danger: '#b83030',
    dangerHover: '#fee2e2',
    dangerActive: '#fecaca',
    disabled: '#b5a890'
  },
  header: {
    bar: css`
      background: linear-gradient(90deg, #c07020, #e0a040);
      color: #fff;
      border-bottom: none;
      box-shadow: 0 4px 16px rgba(212, 135, 42, 0.25), inset 0 1px 0 rgba(255, 220, 150, 0.25);
    `,
    buttons: css`
      ${buttonCss('#ffffff', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.3)')};
      padding: 0 0.5em;
      font-weight: bold;
    `
  },
  menu: {
    mainButton: css`
      background: #d4872a !important;
      box-shadow: 0 2px 8px rgba(212, 135, 42, 0.35);
    `,
    panel: css`
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    `
  },
  journal: {
    tab: css`
      font-family: 'Quicksand', sans-serif;
    `,
    tabSelected: css`
      color: white;
    `,
    historyEntry: css`
      border-radius: 0.5em;
      border-left: 3px solid #d4872a;
      background: rgba(212, 135, 42, 0.06);
      color: #3e3020;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
    `,
    chatBar: css`
      background: linear-gradient(90deg, #c07020, #e0a040);
    `
  },
  result: {
    border: '#d4872a',
    icon: '#d4872a',
    container: css`
      border-radius: 0.75em;
    `
  },
  tutorial: {
    container: css`
      border-radius: 0.75em;
      box-shadow:
        0 0 20px rgba(212, 135, 42, 0.08),
        0 4px 20px rgba(0, 0, 0, 0.12),
        inset 0 1px 0 rgba(255, 255, 255, 0.5);
    `
  },
  playerPanel: {
    activeRingColors: ['#d4872a', '#f0c878']
  },
  timeStats: {
    thinkBackground: 'rgba(212, 135, 42, 0.08)',
    waitBackground: 'rgba(200, 200, 210, 0.1)'
  }
}
