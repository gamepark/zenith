/** @jsxImportSource @emotion/react */
import { css, Interpolation, Theme } from '@emotion/react'
import { Picture } from '@gamepark/react-game'
import { Faction } from '@gamepark/zenith/material/Faction'
import { Influence } from '@gamepark/zenith/material/Influence'
import { FC, ReactElement, ReactNode } from 'react'
import Credit from '../images/credit/Credit1.png'
import Animod from '../images/icons/animod.jpg'
import Humanoid from '../images/icons/humanoid.jpg'
import LeaderGold from '../images/icons/leader-gold.png'
import LeaderSilver from '../images/icons/leader-silver.png'
import Robot from '../images/icons/robot.jpg'
import Jupiter from '../images/planet/Jupiter.png'
import Mars from '../images/planet/Mars.png'
import Mercury from '../images/planet/Mercury.png'
import Terra from '../images/planet/Terra.png'
import Venus from '../images/planet/Venus.png'
import Zenithium from '../images/zenithium/Zenithium.png'

export const pictureCss = (jpg?: boolean) => css`
  height: 2em;
  position: relative;
  border-radius: ${jpg ? 1 : 0}em;
  box-shadow: ${jpg ? '0 0 0.1em black, 0 0 0.1em black;' : 'none'};
  margin-left: 0.2em;
  margin-right: 0.2em;
  picture,
  img {
    padding: 0;
    margin: 0;
    vertical-align: middle;
  }
`

export const headerCss = (jpg?: boolean) => css`
  height: 1em;
  width: ${jpg ? '1em' : 'auto'};
  border-radius: ${jpg ? '50%' : '0'};
  box-shadow: ${jpg ? '0 0 0.1em black' : 'none'};
  margin: 0 0.2em;

  img {
    height: 1em;
    width: ${jpg ? '1em' : 'auto'};
    border-radius: ${jpg ? '50%' : '0'};
    object-fit: cover;
    vertical-align: middle;
  }
`

export const getFactionIcon = (faction: Faction) => {
  switch (faction) {
    case Faction.Animod:
      return LogTransComponents.animod
    case Faction.Human:
      return LogTransComponents.humanoid
    case Faction.Robot:
      return LogTransComponents.robot
  }
}

export const getPlanetForLog = (influence: Influence) => {
  switch (influence) {
    case Influence.Mercury:
      return LogTransComponents.mercury
    case Influence.Venus:
      return LogTransComponents.venus
    case Influence.Terra:
      return LogTransComponents.terra
    case Influence.Jupiter:
      return LogTransComponents.jupiter
    case Influence.Mars:
      return LogTransComponents.mars
  }
}

export const getPlanetForHeader = (influence: Influence) => {
  switch (influence) {
    case Influence.Mercury:
      return HeaderTransComponents.mercury
    case Influence.Venus:
      return HeaderTransComponents.venus
    case Influence.Terra:
      return HeaderTransComponents.terra
    case Influence.Jupiter:
      return HeaderTransComponents.jupiter
    case Influence.Mars:
      return HeaderTransComponents.mars
  }
}

export const getFactionForHeader = (faction: Faction) => {
  switch (faction) {
    case Faction.Animod:
      return HeaderTransComponents.animod
    case Faction.Human:
      return HeaderTransComponents.humanoid
    case Faction.Robot:
      return HeaderTransComponents.robot
  }
}

export const getColorForInfluence = (influence?: Influence) => {
  if (!influence) return
  switch (influence) {
    case Influence.Mercury:
      return '#70658e'
    case Influence.Venus:
      return '#a55f16'
    case Influence.Terra:
      return '#08779c'
    case Influence.Mars:
      return '#CA555D'
    case Influence.Jupiter:
      return '#53A49B'
  }
}

type customCssFunc = (jpg?: boolean) => Interpolation<Theme>

const TransComponents = (customCss: customCssFunc) => ({
  animod: <Picture src={Animod} css={customCss(true)} />,
  humanoid: <Picture src={Humanoid} css={customCss(true)} />,
  robot: <Picture src={Robot} css={customCss(true)} />,
  mercury: <Picture src={Mercury} css={customCss()} />,
  venus: <Picture src={Venus} css={customCss()} />,
  terra: <Picture src={Terra} css={customCss()} />,
  mars: <Picture src={Mars} css={customCss()} />,
  jupiter: <Picture src={Jupiter} css={customCss()} />,
  credit: <Picture src={Credit} css={customCss()} />,
  zenithium: <Picture src={Zenithium} css={customCss()} />,
  leaderSilver: <Picture src={LeaderSilver} css={customCss()} />,
  leaderGold: <Picture src={LeaderGold} css={customCss()} />,
  bold: <strong />,
  italic: <i />,
  u: <u />
})

export const helpCss = (jpg?: boolean) => css`
  display: inline-block;
  height: 1.2em;
  width: ${jpg ? '1.2em' : 'auto'};
  border-radius: ${jpg ? '50%' : '0'};
  margin: 0 0.15em;
  vertical-align: middle;
  filter: drop-shadow(0 0.05em 0.1em rgba(0, 0, 0, 0.2));

  img {
    height: 1.2em;
    width: ${jpg ? '1.2em' : 'auto'};
    border-radius: ${jpg ? '50%' : '0'};
    object-fit: cover;
    vertical-align: middle;
  }
`

export const HeaderTransComponents: Record<string, ReactElement> = TransComponents(headerCss)
export const LogTransComponents: Record<string, ReactElement> = TransComponents(pictureCss)
const gainCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  color: #059669;
  font-weight: 600;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  padding: 0.1em 0.4em;
  border-radius: 0.3em;
  white-space: nowrap;

  picture,
  img {
    position: relative;
    top: -0.05em;
  }
`

const lossCss = css`
  display: inline-flex;
  align-items: center;
  gap: 0.15em;
  color: #dc2626;
  font-weight: 600;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  padding: 0.1em 0.4em;
  border-radius: 0.3em;
  white-space: nowrap;

  picture,
  img {
    position: relative;
    top: -0.05em;
  }
`

export const HelpTransComponents: Record<string, ReactElement> = {
  ...TransComponents(helpCss),
  human: <Picture src={Humanoid} css={helpCss(true)} />,
  gain: <span css={gainCss} />,
  loss: <span css={lossCss} />
}

const linkButtonCss = css`
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  font: inherit;

  &:hover {
    text-decoration: none;
  }
`

type LinkButtonProps = {
  onClick?: () => void
  children?: ReactNode
}

export const LinkButton: FC<LinkButtonProps> = ({ onClick, children }) => (
  <button css={linkButtonCss} onClick={onClick}>{children}</button>
)
